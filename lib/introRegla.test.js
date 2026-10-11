import { describe, it, expect } from 'vitest';
import { debeMostrarIntro, DIA_MS } from './introRegla';

const AHORA = 1_800_000_000_000;
const base = { pathInicial: '/', tipo: 'navigate', ultima: null, ahora: AHORA };

describe('debeMostrarIntro', () => {
  it('primera visita: se muestra', () => {
    expect(debeMostrarIntro(base)).toBe(true);
  });

  it('visita reciente (menos de 24 h): no se repite', () => {
    expect(debeMostrarIntro({ ...base, ultima: AHORA - 3_600_000 })).toBe(false);
    expect(debeMostrarIntro({ ...base, ultima: AHORA - DIA_MS + 1000 })).toBe(false);
  });

  it('pasadas 24 h vuelve a mostrarse', () => {
    expect(debeMostrarIntro({ ...base, ultima: AHORA - DIA_MS })).toBe(true);
  });

  it('recarga intencional de la portada: siempre, aunque sea reciente', () => {
    expect(debeMostrarIntro({ ...base, tipo: 'reload', ultima: AHORA - 1000 })).toBe(true);
  });

  it('atrás/adelante del navegador sigue la regla de 24 h', () => {
    expect(debeMostrarIntro({ ...base, tipo: 'back_forward', ultima: AHORA - 1000 })).toBe(false);
  });

  it('el documento se cargó en otra página (navegación interna hacia la portada): no se muestra, ni en recarga previa', () => {
    expect(debeMostrarIntro({ ...base, pathInicial: '/plataforma', tipo: 'reload' })).toBe(false);
    expect(debeMostrarIntro({ ...base, pathInicial: '/equipo', ultima: null })).toBe(false);
  });

  it('reducir movimiento la anula siempre; ?intro=1 la fuerza', () => {
    expect(debeMostrarIntro({ ...base, tipo: 'reload', reducir: true })).toBe(false);
    expect(debeMostrarIntro({ ...base, ultima: AHORA - 1000, forzar: true })).toBe(true);
    expect(debeMostrarIntro({ ...base, forzar: true, reducir: true })).toBe(false);
  });

  it('un valor guardado inválido se trata como si no hubiera visita previa', () => {
    expect(debeMostrarIntro({ ...base, ultima: 'x' })).toBe(true);
  });
});
