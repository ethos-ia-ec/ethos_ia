import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ResumenSchema, firmaValida } from '../../../lib/seguridad/resumen';
import { createRateLimiter, getClientIp } from '../../../lib/rateLimit';

// El cuerpo se lee en crudo para verificar la firma sobre los bytes exactos que envió el colector.
export const config = { api: { bodyParser: false } };

const limitada = createRateLimiter({ windowMs: 60_000, max: 6, scope: 'seguridad-reporte' });
const MAX_BYTES = 200_000;

function leerCuerpo(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let datos = '';
    req.setEncoding('utf8');
    req.on('data', (c: string) => {
      datos += c;
      if (datos.length > MAX_BYTES) reject(new Error('demasiado-grande'));
    });
    req.on('end', () => resolve(datos));
    req.on('error', reject);
  });
}

// Recibe el resumen del colector local (seguridad/colector). Autenticación: HMAC-SHA256 del cuerpo
// con SECMON_INGEST_KEY, en la cabecera X-SecMon-Firma.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }
  if (await limitada(getClientIp(req))) {
    return res.status(429).json({ error: 'Demasiadas solicitudes.' });
  }
  const clave = process.env.SECMON_INGEST_KEY;
  if (!clave) return res.status(503).json({ error: 'El panel de seguridad no está configurado.' });

  let cuerpo: string;
  try {
    cuerpo = await leerCuerpo(req);
  } catch {
    return res.status(413).json({ error: 'Cuerpo demasiado grande.' });
  }
  const firma = req.headers['x-secmon-firma'];
  if (!firmaValida(cuerpo, typeof firma === 'string' ? firma : undefined, clave)) {
    return res.status(401).json({ error: 'Firma inválida.' });
  }

  let json: unknown;
  try {
    json = JSON.parse(cuerpo);
  } catch {
    return res.status(400).json({ error: 'JSON inválido.' });
  }
  const r = ResumenSchema.safeParse(json);
  if (!r.success) return res.status(400).json({ error: 'Resumen con formato inválido.' });

  const url = process.env.SUPABASE_URL; const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return res.status(503).json({ error: 'Base de datos no configurada.' });
  const sb = createClient(url, service, { auth: { persistSession: false } });
  const { error } = await sb.from('seguridad_resumen').insert({ dominio: r.data.dominio, generado: r.data.generado, datos: r.data });
  if (error) {
    console.error('[seguridad/reporte] no se pudo guardar:', error.message);
    return res.status(500).json({ error: 'No se pudo guardar el resumen.' });
  }
  return res.status(201).json({ ok: true });
}
