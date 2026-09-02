import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ChatWidget from '../components/ChatWidget';

const SITE_URL = 'https://www.ethosia.tech';

const AREAS = [
  'Inteligencia artificial',
  'Ciberseguridad y auditoría',
  'Software a medida',
  'Consultoría tecnológica',
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
        <title>Ethos IA — Inteligencia Artificial, Ciberseguridad y Software</title>
        <meta
          name="description"
          content="Ethos IA integra inteligencia artificial, ciberseguridad y software a medida para ayudar a las empresas a crecer con seguridad, control y confianza."
        />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#0a0f1a" />
        <meta
          name="keywords"
          content="Ethos IA, software a medida Ecuador, inteligencia artificial responsable, auditoría IA, consultoría tecnológica, automatización empresarial, desarrollo web Cuenca"
        />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ethos IA" />
        <meta property="og:title" content="Ethos IA — Inteligencia Artificial, Ciberseguridad y Software" />
        <meta
          property="og:description"
          content="Software a medida e inteligencia artificial responsable, construida en Ecuador para competir en cualquier parte del mundo."
        />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/empresa/hero-cyborg-cube-v1.jpg`} />
        <meta property="og:locale" content="es_EC" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ethos IA — Inteligencia Artificial, Ciberseguridad y Software" />
        <meta
          name="twitter:description"
          content="Software a medida e inteligencia artificial responsable, construida en Ecuador para competir en cualquier parte del mundo."
        />
        <meta name="twitter:image" content={`${SITE_URL}/empresa/hero-cyborg-cube-v1.jpg`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
              name: 'Pérez & Herrera S.A.S.',
              alternateName: 'Ethos IA',
              url: SITE_URL,
              logo: `${SITE_URL}/empresa/ethos-ia-logo.png`,
              description:
                'Ethos IA integra inteligencia artificial, ciberseguridad y software a medida para ayudar a las empresas a crecer con seguridad, control y confianza.',
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
            <Image src="/empresa/ethos-ia-logo.png" alt="Ethos IA" width={40} height={40} className="brand-mark-img" />
          </span>
          <span className="brand-name">Ethos IA</span>
        </a>
        <div className="nav-pill">
          <a className="nav-pill-link" href="#lineas">Software</a>
          <a className="nav-pill-link" href="#ethos">Ética &amp; IA</a>
          <a className="nav-pill-link" href="#historia">Nosotros</a>
          <Link className="nav-pill-link" href="/equipo">Equipo</Link>
        </div>
        <div className="nav-right">
          <a className="nav-cta" href="#contacto">Solicitar cotización</a>
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
        <a href="#lineas" onClick={() => setMenuOpen(false)}>Software</a>
        <a href="#ethos" onClick={() => setMenuOpen(false)}>Ética &amp; IA</a>
        <a href="#historia" onClick={() => setMenuOpen(false)}>Nosotros</a>
        <Link href="/equipo" onClick={() => setMenuOpen(false)}>Equipo</Link>
        <a className="nav-mobile-cta" href="#contacto" onClick={() => setMenuOpen(false)}>Solicitar cotización</a>
      </div>

      <header className="hero" id="top">
        <Image
          src="/empresa/hero-cyborg-cube-v1.jpg"
          alt="Androide humanoide junto al símbolo del cubo Ethos IA, sobre un fondo de red digital — investigación en inteligencia artificial responsable"
          fill
          priority
          className="hero-bg-img"
        />
        <div className="hero-scrim" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="eyebrow">INTELIGENCIA ARTIFICIAL · CIBERSEGURIDAD · SOFTWARE</span>
            <h1>Integra inteligencia artificial con seguridad, control y visión de negocio.</h1>
            <p className="hero-sub">
              Ethos IA ayuda a las empresas a adoptar inteligencia artificial de forma segura,
              responsable y controlada. Combinamos software a medida, ciberseguridad y auditoría
              tecnológica para proteger tus datos, procesos, infraestructura y reputación.
            </p>
            <div className="hero-actions">
              <a className="hero-btn primary" href="#contacto">Hablar con un especialista</a>
              <a className="hero-btn ghost" href="#ethos">Conocer nuestro enfoque</a>
            </div>
          </div>
        </div>
      </header>

      <section className="xyz">
        <Reveal as="span" className="section-label">NUESTRO ENFOQUE CORPORATIVO</Reveal>
        <Reveal as="h2" className="xyz-title">Tecnología estratégica para empresas que no pueden improvisar</Reveal>
        <div className="xyz-grid">
          <Reveal className="xyz-item">
            <span className="xyz-tag">EL PROBLEMA</span>
            <p>
              Muchas organizaciones ya incorporan inteligencia artificial en sus procesos, pero sin
              una estrategia clara de seguridad, gobernanza ni control. Esa falta de preparación
              puede abrir brechas de ciberseguridad, provocar errores operativos y exponer datos sensibles.
            </p>
          </Reveal>
          <Reveal className="xyz-item" style={{ transitionDelay: '90ms' }}>
            <span className="xyz-tag">LA SOLUCIÓN</span>
            <p>
              Analizamos cómo funciona la IA dentro de tu operación, evaluamos riesgos, detectamos
              amenazas y diseñamos mecanismos de control. Así la tecnología se integra de forma
              segura, transparente y alineada con los objetivos de tu organización.
            </p>
          </Reveal>
          <Reveal className="xyz-item" style={{ transitionDelay: '160ms' }}>
            <span className="xyz-tag">EL IMPACTO</span>
            <p>
              Eficiencia, continuidad operativa y confianza verificable. Protegemos la información,
              fortalecemos la infraestructura y convertimos la IA en un aliado estratégico, no en
              una fuente de vulnerabilidad o riesgo operativo.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="grid grid-2" id="lineas" aria-label="Capacidades corporativas">
        <Reveal as="article" className="card card-teal">
          <div className="card-bg">
            <Image src="/empresa/software-bg.webp" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className="card-bg-img" />
            <div className="card-scrim card-scrim-teal" />
          </div>
          <div className="card-content">
            <span className="card-tag">SOFTWARE A MEDIDA Y AUTOMATIZACIÓN</span>
            <div className="card-icon-wrap">
              <span className="card-icon card-icon-ink">
                <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#2fd8c9" strokeWidth="1.8" aria-hidden="true">
                  <path d="M8 6 2 12l6 6M16 6l6 6-6 6M13.5 4 10.5 20" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <h2>Software que se adapta a tu negocio y convierte procesos en activos digitales</h2>
            <p className="card-detail">
              Diseñamos, programamos e implementamos soluciones que se acoplan a tus procesos reales.
              Automatizamos tareas, conectamos sistemas y construimos arquitecturas escalables con
              transferencia total de propiedad del código: tu inversión se convierte en un activo
              tecnológico, no en una dependencia eterna.
            </p>
          </div>
        </Reveal>

        <Reveal as="article" className="card card-dark" style={{ transitionDelay: '80ms' }}>
          <div className="card-bg">
            <Image src="/empresa/auditoria-bg.webp" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className="card-bg-img" />
            <div className="card-scrim card-scrim-dark" />
          </div>
          <div className="card-content">
            <span className="card-tag card-tag-light">CIBERSEGURIDAD, AUDITORÍA Y GOBERNANZA DE IA</span>
            <div className="card-icon-wrap">
              <span className="card-icon"><Mark size={34} light /></span>
            </div>
            <h2 className="light">Protección y control para adoptar IA sin exponer tu operación</h2>
            <p className="card-detail light">
              Evaluamos modelos, procesos e infraestructura antes y durante la puesta en producción.
              Identificamos sesgos, brechas, amenazas y riesgos de cumplimiento para proteger tus
              datos y tu reputación, con alineación técnica a la Ley Orgánica de Protección de
              Datos Personales (LOPDP) de Ecuador.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="ethos-deep" id="ethos">
        <div className="ethos-visual">
          <Image
            src="/empresa/ethos-cube-wordmark.jpg"
            alt="Símbolo del cubo Ethos IA junto a un androide, representando la investigación en inteligencia artificial responsable"
            fill
            className="ethos-img"
          />
        </div>
        <Reveal className="ethos-copy">
          <span className="eyebrow accent">LA PROPUESTA DE ETHOS IA</span>
          <h2>La inteligencia artificial necesita estrategia, seguridad y responsabilidad</h2>
          <p>
            Ethos IA es una firma especializada en ética, gobernanza y seguridad aplicada a la
            inteligencia artificial. Acompañamos a organizaciones que ya incorporan IA, pero
            necesitan evaluar, controlar y mitigar los riesgos asociados a su adopción.
          </p>
          <p className="ethos-vision">
            Combinamos inteligencia artificial, ciberseguridad y desarrollo de software para que la
            tecnología se convierta en una herramienta de crecimiento, eficiencia y confianza,
            nunca en una fuente de exposición, vulnerabilidad o riesgo operativo.
          </p>
        </Reveal>
      </section>

      <section className="historia" id="historia">
        <div className="historia-bg">
          <Image src="/empresa/historia-bg.webp" alt="" fill sizes="100vw" className="historia-bg-img" />
          <div className="historia-scrim" />
        </div>
        <Reveal as="span" className="section-label light">NUESTRA HISTORIA</Reveal>
        <Reveal as="h2" className="historia-title light">De una oficina en casa, en Cuenca, a construir la inteligencia artificial que representará a Ecuador en Latinoamérica</Reveal>
        <div className="historia-grid">
          <Reveal className="historia-item">
            <div className="proceso-num">5</div>
            <h3>El comienzo</h3>
            <p>
              Como las firmas de tecnología que hoy admira el mundo, todo empezó en un espacio
              pequeño: una oficina en casa, en Cuenca. Sin gran infraestructura ni departamento de
              marketing — solo la convicción de construir software capaz de competir con cualquier
              consultora internacional.
            </p>
          </Reveal>
          <Reveal className="historia-item" style={{ transitionDelay: '90ms' }}>
            <div className="proceso-num">↑</div>
            <h3>La prueba</h3>
            <p>
              Cinco años entregando software de nivel corporativo de forma ininterrumpida — medido
              en cada arquitectura, cada auditoría y cada proyecto completado — sosteniendo ese
              ritmo de entrega incluso sin el respaldo de una estructura legal formal.
            </p>
          </Reveal>
          <Reveal className="historia-item" style={{ transitionDelay: '160ms' }}>
            <div className="proceso-num">✓</div>
            <h3>Lo que viene</h3>
            <p>
              Esa misma experiencia opera hoy bajo Pérez &amp; Herrera S.A.S., con la ambición de
              convertirse en una empresa pionera de inteligencia artificial en Ecuador — y un
              referente a nivel de Latinoamérica.
            </p>
          </Reveal>
        </div>
        <Reveal className="historia-cta-bottom" style={{ transitionDelay: '220ms' }}>
          <Link className="historia-btn" href="/equipo">Conocer al equipo directivo →</Link>
        </Reveal>
      </section>

      <section className="mv" id="mision">
        <Reveal>
          <span className="mv-label teal">MISIÓN</span>
          <p>
            Que ninguna empresa ecuatoriana vuelva a perder dinero por software que no se ajusta a
            su operación, ni asuma el riesgo de una inteligencia artificial o una infraestructura
            que nadie evalúa.
          </p>
        </Reveal>
        <Reveal style={{ transitionDelay: '90ms' }}>
          <span className="mv-label gold">VISIÓN</span>
          <p>
            Que &quot;hecho en Ecuador&quot; deje de ser una disculpa y se convierta en una garantía:
            ser la firma que una empresa elige para construir software, proteger su operación y
            adoptar inteligencia artificial con confianza.
          </p>
        </Reveal>
        <Reveal style={{ transitionDelay: '160ms' }}>
          <span className="mv-label ink">COMPROMISO</span>
          <p>
            Escribimos código para que dure, no para desecharse. Cada arquitectura que diseñamos
            busca reducir el desperdicio computacional de nuestros clientes — menos servidores,
            procesos más cortos, infraestructura que no se reemplaza cada año. Para nosotros, la
            responsabilidad ambiental de una empresa de software empieza por la eficiencia de lo que
            construye.
          </p>
        </Reveal>
      </section>

      <section className="proceso">
        <Reveal as="span" className="section-label">CÓMO TRABAJAMOS</Reveal>
        <Reveal as="h2" className="proceso-title">Cada fase protege tu inversión, no solo entrega código</Reveal>
        <div className="proceso-grid">
          {[
            ['01', 'Diagnóstico', 'Antes de escribir una sola línea de código, mapeamos tu operación real: dónde se pierde tiempo, qué proceso se rompe, qué decisión depende de datos que hoy nadie audita. Diagnosticar mal el problema es la forma más cara de construir la solución equivocada — ese costo lo evitamos desde el día uno.'],
            ['02', 'Diseño', 'Cada sistema se diseña desde cero para tu flujo de trabajo — no adaptamos una plantilla genérica a tu negocio. Una arquitectura mal pensada se paga después en horas de soporte y reescrituras; una bien pensada se paga sola en el tiempo y el dinero que no vas a perder.'],
            ['03', 'Desarrollo', 'Construcción iterativa con entregas visibles desde la primera semana — nunca una caja negra que aparece meses después. Cada entrega es una oportunidad de corregir el rumbo antes de que un error de alcance te cueste semanas de presupuesto.'],
            ['04', 'Acompañamiento', 'El trabajo no termina en el lanzamiento. Un sistema sin mantenimiento se convierte en un pasivo técnico que cuesta más reparar que construir de nuevo — lo sostenemos con la misma disciplina que garantizó cinco años de operación real, para que nunca llegues a ese punto.'],
          ].map(([n, t, d], i) => (
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
          <span className="eyebrow accent">HABLEMOS</span>
          <h2>¿Tienes un proyecto en mente?</h2>

          {status === 'ok' ? (
            <div className="form-ok">
              <span className="form-ok-check">✓</span>
              <p>Solicitud enviada. Te escribimos pronto.</p>
            </div>
          ) : (
            <>
              <p className="contacto-sub">Un miembro real del equipo te responde en 48 horas.</p>
              <form className="quote-form" onSubmit={handleSubmit}>
                <div className="qf-row">
                  <label>
                    <span>Nombre</span>
                    <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre" />
                  </label>
                  <label>
                    <span>Correo</span>
                    <input required type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} placeholder="tu@correo.com" />
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
                  <textarea rows={4} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} placeholder="..." />
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
          src="/empresa/ethos-ia-brand-banner.png"
          alt="Cubo de Ethos IA sobre fondo de red neuronal, con el lema: tecnología ecuatoriana construida para competir al más alto nivel"
          fill
          sizes="100vw"
          className="brand-banner-img"
        />
        {/* Mismo patrón que .historia-scrim / .hero-scrim: una capa de
            degradado del mismo color que la sección vecina para que la
            imagen se funda con el negro de arriba (contacto) y abajo
            (footer) en vez de cortar en seco. */}
        <div className="brand-banner-fade brand-banner-fade-top" />
        <div className="brand-banner-fade brand-banner-fade-bottom" />
      </section>

      <footer className="foot">
        <div className="foot-top">
          <div className="foot-headline">Inteligencia artificial segura, software sólido y tecnología que puedes auditar.</div>
          <div className="foot-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5c7267" strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Sociedad por Acciones Simplificada — inscrita en Ecuador</span>
          </div>
        </div>

        <div className="foot-cols">
          <div className="foot-col foot-col-brand">
            <div className="foot-logo">
              <span className="brand-badge small"><Mark size={13} light /></span>
              <span className="brand-name">Ethos IA</span>
            </div>
            <span className="foot-desc">Software a medida e inteligencia artificial responsable, desde Cuenca para Ecuador.</span>
          </div>
          <div className="foot-col">
            <span className="foot-heading">SOFTWARE</span>
            <a href="#lineas">Desarrollo a medida</a>
            <a href="#lineas">Consultoría técnica</a>
            <a href="#contacto">Integraciones</a>
            <a href="#contacto">Soporte y mantenimiento</a>
          </div>
          <div className="foot-col">
            <span className="foot-heading">ÉTICA &amp; IA</span>
            <a href="#ethos">Auditoría de sesgos</a>
            <a href="#ethos">Investigación aplicada</a>
            <a href="#contacto">Asesoría en IA responsable</a>
          </div>
          <div className="foot-col">
            <span className="foot-heading">EMPRESA</span>
            <a href="#mision">Misión y visión</a>
            <Link href="/equipo">Equipo</Link>
            <a href="#contacto">Contacto</a>
            <span>Pérez &amp; Herrera S.A.S.</span>
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
          <span>Ethos IA es una marca de Pérez &amp; Herrera S.A.S. — Cuenca, Azuay, Ecuador</span>
          <div className="foot-legal">
            <a href="/privacidad.html" target="_blank" rel="noopener noreferrer">Política de privacidad</a>
            <span>© 2026 Pérez &amp; Herrera S.A.S.</span>
          </div>
        </div>
      </footer>

      <ChatWidget />

      <style jsx>{`
        :global(html) { scroll-behavior: smooth; }
        :global(body) {
          background: #eaf3f8;
          color: #0c1726;
          font-family: 'IBM Plex Sans', sans-serif;
          margin: 0;
        }
        .page {
          font-family: 'IBM Plex Sans', -apple-system, sans-serif;
          color: #0a0f1a;
          background: linear-gradient(180deg, #eff5f8 0%, #edf2f7 100%);
          min-height: 100vh;
          overflow-x: hidden;
        }
        a { color: #12766d; text-decoration: none; }
        a:hover { color: #1bc7b7; }

        :global(.reveal) { opacity: 0; transform: translateY(22px); transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1); }
        :global(.reveal.in) { opacity: 1; transform: translateY(0); }

        .nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 32px;
          position: sticky; top: 0; z-index: 20;
          background: rgba(10, 15, 26, 0.65);
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
        .brand-badge { width: 40px; height: 40px; border-radius: 50%; background: rgba(47,216,201,0.12); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
        .brand-badge.small { width: 26px; height: 26px; }
        :global(.brand-mark-img) { width: 100%; height: 100%; object-fit: cover; }
        .brand-name { font-family: Georgia, serif; font-size: 15px; font-weight: 600; color: #eef3f6; }
        .nav-pill { display: flex; gap: 6px; padding: 6px; border: 1px solid rgba(255,255,255,0.14); border-radius: 999px; background: rgba(255,255,255,0.02); }
        .nav-pill-link {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 36px; box-sizing: border-box;
          padding: 9px 18px; font-size: 13px; line-height: 1;
          color: #eef3f6; border-radius: 999px;
          transition: background 0.2s, color 0.2s;
        }
        .nav-pill-link:hover { background: rgba(47,216,201,0.12); color: #2fd8c9; }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .nav-login { font-size: 13px; color: #c9d1cc; }
        .nav-cta {
          padding: 12px 24px; background: linear-gradient(135deg, #dffef8 0%, #b7fff1 100%);
          color: #0a0f1a; border-radius: 999px; font-weight: 700; font-size: 13px;
          box-shadow: 0 14px 26px rgba(31, 200, 183, 0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .nav-cta:hover {
          color: #0a0f1a; background: linear-gradient(135deg, #ebfffc 0%, #84f6dd 100%);
          transform: translateY(-1px);
          box-shadow: 0 18px 32px rgba(31, 200, 183, 0.24);
        }

        .nav-burger { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.16); border-radius: 10px; background: transparent; cursor: pointer; padding: 0; }
        .nav-burger span { display: block; width: 18px; height: 2px; background: #eef3f6; margin: 0 auto; transition: transform 0.25s, opacity 0.25s; }
        .nav-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-burger.open span:nth-child(2) { opacity: 0; }
        .nav-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .nav-mobile { display: none; flex-direction: column; position: sticky; top: 65px; z-index: 9; background: rgba(10,15,26,0.96); border-bottom: 1px solid rgba(255,255,255,0.08); overflow: hidden; max-height: 0; transition: max-height 0.3s ease; }
        .nav-mobile.open { max-height: 400px; }
        .nav-mobile :global(a) { padding: 16px 32px; font-size: 15px; color: #eef3f6; border-top: 1px solid rgba(255,255,255,0.08); }
        .nav-mobile :global(a:hover) { color: #2fd8c9; }
        .nav-mobile-cta { color: #2fd8c9 !important; font-weight: 700; }

        .hero { position: relative; min-height: 92vh; display: flex; align-items: center; overflow: hidden; background: #0a0f1a; }
        :global(.hero-bg-img) {
          object-fit: cover; object-position: 100% 50%; z-index: 0;
        }
        .hero-scrim {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(to right, rgba(10,15,26,0.96) 0%, rgba(10,15,26,0.78) 30%, rgba(10,15,26,0.32) 58%, rgba(10,15,26,0.18) 100%),
            radial-gradient(circle at 20% 75%, rgba(47,216,201,0.12), transparent 34%),
            radial-gradient(circle at 6% 12%, rgba(169,116,27,0.10), transparent 24%);
        }
        .hero-inner { position: relative; z-index: 2; width: 100%; padding: 40px 48px 40px; }
        .hero-content { max-width: 640px; }
        .eyebrow { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.18em; color: #2fd8c9; }
        .eyebrow.accent { color: #2fd8c9; }
        .hero h1 {
          font-family: Georgia, serif; font-size: clamp(2.1rem, 3.8vw, 3.2rem); line-height: 1.12;
          font-weight: 600; margin: 16px 0 0; color: #eef3f6; text-wrap: balance;
          letter-spacing: -0.02em;
        }
        .hero-sub { font-size: 16px; line-height: 1.7; color: #d5dde3; margin: 22px 0 0; max-width: 52ch; }
        .hero-actions { display: flex; gap: 14px; margin-top: 34px; flex-wrap: wrap; }
        .hero-btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 13px 26px; border-radius: 999px; font-weight: 700; font-size: 14px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .hero-btn.primary {
          background: linear-gradient(135deg, #5ef6dc 0%, #2fd8c9 100%);
          color: #04140a; box-shadow: 0 18px 32px rgba(47, 216, 201, 0.18);
        }
        .hero-btn.primary:hover {
          transform: translateY(-2px); background: linear-gradient(135deg, #8afce7 0%, #6ae3d8 100%);
          box-shadow: 0 20px 36px rgba(47, 216, 201, 0.22);
        }
        .hero-btn.ghost {
          border: 1px solid rgba(238,243,246,0.35); color: #eef3f6; background: rgba(255,255,255,0.015);
        }
        .hero-btn.ghost:hover { border-color: #2fd8c9; color: #2fd8c9; box-shadow: 0 10px 26px rgba(47,216,201,0.10); }

        @media (max-width: 760px) {
          :global(.hero-bg-img) { display: none; }
          .hero-scrim {
            background:
              radial-gradient(ellipse 55% 70% at 78% 45%, rgba(47,216,201,0.16), transparent 65%),
              radial-gradient(ellipse 45% 60% at 15% 85%, rgba(232,178,58,0.08), transparent 65%);
          }
        }

        .xyz { padding: 64px 48px 24px; background: #eef3f6; }
        :global(.xyz-title) { display: block; text-align: center; font-family: Georgia, serif; font-size: clamp(1.5rem, 2.8vw, 2rem); font-weight: 600; max-width: 26ch; margin: 0 auto 48px; color: #0a0f1a; }
        .xyz-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1100px; margin: 0 auto; }
        :global(.xyz-item) { padding: 28px 26px; border-radius: 12px; background: #ffffff; border: 1px solid rgba(10,15,26,0.08); }
        .xyz-tag { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.14em; font-weight: 700; color: #186a63; margin-bottom: 14px; }
        :global(.xyz-item) p { font-size: 14px; color: #3d474e; line-height: 1.7; margin: 0; }

        .grid { padding: 0 48px 20px; display: grid; margin-top: 40px; }
        .grid-2 { grid-template-columns: 1fr 1fr; gap: 24px; }
        :global(.card) { position: relative; overflow: hidden; border-radius: 14px; min-height: 380px; }
        :global(.card-teal) { background: #1fa89c; }
        :global(.card-dark) { background: #0a0f1a; }
        .card-bg { position: absolute; inset: 0; z-index: 0; }
        :global(.card-bg-img) { object-fit: cover; }
        .card-scrim { position: absolute; inset: 0; }
        .card-scrim-teal { background: linear-gradient(155deg, rgba(91,232,219,0.55) 0%, rgba(47,216,201,0.6) 55%, rgba(20,90,84,0.75) 100%); }
        .card-scrim-dark { background: linear-gradient(165deg, rgba(10,15,26,0.55) 0%, rgba(10,15,26,0.85) 100%); }
        .card-content { position: relative; z-index: 1; padding: 36px; display: flex; flex-direction: column; gap: 14px; }
        .card-tag { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.14em; color: #04302c; font-weight: 700; }
        .card-tag-light { color: #2fd8c9; }
        :global(.card) h2 { font-family: 'IBM Plex Sans', sans-serif; font-size: 26px; line-height: 1.2; font-weight: 700; max-width: 16ch; margin: 0; color: #04140a; }
        :global(.card) h2.light { color: #eef3f6; max-width: 16ch; font-size: 22px; }
        .card-icon-wrap { margin: 8px 0; display: flex; align-items: center; justify-content: center; }
        .card-icon { width: 80px; height: 80px; border-radius: 50%; background: #2fd8c9; display: flex; align-items: center; justify-content: center; }
        .card-icon.card-icon-ink { background: #0a0f1a; }
        .card-detail { font-size: 13px; line-height: 1.65; color: #04302c; margin: 0; }
        .card-detail.light { color: #a9b8c4; }


        .ethos-deep { display: flex; align-items: stretch; background: #0a0f1a; color: #eef3f6; }
        :global(.ethos-visual) { position: relative; flex: 0 0 50%; max-width: 50%; aspect-ratio: 1376 / 768; order: 2; }
        :global(.ethos-img) { object-fit: cover; }
        :global(.ethos-copy) { order: 1; flex: 0 0 50%; max-width: 50%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; padding: 48px 56px; }
        .ethos-deep .eyebrow { font-size: 13px; margin-bottom: 4px; }
        .ethos-deep h2 { font-family: Georgia, serif; font-size: clamp(1.8rem, 3.4vw, 2.5rem); line-height: 1.25; font-weight: 600; margin: 18px 0 22px; }
        .ethos-deep p { font-size: 16.5px; line-height: 1.8; color: #a9b8c4; margin: 0 0 18px; }
        .ethos-vision { color: #eef3f6 !important; font-style: italic; font-size: 17.5px !important; }

        @media (max-width: 900px) {
          .ethos-deep { flex-direction: column; }
          :global(.ethos-visual), :global(.ethos-copy) { flex: 0 0 auto; max-width: 100%; order: initial; }
          :global(.ethos-copy) { padding: 40px 24px; }
        }

        .historia { position: relative; overflow: hidden; padding: 88px 48px; background: #0a0f1a; }
        .historia-bg { position: absolute; inset: 0; z-index: 0; }
        :global(.historia-bg-img) { object-fit: cover; }
        .historia-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,15,26,0.55) 0%, rgba(10,15,26,0.88) 100%); }
        :global(.historia-title) { position: relative; z-index: 1; display: block; text-align: center; font-family: Georgia, serif; font-size: clamp(1.5rem, 2.8vw, 2rem); font-weight: 600; max-width: 30ch; margin: 0 auto 48px; color: #0a0f1a; }
        :global(.historia-title.light) { color: #eef3f6; }
        .historia-grid { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; max-width: 1100px; margin: 0 auto; }
        :global(.historia-item) h3 { font-family: Georgia, serif; font-size: 18px; font-weight: 600; margin: 0 0 10px; color: #eef3f6; }
        :global(.historia-item) p { font-size: 14px; color: #b7c2ca; line-height: 1.7; margin: 0; }
        :global(.historia-item) .proceso-num { color: #2fd8c9; }
        :global(.historia-cta-bottom) { position: relative; z-index: 1; display: block; text-align: right; max-width: 1100px; margin: 56px auto 0; }
        :global(.historia-btn) { display: inline-block; padding: 14px 30px; border-radius: 999px; background: #2fd8c9; color: #04140a; font-weight: 700; font-size: 14px; transition: background 0.2s, transform 0.2s; }
        :global(.historia-btn:hover) { background: #4fe6d8; transform: translateY(-2px); }

        .mv { padding: 72px 48px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 48px; background: #ffffff; }
        .mv-label { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.16em; font-weight: 700; margin-bottom: 14px; }
        .mv-label.teal { color: #186a63; }
        .mv-label.gold { color: #a87a1e; }
        .mv-label.ink { color: #5c666e; }
        .mv p { font-family: Georgia, serif; font-size: 17px; line-height: 1.65; color: #1a232b; margin: 0; }

        :global(.section-label) { position: relative; z-index: 1; display: block; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.18em; color: #8a9298; margin-bottom: 48px; }
        :global(.section-label.light) { color: #8fa89c; }
        .proceso { padding: 72px 48px; background: #eef3f6; }
        :global(.proceso-title) { display: block; text-align: center; font-family: Georgia, serif; font-size: clamp(1.4rem, 2.6vw, 1.9rem); font-weight: 600; max-width: 32ch; margin: 0 auto 48px; color: #0a0f1a; }
        .proceso-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px 56px; max-width: 1000px; margin: 0 auto; }
        .proceso-num { font-family: Georgia, serif; font-size: 30px; color: #186a63; font-weight: 600; margin-bottom: 12px; }
        :global(.proceso-item) h3 { font-family: Georgia, serif; font-size: 17px; font-weight: 600; margin: 0 0 8px; color: #0a0f1a; }
        :global(.proceso-item) p { font-size: 14px; color: #5c666e; line-height: 1.7; margin: 0; max-width: 42ch; }


        .contacto { padding: 80px 48px; background: #0a0f1a; color: #eef3f6; display: flex; justify-content: center; }
        :global(.contacto-inner) { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; }
        .contacto h2 { font-family: Georgia, serif; font-size: clamp(1.6rem, 3vw, 2.1rem); font-weight: 600; margin: 14px 0 10px; }
        .contacto-sub { font-size: 14px; color: #a9b8c4; margin: 0 0 32px; }
        .quote-form { width: 100%; max-width: 480px; text-align: left; display: flex; flex-direction: column; gap: 16px; }
        .qf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .quote-form label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #a9b8c4; }
        .quote-form input, .quote-form select, .quote-form textarea { background: rgba(255,255,255,0.05); border: 1px solid #1d2b42; border-radius: 6px; padding: 11px 13px; color: #eef3f6; font-family: inherit; font-size: 14px; }
        .quote-form input:focus, .quote-form select:focus, .quote-form textarea:focus { outline: none; border-color: #2fd8c9; }
        .quote-form textarea { resize: vertical; min-height: 80px; }
        .consent-row { flex-direction: row !important; align-items: flex-start; gap: 8px !important; font-size: 12px !important; line-height: 1.5; cursor: pointer; }
        .consent-row input { margin-top: 2px; flex-shrink: 0; }
        .consent-row :global(a) { color: #2fd8c9; }
        .form-error { color: #ff9f9f; font-size: 13px; margin: 0; }
        .qf-submit { background: #2fd8c9; color: #04140a; border: none; border-radius: 999px; padding: 13px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background 0.2s, transform 0.2s; }
        .qf-submit:hover:not(:disabled) { background: #4fe6d8; transform: translateY(-1px); }
        .qf-submit:disabled { opacity: 0.6; cursor: wait; }
        .form-ok { padding: 12px 0 0; }
        .form-ok-check { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: rgba(57,255,106,0.12); border: 1px solid rgba(57,255,106,0.4); color: #39ff6a; font-size: 1.2rem; margin-bottom: 12px; }
        .form-ok p { color: #c9d1cc; font-size: 14px; }

        /* clamp() en vez de aspect-ratio fijo: el alto crece con el ancho de
           pantalla (como antes) pero nunca pasa de 620px -- en un monitor
           ultra-wide de verdad, aspect-ratio puro hacía que la franja
           creciera sin límite y quedara desproporcionadamente alta frente
           al resto de secciones. */
        .brand-banner { position: relative; width: 100%; height: clamp(280px, 32vw, 620px); background: #0a0f1a; overflow: hidden; }
        :global(.brand-banner-img) { object-fit: cover; object-position: center; }
        .brand-banner-fade { position: absolute; left: 0; right: 0; height: clamp(40px, 9vw, 100px); z-index: 1; pointer-events: none; }
        .brand-banner-fade-top { top: 0; background: linear-gradient(180deg, #0a0f1a 0%, rgba(10,15,26,0) 100%); }
        .brand-banner-fade-bottom { bottom: 0; background: linear-gradient(0deg, #060a10 0%, rgba(6,10,16,0) 100%); }
        @media (max-width: 640px) {
          /* En pantallas angostas el lema queda demasiado chico si se recorta
             por altura -- se deja ver el ancho completo aunque el banner
             quede más alto, en vez de forzar el recorte de object-fit:cover. */
          .brand-banner { height: auto; aspect-ratio: 1408 / 688; }
          :global(.brand-banner-img) { object-fit: contain; }
          .brand-banner-fade { height: 36px; }
        }

        .foot { background: #060a10; color: #eef3f6; padding: 64px 48px 0; }
        .foot-top { max-width: 1200px; margin: 0 auto; }
        .foot-headline { font-family: Georgia, serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 600; max-width: 20ch; line-height: 1.2; }
        .foot-badge { display: flex; align-items: center; gap: 8px; margin-top: 14px; }
        .foot-badge svg { width: 14px; height: 14px; }
        .foot-badge span { font-size: 12px; color: #5c7267; }
        .foot-cols { max-width: 1200px; margin: 48px auto 0; display: grid; grid-template-columns: 1.2fr repeat(4, 1fr); gap: 20px; }
        .foot-col { display: flex; flex-direction: column; gap: 11px; font-size: 13px; }
        .foot-col :global(a) { color: #c9d1cc; }
        .foot-col :global(a:hover) { color: #2fd8c9; }
        .foot-col span { color: #5c7267; }
        .foot-heading { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; color: #5c7267 !important; font-style: normal !important; margin-bottom: 2px; }
        .foot-logo { display: flex; align-items: center; gap: 8px; }
        .foot-desc { font-size: 13px; color: #8fa89c; line-height: 1.6; max-width: 24ch; }
        .foot-bottom { max-width: 1200px; margin: 48px auto 0; padding: 24px 0; border-top: 1px solid #1d2b42; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; color: #5c7267; }
        .foot-legal { display: flex; gap: 24px; }
        .foot-legal :global(a) { color: #5c7267; }

        @media (max-width: 900px) {
          .grid-2 { grid-template-columns: 1fr; }
          .mv, .qf-row, .historia-grid, .xyz-grid { grid-template-columns: 1fr; }
          .proceso-grid { grid-template-columns: 1fr 1fr; row-gap: 32px; }
          .equipo-grid { grid-template-columns: 1fr; }
          .foot-cols { grid-template-columns: 1fr 1fr; }
          .nav-pill { display: none; }
          .nav-cta { display: none; }
          .nav-burger { display: flex; }
          .nav-mobile { display: flex; }
          .hero-inner { padding: 40px 24px; }
          .hero-content { max-width: none; }
        }

        @media (max-width: 480px) {
          .nav { padding: 14px 18px; }
          .brand-name { font-size: 13px; }
          .xyz, .grid, .historia, .mv, .proceso, .contacto, .foot { padding-left: 20px; padding-right: 20px; }
          .hero-inner { padding: 32px 18px; }
          .proceso-grid { grid-template-columns: 1fr; row-gap: 28px; }
          .foot-cols { grid-template-columns: 1fr; gap: 28px; }
          .foot-top, .foot-bottom { flex-direction: column; align-items: flex-start; }
          :global(.historia-title), :global(.xyz-title) { font-size: 1.35rem; }
          .qf-row { gap: 12px; }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.reveal) { transition: none; opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
