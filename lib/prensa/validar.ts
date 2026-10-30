// Reglas editoriales de Ethos Prensa: slug, límites de SEO y controles antes de publicar.
import type { Bloque } from '../noticias';

export const LIMITE_TITULO_SEO = 60;
export const LIMITE_RESUMEN_SEO = 155;
// Frases que el sitio no admite (lenguaje de obra inconclusa).
export const FRASES_PROHIBIDAS = ['próximamente', 'proximamente', 'en construcción', 'en construccion', 'coming soon', 'fase de expansión'];

export function aSlug(texto: string): string {
  return texto
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
    .replace(/-+$/g, '');
}

export type Borrador = {
  titulo: string;
  resumen: string;
  slug: string;
  imagen: { src: string; alt: string; credito?: string } | null;
  cuerpo: Bloque[];
  fuentes: { texto: string; url: string }[];
};

function textos(b: Borrador): string[] {
  const salida = [b.titulo, b.resumen];
  for (const x of b.cuerpo) {
    if (x.tipo === 'lista') salida.push(...x.items);
    else if ('texto' in x) salida.push(x.texto);
  }
  return salida;
}

// Devuelve la lista de problemas; vacía = lista para publicar.
export function problemasParaPublicar(b: Borrador): string[] {
  const p: string[] = [];
  if (b.titulo.trim().length < 10) p.push('El título debe tener al menos 10 caracteres.');
  if (b.resumen.trim().length < 30) p.push('La bajada debe tener al menos 30 caracteres.');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(b.slug)) p.push('La dirección (slug) solo admite minúsculas, números y guiones.');
  if (!b.imagen?.src) p.push('Falta la imagen principal.');
  else {
    if (!b.imagen.alt || b.imagen.alt.trim().length < 10) p.push('La imagen principal necesita un texto alternativo descriptivo.');
    if (!b.imagen.credito?.trim()) p.push('La imagen principal necesita el crédito de la foto.');
  }
  if (!b.cuerpo.some((x) => x.tipo === 'p' && x.texto.trim().length > 0)) p.push('El cuerpo necesita al menos un párrafo.');
  b.cuerpo.forEach((x, i) => {
    if (x.tipo === 'imagen' && (!x.alt?.trim() || !x.credito?.trim())) p.push(`La foto del bloque ${i + 1} necesita texto alternativo y crédito.`);
    if (x.tipo === 'video' && (!x.id.trim() || !x.titulo.trim())) p.push(`El video del bloque ${i + 1} necesita enlace y título.`);
  });
  if (b.fuentes.length === 0) p.push('Agrega al menos una fuente verificable.');
  b.fuentes.forEach((f, i) => {
    if (!/^https:\/\//.test(f.url)) p.push(`La fuente ${i + 1} debe ser un enlace https.`);
  });
  const todo = textos(b).join(' ').toLowerCase();
  for (const f of FRASES_PROHIBIDAS) if (todo.includes(f)) p.push(`El texto contiene una frase no admitida en el sitio: «${f}».`);
  return p;
}

// Extrae el id de un enlace de YouTube o Vimeo pegado por el periodista.
export function idDeVideo(enlace: string): { proveedor: 'youtube' | 'vimeo'; id: string } | null {
  const yt = enlace.match(/(?:youtube\.com\/(?:watch\?v=|live\/|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { proveedor: 'youtube', id: yt[1] };
  const vm = enlace.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { proveedor: 'vimeo', id: vm[1] };
  return null;
}
