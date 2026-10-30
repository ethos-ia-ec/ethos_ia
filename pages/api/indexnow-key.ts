import type { NextApiRequest, NextApiResponse } from 'next';

// Archivo de verificación de IndexNow: los buscadores lo leen para confirmar que el aviso viene del dueño del sitio.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const clave = process.env.INDEXNOW_KEY;
  if (!clave) return res.status(404).end();
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  return res.status(200).send(clave);
}
