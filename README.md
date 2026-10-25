# Digital Gap (DGAP) — Website

Vite + React frontend (prerendered for SEO), Express + MySQL backend. Built for Hostinger Business Web Hosting (Node.js 22, no SSH).

```
package.json                 ← single package.json: build + start scripts, all dependencies
frontend/
  index.html                 ← HTML template (preloader, fonts, motion flags)
  vite.config.js
  scripts/prerender.mjs      ← writes static HTML per route + sitemap.xml + robots.txt
  public/images/             ← placeholder visuals (replace with real work — see below)
  src/
    site.config.js           ← EMAIL, WHATSAPP, SOCIALS, FOUNDER, PRICES  ← fill before launch
    routes.js                ← every URL in EN and ID
    content/en.js, id.js     ← all copy, both languages
    seo.js                   ← titles, meta, hreflang, Open Graph, JSON-LD
    pages/, components/, lib/motion.js, styles/main.css
  dist/                      ← build output (generated)
  src/admin/                 ← lead dashboard (/admin), code-split
backend/
  src/server.js              ← entry file (process.env.PORT, all interfaces)
  src/routes/api.js          ← GET /api/health, POST /api/leads
  src/routes/admin.js        ← /api/auth/* (login, logout, me) + /api/admin/* (leads, stats, CSV)
  src/session.js, auth.js    ← MySQL-backed sessions, scrypt passwords, CSRF origin check
  database/schema.sql        ← leads, sessions, admin_audit (also auto-applied on boot)
  scripts/hash-password.mjs  ← npm run admin:hash -- "passphrase"
scripts/
  verify-deploy.mjs          ← npm run verify  (checks the live site, from your computer)
  test-local.mjs             ← npm run test:local (forms, login, sessions, DB end-to-end)
  check-secrets.mjs          ← npm run check:secrets (run before zipping/pushing)
```

## Backend features
| Feature | Endpoint / place |
|---|---|
| Health check (DB, schema, sessions, mail, config warnings) | `GET /api/health` |
| Contact form → MySQL + email, validation, honeypot, 5 req/15 min per IP | `POST /api/leads` |
| Admin login (rate-limited 8 failures/15 min), sessions in MySQL, logout | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| Lead pipeline: list, search, filter, status, notes, delete, stats | `/api/admin/leads`, `/api/admin/stats` |
| CSV export (Excel-safe) | `GET /api/admin/leads.csv` |
| Audit log of logins, edits, exports, deletions | `admin_audit` table |
| Dashboard UI (noindex, not linked anywhere) | `https://digitalgapco.com/admin` |
| www → apex 301, optional http → https | `CANONICAL_HOST`, `FORCE_HTTPS` |
| Security headers (CSP, HSTS), compression, graceful shutdown | `server.js` |

## Hostinger settings

| Setting | Value |
|---|---|
| Node.js | 22 |
| Package manager | npm |
| Application type | Express |
| Build command | `build` (runs `npm run build`) |
| Output directory | `frontend/dist` |
| Entry file | `backend/src/server.js` |

All build tools are in `dependencies`, so the build works even if Hostinger installs production deps only. Do **not** upload `node_modules`.

### Environment variables
Copy from `.env.example` into hPanel → Node.js → Environment variables. `PORT` is injected by Hostinger.

Admin credentials — on your own computer, inside the unzipped project:
```
npm install
npm run admin:hash -- "a long passphrase you will remember"
```
Paste the printed `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` into hPanel, plus `ADMIN_EMAIL`. The password itself is never stored anywhere.

### Database
1. hPanel → Databases → create MySQL database + user.
2. Set `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
3. The server creates the `leads` table on boot. You can also import `backend/database/schema.sql` in phpMyAdmin.
4. Leads are read in phpMyAdmin (`leads` table, `status` column for pipeline stage).

### api.digitalgapco.com
Express serves the site **and** the API on the same domain, so the form posts to `/api/leads` on `digitalgapco.com` — no subdomain required. If you still want `api.digitalgapco.com`, point it at the same Node app and rebuild with `VITE_API_URL=https://api.digitalgapco.com`. It is already in the CORS allowlist.

## Launch checklist
Run `npm run verify` from your computer after each deploy — it checks most of this list automatically.
- [ ] `npm run build` ends with `SUCCESS: prerendered 14 pages + 404`
- [ ] `https://digitalgapco.com/api/health` → `"ok": true, "database": "connected", "schema": "ready", "sessions": "mysql", "adminLogin": true`
- [ ] Send a test brief from `/contact` → appears in `/admin` + email received
- [ ] Log in at `/admin`, change a status, refresh the page (session survives), sign out
- [ ] `digitalgapco.com`, `www.digitalgapco.com`, `/id` and a refresh on `/services` all load (no 404)
- [ ] SSL active on main domain (and api subdomain if used)
- [ ] `src/site.config.js`: email, WhatsApp, Instagram, LinkedIn, founder name, starting prices
- [ ] Submit `https://digitalgapco.com/sitemap.xml` in Google Search Console + Bing Webmaster Tools
- [ ] Create/claim a Google Business Profile (Sukabumi) with the same name, site and phone

## Replacing placeholder images
Same filename = no code change. Keep WebP, ~1600px wide, under ~250 KB.

| File | Used on | Replace with |
|---|---|---|
| `images/work/mindcare-cover.webp` | Home, Work, Mindcare case | Hero visual from the Mindcare rebrand |
| `images/work/mindcare-strategy.webp` | Mindcare case | Spread from the strategy document |
| `images/work/mindcare-identity.webp` | Mindcare case | Identity / palette / logo sheet |
| `images/services/*.webp` (5) | Services, home hover | Work samples per service |
| `images/consultancy/structure.webp` | Consultancy | Workshop / process mapping photo |
| `images/about/studio.webp` | About | Founder or team photo (strong trust signal) |
| `images/og/og-default.jpg` (1200×630) | Social shares | Branded share image |

Logo: the header uses a placeholder SVG wordmark (`Wordmark` in `components/ui.jsx`). Swap in the Brown Sugar logo as an SVG there.

## Adding a case study
1. Add an entry under `cases` in `content/en.js` and `content/id.js` (copy `mindcare`).
2. Add a route in `src/routes.js` (`{ key: 'case-slug', en: '/work/slug', id: '/id/karya/slug', caseSlug: 'slug' }`).
3. Map it in `App.jsx` (`PAGES`) and `pages/Work.jsx` (`CASE_ROUTES`). The sitemap updates on build.

## Local development
```
npm install
npm run dev:api        # Express on :3000
npm run dev            # Vite on :5173 (proxies /api)
npm run build && npm start
```
