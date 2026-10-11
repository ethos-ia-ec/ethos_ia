import { useCallback, useEffect, useRef, useState } from 'react';

export interface Imagen {
  id: string;
  titulo: string;
  descripcion: string;
  src: string;
}

// Galería con visor ampliable (Esc y flechas) para imágenes de la misma serie.
export default function GaleriaImagenes({ imagenes, ancha = false }: { imagenes: Imagen[]; ancha?: boolean }) {
  const [abierto, setAbierto] = useState<number | null>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const origen = useRef<HTMLElement | null>(null);

  const cerrar = useCallback(() => { setAbierto(null); origen.current?.focus(); }, []);
  const mover = useCallback((d: number) => setAbierto((i) => (i === null ? i : (i + d + imagenes.length) % imagenes.length)), [imagenes.length]);

  useEffect(() => {
    if (abierto === null) return undefined;
    cerrarRef.current?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [abierto, cerrar, mover]);

  const actual = abierto === null ? null : imagenes[abierto];

  return (
    <div>
      <ul className={ancha ? 'mini ancha' : 'mini'}>
        {imagenes.map((p, i) => (
          <li key={p.id}>
            <button type="button" aria-label={`Ampliar: ${p.titulo}`} onClick={() => { origen.current = document.activeElement as HTMLElement; setAbierto(i); }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={`${p.titulo}. ${p.descripcion}`} loading="lazy" />
              <span>{p.titulo}</span>
            </button>
          </li>
        ))}
      </ul>

      {actual && (
        <div className="vis" role="dialog" aria-modal="true" aria-label={actual.titulo} onClick={cerrar}>
          <div className="caja" onClick={(e) => e.stopPropagation()}>
            <div className="barra">
              <strong>{actual.titulo}</strong>
              <button ref={cerrarRef} type="button" onClick={cerrar} aria-label="Cerrar visor">✕</button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={actual.src} alt={`${actual.titulo}. ${actual.descripcion}`} />
            <p>{actual.descripcion}</p>
            <div className="nav">
              <button type="button" onClick={() => mover(-1)} aria-label="Anterior">←</button>
              <span>{(abierto ?? 0) + 1} / {imagenes.length}</span>
              <button type="button" onClick={() => mover(1)} aria-label="Siguiente">→</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .mini { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; }
        .mini.ancha { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
        .mini button { width: 100%; text-align: left; border: 1px solid rgba(5,17,30,0.08); background: #fff; border-radius: 12px; padding: 0; overflow: hidden; cursor: pointer; display: flex; flex-direction: column; box-shadow: 0 8px 22px rgba(5,17,30,0.05); font: inherit; }
        .mini button:hover { border-color: #04ebff; }
        .mini img { width: 100%; height: 150px; object-fit: cover; object-position: top center; background: #eaf2f8; display: block; }
        .ancha img { height: 170px; object-fit: contain; background: #fff; }
        .mini span { padding: 10px 12px; font-size: 13px; color: #05111e; }
        button:focus-visible { outline: 2px solid #04ebff; outline-offset: 2px; }
        .vis { position: fixed; inset: 0; background: rgba(3,10,18,0.88); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .caja { background: #fff; border-radius: 14px; max-width: 1100px; width: 100%; max-height: 92vh; overflow: auto; padding: 14px 16px 16px; }
        .barra { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 12px; }
        .barra button, .nav button { border: 0; background: #05111e; color: #04ebff; border-radius: 8px; padding: 6px 12px; cursor: pointer; font: inherit; }
        .caja img { width: 100%; height: auto; border-radius: 8px; display: block; }
        .caja p { font-size: 14px; color: #33414d; margin: 10px 0; }
        .nav { display: flex; justify-content: center; align-items: center; gap: 16px; font-size: 13px; color: #526373; }
      `}</style>
    </div>
  );
}
