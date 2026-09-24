// Canales directos de la empresa (WhatsApp y correo) con un mensaje ya
// redactado, para que quien haga clic solo tenga que pulsar "Enviar".
//
// WhatsApp: wa.me es el enlace universal oficial. En el teléfono abre la app
// instalada (WhatsApp o WhatsApp Business; en Android, si hay ambas, el
// sistema pregunta cuál usar). En computadora (Windows, macOS, Linux) muestra
// la página de WhatsApp que ofrece abrir la app de escritorio o WhatsApp Web.
//
// Correo: mailto abre la app de correo predeterminada (Gmail o Mail en el
// teléfono, Outlook o Mail en escritorio). Quien usa el correo solo desde el
// navegador no tiene una app asociada a mailto, por eso en escritorio el
// sitio ofrece además los enlaces de redacción de Gmail y Outlook web.

const WHATSAPP_NUMBER = '593986023149';
const COMPANY_EMAIL = 'ethos.ia.ec@gmail.com';

const WHATSAPP_MESSAGE =
  'Hola, Ethos IA. Visité su sitio web y me gustaría recibir información sobre sus servicios de inteligencia artificial para mi empresa.';

const EMAIL_SUBJECT = 'Solicitud de información — Ethos IA';

const EMAIL_BODY = [
  'Hola, equipo de Ethos IA:',
  '',
  'Visité su sitio web y me gustaría recibir información sobre sus servicios de inteligencia artificial para mi empresa.',
  '',
  'Nombre:',
  'Empresa:',
  'Teléfono:',
  '',
  'Quedo a la espera de su respuesta.',
  '',
  'Saludos cordiales.',
].join('\r\n');

// encodeURIComponent (no URLSearchParams): mailto necesita los espacios como
// %20 -- con "+" varias apps de correo muestran los signos literalmente.
const enc = encodeURIComponent;

const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${enc(WHATSAPP_MESSAGE)}`;
const mailtoLink = `mailto:${COMPANY_EMAIL}?subject=${enc(EMAIL_SUBJECT)}&body=${enc(EMAIL_BODY)}`;
const gmailComposeLink =
  `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(COMPANY_EMAIL)}&su=${enc(EMAIL_SUBJECT)}&body=${enc(EMAIL_BODY)}`;
const outlookComposeLink =
  `https://outlook.live.com/mail/0/deeplink/compose?to=${enc(COMPANY_EMAIL)}&subject=${enc(EMAIL_SUBJECT)}&body=${enc(EMAIL_BODY)}`;

module.exports = {
  WHATSAPP_NUMBER,
  COMPANY_EMAIL,
  WHATSAPP_MESSAGE,
  EMAIL_SUBJECT,
  EMAIL_BODY,
  whatsappLink,
  mailtoLink,
  gmailComposeLink,
  outlookComposeLink,
};
