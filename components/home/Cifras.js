import { useEffect, useRef, useState } from 'react';

// Cifras reales de la empresa y de su plataforma de ingeniería; cuentan al entrar en pantalla.
const CIFRAS = [
  { valor: 5, prefijo: '+', sufijo: '', etiqueta: 'años de experiencia técnica' },
  { valor: 3, prefijo: '', sufijo: '', etiqueta: 'laboratorios técnicos en Docker' },
  { valor: 10, prefijo: '', sufijo: '', etiqueta: 'compuertas de seguridad en el pipeline' },
  { valor: 16, prefijo: '', sufijo: '/16', etiqueta: 'pruebas de red superadas' },
];

function useConteo(objetivo, activo) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!activo) return undefined;
    let raf;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      raf = requestAnimationFrame(() => setN(objetivo));
      return () => cancelAnimationFrame(raf);
    }
    const t0 = performance.now();
    const paso = (t) => {
      const p = Math.min(1, (t - t0) / 1200);
      setN(Math.round(objetivo * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [objetivo, activo]);
  return n;
}

function Cifra({ c, activo }) {
  const n = useConteo(c.valor, activo);
  return (
    <li>
      <strong>{c.prefijo}{n}{c.sufijo}</strong>
      <span>{c.etiqueta}</span>
    </li>
  );
}

export default function Cifras() {
  const ref = useRef(null);
  const [activo, setActivo] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setActivo(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="cifras" aria-label="Cifras de Ethos IA">
      <ul ref={ref}>
        {CIFRAS.map((c) => <Cifra key={c.etiqueta} c={c} activo={activo} />)}
      </ul>
      <style jsx>{`
        .cifras { background: linear-gradient(180deg, #05111e 0%, #0a1b2b 100%); padding: 0 48px 56px; }
        ul { list-style: none; margin: 0 auto; padding: 0; max-width: 1100px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .cifras :global(li) { background: rgba(4,235,255,0.05); border: 1px solid #123048; border-radius: 16px; padding: 22px; display: flex; flex-direction: column; gap: 4px; }
        .cifras :global(strong) { font-size: clamp(2rem, 4vw, 2.8rem); color: #04ebff; line-height: 1; font-variant-numeric: tabular-nums; }
        .cifras :global(span) { color: #c4d3e0; font-size: 13.5px; }
        @media (max-width: 700px) { .cifras { padding: 0 24px 40px; } }
      `}</style>
    </section>
  );
}
