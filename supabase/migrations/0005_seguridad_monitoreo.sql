-- Panel de seguridad (Ethos SecMon): último resumen enviado por el colector local.
-- Aplicar en el SQL Editor de Supabase, o vía `supabase db push`. Se puede volver a ejecutar.
-- El resumen no contiene datos personales ni secretos: estados de chequeos, conteos y hallazgos.

create table if not exists public.seguridad_resumen (
  id          bigint generated always as identity primary key,
  dominio     text not null,
  generado    timestamptz not null,
  recibido    timestamptz not null default now(),
  datos       jsonb not null
);

create index if not exists seguridad_resumen_recibido on public.seguridad_resumen (recibido desc);

alter table public.seguridad_resumen enable row level security;
-- Sin políticas públicas: solo el servidor (service_role) lee y escribe, desde
-- pages/api/seguridad/*. Mismo criterio de mínimo privilegio que rate_limits.
revoke all on public.seguridad_resumen from anon, authenticated;
