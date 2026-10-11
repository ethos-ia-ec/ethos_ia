import { useState } from 'react';
import { PRUEBAS_RED } from '../../lib/plataforma/matriz';
import { SEGMENTOS } from '../../lib/plataforma/visual';

const CX = 320;
const CY = 210;

// Posición de cada segmento alrededor del enrutador.
const pos = (i: number, total: number) => {
  const a = (-90 + (360 / total) * i) * (Math.PI / 180);
  return { x: CX + 225 * Math.cos(a), y: CY + 150 * Math.sin(a) };
};

const destinoSegmento = (d: string) => d.split(' (')[0];

// Topología del laboratorio: al elegir un segmento de origen se ven en verde los destinos que alcanza y en rojo los bloqueados.
export default function TopologiaRed() {
  const [sel, setSel] = useState<string>('Invitados');
  const actual = SEGMENTOS.find((s) => s.id === sel)!;
  const pruebas = PRUEBAS_RED.filter((p) => p.origen === sel);
  const pasa = new Set(pruebas.filter((p) => p.obtenido === 'OK').map((p) => destinoSegmento(p.destino)));
  const bloquea = new Set(pruebas.filter((p) => p.obtenido === 'BLOQ').map((p) => destinoSegmento(p.destino)));

  return (
    <div className="topo">
      <svg viewBox="0 0 640 420" role="img" aria-label="Topología de siete redes conectadas a un enrutador">
        {SEGMENTOS.map((s, i) => {
          const p = pos(i, SEGMENTOS.length);
          const color = s.id === sel ? '#04ebff' : pasa.has(s.id) ? '#27a35a' : bloquea.has(s.id) ? '#c0392b' : '#2a4a63';
          return <line key={s.id} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={color} strokeWidth={s.id === sel || pasa.has(s.id) || bloquea.has(s.id) ? 3 : 1.5} strokeDasharray={bloquea.has(s.id) ? '6 5' : undefined} />;
        })}
        <g>
          <rect x={CX - 52} y={CY - 24} width={104} height={48} rx={10} fill="#04ebff" />
          <text x={CX} y={CY + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#05111e">Enrutador</text>
        </g>
        {SEGMENTOS.map((s, i) => {
          const p = pos(i, SEGMENTOS.length);
          const on = s.id === sel;
          return (
            <g key={s.id} tabIndex={0} role="button" aria-label={`Segmento ${s.nombre}, ${s.vlan}`} aria-pressed={on} className="nodo"
               onClick={() => setSel(s.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(s.id); } }}>
              <rect x={p.x - 56} y={p.y - 22} width={112} height={44} rx={10} fill={on ? '#04ebff' : '#0a1b2b'} stroke={on ? '#04ebff' : '#123048'} strokeWidth={2} />
              <text x={p.x} y={p.y - 3} textAnchor="middle" fontSize={13} fontWeight={700} fill={on ? '#05111e' : '#eaf2f8'}>{s.nombre}</text>
              <text x={p.x} y={p.y + 13} textAnchor="middle" fontSize={10.5} fill={on ? '#05111e' : '#93aabb'}>{s.vlan}</text>
            </g>
          );
        })}
      </svg>

      <div className="det" aria-live="polite">
        <h3>{actual.nombre} <span>{actual.vlan} · {actual.cidr}</span></h3>
        <p>{actual.funcion}</p>
        {pruebas.length > 0 ? (
          <ul>
            {pruebas.map((p) => (
              <li key={p.destino}>
                <span className={p.obtenido === 'OK' ? 'ok' : 'bq'}>{p.obtenido === 'OK' ? 'Pasa' : 'Bloqueado'}</span>
                {p.destino}
              </li>
            ))}
          </ul>
        ) : (
          <p className="nota">Este segmento es destino de otras pruebas; elige otro para ver sus alcances.</p>
        )}
        <p className="leyenda"><i className="v" /> alcanza <i className="r" /> bloqueado · resultados reales de las 16 pruebas del laboratorio</p>
      </div>

      <style jsx>{`
        .topo { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 20px; background: #05111e; border-radius: 16px; padding: 20px; align-items: center; }
        svg { width: 100%; height: auto; }
        .nodo { cursor: pointer; }
        .nodo:focus-visible rect { stroke: #fff; stroke-width: 3; }
        .det { color: #c4d3e0; font-size: 14px; }
        .det h3 { margin: 0 0 6px; color: #eaf2f8; font-size: 18px; }
        .det h3 span { display: block; font-size: 12px; color: #04ebff; font-weight: 600; margin-top: 2px; }
        .det p { line-height: 1.6; margin: 0 0 10px; }
        .det ul { list-style: none; padding: 0; margin: 0 0 10px; display: flex; flex-direction: column; gap: 6px; }
        .det li { display: flex; gap: 10px; align-items: baseline; font-size: 13px; }
        .ok, .bq { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; flex-shrink: 0; width: 76px; text-align: center; }
        .ok { background: #dff5e6; color: #14653a; }
        .bq { background: #fde3e3; color: #8a1c1c; }
        .nota { color: #93aabb; }
        .leyenda { font-size: 11px; color: #93aabb; }
        i { display: inline-block; width: 18px; height: 3px; vertical-align: middle; margin: 0 4px 0 8px; }
        i.v { background: #27a35a; }
        i.r { background: #c0392b; }
        @media (max-width: 720px) { .topo { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
