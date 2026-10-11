import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { programarSonidoIntro } from '../../lib/sonidoIntro';

// Intro minimalista de la marca: el cubo aparece, se expande y salta; luego las letras «ETHOS IA» se
// despliegan de izquierda a derecha con un brillo metálico que las recorre, y el velo se retira.
// Se muestra una vez por sesión, se puede saltar y nunca bloquea el contenido (que ya está debajo).
const T = { total: 4300, tope: 5200 }; // ms: cuándo empieza la salida y límite duro para retirar el velo
const CLAVE = 'ethos-intro-vista';
const MUDO = 'ethos-intro-mudo';
// Se ejecuta antes de pintar: si ya se vio (o se pidió reducir el movimiento) el velo ni aparece.
const GUARDA = `try{if(sessionStorage.getItem('${CLAVE}')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('ic-vista')}catch(e){}`;

export default function IntroCubo() {
  const [fase, setFase] = useState('activa'); // nada | activa | saliendo (se pinta ya en el HTML inicial para evitar el parpadeo)
  const [mudo, setMudo] = useState(false);
  const audio = useRef({ ctx: null, detener: null });

  // Sonido: los navegadores solo lo permiten si el visitante ya interactuó con el sitio (p. ej. al llegar desde un enlace).
  // Si lo bloquean, la intro corre en silencio. Se respeta la preferencia de silenciar.
  useEffect(() => {
    let silenciado = false;
    try { silenciado = localStorage.getItem(MUDO) === '1'; } catch { /* sin almacenamiento */ }
    const t = setTimeout(() => setMudo(silenciado), 0);
    const AC = window.AudioContext || window.webkitAudioContext;
    const vista = document.documentElement.classList.contains('ic-vista');
    if (!AC || silenciado || vista) return () => clearTimeout(t);
    let vivo = true;
    try {
      const ctx = new AC();
      audio.current.ctx = ctx;
      ctx.resume().then(() => {
        if (vivo && ctx.state === 'running') audio.current.detener = programarSonidoIntro(ctx, ctx.currentTime + 0.05);
      }).catch(() => {});
    } catch { /* sin audio */ }
    return () => {
      vivo = false; clearTimeout(t);
      try { audio.current.detener?.(); audio.current.ctx?.close(); } catch { /* ya cerrado */ }
      audio.current = { ctx: null, detener: null };
    };
  }, []);

  const alternarSonido = (e) => {
    e.stopPropagation();
    const nuevo = !mudo;
    setMudo(nuevo);
    try { localStorage.setItem(MUDO, nuevo ? '1' : '0'); } catch { /* sin almacenamiento */ }
    if (nuevo) { try { audio.current.detener?.(); } catch { /* ya cerrado */ } }
  };

  useEffect(() => {
    let vista = false;
    try { vista = sessionStorage.getItem(CLAVE) === '1'; } catch { /* sin almacenamiento */ }
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (vista || reducir) { const t = setTimeout(() => setFase('nada'), 0); return () => clearTimeout(t); }
    try { sessionStorage.setItem(CLAVE, '1'); } catch { /* sin almacenamiento */ }

    document.body.style.overflow = 'hidden';
    const salir = () => setFase((f) => (f === 'activa' ? 'saliendo' : f));
    const t1 = setTimeout(salir, T.total);
    const t2 = setTimeout(() => setFase('nada'), T.tope);
    window.addEventListener('keydown', salir);
    window.addEventListener('wheel', salir, { passive: true });
    window.addEventListener('touchstart', salir, { passive: true });
    return () => {
      clearTimeout(t1); clearTimeout(t2);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', salir);
      window.removeEventListener('wheel', salir);
      window.removeEventListener('touchstart', salir);
    };
  }, []);

  useEffect(() => {
    if (fase !== 'saliendo') return undefined;
    document.body.style.overflow = '';
    const t = setTimeout(() => setFase('nada'), 700);
    return () => clearTimeout(t);
  }, [fase]);

  if (fase === 'nada') return null;

  return (
    <>
      <Head><script dangerouslySetInnerHTML={{ __html: GUARDA }} /></Head>
      <noscript><style>{'.ic{display:none!important}'}</style></noscript>
      <div className={fase === 'saliendo' ? 'ic saliendo' : 'ic'} role="presentation" onClick={() => setFase('saliendo')}>
        <div className="escena">
          <span className="halo" aria-hidden="true" />
          <div className="salto">
            <div className="cubo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cubo" src="/empresa/ethos-cubo.webp" alt="" width={321} height={372} />
            </div>
          </div>
          <span className="sombra" aria-hidden="true" />
          <div className="letras">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/empresa/ethos-letras.webp" alt="Ethos IA — Software · Inteligencia Artificial · Auditoría" width={834} height={143} />
            <span className="brillo" aria-hidden="true" />
          </div>
        </div>
        <button type="button" className="sonido" onClick={alternarSonido} aria-label={mudo ? 'Activar el sonido de la intro' : 'Silenciar el sonido de la intro'}>{mudo ? '🔇' : '🔊'}</button>

        <style jsx>{`
          .ic { position: fixed; inset: 0; z-index: 200; background: #05111e; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity 0.6s ease 0.1s, visibility 0.6s ease 0.1s; }
          .ic.saliendo { opacity: 0; visibility: hidden; pointer-events: none; }
          .sonido { position: absolute; right: 18px; bottom: calc(18px + env(safe-area-inset-bottom)); width: 44px; height: 44px; border-radius: 50%; border: 1px solid #123048; background: rgba(255,255,255,0.04); color: #eaf2f8; font-size: 18px; cursor: pointer; opacity: 0; animation: ic-aparece 0.6s ease 0.8s forwards; }
          .sonido:hover { border-color: #04ebff; }
          @keyframes ic-aparece { to { opacity: 0.8; } }
          .escena { --ancho: min(520px, 84vw); position: relative; width: var(--ancho); display: flex; flex-direction: column; align-items: center; transition: transform 0.7s cubic-bezier(0.7, 0, 0.2, 1), opacity 0.5s ease; }
          .ic.saliendo .escena { transform: scale(1.9); opacity: 0; }

          .salto { animation: ic-salto 2.1s cubic-bezier(0.3, 0, 0.3, 1) both; }
          .cubo-wrap { animation: ic-expandir 2.1s cubic-bezier(0.22, 1, 0.36, 1) both; transform-origin: 50% 100%; }
          .cubo { width: calc(var(--ancho) * 0.385); height: auto; display: block; filter: drop-shadow(0 0 22px rgba(4, 235, 255, 0.45)); }
          .halo { position: absolute; top: calc(var(--ancho) * -0.12); width: calc(var(--ancho) * 0.75); aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle, rgba(4, 235, 255, 0.32), transparent 65%); animation: ic-halo 3s ease-in-out both; }
          .sombra { position: absolute; top: calc(var(--ancho) * 0.4); width: calc(var(--ancho) * 0.2); height: 12px; border-radius: 50%; background: rgba(4, 235, 255, 0.35); filter: blur(6px); animation: ic-sombra 2.1s cubic-bezier(0.3, 0, 0.3, 1) both; }

          /* letras: se despliegan de izquierda a derecha */
          .letras { position: relative; width: 100%; margin-top: calc(var(--ancho) * 0.04); clip-path: inset(0 100% 0 0); animation: ic-revelar 1.1s cubic-bezier(0.65, 0, 0.2, 1) 1.55s forwards; }
          .letras img { display: block; width: 100%; height: auto; }
          /* brillo metálico recortado con la forma exacta de las letras */
          .brillo { position: absolute; inset: 0; pointer-events: none;
            -webkit-mask: url(/empresa/ethos-letras.webp) center / 100% 100% no-repeat; mask: url(/empresa/ethos-letras.webp) center / 100% 100% no-repeat;
            background: linear-gradient(105deg, transparent 38%, rgba(150, 235, 255, 0.55) 46%, rgba(255, 255, 255, 0.98) 50%, rgba(190, 240, 255, 0.55) 54%, transparent 62%);
            background-size: 260% 100%; background-position: 130% 0; animation: ic-brillo 1.3s ease-in-out 2.55s both; }

          @keyframes ic-expandir {
            0% { transform: scale(0.55); opacity: 0; }
            22% { transform: scale(1.15); opacity: 1; }
            34% { transform: scale(1); }
            62% { transform: scale(1, 1); }
            72% { transform: scale(1.12, 0.84); }
            80% { transform: scale(0.97, 1.05); }
            88%, 100% { transform: scale(1); }
          }
          @keyframes ic-salto {
            0%, 40% { transform: translateY(0); }
            56% { transform: translateY(-38px); }
            70% { transform: translateY(0); }
            79% { transform: translateY(-9px); }
            88%, 100% { transform: translateY(0); }
          }
          @keyframes ic-sombra {
            0%, 40% { transform: scale(1); opacity: 0.8; }
            56% { transform: scale(0.55); opacity: 0.35; }
            70% { transform: scale(1.05); opacity: 0.85; }
            79% { transform: scale(0.85); opacity: 0.6; }
            88%, 100% { transform: scale(1); opacity: 0.8; }
          }
          @keyframes ic-halo { 0% { transform: scale(0.4); opacity: 0; } 25% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 0.7; } }
          @keyframes ic-revelar { to { clip-path: inset(0 0 0 0); } }
          @keyframes ic-brillo { 0% { background-position: 130% 0; } 100% { background-position: -30% 0; } }
        `}</style>
        <style jsx global>{`html.ic-vista .ic { display: none !important; }`}</style>
      </div>
    </>
  );
}
