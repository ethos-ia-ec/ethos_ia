#!/bin/sh
# Carga el inventario privado (activos, controles, hallazgos) si existe en ./db/privado.
# Esa carpeta está ignorada por Git: el repositorio es público y esos datos son de uso interno.
set -e
for f in /privado/*.sql; do
  [ -f "$f" ] || continue
  echo "secmon: cargando $f"
  psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$f"
done
