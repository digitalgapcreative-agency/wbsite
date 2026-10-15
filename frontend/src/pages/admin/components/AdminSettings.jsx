export default function AdminSettings({ user }) {
    return (
        <div className="admin-settings">
            <div className="admin-settings-grid">
                {/* Account info */}
                <div className="admin-panel">
                    <div className="admin-panel-header">
                        <h2>Account</h2>
                    </div>
                    <div className="settings-account">
                        <div className="settings-avatar-lg">
                            {user?.email?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="settings-account-info">
                            <p className="settings-email">{user?.email}</p>
                            <p className="settings-role">{user?.role || 'Administrator'}</p>
                        </div>
                    </div>
                    <div className="settings-tip">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        To change your password, use the <code>reset-admin-password.js</code> script in the backend.
                    </div>
                </div>

                {/* API Info */}
                <div className="admin-panel">
                    <div className="admin-panel-header">
                        <h2>API Access</h2>
                    </div>
                    <p className="settings-desc">
                        Admin API endpoints are protected via session authentication.
                    </p>
                    <div className="settings-endpoints">
                        <div className="settings-endpoint">
                            <span className="endpoint-method get">GET</span>
                            <code>/api/consultation</code>
                        </div>
                        <div className="settings-endpoint">
                            <span className="endpoint-method patch">PATCH</span>
                            <code>/api/consultation/:id</code>
                        </div>
                        <div className="settings-endpoint">
                            <span className="endpoint-method get">GET</span>
                            <code>/api/contact</code>
                        </div>
                        <div className="settings-endpoint">
                            <span className="endpoint-method patch">PATCH</span>
                            <code>/api/contact/:id</code>
                        </div>
                        <div className="settings-endpoint">
                            <span className="endpoint-method get">GET</span>
                            <code>/api/admin/stats</code>
                        </div>
                    </div>
                </div>

                {/* Data Info */}
                <div className="admin-panel">
                    <div className="admin-panel-header">
                        <h2>Data Storage</h2>
                    </div>
                    <p className="settings-desc">
                        The application uses MongoDB when <code>MONGODB_URI</code> is configured.
                        If MongoDB is unavailable in development, data is stored in JSON files
                        at <code>backend/data/</code>.
                    </p>
                    <div className="settings-tip">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        CRM updates (status, priority, notes) require MongoDB. JSON fallback is read-only for legacy data.
                    </div>
                </div>

                {/* Email Info */}
                <div className="admin-panel">
                    <div className="admin-panel-header">
                        <h2>Email Notifications</h2>
                    </div>
                    <p className="settings-desc">
                        Email notifications are sent via <strong>Resend</strong> when a new consultation
                        is submitted. Configure the following in <code>backend/.env</code>:
                    </p>
                    <div className="settings-endpoints">
                        <div className="settings-endpoint">
                            <span className="endpoint-method env">ENV</span>
                            <code>RESEND_API_KEY</code>
                        </div>
                        <div className="settings-endpoint">
                            <span className="endpoint-method env">ENV</span>
                            <code>FROM_EMAIL</code>
                        </div>
                        <div className="settings-endpoint">
                            <span className="endpoint-method env">ENV</span>
                            <code>ADMIN_EMAIL</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
