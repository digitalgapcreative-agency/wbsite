import '../../admin.css';
import { useState, useEffect } from 'react';
import { adminMe } from '../../services/api.js';
import AdminLoginPage from './AdminLoginPage.jsx';
import AdminDashboard from './AdminDashboard.jsx';

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    // Check existing session on mount
    useEffect(() => {
        adminMe()
            .then((res) => {
                if (res.success && res.data.authenticated) {
                    setUser(res.data);
                }
            })
            .catch(() => {/* not authenticated */ })
            .finally(() => setChecking(false));
    }, []);

    const handleLogin = (userData) => setUser(userData);
    const handleLogout = () => setUser(null);

    if (checking) {
        return (
            <div className="admin-check-screen">
                <div className="admin-spinner" />
                <p>Verifying session…</p>
            </div>
        );
    }

    if (!user) {
        return <AdminLoginPage onLogin={handleLogin} />;
    }

    return <AdminDashboard user={user} onLogout={handleLogout} />;
}
