import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { type Area, desfase } from '../../lib/academico';
import VitrinaWebGL from './VitrinaWebGL';

const ICONOS: Record<Area['icono'], string> = {
  microscopio: 'M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2ZM12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3',
  birrete: 'M22 10 12 5 2 10l10 5 10-5ZM6 12v5c3 3 9 3 12 0v-5',
  libro: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15ZM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
  grafico: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  base: 'M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3ZM4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  codigo: 'm16 18 6-6-6-6M8 6l-6 6 6 6',
  moneda: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  balanza: 'M12 3v18M7 21h10M5 7h14M12 5l-7 2 -3 7a3.5 3.5 0 0 0 6 0L5 7M19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7',
  personas: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
};

const Svg = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={d} /></svg>
);

type Chispa = { x: number; y: number; vx: number; vy: number; vida: number; c: string };
const COLORES = ['4, 235, 255', '122, 167, 255', '47, 216, 201'];

// Carrusel 3D circular tipo vitrina de laboratorio: flechas, puntos, teclado, arrastre, avance automático,
// giro con el puntero (con inercia), inclinación y brillo de la tarjeta activa, rayos y chispas al cambiar.
export default function CarruselAreas({ areas, intervalo = 5000 }: { areas: Area[]; intervalo?: number }) {
  const [activo, setActivo] = useState(0);
  const [encima, setEncima] = useState(false);
  const [foco, setFoco] = useState(false);
  const [detenido, setDetenido] = useState(false);
  const inicioX = useRef<number | null>(null);
  const arrastro = useRef(false);
  const escenaRef = useRef<HTMLDivElement>(null);
  const lienzoRef = useRef<HTMLCanvasElement>(null);
  const objetivo = useRef(0);
  const chispas = useRef<Chispa[]>([]);
  const total = areas.length;
  // WebGL solo si hay soporte, sin movimiento reducido y en equipos con al menos 4 núcleos; si no, carrusel CSS.
  const [modo, setModo] = useState<'css' | 'gl'>('css');
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ((navigator.hardwareConcurrency || 8) < 4) return;
    const prueba = document.createElement('canvas');
    if (!(prueba.getContext('webgl2') || prueba.getContext('webgl'))) return;
    setModo('gl');
  }, []);
  const alFallar = useCallback(() => setModo('css'), []);
  // Gira siempre solo; solo se detiene con el botón de pausa (WCAG 2.2.2), no al pasar el mouse ni al tocar.
  const girando = !detenido;

  const ir = useCallback((d: number) => setActivo((a) => (a + d + total) % total), [total]);

  useEffect(() => {
    if (modo === 'gl' || !girando || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => ir(1), intervalo);
    return () => clearInterval(t);
  }, [modo, girando, ir, intervalo]);

  // Un solo bucle rAF: inercia del giro y chispas. Se detiene fuera de pantalla o con la pestaña oculta.
  useEffect(() => {
    const lienzo = lienzoRef.current;
    const escena = escenaRef.current;
    if (!lienzo || !escena || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = lienzo.getContext('2d');
    if (!ctx) return undefined;
    let raf = 0;
    let visible = false;
    let giro = 0;
    let cuadro = 0;
    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      lienzo.width = lienzo.clientWidth * dpr;
      lienzo.height = lienzo.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const paso = () => {
      giro += (objetivo.current - giro) * 0.07;
      escena.style.transform = `rotateY(${giro * 9}deg) translateX(${giro * -3}%)`;
      const w = lienzo.clientWidth;
      const h = lienzo.clientHeight;
      ctx.clearRect(0, 0, w, h);
      cuadro += 1;
      if (cuadro % 9 === 0 && chispas.current.length < 160) {
        chispas.current.push({ x: Math.random() * w, y: h * (0.55 + Math.random() * 0.4), vx: 0, vy: -0.25 - Math.random() * 0.3, vida: 1, c: COLORES[cuadro % 3] });
      }
      ctx.globalCompositeOperation = 'lighter';
      chispas.current = chispas.current.filter((p) => {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy = p.vy * 0.98 - 0.004; p.vida -= 0.009;
        if (p.vida <= 0) return false;
        ctx.fillStyle = `rgba(${p.c}, ${p.vida * 0.55})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.1 + p.vida, 0, Math.PI * 2); ctx.fill();
        return true;
      });
      raf = requestAnimationFrame(paso);
    };
    const actualizar = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden) raf = requestAnimationFrame(paso);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; actualizar(); });
    const ro = new ResizeObserver(medir);
    io.observe(lienzo); ro.observe(lienzo);
    document.addEventListener('visibilitychange', actualizar);
    medir();
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', actualizar); };
  }, [modo]);

  // Ráfaga de chispas desde los bordes de la tarjeta entrante.
  useEffect(() => {
    const lienzo = lienzoRef.current;
    const tarjeta = escenaRef.current?.querySelector('.activa');
    if (!lienzo || !tarjeta) return;
    const l = lienzo.getBoundingClientRect();
    const t = tarjeta.getBoundingClientRect();
    for (let k = 0; k < 34; k++) {
      const lado = k % 2 ? t.right : t.left;
      chispas.current.push({ x: lado - l.left, y: t.top - l.top + Math.random() * t.height, vx: (k % 2 ? 1 : -1) * (0.6 + Math.random() * 1.6), vy: -0.6 - Math.random() * 0.9, vida: 1, c: COLORES[k % 3] });
    }
  }, [activo]);

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    // Táctil: el arrastre del dedo hace girar la vitrina; al soltar vuelve con inercia.
    if (e.pointerType !== 'mouse') {
      if (inicioX.current !== null) objetivo.current = Math.max(-1, Math.min(1, ((e.clientX - inicioX.current) / r.width) * 2.5));
      return;
    }
    objetivo.current = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    const marco = escenaRef.current?.querySelector<HTMLElement>('.activa .marco');
    if (!marco) return;
    const m = marco.getBoundingClientRect();
    const x = (e.clientX - m.left) / m.width;
    const y = (e.clientY - m.top) / m.height;
    const dentro = x >= -0.2 && x <= 1.2 && y >= -0.2 && y <= 1.2;
    marco.style.setProperty('--ry', `${dentro ? (x - 0.5) * 10 : 0}deg`);
    marco.style.setProperty('--rx', `${dentro ? (0.5 - y) * 8 : 0}deg`);
    marco.style.setProperty('--mx', `${x * 100}%`);
    marco.style.setProperty('--my', `${y * 100}%`);
  };
  const salir = () => {
    objetivo.current = 0;
    escenaRef.current?.querySelectorAll<HTMLElement>('.marco').forEach((m) => { m.style.setProperty('--rx', '0deg'); m.style.setProperty('--ry', '0deg'); });
  };

  const soltar = (e: PointerEvent) => {
    if (inicioX.current === null) return;
    const dx = e.clientX - inicioX.current;
    inicioX.current = null;
    if (e.pointerType !== 'mouse') objetivo.current = 0;
    arrastro.current = Math.abs(dx) > 40;
    if (arrastro.current) ir(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className="car"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Áreas de Ethos Académico"
      tabIndex={0}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setEncima(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') { setEncima(false); salir(); } }}
      onPointerMove={mover}
      onFocus={() => setFoco(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFoco(false); }}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') ir(1); if (e.key === 'ArrowLeft') ir(-1); }}
    >
      {modo === 'gl' ? (
        <div className="gl-caja">
          <VitrinaWebGL areas={areas} iconos={ICONOS} activo={activo} pausado={detenido} onFrente={setActivo} onFallo={alFallar} />
          <div className="leyenda">
            <h3>{areas[activo].titulo}</h3>
            <p>{areas[activo].texto}</p>
          </div>
        </div>
      ) : (
      <div className="vitrina" onPointerDown={(e) => { inicioX.current = e.clientX; }} onPointerUp={soltar} onPointerCancel={() => { inicioX.current = null; objetivo.current = 0; }}>
        <div className="piso" aria-hidden="true" />
        <canvas ref={lienzoRef} className="lienzo" aria-hidden="true" />
        <div className="escena" ref={escenaRef}>
        {areas.map((a, i) => {
          const d = desfase(i, activo, total);
          const lejos = Math.abs(d) > 2;
          const estilo = {
            transform: `translateX(${d * 62}%) translateZ(${-Math.abs(d) * 140}px) rotateY(${d * -18}deg) scale(${d === 0 ? 1 : 0.88})`,
            opacity: lejos ? 0 : 1 - Math.abs(d) * 0.28,
            zIndex: 10 - Math.abs(d),
            pointerEvents: lejos ? ('none' as const) : ('auto' as const),
          };
          const img = a.imagen;
          return (
            <article
              key={a.id}
              className={`diapo ${d === 0 ? 'activa' : ''}`}
              style={estilo}
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${total}: ${a.titulo}`}
              aria-hidden={d !== 0}
              onClick={() => { if (arrastro.current) { arrastro.current = false; return; } if (d !== 0) setActivo(i); }}
            >
              <div className="marco">
              {img && (
                <figure className={img.ilustrativa ? 'foto' : 'foto real'}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.ilustrativa ? `${img.alt} (imagen ilustrativa)` : img.alt} loading={Math.abs(d) <= 1 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
                  {!img.ilustrativa && <figcaption>Fig. — proyecto propio</figcaption>}
                </figure>
              )}
              <div className="cuerpo">
                <div className="cab">
                  <span className="icono" aria-hidden="true"><Svg d={ICONOS[a.icono]} /></span>
                  <span className="num">{String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
                </div>
                <h3>{a.titulo}</h3>
                <p>{a.texto}</p>
                <ul>{a.temas.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              {d === 0 && (
                <span key={activo} className="fx" aria-hidden="true">
                  <i className="rayo r1" /><i className="rayo r2" /><i className="pulso"><b /></i>
                </span>
              )}
              </div>
            </article>
          );
        })}
        </div>
      </div>
      )}

      <div className="controles">
        <button type="button" className="flecha" onClick={() => ir(-1)} aria-label="Área anterior"><Svg d="M15 18l-6-6 6-6" /></button>
        <div className="puntos">
          {areas.map((a, i) => (
            <button key={a.id} type="button" aria-label={`Ir a ${a.titulo}`} aria-current={i === activo} onClick={() => setActivo(i)} />
          ))}
        </div>
        <button type="button" className="flecha" onClick={() => ir(1)} aria-label="Área siguiente"><Svg d="M9 18l6-6-6-6" /></button>
        <button type="button" className="flecha pausa" onClick={() => setDetenido((v) => !v)} aria-label={detenido ? 'Reanudar el carrusel' : 'Pausar el carrusel'} aria-pressed={detenido}>
          <Svg d={detenido ? 'M8 5v14l11-7z' : 'M9 5v14M15 5v14'} />
        </button>
      </div>
      <p className="vivo" aria-live={girando ? 'off' : 'polite'}>{areas[activo].titulo}</p>

      <style jsx>{`
        /* Mobile-first. --cw: ancho de tarjeta; --ch: alto fijo (las tarjetas son absolutas para el giro 3D). */
        .car { --cw: min(320px, 82vw); --ch: 520px; position: relative; margin-top: 12px; user-select: none; -webkit-user-select: none; border-radius: var(--r-xl); flex: 1; min-height: 0; display: flex; flex-direction: column; }
        .car:focus-visible { outline: 2px solid var(--c-cian); outline-offset: 8px; }
        /* Vitrina: rejilla técnica, piso en perspectiva con reflejo y lienzo de chispas detrás de las tarjetas. */
        .vitrina { position: relative; height: calc(var(--ch) + 64px); perspective: 1400px; touch-action: pan-y; }
        .vitrina::before { content: ''; position: absolute; inset: -24px 0 0; pointer-events: none; background-image: linear-gradient(rgba(4, 235, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(4, 235, 255, 0.06) 1px, transparent 1px); background-size: 40px 40px; -webkit-mask-image: radial-gradient(60% 60% at 50% 45%, #000, transparent 75%); mask-image: radial-gradient(60% 60% at 50% 45%, #000, transparent 75%); }
        .piso { position: absolute; left: 50%; bottom: -30px; width: min(160%, 2400px); height: 180px; transform: translateX(-50%) perspective(500px) rotateX(68deg); transform-origin: 50% 100%; pointer-events: none; background-image: linear-gradient(rgba(4, 235, 255, 0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(122, 167, 255, 0.18) 1px, transparent 1px); background-size: 48px 48px; -webkit-mask-image: radial-gradient(50% 90% at 50% 100%, #000, transparent 80%); mask-image: radial-gradient(50% 90% at 50% 100%, #000, transparent 80%); }
        .lienzo { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .escena { position: absolute; inset: 0; z-index: 1; transform-style: preserve-3d; will-change: transform; }
        .diapo {
          position: absolute; left: 50%; top: 0; width: var(--cw); height: var(--ch); margin-left: calc(var(--cw) / -2);
          transition: transform 0.75s var(--ease), opacity 0.75s var(--ease); cursor: pointer; will-change: transform;
          -webkit-box-reflect: below 6px linear-gradient(transparent, transparent 86%, rgba(255, 255, 255, 0.16));
        }
        .marco {
          position: relative; height: 100%; border-radius: var(--r-xl); display: flex; flex-direction: column; overflow: hidden; text-align: left;
          background: linear-gradient(170deg, var(--c-azul-2), #061423 70%); border: 1px solid var(--c-azul-3); color: var(--c-claro-2);
          box-shadow: 0 24px 50px -28px rgba(0, 0, 0, 0.7);
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform 0.25s ease-out, border-color var(--d-media), box-shadow var(--d-media);
        }
        .activa { cursor: default; }
        .activa .marco { border-color: rgba(4, 235, 255, 0.5); box-shadow: 0 30px 80px -30px rgba(4, 235, 255, 0.45); }
        /* Brillo especular que sigue al cursor. */
        .marco::after { content: ''; position: absolute; inset: 0; z-index: 3; pointer-events: none; opacity: 0; transition: opacity var(--d-media); background: radial-gradient(circle at var(--mx, 50%) var(--my, 0%), rgba(255, 255, 255, 0.16), transparent 45%); }
        .car:hover .activa .marco::after { opacity: 1; }
        /* Entrada: dos haces (cian y violeta) que barren la tarjeta y un pulso de borde cónico. */
        .fx { position: absolute; inset: 0; z-index: 4; pointer-events: none; border-radius: inherit; overflow: hidden; }
        .rayo { position: absolute; top: -20%; bottom: -20%; width: 38%; left: -50%; transform: skewX(-18deg); mix-blend-mode: screen; animation: barrido 1.1s var(--ease) both; }
        .r1 { background: linear-gradient(90deg, transparent, rgba(4, 235, 255, 0.32), transparent); }
        .r2 { width: 22%; background: linear-gradient(90deg, transparent, rgba(122, 167, 255, 0.26), transparent); animation-delay: 0.16s; }
        .pulso { position: absolute; inset: 0; border-radius: inherit; padding: 2px; overflow: hidden; -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0); animation: pulso 1.6s ease-out both; }
        .pulso b { position: absolute; left: -50%; top: 50%; width: 200%; aspect-ratio: 1; margin-top: -100%; background: conic-gradient(from 0deg, transparent 0 55%, #04ebff 70%, #7aa7ff 82%, transparent 92%); animation: rueda 1.6s linear both; }
        @keyframes barrido { from { left: -50%; opacity: 0; } 20% { opacity: 1; } to { left: 130%; opacity: 0; } }
        @keyframes pulso { 0% { opacity: 0; } 15% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes rueda { to { transform: rotate(360deg); } }

        /* Imagen superior con proporción fija y degradado hacia el texto. */
        .foto { position: relative; margin: 0; flex: none; aspect-ratio: 16 / 10; overflow: hidden; background: #061423; }
        .foto img { display: block; width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); transition: transform 1.2s var(--ease); pointer-events: none; }
        .diapo.activa .foto img { transform: scale(1); }
        .foto::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(5, 17, 30, 0) 45%, rgba(10, 27, 43, 0.85) 88%, var(--c-azul-2)); pointer-events: none; }
        /* Figuras reales: se muestran completas sobre fondo blanco, sin degradado que tape ejes. */
        .foto.real { background: #fff; padding: 8px 8px 30px; }
        .foto.real img { object-fit: contain; transform: none; }
        .foto.real::after { background: linear-gradient(180deg, transparent calc(100% - 30px), rgba(5, 17, 30, 0.06)); }
        figcaption { position: absolute; left: 10px; bottom: 7px; z-index: 1; font: 600 11px/1.4 var(--f-mono); letter-spacing: 0.04em; color: var(--c-teal); }

        .cuerpo { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; padding: 18px 22px 22px; }
        .cuerpo::after { content: ''; position: absolute; inset: auto -30% -50% auto; width: 240px; height: 240px; border-radius: 50%; background: radial-gradient(circle, rgba(4, 235, 255, 0.1), transparent 70%); pointer-events: none; }
        .cab { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .icono { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; background: rgba(4, 235, 255, 0.1); border: 1px solid rgba(4, 235, 255, 0.22); color: var(--c-cian); flex: none; }
        .icono :global(svg) { width: 22px; height: 22px; stroke-width: 1.8; }
        .num { font: 600 11px/1 var(--f-mono); letter-spacing: 0.16em; color: var(--c-cian); font-variant-numeric: tabular-nums; }
        h3 { font-size: 19px; line-height: 1.25; color: var(--c-claro); margin: 14px 0 8px; text-wrap: balance; }
        p { font-size: 14px; line-height: 1.6; margin: 0; text-wrap: pretty; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }
        ul { list-style: none; padding: 14px 0 0; margin: auto 0 0; display: flex; flex-wrap: wrap; gap: 6px; }
        li { font: 500 11px/1 var(--f-mono); padding: 7px 10px; border-radius: var(--r-pill); border: 1px solid var(--c-azul-3); color: var(--c-cian-suave); background: rgba(5, 17, 30, 0.4); }

        .controles { flex: none; position: relative; z-index: 2; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 12px 14px; margin-top: 12px; }
        .puntos { order: -1; flex-basis: 100%; display: flex; justify-content: center; }
        .flecha { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--c-azul-3); background: var(--c-azul-2); color: var(--c-claro); cursor: pointer; transition: border-color var(--d-rapida), color var(--d-rapida), transform var(--d-rapida), background-color var(--d-rapida); }
        .flecha :global(svg) { width: 20px; height: 20px; }
        .pausa :global(svg) { width: 16px; height: 16px; }
        .flecha:hover { border-color: var(--c-cian); color: var(--c-cian); background: #0d2236; }
        .flecha:active { transform: scale(0.94); }
        .flecha[aria-pressed='true'] { color: var(--c-cian); border-color: rgba(4, 235, 255, 0.5); }
        /* Puntos: 28 px de área táctil con el indicador visible dentro. */
        .puntos button { position: relative; width: 28px; height: 28px; padding: 0; border: 0; background: none; cursor: pointer; }
        .puntos button::before { content: ''; position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; margin: -4px 0 0 -4px; border-radius: var(--r-pill); background: rgba(234, 242, 248, 0.28); transition: width var(--d-media) var(--ease), margin var(--d-media) var(--ease), background-color var(--d-media); }
        .puntos button:hover::before { background: rgba(234, 242, 248, 0.55); }
        .puntos button[aria-current='true']::before { width: 22px; margin-left: -11px; background: var(--c-cian); }
        /* Vitrina WebGL: alto según el ancho; la tarjeta frontal ocupa ~70 % del alto. */
        .gl-caja { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; }
        .gl-caja :global(.gl) { position: relative; flex: 1; min-height: 0; height: auto; touch-action: pan-y; cursor: grab; }
        .gl-caja :global(.gl:active) { cursor: grabbing; }
        .gl-caja :global(.gl canvas) { display: block; width: 100%; height: 100%; }
        .leyenda { flex: none; max-width: 720px; min-height: 0; margin: 4px auto 0; text-align: center; }
        .leyenda h3 { margin: 0 0 6px; }
        .leyenda p { -webkit-line-clamp: 2; color: var(--c-claro-2); }
                .vivo { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

        @media (min-width: 600px) { .car { --cw: 380px; --ch: 540px; margin-top: 16px; } h3 { font-size: 21px; } p { font-size: 14.5px; } }
        @media (min-width: 900px) { .puntos { order: 0; flex-basis: auto; } }
        @media (min-width: 1920px) {
          .car { --cw: 460px; --ch: 640px; }
          .cuerpo { padding: 22px 28px 28px; }
          h3 { font-size: 25px; } p { font-size: 17px; } .num, li, figcaption { font-size: 13px; }
          .icono { width: 52px; height: 52px; } .icono :global(svg) { width: 26px; height: 26px; }
        }
        @media (min-width: 2560px) {
          .car { --cw: 580px; --ch: 800px; }
          .cuerpo { padding: 28px 34px 34px; }
          h3 { font-size: 31px; } p { font-size: 21px; } .num, li, figcaption { font-size: 15px; }
          .icono { width: 64px; height: 64px; border-radius: 16px; } .icono :global(svg) { width: 32px; height: 32px; }
          .flecha { width: 60px; height: 60px; } .flecha :global(svg) { width: 24px; height: 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .diapo, .marco, .foto img, .flecha, .puntos button::before { transition: none; }
          .fx, .lienzo { display: none; }
          .marco { transform: none; }
          .foto img { transform: none; }
        }
      `}</style>
    </div>
  );
}
