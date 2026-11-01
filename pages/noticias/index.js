import Link from 'next/link';
import Header from '../../components/home/Header';
import Seo from '../../components/Seo';
import { NOTICIAS } from '../../lib/noticias/datos';
import { migas } from '../../lib/seo';

export default function Noticias() {
  return (
    <div className="noticias" id="contenido-principal">
      <Seo
        titulo="Noticias | Ethos IA"
        descripcion="Alertas ciudadanas y noticias de seguridad digital de Ethos IA."
        ruta="/noticias"
        jsonld={migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Noticias', ruta: '/noticias' }])}
      />
      <Header />
      <header className="hero">
        <span className="eyebrow">NOTICIAS</span>
        <h1>Noticias y alertas de seguridad digital</h1>
        <p>Información para proteger a la ciudadanía y a las empresas.</p>
      </header>
      <main className="cuerpo">
        {NOTICIAS.map((n) => (
          <article key={n.slug} className="tarjeta">
            <span className="seccion">{n.seccion} · {n.fechaTexto}</span>
            <h2><Link href={`/noticias/${n.slug}`}>{n.titulo}</Link></h2>
            <p>{n.resumen}</p>
            <Link className="leer" href={`/noticias/${n.slug}`}>Leer la noticia →</Link>
          </article>
        ))}
      </main>
      <style jsx>{`
        .noticias { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; }
        .hero { background: var(--c-azul); color: var(--c-claro); padding: clamp(104px, 14vw, 140px) var(--gutter) var(--s-8); }
        .eyebrow { font-size: var(--t-xs); letter-spacing: 0.18em; color: var(--c-cian); }
        h1 { font-size: var(--t-2xl); line-height: 1.15; margin: var(--s-3) 0 var(--s-4); max-width: 22ch; text-wrap: balance; }
        .hero p { color: var(--c-claro-2); line-height: 1.7; max-width: 60ch; margin: 0; }
        .cuerpo { max-width: var(--ancho-max); margin: 0 auto; padding: var(--s-8) var(--gutter) var(--s-9); display: grid; gap: var(--s-5); }
        .tarjeta { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: var(--r-xl); padding: var(--s-6); box-shadow: var(--sombra-1); }
        .seccion { font-size: var(--t-xs); letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-error); font-weight: 700; }
        h2 { font-size: var(--t-xl); line-height: 1.25; margin: var(--s-2) 0 var(--s-3); }
        h2 :global(a) { color: var(--c-texto); }
        p { color: var(--c-texto-2); line-height: 1.7; margin: 0 0 var(--s-4); }
        .tarjeta :global(.leer) { color: var(--c-teal); font-weight: 700; }
      `}</style>
    </div>
  );
}
