// Datos estructurados (schema.org) y utilidades SEO del sitio. Solo datos ya públicos en el propio sitio o en
// los perfiles públicos de cada persona; sin cédulas, teléfonos personales ni datos privados.
const SITE_URL = 'https://www.ethosia.tech';
const ORG_ID = `${SITE_URL}/#organizacion`;
const MARLON_ID = `${SITE_URL}/equipo/marlon-perez#persona`;
const KARENH_ID = `${SITE_URL}/equipo#karen-herrera`;
const CLUB_ID = 'https://elclubdelaingenieria.dpdns.org/#organizacion';

const REDES_EMPRESA = [
  'https://www.facebook.com/profile.php?id=61593810909958',
  'https://www.instagram.com/ethos.ia.ec/',
  'https://www.tiktok.com/@ethos_ia_ec',
  'https://x.com/Ethos_IA_EC',
  'https://www.youtube.com/@EthosIA-ec',
  'https://github.com/ethos-ia-ec',
];

// Perfiles públicos de Marlon (todos enlazados desde su propio perfil, portafolio o GitHub).
const REDES_MARLON = [
  'https://www.linkedin.com/in/marlon-p%C3%A9rez-06ab32303/',
  'https://github.com/ing-MarlonPerez',
  'https://github.com/IngMarlonPerez',
  'https://x.com/IngMarlonPere',
  'https://www.facebook.com/IngMarlonPerez2026/',
  'https://ingmarlonperez.vercel.app/',
  'https://orcid.org/0009-0001-9166-7497',
];

const sinVacios = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== ''));

function organizacion(descripcion) {
  return sinVacios({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'ETHOSLAB S.A.S.',
    alternateName: 'Ethos IA',
    url: SITE_URL,
    logo: `${SITE_URL}/empresa/ethos-ia-logo-v2.png`,
    image: `${SITE_URL}/empresa/ethos-og-card.png`,
    description: descripcion,
    slogan: 'Inteligencia artificial ética, segura y auditable',
    foundingLocation: 'Cuenca, Ecuador',
    areaServed: ['EC', 'Latinoamérica'],
    knowsAbout: ['Inteligencia artificial ética', 'Auditoría de IA', 'Ciberseguridad', 'Automatización de procesos', 'Gobernanza de IA', 'LOPDP'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Antonio Muñoz Borrero y calle Señor de Belén',
      addressLocality: 'Cuenca',
      addressRegion: 'Azuay',
      addressCountry: 'EC',
    },
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: 'ethos.ia.ec@gmail.com', availableLanguage: 'es' },
    founder: [{ '@id': MARLON_ID }, { '@id': KARENH_ID }],
    sameAs: REDES_EMPRESA,
  });
}

function sitioWeb() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#sitio`, url: SITE_URL, name: 'Ethos IA', inLanguage: 'es', publisher: { '@id': ORG_ID } };
}

function personaMarlon() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': MARLON_ID,
    name: 'Marlon David Pérez Almachi',
    alternateName: ['Marlon Pérez', 'Ing. Marlon Pérez'],
    url: `${SITE_URL}/equipo/marlon-perez`,
    image: `${SITE_URL}/empresa/marlon-profile.jpg`,
    jobTitle: 'Gerente General y Director Técnico',
    description: 'Cofundador, Gerente General y Director Técnico de ETHOSLAB S.A.S. (Ethos IA) y fundador de El Club de la Ingeniería. Estudiante de Ingeniería en Tecnologías de la Información en la UNEMI, con enfoque en software, datos y seguridad de la información.',
    worksFor: { '@id': ORG_ID },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universidad Estatal de Milagro (UNEMI)', url: 'https://www.unemi.edu.ec/' },
    knowsAbout: ['Desarrollo web', 'React', 'Next.js', 'Ciberseguridad', 'Auditoría de TI', 'Inteligencia artificial', 'Python', 'SQL'],
    knowsLanguage: ['es', 'en'],
    nationality: { '@type': 'Country', name: 'Ecuador' },
    sameAs: REDES_MARLON,
  };
}

function personaKaren() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': KARENH_ID,
    name: 'Karen Dayanna Herrera Ruiz',
    url: `${SITE_URL}/equipo`,
    jobTitle: 'Cofundadora',
    description: 'Economista (UNEMI), cofundadora de ETHOSLAB S.A.S. Aplica su formación al cumplimiento normativo, la gobernanza societaria y la estructura financiera del grupo.',
    worksFor: { '@id': ORG_ID },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universidad Estatal de Milagro (UNEMI)' },
  };
}

function clubIngenieria() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': CLUB_ID,
    name: 'El Club de la Ingeniería',
    url: 'https://elclubdelaingenieria.dpdns.org/',
    description: 'Comunidad estudiantil de ingeniería en tecnologías de la información, ciencias e investigación: charlas técnicas, mentorías y proyectos de software, datos, ciberseguridad y redes.',
    founder: { '@id': MARLON_ID },
    sameAs: ['https://github.com/IngMarlonPerez/El-Club-de-la-Ingenier-a'],
  };
}

function migas(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.nombre, item: `${SITE_URL}${it.ruta}` })),
  };
}

// Páginas del sitio para el sitemap. `lastmod` se pasa al generar para no inventar fechas.
const RUTAS = [
  { ruta: '/', changefreq: 'weekly', priority: 1.0 },
  { ruta: '/equipo', changefreq: 'monthly', priority: 0.8 },
  { ruta: '/equipo/marlon-perez', changefreq: 'monthly', priority: 0.8 },
  { ruta: '/plataforma', changefreq: 'weekly', priority: 0.8 },
  { ruta: '/marca', changefreq: 'yearly', priority: 0.5 },
];

function sitemapXml(lastmod) {
  const filas = RUTAS.map((r) => `  <url>\n    <loc>${SITE_URL}${r.ruta === '/' ? '/' : r.ruta}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${filas.join('\n')}\n</urlset>\n`;
}

module.exports = { SITE_URL, ORG_ID, MARLON_ID, REDES_MARLON, REDES_EMPRESA, organizacion, sitioWeb, personaMarlon, personaKaren, clubIngenieria, migas, RUTAS, sitemapXml };
