import { useState, type ReactElement } from 'react';
import { entrarCon, PROVEEDORES } from '../../lib/sesion';

// Botones «Continuar con Google / GitHub / Facebook». Sirven igual para crear la cuenta o para entrar.
const ICONOS: Record<string, ReactElement> = {
  google: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" /><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" /><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" /><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" /></svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" /></svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" /></svg>
  ),
};

export default function BotonesSociales({ destino = '/cuenta' }: { destino?: string }) {
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function pulsar(id: (typeof PROVEEDORES)[number]['id']) {
    setOcupado(id);
    setError('');
    const fallo = await entrarCon(id, destino);
    if (fallo) {
      setError('No se pudo abrir el acceso con ese proveedor. Intente con otro o más tarde.');
      setOcupado(null);
    }
  }

  return (
    <div className="sociales">
      {PROVEEDORES.map((p) => (
        <button key={p.id} type="button" className={`social ${p.id}`} onClick={() => pulsar(p.id)} disabled={ocupado !== null}>
          {ICONOS[p.id]}
          <span>{ocupado === p.id ? 'Abriendo…' : `Continuar con ${p.nombre}`}</span>
        </button>
      ))}
      {error && <p className="error" role="alert">{error}</p>}
      <style jsx>{`
        .sociales { display: flex; flex-direction: column; gap: 10px; }
        .social { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid #c4d3e0; background: #fff; color: #1f2328; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .social:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(5, 17, 30, 0.12); }
        .social:focus-visible { outline: 2px solid #04ebff; outline-offset: 2px; }
        .social:disabled { opacity: 0.6; cursor: wait; }
        .social.github { background: #1f2328; color: #fff; border-color: #1f2328; }
        .social.facebook { background: #1877f2; color: #fff; border-color: #1877f2; }
        .social.facebook :global(path) { fill: #fff; }
        .social :global(svg) { width: 20px; height: 20px; flex: none; }
        .error { color: #b42318; font-size: 13px; margin: 4px 0 0; }
      `}</style>
    </div>
  );
}
