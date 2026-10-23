import { describe, it, expect } from 'vitest';
import { firmar, firmaValida, puntaje, ResumenSchema } from './resumen';

const ejemplo = {
  dominio: 'ethosia.tech',
  generado: '2026-10-22T15:00:00.000Z',
  totales: { activos: 17, controles: 12, hallazgos_abiertos: '9', hallazgos_corregidos: '2', chequeos_ok: 12, chequeos_con_alerta: 3, incidentes_abiertos: 1, ultima_ejecucion: '2026-10-22T15:00:00Z' },
  disponibilidad: { porcentaje: '100.00', ms_promedio: '412', mediciones: '4' },
  chequeos: [
    { codigo: 'C-01', nombre: 'El sitio responde', categoria: 'Disponibilidad', estado: 'ok', valor: '400 ms', detalle: 'HTTP 200', medido_en: '2026-10-22T15:00:00Z' },
    { codigo: 'C-10', nombre: 'CSP bloqueante', categoria: 'Cabeceras', estado: 'falla', valor: 'solo informativa', detalle: 'Report-Only', medido_en: '2026-10-22T15:00:00Z' },
    { codigo: 'C-13', nombre: 'DMARC', categoria: 'DNS', estado: 'alerta', valor: 'p=none', detalle: 'monitorea', medido_en: '2026-10-22T15:00:00Z' },
    { codigo: 'C-14', nombre: 'Privacidad', categoria: 'Cumplimiento', estado: 'error', valor: null, detalle: 'timeout', medido_en: '2026-10-22T15:00:00Z' },
  ],
  hallazgos: [{ codigo: 'H-03', titulo: 'CSP informativa', severidad: 'Media', estado: 'Abierto', detectado: '2026-10-09', vence: '2026-11-08' }],
};

describe('resumen de seguridad', () => {
  it('acepta un resumen válido del colector', () => {
    expect(ResumenSchema.safeParse(ejemplo).success).toBe(true);
  });

  it('rechaza estados o códigos fuera del catálogo', () => {
    const malo = { ...ejemplo, chequeos: [{ ...ejemplo.chequeos[0], estado: 'perfecto' }] };
    expect(ResumenSchema.safeParse(malo).success).toBe(false);
    const malo2 = { ...ejemplo, hallazgos: [{ ...ejemplo.hallazgos[0], codigo: 'X-1' }] };
    expect(ResumenSchema.safeParse(malo2).success).toBe(false);
  });

  it('verifica la firma HMAC del cuerpo exacto', () => {
    const cuerpo = JSON.stringify(ejemplo);
    const f = firmar(cuerpo, 'clave-de-prueba');
    expect(firmaValida(cuerpo, f, 'clave-de-prueba')).toBe(true);
    expect(firmaValida(`${cuerpo} `, f, 'clave-de-prueba')).toBe(false);
    expect(firmaValida(cuerpo, f, 'otra-clave')).toBe(false);
    expect(firmaValida(cuerpo, 'no-hex', 'clave-de-prueba')).toBe(false);
    expect(firmaValida(cuerpo, f, undefined)).toBe(false);
  });

  it('calcula el puntaje ignorando los chequeos sin dato', () => {
    // ok = 1, alerta = 0,5, falla = 0 → 1,5 / 3 medidos = 50
    expect(puntaje(ejemplo as never)).toBe(50);
    expect(puntaje({ chequeos: [] })).toBe(0);
  });
});
