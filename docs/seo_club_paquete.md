# Paquete SEO para el sitio de El Club de la Ingeniería

Material listo para pegar en el repositorio del club (`IngMarlonPerez/El-Club-de-la-Ingenier-a`, sitio `https://elclubdelaingenieria.dpdns.org/`). Es un proyecto aparte de ETHOSLAB; este paquete no lo modifica. Antes de pegarlo, confirma que las cifras sean las vigentes.

## 1. Etiquetas del `<head>` (o su equivalente en Next.js)
```html
<title>El Club de la Ingeniería — Comunidad de ingeniería y tecnología en Ecuador</title>
<meta name="description" content="Comunidad estudiantil de ingeniería en tecnologías de la información, ciencias e investigación. Charlas técnicas, mentorías y proyectos de software, datos, ciberseguridad y redes. Incluye Kernel Cero, un reto de terminal Linux de 31 niveles." />
<link rel="canonical" href="https://elclubdelaingenieria.dpdns.org/" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="El Club de la Ingeniería" />
<meta property="og:title" content="El Club de la Ingeniería — Comunidad de ingeniería y tecnología" />
<meta property="og:description" content="Aprende ingeniería, ciberseguridad y software con proyectos reales. Kernel Cero: reto de terminal Linux de 31 niveles." />
<meta property="og:url" content="https://elclubdelaingenieria.dpdns.org/" />
<meta property="og:image" content="https://elclubdelaingenieria.dpdns.org/og-club.png" />
<meta name="twitter:card" content="summary_large_image" />
```
Crea una imagen `og-club.png` de 1200×630 con el logotipo del club.

## 2. Datos estructurados (JSON-LD) de la organización
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://elclubdelaingenieria.dpdns.org/#organizacion",
  "name": "El Club de la Ingeniería",
  "url": "https://elclubdelaingenieria.dpdns.org/",
  "description": "Comunidad estudiantil de ingeniería en tecnologías de la información, ciencias e investigación.",
  "founder": {
    "@type": "Person",
    "@id": "https://www.ethosia.tech/equipo/marlon-perez#persona",
    "name": "Marlon David Pérez Almachi",
    "url": "https://www.ethosia.tech/equipo/marlon-perez",
    "sameAs": ["https://ingmarlonperez.vercel.app/", "https://github.com/ing-MarlonPerez", "https://www.linkedin.com/in/marlon-p%C3%A9rez-06ab32303/"]
  },
  "sameAs": ["https://github.com/IngMarlonPerez/El-Club-de-la-Ingenier-a"]
}
</script>
```
Agrega a `sameAs` las páginas oficiales del club (Facebook, YouTube) con sus direcciones reales.

## 3. Reto Kernel Cero como contenido propio
Si Kernel Cero tiene su propia página, añade:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Kernel Cero — reto de terminal Linux",
  "description": "Reto interactivo de 31 niveles en 7 episodios para aprender comandos de Linux y conceptos de ciberseguridad, guiado por el asistente INGenioso.",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "url": "https://elclubdelaingenieria.dpdns.org/",
  "creator": { "@id": "https://www.ethosia.tech/equipo/marlon-perez#persona" },
  "inLanguage": "es"
}
</script>
```

## 4. `robots.txt` y `sitemap.xml`
```
User-agent: *
Allow: /
Sitemap: https://elclubdelaingenieria.dpdns.org/sitemap.xml
```
El sitemap debe listar las páginas públicas (inicio, Kernel Cero, buscador de empleo, unirse) con URLs absolutas y fecha de modificación.

## 5. Enlaces recíprocos
- En el sitio del club, sección «Quién lidera el club»: enlaza a `https://www.ethosia.tech/equipo/marlon-perez` con el texto «Marlon Pérez, Gerente General de Ethos IA».
- En el README de GitHub del club y en el perfil: enlace al sitio del club.
- En el perfil de Marlon de Ethos IA ya hay un enlace al club (`/equipo/marlon-perez`, sección Comunidad).

## 6. Search Console del club
Repite el proceso de `SEO_Search_Console.md` con `elclubdelaingenieria.dpdns.org`. Ten en cuenta que el dominio `dpdns.org` es un subdominio gratuito de un tercero: los buscadores lo tratan como parte de ese dominio compartido, y eso limita el posicionamiento. **Si el club va a crecer, conviene un dominio propio** (por ejemplo `clubdelaingenieria.ec`) con redirección permanente desde el actual.
