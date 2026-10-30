import Header from '../../components/home/Header';
import Seo from '../../components/Seo';
import { migas } from '../../lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { fechaLarga, type Noticia } from '../../lib/noticias';
import { noticiaPublicada, noticiasPublicadas } from '../../lib/noticiasDb';
import VideoLiviano from '../../components/noticias/VideoLiviano';

// ISR: las notas se generan al pedirse y se renuevan solas; al publicar, /api/prensa/revalidar las refresca al instante.
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await noticiasPublicadas()).slice(0, 30).map((n) => ({ params: { slug: n.slug } })),
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<{ n: Noticia }> = async ({ params }) => {
  const n = await noticiaPublicada(String(params?.slug));
  return n ? { props: { n }, revalidate: 300 } : { notFound: true, revalidate: 60 };
};

export default function NotaNoticia({ n }: { n: Noticia }) {
  const ruta = `/noticias/${n.slug}`;
  const articulo = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: n.titulo,
    datePublished: n.fecha,
    dateModified: n.actualizada ?? n.fecha,
    ...(n.autor ? { author: { '@type': 'Person', name: n.autor } } : { author: { '@type': 'Organization', name: 'Ethos IA' } }),
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

      <div className="portada-fondo"><header className="portada">
        <div className="pt-txt">
          <Link href="/noticias" className="volver">← Ethos Noticias</Link>
          <span className="pt-sello">{n.destacada?.sello ?? n.categoria}</span>
          <h1 className="pt-h1">{n.titulo}</h1>
          <p className="pt-bajada">{n.resumen}</p>
          <span className="pt-meta">{n.autor ? `Por ${n.autor} · ` : ''}<time dateTime={n.fecha}>{fechaLarga(n.fecha)}</time></span>
        </div>
        <figure className="pt-tapa">
          <Image src={n.imagen.src} alt={n.imagen.alt} width={n.imagen.ancho} height={n.imagen.alto} sizes="(max-width: 860px) 100vw, 50vw" priority />
        </figure>
      </header></div>
      {n.destacada && (
        <div className="pt-cifras">{n.destacada.cifras.map((c) => <div key={c.valor}><b>{c.valor}</b><span>{c.texto}</span></div>)}</div>
      )}

      <main className="cuerpo">
        <article className="nota revista">
          {n.cuerpo.map((b, i) => {
            if (b.tipo === 'h2') return <h2 key={i}>{b.texto}</h2>;
            if (b.tipo === 'lista') return <ul key={i}>{b.items.map((t) => <li key={t}>{t}</li>)}</ul>;
            if (b.tipo === 'imagen') return (
              <figure key={i} className="foto">
                <Image src={b.src} alt={b.alt} width={b.ancho} height={b.alto} sizes="(max-width: 760px) 100vw, 720px" />
                {(b.pie || b.credito) && <figcaption>{b.pie}{b.credito ? ` Foto: ${b.credito}.` : ''}</figcaption>}
              </figure>
            );
            if (b.tipo === 'video') return <VideoLiviano key={i} proveedor={b.proveedor} id={b.id} titulo={b.titulo} poster={b.poster} />;
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
        .portada { display: grid; grid-template-columns: 1fr auto; gap: 48px; align-items: center; max-width: 1280px; min-height: 100svh; box-sizing: border-box; margin: 0 auto; padding: 96px 32px 24px; color: #eef3f6; }
        .portada-fondo { background: radial-gradient(110% 90% at 85% 10%, #123a3c 0%, #0a0f1a 60%); }
        .pt-tapa { margin: 0; min-width: 0; }
        .pt-tapa :global(img) { width: min(100%, calc((100svh - 120px) * 0.8)); height: auto; display: block; margin: 0 auto; border-radius: 6px; box-shadow: 0 40px 80px rgba(0,0,0,0.55); }
        .portada :global(.pt-img) { object-fit: cover; object-position: top; opacity: 0.55; transform: scale(1.04); }
        .pt-velo { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,15,26,0.35) 0%, rgba(10,15,26,0.75) 45%, #0a0f1a 100%); }
        .pt-txt { position: relative; }
        .pt-txt :global(.volver) { display: block; width: fit-content; color: #8fa89c; font-size: 13px; margin-bottom: 26px; }
        .pt-sello { display: inline-block; background: #e8b23a; color: #0a0f1a; font: 700 11px 'IBM Plex Mono', monospace; letter-spacing: .18em; text-transform: uppercase; padding: 6px 12px; border-radius: 4px; }
        .pt-h1 { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(1.8rem, min(3.6vw, 6vh), 3.6rem); line-height: 1.08; letter-spacing: -0.015em; margin: 18px 0 18px; color: #fff; text-wrap: balance; max-width: 26ch; }
        .pt-bajada { font-size: clamp(0.95rem, min(1.4vw, 2.3vh), 1.2rem); line-height: 1.6; color: #cfdce3; max-width: 62ch; margin: 0 0 22px; }
        .pt-meta { font: 500 12px 'IBM Plex Mono', monospace; letter-spacing: .08em; color: #2fd8c9; text-transform: uppercase; }
        .pt-cifras { max-width: 980px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(238,243,246,0.12); border-radius: 0 0 16px 16px; overflow: hidden; position: relative; z-index: 1; }
        .pt-cifras div { background: #0f1726; padding: 22px 20px; }
        .pt-cifras b { display: block; font-family: Georgia, serif; font-size: clamp(1.6rem, 3vw, 2.3rem); color: #2fd8c9; margin-bottom: 6px; }
        .pt-cifras div:nth-child(2) b { color: #e8b23a; }
        .pt-cifras span { font-size: 13px; line-height: 1.45; color: #b7c6cd; }
        .revista { margin-top: 56px; background: #fffdf8; border-color: rgba(232,178,58,0.25); border-radius: 4px; padding: 44px 52px 48px; }
        .revista p, .revista li { font-size: 17.5px; line-height: 1.85; color: #2a3540; }
        .revista h2::before { content: ''; display: block; width: 44px; height: 3px; background: #e8b23a; margin-bottom: 14px; }
        .revista .fuentes h2::before { display: none; }
        .revista .foto figcaption { font-family: Georgia, serif; font-style: italic; }
        .revista > p:first-child::first-letter { float: left; font-family: Georgia, serif; font-size: 4.2rem; line-height: 0.85; padding: 6px 10px 0 0; color: #186a63; font-weight: 700; }
        .revista h2 { font-family: Georgia, serif; font-size: 1.7rem; line-height: 1.25; margin: 40px 0 12px; color: #0a0f1a; }
        .revista .fuentes h2 { font-family: inherit; font-size: 13px; }
        .revista blockquote { border-left-color: #e8b23a; background: transparent; padding: 8px 0 8px 22px; }
        .revista blockquote p { font-family: Georgia, serif; font-style: italic; font-size: 1.45rem; line-height: 1.45; }
        @media (max-width: 600px) { .revista { padding: 24px 18px 28px; } .revista p, .revista li { font-size: 16.5px; } }
        @media (max-width: 860px) { .portada { grid-template-columns: 1fr; min-height: 0; padding: 88px 16px 40px; gap: 32px; } .pt-tapa { order: -1; } }
        @media (max-width: 760px) { .pt-cifras { grid-template-columns: repeat(2, 1fr); border-radius: 0; } }
        @media (max-width: 400px) { .pt-cifras { grid-template-columns: 1fr; } }
        .cuerpo { max-width: 760px; margin: -48px auto 0; padding: 0 24px 72px; }
        .nota { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: 16px; padding: 28px 36px 36px; box-shadow: 0 18px 40px rgba(5,17,30,0.08); }
        figure { margin: 0 0 24px; border-radius: 12px; overflow: hidden; }
        .foto figcaption { font-size: 13px; color: var(--c-texto-3); margin-top: 8px; }
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

          .cuerpo { padding: 0 16px 56px; }
          .nota { padding: 18px 18px 24px; }
          .foot { padding-left: 16px; padding-right: 16px; }
        }
      `}</style>
    </div>
  );
}
