// Distingue tráfico del bot de WhatsApp (u otro servicio interno de confianza)
// del tráfico público anónimo del widget de chat del navegador.
//
// No es un control de acceso duro: /api/join y /api/empresa-chat siguen siendo
// públicos a propósito (el widget del sitio los llama desde el navegador, sin
// forma de guardar un secreto ahí sin exponerlo). Lo que sí resuelve: el bot
// deja de compartir el mismo cupo de rate limit por IP que el resto del
// tráfico público (antes, todas las conversaciones de WhatsApp entraban por
// la misma IP del servidor del bot y competían por un solo cupo), y deja una
// señal clara en los logs de qué tráfico es del bot.
//
// Si INTERNAL_API_KEY no está configurada, isInternalRequest siempre devuelve
// false -- el comportamiento por defecto es exactamente el de antes.

const crypto = require('crypto');

function isInternalRequest(req) {
  const expected = process.env.INTERNAL_API_KEY;
  if (!expected) return false;

  const provided = req.headers['x-internal-key'];
  if (!provided || typeof provided !== 'string') return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = { isInternalRequest };
