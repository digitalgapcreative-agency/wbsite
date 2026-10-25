/** Single source of truth for every URL, in both languages. Used by the router, nav, hreflang and the sitemap. */
export const ROUTES = [
  { key: 'home', en: '/', id: '/id', priority: 1.0 },
  { key: 'services', en: '/services', id: '/id/layanan', priority: 0.9 },
  { key: 'consultancy', en: '/consultancy', id: '/id/konsultasi', priority: 0.7 },
  { key: 'work', en: '/work', id: '/id/karya', priority: 0.8 },
  { key: 'case-mindcare', en: '/work/mindcare', id: '/id/karya/mindcare', priority: 0.7, caseSlug: 'mindcare' },
  { key: 'about', en: '/about', id: '/id/tentang', priority: 0.7 },
  { key: 'contact', en: '/contact', id: '/id/kontak', priority: 0.8 }
];

export const LOCALES = ['en', 'id'];

export function localeFromPath(pathname = '/') {
  return pathname === '/id' || pathname.startsWith('/id/') ? 'id' : 'en';
}

export function routeFromPath(pathname = '/') {
  const p = pathname.replace(/\/+$/, '') || '/';
  for (const r of ROUTES) {
    if (r.en === p) return { route: r, locale: 'en' };
    if (r.id === p) return { route: r, locale: 'id' };
  }
  return { route: null, locale: localeFromPath(p) };
}

export function pathFor(key, locale = 'en') {
  const r = ROUTES.find((x) => x.key === key);
  return r ? r[locale] : locale === 'id' ? '/id' : '/';
}
