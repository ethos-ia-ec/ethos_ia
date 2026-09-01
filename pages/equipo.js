import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ChatWidget from '../components/ChatWidget';

const SITE_URL = 'https://www.ethosia.tech';

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${visible ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

function Mark({ size = 22, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5l8 3.2v6.1c0 5.1-3.4 8.6-8 9.7-4.6-1.1-8-4.6-8-9.7V5.7l8-3.2Z"
        fill={light ? '#2fd8c9' : '#0a0f1a'}
        opacity={light ? 1 : 0.08}
      />
      <path
        d="M12 2.5l8 3.2v6.1c0 5.1-3.4 8.6-8 9.7-4.6-1.1-8-4.6-8-9.7V5.7l8-3.2Z"
        stroke={light ? '#04140a' : '#2fd8c9'}
        strokeWidth="1.3"
      />
      <path d="M8.3 12.1l2.6 2.6 4.8-4.9" stroke={light ? '#04140a' : '#2fd8c9'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function EquipoDirectivo() {
  return (
    <div className="page">
      <Head>
        <title>Dirección General y Técnica — Ethos IA</title>
        <meta
          name="description"
          content="Gobernanza y dirección de Pérez & Herrera S.A.S., la empresa detrás de Ethos IA: origen del ecosistema y perfiles directivos."
        />
        <link rel="canonical" href={`${SITE_URL}/equipo`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ethos IA" />
        <meta property="og:title" content="Dirección General y Técnica — Ethos IA" />
        <meta
          property="og:description"
          content="Gobernanza y dirección de Pérez & Herrera S.A.S., la empresa detrás de Ethos IA."
        />
        <meta property="og:url" content={`${SITE_URL}/equipo`} />
        <meta property="og:locale" content="es_EC" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Dirección General y Técnica — Ethos IA" />
        <meta
          name="twitter:description"
          content="Gobernanza y dirección de Pérez & Herrera S.A.S., la empresa detrás de Ethos IA."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <nav className="nav">
        <Link className="brand" href="/">
          <span className="brand-badge"><Mark size={16} light /></span>
          <span className="brand-name">Ethos IA</span>
        </Link>
        <Link className="nav-back" href="/">← Volver al sitio</Link>
      </nav>

      <header className="hero">
        <span className="eyebrow accent">GOBERNANZA Y DIRECCIÓN</span>
        <h1>Dirección general y técnica de Pérez &amp; Herrera S.A.S.</h1>
        <p className="hero-sub">
          La estructura de gobierno detrás de Ethos IA: origen del ecosistema y los perfiles
          responsables de la dirección legal, financiera y técnica del grupo.
        </p>
      </header>

      <section className="origen">
        <Reveal as="span" className="section-label">ORIGEN DEL ECOSISTEMA</Reveal>
        <Reveal as="p" className="origen-text">
          El origen de Pérez &amp; Herrera S.A.S. es la convergencia de dos disciplinas: la
          ingeniería de software aplicada, con enfoque en arquitectura, ciberseguridad y algoritmos
          de inteligencia artificial, y la economía, con enfoque en gobernanza societaria,
          cumplimiento normativo y estructura financiera. Esa combinación, sostenida durante cinco
          años de trabajo técnico real antes de existir formalmente como sociedad, es lo que hoy
          opera bajo el nombre Pérez &amp; Herrera S.A.S. y su marca Ethos IA.
        </Reveal>
      </section>

      <section className="perfiles">
        <Reveal as="span" className="section-label">PERFILES DIRECTIVOS</Reveal>
        <div className="perfiles-grid">
          <Reveal className="perfil">
            <div className="perfil-role teal">COFUNDADOR Y DIRECTOR TÉCNICO</div>
            <div className="perfil-name">Marlon David Pérez Almachi</div>
            <p>
              Lidera la dirección técnica y el desarrollo de software del grupo. Formación en
              Tecnologías de la Información en la Universidad Estatal de Milagro, con
              certificaciones en ciberseguridad otorgada por Cisco Networking Academy, en
              inteligencia artificial aplicada otorgada por Google for Education, y en cómputo en
              la nube. Especialista en arquitectura de software, ciberseguridad y diseño de
              algoritmos para inteligencia artificial ética.
            </p>
          </Reveal>
          <Reveal className="perfil" style={{ transitionDelay: '90ms' }}>
            <div className="perfil-role gold">CEO Y FUNDADORA</div>
            <div className="perfil-name">Karen Dayane Herrera Ruiz</div>
            <p>
              Formalizó la estructura legal y societaria del grupo, constituyendo Pérez &amp;
              Herrera S.A.S. como Sociedad por Acciones Simplificada. Formación en Economía en la
              Universidad Estatal de Milagro, aplicada al cumplimiento normativo, la gobernanza
              societaria y la estructuración financiera del grupo. Representante legal de la
              compañía.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="cta">
        <Reveal as="p">
          <Link href="/#contacto">Hablar con el equipo directivo →</Link>
        </Reveal>
      </section>

      <footer className="foot">
        <span>Ethos IA es una marca de Pérez &amp; Herrera S.A.S. — Cuenca, Azuay, Ecuador</span>
        <div className="foot-legal">
          <a href="/privacidad.html" target="_blank" rel="noopener">Política de privacidad</a>
          <span>© 2026 Pérez &amp; Herrera S.A.S.</span>
        </div>
      </footer>

      <ChatWidget />

      <style jsx>{`
        :global(html) { scroll-behavior: smooth; }
        :global(body) { background: #eef3f6; }
        .page { font-family: 'IBM Plex Sans', -apple-system, sans-serif; color: #0a0f1a; background: #eef3f6; min-height: 100vh; }
        a { color: #186a63; text-decoration: none; }
        a:hover { color: #2fd8c9; }

        :global(.reveal) { opacity: 0; transform: translateY(22px); transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1); }
        :global(.reveal.in) { opacity: 1; transform: translateY(0); }

        .nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: #0a0f1a; }
        .brand { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border: 1px solid #1d2b42; border-radius: 999px; }
        .brand-badge { width: 22px; height: 22px; border-radius: 50%; background: rgba(47,216,201,0.12); display: flex; align-items: center; justify-content: center; }
        .brand-name { font-family: Georgia, serif; font-size: 15px; font-weight: 600; color: #eef3f6; }
        .nav-back { font-size: 13px; color: #c9d1cc; }
        .nav-back:hover { color: #2fd8c9; }

        .hero { padding: 72px 48px 56px; background: #0a0f1a; color: #eef3f6; }
        .eyebrow { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.18em; color: #2fd8c9; }
        .hero h1 { font-family: Georgia, serif; font-size: clamp(1.8rem, 3.4vw, 2.6rem); line-height: 1.2; font-weight: 600; margin: 16px 0 0; max-width: 22ch; text-wrap: balance; }
        .hero-sub { font-size: 15px; line-height: 1.7; color: #c9d1cc; margin: 20px 0 0; max-width: 60ch; }

        :global(.section-label) { display: block; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.18em; color: #8a9298; margin-bottom: 32px; }

        .origen { padding: 64px 48px; background: #ffffff; display: flex; flex-direction: column; align-items: center; }
        .origen-text { max-width: 640px; text-align: center; font-family: Georgia, serif; font-size: 17px; line-height: 1.7; color: #1a232b; margin: 0; }

        .perfiles { padding: 64px 48px 72px; background: #eef3f6; }
        .perfiles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; max-width: 960px; margin: 0 auto; }
        :global(.perfil) { background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid rgba(10,15,26,0.08); }
        .perfil-role { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; font-weight: 700; margin-bottom: 14px; }
        .perfil-role.teal { color: #186a63; }
        .perfil-role.gold { color: #a87a1e; }
        .perfil-name { font-family: Georgia, serif; font-size: 16px; font-weight: 600; color: #0a0f1a; margin-bottom: 14px; }
        :global(.perfil) p { font-size: 14px; color: #3d474e; line-height: 1.7; margin: 0; }

        .cta { padding: 0 48px 72px; text-align: center; font-weight: 700; font-size: 15px; }

        .foot { background: #060a10; color: #5c7267; padding: 32px 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; }
        .foot-legal { display: flex; gap: 24px; }
        .foot-legal :global(a) { color: #5c7267; }

        @media (max-width: 700px) {
          .perfiles-grid { grid-template-columns: 1fr; }
          .hero, .origen, .perfiles, .cta, .foot { padding-left: 24px; padding-right: 24px; }
        }

        @media (max-width: 480px) {
          .nav { padding: 14px 18px; flex-wrap: wrap; gap: 10px; }
          .hero, .origen, .perfiles, .cta, .foot { padding-left: 18px; padding-right: 18px; }
          .foot { flex-direction: column; align-items: flex-start; }
          :global(.perfil) { padding: 24px; }
        }
      `}</style>
    </div>
  );
}
