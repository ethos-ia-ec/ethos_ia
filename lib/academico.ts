// Contenido de Ethos Académico, la división de formación e investigación científica de Ethos IA.
// Fuente única: la portada, /academico y sus subpáginas leen de aquí.


export interface Area {
  id: string;
  titulo: string;
  texto: string;
  temas: string[];
  icono: 'microscopio' | 'birrete' | 'grafico' | 'base' | 'codigo' | 'moneda' | 'personas' | 'libro' | 'balanza';
  // ilustrativa: imagen de acceso abierto (public/academico/libres); sin ella, figura real de un proyecto propio.
  imagen?: { src: string; alt: string; ilustrativa?: boolean };
  // Clip de 5 s (640×400, sin audio) que se reproduce en la tarjeta del frente; ruta sin extensión (.webm/.mp4/.jpg).
  video?: string;
}

export const AREAS: Area[] = [
  { id: 'investigacion', video: '/academico/video/tarjetas/tarjeta-investigacion', icono: 'microscopio', titulo: 'Investigación científica', texto: 'Formulación del problema, diseño metodológico y redacción científica con fuentes indexadas, de la pregunta de investigación al manuscrito.', temas: ['Scopus', 'PRISMA 2020', 'APA 7'], imagen: { src: '/academico/libres/investigacion.webp', alt: 'Ilustración de microorganismos en tonos azules', ilustrativa: true } },
  { id: 'titulacion', video: '/academico/video/tarjetas/tarjeta-titulacion', icono: 'birrete', titulo: 'Tesis y titulación', texto: 'Acompañamiento por etapas en el proyecto de titulación: anteproyecto, avances, revisión con la rúbrica y preparación de la sustentación.', temas: ['Anteproyecto', 'Avances', 'Sustentación'], imagen: { src: '/academico/libres/titulacion.webp', alt: 'Ilustración: pasillo de biblioteca con estanterías iluminadas', ilustrativa: true } },
  { id: 'posgrado', video: '/academico/video/tarjetas/tarjeta-posgrado', icono: 'libro', titulo: 'Maestría y posgrado', texto: 'Revisión sistemática, análisis bibliométrico y estructura del artículo para revista, con lectura crítica de cada fuente.', temas: ['Bibliometrix', 'Vancouver', 'Artículo'], imagen: { src: '/academico/libres/posgrado.webp', alt: 'Ilustración: páginas abiertas de libros y revistas', ilustrativa: true } },
  { id: 'estadistica', video: '/academico/video/tarjetas/tarjeta-estadistica', icono: 'grafico', titulo: 'Estadística y datos', texto: 'Diseño del análisis, pruebas estadísticas e interpretación de resultados con Python y R, explicando cada paso para que el estudiante lo domine.', temas: ['Python', 'R', 'Modelos'], imagen: { src: '/academico/OULAD_UK_roc_pr.png', alt: 'Curvas ROC y precisión-recall del modelo de abandono estudiantil' } },
  { id: 'bi', icono: 'base', titulo: 'Power BI y bases de datos', texto: 'Modelado de datos, SQL y tableros de indicadores para proyectos académicos y de gestión.', temas: ['Power BI', 'PostgreSQL', 'SQL'], imagen: { src: '/academico/demo_consulta.gif', alt: 'Demostración de una consulta en lenguaje natural convertida en SQL' } },
  { id: 'ti', video: '/academico/video/tarjetas/tarjeta-ti', icono: 'codigo', titulo: 'Tecnologías de la información', texto: 'Arquitectura de software, programación avanzada, inteligencia artificial y laboratorios de redes y ciberseguridad.', temas: ['IA', 'Docker', 'Redes'], imagen: { src: '/academico/libres/ti-terminal.jpg', alt: 'Terminal Linux ejecutando comandos de laboratorio', ilustrativa: true } },
  { id: 'economia', video: '/academico/video/tarjetas/tarjeta-economia', icono: 'moneda', titulo: 'Economía', texto: 'Teoría económica, costeo, elasticidades y datos oficiales de Ecuador, con gráficos y ecuaciones explicados.', temas: ['JEL', 'Costeo', 'BCE'], imagen: { src: '/academico/libres/economia.webp', alt: 'Ilustración: serie de datos sobre una pantalla', ilustrativa: true } },
  { id: 'educacion', video: '/academico/video/tarjetas/tarjeta-educacion', icono: 'libro', titulo: 'Educación', texto: 'Investigación educativa para carreras y maestrías en Educación: diseño de instrumentos, intervención pedagógica, análisis cualitativo y mixto.', temas: ['Pedagogía', 'Instrumentos', 'Mixta'], imagen: { src: '/academico/libres/educacion-pizarra.jpg', alt: 'Pizarra con una integral, medidas de tendencia central, varianza y una campana de Gauss', ilustrativa: true } },
  { id: 'trabajo-social', video: '/academico/video/tarjetas/tarjeta-trabajo-social', icono: 'personas', titulo: 'Trabajo social', texto: 'Investigación social aplicada: diagnóstico comunitario, entrevistas, análisis de contenido y consideraciones éticas.', temas: ['Cualitativa', 'Comunidad', 'Ética'], imagen: { src: '/academico/libres/trabajo-social.webp', alt: 'Ilustración: tejados de un barrio vistos desde lo alto', ilustrativa: true } },
  { id: 'derecho', video: '/academico/video/tarjetas/tarjeta-derecho', icono: 'balanza', titulo: 'Derecho', texto: 'Investigación jurídica para la carrera y la maestría en Derecho: análisis normativo y jurisprudencial, doctrina y citación de fuentes legales del Ecuador.', temas: ['Normativa', 'Jurisprudencia', 'Doctrina'], imagen: { src: '/academico/libres/derecho.webp', alt: 'Ilustración: balanza de la justicia', ilustrativa: true } },
];

