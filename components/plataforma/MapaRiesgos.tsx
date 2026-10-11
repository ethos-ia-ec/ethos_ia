import { useState } from 'react';
import { categoriaRiesgo, nivelRiesgo, type Riesgo } from '../../lib/plataforma/datos';

const NIVELES = [1, 2, 3, 4, 5] as const;
const ROT_P = ['Muy rara', 'Rara', 'Posible', 'Probable', 'Casi segura'];
const ROT_I = ['Mínimo', 'Menor', 'Moderado', 'Mayor', 'Crítico'];

// Mapa de calor de probabilidad × impacto con los riesgos del programa de ingeniería.
export default function MapaRiesgos({ riesgos }: { riesgos: Riesgo[] }) {
  const [sel, setSel] = useState<string | null>(riesgos[0]?.id ?? null);
  const actual = riesgos.find((r) => r.id === sel);
  const conteo = { Alto: 0, Medio: 0, Bajo: 0 };
  riesgos.forEach((r) => { conteo[categoriaRiesgo(nivelRiesgo(r))] += 1; });

  return (
    <div className="mapa">
      <ul className="kpi">
        <li className="alto"><strong>{conteo.Alto}</strong> altos</li>
        <li className="medio"><strong>{conteo.Medio}</strong> medios</li>
        <li className="bajo"><strong>{conteo.Bajo}</strong> bajos</li>
      </ul>

      <div className="cuerpo">
        <div className="rejilla" role="group" aria-label="Mapa de calor de riesgos: probabilidad por impacto">
          <span className="eje-y">IMPACTO →</span>
          {[...NIVELES].reverse().map((imp) =>
            NIVELES.map((prob) => {
              const n = prob * imp;
              const cat = categoriaRiesgo(n).toLowerCase();
              const aqui = riesgos.filter((r) => r.probabilidad === prob && r.impacto === imp);
              return (
                <div key={`${prob}-${imp}`} className={`celda ${cat}`} title={`Probabilidad ${ROT_P[prob - 1]} · Impacto ${ROT_I[imp - 1]} · Nivel ${n}`}>
                  <small>{n}</small>
                  {aqui.map((r) => (
                    <button key={r.id} type="button" className={r.id === sel ? 'punto on' : 'punto'} aria-pressed={r.id === sel} aria-label={`${r.id}: ${r.riesgo}`} onClick={() => setSel(r.id)}>
                      {r.id.slice(2)}
                    </button>
                  ))}
                </div>
              );
            })
          )}
          <span className="eje-x">PROBABILIDAD →</span>
        </div>

        <div className="det" aria-live="polite">
          {actual ? (
            <>
              <span className={`nivel ${categoriaRiesgo(nivelRiesgo(actual)).toLowerCase()}`}>{categoriaRiesgo(nivelRiesgo(actual))} · {nivelRiesgo(actual)}</span>
              <h3>{actual.id} · {actual.riesgo}</h3>
              <p className="pi">Probabilidad {actual.probabilidad} ({ROT_P[actual.probabilidad - 1]}) × impacto {actual.impacto} ({ROT_I[actual.impacto - 1]})</p>
              <p><strong>Tratamiento:</strong> {actual.tratamiento}</p>
            </>
          ) : <p>Elige un riesgo en el mapa.</p>}
        </div>
      </div>

      <style jsx>{`
        .mapa { background: #05111e; border-radius: 16px; padding: 20px; color: #c4d3e0; }
        .kpi { list-style: none; display: flex; gap: 10px; padding: 0; margin: 0 0 16px; flex-wrap: wrap; }
        .kpi li { padding: 8px 14px; border-radius: 10px; font-size: 13px; }
        .kpi strong { font-size: 18px; margin-right: 4px; }
        .kpi .alto { background: #fde3e3; color: #8a1c1c; }
        .kpi .medio { background: #fff1d6; color: #7a4b00; }
        .kpi .bajo { background: #dff5e6; color: #14653a; }
        .cuerpo { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 20px; align-items: start; }
        .rejilla { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; padding: 0 0 22px 22px; }
        .celda { position: relative; aspect-ratio: 1; border-radius: 8px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 3px; padding: 3px; }
        .celda small { position: absolute; top: 3px; left: 5px; font-size: 9px; opacity: 0.55; color: #05111e; }
        .celda.alto { background: #e57368; }
        .celda.medio { background: #f2c76b; }
        .celda.bajo { background: #7fcf9b; }
        .punto { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #05111e; background: #fff; color: #05111e; font-weight: 800; font-size: 11px; cursor: pointer; font-family: inherit; }
        .punto.on { background: #04ebff; transform: scale(1.15); }
        .punto:focus-visible { outline: 2px solid #05111e; outline-offset: 2px; }
        .eje-y { position: absolute; left: 0; top: 50%; transform: translate(-50%, -50%) rotate(-90deg); transform-origin: center; font-size: 10px; letter-spacing: 0.1em; color: #93aabb; white-space: nowrap; margin-left: 8px; }
        .eje-x { grid-column: 1 / -1; text-align: center; font-size: 10px; letter-spacing: 0.1em; color: #93aabb; margin-top: 6px; }
        .det { background: #0a1b2b; border: 1px solid #123048; border-radius: 12px; padding: 16px 18px; font-size: 14px; line-height: 1.65; }
        .det h3 { color: #eaf2f8; font-size: 16px; margin: 8px 0 4px; }
        .det p { margin: 4px 0; }
        .pi { color: #04ebff; font-size: 12.5px; }
        .nivel { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 6px; }
        .nivel.alto { background: #fde3e3; color: #8a1c1c; }
        .nivel.medio { background: #fff1d6; color: #7a4b00; }
        .nivel.bajo { background: #dff5e6; color: #14653a; }
        @media (max-width: 760px) { .cuerpo { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
