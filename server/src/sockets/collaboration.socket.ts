import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
  userAvatar?: string;
}

const activeUsers = new Map<string, Map<string, { userId: string; name: string; avatar: string | null; cursor?: { pageIndex: number; position: number } }>>();

export function initializeCollaborationSocket(io: SocketIOServer): void {
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) return next(new Error('Authentication required.'));

    try {
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as { userId: string; email: string };
      socket.userId = decoded.userId;
      socket.userName = (socket.handshake.auth.userName as string) || 'Anonymous';
      socket.userAvatar = (socket.handshake.auth.userAvatar as string) || null;
      next();
    } catch {
      return next(new Error('Invalid or expired token.'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`[Socket.IO] User connected: ${socket.userId}`);

    socket.on('join-script', (scriptId: string) => {
      if (!scriptId) return;
      socket.join(`script:${scriptId}`);
      if (!activeUsers.has(scriptId)) activeUsers.set(scriptId, new Map());
      const roomUsers = activeUsers.get(scriptId)!;
      roomUsers.set(socket.userId!, { userId: socket.userId!, name: socket.userName || 'Anonymous', avatar: socket.userAvatar || null });
      socket.to(`script:${scriptId}`).emit('user-joined', { userId: socket.userId, name: socket.userName, avatar: socket.userAvatar });
      socket.emit('active-users', Array.from(roomUsers.values()));
    });

    socket.on('leave-script', (scriptId: string) => handleLeave(socket, scriptId));

    socket.on('page-update', (data: { scriptId: string; pageIndex: number; content: string; timestamp: number }) => {
      if (!data.scriptId) return;
      socket.to(`script:${data.scriptId}`).emit('page-update', { ...data, userId: socket.userId, userName: socket.userName });
    });

    socket.on('cursor-position', (data: { scriptId: string; pageIndex: number; position: number }) => {
      if (!data.scriptId) return;
      socket.to(`script:${data.scriptId}`).emit('cursor-position', { ...data, userId: socket.userId, userName: socket.userName });
    });

    socket.on('comment-added', (data: { scriptId: string; comment: any }) => {
      if (!data.scriptId) return;
      socket.to(`script:${data.scriptId}`).emit('comment-added', data);
    });

    socket.on('version-created', (data: { scriptId: string; version: any }) => {
      if (!data.scriptId) return;
      socket.to(`script:${data.scriptId}`).emit('version-created', data);
    });

    socket.on('disconnect', () => {
      activeUsers.forEach((_roomUsers, scriptId) => {
        if (_roomUsers.has(socket.userId!)) handleLeave(socket, scriptId);
      });
    });
  });
}

function handleLeave(socket: AuthenticatedSocket, scriptId: string): void {
  socket.leave(`script:${scriptId}`);
  const roomUsers = activeUsers.get(scriptId);
  if (roomUsers) {
    roomUsers.delete(socket.userId!);
    if (roomUsers.size === 0) activeUsers.delete(scriptId);
    socket.to(`script:${scriptId}`).emit('user-left', { userId: socket.userId, name: socket.userName });
  }
}
