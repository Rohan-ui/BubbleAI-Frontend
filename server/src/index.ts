import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import prisma from './lib/prisma';
import authRoutes from './routes/auth.routes';
import scriptRoutes from './routes/script.routes';
import aiRoutes from './routes/ai.routes';
import { initializeCollaborationSocket } from './sockets/collaboration.socket';

const app = express();
const httpServer = createServer(app);
const PORT = parseInt(process.env.PORT || '5000', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ============================================================
// ROUTES
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/scripts', scriptRoutes);
app.use('/api', aiRoutes);  // AI routes are mounted directly on /api (generate, format, director-strategy)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'BubbleAI Backend is running.', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found.' });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
  });
});

// ============================================================
// SOCKET.IO
// ============================================================

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
});

initializeCollaborationSocket(io);

// ============================================================
// START SERVER
// ============================================================

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('[Database] Connected to PostgreSQL successfully.');

    httpServer.listen(PORT, () => {
      console.log(`\n========================================`);
      console.log(`  BubbleAI Backend Server`);
      console.log(`  Port: ${PORT}`);
      console.log(`  API:  http://localhost:${PORT}/api`);
      console.log(`  CORS: ${FRONTEND_URL}`);
      console.log(`========================================\n`);
    });
  } catch (error) {
    console.error('[Fatal] Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Shutdown] SIGTERM received. Closing connections...');
  await prisma.$disconnect();
  httpServer.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[Shutdown] SIGINT received. Closing connections...');
  await prisma.$disconnect();
  httpServer.close();
  process.exit(0);
});

startServer();
