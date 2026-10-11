import { useState } from 'react';

interface Endpoint {
  id: string;
  metodo: 'GET';
  ruta: string;
  acceso: string;
  protegido: boolean;
  descripcion: string;
}

const ENDPOINTS: Endpoint[] = [
  { id: 'resumen', metodo: 'GET', ruta: '/api/plataforma/resumen', acceso: 'Público', protegido: false, descripcion: 'Catálogo de laboratorios, kit, programa, servicios y riesgos. Con límite de solicitudes.' },
  { id: 'estado', metodo: 'GET', ruta: '/api/plataforma/estado', acceso: 'Público', protegido: false, descripcion: 'Indica si la demostración en vivo está disponible.' },
  { id: 'programa', metodo: 'GET', ruta: '/api/plataforma/programa', acceso: 'JWT · gerencia o tutoría', protegido: true, descripcion: 'Detalle de gestión del programa. Exige un token firmado con el rol adecuado.' },
];

const CODIGOS = [
  { c: '200', t: 'Solicitud correcta' },
  { c: '401', t: 'Token ausente, inválido o vencido' },
  { c: '403', t: 'Rol sin permiso para el recurso' },
  { c: '429', t: 'Demasiadas solicitudes' },
  { c: '503', t: 'Servicio de autenticación sin configurar' },
];

interface Resp { status: number; ms: number; cuerpo: string }

// Probador de la API real (estilo Postman): permite enviar con o sin token y ver estado, tiempo y JSON.
export default function ApiPlayground() {
  const [id, setId] = useState('resumen');
  const [token, setToken] = useState('');
  const [resp, setResp] = useState<Resp | null>(null);
  const [cargando, setCargando] = useState(false);
  const ep = ENDPOINTS.find((e) => e.id === id)!;

  const enviar = async () => {
    setCargando(true);
    const t0 = performance.now();
    try {
      const r = await fetch(ep.ruta, { headers: token.trim() ? { Authorization: `Bearer ${token.trim()}` } : {} });
      const texto = await r.text();
      let cuerpo = texto;
      try { cuerpo = JSON.stringify(JSON.parse(texto), null, 2); } catch { /* respuesta no JSON */ }
      setResp({ status: r.status, ms: Math.round(performance.now() - t0), cuerpo });
    } catch {
      setResp({ status: 0, ms: Math.round(performance.now() - t0), cuerpo: 'No se pudo conectar con el servidor.' });
    } finally {
      setCargando(false);
    }
  };

  const curl = `curl ${token.trim() ? '-H "Authorization: Bearer $TOKEN" ' : ''}http://localhost:3000${ep.ruta}`;
  const estadoClase = resp ? (resp.status >= 200 && resp.status < 300 ? 'ok' : 'err') : '';

  return (
    <div className="api">
      <div className="barra">
        <label htmlFor="ep" className="sr">Recurso</label>
        <select id="ep" value={id} onChange={(e) => { setId(e.target.value); setResp(null); }}>
          {ENDPOINTS.map((e) => <option key={e.id} value={e.id}>{e.metodo} {e.ruta}</option>)}
        </select>
        <button type="button" onClick={enviar} disabled={cargando}>{cargando ? 'Enviando…' : 'Enviar'}</button>
      </div>
      <p className="desc"><span className={ep.protegido ? 'tag lock' : 'tag'}>{ep.acceso}</span> {ep.descripcion}</p>

      {ep.protegido && (
        <>
          <label htmlFor="tk">Token JWT <span>(opcional: sin él verás el 401)</span></label>
          <textarea id="tk" rows={3} value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" spellCheck={false} />
        </>
      )}

      <pre className="curl">{curl}</pre>

      <div role="status" aria-live="polite">
        {resp && (
          <div className="resp">
            <div className="meta">
              <span className={`st ${estadoClase}`}>{resp.status || 'Sin conexión'}</span>
              <span>{resp.ms} ms</span>
            </div>
            <pre>{resp.cuerpo}</pre>
          </div>
        )}
      </div>

      <div className="pie">
        <div>
          <h4>Códigos de respuesta</h4>
          <ul>{CODIGOS.map((c) => <li key={c.c}><b>{c.c}</b> {c.t}</li>)}</ul>
        </div>
        <div>
          <h4>Flujo de autenticación</h4>
          <ol>
            <li>Gerencia emite un token con <code>scripts/emitir-token.js</code>.</li>
            <li>El cliente lo envía en <code>Authorization: Bearer</code>.</li>
            <li>El servidor verifica firma HS256, vencimiento y rol.</li>
            <li>Responde 200, 401 o 403.</li>
          </ol>
          <a className="pm" href="/plataforma.postman_collection.json" download>Descargar colección de Postman →</a>
        </div>
      </div>

      <style jsx>{`
        .api { background: #05111e; border-radius: 16px; padding: 20px; color: #c4d3e0; }
        .barra { display: flex; gap: 8px; }
        select { flex: 1; min-width: 0; background: #0a1b2b; color: #eaf2f8; border: 1px solid #123048; border-radius: 8px; padding: 10px; font: 13px ui-monospace, Consolas, monospace; }
        button { background: #04ebff; color: #05111e; border: 0; border-radius: 8px; padding: 0 20px; font: inherit; font-weight: 700; cursor: pointer; }
        button:disabled { opacity: 0.6; cursor: wait; }
        select:focus-visible, button:focus-visible, textarea:focus-visible, .pm:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        .desc { font-size: 13.5px; line-height: 1.6; margin: 12px 0; }
        .tag { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 6px; background: #dff5e6; color: #14653a; margin-right: 6px; }
        .tag.lock { background: #fff1d6; color: #7a4b00; }
        label { display: block; font-size: 12.5px; margin: 8px 0 4px; }
        label span { color: #93aabb; }
        textarea { width: 100%; box-sizing: border-box; background: #0a1b2b; color: #eaf2f8; border: 1px solid #123048; border-radius: 8px; padding: 10px; font: 12px ui-monospace, Consolas, monospace; resize: vertical; }
        .curl { background: #0a1b2b; border-radius: 8px; padding: 10px 12px; font-size: 12px; color: #93aabb; overflow-x: auto; margin: 12px 0; }
        .resp { background: #0a1b2b; border: 1px solid #123048; border-radius: 10px; overflow: hidden; }
        .meta { display: flex; gap: 14px; align-items: center; padding: 8px 12px; border-bottom: 1px solid #123048; font-size: 12px; }
        .st { font-weight: 800; padding: 2px 10px; border-radius: 6px; }
        .st.ok { background: #dff5e6; color: #14653a; }
        .st.err { background: #fde3e3; color: #8a1c1c; }
        .resp pre { margin: 0; padding: 12px; max-height: 280px; overflow: auto; font-size: 12px; color: #c4d3e0; }
        .pie { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 18px; font-size: 13px; }
        h4 { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #04ebff; margin: 0 0 8px; }
        ul, ol { margin: 0; padding-left: 18px; line-height: 1.8; }
        ul { list-style: none; padding: 0; }
        li b { display: inline-block; width: 36px; color: #eaf2f8; }
        code { background: #0a1b2b; padding: 1px 6px; border-radius: 6px; color: #eaf2f8; }
        .pm { display: inline-block; margin-top: 10px; color: #04ebff; font-weight: 700; }
      `}</style>
    </div>
  );
}
