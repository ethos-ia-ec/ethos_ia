import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

function fakeRes() {
  const res = {};
  res.statusCode = 200;
  res.status = vi.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = vi.fn((body) => {
    res.body = body;
    return res;
  });
  res.setHeader = vi.fn();
  return res;
}

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  process.env.SUPABASE_URL = 'https://fake.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'fake-key';
  vi.resetModules();
});
afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.doUnmock('@supabase/supabase-js');
});

// join.js llama a createClient() dos veces distintas: una vez para insertar
// en "solicitudes" (dentro del propio handler) y otra, indirectamente, vía
// lib/rateLimit.js -> increment_rate_limit (RPC). Si solo se mockea la
// primera, la segunda intenta una llamada de red real a la URL falsa y el
// test se vuelve lento/errático (DNS ENOTFOUND). Este mock cubre ambas: el
// contador del RPC vive en un Map en memoria, imitando el comportamiento
// real de increment_rate_limit (incrementa y devuelve true si se pasó del máximo).
function mockSupabase({ insertResult = { error: null } } = {}) {
  const counts = new Map();
  vi.doMock('@supabase/supabase-js', () => ({
    createClient: () => ({
      from: () => ({ insert: async () => insertResult }),
      rpc: async (_fnName, { p_key, p_max }) => {
        const n = (counts.get(p_key) || 0) + 1;
        counts.set(p_key, n);
        return { data: n > p_max, error: null };
      },
    }),
  }));
}

describe('POST /api/join', () => {
  it('rechaza métodos que no sean POST', async () => {
    mockSupabase();
    const handler = (await import('./join')).default;
    const req = { method: 'GET' };
    const res = fakeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });

  it('rechaza un body inválido (correo mal formado)', async () => {
    mockSupabase();
    const handler = (await import('./join')).default;
    const req = {
      method: 'POST',
      headers: {},
      body: { nombre: 'Ana', correo: 'no-es-un-correo', consentimiento: true },
    };
    const res = fakeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('rechaza si no se acepta el consentimiento', async () => {
    mockSupabase();
    const handler = (await import('./join')).default;
    const req = {
      method: 'POST',
      headers: {},
      body: { nombre: 'Ana', correo: 'ana@example.com', consentimiento: false },
    };
    const res = fakeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('acepta un body válido y guarda el lead', async () => {
    mockSupabase();
    const handler = (await import('./join')).default;
    const req = {
      method: 'POST',
      headers: {},
      body: { nombre: 'Ana', correo: 'ana@example.com', area: 'Software a medida', mensaje: 'hola', consentimiento: true },
    };
    const res = fakeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('responde 502 si Supabase falla al insertar', async () => {
    mockSupabase({ insertResult: { error: new Error('boom') } });
    const handler = (await import('./join')).default;
    const req = {
      method: 'POST',
      headers: {},
      body: { nombre: 'Ana', correo: 'ana@example.com', consentimiento: true },
    };
    const res = fakeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(502);
  });

  it('corta con 429 después de superar el límite por IP', async () => {
    mockSupabase();
    const handler = (await import('./join')).default;
    const validBody = { nombre: 'Ana', correo: 'ana@example.com', consentimiento: true };

    for (let i = 0; i < 5; i += 1) {
      const res = fakeRes();
      await handler({ method: 'POST', headers: {}, body: validBody }, res);
      expect(res.statusCode).toBe(200);
    }

    const res6 = fakeRes();
    await handler({ method: 'POST', headers: {}, body: validBody }, res6);
    expect(res6.statusCode).toBe(429);
  });
});
