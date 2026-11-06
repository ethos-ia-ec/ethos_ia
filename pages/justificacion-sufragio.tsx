import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../components/home/Header';
import Seo from '../components/Seo';
import { migas } from '../lib/seo';

const PORTAL = 'https://tei.unemi.edu.ec/voting-absence';
const WORD = '/descargas/Formato_Justificacion_Estudiante_En_Linea.docx';
const PDF = '/descargas/Formato_Justificacion_Estudiante_En_Linea.pdf';

const PORTAL_IMG = '/descargas/portal-tribunal.webp';
const PORTAL_DOMINIO = 'tei.unemi.edu.ec/voting-absence';

const PAGINAS = [
  { src: '/descargas/formato-grande-1.webp', alt: 'Formato de justificación, página 1: encabezado, antecedentes, motivo, fundamento y petición' },
  { src: '/descargas/formato-grande-2.webp', alt: 'Formato de justificación, página 2: anexos y firma' },
];

type Paso = { titulo: string; detalle: string; portal?: boolean };

const PASOS: Paso[] = [
  { titulo: 'Descarga el formato', detalle: 'Bájalo en Word para editarlo a tu gusto. También puedes subirlo a Google Docs desde tu cuenta. Reemplaza solo los campos resaltados en amarillo.' },
  { titulo: 'Reúne tus anexos', detalle: 'Certificado de matrícula de tu carrera en línea, comprobante de tu domicilio fuera de Milagro (planilla de servicio básico, certificado de residencia o contrato de arriendo) y copia de tu cédula.' },
  { titulo: 'Firma el oficio', detalle: 'Sirve la firma autógrafa o la firma electrónica. Guarda el oficio y los anexos en PDF, JPG o PNG, de hasta 10 MB cada archivo.' },
  { titulo: 'Súbelo al portal del Tribunal', detalle: 'En «Su justificación» elige el motivo «Estudiante en línea», explica brevemente tu caso y adjunta el documento.', portal: true },
  { titulo: 'Guarda la constancia', detalle: 'Conserva la captura o el correo de confirmación. El Tribunal responde por correo.' },
];

const REGLAS = [
  { ref: 'Art. 3', detalle: 'El sufragio es un derecho y un deber de los estudiantes regulares matriculados a partir del segundo año de la carrera.' },
  { ref: 'Art. 79', detalle: 'Quien consta en el padrón y no sufragó tiene ocho días hábiles, contados desde el día siguiente a la elección, para presentar su justificación.' },
  { ref: 'Art. 80, n.º 5', detalle: 'Es motivo válido el de los estudiantes de carreras en modalidad en línea que no tengan su domicilio en la ciudad de Milagro, con la documentación pertinente.' },
  { ref: 'Art. 81 y Disp. Gral. Primera', detalle: 'El Tribunal informa al Órgano Colegiado Superior las novedades del proceso, y este puede disponer procedimientos disciplinarios por la omisión del voto.' },
];

