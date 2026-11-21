import { useEffect, useState } from 'react';

// Cinta de sellos de universidades antes del pie; los datos viven en public/academico/aliados-borrador/aliados.json.

interface Aliado { id: string; nombre: string; sigla: string; logo: string }

const MANIFIESTO = '/academico/aliados-borrador/aliados.json';

// Para ocultar la cinta del sitio publicado, cambiar a false.
export const MOSTRAR_CINTA = true;

// Cada mitad del riel debe cubrir la pantalla más ancha (3840 px) para que nunca quede un hueco al deslizar.
const ANCHO_SELLO = 150;
const repeticiones = (n: number) => Math.max(2, Math.ceil(4000 / (n * ANCHO_SELLO)));

export default function CintaUniversidades() {
  const [aliados, setAliados] = useState<Aliado[]>([]);

  useEffect(() => {
    let vivo = true;
    fetch(MANIFIESTO)
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Aliado[]) => { if (vivo && Array.isArray(d)) setAliados(d); })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

  if (!MOSTRAR_CINTA || aliados.length === 0) return null;

  const mitad = Math.ceil(aliados.length / 2);
  const filas = [aliados.slice(0, mitad), aliados.slice(mitad)].filter((f) => f.length);

  return (
    <section className="cinta" aria-labelledby="cinta-titulo">
      <div className="cab">
        <span className="badge">Vista previa · convenios en trámite</span>
        <h2 id="cinta-titulo">Investigación en colaboración con <em>universidades del Ecuador</em></h2>
        <p>Proyectos de investigación científica junto a instituciones con oferta presencial y en línea.</p>
      </div>
      {filas.map((fila, f) => (
        <div className="pista" key={f}>
          {/* La lista se repite para que el desplazamiento sea continuo; la copia se oculta al lector de pantalla. */}
          <ul className={`riel ${f % 2 ? 'inverso' : ''}`} style={{ animationDuration: `${fila.length * repeticiones(fila.length) * 4}s` }}>
            {Array.from({ length: repeticiones(fila.length) * 2 }, () => fila).flat().map((a, i) => (
              <li key={`${a.id}-${i}`} aria-hidden={i >= fila.length} style={{ animationDelay: `${(i % 5) * -0.7}s` }}>
                <span className="sello">
                  {/* eslint-disable-next-line @next/next/no-img-element -- logos SVG/PNG locales de vista previa */}
                  <img src={a.logo} alt={a.nombre} loading="lazy" />
                </span>
                <span className="sigla">{a.sigla}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <style jsx>{`
        .cinta { padding: 56px 0 64px; background: linear-gradient(180deg, var(--c-fondo) 0%, #dfeaf3 100%); overflow-x: clip; }
        .cab { max-width: var(--ancho-max); margin: 0 auto 32px; padding: 0 var(--gutter); text-align: center; }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 999px; background: rgba(11, 95, 117, 0.1); color: var(--c-teal); font: 600 12px/1.4 var(--f-mono); letter-spacing: 0.06em; text-transform: uppercase; }
        h2 { margin: 14px auto 10px; max-width: 22ch; font: 700 clamp(24px, 5.5vw, 40px)/1.15 var(--font-brand); color: var(--c-azul); }
        h2 em { font-style: normal; color: var(--c-teal); }
        .cab p { margin: 0 auto; max-width: 52ch; color: #3b5568; font-size: clamp(15px, 2.4vw, 17px); line-height: 1.6; }
        .pista { position: relative; overflow: hidden; padding: 10px 0;
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
        .riel { display: flex; gap: 0; width: max-content; margin: 0; padding: 8px 0; list-style: none;
          animation: desliza linear infinite; }
        .riel.inverso { animation-direction: reverse; }
        .pista:hover .riel, .pista:focus-within .riel { animation-play-state: paused; }
        li { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0 clamp(10px, 2vw, 22px); animation: flota 3.6s ease-in-out infinite; }
        .sello { display: grid; place-items: center; width: clamp(76px, 18vw, 112px); aspect-ratio: 1; border-radius: 50%;
          background: #fff; overflow: hidden; box-shadow: 0 6px 18px rgba(5, 17, 30, 0.1), inset 0 0 0 1px rgba(11, 95, 117, 0.12);
          transition: transform var(--t-2, 0.3s) var(--ease, ease), box-shadow var(--t-2, 0.3s) var(--ease, ease); }
        .sello img { width: 62%; height: 62%; object-fit: contain; filter: grayscale(0.35); transition: filter 0.3s ease; }
        li:hover .sello { transform: scale(1.08) rotate(-4deg); box-shadow: 0 10px 28px rgba(4, 235, 255, 0.28), inset 0 0 0 2px var(--c-cian); }
        li:hover img { filter: none; }
        .sigla { font: 600 12px/1 var(--f-mono); letter-spacing: 0.05em; color: #3b5568; }
        @keyframes desliza { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes flota { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @media (prefers-reduced-motion: reduce) {
          .riel { animation: none; flex-wrap: wrap; justify-content: center; width: auto; padding: 8px var(--gutter); }
          li { animation: none; }
          li[aria-hidden='true'] { display: none; }
          .pista { mask-image: none; -webkit-mask-image: none; }
        }
        @media (min-width: 1920px) { .cinta { padding: 80px 0 96px; } }
      `}</style>
    </section>
  );
}
