# Registro e inicio de sesión con Google, GitHub y Facebook

El sitio ya tiene los botones en `/ingresar`, en `/prensa` y el área `/cuenta`. Para que funcionen en producción,
cada proveedor necesita una aplicación OAuth de Ethos IA. Las claves secretas se pegan **solo** en el panel de
Supabase; nunca en el código, en el chat ni en Vercel.

**URL de retorno (callback) para los tres proveedores:**

    https://tovmxwmxpvqoqjmcazda.supabase.co/auth/v1/callback

## 1. Supabase → Authentication → URL Configuration
- Site URL: `https://www.ethosia.tech`
- Redirect URLs (agregar las cuatro):
  - `https://www.ethosia.tech/cuenta`
  - `https://www.ethosia.tech/prensa`
  - `https://ethosia.tech/**`
  - `http://localhost:*/**` (desarrollo)

## 2. Google (console.cloud.google.com, con ethos.ia.ec@gmail.com)
1. Crear el proyecto «Ethos IA».
2. Google Auth Platform → Branding: nombre «Ethos IA», correo de soporte, logo, dominio autorizado `ethosia.tech`
   y `supabase.co`, enlace a `https://www.ethosia.tech/privacidad.html`.
3. Audience: External → Publish app (en «Testing» solo entran los correos de prueba).
4. Clients → Create client → Web application.
   - Authorized JavaScript origins: `https://www.ethosia.tech`
   - Authorized redirect URIs: la URL de retorno de arriba.
5. Copiar Client ID y Client secret → Supabase → Authentication → Sign In / Providers → Google → activar y pegar.

## 3. GitHub (github.com/settings/developers, o la organización ethos-ia-ec → Settings → OAuth Apps)
1. New OAuth App. Nombre «Ethos IA», Homepage `https://www.ethosia.tech`, callback: la URL de retorno.
2. Generate a new client secret.
3. Pegar Client ID y secret en Supabase → Providers → GitHub.

## 4. Facebook (developers.facebook.com)
1. Create App → caso de uso «Autenticar y solicitar datos a los usuarios con el inicio de sesión con Facebook».
2. Permisos: `email` y `public_profile`.
3. Inicio de sesión con Facebook → Configuración → URI de redireccionamiento de OAuth válidos: la URL de retorno.
4. Configuración básica: URL de política de privacidad `https://www.ethosia.tech/privacidad.html`, URL de
   eliminación de datos `https://www.ethosia.tech/cuenta`, categoría, ícono.
5. Pasar la app a modo **Activo/Publicado** (en desarrollo solo entran los administradores de la app).
   Meta puede pedir verificación de la empresa (RUC 0195187827001).
6. Pegar App ID y App Secret en Supabase → Providers → Facebook.

## 5. Base de datos
Aplicar la migración `0007_cuentas_publicas.sql` (boletín, «Mis solicitudes» y eliminar cuenta):

    npx supabase db push

## 6. Probar
Ventana de incógnito → `https://www.ethosia.tech/ingresar` → cada botón → debe llegar a `/cuenta` con nombre y foto.
Las cuentas nuevas quedan con rol `miembro`; el rol de prensa lo asigna un admin en la tabla `miembros`.

## Desarrollo local (opcional)
En `supabase/config.toml` los tres proveedores vienen con `enabled = false`. Para probarlos en local, crear una app
OAuth de desarrollo con callback `http://127.0.0.1:54321/auth/v1/callback`, exportar las variables
`SUPABASE_AUTH_EXTERNAL_<PROVEEDOR>_CLIENT_ID` y `..._SECRET`, poner `enabled = true` y reiniciar con `npm run stop` y `npm run dev`.
