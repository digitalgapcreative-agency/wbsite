export const requireAdminSession = (req, res, next) => {
    if (!req.session?.adminId) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.',
        });
    }

    next();
};
