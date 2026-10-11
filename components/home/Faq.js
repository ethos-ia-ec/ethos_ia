import { useState } from 'react';
import Link from 'next/link';

const PREGUNTAS = [
  { p: '¿Qué es una auditoría de inteligencia artificial?', r: 'Es la revisión de cómo se usa la IA en tus procesos: qué datos recibe, quién accede a ellos y qué controles existen. El resultado es un informe ejecutivo con las brechas encontradas y un plan de remediación.' },
  { p: '¿Trabajan con pequeñas y medianas empresas?', r: 'Sí. Nuestro servicio está pensado para pymes que quieren adoptar IA sin poner en riesgo su operación ni los datos de sus clientes.' },
  { p: '¿Cómo cuidan la información de mi empresa?', r: 'Aplicamos seguridad desde el diseño, trabajamos bajo los principios de la Ley Orgánica de Protección de Datos Personales y solo realizamos verificaciones sobre activos que tú autorizas.' },
  { p: '¿En cuánto tiempo me responden?', r: 'Un especialista del equipo responde tu solicitud en 48 horas.' },
  { p: '¿Puedo ver cómo trabajan por dentro?', r: null },
];

export default function Faq() {
  const [abierta, setAbierta] = useState(0);
  return (
    <div className="faq">
      {PREGUNTAS.map((q, i) => {
        const on = abierta === i;
        return (
          <div key={q.p} className={on ? 'item on' : 'item'}>
            <h3>
              <button type="button" aria-expanded={on} aria-controls={`faq-${i}`} onClick={() => setAbierta(on ? null : i)}>
                {q.p}<span aria-hidden="true">{on ? '−' : '+'}</span>
              </button>
            </h3>
            {on && (
              <div id={`faq-${i}`} className="resp">
                {q.r ? q.r : (<>Sí: <Link href="/plataforma">Ethos Ingeniería</Link> muestra los laboratorios, el pipeline de seguridad y el programa de prácticas que usamos.</>)}
              </div>
            )}
          </div>
        );
      })}
      <style jsx>{`
        .faq { max-width: 820px; margin: 44px auto 0; display: flex; flex-direction: column; gap: 16px; }
        .item { background: #fff; border: 1px solid rgba(5,17,30,0.1); border-radius: 14px; overflow: hidden; transition: border-color 0.2s ease; }
        .item.on { border-color: #04ebff; box-shadow: 0 12px 30px rgba(5,17,30,0.07); }
        h3 { margin: 0; font-size: 16px; }
        button { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 12px; background: none; border: 0; padding: 22px 24px; font: inherit; font-weight: 600; color: #05111e; cursor: pointer; text-align: left; }
        button span { font-size: 22px; color: #0b5f75; line-height: 1; }
        button:focus-visible { outline: 2px solid #04ebff; outline-offset: -2px; }
        .resp { padding: 0 24px 24px; color: #33414d; line-height: 1.7; font-size: 14.5px; }
        .resp :global(a) { color: #0b5f75; font-weight: 700; }
      `}</style>
    </div>
  );
}
