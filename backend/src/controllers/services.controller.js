// Static services data (replace with DB query in production)
const servicesData = [
    {
        id: 1,
        title: 'Strategic Diagnosis',
        slug: 'strategic-diagnosis',
        description:
            'The first step in every engagement. We analyse your business, identify the factors affecting performance and establish priorities before recommending solutions.',
        icon: 'Search',
    },
    {
        id: 2,
        title: 'Brand Strategy',
        slug: 'brand-strategy',
        description:
            'When positioning is limiting commercial performance, we help clarify how the business should be understood by the market.',
        icon: 'Lightbulb',
    },
    {
        id: 3,
        title: 'Digital Experience',
        slug: 'digital-experience',
        description:
            'When the customer journey creates unnecessary friction, we design digital experiences that better support business objectives.',
        icon: 'Monitor',
    },
    {
        id: 4,
        title: 'Marketing Strategy',
        slug: 'marketing-strategy',
        description:
            'When demand generation or customer acquisition requires improvement, we develop marketing systems aligned with business priorities.',
        icon: 'TrendingUp',
    },
];

/**
 * GET /api/services
 * Return all services.
 */
export const getAllServices = (_req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            count: servicesData.length,
            data: servicesData,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/services/:id
 * Return a single service by ID.
 */
export const getServiceById = (req, res, next) => {
    try {
        const { id } = req.params;
        const service = servicesData.find((s) => s.id === Number(id));

        if (!service) {
            return res.status(404).json({
                success: false,
                message: `Service with id "${id}" not found.`,
            });
        }

        return res.status(200).json({ success: true, data: service });
    } catch (err) {
        next(err);
    }
};
