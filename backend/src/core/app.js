import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { corsMiddleware } from '../middlewares/cors.middleware.js';
import { securityMiddleware } from '../middlewares/security.middleware.js';
import { loggerMiddleware } from '../middlewares/logger.middleware.js';
import { rateLimiter } from '../middlewares/rateLimiter.middleware.js';
import { errorHandler } from '../middlewares/errorHandler.middleware.js';
import { notFound } from '../middlewares/notFound.middleware.js';
import contactRoutes from '../routes/contact.routes.js';
import servicesRoutes from '../routes/services.routes.js';
import consultationRoutes from '../routes/consultation.routes.js';
import { connectToMongo, isMongoEnabled } from '../utils/database.js';
import { sessionMiddleware } from '../middlewares/session.middleware.js';
import authRoutes from '../routes/auth.routes.js';
import adminRoutes from '../routes/admin.routes.js';

export const createApp = () => {
  const app = express();
  const PORT = process.env.PORT || 5000;
  const HOST = process.env.HOST || '0.0.0.0';

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  app.use(securityMiddleware);
  app.use(corsMiddleware);
  app.use(loggerMiddleware);
  app.use(rateLimiter);
  app.use(express.json({ limit: '50kb' }));
  app.use(express.urlencoded({ extended: true, limit: '50kb' }));
  app.use(sessionMiddleware);

  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/services', servicesRoutes);
  app.use('/api/consultation', consultationRoutes);

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: isMongoEnabled() ? 'mysql' : 'json'
    });
  });

  const frontendPath = fileURLToPath(
    new URL('../../../frontend/dist/', import.meta.url)
  );

  app.use(express.static(frontendPath));

  app.get('*', (req, res, next) => {
    if (
      req.path === '/api' ||
      req.path.startsWith('/api/') ||
      path.extname(req.path)
    ) {
      return next();
    }

    res.sendFile(path.join(frontendPath, 'index.html'));
  });

  app.use(notFound);
  app.use(errorHandler);

  app.start = async () => {
    await connectToMongo();
    return app.listen(PORT, HOST, () => {
      console.log(`\n🚀 Digital Gap API running on http://${HOST}:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  };

  return app;
};
