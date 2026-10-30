import { describe, expect, it } from 'vitest';
import { aSlug, idDeVideo, problemasParaPublicar, type Borrador } from './validar';
import { combinar } from '../noticiasDb';
import { NOTICIAS } from '../noticias';
import { rss, sitemapNews } from '../noticiasFeeds';

const base: Borrador = {
  titulo: 'Ethos IA publica su kit académico abierto',
  resumen: 'Una herramienta gratuita para investigación científica y tesis de TI.',
  slug: 'ethos-ia-publica-su-kit-academico-abierto',
  imagen: { src: '/x.webp', alt: 'Captura del repositorio público', credito: 'Ethos IA' },
  cuerpo: [{ tipo: 'p', texto: 'Texto de la nota.' }],
  fuentes: [{ texto: 'Repositorio', url: 'https://github.com/IngMarlonPerez/ethos-ia-academia' }],
};

describe('Ethos Prensa · validación', () => {
  it('genera slugs limpios desde títulos con tildes y signos', () => {
    expect(aSlug('¡Nuestro Gerente, invitado a «Radar Económico»!')).toBe('nuestro-gerente-invitado-a-radar-economico');
  });

  it('una nota completa no tiene problemas', () => {
    expect(problemasParaPublicar(base)).toEqual([]);
  });

  it('exige alt y crédito en la foto, al menos una fuente https y bloquea frases de obra inconclusa', () => {
    const p = problemasParaPublicar({
      ...base,
      imagen: { src: '/x.webp', alt: '' },
      fuentes: [{ texto: 'x', url: 'http://inseguro' }],
      cuerpo: [{ tipo: 'p', texto: 'Próximamente más detalles.' }],
    });
    expect(p.join(' ')).toMatch(/texto alternativo/);
    expect(p.join(' ')).toMatch(/crédito/);
    expect(p.join(' ')).toMatch(/https/);
    expect(p.join(' ')).toMatch(/próximamente/);
  });

  it('reconoce enlaces de YouTube (incluidas transmisiones) y Vimeo', () => {
    expect(idDeVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10')).toEqual({ proveedor: 'youtube', id: 'dQw4w9WgXcQ' });
    expect(idDeVideo('https://youtube.com/live/dQw4w9WgXcQ')).toEqual({ proveedor: 'youtube', id: 'dQw4w9WgXcQ' });
    expect(idDeVideo('https://vimeo.com/123456')).toEqual({ proveedor: 'vimeo', id: '123456' });
    expect(idDeVideo('https://ejemplo.com')).toBeNull();
  });

  it('las notas de la base reemplazan a las estáticas con el mismo slug y se ordenan por fecha', () => {
    const nueva = { ...NOTICIAS[0], slug: 'otra', fecha: '2027-01-01' };
    const editada = { ...NOTICIAS[0], titulo: 'Editada en el panel' };
    const r = combinar([editada, nueva]);
    expect(r[0].slug).toBe('otra');
    expect(r.filter((n) => n.slug === NOTICIAS[0].slug)).toHaveLength(1);
    expect(r.find((n) => n.slug === NOTICIAS[0].slug)?.titulo).toBe('Editada en el panel');
  });
});

describe('Ethos Noticias · feeds', () => {
  const nota = { ...NOTICIAS[0], titulo: 'IA & datos <prueba>', fecha: '2026-10-30' };
  it('el sitemap de Google News incluye solo notas de los últimos 2 días y escapa el XML', () => {
    const xml = sitemapNews([nota, { ...nota, slug: 'vieja', fecha: '2026-01-01' }], 'https://x.tech', new Date('2026-10-31T12:00:00'));
    expect(xml).toContain('<loc>https://x.tech/noticias/' + nota.slug + '</loc>');
    expect(xml).toContain('IA &amp; datos &lt;prueba&gt;');
    expect(xml).not.toContain('/noticias/vieja');
  });
  it('el RSS lista las notas con enlace permanente', () => {
    expect(rss([nota], 'https://x.tech')).toContain('<guid isPermaLink="true">https://x.tech/noticias/' + nota.slug + '</guid>');
  });
});
