// Copia las notas de lib/noticias.ts a la tabla `noticias` para poder editarlas desde /prensa.
// Uso (una sola vez, después de aplicar la migración 0005):  npx tsx scripts/semilla-noticias.ts
// Requiere SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno. Si el slug ya existe, no lo toca.
import { createClient } from '@supabase/supabase-js';
import { NOTICIAS } from '../lib/noticias';

const url = process.env.SUPABASE_URL;
const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !clave) {
  console.error('Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}
const sb = createClient(url, clave, { auth: { persistSession: false } });

async function main() {
  for (const n of NOTICIAS) {
    const { error } = await sb.from('noticias').upsert(
      {
        slug: n.slug, titulo: n.titulo, resumen: n.resumen, categoria: n.categoria, cuerpo: n.cuerpo, fuentes: n.fuentes,
        imagen: n.imagen, imagen_social: n.imagenSocial ?? null, estado: 'publicada',
        publicada_en: `${n.fecha}T11:00:00-05:00`, autor_nombre: n.autor ?? 'Redacción Ethos IA',
      },
      { onConflict: 'slug', ignoreDuplicates: true },
    );
    console.log(error ? `✗ ${n.slug}: ${error.message}` : `✓ ${n.slug}`);
  }
}

main();
