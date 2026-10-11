// Catálogo de «Ethos Ingeniería». Las cifras salen de los entregables de la
// carpeta de la empresa (laboratorios Docker, Ethos DevOps Kit y programa de
// prácticas); no se calculan en tiempo de ejecución.

export interface Elemento {
  titulo: string;
  detalle: string;
  etiquetas: string[];
}

export interface Seccion {
  id: 'laboratorios' | 'devops' | 'programa';
  nombre: string;
  resumen: string;
  cifras: { valor: string; etiqueta: string }[];
  elementos: Elemento[];
}

export interface Riesgo {
  id: string;
  riesgo: string;
  probabilidad: 1 | 2 | 3 | 4 | 5;
  impacto: 1 | 2 | 3 | 4 | 5;
  tratamiento: string;
}

export type EstadoServicio = 'catalogo' | 'demo-navegador' | 'en-linea';

export interface Servicio {
  id: string;
  nombre: string;
  para: string;
  incluye: string[];
  comoLevantar: string;
  entrega: string[];
  estado: EstadoServicio;
  imagen?: string; // vista previa real (public/paneles)
  paneles?: boolean; // tiene capturas en la pestaña Paneles
}

export interface Resumen {
  nombre: string;
  version: string;
  secciones: Seccion[];
  riesgos: Riesgo[];
  servicios: Servicio[];
}

export const ETIQUETA_ESTADO: Record<EstadoServicio, string> = {
  catalogo: 'Catálogo',
  'demo-navegador': 'Demo en el navegador',
  'en-linea': 'En línea',
};

// Servicios reutilizables de la empresa. El estado refleja lo que existe hoy:
// ninguno se marca «en-linea» mientras no haya un servidor que lo ejecute.
export const SERVICIOS: Servicio[] = [
  {
    id: 'red-segmentada',
    imagen: '/paneles/Lab_09_topologia_laboratorio.webp',
    paneles: true,
    nombre: 'Red segmentada',
    para: 'Equipos que necesitan separar áreas (administración, servidores, invitados) y comprobar las reglas antes de aplicarlas.',
    incluye: ['Siete redes puente 10.40.x.x', 'Enrutador con matriz de reglas iptables', '16 pruebas automáticas de alcance entre segmentos'],
    comoLevantar: 'docker compose up -d  (carpeta wendy-red-segmentada)',
    entrega: ['Plan de direccionamiento', 'Matriz de reglas', 'Informe de 16 de 16 pruebas'],
    estado: 'catalogo',
  },
  {
    id: 'mesa-de-ayuda',
    imagen: '/paneles/Lab_D12_panel_de_soporte.webp',
    paneles: true,
    nombre: 'Mesa de ayuda',
    para: 'Atención de solicitudes e incidentes con prioridades, SLA y plantillas de respuesta.',
    incluye: ['GLPI con MariaDB', 'Configuración por API REST: grupos, categorías, SLA y plantillas', 'Catálogo de servicios y roles'],
    comoLevantar: 'docker compose up -d  (carpeta dana-mesa-de-ayuda)',
    entrega: ['Modelo de servicio', 'Tablero de indicadores', 'Plantillas de respuesta'],
    estado: 'catalogo',
  },
  {
    id: 'auditoria-sitio',
    imagen: '/paneles/Lab_C07_cabeceras_de_seguridad.webp',
    paneles: true,
    nombre: 'Auditoría de seguridad del sitio',
    para: 'Revisión repetible de un sitio web antes de publicarlo: contenedor, dependencias y análisis dinámico.',
    incluye: ['Imagen construida desde el Dockerfile, sin privilegios', 'Trivy, OWASP ZAP y npm audit', 'Catálogo de hallazgos con plazos de remediación'],
    comoLevantar: 'docker compose up -d  (carpeta carlos-seguridad-sitio)',
    entrega: ['Informe de hallazgos', 'Registro de riesgos', 'Cadena de custodia de la evidencia'],
    estado: 'catalogo',
  },
  {
    id: 'pipeline-devsecops',
    imagen: '/paneles/devops/D1_pipeline.webp',
    nombre: 'Pipeline DevSecOps',
    para: 'Proyectos que deben pasar las mismas compuertas de calidad y seguridad antes de llegar a producción.',
    incluye: ['Cuatro workflows reutilizables de GitHub Actions', 'Políticas como código (umbrales y excepciones)', 'Runbooks de despliegue, reversión, incidente y restauración'],
    comoLevantar: 'Copiar .github/workflows y politicas/ al repositorio del proyecto',
    entrega: ['Compuerta de dependencias', 'SBOM del contenedor', 'Aprobación manual para producción'],
    estado: 'demo-navegador',
  },
  {
    id: 'kit-practicas',
    nombre: 'Kit del programa de prácticas',
    para: 'Empresas que reciben practicantes y necesitan evidencia ordenada, verificable y con su propia identidad visual.',
    incluye: ['Carpeta de evidencias en siete secciones', 'Ficha estándar y lista de control de calidad', 'Modelo de certificado para firma electrónica'],
    comoLevantar: 'Plantillas y guía de uso; el generador se ejecuta en el equipo de la empresa',
    entrega: ['Estructura de carpeta', 'Plantillas de documentos', 'Guía de privacidad de datos'],
    estado: 'catalogo',
  },
];

