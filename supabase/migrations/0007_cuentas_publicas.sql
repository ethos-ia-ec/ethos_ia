-- Cuentas públicas del sitio (registro con Google, GitHub o Facebook) y área «Mi cuenta».
-- El trigger handle_new_user (0001) ya crea la fila de `miembros` con rol 'miembro' para cualquier proveedor.

-- ─────────────────────────────────────────────────────────────
-- Mis solicitudes: cada persona ve las solicitudes de diagnóstico enviadas con el correo de su cuenta.
-- El correo del token lo confirma el proveedor (Google, GitHub o Facebook) o el enlace de acceso.
-- ─────────────────────────────────────────────────────────────
create index if not exists solicitudes_correo_idx on public.solicitudes (lower(correo));

drop policy if exists "solicitudes_select_propias" on public.solicitudes;
create policy "solicitudes_select_propias" on public.solicitudes
  for select to authenticated
  using (lower(correo) = lower(auth.jwt() ->> 'email'));

-- ─────────────────────────────────────────────────────────────
-- Boletín de Ethos Noticias: una fila por cuenta, con fecha de alta y de baja (constancia del consentimiento, LOPDP).
-- ─────────────────────────────────────────────────────────────
create table if not exists public.boletin (
  user_id uuid primary key references auth.users(id) on delete cascade,
  correo text not null,
  suscrito boolean not null default true,
  alta_en timestamptz not null default now(),
  baja_en timestamptz
);

alter table public.boletin enable row level security;

drop policy if exists "boletin_propio" on public.boletin;
create policy "boletin_propio" on public.boletin
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and lower(correo) = lower(auth.jwt() ->> 'email'));

drop policy if exists "boletin_staff" on public.boletin;
create policy "boletin_staff" on public.boletin
  for select to authenticated
  using (public.is_staff());

-- ─────────────────────────────────────────────────────────────
-- Borrar mi cuenta (derecho de eliminación, LOPDP). Borra el usuario de Auth;
-- miembros y boletin caen en cascada. Un admin no puede borrarse solo: así nunca queda el panel sin administrador.
-- ─────────────────────────────────────────────────────────────
create or replace function public.borrar_mi_cuenta()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Sin sesión.';
  end if;
  if exists (select 1 from public.miembros where user_id = auth.uid() and rol = 'admin') then
    raise exception 'Una cuenta de administración se elimina desde la gerencia.';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.borrar_mi_cuenta() from public, anon;
grant execute on function public.borrar_mi_cuenta() to authenticated;
