import cors from 'cors';

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim());

const isLocalhost = (origin) =>
    /^https?:\/\/localhost:\d+$/.test(origin) || /^https?:\/\/127\.0\.0\.1:\d+$/.test(origin);

export const corsMiddleware = cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Postman)
        if (!origin) return callback(null, true);

        // In development, accept any localhost/127.0.0.1 port — Vite bumps ports
        // (5173 → 5174 → ...) whenever the previous one is still in use.
        if (process.env.NODE_ENV !== 'production' && isLocalhost(origin)) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS: Origin "${origin}" not allowed.`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
    credentials: true,
});
