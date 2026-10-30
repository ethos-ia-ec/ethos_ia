import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Revalidación bajo demanda: solo un editor o admin con sesión válida puede pedirla.
// Regenera el listado, la nota y los sitemaps, y avisa a los buscadores compatibles con IndexNow.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const token = (req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  const slug = typeof req.body?.slug === 'string' ? req.body.slug : '';
  if (!token || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return res.status(400).json({ error: 'Solicitud no válida' });

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return res.status(500).json({ error: 'Supabase no configurado' });

  // El rol se consulta con el token del propio usuario: la función rol_prensa() lee auth.uid().
  const usuario = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
  const { data: rol } = await usuario.rpc('rol_prensa');
  if (rol !== 'editor' && rol !== 'admin') return res.status(403).json({ error: 'Solo un editor puede publicar' });

  const rutas = ['/noticias', `/noticias/${slug}`];
  await Promise.all(rutas.map((r) => res.revalidate(r).catch(() => undefined)));

  const clave = process.env.INDEXNOW_KEY;
  const sitio = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ethosia.tech';
  if (clave) {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: new URL(sitio).host, key: clave, keyLocation: `${sitio}/api/indexnow-key`, urlList: rutas.map((r) => `${sitio}${r}`) }),
    }).catch(() => undefined);
  }
  return res.status(200).json({ revalidadas: rutas });
}
