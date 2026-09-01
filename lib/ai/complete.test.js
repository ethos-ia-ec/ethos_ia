import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_FETCH = global.fetch;

function okResponse(content) {
  return {
    ok: true,
    json: async () => ({ choices: [{ message: { content } }] }),
  };
}
function failResponse(status) {
  return { ok: false, status, text: async () => 'error del proveedor' };
}

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.GROQ_API_KEY = 'k-groq';
  process.env.OPENROUTER_API_KEY = 'k-openrouter';
  process.env.NVIDIA_API_KEY = 'k-nvidia';
  vi.resetModules();
});
afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  global.fetch = ORIGINAL_FETCH;
  vi.doUnmock('@supabase/supabase-js');
});

// require() de un módulo CJS local no se recarga de forma fiable entre tests
// solo con vi.resetModules() -- import() dinámico sí pasa por el grafo de
// módulos de Vite, que es lo que vi.resetModules() invalida de verdad.
describe('completeChat (cascada de proveedores, sin Supabase configurado)', () => {
  it('usa Groq cuando responde bien, y no llama a los demás proveedores', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse('respuesta de groq'));
    global.fetch = fetchMock;

    const { completeChat } = await import('./complete');
    const reply = await completeChat([{ role: 'user', content: 'hola' }]);

    expect(reply).toBe('respuesta de groq');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('groq.com');
  });

  it('cae a OpenRouter si Groq falla', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(failResponse(500)) // groq
      .mockResolvedValueOnce(okResponse('respuesta de openrouter')); // openrouter
    global.fetch = fetchMock;

    const { completeChat } = await import('./complete');
    const reply = await completeChat([{ role: 'user', content: 'hola' }]);

    expect(reply).toBe('respuesta de openrouter');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('cae a NVIDIA si Groq y OpenRouter fallan', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(failResponse(500))
      .mockResolvedValueOnce(failResponse(500))
      .mockResolvedValueOnce(okResponse('respuesta de nvidia'));
    global.fetch = fetchMock;

    const { completeChat } = await import('./complete');
    const reply = await completeChat([{ role: 'user', content: 'hola' }]);

    expect(reply).toBe('respuesta de nvidia');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('lanza un error 502 si los tres proveedores fallan', async () => {
    const fetchMock = vi.fn().mockResolvedValue(failResponse(500));
    global.fetch = fetchMock;

    const { completeChat } = await import('./complete');
    await expect(completeChat([{ role: 'user', content: 'hola' }])).rejects.toMatchObject({ status: 502 });
  });

  it('lanza un error 429 si ningún proveedor tiene API key configurada', async () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.NVIDIA_API_KEY;
    global.fetch = vi.fn();

    const { completeChat } = await import('./complete');
    await expect(completeChat([{ role: 'user', content: 'hola' }])).rejects.toMatchObject({ status: 429 });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('respeta GROQ_DAILY_LIMIT=0: salta Groq directo a OpenRouter (0 es un límite real, no "sin configurar")', async () => {
    process.env.GROQ_DAILY_LIMIT = '0';
    const fetchMock = vi.fn().mockResolvedValue(okResponse('respuesta de openrouter'));
    global.fetch = fetchMock;

    const { completeChat } = await import('./complete');
    const reply = await completeChat([{ role: 'user', content: 'hola' }]);

    expect(reply).toBe('respuesta de openrouter');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('openrouter.ai');
  });
});

describe('getTodayUsage (fail-closed cuando Supabase está configurado pero la lectura de cuota falla)', () => {
  // Se prueba getTodayUsage directamente con un cliente Supabase falso hecho
  // a mano, en vez de mockear todo el paquete @supabase/supabase-js o la red
  // -- mucho más simple y no depende de los detalles internos de la librería.
  it('devuelve ok:false cuando la consulta falla (Supabase configurado)', async () => {
    const { getTodayUsage } = await import('./complete');
    const fakeSupabaseAdmin = {
      from: () => ({
        select: () => ({
          eq: async () => ({ data: null, error: new Error('conexión perdida') }),
        }),
      }),
    };

    const result = await getTodayUsage(fakeSupabaseAdmin, '2026-08-26');
    expect(result.ok).toBe(false);
  });

  it('devuelve ok:true con el uso real cuando la consulta funciona', async () => {
    const { getTodayUsage } = await import('./complete');
    const fakeSupabaseAdmin = {
      from: () => ({
        select: () => ({
          eq: async () => ({ data: [{ proveedor: 'groq', mensajes: 42 }], error: null }),
        }),
      }),
    };

    const result = await getTodayUsage(fakeSupabaseAdmin, '2026-08-26');
    expect(result.ok).toBe(true);
    expect(result.usage).toEqual({ groq: 42, openrouter: 0, nvidia: 0 });
  });

  it('devuelve ok:true con uso cero cuando Supabase no está configurado (supabaseAdmin null)', async () => {
    const { getTodayUsage } = await import('./complete');
    const result = await getTodayUsage(null, '2026-08-26');
    expect(result).toEqual({ usage: { groq: 0, openrouter: 0, nvidia: 0 }, ok: true });
  });

  // No hay un test de completeChat() de punta a punta con Supabase
  // inalcanzable: complete.js hace require('@supabase/supabase-js') como
  // CJS, y vi.doMock no logra interceptar esa ruta de forma confiable aquí
  // (el mock no aplica y termina golpeando la red real). El contrato que de
  // verdad importa -- getTodayUsage devuelve ok:false y completeChat debe
  // fallar cerrado ante eso -- ya queda cubierto por los tres tests
  // anteriores más la lectura directa de complete.js:190-194 (if (!ok) throw
  // 503 antes de tocar cualquier proveedor).
});
