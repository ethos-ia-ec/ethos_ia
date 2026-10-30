import { SITE_URL } from '../../lib/seo';
import { noticiasPublicadas } from '../../lib/noticiasDb';
import { sitemapNews } from '../../lib/noticiasFeeds';

// Se genera en cada petición (con caché del CDN) a partir de las notas publicadas.
export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
  res.write(sitemapNews(await noticiasPublicadas(), SITE_URL));
  res.end();
  return { props: {} };
}

export default function Feed() {
  return null;
}
