import Header from '../components/home/Header';
import Seo from '../components/Seo';
import { migas } from '../lib/seo';
import Link from 'next/link';

const REPO = 'https://github.com/IngMarlonPerez/ethos-ia-academia';

const PLUGINS = [
  {
    nombre: 'Investigación científica',
    detalle: 'Revisión sistemática PRISMA 2020 con Scopus, OpenAlex y Unpaywall, las cuatro matrices de revisión y redacción en APA 7.',
    tags: ['PRISMA 2020', 'Scopus', 'APA 7'],
  },
  {
    nombre: 'Proyecto de titulación de TI',
    detalle: 'Tesis de punta a punta: trabajos previos, requerimientos, decisiones de arquitectura, UML, documento, video técnico y sustentación.',
    tags: ['ADR', 'UML', 'Tribunal'],
  },
  {
    nombre: 'Economía',
    detalle: 'Consigna y rúbrica, literatura por áreas JEL, matriz de consistencia, ejercicios con ecuaciones de Word y datos de Ecuador.',
    tags: ['JEL', 'Ecuaciones', 'Datos'],
  },
  {
    nombre: 'Prácticas de laboratorio de TI',
    detalle: 'Lectura de la guía, mediciones de red, cifrado, Docker, evidencias e informe en Word sobre la plantilla oficial.',
    tags: ['Redes', 'Docker', 'Informe'],
  },
  {
    nombre: 'Creación de empresa',
    detalle: 'Constitución de una S.A.S. en Ecuador, marca, balance inicial, gobierno societario, sitio web y equipo.',
    tags: ['S.A.S.', 'SCVS', 'SRI'],
  },
];

const CIFRAS = [
  { valor: '75', etiqueta: 'metodologías' },
  { valor: '5', etiqueta: 'áreas académicas' },
  { valor: 'MIT', etiqueta: 'licencia abierta' },
  { valor: '0 $', etiqueta: 'costo de uso' },
];

const PRINCIPIOS = [
  { titulo: 'Solo fuentes académicas', detalle: 'Artículos con DOI leídos en texto completo. Cada cifra se verifica en su fuente antes de citarla.' },
  { titulo: 'La IA no es autora', detalle: 'La autoría es de quien escribe el trabajo. Incluye revisión de rastros de IA y anexo de declaración de uso.' },
  { titulo: 'Tus claves, en tu equipo', detalle: 'Las claves de Scopus y de tu modelo nunca salen de tu computadora. Sin telemetría.' },
];

