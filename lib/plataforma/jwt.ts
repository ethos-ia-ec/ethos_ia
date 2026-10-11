// JWT HS256 mínimo con el módulo crypto de Node (sin dependencias nuevas).
// Autenticación: el token firmado prueba quién llama. Autorización: el claim
// "rol" decide qué recurso puede leer (ver pages/api/plataforma/programa.ts).
import crypto from 'crypto';

export type Rol = 'gerencia' | 'tutoria' | 'lectura';

export interface Claims {
  sub: string;
  rol: Rol;
  iat: number;
  exp: number;
}

const ROLES: Rol[] = ['gerencia', 'tutoria', 'lectura'];

const b64 = (b: Buffer | string): string => Buffer.from(b).toString('base64url');
const firmar = (datos: string, secreto: string): string =>
  crypto.createHmac('sha256', secreto).update(datos).digest('base64url');

export function emitirToken(
  sub: string,
  rol: Rol,
  secreto: string,
  vigenciaSeg = 3600,
  ahora = Math.floor(Date.now() / 1000)
): string {
  if (!secreto) throw new Error('Secreto JWT requerido');
  const cabecera = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const carga = b64(JSON.stringify({ sub, rol, iat: ahora, exp: ahora + vigenciaSeg }));
  return `${cabecera}.${carga}.${firmar(`${cabecera}.${carga}`, secreto)}`;
}

export type Resultado = { ok: true; claims: Claims } | { ok: false; motivo: string };

export function verificarToken(
  token: string | undefined,
  secreto: string | undefined,
  ahora = Math.floor(Date.now() / 1000)
): Resultado {
  if (!secreto) return { ok: false, motivo: 'servicio-no-configurado' };
  if (!token) return { ok: false, motivo: 'token-ausente' };
  const partes = token.split('.');
  if (partes.length !== 3) return { ok: false, motivo: 'formato-invalido' };
  const [c, p, f] = partes;

  try {
    const cab = JSON.parse(Buffer.from(c, 'base64url').toString('utf8'));
    if (cab.alg !== 'HS256') return { ok: false, motivo: 'algoritmo-no-permitido' };
  } catch {
    return { ok: false, motivo: 'formato-invalido' };
  }

  const esperada = Buffer.from(firmar(`${c}.${p}`, secreto));
  const recibida = Buffer.from(f);
  if (esperada.length !== recibida.length || !crypto.timingSafeEqual(esperada, recibida)) {
    return { ok: false, motivo: 'firma-invalida' };
  }

  try {
    const claims = JSON.parse(Buffer.from(p, 'base64url').toString('utf8')) as Claims;
    if (typeof claims.exp !== 'number' || claims.exp <= ahora) return { ok: false, motivo: 'token-vencido' };
    if (!ROLES.includes(claims.rol)) return { ok: false, motivo: 'rol-invalido' };
    return { ok: true, claims };
  } catch {
    return { ok: false, motivo: 'formato-invalido' };
  }
}

export function tieneRol(claims: Claims, permitidos: Rol[]): boolean {
  return permitidos.includes(claims.rol);
}
