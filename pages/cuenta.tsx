import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Avatar from '../components/cuenta/Avatar';
import { useSesion } from '../components/cuenta/SesionProvider';
import Header from '../components/home/Header';
import { sb } from '../lib/sesion';

// Mi cuenta: perfil que entrega el proveedor, solicitudes de diagnóstico enviadas con el mismo correo,
// suscripción a Ethos Noticias y eliminación de la cuenta (LOPDP). Todo lo filtra la base con RLS (migración 0007).
type Solicitud = { id: string; area_interes: string | null; mensaje: string | null; creado_en: string };
type Boletin = { suscrito: boolean; alta_en: string; baja_en: string | null } | null;

const PROVEEDOR: Record<string, string> = { google: 'Google', github: 'GitHub', facebook: 'Facebook', email: 'correo' };
const fecha = (iso: string) => new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });

export default function Cuenta() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<User | null | undefined>(undefined);
  const [rol, setRol] = useState<string | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [boletin, setBoletin] = useState<Boletin>(null);
  const [aviso, setAviso] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const { perfil, refrescar } = useSesion();
  const [nombreVisible, setNombreVisible] = useState('');
  const [mostrarFoto, setMostrarFoto] = useState(true);

  useEffect(() => {
    if (perfil) { setNombreVisible(perfil.nombre); setMostrarFoto(perfil.mostrarFoto); }
  }, [perfil]);

  async function guardarPerfil(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario) return;
    setOcupado(true);
    const { error } = await sb().from('miembros').update({ nombre: nombreVisible.trim().slice(0, 80) || null, mostrar_foto: mostrarFoto }).eq('user_id', usuario.id);
    setAviso(error ? 'No se pudo guardar su perfil. Intente de nuevo.' : 'Perfil actualizado.');
    await refrescar();
    setOcupado(false);
  }

  const cargar = useCallback(async (u: User) => {
    const [m, s, b] = await Promise.all([
      sb().from('miembros').select('rol').eq('user_id', u.id).maybeSingle(),
      sb().from('solicitudes').select('id,area_interes,mensaje,creado_en').order('creado_en', { ascending: false }),
      sb().from('boletin').select('suscrito,alta_en,baja_en').eq('user_id', u.id).maybeSingle(),
    ]);
    setRol(m.data?.rol ?? null);
    setSolicitudes((s.data as Solicitud[]) ?? []);
    setBoletin((b.data as Boletin) ?? null);
  }, []);

  useEffect(() => {
    const aplicar = (u: User | null) => {
      setUsuario(u);
      if (u) cargar(u);
      else router.replace('/ingresar');
    };
    sb().auth.getSession().then(({ data }) => aplicar(data.session?.user ?? null));
    const { data } = sb().auth.onAuthStateChange((evento, s) => {
      if (evento === 'SIGNED_IN' || evento === 'SIGNED_OUT') aplicar(s?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, [cargar, router]);

  async function cambiarBoletin(suscribir: boolean) {
    if (!usuario?.email) return;
    setOcupado(true);
    const ahora = new Date().toISOString();
    const fila: Record<string, unknown> = suscribir
      ? { user_id: usuario.id, correo: usuario.email, suscrito: true, alta_en: ahora, baja_en: null }
      : { user_id: usuario.id, correo: usuario.email, suscrito: false, baja_en: ahora };
    const { error } = await sb().from('boletin').upsert(fila, { onConflict: 'user_id' });
    setAviso(error ? 'No se pudo guardar la preferencia. Intente de nuevo.' : suscribir ? 'Listo: recibirá Ethos Noticias en su correo.' : 'Listo: ya no recibirá Ethos Noticias.');
    await cargar(usuario);
    setOcupado(false);
  }

  async function salir() {
    await sb().auth.signOut();
  }

  async function borrar() {
    if (!confirm('Se eliminarán su cuenta, su perfil y su suscripción. Las solicitudes de diagnóstico se conservan como registro comercial. ¿Desea continuar?')) return;
    setOcupado(true);
    const { error } = await sb().rpc('borrar_mi_cuenta');
    if (error) {
      setAviso(error.message);
      setOcupado(false);
      return;
    }
    await sb().auth.signOut();
  }

  const meta = usuario?.user_metadata ?? {};
  const nombre: string = perfil?.nombre || meta.full_name || meta.name || usuario?.email || '';
  const foto: string | undefined = perfil && !perfil.mostrarFoto ? undefined : meta.avatar_url || meta.picture;
  const proveedores: string[] = (usuario?.app_metadata?.providers as string[]) ?? [];
  const staff = rol !== null && ['redactor', 'editor', 'admin'].includes(rol);

  return (
    <div className="pagina" id="contenido-principal">
      <Head>
        <title>Mi perfil | Ethos IA</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Header />
      <main className="caja">
        {usuario === undefined && <p className="tarjeta">Cargando su cuenta…</p>}
        {usuario && (
          <>
            <section className="tarjeta perfil">
              {foto ? <img src={foto} alt="" width={72} height={72} referrerPolicy="no-referrer" /> : <span className="inicial">{nombre.charAt(0).toUpperCase()}</span>}
              <div className="datos">
                <h1>{nombre}</h1>
                <p className="dim">{usuario.email}</p>
                <p className="dim">Acceso con {proveedores.map((p) => PROVEEDOR[p] ?? p).join(', ')} · Miembro desde {fecha(usuario.created_at)}</p>
              </div>
              <div className="acciones">
                {staff && <Link className="btn prim" href="/prensa">Ir a Ethos Prensa</Link>}
                <button className="btn" onClick={salir}>Cerrar sesión</button>
              </div>
            </section>

            {aviso && <p className="aviso" role="status">{aviso}</p>}

            {perfil && (
              <form className="tarjeta" onSubmit={guardarPerfil}>
                <h2>Cómo te ves en Ethos IA</h2>
                <p className="dim">Así apareces en el encabezado del sitio. Tu perfil es privado: solo tú lo ves.</p>
                <div className="vista">
                  <Avatar perfil={{ ...perfil, nombre: nombreVisible || perfil.nombre, mostrarFoto }} tam={48} />
                  <strong>{nombreVisible || perfil.nombre}</strong>
                </div>
                <label className="campo">Nombre visible
                  <input value={nombreVisible} maxLength={80} onChange={(e) => setNombreVisible(e.target.value)} />
                </label>
                <label className="interruptor">
                  <input type="checkbox" checked={mostrarFoto} disabled={!perfil.foto} onChange={(e) => setMostrarFoto(e.target.checked)} />
                  Mostrar la foto de mi cuenta {perfil.foto ? '' : '(su proveedor no entregó foto)'}
                </label>
                <button className="btn prim" disabled={ocupado}>Guardar cambios</button>
              </form>
            )}

            <section className="tarjeta">
              <h2>Mis solicitudes de diagnóstico</h2>
              {solicitudes.length === 0 ? (
                <p className="dim">No hay solicitudes registradas con {usuario.email}. <Link href="/#contacto">Agendar un diagnóstico</Link></p>
              ) : (
                <ul className="lista">
                  {solicitudes.map((s) => (
                    <li key={s.id}>
                      <strong>{s.area_interes || 'Diagnóstico general'}</strong>
                      <span className="dim">Enviada el {fecha(s.creado_en)}</span>
                      {s.mensaje && <p>{s.mensaje}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="tarjeta">
              <h2>Boletín Ethos Noticias</h2>
              <p className="dim">
                {boletin?.suscrito ? `Suscrito desde el ${fecha(boletin.alta_en)}. Recibe las notas nuevas en ${usuario.email}.` : 'Reciba en su correo las notas nuevas de Ethos Noticias. Puede darse de baja cuando quiera.'}
              </p>
              <button className={`btn ${boletin?.suscrito ? '' : 'prim'}`} disabled={ocupado} onClick={() => cambiarBoletin(!boletin?.suscrito)}>
                {boletin?.suscrito ? 'Darme de baja' : 'Suscribirme'}
              </button>
            </section>

            <section className="tarjeta peligro">
              <h2>Eliminar mi cuenta</h2>
              <p className="dim">Borra su perfil y su suscripción de forma definitiva, conforme a la Ley Orgánica de Protección de Datos Personales.</p>
              <button className="btn rojo" disabled={ocupado} onClick={borrar}>Eliminar mi cuenta</button>
            </section>
          </>
        )}
      </main>
      <style jsx>{`
        .pagina { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; }
        .caja { max-width: 760px; margin: 0 auto; padding: 120px 16px 64px; }
        .tarjeta { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: 16px; padding: 22px; margin-bottom: 16px; }
        .perfil { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; }
        .perfil img, .inicial { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; flex: none; }
        .inicial { display: grid; place-items: center; background: var(--c-azul); color: var(--c-cian); font-size: 28px; font-weight: 800; }
        .datos { flex: 1 1 240px; min-width: 0; }
        h1 { font-size: 1.4rem; margin: 0 0 4px; overflow-wrap: anywhere; }
        h2 { font-size: 1.05rem; margin: 0 0 10px; }
        .dim { color: var(--c-texto-3); font-size: 14px; margin: 2px 0 12px; overflow-wrap: anywhere; }
        .dim :global(a) { color: var(--c-teal); font-weight: 600; }
        .acciones { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn, .acciones :global(.btn) { display: inline-block; font: inherit; font-size: 14px; font-weight: 600; padding: 10px 16px; border-radius: 10px; border: 1px solid var(--c-borde); background: #fff; color: var(--c-texto); cursor: pointer; text-decoration: none; }
        .prim, .acciones :global(.prim) { background: var(--c-azul); color: var(--c-cian); border-color: var(--c-azul); }
        .rojo { color: var(--c-error); border-color: var(--c-error); }
        .btn:disabled { opacity: 0.55; cursor: wait; }
        .aviso { background: var(--c-ok-bg); color: var(--c-ok); padding: 12px 16px; border-radius: 10px; margin: 0 0 16px; }
        .lista { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
        .lista li { border-left: 3px solid var(--c-cian); padding: 4px 0 4px 12px; display: grid; gap: 2px; }
        .lista p { margin: 4px 0 0; font-size: 14px; }
        .vista { display: flex; align-items: center; gap: 12px; margin: 4px 0 16px; }
        .campo { display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 600; margin-bottom: 12px; }
        .campo input { font: inherit; font-weight: 400; padding: 10px 12px; border: 1px solid var(--c-borde); border-radius: 10px; max-width: 360px; }
        .interruptor { display: flex; align-items: center; gap: 10px; font-size: 14px; margin-bottom: 16px; }
        .interruptor input { width: 18px; height: 18px; }
        .peligro { border-color: var(--c-error-bg); }
      `}</style>
    </div>
  );
}