export const SERVICIOS = [
  { n: '01', titulo: 'Asesoría metodológica', texto: 'Sesiones individuales o grupales para definir el problema, los objetivos y el diseño de la investigación, con un plan de trabajo por etapas.' },
  { n: '02', titulo: 'Talleres y formación', texto: 'Talleres prácticos de revisión sistemática, redacción científica, APA 7, estadística aplicada, Python y Power BI.' },
  { n: '03', titulo: 'Revisión con retroalimentación', texto: 'Lectura del avance contra la consigna y la rúbrica, con observaciones priorizadas para que el autor corrija su propio documento.' },
  { n: '04', titulo: 'Laboratorio de datos', texto: 'Acompañamiento en el análisis: se trabaja junto al estudiante sobre sus datos y se explica cada resultado y cada gráfico.' },
];

export const PROCESO = [
  { titulo: 'Diagnóstico', texto: 'Revisamos la consigna, la rúbrica y el punto de partida del trabajo.' },
  { titulo: 'Plan de trabajo', texto: 'Acordamos etapas, entregables del autor y fechas de revisión.' },
  { titulo: 'Acompañamiento', texto: 'Sesiones de asesoría, talleres y retroalimentación en cada avance.' },
  { titulo: 'Preparación final', texto: 'Revisión de coherencia, normas de citación y ensayo de la sustentación.' },
];

export const CIFRAS = [
  { valor: '10', etiqueta: 'áreas de conocimiento' },
  { valor: '75', etiqueta: 'metodologías abiertas' },
  { valor: '30', etiqueta: 'profesionales en el equipo' },
  { valor: '100 %', etiqueta: 'autoría del estudiante' },
];

export const COMPROMISO = {
  si: [
    'El estudiante es el autor de su trabajo: lo escribe, lo entiende y lo defiende.',
    'Enseñamos métodos, revisamos avances y explicamos cada observación.',
    'Usamos solo fuentes académicas verificables y citadas en su norma.',
    'Protegemos los datos personales conforme a la LOPDP del Ecuador.',
    'El uso de herramientas de IA se declara según la normativa de cada institución.',
  ],
  no: [
    'No elaboramos trabajos para que otra persona los presente como propios.',
    'No ofrecemos calificaciones garantizadas: la nota depende del autor y de su docente.',
    'No publicamos trabajos ni datos de quienes acompañamos.',
  ],
};

export interface Proyecto {
  id: string;
  area: string;
  titulo: string;
  texto: string;
  etiquetas: string[];
  imagenes: { id: string; titulo: string; descripcion: string; src: string }[];
  enlace?: { href: string; etiqueta: string };
}

