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
  email: 'agency@digitalgapco.com',
  whatsapp: '6282311844027', // digits only, with country code, e.g. '6281234567890'
  instagram: 'https://www.instagram.com/digitalgapstrategic?srtk=MXRkcG5tZnFiOGhzNw==',
  facebook: 'https://www.facebook.com/profile.php?id=61588452839545',
  linkedin: 'https://www.linkedin.com/company/digitalgap-mz/', // full URL

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
    { name: 'Bolleno', logo: null, services: ['strategy', 'identity'], caseKey: 'case-bolleno' },
    { name: 'Courve', logo: null, services: ['strategy', 'identity'], caseKey: 'case-courve' },
    { name: 'Yarnbe', logo: null, services: ['identity'], caseKey: 'case-yarnbe' }
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
