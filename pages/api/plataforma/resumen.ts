import type { NextApiRequest, NextApiResponse } from 'next';
import { RESUMEN } from '../../../lib/plataforma/datos';
import { createRateLimiter, getClientIp } from '../../../lib/rateLimit';

const limitada = createRateLimiter({ windowMs: 60_000, max: 60, scope: 'plataforma-resumen' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido.' });
  }
  if (await limitada(getClientIp(req))) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Espera un minuto e intenta de nuevo.' });
  }
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  return res.status(200).json(RESUMEN);
}