export default function JustificacionSufragio() {
  const [visor, setVisor] = useState<'formato' | 'tribunal' | null>(null);
  const abierto = visor !== null;
  const setAbierto = (v: boolean) => setVisor(v ? 'formato' : null);

  useEffect(() => {
    if (!abierto) return undefined;
    const alTeclear = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false); };
    document.addEventListener('keydown', alTeclear);
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', alTeclear); document.body.style.overflow = previo; };
  }, [abierto]);

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
        <div className="hero-in">
          <div className="hero-texto">
            <span className="eyebrow">AYUDA GRATUITA · ESTUDIANTES EN LÍNEA UNEMI</span>
            <h1>Justifica tu voto en cinco pasos</h1>
            <p className="bajada">
              Si estudias en modalidad en línea y vives fuera de Milagro, el Reglamento de Elecciones de la UNEMI te permite
              justificar que no sufragaste. Descarga el formato, complétalo con tus datos y envíalo al Tribunal Electoral.
            </p>
            <div className="acciones">
              <a className="btn primario" href={WORD} download>Descargar Word</a>
              <a className="btn" href={PDF} download>Descargar PDF</a>
              <a className="btn" href={PORTAL} target="_blank" rel="noopener noreferrer">Ir al portal del Tribunal →</a>
            </div>
          </div>

          <div className="hero-formato">
            <button type="button" className="hojas" onClick={() => setAbierto(true)} aria-label="Ver el formato en pantalla grande">
              {PAGINAS.map((pg, i) => (
                <span key={pg.src} className={`hoja hoja-${i + 1}`}>
                  <Image src={pg.src} alt={pg.alt} fill sizes="(max-width: 859px) 80vw, 40vw" style={{ objectFit: 'contain' }} priority={i === 0} />
                </span>
              ))}
            </button>
            <p className="pie-formato"><span className="icono" aria-hidden="true">PDF</span> Así se ve el formato · toca para ampliar</p>
          </div>
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
                <div className="paso-cuerpo">
                  <h3>{p.titulo}</h3>
                  <p>{p.detalle}</p>
                  {p.portal && (
                    <div className="portal-wrap">
                      <button type="button" className="portal" onClick={() => setVisor('tribunal')} aria-label="Ver el portal del Tribunal Electoral en pantalla grande">
                        <span className="url-barra"><span className="punto" aria-hidden="true" /><span className="url-texto">{PORTAL_DOMINIO}</span><span className="sello">Portal oficial UNEMI</span></span>
                        <Image src={PORTAL_IMG} alt="Portal del Tribunal Electoral Institucional de la UNEMI: formulario «Su justificación» con el motivo «Estudiante en línea»" width={1600} height={775} sizes="(max-width: 600px) 90vw, 520px" />
                      </button>
                      <div className="portal-acciones">
                        <a className="btn-mini fuerte" href={PORTAL} target="_blank" rel="noopener noreferrer">Ir al portal oficial del Tribunal →</a>
                        <button type="button" className="btn-mini" onClick={() => setVisor('tribunal')}>Ver en grande</button>
                      </div>
                      <p className="verifica">Verifica que la dirección sea <strong>tei.unemi.edu.ec</strong>, el dominio oficial de la universidad.</p>
                    </div>
                  )}
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
            <a className="btn primario" href={WORD} download>Descargar Word</a>
            <a className="btn oscuro" href={PORTAL} target="_blank" rel="noopener noreferrer">Presentar mi justificación →</a>
          </div>
        </section>
      </main>

      {abierto && (
        <div className="velo" role="dialog" aria-modal="true" aria-label={visor === 'tribunal' ? 'Portal del Tribunal Electoral' : 'Formato de justificación'} onClick={() => setVisor(null)}>
          <div className="ventana" onClick={(e) => e.stopPropagation()}>
            {visor === 'tribunal' ? (
              <>
                <div className="ventana-barra">
                  <strong>Portal oficial del Tribunal Electoral Institucional · UNEMI</strong>
                  <span className="acciones-mini">
                    <a className="btn-mini fuerte" href={PORTAL} target="_blank" rel="noopener noreferrer">Ir al portal oficial →</a>
                    <button type="button" className="btn-mini" onClick={() => setVisor(null)} autoFocus>Cerrar</button>
                  </span>
                </div>
                <div className="marco">
                  <span className="url-barra grande"><span className="punto" aria-hidden="true" /><span className="url-texto">https://{PORTAL_DOMINIO}</span><span className="sello">Portal oficial UNEMI</span></span>
                  <Image src={PORTAL_IMG} alt="Formulario «Su justificación» del portal del Tribunal Electoral de la UNEMI" width={1600} height={775} sizes="(max-width: 980px) 100vw, 900px" className="pagina-grande" />
                  <p className="leyenda">Así se ve el formulario «Su justificación». Elige el motivo «Estudiante en línea», explica tu caso y adjunta tu oficio y anexos (PDF, JPG o PNG, hasta 10 MB).</p>
                </div>
              </>
            ) : (
              <>
                <div className="ventana-barra">
                  <strong>Formato de justificación · estudiantes en línea</strong>
                  <span className="acciones-mini">
                    <a className="btn-mini" href={PDF} download>Descargar PDF</a>
                    <a className="btn-mini fuerte" href={WORD} download>Descargar Word</a>
                    <button type="button" className="btn-mini" onClick={() => setVisor(null)} autoFocus>Cerrar</button>
                  </span>
                </div>
                <div className="marco">
                  {PAGINAS.map((pg) => (
                    <Image key={pg.src} src={pg.src} alt={pg.alt} width={1241} height={1754} sizes="(max-width: 980px) 100vw, 900px" className="pagina-grande" />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="foot">
        <span>Ethos IA es una marca de ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador</span>
        <span>© 2026 ETHOSLAB S.A.S.</span>
      </footer>

      <style jsx>{`
        .app { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; }

        /* Primera pantalla: ocupa el 100 % de la ventana en cualquier dispositivo (móvil primero). */
        .hero { background: var(--c-azul); color: var(--c-claro); height: 100vh; height: 100svh; min-height: 520px; padding: 84px 16px 12px; box-sizing: border-box; display: flex; }
        .hero-in { width: 100%; max-width: 1560px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); gap: 10px; min-height: 0; }
        .hero-texto { min-width: 0; }
        .eyebrow { display: block; font-size: 10.5px; letter-spacing: 0.14em; color: var(--c-cian); }
        h1 { font-size: clamp(1.45rem, 6.4vw, 2rem); line-height: 1.15; margin: 6px 0 0; text-wrap: balance; }
        .bajada { display: none; color: var(--c-claro-2); line-height: 1.55; margin: 8px 0 0; font-size: 14px; }
        .acciones { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
        .btn { padding: 9px 14px; border-radius: 999px; border: 1px solid var(--c-azul-3); color: var(--c-claro); font-size: 13px; font-weight: 600; }
        .btn.primario { background: var(--c-cian); color: var(--c-azul); border-color: var(--c-cian); }
        .btn.oscuro { background: var(--c-azul); color: var(--c-claro); }
        .btn:focus-visible { outline: 2px solid var(--c-cian); outline-offset: 2px; }

        .hero-formato { min-height: 0; display: flex; flex-direction: column; gap: 6px; }
        .hojas { position: relative; flex: 1; min-height: 0; width: 100%; padding: 0; border: 0; background: transparent; cursor: zoom-in; display: flex; justify-content: center; gap: 14px; }
        .hoja { position: relative; display: block; height: 100%; aspect-ratio: 1241 / 1754; max-width: 100%; background: #fff; border-radius: 4px; box-shadow: 0 12px 30px rgba(0,0,0,0.5); overflow: hidden; }
        .hoja-2 { display: none; }
        .hojas:focus-visible { outline: 2px solid var(--c-cian); outline-offset: 4px; border-radius: 6px; }
        .pie-formato { margin: 0; text-align: center; font-size: 12px; color: var(--c-apagado); }
        .icono { background: #d93a3a; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 5px; border-radius: 3px; margin-right: 4px; }

        /* Teléfonos medianos: aparece la bajada si hay altura suficiente. */
        @media (min-height: 740px) {
          .bajada { display: block; }
          .hero { padding-top: 92px; }
        }
        @media (min-width: 480px) {
          .hero { padding-left: 24px; padding-right: 24px; }
          .btn { font-size: 14px; padding: 10px 18px; }
        }

        /* Tabletas y computadoras: texto a la izquierda y las dos páginas a la derecha, todo en una pantalla. */
        @media (min-width: 860px) {
          .hero { padding: 104px 40px 28px; }
          .hero-in { grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr); grid-template-rows: minmax(0, 1fr); gap: clamp(24px, 4vw, 72px); align-items: center; }
          .eyebrow { font-size: 12px; letter-spacing: 0.18em; }
          h1 { font-size: clamp(2.1rem, 3.3vw, 3.6rem); max-width: 16ch; margin-top: 14px; }
          .bajada { display: block; font-size: clamp(1rem, 1.15vw, 1.25rem); line-height: 1.7; max-width: 56ch; margin-top: 18px; }
          .acciones { margin-top: 26px; gap: 12px; }
          .btn { font-size: clamp(0.9rem, 0.95vw, 1.05rem); padding: 12px 22px; }
          .hero-formato { height: 100%; }
          .hoja-2 { display: block; }
          .pie-formato { font-size: 13px; }
        }
        /* Monitores grandes (27" y 34"): se amplía el contenedor y la tipografía. */
        @media (min-width: 1900px) {
          .hero-in { max-width: 1800px; }
          h1 { font-size: clamp(3.4rem, 3.2vw, 4.6rem); }
          .bajada { font-size: 1.35rem; }
        }
        /* Celulares en horizontal: altura corta, se permite desplazar. */
        @media (max-height: 520px) {
          .hero { height: auto; min-height: 100vh; }
          .hojas { min-height: 70vh; }
        }

        .cuerpo { max-width: 960px; margin: 0 auto; padding: 8px 24px 72px; }
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
        .paso-cuerpo { min-width: 0; flex: 1; }
        .portal-wrap { margin-top: 14px; max-width: 540px; }
        .portal { display: block; width: 100%; padding: 0; border: 1px solid var(--c-borde); border-radius: 10px; overflow: hidden; background: #fff; cursor: zoom-in; box-shadow: 0 10px 28px rgba(5,17,30,0.12); text-align: left; }
        .portal :global(img) { display: block; width: 100%; height: auto; }
        .portal:focus-visible { outline: 2px solid var(--c-teal); outline-offset: 3px; }
        .url-barra { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #e9eef3; border-bottom: 1px solid var(--c-borde); font-size: 12.5px; color: var(--c-texto-2); }
        .url-barra.grande { width: min(100%, 860px); box-sizing: border-box; border-radius: 10px 10px 0 0; margin-bottom: -16px; position: relative; z-index: 1; font-size: 14px; }
        .punto { flex: none; width: 9px; height: 9px; border-radius: 50%; background: var(--c-ok); }
        .url-texto { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
        .sello { flex: none; font-size: 11px; font-weight: 700; color: var(--c-ok); background: var(--c-ok-bg); padding: 3px 8px; border-radius: 999px; }
        .portal-acciones { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
        .verifica { font-size: 13px !important; color: var(--c-texto-3) !important; margin: 10px 0 0 !important; }
        .leyenda { width: min(100%, 860px); color: #dfe6ec; font-size: 13.5px; line-height: 1.6; margin: 0; }
        .acciones-mini { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-mini { font: inherit; font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 999px; border: 1px solid var(--c-borde); background: var(--c-claro); color: var(--c-texto); cursor: pointer; }
        .btn-mini.fuerte { background: var(--c-azul); color: var(--c-cian); border-color: var(--c-cian); }
        .btn-mini:focus-visible { outline: 2px solid var(--c-cian); outline-offset: 2px; }
        .velo { position: fixed; inset: 0; z-index: 1000; background: rgba(3,10,18,0.78); display: grid; place-items: center; padding: 20px; }
        .ventana { width: min(980px, 100%); height: min(90vh, 900px); background: var(--c-tarjeta); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; box-shadow: var(--sombra-3); }
        .ventana-barra { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 12px 16px; background: var(--c-azul); color: var(--c-claro); font-size: 14px; }
        .marco { flex: 1; overflow-y: auto; background: #525659; padding: 18px; display: grid; gap: 16px; justify-items: center; align-content: start; }
        .marco :global(.pagina-grande) { width: min(100%, 860px); height: auto; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .fuente { font-size: 12.5px; color: var(--c-texto-3); margin: 14px 0 0; }
        .foot { background: var(--c-azul-profundo); color: var(--c-apagado); padding: 28px 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; }
        @media (max-width: 600px) {
          .cuerpo { padding: 0 16px 56px; }
          .foot { padding-left: 16px; padding-right: 16px; }
          .pasos .card { gap: 12px; padding: 18px; }
          .velo { padding: 0; }
          .ventana { height: 100%; border-radius: 0; }
          .marco { padding: 10px; }
        }
      `}</style>
    </div>
  );
}
