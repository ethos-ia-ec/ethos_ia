import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { debeMostrarIntro } from '../../lib/introRegla';
import { programarSonidoIntro } from '../../lib/sonidoIntro';

// Intro minimalista de la marca: el cubo aparece, se expande y salta; luego las letras «ETHOS IA» se
// despliegan de izquierda a derecha con un brillo metálico que las recorre, y el velo se retira.
// Se muestra la primera vez de cada 24 h y en toda recarga intencional de la portada (F5, botón de actualizar o
// arrastrar para recargar); no al volver desde otras páginas del sitio. Se puede saltar y nunca bloquea el contenido.
const T = { total: 4300, tope: 5200 }; // ms: cuándo empieza la salida y límite duro para retirar el velo
const ULTIMA = 'ethos-intro-ultima';
const MUDO = 'ethos-intro-mudo';
// Se ejecuta antes de pintar: si ya se vio (o se pidió reducir el movimiento) el velo ni aparece.
// Replica la regla de lib/introRegla.js antes de pintar para que el velo no parpadee cuando no corresponde.
const GUARDA = `try{var n=performance.getEntriesByType('navigation')[0],p=new URL(n?n.name:location.href).pathname,u=Number(localStorage.getItem('${ULTIMA}')),f=/[?&]intro=1/.test(location.search),r=matchMedia('(prefers-reduced-motion: reduce)').matches,m=!r&&(f||(p==='/'&&((n&&n.type==='reload')||!u||Date.now()-u>=864e5)));if(!m)document.documentElement.classList.add('ic-vista')}catch(e){}`;

// La decisión se toma una sola vez por carga de documento: si el visitante vuelve a la portada desde otra
// página del sitio (menú, enlaces, logotipo), el componente se monta de nuevo pero la intro no se repite.
// WAV de 0,1 s en silencio: al reproducirlo dentro de un toque, iOS pasa la sesión de audio a «reproducción» y el sonido
// de Web Audio se oye aunque el interruptor lateral esté en silencio.
const SILENCIO = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
let consumida = false;
function decidirIntro() {
  let nav; let ultima = null;
  try { nav = performance.getEntriesByType('navigation')[0]; } catch { /* sin API */ }
  try { ultima = localStorage.getItem(ULTIMA); } catch { /* sin almacenamiento */ }
  let pathInicial = window.location.pathname;
  try { if (nav?.name) pathInicial = new URL(nav.name).pathname; } catch { /* URL no válida */ }
  return debeMostrarIntro({
    pathInicial,
    tipo: nav?.type,
    ultima,
    ahora: Date.now(),
    forzar: /[?&]intro=1/.test(window.location.search),
    reducir: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });
}

