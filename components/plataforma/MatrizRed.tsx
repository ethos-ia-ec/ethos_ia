import { useMemo, useState } from 'react';
import { PRUEBAS_RED } from '../../lib/plataforma/matriz';

const TODOS = 'Todos';

// Muestra las 16 pruebas reales del laboratorio de red segmentada, filtrables por origen y destino.
export default function MatrizRed() {
  const origenes = useMemo(() => [TODOS, ...Array.from(new Set(PRUEBAS_RED.map((p) => p.origen)))], []);
  const [origen, setOrigen] = useState(TODOS);
  const filas = PRUEBAS_RED.filter((p) => origen === TODOS || p.origen === origen);
  const cumplen = PRUEBAS_RED.filter((p) => p.resultado === 'CUMPLE').length;

  return (
    <div className="mat">
      <p className="res"><strong>{cumplen} de {PRUEBAS_RED.length}</strong> pruebas coinciden con la matriz de reglas diseñada.</p>
      <label htmlFor="origen-red">Equipo de origen</label>
      <select id="origen-red" value={origen} onChange={(e) => setOrigen(e.target.value)}>
        {origenes.map((o) => <option key={o}>{o}</option>)}
      </select>
      <table>
        <thead>
          <tr><th scope="col">Origen</th><th scope="col">Destino</th><th scope="col">Esperado</th><th scope="col">Obtenido</th><th scope="col">Resultado</th></tr>
        </thead>
        <tbody>
          {filas.map((p) => (
            <tr key={`${p.origen}-${p.destino}`}>
              <td>{p.origen}</td>
              <td>{p.destino}</td>
              <td><span className={p.esperado === 'OK' ? 'ok' : 'bq'}>{p.esperado === 'OK' ? 'Pasa' : 'Bloqueado'}</span></td>
              <td><span className={p.obtenido === 'OK' ? 'ok' : 'bq'}>{p.obtenido === 'OK' ? 'Pasa' : 'Bloqueado'}</span></td>
              <td>{p.resultado === 'CUMPLE' ? '✓ Cumple' : '✗ No cumple'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .mat { margin-top: 8px; overflow-x: auto; }
        .res { margin: 0 0 12px; color: #33414d; font-size: 14px; }
        label { font-size: 13px; color: #33414d; margin-right: 8px; }
        select { font: inherit; font-size: 13px; padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(5,17,30,0.2); background: #fff; margin-bottom: 12px; }
        select:focus-visible { outline: 2px solid #04ebff; outline-offset: 2px; }
        table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; font-size: 13px; min-width: 520px; }
        th { text-align: left; background: #05111e; color: #eaf2f8; padding: 10px 12px; font-weight: 600; }
        td { padding: 9px 12px; border-top: 1px solid rgba(5,17,30,0.07); color: #05111e; }
        .ok { color: #14653a; font-weight: 600; }
        .bq { color: #8a1c1c; font-weight: 600; }
      `}</style>
    </div>
  );
}
