import Header from '../../components/home/Header';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Reveal from '../../components/Reveal';
import Seo from '../../components/Seo';
import { clubIngenieria, migas, personaMarlon } from '../../lib/seo';

type Area = 'Desarrollo web' | 'Datos' | 'Seguridad' | 'Práctica';

interface Requisito { requisito: string; evidencia: string; area: Area }
interface Proyecto { nombre: string; stack: string[]; detalle: string; punto: string }

// Cada fila se respalda en la hoja de vida de Marlon (portafolio, cursos y prácticas).
const REQUISITOS: Requisito[] = [
  { area: 'Desarrollo web', requisito: 'React y manejo del DOM', evidencia: 'Tres aplicaciones web en producción con Next.js y React; interfaz interactiva con terminal Linux y asistente de IA.' },
  { area: 'Desarrollo web', requisito: 'Git y control de versiones', evidencia: 'Portafolio en GitHub y despliegue continuo en Vercel.' },
  { area: 'Seguridad', requisito: 'Autenticación y autorización', evidencia: 'Inicio de sesión social (Google, GitHub, Facebook) con políticas de seguridad a nivel de fila (Row Level Security) en Supabase.' },
  { area: 'Seguridad', requisito: 'Buenas prácticas de seguridad', evidencia: 'Seguridad Informática (100/100), Auditoría de TI (100/100), SGSI (93/100) y certificación de ciberseguridad de Cisco.' },
  { area: 'Datos', requisito: 'Consumo de APIs y JSON', evidencia: 'Integración de modelos de lenguaje con conmutación automática entre tres proveedores; validación de datos con Zod.' },
  { area: 'Datos', requisito: 'SQL', evidencia: 'PostgreSQL y Supabase en producción; curso de Python medio-avanzado y minería de datos (90/100).' },
  { area: 'Práctica', requisito: 'Experiencia en proyectos', evidencia: '240 horas de prácticas preprofesionales certificadas por la UNEMI en dos organizaciones.' },
];

const AREAS: ('Todas' | Area)[] = ['Todas', 'Desarrollo web', 'Datos', 'Seguridad', 'Práctica'];

const PROYECTOS: Proyecto[] = [
  { nombre: 'VicMar: alerta temprana del abandono estudiantil', stack: ['Python', 'LightGBM', 'SHAP', 'FastAPI', 'SQL Server', 'LLM'], punto: '4 modelos comparados · trabajo de titulación', detalle: 'Compara cuatro modelos con validación cruzada agrupada por estudiante: regresión logística, Random Forest con pesos, Random Forest con SMOTE y LightGBM ajustado con Optuna, el elegido (ROC-AUC 0,828 en datos de prueba UNEMI y 0,804 en datos reales OULAD; en evaluación prospectiva detectó al 91 % de quienes abandonaron). Explica cada riesgo con SHAP y responde preguntas en lenguaje natural con consulta conversacional validada.' },
  { nombre: 'Plataforma web comunitaria', stack: ['Next.js', 'React', 'Supabase', 'Vercel'], punto: 'Autenticación social + RLS', detalle: 'Diseño y desarrollo completo: autenticación social, políticas de seguridad por fila, SEO técnico y despliegue continuo.' },
  { nombre: 'Entrenador educativo de ciberseguridad', stack: ['JavaScript', 'LLM'], punto: '31 niveles + asistente de IA', detalle: 'Terminal Linux interactiva de 31 niveles con un asistente de IA (cascada de tres proveedores con conmutación automática) que guía al usuario con conceptos reales de auditoría.' },
  { nombre: 'Ethos IA Academia', stack: ['MCP', 'Python', 'Markdown'], punto: '75 metodologías · licencia MIT', detalle: 'Kit abierto de metodologías académicas que funciona con cualquier modelo de IA: investigación científica, tesis de TI, Economía, prácticas de laboratorio y creación de empresas.' },
  { nombre: 'Buscador de empleo con análisis de CV', stack: ['Next.js', 'Zod', 'pdf.js'], punto: 'Privacidad: el PDF no sale del navegador', detalle: 'Extrae el texto del PDF en el navegador y estructura el perfil con IA para cruzarlo con ofertas reales.' },
];

// Notas reales del récord académico (hoja de vida).
const NOTAS = [
  { materia: 'Seguridad Informática', nota: 100 },
  { materia: 'Auditoría de TI', nota: 100 },
  { materia: 'Sistemas Distribuidos', nota: 100 },
  { materia: 'Gestión de TI', nota: 100 },
  { materia: 'Inteligencia Artificial', nota: 96 },
  { materia: 'SGSI', nota: 93 },
  { materia: 'Minería de Datos', nota: 90 },
  { materia: 'Computación Forense', nota: 87 },
  { materia: 'Redes de Computadoras', nota: 87 },
];

