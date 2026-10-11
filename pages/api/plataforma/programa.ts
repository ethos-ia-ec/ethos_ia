import type { NextApiRequest, NextApiResponse } from 'next';
import { PROGRAMA_DETALLE } from '../../../lib/plataforma/datos';
import { autorizar } from '../../../lib/plataforma/api';
import { createRateLimiter, getClientIp } from '../../../lib/rateLimit';

const limitada = createRateLimiter({ windowMs: 60_000, max: 30, scope: 'plataforma-programa' });

// Recurso protegido: exige JWT (Authorization: Bearer ...) con rol gerencia o tutoria.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido.' });
  }
  if (await limitada(getClientIp(req))) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Espera un minuto e intenta de nuevo.' });
  }
  const auth = autorizar(req, ['gerencia', 'tutoria']);
  if (!auth.ok) {
    if (auth.status === 401) res.setHeader('WWW-Authenticate', 'Bearer');
    return res.status(auth.status).json({ error: auth.error });
  }
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ solicitadoPor: auth.claims.sub, rol: auth.claims.rol, ...PROGRAMA_DETALLE });
}
