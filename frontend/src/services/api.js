import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15_000,
    withCredentials: true, // send cookies for session auth
});

// ─── Services ──────────────────────────────────────────────────────────────────
export const getServices = () => api.get('/services').then((r) => r.data);

// ─── Contact ───────────────────────────────────────────────────────────────────
export const submitContact = (payload) =>
    api.post('/contact', payload).then((r) => r.data);

// ─── Consultation ──────────────────────────────────────────────────────────────
export const requestConsultation = (payload) =>
    api.post('/consultation', payload).then((r) => r.data);

// ─── Admin: Auth ───────────────────────────────────────────────────────────────
export const adminLogin = (email, password) =>
    api.post('/auth/login', { email, password }).then((r) => r.data);

export const adminLogout = () =>
    api.post('/auth/logout').then((r) => r.data);

export const adminMe = () =>
    api.get('/auth/me').then((r) => r.data);

// ─── Admin: Stats ──────────────────────────────────────────────────────────────
export const getAdminStats = () =>
    api.get('/admin/stats').then((r) => r.data);

// ─── Admin: Consultations ──────────────────────────────────────────────────────
export const getConsultations = () =>
    api.get('/consultation').then((r) => r.data);

export const updateConsultation = (id, updates) =>
    api.patch(`/consultation/${id}`, updates).then((r) => r.data);

// ─── Admin: Contacts ───────────────────────────────────────────────────────────
export const getContacts = () =>
    api.get('/contact').then((r) => r.data);

export const updateContact = (id, updates) =>
    api.patch(`/contact/${id}`, updates).then((r) => r.data);

export default api;
