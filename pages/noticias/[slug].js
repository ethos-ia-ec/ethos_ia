import Link from 'next/link';
import Header from '../../components/home/Header';
import Seo from '../../components/Seo';
import { NOTICIAS, noticiaPorSlug } from '../../lib/noticias/datos';
import { migas } from '../../lib/seo';

export function getStaticPaths() {
  return { paths: NOTICIAS.map((n) => ({ params: { slug: n.slug } })), fallback: false };
}

export function getStaticProps({ params }) {
  return { props: { noticia: noticiaPorSlug(params.slug) } };
}

function Bloque({ b }) {
  if (b.tipo === 'h2') return <h2>{b.texto}</h2>;
  if (b.tipo === 'ul') return <ul>{b.items.map((t) => <li key={t}>{t}</li>)}</ul>;
  if (b.tipo === 'testimonio') {
    return (
      <blockquote className="testimonio">
        <span className="monto">Perdió {b.monto}</span>
        <p>«{b.texto}»</p>
        <cite>— {b.autor}</cite>
      </blockquote>
    );
  }
  if (b.tipo === 'recuadro') {
    return (
      <aside className="recuadro">
        <h3>{b.titulo}</h3>
        <ol>{b.items.map((t) => <li key={t}>{t}</li>)}</ol>
      </aside>
    );
  }
  if (b.tipo === 'galeria') {
    return (
      <section className="galeria">
        <h3>{b.titulo}</h3>
        <div className="fotos">
          {b.imagenes.map((im) => (
            <figure key={im.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.src} alt={im.alt} loading="lazy" />
              <figcaption>{im.pie}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }
  return <p>{b.texto}</p>;
}

// El PDF sale de la impresión del navegador: la hoja @media print maqueta la noticia como página de periódico.
export default function Noticia({ noticia: n }) {
  const descargar = () => {
    const previo = document.title;
    document.title = `Ethos IA - ${n.slug}`;
    window.print();
    document.title = previo;
  };
  return (
    <div className="pagina" id="contenido-principal">
      <Seo
        titulo={`${n.titulo} | Ethos IA`}
        descripcion={n.bajada}
        ruta={`/noticias/${n.slug}`}
        tipo="article"
        jsonld={migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Noticias', ruta: '/noticias' }, { nombre: n.titulo, ruta: `/noticias/${n.slug}` }])}
      />
      <div className="no-imprimir"><Header /></div>
      <main className="hoja">
        <div className="barra no-imprimir">
          <Link href="/noticias">← Noticias</Link>
          <button type="button" onClick={descargar}>Descargar en PDF</button>
        </div>
        <header className="cabecera">
          <div className="mancheta">
            <span className="marca">ETHOS IA</span>
            <span className="edicion">Noticias · {n.fechaTexto}</span>
          </div>
          <span className="antetitulo">{n.seccion} | {n.antetitulo}</span>
          <h1>{n.titulo}</h1>
          <p className="bajada">{n.bajada}</p>
        </header>
        <aside className="cuentas">
          <h3>⚠ Cuentas reportadas por las personas afectadas</h3>
          <p>No realice pagos a estas cuentas. Si le contactan desde ellas, repórtelas.</p>
          <dl>
            {n.cuentas.map((c) => (
              <div key={c.red}><dt>{c.red}</dt><dd>{c.valor}</dd></div>
            ))}
          </dl>
        </aside>
        <article className="texto">
          {n.cuerpo.map((b, i) => <Bloque key={i} b={b} />)}
        </article>
        <footer className="pie">Ethos IA · ETHOSLAB S.A.S. · ethos-ia — Alerta ciudadana. Comparta esta información.</footer>
      </main>
      <style jsx>{`
        .pagina { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; }
        .hoja { max-width: 900px; margin: 0 auto; padding: clamp(96px, 12vw, 128px) var(--gutter) var(--s-9); }
        .barra { display: flex; justify-content: space-between; align-items: center; gap: var(--s-3); margin-bottom: var(--s-5); }
        .barra :global(a) { color: var(--c-teal); font-weight: 700; }
        .barra button { background: var(--c-azul); color: var(--c-claro); border: 0; border-radius: var(--r-pill); padding: 10px 20px; font: inherit; font-weight: 700; cursor: pointer; }
        .barra button:hover { background: var(--c-teal); }
        .cabecera { background: var(--c-tarjeta); border-radius: var(--r-xl) var(--r-xl) 0 0; padding: var(--s-6); border-top: 6px solid var(--c-error); }
        .mancheta { display: flex; justify-content: space-between; flex-wrap: wrap; gap: var(--s-2); border-bottom: 3px double var(--c-texto); padding-bottom: var(--s-2); margin-bottom: var(--s-4); }
        .marca { font-family: Georgia, serif; font-weight: 700; letter-spacing: 0.2em; }
        .edicion { font-size: var(--t-xs); color: var(--c-texto-3); text-transform: uppercase; letter-spacing: 0.1em; }
        .antetitulo { font-size: var(--t-xs); letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-error); font-weight: 700; }
        h1 { font-family: Georgia, serif; font-size: var(--t-2xl); line-height: 1.12; margin: var(--s-3) 0; text-wrap: balance; }
        .bajada { font-size: var(--t-lg); line-height: 1.5; color: var(--c-texto-2); margin: 0; }
        .cuentas { background: var(--c-error-bg); border: 2px solid var(--c-error); padding: var(--s-5) var(--s-6); }
        .cuentas h3 { color: var(--c-error); margin: 0 0 var(--s-2); font-size: var(--t-lg); }
        .cuentas p { margin: 0 0 var(--s-3); color: var(--c-texto-2); }
        dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: var(--s-2) var(--s-5); margin: 0; }
        dt { font-size: var(--t-xs); text-transform: uppercase; letter-spacing: 0.08em; color: var(--c-texto-3); }
        dd { margin: 0; font-weight: 700; font-family: var(--f-mono); word-break: break-word; }
        .texto { background: var(--c-tarjeta); padding: var(--s-6); border-radius: 0 0 var(--r-xl) var(--r-xl); line-height: 1.75; color: var(--c-texto-2); }
        .texto :global(h2) { font-family: Georgia, serif; color: var(--c-texto); font-size: var(--t-xl); margin: var(--s-6) 0 var(--s-3); }
        .texto :global(.testimonio) { margin: var(--s-4) 0; padding: var(--s-4) var(--s-5); border-left: 5px solid var(--c-error); background: var(--c-fondo); border-radius: 0 var(--r-md) var(--r-md) 0; }
        .texto :global(.monto) { display: inline-block; background: var(--c-error); color: #fff; font-weight: 700; font-size: var(--t-sm); padding: 2px 10px; border-radius: var(--r-pill); }
        .texto :global(.testimonio p) { font-family: Georgia, serif; font-size: var(--t-lg); font-style: italic; color: var(--c-texto); margin: var(--s-2) 0; }
        .texto :global(cite) { font-size: var(--t-sm); color: var(--c-texto-3); font-style: normal; }
        .texto :global(.recuadro) { background: var(--c-aviso-bg); border: 1px solid var(--c-aviso); border-radius: var(--r-lg); padding: var(--s-4) var(--s-5); margin: var(--s-5) 0; }
        .texto :global(.recuadro h3) { margin: 0 0 var(--s-2); color: var(--c-aviso); }
        .texto :global(.galeria h3) { font-family: Georgia, serif; color: var(--c-texto); }
        .texto :global(.fotos) { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap: var(--s-4); }
        .texto :global(figure) { margin: 0; }
        .texto :global(figure img) { width: 100%; height: auto; border: 1px solid var(--c-borde); border-radius: var(--r-sm); }
        .texto :global(figcaption) { font-size: var(--t-xs); color: var(--c-texto-3); margin-top: 4px; }
        .pie { text-align: center; font-size: var(--t-xs); color: var(--c-texto-3); margin-top: var(--s-5); }

        @media print {
          @page { size: A4; margin: 14mm 12mm; }
          :global(body) { background: #fff !important; }
          .no-imprimir { display: none !important; }
          .pagina { background: #fff; color: #000; font-family: Georgia, 'Times New Roman', serif; }
          .hoja { max-width: none; padding: 0; }
          .cabecera, .texto { border-radius: 0; padding: 0; background: #fff; }
          .cabecera { border-top: 0; }
          .mancheta { border-bottom: 4px double #000; }
          .marca { font-size: 26pt; }
          h1 { font-size: 26pt; color: #000; }
          .bajada { font-size: 12pt; color: #222; border-bottom: 1px solid #000; padding-bottom: 8pt; margin-bottom: 8pt; }
          .cuentas { break-inside: avoid; margin: 8pt 0; padding: 8pt 10pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .texto { column-count: 2; column-gap: 8mm; font-size: 10pt; line-height: 1.45; color: #000; text-align: justify; }
          .texto :global(h2) { font-size: 13pt; margin: 8pt 0 4pt; break-after: avoid; }
          .texto :global(.testimonio), .texto :global(.recuadro), .texto :global(figure) { break-inside: avoid; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .texto :global(.testimonio p) { font-size: 11pt; }
          .texto :global(.galeria) { column-span: all; break-inside: avoid; }
          .texto :global(.fotos) { grid-template-columns: 1fr 1fr; gap: 6pt; }
          .pie { border-top: 1px solid #000; padding-top: 4pt; color: #000; }
        }
      `}</style>
    </div>
  );
}
