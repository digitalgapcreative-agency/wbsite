import helmet from 'helmet';

export const securityMiddleware = helmet({
    contentSecurityPolicy: false, // Disabled for API — frontend handles CSP
    crossOriginResourcePolicy: { policy: 'cross-origin' },
});