// Nivel de riesgo = probabilidad × impacto (escala 1 a 25).
export const nivelRiesgo = (r: Pick<Riesgo, 'probabilidad' | 'impacto'>): number => r.probabilidad * r.impacto;
export const categoriaRiesgo = (n: number): 'Alto' | 'Medio' | 'Bajo' => (n >= 15 ? 'Alto' : n >= 8 ? 'Medio' : 'Bajo');

export const RESUMEN: Resumen = {
  nombre: 'Ethos Ingeniería',
  version: '1.0.0',
  secciones: [
    {
      id: 'laboratorios',
      nombre: 'Laboratorios técnicos en Docker',
      resumen:
        'Entornos reproducibles que la empresa usa para probar redes, mesa de ayuda y seguridad del sitio sin tocar producción.',
      cifras: [
        { valor: '3', etiqueta: 'laboratorios' },
        { valor: '7', etiqueta: 'redes segmentadas' },
        { valor: '16/16', etiqueta: 'pruebas de red superadas' },
      ],
      elementos: [
        {
          titulo: 'Red segmentada',
          detalle:
            'Siete redes puente 10.40.x.x con un enrutador que aplica una matriz de reglas iptables; 16 pruebas automáticas verifican qué segmento puede hablar con cuál.',
          etiquetas: ['Docker', 'iptables', 'Redes'],
        },
        {
          titulo: 'Mesa de ayuda',
          detalle:
            'GLPI con MariaDB configurado por su API REST (grupos, categorías, SLA y plantillas) para ensayar el ciclo de vida de un ticket.',
          etiquetas: ['GLPI', 'API REST', 'ITSM'],
        },
        {
          titulo: 'Seguridad del sitio',
          detalle:
            'El sitio se construye en un contenedor sin privilegios desde su Dockerfile y se somete a Trivy, ZAP y npm audit; los hallazgos quedan catalogados.',
          etiquetas: ['Trivy', 'OWASP ZAP', 'npm audit'],
        },
      ],
    },
    {
      id: 'devops',
      nombre: 'Ethos DevOps Kit',
      resumen:
        'Plantillas, pipelines reutilizables, políticas como código y runbooks para que cualquier proyecto llegue a producción por las mismas compuertas.',
      cifras: [
        { valor: '4', etiqueta: 'workflows reutilizables' },
        { valor: '4', etiqueta: 'runbooks' },
        { valor: '8', etiqueta: 'documentos de gobierno' },
      ],
      elementos: [
        {
          titulo: 'Pipeline reutilizable',
          detalle:
            'CI de Node, análisis de seguridad (gitleaks, Trivy, Semgrep, ZAP), construcción de imagen y publicación, con acciones fijadas por commit y entradas por variables de entorno.',
          etiquetas: ['GitHub Actions', 'DevSecOps', 'SBOM'],
        },
        {
          titulo: 'Políticas como código',
          detalle:
            'Umbrales de severidad, excepciones con vencimiento y reglas de secretos versionadas: una vulnerabilidad crítica sin excepción aprobada detiene la publicación.',
          etiquetas: ['YAML', 'Gitleaks', 'Control de cambios'],
        },
        {
          titulo: 'Plugin «ethos»',
          detalle:
            'Cinco comandos, tres agentes y un gancho que bloquea commits con secretos; incluye la guía de incorporación de practicantes.',
          etiquetas: ['Automatización', 'Python', 'Seguridad'],
        },
        {
          titulo: 'Runbooks',
          detalle: 'Despliegue, reversión, incidente de seguridad y restauración, con responsables y criterios de salida.',
          etiquetas: ['Operación', 'Continuidad'],
        },
      ],
    },
    {
      id: 'programa',
      nombre: 'Programa de prácticas',
      resumen:
        'Cada practicante entrega documentos verificables con la identidad de la empresa; el material alimenta el ERP, el CRM y el Sistema Académico Inteligente.',
      cifras: [
        { valor: '3', etiqueta: 'carpetas de evidencias de 96 h' },
        { valor: '11', etiqueta: 'certificados emitidos' },
        { valor: '6', etiqueta: 'perfiles de práctica' },
      ],
      elementos: [
        {
          titulo: 'Carpeta de evidencias',
          detalle:
            'Siete secciones normalizadas (cronograma, actividades, productos, evidencias, comunicaciones, informes y certificado) con índice general y control de calidad.',
          etiquetas: ['Documentación', 'Trazabilidad'],
        },
        {
          titulo: 'Generación documental',
          detalle:
            'Motor que produce Word, hojas de cálculo, diagramas y PDF sobre la hoja membretada, con ficha estándar y validación del formato.',
          etiquetas: ['Python', 'OOXML', 'Automatización'],
        },
        {
          titulo: 'Privacidad',
          detalle: 'Las copias que se comparten ocultan cédulas y teléfonos mediante redacción real del PDF.',
          etiquetas: ['LOPDP', 'Redacción de datos'],
        },
      ],
    },
  ],
  // Riesgos del propio programa de ingeniería, evaluados con probabilidad × impacto.
  servicios: SERVICIOS,
  riesgos: [
    { id: 'R-01', riesgo: 'Vulnerabilidad crítica en una dependencia llega a producción', probabilidad: 3, impacto: 5, tratamiento: 'Compuerta de severidad en el pipeline: crítica o alta sin excepción aprobada detiene la publicación.' },
    { id: 'R-02', riesgo: 'Credenciales o claves incluidas en un commit', probabilidad: 3, impacto: 5, tratamiento: 'Gancho local y gitleaks en CI; secretos solo en variables de entorno.' },
    { id: 'R-03', riesgo: 'Datos personales de practicantes en carpetas compartidas', probabilidad: 2, impacto: 4, tratamiento: 'Copias con cédula y teléfono ocultos; originales fuera de la carpeta pública.' },
    { id: 'R-04', riesgo: 'Dependencia de una sola persona para operar la plataforma', probabilidad: 3, impacto: 3, tratamiento: 'Runbooks versionados, RACI y rotación de responsables.' },
    { id: 'R-05', riesgo: 'Cambio sin posibilidad de reversión', probabilidad: 2, impacto: 3, tratamiento: 'Runbook de reversión y despliegues con imagen firmada y versionada.' },
  ],
};

// Detalle de gestión del programa: solo se entrega con un JWT de gerencia o tutoría.
export const PROGRAMA_DETALLE = {
  horasPorPracticante: 96,
  paquetes: 3,
  certificados: { total: 11, firma: 'Gerencia General (firma electrónica)' },
  estados: [
    { estado: 'Carpetas de evidencias entregadas', cantidad: 3 },
    { estado: 'Certificados emitidos', cantidad: 11 },
  ],
} as const;
