import Link from 'next/link';
import Header from '../components/home/Header';
import Seo from '../components/Seo';
import { migas } from '../lib/seo';

const PORTAL = 'https://tei.unemi.edu.ec/voting-absence';
const WORD = '/descargas/Formato_Justificacion_Estudiante_En_Linea.docx';
const PDF = '/descargas/Formato_Justificacion_Estudiante_En_Linea.pdf';

const PASOS = [
  { titulo: 'Descarga el formato', detalle: 'Bájalo en Word para editarlo a tu gusto. También puedes subirlo a Google Docs desde tu cuenta. Reemplaza solo los campos resaltados en amarillo.' },
  { titulo: 'Reúne tus anexos', detalle: 'Certificado de matrícula de tu carrera en línea, comprobante de tu domicilio fuera de Milagro (planilla de servicio básico, certificado de residencia o contrato de arriendo) y copia de tu cédula.' },
  { titulo: 'Firma el oficio', detalle: 'Sirve la firma autógrafa o la firma electrónica. Guarda el oficio y los anexos en PDF, JPG o PNG, de hasta 10 MB cada archivo.' },
  { titulo: 'Súbelo al portal del Tribunal', detalle: 'En «Su justificación» elige el motivo «Estudiante en línea», explica brevemente tu caso y adjunta el documento.' },
  { titulo: 'Guarda la constancia', detalle: 'Conserva la captura o el correo de confirmación. El Tribunal responde por correo.' },
];

const REGLAS = [
  { ref: 'Art. 3', detalle: 'El sufragio es un derecho y un deber de los estudiantes regulares matriculados a partir del segundo año de la carrera.' },
  { ref: 'Art. 79', detalle: 'Quien consta en el padrón y no sufragó tiene ocho días hábiles, contados desde el día siguiente a la elección, para presentar su justificación.' },
  { ref: 'Art. 80, n.º 5', detalle: 'Es motivo válido el de los estudiantes de carreras en modalidad en línea que no tengan su domicilio en la ciudad de Milagro, con la documentación pertinente.' },
  { ref: 'Art. 81 y Disp. Gral. Primera', detalle: 'El Tribunal informa al Órgano Colegiado Superior las novedades del proceso, y este puede disponer procedimientos disciplinarios por la omisión del voto.' },
];

