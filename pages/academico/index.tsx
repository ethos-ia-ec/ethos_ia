import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Header from '../../components/home/Header';
import Reveal from '../../components/Reveal';
import Seo from '../../components/Seo';
import CarruselAreas from '../../components/academico/CarruselAreas';
import IntroInvestigacion from '../../components/academico/IntroInvestigacion';
import PieAcademico from '../../components/academico/PieAcademico';
import { AREAS, CIFRAS, COMPROMISO, EQUIPO, PROCESO, PROYECTOS, SERVICIOS, WHATSAPP_ACADEMICO, iniciales } from '../../lib/academico';
import { migas } from '../../lib/seo';

const METODO = [
  { n: '01', titulo: 'Búsqueda en Scopus', texto: 'Ecuaciones booleanas por conceptos, conteos con y sin filtros y exportación reproducible del corpus.' },
  { n: '02', titulo: 'Cribado PRISMA 2020', texto: 'Criterios de inclusión y exclusión documentados y diagrama de flujo con cada registro justificado.' },
  { n: '03', titulo: 'Análisis con Bibliometrix', texto: 'Producción científica, redes de coautoría y cocitación, mapas temáticos y autores de mayor impacto.' },
  { n: '04', titulo: 'Matrices de revisión', texto: 'Búsqueda, cribado, extracción y síntesis temática, con el pasaje que respalda cada dato.' },
];

const DIAPOSITIVAS = [
  { id: 'marca', src: '/empresa/hero-cyborg-cube-v1.jpg', alt: '', marco: false, leyenda: 'Inteligencia artificial al servicio de la investigación rigurosa' },
  { id: 'roc', src: '/academico/OULAD_UK_roc_pr.png', alt: 'Curvas ROC y precisión-recall de un modelo predictivo validado con datos públicos.', marco: true, leyenda: 'Validación de modelos: curvas ROC y precisión-recall' },
  { id: 'consulta', src: '/academico/demo_consulta.gif', alt: 'Demostración de una pregunta en español convertida en consulta SQL.', marco: true, leyenda: 'Consultas en lenguaje natural sobre datos de investigación' },
];

const INTERVALO = 6500;

// Trazos de 24×24 para los íconos de línea de la página.
const TRAZOS: Record<string, ReactNode> = {
  microscopio: <><path d="M6 18h8M3 22h18M14 22a7 7 0 0 0 0-14h-1" /><path d="M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></>,
  birrete: <><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /><path d="M22 10v6" /></>,
  libro: <><path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2Z" /><path d="M22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8Z" /></>,
  grafico: <><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-6" /></>,
  base: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  codigo: <><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></>,
  moneda: <><circle cx="12" cy="12" r="9" /><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2m0 8v2" /></>,
  personas: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3.1-6 7-6s7 2.5 7 6" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20c0-3-1.9-5.3-4.5-5.9" /></>,
  capas: <><path d="m12 2 10 5-10 5L2 7l10-5Z" /><path d="m2 12 10 5 10-5M2 17l10 5 10-5" /></>,
  pluma: <><path d="M20 4c-8 0-14 6-14 14v2h2c8 0 14-6 14-14V4Z" /><path d="M4 22 14 12" /></>,
  diana: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  ojo: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  escudo: <><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  chispa: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></>,
  mensaje: <><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z" /></>,
  correo: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  pausa: <><path d="M9 5v14M15 5v14" /></>,
  play: <><path d="M7 4v16l13-8L7 4Z" /></>,
  flecha: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
};

function Icono({ n, size = 24 }: { n: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {TRAZOS[n]}
    </svg>
  );
}

const ICONO_CIFRA = ['capas', 'libro', 'personas', 'pluma'];

