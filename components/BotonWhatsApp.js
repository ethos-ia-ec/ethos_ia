import { useRouter } from 'next/router';
import { whatsappLink } from '../lib/contactLinks';
import { WHATSAPP_ACADEMICO } from '../lib/academico';

// Botón flotante de WhatsApp en todo el sitio; en Ethos Académico usa la línea académica.
export default function BotonWhatsApp() {
  const { pathname } = useRouter();
  const academico = pathname.startsWith('/academico');
  // En / y /equipo el chat ocupa la esquina; el botón se apila encima.
  const conChat = pathname === '/' || pathname === '/equipo';
  return (
    <a
      className={`wa ${conChat ? 'alto' : ''}`}
      href={academico ? WHATSAPP_ACADEMICO : whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.3z" />
      </svg>
      <span>WhatsApp</span>
      <style jsx>{`
        .wa { position: fixed; right: 20px; bottom: 20px; z-index: 900; display: inline-flex; align-items: center; gap: 8px;
          min-height: 56px; padding: 0 18px 0 14px; border-radius: 999px; background: #25d366; color: #fff; font-weight: 700;
          font-size: 15px; text-decoration: none; box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28); transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .wa.alto { bottom: 96px; }
        .wa:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(37, 211, 102, 0.45); }
        .wa:focus-visible { outline: 3px solid #04ebff; outline-offset: 3px; }
        @media (max-width: 600px) { .wa { padding: 0; width: 56px; justify-content: center; right: 16px; bottom: 16px; } .wa.alto { bottom: 88px; } .wa span { display: none; } }
        @media print { .wa { display: none; } }
      `}</style>
    </a>
  );
}