const COMPETENCIAS = [
  { nombre: 'Capacidad analítica y análisis de datos', prueba: 'Minería de Datos 90/100 · Inteligencia Artificial 96/100', icono: '📊' },
  { nombre: 'Identificación y evaluación de riesgos', prueba: 'Auditoría de TI 100/100 · SGSI 93/100 · Computación Forense 87/100', icono: '🛡️' },
  { nombre: 'Resolución de problemas', prueba: 'Sistemas Distribuidos 100/100 · Gestión de TI 100/100', icono: '🧩' },
  { nombre: 'Comunicación y organización', prueba: 'Diez años gestionando información confidencial y cadena de custodia bajo normativa estricta', icono: '🗂️' },
];

const TECNOLOGIAS = ['React', 'Next.js', 'JavaScript', 'Python', 'SQL', 'PostgreSQL', 'Supabase', 'Git y GitHub', 'Google Cloud', 'Integración de LLM', 'Auditoría de TI', 'Zod'];

const EXPERIENCIA = [
  { cargo: 'Gerente General y Director Técnico', lugar: 'ETHOSLAB S.A.S. (Ethos IA)', dato: '2026 – actualidad · dirección técnica, automatización, integraciones y auditoría de IA', marca: '2026' },
  { cargo: 'Prácticas Preprofesionales II', lugar: 'Tecnograp S.A.', dato: '144 horas certificadas por la UNEMI', marca: '144 h' },
  { cargo: 'Prácticas Preprofesionales I', lugar: 'CNEL EP — Milagro', dato: '96 horas certificadas por la UNEMI', marca: '96 h' },
  { cargo: 'Experiencia en el sector público', lugar: 'Gestión de información sensible', dato: '2011–2022 · manejo de información confidencial, cadena de custodia y cumplimiento normativo y corporativo', marca: '10 años' },
];

const CERTIFICACIONES = [
  { t: 'Introducción a la ciberseguridad', e: 'Cisco Networking Academy' },
  { t: 'Cloud Computing con enfoque en Google Cloud', e: 'UNEMI · 60 h' },
  { t: 'Python medio-avanzado', e: 'UNEMI · 40 h' },
  { t: 'Gemini Certified Educator', e: 'Google for Education' },
  { t: 'Concurso Internacional #HilandoCiencia2025', e: 'OEI · participante' },
  { t: 'Inglés B1 (MCER)', e: 'UNEMI · módulos I–V' },
  { t: 'Calidad del e-learning en universidades públicas', e: 'Facultad de Investigación UNEMI · webinar, 2026' },
];

const CLUB = {
  nombre: 'El Club de la Ingeniería',
  url: 'https://elclubdelaingenieria.dpdns.org/',
  juego: 'https://elclubdelaingenieria.dpdns.org/',
  repo: 'https://github.com/IngMarlonPerez/El-Club-de-la-Ingenier-a',
  texto: 'Comunidad estudiantil de ingeniería en tecnologías de la información, ciencias e investigación que fundó y dirige. Reúne a estudiantes de software, datos e IA, ciberseguridad, redes, sistemas de información e investigación aplicada para compartir conocimiento de forma abierta: charlas técnicas, mentorías, proyectos reales y contribuciones de código.',
  cifras: [
    { v: '120+', e: 'miembros activos' },
    { v: '18', e: 'proyectos en curso' },
    { v: '6', e: 'áreas técnicas' },
  ],
  destacados: [
    { t: 'Kernel Cero', d: 'Reto interactivo de terminal Linux con 31 niveles en 7 episodios: reconocimiento, criptografía, detección de amenazas, análisis forense, pentesting web autorizado e ISO/IEC 27001. Lo guía INGenioso, un asistente con IA.', etiqueta: 'Aprende ciberseguridad jugando' },
    { t: 'Buscador de empleo', d: 'Filtra ofertas por carrera, experiencia y tipo de empleo, con alertas para no caer en ofertas falsas y acceso directo a Red Socio Empleo.', etiqueta: 'Empleo para estudiantes' },
    { t: 'Portal y asistente de IA', d: 'Plataforma en Next.js y Supabase con membresía y acceso social, más un asistente conversacional con respaldo entre proveedores de IA.', etiqueta: 'En producción' },
  ],
};

