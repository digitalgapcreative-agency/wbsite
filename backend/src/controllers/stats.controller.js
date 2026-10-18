import { readCollection } from '../utils/database.js';

/**
 * GET /api/admin/stats
 * Returns aggregated stats for the admin dashboard.
 */
export const getStats = async (_req, res, next) => {
    try {
        const [consultations, contacts] = await Promise.all([
            readCollection('consultations'),
            readCollection('contacts'),
        ]);

        const countByStatus = (records) =>
            records.reduce((acc, r) => {
                const s = r.status || 'NEW';
                acc[s] = (acc[s] || 0) + 1;
                return acc;
            }, {});

        const recentCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        return res.status(200).json({
            success: true,
            data: {
                consultations: {
                    total: consultations.length,
                    byStatus: countByStatus(consultations),
                    recentCount: consultations.filter(
                        (c) => c.createdAt >= recentCutoff
                    ).length,
                },
                contacts: {
                    total: contacts.length,
                    byStatus: countByStatus(contacts),
                    recentCount: contacts.filter(
                        (c) => c.createdAt >= recentCutoff
                    ).length,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};
