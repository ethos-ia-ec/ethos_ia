// Fuente única de la navegación del sitio. `seccion` es el id de la sección de la portada que activa cada enlace.
const ENLACES = [
  { etiqueta: 'Servicios', href: '/#servicios', seccion: 'servicios' },
  { etiqueta: 'Ingeniería', href: '/plataforma', seccion: 'ingenieria', mega: true },
  { etiqueta: 'Enfoque ético', href: '/#enfoque', seccion: 'enfoque' },
  { etiqueta: 'Nosotros', href: '/#nosotros', seccion: 'nosotros' },
  { etiqueta: 'Equipo', href: '/equipo', seccion: null },
];

const MEGA = [
  { titulo: 'Paneles de los laboratorios', texto: 'Interfaces reales de la mesa de ayuda, la red y la auditoría.', href: '/plataforma?pestana=paneles', imagen: '/paneles/Lab_D12_panel_de_soporte.webp' },
  { titulo: 'Ethos DevOps Kit', texto: 'Pipeline de diez compuertas, políticas y runbooks.', href: '/plataforma?pestana=devops', imagen: '/paneles/devops/D1_pipeline.webp' },
  { titulo: 'Servicios reutilizables', texto: 'Red, mesa de ayuda, auditoría y kit de prácticas.', href: '/plataforma?pestana=servicios', imagen: '/paneles/Lab_06_matriz_reglas_entre_vlan.webp' },
];

const MEGA_EXTRA = [
  { etiqueta: 'Mapa de riesgos', href: '/plataforma?pestana=riesgos' },
  { etiqueta: 'API y Postman', href: '/plataforma?pestana=api' },
];

module.exports = { ENLACES, MEGA, MEGA_EXTRA };
