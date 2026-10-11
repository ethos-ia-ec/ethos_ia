import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

function fakeRes() {
  const res = { headers: {} };
  res.status = vi.fn((c) => { res.statusCode = c; return res; });
  res.json = vi.fn((b) => { res.body = b; return res; });
  res.setHeader = vi.fn((k, v) => { res.headers[k] = v; });
  return res;
}
const req = (extra = {}) => ({ method: 'GET', headers: {}, socket: { remoteAddress: '1.1.1.1' }, ...extra });

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV, PLATAFORMA_JWT_SECRET: 'secreto-de-prueba-solo-para-tests' };
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  vi.resetModules();
});
afterEach(() => { process.env = { ...ORIGINAL_ENV }; });

describe('GET /api/plataforma/resumen', () => {
  it('devuelve el catálogo sin autenticación', async () => {
    const { default: handler } = await import('./resumen');
    const res = fakeRes();
    await handler(req(), res);
    expect(res.statusCode).toBe(200);
    expect(res.body.secciones).toHaveLength(3);
    expect(res.body.riesgos.length).toBeGreaterThan(0);
  });

  it('rechaza métodos distintos de GET', async () => {
    const { default: handler } = await import('./resumen');
    const res = fakeRes();
    await handler(req({ method: 'POST' }), res);
    expect(res.statusCode).toBe(405);
  });
});

describe('GET /api/plataforma/programa', () => {
  const token = async (rol, vigencia = 3600, ahora) => {
    const { emitirToken } = await import('../../../lib/plataforma/jwt');
    return emitirToken('prueba', rol, process.env.PLATAFORMA_JWT_SECRET, vigencia, ahora);
  };
  const llamar = async (headers = {}) => {
    const { default: handler } = await import('./programa');
    const res = fakeRes();
    await handler(req({ headers }), res);
    return res;
  };

  it('401 sin token', async () => {
    expect((await llamar()).statusCode).toBe(401);
  });

  it('403 con rol sin permiso', async () => {
    const res = await llamar({ authorization: `Bearer ${await token('lectura')}` });
    expect(res.statusCode).toBe(403);
  });

  it('200 con rol de gerencia', async () => {
    const res = await llamar({ authorization: `Bearer ${await token('gerencia')}` });
    expect(res.statusCode).toBe(200);
    expect(res.body.rol).toBe('gerencia');
    expect(res.body.certificados.total).toBe(11);
  });

  it('401 con token vencido', async () => {
    const res = await llamar({ authorization: `Bearer ${await token('gerencia', 60, 1000)}` });
    expect(res.statusCode).toBe(401);
  });

  it('503 si el secreto no está configurado', async () => {
    delete process.env.PLATAFORMA_JWT_SECRET;
    const res = await llamar({ authorization: 'Bearer a.b.c' });
    expect(res.statusCode).toBe(503);
  });
});
