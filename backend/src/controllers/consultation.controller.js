import { randomUUID } from 'node:crypto';
import { appendToCollection, readCollection, updateCollection } from '../utils/database.js';
import { sendConsultationEmails } from '../utils/email.js';

const REQUIRED_FIELDS = ['name', 'email', 'challenge'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
    name: 120,
    email: 254,
    whatsapp: 40,
    phone: 40,
    role: 120,
    company: 160,
    website: 500,
    country: 100,
    industry: 120,
    companySize: 80,
    budget: 120,
    timeline: 120,
    challenge: 5000,
    channel: 80,
    service: 160,
    source: 160,
};

const cleanString = (value) =>
    typeof value === 'string' ? value.trim() : '';

const exceedsLimit = (field, value) =>
    value && value.length > LIMITS[field];

const isValidEmail = (value) =>
    EMAIL_PATTERN.test(value) && value.length <= LIMITS.email;

/**
 * POST /api/consultation
 * Request a consultation.
 */
export const requestConsultation = async (req, res, next) => {
    try {
        const body = req.body || {};

        const values = {
            name: cleanString(body.name),
            email: cleanString(body.email).toLowerCase(),
            whatsapp: cleanString(body.whatsapp),
            phone: cleanString(body.phone),
            role: cleanString(body.role),
            company: cleanString(body.company),
            website: cleanString(body.website),
            country: cleanString(body.country),
            industry: cleanString(body.industry),
            companySize: cleanString(body.companySize),
            budget: cleanString(body.budget),
            timeline: cleanString(body.timeline),
            challenge: cleanString(body.challenge),
            channel: cleanString(body.channel),
            service: cleanString(body.service),
            source: cleanString(body.source),
        };

        const missing = REQUIRED_FIELDS.filter(
            (field) => !values[field]
        );

        if (missing.length) {
            return res.status(400).json({
                success: false,
                message: `Missing required field(s): ${missing.join(', ')}.`,
            });
        }

        if (values.name.length < 2 || values.name.length > LIMITS.name) {
            return res.status(400).json({
                success: false,
                message: `Name must be between 2 and ${LIMITS.name} characters.`,
            });
        }

        if (!isValidEmail(values.email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.',
            });
        }

        if (
            values.challenge.length < 20 ||
            values.challenge.length > LIMITS.challenge
        ) {
            return res.status(400).json({
                success: false,
                message: `Challenge must be between 20 and ${LIMITS.challenge} characters.`,
            });
        }

        for (const [field, value] of Object.entries(values)) {
            if (value && exceedsLimit(field, value)) {
                return res.status(400).json({
                    success: false,
                    message: `${field} exceeds the maximum allowed length of ${LIMITS[field]} characters.`,
                });
            }
        }

        const entry = {
            id: randomUUID(),
            ...values,
            whatsapp: values.whatsapp || null,
            phone: values.phone || null,
            role: values.role || null,
            company: values.company || null,
            website: values.website || null,
            country: values.country || null,
            industry: values.industry || null,
            companySize: values.companySize || null,
            budget: values.budget || null,
            timeline: values.timeline || null,
            channel: values.channel || null,
            service: values.service || null,
            source: values.source || null,
            status: 'NEW',
        priority: 'MEDIUM',
        notes: '',
        lastContactedAt: null,
        nextFollowUpAt: null,
            createdAt: new Date().toISOString(),
        };

        await appendToCollection('consultations', entry);

        sendConsultationEmails(entry).catch((err) =>
            console.error('[email] Unexpected error:', err.message)
        );

        return res.status(201).json({
            success: true,
            message:
                'Consultation request received. We will contact you within 48 hours.',
            data: { id: entry.id },
        });
    } catch (err) {
        next(err);
    }
};


/**
 * PATCH /api/consultation/:id
 * Update CRM fields for a consultation.
 */
export const updateConsultation = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Lead id is required.',
            });
        }

        const body = req.body || {};

        const allowedStatuses = [
            'NEW',
            'CONTACTED',
            'QUALIFIED',
            'PROPOSAL_SENT',
            'NEGOTIATING',
            'WON',
            'LOST',
        ];

        const allowedPriorities = [
            'LOW',
            'MEDIUM',
            'HIGH',
            'URGENT',
        ];

        const updates = {};

        if (body.status !== undefined) {
            if (!allowedStatuses.includes(body.status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status.',
                });
            }

            updates.status = body.status;
        }

        if (body.priority !== undefined) {
            if (!allowedPriorities.includes(body.priority)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid priority.',
                });
            }

            updates.priority = body.priority;
        }

        if (body.notes !== undefined) {
            if (typeof body.notes !== 'string' || body.notes.length > 5000) {
                return res.status(400).json({
                    success: false,
                    message: 'Notes must be a string with a maximum of 5000 characters.',
                });
            }

            updates.notes = body.notes.trim();
        }

        if (body.lastContactedAt !== undefined) {
            if (body.lastContactedAt === null || body.lastContactedAt === '') {
                updates.lastContactedAt = null;
            } else {
                const date = new Date(body.lastContactedAt);

                if (Number.isNaN(date.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid lastContactedAt date.',
                    });
                }

                updates.lastContactedAt = date;
            }
        }

        if (body.nextFollowUpAt !== undefined) {
            if (body.nextFollowUpAt === null || body.nextFollowUpAt === '') {
                updates.nextFollowUpAt = null;
            } else {
                const date = new Date(body.nextFollowUpAt);

                if (Number.isNaN(date.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid nextFollowUpAt date.',
                    });
                }

                updates.nextFollowUpAt = date;
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid CRM fields provided for update.',
            });
        }

        const updated = await updateCollection(
            'consultations',
            id,
            updates
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Consultation not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Consultation updated successfully.',
            data: updated,
        });
    } catch (err) {
        next(err);
    }
};


/**
 * GET /api/consultation
 * Retrieve all consultation requests (admin only).
 */
export const getConsultations = async (_req, res, next) => {
    try {
        const consultations = await readCollection('consultations');

        return res.status(200).json({
            success: true,
            count: consultations.length,
            data: consultations,
        });
    } catch (err) {
        next(err);
    }
};
