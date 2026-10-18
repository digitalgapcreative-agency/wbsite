import { Router } from 'express';
import { getStats } from '../controllers/stats.controller.js';
import { requireAdminSession } from '../middlewares/requireAdminSession.middleware.js';
const router = Router();

// GET /api/admin/stats — dashboard overview (session or API key auth required)
router.get('/stats', requireAdminSession, getStats);

export default router;
