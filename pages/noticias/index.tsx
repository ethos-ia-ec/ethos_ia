import Header from '../../components/home/Header';
import Seo from '../../components/Seo';
import { migas } from '../../lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import { NOTICIAS, fechaLarga } from '../../lib/noticias';

export default function Noticias() {
  return (
    <div className="app" id="contenido-principal">
      <Seo
        titulo="Ethos Noticias — novedades de Ethos IA"
        descripcion="Novedades de Ethos IA (ETHOSLAB S.A.S.): participación en medios, aportes a la comunidad académica, productos y equipo."
        ruta="/noticias"
        jsonld={[migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Ethos Noticias', ruta: '/noticias' }])]}
      />
      <Header />

      <header className="hero">
        <span className="eyebrow">ETHOS NOTICIAS</span>
        <h1>Lo que pasa en Ethos IA</h1>
        <p>Participación en medios, aportes a la comunidad académica, productos y equipo.</p>
      </header>

      <main className="cuerpo">
        <div className="rejilla">
          {NOTICIAS.map((n) => (
            <article key={n.slug} className="card">
              <Link href={`/noticias/${n.slug}`} className="enl">
                <span className="img">
                  <Image src={n.imagen.src} alt={n.imagen.alt} width={n.imagen.ancho} height={n.imagen.alto} sizes="(max-width: 700px) 100vw, 440px" />
                </span>
                <span className="meta">{n.categoria} · <time dateTime={n.fecha}>{fechaLarga(n.fecha)}</time></span>
                <h2>{n.titulo}</h2>
                <p>{n.resumen}</p>
                <span className="mas">Leer la nota →</span>
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
        .hero { background: var(--c-azul); color: var(--c-claro); padding: 128px 48px 72px; }
        .eyebrow { font-size: 12px; letter-spacing: 0.18em; color: var(--c-cian); }
        h1 { font-size: clamp(1.8rem, 3.4vw, 2.6rem); line-height: 1.2; margin: 14px 0 0; }
        .hero p { color: var(--c-claro-2); line-height: 1.7; max-width: 62ch; margin: 18px 0 0; }
        .cuerpo { max-width: 960px; margin: -28px auto 0; padding: 0 24px 72px; }
        .rejilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .card { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: 14px; overflow: hidden; box-shadow: 0 18px 40px rgba(5,17,30,0.08); }
        .card :global(.enl) { display: flex; flex-direction: column; color: inherit; height: 100%; }
        .img { display: block; aspect-ratio: 16 / 10; overflow: hidden; background: var(--c-azul); }
        .img :global(img) { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform 0.4s; }
        .card:hover .img :global(img) { transform: scale(1.03); }
        .meta { font-size: 12px; color: var(--c-teal); font-weight: 600; padding: 18px 22px 0; }
        h2 { font-size: 17px; line-height: 1.35; margin: 8px 22px 0; }
        .card p { font-size: 14px; color: var(--c-texto-2); line-height: 1.65; margin: 10px 22px 0; }
        .mas { margin: auto 22px 20px; padding-top: 14px; font-size: 14px; font-weight: 700; color: var(--c-teal); }
        .card :global(.enl:focus-visible) { outline: 2px solid var(--c-cian); outline-offset: -2px; }
        .foot { background: var(--c-azul-profundo); color: var(--c-apagado); padding: 28px 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; }
        @media (max-width: 600px) {
          .hero { padding: 104px 16px 56px; }
          .cuerpo { padding: 0 16px 56px; }
          .foot { padding-left: 16px; padding-right: 16px; }
        }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>
    </div>
  );
}
