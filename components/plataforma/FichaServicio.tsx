import { useState, type ReactNode } from 'react';
import { ETIQUETA_ESTADO, type Servicio } from '../../lib/plataforma/datos';

interface Props {
  s: Servicio;
  children?: ReactNode;
  onVerPaneles?: () => void;
}

export default function FichaServicio({ s, children, onVerPaneles }: Props) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(s.comoLevantar);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <article className="ficha" aria-labelledby={`srv-${s.id}`}>
      <div className="vista">
        {s.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.imagen} alt={`Vista previa del servicio ${s.nombre}`} loading="lazy" />
        ) : (
          <div className="carpetas" aria-hidden="true">
            {['01', '02', '03', '04', '05', '06', '07'].map((n) => <span key={n}>{n}</span>)}
          </div>
        )}
        <span className={`estado ${s.estado}`}>{ETIQUETA_ESTADO[s.estado]}</span>
      </div>

      <div className="cuerpo">
        <h3 id={`srv-${s.id}`}>{s.nombre}</h3>
        <p className="para">{s.para}</p>

        <div className="cols">
          <div>
            <h4>Incluye</h4>
            <ul>{s.incluye.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
          <div>
            <h4>Entrega</h4>
            <ul>{s.entrega.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        </div>

        <h4>Cómo levantarlo</h4>
        <div className="cmd">
          <code>{s.comoLevantar}</code>
          <button type="button" onClick={copiar} aria-label={`Copiar el comando de ${s.nombre}`}>{copiado ? '✓ Copiado' : 'Copiar'}</button>
        </div>

        {s.paneles && onVerPaneles && (
          <button type="button" className="ver" onClick={onVerPaneles}>Ver los paneles de este servicio →</button>
        )}
        {children}
      </div>

      <style jsx>{`
        .ficha { background: #fff; border: 1px solid rgba(5,17,30,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 28px rgba(5,17,30,0.05); display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.6fr); }
        .vista { position: relative; background: #05111e; min-height: 220px; }
        .vista img { width: 100%; height: 100%; object-fit: cover; object-position: top left; display: block; position: absolute; inset: 0; }
        .carpetas { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 24px; align-content: center; }
        .carpetas span { aspect-ratio: 1; border-radius: 10px; background: #0a1b2b; border: 1px solid #123048; color: #04ebff; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .cuerpo { padding: 22px; min-width: 0; }
        h3 { font-size: 18px; margin: 0 0 6px; }
        h4 { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #526373; margin: 14px 0 6px; }
        .para { font-size: 14px; color: #33414d; line-height: 1.65; margin: 0; }
        .cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 0 24px; }
        ul { margin: 0; padding-left: 18px; font-size: 13px; color: #33414d; line-height: 1.7; }
        .cmd { display: flex; align-items: center; gap: 8px; background: #05111e; border-radius: 8px; padding: 8px 8px 8px 12px; }
        .cmd code { flex: 1; color: #c4d3e0; font-size: 12px; overflow-x: auto; white-space: nowrap; }
        .cmd button { border: 0; background: #123048; color: #04ebff; border-radius: 6px; padding: 5px 10px; font: inherit; font-size: 12px; cursor: pointer; flex-shrink: 0; }
        .ver { margin-top: 14px; border: 0; background: none; padding: 0; font: inherit; font-weight: 700; color: #0b5f75; cursor: pointer; }
        .ver:hover { color: #04ebff; }
        button:focus-visible { outline: 2px solid #04ebff; outline-offset: 2px; }
        .estado { position: absolute; top: 12px; left: 12px; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
        .estado.catalogo { background: #eaf2f8; color: #0b5f75; }
        .estado.demo-navegador { background: #dff5e6; color: #14653a; }
        .estado.en-linea { background: #04ebff; color: #05111e; }
        @media (max-width: 760px) { .ficha { grid-template-columns: 1fr; } .vista { min-height: 170px; } }
      `}</style>
    </article>
  );
}
