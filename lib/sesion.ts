// Sesión de Supabase en el navegador, compartida por todo el sitio (/ingresar, /cuenta y /prensa).
// Solo usa la clave publicable: los permisos los decide la base con RLS.
import { createClient, type Provider, type SupabaseClient } from '@supabase/supabase-js';

let instancia: SupabaseClient | null = null;

export function sb(): SupabaseClient {
  if (!instancia) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !clave) throw new Error('Falta configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    instancia = createClient(url, clave, { auth: { persistSession: true, storageKey: 'ethos-sesion' } });
  }
  return instancia;
}

export const PROVEEDORES: { id: Extract<Provider, 'google' | 'github' | 'facebook'>; nombre: string }[] = [
  { id: 'google', nombre: 'Google' },
  { id: 'github', nombre: 'GitHub' },
  { id: 'facebook', nombre: 'Facebook' },
];

// Solo se aceptan destinos internos del sitio (ruta, consulta y ancla), para que nadie use el acceso como redirección abierta.
export function destinoSeguro(valor: unknown): string {
  return typeof valor === 'string' && valor.length < 300 && /^\/(?![/\\])[^\s\\]*$/.test(valor) ? valor : '/';
}

// Página donde está la persona: al volver del proveedor regresa ahí, no a otra página.
export const aquiMismo = () => `${location.pathname}${location.search}${location.hash}`;

// Registro e inicio de sesión son el mismo paso: si la cuenta no existe, Supabase la crea.
export async function entrarCon(proveedor: (typeof PROVEEDORES)[number]['id'], destino = aquiMismo()) {
  const { error } = await sb().auth.signInWithOAuth({
    provider: proveedor,
    options: { redirectTo: `${location.origin}${destinoSeguro(destino)}`, scopes: proveedor === 'github' ? 'read:user user:email' : undefined },
  });
  return error?.message ?? null;
}
