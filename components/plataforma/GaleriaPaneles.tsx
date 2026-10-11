import { useCallback, useEffect, useRef, useState } from 'react';
import { GRUPOS, PANELES, rutaPanel, type GrupoPanel } from '../../lib/plataforma/paneles';

export default function GaleriaPaneles() {
  const [grupo, setGrupo] = useState<GrupoPanel>('mesa');
  const [abierto, setAbierto] = useState<number | null>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const origenRef = useRef<HTMLElement | null>(null);

  const lista = PANELES.filter((p) => p.grupo === grupo);
  const info = GRUPOS.find((g) => g.id === grupo)!;

  const abrir = (i: number) => {
    origenRef.current = document.activeElement as HTMLElement;
    setAbierto(i);
  };
  const cerrar = useCallback(() => {
    setAbierto(null);
    origenRef.current?.focus();
  }, []);
  const mover = useCallback(
    (d: number) => setAbierto((i) => (i === null ? i : (i + d + lista.length) % lista.length)),
    [lista.length]
  );

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

  const actual = abierto === null ? null : lista[abierto];

  return (
    <div className="gal">
      <div className="grupos" role="group" aria-label="Laboratorio">
        {GRUPOS.map((g) => (
          <button key={g.id} type="button" aria-pressed={grupo === g.id} className={grupo === g.id ? 'g on' : 'g'} onClick={() => { setGrupo(g.id); setAbierto(null); }}>
            {g.nombre}
          </button>
        ))}
      </div>
      <p className="intro">{info.intro}</p>
      <p className="rotulo">Capturas reales de laboratorios técnicos en Docker de ETHOSLAB S.A.S.</p>

      <ul className="mini">
        {lista.map((p, i) => (
          <li key={p.id}>
            <button type="button" onClick={() => abrir(i)} aria-label={`Ampliar: ${p.titulo}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={rutaPanel(p.id)} alt={`${p.titulo}. ${p.descripcion}`} loading="lazy" />
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
            <img src={rutaPanel(actual.id)} alt={`${actual.titulo}. ${actual.descripcion}`} />
            <p>{actual.descripcion}</p>
            <div className="nav">
              <button type="button" onClick={() => mover(-1)} aria-label="Anterior">←</button>
              <span>{(abierto ?? 0) + 1} / {lista.length}</span>
              <button type="button" onClick={() => mover(1)} aria-label="Siguiente">→</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .gal { margin-top: 8px; }
        .grupos { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
        .g { border: 1px solid rgba(5,17,30,0.15); background: #fff; color: #33414d; padding: 8px 14px; border-radius: 999px; font: inherit; font-size: 13px; cursor: pointer; }
        .g.on { background: #05111e; color: #04ebff; border-color: #05111e; }
        .intro { color: #33414d; line-height: 1.7; margin: 0 0 4px; max-width: 70ch; font-size: 14px; }
        .rotulo { font-size: 12px; color: #526373; margin: 0 0 16px; }
        .mini { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 14px; }
        .mini button { width: 100%; text-align: left; border: 1px solid rgba(5,17,30,0.08); background: #fff; border-radius: 12px; padding: 0; overflow: hidden; cursor: pointer; display: flex; flex-direction: column; box-shadow: 0 8px 22px rgba(5,17,30,0.05); font: inherit; }
        .mini button:hover { border-color: #04ebff; }
        .mini img { width: 100%; height: 130px; object-fit: cover; object-position: top left; background: #05111e; display: block; }
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
