const ELEMENTOS = ['OWASP Top 10', 'NIST 800-61', 'ISO/IEC 27001', 'LOPDP Ecuador', 'Docker', 'GitHub Actions', 'Trivy', 'OWASP ZAP', 'Semgrep', 'Next.js', 'React', 'Supabase'];

// Cinta de estándares y herramientas con las que trabajamos. Se detiene al pasar el cursor o con «reducir movimiento».
export default function Marquee() {
  const fila = [...ELEMENTOS, ...ELEMENTOS];
  return (
    <section className="cinta" aria-label="Estándares y herramientas">
      <div className="pista">
        {fila.map((t, i) => <span key={`${t}-${i}`} aria-hidden={i >= ELEMENTOS.length}>{t}</span>)}
      </div>
      <style jsx>{`
        .cinta { background: #eaf2f8; border-top: 1px solid rgba(5,17,30,0.06); border-bottom: 1px solid rgba(5,17,30,0.06); overflow: hidden; padding: 18px 0; }
        .pista { display: flex; gap: 14px; width: max-content; animation: mover 38s linear infinite; }
        .cinta:hover .pista { animation-play-state: paused; }
        span { white-space: nowrap; background: #fff; border: 1px solid rgba(5,17,30,0.1); border-radius: 999px; padding: 8px 18px; font-size: 13.5px; font-weight: 600; color: #0b5f75; }
        @keyframes mover { to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .pista { animation: none; flex-wrap: wrap; width: auto; justify-content: center; padding: 0 20px; } }
      `}</style>
    </section>
  );
}
