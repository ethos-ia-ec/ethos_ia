# SEO de Ethos IA y de Marlon Pérez: qué ya está hecho y qué falta hacer

Nadie puede garantizar posiciones en Google. Lo que sí se puede hacer es dejarle al buscador datos claros, consistentes y verificables. Las búsquedas por nombre propio («Marlon Pérez», «Ethos IA») suelen funcionar bien cuando todas las señales coinciden, pero pueden tardar de unos días a varias semanas.

## 1. Ya está en el sitio (no requiere acción)
- **Sitemap automático** en `https://www.ethosia.tech/sitemap.xml` con la portada, el equipo, el perfil de Marlon, Ethos Ingeniería y la guía de marca. `robots.txt` lo indica y bloquea `/api/`.
- **Datos estructurados (schema.org)**: la empresa (`Organization`), el sitio (`WebSite`), **Marlon David Pérez Almachi** (`Person`: Gerente General, ETHOSLAB, UNEMI, enlaces a LinkedIn, GitHub, X, Facebook, portafolio y ORCID), Karen (`Person`) y El Club de la Ingeniería (`Organization`, con Marlon como fundador). Páginas con migas de pan (`BreadcrumbList`).
- **Metadatos por página**: título y descripción únicos, URL canónica, Open Graph y Twitter con la tarjeta 1200×630.
- **Favicon nítido** (ico, 32, 192, 512, Apple) y `site.webmanifest`.

## 2. Lo que debes hacer tú (cuentas propias)
### 2.1 Google Search Console
1. Entra con la cuenta de la empresa en <https://search.google.com/search-console> → **Agregar propiedad**.
2. Elige **Dominio** y escribe `ethosia.tech` (verificación por registro DNS TXT) **o** **Prefijo de URL** `https://www.ethosia.tech` (verificación por etiqueta HTML).
   - Con la etiqueta: copia solo el valor de `content` y defínelo en Vercel como variable de entorno `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`; vuelve a desplegar y pulsa **Verificar**.
3. **Sitemaps** → agrega `sitemap.xml` → **Enviar**.
4. **Inspección de URLs**: pega `https://www.ethosia.tech/equipo/marlon-perez` → **Solicitar indexación**. Repite con `https://www.ethosia.tech/`, `/equipo`, `/plataforma` y `/marca`.
5. En unos días revisa **Rendimiento** (qué búsquedas llevan al sitio) y **Mejoras** (errores de datos estructurados).

### 2.2 Bing Webmaster Tools
Entra en <https://www.bing.com/webmasters>, usa **Importar desde Google Search Console** y envía el mismo sitemap. Alimenta también a otros buscadores que usan Bing.

### 2.3 Google Business Profile (ETHOSLAB)
Crea o reclama el perfil de la empresa en <https://business.google.com> con la dirección, el sitio y las redes ya públicas. Ayuda a que aparezca el panel de información de la empresa.

### 2.4 Comprobar los datos estructurados
Pega `https://www.ethosia.tech/equipo/marlon-perez` en <https://search.google.com/test/rich-results> y en <https://validator.schema.org>. No debe haber errores.

## 3. Señales cruzadas (lo que más ayuda a que «Marlon Pérez» lo encuentre)
Usa **el mismo nombre y el mismo cargo** en todas partes: «Marlon David Pérez Almachi» (o «Marlon Pérez»), «Gerente General de ETHOSLAB S.A.S. (Ethos IA) y fundador de El Club de la Ingeniería», con la misma foto.
- **LinkedIn**: cargo, empresa y enlace a `ethosia.tech/equipo/marlon-perez`.
- **GitHub** (`ing-MarlonPerez` e `IngMarlonPerez`) y **portafolio** (`ingmarlonperez.vercel.app`): en la descripción, enlace a Ethos IA y al club.
- **X, Facebook, YouTube**: el mismo nombre y enlace en la biografía.
- **Sitio del club**: enlace a Marlon y a Ethos IA (ver `seo_club_paquete.md`).
- Que otros sitios (la UNEMI, noticias, aliados) mencionen y enlacen a estas páginas pesa más que cualquier ajuste técnico.

## 4. Datos que conviene unificar antes de promocionar
Un buscador y un reclutador comparan lo que dice cada sitio. Hoy hay diferencias entre el sitio de Ethos, el portafolio y la hoja de vida:
- **Nivel y promedio**: 9.º nivel y 86,08 (portafolio) frente a 10.º y 87,6 (hoja de vida).
- **Años en la Policía Nacional**: 2014–2024 (portafolio) frente a 2011–2021 (hoja de vida).
- **Miembros del club**: «120+» (sitio del club) frente a unos 200 (lo que se dice).
- **Cuenta de GitHub**: hay dos; conviene indicar cuál es la principal.

## 5. Mantenimiento
- Cuando agregues una página nueva, súmala a `RUTAS` en `lib/seo.js`.
- Si cambian cargo, redes o descripción, actualiza `lib/seo.js` (una sola fuente para todas las páginas).
- Reenvía la indexación en Search Console cuando cambies mucho una página.
