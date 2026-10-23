-- Ejemplo del formato del inventario privado (db/privado/04_inventario.sql). Datos ficticios.
set search_path = secmon;
insert into activos (codigo,nombre,tipo,proveedor,datos,clasificacion,responsable,verificacion) values
  ('A-01','Sitio corporativo','Aplicación web','Proveedor de hosting','Contenido público','Pública','Equipo técnico','Verificado');
insert into controles (codigo,descripcion) values ('F-01','HSTS con max-age de 2 años');
insert into hallazgos (codigo,titulo,severidad,ambito,plazo_dias,activo) values
  ('H-01','CSP solo en modo informativo','Media','Cabeceras HTTP',30,'A-01');
update chequeos set control='F-01', activo='A-01' where codigo='C-05';
update chequeos set hallazgo='H-01', activo='A-01' where codigo='C-10';
