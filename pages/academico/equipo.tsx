import Link from 'next/link';
import Header from '../../components/home/Header';
import Reveal from '../../components/Reveal';
import Seo from '../../components/Seo';
import PieAcademico from '../../components/academico/PieAcademico';
import { ALCANCE, EQUIPO, MIEMBROS, WHATSAPP_ACADEMICO, type Area } from '../../lib/academico';
import { migas } from '../../lib/seo';

// Íconos de línea (24×24) por clave de Area['icono'].
const ICONOS: Record<Area['icono'], string> = {
  microscopio: 'M6 21h12M9 21v-3M12 18a6 6 0 0 0 6-6M9 4l5 5M7.5 5.5l2-2 5 5-2 2zM11 11l-2 2M6 14h7',
  birrete: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6',
  libro: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7M8 11h7',
  grafico: 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6M20 16v-9',
  base: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  codigo: 'M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14',
  moneda: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6.5v11',
  personas: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.8c1.6.8 2.6 2.5 3 5.2',
  balanza: 'M12 3v18M7 21h10M5 7h14M12 5l-7 2 -3 7a3.5 3.5 0 0 0 6 0L5 7M19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7',
};

// Red de colaboración decorativa (estilo figura científica): semilla fija, idéntica en servidor y cliente.
const W = 800;
const H = 520;
function construirRed() {
  let a = 20261120;
  const rnd = () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const nodos = Array.from({ length: 26 }, (_, i) => ({ x: Math.round(40 + rnd() * (W - 80)), y: Math.round(40 + rnd() * (H - 80)), r: i % 6 === 0 ? 7 : Math.round(25 + rnd() * 30) / 10, c: i % 3 }));
  const aristas: { x1: number; y1: number; x2: number; y2: number; c: number }[] = [];
  nodos.forEach((n, i) => {
    nodos.map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((o) => o.j > i).sort((p, q) => p.d - q.d).slice(0, 2)
      .forEach(({ j }) => aristas.push({ x1: n.x, y1: n.y, x2: nodos[j].x, y2: nodos[j].y, c: n.c }));
  });
  return { nodos, aristas };
}
const RED = construirRed();
const COLORES = ['#04ebff', '#7aa7ff', '#2fd8c9'];

