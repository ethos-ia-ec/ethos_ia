#!/bin/sh
# Asigna las contraseñas de los roles desde variables de entorno (nunca en el repositorio).
set -e
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -v colector="$SECMON_COLECTOR_CLAVE" -v lectura="$SECMON_LECTURA_CLAVE" <<'SQL'
alter role secmon_colector password :'colector';
alter role secmon_lectura  password :'lectura';
SQL
