import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

// Sin SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY configuradas, createRateLimiter
// siempre cae al limitador en memoria -- es la pieza de lógica que de verdad
// importa probar aislada (la sliding window y el umbral), la parte de
// Supabase ya es la librería oficial haciendo su trabajo.
beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  vi.resetModules();
});
afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('createRateLimiter (fallback en memoria)', () => {
  it('permite hasta `max` solicitudes dentro de la ventana', async () => {
    const { createRateLimiter } = require('./rateLimit');
    const isRateLimited = createRateLimiter({ windowMs: 60_000, max: 3, scope: 'test-a' });

    expect(await isRateLimited('1.2.3.4')).toBe(false); // 1ra
    expect(await isRateLimited('1.2.3.4')).toBe(false); // 2da
    expect(await isRateLimited('1.2.3.4')).toBe(false); // 3ra
    expect(await isRateLimited('1.2.3.4')).toBe(true); // 4ta -- ya se pasó
  });

  it('cada IP tiene su propio cupo, independiente de las demás', async () => {
    const { createRateLimiter } = require('./rateLimit');
    const isRateLimited = createRateLimiter({ windowMs: 60_000, max: 1, scope: 'test-b' });

    expect(await isRateLimited('1.1.1.1')).toBe(false);
    expect(await isRateLimited('1.1.1.1')).toBe(true); // 1.1.1.1 ya se pasó
    expect(await isRateLimited('2.2.2.2')).toBe(false); // 2.2.2.2 sigue con cupo
  });

  it('deja pasar de nuevo una vez que la ventana expira', async () => {
    vi.useFakeTimers();
    const { createRateLimiter } = require('./rateLimit');
    const isRateLimited = createRateLimiter({ windowMs: 1000, max: 1, scope: 'test-c' });

    expect(await isRateLimited('3.3.3.3')).toBe(false);
    expect(await isRateLimited('3.3.3.3')).toBe(true);

    vi.advanceTimersByTime(1001);

    expect(await isRateLimited('3.3.3.3')).toBe(false);
    vi.useRealTimers();
  });
});

describe('getClientIp', () => {
  it('usa el primer valor de X-Forwarded-For si está presente', () => {
    const { getClientIp } = require('./rateLimit');
    const req = { headers: { 'x-forwarded-for': '9.9.9.9, 10.10.10.10' }, socket: {} };
    expect(getClientIp(req)).toBe('9.9.9.9');
  });

  it('cae a socket.remoteAddress si no hay X-Forwarded-For', () => {
    const { getClientIp } = require('./rateLimit');
    const req = { headers: {}, socket: { remoteAddress: '8.8.8.8' } };
    expect(getClientIp(req)).toBe('8.8.8.8');
  });

  it('devuelve "unknown" si no hay ninguna de las dos', () => {
    const { getClientIp } = require('./rateLimit');
    const req = { headers: {}, socket: {} };
    expect(getClientIp(req)).toBe('unknown');
  });
});
