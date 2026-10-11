import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ENLACES, MEGA, MEGA_EXTRA } from '../../lib/navegacion';

// Header del sitio: se compacta y se oculta al desplazarse, resalta la sección activa con un indicador
// deslizante, ofrece un megamenú de Ingeniería y un menú móvil a pantalla completa.
// `inicio` indica si se está en la portada (activa el seguimiento de secciones).
export default function Header({ inicio = false }) {
  const router = useRouter();
  const [compacto, setCompacto] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [activa, setActiva] = useState(null);
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const [indicador, setIndicador] = useState({ x: 0, w: 0, visible: false });
  const pill = useRef(null);
  const enlaces = useRef({});
  const panel = useRef(null);
  const cierreMega = useRef(null);

  // Scroll: compactar, ocultar al bajar, mostrar al subir y progreso de lectura.
  useEffect(() => {
    let ultimo = window.scrollY;
    let pendiente = false;
    const medir = () => {
      pendiente = false;
      const y = window.scrollY;
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      setCompacto(y > 24);
      setProgreso(alto > 0 ? Math.min(1, y / alto) : 0);
      if (!menu) {
        if (y > ultimo + 6 && y > 240) setOculto(true);
        else if (y < ultimo - 6 || y < 120) setOculto(false);
      }
      ultimo = y;
    };
    const alScroll = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(medir); } };
    medir();
    window.addEventListener('scroll', alScroll, { passive: true });
    return () => window.removeEventListener('scroll', alScroll);
  }, [menu]);

  // Sección activa en la portada.
  useEffect(() => {
    if (!inicio) return undefined;
    const ids = ENLACES.map((e) => e.seccion).filter(Boolean);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entradas) => { const v = entradas.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (v) setActiva(v.target.id); },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.2, 0.5] }
    );
    els.forEach((e) => io.observe(e));
    const alTope = () => { if (window.scrollY < 200) setActiva(null); };
    window.addEventListener('scroll', alTope, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', alTope); };
  }, [inicio]);

  // En otras páginas el enlace activo es el de la ruta actual.
  const claveActiva = inicio ? activa : (router.pathname.startsWith('/equipo') ? null : router.pathname.startsWith('/plataforma') ? 'ingenieria' : null);
  const hrefActivo = !inicio && router.pathname.startsWith('/equipo') ? '/equipo' : null;

  const colocar = useCallback((el) => {
    const cont = pill.current;
    if (!el || !cont) { setIndicador((i) => ({ ...i, visible: false })); return; }
    const c = cont.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setIndicador({ x: r.left - c.left, w: r.width, visible: true });
  }, []);

  const volverAlActivo = useCallback(() => {
    const e = ENLACES.find((x) => (x.seccion && x.seccion === claveActiva) || (hrefActivo && x.href === hrefActivo));
    colocar(e ? enlaces.current[e.etiqueta] : null);
  }, [claveActiva, hrefActivo, colocar]);

  useLayoutEffect(() => { volverAlActivo(); }, [volverAlActivo, compacto]);
  useEffect(() => {
    window.addEventListener('resize', volverAlActivo);
    return () => window.removeEventListener('resize', volverAlActivo);
  }, [volverAlActivo]);

  // Menú móvil: bloquea el scroll, atrapa el foco y cierra con Esc.
  useEffect(() => {
    if (!menu) return undefined;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const foco = panel.current?.querySelectorAll('a, button');
    const t = setTimeout(() => foco?.[0]?.focus(), 120);
    const tecla = (e) => {
      if (e.key === 'Escape') setMenu(false);
      if (e.key === 'Tab' && foco && foco.length) {
        const lista = [...panel.current.querySelectorAll('a, button'), document.querySelector('.hd-burger')];
        const i = lista.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); lista[lista.length - 1].focus(); }
        else if (!e.shiftKey && i === lista.length - 1) { e.preventDefault(); lista[0].focus(); }
      }
    };
    window.addEventListener('keydown', tecla);
    return () => { clearTimeout(t); document.body.style.overflow = previo; window.removeEventListener('keydown', tecla); };
  }, [menu]);

  useEffect(() => {
    const cerrar = () => { setMenu(false); setMega(false); };
    router.events.on('routeChangeStart', cerrar);
    const ancho = () => { if (window.innerWidth > 900) setMenu(false); };
    window.addEventListener('resize', ancho);
    return () => { router.events.off('routeChangeStart', cerrar); window.removeEventListener('resize', ancho); };
  }, [router.events]);

  const abrirMega = () => { clearTimeout(cierreMega.current); setMega(true); };
  const cerrarMega = () => { cierreMega.current = setTimeout(() => setMega(false), 140); };

  const cls = `hd ${compacto ? 'compacto' : ''} ${oculto && !menu ? 'oculto' : ''} ${menu ? 'abierto' : ''}`;

  return (
    <>
      <a className="hd-saltar" href="#contenido-principal">Saltar al contenido</a>
      <header className={cls}>
        <div className="hd-fila">
          <Link className="hd-marca" href="/" aria-label="Ethos IA, inicio">
            <span className="hd-logo"><Image src="/empresa/ethos-ia-logo-v2.png" alt="" width={42} height={42} priority /></span>
            <span className="hd-nombre">Ethos IA</span>
          </Link>

          <nav className="hd-pill" aria-label="Principal" ref={pill} onMouseLeave={volverAlActivo}>
            <span className="hd-ind" aria-hidden="true" style={{ transform: `translateX(${indicador.x}px)`, width: indicador.w, opacity: indicador.visible ? 1 : 0 }} />
            {ENLACES.map((e) => {
              const esActivo = (e.seccion && e.seccion === claveActiva) || (hrefActivo && e.href === hrefActivo);
              const comun = {
                ref: (el) => { enlaces.current[e.etiqueta] = el; },
                className: esActivo ? 'hd-link on' : 'hd-link',
                'aria-current': esActivo ? 'true' : undefined,
                onMouseEnter: (ev) => { colocar(ev.currentTarget); if (e.mega) abrirMega(); else setMega(false); },
                onFocus: (ev) => colocar(ev.currentTarget),
              };
              if (e.mega) {
                return (
                  <span key={e.etiqueta} className="hd-mega-wrap" onMouseLeave={cerrarMega} onMouseEnter={abrirMega}>
                    <Link href={e.href} {...comun} aria-haspopup="true" aria-expanded={mega}
                      onKeyDown={(ev) => { if (ev.key === 'ArrowDown') { ev.preventDefault(); setMega(true); setTimeout(() => document.querySelector('.hd-mega a')?.focus(), 30); } if (ev.key === 'Escape') setMega(false); }}>
                      {e.etiqueta}<span className="hd-chev" aria-hidden="true">▾</span>
                    </Link>
                    <div className={mega ? 'hd-mega abierto' : 'hd-mega'} onKeyDown={(ev) => { if (ev.key === 'Escape') { setMega(false); enlaces.current[e.etiqueta]?.focus(); } }}>
                      <div className="hd-mega-grid">
                        {MEGA.map((m) => (
                          <Link key={m.titulo} href={m.href} className="hd-mega-card" tabIndex={mega ? 0 : -1} onClick={() => setMega(false)}>
                            <span className="hd-mega-img"><Image src={m.imagen} alt="" width={320} height={180} /></span>
                            <strong>{m.titulo}</strong>
                            <span>{m.texto}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="hd-mega-pie">
                        {MEGA_EXTRA.map((x) => <Link key={x.etiqueta} href={x.href} tabIndex={mega ? 0 : -1} onClick={() => setMega(false)}>{x.etiqueta} →</Link>)}
                        <Link href="/plataforma" tabIndex={mega ? 0 : -1} onClick={() => setMega(false)}>Ver todo Ethos Ingeniería →</Link>
                      </div>
                    </div>
                  </span>
                );
              }
              return <Link key={e.etiqueta} href={e.href} {...comun}>{e.etiqueta}</Link>;
            })}
          </nav>

          <div className="hd-der">
            <Link className="hd-cta" href="/#contacto"><span>Agendar diagnóstico</span></Link>
            <button type="button" className={menu ? 'hd-burger open' : 'hd-burger'} aria-label={menu ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menu} aria-controls="hd-menu-movil" onClick={() => setMenu((v) => !v)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
        <div className="hd-prog" aria-hidden="true"><span style={{ transform: `scaleX(${progreso})` }} /></div>
      </header>

      <div id="hd-menu-movil" ref={panel} className={menu ? 'hd-movil abierto' : 'hd-movil'} aria-hidden={!menu}>
        <ul>
          {ENLACES.map((e, i) => (
            <li key={e.etiqueta} style={{ '--i': i }}>
              <Link href={e.href} tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>{e.etiqueta}</Link>
              {e.mega && (
                <ul className="hd-sub">
                  {[...MEGA.map((m) => ({ etiqueta: m.titulo, href: m.href })), ...MEGA_EXTRA].map((s) => (
                    <li key={s.etiqueta}><Link href={s.href} tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>{s.etiqueta}</Link></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <Link className="hd-movil-cta" href="/#contacto" tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>Agendar diagnóstico</Link>
      </div>

      <style jsx global>{`
        .hd-saltar { position: fixed; left: 12px; top: -60px; z-index: 100; background: #04ebff; color: #05111e; padding: 10px 16px; border-radius: 8px; font-weight: 700; transition: top 0.2s ease; }
        .hd-saltar:focus { top: 12px; }

        .hd { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: linear-gradient(180deg, rgba(5,17,30,0.78), rgba(5,17,30,0.35)); border-bottom: 1px solid rgba(255,255,255,0.06); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, box-shadow 0.3s ease; padding-top: env(safe-area-inset-top); }
        .hd.compacto { background: rgba(5,17,30,0.88); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 12px 34px rgba(3,10,18,0.35); }
        .hd.oculto { transform: translateY(-110%); }
        .hd-fila { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px clamp(16px, 3vw, 32px); transition: padding 0.3s ease; }
        .hd.compacto .hd-fila { padding-top: 8px; padding-bottom: 8px; }

        .hd-marca { display: flex; align-items: center; gap: 10px; padding: 6px 16px 6px 6px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.04); border-radius: 999px; color: #eaf2f8; flex-shrink: 0; }
        .hd-logo { width: 42px; height: 42px; display: flex; transition: width 0.3s ease, height 0.3s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1); }
        .hd-logo img { width: 100%; height: 100%; object-fit: contain; }
        .hd.compacto .hd-logo { width: 34px; height: 34px; }
        .hd-marca:hover .hd-logo { transform: rotate(-8deg) scale(1.08); }
        .hd-nombre { font-family: var(--font-brand), sans-serif; font-size: 15px; font-weight: 600; }

        .hd-pill { position: relative; display: flex; gap: 4px; padding: 6px; border: 1px solid rgba(255,255,255,0.14); border-radius: 999px; background: rgba(255,255,255,0.03); }
        .hd-ind { position: absolute; top: 6px; bottom: 6px; left: 0; border-radius: 999px; background: rgba(4,235,255,0.16); box-shadow: inset 0 0 0 1px rgba(4,235,255,0.35); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), width 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease; pointer-events: none; }
        .hd-link { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 9px 18px; font-size: 13px; line-height: 1; color: #c4d3e0; border-radius: 999px; white-space: nowrap; transition: color 0.2s ease; }
        .hd-link:hover, .hd-link.on { color: #04ebff; }
        .hd-link:focus-visible, .hd-burger:focus-visible, .hd-cta:focus-visible, .hd-marca:focus-visible { outline: 2px solid #04ebff; outline-offset: 2px; }
        .hd-chev { font-size: 9px; transition: transform 0.25s ease; }
        .hd-mega-wrap:hover .hd-chev, .hd-mega-wrap:focus-within .hd-chev { transform: rotate(180deg); }

        .hd-mega-wrap { position: static; display: inline-flex; }
        .hd-mega { position: absolute; left: 50%; top: calc(100% - 4px); width: min(860px, calc(100vw - 32px)); transform: translate(-50%, 10px); background: rgba(5,17,30,0.97); backdrop-filter: blur(18px); border: 1px solid #123048; border-radius: 20px; padding: 18px; box-shadow: 0 30px 70px rgba(3,10,18,0.55); opacity: 0; visibility: hidden; transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s; }
        .hd-mega.abierto { opacity: 1; visibility: visible; transform: translate(-50%, 0); }
        .hd-mega-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .hd-mega-card { display: flex; flex-direction: column; gap: 6px; padding: 12px; border-radius: 14px; border: 1px solid #123048; background: #0a1b2b; color: #c4d3e0; font-size: 12.5px; line-height: 1.5; transition: transform 0.2s ease, border-color 0.2s ease; }
        .hd-mega-card:hover, .hd-mega-card:focus-visible { transform: translateY(-3px); border-color: #04ebff; outline: none; }
        .hd-mega-card strong { color: #eaf2f8; font-size: 14px; }
        .hd-mega-img { display: block; aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; background: #05111e; }
        .hd-mega-img img { width: 100%; height: 100%; object-fit: cover; object-position: top left; }
        .hd-mega-pie { display: flex; flex-wrap: wrap; gap: 8px 22px; padding: 14px 6px 0; font-size: 13px; font-weight: 700; }
        .hd-mega-pie a { color: #04ebff; }

        .hd-der { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .hd-cta { position: relative; overflow: hidden; padding: 12px 24px; background: linear-gradient(135deg, #dcfaff 0%, #8eecff 100%); color: #05111e; border-radius: 999px; font-weight: 700; font-size: 13px; box-shadow: 0 14px 26px rgba(4,235,255,0.18); white-space: nowrap; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hd-cta span { position: relative; z-index: 1; }
        .hd-cta::before { content: ''; position: absolute; top: 0; bottom: 0; width: 40%; left: -60%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.75), transparent); transform: skewX(-20deg); animation: hd-brillo 4.5s ease-in-out infinite; }
        .hd-cta:hover { color: #05111e; transform: translateY(-1px); box-shadow: 0 18px 32px rgba(4,235,255,0.28); }
        @keyframes hd-brillo { 0%, 60% { left: -60%; } 100% { left: 130%; } }

        .hd-burger { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 44px; height: 44px; border: 1px solid rgba(255,255,255,0.16); border-radius: 12px; background: transparent; cursor: pointer; padding: 0; }
        .hd-burger span { display: block; width: 18px; height: 2px; background: #eaf2f8; margin: 0 auto; border-radius: 2px; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease; }
        .hd-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hd-burger.open span:nth-child(2) { opacity: 0; }
        .hd-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .hd-prog { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; pointer-events: none; }
        .hd-prog span { display: block; height: 100%; background: linear-gradient(90deg, #04ebff, #7aa7ff); transform-origin: left; }

        .hd-movil { position: fixed; inset: 0; z-index: 45; background: radial-gradient(circle at 80% 0%, rgba(4,235,255,0.14), transparent 50%), #05111e; padding: calc(84px + env(safe-area-inset-top)) clamp(20px, 6vw, 40px) calc(24px + env(safe-area-inset-bottom)); display: none; flex-direction: column; justify-content: space-between; height: 100dvh; overflow-y: auto; opacity: 0; transform: translateY(-12px); visibility: hidden; transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s; }
        .hd-movil ul { list-style: none; margin: 0; padding: 0; }
        .hd-movil > ul > li { border-bottom: 1px solid rgba(255,255,255,0.08); opacity: 0; transform: translateX(-16px); transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1); transition-delay: calc(var(--i, 0) * 60ms + 80ms); }
        .hd-movil.abierto > ul > li { opacity: 1; transform: none; }
        .hd-movil > ul > li > a { display: block; padding: 18px 4px; font-size: clamp(1.2rem, 5vw, 1.6rem); font-weight: 600; color: #eaf2f8; font-family: var(--font-brand), sans-serif; }
        .hd-sub { padding: 0 0 16px 4px !important; display: flex; flex-direction: column; gap: 2px; }
        .hd-sub a { display: block; padding: 10px 4px; font-size: 14.5px; color: #93aabb; }
        .hd-sub a:hover { color: #04ebff; }
        .hd-movil-cta { display: block; text-align: center; margin-top: 24px; padding: 16px; border-radius: 999px; background: linear-gradient(135deg, #dcfaff, #8eecff); color: #05111e; font-weight: 800; }
        .hd-movil a:focus-visible { outline: 2px solid #04ebff; outline-offset: 2px; border-radius: 6px; }

        @media (max-width: 900px) {
          .hd-pill { display: none; }
          .hd-burger { display: flex; }
          .hd-movil { display: flex; }
          .hd-movil.abierto { opacity: 1; transform: none; visibility: visible; }
          .hd-cta { padding: 10px 14px; font-size: 12px; }
        }
        @media (max-width: 480px) {
          .hd-nombre { display: none; }
          .hd-marca { padding-right: 6px; }
          .hd-cta { padding: 10px 12px; }
        }
        @media (max-width: 340px) { .hd-cta { display: none; } }
        @media (hover: none) { .hd-mega { display: none; } }
        @media (prefers-reduced-motion: reduce) {
          .hd, .hd-fila, .hd-logo, .hd-ind, .hd-mega, .hd-movil, .hd-movil > ul > li { transition: none !important; }
          .hd.oculto { transform: none; }
          .hd-cta::before { animation: none; display: none; }
          .hd-movil > ul > li { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}
