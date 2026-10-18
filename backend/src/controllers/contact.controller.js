import { randomUUID } from 'node:crypto';
import { appendToCollection, readCollection, updateCollection } from '../utils/database.js';
import { sendContactEmails } from '../utils/email.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cleanString = (value) =>
    typeof value === 'string' ? value.trim() : '';

const isValidEmail = (value) =>
    EMAIL_PATTERN.test(value) && value.length <= 254;

/**
 * POST /api/contact
 * Submit a contact form message.
 */
export const submitContactForm = async (req, res, next) => {
    try {
        const name = cleanString(req.body?.name);
        const email = cleanString(req.body?.email).toLowerCase();
        const message = cleanString(req.body?.message);

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Fields "name", "email", and "message" are required.',
            });
        }

        if (name.length < 2 || name.length > 120) {
            return res.status(400).json({
                success: false,
                message: 'Name must be between 2 and 120 characters.',
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.',
            });
        }

        if (message.length < 10 || message.length > 5000) {
            return res.status(400).json({
                success: false,
                message: 'Message must be between 10 and 5000 characters.',
            });
        }

        const entry = {
            id: randomUUID(),
            name,
            email,
            message,
            createdAt: new Date().toISOString(),
            status: 'NEW',
            priority: 'MEDIUM',
            notes: '',
            lastContactedAt: null,
            nextFollowUpAt: null,
        };

        await appendToCollection('contacts', entry);

        sendContactEmails(entry).catch((err) =>
            console.error('[email] Unexpected error for contact:', err.message)
        );
        return res.status(201).json({
            success: true,
            message: 'Thank you! We will be in touch shortly.',
            data: { id: entry.id },
        });
    } catch (err) {
        next(err);
    }
};


/**
 * PATCH /api/contact/:id
 * Update CRM fields for a contact.
 */
export const updateContact = async (req, res, next) => {
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
            'contacts',
            id,
            updates
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Contact updated successfully.',
            data: updated,
        });
    } catch (err) {
        next(err);
    }
};


/**
 * GET /api/contact
 * Retrieve all contact submissions (admin only).
 */
export const getContacts = async (_req, res, next) => {
    try {
        const contacts = await readCollection('contacts');

        return res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (err) {
        next(err);
    }
};
