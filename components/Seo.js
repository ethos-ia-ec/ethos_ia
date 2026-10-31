import Head from 'next/head';
import { SITE_URL } from '../lib/seo';

const IMAGEN_BASE = '/empresa/ethos-og-card.png';

// Metadatos por página: título, descripción, canónica, Open Graph, Twitter y datos estructurados (JSON-LD).
// `jsonld` acepta un objeto o una lista de objetos de lib/seo.js.
// `articulo` ({ autor, publicado, modificado, seccion }) añade la autoría y la fecha que leen LinkedIn, Facebook y Google.
/** @param {{ titulo: string, descripcion: string, ruta?: string, imagen?: string, imagenAlt?: string, imagenAncho?: number, imagenAlto?: number, jsonld?: any, tipo?: string, articulo?: { autor?: string, publicado?: string, modificado?: string, seccion?: string } }} props */
export default function Seo({ titulo, descripcion, ruta = '/', imagen = IMAGEN_BASE, imagenAlt, imagenAncho, imagenAlto, jsonld, tipo = 'website', articulo }) {
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
      <meta property="og:image:width" content={String(imagen === IMAGEN_BASE ? 1200 : imagenAncho ?? 1200)} />
      <meta property="og:image:height" content={String(imagen === IMAGEN_BASE ? 630 : imagenAlto ?? 630)} />
      <meta property="og:image:alt" content={imagenAlt ?? titulo} />
      {articulo?.autor && <meta name="author" content={articulo.autor} />}
      {articulo?.autor && <meta property="article:author" content={articulo.autor} />}
      {articulo?.publicado && <meta property="article:published_time" content={articulo.publicado} />}
      {articulo?.modificado && <meta property="article:modified_time" content={articulo.modificado} />}
      {articulo?.seccion && <meta property="article:section" content={articulo.seccion} />}
      <meta property="og:locale" content="es_EC" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={titulo} />
      <meta name="twitter:description" content={descripcion} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={imagenAlt ?? titulo} />
      {datos.map((d, i) => (
        <script key={`ld-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </Head>
  );
}
