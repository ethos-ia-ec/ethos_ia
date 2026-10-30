// Fuente única de Ethos Noticias. Para publicar una nota nueva basta con agregar un objeto al inicio de la lista:
// las páginas /noticias y /noticias/[slug] y el sitemap se generan solos. Cada dato debe tener fuente verificable.

export type Bloque =
  | { tipo: 'p'; texto: string }
  | { tipo: 'h2'; texto: string }
  | { tipo: 'lista'; items: string[] }
  | { tipo: 'cita'; texto: string; autor: string }
  | { tipo: 'imagen'; src: string; alt: string; credito?: string; pie?: string; ancho: number; alto: number }
  | { tipo: 'video'; proveedor: 'youtube' | 'vimeo' | 'archivo'; id: string; titulo: string; poster?: string };

export type Noticia = {
  slug: string;
  fecha: string; // AAAA-MM-DD
  actualizada?: string;
  autor?: string;
  categoria: 'Medios' | 'Comunidad' | 'Producto' | 'Equipo';
  titulo: string;
  resumen: string;
  imagen: { src: string; alt: string; credito?: string; ancho: number; alto: number };
  imagenSocial?: string;
  cuerpo: Bloque[];
  fuentes: { texto: string; url: string }[];
};

export const NOTICIAS: Noticia[] = [
  {
    slug: 'ethos-ia-academia-metodologias-abiertas-cualquier-ia',
    fecha: '2026-10-30',
    categoria: 'Producto',
    titulo: 'Ethos IA Academia: 75 metodologías académicas abiertas para trabajar con cualquier inteligencia artificial',
    resumen:
      'Ethos IA publica en código abierto cinco paquetes para investigación científica, tesis de TI, Economía, prácticas de laboratorio y creación de empresas, compatibles con Claude, GPT, Gemini o modelos locales.',
    imagen: {
      src: '/noticias/ethos-ia-academia-2026.webp',
      alt: 'Portada de Ethos IA Academia: 75 metodologías, cinco áreas, compatible con Claude, GPT, Gemini, Ollama y MCP, licencia MIT.',
      ancho: 1600,
      alto: 900,
    },
    imagenSocial: '/noticias/ethos-ia-academia-2026-og.jpg',
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'Ethos IA, la marca de ETHOSLAB S.A.S., liberó Ethos IA Academia, un kit gratuito y de código abierto con 75 metodologías para que estudiantes, docentes e investigadores trabajen con inteligencia artificial sin perder el rigor académico ni la autoría de su trabajo. La iniciativa es impulsada por el Gerente General de la empresa, Marlon Pérez, y se publica con licencia MIT.',
      },
      { tipo: 'h2', texto: 'Funciona con el modelo que cada persona elija' },
      {
        tipo: 'p',
        texto:
          'El kit no depende de un proveedor. Se apoya en dos estándares abiertos: el Model Context Protocol (MCP), que expone las metodologías y las herramientas de búsqueda de literatura a clientes como Claude Code, Claude Desktop, Goose, Cline o Continue, y las skills, archivos de texto que leen por igual las personas y los agentes. Así se puede usar con Claude, GPT, Gemini o un modelo local con Ollama.',
      },
      { tipo: 'h2', texto: 'Cinco paquetes, de la idea a la entrega' },
      {
        tipo: 'lista',
        items: [
          'Investigación científica: revisión sistemática PRISMA 2020 con Scopus, OpenAlex y Unpaywall, las cuatro matrices de revisión y redacción en APA 7.',
          'Proyecto de titulación de TI: trabajos previos, requerimientos, decisiones de arquitectura, UML, documento, video técnico y sustentación.',
          'Economía: consigna y rúbrica, literatura por áreas JEL, matriz de consistencia, ejercicios con ecuaciones de Word y datos de Ecuador.',
          'Prácticas de laboratorio de TI: mediciones de red, cifrado, Docker, evidencias e informe en Word sobre la plantilla oficial.',
          'Creación de empresa: constitución de una S.A.S. en Ecuador, marca, balance inicial, gobierno societario, sitio web y equipo.',
        ],
      },
      { tipo: 'h2', texto: 'Tres principios' },
      {
        tipo: 'lista',
        items: [
          'Solo fuentes académicas: artículos con DOI leídos en texto completo, y cada cifra verificada antes de citarla.',
          'La IA no es autora: el kit incluye una revisión de rastros de IA y un anexo de declaración de uso; la responsabilidad es de quien firma el trabajo.',
          'Las claves quedan en el equipo del usuario: las de Scopus y las del modelo nunca salen de su computadora, y no hay telemetría.',
        ],
      },
      {
        tipo: 'p',
        texto:
          'En Windows, un instalador prepara Python, pide de forma opcional la clave de Scopus y registra el kit en el cliente de IA. En Claude Code se instala con el comando /plugin marketplace add IngMarlonPerez/ethos-ia-academia. Las instrucciones completas están en ethosia.tech/academia.',
      },
      {
        tipo: 'cita',
        texto: 'La inteligencia artificial debe ayudar a investigar mejor, no a firmar por nosotros.',
        autor: 'Ethos IA',
      },
    ],
    fuentes: [
      { texto: 'Repositorio de Ethos IA Academia en GitHub', url: 'https://github.com/IngMarlonPerez/ethos-ia-academia' },
      { texto: 'Página de Ethos IA Academia', url: 'https://www.ethosia.tech/academia' },
    ],
  },
  {
    slug: 'radar-economico-unemi-inteligencia-artificial-con-proposito',
    fecha: '2026-10-30',
    categoria: 'Medios',
    titulo: 'Nuestro Gerente General, invitado a Radar Económico del Sistema Integrado de Medios de la UNEMI',
    resumen:
      'Marlon Pérez conversó sobre inteligencia artificial con propósito: tecnología, datos y emprendimiento para transformar negocios y comunidades.',
    imagen: {
      src: '/noticias/radar-economico-unemi-2026.webp',
      alt: 'Afiche de Radar Económico: tema «Inteligencia artificial con propósito», invitado Marlon David Pérez Almachi, conduce Andrea Sánchez, viernes 30 de octubre a las 11h00, transmitido por YouTube y el Sistema Integrado de Medios de la UNEMI.',
      ancho: 1136,
      alto: 1408,
    },
    imagenSocial: '/noticias/radar-economico-unemi-2026-og.jpg',
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'Marlon David Pérez Almachi, Gerente General y cofundador de Ethos IA, fue invitado al programa Radar Económico del Sistema Integrado de Medios (SIM) de la Universidad Estatal de Milagro (UNEMI). La emisión se realizó el viernes 30 de octubre de 2026 a las 11h00, con la conducción de Andrea Sánchez, y se transmitió por YouTube y por los canales del SIM y de unemiPlay.',
      },
      {
        tipo: 'p',
        texto:
          'El tema del programa fue «Inteligencia artificial con propósito: tecnología, datos y emprendimiento para transformar negocios y comunidades». La conversación abordó cómo un proyecto universitario se convierte en una empresa de tecnología y qué puede hacer hoy una mipyme para aprovechar la inteligencia artificial de forma responsable.',
      },
      { tipo: 'h2', texto: 'Cuatro ideas para emprendedores y mipymes' },
      {
        tipo: 'lista',
        items: [
          'La inteligencia artificial es accesible: muchas herramientas son gratuitas o de bajo costo, y conviene empezar por un solo problema concreto y medir el resultado.',
          'Sin ética y sin protección de datos, la tecnología no es sostenible: usar solo la información necesaria, protegerla y dejar la última decisión en manos de una persona.',
          'Los proyectos universitarios pueden tener impacto real cuando se diseñan para funcionar todos los días, con seguridad y pensando en quien los usa.',
          'La formación continua es la clave para aprovechar la transformación digital.',
        ],
      },
      {
        tipo: 'cita',
        texto:
          'Emprender mientras estudiaba fue aprovechar el mejor laboratorio que existe: la universidad.',
        autor: 'Marlon Pérez, Gerente General de Ethos IA',
      },
      {
        tipo: 'p',
        texto:
          'Ethos IA agradece al Sistema Integrado de Medios y a la carrera de Economía de la UNEMI por abrir este espacio de diálogo entre la academia, el emprendimiento y la comunidad.',
      },
    ],
    fuentes: [{ texto: 'Publicación oficial del programa', url: 'https://www.facebook.com/share/p/1CEYfgG8UC/' }],
  },
];

export const noticiaPorSlug = (slug: string) => NOTICIAS.find((n) => n.slug === slug);

export const fechaLarga = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
