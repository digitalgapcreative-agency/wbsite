import { useState } from 'react';
import { updateConsultation, updateContact } from '../../../services/api.js';
import AdminLeadDrawer from './AdminLeadDrawer.jsx';

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

const PRIORITY_COLORS = {
    LOW: '#64748b',
    MEDIUM: '#3b82f6',
    HIGH: '#f59e0b',
    URGENT: '#ef4444',
};

export default function AdminLeadsTable({ type, rows, onRefresh }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [selectedLead, setSelectedLead] = useState(null);
    const [saving, setSaving] = useState(false);

    const isConsultation = type === 'consultations';
    const updateFn = isConsultation ? updateConsultation : updateContact;

    // ── Filter + sort ────────────────────────────────────────────────────────────
    const filtered = rows
        .filter((r) => {
            const q = search.toLowerCase();
            const matchSearch =
                !q ||
                r.name?.toLowerCase().includes(q) ||
                r.email?.toLowerCase().includes(q) ||
                r.company?.toLowerCase().includes(q) ||
                r.challenge?.toLowerCase().includes(q) ||
                r.message?.toLowerCase().includes(q);
            const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
            const matchPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;
            return matchSearch && matchStatus && matchPriority;
        })
        .sort((a, b) => {
            let av = a[sortBy] ?? '';
            let bv = b[sortBy] ?? '';
            if (sortBy === 'createdAt') {
                av = new Date(av).getTime();
                bv = new Date(bv).getTime();
            } else {
                av = String(av).toLowerCase();
                bv = String(bv).toLowerCase();
            }
            if (av < bv) return sortDir === 'asc' ? -1 : 1;
            if (av > bv) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

    const toggleSort = (col) => {
        if (sortBy === col) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(col);
            setSortDir('desc');
        }
    };

    const SortIcon = ({ col }) => (
        <span className="admin-sort-icon">
            {sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
    );

    // ── Quick-update status from table ────────────────────────────────────────────
    const quickUpdateStatus = async (lead, newStatus) => {
        setSaving(true);
        try {
            await updateFn(lead.id, { status: newStatus });
            onRefresh();
        } catch (err) {
            alert(err?.response?.data?.message || 'Update failed.');
        } finally {
            setSaving(false);
        }
    };

    const handleDrawerSave = async (leadId, updates) => {
        await updateFn(leadId, updates);
        onRefresh();
        setSelectedLead(null);
    };

    return (
        <div className="admin-leads">
            {/* Toolbar */}
            <div className="admin-leads-toolbar">
                <div className="admin-search-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="search"
                        placeholder={`Search ${type}…`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="admin-search-input"
                    />
                </div>

                <div className="admin-filters">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="admin-select"
                    >
                        <option value="ALL">All Statuses</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="admin-select"
                    >
                        <option value="ALL">All Priorities</option>
                        {PRIORITIES.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                <div className="admin-leads-count">
                    {filtered.length} / {rows.length} entries
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th onClick={() => toggleSort('name')} className="sortable">
                                Name <SortIcon col="name" />
                            </th>
                            <th onClick={() => toggleSort('email')} className="sortable">
                                Email <SortIcon col="email" />
                            </th>
                            {isConsultation ? (
                                <>
                                    <th>Company</th>
                                    <th>Service</th>
                                    <th>Channel</th>
                                </>
                            ) : (
                                <th>Message</th>
                            )}
                            <th onClick={() => toggleSort('status')} className="sortable">
                                Status <SortIcon col="status" />
                            </th>
                            <th onClick={() => toggleSort('priority')} className="sortable">
                                Priority <SortIcon col="priority" />
                            </th>
                            <th onClick={() => toggleSort('createdAt')} className="sortable">
                                Date <SortIcon col="createdAt" />
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={isConsultation ? 9 : 7} className="admin-table-empty">
                                    No {type} found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((row) => (
                                <tr key={row.id} className="admin-table-row">
                                    <td className="admin-td-name">
                                        <div className="admin-row-avatar">
                                            {row.name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <span>{row.name}</span>
                                    </td>
                                    <td className="admin-td-email">
                                        <a href={`mailto:${row.email}`}>{row.email}</a>
                                    </td>
                                    {isConsultation ? (
                                        <>
                                            <td>{row.company || <span className="admin-null">—</span>}</td>
                                            <td>{row.service || <span className="admin-null">—</span>}</td>
                                            <td>{row.channel || <span className="admin-null">—</span>}</td>
                                        </>
                                    ) : (
                                        <td className="admin-td-message">
                                            {row.message
                                                ? row.message.length > 60
                                                    ? row.message.slice(0, 60) + '…'
                                                    : row.message
                                                : <span className="admin-null">—</span>}
                                        </td>
                                    )}
                                    <td>
                                        <select
                                            className="admin-inline-select"
                                            value={row.status || 'NEW'}
                                            style={{ '--sel-color': STATUS_COLORS[row.status] || '#94a3b8' }}
                                            disabled={saving}
                                            onChange={(e) => quickUpdateStatus(row, e.target.value)}
                                        >
                                            {STATUSES.map((s) => (
                                                <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <span
                                            className="admin-priority-badge"
                                            style={{ '--pcolor': PRIORITY_COLORS[row.priority] || '#64748b' }}
                                        >
                                            {row.priority || 'MEDIUM'}
                                        </span>
                                    </td>
                                    <td className="admin-td-date">
                                        {row.createdAt
                                            ? new Date(row.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: '2-digit',
                                            })
                                            : '—'}
                                    </td>
                                    <td>
                                        <button
                                            className="admin-open-btn"
                                            onClick={() => setSelectedLead(row)}
                                            title="Open details"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail drawer */}
            {selectedLead && (
                <AdminLeadDrawer
                    lead={selectedLead}
                    type={type}
                    onSave={handleDrawerSave}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </div>
    );
}
