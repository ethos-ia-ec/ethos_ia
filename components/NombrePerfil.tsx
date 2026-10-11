import Image from 'next/image';
import Link from 'next/link';

interface Props {
  nombre: string;
  href: string;
  foto: string;
  rol: string;
  destacados: string[];
}

// Nombre interactivo: es un enlace al perfil completo y, al pasar el cursor o enfocarlo con el teclado,
// muestra una tarjeta de vista previa. En pantallas táctiles el toque lleva directo al perfil.
export default function NombrePerfil({ nombre, href, foto, rol, destacados }: Props) {
  return (
    <span className="np">
      <Link href={href} className="enlace" aria-describedby="np-vista">
        {nombre}
        <span className="flecha" aria-hidden="true">↗</span>
      </Link>

      <span className="vista" id="np-vista" role="tooltip">
        <span className="cab">
          <Image src={foto} alt="" width={56} height={56} />
          <span>
            <strong>{nombre}</strong>
            <em>{rol}</em>
          </span>
        </span>
        <span className="chips">
          {destacados.map((d) => <span key={d}>{d}</span>)}
        </span>
        <span className="cta">Abrir perfil completo →</span>
      </span>

      <style jsx>{`
        .np { position: relative; display: inline-block; }
        .np :global(.enlace) { color: inherit; position: relative; display: inline-block; padding-bottom: 2px; background: linear-gradient(90deg, #04ebff, #0b5f75) no-repeat 0 100% / 0% 2px; transition: background-size 0.35s ease, color 0.2s ease; }
        .np :global(.enlace:hover), .np :global(.enlace:focus-visible) { background-size: 100% 2px; color: #0b5f75; outline: none; }
        .np :global(.enlace:focus-visible) { box-shadow: 0 0 0 3px rgba(4,235,255,0.45); border-radius: 4px; }
        .flecha { margin-left: 6px; font-size: 0.8em; color: #04ebff; display: inline-block; transition: transform 0.25s ease; }
        .np:hover .flecha, .np:focus-within .flecha { transform: translate(3px, -3px); }

        .vista { position: absolute; left: 0; top: calc(100% + 12px); z-index: 20; width: 300px; background: #05111e; color: #c4d3e0; border: 1px solid #123048; border-radius: 14px; padding: 16px; box-shadow: 0 22px 50px rgba(5,17,30,0.35); opacity: 0; visibility: hidden; transform: translateY(8px); transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s; pointer-events: none; font-weight: 400; font-size: 13px; line-height: 1.5; text-align: left; }
        .vista::before { content: ''; position: absolute; top: -7px; left: 22px; width: 12px; height: 12px; background: #05111e; border-left: 1px solid #123048; border-top: 1px solid #123048; transform: rotate(45deg); }
        .np:hover .vista, .np:focus-within .vista { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; }
        .cab { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
        .cab :global(img) { border-radius: 50%; border: 2px solid #04ebff; object-fit: cover; }
        .cab strong { display: block; color: #eaf2f8; font-size: 14px; }
        .cab em { display: block; font-style: normal; color: #04ebff; font-size: 11.5px; }
        .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .chips span { font-size: 11px; padding: 3px 9px; border-radius: 999px; background: #123048; color: #eaf2f8; }
        .cta { display: block; color: #04ebff; font-weight: 700; }
        @media (max-width: 700px) { .vista { display: none; } }
        @media (prefers-reduced-motion: reduce) { .vista, .flecha, .np :global(.enlace) { transition: none; } }
      `}</style>
    </span>
  );
}
