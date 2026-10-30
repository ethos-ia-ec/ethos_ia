#!/usr/bin/env node
// Crea un sitio nuevo a partir de este código:  npm run nuevo-sitio -- <carpeta-destino> "Nombre de la marca" dominio.com
// Copia solo lo versionado en git (sin .git, .env*, node_modules ni compilados), cambia el nombre del paquete,
// la URL del sitio y el project_id de Supabase, y deja el proyecto listo para `npm run dev`.
// El contenido de marca (textos, logos, colores en styles/tokens.css) se adapta después a mano.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const [destino, marca, dominio] = process.argv.slice(2);
if (!destino || !marca || !dominio) {
  console.log('Uso: npm run nuevo-sitio -- <carpeta-destino> "Nombre de la marca" dominio.com');
  process.exit(1);
}
const DEST = resolve(destino);
if (existsSync(DEST)) {
  console.error(`La carpeta ${DEST} ya existe: elija otra para no sobrescribir nada.`);
  process.exit(1);
}

const slug = marca.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const archivos = spawnSync('git', ['ls-files', '-z'], { cwd: RAIZ, encoding: 'utf8' }).stdout.split('\0').filter(Boolean);

for (const rel of archivos) {
  if (/^(\.env(?!\.local\.example)|supabase\/\.)/.test(rel)) continue;
  const origen = join(RAIZ, rel);
  if (!existsSync(origen)) continue;
  const fin = join(DEST, rel);
  mkdirSync(dirname(fin), { recursive: true });
  writeFileSync(fin, readFileSync(origen));
}

const reemplazar = (rel, fn) => {
  const ruta = join(DEST, rel);
  if (existsSync(ruta)) writeFileSync(ruta, fn(readFileSync(ruta, 'utf8')));
};
reemplazar('package.json', (t) => t.replace(/"name":\s*"[^"]+"/, `"name": "${slug}-web"`));
reemplazar('supabase/config.toml', (t) => t.replace(/^project_id = ".*"$/m, `project_id = "${slug}"`));
reemplazar('lib/seo.js', (t) => t.replace(/const SITE_URL = '[^']+'/, `const SITE_URL = 'https://${dominio}'`));
reemplazar('public/robots.txt', (t) => t.replaceAll('www.ethosia.tech', dominio));
reemplazar('.env.local.example', (t) => t.replace(/^NEXT_PUBLIC_SITE_URL=.*$/m, `NEXT_PUBLIC_SITE_URL=https://${dominio}`));

spawnSync('git', ['init', '-q', '-b', 'main'], { cwd: DEST });
console.log(`
✔ Sitio «${marca}» creado en ${DEST} (${archivos.length} archivos).
  Siguientes pasos:
    cd "${DEST}"
    npm run dev            → instala, levanta Supabase local y abre el sitio
  Luego adapte la marca: textos de pages/, logos de public/ y colores de styles/tokens.css.
  Revise también lib/noticias.ts (borre las notas de Ethos IA) y la página de equipo.
`);
