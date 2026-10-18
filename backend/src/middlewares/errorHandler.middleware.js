// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
    const statusCode = err.statusCode || err.status || 500;
    const isProd = process.env.NODE_ENV === 'production';

    let message = err.message || 'Internal Server Error';
    if (isProd && statusCode === 500) {
        message = 'Internal Server Error';
    }

    if (!isProd) {
        console.error(`[ERROR] ${req.method} ${req.path} →`, err.stack || err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(!isProd && { stack: err.stack }),
    });
};
