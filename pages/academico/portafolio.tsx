import Link from 'next/link';
import { useState } from 'react';
import Header from '../../components/home/Header';
import Reveal from '../../components/Reveal';
import Seo from '../../components/Seo';
import PieAcademico from '../../components/academico/PieAcademico';
import GaleriaImagenes from '../../components/plataforma/GaleriaImagenes';
import { PROYECTOS } from '../../lib/academico';
import { migas } from '../../lib/seo';

const AREAS = ['Todas', ...Array.from(new Set(PROYECTOS.map((p) => p.area)))];
const EVIDENCIAS = PROYECTOS.reduce((n, p) => n + p.imagenes.length, 0);

// Búsqueda sin distinguir mayúsculas ni tildes.
const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Portafolio() {
  const [area, setArea] = useState('Todas');
  const [consulta, setConsulta] = useState('');
  const [abierto, setAbierto] = useState<string | null>(null);

  const q = normalizar(consulta.trim());
  const visibles = PROYECTOS.filter((p) =>
    (area === 'Todas' || p.area === area) &&
    (!q || normalizar([p.titulo, p.texto, p.area, ...p.etiquetas].join(' ')).includes(q)));

  const limpiar = () => { setArea('Todas'); setConsulta(''); };

  return (
    <div className="app">
      <Seo
        titulo="Portafolio de investigación — Ethos Académico | Ethos IA"
        descripcion="Proyectos propios de Ethos Académico: ciencia de datos, inteligencia artificial, revisión sistemática y laboratorios de ingeniería, con gráficos y demostraciones."
        ruta="/academico/portafolio"
        jsonld={[migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Ethos Académico', ruta: '/academico' }, { nombre: 'Portafolio', ruta: '/academico/portafolio' }])]}
      />
      <Header />

      <section className="hero" aria-labelledby="titulo-portafolio">
        <svg className="figura" viewBox="0 0 400 300" aria-hidden="true" focusable="false">
          {[80, 140, 200, 260, 320].map((x) => <line key={`v${x}`} className="rejilla-f" x1={x} y1={20} x2={x} y2={260} />)}
          {[20, 80, 140, 200].map((y) => <line key={`h${y}`} className="rejilla-f" x1={40} y1={y} x2={380} y2={y} />)}
          <path className="eje" d="M40 20V260H380" />
          <path className="diag" d="M40 260L380 20" />
          <path className="curva c3" pathLength={1} d="M40 260C70 150 150 90 380 40" />
          <path className="curva c2" pathLength={1} d="M40 260C55 110 130 55 380 30" />
          <path className="curva c1" pathLength={1} d="M40 260C46 80 110 34 380 22" />
          {[[52, 167], [85, 102], [145, 59], [242, 34]].map(([x, y], i) => (
            <circle key={x} className="punto" cx={x} cy={y} r={4} style={{ animationDelay: `${1.6 + i * 0.2}s, ${2.6 + i * 0.3}s` }} />
          ))}
        </svg>
        <div className="ancho">
          <nav className="migas" aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link><span aria-hidden="true">/</span>
            <Link href="/academico">Ethos Académico</Link><span aria-hidden="true">/</span>
            <span aria-current="page">Portafolio</span>
          </nav>
          <span className="badge">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18v12H3zM8 7V5h8v2" /></svg>
            Ethos Académico · Portafolio
          </span>
          <h1 id="titulo-portafolio">Proyectos de <span>investigación</span></h1>
          <p className="lead">Gráficos, demostraciones y grabaciones de pantalla de los proyectos propios del equipo, organizados por área de conocimiento.</p>
          <dl className="cifras">
            <div><dt>Proyectos</dt><dd>{PROYECTOS.length}</dd></div>
            <div><dt>Áreas</dt><dd>{AREAS.length - 1}</dd></div>
            <div><dt>Evidencias visuales</dt><dd>{EVIDENCIAS}</dd></div>
          </dl>
        </div>
      </section>

      <main id="contenido-principal" className="cuerpo">
        <div className="ancho">
          <div className="barra" role="search">
            <label className="buscador">
              <span className="sr">Buscar proyectos</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
              <input type="search" value={consulta} onChange={(e) => setConsulta(e.target.value)} placeholder="Buscar por título, tema o herramienta" />
            </label>
            <div className="chips" role="group" aria-label="Filtrar por área">
              {AREAS.map((a) => (
                <button key={a} type="button" aria-pressed={area === a} onClick={() => setArea(a)}>{a}</button>
              ))}
            </div>
          </div>

          <p className="contador" aria-live="polite">
            <strong>{visibles.length}</strong> {visibles.length === 1 ? 'proyecto encontrado' : 'proyectos encontrados'}
            {area !== 'Todas' && <> en <em>{area}</em></>}
          </p>

          {visibles.length === 0 ? (
            <div className="vacio">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8 11h6" /></svg>
              <h2>No hay proyectos con esos criterios</h2>
              <p>Pruebe con otra palabra o seleccione otra área.</p>
              <button type="button" onClick={limpiar}>Mostrar todos los proyectos</button>
            </div>
          ) : (
            <div className="rejilla">
              {visibles.map((p, i) => {
                const expandido = abierto === p.id;
                return (
                  <Reveal key={p.id} delay={i * 70} className={expandido ? 'tarjeta abierta' : 'tarjeta'}>
                    <article aria-labelledby={`t-${p.id}`}>
                      <div className="meta">
                        <span className="area">
                          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></svg>
                          {p.area}
                        </span>
                        <span className="estado">
                          {p.imagenes.length > 0 ? `${p.imagenes.length} evidencias` : 'Proyecto publicado'}
                        </span>
                      </div>
                      <h2 id={`t-${p.id}`}>{p.titulo}</h2>
                      <p className="texto">{p.texto}</p>
                      <ul className="tags" aria-label="Etiquetas">
                        {p.etiquetas.map((t) => <li key={t}>{t}</li>)}
                      </ul>
                      <div className="acciones">
                        {p.imagenes.length > 0 && (
                          <button type="button" className="btn" aria-expanded={expandido} aria-controls={`g-${p.id}`} onClick={() => setAbierto(expandido ? null : p.id)}>
                            {expandido ? 'Ocultar evidencias' : 'Ver evidencias'}
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                          </button>
                        )}
                        {p.enlace && <Link className="btn" href={p.enlace.href}>{p.enlace.etiqueta} <span aria-hidden="true">→</span></Link>}
                      </div>
                      {expandido && (
                        <div id={`g-${p.id}`} className="galeria">
                          <GaleriaImagenes imagenes={p.imagenes} ancha />
                        </div>
                      )}
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}

          <p className="aviso">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" /><path d="m9 12 2 2 4-4" /></svg>
            Solo publicamos material propio o con datos públicos y sintéticos.
          </p>

          <p className="volver"><Link href="/academico">← Volver a Ethos Académico</Link></p>
        </div>
      </main>

      <PieAcademico />

      <style jsx>{`
        /* Mobile-first: base 360 px; se amplía con min-width 600, 900, 1280, 1920 y 2560. */
        .app { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; overflow-x: clip; }
        .ancho { --w: var(--ancho-max); position: relative; max-width: var(--w); margin: 0 auto; min-width: 0; }
        svg { width: 1em; height: 1em; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex: none; }
        .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

        .hero { position: relative; overflow: hidden; background: radial-gradient(60% 80% at 85% 10%, rgba(4,235,255,0.14), transparent 60%), radial-gradient(50% 70% at 0% 100%, rgba(122,167,255,0.12), transparent 60%), var(--c-azul); color: var(--c-claro); padding: 100px 16px 64px; border-bottom: 1px solid var(--c-azul-3); }
        /* Figura decorativa estilo curva ROC: se dibuja una vez y queda con un pulso suave. */
        .figura { display: none; position: absolute; height: auto; pointer-events: none; }
        .figura .rejilla-f { stroke: #123048; stroke-width: 1; }
        .figura .eje { stroke: #3b5a73; stroke-width: 1.5; }
        .figura .diag { stroke: #526373; stroke-width: 1.2; stroke-dasharray: 5 6; }
        .figura .curva { stroke-width: 3; stroke-dasharray: 1; stroke-dashoffset: 1; animation: trazar 2.4s var(--ease) 0.3s forwards; }
        .figura .c1 { stroke: #04ebff; }
        .figura .c2 { stroke: #7aa7ff; animation-delay: 0.7s; }
        .figura .c3 { stroke: #2fd8c9; animation-delay: 1.1s; }
        .figura .punto { fill: #04ebff; stroke: none; opacity: 0; transform-box: fill-box; transform-origin: center; animation: aparecer 0.6s var(--ease) forwards, latir 3s ease-in-out 2.6s infinite alternate; }
        @keyframes trazar { to { stroke-dashoffset: 0; } }
        @keyframes aparecer { to { opacity: 1; } }
        @keyframes latir { from { transform: scale(1); } to { transform: scale(1.5); } }

        .migas { display: flex; flex-wrap: wrap; gap: 4px 8px; font-size: var(--t-xs); color: var(--c-apagado); margin-bottom: 18px; }
        .migas :global(a) { color: var(--c-claro-2); text-decoration: none; display: inline-flex; align-items: center; min-height: 32px; }
        .migas :global(a:hover) { color: var(--c-cian); text-decoration: underline; }
        .migas span { display: inline-flex; align-items: center; }
        .migas [aria-current] { color: var(--c-cian); }
        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: var(--r-pill); border: 1px solid rgba(4,235,255,0.35); background: rgba(4,235,255,0.08); color: var(--c-cian); font-size: var(--t-xs); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
        h1 { font-size: 2rem; line-height: 1.1; letter-spacing: -0.02em; margin: 16px 0 0; max-width: 18ch; }
        h1 span { color: var(--c-cian); }
        .lead { color: var(--c-claro-2); font-size: var(--t-base); line-height: 1.65; max-width: 62ch; margin: 14px 0 0; }
        .cifras { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 28px 0 0; padding: 18px 0 0; border-top: 1px solid var(--c-azul-3); }
        .cifras div { display: flex; flex-direction: column-reverse; gap: 4px; min-width: 0; }
        .cifras dt { font-size: var(--t-xs); color: var(--c-apagado); text-transform: uppercase; letter-spacing: 0.06em; line-height: 1.3; }
        .cifras dd { margin: 0; font-size: 1.7rem; font-weight: 700; color: var(--c-claro); }

        .cuerpo { padding: 0 16px 56px; }
        .barra { position: relative; margin-top: -32px; background: var(--c-tarjeta); border-radius: var(--r-xl); box-shadow: var(--sombra-2); padding: 12px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; border: 1px solid var(--c-borde); }
        .buscador { position: relative; display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 14px; border-radius: var(--r-md); background: var(--c-fondo); border: 1px solid transparent; color: var(--c-texto-3); font-size: 18px; min-width: 0; }
        .buscador:focus-within { border-color: var(--c-teal); background: #fff; }
        .buscador input { flex: 1; min-width: 0; border: 0; background: transparent; font: inherit; font-size: 16px; color: var(--c-texto); padding: 12px 0; outline: none; }
        .buscador input::placeholder { color: var(--c-texto-3); }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chips button { min-height: 44px; font: inherit; font-size: var(--t-sm); font-weight: 600; padding: 8px 16px; border-radius: var(--r-pill); border: 1px solid rgba(5,17,30,0.14); background: #fff; color: var(--c-texto-2); cursor: pointer; transition: background var(--d-rapida), color var(--d-rapida), border-color var(--d-rapida); }
        .chips button:hover { border-color: var(--c-teal); color: var(--c-teal); }
        .chips button[aria-pressed='true'] { background: var(--c-azul); color: var(--c-cian); border-color: var(--c-azul); }

        .contador { margin: 22px 0 14px; font-size: var(--t-sm); color: var(--c-texto-3); }
        .contador strong { color: var(--c-texto); font-size: var(--t-base); }
        .contador em { font-style: normal; color: var(--c-teal); font-weight: 600; }

        .rejilla { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
        .rejilla :global(.tarjeta) { min-width: 0; }
        .rejilla :global(.tarjeta.abierta) { grid-column: 1 / -1; }
        article { height: 100%; display: flex; flex-direction: column; background: var(--c-tarjeta); border-radius: var(--r-xl); border: 1px solid var(--c-borde); box-shadow: var(--sombra-1); padding: 22px 18px; position: relative; overflow: hidden; transition: box-shadow var(--d-media) var(--ease), transform var(--d-media) var(--ease), border-color var(--d-media); }
        article::before { content: ''; position: absolute; inset: 0 0 auto; height: 4px; background: linear-gradient(90deg, var(--c-cian), var(--c-teal)); }
        article:hover { box-shadow: var(--sombra-2); border-color: rgba(11,95,117,0.25); transform: translateY(-2px); }
        .meta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }
        .area { display: inline-flex; align-items: center; gap: 7px; font-size: var(--t-xs); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c-teal); background: rgba(11,95,117,0.08); padding: 6px 12px; border-radius: var(--r-pill); }
        .estado { font-size: var(--t-xs); font-weight: 600; color: var(--c-ok); background: var(--c-ok-bg); padding: 6px 12px; border-radius: var(--r-pill); }
        h2 { font-size: 1.35rem; line-height: 1.22; margin: 16px 0 8px; overflow-wrap: break-word; }
        .texto { color: var(--c-texto-2); line-height: 1.7; margin: 0; max-width: 75ch; font-size: var(--t-sm); }
        .tags { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; margin: 14px 0 0; }
        .tags li { font-size: var(--t-xs); padding: 5px 11px; border-radius: var(--r-sm); background: var(--c-fondo); color: var(--c-texto-2); border: 1px solid var(--c-borde); }
        .acciones { display: flex; flex-direction: column; gap: 10px; margin-top: auto; padding-top: 20px; }
        .btn, .acciones :global(.btn) { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; font: inherit; font-size: var(--t-sm); font-weight: 700; padding: 12px 20px; border-radius: var(--r-pill); border: 0; background: var(--c-azul); color: var(--c-cian); cursor: pointer; text-decoration: none; transition: box-shadow var(--d-rapida), transform var(--d-rapida); }
        .btn:hover, .acciones :global(.btn:hover) { box-shadow: var(--brillo-cian); transform: translateY(-1px); }
        .btn svg { transition: transform var(--d-media) var(--ease); }
        .btn[aria-expanded='true'] svg { transform: rotate(180deg); }
        .galeria { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--c-borde); animation: desplegar var(--d-lenta) var(--ease); }
        @keyframes desplegar { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        /* La galería compartida fija mínimos de 300px; aquí se limita al ancho disponible para no desbordar en móviles. */
        .galeria :global(.mini.ancha) { grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); }

        .vacio { text-align: center; background: var(--c-tarjeta); border: 1px dashed rgba(5,17,30,0.18); border-radius: var(--r-xl); padding: 44px 20px; color: var(--c-texto-3); }
        .vacio > svg { font-size: 40px; color: var(--c-teal); }
        .vacio h2 { color: var(--c-texto); margin: 12px 0 6px; }
        .vacio p { margin: 0 0 20px; }
        .vacio button { min-height: 48px; font: inherit; font-weight: 700; padding: 11px 22px; border-radius: var(--r-pill); border: 0; background: var(--c-azul); color: var(--c-cian); cursor: pointer; }

        .aviso { display: flex; align-items: flex-start; gap: 10px; margin: 32px 0 0; font-size: var(--t-sm); line-height: 1.5; color: var(--c-texto-3); }
        .aviso svg { font-size: 18px; color: var(--c-teal); margin-top: 1px; }
        .volver { margin: 12px 0 0; }
        .volver :global(a) { display: inline-flex; align-items: center; min-height: 44px; color: var(--c-teal); font-weight: 700; }

        @media (min-width: 600px) {
          .hero { padding: 112px 24px 76px; }
          h1 { font-size: 2.6rem; }
          .cifras { display: flex; gap: 48px; }
          .cifras dd { font-size: 2.1rem; }
          .cuerpo { padding: 0 24px 72px; }
          .barra { padding: 16px; }
          article { padding: 26px 24px; }
          .acciones { flex-direction: row; flex-wrap: wrap; }
          h2 { font-size: var(--t-xl); }
        }
        @media (min-width: 900px) {
          .hero { padding: 136px var(--gutter) 92px; }
          .figura { display: block; width: 42%; max-width: 620px; right: var(--gutter); bottom: 40px; opacity: 0.7; }
          h1 { font-size: 3.2rem; }
          .lead { font-size: var(--t-lg); max-width: 52ch; }
          .cuerpo { padding: 0 var(--gutter) 88px; }
          .barra { grid-template-columns: minmax(240px, 0.9fr) minmax(0, 1.6fr); align-items: center; }
          .chips { justify-content: flex-end; }
          .rejilla { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; }
          article { padding: 30px; }
        }
        @media (min-width: 1280px) { h1 { font-size: 3.8rem; } .rejilla { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        /* Pantallas grandes: se amplían ancho y tokens tipográficos solo en esta página. */
        @media (min-width: 1920px) { .ancho { --w: 1560px; } .app { --t-xs: 0.85rem; --t-sm: 1rem; --t-base: 1.15rem; --t-lg: 1.45rem; --t-xl: 2.2rem; --t-2xl: 3rem; } h1 { font-size: 4.4rem; } .cifras dd { font-size: 2.8rem; } .figura { max-width: 820px; } }
        @media (min-width: 2560px) { .ancho { --w: 2080px; } .app { --t-xs: 1.05rem; --t-sm: 1.25rem; --t-base: 1.4rem; --t-lg: 1.8rem; --t-xl: 2.8rem; --t-2xl: 3.8rem; } h1 { font-size: 5.6rem; } .cifras dd { font-size: 3.6rem; } .figura { max-width: 1100px; } }
        @media (prefers-reduced-motion: reduce) {
          .figura .curva { animation: none; stroke-dashoffset: 0; }
          .figura .punto { animation: none; opacity: 1; }
          .galeria { animation: none; }
          article, article:hover, .btn, .btn svg { transition: none; transform: none; }
        }
      `}</style>
    </div>
  );
}
