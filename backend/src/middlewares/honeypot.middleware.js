export const honeypot = (field = 'website') => {
    return (req, res, next) => {
        const value = req.body?.[field];

        // Bots tendem a preencher campos escondidos automaticamente.
        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ''
        ) {
            return res.status(400).json({
                success: false,
                message: 'Unable to process this request.',
            });
        }

        next();
    };
};
