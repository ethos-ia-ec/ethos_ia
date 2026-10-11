import Head from 'next/head';
import { SITE_URL } from '../lib/seo';

const IMAGEN_BASE = '/empresa/ethos-og-card.png';

// Metadatos por página: título, descripción, canónica, Open Graph, Twitter y datos estructurados (JSON-LD).
// `jsonld` acepta un objeto o una lista de objetos de lib/seo.js.
export default function Seo({ titulo, descripcion, ruta = '/', imagen = IMAGEN_BASE, jsonld, tipo = 'website' }) {
  const url = `${SITE_URL}${ruta === '/' ? '' : ruta}`;
  const img = imagen.startsWith('http') ? imagen : `${SITE_URL}${imagen}`;
  const datos = !jsonld ? [] : Array.isArray(jsonld) ? jsonld : [jsonld];
  const verificacion = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  return (
    <Head>
      <title>{titulo}</title>
      <meta name="description" content={descripcion} />
      <link rel="canonical" href={url} />
      {verificacion && <meta name="google-site-verification" content={verificacion} />}
      <meta property="og:type" content={tipo} />
      <meta property="og:site_name" content="Ethos IA" />
      <meta property="og:title" content={titulo} />
      <meta property="og:description" content={descripcion} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      {imagen === IMAGEN_BASE && <meta property="og:image:width" content="1200" />}
      {imagen === IMAGEN_BASE && <meta property="og:image:height" content="630" />}
      <meta property="og:locale" content="es_EC" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={titulo} />
      <meta name="twitter:description" content={descripcion} />
      <meta name="twitter:image" content={img} />
      {datos.map((d, i) => (
        <script key={`ld-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </Head>
  );
}
