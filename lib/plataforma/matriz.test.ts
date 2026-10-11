import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';
import { PRUEBAS_RED } from './matriz';
import { PANELES } from './paneles';

describe('pruebas de red del laboratorio', () => {
  it('son 16 y todas coinciden con lo esperado', () => {
    expect(PRUEBAS_RED).toHaveLength(16);
    expect(PRUEBAS_RED.every((p) => p.esperado === p.obtenido && p.resultado === 'CUMPLE')).toBe(true);
  });

  it('el segmento de invitados solo sale a Internet', () => {
    const inv = PRUEBAS_RED.filter((p) => p.origen === 'Invitados');
    expect(inv.filter((p) => p.obtenido === 'OK').map((p) => p.destino)).toEqual(['Internet (443)']);
  });
});

describe('galería de paneles', () => {
  it('cada panel tiene su imagen WebP publicada', () => {
    for (const p of PANELES) {
      expect(existsSync(join(process.cwd(), 'public', 'paneles', `${p.id}.webp`)), p.id).toBe(true);
    }
  });

  it('no publica las capturas con vulnerabilidades abiertas del sitio real', () => {
    const ids = PANELES.map((p) => p.id).join(' ');
    expect(ids).not.toMatch(/Lab_C06|Lab_C09/);
  });

  it('los identificadores son únicos', () => {
    expect(new Set(PANELES.map((p) => p.id)).size).toBe(PANELES.length);
  });
});
