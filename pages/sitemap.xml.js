import { sitemapXml } from '../lib/seo';
import { noticiasPublicadas } from '../lib/noticiasDb';

// Sitemap generado en cada petición (con caché del CDN) para que siempre liste todas las páginas.
export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  const notas = (await noticiasPublicadas()).map((n) => ({ ruta: `/noticias/${n.slug}`, changefreq: 'yearly', priority: 0.6 }));
  res.write(sitemapXml(new Date().toISOString().slice(0, 10), notas));
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
