const STATUS_COLORS = {
    NEW: '#6366f1',
    CONTACTED: '#f59e0b',
    QUALIFIED: '#3b82f6',
    PROPOSAL_SENT: '#8b5cf6',
    NEGOTIATING: '#ec4899',
    WON: '#10b981',
    LOST: '#ef4444',
};

function StatCard({ label, value, sub, icon, accent, onClick }) {
    return (
        <button
            className={`admin-stat-card ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
            style={{ '--accent': accent || '#6366f1' }}
        >
            <div className="admin-stat-icon">{icon}</div>
            <div className="admin-stat-body">
                <p className="admin-stat-label">{label}</p>
                <p className="admin-stat-value">{value ?? '—'}</p>
                {sub && <p className="admin-stat-sub">{sub}</p>}
            </div>
        </button>
    );
}

function StatusBar({ byStatus, total }) {
    if (!byStatus || total === 0) return <p className="admin-no-data">No data yet.</p>;

    return (
        <div className="admin-status-bar-wrap">
            <div className="admin-status-bar">
                {Object.entries(byStatus).map(([status, count]) => (
                    <div
                        key={status}
                        className="admin-status-segment"
                        style={{
                            width: `${(count / total) * 100}%`,
                            background: STATUS_COLORS[status] || '#94a3b8',
                        }}
                        title={`${status}: ${count}`}
                    />
                ))}
            </div>
            <div className="admin-status-legend">
                {Object.entries(byStatus).map(([status, count]) => (
                    <div key={status} className="admin-legend-item">
                        <span
                            className="admin-legend-dot"
                            style={{ background: STATUS_COLORS[status] || '#94a3b8' }}
                        />
                        <span>{status.replace('_', ' ')}</span>
                        <span className="admin-legend-count">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RecentRow({ entry, type }) {
    const isConsultation = type === 'consultations';
    return (
        <div className="admin-recent-row">
            <div className="admin-recent-avatar">
                {entry.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="admin-recent-info">
                <p className="admin-recent-name">{entry.name}</p>
                <p className="admin-recent-meta">
                    {entry.email}
                    {isConsultation && entry.service && ` · ${entry.service}`}
                    {isConsultation && entry.company && ` · ${entry.company}`}
                </p>
            </div>
            <div className="admin-recent-right">
                <span
                    className="admin-status-badge"
                    style={{ '--badge-color': STATUS_COLORS[entry.status] || '#94a3b8' }}
                >
                    {entry.status?.replace('_', ' ') || 'NEW'}
                </span>
                <span className="admin-recent-date">
                    {entry.createdAt
                        ? new Date(entry.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                        })
                        : '—'}
                </span>
            </div>
        </div>
    );
}

export default function AdminOverview({ stats, consultations, contacts, setActiveView }) {
    const consultStats = stats?.consultations;
    const contactStats = stats?.contacts;

    const recent5Consult = [...(consultations || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const recent5Contact = [...(contacts || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="admin-overview">
            {/* Stat cards */}
            <div className="admin-stat-grid">
                <StatCard
                    label="Total Consultations"
                    value={consultStats?.total ?? 0}
                    sub={`${consultStats?.recentCount ?? 0} this week`}
                    accent="#8b5cf6"
                    onClick={() => setActiveView('consultations')}
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total Contacts"
                    value={contactStats?.total ?? 0}
                    sub={`${contactStats?.recentCount ?? 0} this week`}
                    accent="#3b82f6"
                    onClick={() => setActiveView('contacts')}
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    }
                />
                <StatCard
                    label="Won Deals"
                    value={(consultStats?.byStatus?.WON ?? 0) + (contactStats?.byStatus?.WON ?? 0)}
                    sub="Consultations + Contacts"
                    accent="#10b981"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    }
                />
                <StatCard
                    label="Follow-Ups Needed"
                    value={
                        [...(consultations || []), ...(contacts || [])].filter(
                            (r) => r.status === 'CONTACTED' || r.status === 'NEGOTIATING'
                        ).length
                    }
                    sub="Active pipeline"
                    accent="#f59e0b"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    }
                />
            </div>

            {/* Pipeline charts */}
            <div className="admin-overview-panels">
                <div className="admin-panel">
                    <div className="admin-panel-header">
                        <h2>Consultation Pipeline</h2>
                        <button className="admin-panel-link" onClick={() => setActiveView('consultations')}>
                            View all →
                        </button>
                    </div>
                    <StatusBar byStatus={consultStats?.byStatus} total={consultStats?.total} />
                </div>

                <div className="admin-panel">
                    <div className="admin-panel-header">
                        <h2>Contact Pipeline</h2>
                        <button className="admin-panel-link" onClick={() => setActiveView('contacts')}>
                            View all →
                        </button>
                    </div>
                    <StatusBar byStatus={contactStats?.byStatus} total={contactStats?.total} />
                </div>
            </div>

            {/* Recent rows */}
            <div className="admin-overview-panels">
                <div className="admin-panel">
                    <div className="admin-panel-header">
                        <h2>Recent Consultations</h2>
                        <button className="admin-panel-link" onClick={() => setActiveView('consultations')}>
                            View all →
                        </button>
                    </div>
                    {recent5Consult.length === 0 ? (
                        <p className="admin-no-data">No consultations yet.</p>
                    ) : (
                        <div className="admin-recent-list">
                            {recent5Consult.map((c) => (
                                <RecentRow key={c.id} entry={c} type="consultations" />
                            ))}
                        </div>
                    )}
                </div>

                <div className="admin-panel">
                    <div className="admin-panel-header">
                        <h2>Recent Contacts</h2>
                        <button className="admin-panel-link" onClick={() => setActiveView('contacts')}>
                            View all →
                        </button>
                    </div>
                    {recent5Contact.length === 0 ? (
                        <p className="admin-no-data">No contacts yet.</p>
                    ) : (
                        <div className="admin-recent-list">
                            {recent5Contact.map((c) => (
                                <RecentRow key={c.id} entry={c} type="contacts" />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
