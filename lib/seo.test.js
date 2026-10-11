import { describe, it, expect } from 'vitest';
import { organizacion, personaMarlon, personaKaren, clubIngenieria, migas, sitemapXml, RUTAS, SITE_URL, MARLON_ID } from './seo';

describe('datos estructurados', () => {
  it('Marlon: nombre completo, cargo, empresa, UNEMI y enlaces https', () => {
    const p = personaMarlon();
    expect(p.name).toBe('Marlon David Pérez Almachi');
    expect(p.alternateName).toContain('Marlon Pérez');
    expect(p.jobTitle).toMatch(/Gerente General/);
    expect(p.sameAs.length).toBeGreaterThanOrEqual(5);
    expect(p.sameAs.every((u) => u.startsWith('https://'))).toBe(true);
  });

  it('no incluye cédulas, teléfonos ni correos personales en ninguna entidad', () => {
    const todo = JSON.stringify([organizacion('x'), personaMarlon(), personaKaren(), clubIngenieria()]);
    expect(todo).not.toMatch(/\b\d{10}\b/);
    expect(todo).not.toMatch(/\+?593\s?9\d/);
    expect(todo).not.toMatch(/@unemi|@gmail\.com(?!.*ethos)/);
  });

  it('la empresa enlaza a sus fundadores y el club enlaza a Marlon', () => {
    expect(organizacion('x').founder.map((f) => f['@id'])).toContain(MARLON_ID);
    expect(clubIngenieria().founder['@id']).toBe(MARLON_ID);
  });

  it('las migas numeran desde 1 con URLs absolutas', () => {
    const m = migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Equipo', ruta: '/equipo' }]);
    expect(m.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(m.itemListElement[1].item).toBe(`${SITE_URL}/equipo`);
  });
});

describe('sitemap', () => {
  it('lista todas las rutas con URL absoluta y fecha de modificación', () => {
    const xml = sitemapXml('2026-10-12');
    for (const r of RUTAS) expect(xml).toContain(`<loc>${SITE_URL}${r.ruta}</loc>`);
    expect(xml.match(/<lastmod>2026-10-12<\/lastmod>/g)).toHaveLength(RUTAS.length);
    expect(xml).toContain('/equipo/marlon-perez');
    expect(xml).toContain('/plataforma');
  });
});
