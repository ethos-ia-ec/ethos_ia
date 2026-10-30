#!/usr/bin/env node
// Arranque con un solo comando del sitio de Ethos IA:  npm run dev
//
//   1. Verifica Node e instala dependencias si faltan o cambió package-lock.json.
//   2. Crea .env.local desde .env.local.example si no existe.
//   3. Base de datos:
//        · local (por defecto): abre Docker, levanta Supabase local (Postgres, Auth, Storage y correo de prueba),
//          aplica todas las migraciones, carga las noticias y crea un admin de demostración para /prensa.
//        · nube (--nube): usa el proyecto de Supabase de .env.local, sin tocarlo.
//   4. Busca un puerto libre desde el 3000, levanta Next.js y abre el navegador (--sin-navegador lo evita).
//
// Solo usa módulos nativos de Node: no necesita nada instalado antes.
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { copyFileSync, existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const WINDOWS = process.platform === 'win32';
const ARGS = process.argv.slice(2);
const NUBE = ARGS.includes('--nube');
const ENV = join(RAIZ, '.env.local');
const ENV_LOCAL_DEV = join(RAIZ, '.env.development.local'); // claves de Supabase local; Next la prioriza en dev
const DEMO = join(RAIZ, 'supabase', '.admin-demo.local.json');
const DEMO_CORREO = 'admin@ethos.local';

const paso = (t) => console.log(`\n\x1b[36m▸ ${t}\x1b[0m`);
const aviso = (t) => console.log(`\x1b[33m! ${t}\x1b[0m`);
const fallar = (t) => {
  console.error(`\n\x1b[31m✖ ${t}\x1b[0m`);
  process.exit(1);
};
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
// npm y npx son .cmd en Windows: se ejecutan con shell y una sola línea (sin argumentos sueltos, ver DEP0190).
const npx = (linea, opciones = {}) => spawnSync(`npx --yes ${linea}`, { cwd: RAIZ, shell: true, encoding: 'utf8', ...opciones });

// ── 1. Node y dependencias ──────────────────────────────────────────────────
paso('Verificando Node y dependencias ...');
if (Number(process.versions.node.split('.')[0]) < 20) fallar(`Se necesita Node 20 o superior (tiene ${process.versions.node}). Descárguelo de https://nodejs.org`);
const marca = join(RAIZ, 'node_modules', '.package-lock.json');
if (!existsSync(marca) || statSync(join(RAIZ, 'package-lock.json')).mtimeMs > statSync(marca).mtimeMs) {
  console.log('  Instalando dependencias (npm ci) ...');
  if (spawnSync('npm ci --no-audit --no-fund', { cwd: RAIZ, shell: true, stdio: 'inherit' }).status !== 0) fallar('No se pudieron instalar las dependencias.');
} else console.log('  Dependencias al día.');

// ── 2. .env.local ───────────────────────────────────────────────────────────
if (!existsSync(ENV)) {
  copyFileSync(join(RAIZ, '.env.local.example'), ENV);
  aviso('Se creó .env.local desde .env.local.example. Complete las claves de servicios externos si las necesita.');
}
const leerEnv = (ruta) => {
  const v = {};
  if (!existsSync(ruta)) return v;
  for (const l of readFileSync(ruta, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=(.*)$/);
    if (m) v[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return v;
};

// ── 3. Supabase ─────────────────────────────────────────────────────────────
function docker(args) {
  const r = spawnSync('docker', args, { encoding: 'utf8' });
  return r.status === 0;
}

async function asegurarDocker() {
  if (!docker(['--version'])) {
    if (!WINDOWS) return false;
    aviso('Docker no está instalado: se instalará Docker Desktop con winget (pedirá permiso de administrador).');
    const r = spawnSync('winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements', { shell: true, stdio: 'inherit' });
    if (r.status !== 0) return false;
    aviso('Docker Desktop quedó instalado. Si Windows pide reiniciar, reinicie y vuelva a ejecutar: npm run dev');
    process.env.PATH += ';C:\\Program Files\\Docker\\Docker\\resources\\bin';
  }
  if (docker(['info'])) return true;
  const exe = 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe';
  if (WINDOWS && existsSync(exe)) {
    console.log('  Iniciando Docker Desktop (puede tardar hasta 3 minutos) ...');
    spawnSync(`start "" "${exe}"`, { shell: true });
  }
  for (let i = 0; i < 60; i++) {
    await esperar(3000);
    if (docker(['info'])) return true;
  }
  return false;
}

async function supabaseLocal() {
  paso('Levantando Supabase local (la primera vez descarga las imágenes; puede tardar varios minutos) ...');
  const inicio = npx('supabase start', { stdio: 'inherit' });
  if (inicio.status !== 0) fallar('Supabase local no arrancó. Revise que Docker Desktop esté en marcha y repita: npm run dev');
  const estado = npx('supabase status -o env');
  const s = {};
  for (const l of (estado.stdout ?? '').split(/\r?\n/)) {
    const m = l.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (m) s[m[1]] = m[2];
  }
  const url = s.API_URL;
  const anon = s.PUBLISHABLE_KEY || s.ANON_KEY;
  const servicio = s.SECRET_KEY || s.SERVICE_ROLE_KEY;
  if (!url || !anon || !servicio) fallar('No se pudieron leer las claves de Supabase local (npx supabase status).');
  const claves = {
    NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
    SUPABASE_URL: url, SUPABASE_ANON_KEY: anon, SUPABASE_SERVICE_ROLE_KEY: servicio,
  };
  writeFileSync(ENV_LOCAL_DEV, `# Generado por npm run dev: Supabase LOCAL. Se borra con npm run dev -- --nube.\n${Object.entries(claves).map(([k, v]) => `${k}=${v}`).join('\n')}\n`);
  return { ...claves, studio: s.STUDIO_URL, correo: s.INBUCKET_URL || s.MAILPIT_URL };
}

// Llamadas REST mínimas a Supabase con la clave de servicio (sin dependencias).
async function rest(c, ruta, { metodo = 'GET', cuerpo, prefer } = {}) {
  const r = await fetch(`${c.SUPABASE_URL}${ruta}`, {
    method: metodo,
    headers: { apikey: c.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${c.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}) },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const texto = await r.text();
  return { ok: r.ok, estado: r.status, datos: texto ? JSON.parse(texto) : null };
}

async function sembrar(c) {
  paso('Preparando datos de demostración ...');
  const notas = await rest(c, '/rest/v1/noticias?select=id&limit=1');
  if (notas.ok && notas.datos.length === 0) {
    const r = npx('tsx scripts/semilla-noticias.ts', { stdio: 'inherit', env: { ...process.env, SUPABASE_URL: c.SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: c.SUPABASE_SERVICE_ROLE_KEY } });
    if (r.status !== 0) aviso('No se pudieron cargar las noticias de ejemplo.');
  } else console.log('  La base ya tiene noticias: no se tocan.');

  if (existsSync(DEMO)) {
    console.log('  Admin de demostración ya creado.');
    return JSON.parse(readFileSync(DEMO, 'utf8'));
  }
  const clave = `Ethos-${randomBytes(9).toString('base64url')}`;
  const u = await rest(c, '/auth/v1/admin/users', { metodo: 'POST', cuerpo: { email: DEMO_CORREO, password: clave, email_confirm: true, user_metadata: { full_name: 'Admin de demostración' } } });
  if (!u.ok) {
    aviso(`No se pudo crear el admin de demostración (${u.estado}). Puede crearlo desde Supabase Studio.`);
    return null;
  }
  await rest(c, `/rest/v1/miembros?user_id=eq.${u.datos.id}`, { metodo: 'PATCH', cuerpo: { rol: 'admin' }, prefer: 'return=minimal' });
  const demo = { correo: DEMO_CORREO, clave };
  writeFileSync(DEMO, JSON.stringify(demo, null, 2));
  return demo;
}

// ── 4. Puerto libre y Next.js ───────────────────────────────────────────────
function libre(puerto) {
  return new Promise((ok) => {
    const s = createServer();
    s.once('error', () => ok(false));
    s.once('listening', () => s.close(() => ok(true)));
    s.listen(puerto, '0.0.0.0');
  });
}
async function siguienteLibre(desde) {
  for (let p = desde; p < desde + 50; p++) if (await libre(p)) return p;
  fallar(`No hay puertos libres desde ${desde}.`);
}

let local = null;
let demo = null;
if (NUBE) {
  paso('Modo nube: se usa el proyecto de Supabase de .env.local.');
  if (existsSync(ENV_LOCAL_DEV)) writeFileSync(ENV_LOCAL_DEV, '# Modo nube: sin claves locales.\n');
  if (!leerEnv(ENV).NEXT_PUBLIC_SUPABASE_URL && !leerEnv(ENV).SUPABASE_URL) aviso('.env.local no tiene SUPABASE_URL: el sitio usará solo las noticias del código.');
} else {
  paso('Verificando Docker ...');
  if (await asegurarDocker()) {
    local = await supabaseLocal();
    demo = await sembrar(local);
  } else {
    aviso('Docker no está disponible: se continúa con la configuración de .env.local (modo nube).');
  }
}

const puerto = await siguienteLibre(Number(process.env.PORT) || 3000);
if (puerto !== 3000) aviso(`El puerto 3000 está ocupado: se usará el ${puerto}.`);
const web = `http://localhost:${puerto}`;

paso('Iniciando el sitio ...');
const next = spawn(`npx next dev -p ${puerto}`, { cwd: RAIZ, shell: true, stdio: 'inherit' });
next.on('exit', (codigo) => process.exit(codigo ?? 0));

for (let i = 0; i < 120; i++) {
  await esperar(1000);
  try {
    if ((await fetch(web)).status < 500) break;
  } catch { /* aún arrancando */ }
}

console.log(`
\x1b[32m✔ Sitio de Ethos IA en marcha\x1b[0m
  Sitio ................. ${web}
  Ethos Prensa .......... ${web}/prensa${demo ? `  (${demo.correo} · clave en supabase/.admin-demo.local.json)` : ''}${local ? `
  Supabase Studio ....... ${local.studio}
  Correos de prueba ..... ${local.correo}` : ''}
  Base de datos ......... ${local ? 'Supabase LOCAL (Docker)' : 'Supabase de .env.local (nube)'}
  Detener: Ctrl+C y luego npm run stop (conserva los datos)
`);
if (!ARGS.includes('--sin-navegador')) spawnSync(WINDOWS ? `start "" "${web}"` : `xdg-open ${web}`, { shell: true });
