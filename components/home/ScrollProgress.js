import { useEffect, useState } from 'react';

// Barra fina de progreso de lectura en la parte superior de la página.
export default function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const al = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    al();
    window.addEventListener('scroll', al, { passive: true });
    return () => window.removeEventListener('scroll', al);
  }, []);
  return (
    <div className="sp" aria-hidden="true">
      <span style={{ transform: `scaleX(${p})` }} />
      <style jsx>{`
        .sp { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 60; pointer-events: none; }
        span { display: block; height: 100%; background: linear-gradient(90deg, #04ebff, #7aa7ff); transform-origin: left; }
      `}</style>
    </div>
  );
}