export default function IntroCubo() {
  // nada | activa | saliendo. En la carga inicial se pinta «activa» (igual que el HTML del servidor) para evitar el parpadeo;
  // en montajes posteriores (navegación interna) empieza en «nada».
  const [fase, setFase] = useState(() => (typeof window !== 'undefined' && consumida ? 'nada' : 'activa'));
  const decision = useRef(null);

  // Va antes que los demás efectos: ellos leen la decisión. La referencia sobrevive al doble montaje del modo estricto.
  useEffect(() => {
    if (decision.current === null) {
      decision.current = consumida ? false : decidirIntro();
      consumida = true;
    }
  }, []);
  const [mudo, setMudo] = useState(false);
  const [bloqueado, setBloqueado] = useState(false); // el navegador no deja sonar hasta que haya un toque
  const audio = useRef({ ctx: null, detener: null, inicio: 0 });
  const bloqueadoRef = useRef(false);

  // Sonido: los navegadores solo lo permiten si el visitante ya interactuó con el sitio (p. ej. al llegar desde un enlace).
  // Si lo bloquean, la intro corre en silencio. Se respeta la preferencia de silenciar.
  useEffect(() => {
    let silenciado = false;
    try { silenciado = localStorage.getItem(MUDO) === '1'; } catch { /* sin almacenamiento */ }
    const t = setTimeout(() => setMudo(silenciado), 0);
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || silenciado || !decision.current) return () => clearTimeout(t);
    let vivo = true;
    audio.current.inicio = performance.now();
    let aviso;
    try {
      const ctx = new AC();
      audio.current.ctx = ctx;
      ctx.resume().then(() => {
        if (vivo && ctx.state === 'running') audio.current.detener = programarSonidoIntro(ctx, ctx.currentTime + 0.05);
      }).catch(() => {});
      // Si pasado un instante el navegador sigue bloqueándolo, se ofrece activarlo con un toque.
      aviso = setTimeout(() => { if (vivo && ctx.state !== 'running') { bloqueadoRef.current = true; setBloqueado(true); } }, 300);
    } catch { aviso = setTimeout(() => { bloqueadoRef.current = true; setBloqueado(true); }, 0); }
    return () => {
      vivo = false; clearTimeout(t); clearTimeout(aviso);
      try { audio.current.detener?.(); audio.current.ctx?.close(); } catch { /* ya cerrado */ }
      audio.current = { ctx: null, detener: null, inicio: 0 };
    };
  }, []);

  // Con el audio bloqueado, un toque es el gesto que el navegador exige: se activa y suena lo que falta de la intro.
  const activarSonido = async () => {
    const AC = window.AudioContext || window.webkitAudioContext;
    try {
      try { const mudoIos = new Audio(SILENCIO); mudoIos.play()?.catch(() => {}); } catch { /* sin Audio */ }
      let ctx = audio.current.ctx;
      if (!ctx || ctx.state === 'closed') { ctx = new AC(); audio.current.ctx = ctx; }
      await ctx.resume();
      if (ctx.state === 'running') {
        const transcurrido = (performance.now() - (audio.current.inicio || performance.now())) / 1000;
        audio.current.detener = programarSonidoIntro(ctx, ctx.currentTime + 0.05 - transcurrido, 0.5, transcurrido);
        bloqueadoRef.current = false; setBloqueado(false); setMudo(false);
        try { localStorage.setItem(MUDO, '0'); } catch { /* sin almacenamiento */ }
      }
    } catch { /* sin audio */ }
  };

  const alternarSonido = (e) => {
    e.stopPropagation();
    if (bloqueado || (!mudo && audio.current.ctx && audio.current.ctx.state !== 'running')) { activarSonido(); return; }
    const nuevo = !mudo;
    setMudo(nuevo);
    try { localStorage.setItem(MUDO, nuevo ? '1' : '0'); } catch { /* sin almacenamiento */ }
    if (nuevo) { try { audio.current.detener?.(); } catch { /* ya cerrado */ } }
  };

  // Un toque en cualquier parte: si el audio está bloqueado lo activa (sin saltar la intro); si no, salta la intro.
  const alTocar = () => {
    if (bloqueadoRef.current) { activarSonido(); return; }
    setFase((f) => (f === 'activa' ? 'saliendo' : f));
  };

  useEffect(() => {
    if (!decision.current) { const t = setTimeout(() => setFase('nada'), 0); return () => clearTimeout(t); }
    try { localStorage.setItem(ULTIMA, String(Date.now())); } catch { /* sin almacenamiento */ }

    document.body.style.overflow = 'hidden';
    // El toque en el botón de sonido no debe saltar la intro: es el gesto que activa el audio.
    const salir = (e) => {
      if (e?.target instanceof Element && e.target.closest('.sonido')) return;
      if (e?.type === 'touchstart' && bloqueadoRef.current) return; // ese toque activa el sonido (ver alTocar)
      setFase((f) => (f === 'activa' ? 'saliendo' : f));
    };
    const t1 = setTimeout(() => salir(), T.total);
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
      <div className={fase === 'saliendo' ? 'ic saliendo' : 'ic'} role="presentation" onClick={alTocar}>
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
        {bloqueado && <p className="pista-sonido" aria-live="polite">Toca la pantalla para activar el sonido</p>}
        <button type="button" className={bloqueado ? 'sonido pide' : 'sonido'} onClick={alternarSonido} aria-label={bloqueado || mudo ? 'Activar el sonido de la intro' : 'Silenciar el sonido de la intro'}>{bloqueado || mudo ? '🔈' : '🔊'}{bloqueado && <span> Activar sonido</span>}</button>

        <style jsx>{`
          .ic { position: fixed; inset: 0; z-index: 200; background: #05111e; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity 0.6s ease 0.1s, visibility 0.6s ease 0.1s; }
          .ic.saliendo { opacity: 0; visibility: hidden; pointer-events: none; }
          .sonido { position: absolute; right: 18px; bottom: calc(18px + env(safe-area-inset-bottom)); width: 44px; height: 44px; border-radius: 50%; border: 1px solid #123048; background: rgba(255,255,255,0.04); color: #eaf2f8; font-size: 18px; cursor: pointer; opacity: 0; animation: ic-aparece 0.6s ease 0.8s forwards; }
          .pista-sonido { position: absolute; left: 0; right: 0; bottom: calc(76px + env(safe-area-inset-bottom)); margin: 0; text-align: center; color: #c4d3e0; font-size: 13px; letter-spacing: 0.04em; animation: ic-pulso 1.6s ease-in-out infinite; pointer-events: none; }
          @keyframes ic-pulso { 50% { opacity: 0.45; } }
          .sonido:hover { border-color: #04ebff; }
          .sonido.pide { width: auto; padding: 0 18px; border-radius: 999px; font-size: 14px; border-color: #04ebff; color: #04ebff; }
          .sonido span { font-size: 13px; font-weight: 600; }
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
