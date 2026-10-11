// Capturas reales de los laboratorios técnicos en Docker de ETHOSLAB S.A.S.
// Los archivos viven en public/paneles/*.webp (ver scripts/preparar-paneles.py).
// Se omiten a propósito las capturas que muestran vulnerabilidades abiertas del sitio en producción.

export type GrupoPanel = 'mesa' | 'seguridad' | 'red';

export interface Panel {
  id: string;
  grupo: GrupoPanel;
  titulo: string;
  descripcion: string;
}

export const GRUPOS: { id: GrupoPanel; nombre: string; intro: string }[] = [
  { id: 'mesa', nombre: 'Mesa de ayuda (GLPI)', intro: 'Paneles reales de GLPI configurado por API: grupos, agentes, categorías, SLA, matriz de prioridad y tickets.' },
  { id: 'seguridad', nombre: 'Seguridad del sitio', intro: 'Construcción del contenedor, pruebas, análisis estático, cabeceras, límite de peticiones y escaneo pasivo.' },
  { id: 'red', nombre: 'Red segmentada', intro: 'Siete redes con un enrutador y 16 pruebas de alcance entre segmentos, ejecutadas desde cada equipo del laboratorio.' },
];

export const PANELES: Panel[] = [
  { id: 'Lab_D01_acceso_mesa_de_ayuda', grupo: 'mesa', titulo: 'Acceso a la mesa de ayuda', descripcion: 'Pantalla de inicio de sesión de GLPI en el laboratorio.' },
  { id: 'Lab_D02_grupos_resolutores', grupo: 'mesa', titulo: 'Grupos resolutores', descripcion: 'Mesa de ayuda N1, equipo técnico N2, gerencia, asesoría legal y responsable de seguridad.' },
  { id: 'Lab_D03_agentes_y_perfiles', grupo: 'mesa', titulo: 'Agentes y perfiles', descripcion: 'Usuarios con sus perfiles y grupos asignados bajo el principio de mínimo privilegio.' },
  { id: 'Lab_D04_categorias_de_tickets', grupo: 'mesa', titulo: 'Categorías de tickets', descripcion: 'Catálogo de tipos de solicitud técnica, de atención y de seguridad.' },
  { id: 'Lab_D05_canales_de_entrada', grupo: 'mesa', titulo: 'Canales de entrada', descripcion: 'Orígenes de solicitud: formulario web, correo, asistente virtual y otros.' },
  { id: 'Lab_D06_niveles_de_servicio_SLA', grupo: 'mesa', titulo: 'Niveles de servicio (SLA)', descripcion: 'Tiempos de respuesta y de resolución por prioridad, de P1 crítica a P4 baja.' },
  { id: 'Lab_D07_matriz_de_prioridad', grupo: 'mesa', titulo: 'Matriz de prioridad', descripcion: 'Cruce de urgencia e impacto que determina la prioridad de cada ticket.' },
  { id: 'Lab_D08_lista_de_tickets', grupo: 'mesa', titulo: 'Lista de tickets', descripcion: 'Tickets de prueba con estado, prioridad, solicitante y grupo asignado.' },
  { id: 'Lab_D09_incidente_critico_P1', grupo: 'mesa', titulo: 'Incidente crítico P1', descripcion: 'Ciclo de un incidente de máxima prioridad con su seguimiento.' },
  { id: 'Lab_D10_ticket_escalado_a_N2', grupo: 'mesa', titulo: 'Ticket escalado a N2', descripcion: 'Escalamiento de un caso del primer nivel al equipo técnico.' },
  { id: 'Lab_D11_ticket_resuelto_y_cerrado', grupo: 'mesa', titulo: 'Ticket resuelto y cerrado', descripcion: 'Cierre con solución documentada, último paso del ciclo de vida.' },
  { id: 'Lab_D12_panel_de_soporte', grupo: 'mesa', titulo: 'Panel de soporte', descripcion: 'Tablero con solicitudes, peticiones por estado, categorías y evolución.' },

  { id: 'Lab_C01_construccion_de_la_imagen', grupo: 'seguridad', titulo: 'Construcción de la imagen', descripcion: 'Imagen del sitio construida en tres etapas desde su Dockerfile.' },
  { id: 'Lab_C02_arranque_y_usuario_sin_privilegios', grupo: 'seguridad', titulo: 'Arranque con usuario sin privilegios', descripcion: 'El contenedor corre con un usuario que no es administrador.' },
  { id: 'Lab_C03_sitio_servido_desde_el_contenedor', grupo: 'seguridad', titulo: 'Sitio servido desde el contenedor', descripcion: 'La página de inicio responde desde la imagen construida.' },
  { id: 'Lab_C04_pruebas_automaticas', grupo: 'seguridad', titulo: 'Pruebas automáticas', descripcion: 'Las pruebas del repositorio ejecutadas dentro del contenedor.' },
  { id: 'Lab_C05_analisis_estatico', grupo: 'seguridad', titulo: 'Análisis estático', descripcion: 'Resultado de ESLint sobre el código, con el detalle del aviso.' },
  { id: 'Lab_C07_cabeceras_de_seguridad', grupo: 'seguridad', titulo: 'Cabeceras de seguridad', descripcion: 'Respuesta HTTP con las cabeceras que protegen al sitio.' },
  { id: 'Lab_C08_limite_de_peticiones', grupo: 'seguridad', titulo: 'Límite de peticiones', descripcion: 'El formulario devuelve 429 al superar el máximo de solicitudes por IP.' },
  { id: 'Lab_C10_zap_baseline_local', grupo: 'seguridad', titulo: 'Escaneo pasivo con OWASP ZAP', descripcion: 'Resumen del análisis pasivo contra el contenedor local del laboratorio.' },

  { id: 'Lab_01_inventario_equipos', grupo: 'red', titulo: 'Inventario de equipos', descripcion: 'Equipos virtuales del laboratorio con su procesador, memoria y dirección.' },
  { id: 'Lab_02_instalacion_so_linea_base', grupo: 'red', titulo: 'Línea base del sistema operativo', descripcion: 'Verificación de la imagen, actualizaciones y usuario sin privilegios.' },
  { id: 'Lab_03_diagnostico_conectividad_N1', grupo: 'red', titulo: 'Diagnóstico de conectividad N1', descripcion: 'Diagnóstico por capas: dirección, ruta, puerta de enlace, DNS y trazado.' },
  { id: 'Lab_04_plan_ip_router', grupo: 'red', titulo: 'Plan de direccionamiento', descripcion: 'Una interfaz por segmento en el enrutador, con reenvío de paquetes activo.' },
  { id: 'Lab_05_pruebas_conectividad', grupo: 'red', titulo: 'Pruebas de conectividad', descripcion: 'Pruebas desde el equipo técnico hacia la puerta de enlace y hacia Internet.' },
  { id: 'Lab_06_matriz_reglas_entre_vlan', grupo: 'red', titulo: 'Matriz de reglas entre VLAN', descripcion: '16 pruebas automáticas: lo esperado frente a lo obtenido, con 16 de 16 coincidencias.' },
  { id: 'Lab_07_reglas_firewall_contadores', grupo: 'red', titulo: 'Reglas del firewall con contadores', descripcion: 'Reglas por segmento con paquetes contados tras las pruebas.' },
  { id: 'Lab_08_invitados_aislados', grupo: 'red', titulo: 'Red de invitados aislada', descripcion: 'La red de invitados solo llega a Internet; el resto de segmentos queda bloqueado.' },
  { id: 'Lab_09_topologia_laboratorio', grupo: 'red', titulo: 'Topología del laboratorio', descripcion: 'Siete redes y los contenedores que las componen.' },
  { id: 'Lab_10_metricas_latencia_laboratorio', grupo: 'red', titulo: 'Métricas de latencia', descripcion: 'Latencia hacia el destino de Internet del laboratorio desde tres segmentos.' },
];

export const rutaPanel = (id: string): string => `/paneles/${id}.webp`;
