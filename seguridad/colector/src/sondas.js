// Sondas pasivas: hacen las mismas peticiones que un navegador (GET/HEAD) y consultas DNS públicas.
// Por diseño solo aceptan el dominio propio configurado en SECMON_DOMINIO: no sirven para escanear terceros.
const https = require('https');
const http = require('http');
const tls = require('tls');
const dns = require('dns').promises;

const TIEMPO_MAX = 10_000;
const UA = 'EthosSecMon/1.0 (+https://www.ethosia.tech; monitoreo propio)';

function pedir(mod, url, metodo = 'GET', leerCuerpo = false) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const req = mod.request(url, { method: metodo, timeout: TIEMPO_MAX, headers: { 'User-Agent': UA } }, (res) => {
      let cuerpo = '';
      res.setEncoding('utf8');
      res.on('data', (c) => { if (leerCuerpo && cuerpo.length < 400_000) cuerpo += c; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, location: res.headers.location, ms: Date.now() - t0, texto: cuerpo }));
    });
    req.on('timeout', () => req.destroy(new Error('tiempo de espera agotado')));
    req.on('error', (e) => resolve({ error: e.message }));
    req.end();
  });
}

function sondaTls(host) {
  return new Promise((resolve) => {
    const s = tls.connect({ host, port: 443, servername: host, timeout: TIEMPO_MAX, rejectUnauthorized: false }, () => {
      const cert = s.getPeerCertificate();
      resolve({ autorizado: s.authorized, motivo: s.authorizationError, protocolo: s.getProtocol(), validoHasta: new Date(cert.valid_to).toISOString(), emisor: cert.issuer && cert.issuer.O });
      s.end();
    });
    s.on('timeout', () => { s.destroy(); resolve({ error: 'tiempo de espera agotado' }); });
    s.on('error', (e) => resolve({ error: e.message }));
  });
}

async function sondaDns(dominio) {
  const txt = async (n) => { try { return (await dns.resolveTxt(n)).map((p) => p.join('')); } catch { return []; } };
  try {
    return { txt: await txt(dominio), dmarc: await txt(`_dmarc.${dominio}`) };
  } catch (e) {
    return { error: e.message };
  }
}

// dominio: p. ej. "ethosia.tech" (el sitio se sirve en www.).
async function medir(dominio, { rutaPrivacidad = '/privacidad.html', rutaApi = '/api/join' } = {}) {
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(dominio)) throw new Error('Dominio inválido');
  const host = `www.${dominio}`;
  const [httpsR, httpR, tlsR, dnsR, privR, metR] = await Promise.all([
    pedir(https, `https://${host}/`),
    pedir(http, `http://${host}/`),
    sondaTls(host),
    sondaDns(dominio),
    pedir(https, `https://${host}${rutaPrivacidad}`, 'GET', true),
    pedir(https, `https://${host}${rutaApi}`, 'GET'),
  ]);
  return { https: httpsR, http: httpR, tls: tlsR, dns: dnsR, privacidad: privR, metodos: metR };
}

module.exports = { medir };
