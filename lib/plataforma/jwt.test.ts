import { describe, it, expect } from 'vitest';
import { emitirToken, verificarToken, tieneRol } from './jwt';

const S = 'secreto-de-prueba-solo-para-tests';
const T0 = 1_800_000_000;

describe('jwt HS256', () => {
  it('acepta un token vigente y devuelve sus claims', () => {
    const t = emitirToken('tutora', 'tutoria', S, 600, T0);
    const r = verificarToken(t, S, T0 + 10);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.claims.sub).toBe('tutora');
      expect(r.claims.rol).toBe('tutoria');
    }
  });

  it('rechaza un token vencido', () => {
    const t = emitirToken('x', 'lectura', S, 60, T0);
    expect(verificarToken(t, S, T0 + 61)).toEqual({ ok: false, motivo: 'token-vencido' });
  });

  it('rechaza una firma alterada', () => {
    const t = emitirToken('x', 'lectura', S, 60, T0);
    const [c, p] = t.split('.');
    expect(verificarToken(`${c}.${p}.AAAA`, S, T0)).toEqual({ ok: false, motivo: 'firma-invalida' });
  });

  it('rechaza un token firmado con otro secreto', () => {
    const t = emitirToken('x', 'gerencia', 'otro-secreto', 60, T0);
    expect(verificarToken(t, S, T0).ok).toBe(false);
  });

  it('rechaza alg distinto de HS256 (ataque alg:none)', () => {
    const cab = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const car = Buffer.from(JSON.stringify({ sub: 'x', rol: 'gerencia', iat: T0, exp: T0 + 99 })).toString('base64url');
    expect(verificarToken(`${cab}.${car}.`, S, T0)).toEqual({ ok: false, motivo: 'algoritmo-no-permitido' });
  });

  it('distingue ausencia, formato y servicio sin secreto', () => {
    expect(verificarToken(undefined, S)).toEqual({ ok: false, motivo: 'token-ausente' });
    expect(verificarToken('abc', S)).toEqual({ ok: false, motivo: 'formato-invalido' });
    expect(verificarToken('a.b.c', undefined)).toEqual({ ok: false, motivo: 'servicio-no-configurado' });
  });

  it('autoriza por rol', () => {
    const claims = { sub: 'x', rol: 'lectura' as const, iat: 0, exp: 1 };
    expect(tieneRol(claims, ['gerencia', 'tutoria'])).toBe(false);
    expect(tieneRol({ ...claims, rol: 'tutoria' }, ['gerencia', 'tutoria'])).toBe(true);
  });
});
