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

export default function EquipoDirectivo() {
  return (
    <div className="page">
      <Head>
        <title>Dirección General y Técnica — Ethos IA</title>
        <meta
          name="description"
          content="Gobernanza y dirección de ETHOSLAB S.A.S., la empresa detrás de Ethos IA: origen del ecosistema y perfiles directivos."
        />
        <link rel="canonical" href={`${SITE_URL}/equipo`} />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ethos IA" />
        <meta property="og:title" content="Dirección General y Técnica — Ethos IA" />
        <meta
          property="og:description"
          content="Gobernanza y dirección de ETHOSLAB S.A.S., la empresa detrás de Ethos IA."
        />
        <meta property="og:url" content={`${SITE_URL}/equipo`} />
        <meta property="og:locale" content="es_EC" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Dirección General y Técnica — Ethos IA" />
        <meta
          name="twitter:description"
          content="Gobernanza y dirección de ETHOSLAB S.A.S., la empresa detrás de Ethos IA."
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
          <span className="brand-badge">
            <img src="/empresa/ethos-ia-logo.png" alt="Ethos IA" width="22" height="22" loading="lazy" decoding="async" />
          </span>
          <span className="brand-name">Ethos IA</span>
        </Link>
        <Link className="nav-back" href="/">← Volver al sitio</Link>
      </nav>

      <header className="hero">
        <span className="eyebrow accent">GOBERNANZA Y DIRECCIÓN</span>
        <h1>Dirección general y técnica de ETHOSLAB S.A.S.</h1>
        <p className="hero-sub">
          La estructura de gobierno detrás de Ethos IA: origen del ecosistema y los perfiles
          responsables de la dirección legal, financiera y técnica del grupo.
        </p>
      </header>

      <section className="origen">
        <Reveal as="span" className="section-label">ORIGEN DEL ECOSISTEMA</Reveal>
        <Reveal as="p" className="origen-text">
          El origen de ETHOSLAB S.A.S. es la convergencia de dos disciplinas: la
          ingeniería de software aplicada, con enfoque en arquitectura, ciberseguridad y algoritmos
          de inteligencia artificial, y la economía, con enfoque en gobernanza societaria,
          cumplimiento normativo y estructura financiera. Esa combinación, sostenida durante cinco
          años de trabajo técnico real antes de existir formalmente como sociedad, es lo que hoy
          opera bajo el nombre ETHOSLAB S.A.S. y su marca Ethos IA.
        </Reveal>
      </section>

      <section className="perfiles">
        <Reveal as="span" className="section-label">PERFILES DIRECTIVOS</Reveal>
        <div className="perfiles-grid">
          <Reveal className="team-card">
            <div className="team-photo">
              <img src="/empresa/marlon-profile.jpg" alt="Marlon David Pérez Almachi — Cofundador y Director Técnico" width="180" height="180" loading="lazy" decoding="async" />
            </div>
            <div>
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
              <div className="social-row">
                <a className="social-btn fb" href="https://www.facebook.com/IngMarlonPerez2026/" target="_blank" rel="noopener" aria-label="Facebook de Marlon Pérez">
                  <svg viewBox="0 0 24 24"><path d="M13.5 21v-8.2h2.75l.4-3.2h-3.15V7.4c0-.93.26-1.56 1.6-1.56h1.7V2.98c-.3-.04-1.3-.13-2.47-.13-2.45 0-4.13 1.5-4.13 4.24v2.5H7.5v3.2h2.75V21h3.25z" /></svg>
                </a>
                <a className="social-btn li" href="https://www.linkedin.com/in/marlon-p%C3%A9rez-06ab32303/" target="_blank" rel="noopener" aria-label="LinkedIn de Marlon Pérez">
                  <svg viewBox="0 0 24 24"><path d="M6.94 8.5H3.56V20.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.4 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.36 7.5 7.25 6.6 7.25 5.5C7.25 4.4 6.36 3.5 5.25 3.5ZM20.5 20.5V13.87C20.5 10.5 18.72 8.94 16.35 8.94C14.47 8.94 13.62 9.98 13.15 10.7V8.5H9.77C9.82 9.53 9.77 20.5 9.77 20.5H13.15V13.9C13.15 13.55 13.17 13.2 13.27 12.95C13.55 12.25 14.2 11.52 15.28 11.52C16.7 11.52 17.13 12.6 17.13 14.18V20.5H20.5Z" /></svg>
                </a>
                <a className="social-btn x" href="https://x.com/IngMarlonPere" target="_blank" rel="noopener" aria-label="X de Marlon Pérez">
                  <svg viewBox="0 0 24 24"><path d="M18.9 3H21.7L15.6 10.1L22.8 21H17.1L12.7 14.7L7.6 21H4.8L11.3 13.4L4.4 3H10.2L14.2 8.8L18.9 3ZM17.9 19.2H19.5L9.4 4.7H7.7L17.9 19.2Z" /></svg>
                </a>
                <a className="social-btn gh" href="https://github.com/ing-MarlonPerez" target="_blank" rel="noopener" aria-label="GitHub de Marlon Pérez">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.58 2 12.2C2 16.68 4.87 20.47 8.84 21.8C9.34 21.9 9.52 21.58 9.52 21.31C9.52 21.07 9.51 20.24 9.51 19.36C7 19.9 6.35 18.72 6.15 18.1C6.04 17.79 5.52 16.85 5.06 16.6C4.68 16.4 4.14 15.87 5.05 15.86C5.91 15.85 6.52 16.66 6.72 16.98C7.69 18.63 9.24 18.16 9.86 17.89C9.96 17.17 10.24 16.68 10.55 16.4C8.12 16.12 5.58 15.16 5.58 10.94C5.58 9.74 5.99 8.75 6.7 7.98C6.59 7.7 6.22 6.57 6.8 5.05C6.8 5.05 7.7 4.75 9.52 5.98C10.29 5.76 11.11 5.65 11.93 5.65C12.75 5.65 13.57 5.76 14.34 5.98C16.16 4.74 17.06 5.05 17.06 5.05C17.64 6.57 17.27 7.7 17.16 7.98C17.87 8.75 18.28 9.73 18.28 10.94C18.28 15.18 15.73 16.12 13.3 16.39C13.69 16.72 14.03 17.36 14.03 18.35C14.03 19.76 14.02 20.96 14.02 21.31C14.02 21.58 14.2 21.91 14.7 21.8C18.65 20.46 21.52 16.68 21.52 12.2C21.52 6.58 17.04 2 12 2Z" /></svg>
                </a>
                <a className="social-btn wa" href="https://wa.me/593986023149" target="_blank" rel="noopener" aria-label="WhatsApp de Ethos IA">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12C2 13.8 2.47 15.5 3.34 17L2 22L7.15 20.68C8.61 21.49 10.27 21.92 12 21.92H12.01C17.51 21.92 22 17.42 22 11.92C22 9.26 20.95 6.76 19.05 4.87C17.15 2.98 14.66 2 12 2ZM12 20.15C10.46 20.15 8.96 19.73 7.65 18.94L7.34 18.75L4.32 19.54L5.12 16.61L4.9 16.28C4.03 14.92 3.57 13.35 3.57 11.72C3.57 7.07 7.35 3.28 12 3.28C14.25 3.28 16.36 4.16 17.94 5.75C19.53 7.34 20.43 9.46 20.43 11.72C20.42 16.38 16.65 20.15 12 20.15ZM16.6 13.85C16.35 13.72 15.11 13.11 14.88 13.02C14.65 12.94 14.48 12.9 14.32 13.16C14.15 13.41 13.67 13.98 13.52 14.15C13.38 14.32 13.23 14.34 12.98 14.21C12.73 14.08 11.92 13.81 10.96 12.95C10.21 12.28 9.7 11.46 9.56 11.2C9.42 10.95 9.55 10.81 9.68 10.68C9.79 10.57 9.93 10.39 10.06 10.25C10.19 10.1 10.23 10 10.31 9.84C10.4 9.67 10.35 9.53 10.29 9.4C10.23 9.28 9.72 8.03 9.5 7.53C9.29 7.03 9.08 7.1 8.92 7.09C8.77 7.08 8.6 7.08 8.44 7.08C8.28 7.08 8.02 7.14 7.79 7.39C7.57 7.64 6.95 8.22 6.95 9.47C6.95 10.72 7.81 11.93 7.94 12.1C8.07 12.27 9.71 14.8 12.23 15.9C13.79 16.58 14.4 16.64 15.18 16.52C15.65 16.45 16.63 15.92 16.85 15.34C17.06 14.76 17.06 14.27 17 14.15C16.94 14.03 16.85 13.98 16.6 13.85Z" /></svg>
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal className="team-card" style={{ transitionDelay: '90ms' }}>
            <div className="team-photo">
              <img src="/empresa/karen-herrera-avatar.png" alt="Karen Dayanna Herrera Ruiz — Cofundadora" width="180" height="180" loading="lazy" decoding="async" />
            </div>
            <div>
              <div className="perfil-role gold">COFUNDADORA</div>
              <div className="perfil-name">Karen Dayanna Herrera Ruiz</div>
              <p>
                Formación en Economía en la Universidad Estatal de Milagro, aplicada al
                cumplimiento normativo, la gobernanza societaria y la estructuración financiera
                del grupo.
              </p>
              <div className="social-row">
                <a className="social-btn mail" href="mailto:ethos.ia.ec@gmail.com" aria-label="Escribir a Ethos IA">
                  <svg viewBox="0 0 24 24"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.2.3 6.8 5.1 6.8-5.1H5.2ZM19 7.4l-6.7 5-.6.4-.6-.4L4.4 7.4V18.5c0 .6.4 1 1 1h13c.6 0 1-.4 1-1V7.4Z" /></svg>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="perfiles areas">
        <Reveal as="span" className="section-label">EQUIPO Y JEFATURAS DE ÁREA</Reveal>
        <div className="perfiles-grid">
          <Reveal className="team-card">
            <div className="team-photo">
              <img src="/empresa/liliana-perez-avatar.png" alt="Ing. Liliana Pérez — Jefa de Talento Humano" width="180" height="180" loading="lazy" decoding="async" />
            </div>
            <div>
              <div className="perfil-role teal">JEFA DE TALENTO HUMANO</div>
              <div className="perfil-name">Ing. Liliana Pérez</div>
              <p>
                Responsable del departamento de Talento Humano de ETHOSLAB S.A.S., a cargo de la
                gestión del personal conforme al Código del Trabajo y las obligaciones patronales
                ante el IESS: afiliación y avisos de entrada/salida, nómina, décimos y fondos de
                reserva, y el bienestar del equipo. Colabora con el grupo desde hace 5 años.
              </p>
            </div>
          </Reveal>
          <Reveal className="team-card" style={{ transitionDelay: '90ms' }}>
            <div className="team-photo">
              <img src="/empresa/william-toscano-avatar.jpg" alt="William Alejandro Toscano Pérez — Diseño y creación del logotipo" width="180" height="180" loading="lazy" decoding="async" />
            </div>
            <div>
              <div className="perfil-role teal">DISEÑO Y CREACIÓN DEL LOGOTIPO</div>
              <div className="perfil-name">William Alejandro Toscano Pérez</div>
              <p>
                Ideó, diseñó y creó la identidad visual y el logotipo de Ethos IA. Licenciado en{' '}
                <a href="https://www.unemi.edu.ec/index.php/carreras-presencial/multimedia-y-produccion-audiovisual/" target="_blank" rel="noopener">
                  Multimedia y Producción Audiovisual
                </a>{' '}
                por la Universidad Estatal de Milagro (UNEMI).
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="cta">
        <Reveal as="p">
          <Link href="/#contacto">Hablar con el equipo directivo →</Link>
        </Reveal>
      </section>

      <footer className="foot">
        <span>Ethos IA es una marca de ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador</span>
        <div className="foot-legal">
          <a href="/privacidad.html" target="_blank" rel="noopener">Política de privacidad</a>
          <span>© 2026 ETHOSLAB S.A.S.</span>
        </div>
      </footer>

      <ChatWidget />

      <style jsx>{`
        :global(html) { scroll-behavior: smooth; }
        :global(body) { background: #eef3f6; }
        .page { font-family: 'IBM Plex Sans', -apple-system, sans-serif; color: #0a0f1a; background: #eef3f6; min-height: 100vh; }
        :global(a) { color: #186a63; text-decoration: none; }
        :global(a:hover) { color: #2fd8c9; }

        :global(.reveal) { opacity: 0; transform: translateY(22px); transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1); }
        :global(.reveal.in) { opacity: 1; transform: translateY(0); }

        .nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: #0a0f1a; }
        :global(.brand) { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border: 1px solid #1d2b42; border-radius: 999px; text-decoration: none; }
        .brand-badge { width: 22px; height: 22px; border-radius: 50%; background: rgba(47,216,201,0.12); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .brand-badge img { width: 100%; height: 100%; object-fit: cover; }
        .brand-name { font-family: Georgia, serif; font-size: 15px; font-weight: 600; color: #eef3f6; }
        :global(.nav-back) { font-size: 13px; color: #c9d1cc; text-decoration: none; }
        :global(.nav-back:hover) { color: #2fd8c9; }

        .hero { padding: 72px 48px 56px; background: #0a0f1a; color: #eef3f6; }
        .eyebrow { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.18em; color: #2fd8c9; }
        .hero h1 { font-family: Georgia, serif; font-size: clamp(1.8rem, 3.4vw, 2.6rem); line-height: 1.2; font-weight: 600; margin: 16px 0 0; max-width: 22ch; text-wrap: balance; }
        .hero-sub { font-size: 15px; line-height: 1.7; color: #c9d1cc; margin: 20px 0 0; max-width: 60ch; }

        :global(.section-label) { display: block; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.18em; color: #8a9298; margin-bottom: 32px; }

        .origen { padding: 64px 48px; background: #ffffff; display: flex; flex-direction: column; align-items: center; }
        .origen-text { max-width: 640px; text-align: center; font-family: Georgia, serif; font-size: 17px; line-height: 1.7; color: #1a232b; margin: 0; }

        .perfiles { padding: 64px 48px 72px; background: #eef3f6; }
        .perfiles.areas { border-top: 1px solid rgba(10,15,26,0.08); padding-top: 56px; }
        .perfiles-grid { display: flex; flex-direction: column; gap: 28px; max-width: 860px; margin: 0 auto; }
        :global(.team-card) {
          display: grid; grid-template-columns: 180px 1fr; gap: 32px; align-items: center;
          background: #ffffff; border-radius: 14px; padding: 32px; border: 1px solid rgba(10,15,26,0.08);
          box-shadow: 0 18px 40px rgba(10,15,26,0.06);
        }
        .team-photo {
          width: 150px; height: 150px; border-radius: 50%; overflow: hidden; margin: 0 auto;
          border: 3px solid #2fd8c9; box-shadow: 0 0 0 6px rgba(47,216,201,0.12);
        }
        .team-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .perfil-role { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; font-weight: 700; margin-bottom: 14px; }
        .perfil-role.teal { color: #186a63; }
        .perfil-role.gold { color: #a87a1e; }
        .perfil-name { font-family: Georgia, serif; font-size: 18px; font-weight: 600; color: #0a0f1a; margin-bottom: 14px; }
        :global(.team-card) p { font-size: 14px; color: #3d474e; line-height: 1.7; margin: 0 0 18px; }
        .social-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .social-btn {
          width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          background: #0a0f1a; border: 1px solid rgba(10,15,26,0.1); color: #c9d1cc; transition: all 0.2s ease;
        }
        .social-btn svg { width: 17px; height: 17px; fill: currentColor; }
        .social-btn:hover { border-color: #2fd8c9; color: #2fd8c9; transform: translateY(-2px); }
        .social-btn.fb:hover { color: #1877F2; }
        .social-btn.li:hover { color: #0A66C2; }
        .social-btn.x:hover { color: #ffffff; }
        .social-btn.gh:hover { color: #ffffff; }
        .social-btn.wa:hover { color: #25D366; }
        .social-btn.mail:hover { color: #e8b23a; }

        @media (max-width: 700px) {
          :global(.team-card) { grid-template-columns: 1fr; text-align: center; }
          .social-row { justify-content: center; }
        }

        .cta { padding: 0 48px 72px; text-align: center; font-weight: 700; font-size: 15px; }

        .foot { background: #060a10; color: #5c7267; padding: 32px 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; }
        .foot-legal { display: flex; gap: 24px; }
        .foot-legal :global(a) { color: #5c7267; }

        @media (max-width: 700px) {
          .hero, .origen, .perfiles, .cta, .foot { padding-left: 24px; padding-right: 24px; }
        }

        @media (max-width: 480px) {
          .nav { padding: 14px 18px; flex-wrap: wrap; gap: 10px; }
          .hero, .origen, .perfiles, .cta, .foot { padding-left: 18px; padding-right: 18px; }
          .foot { flex-direction: column; align-items: flex-start; }
          :global(.team-card) { padding: 24px; }
        }
      `}</style>
    </div>
  );
}
