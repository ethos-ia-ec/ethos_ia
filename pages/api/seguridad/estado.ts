import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { autorizar } from '../../../lib/plataforma/api';
import { puntaje } from '../../../lib/seguridad/resumen';
import { createRateLimiter, getClientIp } from '../../../lib/rateLimit';

const limitada = createRateLimiter({ windowMs: 60_000, max: 30, scope: 'seguridad-estado' });

// Recurso protegido: último resumen de seguridad del sitio. Exige JWT con rol gerencia.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido.' });
  }
  if (await limitada(getClientIp(req))) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Espera un minuto e intenta de nuevo.' });
  }
  const auth = autorizar(req, ['gerencia']);
  if (!auth.ok) {
    if (auth.status === 401) res.setHeader('WWW-Authenticate', 'Bearer');
    return res.status(auth.status).json({ error: auth.error });
  }
  res.setHeader('Cache-Control', 'no-store');

  const url = process.env.SUPABASE_URL; const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return res.status(503).json({ error: 'Base de datos no configurada.' });
  const sb = createClient(url, service, { auth: { persistSession: false } });
  const { data, error } = await sb.from('seguridad_resumen').select('datos, recibido').order('recibido', { ascending: false }).limit(48);
  if (error) return res.status(500).json({ error: 'No se pudo leer el resumen.' });
  if (!data || !data.length) return res.status(200).json({ vacio: true });

  const historial = data.map((f) => ({ fecha: f.recibido, puntaje: puntaje(f.datos) })).reverse();
  return res.status(200).json({ ...data[0].datos, recibido: data[0].recibido, puntaje: puntaje(data[0].datos), historial });
}
