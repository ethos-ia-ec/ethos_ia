import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { createRateLimiter, getClientIp } from '../../lib/rateLimit';
import { isInternalRequest } from '../../lib/internalAuth';

const BodySchema = z.object({
  nombre: z.string().trim().min(1).max(120),
  correo: z.string().trim().email().max(200),
  // Sin .min(1): es un campo opcional con default '' -- con .min(1) el
  // propio valor por defecto (una vez sustituido) queda validado contra esa
  // regla y siempre rechazaba con 400 cualquier envío sin área seleccionada,
  // aunque el campo está pensado para poder venir vacío. Bug real detectado
  // al escribir las pruebas de este endpoint.
  area: z.string().trim().max(80).optional().default(''),
  mensaje: z.string().trim().max(1000).optional().default(''),
  consentimiento: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar la Política de Tratamiento de Datos Personales.' }),
  }),
});

// Bucket público (por IP) y bucket del bot de WhatsApp por separado -- así el
// tráfico real de WhatsApp (que siempre llega desde la misma IP del bot) no
// se queda sin cupo compartiéndolo con el resto de visitantes anónimos.
const isRateLimitedPublic = createRateLimiter({ windowMs: 60_000, max: 5, scope: 'join' });
const isRateLimitedBot = createRateLimiter({ windowMs: 60_000, max: 20, scope: 'join-bot' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const fromBot = isInternalRequest(req);
  const limited = fromBot ? await isRateLimitedBot('bot') : await isRateLimitedPublic(getClientIp(req));
  if (limited) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Espera un minuto e intenta de nuevo.' });
  }

  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Solicitud inválida.';
    return res.status(400).json({ error: message });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no configuradas en el entorno.');
    return res.status(500).json({ error: 'El formulario no está disponible todavía. Vuelve pronto.' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { nombre, correo, area, mensaje, consentimiento } = parsed.data;

  const { error } = await supabaseAdmin.from('solicitudes').insert({
    nombre,
    correo,
    area_interes: area,
    mensaje,
    consentimiento,
  });

  if (error) {
    console.error('Error insertando solicitud en Supabase', error);
    return res.status(502).json({ error: 'No pudimos guardar tu solicitud. Intenta de nuevo en un momento.' });
  }

  return res.status(200).json({ ok: true });
}
