import { useState } from 'react';
import { adminLogin } from '../../services/api.js';

export default function AdminLoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await adminLogin(email, password);
            if (res.success) {
                onLogin(res.data);
            } else {
                setError(res.message || 'Login failed.');
            }
        } catch (err) {
            setError(
                err?.response?.data?.message || 'Invalid credentials. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                {/* Brand */}
                <div className="admin-login-brand">
                    <div className="admin-login-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h1 className="admin-login-title">Digital Gap</h1>
                    <p className="admin-login-sub">Admin Dashboard</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="field-group">
                        <label htmlFor="admin-email">Email</label>
                        <input
                            id="admin-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@digitalgap.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="admin-password">Password</label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="admin-login-error" role="alert">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="admin-login-btn">
                        {loading ? (
                            <span className="btn-spinner" />
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <p className="admin-login-hint">
                    Secure access — session expires in 8 hours
                </p>
            </div>
        </div>
    );
}
