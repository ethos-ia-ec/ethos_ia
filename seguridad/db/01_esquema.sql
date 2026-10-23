-- Ethos SecMon · esquema de la base de datos local de monitoreo de seguridad de ETHOSLAB S.A.S.
-- Se ejecuta una sola vez, al crear el volumen de PostgreSQL (docker-entrypoint-initdb.d).
-- Modelo basado en las evidencias de prácticas del área de ciberseguridad (P03 inventario de activos,
-- P04 hallazgos, P07 lineamientos de base de datos): esquema propio, mínimo privilegio,
-- bitácora inalterable para el rol de aplicación y plazo de conservación declarado.

create schema if not exists secmon;
set search_path = secmon;

-- ── Catálogos ────────────────────────────────────────────────────────────────
create table activos (
  codigo        text primary key check (codigo ~ '^A-[0-9]{2}$'),
  nombre        text not null,
  tipo          text not null,
  proveedor     text,
  datos         text,
  clasificacion text not null check (clasificacion in ('Pública','Interna','Confidencial','Secreta')),
  responsable   text,
  verificacion  text not null default 'Por confirmar' check (verificacion in ('Verificado','Por confirmar'))
);

create table controles (
  codigo      text primary key check (codigo ~ '^F-[0-9]{2}$'),
  descripcion text not null,
  evidencia   text
);

create table hallazgos (
  codigo      text primary key check (codigo ~ '^H-[0-9]{2}$'),
  titulo      text not null,
  severidad   text not null check (severidad in ('Alta','Media','Baja','Informativa')),
  ambito      text not null,
  plazo_dias  int  not null check (plazo_dias > 0),
  estado      text not null default 'Abierto' check (estado in ('Abierto','En corrección','Corregido','Aceptado')),
  detectado   date not null default current_date,
  corregido   timestamptz,
  activo      text references activos(codigo)
);

-- Chequeos automáticos y pasivos (solo sobre el dominio propio). Cada uno vigila un control o un hallazgo.
create table chequeos (
  codigo      text primary key check (codigo ~ '^C-[0-9]{2}$'),
  nombre      text not null,
  categoria   text not null check (categoria in ('Disponibilidad','TLS','Cabeceras','DNS','Cumplimiento')),
  control     text references controles(codigo),
  hallazgo    text references hallazgos(codigo),
  activo      text references activos(codigo),
  habilitado  boolean not null default true
);

-- ── Series de tiempo ─────────────────────────────────────────────────────────
create table ejecuciones (
  id          bigint generated always as identity primary key,
  objetivo    text not null,
  inicio      timestamptz not null default now(),
  fin         timestamptz,
  aprobados   int not null default 0,
  fallidos    int not null default 0
);

create table resultados (
  id          bigint generated always as identity primary key,
  ejecucion   bigint not null references ejecuciones(id) on delete cascade,
  chequeo     text not null references chequeos(codigo),
  estado      text not null check (estado in ('ok','alerta','falla','error')),
  valor       text,
  detalle     text,
  medido_en   timestamptz not null default now()
);
create index resultados_chequeo_fecha on resultados (chequeo, medido_en desc);

create table incidentes (
  id          bigint generated always as identity primary key,
  chequeo     text not null references chequeos(codigo),
  abierto_en  timestamptz not null default now(),
  cerrado_en  timestamptz,
  severidad   text not null check (severidad in ('Alta','Media','Baja')),
  descripcion text not null
);
create unique index un_incidente_abierto on incidentes (chequeo) where cerrado_en is null;

-- ── Bitácora inalterable (auditoría de cambios en datos críticos) ───────────
create table bitacora (
  id        bigint generated always as identity primary key,
  tabla     text not null,
  operacion text not null,
  clave     text,
  antes     jsonb,
  despues   jsonb,
  usuario   text not null default session_user,
  fecha     timestamptz not null default now()
);

