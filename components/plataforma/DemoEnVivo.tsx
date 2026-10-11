import { useEffect, useState } from 'react';
import type { EstadoDemo } from '../../lib/plataforma/estado';

// Aviso de la demostración en vivo. Si la API no responde o el equipo está apagado,
// muestra el estado «no disponible» sin errores; las capturas siguen visibles debajo.
export default function DemoEnVivo() {
  const [estado, setEstado] = useState<EstadoDemo | null>(null);

  useEffect(() => {
    let activo = true;
    fetch('/api/plataforma/estado')
      .then((r) => (r.ok ? (r.json() as Promise<EstadoDemo>) : { enLinea: false }))
      .catch(() => ({ enLinea: false }))
      .then((e) => { if (activo) setEstado(e); });
    return () => { activo = false; };
  }, []);

  if (!estado) return null;

  return (
    <div className={estado.enLinea ? 'demo on' : 'demo off'} role="status">
      <span className="punto" aria-hidden="true" />
      {estado.enLinea ? (
        <div>
          <strong>Demostración en vivo disponible</strong>
          <p>
            Mesa de ayuda real (GLPI) en modo de solo lectura, con datos de laboratorio.
            {estado.usuario && estado.clave && <> Usuario <code>{estado.usuario}</code> · contraseña <code>{estado.clave}</code>.</>}
          </p>
          <a href={estado.url} target="_blank" rel="noopener noreferrer">Abrir demostración en vivo →</a>
        </div>
      ) : (
        <div>
          <strong>Demostración en vivo no disponible por ahora</strong>
          <p>Mientras tanto, las capturas muestran las mismas pantallas del laboratorio.</p>
        </div>
      )}

      <style jsx>{`
        .demo { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; border-radius: 12px; margin: 0 0 16px; font-size: 14px; }
        .demo.on { background: #dff5e6; color: #14653a; }
        .demo.off { background: #fff1d6; color: #7a4b00; }
        .punto { width: 10px; height: 10px; border-radius: 50%; background: currentColor; margin-top: 6px; flex-shrink: 0; }
        p { margin: 4px 0 8px; line-height: 1.6; color: #05111e; }
        code { background: #fff; padding: 1px 6px; border-radius: 6px; }
        a { color: #0b5f75; font-weight: 700; }
      `}</style>
    </div>
  );
}
