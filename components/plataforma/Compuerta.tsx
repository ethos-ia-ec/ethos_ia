import { useState } from 'react';
import { EJEMPLO_AUDITORIA, evaluarAuditoria, type Evaluacion } from '../../lib/plataforma/compuerta';

const ROTULO: Record<string, string> = { critical: 'Crítica', high: 'Alta', moderate: 'Media', low: 'Baja', info: 'Info' };

// Evalúa en el navegador: el texto pegado nunca se envía a un servidor.
export default function Compuerta() {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState<Evaluacion | null>(null);

  const evaluar = () => setResultado(evaluarAuditoria(texto));
  const cargarEjemplo = () => {
    setTexto(EJEMPLO_AUDITORIA);
    setResultado(evaluarAuditoria(EJEMPLO_AUDITORIA));
  };

  return (
    <div className="gate">
      <label htmlFor="audit-json">Salida de <code>npm audit --json</code></label>
      <textarea
        id="audit-json"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={8}
        spellCheck={false}
        placeholder='{"auditReportVersion": 2, "vulnerabilities": { ... }}'
      />
      <div className="acciones">
        <button type="button" className="btn" onClick={evaluar}>Evaluar compuerta</button>
        <button type="button" className="btn sec" onClick={cargarEjemplo}>Cargar ejemplo ficticio</button>
        <span className="nota">Se evalúa en tu navegador; no se envía nada.</span>
      </div>

      <div role="status" aria-live="polite">
        {resultado && !resultado.ok && <p className="msg err">{resultado.error}</p>}
        {resultado && resultado.ok && (
          <div className={resultado.pasa ? 'msg ok' : 'msg err'}>
            <strong>
              {resultado.pasa
                ? 'La compuerta pasa: no hay hallazgos críticos ni altos sin excepción.'
                : `La compuerta bloquea la publicación: ${resultado.bloqueantes.length} hallazgo(s) crítico(s) o alto(s).`}
            </strong>
            <ul className="lista">
              {resultado.hallazgos.map((h) => (
                <li key={h.paquete}>
                  <span className={`sev ${h.severidad}`}>{ROTULO[h.severidad]}</span>
                  <span><b>{h.paquete}</b> · {h.titulo} · plazo {h.plazoDias} días · {h.conParche ? 'hay parche' : 'sin parche'}{h.exceptuado ? ' · exceptuado' : ''}</span>
                </li>
              ))}
              {resultado.hallazgos.length === 0 && <li>Sin vulnerabilidades reportadas.</li>}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        .gate { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
        label { font-size: 13px; color: #33414d; }
        textarea { width: 100%; box-sizing: border-box; font: 12px/1.5 ui-monospace, Consolas, monospace; padding: 12px; border-radius: 10px; border: 1px solid rgba(5,17,30,0.2); background: #fff; color: #05111e; resize: vertical; }
        textarea:focus-visible, .btn:focus-visible { outline: 2px solid #04ebff; outline-offset: 2px; }
        .acciones { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .btn { border: 0; background: #05111e; color: #04ebff; padding: 9px 16px; border-radius: 8px; cursor: pointer; font: inherit; font-size: 13px; }
        .btn.sec { background: #eaf2f8; color: #0b5f75; }
        .nota { font-size: 12px; color: #526373; }
        .msg { padding: 14px 16px; border-radius: 10px; font-size: 14px; margin: 6px 0 0; }
        .msg.ok { background: #dff5e6; color: #14653a; }
        .msg.err { background: #fde3e3; color: #8a1c1c; }
        .lista { list-style: none; padding: 0; margin: 10px 0 0; display: flex; flex-direction: column; gap: 6px; color: #05111e; font-size: 13px; }
        .lista li { display: flex; gap: 10px; align-items: baseline; }
        .sev { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: #fff; flex-shrink: 0; }
        .sev.critical, .sev.high { color: #8a1c1c; }
        .sev.moderate { color: #7a4b00; }
        .sev.low, .sev.info { color: #14653a; }
      `}</style>
    </div>
  );
}
