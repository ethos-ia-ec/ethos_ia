import { useState } from 'react';

// Fachada liviana de video: muestra un póster y solo carga el reproductor de YouTube o Vimeo al hacer clic.
// Así la nota carga rápido (sin los ~500 KB del reproductor) y no se envían cookies de terceros hasta que se pide.
type Props = { proveedor: 'youtube' | 'vimeo' | 'archivo'; id: string; titulo: string; poster?: string };

export function urlInsercion(proveedor: Props['proveedor'], id: string): string {
  if (proveedor === 'youtube') return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
  if (proveedor === 'vimeo') return `https://player.vimeo.com/video/${encodeURIComponent(id)}?autoplay=1&dnt=1`;
  return id;
}

export default function VideoLiviano({ proveedor, id, titulo, poster }: Props) {
  const [activo, setActivo] = useState(false);
  const imagen = poster ?? (proveedor === 'youtube' ? `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : undefined);

  return (
    <figure className="video">
      {proveedor === 'archivo' ? (
        <video src={id} poster={poster} controls preload="none" playsInline aria-label={titulo} />
      ) : activo ? (
        <iframe src={urlInsercion(proveedor, id)} title={titulo} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setActivo(true)} aria-label={`Reproducir: ${titulo}`}
          style={imagen ? { backgroundImage: `url(${imagen})` } : undefined}>
          <span aria-hidden="true">▶</span>
        </button>
      )}
      <figcaption>{titulo}</figcaption>
      <style jsx>{`
        .video { margin: 24px 0; }
        .video :global(iframe), .video :global(video), button { width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px; display: block; background: var(--c-azul) center / cover no-repeat; }
        button { cursor: pointer; position: relative; }
        button span { position: absolute; inset: 0; margin: auto; width: 68px; height: 48px; border-radius: 12px; background: rgba(5,17,30,0.8); color: var(--c-cian); display: grid; place-items: center; font-size: 22px; transition: transform 0.2s; }
        button:hover span, button:focus-visible span { transform: scale(1.08); }
        button:focus-visible { outline: 2px solid var(--c-cian); outline-offset: 2px; }
        figcaption { font-size: 13px; color: var(--c-texto-3); margin-top: 8px; }
      `}</style>
    </figure>
  );
}
