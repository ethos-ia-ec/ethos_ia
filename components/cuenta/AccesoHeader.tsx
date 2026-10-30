import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Avatar from './Avatar';
import BotonesSociales from './BotonesSociales';
import { useSesion } from './SesionProvider';

// Zona de cuenta del encabezado, como en los sitios profesionales:
//   · sin sesión: «Iniciar sesión» y «Registrarse», que abren la misma ventana con Google, GitHub y Facebook;
//   · con sesión: foto y primer nombre; al pulsar, menú con Mi perfil, Ethos Prensa (equipo) y Cerrar sesión.
// `movil` lo dibuja en columna para el menú a pantalla completa.
type Modo = 'entrar' | 'registro';
const STAFF = ['redactor', 'editor', 'admin'];

export default function AccesoHeader({ movil = false, alNavegar }: { movil?: boolean; alNavegar?: () => void }) {
  const { usuario, perfil, cargando, salir } = useSesion();
  const [modal, setModal] = useState<Modo | null>(null);
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const dialogo = useRef<HTMLDivElement>(null);

  // Menú: se cierra con clic fuera o Esc.
  useEffect(() => {
    if (!abierto) return undefined;
    const fuera = (e: MouseEvent) => { if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false); };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', fuera); document.removeEventListener('keydown', esc); };
  }, [abierto]);

  // Ventana de acceso: Esc cierra, el foco no sale de ella y la página de fondo no se desplaza.
  useEffect(() => {
    if (!modal) return undefined;
    const previo = document.activeElement as HTMLElement | null;
    dialogo.current?.querySelector<HTMLElement>('button')?.focus();
    const teclado = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal(null);
      if (e.key !== 'Tab' || !dialogo.current) return;
      const f = dialogo.current.querySelectorAll<HTMLElement>('button, a[href]');
      const primero = f[0], ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    };
    document.addEventListener('keydown', teclado);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', teclado); document.body.style.overflow = ''; previo?.focus(); };
  }, [modal]);

  const abrir = (m: Modo) => setModal(m);
  const cerrarYNavegar = () => { setAbierto(false); alNavegar?.(); };

  let contenido;
  if (cargando) contenido = <span className={movil ? 'reserva m' : 'reserva'} aria-hidden="true" />;
  else if (usuario && perfil) {
    const primerNombre = perfil.nombre.split(/[\s@]/)[0];
    const enlaces = (
      <>
        <Link href="/cuenta" role="menuitem" onClick={cerrarYNavegar}>Mi perfil</Link>
        {perfil.rol && STAFF.includes(perfil.rol) && <Link href="/prensa" role="menuitem" onClick={cerrarYNavegar}>Ethos Prensa</Link>}
        <button type="button" role="menuitem" onClick={() => { setAbierto(false); salir(); }}>Cerrar sesión</button>
      </>
    );
    contenido = movil ? (
      <div className="movil-usuario">
        <div className="quien"><Avatar perfil={perfil} tam={44} /><div><strong>{perfil.nombre}</strong><small>{usuario.email}</small></div></div>
        <nav className="movil-enlaces">{enlaces}</nav>
      </div>
    ) : (
      <div className="usuario" ref={caja}>
        <button type="button" className="chip" aria-haspopup="menu" aria-expanded={abierto} onClick={() => setAbierto((v) => !v)}>
          <Avatar perfil={perfil} />
          <span className="nombre">{primerNombre}</span>
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
        </button>
        {abierto && (
          <div className="menu" role="menu">
            <div className="quien"><Avatar perfil={perfil} tam={40} /><div><strong>{perfil.nombre}</strong><small>{usuario.email}</small></div></div>
            {enlaces}
          </div>
        )}
      </div>
    );
  } else {
    contenido = (
      <div className={movil ? 'acceso movil' : 'acceso'}>
        <button type="button" className="entrar" onClick={() => abrir('entrar')}>Iniciar sesión</button>
        <button type="button" className="registro" onClick={() => abrir('registro')}>Registrarse</button>
      </div>
    );
  }

  return (
    <span className="ac">
      {contenido}
      {modal && createPortal(
        <div className="ac fondo" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="dialogo" role="dialog" aria-modal="true" aria-labelledby="acceso-titulo" ref={dialogo}>
            <button type="button" className="cerrar" aria-label="Cerrar" onClick={() => setModal(null)}>×</button>
            <h2 id="acceso-titulo">{modal === 'entrar' ? 'Inicia sesión en Ethos IA' : 'Crea tu cuenta en Ethos IA'}</h2>
            <p className="sub">{modal === 'entrar' ? 'Continúa con la cuenta que usaste al registrarte.' : 'Sin contraseñas nuevas: usa la cuenta que ya tienes.'}</p>
            <BotonesSociales />
            <p className="cambio">
              {modal === 'entrar' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <button type="button" onClick={() => setModal(modal === 'entrar' ? 'registro' : 'entrar')}>{modal === 'entrar' ? 'Regístrate' : 'Inicia sesión'}</button>
            </p>
            <p className="legal">
              Al continuar aceptas las <Link href="/terminos">Condiciones del Servicio</Link> y la <Link href="/privacidad">Política de Privacidad</Link>.
              Ethos IA solo recibe tu nombre, correo y foto, nunca tu contraseña.
            </p>
          </div>
        </div>,
        document.body,
      )}
      <style jsx global>{`
        .ac .reserva { display: inline-block; width: 96px; height: 36px; }
        .ac .reserva.m { display: block; width: 100%; margin-top: 24px; }
        .ac .acceso { display: flex; align-items: center; gap: 6px; }
        .ac .acceso.movil { flex-direction: column; align-items: stretch; gap: 10px; margin-top: 24px; }
        .ac .entrar, .ac .registro { font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; border-radius: 999px; padding: 10px 14px; }
        .ac .entrar { background: none; border: none; color: #dcfaff; }
        .ac .entrar:hover { color: #04ebff; }
        .ac .registro { background: transparent; color: #dcfaff; border: 1px solid rgba(4, 235, 255, 0.45); }
        .ac .registro:hover { border-color: #04ebff; color: #04ebff; }
        .ac .movil .entrar, .ac .movil .registro { padding: 14px; font-size: 15px; border: 1px solid rgba(4, 235, 255, 0.4); }
        .ac .usuario { position: relative; }
        .ac .chip { display: flex; align-items: center; gap: 8px; padding: 3px 10px 3px 3px; border-radius: 999px; border: 1px solid rgba(4, 235, 255, 0.25); background: rgba(5, 17, 30, 0.45); color: #dcfaff; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
        .ac .chip:hover, .ac .chip[aria-expanded='true'] { border-color: #04ebff; }
        .ac .chip svg { width: 12px; height: 12px; }
        .ac .nombre { max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ac .menu { position: absolute; right: 0; top: calc(100% + 10px); width: 260px; background: #fff; color: #05111e; border-radius: 14px; box-shadow: 0 18px 40px rgba(5, 17, 30, 0.28); padding: 8px; display: flex; flex-direction: column; z-index: 60; }
        .ac .quien { display: flex; align-items: center; gap: 12px; padding: 10px; }
        .ac .menu .quien { border-bottom: 1px solid #e3ebf2; margin-bottom: 6px; }
        .ac .quien div { display: flex; flex-direction: column; min-width: 0; }
        .ac .quien strong { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ac .quien small { font-size: 12px; opacity: 0.7; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ac .menu a, .ac .menu button { display: block; text-align: left; padding: 10px; border-radius: 8px; font: inherit; font-size: 14px; color: #05111e; background: none; border: none; cursor: pointer; text-decoration: none; }
        .ac .menu a:hover, .ac .menu button:hover { background: #eef7fb; }
        .ac .movil-usuario { margin-top: 24px; padding: 14px; border-radius: 18px; border: 1px solid rgba(4, 235, 255, 0.3); color: #dcfaff; }
        .ac .movil-enlaces { display: flex; flex-direction: column; margin-top: 6px; }
        .ac .movil-enlaces a, .ac .movil-enlaces button { padding: 12px 10px; color: #dcfaff; font: inherit; font-size: 15px; font-weight: 600; background: none; border: none; text-align: left; cursor: pointer; }
        .ac.fondo { position: fixed; inset: 0; z-index: 200; background: rgba(5, 17, 30, 0.72); backdrop-filter: blur(6px); display: grid; place-items: center; padding: 16px; }
        .ac .dialogo { position: relative; width: 100%; max-width: 400px; background: #fff; color: #05111e; border-radius: 20px; padding: 32px 24px 22px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35); animation: ac-aparecer 0.18s ease-out; }
        @keyframes ac-aparecer { from { opacity: 0; transform: translateY(8px) scale(0.98); } }
        .ac .dialogo h2 { font-size: 1.35rem; margin: 0 0 6px; }
        .ac .sub { margin: 0 0 20px; color: #4a5c6b; font-size: 14px; }
        .ac .cerrar { position: absolute; top: 10px; right: 12px; width: 36px; height: 36px; border-radius: 50%; border: none; background: none; font-size: 24px; line-height: 1; color: #4a5c6b; cursor: pointer; }
        .ac .cerrar:hover { background: #eef2f5; }
        .ac .cambio { text-align: center; font-size: 14px; margin: 18px 0 8px; color: #4a5c6b; }
        .ac .cambio button { background: none; border: none; font: inherit; font-weight: 700; color: #0b5f75; cursor: pointer; padding: 0; }
        .ac .legal { font-size: 12px; color: #6b7c8a; line-height: 1.55; text-align: center; margin: 8px 0 0; }
        .ac .legal a { color: #0b5f75; font-weight: 600; }
        @media (prefers-reduced-motion: reduce) { .ac .dialogo { animation: none; } }
      `}</style>
    </span>
  );
}
