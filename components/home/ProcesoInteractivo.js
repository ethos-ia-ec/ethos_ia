import { useState } from 'react';

// Metodología en cuatro etapas: se navega con clic o con las flechas del teclado.
export default function ProcesoInteractivo({ pasos }) {
  const [i, setI] = useState(0);
  const actual = pasos[i];

  return (
    <div className="proc">
      <div className="barra" aria-hidden="true"><span style={{ width: `${((i + 1) / pasos.length) * 100}%` }} /></div>
      <ol role="tablist" aria-label="Etapas de la metodología">
        {pasos.map(([n, t], k) => (
          <li key={n} role="presentation">
            <button
              type="button"
              role="tab"
              aria-selected={k === i}
              className={k === i ? 'on' : k < i ? 'hecho' : ''}
              onClick={() => setI(k)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') setI(Math.min(pasos.length - 1, i + 1));
                if (e.key === 'ArrowLeft') setI(Math.max(0, i - 1));
              }}
            >
              <b>{n}</b>
              <span>{t}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="panel" role="tabpanel" aria-live="polite">
        <span className="num">{actual[0]}</span>
        <h3>{actual[1]}</h3>
        <p>{actual[2]}</p>
        <div className="nav">
          <button type="button" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>← Anterior</button>
          <button type="button" onClick={() => setI(Math.min(pasos.length - 1, i + 1))} disabled={i === pasos.length - 1}>Siguiente →</button>
        </div>
      </div>

      <style jsx>{`
        .proc { max-width: 960px; margin: 40px auto 0; }
        .barra { height: 4px; background: rgba(5,17,30,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 28px; }
        .barra span { display: block; height: 100%; background: linear-gradient(90deg, #04ebff, #0b5f75); transition: width 0.4s ease; }
        ol { list-style: none; margin: 0 0 32px; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        ol button { width: 100%; text-align: left; border: 1px solid rgba(5,17,30,0.12); background: #fff; border-radius: 12px; padding: 16px 18px; cursor: pointer; font: inherit; display: flex; flex-direction: column; gap: 4px; color: #33414d; transition: all 0.2s ease; }
        ol button b { font-size: 12px; color: #0b5f75; }
        ol button span { font-size: 14px; font-weight: 600; }
        ol button.hecho { background: #eaf2f8; }
        ol button.on { background: #05111e; color: #eaf2f8; border-color: #05111e; transform: translateY(-3px); box-shadow: 0 14px 30px rgba(5,17,30,0.2); }
        ol button.on b { color: #04ebff; }
        button:focus-visible { outline: 2px solid #04ebff; outline-offset: 2px; }
        .panel { background: #05111e; color: #c4d3e0; border-radius: 18px; padding: 36px; position: relative; overflow: hidden; }
        .num { position: absolute; right: 24px; top: 6px; font-size: 6rem; font-weight: 800; color: rgba(4,235,255,0.08); line-height: 1; }
        h3 { margin: 0 0 10px; color: #eaf2f8; font-size: 1.5rem; }
        p { margin: 0 0 32px; line-height: 1.75; max-width: 62ch; position: relative; }
        .nav { display: flex; gap: 14px; flex-wrap: wrap; }
        .nav button { background: #123048; color: #04ebff; border: 0; border-radius: 8px; padding: 11px 20px; cursor: pointer; font: inherit; font-size: 13px; }
        .nav button:disabled { opacity: 0.35; cursor: default; }
        @media (max-width: 700px) { ol { grid-template-columns: repeat(2, 1fr); gap: 12px; } .panel { padding: 24px; } }
      `}</style>
    </div>
  );
}
