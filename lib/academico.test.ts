import { describe, expect, it } from 'vitest';
import { AREAS, COMPROMISO, desfase, EQUIPO, iniciales, PROYECTOS, WHATSAPP_ACADEMICO } from './academico';

describe('desfase del carrusel', () => {
  it('da la distancia más corta con signo', () => {
    expect(desfase(0, 0, 8)).toBe(0);
    expect(desfase(1, 0, 8)).toBe(1);
    expect(desfase(7, 0, 8)).toBe(-1);
    expect(desfase(0, 7, 8)).toBe(1);
    expect(desfase(3, 5, 8)).toBe(-2);
  });
});

describe('contenido de Ethos Académico', () => {
  it('genera iniciales', () => {
    expect(iniciales('Ethos Académico')).toBe('EA');
  });

  it('el equipo se presenta por perfiles, sin nombres de personas', () => {
    EQUIPO.forEach((p) => expect(Object.keys(p)).not.toContain('nombre'));
  });

  it('cada área tiene id único', () => {
    expect(new Set(AREAS.map((a) => a.id)).size).toBe(AREAS.length);
  });

  it('las imágenes del portafolio viven en /academico/', () => {
    PROYECTOS.flatMap((p) => p.imagenes).forEach((i) => expect(i.src.startsWith('/academico/')).toBe(true));
  });

  it('las figuras reales del carrusel son propias y las de acceso abierto van rotuladas como ilustrativas', () => {
    AREAS.forEach((a) => {
      expect(a.imagen).toBeDefined();
      const { src, ilustrativa } = a.imagen!;
      expect(src.startsWith('/academico/')).toBe(true);
      expect(src.startsWith('/academico/libres/')).toBe(Boolean(ilustrativa));
    });
  });

  it('declara el compromiso de autoría', () => {
    expect(COMPROMISO.no.join(' ')).toMatch(/no elaboramos trabajos/i);
  });

  it('el enlace de WhatsApp usa wa.me con mensaje', () => {
    expect(WHATSAPP_ACADEMICO).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  });
});
