import { useCallback, useEffect, useState } from 'react';
import { api, ApiError, csvUrl } from './api.js';
import { Wordmark } from '../components/ui.jsx';

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'spam'];
const STAGE_LABEL = {
  brand: 'Brand & positioning',
  marketing: 'Marketing',
  website: 'Website',
  operations: 'Operations',
  unsure: 'Not sure'
};
const fmtDate = (d) =>
  new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function useAdminChrome() {
  useEffect(() => {
    document.querySelector('.preloader')?.remove();
    document.documentElement.classList.add('motion-ready', 'admin-mode');
    document.title = 'DGAP Admin';
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = 'noindex, nofollow';
  }, []);
}

function Login({ onDone, disabled }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { user } = await api('/auth/login', { method: 'POST', body: { email, password } });
      onDone(user);
    } catch (err) {
      setError(
        err.code === 'rate_limited'
          ? 'Too many attempts. Wait 15 minutes and try again.'
          : err.code === 'login_disabled'
            ? 'Login is disabled: set SESSION_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD_HASH on the server.'
            : err.status === 401
              ? 'Email or password is incorrect.'
              : 'The server could not be reached. Check /api/health.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-login">
      <form className="adm-card adm-login__card" onSubmit={submit}>
        <Wordmark />
        <h1>Lead dashboard</h1>
        {disabled && <p className="adm-note">Admin login is not configured on this server yet.</p>}
        <label htmlFor="adm-email">Email</label>
        <input id="adm-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="adm-password">Password</label>
        <input
          id="adm-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className="adm-error" role="alert">
            {error}
          </p>
        )}
        <button className="adm-btn" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

