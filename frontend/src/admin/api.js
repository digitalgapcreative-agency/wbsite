import { site } from '../site.config.js';

export class ApiError extends Error {
  constructor(status, code, data = {}) {
    super(code || `HTTP ${status}`);
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${site.apiUrl}/api${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error, data);
  return data;
}

export const csvUrl = (params) => `${site.apiUrl}/api/admin/leads.csv?${new URLSearchParams(params)}`;