// Cuenta de 0 al valor al entrar en pantalla; valores no enteros («100 %») se muestran tal cual.
function Contador({ valor }: { valor: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [texto, setTexto] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el || !/^\d+$/.test(valor) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const meta = Number(valor);
    let raf = 0;
    setTexto('0');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const inicio = performance.now();
      const paso = (t: number) => {
        const p = Math.min(1, (t - inicio) / 1400);
        setTexto(String(Math.round(meta * (1 - Math.pow(1 - p, 3)))));
        if (p < 1) raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [valor]);

  return <span ref={ref}>{texto}</span>;
}

function Badge({ icono, children, oscuro = false }: { icono: string; children: ReactNode; oscuro?: boolean }) {
  return (
    <span className={`badge ${oscuro ? 'badge-o' : ''}`}>
      <Icono n={icono} size={15} />
      {children}
      <style jsx>{`
        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px 8px 12px; border-radius: var(--r-pill); background: rgba(11, 95, 117, 0.1); color: var(--c-teal); border: 1px solid rgba(11, 95, 117, 0.18); font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
        .badge-o { background: rgba(4, 235, 255, 0.08); color: var(--c-cian); border-color: rgba(4, 235, 255, 0.28); }
        @media (min-width: 1920px) { .badge { font-size: 15px; padding: 10px 20px 10px 14px; } }
      `}</style>
    </span>
  );
}

function Slider() {
  const [activa, setActiva] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [encima, setEncima] = useState(false);
  const [reducido, setReducido] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducido(mq.matches);
    const cambio = (e: MediaQueryListEvent) => setReducido(e.matches);
    mq.addEventListener('change', cambio);
    return () => mq.removeEventListener('change', cambio);
  }, []);

  const detenido = pausado || encima || reducido;
  useEffect(() => {
    if (detenido) return undefined;
    const t = window.setTimeout(() => setActiva((a) => (a + 1) % DIAPOSITIVAS.length), INTERVALO);
    return () => window.clearTimeout(t);
  }, [activa, detenido]);

  return (
    <section
      className="hero"
      aria-roledescription="carrusel"
      aria-label="Presentación de Ethos Académico"
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => setEncima(false)}
      onFocus={() => setEncima(true)}
      onBlur={() => setEncima(false)}
    >
      <div className="slides">
        {DIAPOSITIVAS.map((d, i) => (
          <div key={d.id} className={`slide ${d.marco ? 'con-marco' : ''} s-${d.id} ${i === activa ? 'activa' : ''}`} aria-hidden={i !== activa} role="group" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${DIAPOSITIVAS.length}`}>
            {d.marco ? (
              <>
                <div className="malla" />
                <figure className="marco">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.src} alt={d.alt} loading={i === 0 ? 'eager' : 'lazy'} />
                  <figcaption>{d.leyenda}</figcaption>
                </figure>
              </>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="fondo" src={d.src} alt={d.alt} />
            )}
          </div>
        ))}
        <div className="velo" />
      </div>

      <div className="hero-in">
        <span className="eyebrow"><i />DIVISIÓN DE INVESTIGACIÓN CIENTÍFICA</span>
        <h1>Ethos <span>Académico</span></h1>
        <p className="sub">
          Formación, asesoría y acompañamiento para investigar con rigor: de la pregunta de investigación al artículo
          científico, con fuentes indexadas, métodos reproducibles y la autoría siempre en manos de quien investiga.
        </p>
        <div className="acciones">
          <a className="btn primario" href={WHATSAPP_ACADEMICO} target="_blank" rel="noopener noreferrer">Agendar una asesoría</a>
          <a className="btn" href="#areas">Explorar las áreas</a>
          <Link className="btn" href="/academico/portafolio">Ver proyectos →</Link>
        </div>
      </div>

      <div className="controles">
        <p className="leyenda">{DIAPOSITIVAS[activa].leyenda}</p>
        <div className="mandos">
          {DIAPOSITIVAS.map((d, i) => (
            <button key={d.id} type="button" className={`punto ${i === activa ? 'on' : ''}`} aria-label={`Ir a la diapositiva ${i + 1}: ${d.leyenda}`} aria-current={i === activa} onClick={() => setActiva(i)}>
              <span className={`carga ${!detenido && i === activa ? 'corre' : ''}`} key={`${activa}-${detenido}`} />
            </button>
          ))}
          <button type="button" className="pausa" onClick={() => setPausado((p) => !p)} aria-label={pausado ? 'Reanudar la presentación' : 'Pausar la presentación'} aria-pressed={pausado}>
            <Icono n={pausado ? 'play' : 'pausa'} size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .hero { position: relative; isolation: isolate; min-height: 100svh; display: flex; flex-direction: column; justify-content: center; overflow: hidden; background: var(--c-azul); color: var(--c-claro); padding: 120px var(--gutter) 150px; }
        .slides { position: absolute; inset: 0; z-index: -1; }
        .slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1.2s var(--ease-suave); overflow: hidden; }
        .slide.activa { opacity: 1; }
        .fondo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 78% center; }
        .slide.activa .fondo, .slide.activa .marco { animation: kenburns ${INTERVALO + 1500}ms linear both; }
        @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.08); } }
        .con-marco { background: radial-gradient(60% 70% at 78% 45%, rgba(4, 235, 255, 0.18), transparent 70%), linear-gradient(135deg, var(--c-azul-profundo), var(--c-azul-2) 60%, #0c2a40); }
        .s-consulta.con-marco { background: radial-gradient(60% 70% at 78% 50%, rgba(122, 167, 255, 0.2), transparent 70%), linear-gradient(160deg, var(--c-azul-profundo), #0b2236 55%, var(--c-teal)); }
        .malla { position: absolute; inset: 0; background: linear-gradient(rgba(4, 235, 255, 0.06) 1px, transparent 1px) 0 0 / 56px 56px, linear-gradient(90deg, rgba(4, 235, 255, 0.06) 1px, transparent 1px) 0 0 / 56px 56px; mask-image: radial-gradient(ellipse at 70% 50%, #000 30%, transparent 75%); }
        .marco { position: absolute; right: max(var(--gutter), calc((100vw - var(--ancho-hero)) / 2)); top: 50%; width: min(38vw, 560px); margin: -170px 0 0; padding: 14px 14px 0; background: #fff; border-radius: var(--r-xl); box-shadow: 0 40px 90px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(4, 235, 255, 0.35); transform-origin: center; }
        .marco img { display: block; width: 100%; max-width: 100%; height: auto; max-height: 52svh; object-fit: contain; border-radius: var(--r-md); }
        .marco figcaption { padding: 12px 6px 14px; font-size: 13px; font-weight: 600; color: var(--c-texto-2); }
        .velo { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(5, 17, 30, 0.92) 0%, rgba(5, 17, 30, 0.7) 38%, rgba(5, 17, 30, 0.05) 70%), linear-gradient(0deg, rgba(5, 17, 30, 0.85), transparent 30%); pointer-events: none; }

        .hero-in { position: relative; width: 100%; max-width: var(--ancho-hero); margin: 0 auto; }
        .hero-in > * { max-width: 640px; }
        @media (min-width: 1001px) { .hero-in > * { max-width: min(640px, 50%); } .hero-in > .acciones { max-width: 100%; } }
        .eyebrow { display: inline-flex; align-items: center; gap: 10px; font: 700 12px/1 var(--f-mono); letter-spacing: 0.2em; color: var(--c-cian); }
        .eyebrow i { width: 28px; height: 2px; background: var(--c-cian); }
        h1 { font-size: clamp(2.6rem, 7vw, 5.4rem); line-height: 1.02; margin: 20px 0 0; letter-spacing: -0.02em; }
        h1 span { color: var(--c-cian); }
        .sub { color: var(--c-claro-2); font-size: var(--t-lg); line-height: 1.65; margin: 22px 0 0; }

        .controles { position: absolute; left: 0; right: 0; bottom: 36px; width: 100%; max-width: var(--ancho-hero); margin: 0 auto; padding: 0 var(--gutter); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .leyenda { margin: 0; font-size: 13px; color: var(--c-claro-2); min-width: 0; }
        .mandos { display: flex; align-items: center; gap: 10px; }
        .punto { position: relative; width: 44px; height: 24px; padding: 0; border: 0; background: none; cursor: pointer; }
        .punto::before { content: ''; position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 4px; background: rgba(234, 242, 248, 0.25); }
        .carga { position: absolute; left: 0; top: 10px; height: 4px; width: 0; border-radius: 4px; background: var(--c-cian); }
        .punto.on .carga { width: 100%; }
        .punto.on .carga.corre { width: 0; animation: llenar ${INTERVALO}ms linear forwards; }
        @keyframes llenar { to { width: 100%; } }
        .pausa { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(234, 242, 248, 0.3); background: rgba(5, 17, 30, 0.5); color: var(--c-claro); cursor: pointer; transition: border-color var(--d-rapida), color var(--d-rapida); }
        .pausa:hover { border-color: var(--c-cian); color: var(--c-cian); }

        @media (max-width: 1000px) {
          .marco { display: none; }
          .velo { background: linear-gradient(180deg, rgba(5, 17, 30, 0.55), rgba(5, 17, 30, 0.88)); }
          .fondo { object-position: 70% center; }
        }
        @media (max-width: 560px) {
          .hero { padding: 112px 16px 150px; }
          .controles { flex-direction: column; align-items: flex-start; padding: 0 16px; }
        }
        @media (min-width: 1920px) {
          .hero-in > * { max-width: min(820px, 50%); }
          h1 { font-size: 7rem; }
          .marco { width: min(36vw, 700px); margin-top: -220px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .slide { transition: none; }
          .slide.activa .fondo, .slide.activa .marco { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default function Academico() {
  const destacado = PROYECTOS[0];
  const imagen = destacado.imagenes[0];
  return (
    <div className="app">
      <Seo
        titulo="Ethos Académico — formación y asesoría en investigación científica | Ethos IA"
        descripcion="División de investigación científica de Ethos IA: asesoría metodológica, talleres y acompañamiento en tesis, artículos, estadística, Power BI y revisión sistemática con Scopus y Bibliometrix."
        ruta="/academico"
        jsonld={[migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Ethos Académico', ruta: '/academico' }])]}
      />
      <IntroInvestigacion />
      <Header />

      <Slider />

      <main id="contenido-principal">
        <section className="stats" aria-labelledby="t-cifras">
          <div className="ancho">
            <div className="centro"><Badge icono="grafico" oscuro>Nuestras estadísticas</Badge></div>
            <h2 id="t-cifras" className="sr">Ethos Académico en cifras</h2>
            <ul className="cifras">
              {CIFRAS.map((c, i) => (
                <li key={c.etiqueta}>
                  <Reveal delay={i * 90} className="cifra">
                    <span className="mosaico"><Icono n={ICONO_CIFRA[i % ICONO_CIFRA.length]} size={28} /></span>
                    <span className="dato">
                      <strong><Contador valor={c.valor} /></strong>
                      <span>{c.etiqueta}</span>
                    </span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="claro" id="nosotros">
          <div className="ancho dos">
            <Reveal className="foto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/empresa/ethos-circuit.webp" alt="Ilustración de un cerebro formado por circuitos sobre una matriz de datos." loading="lazy" />
              <span className="sello"><strong>8</strong> áreas de conocimiento</span>
            </Reveal>
            <Reveal delay={100}>
              <Badge icono="personas">Sobre nosotros</Badge>
              <h2>Una escuela de <em>investigación</em> dentro de una empresa de tecnología</h2>
              <p>
                Ethos Académico reúne a profesionales de la ingeniería, la economía, la educación y las ciencias sociales
                para fortalecer las capacidades investigativas de estudiantes de grado y posgrado de todo el país.
              </p>
              <p>
                Trabajamos con las mismas herramientas que usamos en nuestros propios proyectos: Scopus, Bibliometrix, Python, R
                y Power BI, y con una regla que no cambia: cada afirmación se respalda en una fuente verificable.
              </p>
              <div className="contacto">
                <span className="mosaico peq"><Icono n="mensaje" /></span>
                <div>
                  <strong>Atención académica</strong>
                  <span>Asesoría por WhatsApp y correo electrónico.</span>
                  <div className="enlaces">
                    <a className="subr" href={WHATSAPP_ACADEMICO} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
                    <a className="subr" href="mailto:ethos.ia.ec@gmail.com?subject=Ethos%20Acad%C3%A9mico">ethos.ia.ec@gmail.com</a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="ancho mv">
            <Reveal className="mv-card">
              <span className="mosaico"><Icono n="diana" size={26} /></span>
              <Badge icono="chispa">Misión</Badge>
              <h3>Nuestra <em>misión</em></h3>
              <p>Fortalecer las competencias científicas y metodológicas de estudiantes e investigadores mediante asesoría especializada, formación práctica y acompañamiento técnico, con ética y rigor.</p>
            </Reveal>
            <Reveal className="mv-card" delay={120}>
              <span className="mosaico"><Icono n="ojo" size={26} /></span>
              <Badge icono="chispa">Visión</Badge>
              <h3>Nuestra <em>visión</em></h3>
              <p>Ser un referente en formación investigativa en Ecuador, impulsando producción científica de alto impacto publicada en bases como Scopus y Web of Science.</p>
            </Reveal>
          </div>
        </section>

        <section className="blanco" id="areas">
          <div className="ancho">
            <div className="cabeza">
              <Reveal><Badge icono="capas">Nuestras líneas</Badge></Reveal>
              <Reveal><h2>Líneas de <em>investigación</em></h2></Reveal>
              <Reveal><p className="resumen">Ocho áreas de conocimiento, cada una con sus herramientas, normas y temas de trabajo.</p></Reveal>
            </div>
            <ul className="lineas">
              {AREAS.map((a, i) => (
                <li key={a.id}>
                  <Reveal delay={(i % 4) * 80} className={`linea l${i % 4}`}>
                    <div className="l-cab">
                      <span className="l-icono"><Icono n={a.icono} size={24} /></span>
                      <h3>{a.titulo}</h3>
                    </div>
                    <div className="l-cuerpo">
                      <p>{a.texto}</p>
                      <ul>{a.temas.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>

            <div className="panel">
              <Reveal><Badge icono="chispa" oscuro>Vista interactiva</Badge></Reveal>
              <Reveal><h2 className="claro-t">Recorre las <em>áreas</em></h2></Reveal>
              <Reveal><p className="tenue">Desliza, usa las flechas o el teclado para recorrerlas.</p></Reveal>
              <CarruselAreas areas={AREAS} />
            </div>
          </div>
        </section>

        <section className="claro" id="metodo">
          <div className="ancho">
            <div className="cabeza">
              <Reveal><Badge icono="microscopio">Método de investigación</Badge></Reveal>
              <Reveal><h2>Del corpus a la <em>síntesis</em>, paso a paso</h2></Reveal>
              <Reveal><p className="resumen">Un flujo reproducible en el que cada decisión queda documentada y respaldada con evidencia.</p></Reveal>
            </div>
            <ol className="tiempo">
              {METODO.map((m, i) => (
                <li key={m.n}>
                  <Reveal delay={i * 120} className="hito">
                    <span className="nodo">{m.n}</span>
                    <div className="hito-t">
                      <h3>{m.titulo}</h3>
                      <p>{m.texto}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="blanco" id="servicios">
          <div className="ancho">
            <div className="cabeza">
              <Reveal><Badge icono="birrete">Servicios</Badge></Reveal>
              <Reveal><h2>Formación y asesoría a la medida de cada <em>etapa</em></h2></Reveal>
            </div>
            <div className="rejilla">
              {SERVICIOS.map((s, i) => (
                <Reveal key={s.n} delay={i * 80} className="card">
                  <span className="card-n">{s.n}</span>
                  <h3>{s.titulo}</h3>
                  <p>{s.texto}</p>
                </Reveal>
              ))}
            </div>
            <h3 className="sub-t">Cómo trabajamos</h3>
            <ol className="proceso">
              {PROCESO.map((p, i) => (
                <li key={p.titulo}>
                  <Reveal delay={i * 80} className="proc">
                    <span className="proc-n">{i + 1}</span>
                    <div><strong>{p.titulo}</strong><p>{p.texto}</p></div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="oscuro" id="proyectos">
          <div className="ancho dos">
            <Reveal>
              <Badge icono="grafico" oscuro>Proyecto destacado</Badge>
              <span className="area-p">{destacado.area}</span>
              <h2 className="claro-t">{destacado.titulo}</h2>
              <p className="tenue">{destacado.texto}</p>
              <div className="tags">{destacado.etiquetas.map((t) => <span key={t}>{t}</span>)}</div>
              <div className="acciones">
                <Link className="btn primario" href="/academico/portafolio">Ver el portafolio completo →</Link>
              </div>
            </Reveal>
            <Reveal className="demo" delay={120}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagen.src} alt={imagen.descripcion} loading="lazy" />
              <span className="demo-pie">{imagen.titulo}</span>
            </Reveal>
          </div>
        </section>

        <section className="claro" id="equipo">
          <div className="ancho">
            <div className="cabeza">
              <Reveal><Badge icono="personas">Equipo</Badge></Reveal>
              <Reveal><h2>Profesionales que investigan y <em>enseñan</em></h2></Reveal>
            </div>
            <div className="personas">
              {EQUIPO.map((p, i) => (
                <Reveal key={p.perfil} delay={i * 80} className="persona">
                  <span className="avatar" aria-hidden="true">{iniciales(p.perfil)}</span>
                  <strong>{p.perfil}</strong>
                  <span className="titulo">{p.texto}</span>
                </Reveal>
              ))}
            </div>
            <p className="mas"><Link className="subr" href="/academico/equipo">Conocer al equipo completo →</Link></p>
          </div>
        </section>

        <section className="kit">
          <div className="ancho dos">
            <Reveal>
              <Badge icono="codigo" oscuro>Aporte abierto</Badge>
              <h2 className="claro-t">Ethos IA <em>Academia</em>: nuestras metodologías, abiertas a la comunidad científica</h2>
              <p className="tenue">75 metodologías y un servidor MCP que funcionan con Claude, GPT, Gemini, DeepSeek, Qwen o un modelo local. Licencia MIT.</p>
              <div className="acciones">
                <Link className="btn primario" href="/academia">Conocer el kit</Link>
              </div>
            </Reveal>
            <Reveal className="terminal" delay={120}>
              <div className="barra"><i /><i /><i /></div>
              <pre>{`$ git clone github.com/IngMarlonPerez/ethos-ia-academia
$ powershell -File instalar.ps1
  ✓ Python listo
  ✓ Metodologías registradas en tu cliente de IA
  ✓ Scopus · OpenAlex · Unpaywall`}</pre>
            </Reveal>
          </div>
        </section>

        <section className="claro" id="compromiso">
          <div className="ancho">
            <Reveal className="compromiso">
              <Badge icono="escudo">Integridad académica</Badge>
              <h2>Nuestro <em>compromiso</em></h2>
              <div className="dos-listas">
                <div>
                  <h3 className="lista-t">Lo que hacemos</h3>
                  <ul className="si">{COMPROMISO.si.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
                <div>
                  <h3 className="lista-t">Lo que no hacemos</h3>
                  <ul className="no">{COMPROMISO.no.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="cta">
          <div className="ancho">
            <Reveal className="cta-in">
              <Badge icono="mensaje" oscuro>Contacto</Badge>
              <h2 className="claro-t">¿Empieza su <em>investigación</em>?</h2>
              <p className="tenue">Cuéntenos en qué etapa se encuentra y armamos un plan de acompañamiento.</p>
              <div className="acciones centro-f">
                <a className="btn primario" href={WHATSAPP_ACADEMICO} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
                <a className="btn" href="mailto:ethos.ia.ec@gmail.com?subject=Ethos%20Acad%C3%A9mico">Escribir un correo</a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <PieAcademico />

      <style jsx>{`
        .app { --ancho: var(--ancho-max); --ancho-hero: var(--ancho-max); min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; overflow-x: clip; }
        .ancho { max-width: var(--ancho); margin: 0 auto; padding: 0 var(--gutter); }
        .centro { text-align: center; }
        .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .dos { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 72px); align-items: center; }
        section { padding: clamp(64px, 9vw, 120px) 0; scroll-margin-top: 80px; overflow-x: clip; }
        .claro { background: var(--c-fondo); }
        .blanco { background: #fff; }
        .oscuro { background: var(--c-azul); color: var(--c-claro-2); }
        .kit { background: linear-gradient(135deg, var(--c-azul-profundo), var(--c-azul-2)); color: var(--c-claro-2); }
        img { max-width: 100%; }
        h2 { font-size: var(--t-2xl); line-height: 1.12; margin: 16px 0 16px; letter-spacing: -0.015em; text-wrap: balance; }
        h2 :global(em), h3 :global(em) { font-style: normal; color: var(--c-teal); }
        .claro-t { color: var(--c-claro); }
        .claro-t :global(em) { color: var(--c-cian); }
        .cabeza { text-align: center; max-width: 760px; margin: 0 auto; }
        .resumen, .claro p, .blanco p { color: var(--c-texto-2); line-height: 1.75; }
        .tenue { color: var(--c-apagado); line-height: 1.75; }
        .app :global(.acciones) { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 30px; }
        .app :global(.centro-f) { justify-content: center; }
        .app :global(.acciones .btn) { display: inline-flex; align-items: center; padding: 13px 22px; border-radius: var(--r-pill); border: 1px solid var(--c-azul-3); color: var(--c-claro); font-size: 14px; font-weight: 700; text-decoration: none; transition: transform var(--d-rapida), box-shadow var(--d-rapida), border-color var(--d-rapida); }
        .app :global(.acciones .btn:hover) { transform: translateY(-2px); border-color: var(--c-cian); }
        .app :global(.acciones .btn.primario) { background: var(--c-cian); color: var(--c-azul); border-color: var(--c-cian); box-shadow: var(--brillo-cian); }
        .app :global(.acciones .btn.primario:hover) { box-shadow: 0 18px 40px rgba(4, 235, 255, 0.32); }
        :global(.subr) { color: var(--c-teal); font-weight: 700; text-decoration: none; background: linear-gradient(currentColor, currentColor) 0 100% / 0 2px no-repeat; transition: background-size var(--d-media) var(--ease); padding-bottom: 2px; }
        :global(.subr:hover), :global(.subr:focus-visible) { background-size: 100% 2px; }

        .mosaico { flex: none; display: grid; place-items: center; width: 60px; height: 60px; border-radius: 18px; background: linear-gradient(135deg, var(--c-cian), #3fc4ff); color: var(--c-azul); box-shadow: 0 12px 26px rgba(4, 235, 255, 0.22); }
        .mosaico.peq { width: 48px; height: 48px; border-radius: 14px; }

        .stats { position: relative; background: linear-gradient(180deg, var(--c-azul-2), var(--c-azul)); color: var(--c-claro); padding: clamp(52px, 7vw, 88px) 0; border-top: 1px solid var(--c-azul-3); }
        .cifras { list-style: none; padding: 0; margin: 32px 0 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
        .cifras :global(.cifra) { display: flex; align-items: center; gap: 18px; padding: 22px; border-radius: var(--r-lg); background: rgba(255, 255, 255, 0.03); border: 1px solid var(--c-azul-3); height: 100%; transition: transform var(--d-media) var(--ease), border-color var(--d-media); }
        .cifras :global(.cifra:hover) { transform: translateY(-4px); border-color: rgba(4, 235, 255, 0.45); }
        .dato { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .dato strong { font-size: clamp(2rem, 1.5rem + 1.6vw, 2.9rem); line-height: 1; color: #fff; font-variant-numeric: tabular-nums; }
        .dato > span { font-size: 14px; color: var(--c-claro-2); }

        .claro :global(.foto) { position: relative; }
        .claro :global(.foto img) { display: block; width: 100%; aspect-ratio: 4 / 3.4; object-fit: cover; border-radius: 28px; box-shadow: var(--sombra-3); }
        .claro :global(.foto)::before { content: ''; position: absolute; inset: 18px -18px -18px 18px; border: 2px solid rgba(11, 95, 117, 0.25); border-radius: 28px; z-index: -1; }
        .sello { position: absolute; left: -12px; bottom: 28px; display: flex; align-items: center; gap: 10px; padding: 14px 20px; border-radius: var(--r-lg); background: var(--c-azul); color: var(--c-claro-2); font-size: 14px; box-shadow: var(--sombra-3); }
        .sello strong { font-size: 2rem; line-height: 1; color: var(--c-cian); }
        .contacto { display: flex; gap: 16px; align-items: flex-start; margin-top: 26px; padding: 20px 22px; border-radius: var(--r-lg); background: var(--c-tarjeta); box-shadow: var(--sombra-2); border-left: 4px solid var(--c-cian); }
        .contacto strong { display: block; }
        .contacto > div > span { font-size: 14px; color: var(--c-texto-3); }
        .enlaces { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 8px; font-size: 14px; overflow-wrap: anywhere; }
        .mv { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 22px; margin-top: clamp(56px, 7vw, 96px); }
        .mv :global(.mv-card) { position: relative; height: 100%; background: var(--c-tarjeta); border-radius: var(--r-xl); padding: clamp(26px, 3vw, 40px); box-shadow: var(--sombra-1); overflow: hidden; transition: transform var(--d-media) var(--ease), box-shadow var(--d-media); }
        .mv :global(.mv-card)::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: linear-gradient(var(--c-cian), var(--c-teal)); }
        .mv :global(.mv-card:hover) { transform: translateY(-4px); box-shadow: var(--sombra-2); }
        .mv .mosaico { position: absolute; right: 26px; top: 26px; }
        .mv h3 { font-size: var(--t-xl); margin: 16px 0 10px; padding-right: 70px; }
        .mv p { margin: 0; }

        .lineas { list-style: none; padding: 0; margin: 44px 0 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); gap: 20px; }
        .lineas :global(.linea) { height: 100%; display: flex; flex-direction: column; border-radius: var(--r-lg); background: var(--c-tarjeta); border: 1px solid var(--c-borde); box-shadow: var(--sombra-1); overflow: hidden; transition: transform var(--d-media) var(--ease), box-shadow var(--d-media); }
        .lineas :global(.linea:hover) { transform: translateY(-6px); box-shadow: var(--sombra-2); }
        .l-cab { display: flex; align-items: center; gap: 14px; padding: 20px; color: #fff; min-height: 96px; }
        .lineas :global(.l0) .l-cab { background: linear-gradient(135deg, var(--c-azul), var(--c-teal)); }
        .lineas :global(.l1) .l-cab { background: linear-gradient(135deg, var(--c-teal), #0a4a6b); }
        .lineas :global(.l2) .l-cab { background: linear-gradient(135deg, #0a2540, #2c4f8f); }
        .lineas :global(.l3) .l-cab { background: linear-gradient(135deg, var(--c-azul-2), #0d3d55); }
        .l-icono { flex: none; display: grid; place-items: center; width: 48px; height: 48px; border-radius: 14px; background: var(--c-cian); color: var(--c-azul); }
        .l-cab h3 { margin: 0; font-size: 17px; line-height: 1.3; }
        .l-cuerpo { padding: 20px 22px 24px; display: flex; flex-direction: column; gap: 14px; flex: 1; }
        .l-cuerpo p { margin: 0; font-size: 14.5px; }
        .l-cuerpo ul { list-style: none; padding: 14px 0 0; margin: auto 0 0; border-top: 1px solid var(--c-borde); display: grid; gap: 8px; }
        .l-cuerpo li { position: relative; padding-left: 22px; font-size: 14px; font-weight: 600; color: var(--c-texto); }
        .l-cuerpo li::before { content: ''; position: absolute; left: 2px; top: 6px; width: 8px; height: 8px; border-radius: 2px; background: var(--c-teal); transform: rotate(45deg); }
        .panel { margin-top: clamp(48px, 6vw, 80px); padding: clamp(32px, 5vw, 64px) clamp(16px, 4vw, 56px); border-radius: 28px; background: radial-gradient(60% 80% at 80% 0%, rgba(4, 235, 255, 0.12), transparent 70%), var(--c-azul); color: var(--c-claro-2); text-align: center; overflow: hidden; }

        .tiempo { list-style: none; padding: 0; margin: 56px 0 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; position: relative; }
        .tiempo::before { content: ''; position: absolute; left: 12%; right: 12%; top: 32px; height: 2px; background: linear-gradient(90deg, var(--c-cian), var(--c-teal), var(--c-violeta)); opacity: 0.6; }
        .tiempo :global(.hito) { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 18px; height: 100%; }
        .nodo { position: relative; z-index: 1; display: grid; place-items: center; width: 64px; height: 64px; border-radius: 50%; background: var(--c-azul); color: var(--c-cian); font: 700 15px/1 var(--f-mono); box-shadow: 0 0 0 8px var(--c-fondo), 0 0 0 9px rgba(4, 235, 255, 0.35); transition: transform var(--d-media) var(--ease), box-shadow var(--d-media); }
        .tiempo :global(.hito:hover) .nodo { transform: scale(1.08); box-shadow: 0 0 0 8px var(--c-fondo), 0 0 0 9px var(--c-cian), 0 0 28px rgba(4, 235, 255, 0.45); }
        .hito-t { flex: 1; width: 100%; background: var(--c-tarjeta); border-radius: var(--r-lg); padding: 22px 20px; box-shadow: var(--sombra-1); transition: transform var(--d-media) var(--ease), box-shadow var(--d-media); }
        .tiempo :global(.hito:hover) .hito-t { transform: translateY(-4px); box-shadow: var(--sombra-2); }
        .hito-t h3 { margin: 0 0 8px; font-size: 17px; }
        .hito-t p { margin: 0; font-size: 14px; }

        .rejilla { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 20px; margin-top: 44px; }
        .rejilla :global(.card) { position: relative; height: 100%; background: var(--c-fondo); border-radius: var(--r-lg); padding: 28px 26px; border: 1px solid var(--c-borde); overflow: hidden; transition: transform var(--d-media) var(--ease), box-shadow var(--d-media), background var(--d-media); }
        .rejilla :global(.card)::before { content: ''; position: absolute; left: 0; top: 0; height: 4px; width: 0; background: linear-gradient(90deg, var(--c-cian), var(--c-teal)); transition: width var(--d-lenta) var(--ease); }
        .rejilla :global(.card:hover) { transform: translateY(-6px); box-shadow: var(--sombra-2); background: #fff; }
        .rejilla :global(.card:hover)::before { width: 100%; }
        .card-n { font: 700 13px/1 var(--f-mono); color: var(--c-teal); }
        .rejilla h3 { margin: 14px 0 8px; font-size: 18px; }
        .rejilla p { margin: 0; font-size: 14.5px; }
        .sub-t { margin: 56px 0 0; font-size: var(--t-xl); text-align: center; }
        .proceso { list-style: none; padding: 0; margin: 28px 0 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
        .proceso :global(.proc) { display: flex; gap: 14px; align-items: flex-start; }
        .proc-n { flex: none; width: 38px; height: 38px; border-radius: 12px; background: var(--c-azul); color: var(--c-cian); display: grid; place-items: center; font-weight: 700; }
        .proceso p { margin: 4px 0 0; font-size: 14px; }

        .area-p { display: block; margin-top: 18px; font: 700 12px/1 var(--f-mono); letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-cian-suave); }
        .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
        .tags span { font: 600 12px/1 var(--f-mono); padding: 8px 13px; border-radius: var(--r-pill); border: 1px solid var(--c-azul-3); color: var(--c-cian-suave); }
        .oscuro :global(.demo) { position: relative; padding: 12px; border-radius: var(--r-xl); background: #fff; box-shadow: var(--sombra-3), 0 0 0 1px rgba(4, 235, 255, 0.35); transition: transform var(--d-lenta) var(--ease); }
        .oscuro :global(.demo:hover) { transform: translateY(-6px) rotate(-0.4deg); }
        .oscuro :global(.demo img) { width: 100%; display: block; border-radius: var(--r-md); }
        .demo-pie { display: block; padding: 12px 6px 4px; font-size: 13px; font-weight: 600; color: var(--c-texto-2); }

        .personas { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 20px; margin-top: 44px; }
        .personas :global(.persona) { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; background: var(--c-tarjeta); border-radius: var(--r-lg); padding: 30px 22px; box-shadow: var(--sombra-1); height: 100%; transition: transform var(--d-media) var(--ease), box-shadow var(--d-media); }
        .personas :global(.persona:hover) { transform: translateY(-6px); box-shadow: var(--sombra-2); }
        .avatar { width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg, var(--c-cian), var(--c-teal)); color: var(--c-azul); font-weight: 700; font-size: 22px; margin-bottom: 14px; box-shadow: 0 0 0 5px #fff, 0 0 0 6px rgba(11, 95, 117, 0.2); }
        .titulo { font-size: 13px; color: var(--c-texto-2); }
        .rol { font: 600 11.5px/1.5 var(--f-mono); color: var(--c-teal); letter-spacing: 0.03em; margin-top: 4px; }
        .mas { margin-top: 32px; text-align: center; }

        .kit :global(.terminal) { background: #02070d; border: 1px solid var(--c-azul-3); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--sombra-3); min-width: 0; }
        .barra { display: flex; gap: 7px; padding: 12px 16px; background: var(--c-azul-2); }
        .barra i { width: 11px; height: 11px; border-radius: 50%; background: var(--c-azul-3); }
        pre { margin: 0; padding: 22px; color: var(--c-cian-suave); font: 13px/1.8 var(--f-mono); overflow-x: auto; }

        .claro :global(.compromiso) { background: var(--c-tarjeta); border-radius: 28px; padding: clamp(28px, 5vw, 60px); box-shadow: var(--sombra-2); border-top: 5px solid var(--c-cian); }
        .dos-listas { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 36px; margin-top: 22px; }
        .lista-t { margin: 0 0 14px; font-size: 16px; }
        .dos-listas ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
        .dos-listas li { position: relative; padding-left: 34px; color: var(--c-texto-2); line-height: 1.6; }
        .dos-listas li::before { position: absolute; left: 0; top: 1px; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; }
        .si li::before { content: '✓'; background: var(--c-ok-bg); color: var(--c-ok); }
        .no li::before { content: '✕'; background: var(--c-aviso-bg); color: var(--c-aviso); }

        .cta { background: var(--c-fondo); padding-top: 0; }
        .cta :global(.cta-in) { text-align: center; padding: clamp(40px, 6vw, 80px) clamp(16px, 4vw, 56px); border-radius: 28px; background: radial-gradient(50% 90% at 50% 0%, rgba(4, 235, 255, 0.18), transparent 70%), linear-gradient(135deg, var(--c-azul-profundo), var(--c-azul-2)); box-shadow: var(--sombra-3); }

        @media (max-width: 900px) {
          .dos, .dos-listas, .mv { grid-template-columns: minmax(0, 1fr); }
          .cifras, .proceso { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .tiempo { grid-template-columns: minmax(0, 1fr); gap: 20px; }
          .tiempo::before { left: 31px; right: auto; top: 32px; bottom: 32px; width: 2px; height: auto; background: linear-gradient(180deg, var(--c-cian), var(--c-teal), var(--c-violeta)); }
          .tiempo :global(.hito) { flex-direction: row; align-items: flex-start; text-align: left; }
          .claro :global(.foto)::before { display: none; }
          .sello { left: 12px; }
        }
        @media (max-width: 520px) {
          .cifras, .proceso { grid-template-columns: minmax(0, 1fr); }
          .contacto { flex-direction: column; }
          .mv h3 { padding-right: 0; margin-top: 84px; }
        }
        @media (min-width: 1920px) {
          .app { --ancho: 1440px; --ancho-hero: 1440px; }
          h2 { font-size: 3.4rem; }
          .resumen, .claro p, .blanco p, .tenue { font-size: 1.15rem; }
          .l-cab h3, .hito-t h3 { font-size: 19px; }
          .l-cuerpo p, .hito-t p, .rejilla p { font-size: 16px; }
          .cabeza { max-width: 900px; }
        }
        @media (min-width: 2560px) {
          .app { --ancho: 1680px; --ancho-hero: 1680px; }
          h2 { font-size: 4rem; }
          .resumen, .claro p, .blanco p, .tenue { font-size: 1.3rem; }
        }
      `}</style>
    </div>
  );
}
