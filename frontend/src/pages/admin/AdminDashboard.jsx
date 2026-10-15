import { useState, useEffect, useCallback } from 'react';
import { adminLogout, getAdminStats, getConsultations, getContacts } from '../../services/api.js';
import AdminSidebar from './components/AdminSidebar.jsx';
import AdminOverview from './components/AdminOverview.jsx';
import AdminLeadsTable from './components/AdminLeadsTable.jsx';
import AdminSettings from './components/AdminSettings.jsx';

export default function AdminDashboard({ user, onLogout }) {
    const [activeView, setActiveView] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // ── Data state ──────────────────────────────────────────────────────────────
    const [stats, setStats] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [statsRes, consultRes, contactRes] = await Promise.all([
                getAdminStats(),
                getConsultations(),
                getContacts(),
            ]);
            if (statsRes.success) setStats(statsRes.data);
            if (consultRes.success) setConsultations(consultRes.data);
            if (contactRes.success) setContacts(contactRes.data);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // ── Logout ──────────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        try {
            await adminLogout();
        } catch (_) { /* ignore */ }
        onLogout();
    };

    return (
        <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
            <AdminSidebar
                user={user}
                activeView={activeView}
                setActiveView={setActiveView}
                onLogout={handleLogout}
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            <main className="admin-main">
                {/* Top bar */}
                <header className="admin-topbar">
                    <button
                        className="admin-menu-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <div className="admin-topbar-title">
                        {activeView === 'overview' && 'Dashboard Overview'}
                        {activeView === 'consultations' && 'Consultation Requests'}
                        {activeView === 'contacts' && 'Contact Messages'}
                        {activeView === 'settings' && 'Settings'}
                    </div>
                    <div className="admin-topbar-right">
                        <div className="admin-topbar-user">
                            <div className="admin-avatar">
                                {user?.email?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <span>{user?.email}</span>
                        </div>
                        <button className="admin-refresh-btn" onClick={fetchAll} title="Refresh data">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 4 23 10 17 10" />
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="admin-content">
                    {error && (
                        <div className="admin-error-banner">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                            <button onClick={fetchAll}>Retry</button>
                        </div>
                    )}

                    {loading ? (
                        <div className="admin-loading">
                            <div className="admin-spinner" />
                            <p>Loading dashboard data…</p>
                        </div>
                    ) : (
                        <>
                            {activeView === 'overview' && (
                                <AdminOverview
                                    stats={stats}
                                    consultations={consultations}
                                    contacts={contacts}
                                    setActiveView={setActiveView}
                                />
                            )}
                            {activeView === 'consultations' && (
                                <AdminLeadsTable
                                    type="consultations"
                                    rows={consultations}
                                    onRefresh={fetchAll}
                                />
                            )}
                            {activeView === 'contacts' && (
                                <AdminLeadsTable
                                    type="contacts"
                                    rows={contacts}
                                    onRefresh={fetchAll}
                                />
                            )}
                            {activeView === 'settings' && (
                                <AdminSettings user={user} />
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