// Divulgación y aporte académico confirmados por la gerencia (octubre de 2026).
const DIVULGACION = [
  { t: 'Radar Económico · SIM UNEMI', d: 'Invitado al programa del Sistema Integrado de Medios de la UNEMI para hablar de inteligencia artificial con propósito: tecnología, datos y emprendimiento (30 de octubre de 2026).', href: '/noticias/radar-economico-unemi-inteligencia-artificial-con-proposito', etiqueta: 'Medios' },
  { t: 'Ponente en CEO UNEMI', d: 'Taller «Herramientas y Habilidades Digitales», tema «Uso ético y responsable de la IA», para la Comunidad Estudiantil Online de la UNEMI (marzo de 2026, 20 horas).', etiqueta: 'Formación' },
  { t: '«Sin GUION» y ETIA', d: 'Transmisiones en vivo y la Escuela de Tecnología, IA y Sociedad (ETIA), espacios de debate abierto sobre liderazgo técnico estudiantil, código abierto y ética digital.', etiqueta: 'Divulgación' },
  { t: 'Investigación aplicada', d: 'Colabora con académicos de Cuenca en el uso de IA generativa en educación como copiloto del docente, no como sustituto. Participó en el concurso internacional #HilandoCiencia2025 de la OEI.', etiqueta: 'Investigación' },
  { t: 'Ethos IA Academia', d: 'Impulsa el kit abierto de 75 metodologías académicas de Ethos IA para estudiantes, docentes e investigadores.', href: '/academia', etiqueta: 'Código abierto' },
  { t: 'Comunidad CEO UNEMI', d: 'Invitado a la posesión de la nueva directiva estudiantil de la Comunidad Estudiantil Online de la UNEMI.', etiqueta: 'Comunidad' },
];

const SECCIONES = [
  { id: 'insignia', etiqueta: 'Proyecto insignia' },
  { id: 'cargo', etiqueta: 'Perfil del cargo' },
  { id: 'proyectos', etiqueta: 'Proyectos' },
  { id: 'competencias', etiqueta: 'Competencias' },
  { id: 'comunidad', etiqueta: 'Comunidad' },
  { id: 'divulgacion', etiqueta: 'Divulgación' },
  { id: 'experiencia', etiqueta: 'Experiencia' },
  { id: 'formacion', etiqueta: 'Formación' },
];

function BarraNota({ materia, nota, activa }: { materia: string; nota: number; activa: boolean }) {
  return (
    <div className="b">
      <span>{materia}</span>
      <div className="pista" role="img" aria-label={`${materia}: ${nota} de 100`}>
        <i style={{ width: activa ? `${nota}%` : '0%' }} />
      </div>
      <strong>{nota}</strong>
      <style jsx>{`
        .b { display: grid; grid-template-columns: 170px 1fr 36px; gap: 12px; align-items: center; font-size: 13.5px; }
        .pista { height: 10px; background: rgba(5,17,30,0.08); border-radius: 999px; overflow: hidden; }
        i { display: block; height: 100%; background: linear-gradient(90deg, #04ebff, #0b5f75); border-radius: 999px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
        strong { color: #0b5f75; text-align: right; }
        @media (max-width: 560px) { .b { grid-template-columns: 1fr 36px; } .pista { grid-column: 1 / -1; order: 3; } }
        @media (prefers-reduced-motion: reduce) { i { transition: none; } }
      `}</style>
    </div>
  );
}

