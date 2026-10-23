-- Catálogo de chequeos automáticos. Todos son pasivos y solo se ejecutan contra el dominio propio
-- (www.ethosia.tech): leen lo mismo que vería cualquier navegador, sin escaneos ni pruebas de intrusión.
-- Los códigos de control (F-xx) y hallazgo (H-xx) se enlazan después, cuando el inventario privado
-- (db/privado/04_inventario.sql) los carga; aquí se insertan sin referencia para no depender de él.
set search_path = secmon;

insert into chequeos (codigo, nombre, categoria) values
  ('C-01', 'El sitio responde (HTTP 200) y tiempo de respuesta',          'Disponibilidad'),
  ('C-02', 'HTTP redirige a HTTPS',                                       'TLS'),
  ('C-03', 'Certificado TLS vigente (días restantes)',                   'TLS'),
  ('C-04', 'Versión de TLS negociada (1.2 o superior)',                   'TLS'),
  ('C-05', 'HSTS con max-age de al menos 1 año',                          'Cabeceras'),
  ('C-06', 'Protección contra framing (X-Frame-Options o frame-ancestors)', 'Cabeceras'),
  ('C-07', 'X-Content-Type-Options: nosniff',                             'Cabeceras'),
  ('C-08', 'Referrer-Policy y Permissions-Policy presentes',              'Cabeceras'),
  ('C-09', 'No se expone X-Powered-By',                                   'Cabeceras'),
  ('C-10', 'Content-Security-Policy en modo bloqueante',                  'Cabeceras'),
  ('C-11', 'Sin Access-Control-Allow-Origin: * en páginas',               'Cabeceras'),
  ('C-12', 'Registro SPF publicado en el dominio',                        'DNS'),
  ('C-13', 'Política DMARC publicada en el dominio',                      'DNS'),
  ('C-14', 'La política de privacidad identifica a ETHOSLAB S.A.S.',      'Cumplimiento'),
  ('C-15', 'Las rutas de API rechazan métodos no permitidos (405)',       'Cabeceras')
on conflict (codigo) do nothing;
