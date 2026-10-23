# Ethos SecMon · monitoreo de seguridad del sitio de Ethos IA

Sistema interno de ETHOSLAB S.A.S. para vigilar la seguridad de www.ethosia.tech. Una base de datos
PostgreSQL local, dentro de Docker, guarda el inventario de activos, los controles, los hallazgos y el
historial de chequeos automáticos. Un colector mide el sitio cada 30 minutos y envía un resumen firmado
al panel interno del sitio (`/seguridad`, solo Gerencia).

El modelo de datos y los chequeos salen de las evidencias de prácticas del área de ciberseguridad:
inventario de 17 activos (P03), 12 controles y 11 hallazgos priorizados (P04) y los lineamientos de
seguridad de base de datos (P07).

```
 colector (Node 22) ──► PostgreSQL 17 local (127.0.0.1:5433)   esquema secmon
      │   chequeos pasivos sobre www.ethosia.tech
      └──► POST /api/seguridad/reporte (HMAC) ──► Supabase seguridad_resumen ──► /seguridad (JWT gerencia)
```

## Arranque

```bash
cd seguridad
cp .env.example .env          # cambiar las claves
docker compose up -d --build
docker compose logs -f colector
```

El inventario real va en `db/privado/04_inventario.sql`, ignorado por Git (el repositorio es público).
Formato en `db/04_inventario.ejemplo.sql`. Se carga solo la primera vez que se crea el volumen; para
recargarlo: `docker compose down -v && docker compose up -d`.

## Chequeos (todos pasivos, solo sobre el dominio propio)

| Código | Qué verifica | Vigila |
|---|---|---|
| C-01 | El sitio responde 200 y tiempo de respuesta | disponibilidad |
| C-02 | HTTP redirige a HTTPS | F-01 |
| C-03, C-04 | Certificado vigente (alerta a 15 días) y TLS 1.3 | F-03 |
| C-05 | HSTS de al menos 1 año | F-01 |
| C-06 a C-09 | Framing, nosniff, Referrer/Permissions-Policy, X-Powered-By oculto | F-02, F-04 |
| C-10 | Content-Security-Policy bloqueante | H-03 |
| C-11 | Sin `Access-Control-Allow-Origin: *` | H-07 |
| C-12, C-13 | SPF y DMARC publicados | H-04 |
| C-14 | La política de privacidad identifica a ETHOSLAB S.A.S. | H-02 |
| C-15 | Las API rechazan métodos no permitidos (405) | F-04 |

No hace escaneos de puertos, fuerza bruta ni pruebas de intrusión: lee lo mismo que cualquier navegador
y las consultas DNS públicas. `sondas.js` solo acepta el dominio configurado en `SECMON_DOMINIO`.

Cuando todos los chequeos de un hallazgo pasan, el colector lo marca **Corregido**; si el problema
vuelve, lo reabre. Cada falla abre un incidente y se cierra sola cuando el chequeo vuelve a cumplir.

## Seguridad de la propia base de datos

- Esquema `secmon` con roles de mínimo privilegio: `secmon_colector` (solo inserta mediciones y cambia el
  estado de hallazgos) y `secmon_lectura` (solo consulta). Ninguno lee ni modifica la bitácora.
- Bitácora de auditoría con disparadores sobre activos, hallazgos e incidentes.
- Retención: las mediciones se purgan a los 180 días (`purgar_antiguos()`); no contienen datos personales.
- PostgreSQL solo escucha en `127.0.0.1`; el colector corre como usuario no root, con sistema de archivos
  de solo lectura y `no-new-privileges`. Las claves viven en `.env` (ignorado por Git).

## Consultas útiles

```bash
docker compose exec db psql -U secmon_admin -d secmon -c "select * from secmon.v_resumen"
docker compose exec db psql -U secmon_admin -d secmon -c "select chequeo, estado, valor from secmon.v_ultimo_resultado"
docker compose exec db psql -U secmon_admin -d secmon -c "select codigo, severidad, estado from secmon.hallazgos order by codigo"
docker compose exec db psql -U secmon_admin -d secmon -c "select tabla, operacion, clave, usuario, fecha from secmon.bitacora order by id desc limit 10"
```

## Panel en el sitio

1. Aplicar `supabase/migrations/0005_seguridad_monitoreo.sql` en Supabase.
2. En Vercel, definir `SECMON_INGEST_KEY` (la misma del `.env` del colector) y redesplegar.
3. Emitir un token de Gerencia: `PLATAFORMA_JWT_SECRET=... node scripts/emitir-token.js gerencia gerencia 120`.
4. Abrir `https://www.ethosia.tech/seguridad` y pegar el token.

Pruebas: `npx vitest run` (reglas de los chequeos y validación/firma del resumen).
