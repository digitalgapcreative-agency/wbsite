import { Router } from 'express';
import { getAllServices, getServiceById } from '../controllers/services.controller.js';

const router = Router();

// GET /api/services       — list all services
router.get('/', getAllServices);

// GET /api/services/:id   — get a single service by ID
router.get('/:id', getServiceById);

export default router;