export default function JustificacionSufragio() {
  return (
    <div className="app" id="contenido-principal">
      <Seo
        titulo="Justifica tu voto si eres estudiante en línea de la UNEMI | Ethos IA"
        descripcion="Formato gratuito en Word y PDF para justificar la omisión del sufragio de estudiantes en línea de la UNEMI, con los pasos y el fundamento del Reglamento de Elecciones."
        ruta="/justificacion-sufragio"
        jsonld={[migas([{ nombre: 'Inicio', ruta: '/' }, { nombre: 'Justificación de sufragio', ruta: '/justificacion-sufragio' }])]}
      />

      <Header />

      <header className="hero">
        <span className="eyebrow">AYUDA GRATUITA PARA ESTUDIANTES EN LÍNEA DE LA UNEMI</span>
        <h1>Justifica tu voto en cinco pasos</h1>
        <p>
          Si estudias en modalidad en línea y vives fuera de Milagro, el Reglamento de Elecciones de la UNEMI te permite
          justificar que no sufragaste. Descarga el formato, complétalo con tus datos y envíalo al Tribunal Electoral.
        </p>
        <div className="acciones">
          <a className="btn primario" href={WORD} download>Descargar en Word (.docx)</a>
          <a className="btn" href={PDF} download>Descargar PDF</a>
          <a className="btn" href={PORTAL} target="_blank" rel="noopener noreferrer">Ir al portal del Tribunal →</a>
        </div>
      </header>

      <main className="cuerpo">
        <section aria-labelledby="t-quien">
          <h2 id="t-quien">Quién puede usar este formato</h2>
          <div className="card destacada">
            <p>
              Está pensado para quien cumple <strong>las dos condiciones</strong>: estudia en una carrera de la <strong>modalidad en línea</strong> y su
              <strong> domicilio está fuera de la ciudad de Milagro</strong>, como establece el numeral 5 del artículo 80.
            </p>
            <p>Si vives en Milagro, ese numeral no te aplica y no debes afirmar lo contrario en tu oficio. Consulta tu caso directamente con el Tribunal.</p>
          </div>
        </section>

        <section aria-labelledby="t-pasos">
          <h2 id="t-pasos">Cómo justificarte</h2>
          <ol className="pasos">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="card">
                <span className="num" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3>{p.titulo}</h3>
                  <p>{p.detalle}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="t-plazo">
          <h2 id="t-plazo">Plazo y por qué importa</h2>
          <p className="resumen">
            El plazo corre desde el día siguiente a cada elección: la primera vuelta fue el <strong>27 de octubre de 2026</strong> y la segunda es el <strong>11 de noviembre de 2026</strong>.
            Son ocho días hábiles; confirma la fecha exacta de cierre con el Tribunal. El Reglamento establece que el sufragio es obligatorio y que su incumplimiento puede dar lugar a un
            proceso disciplinario según la normativa institucional. Justificar a tiempo y con documentos es la forma de que el Tribunal califique tu caso.
          </p>
          <div className="rejilla">
            {REGLAS.map((r) => (
              <article key={r.ref} className="card">
                <h3>{r.ref}</h3>
                <p>{r.detalle}</p>
              </article>
            ))}
          </div>
          <p className="fuente">Fuente: Reglamento de Elecciones de la Universidad Estatal de Milagro (RO.17, versión 4.00, última reforma 11/02/2026).</p>
        </section>

        <section aria-labelledby="t-aviso">
          <h2 id="t-aviso">Una ayuda de Ethos IA a la comunidad</h2>
          <p className="resumen">
            Ethos IA, marca de ETHOSLAB S.A.S., ofrece este formato sin costo a los estudiantes en línea de la UNEMI. Es una guía informativa: no constituye asesoría legal, no reemplaza la
            decisión del Tribunal Electoral Institucional y este sitio no está afiliado a la universidad. La información de tu oficio debe ser veraz y respaldada con tus documentos.
            Conoce más sobre <Link href="/academia">Ethos IA Academia</Link>.
          </p>
          <div className="acciones">
            <a className="btn primario" href={WORD} download>Descargar en Word (.docx)</a>
            <a className="btn oscuro" href={PORTAL} target="_blank" rel="noopener noreferrer">Presentar mi justificación →</a>
          </div>
        </section>
      </main>

      <footer className="foot">
        <span>Ethos IA es una marca de ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador</span>
        <span>© 2026 ETHOSLAB S.A.S.</span>
      </footer>

      <style jsx>{`
        .app { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; }
        .hero { background: var(--c-azul); color: var(--c-claro); padding: 128px 48px 80px; }
        .eyebrow { font-size: 12px; letter-spacing: 0.18em; color: var(--c-cian); }
        h1 { font-size: clamp(1.8rem, 3.4vw, 2.6rem); line-height: 1.2; margin: 14px 0 0; max-width: 22ch; text-wrap: balance; }
        .hero p { color: var(--c-claro-2); line-height: 1.7; max-width: 62ch; margin: 18px 0 0; }
        .acciones { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
        .btn { padding: 12px 20px; border-radius: 999px; border: 1px solid var(--c-azul-3); color: var(--c-claro); font-size: 14px; font-weight: 600; }
        .btn.primario { background: var(--c-cian); color: var(--c-azul); border-color: var(--c-cian); }
        .btn.oscuro { background: var(--c-azul); color: var(--c-claro); }
        .btn:focus-visible { outline: 2px solid var(--c-cian); outline-offset: 2px; }
        .cuerpo { max-width: 960px; margin: -28px auto 0; padding: 0 24px 72px; }
        section { margin-top: 44px; scroll-margin-top: 96px; }
        h2 { font-size: 1.4rem; margin: 0 0 12px; }
        .resumen { color: var(--c-texto-2); line-height: 1.7; margin: 0 0 18px; max-width: 72ch; }
        .resumen :global(a) { color: var(--c-teal); font-weight: 700; }
        .rejilla { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
        .card { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: 14px; padding: 22px; box-shadow: 0 10px 28px rgba(5,17,30,0.05); }
        .card.destacada { border-left: 4px solid var(--c-cian); box-shadow: 0 18px 40px rgba(5,17,30,0.08); }
        .card h3 { font-size: 16px; margin: 0 0 8px; }
        .card p { font-size: 14.5px; color: var(--c-texto-2); line-height: 1.65; margin: 0 0 10px; }
        .card p:last-child { margin-bottom: 0; }
        .pasos { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px; }
        .pasos .card { display: flex; gap: 18px; align-items: flex-start; }
        .num { flex: none; width: 36px; height: 36px; border-radius: 50%; background: var(--c-azul); color: var(--c-cian); display: grid; place-items: center; font-weight: 700; }
        .fuente { font-size: 12.5px; color: var(--c-texto-3); margin: 14px 0 0; }
        .foot { background: var(--c-azul-profundo); color: var(--c-apagado); padding: 28px 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; }
        @media (max-width: 600px) {
          .hero { padding: 104px 16px 56px; }
          .cuerpo { padding: 0 16px 56px; }
          .foot { padding-left: 16px; padding-right: 16px; }
          .pasos .card { gap: 12px; padding: 18px; }
        }
      `}</style>
    </div>
  );
}
