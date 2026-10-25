// Prerenders every route to static HTML (real content + meta + JSON-LD for search and AI crawlers),
// then writes sitemap.xml and robots.txt. Runs as the last step of `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONT = path.resolve(__dirname, '..');
const DIST = path.join(FRONT, 'dist');
const SSR_DIR = path.join(FRONT, '.ssr');

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(path.join(DIST, 'index.html'))) fail('frontend/dist/index.html missing — client build did not run.');
const entry = ['entry-server.js', 'entry-server.mjs'].map((f) => path.join(SSR_DIR, f)).find(fs.existsSync);
if (!entry) fail('SSR bundle missing in frontend/.ssr — SSR build did not run.');

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const { render, ROUTES, site } = await import(pathToFileURL(entry).href);

const page = (url) => {
  const { html, head, lang } = render(url);
  return template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html);
};

let count = 0;
for (const r of ROUTES) {
  for (const locale of ['en', 'id']) {
    const url = r[locale];
    const out = url === '/' ? path.join(DIST, 'index.html') : path.join(DIST, url, 'index.html');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, page(url));
    count++;
  }
}
fs.writeFileSync(path.join(DIST, '404.html'), page('/404'));

// Admin shell: no server-rendered content, never indexed; the client renders /admin/*.
fs.mkdirSync(path.join(DIST, 'admin'), { recursive: true });
fs.writeFileSync(
  path.join(DIST, 'admin', 'index.html'),
  template
    .replace('<!--app-head-->', '<title>DGAP Admin</title>\n    <meta name="robots" content="noindex, nofollow" />')
    .replace('<!--app-html-->', '')
    .replace(/<div class="preloader"[\s\S]*?<\/div>\s*<\/div>/, '')
);

// sitemap.xml with hreflang alternates
const today = new Date().toISOString().slice(0, 10);
const abs = (p) => site.url + (p === '/' ? '/' : p);
const urls = ROUTES.flatMap((r) =>
  ['en', 'id'].map(
    (locale) => `  <url>
    <loc>${abs(r[locale])}</loc>
    <lastmod>${today}</lastmod>
    <priority>${(locale === 'en' ? r.priority : r.priority - 0.1).toFixed(1)}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${abs(r.en)}" />
    <xhtml:link rel="alternate" hreflang="id" href="${abs(r.id)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(r.en)}" />
  </url>`
  )
);
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
);

fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

Sitemap: ${site.url}/sitemap.xml
`
);

fs.rmSync(SSR_DIR, { recursive: true, force: true });
console.log(`SUCCESS: prerendered ${count} pages + 404, wrote sitemap.xml and robots.txt`);
