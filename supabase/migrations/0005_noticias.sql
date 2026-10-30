-- Ethos Prensa — sala de redacción de Ethos Noticias
-- Flujo editorial (borrador → revisión → publicada / programada → archivada), versiones, medios y roles.
-- Aplicar primero en un proyecto de prueba y después en producción, desde el SQL Editor o con `supabase db push`.

-- ─────────────────────────────────────────────────────────────
-- Roles: se agrega «redactor» a los de public.miembros (0001)
-- ─────────────────────────────────────────────────────────────
alter table public.miembros drop constraint if exists miembros_rol_check;
alter table public.miembros
  add constraint miembros_rol_check check (rol in ('miembro', 'redactor', 'editor', 'admin'));

create or replace function public.rol_prensa()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select rol from public.miembros where user_id = auth.uid() and rol in ('redactor', 'editor', 'admin');
$$;

-- ─────────────────────────────────────────────────────────────
-- Noticias
-- ─────────────────────────────────────────────────────────────
create table if not exists public.noticias (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 120),
  titulo text not null check (length(titulo) between 10 and 140),
  resumen text not null check (length(resumen) between 30 and 300),
  categoria text not null default 'Comunidad' check (categoria in ('Medios', 'Comunidad', 'Producto', 'Equipo')),
  etiquetas text[] not null default '{}',
  cuerpo jsonb not null default '[]'::jsonb check (jsonb_typeof(cuerpo) = 'array'),
  fuentes jsonb not null default '[]'::jsonb check (jsonb_typeof(fuentes) = 'array'),
  imagen jsonb,          -- { src, alt, credito, ancho, alto }
  imagen_social text,
  destacada boolean not null default false,
  estado text not null default 'borrador'
    check (estado in ('borrador', 'revision', 'publicada', 'archivada')),
  publicada_en timestamptz,          -- fecha visible; si es futura, la nota queda programada
  autor_id uuid references auth.users(id) on delete set null,
  autor_nombre text,
  editor_id uuid references auth.users(id) on delete set null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists noticias_publicas_idx on public.noticias (publicada_en desc) where estado = 'publicada';

alter table public.noticias enable row level security;

-- Público: solo publicadas cuya fecha ya llegó.
create policy "noticias_select_publico" on public.noticias
  for select using (estado = 'publicada' and publicada_en <= now());

-- Redacción: el redactor ve las suyas; editor y admin ven todo.
create policy "noticias_select_prensa" on public.noticias
  for select using (public.rol_prensa() in ('editor', 'admin') or (public.rol_prensa() = 'redactor' and autor_id = auth.uid()));

create policy "noticias_insert_prensa" on public.noticias
  for insert with check (public.rol_prensa() is not null and autor_id = auth.uid());

create policy "noticias_update_prensa" on public.noticias
  for update
  using (public.rol_prensa() in ('editor', 'admin') or (public.rol_prensa() = 'redactor' and autor_id = auth.uid() and estado in ('borrador', 'revision')))
  with check (public.rol_prensa() in ('editor', 'admin') or (public.rol_prensa() = 'redactor' and autor_id = auth.uid()));

-- Borrado definitivo: solo admin. «Borrar» en el panel archiva.
create policy "noticias_delete_admin" on public.noticias
  for delete using (public.rol_prensa() = 'admin');

-- El redactor no puede publicar ni archivar: solo borrador o revisión.
create or replace function public.noticias_controlar_estado()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.actualizado_en := now();
  if public.rol_prensa() = 'redactor' and new.estado not in ('borrador', 'revision') then
    raise exception 'Solo un editor puede publicar o archivar';
  end if;
  if new.estado = 'publicada' then
    new.publicada_en := coalesce(new.publicada_en, now());
    new.editor_id := coalesce(auth.uid(), new.editor_id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_noticias_estado on public.noticias;
create trigger trg_noticias_estado
  before insert or update on public.noticias
  for each row execute function public.noticias_controlar_estado();

-- ─────────────────────────────────────────────────────────────
-- Versiones: cada guardado deja una copia restaurable
-- ─────────────────────────────────────────────────────────────
create table if not exists public.noticias_versiones (
  id bigint generated always as identity primary key,
  noticia_id uuid not null references public.noticias(id) on delete cascade,
  datos jsonb not null,
  estado text not null,
  guardado_por uuid references auth.users(id) on delete set null,
  guardado_en timestamptz not null default now()
);

alter table public.noticias_versiones enable row level security;

create policy "versiones_select_prensa" on public.noticias_versiones
  for select using (exists (select 1 from public.noticias n where n.id = noticia_id));  -- hereda la visibilidad de la nota

create or replace function public.noticias_versionar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.noticias_versiones (noticia_id, datos, estado, guardado_por)
  values (new.id, to_jsonb(new) - 'id', new.estado, auth.uid());
  return new;
end;
$$;

drop trigger if exists trg_noticias_versionar on public.noticias;
create trigger trg_noticias_versionar
  after insert or update on public.noticias
  for each row execute function public.noticias_versionar();

-- ─────────────────────────────────────────────────────────────
-- Medios: fotos y videos cortos en Storage (bucket público «noticias»)
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('noticias', 'noticias', true, 83886080,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "noticias_medios_leer" on storage.objects
  for select using (bucket_id = 'noticias');

create policy "noticias_medios_subir" on storage.objects
  for insert with check (bucket_id = 'noticias' and public.rol_prensa() is not null);

create policy "noticias_medios_borrar" on storage.objects
  for delete using (bucket_id = 'noticias' and public.rol_prensa() in ('editor', 'admin'));
