import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

// Aparece con un desvanecimiento al entrar en pantalla; sin movimiento si el visitante lo pidió.
export default function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const estilo: CSSProperties = { transitionDelay: `${delay}ms` };
  return (
    <div ref={ref} className={`rv ${visible ? 'in' : ''} ${className}`} style={estilo}>
      {children}
      <style jsx>{`
        .rv { opacity: 0; transform: translateY(20px); transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .rv.in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { .rv { opacity: 1; transform: none; transition: none; } }
      `}</style>
    </div>
  );
}
