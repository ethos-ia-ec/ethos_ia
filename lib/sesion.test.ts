import { describe, expect, it } from 'vitest';
import { destinoSeguro } from './sesion';

describe('destinoSeguro', () => {
  it('acepta rutas internas', () => {
    expect(destinoSeguro('/prensa')).toBe('/prensa');
    expect(destinoSeguro('/cuenta')).toBe('/cuenta');
  });
  it('rechaza destinos externos o raros', () => {
    for (const v of ['//evil.com', 'https://evil.com', '/\evil.com', '/a?b=1', undefined, ['/x']]) expect(destinoSeguro(v)).toBe('/cuenta');
  });
});
