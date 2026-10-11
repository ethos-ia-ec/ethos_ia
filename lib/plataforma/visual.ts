// Datos de las visualizaciones de «Ethos Ingeniería». Todo proviene de entregables reales:
// plan de direccionamiento del laboratorio de red, pipeline del Ethos DevOps Kit y estructura de la carpeta de evidencias.

export interface Segmento {
  id: string;
  nombre: string;
  vlan: string;
  cidr: string;
  funcion: string;
}

// Plan de direccionamiento del laboratorio (Lab_04): un segmento por interfaz del enrutador.
export const SEGMENTOS: Segmento[] = [
  { id: 'Gestión', nombre: 'Gestión', vlan: 'VLAN 10', cidr: '10.40.10.0/27', funcion: 'Administración de equipos de red; solo se accede por SSH desde el segmento técnico.' },
  { id: 'Administración', nombre: 'Administración', vlan: 'VLAN 20', cidr: '10.40.20.0/26', funcion: 'Puestos del personal administrativo, con salida a Internet e impresión.' },
  { id: 'Técnico', nombre: 'Técnico', vlan: 'VLAN 30', cidr: '10.40.30.0/26', funcion: 'Equipos del área técnica, con permiso para gestionar y llegar a servidores.' },
  { id: 'Practicantes', nombre: 'Practicantes', vlan: 'VLAN 35', cidr: '10.40.35.0/26', funcion: 'Puestos de practicantes: imprimen y salen a Internet, sin acceso a servidores.' },
  { id: 'Servidores', nombre: 'Servidores', vlan: 'VLAN 40', cidr: '10.40.40.0/27', funcion: 'Servicios internos; solo salen a Internet por HTTPS.' },
  { id: 'Impresión', nombre: 'Impresión', vlan: 'VLAN 60', cidr: '10.40.60.0/28', funcion: 'Impresoras de red, accesibles únicamente por el puerto 9100.' },
  { id: 'Invitados', nombre: 'Invitados', vlan: 'VLAN 90', cidr: '10.40.90.0/24', funcion: 'Red de visitas aislada: solo llega a Internet por HTTPS.' },
  { id: 'Internet', nombre: 'Internet', vlan: 'WAN', cidr: '203.0.113.0/24', funcion: 'Segmento externo del laboratorio, al otro lado del enrutador.' },
];

export interface PasoPipeline {
  n: number;
  nombre: string;
  herramienta: string;
  que: string;
  bloquea: string;
  tipo: 'integracion' | 'liberacion' | 'aprobacion';
}

// Pipeline estándar del Ethos DevOps Kit (docs/fig/D1_pipeline.png).
export const PASOS_PIPELINE: PasoPipeline[] = [
  { n: 1, nombre: 'Calidad', herramienta: 'Lint, pruebas y compilación', que: 'Verifica estilo, ejecuta todas las pruebas y compila el proyecto.', bloquea: 'Cualquier prueba que falle o error de compilación.', tipo: 'integracion' },
  { n: 2, nombre: 'Secretos', herramienta: 'gitleaks', que: 'Busca claves, tokens y contraseñas incluidos por error en el código.', bloquea: 'Cualquier hallazgo de secreto.', tipo: 'integracion' },
  { n: 3, nombre: 'Dependencias', herramienta: 'npm audit y Trivy', que: 'Revisa las librerías en busca de vulnerabilidades conocidas.', bloquea: 'Vulnerabilidades críticas o altas sin excepción vigente.', tipo: 'integracion' },
  { n: 4, nombre: 'Análisis estático', herramienta: 'Semgrep · OWASP Top 10', que: 'Analiza el código fuente en busca de patrones inseguros.', bloquea: 'Hallazgos de severidad ERROR.', tipo: 'integracion' },
  { n: 5, nombre: 'Imagen', herramienta: 'Docker', que: 'Construye la imagen del contenedor con usuario no administrador.', bloquea: 'Imagen que corra como administrador.', tipo: 'integracion' },
  { n: 6, nombre: 'Escaneo de imagen y SBOM', herramienta: 'Trivy · CycloneDX', que: 'Escanea la imagen y genera la lista de componentes (SBOM).', bloquea: 'Vulnerabilidades críticas o altas en la imagen; SBOM obligatorio.', tipo: 'integracion' },
  { n: 7, nombre: 'Firma', herramienta: 'cosign', que: 'Firma la imagen para poder comprobar su origen.', bloquea: 'Imagen sin firmar en la rama principal.', tipo: 'liberacion' },
  { n: 8, nombre: 'Staging', herramienta: 'Pruebas de humo · OWASP ZAP', que: 'Despliega en un entorno de prueba y ejecuta un análisis pasivo.', bloquea: 'Fallo en las pruebas de humo.', tipo: 'liberacion' },
  { n: 9, nombre: 'Aprobación manual', herramienta: 'Gerencia o tutora técnica', que: 'Una persona responsable autoriza el paso a producción.', bloquea: 'Sin aprobación no se publica.', tipo: 'aprobacion' },
  { n: 10, nombre: 'Producción', herramienta: 'Despliegue', que: 'Publicación final, con runbook de reversión disponible.', bloquea: 'Solo llega aquí lo que pasó las nueve compuertas anteriores.', tipo: 'liberacion' },
];