create or replace function registrar_cambio() returns trigger
language plpgsql security definer set search_path = secmon as $$
begin
  insert into bitacora (tabla, operacion, clave, antes, despues, usuario)
  values (tg_table_name, tg_op,
          coalesce(to_jsonb(new)->>'codigo', to_jsonb(old)->>'codigo', to_jsonb(new)->>'id', to_jsonb(old)->>'id'),
          case when tg_op <> 'INSERT' then to_jsonb(old) end,
          case when tg_op <> 'DELETE' then to_jsonb(new) end,
          session_user);
  return coalesce(new, old);
end $$;

create trigger aud_hallazgos  after insert or update or delete on hallazgos  for each row execute function registrar_cambio();
create trigger aud_activos    after insert or update or delete on activos    for each row execute function registrar_cambio();
create trigger aud_incidentes after insert or update or delete on incidentes for each row execute function registrar_cambio();

-- ── Vistas para el panel ─────────────────────────────────────────────────────
create view v_ultimo_resultado as
select distinct on (r.chequeo) r.chequeo, c.nombre, c.categoria, c.control, c.hallazgo,
       r.estado, r.valor, r.detalle, r.medido_en
from resultados r join chequeos c on c.codigo = r.chequeo
order by r.chequeo, r.medido_en desc;

create view v_resumen as
select
  (select count(*) from activos)                                               as activos,
  (select count(*) from controles)                                             as controles,
  (select count(*) from hallazgos where estado in ('Abierto','En corrección')) as hallazgos_abiertos,
  (select count(*) from hallazgos where estado = 'Corregido')                  as hallazgos_corregidos,
  (select count(*) from v_ultimo_resultado where estado = 'ok')                as chequeos_ok,
  (select count(*) from v_ultimo_resultado where estado <> 'ok')               as chequeos_con_alerta,
  (select count(*) from incidentes where cerrado_en is null)                   as incidentes_abiertos,
  (select max(fin) from ejecuciones)                                           as ultima_ejecucion;

-- Disponibilidad y tiempo de respuesta de los últimos 30 días (chequeo C-01, valor en ms).
create view v_disponibilidad_30d as
select round(100.0 * count(*) filter (where estado = 'ok') / nullif(count(*), 0), 2) as porcentaje,
       round(avg(nullif(regexp_replace(valor, '[^0-9]', '', 'g'), '')::numeric))   as ms_promedio,
       count(*)                                                                    as mediciones
from resultados where chequeo = 'C-01' and medido_en > now() - interval '30 days';

-- ── Retención: los resultados no contienen datos personales; se conservan 180 días ──
create or replace function purgar_antiguos() returns int
language sql security definer set search_path = secmon as $$
  with b as (delete from ejecuciones where inicio < now() - interval '180 days' returning 1)
  select count(*)::int from b
$$;

-- ── Roles con mínimo privilegio ──────────────────────────────────────────────
-- secmon_colector: registra ejecuciones, resultados e incidentes y solo cambia el estado de los hallazgos.
-- secmon_lectura: solo consulta. Ninguno de los dos puede modificar ni leer la bitácora.
do $$ begin
  if not exists (select from pg_roles where rolname = 'secmon_colector') then create role secmon_colector login; end if;
  if not exists (select from pg_roles where rolname = 'secmon_lectura')  then create role secmon_lectura  login; end if;
end $$;

revoke all on all tables in schema secmon from public;
revoke all on function registrar_cambio(), purgar_antiguos() from public;
grant usage on schema secmon to secmon_colector, secmon_lectura;
grant select on activos, controles, hallazgos, chequeos, ejecuciones, resultados, incidentes,
               v_ultimo_resultado, v_resumen, v_disponibilidad_30d to secmon_lectura, secmon_colector;
grant insert, update on ejecuciones, incidentes to secmon_colector;
grant insert on resultados to secmon_colector;
grant update (estado, corregido) on hallazgos to secmon_colector;
grant execute on function purgar_antiguos() to secmon_colector;
grant usage on all sequences in schema secmon to secmon_colector;
alter role secmon_colector set search_path = secmon;
alter role secmon_lectura  set search_path = secmon;
