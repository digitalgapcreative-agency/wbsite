const NAV_ITEMS = [
    {
        id: 'overview',
        label: 'Overview',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        id: 'consultations',
        label: 'Consultations',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: 'contacts',
        label: 'Contacts',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2" />
            </svg>
        ),
    },
];

export default function AdminSidebar({ user, activeView, setActiveView, onLogout, open, setOpen }) {
    return (
        <aside className={`admin-sidebar ${open ? 'open' : 'collapsed'}`}>
            {/* Logo */}
            <div className="admin-sidebar-logo">
                <div className="admin-sidebar-logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                {open && (
                    <div className="admin-sidebar-brand">
                        <span className="admin-sidebar-brand-name">Digital Gap</span>
                        <span className="admin-sidebar-brand-tag">Admin</span>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="admin-nav">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        className={`admin-nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => setActiveView(item.id)}
                        title={!open ? item.label : undefined}
                    >
                        <span className="admin-nav-icon">{item.icon}</span>
                        {open && <span className="admin-nav-label">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="admin-sidebar-footer">
                {open && (
                    <div className="admin-sidebar-user-info">
                        <div className="admin-sidebar-avatar">
                            {user?.email?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="admin-sidebar-user-details">
                            <span className="admin-sidebar-user-email">{user?.email}</span>
                            <span className="admin-sidebar-user-role">{user?.role || 'admin'}</span>
                        </div>
                    </div>
                )}
                <button className="admin-logout-btn" onClick={onLogout} title="Logout">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    {open && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