export interface SeccionEvidencia {
  carpeta: string;
  contenido: string;
  archivos: string[];
}

// Estructura normalizada de la carpeta de evidencias del programa de prácticas.
export const EVIDENCIAS: SeccionEvidencia[] = [
  { carpeta: '01. Cronograma', contenido: 'Plan de actividades aprobado y firmado.', archivos: ['Cronograma aprobado en el SGA', 'Cronograma de prácticas firmado'] },
  { carpeta: '02. Actividades realizadas', contenido: 'Registro de lo ejecutado, actividad por actividad.', archivos: ['Bitácora de actividades', 'Informe de avance'] },
  { carpeta: '03. Productos o recursos elaborados', contenido: 'Un producto por actividad, con ficha estándar.', archivos: ['P01 … P09 en Word y PDF', 'Hojas de cálculo y diagramas'] },
  { carpeta: '04. Evidencia fotográfica', contenido: 'Capturas reales del trabajo y salidas de verificación.', archivos: ['Capturas del laboratorio', 'Salidas de comandos con fecha y hora'] },
  { carpeta: '05. Reuniones y comunicaciones', contenido: 'Canales y directrices del programa.', archivos: ['Registro de reuniones y comunicaciones', 'Carta de vinculación (datos ocultos)'] },
  { carpeta: '06. Informes', contenido: 'Informe técnico final y del SGA.', archivos: ['Informe final del practicante', 'Informe del SGA (datos ocultos)'] },
  { carpeta: '07. Certificado', contenido: 'Certificado de prácticas emitido por la empresa.', archivos: ['Certificado (cédula oculta)', 'Nota de uso'] },
];

export const ETAPAS_PROGRAMA = [
  { n: 1, titulo: 'Admisión', texto: 'Se lee el cronograma, la carta de vinculación y el informe del SGA.' },
  { n: 2, titulo: 'Perfil', texto: 'Se elige el perfil (ciberseguridad, soporte, redes…) y su aporte al ERP, CRM o Sistema Académico.' },
  { n: 3, titulo: 'Producción', texto: 'Un documento verificable por actividad, sobre la hoja membretada.' },
  { n: 4, titulo: 'Laboratorio', texto: 'Cada entregable se comprueba en un laboratorio Docker y se capturan las pantallas.' },
  { n: 5, titulo: 'Calidad', texto: 'Se valida el formato, se revisa cada página y se ocultan los datos personales.' },
  { n: 6, titulo: 'Certificado', texto: 'La empresa emite el certificado, que firma Gerencia con firma electrónica.' },
];

export const DOCUMENTOS_KIT: { id: string; titulo: string }[] = [
  { id: '01', titulo: 'Visión y alcance' },
  { id: '02', titulo: 'Arquitectura' },
  { id: '03', titulo: 'Modelo operativo y RACI' },
  { id: '04', titulo: 'Política de desarrollo seguro (SDLC)' },
  { id: '05', titulo: 'Hoja de ruta de 90 días' },
  { id: '06', titulo: 'ADR-001: entornos' },
  { id: '07', titulo: 'Reunión con la empresa vinculada' },
  { id: '08', titulo: 'Informe del piloto' },
];
