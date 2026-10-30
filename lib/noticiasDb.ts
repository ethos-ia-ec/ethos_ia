// Lectura pública de Ethos Noticias desde Supabase (tabla `noticias`, migración 0005) con la clave anónima:
// la política RLS ya filtra lo publicado con fecha cumplida. Si Supabase no está configurado o falla, se usan las
// notas de lib/noticias.ts para que el sitio nunca quede sin noticias.
import { createClient } from '@supabase/supabase-js';
import { NOTICIAS, type Noticia } from './noticias';

type Fila = {
  slug: string; titulo: string; resumen: string; categoria: Noticia['categoria'];
  cuerpo: Noticia['cuerpo']; fuentes: Noticia['fuentes']; imagen: Noticia['imagen'] | null;
  imagen_social: string | null; publicada_en: string; actualizado_en: string; autor_nombre: string | null;
};

const COLUMNAS = 'slug,titulo,resumen,categoria,cuerpo,fuentes,imagen,imagen_social,publicada_en,actualizado_en,autor_nombre';

function cliente() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  return url && clave ? createClient(url, clave, { auth: { persistSession: false } }) : null;
}

export function aNoticia(f: Fila): Noticia {
  return {
    slug: f.slug,
    fecha: f.publicada_en.slice(0, 10),
    actualizada: f.actualizado_en,
    categoria: f.categoria,
    titulo: f.titulo,
    resumen: f.resumen,
    imagen: f.imagen ?? { src: '/empresa/ethos-og-card.png', alt: 'Ethos IA', ancho: 1200, alto: 630 },
    ...(f.imagen_social ? { imagenSocial: f.imagen_social } : {}),
    ...(f.autor_nombre ? { autor: f.autor_nombre } : {}),
    cuerpo: f.cuerpo ?? [],
    fuentes: f.fuentes ?? [],
  };
}

// Une las notas de la base con las estáticas (la base gana si el slug coincide) y ordena por fecha.
export function combinar(base: Noticia[], estaticas: Noticia[] = NOTICIAS): Noticia[] {
  const vistos = new Set(base.map((n) => n.slug));
  return [...base, ...estaticas.filter((n) => !vistos.has(n.slug))].sort((a, b) => Number(!!b.destacada) - Number(!!a.destacada) || b.fecha.localeCompare(a.fecha));
}

export async function noticiasPublicadas(): Promise<Noticia[]> {
  const sb = cliente();
  if (!sb) return combinar([]);
  const { data, error } = await sb.from('noticias').select(COLUMNAS).order('publicada_en', { ascending: false }).limit(200);
  if (error) {
    console.error('[noticias] Supabase:', error.message);
    return combinar([]);
  }
  return combinar((data as Fila[]).map(aNoticia));
}

export async function noticiaPublicada(slug: string): Promise<Noticia | null> {
  const sb = cliente();
  if (sb) {
    const { data, error } = await sb.from('noticias').select(COLUMNAS).eq('slug', slug).maybeSingle();
    if (data) return aNoticia(data as Fila);
    if (error) console.error('[noticias] Supabase:', error.message);
  }
  return NOTICIAS.find((n) => n.slug === slug) ?? null;
}
