import Header from '../../components/home/Header';
import Seo from '../../components/Seo';
import { migas } from '../../lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NOTICIAS, fechaLarga, noticiaPorSlug, type Noticia } from '../../lib/noticias';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: NOTICIAS.map((n) => ({ params: { slug: n.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ n: Noticia }> = async ({ params }) => {
  const n = noticiaPorSlug(String(params?.slug));
  return n ? { props: { n } } : { notFound: true };
};

export default function NotaNoticia({ n }: { n: Noticia }) {
  const ruta = `/noticias/${n.slug}`;
  const articulo = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: n.titulo,
    datePublished: n.fecha,
    image: [n.imagenSocial ?? n.imagen.src],
    publisher: { '@type': 'Organization', name: 'Ethos IA (ETHOSLAB S.A.S.)' },
  };
  return (
    <div className="app" id="contenido-principal">
      <Seo
        titulo={`${n.titulo} | Ethos Noticias`}
        descripcion={n.resumen}
        ruta={ruta}
        imagen={n.imagenSocial ?? n.imagen.src}
        tipo="article"
        jsonld={[articulo, migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Ethos Noticias', ruta: '/noticias' }, { nombre: n.titulo, ruta }])]}
      />
      <Header />

      <header className="hero">
        <Link href="/noticias" className="volver">← Ethos Noticias</Link>
        <span className="meta">{n.categoria} · <time dateTime={n.fecha}>{fechaLarga(n.fecha)}</time></span>
        <h1>{n.titulo}</h1>
        <p>{n.resumen}</p>
      </header>

      <main className="cuerpo">
        <article className="nota">
          <figure>
            <Image src={n.imagen.src} alt={n.imagen.alt} width={n.imagen.ancho} height={n.imagen.alto} sizes="(max-width: 760px) 100vw, 720px" priority />
          </figure>
          {n.cuerpo.map((b, i) => {
            if (b.tipo === 'h2') return <h2 key={i}>{b.texto}</h2>;
            if (b.tipo === 'lista') return <ul key={i}>{b.items.map((t) => <li key={t}>{t}</li>)}</ul>;
            if (b.tipo === 'cita') return <blockquote key={i}><p>«{b.texto}»</p><cite>{b.autor}</cite></blockquote>;
            return <p key={i}>{b.texto}</p>;
          })}
          {n.fuentes.length > 0 && (
            <aside className="fuentes">
              <h2>Fuentes</h2>
              <ul>{n.fuentes.map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer">{f.texto}</a></li>)}</ul>
            </aside>
          )}
        </article>
      </main>

      <footer className="foot">
        <span>Ethos IA es una marca de ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador</span>
        <span>© 2026 ETHOSLAB S.A.S.</span>
      </footer>

      <style jsx>{`
        .app { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; }
        .hero { background: var(--c-azul); color: var(--c-claro); padding: 120px 48px 88px; }
        .hero > * { max-width: 760px; margin-left: auto; margin-right: auto; }
        .hero :global(.volver) { display: block; color: var(--c-claro-2); font-size: 13px; margin-bottom: 22px; }
        .meta { display: block; font-size: 12px; letter-spacing: 0.08em; color: var(--c-cian); }
        h1 { font-size: clamp(1.6rem, 3vw, 2.3rem); line-height: 1.25; margin-top: 12px; text-wrap: balance; }
        .hero p { color: var(--c-claro-2); line-height: 1.7; margin-top: 16px; }
        .cuerpo { max-width: 760px; margin: -48px auto 0; padding: 0 24px 72px; }
        .nota { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: 16px; padding: 28px 36px 36px; box-shadow: 0 18px 40px rgba(5,17,30,0.08); }
        figure { margin: 0 0 24px; border-radius: 12px; overflow: hidden; }
        figure :global(img) { width: 100%; height: auto; display: block; }
        .nota p, .nota li { font-size: 16px; line-height: 1.8; color: var(--c-texto-2); }
        .nota h2 { font-size: 1.25rem; margin: 32px 0 8px; }
        .nota ul { padding-left: 20px; }
        .nota li { margin-bottom: 8px; }
        blockquote { margin: 28px 0; padding: 18px 22px; border-left: 4px solid var(--c-cian); background: var(--c-claro); border-radius: 0 12px 12px 0; }
        blockquote p { font-size: 1.1rem; color: var(--c-texto); margin: 0; }
        cite { display: block; margin-top: 8px; font-size: 13px; font-style: normal; color: var(--c-texto-3); }
        .fuentes { margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--c-borde); }
        .fuentes h2 { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--c-texto-3); margin: 0 0 8px; }
        .fuentes a { color: var(--c-teal); font-weight: 600; }
        .foot { background: var(--c-azul-profundo); color: var(--c-apagado); padding: 28px 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; }
        @media (max-width: 600px) {
          .hero { padding: 104px 16px 72px; }
          .cuerpo { padding: 0 16px 56px; }
          .nota { padding: 18px 18px 24px; }
          .foot { padding-left: 16px; padding-right: 16px; }
        }
      `}</style>
    </div>
  );
}
