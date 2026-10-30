-- Corrige el control de roles de 0001:
--  · Desde el servidor (SQL Editor, service_role, scripts) no hay usuario en sesión (auth.uid() es nulo) y el
--    control anterior revertía cualquier cambio de rol, así que no se podía nombrar al primer administrador.
--  · Con sesión, solo un admin puede cambiar roles (antes un editor podía nombrarse admin a sí mismo o a otros).
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.rol is distinct from old.rol and auth.uid() is not null and not exists (
    select 1 from public.miembros where user_id = auth.uid() and rol = 'admin'
  ) then
    new.rol := old.rol;
  end if;
  return new;
end;
$$;
