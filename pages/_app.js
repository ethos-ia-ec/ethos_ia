import { Sora } from 'next/font/google';
import { useEffect } from 'react';
import '../styles/tokens.css';

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export default function App({ Component, pageProps }) {
  // Desplazamiento suave solo para anclas internas (#seccion); al cambiar de página se entra siempre arriba, sin animar desde la posición anterior.
  useEffect(() => {
    const alClic = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      const id = a && a.getAttribute('href').slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    };
    document.addEventListener('click', alClic);
    return () => document.removeEventListener('click', alClic);
  }, []);
  return (
    <>
      <style jsx global>{`
        :root {
          --font-brand: ${sora.style.fontFamily};
        }
        html,
        body {
          font-family: ${sora.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