export default function EquipoAcademico() {
  return (
    <div className="app">
      <Seo
        titulo="Nuestro equipo — Ethos Académico | Ethos IA"
        descripcion="Equipo multidisciplinario de Ethos Académico: doctores, magísteres e ingenieros en investigación científica, ciencia de datos, economía, educación y producción multimedia."
        ruta="/academico/equipo"
        jsonld={[migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Ethos Académico', ruta: '/academico' }, { nombre: 'Equipo', ruta: '/academico/equipo' }])]}
      />
      <Header />

      <section className="hero" aria-labelledby="titulo-equipo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="fondo" src="/academico/libres/equipo-cabecera.webp" alt="" aria-hidden="true" fetchPriority="high" />
        <svg className="red" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <g>
            {RED.aristas.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={COLORES[e.c]} style={{ animationDelay: `${(i % 7) * -0.9}s` }} />
            ))}
          </g>
          {RED.nodos.map((n, i) => (
            <circle key={i} className={n.r > 6 ? 'nodo hub' : 'nodo'} cx={n.x} cy={n.y} r={n.r} fill={COLORES[n.c]} style={{ animationDelay: `${(i % 5) * -0.7}s` }} />
          ))}
        </svg>
        <div className="ancho">
          <nav className="migas" aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link><span aria-hidden="true">/</span>
            <Link href="/academico">Ethos Académico</Link><span aria-hidden="true">/</span>
            <span aria-current="page">Equipo</span>
          </nav>
          <span className="badge">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONOS.personas} /></svg>
            Ethos Académico
          </span>
          <h1 id="titulo-equipo">Nuestro <span>equipo</span></h1>
          <p className="lead">Profesionales de grado y posgrado en investigación científica, ciencia de datos, economía, educación y producción multimedia, coordinados para acompañar cada investigación con método y evidencia.</p>
        </div>
      </section>

      <main id="contenido-principal" className="cuerpo">
        <div className="ancho">
          <ul className="miembros" aria-label="Integrantes del equipo">
            {MIEMBROS.map((m, i) => (
              <li key={m.nombre}>
                <Reveal delay={i * 80} className="celda">
                  <div className="miembro">
                    <span className="aro">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.foto} alt={`Fotografía de ${m.nombre}`} loading="lazy" />
                    </span>
                    <h2>{m.nombre}</h2>
                    <p>{m.cargo}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <section className="bloque" aria-labelledby="titulo-perfiles">
            <span className="badge claro">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONOS.birrete} /></svg>
              Perfiles profesionales
            </span>
            <h2 id="titulo-perfiles" className="sec">Un equipo de profesionales del <span>más alto nivel</span></h2>
            <p className="intro">La coordinación académica asigna cada caso al especialista adecuado según su área y su complejidad, para que cada estudiante trabaje con el perfil que su investigación requiere.</p>
            <p className="alcance">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
              {ALCANCE}
            </p>
            <ul className="perfiles">
              {EQUIPO.map((p, i) => (
                <li key={p.perfil}>
                  <Reveal delay={i * 70} className="celda">
                    <div className="perfil">
                      <span className="icono" aria-hidden="true">
                        <svg viewBox="0 0 24 24"><path d={ICONOS[p.icono]} /></svg>
                      </span>
                      <h3>{p.perfil}</h3>
                      <p>{p.texto}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>

          <Reveal className="unete">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="unete-fondo" src="/academico/libres/banda-red-luces.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <div>
              <h2>¿Quieres <span>investigar</span> con nosotros?</h2>
              <p>Buscamos profesionales con experiencia en investigación, docencia y análisis de datos.</p>
            </div>
            <a className="cta" href={WHATSAPP_ACADEMICO} target="_blank" rel="noopener noreferrer">
              Escríbenos por WhatsApp <span aria-hidden="true">→</span>
              <span className="sr"> (se abre en una pestaña nueva)</span>
            </a>
          </Reveal>

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

        .hero { position: relative; overflow: hidden; background: radial-gradient(70% 70% at 90% 10%, rgba(4,235,255,0.14), transparent 60%), var(--c-azul); color: var(--c-claro); padding: 100px 16px 64px; border-bottom: 1px solid var(--c-azul-3); }
        .fondo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.45; pointer-events: none; }
        .hero::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(5,17,30,0.4), var(--c-azul) 96%); }
        .hero > .ancho { z-index: 1; }
        .red { z-index: 1; position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.18; pointer-events: none; }
        .red line { stroke-width: 1; stroke-opacity: 0.6; stroke-dasharray: 3 9; animation: flujo 7s linear infinite; }
        .red .nodo { transform-box: fill-box; transform-origin: center; animation: late 3.6s ease-in-out infinite alternate; }
        .red .hub { filter: drop-shadow(0 0 6px rgba(4,235,255,0.7)); }
        @keyframes flujo { to { stroke-dashoffset: -120; } }
        @keyframes late { from { transform: scale(0.85); opacity: 0.7; } to { transform: scale(1.2); opacity: 1; } }

        .migas { display: flex; flex-wrap: wrap; gap: 4px 8px; font-size: var(--t-xs); color: var(--c-apagado); margin-bottom: 18px; }
        .migas :global(a) { color: var(--c-claro-2); text-decoration: none; display: inline-flex; align-items: center; min-height: 32px; }
        .migas :global(a:hover) { color: var(--c-cian); text-decoration: underline; }
        .migas span { display: inline-flex; align-items: center; }
        .migas [aria-current] { color: var(--c-cian); }
        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: var(--r-pill); border: 1px solid rgba(4,235,255,0.35); background: rgba(4,235,255,0.08); color: var(--c-cian); font-size: var(--t-xs); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
        .badge.claro { color: var(--c-teal); border-color: rgba(11,95,117,0.3); background: rgba(11,95,117,0.07); }
        h1 { font-size: 2rem; line-height: 1.1; letter-spacing: -0.02em; margin: 16px 0 0; }
        h1 span { color: var(--c-cian); }
        .lead { color: var(--c-claro-2); font-size: var(--t-base); line-height: 1.65; max-width: 62ch; margin: 14px 0 0; }

        .cuerpo { padding: 0 16px 56px; }
        .miembros { list-style: none; padding: 0; margin: -36px 0 0; position: relative; display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
        .miembros li, .miembros :global(.celda), .perfiles li, .perfiles :global(.celda) { min-width: 0; height: 100%; }
        /* Integrantes: bloque sobrio y compacto (foto, nombre, cargo). */
        .miembro { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: var(--r-xl); padding: 24px 18px 22px; box-shadow: var(--sombra-2); transition: transform var(--d-media) var(--ease), box-shadow var(--d-media) var(--ease); }
        .miembro:hover { transform: translateY(-3px); box-shadow: var(--sombra-3); }
        .aro { width: 112px; height: 112px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, var(--c-cian), var(--c-teal)); }
        .aro img { display: block; width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid #fff; background: var(--c-fondo); }
        .miembro h2 { font-size: var(--t-base); text-transform: uppercase; letter-spacing: 0.04em; line-height: 1.3; margin: 14px 0 4px; overflow-wrap: anywhere; }
        .miembro p { margin: 0; font-size: var(--t-xs); color: var(--c-texto-3); line-height: 1.5; }

        .bloque { margin-top: 56px; }
        .sec { font-size: 1.6rem; line-height: 1.18; letter-spacing: -0.01em; margin: 14px 0 10px; max-width: 24ch; }
        .sec span { color: var(--c-teal); }
        .intro { margin: 0; color: var(--c-texto-2); line-height: 1.7; max-width: 70ch; }
        .alcance { display: flex; align-items: flex-start; gap: 12px; margin: 20px 0 24px; background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-left: 4px solid var(--c-teal); border-radius: var(--r-lg); padding: 14px 16px; font-size: var(--t-sm); line-height: 1.6; color: var(--c-texto-2); }
        .alcance svg { font-size: 22px; color: var(--c-teal); }
        .perfiles { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
        .perfil { box-sizing: border-box; height: 100%; background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: var(--r-xl); padding: 24px 20px; box-shadow: var(--sombra-1); position: relative; overflow: hidden; transition: transform var(--d-media) var(--ease), box-shadow var(--d-media) var(--ease), border-color var(--d-media); }
        .perfil::after { content: ''; position: absolute; inset: auto 0 0; height: 3px; background: linear-gradient(90deg, var(--c-cian), var(--c-teal)); transform: scaleX(0); transform-origin: left; transition: transform var(--d-media) var(--ease); }
        .perfil:hover { transform: translateY(-3px); box-shadow: var(--sombra-2); border-color: rgba(11,95,117,0.25); }
        .perfil:hover::after { transform: scaleX(1); }
        .icono { width: 64px; height: 64px; border-radius: 18px; display: grid; place-items: center; background: linear-gradient(135deg, var(--c-cian), var(--c-teal)); color: var(--c-azul); box-shadow: 0 10px 22px rgba(11,95,117,0.22); }
        .icono svg { font-size: 32px; stroke-width: 1.7; }
        .perfil h3 { font-size: var(--t-lg); line-height: 1.25; margin: 18px 0 8px; }
        .perfil p { margin: 0; color: var(--c-texto-2); line-height: 1.65; font-size: var(--t-sm); }

        .cuerpo :global(.unete) { margin-top: 48px; display: flex; flex-direction: column; align-items: stretch; gap: 20px; background: radial-gradient(70% 120% at 100% 0%, rgba(4,235,255,0.16), transparent 60%), var(--c-azul); color: var(--c-claro-2); border-radius: var(--r-xl); padding: 28px 20px; }
        .cuerpo :global(.unete) { position: relative; overflow: hidden; isolation: isolate; }
        .cuerpo :global(.unete-fondo) { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; object-fit: cover; opacity: 0.55; }
        .cuerpo :global(.unete)::before { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(90deg, rgba(5,17,30,0.92) 30%, rgba(5,17,30,0.45)); }
        .cuerpo :global(.unete h2) { color: var(--c-claro); font-size: var(--t-xl); margin: 0 0 8px; }
        .cuerpo :global(.unete h2 span) { color: var(--c-cian); }
        .cuerpo :global(.unete p) { margin: 0; line-height: 1.65; max-width: 56ch; }
        .cta { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 12px 24px; border-radius: var(--r-pill); background: var(--c-cian); color: var(--c-azul); font-weight: 800; font-size: var(--t-sm); text-decoration: none; transition: box-shadow var(--d-rapida), transform var(--d-rapida); }
        .cta:hover { box-shadow: var(--brillo-cian); transform: translateY(-1px); }
        .volver { margin: 24px 0 0; }
        .volver :global(a) { display: inline-flex; align-items: center; min-height: 44px; color: var(--c-teal); font-weight: 700; }

        @media (min-width: 600px) {
          .hero { padding: 112px 24px 80px; }
          h1 { font-size: 2.6rem; }
          .cuerpo { padding: 0 24px 72px; }
          .miembros, .perfiles { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
          .sec { font-size: 2rem; }
          .cuerpo :global(.unete) { padding: 36px 32px; }
        }
        @media (min-width: 900px) {
          .hero { padding: 136px var(--gutter) 96px; }
          .fondo { opacity: 0.7; -webkit-mask-image: linear-gradient(90deg, transparent 20%, #000 65%); mask-image: linear-gradient(90deg, transparent 20%, #000 65%); }
          .red { left: 50%; width: 50%; opacity: 0.75; -webkit-mask-image: linear-gradient(90deg, transparent, #000 25%); mask-image: linear-gradient(90deg, transparent, #000 25%); }
          .hero .ancho > * { max-width: 48%; }
          h1 { font-size: 3.2rem; }
          .lead { font-size: var(--t-lg); }
          .cuerpo { padding: 0 var(--gutter) 88px; }
          .perfiles { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .perfil { padding: 30px 26px; }
          .sec { font-size: 2.4rem; }
          .cuerpo :global(.unete) { flex-direction: row; align-items: center; justify-content: space-between; padding: 48px; }
        }
        @media (min-width: 1280px) {
          h1 { font-size: 3.8rem; }
          .miembros { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .sec { font-size: 2.7rem; }
        }
        @media (min-width: 1920px) {
          .ancho { --w: 1560px; }
          .app { --t-xs: 0.85rem; --t-sm: 1rem; --t-base: 1.15rem; --t-lg: 1.45rem; --t-xl: 2.2rem; --t-2xl: 3rem; }
          h1 { font-size: 4.4rem; } .sec { font-size: 3.2rem; }
          .aro { width: 144px; height: 144px; }
          .icono { width: 80px; height: 80px; } .icono svg { font-size: 40px; }
        }
        @media (min-width: 2560px) {
          .ancho { --w: 2080px; }
          .app { --t-xs: 1.05rem; --t-sm: 1.25rem; --t-base: 1.4rem; --t-lg: 1.8rem; --t-xl: 2.8rem; --t-2xl: 3.8rem; }
          h1 { font-size: 5.6rem; } .sec { font-size: 4.2rem; }
          .aro { width: 200px; height: 200px; }
          .icono { width: 104px; height: 104px; border-radius: 26px; } .icono svg { font-size: 52px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .red line, .red .nodo { animation: none; }
          .miembro, .miembro:hover, .perfil, .perfil:hover, .perfil::after, .cta, .cta:hover { transition: none; transform: none; }
        }
      `}</style>
    </div>
  );
}
