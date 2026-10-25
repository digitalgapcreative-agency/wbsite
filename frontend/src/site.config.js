/**
 * Business details used across the site, schema.org data and the footer.
 * Fill the empty values before launch — anything left empty is simply not rendered.
 */
export const site = {
  name: 'Digital Gap',
  shortName: 'DGAP',
  legalName: 'Digital Gap',
  url: (import.meta.env.VITE_SITE_URL || 'https://digitalgapco.com').replace(/\/$/, ''),
  apiUrl: (import.meta.env.VITE_API_URL || '').replace(/\/$/, ''),
  tagline: 'Building brands with structure',

  // Contact — verify before launch
  email: 'hello@digitalgapco.com',
  whatsapp: '', // digits only, with country code, e.g. '6281234567890'
  instagram: '', // full URL, e.g. 'https://www.instagram.com/digitalgapco'
  linkedin: '', // full URL

  founder: {
    name: '', // shown on About + used in schema.org (strong E-E-A-T signal)
    role: { en: 'Founder & Strategy Lead', id: 'Pendiri & Lead Strategi' },
    linkedin: ''
  },

  address: {
    locality: 'Sukabumi',
    region: 'West Java',
    country: 'ID'
  },
  areaServed: ['Indonesia', 'Mozambique'],
  languages: ['English', 'Bahasa Indonesia', 'Português'],

  /**
   * Brands DGAP has worked with. Shown on the Services page.
   * logo: path to an SVG/PNG in public/images/clients/ (null = typographic name).
   * services: keys from content `services` — the service rows list these brands under "Applied for".
   */
  clients: [
    { name: 'Mindcare', logo: null, services: ['diagnosis', 'strategy', 'identity', 'marketing', 'website'], caseKey: 'case-mindcare' },
    { name: 'Bolleno', logo: null, services: ['strategy', 'identity'] },
    { name: 'Yarnbe', logo: null, services: [] },
    { name: 'Courve', logo: null, services: [] }
  ],

  /**
   * Starting prices in IDR (numbers). null = shows "Quoted after the diagnostic call".
   * Research: visible starting prices filter and pre-qualify B2B leads — set these when ready.
   */
  pricing: {
    diagnosis: null,
    strategy: null,
    identity: null,
    marketing: null,
    website: null
  }
};

export const formatIDR = (n) =>
  'Rp ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
