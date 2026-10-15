import { useState } from 'react';

const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATING', 'WON', 'LOST'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const STATUS_COLORS = {
    NEW: '#6366f1',
    CONTACTED: '#f59e0b',
    QUALIFIED: '#3b82f6',
    PROPOSAL_SENT: '#8b5cf6',
    NEGOTIATING: '#ec4899',
    WON: '#10b981',
    LOST: '#ef4444',
};

function Field({ label, value }) {
    if (!value) return null;
    return (
        <div className="drawer-field">
            <span className="drawer-field-label">{label}</span>
            <span className="drawer-field-value">{value}</span>
        </div>
    );
}

export default function AdminLeadDrawer({ lead, type, onSave, onClose }) {
    const isConsultation = type === 'consultations';

    const [status, setStatus] = useState(lead.status || 'NEW');
    const [priority, setPriority] = useState(lead.priority || 'MEDIUM');
    const [notes, setNotes] = useState(lead.notes || '');
    const [lastContactedAt, setLastContactedAt] = useState(
        lead.lastContactedAt ? lead.lastContactedAt.split('T')[0] : ''
    );
    const [nextFollowUpAt, setNextFollowUpAt] = useState(
        lead.nextFollowUpAt ? lead.nextFollowUpAt.split('T')[0] : ''
    );
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    const handleSave = async () => {
        setSaving(true);
        setSaveError('');
        try {
            const updates = {
                status,
                priority,
                notes,
                lastContactedAt: lastContactedAt || null,
                nextFollowUpAt: nextFollowUpAt || null,
            };
            await onSave(lead.id, updates);
        } catch (err) {
            setSaveError(err?.response?.data?.message || 'Save failed. Please try again.');
            setSaving(false);
        }
    };

    return (
        <>
            {/* Overlay */}
            <div className="drawer-overlay" onClick={onClose} />

            {/* Drawer */}
            <div className="admin-drawer">
                {/* Header */}
                <div className="drawer-header">
                    <div className="drawer-header-info">
                        <div
                            className="drawer-header-avatar"
                            style={{ background: STATUS_COLORS[lead.status] || '#6366f1' }}
                        >
                            {lead.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <h2 className="drawer-title">{lead.name}</h2>
                            <p className="drawer-subtitle">
                                {lead.email}
                                {lead.createdAt &&
                                    ` · ${new Date(lead.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}`}
                            </p>
                        </div>
                    </div>
                    <button className="drawer-close" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="drawer-body">
                    {/* Lead info */}
                    <section className="drawer-section">
                        <h3 className="drawer-section-title">Lead Details</h3>
                        <div className="drawer-fields">
                            <Field label="Name" value={lead.name} />
                            <Field label="Email" value={lead.email} />
                            <Field label="Company" value={lead.company} />
                            <Field label="Role" value={lead.role} />
                            <Field label="Country" value={lead.country} />
                            <Field label="Industry" value={lead.industry} />
                            <Field label="Company Size" value={lead.companySize} />
                            <Field label="Budget" value={lead.budget} />
                            <Field label="Timeline" value={lead.timeline} />
                            <Field label="Service" value={lead.service} />
                            <Field label="Channel" value={lead.channel} />
                            <Field label="Source" value={lead.source} />
                            {lead.whatsapp && (
                                <div className="drawer-field">
                                    <span className="drawer-field-label">WhatsApp</span>
                                    <a
                                        className="drawer-field-value drawer-link"
                                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {lead.whatsapp}
                                    </a>
                                </div>
                            )}
                            {lead.phone && (
                                <div className="drawer-field">
                                    <span className="drawer-field-label">Phone</span>
                                    <a className="drawer-field-value drawer-link" href={`tel:${lead.phone}`}>
                                        {lead.phone}
                                    </a>
                                </div>
                            )}
                            {lead.website && (
                                <div className="drawer-field">
                                    <span className="drawer-field-label">Website</span>
                                    <a
                                        className="drawer-field-value drawer-link"
                                        href={lead.website}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {lead.website}
                                    </a>
                                </div>
                            )}
                        </div>

                        {(isConsultation ? lead.challenge : lead.message) && (
                            <div className="drawer-challenge">
                                <p className="drawer-field-label">
                                    {isConsultation ? 'Challenge / Need' : 'Message'}
                                </p>
                                <p className="drawer-challenge-text">
                                    {isConsultation ? lead.challenge : lead.message}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* CRM controls */}
                    <section className="drawer-section">
                        <h3 className="drawer-section-title">CRM Management</h3>

                        <div className="drawer-crm-grid">
                            <div className="drawer-crm-field">
                                <label>Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    style={{ '--sel-color': STATUS_COLORS[status] || '#94a3b8' }}
                                    className="admin-inline-select drawer-select"
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="drawer-crm-field">
                                <label>Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="drawer-plain-select"
                                >
                                    {PRIORITIES.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="drawer-crm-field">
                                <label>Last Contacted</label>
                                <input
                                    type="date"
                                    value={lastContactedAt}
                                    onChange={(e) => setLastContactedAt(e.target.value)}
                                    className="drawer-date-input"
                                />
                            </div>

                            <div className="drawer-crm-field">
                                <label>Next Follow-Up</label>
                                <input
                                    type="date"
                                    value={nextFollowUpAt}
                                    onChange={(e) => setNextFollowUpAt(e.target.value)}
                                    className="drawer-date-input"
                                />
                            </div>
                        </div>

                        <div className="drawer-notes-field">
                            <label>Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add internal notes about this lead…"
                                rows={5}
                                maxLength={5000}
                                className="drawer-textarea"
                            />
                            <span className="drawer-char-count">{notes.length}/5000</span>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="drawer-footer">
                    {saveError && (
                        <p className="drawer-save-error">{saveError}</p>
                    )}
                    <button className="drawer-cancel-btn" onClick={onClose} disabled={saving}>
                        Cancel
                    </button>
                    <button className="drawer-save-btn" onClick={handleSave} disabled={saving}>
                        {saving ? <span className="btn-spinner" /> : null}
                        {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
}
