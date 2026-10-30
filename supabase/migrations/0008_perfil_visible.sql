-- Perfil visible en el encabezado: cada persona decide si se muestra la foto de su proveedor o su inicial.
-- El nombre visible ya vive en miembros.nombre; la política miembros_update_own permite editar la fila propia
-- y el trigger prevent_role_self_escalation impide tocar el rol.
alter table public.miembros add column if not exists mostrar_foto boolean not null default true;
