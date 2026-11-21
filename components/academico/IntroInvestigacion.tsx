import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { programarSonidoAcademico } from '../../lib/sonidoAcademico';

// Intro de Ethos Académico: un mapa de coocurrencia de palabras clave (estilo VOSviewer / Bibliometrix)
// que emerge por clústeres y las etapas del método (Scopus → PRISMA → Bibliometrix → matrices).
// Una vez por sesión; se salta con un toque o una tecla de acción; nunca con «reducir movimiento»; `?intro=1` la fuerza.
const CLAVE = 'ethos-academico-intro';
const DURACION = 4500;
const SALIDA = 600;
const W = 1000;
const H = 560;
const ETAPAS = ['Scopus', 'PRISMA 2020', 'Bibliometrix', 'Matrices'];

// Paleta armónica sobre fondo oscuro: un color por clúster.
const COLORES = ['#04ebff', '#7aa7ff', '#e8b23a', '#2fd8c9', '#ff8a7a'];

// [centro x, centro y, palabras clave con su frecuencia]; la primera es el núcleo del clúster.
const CLUSTERES: [number, number, [string, number][]][] = [
  [300, 165, [['machine learning', 60], ['predictive model', 34], ['deep learning', 30], ['random forest', 18], ['neural networks', 16], ['classification', 14], ['feature selection', 10], ['XGBoost', 9], ['SHAP', 8]]],
  [700, 160, [['higher education', 52], ['student dropout', 44], ['learning analytics', 36], ['academic performance', 22], ['retention', 18], ['e-learning', 14], ['MOOC', 11], ['early warning', 10], ['engagement', 9]]],
  [510, 395, [['systematic review', 48], ['PRISMA', 30], ['Scopus', 26], ['meta-analysis', 20], ['Web of Science', 16], ['screening', 10], ['risk of bias', 8]]],
  [185, 395, [['bibliometrics', 38], ['Bibliometrix', 24], ['VOSviewer', 20], ['science mapping', 16], ['co-citation', 14], ['citation analysis', 12], ['co-word analysis', 11], ['h-index', 7]]],
  [825, 395, [['artificial intelligence', 40], ['data mining', 26], ['big data', 22], ['NLP', 16], ['LLMs', 14], ['explainability', 12], ['ethics', 10], ['decision support', 9]]],
];

type Nodo = { label: string; c: number; f: number; x: number; y: number; r: number; fs: number; hub: boolean; orden: number };
type Arista = { d: string; c: number; w: number; delay: number };

// Generador pseudoaleatorio con semilla fija: la red es idéntica en cada carga.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function construirRed(): { nodos: Nodo[]; aristas: Arista[] } {
  const rnd = mulberry32(20261120);
  const nodos: Nodo[] = [];
  CLUSTERES.forEach(([cx, cy, palabras], c) => {
    palabras.forEach(([label, f], i) => {
      const ang = i * 2.39996 + rnd() * 0.6;
      const rad = i === 0 ? 0 : 34 + 36 * Math.sqrt(i);
      nodos.push({
        label, c, f, orden: i, hub: i === 0,
        x: cx + Math.cos(ang) * rad * 1.3,
        y: cy + Math.sin(ang) * rad * 0.85,
        r: 3 + Math.sqrt(f) * 2,
        fs: Math.round(10 + Math.sqrt(f) * 1.3),
      });
    });
  });

  // Relajación: separa las cajas nodo+etiqueta para que no se monten (los núcleos se mueven menos).
  const caja = (n: Nodo) => {
    const w = Math.max(2 * n.r, n.label.length * n.fs * 0.56) / 2 + 6;
    return { x0: n.x - w, x1: n.x + w, y0: n.y - n.r - 4, y1: n.y + n.r + n.fs + 8 };
  };
  for (let it = 0; it < 160; it += 1) {
    for (let i = 0; i < nodos.length; i += 1) {
      for (let j = i + 1; j < nodos.length; j += 1) {
        const a = caja(nodos[i]);
        const b = caja(nodos[j]);
        const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
        const oy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
        if (ox <= 0 || oy <= 0) continue;
        const ni = nodos[i];
        const nj = nodos[j];
        const pi = ni.hub ? 0.15 : nj.hub ? 0.85 : 0.5;
        if (ox < oy * 1.6) {
          const s = ni.x < nj.x ? -1 : 1;
          ni.x += s * ox * pi * 0.5; nj.x -= s * ox * (1 - pi) * 0.5;
        } else {
          const s = ni.y < nj.y ? -1 : 1;
          ni.y += s * oy * pi * 0.5; nj.y -= s * oy * (1 - pi) * 0.5;
        }
      }
    }
    for (const n of nodos) {
      const half = Math.max(n.r, (n.label.length * n.fs * 0.56) / 2) + 8;
      n.x = Math.min(W - half, Math.max(half, n.x));
      n.y = Math.min(H - n.r - n.fs - 12, Math.max(n.r + 12, n.y));
    }
  }

  const aristas: Arista[] = [];
  const curva = (a: Nodo, b: Nodo) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const k = (rnd() < 0.5 ? -1 : 1) * (0.12 + rnd() * 0.14);
    const qx = (a.x + b.x) / 2 - dy * k;
    const qy = (a.y + b.y) / 2 + dx * k;
    return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  };
  const unir = (a: Nodo, b: Nodo, delay: number) => {
    aristas.push({ d: curva(a, b), c: a.c, w: 0.5 + Math.sqrt(a.f * b.f) / 22, delay: Math.round(delay) });
  };
  const porCluster = CLUSTERES.map((_, c) => nodos.filter((n) => n.c === c));

  // Intra-clúster: cada palabra al núcleo y algunas entre sí.
  porCluster.forEach((grupo, c) => {
    const hub = grupo[0];
    grupo.slice(1).forEach((n, i) => {
      unir(hub, n, 1150 + c * 120 + i * 35);
      if (rnd() < 0.55) {
        const otro = grupo[1 + Math.floor(rnd() * (grupo.length - 1))];
        if (otro !== n) unir(n, otro, 1350 + c * 120 + i * 35);
      }
    });
  });
  // Entre clústeres: núcleos conectados y puentes temáticos.
  const puentes: [number, number][] = [[0, 1], [0, 4], [1, 4], [2, 3], [0, 3], [1, 2], [2, 4], [0, 2], [3, 1]];
  puentes.forEach(([a, b], i) => unir(porCluster[a][0], porCluster[b][0], 1750 + i * 45));
  for (let i = 0; i < 18; i += 1) {
    const ca = Math.floor(rnd() * 5);
    const cb = (ca + 1 + Math.floor(rnd() * 4)) % 5;
    const a = porCluster[ca][Math.floor(rnd() * porCluster[ca].length)];
    const b = porCluster[cb][Math.floor(rnd() * Math.min(4, porCluster[cb].length))];
    unir(a, b, 1900 + i * 30);
  }
  return { nodos, aristas };
}

