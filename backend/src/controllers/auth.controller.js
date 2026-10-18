import bcrypt from 'bcryptjs';
import {
    findAdminByEmail,
    updateAdminLogin,
} from '../utils/database.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const login = async (req, res, next) => {
    try {
        const email =
            typeof req.body?.email === 'string'
                ? req.body.email.trim().toLowerCase()
                : '';

        const password =
            typeof req.body?.password === 'string'
                ? req.body.password
                : '';

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.',
            });
        }

        if (!EMAIL_PATTERN.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.',
            });
        }

        const admin = await findAdminByEmail(email);

        if (!admin || !admin.passwordHash) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            admin.passwordHash
        );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        req.session.regenerate(async (err) => {
            if (err) return next(err);

            try {
                req.session.adminId = String(admin.id);
                req.session.adminEmail = admin.email;
                req.session.adminRole = admin.role;

                await updateAdminLogin(admin.id);

                return res.status(200).json({
                    success: true,
                    message: 'Login successful.',
                    data: {
                        email: admin.email,
                        role: admin.role,
                    },
                });
            } catch (innerError) {
                return next(innerError);
            }
        });
    } catch (error) {
        next(error);
    }
};

export const me = async (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            authenticated: true,
            email: req.session.adminEmail,
            role: req.session.adminRole,
        },
    });
};

export const logout = async (req, res, next) => {
    try {
        req.session.destroy((error) => {
            if (error) {
                return next(error);
            }

            res.clearCookie('dgap_admin_session');

            return res.status(200).json({
                success: true,
                message: 'Logged out successfully.',
            });
        });
    } catch (error) {
        next(error);
    }
};
