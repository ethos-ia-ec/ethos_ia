import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../components/home/Header';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { COMPANY_EMAIL } from '../lib/contactLinks';
import { migas } from '../lib/seo';

const COLORES = [
  { nombre: 'Cian Ethos', hex: '#04ebff', uso: 'Acento sobre fondos oscuros, enlaces destacados y estados activos.' },
  { nombre: 'Azul noche', hex: '#05111e', uso: 'Fondo principal, encabezados y texto sobre fondos claros.' },
  { nombre: 'Azul superficie', hex: '#0a1b2b', uso: 'Tarjetas y paneles sobre fondo oscuro.' },
  { nombre: 'Azul borde', hex: '#123048', uso: 'Bordes y divisores sobre fondo oscuro.' },
  { nombre: 'Teal profundo', hex: '#0b5f75', uso: 'Acento y enlaces sobre fondos claros.' },
  { nombre: 'Niebla', hex: '#eaf2f8', uso: 'Fondo claro y texto sobre fondos oscuros.' },
  { nombre: 'Violeta suave', hex: '#7aa7ff', uso: 'Acento secundario (degradados y progreso).' },
];

const DESCARGAS = [
  { archivo: 'ethos-ia-vertical-color.png', titulo: 'Logotipo vertical a color', nota: 'Fondo transparente, para fondos oscuros.', fondo: '#05111e' },
  { archivo: 'ethos-ia-cubo.png', titulo: 'Símbolo (cubo E · I · A)', nota: 'Fondo transparente. Íconos y avatares.', fondo: '#05111e' },
  { archivo: 'ethos-ia-horizontal-oscuro.png', titulo: 'Horizontal sobre fondo oscuro', nota: 'Encabezados, firmas y presentaciones.', fondo: '#000000' },
  { archivo: 'ethos-ia-horizontal-claro.png', titulo: 'Horizontal sobre fondo claro', nota: 'Documentos y material impreso.', fondo: '#ffffff' },
  { archivo: 'ethos-ia-mono-claro.png', titulo: 'Monocromo claro', nota: 'Una tinta, sobre fondo oscuro.', fondo: '#000000' },
  { archivo: 'ethos-ia-mono-oscuro.png', titulo: 'Monocromo oscuro', nota: 'Una tinta, sobre fondo claro.', fondo: '#ffffff' },
];

const CORRECTO = [
  'Usar el logotipo en las variantes entregadas, sin redibujarlo.',
  'Respetar el espacio de respeto: al menos la altura de la letra «E» del cubo en todos los lados.',
  'Sobre fondos oscuros, usar la versión a color o monocromo claro; sobre claros, la horizontal clara o monocromo oscuro.',
  'Mantener la proporción original al cambiar de tamaño.',
];
const INCORRECTO = [
  'Estirar, inclinar o comprimir el logotipo.',
  'Cambiar los colores del cubo o de las letras.',
  'Colocarlo sobre fondos con poco contraste o con imágenes recargadas.',
  'Añadir sombras, contornos o efectos que no estén en el original.',
  'Separar las letras del símbolo en usos donde exista la versión completa.',
];
const VOZ = [
  ['Profesional y claro', 'Frases directas, sin jerga innecesaria; explicamos qué hacemos y por qué.'],
  ['Verificable', 'Solo afirmamos lo que podemos respaldar con evidencia, cifras reales o documentos.'],
  ['Responsable', 'Hablamos de seguridad, ética y protección de datos con serenidad, sin alarmismo.'],
  ['Cercano', 'Español neutro, formal pero accesible, pensado para pequeñas y medianas empresas.'],
];

const hexARgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const luminancia = (hex) => {
  const [r, g, b] = hexARgb(hex).map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contraste = (a, b) => { const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const nivel = (c) => (c >= 7 ? 'AAA' : c >= 4.5 ? 'AA' : c >= 3 ? 'AA (texto grande)' : 'No cumple');

const PAREJAS = [
  ['#04ebff', '#05111e', 'Cian sobre azul noche'],
  ['#eaf2f8', '#05111e', 'Niebla sobre azul noche'],
  ['#05111e', '#eaf2f8', 'Azul noche sobre niebla'],
  ['#0b5f75', '#ffffff', 'Teal profundo sobre blanco'],
  ['#0b5f75', '#eaf2f8', 'Teal profundo sobre niebla'],
  ['#05111e', '#04ebff', 'Azul noche sobre cian (botones)'],
];

function Muestra({ c }) {
  const [copiado, setCopiado] = useState(false);
  const [r, g, b] = hexARgb(c.hex);
  const copiar = async () => {
    try { await navigator.clipboard.writeText(c.hex); setCopiado(true); setTimeout(() => setCopiado(false), 1500); } catch { setCopiado(false); }
  };
  const oscuro = luminancia(c.hex) < 0.35;
  return (
    <article className="color">
      <button type="button" className="chip" style={{ background: c.hex, color: oscuro ? '#eaf2f8' : '#05111e' }} onClick={copiar} aria-label={`Copiar ${c.hex} (${c.nombre})`}>
        {copiado ? '✓ Copiado' : c.hex.toUpperCase()}
      </button>
      <h3>{c.nombre}</h3>
      <p className="rgb">RGB {r}, {g}, {b}</p>
      <p>{c.uso}</p>
      <style jsx>{`
        .color { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: var(--r-lg); padding: var(--s-4); box-shadow: var(--sombra-1); }
        .chip { width: 100%; height: 84px; border-radius: var(--r-md); border: 1px solid rgba(5,17,30,0.12); font: inherit; font-weight: 700; letter-spacing: 0.05em; cursor: pointer; }
        h3 { font-size: var(--t-base); margin: var(--s-3) 0 2px; }
        .rgb { font-family: var(--f-mono); font-size: var(--t-xs); color: var(--c-texto-3); margin: 0 0 var(--s-2); }
        p { margin: 0; font-size: var(--t-sm); color: var(--c-texto-2); line-height: 1.6; }
      `}</style>
    </article>
  );
}

export default function Marca() {
  return (
    <div className="marca" id="contenido-principal">
      <Seo
        titulo="Identidad de marca de Ethos IA — logotipo, colores y tipografía"
        descripcion="Guía de marca de Ethos IA (ETHOSLAB S.A.S.): logotipo y variantes descargables, paleta de colores, tipografía, reglas de uso y tono de voz."
        ruta="/marca"
        jsonld={[migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Identidad de marca', ruta: '/marca' }])]}
      />
      <Header />

      <header className="hero">
        <span className="eyebrow">IDENTIDAD DE MARCA</span>
        <h1>Cómo se ve y cómo habla Ethos IA</h1>
        <p>Logotipo, colores, tipografía y reglas de uso. Un mismo criterio en el sitio, los documentos y las presentaciones de ETHOSLAB S.A.S.</p>
        <nav className="ancla" aria-label="Secciones de la guía">
          <a href="#logotipo">Logotipo</a><a href="#color">Color</a><a href="#tipografia">Tipografía</a><a href="#uso">Uso</a><a href="#voz">Voz</a>
        </nav>
      </header>

      <main className="cuerpo">
        <section id="logotipo" aria-labelledby="h-logo">
          <Reveal>
            <h2 id="h-logo">Logotipo y variantes</h2>
            <p className="intro">El símbolo es un cubo con las letras E, I y A: <em>ethos</em> (carácter), inteligencia y auditoría. Cada variante se descarga en PNG.</p>
            <div className="rejilla logos">
              {DESCARGAS.map((d) => (
                <article key={d.archivo} className="logo-card">
                  <div className="lienzo" style={{ background: d.fondo }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/marca/${d.archivo}`} alt={d.titulo} loading="lazy" />
                  </div>
                  <h3>{d.titulo}</h3>
                  <p>{d.nota}</p>
                  <a href={`/marca/${d.archivo}`} download>Descargar PNG →</a>
                </article>
              ))}
            </div>

            <h3 className="sub">Espacio de respeto y tamaño mínimo</h3>
            <div className="respeto">
              <div className="caja"><div className="interior"><Image src="/marca/ethos-ia-cubo.png" alt="Símbolo de Ethos IA con espacio de respeto" width={110} height={128} /></div><span>Espacio de respeto = altura de la «E»</span></div>
              <ul>
                <li><strong>Símbolo solo:</strong> mínimo 24 px en pantalla (16 px como favicon) y 8 mm impreso.</li>
                <li><strong>Logotipo completo:</strong> mínimo 120 px de ancho en pantalla y 30 mm impreso.</li>
                <li>El lema «Software · Inteligencia artificial · Auditoría» solo se usa cuando el logotipo supera los 240 px de ancho.</li>
              </ul>
            </div>
          </Reveal>
        </section>

        <section id="color" aria-labelledby="h-color">
          <Reveal>
            <h2 id="h-color">Paleta de colores</h2>
            <p className="intro">Haz clic en un color para copiar su valor HEX.</p>
            <div className="rejilla colores">{COLORES.map((c) => <Muestra key={c.hex} c={c} />)}</div>

            <h3 className="sub">Combinaciones y contraste (WCAG)</h3>
            <div className="tabla" role="table" aria-label="Contraste de combinaciones de color">
              {PAREJAS.map(([fg, bg, nombre]) => {
                const c = contraste(fg, bg);
                return (
                  <div key={nombre} className="fila" role="row">
                    <span className="par" style={{ background: bg, color: fg }} aria-hidden="true">Aa</span>
                    <strong>{nombre}</strong>
                    <span className="ratio">{c.toFixed(1)} : 1</span>
                    <span className={c >= 4.5 ? 'nivel ok' : 'nivel aviso'}>{nivel(c)}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>

        <section id="tipografia" aria-labelledby="h-tipo">
          <Reveal>
            <h2 id="h-tipo">Tipografía</h2>
            <div className="tipo">
              <div className="muestra-tipo" style={{ fontWeight: 600 }}>
                <span className="gigante">Aa</span>
                <div><strong>Sora</strong><p>Títulos, texto y interfaz. Pesos 300 a 800.</p></div>
              </div>
              <div className="escala">
                <p style={{ fontSize: 'var(--t-2xl)', fontWeight: 600, margin: 0 }}>Título principal</p>
                <p style={{ fontSize: 'var(--t-xl)', fontWeight: 600, margin: 0 }}>Título de sección</p>
                <p style={{ fontSize: 'var(--t-lg)', margin: 0 }}>Subtítulo o texto destacado</p>
                <p style={{ fontSize: 'var(--t-base)', margin: 0 }}>Texto de lectura: claro, con interlineado amplio y líneas de unos 70 caracteres.</p>
                <code style={{ fontFamily: 'var(--f-mono)', fontSize: 'var(--t-sm)' }}>Monoespaciada: solo para código y comandos.</code>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="uso" aria-labelledby="h-uso">
          <Reveal>
            <h2 id="h-uso">Uso correcto del logotipo</h2>
            <div className="dos">
              <div className="bien"><h3>✓ Hacer</h3><ul>{CORRECTO.map((t) => <li key={t}>{t}</li>)}</ul></div>
              <div className="mal"><h3>✗ Evitar</h3><ul>{INCORRECTO.map((t) => <li key={t}>{t}</li>)}</ul></div>
            </div>
          </Reveal>
        </section>

        <section id="voz" aria-labelledby="h-voz">
          <Reveal>
            <h2 id="h-voz">Tono de voz</h2>
            <div className="rejilla voz">
              {VOZ.map(([t, d]) => <article key={t} className="voz-card"><h3>{t}</h3><p>{d}</p></article>)}
            </div>
            <div className="contacto">
              <h3>Uso de marca y prensa</h3>
              <p>Para solicitar autorización de uso del logotipo o material gráfico, escribe a <a href={`mailto:${COMPANY_EMAIL}?subject=Uso de marca Ethos IA`}>{COMPANY_EMAIL}</a>. También puedes volver al <Link href="/">sitio principal</Link> o conocer a <Link href="/equipo">nuestro equipo</Link>.</p>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="foot"><span>Ethos IA es una marca de ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador</span><span>© 2026 ETHOSLAB S.A.S.</span></footer>

      <style jsx>{`
        .marca { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; scroll-behavior: smooth; }
        .hero { background: var(--c-azul); color: var(--c-claro); padding: clamp(104px, 14vw, 140px) var(--gutter) var(--s-8); }
        .eyebrow { font-size: var(--t-xs); letter-spacing: 0.18em; color: var(--c-cian); }
        h1 { font-size: var(--t-2xl); line-height: 1.15; margin: var(--s-3) 0 var(--s-4); max-width: 20ch; text-wrap: balance; }
        .hero p { color: var(--c-claro-2); line-height: 1.7; max-width: 60ch; margin: 0; }
        .ancla { display: flex; gap: var(--s-2); flex-wrap: wrap; margin-top: var(--s-6); }
        .ancla :global(a), .ancla a { padding: 9px 16px; border: 1px solid var(--c-azul-3); border-radius: var(--r-pill); color: var(--c-claro); font-size: var(--t-sm); transition: all var(--d-rapida) ease; }
        .ancla a:hover { border-color: var(--c-cian); color: var(--c-cian); }
        .cuerpo { max-width: var(--ancho-max); margin: 0 auto; padding: 0 var(--gutter) var(--s-9); }
        section { padding-top: var(--s-8); scroll-margin-top: 80px; }
        h2 { font-size: var(--t-xl); margin: 0 0 var(--s-3); }
        .sub { font-size: var(--t-lg); margin: var(--s-7) 0 var(--s-4); }
        .intro { color: var(--c-texto-2); line-height: 1.7; max-width: 70ch; margin: 0 0 var(--s-5); }
        .rejilla { display: grid; gap: var(--s-5); }
        .logos { grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); }
        .colores { grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr)); gap: var(--s-4); }
        .voz { grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); }
        .logo-card { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: var(--r-xl); padding: var(--s-4); box-shadow: var(--sombra-1); display: flex; flex-direction: column; gap: var(--s-2); }
        .lienzo { border-radius: var(--r-md); aspect-ratio: 16 / 10; display: flex; align-items: center; justify-content: center; padding: var(--s-4); overflow: hidden; border: 1px solid var(--c-borde); }
        .lienzo img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .logo-card h3 { font-size: var(--t-base); margin: var(--s-2) 0 0; }
        .logo-card p { margin: 0; font-size: var(--t-sm); color: var(--c-texto-3); }
        .logo-card a { margin-top: auto; padding-top: var(--s-2); color: var(--c-teal); font-weight: 700; font-size: var(--t-sm); }
        .respeto { display: grid; grid-template-columns: auto 1fr; gap: var(--s-6); align-items: center; background: var(--c-tarjeta); border-radius: var(--r-xl); padding: var(--s-5); border: 1px solid var(--c-borde); }
        .caja { display: flex; flex-direction: column; align-items: center; gap: var(--s-2); font-size: var(--t-xs); color: var(--c-texto-3); }
        .interior { position: relative; padding: 32px; background: var(--c-azul); border-radius: var(--r-md); outline: 2px dashed var(--c-cian); outline-offset: -2px; }
        .respeto ul { margin: 0; padding-left: 18px; line-height: 1.8; color: var(--c-texto-2); font-size: var(--t-sm); }
        .tabla { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: var(--r-lg); overflow: hidden; }
        .fila { display: grid; grid-template-columns: 56px 1fr auto auto; gap: var(--s-4); align-items: center; padding: var(--s-3) var(--s-4); font-size: var(--t-sm); }
        .fila + .fila { border-top: 1px solid var(--c-borde); }
        .par { width: 44px; height: 32px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; font-weight: 700; border: 1px solid rgba(5,17,30,0.12); }
        .ratio { font-family: var(--f-mono); color: var(--c-texto-3); }
        .nivel { font-size: var(--t-xs); font-weight: 700; padding: 3px 10px; border-radius: 6px; white-space: nowrap; }
        .nivel.ok { background: var(--c-ok-bg); color: var(--c-ok); }
        .nivel.aviso { background: var(--c-aviso-bg); color: var(--c-aviso); }
        .tipo { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: var(--s-5); }
        .muestra-tipo { background: var(--c-azul); color: var(--c-claro); border-radius: var(--r-xl); padding: var(--s-6); display: flex; gap: var(--s-5); align-items: center; }
        .muestra-tipo p { margin: 4px 0 0; color: var(--c-claro-2); font-weight: 400; font-size: var(--t-sm); }
        .gigante { font-size: clamp(3.5rem, 8vw, 5.5rem); color: var(--c-cian); line-height: 1; }
        .escala { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: var(--r-xl); padding: var(--s-5); display: flex; flex-direction: column; gap: var(--s-3); }
        .dos { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: var(--s-5); }
        .bien, .mal { border-radius: var(--r-xl); padding: var(--s-5); }
        .bien { background: var(--c-ok-bg); } .mal { background: var(--c-error-bg); }
        .bien h3 { color: var(--c-ok); } .mal h3 { color: var(--c-error); }
        .bien h3, .mal h3 { margin: 0 0 var(--s-3); }
        .bien ul, .mal ul { margin: 0; padding-left: 18px; line-height: 1.8; font-size: var(--t-sm); color: var(--c-texto); }
        .voz-card { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: var(--r-lg); padding: var(--s-5); box-shadow: var(--sombra-1); }
        .voz-card h3 { margin: 0 0 var(--s-2); font-size: var(--t-base); color: var(--c-teal); }
        .voz-card p { margin: 0; font-size: var(--t-sm); color: var(--c-texto-2); line-height: 1.65; }
        .contacto { margin-top: var(--s-6); background: var(--c-azul); color: var(--c-claro-2); border-radius: var(--r-xl); padding: var(--s-5); line-height: 1.7; }
        .contacto h3 { margin: 0 0 var(--s-2); color: var(--c-claro); }
        .contacto p { margin: 0; } .contacto :global(a) { color: var(--c-cian); }
        .foot { background: var(--c-azul-profundo); color: var(--c-apagado); padding: var(--s-5) var(--gutter); display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s-3); font-size: var(--t-xs); }
        @media (max-width: 760px) {
          .respeto, .tipo { grid-template-columns: 1fr; }
          .fila { grid-template-columns: 44px 1fr auto; } .fila .ratio { display: none; }
        }
        @media (prefers-reduced-motion: reduce) { .marca { scroll-behavior: auto; } }
      `}</style>
    </div>
  );
}
