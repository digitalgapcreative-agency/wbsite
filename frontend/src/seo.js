import { DICTS } from './i18n.js';
import { routeFromPath, ROUTES, pathFor } from './routes.js';
import { site } from './site.config.js';

const abs = (p) => site.url + (p === '/' ? '/' : p);
const OG_IMAGE = '/images/og/og-default.jpg';

function organization(locale) {
  const t = DICTS[locale];
  const org = {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${site.url}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    url: site.url + '/',
    logo: `${site.url}/favicon.svg`,
    image: site.url + OG_IMAGE,
    slogan: site.tagline,
    description: t.meta.home.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country
    },
    areaServed: site.areaServed.map((name) => ({ '@type': 'Country', name })),
    knowsLanguage: ['en', 'id', 'pt'],
    knowsAbout: [
      'Brand strategy',
      'Brand identity',
      'Marketing strategy',
      'Content strategy',
      'Website design and development',
      'Search engine optimisation',
      'Business architecture',
      'Process design'
    ],
    priceRange: '$$'
  };
  if (site.email) org.email = site.email;
  if (site.whatsapp) org.telephone = '+' + site.whatsapp;
  const sameAs = [site.instagram, site.linkedin].filter(Boolean);
  if (sameAs.length) org.sameAs = sameAs;
  if (site.founder.name) {
    org.founder = {
      '@type': 'Person',
      name: site.founder.name,
      jobTitle: site.founder.role.en,
      ...(site.founder.linkedin ? { sameAs: [site.founder.linkedin] } : {})
    };
  }
  return org;
}

function breadcrumb(route, locale) {
  const t = DICTS[locale];
  const items = [{ name: 'DGAP', url: abs(pathFor('home', locale)) }];
  if (route.key === 'case-mindcare') {
    items.push({ name: t.nav.work, url: abs(pathFor('work', locale)) });
    items.push({ name: t.cases.mindcare.client, url: abs(route[locale]) });
  } else if (route.key !== 'home') {
    items.push({ name: t.nav[route.key] || route.key, url: abs(route[locale]) });
  }
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url }))
  };
}

function faqPage(locale) {
  return {
    '@type': 'FAQPage',
    mainEntity: DICTS[locale].faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}

function serviceCatalog(locale) {
  const t = DICTS[locale];
  return {
    '@type': 'OfferCatalog',
    name: t.servicesPage.listTitle,
    itemListElement: Object.entries(t.services).map(([key, s]) => ({
      '@type': 'Offer',
      ...(site.pricing[key]
        ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: site.pricing[key], priceCurrency: 'IDR' } }
        : {}),
      itemOffered: {
        '@type': 'Service',
        name: s.name,
        description: s.summary,
        provider: { '@id': `${site.url}/#organization` },
        areaServed: site.areaServed
      }
    }))
  };
}

/** Returns a list of head element descriptors. Rendered to a string for prerendering and applied to the DOM on navigation. */
export function headFor(pathname) {
  const { route, locale } = routeFromPath(pathname);
  const t = DICTS[locale];
  const meta = route ? t.meta[route.key] : t.meta.notFound;
  const url = route ? abs(route[locale]) : abs(pathname);
  const image = site.url + OG_IMAGE;

  const tags = [
    { tag: 'title', text: meta.title },
    { tag: 'meta', attrs: { name: 'description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'robots', content: route ? 'index, follow, max-image-preview:large' : 'noindex' } },
    { tag: 'meta', attrs: { property: 'og:type', content: route?.key === 'case-mindcare' ? 'article' : 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: site.name } },
    { tag: 'meta', attrs: { property: 'og:title', content: meta.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:locale', content: t.ogLocale } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: meta.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } }
  ];

  if (route) {
    tags.push({ tag: 'link', attrs: { rel: 'canonical', href: url } });
    tags.push({ tag: 'link', attrs: { rel: 'alternate', hreflang: 'en', href: abs(route.en) } });
    tags.push({ tag: 'link', attrs: { rel: 'alternate', hreflang: 'id', href: abs(route.id) } });
    tags.push({ tag: 'link', attrs: { rel: 'alternate', hreflang: 'x-default', href: abs(route.en) } });

    const graph = [
      organization(locale),
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url + '/',
        name: site.name,
        publisher: { '@id': `${site.url}/#organization` },
        inLanguage: ['en', 'id']
      },
      {
        '@type': route.key === 'case-mindcare' ? 'Article' : route.key === 'contact' ? 'ContactPage' : route.key === 'about' ? 'AboutPage' : 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: meta.title,
        description: meta.description,
        inLanguage: locale,
        isPartOf: { '@id': `${site.url}/#website` },
        ...(route.key === 'case-mindcare'
          ? { headline: t.cases.mindcare.headline, image: site.url + t.cases.mindcare.cover, author: { '@id': `${site.url}/#organization` } }
          : { about: { '@id': `${site.url}/#organization` } })
      },
      breadcrumb(route, locale)
    ];
    if (route.key === 'home' || route.key === 'services') graph.push(faqPage(locale));
    if (route.key === 'services') graph.push(serviceCatalog(locale));

    tags.push({
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      text: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
    });
  }
  return { tags, lang: t.htmlLang };
}

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function headToString(tags) {
  return tags
    .map(({ tag, attrs = {}, text }) => {
      const a = Object.entries(attrs)
        .map(([k, v]) => ` ${k}="${escAttr(v)}"`)
        .join('');
      if (tag === 'meta' || tag === 'link') return `<${tag} data-seo${a} />`;
      const body = tag === 'script' ? String(text).replace(/</g, '\\u003c') : escText(text);
      return `<${tag} data-seo${a}>${body}</${tag}>`;
    })
    .join('\n    ');
}

export function applyHead(pathname) {
  if (typeof document === 'undefined') return;
  const { tags, lang } = headFor(pathname);
  document.documentElement.lang = lang;
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
  const anchor = document.head.querySelector('meta[name="theme-color"]');
  const frag = document.createDocumentFragment();
  for (const { tag, attrs = {}, text } of tags) {
    const el = document.createElement(tag);
    el.setAttribute('data-seo', '');
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (text) el.textContent = text;
    frag.appendChild(el);
  }
  if (anchor && anchor.nextSibling) document.head.insertBefore(frag, anchor.nextSibling);
  else document.head.appendChild(frag);
}

export { ROUTES };
