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
  // Reportaje principal: se presenta como portada de revista en /noticias y en la nota.
  destacada?: { sello: string; cifras: { valor: string; texto: string }[] };
  cuerpo: Bloque[];
  fuentes: { texto: string; url: string }[];
};

export const NOTICIAS: Noticia[] = [
  {
    slug: 'vicmar-prediccion-abandono-universitario-ia-conversacional',
    fecha: '2026-10-30',
    autor: 'Marlon Pérez y Víctor Lluilema',
    categoria: 'Producto',
    titulo: 'VicMar: inteligencia artificial que anticipa el abandono universitario y responde en español a directivos y bienestar estudiantil',
    resumen:
      'Marlon Pérez y Víctor Lluilema, estudiantes de Ingeniería en TI de la UNEMI, desarrollaron un sistema que compara cuatro modelos de aprendizaje automático, explica cada alerta y permite consultar a los estudiantes en riesgo desde el celular o la computadora, sin cuadernos de código.',
    imagen: {
      src: '/noticias/vicmar-portada-revista.webp',
      alt: 'Portada estilo revista de Ethos Noticias con Marlon Pérez: «La IA que anticipa el abandono universitario», VicMar, de Marlon Pérez y Víctor Lluilema.',
      ancho: 1200,
      alto: 1500,
    },
    imagenSocial: '/noticias/vicmar-og.jpg',
    destacada: {
      sello: 'Reportaje principal',
      cifras: [
        { valor: '21,51 %', texto: 'deserción de primer año en Ecuador (CES, 2023)' },
        { valor: 'USD 9,8 M', texto: 'al año por cada punto de abandono evitado (estimación propia)' },
        { valor: '0,828', texto: 'ROC-AUC del modelo LightGBM elegido' },
        { valor: '91,3 %', texto: 'de abandonos detectados en validación prospectiva' },
      ],
    },
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'Marlon Pérez, Gerente General de Ethos IA, y Víctor Lluilema, coautor del proyecto, presentan VicMar, su trabajo de titulación en Ingeniería en Tecnologías de la Información de la Universidad Estatal de Milagro (UNEMI). El sistema estima qué estudiantes tienen mayor probabilidad de abandonar la carrera, explica por qué y pone esa información en manos de quienes pueden actuar a tiempo.',
      },
      {
        tipo: 'imagen',
        src: '/noticias/vicmar-consulta-conversacional.webp',
        alt: 'Pantalla de VicMar respondiendo en español la pregunta «¿Qué carreras tienen más estudiantes en riesgo?» con un gráfico de barras. Datos sintéticos.',
        credito: 'Captura de VicMar con datos sintéticos',
        pie: 'Un director pregunta en español y VicMar responde con datos y gráfico.',
        ancho: 1600,
        alto: 1000,
      },
      { tipo: 'h2', texto: 'Un problema que cuesta millones' },
      {
        tipo: 'p',
        texto:
          'Según el Consejo de Educación Superior (CES), la deserción de primer año en las universidades del Ecuador fue de 21,51 % en 2023, y la meta oficial es bajarla a 17,99 %. El mismo plan registra una proforma de USD 979,9 millones en 2025 para las 31 universidades públicas, y recomienda el monitoreo temprano de alertas en los primeros ciclos. La Ley Orgánica de Educación Superior, además, incluye la tasa de retención en la fórmula con la que se distribuyen los recursos.',
      },
      {
        tipo: 'p',
        texto:
          'En la UNEMI, el presupuesto devengado de 2025 fue de USD 42,9 millones para 56 530 estudiantes de grado, lo que da una estimación propia de unos USD 759 por estudiante al año. En algunas instituciones la cifra de abandono es mucho mayor: un estudio publicado en Frontiers in Education encontró que el 44,9 % de los estudiantes de una universidad privada ecuatoriana abandonó sus estudios.',
      },
      {
        tipo: 'lista',
        items: [
          'Estimación propia: si alrededor de uno de cada cinco estudiantes deja la universidad en el primer año, el presupuesto público asociado a esos cupos ronda los USD 210 millones al año.',
          'Estimación propia: cada punto porcentual de abandono que se logre evitar equivale a cerca de USD 9,8 millones anuales del presupuesto universitario público.',
          'Detrás de cada cifra hay una persona que no termina su carrera y una familia que pierde lo invertido.',
        ],
      },
      { tipo: 'h2', texto: 'Cuatro modelos comparados, uno elegido con evidencia' },
      {
        tipo: 'p',
        texto:
          'VicMar entrena y compara cuatro modelos: regresión logística, Random Forest con pesos de clase, Random Forest con SMOTE y LightGBM optimizado con Optuna, que fue el elegido. Alcanzó un ROC-AUC de 0,828 en el conjunto UNEMI_PRUEBAS, construido con datos sintéticos, y de 0,804 en OULAD, una base pública con datos reales de la Open University del Reino Unido. En una validación prospectiva sobre un periodo posterior detectó al 91,3 % de los estudiantes que efectivamente abandonaron.',
      },
      {
        tipo: 'imagen',
        src: '/noticias/vicmar-ficha-riesgo.webp',
        alt: 'Ficha de un estudiante en VicMar con probabilidad de riesgo de 75,1 % y los factores que explican la alerta. Datos sintéticos.',
        credito: 'Captura de VicMar con datos sintéticos',
        pie: 'Cada alerta viene con sus razones: el sistema muestra qué factores pesan más en el riesgo de cada estudiante (SHAP).',
        ancho: 1600,
        alto: 1000,
      },
      { tipo: 'h2', texto: 'La innovación: preguntar en español, sin cuadernos de código' },
      {
        tipo: 'p',
        texto:
          'La mayoría de los modelos predictivos se quedan en cuadernos de Jupyter o de Google Colab que solo puede abrir un especialista. VicMar da un paso más: un director de carrera o el equipo de bienestar estudiantil escribe una pregunta en español, como «¿qué carreras tienen más estudiantes en riesgo?», y recibe la respuesta con su gráfico desde el celular o la computadora.',
      },
      {
        tipo: 'lista',
        items: [
          'La consulta conversacional respondió correctamente las 52 preguntas de prueba, con una mediana de 77 milisegundos.',
          'Las 8 preguntas maliciosas de prueba fueron bloqueadas: el sistema solo lee datos y nunca los modifica.',
          '27 servicios REST con FastAPI, explicaciones con SHAP, vigilancia de la deriva de los datos (PSI), MLflow y tableros en Metabase.',
          'La decisión final siempre es de una persona: el sistema alerta y explica, no sanciona.',
        ],
      },
      {
        tipo: 'cita',
        texto: 'Un modelo que solo entiende un especialista no cambia nada; uno que puede consultar cualquier director a tiempo sí.',
        autor: 'Marlon Pérez y Víctor Lluilema, autores de VicMar',
      },
      {
        tipo: 'p',
        texto:
          'El código es abierto y está publicado en GitHub. Ethos IA trabaja para llevar esta experiencia a instituciones de educación superior que quieran actuar antes de que sus estudiantes se vayan.',
      },
    ],
    fuentes: [
      { texto: 'CES, Plan de Desarrollo del Sistema de Educación Superior 2025 (deserción de primer año, proforma y recomendación de alertas tempranas)', url: 'https://www.ces.gob.ec/' },
      { texto: 'UNEMI, Informe de Rendición de Cuentas 2025 (presupuesto devengado y estudiantes de grado)', url: 'https://www.unemi.edu.ec/' },
      { texto: 'Núñez-Naranjo, A. F. (2024). Frontiers in Education, 9, 1444534', url: 'https://doi.org/10.3389/feduc.2024.1444534' },
      { texto: 'Repositorio público de VicMar en GitHub', url: 'https://github.com/Vm199524/PROYECTO-TITULACION-MARLON-VICTOR-UNEMI' },
    ],
  },
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
