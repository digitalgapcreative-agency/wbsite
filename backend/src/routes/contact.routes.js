import { Router } from 'express';
import {
    submitContactForm,
    getContacts,
    updateContact,
} from '../controllers/contact.controller.js';
import { requireAdminSession } from '../middlewares/requireAdminSession.middleware.js';
import { contactRateLimiter } from '../middlewares/rateLimiter.middleware.js';
import { honeypot } from '../middlewares/honeypot.middleware.js';

const router = Router();

// POST /api/contact — public contact form
router.post(
    '/',
    contactRateLimiter,
    honeypot('website'),
    submitContactForm
);

// PATCH /api/contact/:id — update CRM fields (admin only)
router.patch('/:id', requireAdminSession, updateContact);

// GET /api/contact — admin only
router.get('/', requireAdminSession, getContacts);

export default router;
