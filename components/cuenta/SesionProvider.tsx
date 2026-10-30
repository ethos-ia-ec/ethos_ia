import type { User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

// Sesión de todo el sitio: una sola suscripción a Supabase Auth y el perfil visible de `miembros`.
// El cliente de Supabase se carga después de pintar la página, para no pesar en la portada.
export type Perfil = { nombre: string; foto: string | null; mostrarFoto: boolean; rol: string | null };
type Valor = { usuario: User | null; perfil: Perfil | null; cargando: boolean; refrescar: () => Promise<void>; salir: () => Promise<void> };

const Contexto = createContext<Valor>({ usuario: null, perfil: null, cargando: true, refrescar: async () => {}, salir: async () => {} });
export const useSesion = () => useContext(Contexto);

const cliente = () => import('../../lib/sesion').then((m) => m.sb());
const configurado = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(configurado);

  const cargarPerfil = useCallback(async (u: User | null) => {
    setUsuario(u);
    if (!u) {
      setPerfil(null);
      return;
    }
    const meta = u.user_metadata ?? {};
    const { data } = await (await cliente()).from('miembros').select('nombre,mostrar_foto,rol').eq('user_id', u.id).maybeSingle();
    setPerfil({
      nombre: data?.nombre || meta.full_name || meta.name || u.email || '',
      foto: meta.avatar_url || meta.picture || null,
      mostrarFoto: data?.mostrar_foto ?? true,
      rol: data?.rol ?? null,
    });
  }, []);

  useEffect(() => {
    if (!configurado) return undefined;
    let cancelar = () => {};
    cliente().then(async (sb) => {
      const { data } = await sb.auth.getSession();
      await cargarPerfil(data.session?.user ?? null);
      setCargando(false);
      const { data: sub } = sb.auth.onAuthStateChange((evento, s) => {
        if (evento === 'SIGNED_IN' || evento === 'SIGNED_OUT' || evento === 'USER_UPDATED') cargarPerfil(s?.user ?? null);
      });
      cancelar = () => sub.subscription.unsubscribe();
    });
    return () => cancelar();
  }, [cargarPerfil]);

  const refrescar = useCallback(async () => {
    const { data } = await (await cliente()).auth.getSession();
    await cargarPerfil(data.session?.user ?? null);
  }, [cargarPerfil]);

  const salir = useCallback(async () => {
    await (await cliente()).auth.signOut();
  }, []);

  return <Contexto.Provider value={{ usuario, perfil, cargando, refrescar, salir }}>{children}</Contexto.Provider>;
}
