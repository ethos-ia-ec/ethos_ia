// Sitemap de Google News y RSS de Ethos Noticias, generados desde las notas publicadas.
import type { Noticia } from './noticias';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Google News solo admite notas de los últimos 2 días y como máximo 1000 URL.
export function sitemapNews(notas: Noticia[], sitio: string, ahora = new Date()): string {
  const limite = ahora.getTime() - 2 * 24 * 3600 * 1000;
  const filas = notas
    .filter((n) => new Date(`${n.fecha}T12:00:00`).getTime() >= limite)
    .slice(0, 1000)
    .map((n) => `  <url>
    <loc>${sitio}/noticias/${n.slug}</loc>
    <news:news>
      <news:publication><news:name>Ethos IA</news:name><news:language>es</news:language></news:publication>
      <news:publication_date>${n.fecha}</news:publication_date>
      <news:title>${esc(n.titulo)}</news:title>
    </news:news>
  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${filas.join('\n')}
</urlset>
`;
}

export function rss(notas: Noticia[], sitio: string): string {
  const items = notas.slice(0, 50).map((n) => `    <item>
      <title>${esc(n.titulo)}</title>
      <link>${sitio}/noticias/${n.slug}</link>
      <guid isPermaLink="true">${sitio}/noticias/${n.slug}</guid>
      <pubDate>${new Date(`${n.fecha}T12:00:00-05:00`).toUTCString()}</pubDate>
      <category>${esc(n.categoria)}</category>
      <description>${esc(n.resumen)}</description>
    </item>`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ethos Noticias</title>
    <link>${sitio}/noticias</link>
    <atom:link href="${sitio}/noticias/rss.xml" rel="self" type="application/rss+xml" />
    <description>Novedades de Ethos IA (ETHOSLAB S.A.S.)</description>
    <language>es-EC</language>
${items.join('\n')}
  </channel>
</rss>
`;
}
