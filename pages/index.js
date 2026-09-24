import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ChatWidget from '../components/ChatWidget';

const SITE_URL = 'https://www.ethosia.tech';

const META_DESCRIPTION =
  'Ethos IA acompaña a pequeñas y medianas empresas en la adopción de inteligencia artificial ética y segura: automatización de procesos, auditoría de IA y ciberseguridad para proteger sus datos.';
const SHARE_DESCRIPTION =
  'Inteligencia artificial ética y segura para empresas: automatización de procesos y auditoría de IA. Desde Ecuador para Latinoamérica y el mundo.';

const AREAS = [
  'Adopción de IA y automatización',
  'Auditoría de IA y ciberseguridad',
  'Gobernanza y ética de IA',
  'Capacitación empresarial',
  'Otro',
];

// Ecosistema digital de la empresa. Deja en `null` cualquier canal que todavía no exista —
// el footer solo muestra los canales con URL real, nunca un enlace falso o "próximamente".
const CONTACT = {
  whatsapp: 'https://wa.me/593986023149',
  facebook: 'https://www.facebook.com/profile.php?id=61593170550264',
  youtube: 'https://www.youtube.com/@ElClubDeLaIngenier%C3%ADa',
  instagram: null,
  linkedin: null,
  tiktok: null,
  x: null,
  email: null,
  phone: null,
};

const SOCIAL_LABELS = {
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  youtube: 'YouTube',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  x: 'X (Twitter)',
};

const TRUST = ['Más de 5 años de experiencia', 'Empresa constituida en Ecuador', 'Alineados a la LOPDP'];

const SERVICIOS = [
  {
    n: '01',
    icon: 'zap',
    title: 'Adopción de IA y automatización de procesos',
    text: 'Identificamos qué procesos de tu empresa pueden automatizarse con inteligencia artificial e implementamos asistentes, agentes y flujos inteligentes integrados a tus sistemas actuales, con seguridad y privacidad desde el diseño.',
    items: ['Diagnóstico de procesos automatizables', 'Asistentes y agentes de IA para tu operación', 'Integración segura con tus sistemas y datos'],
  },
  {
    n: '02',
    icon: 'shield',
    featured: true,
    title: 'Auditoría de IA y ciberseguridad',
    text: 'Revisamos cómo se ha implementado la inteligencia artificial dentro de tus procesos y detectamos las brechas que un ciberdelincuente podría explotar para acceder a tus datos, manipular tus sistemas o afectar tu operación.',
    items: ['Evaluación de riesgos y vulnerabilidades', 'Pruebas de fuga de datos y manipulación de modelos', 'Informe ejecutivo con plan de remediación'],
  },
  {
    n: '03',
    icon: 'scale',
    title: 'Gobernanza y ética de IA',
    text: 'Establecemos políticas de uso responsable, criterios de transparencia y supervisión humana, y alineamos el tratamiento de datos con la Ley Orgánica de Protección de Datos Personales (LOPDP) del Ecuador.',
    items: ['Políticas de uso responsable de IA', 'Protección de datos y cumplimiento de la LOPDP', 'Capacitación para equipos directivos y operativos'],
  },
];

const PRINCIPIOS = ['Seguridad desde el diseño', 'Transparencia y explicabilidad', 'Privacidad de los datos', 'Supervisión humana'];

const HITOS = [
  {
    label: 'TRAYECTORIA',
    title: 'Más de cinco años de experiencia',
    text: 'Desarrollando soluciones tecnológicas para empresas y organizaciones, con la misma disciplina técnica que hoy aplicamos a la inteligencia artificial.',
  },
  {
    label: 'SOLIDEZ INSTITUCIONAL',
    title: 'ETHOSLAB S.A.S.',
    text: 'Sociedad constituida ante la Superintendencia de Compañías, Valores y Seguros, y registrada en el Servicio de Rentas Internas (SRI) del Ecuador.',
  },
  {
    label: 'EQUIPO',
    title: 'Talento multidisciplinario',
    text: 'Profesionales de ingeniería, economía y diseño unidos por una meta común: llevar la inteligencia artificial responsable de Ecuador a Latinoamérica y al mundo.',
  },
];

const VALORES = [
  { icon: 'compass', name: 'Ética', text: 'Cada decisión tecnológica considera su impacto en las personas y en sus datos.' },
  { icon: 'lock', name: 'Seguridad', text: 'La protección de la información es un requisito de diseño, nunca un añadido.' },
  { icon: 'eye', name: 'Transparencia', text: 'Explicamos qué hacemos, cómo funciona y qué riesgos existen.' },
  { icon: 'award', name: 'Excelencia', text: 'Estándares técnicos de nivel internacional en cada proyecto, sin importar su tamaño.' },
];

const PROCESO = [
  ['01', 'Diagnóstico', 'Mapeamos tus procesos, los datos que manejan y cómo se utiliza hoy la inteligencia artificial en tu empresa, para identificar oportunidades de automatización y riesgos reales antes de invertir.'],
  ['02', 'Diseño seguro', 'Definimos la solución con seguridad y privacidad desde el diseño: qué automatizar, qué datos intervienen, quién accede a ellos y qué controles se aplican.'],
  ['03', 'Implementación', 'Desplegamos de forma iterativa, con entregas visibles desde las primeras semanas, integración con tus sistemas y capacitación para que tu equipo adopte la solución con confianza.'],
  ['04', 'Auditoría continua', 'Verificamos que todo funcione como fue diseñado: pruebas de seguridad, monitoreo y reportes periódicos para detectar y cerrar nuevas brechas a tiempo.'],
];

