import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { type Area, desfase } from '../../lib/academico';

const ICONOS: Record<Area['icono'], string> = {
  microscopio: 'M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2ZM12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3',
  birrete: 'M22 10 12 5 2 10l10 5 10-5ZM6 12v5c3 3 9 3 12 0v-5',
  libro: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15ZM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
  grafico: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  base: 'M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3ZM4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  codigo: 'm16 18 6-6-6-6M8 6l-6 6 6 6',
  moneda: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  personas: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
};

// Carrusel 3D circular: flechas, puntos, teclado, arrastre y avance automático (pausado al interactuar).
export default function CarruselAreas({ areas, intervalo = 5000 }: { areas: Area[]; intervalo?: number }) {
  const [activo, setActivo] = useState(0);
  const [encima, setEncima] = useState(false);
  const [foco, setFoco] = useState(false);
  const [detenido, setDetenido] = useState(false);
  const inicioX = useRef<number | null>(null);
  const arrastro = useRef(false);
  const total = areas.length;
  const girando = !detenido && !encima && !foco;

  const ir = useCallback((d: number) => setActivo((a) => (a + d + total) % total), [total]);

  useEffect(() => {
    if (!girando || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => ir(1), intervalo);
    return () => clearInterval(t);
  }, [girando, ir, intervalo]);

  const soltar = (e: PointerEvent) => {
    if (inicioX.current === null) return;
    const dx = e.clientX - inicioX.current;
    inicioX.current = null;
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
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setEncima(false); }}
      onFocus={() => setFoco(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFoco(false); }}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') ir(1); if (e.key === 'ArrowLeft') ir(-1); }}
    >
      <div className="escena" onPointerDown={(e) => { inicioX.current = e.clientX; }} onPointerUp={soltar} onPointerCancel={() => { inicioX.current = null; }}>
        {areas.map((a, i) => {
          const d = desfase(i, activo, total);
          const lejos = Math.abs(d) > 2;
          const estilo = {
            transform: `translateX(${d * 62}%) translateZ(${-Math.abs(d) * 140}px) rotateY(${d * -18}deg) scale(${d === 0 ? 1 : 0.88})`,
            opacity: lejos ? 0 : 1 - Math.abs(d) * 0.28,
            zIndex: 10 - Math.abs(d),
            pointerEvents: lejos ? ('none' as const) : ('auto' as const),
          };
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
              <span className="num">{String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
              <span className="icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={ICONOS[a.icono]} /></svg>
              </span>
              <h3>{a.titulo}</h3>
              <p>{a.texto}</p>
              <ul>{a.temas.map((t) => <li key={t}>{t}</li>)}</ul>
            </article>
          );
        })}
      </div>

      <div className="controles">
        <button type="button" className="flecha" onClick={() => ir(-1)} aria-label="Área anterior">←</button>
        <div className="puntos">
          {areas.map((a, i) => (
            <button key={a.id} type="button" aria-label={`Ir a ${a.titulo}`} aria-current={i === activo} onClick={() => setActivo(i)} />
          ))}
        </div>
        <button type="button" className="flecha" onClick={() => ir(1)} aria-label="Área siguiente">→</button>
        <button type="button" className="flecha" onClick={() => setDetenido((v) => !v)} aria-label={detenido ? 'Reanudar el carrusel' : 'Pausar el carrusel'} aria-pressed={detenido}>
          {detenido ? '▶' : '❚❚'}
        </button>
      </div>
      <p className="vivo" aria-live={girando ? 'off' : 'polite'}>{areas[activo].titulo}</p>

      <style jsx>{`
        .car { position: relative; margin-top: 48px; user-select: none; border-radius: var(--r-xl); }
        .car:focus-visible { outline: 2px solid var(--c-cian); outline-offset: 8px; }
        .flecha:last-child { font-size: 13px; letter-spacing: -2px; }
        .escena { position: relative; height: 420px; perspective: 1400px; transform-style: preserve-3d; touch-action: pan-y; }
        .diapo {
          position: absolute; left: 50%; top: 0; width: min(380px, 80vw); height: 390px; margin-left: calc(min(380px, 80vw) / -2);
          border-radius: var(--r-xl); padding: 30px; display: flex; flex-direction: column; overflow: hidden;
          background: linear-gradient(160deg, var(--c-azul-2), #071524); border: 1px solid var(--c-azul-3); color: var(--c-claro-2);
          transition: transform 0.75s var(--ease), opacity 0.75s var(--ease); cursor: pointer;
        }
        .diapo::after { content: ''; position: absolute; inset: auto -40% -60% auto; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(4,235,255,0.14), transparent 70%); }
        .diapo.activa { border-color: rgba(4,235,255,0.55); box-shadow: 0 30px 80px -30px rgba(4,235,255,0.45); cursor: default; }
        .num { font: 600 11px/1 var(--f-mono); letter-spacing: 0.16em; color: var(--c-cian); }
        .icono { width: 56px; height: 56px; border-radius: 14px; display: grid; place-items: center; margin: 22px 0 18px; background: rgba(4,235,255,0.1); color: var(--c-cian); }
        .icono svg { width: 28px; height: 28px; }
        h3 { font-size: 21px; color: var(--c-claro); margin: 0 0 10px; }
        p { font-size: 14.5px; line-height: 1.65; margin: 0; }
        ul { list-style: none; padding: 0; margin: auto 0 0; display: flex; flex-wrap: wrap; gap: 6px; }
        li { font: 500 11px/1 var(--f-mono); padding: 6px 10px; border-radius: var(--r-pill); border: 1px solid var(--c-azul-3); color: var(--c-cian-suave); }
        .controles { display: flex; justify-content: center; align-items: center; gap: 18px; margin-top: 8px; }
        .flecha { width: 48px; height: 48px; border-radius: 50%; border: 1px solid var(--c-azul-3); background: var(--c-azul-2); color: var(--c-claro); cursor: pointer; font-size: 18px; transition: border-color var(--d-rapida), color var(--d-rapida); }
        .flecha:hover { border-color: var(--c-cian); color: var(--c-cian); }
        .puntos { display: flex; gap: 8px; }
        .puntos button { width: 9px; height: 9px; padding: 0; border: 0; border-radius: var(--r-pill); background: rgba(234,242,248,0.22); cursor: pointer; transition: width var(--d-media) var(--ease), background var(--d-media); }
        .puntos button[aria-current='true'] { width: 28px; background: var(--c-cian); }
        .vivo { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        @media (max-width: 600px) { .escena { height: 440px; } .diapo { height: 410px; padding: 24px; } }
      `}</style>
    </div>
  );
}
