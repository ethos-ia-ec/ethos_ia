import type { NextApiRequest, NextApiResponse } from 'next';
import { consultarEstado } from '../../../lib/plataforma/estado';
import { createRateLimiter, getClientIp } from '../../../lib/rateLimit';

const limitada = createRateLimiter({ windowMs: 60_000, max: 30, scope: 'plataforma-estado' });

// Público: informa si la demostración en vivo está disponible. Variables de entorno (opcionales):
// PLATAFORMA_DEMO_URL, PLATAFORMA_DEMO_USUARIO y PLATAFORMA_DEMO_CLAVE (solo credencial pública de solo lectura).
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido.' });
  }
  if (await limitada(getClientIp(req))) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Espera un minuto e intenta de nuevo.' });
  }
  const estado = await consultarEstado({
    url: process.env.PLATAFORMA_DEMO_URL,
    usuario: process.env.PLATAFORMA_DEMO_USUARIO,
    clave: process.env.PLATAFORMA_DEMO_CLAVE,
  });
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
  return res.status(200).json(estado);
}
