// Reglas de evaluación de los chequeos C-01…C-15. Funciones puras: reciben lo que midieron las
// sondas (sondas.js) y devuelven { codigo, estado, valor, detalle }. Así se prueban sin red.
// estado: 'ok' (cumple), 'alerta' (cumple a medias o por vencer), 'falla' (no cumple), 'error' (no se pudo medir).

const DIA_MS = 86_400_000;

const r = (codigo, estado, valor, detalle) => ({ codigo, estado, valor: valor == null ? null : String(valor), detalle });

function cab(h, nombre) {
  const v = h && h[nombre.toLowerCase()];
  return Array.isArray(v) ? v.join(', ') : v;
}

function evaluarDisponibilidad(m) {
  if (!m || m.error) return r('C-01', 'error', null, m ? m.error : 'sin medición');
  if (m.status !== 200) return r('C-01', 'falla', `${m.ms} ms`, `HTTP ${m.status}`);
  return r('C-01', m.ms > 3000 ? 'alerta' : 'ok', `${m.ms} ms`, m.ms > 3000 ? 'Respuesta lenta (> 3 s)' : 'HTTP 200');
}

function evaluarRedireccion(m) {
  if (!m || m.error) return r('C-02', 'error', null, m ? m.error : 'sin medición');
  const ok = [301, 302, 307, 308].includes(m.status) && /^https:\/\//i.test(m.location || '');
  return r('C-02', ok ? 'ok' : 'falla', m.status, ok ? `Redirige a ${m.location}` : 'HTTP no redirige a HTTPS');
}

function evaluarTls(t, ahora = Date.now()) {
  if (!t || t.error) return [r('C-03', 'error', null, t ? t.error : 'sin medición'), r('C-04', 'error', null, t ? t.error : 'sin medición')];
  const dias = Math.floor((new Date(t.validoHasta).getTime() - ahora) / DIA_MS);
  const estCert = !t.autorizado || dias < 0 ? 'falla' : dias < 15 ? 'alerta' : 'ok';
  const detCert = !t.autorizado ? `Certificado no válido: ${t.motivo || 'sin detalle'}` : `Vence el ${String(t.validoHasta).slice(0, 10)}`;
  const version = t.protocolo || '';
  const estVer = /TLSv1\.3/.test(version) ? 'ok' : /TLSv1\.2/.test(version) ? 'alerta' : 'falla';
  return [r('C-03', estCert, `${dias} días`, detCert), r('C-04', estVer, version, estVer === 'ok' ? 'TLS 1.3' : 'Se recomienda TLS 1.3')];
}

function evaluarCabeceras(h) {
  if (!h) return ['C-05', 'C-06', 'C-07', 'C-08', 'C-09', 'C-10', 'C-11'].map((c) => r(c, 'error', null, 'sin cabeceras'));
  const out = [];

  const hsts = cab(h, 'strict-transport-security') || '';
  const maxAge = Number((/max-age=(\d+)/i.exec(hsts) || [])[1] || 0);
  out.push(r('C-05', maxAge >= 31_536_000 ? 'ok' : hsts ? 'alerta' : 'falla', maxAge ? `${Math.round(maxAge / 86400)} días` : 'ausente',
    hsts ? (/preload/i.test(hsts) ? 'Incluye preload' : 'Sin preload') : 'Sin cabecera HSTS'));

  const xfo = cab(h, 'x-frame-options') || '';
  const csp = cab(h, 'content-security-policy') || '';
  const framing = /deny|sameorigin/i.test(xfo) || /frame-ancestors/i.test(csp);
  out.push(r('C-06', framing ? 'ok' : 'falla', xfo || (framing ? 'frame-ancestors' : 'ausente'), framing ? 'Protegido contra clickjacking' : 'Sin protección contra framing'));

  const nosniff = /nosniff/i.test(cab(h, 'x-content-type-options') || '');
  out.push(r('C-07', nosniff ? 'ok' : 'falla', nosniff ? 'nosniff' : 'ausente', nosniff ? 'Cumple' : 'Falta X-Content-Type-Options'));

  const refe = cab(h, 'referrer-policy'); const perm = cab(h, 'permissions-policy');
  out.push(r('C-08', refe && perm ? 'ok' : refe || perm ? 'alerta' : 'falla', [refe && 'Referrer', perm && 'Permissions'].filter(Boolean).join(' + ') || 'ausentes',
    refe && perm ? 'Ambas presentes' : 'Falta alguna de las dos'));

  const pb = cab(h, 'x-powered-by');
  out.push(r('C-09', pb ? 'falla' : 'ok', pb || 'oculto', pb ? 'Expone la tecnología del servidor' : 'No expone la tecnología'));

  const cspRO = cab(h, 'content-security-policy-report-only');
  const cspEst = csp ? (/unsafe-inline/i.test(csp) && /script-src[^;]*unsafe-inline/i.test(csp) ? 'alerta' : 'ok') : 'falla';
  out.push(r('C-10', cspEst, csp ? 'bloqueante' : cspRO ? 'solo informativa' : 'ausente',
    csp ? (cspEst === 'ok' ? 'CSP bloqueante' : 'CSP bloqueante con unsafe-inline en scripts') : cspRO ? 'CSP en modo Report-Only: no bloquea' : 'Sin CSP'));

  const acao = cab(h, 'access-control-allow-origin');
  out.push(r('C-11', acao === '*' ? 'falla' : 'ok', acao || 'no enviada', acao === '*' ? 'Cualquier origen puede leer la respuesta' : 'Sin CORS abierto'));
  return out;
}

