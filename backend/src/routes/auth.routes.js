import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
    login,
    me,
    logout,
} from '../controllers/auth.controller.js';
import { requireAdminSession } from '../middlewares/requireAdminSession.middleware.js';

const router = Router();

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again later.',
    },
});

router.post('/login', loginRateLimiter, login);
router.get('/me', requireAdminSession, me);
router.post('/logout', requireAdminSession, logout);

export default router;
