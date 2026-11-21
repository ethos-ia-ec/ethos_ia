import Link from 'next/link';
import { REDES_EMPRESA } from '../../lib/seo';
import { WHATSAPP_ACADEMICO } from '../../lib/academico';

const NOMBRE_RED = (url: string) =>
  url.includes('facebook') ? 'Facebook' : url.includes('instagram') ? 'Instagram' : url.includes('tiktok') ? 'TikTok'
    : url.includes('youtube') ? 'YouTube' : url.includes('x.com') ? 'X' : url.includes('github') ? 'GitHub' : 'Red social';

// Pie de las páginas de Ethos Académico: secciones, contacto y redes oficiales de la empresa.
export default function PieAcademico() {
  return (
    <footer className="pie">
      <div className="rej">
        <div>
          <p className="marca">Ethos <span>Académico</span></p>
          <p className="txt">División de investigación científica de Ethos IA. Formación, asesoría y acompañamiento con rigor y ética.</p>
          <ul className="redes">
            {REDES_EMPRESA.map((u: string) => (
              <li key={u}><a href={u} target="_blank" rel="noopener noreferrer">{NOMBRE_RED(u)}</a></li>
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
        ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 9px; }
        .pie :global(a) { color: var(--c-apagado); text-decoration: none; }
        .pie :global(a:hover) { color: var(--c-cian); }
        .redes { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
        .redes a { display: inline-block; padding: 7px 13px; border: 1px solid var(--c-azul-3); border-radius: var(--r-pill); font-size: 12px; }
        .redes a:hover { border-color: var(--c-cian); }
        .legal { max-width: var(--ancho-max); margin: 44px auto 0; padding-top: 20px; border-top: 1px solid var(--c-azul-3); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 12px; }
        @media (max-width: 760px) { .rej { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  );
}
