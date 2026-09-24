import { describe, it, expect } from 'vitest';

const {
  COMPANY_EMAIL,
  WHATSAPP_MESSAGE,
  EMAIL_SUBJECT,
  EMAIL_BODY,
  whatsappLink,
  mailtoLink,
  gmailComposeLink,
  outlookComposeLink,
} = require('./contactLinks');

describe('contactLinks', () => {
  it('whatsappLink usa wa.me con el número sin "+" y el mensaje predeterminado', () => {
    const url = new URL(whatsappLink);
    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/593986023149');
    expect(url.searchParams.get('text')).toBe(WHATSAPP_MESSAGE);
  });

  it('mailtoLink codifica espacios como %20 (no "+") y conserva asunto y cuerpo', () => {
    expect(mailtoLink.startsWith(`mailto:${COMPANY_EMAIL}?`)).toBe(true);
    expect(mailtoLink).not.toContain('+');
    const query = new URLSearchParams(mailtoLink.split('?')[1]);
    expect(query.get('subject')).toBe(EMAIL_SUBJECT);
    expect(query.get('body')).toBe(EMAIL_BODY);
  });

  it('los enlaces de Gmail y Outlook web llevan destinatario, asunto y cuerpo', () => {
    const gmail = new URL(gmailComposeLink);
    expect(gmail.searchParams.get('to')).toBe(COMPANY_EMAIL);
    expect(gmail.searchParams.get('su')).toBe(EMAIL_SUBJECT);
    expect(gmail.searchParams.get('body')).toBe(EMAIL_BODY);

    const outlook = new URL(outlookComposeLink);
    expect(outlook.searchParams.get('to')).toBe(COMPANY_EMAIL);
    expect(outlook.searchParams.get('subject')).toBe(EMAIL_SUBJECT);
    expect(outlook.searchParams.get('body')).toBe(EMAIL_BODY);
  });
});
