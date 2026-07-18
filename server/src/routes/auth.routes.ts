import { Router, Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  validateRefreshToken,
  generateAccessToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  generateRefreshToken,
} from '../services/auth.service';
import { authMiddleware } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        error: 'Email, password, and name are required.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
      return;
    }

    const user = await registerUser(email.toLowerCase().trim(), password, name.trim());

    res.status(201).json({
      success: true,
      data: { user },
      message: 'Account created successfully.',
    });
  } catch (error: any) {
    const statusCode = error.message.includes('already exists') ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Registration failed.',
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password, returns access + refresh tokens
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
      return;
    }

    const result = await loginUser(email.toLowerCase().trim(), password);

    res.json({
      success: true,
      data: result,
      message: 'Login successful.',
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message || 'Login failed.',
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh an expired access token using a valid refresh token.
 * Implements token rotation (old refresh token is invalidated, new one issued).
 */
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: 'Refresh token is required.',
      });
      return;
    }

    const result = await validateRefreshToken(refreshToken);
    if (!result) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token.',
      });
      return;
    }

    // Get user details for the new access token
    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found.',
      });
      return;
    }

    // Generate new token pair
    const newAccessToken = generateAccessToken(user.id, user.email);
    const newRefreshToken = await generateRefreshToken(user.id);

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      message: 'Token refreshed successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Token refresh failed.',
    });
  }
});

/**
 * POST /api/auth/logout
 * Invalidate the refresh token (single device logout)
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Logout failed.',
    });
  }
});

/**
 * POST /api/auth/logout-all
 * Revoke all refresh tokens for the user (logout from all devices)
 */
router.post('/logout-all', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await revokeAllRefreshTokens(req.user!.userId);

    res.json({
      success: true,
      message: 'Logged out from all devices.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Logout failed.',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 */
router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await getUserProfile(req.user!.userId);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message || 'Profile not found.',
    });
  }
});

/**
 * PUT /api/auth/update-profile
 * Update current user's profile information
 */
router.put('/update-profile', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, avatar } = req.body;

    const updatedUser = await updateUserProfile(req.user!.userId, {
      ...(name && { name: name.trim() }),
      ...(role && { role: role.trim() }),
      ...(avatar !== undefined && { avatar }),
    });

    res.json({
      success: true,
      data: { user: updatedUser },
      message: 'Profile updated successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Profile update failed.',
    });
  }
});

export default router;
