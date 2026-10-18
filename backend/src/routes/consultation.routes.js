import { Router } from 'express';
import {
    requestConsultation,
    getConsultations,
    updateConsultation,
} from '../controllers/consultation.controller.js';
import { requireAdminSession } from '../middlewares/requireAdminSession.middleware.js';
import { consultationRateLimiter } from '../middlewares/rateLimiter.middleware.js';
import { honeypot } from '../middlewares/honeypot.middleware.js';

const router = Router();

// POST /api/consultation — public consultation form
router.post(
    '/',
    consultationRateLimiter,
    honeypot('website'),
    requestConsultation
);

// PATCH /api/consultation/:id — update CRM fields (admin only)
router.patch('/:id', requireAdminSession, updateConsultation);

// GET /api/consultation — admin only
router.get('/', requireAdminSession, getConsultations);

export default router;
