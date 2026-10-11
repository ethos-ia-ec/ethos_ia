// Emite un JWT interno de Ethos Ingeniería.
// Uso:  PLATAFORMA_JWT_SECRET=... node scripts/emitir-token.js <sub> <gerencia|tutoria|lectura> [minutos]
// El secreto se toma del entorno; nunca se escribe en el repositorio.
const crypto = require('crypto');

const [sub, rol, minutos = '60'] = process.argv.slice(2);
const secreto = process.env.PLATAFORMA_JWT_SECRET;
if (!secreto || !sub || !['gerencia', 'tutoria', 'lectura'].includes(rol)) {
  console.error('Uso: PLATAFORMA_JWT_SECRET=... node scripts/emitir-token.js <sub> <gerencia|tutoria|lectura> [minutos]');
  process.exit(1);
}
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const iat = Math.floor(Date.now() / 1000);
const cuerpo = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub, rol, iat, exp: iat + Number(minutos) * 60 })}`;
console.log(`${cuerpo}.${crypto.createHmac('sha256', secreto).update(cuerpo).digest('base64url')}`);
