import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ch = require('./chequeos.js');

const AHORA = Date.parse('2026-10-22T12:00:00Z');

const cabecerasBuenas = {
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=()',
  'content-security-policy': "default-src 'self'; script-src 'self'",
};

const porCodigo = (lista) => Object.fromEntries(lista.map((x) => [x.codigo, x]));

describe('chequeos de Ethos SecMon', () => {
  it('un sitio bien configurado pasa todos los chequeos de cabeceras', () => {
    const r = porCodigo(ch.evaluarCabeceras(cabecerasBuenas));
    for (const c of ['C-05', 'C-06', 'C-07', 'C-08', 'C-09', 'C-10', 'C-11']) expect(r[c].estado).toBe('ok');
  });

  it('detecta CSP solo informativa, X-Powered-By y CORS abierto (hallazgos H-03 y H-07)', () => {
    const h = { ...cabecerasBuenas, 'content-security-policy': undefined, 'content-security-policy-report-only': "script-src 'self' 'unsafe-inline'", 'x-powered-by': 'Next.js', 'access-control-allow-origin': '*' };
    const r = porCodigo(ch.evaluarCabeceras(h));
    expect(r['C-10'].estado).toBe('falla');
    expect(r['C-10'].valor).toBe('solo informativa');
    expect(r['C-09'].estado).toBe('falla');
    expect(r['C-11'].estado).toBe('falla');
  });

  it('HSTS corto queda en alerta y ausente en falla', () => {
    expect(ch.evaluarCabeceras({ ...cabecerasBuenas, 'strict-transport-security': 'max-age=86400' })[0].estado).toBe('alerta');
    expect(ch.evaluarCabeceras({ ...cabecerasBuenas, 'strict-transport-security': undefined })[0].estado).toBe('falla');
  });

  it('certificado: vigente, por vencer, vencido o no válido', () => {
    const t = (validoHasta, autorizado = true) => ch.evaluarTls({ autorizado, protocolo: 'TLSv1.3', validoHasta }, AHORA)[0];
    expect(t('2026-11-30T00:00:00Z').estado).toBe('ok');
    expect(t('2026-10-30T00:00:00Z').estado).toBe('alerta');
    expect(t('2026-10-01T00:00:00Z').estado).toBe('falla');
    expect(t('2026-11-30T00:00:00Z', false).estado).toBe('falla');
    expect(ch.evaluarTls({ autorizado: true, protocolo: 'TLSv1.2', validoHasta: '2026-11-30T00:00:00Z' }, AHORA)[1].estado).toBe('alerta');
  });

  it('DNS: sin SPF ni DMARC falla (H-04); DMARC p=none queda en alerta', () => {
    const [spf, dmarc] = ch.evaluarDns({ txt: ['google-site-verification=abc'], dmarc: [] });
    expect(spf.estado).toBe('falla');
    expect(dmarc.estado).toBe('falla');
    const [s2, d2] = ch.evaluarDns({ txt: ['v=spf1 -all'], dmarc: ['v=DMARC1; p=none'] });
    expect(s2.estado).toBe('ok');
    expect(d2.estado).toBe('alerta');
    expect(ch.evaluarDns({ txt: ['v=spf1 -all'], dmarc: ['v=DMARC1; p=reject'] })[1].estado).toBe('ok');
  });

  it('privacidad: exige que el responsable sea ETHOSLAB S.A.S. (H-02)', () => {
    expect(ch.evaluarPrivacidad({ status: 200, texto: 'Responsable: ETHOSLAB S.A.S., Cuenca' }).estado).toBe('ok');
    expect(ch.evaluarPrivacidad({ status: 200, texto: 'Responsable: Otra organización' }).estado).toBe('falla');
    expect(ch.evaluarPrivacidad({ status: 404, texto: '' }).estado).toBe('falla');
  });

  it('disponibilidad, redirección y métodos', () => {
    expect(ch.evaluarDisponibilidad({ status: 200, ms: 350 }).estado).toBe('ok');
    expect(ch.evaluarDisponibilidad({ status: 200, ms: 4500 }).estado).toBe('alerta');
    expect(ch.evaluarDisponibilidad({ status: 503, ms: 100 }).estado).toBe('falla');
    expect(ch.evaluarDisponibilidad({ error: 'ECONNREFUSED' }).estado).toBe('error');
    expect(ch.evaluarRedireccion({ status: 308, location: 'https://www.ethosia.tech/' }).estado).toBe('ok');
    expect(ch.evaluarRedireccion({ status: 200 }).estado).toBe('falla');
    expect(ch.evaluarMetodos({ status: 405 }).estado).toBe('ok');
    expect(ch.evaluarMetodos({ status: 200 }).estado).toBe('falla');
  });

  it('evaluarTodo devuelve los 15 chequeos aunque falte una medición', () => {
    const r = ch.evaluarTodo({ https: { status: 200, ms: 300, headers: cabecerasBuenas } }, AHORA);
    expect(r.map((x) => x.codigo)).toEqual(['C-01', 'C-02', 'C-03', 'C-04', 'C-05', 'C-06', 'C-07', 'C-08', 'C-09', 'C-10', 'C-11', 'C-12', 'C-13', 'C-14', 'C-15']);
    expect(r.find((x) => x.codigo === 'C-02').estado).toBe('error');
  });
});
