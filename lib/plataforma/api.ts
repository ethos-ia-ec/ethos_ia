// Utilidades compartidas por las rutas /api/plataforma/*.
import type { NextApiRequest } from 'next';
import { verificarToken, tieneRol, type Claims, type Rol } from './jwt';

export type Autorizacion =
  | { ok: true; claims: Claims }
  | { ok: false; status: 401 | 403 | 503; error: string };

export function autorizar(req: NextApiRequest, permitidos: Rol[]): Autorizacion {
  const cab = req.headers.authorization;
  const token = typeof cab === 'string' && cab.startsWith('Bearer ') ? cab.slice(7).trim() : undefined;
  const r = verificarToken(token, process.env.PLATAFORMA_JWT_SECRET);
  if (!r.ok) {
    if (r.motivo === 'servicio-no-configurado') {
      return { ok: false, status: 503, error: 'El servicio de autenticación no está configurado.' };
    }
    return { ok: false, status: 401, error: 'Token ausente o inválido.' };
  }
  if (!tieneRol(r.claims, permitidos)) {
    return { ok: false, status: 403, error: 'Tu rol no permite consultar este recurso.' };
  }
  return { ok: true, claims: r.claims };
}
