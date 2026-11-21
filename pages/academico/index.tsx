import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Header from '../../components/home/Header';
import Reveal from '../../components/Reveal';
import Seo from '../../components/Seo';
import CarruselAreas from '../../components/academico/CarruselAreas';
import GloboConocimiento from '../../components/academico/GloboConocimiento';
import IntroInvestigacion from '../../components/academico/IntroInvestigacion';
import PieAcademico from '../../components/academico/PieAcademico';
import { ALCANCE, AREAS, CIFRAS, COMPROMISO, EQUIPO, MIEMBROS, PROCESO, PROYECTOS, SERVICIOS, WHATSAPP_ACADEMICO } from '../../lib/academico';
import { migas } from '../../lib/seo';

const METODO = [
  { n: '01', titulo: 'Búsqueda en Scopus', texto: 'Ecuaciones booleanas por conceptos, conteos con y sin filtros y exportación reproducible del corpus.' },
  { n: '02', titulo: 'Cribado PRISMA 2020', texto: 'Criterios de inclusión y exclusión documentados y diagrama de flujo con cada registro justificado.' },
  { n: '03', titulo: 'Análisis con Bibliometrix', texto: 'Producción científica, redes de coautoría y cocitación, mapas temáticos y autores de mayor impacto.' },
  { n: '04', titulo: 'Matrices de revisión', texto: 'Búsqueda, cribado, extracción y síntesis temática, con el pasaje que respalda cada dato.' },
];

const COLORES = ['#04ebff', '#7aa7ff', '#e8b23a', '#2fd8c9', '#ff8a7a'];

// ---------- Íconos de línea (24×24) ----------
const TRAZOS: Record<string, ReactNode> = {
  microscopio: <><path d="M6 18h8M3 22h18M14 22a7 7 0 0 0 0-14h-1" /><path d="M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></>,
  birrete: <><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /><path d="M22 10v6" /></>,
  libro: <><path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2Z" /><path d="M22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8Z" /></>,
  grafico: <><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-6" /></>,
  base: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  codigo: <><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></>,
  moneda: <><circle cx="12" cy="12" r="9" /><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2m0 8v2" /></>,
  personas: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3.1-6 7-6s7 2.5 7 6" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20c0-3-1.9-5.3-4.5-5.9" /></>,
  balanza: <path d="M12 3v18M7 21h10M5 7h14M12 5l-7 2 -3 7a3.5 3.5 0 0 0 6 0L5 7M19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7" />,
  capas: <><path d="m12 2 10 5-10 5L2 7l10-5Z" /><path d="m2 12 10 5 10-5M2 17l10 5 10-5" /></>,
  pluma: <><path d="M20 4c-8 0-14 6-14 14v2h2c8 0 14-6 14-14V4Z" /><path d="M4 22 14 12" /></>,
  diana: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  ojo: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  escudo: <><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  chispa: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></>,
  mensaje: <><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z" /></>,
  pausa: <><path d="M9 5v14M15 5v14" /></>,
  play: <><path d="M7 4v16l13-8L7 4Z" /></>,
};

function Icono({ n, size = 24 }: { n: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {TRAZOS[n]}
    </svg>
  );
}

// ---------- Red bibliométrica de coocurrencia (estilo VOSviewer), determinista ----------
type RNodo = { x: number; y: number; r: number; c: number; label?: string };
type RArista = { d: string; c: number; w: number };

