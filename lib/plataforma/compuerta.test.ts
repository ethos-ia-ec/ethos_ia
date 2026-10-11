import { describe, it, expect } from 'vitest';
import { evaluarAuditoria, UMBRALES, EJEMPLO_AUDITORIA } from './compuerta';

const audit = (v: Record<string, unknown>) => ({ auditReportVersion: 2, vulnerabilities: v });
const HOY = '2026-10-12';

describe('umbrales (espejo de umbrales.yml)', () => {
  it('bloquea critical y high con los plazos de la política', () => {
    expect(UMBRALES.bloquea).toEqual(['critical', 'high']);
    expect(UMBRALES.plazoDias).toMatchObject({ critical: 7, high: 30, moderate: 90, low: 180 });
  });
});

describe('evaluarAuditoria', () => {
  it('pasa cuando no hay vulnerabilidades', () => {
    const r = evaluarAuditoria(audit({}), [], HOY);
    expect(r).toMatchObject({ ok: true, pasa: true });
  });

  it('pasa con solo moderate y low, y asigna plazos', () => {
    const r = evaluarAuditoria(
      audit({ a: { severity: 'moderate', via: ['x'] }, b: { severity: 'low' } }),
      [],
      HOY
    );
    expect(r.ok && r.pasa).toBe(true);
    if (r.ok) expect(r.hallazgos.map((h) => h.plazoDias)).toEqual([90, 180]);
  });

  it('no pasa con high o critical', () => {
    const r = evaluarAuditoria(audit({ a: { severity: 'high' }, b: { severity: 'critical' } }), [], HOY);
    expect(r.ok && r.pasa).toBe(false);
    if (r.ok) {
      expect(r.bloqueantes.map((h) => h.severidad)).toEqual(['critical', 'high']);
      expect(r.conteo).toMatchObject({ critical: 1, high: 1 });
    }
  });

  it('una excepción vigente deja pasar y una vencida no', () => {
    const v = audit({ next: { severity: 'critical', fixAvailable: true } });
    const vigente = evaluarAuditoria(v, [{ hallazgo: 'next', vence: '2026-11-01' }], HOY);
    const vencida = evaluarAuditoria(v, [{ hallazgo: 'next', vence: '2026-10-01' }], HOY);
    expect(vigente.ok && vigente.pasa).toBe(true);
    expect(vencida.ok && vencida.pasa).toBe(false);
  });

  it('acepta texto JSON y lo interpreta', () => {
    const r = evaluarAuditoria(JSON.stringify(audit({ a: { severity: 'high' } })), [], HOY);
    expect(r.ok && r.pasa).toBe(false);
  });

  it('lee el título desde via cuando es objeto y marca si hay parche', () => {
    const r = evaluarAuditoria(
      audit({ a: { severity: 'high', via: [{ title: 'Inyección' }], fixAvailable: { name: 'a', version: '2.0.0' } } }),
      [],
      HOY
    );
    if (r.ok) {
      expect(r.hallazgos[0].titulo).toBe('Inyección');
      expect(r.hallazgos[0].conParche).toBe(true);
    }
  });

  it('devuelve errores claros y no lanza excepciones', () => {
    expect(evaluarAuditoria('', [], HOY)).toEqual({ ok: false, error: 'Pega la salida de «npm audit --json».' });
    expect(evaluarAuditoria('{no es json', [], HOY)).toMatchObject({ ok: false, error: expect.stringContaining('JSON válido') });
    expect(evaluarAuditoria({ otra: 1 }, [], HOY)).toMatchObject({ ok: false, error: expect.stringContaining('vulnerabilities') });
    expect(evaluarAuditoria(audit({ a: { severity: 'enorme' } }), [], HOY).ok).toBe(false);
  });

  it('el ejemplo precargado se evalúa y no pasa (tiene un critical)', () => {
    const r = evaluarAuditoria(EJEMPLO_AUDITORIA, [], HOY);
    expect(r.ok && r.pasa).toBe(false);
  });
});
