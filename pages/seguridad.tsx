import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import Header from '../components/home/Header';

// Panel interno de Ethos SecMon: muestra el último resumen que envió el colector local
// (seguridad/colector). Solo para Gerencia: exige un JWT con rol "gerencia" (scripts/emitir-token.js).
// El token se guarda únicamente en la sesión del navegador y se borra al cerrar la pestaña.

type Chequeo = { codigo: string; nombre: string; categoria: string; estado: 'ok' | 'alerta' | 'falla' | 'error'; valor?: string | null; detalle?: string | null; medido_en: string };
type Hallazgo = { codigo: string; titulo: string; severidad: string; estado: string; detectado: string; vence: string };
type Estado = {
  vacio?: boolean; dominio?: string; generado?: string; recibido?: string; puntaje?: number;
  totales?: Record<string, number | string | null>;
  disponibilidad?: { porcentaje?: number | string | null; ms_promedio?: number | string | null; mediciones?: number | string | null } | null;
  chequeos?: Chequeo[]; hallazgos?: Hallazgo[]; historial?: { fecha: string; puntaje: number }[];
};

const CLAVE = 'ethos-secmon-token';
const ROTULO = { ok: 'Cumple', alerta: 'Atención', falla: 'Falla', error: 'Sin dato' } as const;
const fecha = (s?: string) => (s ? new Date(s).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' }) : '—');
const dia = (s?: string) => (s ? new Date(`${String(s).slice(0, 10)}T12:00:00`).toLocaleDateString('es-EC', { dateStyle: 'medium' }) : '—');

function Historial({ puntos }: { puntos: { fecha: string; puntaje: number }[] }) {
  if (puntos.length < 2) return <p className="nota">El historial aparece desde la segunda medición.</p>;
  const w = 600; const h = 120; const paso = w / (puntos.length - 1);
  const linea = puntos.map((p, i) => `${(i * paso).toFixed(1)},${(h - (p.puntaje / 100) * h).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="hist" role="img" aria-label={`Puntaje de seguridad en las últimas ${puntos.length} mediciones`}>
      <line x1="0" y1={h * 0.2} x2={w} y2={h * 0.2} className="guia" />
      <polyline points={linea} fill="none" className="trazo" />
    </svg>
  );
}

export default function Seguridad() {
  const [token, setToken] = useState('');
  const [entrada, setEntrada] = useState('');
  const [datos, setDatos] = useState<Estado | null>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async (t: string) => {
    setCargando(true); setError('');
    try {
      const r = await fetch('/api/seguridad/estado', { headers: { Authorization: `Bearer ${t}` } });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error || 'No se pudo cargar el panel.');
        if (r.status === 401 || r.status === 403) { try { sessionStorage.removeItem(CLAVE); } catch { /* sin almacenamiento */ } setToken(''); }
        return;
      }
      setDatos(j);
    } catch {
      setError('Sin conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let t = '';
    try { t = sessionStorage.getItem(CLAVE) || ''; } catch { /* sin almacenamiento */ }
    if (t) { setToken(t); cargar(t); }
  }, [cargar]);

  const entrar = (e: React.FormEvent) => {
    e.preventDefault();
    const t = entrada.trim(); if (!t) return;
    try { sessionStorage.setItem(CLAVE, t); } catch { /* sin almacenamiento */ }
    setToken(t); setEntrada(''); cargar(t);
  };
  const salir = () => { try { sessionStorage.removeItem(CLAVE); } catch { /* sin almacenamiento */ } setToken(''); setDatos(null); };

  const tot = datos?.totales || {};
  const abiertos = (datos?.hallazgos || []).filter((x) => x.estado !== 'Corregido' && x.estado !== 'Aceptado');
  const corregidos = (datos?.hallazgos || []).filter((x) => x.estado === 'Corregido');
  const color = (p = 0) => (p >= 85 ? 'ok' : p >= 60 ? 'alerta' : 'falla');

  return (
    <div className="app" id="contenido-principal">
      <Head>
        <title>Centro de seguridad · Ethos IA</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Header />

      <header className="hero">
        <span className="eyebrow">ETHOS SECMON · USO INTERNO</span>
        <h1>Centro de monitoreo de seguridad del sitio</h1>
        <p>Chequeos automáticos y pasivos sobre www.ethosia.tech (disponibilidad, certificado, cabeceras de seguridad, protección del correo y cumplimiento), registrados en la base de datos local de la empresa y resumidos aquí para Gerencia.</p>
      </header>

      <main className="cuerpo">
        {!token && (
          <form className="card acceso" onSubmit={entrar}>
            <h2>Acceso de Gerencia</h2>
            <p>Pega tu token de acceso (rol <code>gerencia</code>). Se guarda solo en esta pestaña.</p>
            <label htmlFor="tk" className="sr">Token de acceso</label>
            <input id="tk" type="password" autoComplete="off" value={entrada} onChange={(e) => setEntrada(e.target.value)} placeholder="eyJhbGciOi…" />
            <button type="submit" className="btn">Entrar al panel</button>
            {error && <p className="err" role="alert">{error}</p>}
          </form>
        )}

        {token && cargando && !datos && <p className="estado" role="status">Cargando el último resumen…</p>}
        {token && error && <p className="err" role="alert">{error}</p>}
        {token && datos?.vacio && <p className="estado">Aún no hay mediciones. Arranca el colector local (<code>docker compose up -d</code> en <code>seguridad/</code>).</p>}

        {token && datos && !datos.vacio && (
          <>
            <div className="barra">
              <span>Última medición: <b>{fecha(datos.generado)}</b> · {datos.dominio}</span>
              <span>
                <button type="button" className="btn sec" onClick={() => cargar(token)} disabled={cargando}>{cargando ? 'Actualizando…' : 'Actualizar'}</button>
                <button type="button" className="btn sec" onClick={salir}>Salir</button>
              </span>
            </div>

            <ul className="cifras">
              <li className={`puntaje ${color(datos.puntaje)}`}><strong>{datos.puntaje}</strong><span>Puntaje de seguridad /100</span></li>
              <li><strong>{datos.disponibilidad?.porcentaje ?? '—'}%</strong><span>Disponibilidad (30 días)</span></li>
              <li><strong>{datos.disponibilidad?.ms_promedio ?? '—'} ms</strong><span>Respuesta promedio</span></li>
              <li><strong>{tot.chequeos_ok ?? 0}/{(Number(tot.chequeos_ok) || 0) + (Number(tot.chequeos_con_alerta) || 0)}</strong><span>Chequeos que cumplen</span></li>
              <li><strong>{tot.hallazgos_abiertos ?? 0}</strong><span>Hallazgos abiertos</span></li>
              <li><strong>{tot.incidentes_abiertos ?? 0}</strong><span>Incidentes abiertos</span></li>
            </ul>

            <section>
              <h2>Evolución del puntaje</h2>
              <div className="card"><Historial puntos={datos.historial || []} /></div>
            </section>

            <section>
              <h2>Chequeos automáticos</h2>
              <div className="tabla">
                {(datos.chequeos || []).map((c) => (
                  <div key={c.codigo} className="fila">
                    <span className={`nivel ${c.estado}`}>{ROTULO[c.estado]}</span>
                    <div>
                      <h3>{c.codigo} · {c.nombre}</h3>
                      <p>{c.detalle}{c.valor ? <> · <code>{c.valor}</code></> : null} <span className="cat">{c.categoria}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2>Hallazgos en seguimiento ({abiertos.length})</h2>
              <div className="tabla">
                {abiertos.map((x) => (
                  <div key={x.codigo} className="fila">
                    <span className={`nivel sev-${x.severidad}`}>{x.severidad}</span>
                    <div><h3>{x.codigo} · {x.titulo}</h3><p>{x.estado} · detectado {dia(x.detectado)} · corregir antes del {dia(x.vence)}</p></div>
                  </div>
                ))}
                {!abiertos.length && <p className="estado">No hay hallazgos abiertos.</p>}
              </div>
              {corregidos.length > 0 && (
                <p className="nota">Corregidos y verificados automáticamente: {corregidos.map((x) => x.codigo).join(', ')}.</p>
              )}
            </section>
          </>
        )}
      </main>

      <style jsx>{`
        .app { min-height: 100vh; background: var(--c-fondo, #eaf2f8); color: #05111e; font-family: var(--font-brand), -apple-system, sans-serif; }
        .hero { background: #05111e; color: #eaf2f8; padding: 128px 48px 64px; }
        .eyebrow { font-size: 12px; letter-spacing: 0.18em; color: #04ebff; }
        h1 { font-size: clamp(1.8rem, 3.4vw, 2.6rem); line-height: 1.2; margin: 14px 0 0; max-width: 24ch; }
        .hero p { color: #c4d3e0; line-height: 1.7; max-width: 66ch; margin: 18px 0 0; }
        .cuerpo { max-width: 980px; margin: -28px auto 0; padding: 0 24px 72px; }
        section { margin-top: 32px; }
        h2 { font-size: 1.3rem; margin: 0 0 12px; }
        .card { background: #fff; border: 1px solid rgba(5,17,30,0.08); border-radius: 14px; padding: 22px; box-shadow: 0 10px 28px rgba(5,17,30,0.05); }
        .acceso { max-width: 520px; display: flex; flex-direction: column; gap: 12px; }
        .acceso p { margin: 0; color: #33414d; line-height: 1.6; }
        input { font: inherit; font-size: 16px; padding: 12px 14px; border-radius: 10px; border: 1px solid #c4d3e0; }
        .btn { border: 0; background: #05111e; color: #04ebff; padding: 10px 16px; border-radius: 10px; cursor: pointer; font: inherit; font-weight: 600; min-height: 44px; }
        .btn.sec { background: #fff; color: #0b5f75; border: 1px solid #c4d3e0; margin-left: 8px; }
        .btn:focus-visible, input:focus-visible { outline: 2px solid #04ebff; outline-offset: 2px; }
        .barra { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; background: #fff; border-radius: 14px; padding: 12px 16px; box-shadow: 0 18px 40px rgba(5,17,30,0.08); color: #33414d; font-size: 14px; }
        .cifras { list-style: none; padding: 0; margin: 24px 0 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
        .cifras li { background: #fff; border: 1px solid rgba(5,17,30,0.08); border-radius: 12px; padding: 14px 18px; display: flex; flex-direction: column; }
        .cifras strong { font-size: 1.7rem; color: #0b5f75; }
        .cifras span { font-size: 12px; color: #526373; }
        .puntaje.ok strong { color: #14653a; } .puntaje.alerta strong { color: #7a4b00; } .puntaje.falla strong { color: #8a1c1c; }
        .tabla { display: flex; flex-direction: column; gap: 10px; }
        .fila { display: grid; grid-template-columns: 110px 1fr; gap: 16px; background: #fff; border-radius: 12px; padding: 14px 18px; border: 1px solid rgba(5,17,30,0.08); }
        .fila h3 { font-size: 15px; margin: 0 0 4px; }
        .fila p { font-size: 14px; color: #33414d; line-height: 1.55; margin: 0; overflow-wrap: anywhere; }
        .cat { font-size: 11px; padding: 2px 8px; border-radius: 999px; background: #eaf2f8; color: #0b5f75; margin-left: 6px; }
        .nivel { font-size: 12px; font-weight: 700; padding: 6px 10px; border-radius: 8px; height: fit-content; text-align: center; }
        .nivel.ok { background: #dff5e6; color: #14653a; }
        .nivel.alerta, .nivel.sev-Media { background: #fff1d6; color: #7a4b00; }
        .nivel.falla, .nivel.sev-Alta { background: #fde3e3; color: #8a1c1c; }
        .nivel.error, .nivel.sev-Informativa { background: #eaf2f8; color: #526373; }
        .nivel.sev-Baja { background: #e3ecff; color: #1d3f8a; }
        code { background: #eaf2f8; padding: 2px 6px; border-radius: 6px; font-size: 13px; }
        .estado { color: #33414d; }
        .err { background: #fde3e3; color: #8a1c1c; padding: 12px 14px; border-radius: 10px; margin: 12px 0 0; }
        .nota { font-size: 13px; color: #526373; margin: 12px 0 0; }
        .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        .hist { width: 100%; height: 120px; }
        .hist :global(.trazo) { stroke: #0b5f75; stroke-width: 3; stroke-linejoin: round; }
        .hist :global(.guia) { stroke: #c4d3e0; stroke-dasharray: 4 4; }
        @media (max-width: 600px) {
          .hero { padding: 104px 20px 56px; }
          .cuerpo { padding: 0 16px 56px; }
          .fila { grid-template-columns: 1fr; }
          .btn.sec { margin: 6px 6px 0 0; }
        }
      `}</style>
    </div>
  );
}