function evaluarDns(d) {
  if (!d || d.error) return [r('C-12', 'error', null, d ? d.error : 'sin medición'), r('C-13', 'error', null, d ? d.error : 'sin medición')];
  const spf = (d.txt || []).find((t) => /^v=spf1/i.test(t));
  const dmarc = (d.dmarc || []).find((t) => /^v=DMARC1/i.test(t));
  const pol = dmarc && (/p=(\w+)/i.exec(dmarc) || [])[1];
  return [
    r('C-12', spf ? 'ok' : 'falla', spf || 'ausente', spf ? 'SPF publicado' : 'Cualquiera podría suplantar correos del dominio'),
    r('C-13', !dmarc ? 'falla' : pol && pol.toLowerCase() === 'none' ? 'alerta' : 'ok', dmarc ? `p=${pol}` : 'ausente',
      !dmarc ? 'Sin política DMARC' : pol && pol.toLowerCase() === 'none' ? 'DMARC solo monitorea (p=none)' : 'DMARC aplicado'),
  ];
}

function evaluarPrivacidad(p) {
  if (!p || p.error) return r('C-14', 'error', null, p ? p.error : 'sin medición');
  if (p.status !== 200) return r('C-14', 'falla', `HTTP ${p.status}`, 'La política de privacidad no está disponible');
  const ok = /ETHOSLAB\s*S\.?A\.?S\.?/i.test(p.texto || '');
  return r('C-14', ok ? 'ok' : 'falla', ok ? 'ETHOSLAB S.A.S.' : 'otro responsable', ok ? 'Identifica al responsable correcto' : 'No menciona a ETHOSLAB S.A.S. como responsable');
}

function evaluarMetodos(m) {
  if (!m || m.error) return r('C-15', 'error', null, m ? m.error : 'sin medición');
  return r('C-15', m.status === 405 ? 'ok' : 'falla', `GET → ${m.status}`, m.status === 405 ? 'Rechaza métodos no permitidos' : 'Acepta un método que no debería');
}

// Une todas las mediciones en la lista final de resultados.
function evaluarTodo(med, ahora = Date.now()) {
  return [
    evaluarDisponibilidad(med.https),
    evaluarRedireccion(med.http),
    ...evaluarTls(med.tls, ahora),
    ...evaluarCabeceras(med.https && med.https.headers),
    ...evaluarDns(med.dns),
    evaluarPrivacidad(med.privacidad),
    evaluarMetodos(med.metodos),
  ];
}

// Severidad del incidente que se abre cuando un chequeo pasa a 'falla'.
const SEVERIDAD = { 'C-01': 'Alta', 'C-03': 'Alta', 'C-02': 'Alta', 'C-14': 'Alta', 'C-10': 'Media', 'C-12': 'Media', 'C-13': 'Media' };
const severidadDe = (codigo) => SEVERIDAD[codigo] || 'Baja';

module.exports = { evaluarTodo, evaluarDisponibilidad, evaluarRedireccion, evaluarTls, evaluarCabeceras, evaluarDns, evaluarPrivacidad, evaluarMetodos, severidadDe };
