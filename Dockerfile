# Imagen de desarrollo/portabilidad local -- la produccion real va a Vercel (SSL,
# CDN, escalado automatico). Esta imagen sirve para que el entorno de desarrollo
# sea identico en cualquier maquina, o para probar el build de produccion
# localmente sin depender de Vercel.

# ---- deps: instala dependencias con cache de capas separado del codigo fuente ----
FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# ---- builder: compila el sitio (output standalone, ver next.config.js) ----
FROM node:26-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DOCKER_BUILD=1
RUN npm run build

# ---- runner: imagen final, solo lo necesario para correr ----
FROM node:26-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# No correr como root dentro del contenedor -- mismo patron que el Dockerfile
# del bot de WhatsApp (ethos-ia-whatsapp-bot/Dockerfile).
RUN addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static

USER app
EXPOSE 3000
CMD ["node", "server.js"]
