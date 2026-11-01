import Header from '../../components/home/Header';
import Seo from '../../components/Seo';
import { migas, SITE_URL } from '../../lib/seo';
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
    datePublished: `${n.fecha}T11:00:00-05:00`,
    dateModified: `${n.actualizada ?? n.fecha}T11:00:00-05:00`,
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
        imagenAlt={n.imagen.alt}
        imagenAncho={n.imagenSocial ? 1200 : n.imagen.ancho}
        imagenAlto={n.imagenSocial ? 630 : n.imagen.alto}
        articulo={{ autor: n.autor ?? 'Ethos IA', publicado: `${n.fecha}T11:00:00-05:00`, modificado: `${n.actualizada ?? n.fecha}T11:00:00-05:00`, seccion: n.categoria }}
        jsonld={[articulo, migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Ethos Noticias', ruta: '/noticias' }, { nombre: n.titulo, ruta }])]}
      />
      <div className="no-imprimir"><Header /></div>

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
        <aside className="ficha" aria-label="Datos del reportaje">
          <span className="fi-tit">{n.destacada ? 'Reportaje' : 'Nota'}</span>
          {n.autor && <p><b>Autores</b>{n.autor}</p>}
          <p><b>Publicado</b><time dateTime={n.fecha}>{fechaLarga(n.fecha)}</time></p>
          <p><b>Sección</b>{n.categoria}</p>
          {n.fuentes.length > 0 && <p><b>Fuentes</b><a href="#fuentes">{n.fuentes.length} referencias verificables</a></p>}
          <div className="fi-compartir">
            <b>Compartir</b>
            <a href={`https://wa.me/?text=${encodeURIComponent(`${n.titulo} ${SITE_URL}${ruta}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL + ruta)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={`https://x.com/intent/post?url=${encodeURIComponent(SITE_URL + ruta)}&text=${encodeURIComponent(n.titulo)}`} target="_blank" rel="noopener noreferrer">X</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL + ruta)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
          {/* El PDF sale de la impresión del navegador; la hoja @media print maqueta la nota como periódico. */}
          <button type="button" className="fi-pdf" onClick={() => window.print()}>Descargar en PDF</button>
        </aside>
        <article className="revista">
          {n.cuerpo.map((b, i) => {
            if (b.tipo === 'h2') return <h2 key={i}>{b.texto}</h2>;
            if (b.tipo === 'lista') return <ul key={i}>{b.items.map((t) => <li key={t}>{t}</li>)}</ul>;
            if (b.tipo === 'imagen') return (
              <figure key={i} className="foto">
                <Image src={b.src} alt={b.alt} width={b.ancho} height={b.alto} sizes="(max-width: 860px) 100vw, 70vw" />
                {(b.pie || b.credito) && <figcaption>{b.pie}{b.credito ? ` Foto: ${b.credito}.` : ''}</figcaption>}
              </figure>
            );
            if (b.tipo === 'video') return <div key={i} className="ancho"><VideoLiviano proveedor={b.proveedor} id={b.id} titulo={b.titulo} poster={b.poster} /></div>;
            if (b.tipo === 'cita') return <blockquote key={i}><p>«{b.texto}»</p><cite>{b.autor}</cite></blockquote>;
            return <p key={i}>{b.texto}</p>;
          })}
          {n.fuentes.length > 0 && (
            <aside className="fuentes" id="fuentes">
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
        .app { --ancho: min(calc(100vw - 32px), calc(min(92vw, 2600px) - 64px)); min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; }
        .portada { display: grid; grid-template-columns: 1fr auto; gap: 48px; align-items: center; max-width: min(92vw, 2600px); min-height: var(--alto); box-sizing: border-box; margin: 0 auto; padding: 96px 32px 24px; color: #eef3f6; }
        .portada-fondo { background: radial-gradient(110% 90% at 85% 10%, #123a3c 0%, #0a0f1a 60%); }
        .pt-tapa { margin: 0; min-width: 0; }
        .pt-tapa { width: min(46vw, calc((var(--alto) - 120px) * 0.8)); }
        .pt-tapa :global(img) { width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 6px; box-shadow: 0 40px 80px rgba(0,0,0,0.55); }
        .portada :global(.pt-img) { object-fit: cover; object-position: top; opacity: 0.55; transform: scale(1.04); }
        .pt-velo { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,15,26,0.35) 0%, rgba(10,15,26,0.75) 45%, #0a0f1a 100%); }
        .pt-txt { position: relative; }
        .pt-txt :global(.volver) { display: block; width: fit-content; color: #8fa89c; font-size: 13px; margin-bottom: 26px; }
        .pt-sello { display: inline-block; background: #e8b23a; color: #0a0f1a; font: 700 clamp(11px, 0.6vw, 20px) 'IBM Plex Mono', monospace; letter-spacing: .18em; text-transform: uppercase; padding: 0.5em 1em; border-radius: 4px; }
        .pt-h1 { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(1.8rem, min(3vw, 4.6vh), 6.5rem); line-height: 1.1; letter-spacing: -0.015em; margin: 18px 0 18px; color: #fff; text-wrap: balance; max-width: 30ch; }
        .pt-bajada { font-size: clamp(0.95rem, min(1.4vw, 2.3vh), 2.2rem); line-height: 1.6; color: #cfdce3; max-width: 62ch; margin: 0 0 22px; }
        .pt-meta { font: 500 clamp(12px, 0.65vw, 22px) 'IBM Plex Mono', monospace; letter-spacing: .08em; color: #2fd8c9; text-transform: uppercase; }
        .pt-cifras { width: var(--ancho); margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(238,243,246,0.12); border-radius: 0 0 16px 16px; overflow: hidden; position: relative; z-index: 1; }
        .pt-cifras div { background: #0f1726; padding: clamp(18px, 1.6vw, 48px); }
        .pt-cifras b { display: block; font-family: Georgia, serif; font-size: clamp(1.6rem, 2.6vw, 4.5rem); color: #2fd8c9; margin-bottom: 6px; }
        .pt-cifras div:nth-child(2) b { color: #e8b23a; }
        .pt-cifras span { font-size: clamp(13px, 0.75vw, 24px); line-height: 1.45; color: #b7c6cd; }
        @media (max-width: 860px) { .app { --ancho: calc(100% - 32px); } .pt-tapa { width: min(100%, calc((var(--alto) - 120px) * 0.8)); justify-self: center; } .portada { grid-template-columns: 1fr; min-height: 0; padding: 88px 16px 40px; gap: 32px; } .pt-tapa { order: -1; } }
        @media (max-width: 760px) { .pt-cifras { grid-template-columns: repeat(2, 1fr); border-radius: 0; } }
        @media (max-width: 400px) { .pt-cifras { grid-template-columns: 1fr; } }
        .app { background: #f7f3ec; }
        .cuerpo { width: var(--ancho); margin: 0 auto; padding: clamp(40px, 5vw, 120px) 0 clamp(56px, 6vw, 140px); display: grid; grid-template-columns: clamp(200px, 15vw, 420px) minmax(0, 1fr); gap: clamp(32px, 4vw, 120px); align-items: start; }
        .ficha { position: sticky; top: 104px; border-top: 3px solid #0a0f1a; padding-top: 16px; font-size: clamp(13px, 0.72vw, 22px); color: #3c4954; }
        .fi-tit { display: block; font: 700 clamp(11px, 0.6vw, 20px) 'IBM Plex Mono', monospace; letter-spacing: .18em; text-transform: uppercase; color: #186a63; margin-bottom: 14px; }
        .ficha p { margin: 0 0 14px; line-height: 1.5; }
        .ficha b, .fi-compartir b { display: block; font: 600 clamp(10px, 0.55vw, 18px) 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: #8a6a1f; margin-bottom: 3px; }
        .ficha a { color: #0a0f1a; text-decoration: underline; text-decoration-color: #e8b23a; text-underline-offset: 3px; }
        .fi-compartir { border-top: 1px solid rgba(10,15,26,0.12); padding-top: 14px; display: flex; flex-wrap: wrap; gap: 6px 14px; }
        .fi-compartir b { flex-basis: 100%; }
        .revista { display: grid; grid-template-columns: minmax(0, 1fr) min(100%, 68ch) minmax(0, 1fr); font-size: clamp(17px, 0.95vw, 30px); }
        .revista > :global(*) { grid-column: 2; }
        .revista > .foto, .revista > blockquote, .revista > .ancho { grid-column: 1 / -1; }
        .revista p, .revista li { font-size: 1em; line-height: 1.85; color: #2a3540; margin: 0 0 1.1em; }
        .revista ul { padding-left: 1.2em; margin: 0 0 1.2em; }
        .revista > p:first-child::first-letter { float: left; font-family: Georgia, serif; font-size: 4.4em; line-height: 0.85; padding: 0.08em 0.12em 0 0; color: #186a63; font-weight: 700; }
        .revista h2 { font-family: Georgia, serif; font-size: 1.75em; line-height: 1.22; margin: 1.6em 0 0.5em; color: #0a0f1a; }
        .revista h2::before { content: ''; display: block; width: 44px; height: 3px; background: #e8b23a; margin-bottom: 14px; }
        .revista .foto { margin: 2em 0; }
        .revista .foto :global(img) { border-radius: 4px; box-shadow: 0 24px 60px rgba(5,17,30,0.16); }
        .revista .foto figcaption { font-family: Georgia, serif; font-style: italic; font-size: 0.85em; color: #5b6872; margin-top: 10px; max-width: 68ch; }
        .revista blockquote { margin: 1.6em 0; padding: 0.6em 0 0.6em 0.9em; border-left: 5px solid #e8b23a; }
        .revista blockquote p { font-family: Georgia, serif; font-style: italic; font-size: clamp(1.5em, 2.4vw, 2.4em); line-height: 1.3; color: #0a0f1a; max-width: 30ch; margin: 0; }
        .revista cite { display: block; margin-top: 12px; font: 600 0.7em 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; font-style: normal; color: #186a63; }
        .fuentes { margin-top: 2em; padding-top: 1em; border-top: 1px solid rgba(10,15,26,0.15); }
        .fuentes h2 { font-family: 'IBM Plex Mono', monospace; font-size: 0.75em; letter-spacing: .14em; text-transform: uppercase; color: #5b6872; margin: 0 0 0.6em; }
        .fuentes h2::before { display: none; }
        .fuentes li { font-size: 0.9em; }
        .fuentes a { color: #186a63; font-weight: 600; }
        @media (max-width: 1100px) { .cuerpo { grid-template-columns: 1fr; } .ficha { position: static; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0 20px; } .fi-tit, .fi-compartir { grid-column: 1 / -1; } }
        figure { margin: 0; }
        figure :global(img) { width: 100%; height: auto; display: block; }
        .foot { background: var(--c-azul-profundo); color: var(--c-apagado); padding: 28px 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; }
        @media (max-width: 600px) {

          .foot { padding-left: 16px; padding-right: 16px; }
        }
        .fi-pdf { margin-top: 14px; width: 100%; background: #0a0f1a; color: #eef3f6; border: 0; border-radius: 999px; padding: 10px 16px; font: 600 clamp(12px, 0.65vw, 20px) 'IBM Plex Mono', monospace; letter-spacing: .06em; cursor: pointer; }
        .fi-pdf:hover { background: #186a63; }
        /* PDF estilo revista: portada a página completa (fondo oscuro, foto y titular) y luego texto a dos columnas. */
        @media print {
          @page { size: A4; margin: 0; }
          :global(html), :global(body) { background: #fff !important; }
          .app, .app * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-imprimir, .foot, .fi-compartir, .fi-pdf, .pt-txt :global(.volver) { display: none !important; }
          .app { background: #fff; }
          .portada-fondo { background: #0a0f1a; height: 297mm; box-sizing: border-box; padding: 16mm 14mm; break-after: page; display: flex; }
          .portada { display: flex; flex-direction: column; gap: 10mm; min-height: 0; width: 100%; padding: 0; margin: 0; max-width: none; color: #eef3f6; }
          .pt-txt { order: 2; }
          .pt-txt::before { content: 'ETHOS NOTICIAS'; display: block; order: 0; font: 700 34pt Georgia, serif; letter-spacing: .22em; color: #2fd8c9; border-bottom: 2px solid #e8b23a; padding-bottom: 4mm; margin-bottom: 6mm; }
          .pt-h1 { font-size: 30pt; color: #fff; max-width: none; margin: 4mm 0; }
          .pt-bajada { font-size: 13pt; color: #cfdce3; max-width: none; }
          .pt-meta { color: #2fd8c9; font-size: 9pt; }
          .pt-tapa { order: 1; width: 100%; flex: 1; display: flex; align-items: center; overflow: hidden; }
          .pt-tapa :global(img) { width: 100%; max-height: 140mm; object-fit: cover; box-shadow: none; border-radius: 0; }
          .pt-cifras { width: auto; margin: 0 14mm 6mm; border-radius: 0; }
          .cuerpo { display: block; width: auto; padding: 14mm 14mm 16mm; background: #f7f3ec; }
          .ficha { position: static; display: flex; flex-wrap: wrap; gap: 4mm 10mm; border-top: 3px solid #0a0f1a; border-bottom: 1px solid rgba(10,15,26,0.2); padding: 3mm 0; margin-bottom: 6mm; font-size: 8.5pt; }
          .fi-tit { margin: 0; }
          .ficha p { margin: 0; }
          .revista { display: block; column-count: 2; column-gap: 9mm; column-rule: 1px solid rgba(10,15,26,0.15); font-size: 10pt; text-align: justify; hyphens: auto; }
          .revista p, .revista li { line-height: 1.5; color: #1d262e; margin-bottom: 0.7em; }
          .revista > p:first-child::first-letter { font-size: 3.6em; }
          .revista h2 { font-size: 14pt; break-after: avoid; margin: 1em 0 0.4em; }
          .revista .foto { break-inside: avoid; margin: 0.8em 0; }
          .revista .foto :global(img) { box-shadow: none; border-radius: 0; }
          .revista .foto figcaption { font-size: 8pt; }
          .revista blockquote { break-inside: avoid; margin: 0.9em 0; border-left-width: 4px; }
          .revista blockquote p { font-size: 12.5pt; max-width: none; }
          .revista cite { font-size: 7.5pt; }
          .fuentes { column-span: all; font-size: 8.5pt; }
        }
      `}</style>
    </div>
  );
}
