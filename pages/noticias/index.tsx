import Header from '../../components/home/Header';
import Seo from '../../components/Seo';
import { migas } from '../../lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { fechaLarga, type Noticia } from '../../lib/noticias';
import { noticiasPublicadas } from '../../lib/noticiasDb';
import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps<{ noticias: Noticia[] }> = async () => ({
  props: { noticias: await noticiasPublicadas() },
  revalidate: 300,
});

export default function Noticias({ noticias }: { noticias: Noticia[] }) {
  return (
    <div className="app" id="contenido-principal">
      <Seo
        titulo="Ethos Noticias — novedades de Ethos IA"
        descripcion="Novedades de Ethos IA (ETHOSLAB S.A.S.): participación en medios, aportes a la comunidad académica, productos y equipo."
        ruta="/noticias"
        jsonld={[migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Ethos Noticias', ruta: '/noticias' }])]}
      />
      <Head>
        <link rel="alternate" type="application/rss+xml" title="Ethos Noticias" href="/noticias/rss.xml" />
      </Head>
      <Header />

      <header className="hero">
        <div className="cab-linea"><span>Tecnología · Datos · Educación</span><span>Cuenca, Ecuador</span></div>
        <h1 className="cabecera">ETHOS <em>Noticias</em></h1>
        <div className="cab-linea fina"><span>La revista de Ethos IA</span><span>Medios · Comunidad · Producto · Equipo</span></div>
      </header>

      <main className="cuerpo">
        <div className="rejilla">
          {noticias.map((n) => (
            <article key={n.slug} className={n.destacada ? 'card portada' : 'card'}>
              <Link href={`/noticias/${n.slug}`} className="enl">
                <span className="img">
                  <Image src={n.imagen.src} alt={n.imagen.alt} width={n.imagen.ancho} height={n.imagen.alto} sizes="(max-width: 700px) 100vw, 440px" />
                </span>
                {n.destacada && <span className="sello">{n.destacada.sello}</span>}
                <span className="meta">{n.categoria} · <time dateTime={n.fecha}>{fechaLarga(n.fecha)}</time></span>
                <h2>{n.titulo}</h2>
                <p>{n.resumen}</p>
                <span className="mas">{n.destacada ? 'Leer el reportaje →' : 'Leer la nota →'}</span>
              </Link>
            </article>
          ))}
        </div>
      </main>

      <footer className="foot">
        <span>Ethos IA es una marca de ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador</span>
        <span>© 2026 ETHOSLAB S.A.S.</span>
      </footer>

      <style jsx>{`
        .app { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; }
        .app { background: #f7f3ec; }
        .hero { background: radial-gradient(120% 140% at 80% 0%, #123a3c 0%, #0a0f1a 60%); color: #eef3f6; padding: 118px 48px 44px; }
        .hero > * { max-width: 1100px; margin-left: auto; margin-right: auto; }
        .cab-linea { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; font: 600 11px 'IBM Plex Mono', monospace; letter-spacing: .2em; text-transform: uppercase; color: #8fa89c; border-top: 1px solid rgba(232,178,58,0.55); border-bottom: 1px solid rgba(232,178,58,0.55); padding: 10px 0; }
        .cab-linea.fina { border-top: 0; color: #e8b23a; }
        .cabecera { font-family: Georgia, 'Times New Roman', serif; font-weight: 700; font-size: clamp(3rem, 11vw, 8.5rem); line-height: 0.95; letter-spacing: -0.02em; margin: 22px auto 18px; text-align: center; color: #fff; }
        .cabecera em { font-weight: 400; color: #2fd8c9; }
        .cuerpo { max-width: 1100px; margin: 0 auto; padding: 48px 24px 80px; }
        .rejilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 40px 28px; }
        .card { background: transparent; border: 0; border-top: 3px solid #0a0f1a; border-radius: 0; overflow: hidden; }
        .card :global(.enl) { display: flex; flex-direction: column; color: inherit; height: 100%; text-decoration: none; }
        .img { display: block; aspect-ratio: 4 / 3; overflow: hidden; background: #0a0f1a; margin-top: 18px; }
        .img :global(img) { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform 0.6s ease; }
        .card:hover .img :global(img) { transform: scale(1.04); }
        .meta { font: 600 11px 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: #186a63; padding: 16px 0 0; }
        h2 { font-family: Georgia, serif; font-size: 22px; line-height: 1.22; margin: 10px 0 0; color: #0a0f1a; }
        .card:hover h2 { text-decoration: underline; text-decoration-color: #e8b23a; text-underline-offset: 4px; }
        .card p { font-size: 15px; color: #3c4954; line-height: 1.7; margin: 10px 0 0; }
        .mas { margin-top: auto; padding-top: 14px; font: 700 12px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: #0a0f1a; }
        .card :global(.enl:focus-visible) { outline: 2px solid #2fd8c9; outline-offset: 4px; }
        .portada { grid-column: 1 / -1; background: #0a0f1a; border-top: 0; border-radius: 4px; box-shadow: 0 30px 60px rgba(5,17,30,0.22); }
        .portada :global(.enl) { display: grid; grid-template-columns: min(55%, calc((100svh - 120px) * 0.8)) 1fr; grid-template-rows: auto auto auto 1fr auto; column-gap: 40px; padding: 0 40px 0 0; }
        .portada .img { grid-row: 1 / -1; aspect-ratio: 4 / 5; margin: 0; align-self: start; }
        .portada .img :global(img) { object-fit: contain; }
        .portada .meta, .portada h2, .portada p, .portada .mas { padding-left: 0; }
        .portada .mas { color: #e8b23a; margin-bottom: 32px; }
        .sello { text-decoration: none; justify-self: start; align-self: flex-start; margin: 36px 0 0; background: #e8b23a; color: #0a0f1a; font: 700 11px 'IBM Plex Mono', monospace; letter-spacing: .16em; text-transform: uppercase; padding: 5px 10px; border-radius: 4px; }
        .portada .meta { color: #2fd8c9; }
        .portada h2 { font-family: Georgia, serif; font-size: clamp(1.6rem, 3.2vw, 2.7rem); line-height: 1.1; color: #fff; }
        .portada p { color: #cfdce3; font-size: 15px; }
        .portada .mas { color: #e8b23a; }
        @media (max-width: 900px) { .portada :global(.enl) { display: flex; padding: 0 18px; } .portada .img { margin: 0 auto; width: min(calc(100% + 36px), calc((100svh - 120px) * 0.8)); max-width: none; } .portada .mas { margin-bottom: 22px; } }
        .foot { background: var(--c-azul-profundo); color: var(--c-apagado); padding: 28px 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; }
        @media (max-width: 600px) {
          .hero { padding: 100px 16px 32px; }
          .cuerpo { padding: 0 16px 56px; }
          .foot { padding-left: 16px; padding-right: 16px; }
        }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>
    </div>
  );
}
