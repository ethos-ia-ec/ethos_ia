<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/empresa/banner-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="public/empresa/banner-light.png">
  <img alt="Ethos IA — Software · Inteligencia Artificial · Auditoría" src="public/empresa/banner-light.png" width="620">
</picture>

<br>

**Sitio web corporativo de Ethos IA**, la firma de inteligencia artificial ética y responsable de **ETHOSLAB S.A.S.** — Cuenca, Ecuador.

<br>

[![CI](https://github.com/ethos-ia-ec/ethos_ia/actions/workflows/ci.yml/badge.svg)](https://github.com/ethos-ia-ec/ethos_ia/actions/workflows/ci.yml)
[![Sitio](https://img.shields.io/badge/ethosia.tech-04EBFF?style=flat-square&logoColor=white&labelColor=05111E)](https://www.ethosia.tech)
[![Next.js](https://img.shields.io/badge/Next.js-16-05111E?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-05111E?style=flat-square&logo=react&logoColor=04EBFF)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-05111E?style=flat-square&logo=supabase&logoColor=3ECF8E)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-05111E?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

<a href="https://www.ethosia.tech"><b>Ver el sitio en vivo →</b></a>

</div>

<br>

---

## Sobre el proyecto

Este repositorio contiene la web corporativa de Ethos IA: la cara pública de la empresa y su canal principal de contacto comercial. No es una plantilla ni una demo — es el sitio que está en producción en [ethosia.tech](https://www.ethosia.tech).

Incluye la landing institucional, la página de equipo, un asistente conversacional con IA y el formulario de captación que escribe en Supabase.

## Características

| | |
|---|---|
| **Landing corporativa** | Propuesta de valor, líneas de servicio, trayectoria y proceso de trabajo |
| **Asistente con IA** | Chat integrado que responde consultas sobre la empresa y sus servicios |
| **Captación de leads** | Formulario validado con Zod que persiste en Supabase |
| **Multiproveedor de IA** | Cadena de respaldo entre Groq, OpenRouter y NVIDIA con cuota diaria por proveedor |
| **Seguridad por defecto** | CSP, cabeceras de seguridad, rate limiting y autenticación interna por API key |
| **Accesibilidad** | Contraste verificado contra WCAG AA y estructura semántica en español |

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (Pages Router) · React 19 · Turbopack |
| Datos | Supabase (PostgreSQL) con migraciones versionadas |
| Validación | Zod |
| Tipografía | Sora, autohospedada con `next/font` |
| Calidad | ESLint · Vitest · GitHub Actions |
| Infraestructura | Vercel · Docker |

## Inicio rápido

**Requisitos:** Node.js 22 o superior.

```bash
git clone https://github.com/ethos-ia-ec/ethos_ia.git
cd ethos_ia
npm install
```

Copia la plantilla de variables de entorno y complétala:

```bash
cp .env.local.example .env.local
```

| Variable | Para qué sirve |
|---|---|
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Conexión a la base de datos |
| `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `NVIDIA_API_KEY` | Proveedores del asistente de IA |
| `GROQ_DAILY_LIMIT`, `OPENROUTER_DAILY_LIMIT`, `NVIDIA_DAILY_LIMIT` | Tope diario de peticiones por proveedor |
| `INTERNAL_API_KEY` | Autenticación de endpoints internos |
| `NEXT_PUBLIC_SITE_URL` | URL canónica del sitio |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Analítica (opcional) |
| `ALERT_WEBHOOK_URL` | Notificaciones de alertas (opcional) |

Levanta el entorno de desarrollo:

```bash
npm run dev
```

El sitio queda en `http://localhost:3000`.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con Turbopack |
| `npm run build` | Compilación de producción |
| `npm start` | Sirve la compilación de producción |
| `npm run lint` | Análisis estático con ESLint |
| `npm test` | Suite de pruebas con Vitest |

## Estructura

```text
├── pages/
│   ├── index.js            Landing corporativa
│   ├── equipo.js           Perfiles directivos y equipo
│   ├── _app.js             Tipografía global (Sora)
│   ├── _document.js        Documento HTML, favicon, idioma
│   └── api/
│       ├── empresa-chat.js Asistente con IA
│       └── join.js         Recepción de formularios
├── components/
│   └── ChatWidget.js       Interfaz del asistente
├── lib/
│   ├── ai/complete.js      Orquestación multiproveedor
│   ├── rateLimit.js        Control de abuso
│   └── internalAuth.js     Autenticación interna
├── supabase/migrations/    Esquema versionado
└── public/empresa/         Identidad visual y recursos
```

## API

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/empresa-chat` | `POST` | Consulta al asistente. Aplica rate limiting y cuota diaria por proveedor. |
| `/api/join` | `POST` | Recibe el formulario de contacto, lo valida con Zod y lo persiste en Supabase. |

### Orquestación de IA

`lib/ai/complete.js` recorre los proveedores en cadena y cae al siguiente cuando uno agota su cuota diaria o falla:

1. **Groq** — `openai/gpt-oss-20b`
2. **OpenRouter** — enrutador automático entre modelos gratuitos disponibles
3. **NVIDIA** — `meta/llama-3.1-8b-instruct`

Cada proveedor lleva su propio contador diario, persistido en Supabase, de modo que el respaldo no duplica el consumo de cuota.

## Seguridad

- Cabeceras `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y HSTS.
- Content Security Policy en modo `report-only`, restringida a recursos propios.
- Rate limiting por IP sobre los endpoints de IA y formularios.
- Credenciales fuera del control de versiones: `.env*` está ignorado salvo la plantilla de ejemplo.

## Despliegue

El sitio está en producción en **Vercel**, desplegado desde la rama `main`. En paralelo, cada push y cada pull request ejecutan el flujo de CI en GitHub Actions (`lint`, `test`, `build`).

También se puede levantar con Docker:

```bash
docker compose build
docker compose up
```

## Créditos

La identidad visual y el logotipo de Ethos IA fueron ideados, diseñados y creados por **William Alejandro Toscano Pérez**, Licenciado en Multimedia y Producción Audiovisual por la Universidad Estatal de Milagro.

El equipo detrás del proyecto está en [ethosia.tech/equipo](https://www.ethosia.tech/equipo).

## Contacto

- **Sitio** — [ethosia.tech](https://www.ethosia.tech)
- **Correo** — ethos.ia.ec@gmail.com
- **WhatsApp** — [+593 98 602 3149](https://wa.me/593986023149)
- **Redes** — [Facebook](https://www.facebook.com/profile.php?id=61593810909958) · [Instagram](https://www.instagram.com/ethos.ia.ec/) · [TikTok](https://www.tiktok.com/@ethos_ia_ec) · [X](https://x.com/Ethos_IA_EC) · [YouTube](https://www.youtube.com/@EthosIA-ec)
- **Organización** — [github.com/ethos-ia-ec](https://github.com/ethos-ia-ec)

---

<div align="center">
<sub>© 2026 ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador. Todos los derechos reservados.</sub>
</div>

## Ethos Ingeniería (`/plataforma`) y perfil técnico (`/equipo/marlon-perez`)

Aplicación aparte, enlazada desde la página de equipo, que muestra los laboratorios, el kit DevSecOps y el programa de prácticas de la empresa. Está escrita en TypeScript y consume su propia API REST.

| Pieza | Archivo |
|---|---|
| Interfaz React (pestañas, estados de carga y error, registro de riesgos) | `pages/plataforma/index.tsx` |
| Datos tipados y cálculo de riesgo (probabilidad × impacto) | `lib/plataforma/datos.ts` |
| JWT HS256 con `crypto` (firma, vencimiento, rol, rechazo de `alg: none`) | `lib/plataforma/jwt.ts` |
| Autorización por rol en rutas | `lib/plataforma/api.ts` |
| `GET /api/plataforma/resumen` (público, con límite de solicitudes) | `pages/api/plataforma/resumen.ts` |
| `GET /api/plataforma/programa` (JWT, rol `gerencia` o `tutoria`) | `pages/api/plataforma/programa.ts` |
| Pruebas | `lib/plataforma/jwt.test.ts`, `pages/api/plataforma/plataforma.test.js` |
| Perfil profesional con tabla «requisito ↔ evidencia» | `pages/equipo/marlon-perez.tsx` |

Respuestas de la API protegida: `401` token ausente, inválido o vencido; `403` rol sin permiso; `503` si `PLATAFORMA_JWT_SECRET` no está configurado.

```bash
PLATAFORMA_JWT_SECRET=<secreto> node scripts/emitir-token.js tutora tutoria 60
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/plataforma/programa
```

### Servicios y compuerta del pipeline

La pestaña «Servicios» de `/plataforma` publica cinco servicios reutilizables (`SERVICIOS` en `lib/plataforma/datos.ts`) con su estado real: «Catálogo» o «Demo en el navegador». Ninguno se marca «En línea» mientras no exista un servidor que lo ejecute.

La **compuerta de dependencias** (`lib/plataforma/compuerta.ts`, componente `components/plataforma/Compuerta.tsx`) aplica los umbrales de `politicas/umbrales.yml` del Ethos DevOps Kit a la salida de `npm audit --json`: bloquea críticas y altas, asigna plazos de remediación (7, 30, 90 y 180 días) y respeta excepciones vigentes. Se ejecuta en el navegador; el JSON pegado no se envía a ningún servidor. Pruebas: `lib/plataforma/compuerta.test.ts`.

### Paneles de los laboratorios

La pestaña «Paneles» de `/plataforma` muestra 30 capturas reales de las interfaces de los laboratorios Docker (GLPI, seguridad del sitio y red segmentada) en un visor accesible (Esc y flechas), y una tabla filtrable con las 16 pruebas reales de la red segmentada (`lib/plataforma/matriz.ts`).

- Las imágenes se generan con `python scripts/preparar-paneles.py` (WebP en `public/paneles/`); los PNG originales no se tocan.
- `Lab_C06` y `Lab_C09` se excluyen a propósito: muestran vulnerabilidades abiertas del sitio en producción. Una prueba (`matriz.test.ts`) impide que se agreguen.

### Demostración en vivo (opcional)

`GET /api/plataforma/estado` consulta, con límite de tiempo, la URL de `PLATAFORMA_DEMO_URL` (debe ser HTTPS). Si responde, `DemoEnVivo` muestra «Demostración en vivo disponible» con el botón de acceso; si no, muestra el aviso de no disponible y las capturas siguen visibles. `PLATAFORMA_DEMO_USUARIO` y `PLATAFORMA_DEMO_CLAVE` son una credencial **pública** de solo lectura; nunca la del administrador. La guía de puesta en marcha está en `Laboratorios Docker Ethos IA/demo-en-vivo/GUIA_PUESTA_EN_MARCHA.md`.

### Visualizaciones y acceso desde la portada

- La portada tiene la sección «Ethos Ingeniería» (`#ingenieria`), el enlace «Ingeniería» en el menú y un botón en el hero. Las tarjetas abren `/plataforma?pestana=paneles|devops|servicios`.
- Laboratorios: topología interactiva (`TopologiaRed.tsx`) con las 16 pruebas reales. DevOps Kit: pipeline de diez compuertas (`PipelineInteractivo.tsx`), diagramas y vista previa de los ocho documentos. Programa: etapas y árbol de la carpeta de evidencias (`ArbolEvidencias.tsx`), sin datos de personas. Datos en `lib/plataforma/visual.ts`.

- Servicios: fichas con vista previa real, comando copiable y acceso a los paneles (`FichaServicio.tsx`). Riesgos: mapa de calor de probabilidad × impacto con detalle por riesgo (`MapaRiesgos.tsx`). API: probador interactivo con estado, tiempo y JSON, y colección de Postman descargable (`ApiPlayground.tsx`, `public/plataforma.postman_collection.json`).
