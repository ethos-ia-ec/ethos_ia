import { describe, it, expect, vi } from 'vitest';
import { consultarEstado } from './estado';

const resp = (status: number) => vi.fn().mockResolvedValue({ status }) as unknown as typeof fetch;

describe('consultarEstado', () => {
  it('sin URL configurada está fuera de línea', async () => {
    expect(await consultarEstado({})).toEqual({ enLinea: false });
  });

  it('rechaza URL inválida o sin HTTPS', async () => {
    expect(await consultarEstado({ url: 'no es url' }, resp(200))).toEqual({ enLinea: false });
    expect(await consultarEstado({ url: 'http://demo.ejemplo.test' }, resp(200))).toEqual({ enLinea: false });
  });

  it('está en línea con 200 o redirección y devuelve la credencial pública', async () => {
    const cfg = { url: 'https://demo.ejemplo.test', usuario: 'demo', clave: 'solo-lectura' };
    expect(await consultarEstado(cfg, resp(200))).toMatchObject({ enLinea: true, usuario: 'demo', clave: 'solo-lectura' });
    expect((await consultarEstado(cfg, resp(302))).enLinea).toBe(true);
  });

  it('está fuera de línea con errores del servidor o del túnel', async () => {
    expect((await consultarEstado({ url: 'https://demo.ejemplo.test' }, resp(502))).enLinea).toBe(false);
    expect((await consultarEstado({ url: 'https://demo.ejemplo.test' }, resp(404))).enLinea).toBe(false);
  });

  it('está fuera de línea si la consulta falla o excede el tiempo', async () => {
    const falla = vi.fn().mockRejectedValue(new Error('red')) as unknown as typeof fetch;
    expect((await consultarEstado({ url: 'https://demo.ejemplo.test' }, falla)).enLinea).toBe(false);

    const lenta = vi.fn((_u: unknown, init?: RequestInit) =>
      new Promise((_r, rechazar) => init?.signal?.addEventListener('abort', () => rechazar(new Error('abortado'))))
    ) as unknown as typeof fetch;
    expect((await consultarEstado({ url: 'https://demo.ejemplo.test' }, lenta, 20)).enLinea).toBe(false);
  });

  it('no incluye credenciales si no están configuradas', async () => {
    const r = await consultarEstado({ url: 'https://demo.ejemplo.test' }, resp(200));
    expect(r).toEqual({ enLinea: true, url: 'https://demo.ejemplo.test/', usuario: undefined, clave: undefined });
  });
});
