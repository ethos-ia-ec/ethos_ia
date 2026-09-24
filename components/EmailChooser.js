import { useEffect, useRef, useState } from 'react';
import { COMPANY_EMAIL, mailtoLink, gmailComposeLink, outlookComposeLink } from '../lib/contactLinks';

// Botón de correo que se adapta al dispositivo. En teléfonos y tabletas deja
// actuar al enlace mailto (abre Gmail, Mail u Outlook con el mensaje ya
// escrito). En escritorio no hay forma de saber si la persona usa una app de
// correo o solo el navegador, así que abre un menú con Gmail, Outlook web, la
// app de correo y "Copiar dirección".
//
// El botón lo dibuja quien usa el componente (render prop): así conserva los
// estilos con alcance (styled-jsx) de su propia página.

const POPOVER_WIDTH = 232;

function isMobileDevice() {
  const ua = navigator.userAgent || '';
  // iPadOS se presenta como "Macintosh", pero con pantalla táctil.
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

export default function EmailChooser({ children }) {
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState('left');
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const onTriggerClick = (e) => {
    if (isMobileDevice()) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setAlign(rect.left + POPOVER_WIDTH > window.innerWidth - 16 ? 'right' : 'left');
    setCopied(false);
    setOpen((v) => !v);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(COMPANY_EMAIL);
      setCopied(true);
    } catch {
      // Sin permiso de portapapeles: la dirección sigue visible en el menú.
    }
  };

  const close = () => setOpen(false);

  return (
    <span className="email-chooser" ref={wrapRef}>
      {children({
        href: mailtoLink,
        onClick: onTriggerClick,
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
      })}
      {open && (
        <span className={`email-pop ${align}`} role="dialog" aria-label="Elige cómo escribirnos">
          <span className="pop-title">Escríbenos a</span>
          <span className="pop-email">{COMPANY_EMAIL}</span>
          <a href={gmailComposeLink} target="_blank" rel="noopener noreferrer" onClick={close}>Abrir en Gmail</a>
          <a href={outlookComposeLink} target="_blank" rel="noopener noreferrer" onClick={close}>Abrir en Outlook</a>
          <a href={mailtoLink} onClick={close}>Aplicación de correo</a>
          <button type="button" onClick={copyAddress}>{copied ? 'Dirección copiada ✓' : 'Copiar dirección'}</button>
        </span>
      )}

      <style jsx>{`
        .email-chooser { position: relative; display: inline-flex; }
        .email-pop {
          position: absolute; bottom: calc(100% + 10px); z-index: 40;
          width: ${POPOVER_WIDTH}px; box-sizing: border-box; padding: 12px;
          display: flex; flex-direction: column; gap: 2px; text-align: left;
          background: #05111e; border: 1px solid #123048; border-radius: 12px;
          box-shadow: 0 18px 40px rgba(0, 8, 28, 0.45);
          font-family: var(--font-brand), sans-serif;
        }
        .email-pop.left { left: 0; }
        .email-pop.right { right: 0; }
        .pop-title { font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: #93aabb; padding: 2px 8px 0; }
        .pop-email { font-size: 13px; color: #04ebff; padding: 2px 8px 8px; border-bottom: 1px solid #123048; margin-bottom: 4px; word-break: break-all; }
        .email-pop a, .email-pop button {
          display: block; width: 100%; box-sizing: border-box; padding: 8px; border-radius: 8px;
          font: inherit; font-size: 13px; color: #eaf2f8; text-decoration: none; text-align: left;
          background: none; border: none; cursor: pointer;
        }
        .email-pop a:hover, .email-pop button:hover, .email-pop a:focus-visible, .email-pop button:focus-visible {
          background: rgba(4, 235, 255, 0.1); color: #04ebff; outline: none;
        }
      `}</style>
    </span>
  );
}
