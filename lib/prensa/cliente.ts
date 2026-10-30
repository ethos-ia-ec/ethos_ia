// Cliente de Supabase para el panel /prensa: corre en el navegador con la sesión del periodista.
// Todo permiso lo decide la base (RLS de la migración 0005); aquí no hay claves privadas.
import { sb } from '../sesion';
import { aSlug } from './validar';

export { sb };

export type Rol = 'redactor' | 'editor' | 'admin';

export async function miRol(): Promise<Rol | null> {
  const { data } = await sb().rpc('rol_prensa');
  return (data as Rol | null) ?? null;
}

// Reduce la foto en el navegador (lado mayor de 2000 px, WebP al 85 %) antes de subirla:
// el periodista puede subir la foto tal como sale de la cámara.
async function optimizar(archivo: File): Promise<{ blob: Blob; ancho: number; alto: number }> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);
  const lienzo = document.createElement('canvas');
  lienzo.width = ancho;
  lienzo.height = alto;
  lienzo.getContext('2d')!.drawImage(bitmap, 0, 0, ancho, alto);
  const blob = await new Promise<Blob>((ok, mal) => lienzo.toBlob((b) => (b ? ok(b) : mal(new Error('No se pudo procesar la imagen.'))), 'image/webp', 0.85));
  return { blob, ancho, alto };
}

export const MAX_IMAGEN = 10 * 1024 * 1024;
export const MAX_VIDEO = 80 * 1024 * 1024;

export async function subirMedio(archivo: File): Promise<{ src: string; ancho: number; alto: number; tipo: 'imagen' | 'video' }> {
  const esVideo = archivo.type.startsWith('video/');
  if (!esVideo && !/^image\/(jpeg|png|webp|avif)$/.test(archivo.type)) throw new Error('Formato no admitido. Usa JPG, PNG, WebP, AVIF, MP4 o WebM.');
  if (archivo.size > (esVideo ? MAX_VIDEO : MAX_IMAGEN)) throw new Error(esVideo ? 'El video supera 80 MB: súbelo a YouTube y pega el enlace.' : 'La imagen supera 10 MB.');
  const fecha = new Date().toISOString().slice(0, 7);
  const base = aSlug(archivo.name.replace(/\.[^.]+$/, '')) || 'medio';
  const sufijo = Math.random().toString(36).slice(2, 8);
  let cuerpo: Blob = archivo;
  let ancho = 1600;
  let alto = 900;
  let ruta = `${fecha}/${base}-${sufijo}.${archivo.name.split('.').pop()}`;
  if (!esVideo) {
    ({ blob: cuerpo, ancho, alto } = await optimizar(archivo));
    ruta = `${fecha}/${base}-${sufijo}.webp`;
  }
  const { error } = await sb().storage.from('noticias').upload(ruta, cuerpo, { cacheControl: '31536000', contentType: esVideo ? archivo.type : 'image/webp' });
  if (error) throw new Error(error.message);
  return { src: sb().storage.from('noticias').getPublicUrl(ruta).data.publicUrl, ancho, alto, tipo: esVideo ? 'video' : 'imagen' };
}

// Pide al servidor que regenere las páginas afectadas para que la publicación se vea al instante.
export async function revalidar(slug: string): Promise<void> {
  const { data } = await sb().auth.getSession();
  await fetch('/api/prensa/revalidar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token ?? ''}` },
    body: JSON.stringify({ slug }),
  });
}