export default function PerfilMarlon() {
  const [area, setArea] = useState<'Todas' | Area>('Todas');
  const [seccion, setSeccion] = useState<string>('cargo');
  const [barras, setBarras] = useState(false);
  const notasRef = useRef<HTMLDivElement>(null);

  // Resalta en la barra la sección visible.
  useEffect(() => {
    const els = SECCIONES.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entradas) => { const v = entradas.find((e) => e.isIntersecting); if (v) setSeccion(v.target.id); },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = notasRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setBarras(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const requisitos = REQUISITOS.filter((r) => area === 'Todas' || r.area === area);

  return (
    <div className="p" id="contenido-principal">
      <Seo
        titulo="Marlon Pérez — Gerente General de Ethos IA y fundador de El Club de la Ingeniería"
        descripcion="Perfil de Marlon David Pérez Almachi: Gerente General y Director Técnico de ETHOSLAB S.A.S. (Ethos IA), fundador de El Club de la Ingeniería, estudiante de Ingeniería en TI (UNEMI). Software, datos y seguridad de la información."
        ruta="/equipo/marlon-perez"
        tipo="profile"
        jsonld={[migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Equipo', ruta: '/equipo' }, { nombre: 'Marlon Pérez', ruta: '/equipo/marlon-perez' }]), personaMarlon(), clubIngenieria()]}
      />

      <Header />

      <header className="hero">
        <div className="brillo" aria-hidden="true" />
        <div className="foto">
          <Image src="/empresa/marlon-profile.jpg" alt="Marlon David Pérez Almachi" width={200} height={200} priority />
        </div>
        <div className="txt">
          <span className="eyebrow">COFUNDADOR, GERENTE GENERAL Y DIRECTOR TÉCNICO</span>
          <h1>Marlon David Pérez Almachi</h1>
          <p className="sub">Software, datos y seguridad de la información</p>
          <p className="lead">
            Gerente General de ETHOSLAB S.A.S. (Ethos IA) y fundador de El Club de la Ingeniería. Estudiante del décimo y último semestre de Ingeniería en Tecnologías de la Información en la UNEMI (graduación estimada
            en diciembre de 2026), con tres aplicaciones web en producción, 240 horas de prácticas certificadas y diez años de
            trayectoria previa manejando información confidencial bajo normativa estricta.
          </p>
          <div className="enlaces">
            <a href="https://github.com/ing-MarlonPerez" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/marlon-p%C3%A9rez-06ab32303/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={CLUB.url} target="_blank" rel="noopener noreferrer">Club de la Ingeniería</a>
            <a href="https://ingmarlonperez.vercel.app/" target="_blank" rel="noopener noreferrer">Portafolio</a>
            <Link href="/#contacto">Contactar a Ethos IA</Link>
          </div>
        </div>
      </header>

      <ul className="cifras">
        <li><strong>3</strong><span>aplicaciones web en producción</span></li>
        <li><strong>240 h</strong><span>de prácticas certificadas</span></li>
        <li><strong>87,6</strong><span>promedio académico /100</span></li>
        <li><strong>10 años</strong><span>de trayectoria previa</span></li>
      </ul>

      <div className="stack" aria-label="Tecnologías">
        {TECNOLOGIAS.map((t) => <span key={t}>{t}</span>)}
      </div>

      <div className="sticky">
        <ul>
          {SECCIONES.map((s) => (
            <li key={s.id}><a href={`#${s.id}`} className={seccion === s.id ? 'on' : ''} aria-current={seccion === s.id ? 'true' : undefined}>{s.etiqueta}</a></li>
          ))}
        </ul>
      </div>

      <main className="cuerpo">
        <section id="insignia" aria-labelledby="h-insignia" className="revista">
          <Reveal>
            <div className="rv-top"><span className="rv-sello">Proyecto insignia</span><span className="rv-ed">Edición especial · Educación superior e IA</span></div>
            <div className="rv-grid">
              <div className="rv-texto">
                <span className="rv-kicker">Trabajo de titulación · UNEMI</span>
                <h2 id="h-insignia">VicMar: la inteligencia artificial que <em>anticipa</em> el abandono universitario</h2>
                <p className="rv-bajada">Cuatro modelos comparados, cada alerta explicada y una consulta en español para que directivos y bienestar estudiantil actúen a tiempo desde el celular o la computadora.</p>
                <p className="rv-firma">Por <strong>Marlon Pérez</strong> y <strong>Víctor Lluilema</strong></p>
              </div>
              <figure className="rv-foto">
                <Image src="/noticias/vicmar-portada-revista.webp" alt="Portada estilo revista de Ethos Noticias con Marlon Pérez: «La IA que anticipa el abandono universitario»." width={1200} height={1500} sizes="(max-width: 900px) 100vw, 50vw" />
                <figcaption>Portada de Ethos Noticias · Octubre de 2026</figcaption>
              </figure>
            </div>
            <div className="rv-cifras">
              <div><b>21,51 %</b><span>deserción de primer año en Ecuador (CES, 2023)</span></div>
              <div><b>USD 9,8 M</b><span>al año por cada punto de abandono evitado (estimación propia)</span></div>
              <div><b>0,828</b><span>ROC-AUC del modelo LightGBM elegido</span></div>
              <div><b>91,3 %</b><span>de abandonos detectados en validación prospectiva</span></div>
            </div>
            <blockquote className="rv-cita">«Un modelo que solo entiende un especialista no cambia nada; uno que puede consultar cualquier director a tiempo sí.»</blockquote>
            <div className="rv-acciones">
              <Link href="/noticias/vicmar-prediccion-abandono-universitario-ia-conversacional" className="rv-btn">Leer el reportaje completo →</Link>
              <a href="https://github.com/Vm199524/PROYECTO-TITULACION-MARLON-VICTOR-UNEMI" target="_blank" rel="noopener noreferrer" className="rv-btn sec">Código abierto en GitHub</a>
            </div>
          </Reveal>
        </section>

        <section id="cargo" aria-labelledby="h-cargo">
          <Reveal>
            <h2 id="h-cargo">Perfil del cargo y evidencia</h2>
            <p className="intro">Cada requisito de un perfil de desarrollo web, junto con la evidencia que lo respalda. Filtra por área.</p>
            <div className="filtros" role="group" aria-label="Filtrar por área">
              {AREAS.map((a) => (
                <button key={a} type="button" aria-pressed={area === a} className={area === a ? 'f on' : 'f'} onClick={() => setArea(a)}>{a}</button>
              ))}
            </div>
            <div className="tabla">
              {requisitos.map((r) => (
                <div key={r.requisito} className="fila">
                  <span className={`area a-${r.area.split(' ')[0].toLowerCase()}`}>{r.area}</span>
                  <strong>{r.requisito}</strong>
                  <span className="ev">{r.evidencia}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="proyectos" aria-labelledby="h-proy">
          <Reveal>
            <h2 id="h-proy">Proyectos</h2>
            <div className="rejilla">
              {PROYECTOS.map((pr, i) => (
                <article key={pr.nombre} className="card">
                  <span className="num">0{i + 1}</span>
                  <h3>{pr.nombre}</h3>
                  <span className="punto">{pr.punto}</span>
                  <p>{pr.detalle}</p>
                  <div className="tags">{pr.stack.map((t) => <span key={t}>{t}</span>)}</div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="competencias" aria-labelledby="h-comp">
          <Reveal>
            <h2 id="h-comp">Competencias</h2>
            <div className="rejilla c2">
              {COMPETENCIAS.map((c) => (
                <article key={c.nombre} className="card comp"><span className="ico" aria-hidden="true">{c.icono}</span><div><h3>{c.nombre}</h3><p>{c.prueba}</p></div></article>
              ))}
            </div>
            <h3 className="sub-h">Récord académico: materias destacadas</h3>
            <div ref={notasRef} className="notas">
              {NOTAS.map((n) => <BarraNota key={n.materia} materia={n.materia} nota={n.nota} activa={barras} />)}
            </div>
          </Reveal>
        </section>

        <section id="comunidad" aria-labelledby="h-com">
          <Reveal>
            <h2 id="h-com">Comunidad: {CLUB.nombre}</h2>
            <p className="intro">{CLUB.texto}</p>
            <ul className="club-cifras">
              {CLUB.cifras.map((c) => <li key={c.e}><strong>{c.v}</strong><span>{c.e}</span></li>)}
            </ul>
            <div className="rejilla">
              {CLUB.destacados.map((d) => (
                <article key={d.t} className="card">
                  <span className="punto">{d.etiqueta}</span>
                  <h3>{d.t}</h3>
                  <p>{d.d}</p>
                </article>
              ))}
            </div>
            <div className="club-cta">
              <a className="btn" href={CLUB.juego} target="_blank" rel="noopener noreferrer">Jugar Kernel Cero →</a>
              <a className="btn sec" href={CLUB.url} target="_blank" rel="noopener noreferrer">Conocer el club</a>
              <a className="btn sec" href={CLUB.repo} target="_blank" rel="noopener noreferrer">Código en GitHub</a>
            </div>
          </Reveal>
        </section>

        <section id="divulgacion" aria-labelledby="h-div">
          <Reveal>
            <h2 id="h-div">Divulgación y comunidad académica</h2>
            <p className="intro">Lleva la inteligencia artificial responsable a las aulas, a los medios y a la comunidad, con el mismo rigor con que la aplica en la empresa.</p>
            <div className="rejilla">
              {DIVULGACION.map((d) => (
                <article key={d.t} className="card">
                  <span className="punto">{d.etiqueta}</span>
                  <h3>{d.href ? <Link href={d.href} style={{ color: "#0b5f75", textDecoration: "none" }}>{d.t} →</Link> : d.t}</h3>
                  <p>{d.d}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="experiencia" aria-labelledby="h-exp">
          <Reveal>
            <h2 id="h-exp">Experiencia</h2>
            <ol className="linea">
              {EXPERIENCIA.map((e) => (
                <li key={e.cargo}>
                  <span className="marca">{e.marca}</span>
                  <div><strong>{e.cargo}</strong><span className="lugar">{e.lugar}</span><em>{e.dato}</em></div>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <section id="formacion" aria-labelledby="h-for">
          <Reveal>
            <h2 id="h-for">Formación y certificaciones</h2>
            <p className="intro">Ingeniería en Tecnologías de la Información · UNEMI, modalidad en línea · 2019 – actualidad · 10.º semestre · promedio 87,6/100.</p>
            <div className="rejilla cert">
              {CERTIFICACIONES.map((c) => (
                <article key={c.t} className="card mini"><h3>{c.t}</h3><p>{c.e}</p></article>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="foot">
        <span>Ethos IA es una marca de ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador</span>
        <span>© 2026 ETHOSLAB S.A.S.</span>
      </footer>

      <style jsx>{`
        .p { min-height: 100vh; background: #eaf2f8; color: #05111e; font-family: var(--font-brand), -apple-system, sans-serif; scroll-behavior: smooth; }
        .nav { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; background: #05111e; }
        .nav :global(.brand) { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border: 1px solid #123048; border-radius: 999px; color: #eaf2f8; font-size: 15px; font-weight: 600; }
        .nav :global(.back) { color: #c4d3e0; font-size: 13px; }

        .hero { position: relative; overflow: hidden; background: #05111e; color: #eaf2f8; padding: 128px 48px 64px; display: grid; grid-template-columns: 200px 1fr; gap: 40px; align-items: center; }
        .brillo { position: absolute; width: 520px; height: 520px; right: -140px; top: -220px; background: radial-gradient(circle, rgba(4,235,255,0.28), transparent 65%); animation: flota 9s ease-in-out infinite; }
        @keyframes flota { 50% { transform: translate(-40px, 30px) scale(1.08); } }
        .foto { position: relative; width: 190px; height: 190px; border-radius: 50%; overflow: hidden; border: 3px solid #04ebff; box-shadow: 0 0 0 8px rgba(4,235,255,0.12), 0 0 60px rgba(4,235,255,0.25); }
        .foto :global(img) { width: 100%; height: 100%; object-fit: cover; }
        .txt { position: relative; }
        .eyebrow { font-size: 12px; letter-spacing: 0.18em; color: #04ebff; }
        h1 { font-size: clamp(1.8rem, 3.6vw, 2.8rem); margin: 10px 0 4px; line-height: 1.15; }
        .sub { color: #04ebff; margin: 0 0 14px; font-size: 15px; }
        .lead { color: #c4d3e0; line-height: 1.7; max-width: 64ch; margin: 0 0 20px; }
        .enlaces { display: flex; gap: 10px; flex-wrap: wrap; }
        .enlaces :global(a), .enlaces a { padding: 9px 16px; border: 1px solid #123048; border-radius: 999px; color: #eaf2f8; font-size: 13px; transition: all 0.2s ease; }
        .enlaces :global(a:hover), .enlaces a:hover { border-color: #04ebff; color: #04ebff; transform: translateY(-2px); }

        .cifras { list-style: none; padding: 0 24px; margin: -34px auto 0; max-width: 960px; position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; }
        .cifras li { background: #fff; border-radius: 14px; padding: 18px 20px; display: flex; flex-direction: column; box-shadow: 0 18px 40px rgba(5,17,30,0.1); }
        .cifras strong { font-size: 1.8rem; color: #0b5f75; }
        .cifras span { font-size: 12px; color: #526373; }

        .stack { max-width: 960px; margin: 24px auto 0; padding: 0 24px; display: flex; flex-wrap: wrap; gap: 8px; }
        .stack span { font-size: 12.5px; font-weight: 600; padding: 6px 14px; border-radius: 999px; background: #fff; border: 1px solid rgba(5,17,30,0.1); color: #0b5f75; transition: all 0.2s ease; }
        .stack span:hover { background: #05111e; color: #04ebff; transform: translateY(-2px); }

        .sticky { position: sticky; top: 0; z-index: 30; margin-top: 24px; background: rgba(234,242,248,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(5,17,30,0.08); }
        .sticky ul { list-style: none; margin: 0 auto; padding: 0 24px; max-width: 960px; display: flex; gap: 6px; overflow-x: auto; }
        .sticky a { display: block; padding: 14px 14px; font-size: 13.5px; font-weight: 600; color: #526373; border-bottom: 3px solid transparent; white-space: nowrap; }
        .sticky a:hover { color: #05111e; }
        .sticky a.on { color: #05111e; border-bottom-color: #04ebff; }

        .cuerpo { max-width: 960px; margin: 0 auto; padding: 0 24px 72px; }
        section { padding-top: 56px; scroll-margin-top: 56px; }
        h2 { font-size: 1.5rem; margin: 0 0 10px; }
        .sub-h { font-size: 1.05rem; margin: 36px 0 14px; }
        .revista { background: radial-gradient(120% 90% at 100% 0%, #123a3c 0%, #0a0f1a 55%); color: #eef3f6; border-radius: 22px; padding: 34px clamp(18px, 4vw, 44px) 38px; margin-bottom: 48px; box-shadow: 0 30px 70px rgba(5,17,30,0.35); overflow: hidden; }
        .rv-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; border-bottom: 1px solid rgba(232,178,58,0.45); padding-bottom: 12px; margin-bottom: 26px; }
        .rv-sello { background: #e8b23a; color: #0a0f1a; font: 700 11px 'IBM Plex Mono', monospace; letter-spacing: .18em; text-transform: uppercase; padding: 6px 12px; border-radius: 4px; }
        .rv-ed { font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: #8fa89c; }
        .rv-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 32px; align-items: center; }
        .rv-kicker { color: #2fd8c9; font: 600 12px 'IBM Plex Mono', monospace; letter-spacing: .16em; text-transform: uppercase; }
        .revista h2 { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(30px, 4.2vw, 50px); line-height: 1.05; margin: 12px 0 16px; color: #fff; letter-spacing: -0.01em; }
        .revista h2 em { color: #e8b23a; font-style: italic; }
        .rv-bajada { font-size: 17px; line-height: 1.6; color: #cfdce3; margin: 0 0 16px; }
        .rv-firma { font-size: 14px; color: #8fa89c; margin: 0; }
        .rv-firma strong { color: #eef3f6; }
        .rv-foto { order: -1; margin: 0 0 8px; position: relative; min-width: 0; justify-self: center; width: 100%; }
        .rv-foto :global(img) { width: min(100%, calc((var(--alto) - 120px) * 0.8)); height: auto; display: block; margin: 0 auto; border-radius: 6px; box-shadow: 0 34px 70px rgba(0,0,0,0.55); }
        .rv-foto figcaption { font: 500 11px 'IBM Plex Mono', monospace; color: #8fa89c; margin-top: 10px; text-align: center; }
        .rv-cifras { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(238,243,246,0.12); border-radius: 14px; overflow: hidden; margin: 34px 0 28px; }
        .rv-cifras div { background: rgba(10,15,26,0.85); padding: 20px 18px; }
        .rv-cifras b { display: block; font-family: Georgia, serif; font-size: clamp(26px, 3vw, 36px); color: #2fd8c9; margin-bottom: 6px; }
        .rv-cifras div:nth-child(2) b { color: #e8b23a; }
        .rv-cifras span { font-size: 13px; line-height: 1.45; color: #b7c6cd; }
        .rv-cita { font-family: Georgia, serif; font-style: italic; font-size: clamp(18px, 2.2vw, 24px); line-height: 1.45; color: #fff; border-left: 4px solid #e8b23a; margin: 0 0 28px; padding: 4px 0 4px 20px; max-width: 60ch; }
        .rv-acciones { display: flex; gap: 12px; flex-wrap: wrap; }
        .revista :global(.rv-btn) { background: #2fd8c9; color: #0a0f1a; font-weight: 700; padding: 13px 22px; border-radius: 999px; text-decoration: none; transition: transform .2s ease, box-shadow .2s ease; }
        .revista :global(.rv-btn:hover) { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(47,216,201,0.35); }
        .revista :global(.rv-btn.sec) { background: transparent; color: #eef3f6; border: 1px solid rgba(238,243,246,0.4); }
        @media (max-width: 900px) { .rv-grid { grid-template-columns: 1fr; } .rv-cifras { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 420px) { .rv-cifras { grid-template-columns: 1fr; } }
        .intro { color: #33414d; line-height: 1.7; margin: 0 0 16px; max-width: 70ch; }

        .filtros { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
        .f { border: 1px solid rgba(5,17,30,0.15); background: #fff; color: #33414d; padding: 7px 14px; border-radius: 999px; font: inherit; font-size: 13px; cursor: pointer; }
        .f.on { background: #05111e; color: #04ebff; border-color: #05111e; }
        .f:focus-visible, .sticky a:focus-visible { outline: 2px solid #04ebff; outline-offset: 2px; }
        .tabla { background: #fff; border-radius: 14px; border: 1px solid rgba(5,17,30,0.08); overflow: hidden; }
        .fila { display: grid; grid-template-columns: 120px 220px 1fr; gap: 18px; padding: 14px 20px; font-size: 14px; line-height: 1.6; align-items: start; }
        .fila + .fila { border-top: 1px solid rgba(5,17,30,0.07); }
        .area { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 6px; width: fit-content; background: #eaf2f8; color: #0b5f75; }
        .a-seguridad { background: #fde3e3; color: #8a1c1c; }
        .a-datos { background: #fff1d6; color: #7a4b00; }
        .a-práctica { background: #dff5e6; color: #14653a; }
        .ev { color: #33414d; }

        .rejilla { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 16px; }
        .rejilla.c2 { grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); }
        .rejilla.cert { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        .card { position: relative; background: #fff; border-radius: 16px; border: 1px solid rgba(5,17,30,0.08); padding: 22px; box-shadow: 0 10px 28px rgba(5,17,30,0.05); transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(5,17,30,0.12); border-color: #04ebff; }
        .num { position: absolute; right: 16px; top: 8px; font-size: 2.6rem; font-weight: 800; color: rgba(4,235,255,0.22); }
        .card h3 { font-size: 16px; margin: 0 0 8px; padding-right: 40px; }
        .card p { font-size: 14px; color: #33414d; line-height: 1.65; margin: 0 0 14px; }
        .punto { display: inline-block; font-size: 11.5px; font-weight: 700; color: #0b5f75; background: #eaf2f8; padding: 3px 10px; border-radius: 6px; margin-bottom: 10px; }
        .tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .tags span { font-size: 11px; padding: 4px 10px; border-radius: 999px; background: #05111e; color: #04ebff; }
        .comp { display: flex; gap: 14px; align-items: flex-start; }
        .comp p { margin: 0; }
        .ico { font-size: 1.6rem; }
        .mini h3 { padding-right: 0; font-size: 15px; }
        .mini p { margin: 0; color: #526373; }
        .notas { display: flex; flex-direction: column; gap: 12px; background: #fff; border-radius: 16px; border: 1px solid rgba(5,17,30,0.08); padding: 22px; }

        .club-cifras { list-style: none; padding: 0; margin: 0 0 18px; display: flex; flex-wrap: wrap; gap: 12px; }
        .club-cifras li { background: #05111e; border-radius: 14px; padding: 14px 22px; display: flex; flex-direction: column; min-width: 130px; }
        .club-cifras strong { font-size: 1.7rem; color: #04ebff; line-height: 1.1; }
        .club-cifras span { font-size: 12px; color: #c4d3e0; }
        .club-cta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
        .club-cta .btn { padding: 10px 18px; border-radius: 999px; background: #05111e; color: #04ebff; font-size: 13.5px; font-weight: 700; transition: transform 0.2s ease; }
        .club-cta .btn.sec { background: #fff; color: #0b5f75; border: 1px solid rgba(5,17,30,0.15); }
        .club-cta .btn:hover { transform: translateY(-2px); }
        .linea { list-style: none; padding: 0 0 0 28px; margin: 0; border-left: 2px solid #04ebff; display: flex; flex-direction: column; gap: 22px; }
        .linea li { position: relative; display: flex; gap: 16px; align-items: flex-start; }
        .linea li::before { content: ''; position: absolute; left: -37px; top: 6px; width: 14px; height: 14px; border-radius: 50%; background: #04ebff; box-shadow: 0 0 0 5px rgba(4,235,255,0.2); }
        .marca { flex-shrink: 0; min-width: 78px; text-align: center; font-weight: 800; font-size: 13px; color: #04ebff; background: #05111e; padding: 6px 10px; border-radius: 8px; }
        .linea strong { display: block; font-size: 15px; }
        .lugar { display: block; color: #0b5f75; font-size: 14px; }
        .linea em { color: #526373; font-style: normal; font-size: 13.5px; }

        .foot { background: #030a12; color: #93aabb; padding: 28px 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; }
        @media (max-width: 760px) {
          .nav, .foot { padding-left: 18px; padding-right: 18px; }
          .hero { grid-template-columns: 1fr; padding: 104px 20px 64px; text-align: center; justify-items: center; }
          .enlaces { justify-content: center; }
          .cuerpo { padding: 0 16px 56px; }
          .fila { grid-template-columns: 1fr; gap: 6px; }
          .rejilla.c2 { grid-template-columns: 1fr; }
          .stack { justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) { .brillo { animation: none; } .card, .stack span, .enlaces a { transition: none; } .p { scroll-behavior: auto; } }
      `}</style>
    </div>
  );
}