function LeadRow({ lead, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(lead.notes || '');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = async (patch) => {
    setSaving(true);
    try {
      await api(`/admin/leads/${lead.id}`, { method: 'PATCH', body: patch });
      onChange({ ...lead, ...patch });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <tr className={`adm-row ${open ? 'is-open' : ''}`}>
        <td>
          <button type="button" className="adm-link" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            <b>{lead.company}</b>
            <span>{lead.name}</span>
          </button>
        </td>
        <td className="adm-hide-sm">
          <a href={`mailto:${lead.email}`}>{lead.email}</a>
          {lead.phone && <span className="adm-sub">{lead.phone}</span>}
        </td>
        <td className="adm-hide-sm">{STAGE_LABEL[lead.stage] || lead.stage || '—'}</td>
        <td className="adm-hide-sm adm-num">{fmtDate(lead.created_at)}</td>
        <td>
          <select
            aria-label={`Status for ${lead.company}`}
            className={`adm-status adm-status--${lead.status}`}
            value={lead.status}
            disabled={saving}
            onChange={(e) => save({ status: e.target.value })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </td>
      </tr>
      {open && (
        <tr className="adm-detail">
          <td colSpan={5}>
            <div className="adm-detail__grid">
              <div>
                <p className="adm-label">Message</p>
                <p className="adm-msg">{lead.message || '—'}</p>
                <p className="adm-sub">
                  {lead.locale?.toUpperCase()} · {lead.source_path || '—'} · #{lead.id}
                </p>
              </div>
              <div>
                <label className="adm-label" htmlFor={`notes-${lead.id}`}>
                  Internal notes
                </label>
                <textarea id={`notes-${lead.id}`} rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
                <div className="adm-actions">
                  <button type="button" className="adm-btn adm-btn--sm" disabled={saving || notes === (lead.notes || '')} onClick={() => save({ notes })}>
                    {saving ? 'Saving…' : 'Save notes'}
                  </button>
                  {confirmDelete ? (
                    <span className="adm-confirm">
                      Delete permanently?
                      <button type="button" className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => onDelete(lead.id)}>
                        Delete
                      </button>
                      <button type="button" className="adm-link" onClick={() => setConfirmDelete(false)}>
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button type="button" className="adm-link adm-link--danger" onClick={() => setConfirmDelete(true)}>
                      Delete lead
                    </button>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Dashboard({ user, onLogout }) {
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ rows: [], total: 0, limit: 25 });
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 25 });
      if (status) params.set('status', status);
      if (query) params.set('q', query);
      const [list, st] = await Promise.all([api(`/admin/leads?${params}`), api('/admin/stats')]);
      setData(list);
      setStats(st);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return onLogout(true);
      setError(e.code === 'database_not_configured' ? 'Database is not configured (DB_* variables).' : 'Could not load leads.');
    } finally {
      setLoading(false);
    }
  }, [status, query, page, onLogout]);

  useEffect(() => {
    load();
  }, [load]);

  const pages = Math.max(1, Math.ceil(data.total / data.limit));
  const active = stats ? STATUSES.filter((s) => s !== 'spam').reduce((a, s) => a + stats.counts[s], 0) : 0;

  return (
    <div className="adm">
      <header className="adm-top">
        <Wordmark />
        <span className="adm-top__title">Leads</span>
        <span className="adm-top__user">{user.email}</span>
        <button type="button" className="adm-link" onClick={() => onLogout(false)}>
          Sign out
        </button>
      </header>

      <main className="adm-main">
        {stats && (
          <section className="adm-stats" aria-label="Pipeline">
            <div className="adm-stat adm-stat--lead">
              <span>Last 30 days</span>
              <b>{stats.last30}</b>
            </div>
            <div className="adm-stat">
              <span>Open pipeline</span>
              <b>{active}</b>
            </div>
            {STATUSES.map((s) => (
              <button
                type="button"
                key={s}
                className={`adm-stat adm-stat--btn ${status === s ? 'is-on' : ''}`}
                onClick={() => {
                  setStatus(status === s ? '' : s);
                  setPage(1);
                }}
              >
                <span>
                  <i className={`adm-dot adm-dot--${s}`} />
                  {s}
                </span>
                <b>{stats.counts[s]}</b>
              </button>
            ))}
          </section>
        )}

        <section className="adm-card">
          <form
            className="adm-filters"
            onSubmit={(e) => {
              e.preventDefault();
              setQuery(q.trim());
              setPage(1);
            }}
          >
            <input id="adm-search" type="search" placeholder="Search name, company, email, message" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search leads" />
            <select
              id="adm-filter-status"
              aria-label="Filter by status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All except spam</option>
              <option value="all">All including spam</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button type="submit" className="adm-btn adm-btn--sm">
              Search
            </button>
            <a className="adm-link" href={csvUrl({ ...(status ? { status } : {}), ...(query ? { q: query } : {}) })}>
              Export CSV
            </a>
          </form>

          {error && (
            <p className="adm-error" role="alert">
              {error}
            </p>
          )}

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Company / contact</th>
                  <th className="adm-hide-sm">Email</th>
                  <th className="adm-hide-sm">Focus</th>
                  <th className="adm-hide-sm">Received</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onChange={(updated) => {
                      setData((d) => ({ ...d, rows: d.rows.map((r) => (r.id === updated.id ? updated : r)) }));
                      api('/admin/stats').then(setStats).catch(() => {});
                    }}
                    onDelete={async (id) => {
                      await api(`/admin/leads/${id}`, { method: 'DELETE' });
                      load();
                    }}
                  />
                ))}
              </tbody>
            </table>
            {!loading && data.rows.length === 0 && (
              <p className="adm-empty">No leads match this view yet. New briefs from the contact form appear here.</p>
            )}
          </div>

          <div className="adm-pager">
            <span className="adm-num">
              {data.total} lead{data.total === 1 ? '' : 's'} · page {page} of {pages}
            </span>
            <button type="button" className="adm-link" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ← Previous
            </button>
            <button type="button" className="adm-link" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function Admin() {
  useAdminChrome();
  const [state, setState] = useState({ phase: 'loading', user: null, loginEnabled: true });

  useEffect(() => {
    api('/auth/me')
      .then(({ user }) => setState({ phase: 'in', user, loginEnabled: true }))
      .catch((e) => setState({ phase: 'out', user: null, loginEnabled: e?.data?.loginEnabled !== false }));
  }, []);

  const logout = useCallback(async (expired) => {
    if (!expired) await api('/auth/logout', { method: 'POST', body: {} }).catch(() => {});
    setState((s) => ({ ...s, phase: 'out', user: null }));
  }, []);

  if (state.phase === 'loading') return <div className="adm-login" aria-busy="true" />;
  if (state.phase === 'out')
    return <Login disabled={!state.loginEnabled} onDone={(user) => setState({ phase: 'in', user, loginEnabled: true })} />;
  return <Dashboard user={state.user} onLogout={logout} />;
}
