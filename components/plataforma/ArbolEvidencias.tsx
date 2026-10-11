import { useState } from 'react';
import { ETAPAS_PROGRAMA, EVIDENCIAS } from '../../lib/plataforma/visual';

// Árbol de la carpeta de evidencias y proceso del programa de prácticas (sin datos de personas).
export default function ArbolEvidencias() {
  const [abierta, setAbierta] = useState<string | null>(EVIDENCIAS[2].carpeta);

  return (
    <div className="prog">
      <ol className="linea" aria-label="Etapas del programa">
        {ETAPAS_PROGRAMA.map((e) => (
          <li key={e.n}>
            <span className="n">{e.n}</span>
            <div><strong>{e.titulo}</strong><p>{e.texto}</p></div>
          </li>
        ))}
      </ol>

      <div className="arbol">
        <div className="raiz">📁 Carpeta de Evidencias</div>
        <ul>
          <li><span className="hoja">📄 00_Indice_General</span></li>
          {EVIDENCIAS.map((s) => {
            const on = abierta === s.carpeta;
            return (
              <li key={s.carpeta}>
                <button type="button" aria-expanded={on} onClick={() => setAbierta(on ? null : s.carpeta)}>
                  <span>{on ? '📂' : '📁'} {s.carpeta}</span>
                </button>
                {on && (
                  <div className="sub">
                    <p>{s.contenido}</p>
                    <ul>{s.archivos.map((a) => <li key={a}>📄 {a}</li>)}</ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx>{`
        .prog { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 20px; align-items: start; }
        .linea { list-style: none; margin: 0; padding: 0 0 0 18px; border-left: 2px solid #04ebff; display: flex; flex-direction: column; gap: 16px; }
        .linea li { display: flex; gap: 12px; position: relative; }
        .n { position: absolute; left: -33px; top: 0; width: 28px; height: 28px; border-radius: 50%; background: #05111e; color: #04ebff; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; }
        .linea strong { font-size: 15px; color: #05111e; }
        .linea p { margin: 2px 0 0; font-size: 13.5px; color: #33414d; line-height: 1.6; }
        .arbol { background: #05111e; border-radius: 16px; padding: 18px; color: #c4d3e0; font-size: 14px; }
        .raiz { color: #eaf2f8; font-weight: 700; margin-bottom: 8px; }
        .arbol ul { list-style: none; margin: 0; padding: 0 0 0 14px; border-left: 1px solid #123048; display: flex; flex-direction: column; gap: 4px; }
        .arbol button { background: none; border: 0; color: #eaf2f8; cursor: pointer; font: inherit; padding: 4px 6px; border-radius: 6px; text-align: left; }
        .arbol button:hover { background: #123048; }
        .arbol button:focus-visible { outline: 2px solid #04ebff; }
        .hoja { padding: 4px 6px; display: inline-block; }
        .sub { margin: 2px 0 6px 18px; padding: 8px 10px; background: #0a1b2b; border-radius: 8px; }
        .sub p { margin: 0 0 6px; color: #04ebff; font-size: 12.5px; }
        .sub ul { border: 0; padding: 0; gap: 2px; font-size: 13px; }
        @media (max-width: 720px) { .prog { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