function semilla(s: number) {
  let a = s;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function construirRed(s: number, w: number, h: number, nucleos: [number, number, string][], porCluster: number) {
  const rnd = semilla(s);
  const nodos: RNodo[] = [];
  const grupos: RNodo[][] = nucleos.map(([cx, cy, label], c) => {
    const g: RNodo[] = [{ x: cx * w, y: cy * h, r: 9, c, label }];
    for (let i = 1; i < porCluster; i += 1) {
      const ang = i * 2.39996 + rnd() * 0.8;
      const rad = (0.05 + 0.035 * Math.sqrt(i)) * w;
      g.push({ x: cx * w + Math.cos(ang) * rad, y: cy * h + Math.sin(ang) * rad * 0.8, r: 2.5 + rnd() * 3.5, c });
    }
    nodos.push(...g);
    return g;
  });
  const aristas: RArista[] = [];
  const unir = (a: RNodo, b: RNodo, wd: number) => {
    const k = (rnd() < 0.5 ? -1 : 1) * (0.1 + rnd() * 0.15);
    const qx = (a.x + b.x) / 2 - (b.y - a.y) * k;
    const qy = (a.y + b.y) / 2 + (b.x - a.x) * k;
    aristas.push({ d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`, c: a.c, w: wd });
  };
  grupos.forEach((g) => g.slice(1).forEach((n) => { unir(g[0], n, 0.9); if (rnd() < 0.4) unir(n, g[1 + Math.floor(rnd() * (g.length - 1))], 0.6); }));
  grupos.forEach((g, i) => grupos.slice(i + 1).forEach((o) => unir(g[0], o[0], 1.4)));
  for (let i = 0; i < nucleos.length * 3; i += 1) {
    const a = grupos[Math.floor(rnd() * grupos.length)];
    const b = grupos[Math.floor(rnd() * grupos.length)];
    if (a !== b) unir(a[Math.floor(rnd() * a.length)], b[Math.floor(rnd() * b.length)], 0.5);
  }
  return { nodos, aristas, w, h };
}

const RED_AREAS = construirRed(7, 1200, 600, [[0.12, 0.25, ''], [0.88, 0.2, ''], [0.08, 0.8, ''], [0.9, 0.82, ''], [0.5, 0.08, '']], 7);
const RED_CTA = construirRed(99, 1200, 500, [[0.15, 0.3, ''], [0.85, 0.35, ''], [0.5, 0.85, ''], [0.3, 0.75, ''], [0.75, 0.8, '']], 8);

function Red({ red, className = '' }: { red: ReturnType<typeof construirRed>; className?: string }) {
  return (
    <svg className={`red ${className}`} viewBox={`0 0 ${red.w} ${red.h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g fill="none">
        {red.aristas.map((a, i) => (
          <path key={i} d={a.d} stroke={COLORES[a.c % COLORES.length]} strokeWidth={a.w} strokeOpacity="0.35" pathLength={1} className="arista" style={{ animationDelay: `${(i % 40) * 45}ms` } as CSSProperties} />
        ))}
      </g>
      {red.nodos.map((n, i) => (
        <g key={i} className="nodo" style={{ animationDelay: `${-(i % 9) * 0.7}s`, animationDuration: `${5 + (i % 5)}s` } as CSSProperties}>
          <circle cx={n.x} cy={n.y} r={n.r} fill={COLORES[n.c % COLORES.length]} fillOpacity={n.label ? 0.9 : 0.65} />
          {n.label && <text x={n.x} y={n.y + n.r + 18} textAnchor="middle" fill={COLORES[n.c % COLORES.length]} fontSize="17" fontWeight="600" opacity="0.8">{n.label}</text>}
        </g>
      ))}
      <style jsx>{`
        .red { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
        .arista { stroke-dasharray: 1; stroke-dashoffset: 1; animation: trazar 2.4s cubic-bezier(0.3, 0, 0.3, 1) forwards; }
        @keyframes trazar { to { stroke-dashoffset: 0; } }
        .nodo { transform-box: fill-box; transform-origin: center; animation: flotar 6s ease-in-out infinite alternate; }
        @keyframes flotar { from { transform: translate(0, 0); } to { transform: translate(4px, -6px); } }
        @media (prefers-reduced-motion: reduce) { .arista { animation: none; stroke-dashoffset: 0; } .nodo { animation: none; } }
      `}</style>
    </svg>
  );
}

// ---------- Ilustraciones científicas (se animan cuando su Reveal entra en pantalla) ----------
function Prisma() {
  const cajas = [
    { y: 10, t: 'Identificación', d: 'Registros en Scopus' },
    { y: 90, t: 'Cribado', d: 'Títulos y resúmenes' },
    { y: 170, t: 'Elegibilidad', d: 'Lectura del texto completo' },
    { y: 250, t: 'Incluidos', d: 'Síntesis y matrices' },
  ];
  const excl = ['Duplicados eliminados', 'Excluidos por criterios', 'Excluidos con motivo'];
  return (
    <svg className="ilus" viewBox="0 0 400 310" role="img" aria-label="Diagrama de flujo PRISMA 2020: identificación, cribado, elegibilidad e inclusión.">
      <defs>
        <marker id="punta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" fill="#0b5f75" /></marker>
        <marker id="punta2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" fill="#93aabb" /></marker>
      </defs>
      {cajas.map((c, i) => (
        <g key={c.t} className="pz" style={{ transitionDelay: `${i * 220}ms` } as CSSProperties}>
          <rect x="8" y={c.y} width="220" height="52" rx="10" fill={i === 3 ? '#0b5f75' : '#fff'} stroke="#0b5f75" strokeWidth="1.5" />
          <text x="22" y={c.y + 22} fontSize="13" fontWeight="700" fill={i === 3 ? '#fff' : '#05111e'}>{c.t}</text>
          <text x="22" y={c.y + 40} fontSize="12" fill={i === 3 ? '#e3eef6' : '#33414d'}>{c.d}</text>
          {i < 3 && <path className="fl" d={`M118 ${c.y + 52}V${c.y + 78}`} stroke="#0b5f75" strokeWidth="1.5" markerEnd="url(#punta)" pathLength={1} />}
          {i < 3 && (
            <>
              <path className="fl" d={`M228 ${c.y + 26}H262`} stroke="#93aabb" strokeWidth="1.5" markerEnd="url(#punta2)" pathLength={1} />
              <rect x="266" y={c.y + 8} width="126" height="36" rx="8" fill="#eaf2f8" stroke="#93aabb" />
              <text x="329" y={c.y + 30} fontSize="10.5" textAnchor="middle" fill="#33414d">{excl[i]}</text>
            </>
          )}
        </g>
      ))}
      <style jsx>{`
        .ilus { display: block; width: 100%; height: auto; }
        .pz { opacity: 0; transform: translateY(8px); transition: opacity 0.6s var(--ease), transform 0.6s var(--ease); }
        :global(.rv.in) .pz { opacity: 1; transform: none; }
        .fl { stroke-dasharray: 1; stroke-dashoffset: 1; fill: none; }
        :global(.rv.in) .fl { animation: trazar 0.8s 0.9s forwards; }
        @keyframes trazar { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) { .pz { opacity: 1; transform: none; transition: none; } .fl { stroke-dashoffset: 0; animation: none !important; } }
      `}</style>
    </svg>
  );
}

const BARRAS = [12, 15, 14, 19, 24, 28, 33, 41, 47, 58, 66, 74];
function Produccion() {
  const max = 80;
  const ancho = 360 / BARRAS.length;
  const pts = BARRAS.map((v, i) => `${(i * ancho + ancho / 2 + 20).toFixed(1)},${(190 - (v / max) * 160).toFixed(1)}`).join(' ');
  return (
    <svg className="ilus" viewBox="0 0 400 220" role="img" aria-label="Ilustración de la producción científica anual creciente, como la que genera Bibliometrix.">
      {[40, 80, 120, 160].map((y) => <line key={y} x1="20" x2="380" y1={190 - y} y2={190 - y} stroke="#05111e" strokeOpacity="0.07" />)}
      <line x1="20" x2="380" y1="190" y2="190" stroke="#05111e" strokeOpacity="0.3" />
      {BARRAS.map((v, i) => (
        <rect key={i} className="b" x={i * ancho + 26} y={190 - (v / max) * 160} width={ancho - 12} height={(v / max) * 160} rx="3" fill={i > 8 ? '#0b5f75' : '#7aa7ff'} style={{ transitionDelay: `${i * 60}ms` } as CSSProperties} />
      ))}
      <polyline className="ln" points={pts} fill="none" stroke="#04b8c9" strokeWidth="2.5" pathLength={1} />
      <text x="20" y="212" fontSize="11" fill="#526373">Años de publicación</text>
      <style jsx>{`
        .ilus { display: block; width: 100%; height: auto; }
        .b { transform-box: fill-box; transform-origin: bottom; transform: scaleY(0); transition: transform 0.9s var(--ease); }
        :global(.rv.in) .b { transform: scaleY(1); }
        .ln { stroke-dasharray: 1; stroke-dashoffset: 1; }
        :global(.rv.in) .ln { animation: trazar 1.6s 0.6s forwards; }
        @keyframes trazar { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) { .b { transform: none; transition: none; } .ln { stroke-dashoffset: 0; animation: none !important; } }
      `}</style>
    </svg>
  );
}

function MapaTematico() {
  const burbujas = [
    { x: 290, y: 75, r: 26, c: 0, t: 'machine learning' }, { x: 235, y: 110, r: 14, c: 1, t: 'retention' },
    { x: 290, y: 215, r: 28, c: 3, t: 'higher education' }, { x: 225, y: 195, r: 12, c: 2, t: 'Scopus' },
    { x: 100, y: 80, r: 14, c: 4, t: 'ethics' }, { x: 95, y: 215, r: 20, c: 1, t: 'LLMs' },
  ];
  return (
    <svg className="ilus" viewBox="0 0 380 300" role="img" aria-label="Ilustración de un mapa temático con cuatro cuadrantes: temas motores, básicos, nicho y emergentes.">
      <rect x="10" y="10" width="360" height="280" rx="14" fill="#fff" />
      <line x1="190" x2="190" y1="24" y2="276" stroke="#05111e" strokeOpacity="0.15" strokeDasharray="4 4" />
      <line x1="24" x2="356" y1="150" y2="150" stroke="#05111e" strokeOpacity="0.15" strokeDasharray="4 4" />
      <text x="350" y="34" textAnchor="end" fontSize="11" fontWeight="700" fill="#0b5f75">Temas motores</text>
      <text x="30" y="34" fontSize="11" fontWeight="700" fill="#0b5f75">Temas nicho</text>
      <text x="350" y="278" textAnchor="end" fontSize="11" fontWeight="700" fill="#0b5f75">Temas básicos</text>
      <text x="30" y="278" fontSize="11" fontWeight="700" fill="#0b5f75">Emergentes</text>
      {burbujas.map((b, i) => (
        <g key={b.t} className="bu" style={{ transitionDelay: `${300 + i * 120}ms` } as CSSProperties}>
          <circle cx={b.x} cy={b.y} r={b.r} fill={COLORES[b.c]} fillOpacity="0.55" stroke={COLORES[b.c]} />
          <text x={b.x} y={b.y + b.r + 13} textAnchor="middle" fontSize="10.5" fill="#33414d">{b.t}</text>
        </g>
      ))}
      <style jsx>{`
        .ilus { display: block; width: 100%; height: auto; }
        .bu { transform-box: fill-box; transform-origin: center; transform: scale(0.4); opacity: 0; transition: transform 0.8s var(--ease), opacity 0.6s; }
        :global(.rv.in) .bu { transform: none; opacity: 1; }
        @media (prefers-reduced-motion: reduce) { .bu { transform: none; opacity: 1; transition: none; } }
      `}</style>
    </svg>
  );
}

// Líneas de tendencia que se dibujan detrás de la franja de estadísticas.
function Tendencia() {
  return (
    <svg className="tend" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="t1" d="M0 170 C150 160 220 120 340 125 S560 70 680 80 900 30 1200 20" pathLength={1} />
      <path className="t2" d="M0 185 C180 180 300 160 420 150 S700 120 820 110 1050 70 1200 60" pathLength={1} />
      <style jsx>{`
        .tend { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 60%; pointer-events: none; }
        path { fill: none; stroke-width: 2; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; animation: trazar 3s 0.3s cubic-bezier(0.3, 0, 0.3, 1) forwards; }
        .t1 { stroke: rgba(4, 235, 255, 0.35); }
        .t2 { stroke: rgba(122, 167, 255, 0.25); animation-delay: 0.8s; }
        @keyframes trazar { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) { path { animation: none; stroke-dashoffset: 0; } }
      `}</style>
    </svg>
  );
}

const ICONO_CIFRA = ['capas', 'libro', 'personas', 'pluma'];

// Cuenta de 0 al valor al entrar en pantalla; valores no enteros («100 %») se muestran tal cual.
function Contador({ valor }: { valor: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [texto, setTexto] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el || !/^\d+$/.test(valor) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const meta = Number(valor);
    let raf = 0;
    setTexto('0');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const inicio = performance.now();
      const paso = (t: number) => {
        const p = Math.min(1, (t - inicio) / 1400);
        setTexto(String(Math.round(meta * (1 - Math.pow(1 - p, 3)))));
        if (p < 1) raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [valor]);

  return <span ref={ref}>{texto}</span>;
}

function Badge({ icono, children, oscuro = false }: { icono: string; children: ReactNode; oscuro?: boolean }) {
  return (
    <span className={`badge ${oscuro ? 'badge-o' : ''}`}>
      <Icono n={icono} size={15} />
      {children}
      <style jsx>{`
        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px 7px 11px; border-radius: var(--r-pill); background: rgba(11, 95, 117, 0.1); color: var(--c-teal); border: 1px solid rgba(11, 95, 117, 0.18); font-size: 12.5px; font-weight: 700; letter-spacing: 0.02em; }
        .badge-o { background: rgba(4, 235, 255, 0.08); color: var(--c-cian); border-color: rgba(4, 235, 255, 0.28); }
        @media (min-width: 1920px) { .badge { font-size: 15px; padding: 10px 20px 10px 14px; } }
      `}</style>
    </span>
  );
}

// ---------- Hero: texto y globo de conocimiento, sin nada encima del globo ----------
function Hero() {
  return (
    <section className="hero" aria-labelledby="t-hero">
      <div className="hero-in">
        <div className="texto">
          <span className="eyebrow"><i />DIVISIÓN DE INVESTIGACIÓN CIENTÍFICA</span>
          <h1 id="t-hero">Ethos <span>Académico</span></h1>
          <p className="sub">
            Formación, asesoría y acompañamiento para investigar con rigor: de la pregunta de investigación al artículo
            científico, con fuentes indexadas, métodos reproducibles y la autoría siempre en manos de quien investiga.
          </p>
          <div className="acciones">
            <a className="btn primario" href={WHATSAPP_ACADEMICO} target="_blank" rel="noopener noreferrer">Agendar una asesoría</a>
            <a className="btn" href="#areas">Explorar las áreas</a>
            <Link className="btn" href="/academico/portafolio">Ver proyectos →</Link>
          </div>
        </div>
      </div>
      <div className="globo" aria-hidden="true"><GloboConocimiento /></div>

      <style jsx>{`
        /* Base móvil (360 px): texto arriba y el globo completo debajo, todo dentro de 100svh. */
        .hero { box-sizing: border-box; position: relative; isolation: isolate; min-height: 100svh; display: flex; flex-direction: column; overflow: hidden; background: radial-gradient(70% 50% at 70% 60%, rgba(4, 235, 255, 0.1), transparent 70%), linear-gradient(160deg, var(--c-azul-profundo), var(--c-azul) 50%, #0a2236); color: var(--c-claro); padding: 84px 16px 8px; }
        .hero-in { position: relative; z-index: 1; width: 100%; max-width: var(--ancho-hero); margin: 0 auto; }
        .texto { max-width: 640px; }
        .eyebrow { display: inline-flex; align-items: center; gap: 8px; font: 700 10.5px/1.3 var(--f-mono); letter-spacing: 0.16em; color: var(--c-cian); }
        .eyebrow i { flex: none; width: 20px; height: 2px; background: var(--c-cian); }
        h1 { font-size: clamp(2.3rem, 11vw, 3rem); line-height: 1.02; margin: 10px 0 0; letter-spacing: -0.02em; }
        h1 span { color: var(--c-cian); }
        .sub { color: var(--c-claro-2); font-size: 0.92rem; line-height: 1.55; margin: 10px 0 0; }
        .hero .acciones { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
        .hero .acciones :global(.btn) { box-sizing: border-box; width: 100%; justify-content: center; padding: 11px 18px; }
        .globo { position: relative; flex: 1 1 auto; min-height: 220px; margin: 4px -16px 0; }

        @media (min-width: 600px) {
          .hero { padding: 104px var(--gutter) 16px; }
          .eyebrow { font-size: 12px; letter-spacing: 0.2em; }
          .eyebrow i { width: 28px; }
          h1 { font-size: clamp(3rem, 8vw, 4.2rem); }
          .sub { font-size: var(--t-lg); line-height: 1.6; max-width: 60ch; }
          .hero .acciones { flex-direction: row; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
          .hero .acciones :global(.btn) { width: auto; padding: 13px 22px; }
          .globo { min-height: 320px; margin: 8px calc(-1 * var(--gutter)) 0; }
        }
        /* Escritorio: texto a la izquierda y el globo grande a la derecha, a toda la altura. */
        @media (min-width: 900px) {
          .hero { justify-content: center; padding-top: 110px; padding-bottom: 40px; }
          .texto { max-width: min(600px, 46%); }
          .globo { position: absolute; z-index: 0; top: 64px; bottom: 0; left: 40%; right: 0; margin: 0; min-height: 0; }
        }
        @media (min-width: 1280px) {
          h1 { font-size: 5.2rem; }
          .texto { max-width: min(640px, 48%); }
          .globo { left: 38%; right: -2%; }
        }
        @media (min-width: 1920px) {
          h1 { font-size: 6.6rem; }
          .sub { font-size: 1.45rem; }
          .texto { max-width: min(820px, 48%); }
        }
        @media (min-width: 2560px) {
          h1 { font-size: 7.6rem; }
          .sub { font-size: 1.7rem; }
        }
      `}</style>
    </section>
  );
}

export default function Academico() {
  const destacado = PROYECTOS[0];
  const imagen = destacado.imagenes[0];
  return (
    <div className="app">
      <Seo
        titulo="Ethos Académico — formación y asesoría en investigación científica | Ethos IA"
        descripcion="División de investigación científica de Ethos IA: asesoría metodológica, talleres y acompañamiento en tesis, artículos, estadística, Power BI y revisión sistemática con Scopus y Bibliometrix."
        ruta="/academico"
        jsonld={[migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Ethos Académico', ruta: '/academico' }])]}
      />
      <IntroInvestigacion />
      <Header />

      <Hero />

      <main id="contenido-principal">
        <section className="areas" id="areas">
          <Red red={RED_AREAS} className="red-suave" />
          <div className="ancho centro">
            <Reveal><Badge icono="capas" oscuro>Áreas de conocimiento</Badge></Reveal>
            <Reveal><h2 className="claro-t">Recorra nuestras <em>áreas</em></h2></Reveal>
            <Reveal><p className="tenue">Deslice, use las flechas o el teclado para recorrerlas.</p></Reveal>
            <CarruselAreas areas={AREAS} />
          </div>
        </section>

        <section className="stats" aria-labelledby="t-cifras">
          <Tendencia />
          <div className="ancho">
            <div className="centro"><Badge icono="grafico" oscuro>Nuestras estadísticas</Badge></div>
            <h2 id="t-cifras" className="sr">Ethos Académico en cifras</h2>
            <ul className="cifras">
              {CIFRAS.map((c, i) => (
                <li key={c.etiqueta}>
                  <Reveal delay={i * 90} className="cifra">
                    <span className="mosaico"><Icono n={ICONO_CIFRA[i % ICONO_CIFRA.length]} size={26} /></span>
                    <span className="dato">
                      <strong><Contador valor={c.valor} /></strong>
                      <span>{c.etiqueta}</span>
                    </span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="claro" id="nosotros">
          <div className="ancho dos">
            <Reveal className="foto">
              <video autoPlay muted loop playsInline controls preload="metadata" poster="/academico/video/como-investigamos.jpg" aria-label="Video: demostración de una investigación, del método a los resultados">
                <source src="/academico/video/como-investigamos.webm" type="video/webm" />
                <source src="/academico/video/como-investigamos.mp4" type="video/mp4" />
              </video>
            </Reveal>
            <Reveal delay={100}>
              <Badge icono="personas">Sobre nosotros</Badge>
              <h2>Una escuela de <em>investigación</em> dentro de una empresa de tecnología</h2>
              <p>
                Ethos Académico reúne a profesionales de la ingeniería, la economía, la educación y las ciencias sociales
                para fortalecer las capacidades investigativas de estudiantes de grado y posgrado. {ALCANCE}
              </p>
              <p>
                Trabajamos con las mismas herramientas que usamos en nuestros propios proyectos: Scopus, Bibliometrix, Python, R
                y Power BI, y con una regla que no cambia: cada afirmación se respalda en una fuente verificable.
              </p>
              <div className="contacto">
                <span className="mosaico peq"><Icono n="mensaje" /></span>
                <div>
                  <strong>Atención académica</strong>
                  <span>Asesoría por WhatsApp y correo electrónico.</span>
                  <div className="enlaces">
                    <a className="subr" href={WHATSAPP_ACADEMICO} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
                    <a className="subr" href="mailto:ethos.ia.ec@gmail.com?subject=Ethos%20Acad%C3%A9mico">ethos.ia.ec@gmail.com</a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="ancho mv">
            <Reveal className="mv-card">
              <span className="mosaico"><Icono n="diana" size={24} /></span>
              <Badge icono="chispa">Misión</Badge>
              <h3>Nuestra <em>misión</em></h3>
              <p>Fortalecer las competencias científicas y metodológicas de estudiantes e investigadores mediante asesoría especializada, formación práctica y acompañamiento técnico, con ética y rigor.</p>
            </Reveal>
            <Reveal className="mv-card" delay={120}>
              <span className="mosaico"><Icono n="ojo" size={24} /></span>
              <Badge icono="chispa">Visión</Badge>
              <h3>Nuestra <em>visión</em></h3>
              <p>Ser un referente en formación investigativa en Ecuador, impulsando producción científica de alto impacto publicada en bases como Scopus y Web of Science.</p>
            </Reveal>
          </div>
        </section>

        <section className="blanco" id="lineas">
          <div className="ancho">
            <div className="cabeza-dos">
              <div>
                <Reveal><Badge icono="capas">Nuestras líneas</Badge></Reveal>
                <Reveal><h2>Líneas de <em>investigación</em></h2></Reveal>
                <Reveal><p className="resumen">Diez áreas de conocimiento, cada una con sus herramientas, normas y temas de trabajo, organizadas como un campo científico se organiza en un mapa temático.</p></Reveal>
              </div>
              <Reveal className="fig-ilus" delay={120}>
                <MapaTematico />
                <span className="pie-ilus">Ilustración: mapa temático por densidad y centralidad.</span>
              </Reveal>
            </div>
            <ul className="lineas">
              {AREAS.map((a, i) => (
                <li key={a.id}>
                  <Reveal delay={(i % 4) * 80} className={`linea l${i % 4}`}>
                    <div className="l-cab">
                      <span className="l-icono"><Icono n={a.icono} size={24} /></span>
                      <h3>{a.titulo}</h3>
                    </div>
                    <div className="l-cuerpo">
                      <p>{a.texto}</p>
                      <ul>{a.temas.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="claro" id="metodo">
          <div className="ancho">
            <div className="cabeza">
              <Reveal><Badge icono="microscopio">Método de investigación</Badge></Reveal>
              <Reveal><h2>Del corpus a la <em>síntesis</em>, paso a paso</h2></Reveal>
              <Reveal><p className="resumen">Un flujo reproducible en el que cada decisión queda documentada y respaldada con evidencia.</p></Reveal>
            </div>
            <ol className="tiempo">
              {METODO.map((m, i) => (
                <li key={m.n}>
                  <Reveal delay={i * 120} className="hito">
                    <span className="nodo">{m.n}</span>
                    <div className="hito-t">
                      <h3>{m.titulo}</h3>
                      <p>{m.texto}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <div className="figuras">
              <Reveal className="fig-ilus">
                <Prisma />
                <span className="pie-ilus">Diagrama de flujo PRISMA 2020 aplicado al cribado.</span>
              </Reveal>
              <Reveal className="fig-ilus" delay={120}>
                <Produccion />
                <span className="pie-ilus">Ilustración: producción científica anual, como la reporta Bibliometrix.</span>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="blanco" id="servicios">
          <div className="ancho">
            <div className="cabeza">
              <Reveal><Badge icono="birrete">Servicios</Badge></Reveal>
              <Reveal><h2>Formación y asesoría a la medida de cada <em>etapa</em></h2></Reveal>
            </div>
            <div className="rejilla">
              {SERVICIOS.map((s, i) => (
                <Reveal key={s.n} delay={i * 80} className="card">
                  <span className="card-n">{s.n}</span>
                  <h3>{s.titulo}</h3>
                  <p>{s.texto}</p>
                </Reveal>
              ))}
            </div>
            <h3 className="sub-t">Cómo trabajamos</h3>
            <ol className="proceso">
              {PROCESO.map((p, i) => (
                <li key={p.titulo}>
                  <Reveal delay={i * 80} className="proc">
                    <span className="proc-n">{i + 1}</span>
                    <div><strong>{p.titulo}</strong><p>{p.texto}</p></div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="oscuro" id="proyectos">
          <div className="ancho dos">
            <Reveal>
              <Badge icono="grafico" oscuro>Proyecto destacado</Badge>
              <span className="area-p">{destacado.area}</span>
              <h2 className="claro-t">{destacado.titulo}</h2>
              <p className="tenue">{destacado.texto}</p>
              <div className="tags">{destacado.etiquetas.map((t) => <span key={t}>{t}</span>)}</div>
              <div className="acciones">
                <Link className="btn primario" href="/academico/portafolio">Ver el portafolio completo →</Link>
              </div>
            </Reveal>
            <Reveal className="demo" delay={120}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagen.src} alt={imagen.descripcion} loading="lazy" />
              <span className="demo-pie">{imagen.titulo}</span>
            </Reveal>
          </div>
        </section>

        <section className="claro" id="equipo">
          <div className="ancho">
            <div className="cabeza">
              <Reveal><Badge icono="personas">Equipo</Badge></Reveal>
              <Reveal><h2>Un equipo de profesionales del más alto <em>nivel</em></h2></Reveal>
              <Reveal><p className="resumen">{ALCANCE}</p></Reveal>
            </div>
            <ul className="miembros">
              {MIEMBROS.map((m, i) => (
                <li key={m.nombre}>
                  <Reveal delay={i * 70} className="miembro">
                    <span className="retrato">
                      <Image src={m.foto} alt={`Fotografía de ${m.nombre}`} width={160} height={160} sizes="80px" />
                    </span>
                    <span className="m-txt">
                      <strong>{m.nombre}</strong>
                      <span className="cargo">{m.cargo}</span>
                    </span>
                  </Reveal>
                </li>
              ))}
            </ul>
            <ul className="perfiles">
              {EQUIPO.map((p) => (
                <li key={p.perfil}>
                  <span className="p-icono"><Icono n={p.icono} size={18} /></span>
                  <span><strong>{p.perfil}</strong><span className="p-txt">{p.texto}</span></span>
                </li>
              ))}
            </ul>
            <p className="mas"><Link className="subr" href="/academico/equipo">Conocer al equipo →</Link></p>
          </div>
        </section>

        <section className="kit">
          <div className="ancho dos">
            <Reveal>
              <Badge icono="codigo" oscuro>Aporte abierto</Badge>
              <h2 className="claro-t">Ethos IA <em>Academia</em>: nuestras metodologías, abiertas a la comunidad científica</h2>
              <p className="tenue">75 metodologías y un servidor MCP que funcionan con Claude, GPT, Gemini, DeepSeek, Qwen o un modelo local. Licencia MIT.</p>
              <div className="acciones">
                <Link className="btn primario" href="/academia">Conocer el kit</Link>
              </div>
            </Reveal>
            <Reveal className="terminal" delay={120}>
              <div className="barra"><i /><i /><i /></div>
              <pre>{`$ git clone github.com/IngMarlonPerez/ethos-ia-academia
$ powershell -File instalar.ps1
  ✓ Python listo
  ✓ Metodologías registradas
  ✓ Scopus · OpenAlex · Unpaywall`}</pre>
            </Reveal>
          </div>
        </section>

        <section className="claro" id="compromiso">
          <div className="ancho">
            <Reveal className="compromiso">
              <Badge icono="escudo">Integridad académica</Badge>
              <h2>Nuestro <em>compromiso</em></h2>
              <div className="dos-listas">
                <div>
                  <h3 className="lista-t">Lo que hacemos</h3>
                  <ul className="si">{COMPROMISO.si.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
                <div>
                  <h3 className="lista-t">Lo que no hacemos</h3>
                  <ul className="no">{COMPROMISO.no.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="cta">
          <div className="ancho">
            <Reveal className="cta-in">
              <Red red={RED_CTA} className="red-suave" />
              <Badge icono="mensaje" oscuro>Contacto</Badge>
              <h2 className="claro-t">¿Empieza su <em>investigación</em>?</h2>
              <p className="tenue">Cuéntenos en qué etapa se encuentra y armamos un plan de acompañamiento.</p>
              <div className="acciones centro-f">
                <a className="btn primario" href={WHATSAPP_ACADEMICO} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
                <a className="btn" href="mailto:ethos.ia.ec@gmail.com?subject=Ethos%20Acad%C3%A9mico">Escribir un correo</a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <PieAcademico />

      <style jsx>{`
        /* Mobile-first: base 360 px; luego 600, 900, 1280, 1920 y 2560. */
        .app { --ancho: var(--ancho-max); --ancho-hero: var(--ancho-max); min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; overflow-x: clip; }
        .ancho { position: relative; max-width: var(--ancho); margin: 0 auto; padding: 0 16px; }
        .centro { text-align: center; }
        .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .dos { display: grid; grid-template-columns: minmax(0, 1fr); gap: 36px; align-items: center; }
        section { position: relative; padding: 56px 0; scroll-margin-top: 72px; overflow-x: clip; }
        .claro { background: var(--c-fondo); }
        #nosotros { min-height: var(--alto); display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; }
        #nosotros > :global(.ancho) { box-sizing: border-box; width: 100%; }
        /* Video protagonista a todo el ancho y texto debajo, en todas las pantallas. */
        #nosotros .dos { grid-template-columns: minmax(0, 1fr); gap: clamp(28px, 4vw, 48px); justify-items: center; }
        #nosotros .dos > :global(*) { width: 100%; max-width: 1100px; }
        #nosotros .dos > :global(*:last-child) { max-width: 860px; }
        .blanco { background: #fff; }
        .oscuro { background: var(--c-azul); color: var(--c-claro-2); }
        .kit { background: linear-gradient(135deg, var(--c-azul-profundo), var(--c-azul-2)); color: var(--c-claro-2); }
        h2 { font-size: clamp(1.6rem, 7vw, 1.9rem); line-height: 1.15; margin: 14px 0 12px; letter-spacing: -0.015em; text-wrap: balance; overflow-wrap: break-word; }
        h2 :global(em), h3 :global(em) { font-style: normal; color: var(--c-teal); }
        .claro-t { color: var(--c-claro); }
        .claro-t :global(em) { color: var(--c-cian); }
        .cabeza { text-align: center; max-width: 760px; margin: 0 auto; }
        p { font-size: 15px; }
        .resumen, .claro p, .blanco p { color: var(--c-texto-2); line-height: 1.7; }
        .tenue { color: var(--c-apagado); line-height: 1.7; }
        .app :global(.acciones) { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 24px; }
        .app :global(.centro-f) { justify-content: center; }
        .app :global(.acciones .btn) { display: inline-flex; align-items: center; padding: 12px 20px; border-radius: var(--r-pill); border: 1px solid var(--c-azul-3); color: var(--c-claro); font-size: 14px; font-weight: 700; text-decoration: none; transition: transform var(--d-rapida), box-shadow var(--d-rapida), border-color var(--d-rapida); }
        .app :global(.acciones .btn:hover) { transform: translateY(-2px); border-color: var(--c-cian); }
        .app :global(.acciones .btn.primario) { background: var(--c-cian); color: var(--c-azul); border-color: var(--c-cian); box-shadow: var(--brillo-cian); }
        .app :global(.acciones .btn.primario:hover) { box-shadow: 0 18px 40px rgba(4, 235, 255, 0.32); }
        :global(.subr) { color: var(--c-teal); font-weight: 700; text-decoration: none; background: linear-gradient(currentColor, currentColor) 0 100% / 0 2px no-repeat; transition: background-size var(--d-media) var(--ease); padding-bottom: 2px; }
        :global(.subr:hover), :global(.subr:focus-visible) { background-size: 100% 2px; }

        .mosaico { flex: none; display: grid; place-items: center; width: 50px; height: 50px; border-radius: 16px; background: linear-gradient(135deg, var(--c-cian), #3fc4ff); color: var(--c-azul); box-shadow: 0 12px 26px rgba(4, 235, 255, 0.22); }
        .mosaico.peq { width: 46px; height: 46px; border-radius: 14px; }
        .app :global(.red-suave) { opacity: 0.32; z-index: -1; }

        .areas { isolation: isolate; background: radial-gradient(60% 70% at 50% 0%, rgba(4, 235, 255, 0.1), transparent 70%), var(--c-azul); color: var(--c-claro-2); }
        /* El carrusel cabe exacto en una pantalla: la sección mide 100svh (descontando el encabezado fijo) y el 3D toma el espacio que sobra. */
        #areas { box-sizing: border-box; scroll-margin-top: 0; height: 100svh; min-height: 540px; padding: calc(var(--alto-hd, 76px) + 8px) 0 12px; display: flex; flex-direction: column; }
        #areas > .ancho { box-sizing: border-box; width: 100%; flex: 1; min-height: 0; display: flex; flex-direction: column; }
        #areas h2 { margin-block: 6px 4px; }
        #areas .tenue { margin: 0; }
        /* Pantallas bajas (portátiles de 13-14"): se gana alto para el 3D. */
        @media (max-height: 760px) { #areas .tenue { display: none; } #areas h2 { font-size: clamp(24px, 4.2vh, 34px); } }

        .stats { isolation: isolate; background: linear-gradient(180deg, var(--c-azul-2), var(--c-azul)); color: var(--c-claro); padding: 48px 0; border-top: 1px solid var(--c-azul-3); }
        .cifras { list-style: none; padding: 0; margin: 24px 0 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .cifras :global(.cifra) { box-sizing: border-box; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: 16px; border-radius: var(--r-lg); background: rgba(10, 27, 43, 0.78); border: 1px solid var(--c-azul-3); height: 100%; backdrop-filter: blur(4px); transition: transform var(--d-media) var(--ease), border-color var(--d-media); }
        .cifras :global(.cifra:hover) { transform: translateY(-4px); border-color: rgba(4, 235, 255, 0.45); }
        .dato { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .dato strong { font-size: 2rem; line-height: 1; color: #fff; font-variant-numeric: tabular-nums; white-space: nowrap; }
        .dato > span { font-size: 13px; line-height: 1.35; color: var(--c-claro-2); }

        .claro :global(.foto) { position: relative; }
        .claro :global(.foto video) { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 22px; background: #05111e; box-shadow: var(--sombra-3); }
        .claro :global(.foto img) { display: block; width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 22px; box-shadow: var(--sombra-3); }
        .sello { position: absolute; left: 12px; bottom: 12px; display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: var(--r-lg); background: var(--c-azul); color: var(--c-claro-2); font-size: 13px; box-shadow: var(--sombra-3); }
        .sello strong { font-size: 1.6rem; line-height: 1; color: var(--c-cian); }
        .contacto { display: flex; flex-direction: column; gap: 14px; margin-top: 22px; padding: 18px; border-radius: var(--r-lg); background: var(--c-tarjeta); box-shadow: var(--sombra-2); border-left: 4px solid var(--c-cian); }
        .contacto strong { display: block; }
        .contacto > div > span { font-size: 14px; color: var(--c-texto-3); }
        .enlaces { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 8px; font-size: 14px; overflow-wrap: anywhere; }
        .mv { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; margin-top: 48px; }
        .mv :global(.mv-card) { position: relative; height: 100%; background: var(--c-tarjeta); border-radius: var(--r-xl); padding: 24px 22px; box-shadow: var(--sombra-1); overflow: hidden; transition: transform var(--d-media) var(--ease), box-shadow var(--d-media); }
        .mv :global(.mv-card)::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: linear-gradient(var(--c-cian), var(--c-teal)); }
        .mv :global(.mv-card:hover) { transform: translateY(-4px); box-shadow: var(--sombra-2); }
        .mv .mosaico { position: absolute; right: 18px; top: 18px; width: 44px; height: 44px; border-radius: 14px; }
        .mv h3 { font-size: var(--t-xl); margin: 14px 0 10px; }
        .mv p { margin: 0; }

        .cabeza-dos { display: grid; grid-template-columns: minmax(0, 1fr); gap: 28px; align-items: center; }
        .app :global(.fig-ilus) { background: var(--c-fondo); border: 1px solid var(--c-borde); border-radius: var(--r-xl); padding: 12px; box-shadow: var(--sombra-1); }
        .pie-ilus { display: block; margin-top: 8px; font-size: 12.5px; color: var(--c-texto-3); text-align: center; }
        .lineas { list-style: none; padding: 0; margin: 36px 0 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
        .lineas :global(.linea) { height: 100%; display: flex; flex-direction: column; border-radius: var(--r-lg); background: var(--c-tarjeta); border: 1px solid var(--c-borde); box-shadow: var(--sombra-1); overflow: hidden; transition: transform var(--d-media) var(--ease), box-shadow var(--d-media); }
        .lineas :global(.linea:hover) { transform: translateY(-6px); box-shadow: var(--sombra-2); }
        .l-cab { position: relative; display: flex; align-items: center; gap: 14px; padding: 18px; color: #fff; min-height: 84px; background-size: 14px 14px, auto; }
        .lineas :global(.l0) .l-cab { background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1.5px), linear-gradient(135deg, var(--c-azul), var(--c-teal)); }
        .lineas :global(.l1) .l-cab { background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1.5px), linear-gradient(135deg, var(--c-teal), #0a4a6b); }
        .lineas :global(.l2) .l-cab { background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1.5px), linear-gradient(135deg, #0a2540, #2c4f8f); }
        .lineas :global(.l3) .l-cab { background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1.5px), linear-gradient(135deg, var(--c-azul-2), #0d3d55); }
        .l-icono { flex: none; display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: var(--c-cian); color: var(--c-azul); transition: transform var(--d-media) var(--ease); }
        .lineas :global(.linea:hover) .l-icono { transform: rotate(-8deg) scale(1.08); }
        .l-cab h3 { margin: 0; font-size: 17px; line-height: 1.3; }
        .l-cuerpo { padding: 18px 20px 22px; display: flex; flex-direction: column; gap: 14px; flex: 1; }
        .l-cuerpo p { margin: 0; font-size: 14.5px; }
        .l-cuerpo ul { list-style: none; padding: 14px 0 0; margin: auto 0 0; border-top: 1px solid var(--c-borde); display: grid; gap: 8px; }
        .l-cuerpo li { position: relative; padding-left: 22px; font-size: 14px; font-weight: 600; color: var(--c-texto); }
        .l-cuerpo li::before { content: ''; position: absolute; left: 2px; top: 6px; width: 8px; height: 8px; border-radius: 2px; background: var(--c-teal); transform: rotate(45deg); }

        .tiempo { list-style: none; padding: 0; margin: 40px 0 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 18px; position: relative; }
        .tiempo::before { content: ''; position: absolute; left: 25px; top: 26px; bottom: 26px; width: 2px; background: linear-gradient(180deg, var(--c-cian), var(--c-teal), var(--c-violeta)); opacity: 0.6; }
        .tiempo :global(.hito) { display: flex; flex-direction: row; align-items: flex-start; gap: 14px; height: 100%; }
        .nodo { position: relative; z-index: 1; flex: none; display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; background: var(--c-azul); color: var(--c-cian); font: 700 14px/1 var(--f-mono); box-shadow: 0 0 0 6px var(--c-fondo), 0 0 0 7px rgba(4, 235, 255, 0.35); transition: transform var(--d-media) var(--ease), box-shadow var(--d-media); }
        .tiempo :global(.hito:hover) .nodo { transform: scale(1.08); box-shadow: 0 0 0 6px var(--c-fondo), 0 0 0 7px var(--c-cian), 0 0 28px rgba(4, 235, 255, 0.45); }
        .hito-t { box-sizing: border-box; flex: 1; min-width: 0; overflow-wrap: break-word; hyphens: auto; background: var(--c-tarjeta); border-radius: var(--r-lg); padding: 18px; box-shadow: var(--sombra-1); transition: transform var(--d-media) var(--ease), box-shadow var(--d-media); }
        .tiempo :global(.hito:hover) .hito-t { transform: translateY(-4px); box-shadow: var(--sombra-2); }
        .hito-t h3 { margin: 0 0 6px; font-size: 16px; }
        .hito-t p { margin: 0; font-size: 14px; }
        .figuras { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; margin-top: 36px; }
        .figuras :global(.fig-ilus) { background: #fff; }

        .rejilla { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; margin-top: 36px; }
        .rejilla :global(.card) { position: relative; height: 100%; background: var(--c-fondo); border-radius: var(--r-lg); padding: 24px 22px; border: 1px solid var(--c-borde); overflow: hidden; transition: transform var(--d-media) var(--ease), box-shadow var(--d-media), background var(--d-media); }
        .rejilla :global(.card)::before { content: ''; position: absolute; left: 0; top: 0; height: 4px; width: 0; background: linear-gradient(90deg, var(--c-cian), var(--c-teal)); transition: width var(--d-lenta) var(--ease); }
        .rejilla :global(.card:hover) { transform: translateY(-6px); box-shadow: var(--sombra-2); background: #fff; }
        .rejilla :global(.card:hover)::before { width: 100%; }
        .card-n { font: 700 13px/1 var(--f-mono); color: var(--c-teal); }
        .rejilla h3 { margin: 12px 0 8px; font-size: 18px; }
        .rejilla p { margin: 0; font-size: 14.5px; }
        .sub-t { margin: 48px 0 0; font-size: var(--t-xl); text-align: center; }
        .proceso { list-style: none; padding: 0; margin: 24px 0 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 18px; }
        .proceso :global(.proc) { display: flex; gap: 14px; align-items: flex-start; }
        .proc-n { flex: none; width: 38px; height: 38px; border-radius: 12px; background: var(--c-azul); color: var(--c-cian); display: grid; place-items: center; font-weight: 700; }
        .proceso p { margin: 4px 0 0; font-size: 14px; }

        .area-p { display: block; margin-top: 16px; font: 700 11.5px/1.3 var(--f-mono); letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-cian-suave); }
        .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
        .tags span { font: 600 12px/1 var(--f-mono); padding: 8px 13px; border-radius: var(--r-pill); border: 1px solid var(--c-azul-3); color: var(--c-cian-suave); }
        .oscuro :global(.demo) { position: relative; padding: 10px; border-radius: var(--r-xl); background: #fff; box-shadow: var(--sombra-3), 0 0 0 1px rgba(4, 235, 255, 0.35); transition: transform var(--d-lenta) var(--ease); }
        .oscuro :global(.demo:hover) { transform: translateY(-6px); }
        .oscuro :global(.demo img) { width: 100%; max-width: 100%; display: block; border-radius: var(--r-md); }
        .demo-pie { display: block; padding: 10px 6px 4px; font-size: 13px; font-weight: 600; color: var(--c-texto-2); }

        /* Equipo: breve y sobrio. */
        .miembros { list-style: none; padding: 0; margin: 32px 0 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; }
        .miembros :global(.miembro) { display: flex; align-items: center; gap: 14px; height: 100%; padding: 14px; background: var(--c-tarjeta); border-radius: var(--r-lg); border: 1px solid var(--c-borde); transition: transform var(--d-media) var(--ease), box-shadow var(--d-media); }
        .miembros :global(.miembro:hover) { transform: translateY(-3px); box-shadow: var(--sombra-1); }
        .retrato { flex: none; display: block; width: 60px; height: 60px; border-radius: 50%; overflow: hidden; box-shadow: 0 0 0 3px #fff, 0 0 0 4px rgba(11, 95, 117, 0.35); }
        .retrato :global(img) { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; display: block; }
        .m-txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .m-txt strong { font-size: 15px; }
        .cargo { font-size: 12.5px; line-height: 1.4; color: var(--c-texto-3); }
        .perfiles { list-style: none; padding: 0; margin: 24px 0 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px 24px; }
        .perfiles li { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; border-top: 1px solid var(--c-borde); }
        .p-icono { flex: none; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: rgba(11, 95, 117, 0.1); color: var(--c-teal); }
        .perfiles strong { display: block; font-size: 14.5px; }
        .p-txt { display: block; font-size: 13.5px; line-height: 1.5; color: var(--c-texto-2); }
        .mas { margin: 24px 0 0; text-align: center; }

        .kit :global(.terminal) { background: #02070d; border: 1px solid var(--c-azul-3); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--sombra-3); min-width: 0; }
        .barra { display: flex; gap: 7px; padding: 12px 16px; background: var(--c-azul-2); }
        .barra i { width: 11px; height: 11px; border-radius: 50%; background: var(--c-azul-3); }
        pre { margin: 0; padding: 18px; color: var(--c-cian-suave); font: 12px/1.8 var(--f-mono); overflow-x: auto; }

        .claro :global(.compromiso) { background: var(--c-tarjeta); border-radius: 22px; padding: 26px 20px; box-shadow: var(--sombra-2); border-top: 5px solid var(--c-cian); }
        .dos-listas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 28px; margin-top: 18px; }
        .lista-t { margin: 0 0 12px; font-size: 16px; }
        .dos-listas ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
        .dos-listas li { position: relative; padding-left: 34px; color: var(--c-texto-2); line-height: 1.6; font-size: 15px; }
        .dos-listas li::before { position: absolute; left: 0; top: 1px; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; }
        .si li::before { content: '✓'; background: var(--c-ok-bg); color: var(--c-ok); }
        .no li::before { content: '✕'; background: var(--c-aviso-bg); color: var(--c-aviso); }

        .cta { background: var(--c-fondo); padding-top: 0; }
        .cta :global(.cta-in) { position: relative; overflow: hidden; isolation: isolate; text-align: center; padding: 40px 18px; border-radius: 22px; background: radial-gradient(50% 90% at 50% 0%, rgba(4, 235, 255, 0.18), transparent 70%), linear-gradient(135deg, var(--c-azul-profundo), var(--c-azul-2)); box-shadow: var(--sombra-3); }

        @media (min-width: 600px) {
          .ancho { padding: 0 var(--gutter); }
          section { padding: 72px 0; }
          h2 { font-size: var(--t-2xl); }
          p { font-size: 16px; }
          .cifras :global(.cifra) { flex-direction: row; align-items: center; padding: 20px; }
          .mosaico { width: 56px; height: 56px; border-radius: 18px; }
          .contacto { flex-direction: row; padding: 20px 22px; }
          .lineas, .rejilla, .proceso, .miembros, .perfiles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .claro :global(.compromiso) { padding: 40px; }
          .cta :global(.cta-in) { padding: 56px 32px; }
          pre { font-size: 13px; padding: 22px; }
        }
        @media (min-width: 900px) {
          section { padding: 96px 0; }
          .dos { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; }
          .cifras { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
          .mv, .dos-listas, .figuras { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
          .mv { gap: 22px; margin-top: 80px; }
          .cabeza-dos { grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr); gap: 56px; }
          .perfiles { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .claro :global(.foto)::before { content: ''; position: absolute; inset: 18px -18px -18px 18px; border: 2px solid rgba(11, 95, 117, 0.25); border-radius: 22px; z-index: -1; }
          .sello { left: -14px; bottom: 28px; padding: 14px 20px; }
          .tiempo { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; margin-top: 56px; }
          .tiempo::before { left: 12%; right: 12%; top: 32px; bottom: auto; width: auto; height: 2px; background: linear-gradient(90deg, var(--c-cian), var(--c-teal), var(--c-violeta)); }
          .tiempo :global(.hito) { flex-direction: column; align-items: center; text-align: center; gap: 18px; }
          .nodo { width: 64px; height: 64px; box-shadow: 0 0 0 8px var(--c-fondo), 0 0 0 9px rgba(4, 235, 255, 0.35); }
          .tiempo :global(.hito:hover) .nodo { box-shadow: 0 0 0 8px var(--c-fondo), 0 0 0 9px var(--c-cian), 0 0 28px rgba(4, 235, 255, 0.45); }
          .hito-t { width: 100%; padding: 22px 20px; }
        }
        @media (min-width: 1280px) {
          section { padding: 112px 0; }
          .rejilla, .proceso, .miembros { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          /* 10 áreas: dos filas parejas de 5. */
          .lineas { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        }
        @media (min-width: 1920px) {
          .app { --ancho: 1440px; --ancho-hero: 1440px; }
          h2 { font-size: 3.4rem; }
          p, .resumen, .tenue { font-size: 1.15rem; }
          .l-cab h3, .hito-t h3 { font-size: 19px; }
          .l-cuerpo p, .hito-t p, .rejilla p { font-size: 16px; }
          .cabeza { max-width: 900px; }
          .dato strong { font-size: 3rem; }
          .retrato { width: 72px; height: 72px; }
        }
        @media (min-width: 2560px) {
          .app { --ancho: 1680px; --ancho-hero: 1680px; }
          h2 { font-size: 4rem; }
          p, .resumen, .tenue { font-size: 1.3rem; }
        }
      `}</style>
    </div>
  );
}