const ICON_PATHS = {
  zap: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />,
  shield: (
    <>
      <path d="M12 3 5 5.8v5.6c0 4.4 2.9 8.2 7 9.6 4.1-1.4 7-5.2 7-9.6V5.8L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M8 20h8M5 8h14" />
      <path d="M5 8 2.5 13.5a2.8 2.8 0 0 0 5 0L5 8ZM19 8l-2.5 5.5a2.8 2.8 0 0 0 5 0L19 8Z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.6 13.8 7.5 21l4.5-2.6 4.5 2.6-1.1-7.2" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
};

function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.7 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

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

export default function Home() {
  const [form, setForm] = useState({ nombre: '', correo: '', area: AREAS[0], mensaje: '', consentimiento: false });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.consentimiento) {
      setStatus('error');
      setErrorMsg('Debes aceptar la Política de Tratamiento de Datos Personales.');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Algo salió mal. Intenta de nuevo.');
        return;
      }
      setStatus('ok');
      setForm({ nombre: '', correo: '', area: AREAS[0], mensaje: '', consentimiento: false });
    } catch {
      setStatus('error');
      setErrorMsg('No pudimos conectar. Revisa tu conexión e intenta de nuevo.');
    }
  }

  return (
    <div className="page">
      <Head>
        <title>Ethos IA — Inteligencia Artificial Ética, Automatización y Auditoría de IA</title>
        <meta name="description" content={META_DESCRIPTION} />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#05111e" />
        <meta
          name="keywords"
          content="Ethos IA, inteligencia artificial ética, IA responsable, auditoría de inteligencia artificial, automatización de procesos con IA, ciberseguridad para pymes, gobernanza de IA, LOPDP Ecuador, Cuenca"
        />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ethos IA" />
        <meta property="og:title" content="Ethos IA — Inteligencia Artificial Ética y Segura para Empresas" />
        <meta property="og:description" content={SHARE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/empresa/ethos-og-card.png`} />
        <meta property="og:locale" content="es_EC" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ethos IA — Inteligencia Artificial Ética y Segura para Empresas" />
        <meta name="twitter:description" content={SHARE_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/empresa/ethos-og-card.png`} />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', { send_page_view: true });
                `,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ETHOSLAB S.A.S.',
              alternateName: 'Ethos IA',
              url: SITE_URL,
              logo: `${SITE_URL}/empresa/ethos-ia-logo-v2.png`,
              description: META_DESCRIPTION,
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Av. Antonio Muñoz Borrero y calle Señor de Belén',
                addressLocality: 'Cuenca',
                addressRegion: 'Azuay',
                addressCountry: 'EC',
              },
              sameAs: Object.keys(SOCIAL_LABELS)
                .filter((key) => CONTACT[key])
                .map((key) => CONTACT[key]),
            }),
          }}
        />
      </Head>

      <nav className="nav">
        <a className="brand" href="#top">
          <span className="brand-badge">
            <Image src="/empresa/ethos-ia-logo-v2.png" alt="Ethos IA" width={42} height={42} priority className="brand-mark-img" />
          </span>
          <span className="brand-name">Ethos IA</span>
        </a>
        <div className="nav-pill">
          <a className="nav-pill-link" href="#servicios">Servicios</a>
          <a className="nav-pill-link" href="#enfoque">Enfoque ético</a>
          <a className="nav-pill-link" href="#nosotros">Nosotros</a>
          <Link className="nav-pill-link" href="/equipo">Equipo</Link>
        </div>
        <div className="nav-right">
          <a className="nav-cta" href="#contacto">Agendar diagnóstico</a>
          <button
            type="button"
            className={`nav-burger ${menuOpen ? 'open' : ''}`}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
        <a href="#enfoque" onClick={() => setMenuOpen(false)}>Enfoque ético</a>
        <a href="#nosotros" onClick={() => setMenuOpen(false)}>Nosotros</a>
        <a href="#mision" onClick={() => setMenuOpen(false)}>Misión y visión</a>
        <Link href="/equipo" onClick={() => setMenuOpen(false)}>Equipo</Link>
        <a className="nav-mobile-cta" href="#contacto" onClick={() => setMenuOpen(false)}>Agendar diagnóstico</a>
      </div>

      <header className="hero" id="top">
        <Image
          src="/empresa/hero-cyborg-cube-v1.jpg"
          alt="Androide humanoide junto al símbolo del cubo Ethos IA, sobre un fondo de red digital — investigación en inteligencia artificial responsable"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="hero-bg-img"
        />
        <div className="hero-scrim" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="eyebrow">IA ÉTICA · AUTOMATIZACIÓN SEGURA · AUDITORÍA DE IA</span>
            <h1>Inteligencia artificial ética y segura para que tu empresa crezca con confianza.</h1>
            <p className="hero-sub">
              Acompañamos a pequeñas y medianas empresas en la adopción de inteligencia artificial:
              automatizamos sus procesos con seguridad desde el diseño y auditamos cada implementación
              para cerrar las brechas que los ciberdelincuentes podrían explotar.
            </p>
            <div className="hero-actions">
              <a className="hero-btn primary" href="#contacto">Agendar un diagnóstico</a>
              <a className="hero-btn ghost" href="#servicios">Conocer los servicios</a>
            </div>
            <ul className="hero-trust">
              {TRUST.map((t) => (
                <li key={t}>
                  <Icon name="check" size={16} color="#04ebff" strokeWidth={2.2} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <section className="desafio">
        <Reveal as="span" className="section-label">EL DESAFÍO</Reveal>
        <Reveal as="h2" className="section-title">
          La inteligencia artificial ya está en tu empresa. La pregunta es si está segura.
        </Reveal>
        <div className="desafio-grid">
          <Reveal className="desafio-item">
            <span className="desafio-tag">EL RIESGO</span>
            <p>
              Cada vez más empresas incorporan chatbots, asistentes y automatizaciones con IA sin una
              evaluación de seguridad. Una integración mal configurada puede exponer datos de clientes,
              credenciales o información financiera a ciberdelincuentes.
            </p>
          </Reveal>
          <Reveal className="desafio-item" style={{ transitionDelay: '90ms' }}>
            <span className="desafio-tag">NUESTRA RESPUESTA</span>
            <p>
              Diagnosticamos cómo se usa la IA en cada proceso, identificamos vulnerabilidades y
              diseñamos controles técnicos y de gobernanza, para que la tecnología trabaje a favor de
              tu empresa y no en su contra.
            </p>
          </Reveal>
          <Reveal className="desafio-item" style={{ transitionDelay: '160ms' }}>
            <span className="desafio-tag">EL RESULTADO</span>
            <p>
              Procesos más eficientes, datos protegidos y la tranquilidad de una implementación que
              puedes auditar y explicar a tus clientes, socios y entes de control.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="servicios" id="servicios">
        <Reveal as="span" className="section-label">SERVICIOS</Reveal>
        <Reveal as="h2" className="section-title">
          Tres líneas de servicio para adoptar inteligencia artificial sin poner en riesgo tu operación
        </Reveal>
        <div className="serv-grid">
          {SERVICIOS.map((s, i) => (
            <Reveal
              as="article"
              key={s.n}
              className={`serv-card ${s.featured ? 'featured' : ''}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="serv-head">
                <span className="serv-icon">
                  <Icon name={s.icon} size={26} color={s.featured ? '#04141e' : '#04ebff'} />
                </span>
                <span className="serv-num">{s.n}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul className="serv-list">
                {s.items.map((it) => (
                  <li key={it}>
                    <Icon name="check" size={16} color={s.featured ? '#04ebff' : '#0b5f75'} strokeWidth={2.2} />
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="enfoque" id="enfoque">
        <div className="enfoque-visual">
          <Image
            src="/empresa/ethos-brand-visual.png"
            alt="Logotipo de Ethos IA: cubo con las letras E, I y A junto al nombre de la marca"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="enfoque-img"
          />
        </div>
        <Reveal className="enfoque-copy">
          <span className="eyebrow">POR QUÉ ETHOS</span>
          <h2>Ethos significa carácter. Es el principio que guía cada implementación.</h2>
          <p>
            En griego, <em>ethos</em> designa el carácter y los valores que definen a quien actúa. Nuestra
            firma nace de esa convicción: la inteligencia artificial solo genera valor sostenible cuando es
            segura, transparente y responsable con las personas cuyos datos procesa.
          </p>
          <ul className="principios">
            {PRINCIPIOS.map((p) => (
              <li key={p}>
                <Icon name="check" size={16} color="#04ebff" strokeWidth={2.2} />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="nosotros" id="nosotros">
        <div className="nos-inner">
          <Reveal className="nos-copy">
            <span className="nos-label">NOSOTROS</span>
            <h2>Experiencia comprobada, consolidada en una firma con visión internacional</h2>
            <p className="nos-intro">
              Ethos IA nació en Cuenca como un proyecto de ingeniería con una convicción: la tecnología debe
              generar confianza. Hoy esa convicción es una empresa formalmente constituida que acompaña a
              organizaciones en su transformación con inteligencia artificial.
            </p>
            <div className="nos-items">
              {HITOS.map((h) => (
                <div className="nos-item" key={h.label}>
                  <span className="nos-item-label">{h.label}</span>
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </div>
              ))}
            </div>
            <Link className="nos-btn" href="/equipo">Conocer al equipo directivo →</Link>
          </Reveal>
          <Reveal className="nos-visual" style={{ transitionDelay: '120ms' }}>
            <div className="nos-frame">
              <Image
                src="/empresa/ethos-senaletica-oficina.jpg"
                alt="Señalética de Ethos IA en un corredor de oficinas, con el cubo y el nombre de la marca iluminados sobre un panel de vidrio"
                fill
                sizes="(max-width: 900px) 100vw, 44vw"
                className="nos-img"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mv" id="mision">
        <div className="mv-glow" aria-hidden="true" />
        <Reveal as="span" className="section-label light">IDENTIDAD CORPORATIVA</Reveal>
        <Reveal as="h2" className="section-title light">Lo que nos impulsa y hacia dónde vamos</Reveal>
        <div className="mv-grid">
          <Reveal as="article" className="mv-card">
            <span className="mv-icon">
              <Icon name="target" size={26} color="#04ebff" />
            </span>
            <span className="mv-label">MISIÓN</span>
            <p>
              Impulsar la adopción de inteligencia artificial ética, segura y responsable en las pequeñas y
              medianas empresas, automatizando sus procesos y auditando cada implementación para proteger
              sus datos y convertir la tecnología en una ventaja competitiva verificable.
            </p>
          </Reveal>
          <Reveal as="article" className="mv-card" style={{ transitionDelay: '90ms' }}>
            <span className="mv-icon">
              <Icon name="globe" size={26} color="#04ebff" />
            </span>
            <span className="mv-label">VISIÓN</span>
            <p>
              Ser reconocidos en Latinoamérica y a nivel internacional como la firma de referencia en
              inteligencia artificial responsable y auditoría de IA, demostrando que la innovación
              tecnológica y la seguridad de la información pueden y deben avanzar juntas.
            </p>
          </Reveal>
        </div>
        <Reveal className="valores" style={{ transitionDelay: '140ms' }}>
          <span className="valores-label">NUESTROS VALORES</span>
          <div className="valores-grid">
            {VALORES.map((v) => (
              <div className="valor" key={v.name}>
                <span className="valor-icon">
                  <Icon name={v.icon} size={22} color="#04ebff" />
                </span>
                <h3>{v.name}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="proceso">
        <Reveal as="span" className="section-label">CÓMO TRABAJAMOS</Reveal>
        <Reveal as="h2" className="section-title">Una metodología clara, de principio a fin</Reveal>
        <div className="proceso-grid">
          {PROCESO.map(([n, t, d], i) => (
            <Reveal key={n} className="proceso-item" style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="proceso-num">{n}</div>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="contacto" id="contacto">
        <Reveal className="contacto-inner">
          <span className="eyebrow">HABLEMOS</span>
          <h2>¿Tu empresa ya usa inteligencia artificial?</h2>

          {status === 'ok' ? (
            <div className="form-ok">
              <span className="form-ok-check">✓</span>
              <p>Solicitud enviada. Te escribimos pronto.</p>
            </div>
          ) : (
            <>
              <p className="contacto-sub">
                Conversemos sobre cómo automatizar tus procesos o auditar tu implementación actual.
                Un especialista del equipo te responde en 48 horas.
              </p>
              <form className="quote-form" onSubmit={handleSubmit}>
                <div className="qf-row">
                  <label>
                    <span>Nombre</span>
                    <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre" />
                  </label>
                  <label>
                    <span>Correo</span>
                    <input required type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} placeholder="tu@empresa.com" />
                  </label>
                </div>
                <label>
                  <span>Área de interés</span>
                  <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
                    {AREAS.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </label>
                <label>
                  <span>Cuéntanos brevemente qué necesitas</span>
                  <textarea rows={4} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} placeholder="Por ejemplo: usamos un chatbot con clientes y queremos saber si es seguro." />
                </label>
                <label className="consent-row">
                  <input type="checkbox" checked={form.consentimiento} onChange={(e) => setForm({ ...form, consentimiento: e.target.checked })} />
                  <span>He leído y acepto la <a href="/privacidad.html" target="_blank" rel="noopener noreferrer">Política de Tratamiento de Datos Personales</a></span>
                </label>
                {status === 'error' && <p className="form-error">{errorMsg}</p>}
                <button type="submit" className="qf-submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Enviando…' : 'Enviar solicitud'}
                </button>
              </form>
            </>
          )}
        </Reveal>
      </section>

      <section className="brand-banner">
        <Image
          src="/empresa/ethos-brand-banner-v2.png"
          alt="Logotipo de Ethos IA sobre fondo azul profundo"
          fill
          sizes="100vw"
          className="brand-banner-img"
        />
        {/* Capa de degradado del mismo color que las secciones vecinas para que
            la imagen se funda con el negro de arriba (contacto) y abajo
            (footer) en vez de cortar en seco. */}
        <div className="brand-banner-fade brand-banner-fade-top" />
        <div className="brand-banner-fade brand-banner-fade-bottom" />
      </section>

      <footer className="foot">
        <div className="foot-top">
          <div className="foot-headline">Inteligencia artificial ética, segura y auditable.</div>
          <div className="foot-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="#93aabb" strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Sociedad por Acciones Simplificada — constituida en Ecuador</span>
          </div>
        </div>

        <div className="foot-cols">
          <div className="foot-col foot-col-brand">
            <div className="foot-logo">
              <span className="brand-badge small">
                <Image src="/empresa/ethos-ia-logo-v2.png" alt="Ethos IA" width={30} height={30} className="brand-mark-img" />
              </span>
              <span className="brand-name">Ethos IA</span>
            </div>
            <span className="foot-desc">Inteligencia artificial ética y responsable para las empresas de Ecuador y Latinoamérica.</span>
          </div>
          <div className="foot-col">
            <span className="foot-heading">SERVICIOS</span>
            <a href="#servicios">Adopción de IA</a>
            <a href="#servicios">Automatización de procesos</a>
            <a href="#servicios">Auditoría de IA</a>
            <a href="#servicios">Ciberseguridad</a>
          </div>
          <div className="foot-col">
            <span className="foot-heading">ÉTICA Y GOBERNANZA</span>
            <a href="#enfoque">Enfoque ético</a>
            <a href="#servicios">Protección de datos</a>
            <a href="#contacto">Capacitación</a>
          </div>
          <div className="foot-col">
            <span className="foot-heading">EMPRESA</span>
            <a href="#nosotros">Nosotros</a>
            <a href="#mision">Misión y visión</a>
            <Link href="/equipo">Equipo</Link>
            <a href="#contacto">Contacto</a>
          </div>
          <div className="foot-col">
            <span className="foot-heading">SÍGUENOS</span>
            {Object.keys(SOCIAL_LABELS)
              .filter((key) => CONTACT[key])
              .map((key) => (
                <a key={key} href={CONTACT[key]} target="_blank" rel="noopener noreferrer">{SOCIAL_LABELS[key]}</a>
              ))}
            {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
            {CONTACT.phone && <a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a>}
          </div>
        </div>

        <div className="foot-bottom">
          <span>Ethos IA es una marca de ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador</span>
          <div className="foot-legal">
            <a href="/privacidad.html" target="_blank" rel="noopener noreferrer">Política de privacidad</a>
            <span>© 2026 ETHOSLAB S.A.S.</span>
          </div>
        </div>
      </footer>

      <ChatWidget />

      <style jsx>{`
        :global(html) { scroll-behavior: smooth; }
        :global(body) {
          background: #eaf2f8;
          color: #071a2a;
          font-family: var(--font-brand), sans-serif;
          margin: 0;
        }
        .page {
          font-family: var(--font-brand), -apple-system, sans-serif;
          color: #05111e;
          background: #f3f7fb;
          min-height: 100vh;
          overflow-x: hidden;
        }
        a { color: #0b5f75; text-decoration: none; }
        a:hover { color: #3ddcf5; }
        :global(section[id]), :global(header[id]) { scroll-margin-top: 76px; }

        :global(.reveal) { opacity: 0; transform: translateY(22px); transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1); }
        :global(.reveal.in) { opacity: 1; transform: translateY(0); }

        /* ── Navegación ─────────────────────────────────────────────── */
        .nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 32px;
          position: sticky; top: 0; z-index: 20;
          background: rgba(5, 17, 30, 0.72);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .brand {
          display: flex; align-items: center; gap: 10px;
          padding: 6px 16px 6px 6px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          border-radius: 999px;
        }
        .brand-badge { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .brand-badge.small { width: 30px; height: 30px; }
        :global(.brand-mark-img) { width: 100%; height: 100%; object-fit: contain; }
        .brand-name { font-family: var(--font-brand), sans-serif; font-size: 15px; font-weight: 600; color: #eaf2f8; }
        .nav-pill { display: flex; gap: 6px; padding: 6px; border: 1px solid rgba(255,255,255,0.14); border-radius: 999px; background: rgba(255,255,255,0.02); }
        .nav-pill :global(.nav-pill-link) {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 36px; box-sizing: border-box;
          padding: 9px 18px; font-size: 13px; line-height: 1;
          color: #eaf2f8; border-radius: 999px; text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .nav-pill :global(.nav-pill-link:hover) { background: rgba(4,235,255,0.12); color: #04ebff; }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .nav-cta {
          padding: 12px 24px; background: linear-gradient(135deg, #dcfaff 0%, #8eecff 100%);
          color: #05111e; border-radius: 999px; font-weight: 700; font-size: 13px;
          box-shadow: 0 14px 26px rgba(4, 235, 255, 0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .nav-cta:hover {
          color: #05111e; background: linear-gradient(135deg, #e6fbff 0%, #9cf2ff 100%);
          transform: translateY(-1px);
          box-shadow: 0 18px 32px rgba(4, 235, 255, 0.24);
        }
        .nav-burger { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.16); border-radius: 10px; background: transparent; cursor: pointer; padding: 0; }
        .nav-burger span { display: block; width: 18px; height: 2px; background: #eaf2f8; margin: 0 auto; transition: transform 0.25s, opacity 0.25s; }
        .nav-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-burger.open span:nth-child(2) { opacity: 0; }
        .nav-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .nav-mobile { display: none; flex-direction: column; position: sticky; top: 65px; z-index: 9; background: rgba(5,17,30,0.96); border-bottom: 1px solid rgba(255,255,255,0.08); overflow: hidden; max-height: 0; transition: max-height 0.3s ease; }
        .nav-mobile.open { max-height: 460px; }
        .nav-mobile :global(a) { padding: 16px 32px; font-size: 15px; color: #eaf2f8; text-decoration: none; border-top: 1px solid rgba(255,255,255,0.08); }
        .nav-mobile :global(a:hover) { color: #04ebff; }
        .nav-mobile-cta { color: #04ebff !important; font-weight: 700; }

        /* ── Utilidades de sección ──────────────────────────────────── */
        .eyebrow { display: block; font-family: var(--font-brand), sans-serif; font-size: 12px; letter-spacing: 0.18em; font-weight: 600; color: #04ebff; }
        :global(.section-label) { position: relative; z-index: 1; display: block; text-align: center; font-family: var(--font-brand), sans-serif; font-size: 11px; letter-spacing: 0.2em; font-weight: 700; color: #0b5f75; margin-bottom: 16px; }
        :global(.section-label.light) { color: #04ebff; }
        :global(.section-title) {
          position: relative; z-index: 1; display: block; text-align: center;
          font-family: var(--font-brand), sans-serif; font-size: clamp(1.55rem, 2.8vw, 2.15rem);
          line-height: 1.25; font-weight: 600; letter-spacing: -0.015em;
          max-width: 30ch; margin: 0 auto 56px; color: #05111e; text-wrap: balance;
        }
        :global(.section-title.light) { color: #eaf2f8; }

        /* ── Hero ───────────────────────────────────────────────────── */
        .hero { position: relative; min-height: 92vh; display: flex; align-items: center; overflow: hidden; background: #05111e; }
        :global(.hero-bg-img) {
          object-fit: cover; object-position: 100% 50%; z-index: 0;
        }
        .hero-scrim {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(to right, rgba(5,17,30,0.96) 0%, rgba(5,17,30,0.78) 30%, rgba(5,17,30,0.32) 58%, rgba(5,17,30,0.18) 100%),
            radial-gradient(circle at 20% 75%, rgba(4,235,255,0.12), transparent 34%),
            radial-gradient(circle at 6% 12%, rgba(15,88,118,0.10), transparent 24%);
        }
        .hero-inner { position: relative; z-index: 2; width: 100%; padding: 40px 48px 40px; }
        .hero-content { max-width: 640px; }
        .hero .eyebrow { font-weight: 400; }
        .hero h1 {
          font-family: var(--font-brand), sans-serif; font-size: clamp(2.1rem, 3.8vw, 3.2rem); line-height: 1.12;
          font-weight: 600; margin: 16px 0 0; color: #eaf2f8; text-wrap: balance;
          letter-spacing: -0.02em;
        }
        .hero-sub { font-size: 16px; line-height: 1.7; color: #d3dde8; margin: 22px 0 0; max-width: 52ch; }
        .hero-actions { display: flex; gap: 14px; margin-top: 34px; flex-wrap: wrap; }
        .hero-btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 13px 26px; border-radius: 999px; font-weight: 700; font-size: 14px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .hero-btn.primary {
          background: linear-gradient(135deg, #7df3ff 0%, #04ebff 100%);
          color: #04141e; box-shadow: 0 18px 32px rgba(4, 235, 255, 0.18);
        }
        .hero-btn.primary:hover {
          transform: translateY(-2px); background: linear-gradient(135deg, #a5f5ff 0%, #6deeff 100%);
          box-shadow: 0 20px 36px rgba(4, 235, 255, 0.22);
        }
        .hero-btn.ghost {
          border: 1px solid rgba(234,242,248,0.35); color: #eaf2f8; background: rgba(255,255,255,0.015);
        }
        .hero-btn.ghost:hover { border-color: #04ebff; color: #04ebff; box-shadow: 0 10px 26px rgba(4,235,255,0.10); }
        .hero-trust { list-style: none; padding: 0; margin: 36px 0 0; display: flex; flex-wrap: wrap; gap: 12px 26px; }
        .hero-trust li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #c3d2de; }

        @media (max-width: 760px) {
          :global(.hero-bg-img) { display: none; }
          .hero-scrim {
            background:
              radial-gradient(ellipse 55% 70% at 78% 45%, rgba(4,235,255,0.16), transparent 65%),
              radial-gradient(ellipse 45% 60% at 15% 85%, rgba(43,135,173,0.08), transparent 65%);
          }
        }

        /* ── El desafío ─────────────────────────────────────────────── */
        .desafio { padding: 96px 48px 72px; background: #ffffff; }
        .desafio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; max-width: 1140px; margin: 0 auto; }
        :global(.desafio-item) { padding: 32px 28px; border-radius: 16px; background: #f3f7fb; border: 1px solid rgba(5,17,30,0.07); }
        .desafio-tag { display: block; font-family: var(--font-brand), sans-serif; font-size: 11px; letter-spacing: 0.16em; font-weight: 700; color: #0b5f75; margin-bottom: 14px; }
        :global(.desafio-item) p { font-size: 14.5px; color: #33414d; line-height: 1.75; margin: 0; }

        /* ── Servicios ──────────────────────────────────────────────── */
        .servicios { padding: 96px 48px; background: #eef4f9; }
        .serv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1180px; margin: 0 auto; align-items: stretch; }
        :global(.serv-card) {
          position: relative; display: flex; flex-direction: column; gap: 16px;
          padding: 36px 32px; border-radius: 20px; background: #ffffff;
          border: 1px solid rgba(5,17,30,0.08);
          box-shadow: 0 18px 40px rgba(5,17,30,0.06);
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease, opacity 0.65s cubic-bezier(0.16,1,0.3,1);
        }
        :global(.serv-card.in:hover) { transform: translateY(-4px); box-shadow: 0 26px 56px rgba(5,17,30,0.12); }
        /* Degradado tomado de las caras del cubo del logotipo (#08283c → #05111e). */
        :global(.serv-card.featured) { background: linear-gradient(160deg, #08283c 0%, #05111e 100%); border-color: rgba(4,235,255,0.28); box-shadow: 0 26px 60px rgba(5,17,30,0.28); }
        .serv-head { display: flex; align-items: center; justify-content: space-between; }
        .serv-icon { width: 56px; height: 56px; border-radius: 16px; background: #05111e; display: flex; align-items: center; justify-content: center; }
        :global(.serv-card.featured) .serv-icon { background: #04ebff; }
        .serv-num { font-family: var(--font-brand), sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; color: #93a4b3; }
        :global(.serv-card) h3 { font-family: var(--font-brand), sans-serif; font-size: 21px; line-height: 1.3; font-weight: 600; margin: 8px 0 0; color: #05111e; text-wrap: balance; }
        :global(.serv-card) p { font-size: 14.5px; line-height: 1.75; color: #3e4d5a; margin: 0; }
        :global(.serv-card.featured) h3 { color: #eaf2f8; }
        :global(.serv-card.featured) p { color: #c3d2de; }
        .serv-list { list-style: none; padding: 18px 0 0; margin: auto 0 0; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid rgba(5,17,30,0.08); }
        :global(.serv-card.featured) .serv-list { border-top-color: rgba(255,255,255,0.12); }
        .serv-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; line-height: 1.5; color: #14202b; font-weight: 500; }
        :global(.serv-card.featured) .serv-list li { color: #eaf2f8; }
        .serv-list li :global(svg) { flex-shrink: 0; margin-top: 1px; }

        /* ── Enfoque ético ──────────────────────────────────────────── */
        .enfoque { display: flex; align-items: stretch; background: #05111e; color: #eaf2f8; }
        .enfoque-visual { position: relative; flex: 0 0 50%; max-width: 50%; aspect-ratio: 1376 / 768; order: 2; }
        :global(.enfoque-img) { object-fit: cover; }
        :global(.enfoque-copy) { order: 1; flex: 0 0 50%; max-width: 50%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; padding: 64px 64px 64px 72px; }
        .enfoque h2 { font-family: var(--font-brand), sans-serif; font-size: clamp(1.7rem, 3vw, 2.35rem); line-height: 1.25; font-weight: 600; margin: 18px 0 20px; text-wrap: balance; }
        .enfoque p { font-size: 16px; line-height: 1.8; color: #c3d2de; margin: 0; }
        .enfoque em { color: #eaf2f8; }
        .principios { list-style: none; padding: 0; margin: 30px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 14px 24px; }
        .principios li { display: flex; align-items: center; gap: 10px; font-size: 14.5px; color: #eaf2f8; font-weight: 500; }
        .principios li :global(svg) { flex-shrink: 0; }

        /* ── Nosotros ───────────────────────────────────────────────── */
        .nosotros { padding: 104px 48px; background: #ffffff; }
        .nos-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.05fr 1fr; gap: 64px; align-items: center; }
        .nos-label { display: block; font-family: var(--font-brand), sans-serif; font-size: 11px; letter-spacing: 0.2em; font-weight: 700; color: #0b5f75; }
        :global(.nos-copy) h2 { font-family: var(--font-brand), sans-serif; font-size: clamp(1.6rem, 2.7vw, 2.15rem); line-height: 1.25; font-weight: 600; letter-spacing: -0.015em; margin: 16px 0 18px; color: #05111e; text-wrap: balance; }
        .nos-intro { font-size: 16px; line-height: 1.8; color: #3e4d5a; margin: 0; }
        .nos-items { margin-top: 34px; display: flex; flex-direction: column; gap: 22px; }
        .nos-item { padding-left: 20px; border-left: 2px solid #04ebff; }
        .nos-item-label { display: block; font-family: var(--font-brand), sans-serif; font-size: 10.5px; letter-spacing: 0.18em; font-weight: 700; color: #0b5f75; }
        .nos-item h3 { font-family: var(--font-brand), sans-serif; font-size: 17px; font-weight: 600; margin: 6px 0 6px; color: #05111e; }
        .nos-item p { font-size: 14.5px; line-height: 1.7; color: #4a5866; margin: 0; }
        :global(.nos-btn) { display: inline-block; text-decoration: none; margin-top: 36px; padding: 14px 30px; border-radius: 999px; background: #05111e; color: #eaf2f8; font-weight: 700; font-size: 14px; transition: background 0.2s, transform 0.2s; }
        :global(.nos-btn:hover) { background: #0b2a40; color: #04ebff; transform: translateY(-2px); }
        .nos-frame { position: relative; aspect-ratio: 1195 / 896; border-radius: 22px; overflow: hidden; box-shadow: 0 34px 80px rgba(5,17,30,0.18); border: 1px solid rgba(5,17,30,0.06); }
        :global(.nos-img) { object-fit: cover; }

        /* ── Misión, visión y valores ───────────────────────────────── */
        .mv { position: relative; overflow: hidden; padding: 104px 48px; background: #05111e; }
        .mv-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(circle at 18% 20%, rgba(4,235,255,0.10), transparent 38%),
            radial-gradient(circle at 85% 85%, rgba(15,88,118,0.30), transparent 42%);
        }
        .mv-grid { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; max-width: 1140px; margin: 0 auto; }
        :global(.mv-card) {
          position: relative; padding: 44px 40px; border-radius: 22px;
          background: linear-gradient(160deg, rgba(8,40,60,0.85) 0%, rgba(4,20,32,0.7) 100%);
          border: 1px solid rgba(4,235,255,0.22);
          box-shadow: 0 30px 70px rgba(0,0,0,0.30);
        }
        .mv-icon { width: 54px; height: 54px; border-radius: 16px; background: rgba(4,235,255,0.10); border: 1px solid rgba(4,235,255,0.30); display: flex; align-items: center; justify-content: center; }
        .mv-label { display: block; margin-top: 24px; font-family: var(--font-brand), sans-serif; font-size: 12px; letter-spacing: 0.22em; font-weight: 700; color: #04ebff; }
        :global(.mv-card) p { font-family: var(--font-brand), sans-serif; font-size: 18px; line-height: 1.7; color: #eaf2f8; margin: 14px 0 0; font-weight: 400; }
        :global(.valores) { position: relative; z-index: 1; max-width: 1140px; margin: 64px auto 0; }
        .valores-label { display: block; text-align: center; font-family: var(--font-brand), sans-serif; font-size: 11px; letter-spacing: 0.2em; font-weight: 700; color: #93aabb; margin-bottom: 28px; }
        .valores-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .valor { padding: 26px 24px; border-radius: 16px; background: rgba(4,28,44,0.55); border: 1px solid rgba(255,255,255,0.08); }
        .valor-icon { width: 42px; height: 42px; border-radius: 12px; background: rgba(4,235,255,0.08); display: flex; align-items: center; justify-content: center; }
        .valor h3 { font-family: var(--font-brand), sans-serif; font-size: 16px; font-weight: 600; margin: 16px 0 6px; color: #eaf2f8; }
        .valor p { font-size: 13.5px; line-height: 1.65; color: #aebfcd; margin: 0; }

        /* ── Cómo trabajamos ────────────────────────────────────────── */
        .proceso { padding: 96px 48px; background: #f3f7fb; }
        .proceso-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 1180px; margin: 0 auto; }
        :global(.proceso-item) { padding: 30px 26px; border-radius: 18px; background: #ffffff; border: 1px solid rgba(5,17,30,0.07); }
        .proceso-num { font-family: var(--font-brand), sans-serif; font-size: 30px; color: #0b5f75; font-weight: 600; margin-bottom: 14px; }
        :global(.proceso-item) h3 { font-family: var(--font-brand), sans-serif; font-size: 17px; font-weight: 600; margin: 0 0 8px; color: #05111e; }
        :global(.proceso-item) p { font-size: 14px; color: #4a5866; line-height: 1.7; margin: 0; }

        /* ── Contacto ───────────────────────────────────────────────── */
        .contacto { padding: 96px 48px; background: #05111e; color: #eaf2f8; display: flex; justify-content: center; }
        :global(.contacto-inner) { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; }
        .contacto h2 { font-family: var(--font-brand), sans-serif; font-size: clamp(1.6rem, 3vw, 2.1rem); font-weight: 600; margin: 14px 0 12px; text-wrap: balance; }
        .contacto-sub { font-size: 14.5px; line-height: 1.7; color: #c3d2de; margin: 0 0 34px; max-width: 52ch; }
        .quote-form { width: 100%; max-width: 520px; text-align: left; display: flex; flex-direction: column; gap: 16px; }
        .qf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .quote-form label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #c3d2de; }
        .quote-form input, .quote-form select, .quote-form textarea { background: rgba(255,255,255,0.05); border: 1px solid #123048; border-radius: 8px; padding: 12px 14px; color: #eaf2f8; font-family: inherit; font-size: 14px; }
        .quote-form select option { color: #05111e; }
        .quote-form input:focus, .quote-form select:focus, .quote-form textarea:focus { outline: none; border-color: #04ebff; }
        .quote-form textarea { resize: vertical; min-height: 90px; }
        .consent-row { flex-direction: row !important; align-items: flex-start; gap: 8px !important; font-size: 12px !important; line-height: 1.5; cursor: pointer; }
        .consent-row input { margin-top: 2px; flex-shrink: 0; }
        .consent-row :global(a) { color: #04ebff; }
        .form-error { color: #ff9f9f; font-size: 13px; margin: 0; }
        .qf-submit { background: #04ebff; color: #04141e; border: none; border-radius: 999px; padding: 14px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background 0.2s, transform 0.2s; }
        .qf-submit:hover:not(:disabled) { background: #5df0ff; transform: translateY(-1px); }
        .qf-submit:disabled { opacity: 0.6; cursor: wait; }
        .form-ok { padding: 12px 0 0; }
        .form-ok-check { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: rgba(57,255,106,0.12); border: 1px solid rgba(57,255,106,0.4); color: #39ff6a; font-size: 1.2rem; margin-bottom: 12px; }
        .form-ok p { color: #c4d3e0; font-size: 14px; }

        /* ── Banner de marca ────────────────────────────────────────── */
        /* clamp() en vez de aspect-ratio fijo: en un monitor ultra-wide el
           banner no crece sin límite frente al resto de secciones. */
        .brand-banner { position: relative; width: 100%; height: clamp(280px, 32vw, 620px); background: #05111e; overflow: hidden; }
        :global(.brand-banner-img) { object-fit: cover; object-position: center; }
        .brand-banner-fade { position: absolute; left: 0; right: 0; height: clamp(40px, 9vw, 100px); z-index: 1; pointer-events: none; }
        .brand-banner-fade-top { top: 0; background: linear-gradient(180deg, #05111e 0%, rgba(5,17,30,0) 100%); }
        .brand-banner-fade-bottom { bottom: 0; background: linear-gradient(0deg, #030a12 0%, rgba(3,10,18,0) 100%); }
        @media (max-width: 640px) {
          .brand-banner { height: auto; aspect-ratio: 1408 / 688; }
          :global(.brand-banner-img) { object-fit: contain; }
          .brand-banner-fade { height: 36px; }
        }

        /* ── Footer ─────────────────────────────────────────────────── */
        .foot { background: #030a12; color: #eaf2f8; padding: 64px 48px 0; }
        .foot-top { max-width: 1200px; margin: 0 auto; }
        .foot-headline { font-family: var(--font-brand), sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 600; max-width: 20ch; line-height: 1.2; }
        .foot-badge { display: flex; align-items: center; gap: 8px; margin-top: 14px; }
        .foot-badge svg { width: 14px; height: 14px; }
        .foot-badge span { font-size: 12px; color: #93aabb; }
        .foot-cols { max-width: 1200px; margin: 48px auto 0; display: grid; grid-template-columns: 1.2fr repeat(4, 1fr); gap: 20px; }
        .foot-col { display: flex; flex-direction: column; gap: 11px; font-size: 13px; }
        .foot-col :global(a) { color: #c4d3e0; text-decoration: none; }
        .foot-col :global(a:hover) { color: #04ebff; }
        .foot-col span { color: #93aabb; }
        .foot-heading { font-family: var(--font-brand), sans-serif; font-size: 11px; letter-spacing: 0.1em; color: #93aabb !important; margin-bottom: 2px; }
        .foot-logo { display: flex; align-items: center; gap: 8px; }
        .foot-desc { font-size: 13px; color: #93aabb; line-height: 1.6; max-width: 26ch; }
        /* El padding inferior reserva el espacio del botón flotante de chat, que si no tapa el aviso legal. */
        .foot-bottom { max-width: 1200px; margin: 48px auto 0; padding: 24px 0 96px; border-top: 1px solid #123048; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; color: #93aabb; }
        .foot-legal { display: flex; gap: 24px; }
        .foot-legal :global(a) { color: #93aabb; }

        /* ── Responsivo ─────────────────────────────────────────────── */
        @media (max-width: 1080px) {
          .proceso-grid { grid-template-columns: 1fr 1fr; }
          .valores-grid { grid-template-columns: 1fr 1fr; }
          :global(.enfoque-copy) { padding: 48px 40px; }
        }

        @media (max-width: 900px) {
          .hero-inner { padding: 40px 24px; }
          .hero-content { max-width: none; }
          .desafio-grid, .serv-grid, .mv-grid, .qf-row { grid-template-columns: 1fr; }
          .nos-inner { grid-template-columns: 1fr; gap: 44px; }
          .enfoque { flex-direction: column; }
          .enfoque-visual, :global(.enfoque-copy) { flex: 0 0 auto; max-width: 100%; order: initial; }
          :global(.enfoque-copy) { padding: 44px 24px 56px; }
          .foot-cols { grid-template-columns: 1fr 1fr; }
          .nav-pill { display: none; }
          .nav-cta { display: inline-flex; align-items: center; justify-content: center; padding: 10px 14px; font-size: 12px; white-space: nowrap; }
          .nav-burger { display: flex; }
          .nav-mobile { display: flex; }
          .desafio, .servicios, .nosotros, .mv, .proceso, .contacto { padding: 72px 24px; }
          :global(.section-title) { margin-bottom: 40px; }
          :global(.mv-card) { padding: 34px 28px; }
          :global(.mv-card) p { font-size: 16.5px; }
        }

        @media (max-width: 560px) {
          .nav { padding: 12px 16px; }
          .brand-name { font-size: 13px; }
          .nav-cta { padding: 9px 11px; font-size: 11px; }
          .hero-inner { padding: 32px 18px; }
          .desafio, .servicios, .nosotros, .mv, .proceso, .contacto, .foot { padding-left: 20px; padding-right: 20px; }
          .proceso-grid, .valores-grid, .principios { grid-template-columns: 1fr; }
          .foot-cols { grid-template-columns: 1fr; gap: 28px; }
          .foot-top, .foot-bottom { flex-direction: column; align-items: flex-start; }
          :global(.section-title) { font-size: 1.4rem; }
          :global(.serv-card) { padding: 30px 24px; }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.reveal) { transition: none; opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