const RED = construirRed();

export default function IntroInvestigacion() {
  const [fase, setFase] = useState<'nada' | 'activa' | 'saliendo'>('nada');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const limpiar = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useLayoutEffect(() => {
    let ver = false;
    try {
      const forzar = new URLSearchParams(window.location.search).get('intro') === '1';
      const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      ver = !reducir && (forzar || !sessionStorage.getItem(CLAVE));
      sessionStorage.setItem(CLAVE, '1');
    } catch { ver = false; }
    if (ver) setFase('activa');
    return limpiar;
  }, []);

  const saliendo = useRef(false);
  const salir = useCallback(() => {
    if (saliendo.current) return;
    saliendo.current = true;
    limpiar();
    setFase('saliendo');
    timers.current.push(setTimeout(() => setFase('nada'), SALIDA));
  }, []);

  // Sonido: solo si el navegador lo permite (p. ej. al llegar desde otra página del sitio) y si no se silenció la intro.
  useEffect(() => {
    if (fase !== 'activa') return undefined;
    let ctx: AudioContext | null = null;
    let parar: (() => void) | null = null;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC && localStorage.getItem('ethos-intro-mudo') !== '1') {
        ctx = new AC();
        if (ctx.state === 'running') parar = programarSonidoAcademico(ctx, ctx.currentTime + 0.05);
        else ctx.close();
      }
    } catch { /* sin audio */ }
    return () => { parar?.(); setTimeout(() => ctx?.close().catch(() => {}), 400); };
  }, [fase === 'activa']); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (fase !== 'activa') return undefined;
    timers.current.push(setTimeout(salir, DURACION));
    const tecla = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'Escape') salir();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [fase, salir]);

  if (fase === 'nada') return null;

  return (
    <div className={`velo ${fase}`} onClick={salir} role="presentation" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} className="red" focusable="false">
        <defs>
          {COLORES.map((col, c) => (
            <radialGradient key={col} id={`halo-${c}`}>
              <stop offset="0%" stopColor={col} stopOpacity="0.55" />
              <stop offset="45%" stopColor={col} stopOpacity="0.16" />
              <stop offset="100%" stopColor={col} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        <g className="flota">
          <g className="aristas">
            {RED.aristas.map((a, i) => (
              <path key={i} d={a.d} pathLength={1} stroke={COLORES[a.c]} strokeWidth={a.w} style={{ animationDelay: `${a.delay}ms` }} />
            ))}
          </g>
          {RED.nodos.map((n, i) => {
            const delay = 150 + n.c * 230 + n.orden * 45;
            return (
              <g key={i} className={`nodo ${n.hub ? 'hub' : ''} ${n.f < 20 ? 'menor' : ''}`}>
                {n.f >= 30 && (
                  <circle className="halo" cx={n.x} cy={n.y} r={n.r * 3} fill={`url(#halo-${n.c})`} style={{ animationDelay: `${delay}ms, ${delay + 900}ms` }} />
                )}
                <circle className="punto" cx={n.x} cy={n.y} r={n.r} fill={COLORES[n.c]} style={{ animationDelay: `${delay}ms` }} />
                <text x={n.x} y={n.y + n.r + n.fs} fontSize={n.fs} style={{ animationDelay: `${delay + 500}ms` }}>{n.label}</text>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="texto">
        <ol className="etapas">
          {ETAPAS.map((e, i) => (
            <li key={e} style={{ animationDelay: `${2450 + i * 220}ms` }}>
              <b>{String(i + 1).padStart(2, '0')}</b>{e}
            </li>
          ))}
        </ol>
        <p className="marca">Ethos <span>Académico</span></p>
        <p className="lema">Investigación científica con método y evidencia</p>
      </div>
      <span className="saltar">Toca para continuar</span>

      <style jsx>{`
        .velo { position: fixed; inset: 0; z-index: 200; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(8px, 2vh, 28px); padding: 16px 0 44px; box-sizing: border-box; cursor: pointer; transition: opacity ${SALIDA}ms var(--ease);
          background: radial-gradient(ellipse 60% 50% at 30% 30%, rgba(4,235,255,0.07), transparent 70%), radial-gradient(ellipse 50% 45% at 78% 70%, rgba(122,167,255,0.07), transparent 70%), radial-gradient(ellipse at 50% 40%, #0a1b2b, #030a12 72%); }
        .velo.saliendo { opacity: 0; pointer-events: none; }
        .red { display: block; flex: 0 1 auto; width: min(96vw, calc(60vh * ${W / H}), 2200px); height: auto; max-width: 100%; min-height: 0; overflow: hidden; }
        .flota { transform-origin: 50% 50%; transform-box: view-box; animation: flota 9s ease-in-out infinite alternate; }
        .aristas path { fill: none; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; animation: trazo 1.3s var(--ease) forwards; }
        .punto { stroke: rgba(3,10,18,0.7); stroke-width: 1; opacity: 0; transform-box: fill-box; transform-origin: center; animation: nodo 0.7s var(--ease) forwards; }
        .halo { opacity: 0; transform-box: fill-box; transform-origin: center; animation: aparece-halo 0.9s var(--ease) forwards, late 3.2s ease-in-out infinite alternate; }
        text { fill: #eaf2f8; text-anchor: middle; font-family: var(--font-brand); font-weight: 500; paint-order: stroke; stroke: rgba(3,10,18,0.85); stroke-width: 3px; stroke-linejoin: round; opacity: 0; animation: etiqueta 0.6s var(--ease) forwards; }
        .hub text { font-weight: 700; }
        .menor text { fill: #93aabb; }
        .texto { flex: 0 0 auto; text-align: center; color: #eaf2f8; padding: 0 16px; max-width: 100%; box-sizing: border-box; }
        .etapas { list-style: none; padding: 0; margin: 0 0 clamp(10px, 1.6vh, 22px); display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
        .etapas li { display: inline-flex; align-items: center; gap: 8px; font: 600 clamp(10px, 0.75vw, 15px)/1 var(--f-mono); letter-spacing: 0.14em; text-transform: uppercase; color: #eaf2f8; padding: 7px 12px; border: 1px solid #123048; border-radius: 999px; background: rgba(5,17,30,0.82); opacity: 0; animation: aparece 0.5s var(--ease) forwards; }
        .etapas b { color: #04ebff; font-weight: 600; }
        .marca { font-family: var(--font-brand); font-size: clamp(1.9rem, 5vw, 5.2rem); font-weight: 700; letter-spacing: -0.01em; line-height: 1.05; margin: 0; opacity: 0; animation: aparece 0.8s var(--ease) 2.6s forwards; }
        .marca span { color: #04ebff; text-shadow: 0 0 28px rgba(4,235,255,0.35); }
        .lema { color: #93aabb; margin: 8px 0 0; font-size: clamp(0.85rem, 1.1vw, 1.4rem); opacity: 0; animation: aparece 0.8s var(--ease) 3s forwards; }
        .saltar { position: absolute; bottom: 18px; left: 0; right: 0; text-align: center; font-size: 12px; color: #526373; letter-spacing: 0.1em; }
        @media (max-width: 900px) { .menor text { display: none; } }
        @media (max-width: 600px) {
          .nodo:not(.hub) text { display: none; }
          .hub text { font-size: 24px; }
          .red { width: min(100vw, calc(52vh * ${W / H})); }
        }
        @keyframes trazo { 0% { opacity: 0; } 15% { opacity: 0.38; } 100% { stroke-dashoffset: 0; opacity: 0.38; } }
        @keyframes nodo { from { opacity: 0; transform: scale(0.1); } 70% { opacity: 1; transform: scale(1.12); } to { opacity: 1; transform: scale(1); } }
        @keyframes aparece-halo { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
        @keyframes late { from { transform: scale(1); } to { transform: scale(1.18); } }
        @keyframes etiqueta { from { opacity: 0; } to { opacity: 1; } }
        @keyframes flota { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 50% { transform: translate(4px, -6px) rotate(0.35deg) scale(1.01); } 100% { transform: translate(-5px, 3px) rotate(-0.3deg) scale(1.015); } }
        @keyframes aparece { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
