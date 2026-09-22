// CSP en modo "report-only": el navegador evalúa la política y reporta
// violaciones en la consola sin bloquear nada todavía. Antes de pasarla a
// Content-Security-Policy (bloqueante) hay que navegar el sitio completo con
// las devtools abiertas y confirmar que no aparece ningún warning de CSP --
// Next.js a veces necesita 'unsafe-inline' en script-src para su script de
// hidratación según la versión/configuración, así que se arranca permisivo
// ahí y se endurece después de verificar en la práctica.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  // Build liviano para contenedores (ver Dockerfile). Solo se activa cuando el
  // propio Dockerfile define DOCKER_BUILD=1 -- activarlo siempre rompe el build
  // en Vercel (el tracing de archivos de Vercel no es compatible con "standalone").
  ...(process.env.DOCKER_BUILD === '1' ? { output: 'standalone' } : {}),

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy-Report-Only', value: CSP },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
