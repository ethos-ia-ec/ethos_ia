import { useState } from 'react';
import { PASOS_PIPELINE } from '../../lib/plataforma/visual';

const COLOR = { integracion: '#04ebff', liberacion: '#7aa7ff', aprobacion: '#f5c451' } as const;

// Recorrido de las diez compuertas del pipeline estándar. Se puede navegar con teclado (flechas).
export default function PipelineInteractivo() {
  const [n, setN] = useState(3);
  const paso = PASOS_PIPELINE.find((p) => p.n === n)!;

  return (
    <div className="pipe">
      <ol className="pasos" aria-label="Compuertas del pipeline">
        {PASOS_PIPELINE.map((p) => (
          <li key={p.n}>
            <button
              type="button"
              aria-current={p.n === n ? 'step' : undefined}
              className={p.n === n ? 'p on' : 'p'}
              style={{ borderColor: COLOR[p.tipo] }}
              onClick={() => setN(p.n)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') setN(Math.min(10, n + 1));
                if (e.key === 'ArrowLeft') setN(Math.max(1, n - 1));
              }}
            >
              <b>{p.n}</b>
              <span>{p.nombre}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="det" aria-live="polite">
        <div className="cab">
          <span className="num" style={{ background: COLOR[paso.tipo] }}>{paso.n}</span>
          <div>
            <h3>{paso.nombre}</h3>
            <span className="her">{paso.herramienta}</span>
          </div>
        </div>
        <p>{paso.que}</p>
        <p className="blq"><strong>Detiene el pipeline cuando:</strong> {paso.bloquea}</p>
      </div>
      <p className="pie">Mismos comandos en la nube y en el equipo del ingeniero. Umbrales en <code>politicas/umbrales.yml</code>.</p>

      <style jsx>{`
        .pipe { background: #05111e; border-radius: 16px; padding: 20px; color: #c4d3e0; }
        .pasos { list-style: none; padding: 0; margin: 0 0 16px; display: grid; grid-template-columns: repeat(auto-fit, minmax(118px, 1fr)); gap: 8px; }
        .p { width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; background: #0a1b2b; color: #eaf2f8; border: 2px solid; border-radius: 10px; padding: 10px; cursor: pointer; font: inherit; text-align: left; opacity: 0.75; }
        .p b { font-size: 12px; color: #93aabb; }
        .p span { font-size: 12.5px; font-weight: 600; line-height: 1.3; }
        .p.on { opacity: 1; background: #123048; box-shadow: 0 0 0 3px rgba(4,235,255,0.25); }
        .p:hover { opacity: 1; }
        .p:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        .det { background: #0a1b2b; border: 1px solid #123048; border-radius: 12px; padding: 16px 18px; }
        .cab { display: flex; gap: 12px; align-items: center; margin-bottom: 8px; }
        .num { width: 34px; height: 34px; border-radius: 50%; color: #05111e; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        h3 { margin: 0; color: #eaf2f8; font-size: 17px; }
        .her { font-size: 12px; color: #04ebff; }
        .det p { margin: 6px 0; font-size: 14px; line-height: 1.65; }
        .blq { color: #f0b7b0; }
        .pie { font-size: 12px; color: #93aabb; margin: 12px 0 0; }
        code { background: #0a1b2b; padding: 1px 6px; border-radius: 6px; color: #eaf2f8; }
      `}</style>
    </div>
  );
}