export default function Academia() {
  return (
    <div className="app" id="contenido-principal">
      <Seo
        titulo="Ethos IA Academia — metodologías académicas abiertas para cualquier modelo de IA | Ethos IA"
        descripcion="Kit abierto de Ethos IA para investigación científica, tesis de TI, Economía y prácticas: 75 metodologías y servidor MCP que funcionan con Claude, GPT, Gemini o modelos locales."
        ruta="/academia"
        jsonld={[migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Ethos IA Academia', ruta: '/academia' }])]}
      />

      <Header />

      <header className="hero">
        <span className="eyebrow">APORTE ABIERTO A LA COMUNIDAD ACADÉMICA</span>
        <h1>Ethos IA Academia</h1>
        <p>
          Metodologías de investigación y titulación listas para usar con cualquier modelo de inteligencia artificial:
          Claude, GPT, Gemini o un modelo local con Ollama. Cada paso exige evidencia verificable y deja la autoría en
          manos de quien investiga.
        </p>
        <div className="acciones">
          <a className="btn primario" href={REPO} target="_blank" rel="noopener noreferrer">Descargar en GitHub →</a>
          <a className="btn" href="#instalar">Cómo instalar</a>
        </div>
      </header>

      <main className="cuerpo">
        <ul className="cifras">
          {CIFRAS.map((c) => (
            <li key={c.etiqueta}><strong>{c.valor}</strong><span>{c.etiqueta}</span></li>
          ))}
        </ul>

        <section aria-labelledby="t-que">
          <h2 id="t-que">Qué incluye</h2>
          <p className="resumen">Cinco paquetes que guían el trabajo académico de principio a fin, con plantillas, scripts y controles de calidad.</p>
          <div className="rejilla">
            {PLUGINS.map((p) => (
              <article key={p.nombre} className="card">
                <h3>{p.nombre}</h3>
                <p>{p.detalle}</p>
                <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="t-modelo">
          <h2 id="t-modelo">Funciona con el modelo que elijas</h2>
          <p className="resumen">
            Se apoya en dos estándares abiertos. El <strong>Model Context Protocol (MCP)</strong> expone las metodologías
            y las herramientas de literatura a cualquier cliente compatible, como Claude Code, Claude Desktop, Goose, Cline
            o Continue. Las <strong>skills</strong> son archivos Markdown que personas y agentes leen por igual.
          </p>
        </section>

        <section aria-labelledby="t-principios">
          <h2 id="t-principios">Principios</h2>
          <div className="rejilla">
            {PRINCIPIOS.map((p) => (
              <article key={p.titulo} className="card">
                <h3>{p.titulo}</h3>
                <p>{p.detalle}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="instalar" aria-labelledby="t-instalar">
          <h2 id="t-instalar">Instalación en Windows</h2>
          <p className="resumen">El instalador prepara Python, pide de forma opcional tu clave de Scopus y registra el kit en tu cliente de IA.</p>
          <pre>{`git clone ${REPO}
cd ethos-ia-academia
powershell -ExecutionPolicy Bypass -File instalar.ps1`}</pre>
          <p className="resumen">En Claude Code también puedes instalarlo directamente:</p>
          <pre>{`/plugin marketplace add IngMarlonPerez/ethos-ia-academia`}</pre>
        </section>

        <section aria-labelledby="t-quien">
          <h2 id="t-quien">Una iniciativa de Ethos IA</h2>
          <p className="resumen">
            Ethos IA Academia es el aporte de ETHOSLAB S.A.S. a estudiantes, docentes e investigadores, impulsado por su
            Gerente General, <Link href="/equipo/marlon-perez">Marlon Pérez</Link>. El código es abierto bajo licencia MIT
            y recibe contribuciones de la comunidad.
          </p>
        </section>
      </main>

      <footer className="foot">
        <span>Ethos IA es una marca de ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador</span>
        <span>© 2026 ETHOSLAB S.A.S.</span>
      </footer>

      <style jsx>{`
        .app { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; }
        .hero { background: var(--c-azul); color: var(--c-claro); padding: 128px 48px 72px; }
        .eyebrow { font-size: 12px; letter-spacing: 0.18em; color: var(--c-cian); }
        h1 { font-size: clamp(1.8rem, 3.4vw, 2.6rem); line-height: 1.2; margin: 14px 0 0; max-width: 22ch; text-wrap: balance; }
        .hero p { color: var(--c-claro-2); line-height: 1.7; max-width: 62ch; margin: 18px 0 0; }
        .acciones { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
        .btn { padding: 12px 20px; border-radius: 999px; border: 1px solid var(--c-azul-3); color: var(--c-claro); font-size: 14px; font-weight: 600; }
        .btn.primario { background: var(--c-cian); color: var(--c-azul); border-color: var(--c-cian); }
        .btn:focus-visible { outline: 2px solid var(--c-cian); outline-offset: 2px; }
        .cuerpo { max-width: 960px; margin: -28px auto 0; padding: 0 24px 72px; }
        section { margin-top: 40px; scroll-margin-top: 96px; }
        h2 { font-size: 1.4rem; margin: 0 0 8px; }
        .resumen { color: var(--c-texto-2); line-height: 1.7; margin: 0 0 18px; max-width: 70ch; }
        .cifras { list-style: none; padding: 0; margin: 0; display: flex; gap: 14px; flex-wrap: wrap; }
        .cifras li { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: 12px; padding: 14px 20px; display: flex; flex-direction: column; min-width: 150px; box-shadow: 0 18px 40px rgba(5,17,30,0.08); }
        .cifras strong { font-size: 1.7rem; color: var(--c-teal); }
        .cifras span { font-size: 12px; color: var(--c-texto-3); }
        .rejilla { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
        .card { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: 14px; padding: 22px; box-shadow: 0 10px 28px rgba(5,17,30,0.05); }
        .card h3 { font-size: 16px; margin: 0 0 8px; }
        .card p { font-size: 14px; color: var(--c-texto-2); line-height: 1.65; margin: 0 0 14px; }
        .tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .tags span { font-size: 11px; padding: 4px 10px; border-radius: 999px; background: var(--c-claro); color: var(--c-teal); }
        pre { background: var(--c-azul); color: var(--c-claro-2); padding: 18px; border-radius: 12px; overflow-x: auto; font-size: 13px; line-height: 1.6; font-family: var(--f-mono); }
        .resumen :global(a) { color: var(--c-teal); font-weight: 700; }
        .foot { background: var(--c-azul-profundo); color: var(--c-apagado); padding: 28px 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; }
        @media (max-width: 600px) {
          .hero { padding: 104px 16px 56px; }
          .cuerpo { padding: 0 16px 56px; }
          .foot { padding-left: 16px; padding-right: 16px; }
        }
      `}</style>
    </div>
  );
}
