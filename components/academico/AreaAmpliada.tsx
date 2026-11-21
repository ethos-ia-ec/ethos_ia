import { useEffect, useRef } from 'react';
import type { Area } from '../../lib/academico';

// Vista a pantalla completa de una tarjeta del carrusel: clip (o imagen), título, texto y temas,
// con flechas semitransparentes a los lados. <dialog> nativo: atrapa el foco y se cierra con Escape.
export default function AreaAmpliada({ area, indice, total, onCerrar, onMover }: {
  area: Area; indice: number; total: number; onCerrar: () => void; onMover: (d: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = ''; };
  }, []);
  const img = area.imagen;
  return (
    <dialog
      ref={ref}
      className="amp"
      aria-label={area.titulo}
      onClose={onCerrar}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') onMover(1); if (e.key === 'ArrowLeft') onMover(-1); }}
      onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close(); }}
    >
      <div className="caja">
        <div className="medio">
          {area.video ? (
            <video key={area.id} autoPlay muted loop playsInline poster={`${area.video}.jpg`} aria-label={`Animación: ${area.titulo}`}>
              <source src={`${area.video}.mp4`} type="video/mp4" />
            </video>
          ) : img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img.src} alt={img.alt} />
          )}
        </div>
        <div className="texto">
          <span className="num">{String(indice + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <h2>{area.titulo}</h2>
          <p>{area.texto}</p>
          <ul>{area.temas.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
      <button type="button" className="nav izq" onClick={() => onMover(-1)} aria-label="Área anterior">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button type="button" className="nav der" onClick={() => onMover(1)} aria-label="Área siguiente">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
      </button>
      <button type="button" className="cerrar" onClick={() => ref.current?.close()} aria-label="Cerrar vista ampliada">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      <style jsx>{`
        .amp { position: fixed; inset: 0; width: 100vw; height: 100dvh; max-width: none; max-height: none; margin: 0; padding: 0; border: 0; background: #02070d; color: var(--c-claro-2); overflow: auto; }
        .amp::backdrop { background: rgba(2, 7, 13, 0.85); }
        .caja { min-height: 100%; display: flex; flex-direction: column; }
        .medio { flex: none; width: 100%; aspect-ratio: 16 / 10; max-height: 62dvh; background: #02070d; display: grid; place-items: center; overflow: hidden; }
        .medio video, .medio img { width: 100%; height: 100%; object-fit: contain; display: block; }
        .texto { box-sizing: border-box; width: 100%; max-width: 860px; margin: 0 auto; padding: 20px 20px 96px; }
        .num { font: 600 12px/1 var(--f-mono); letter-spacing: 0.16em; color: var(--c-cian); }
        h2 { font-size: clamp(24px, 3vw, 40px); line-height: 1.2; color: var(--c-claro); margin: 12px 0 10px; text-wrap: balance; }
        p { font-size: clamp(15px, 1.3vw, 19px); line-height: 1.65; margin: 0; text-wrap: pretty; }
        ul { list-style: none; padding: 16px 0 0; margin: 0; display: flex; flex-wrap: wrap; gap: 8px; }
        li { font: 500 12px/1 var(--f-mono); padding: 8px 12px; border-radius: var(--r-pill); border: 1px solid var(--c-azul-3); color: var(--c-cian-suave); }
        button { position: fixed; display: grid; place-items: center; border-radius: 50%; cursor: pointer; color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.25); background: rgba(5, 17, 30, 0.45); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          opacity: 0.75; transition: opacity var(--d-rapida), background-color var(--d-rapida), border-color var(--d-rapida); }
        button:hover, button:focus-visible { opacity: 1; background: rgba(5, 17, 30, 0.75); border-color: var(--c-cian); }
        button:focus-visible { outline: 2px solid var(--c-cian); outline-offset: 3px; }
        svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .nav { width: 52px; height: 52px; top: calc(min(62dvh, 62.5vw) / 2); transform: translateY(-50%); }
        .izq { left: 12px; } .der { right: 12px; }
        .cerrar { width: 48px; height: 48px; top: 12px; right: 12px; }
        /* Pantallas anchas: medio y texto lado a lado, flechas centradas en la pantalla. */
        @media (min-width: 1024px) and (min-aspect-ratio: 4/3) {
          .caja { flex-direction: row; align-items: center; height: 100%; }
          .medio { flex: 1.6; height: 100%; max-height: none; aspect-ratio: auto; }
          .texto { flex: 1; padding: 40px 96px 40px 40px; }
          .nav { top: 50%; width: 64px; height: 64px; }
          .izq { left: 24px; } .der { right: 24px; } .cerrar { top: 24px; right: 24px; }
        }
        @media (prefers-reduced-motion: reduce) { button { transition: none; } }
      `}</style>
    </dialog>
  );
}
