import rateLimit from 'express-rate-limit';

const buildLimiter = (max, message) =>
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: false,
        message: {
            success: false,
            message,
        },
    });

// Limite geral para a API
export const rateLimiter = buildLimiter(
    100,
    'Too many requests. Please try again later.'
);

// Contact form: máximo 5 submissões por IP em 15 minutos
export const contactRateLimiter = buildLimiter(
    5,
    'Too many contact submissions. Please try again later.'
);

// Consultation form: máximo 3 submissões por IP em 15 minutos
export const consultationRateLimiter = buildLimiter(
    3,
    'Too many consultation requests. Please try again later.'
);
