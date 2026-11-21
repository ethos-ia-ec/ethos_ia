import Link from 'next/link';
import { REDES_EMPRESA } from '../../lib/seo';
import { WHATSAPP_ACADEMICO } from '../../lib/academico';
import CintaUniversidades from './CintaUniversidades';

// Íconos de marca (trazos simplificados, 24×24).
const ICONOS: Record<string, string> = {
  Facebook: 'M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.2-.6.6-.6z',
  Instagram: 'M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM16.5 2h-9A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h9a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2zm3.6 14.5a3.6 3.6 0 0 1-3.6 3.6h-9a3.6 3.6 0 0 1-3.6-3.6v-9A3.6 3.6 0 0 1 7.5 3.9h9a3.6 3.6 0 0 1 3.6 3.6z',
  TikTok: 'M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2.1-2.8V9.2a6.2 6.2 0 1 0 5.4 6.2V8.6a7.8 7.8 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.7z',
  X: 'M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z',
  YouTube: 'M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15V9l5.8 3z',
  GitHub: 'M12 1.5a10.5 10.5 0 0 0-3.3 20.5c.5.1.7-.2.7-.5v-1.9c-2.9.6-3.5-1.3-3.5-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.7.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.5 1.1 3.1.9.1-.7.4-1.1.7-1.4-2.3-.3-4.8-1.2-4.8-5.2 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.3.1-2.8 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.2 0c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.5.1 2.8.7.7 1.1 1.7 1.1 2.8 0 4-2.5 4.9-4.8 5.2.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10.5 10.5 0 0 0 12 1.5z',
  WhatsApp: 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1 .1-1.2l-.4-.3z',
  Correo: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.3L4.3 7v10h15.4V7zM5.4 7l6.6 4.2L18.6 7z',
};

const NOMBRE_RED = (url: string) =>
  url.includes('facebook') ? 'Facebook' : url.includes('instagram') ? 'Instagram' : url.includes('tiktok') ? 'TikTok'
    : url.includes('youtube') ? 'YouTube' : url.includes('x.com') ? 'X' : url.includes('github') ? 'GitHub' : 'Red social';

// Comunidad en WhatsApp. shortcut: los dos grupos comparten enlace hasta que llegue el de prácticas.
const COMUNIDAD = [
  { href: 'https://whatsapp.com/channel/0029Vb6klJD0QeakhfPvqx0T', texto: 'Seguir el canal' },
  { href: 'https://chat.whatsapp.com/F7sl9MaYMH42WPQ1OgNDN8', texto: 'Grupo de titulación' },
  { href: 'https://chat.whatsapp.com/F7sl9MaYMH42WPQ1OgNDN8', texto: 'Grupo de prácticas preprofesionales' },
];

const ENLACES = [
  ...REDES_EMPRESA.map((u: string) => ({ href: u, nombre: NOMBRE_RED(u) })),
  { href: WHATSAPP_ACADEMICO, nombre: 'WhatsApp' },
  { href: 'mailto:ethos.ia.ec@gmail.com', nombre: 'Correo' },
];

// Pie de las páginas de Ethos Académico: secciones, contacto y redes oficiales de la empresa.
export default function PieAcademico() {
  return (
    <>
    <CintaUniversidades />
    <footer className="pie">
      <div className="rej">
        <div>
          <p className="marca">Ethos <span>Académico</span></p>
          <p className="txt">División de investigación científica de Ethos IA. Formación, asesoría y acompañamiento con rigor y ética.</p>
          <ul className="redes">
            {ENLACES.map((e) => (
              <li key={e.href}>
                <a href={e.href} target={e.nombre === 'Correo' ? undefined : '_blank'} rel="noopener noreferrer" aria-label={e.nombre} title={e.nombre}>
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d={ICONOS[e.nombre]} /></svg>
                </a>
              </li>
            ))}
          </ul>
          <ul className="comunidad" aria-label="Comunidad en WhatsApp">
            {COMUNIDAD.map((c) => (
              <li key={c.texto}>
                <a href={c.href} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d={ICONOS.WhatsApp} /></svg>
                  {c.texto}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Ethos Académico">
          <h2>Académico</h2>
          <ul>
            <li><Link href="/academico#areas">Áreas</Link></li>
            <li><Link href="/academico#metodo">Método</Link></li>
            <li><Link href="/academico/portafolio">Portafolio</Link></li>
            <li><Link href="/academico/equipo">Equipo</Link></li>
            <li><Link href="/academia">Kit abierto</Link></li>
          </ul>
        </nav>
        <div>
          <h2>Contacto</h2>
          <ul>
            <li><a href={WHATSAPP_ACADEMICO} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href="mailto:ethos.ia.ec@gmail.com">ethos.ia.ec@gmail.com</a></li>
            <li><Link href="/">Ethos IA</Link></li>
            <li><Link href="/privacidad">Política de privacidad (LOPDP)</Link></li>
            <li><Link href="/terminos">Términos y condiciones</Link></li>
          </ul>
        </div>
      </div>
      <div className="legal">
        <span>Ethos IA es una marca de ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador</span>
        <span>© 2026 ETHOSLAB S.A.S.</span>
      </div>

      <style jsx>{`
        .pie { background: var(--c-azul-profundo); color: var(--c-apagado); padding: 64px var(--gutter) 28px; font-size: 14px; }
        .rej { max-width: var(--ancho-max); margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 40px; }
        .marca { font-size: 22px; font-weight: 700; color: var(--c-claro); margin: 0 0 10px; }
        .marca span { color: var(--c-cian); }
        .txt { line-height: 1.7; max-width: 40ch; margin: 0; }
        h2 { font: 700 12px/1 var(--f-mono); letter-spacing: 0.16em; text-transform: uppercase; color: var(--c-claro); margin: 0 0 16px; }
        ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 2px; }
        .pie :global(a) { display: inline-flex; align-items: center; min-height: 44px; color: var(--c-apagado); text-decoration: none; overflow-wrap: anywhere; transition: color var(--d-rapida), border-color var(--d-rapida); }
        .pie :global(a:focus-visible) { outline: 2px solid var(--c-cian); outline-offset: 2px; border-radius: 6px; }
        .pie :global(a:hover) { color: var(--c-cian); }
        .redes { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
        .redes { gap: 10px; }
        .comunidad { display: grid; gap: 8px; margin-top: 18px; }
        .comunidad a { gap: 10px; padding: 0 16px; border-radius: var(--r-pill); background: rgba(37, 211, 102, 0.12); border: 1px solid rgba(37, 211, 102, 0.35); color: var(--c-claro); font-weight: 600; }
        .comunidad a:hover { background: #25d366; color: #05111e; }
        .redes a { justify-content: center; width: 44px; height: 44px; border: 1px solid var(--c-azul-3); border-radius: 50%; color: var(--c-claro); }
        .redes a:hover { border-color: var(--c-cian); color: var(--c-azul); background: var(--c-cian); transform: translateY(-2px); }
        .legal { max-width: var(--ancho-max); margin: 44px auto 0; padding-top: 20px; border-top: 1px solid var(--c-azul-3); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 12px; }
        @media (max-width: 760px) { .rej { grid-template-columns: 1fr; gap: 28px; } }
        @media (min-width: 1920px) { .pie { font-size: 16px; } .rej, .legal { max-width: 1560px; } .marca { font-size: 26px; } }
        @media (min-width: 2560px) { .pie { font-size: 19px; } .rej, .legal { max-width: 2080px; } .marca { font-size: 32px; } h2 { font-size: 15px; } .legal { font-size: 15px; } }
      `}</style>
    </footer>
    </>
  );
}