// Solo material propio del equipo o con datos públicos o sintéticos.
export const PROYECTOS: Proyecto[] = [
  {
    id: 'abandono',
    area: 'Ciencia de datos e IA',
    titulo: 'Modelo predictivo de abandono estudiantil',
    texto: 'Proyecto de titulación de Ingeniería en TI de los fundadores: aprendizaje automático, inteligencia de negocios y consultas en lenguaje natural, validado con el conjunto público OULAD y datos sintéticos.',
    etiquetas: ['Python', 'Machine learning', 'BI', 'NL2SQL'],
    imagenes: [
      { id: 'consulta', titulo: 'Consulta en lenguaje natural', descripcion: 'Demostración de una pregunta en español convertida en consulta SQL.', src: '/academico/demo_consulta.gif' },
      { id: 'roc', titulo: 'Curvas ROC y precisión-recall', descripcion: 'Validación cruzada y prueba temporal del modelo con el conjunto OULAD.', src: '/academico/OULAD_UK_roc_pr.png' },
      { id: 'importancia', titulo: 'Importancia de variables', descripcion: 'Caída del PR-AUC al permutar cada variable.', src: '/academico/OULAD_UK_importancia.png' },
      { id: 'calibracion', titulo: 'Calibración del modelo', descripcion: 'Probabilidad predicha frente a frecuencia observada.', src: '/academico/OULAD_UK_calibracion.png' },
      { id: 'segmentacion', titulo: 'Segmentación por riesgo', descripcion: 'Agrupamiento de estudiantes según su perfil de riesgo.', src: '/academico/OULAD_UK_segmentacion_k.png' },
    ],
  },
  {
    id: 'kit',
    area: 'Investigación científica',
    titulo: 'Ethos IA Academia',
    texto: 'Kit abierto con 75 metodologías para revisión sistemática, tesis de TI, Economía y prácticas, que funciona con Claude, GPT, Gemini o un modelo local.',
    etiquetas: ['PRISMA 2020', 'MCP', 'Licencia MIT'],
    imagenes: [],
    enlace: { href: '/academia', etiqueta: 'Conocer el kit' },
  },
  {
    id: 'laboratorios',
    area: 'Tecnologías de la información',
    titulo: 'Laboratorios de ingeniería',
    texto: 'Paneles reales de mesa de ayuda, redes y auditoría, y un pipeline de seguridad de diez compuertas, construidos como laboratorio técnico en Docker.',
    etiquetas: ['Docker', 'Redes', 'DevSecOps'],
    imagenes: [],
    enlace: { href: '/plataforma', etiqueta: 'Ver Ethos Ingeniería' },
  },
];

// Perfiles del equipo, sin nombres: la coordinación asigna cada caso al especialista adecuado.
export interface Perfil {
  perfil: string;
  texto: string;
  icono: Area['icono'];
}

export const EQUIPO: Perfil[] = [
  { perfil: 'Doctores (PhD)', icono: 'microscopio', texto: 'Dirección metodológica e investigación científica de alto impacto.' },
  { perfil: 'Magísteres y candidatos a doctor', icono: 'birrete', texto: 'Asesoría en investigación, docencia universitaria y producción científica.' },
  { perfil: 'Ingenieros en TI y sistemas', icono: 'codigo', texto: 'Ciencia de datos, inteligencia artificial, bases de datos y desarrollo de software.' },
  { perfil: 'Economía y estadística', icono: 'grafico', texto: 'Análisis económico, estadística aplicada y modelos cuantitativos.' },
  { perfil: 'Educación y ciencias sociales', icono: 'personas', texto: 'Investigación cualitativa y mixta, instrumentos y ética de la investigación.' },
  { perfil: 'Diseño y producción multimedia', icono: 'libro', texto: 'Visualización científica, diseño editorial y producción audiovisual.' },
];

// Integrantes con fotografía publicada en /equipo (mismos cargos que esa página).
export const MIEMBROS = [
  { nombre: 'Marlon Pérez', cargo: 'Cofundador · Gerente General y Director Técnico', foto: '/empresa/marlon-profile.jpg' },
  { nombre: 'Karen Herrera', cargo: 'Cofundadora · Economía', foto: '/empresa/karen-herrera-avatar.png' },
  { nombre: 'Liliana Pérez', cargo: 'Ingeniera en Sistemas · Talento Humano', foto: '/empresa/liliana-perez-avatar.png' },
  { nombre: 'William Toscano', cargo: 'Licenciado en Producción Multimedia · Diseño', foto: '/empresa/william-toscano-avatar.jpg' },
];

export const ALCANCE = 'Acompañamos a estudiantes de grado y posgrado de universidades de todo el Ecuador.';

export const WHATSAPP_ACADEMICO = `https://wa.me/593994274263?text=${encodeURIComponent('Hola, Ethos Académico. Me gustaría recibir información sobre la asesoría y los talleres de investigación.')}`;

// Distancia más corta (con signo) de la tarjeta i a la activa en un carrusel circular.
export function desfase(i: number, activo: number, total: number): number {
  let d = (((i - activo) % total) + total) % total;
  if (d > total / 2) d -= total;
  return d;
}

export function iniciales(nombre: string): string {
  return nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
}
