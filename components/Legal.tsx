import Link from 'next/link';
import type { ReactNode } from 'react';
import Header from './home/Header';
import Seo from './Seo';

// Plantilla de las páginas legales (/privacidad y /terminos): mismo encabezado del sitio y lectura cómoda.
export const EMPRESA = {
  razonSocial: 'ETHOSLAB S.A.S.',
  comercial: 'Ethos IA',
  ruc: '0195187827001',
  domicilio: 'Cuenca, Azuay, Ecuador',
  correo: 'ethos.ia.ec@gmail.com',
};

type Props = { titulo: string; descripcion: string; ruta: string; actualizado: string; children: ReactNode };

export default function Legal({ titulo, descripcion, ruta, actualizado, children }: Props) {
  return (
    <div className="pagina" id="contenido-principal">
      <Seo titulo={`${titulo} | Ethos IA`} descripcion={descripcion} ruta={ruta} jsonld={null} />
      <Header />
      <main className="caja">
        <p className="eyebrow">{EMPRESA.razonSocial} · {EMPRESA.comercial}</p>
        <h1>{titulo}</h1>
        <p className="fecha">Última actualización: {actualizado}</p>
        {children}
        <nav className="pie">
          <Link href="/privacidad">Política de Privacidad</Link>
          <Link href="/terminos">Condiciones del Servicio</Link>
          <Link href="/cuenta">Mi cuenta</Link>
        </nav>
      </main>
      <style jsx>{`
        .pagina { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; }
        .caja { max-width: 780px; margin: 0 auto; padding: 130px 16px 72px; line-height: 1.7; }
        .eyebrow { color: var(--c-teal); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; margin: 0 0 8px; }
        h1 { font-size: clamp(1.8rem, 5vw, 2.4rem); line-height: 1.15; margin: 0 0 8px; }
        .fecha { color: var(--c-texto-3); font-size: 14px; margin: 0 0 32px; }
        .caja :global(h2) { font-size: 1.15rem; margin: 34px 0 10px; color: var(--c-azul); }
        .caja :global(p), .caja :global(li) { color: var(--c-texto-2); font-size: 15.5px; }
        .caja :global(ul) { padding-left: 22px; }
        .caja :global(li) { margin-bottom: 6px; }
        .caja :global(a) { color: var(--c-teal); font-weight: 600; }
        .caja :global(table) { width: 100%; border-collapse: collapse; margin: 12px 0 20px; font-size: 14.5px; display: block; overflow-x: auto; }
        .caja :global(th), .caja :global(td) { text-align: left; padding: 10px; border-bottom: 1px solid var(--c-borde); vertical-align: top; }
        .caja :global(th) { color: var(--c-texto); }
        .caja :global(.recuadro) { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: 14px; padding: 18px 20px; }
        .pie { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--c-borde); font-size: 14px; }
      `}</style>
    </div>
  );
}
