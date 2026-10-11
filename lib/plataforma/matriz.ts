// Resultado real de las 16 pruebas automáticas del laboratorio de red segmentada (Salida_laboratorio_matriz_vlan.json).
// OK = el tráfico pasa; BLOQ = el firewall del enrutador lo bloquea.
export interface PruebaRed {
  origen: string;
  destino: string;
  esperado: 'OK' | 'BLOQ';
  obtenido: 'OK' | 'BLOQ';
  resultado: 'CUMPLE' | 'NO CUMPLE';
}

export const PRUEBAS_RED: PruebaRed[] = [
  {
    origen: 'Técnico',
    destino: 'Gestión (SSH 22)',
    esperado: 'OK',
    obtenido: 'OK',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Técnico',
    destino: 'Gestión (ping)',
    esperado: 'BLOQ',
    obtenido: 'BLOQ',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Técnico',
    destino: 'Servidores (443)',
    esperado: 'OK',
    obtenido: 'OK',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Técnico',
    destino: 'Practicantes (ping)',
    esperado: 'OK',
    obtenido: 'OK',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Practicantes',
    destino: 'Técnico (ping)',
    esperado: 'BLOQ',
    obtenido: 'BLOQ',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Practicantes',
    destino: 'Servidores (443)',
    esperado: 'BLOQ',
    obtenido: 'BLOQ',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Practicantes',
    destino: 'Impresión (9100)',
    esperado: 'OK',
    obtenido: 'OK',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Administración',
    destino: 'Impresión (9100)',
    esperado: 'OK',
    obtenido: 'OK',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Administración',
    destino: 'Técnico (ping)',
    esperado: 'BLOQ',
    obtenido: 'BLOQ',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Administración',
    destino: 'Internet (443)',
    esperado: 'OK',
    obtenido: 'OK',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Servidores',
    destino: 'Internet (443)',
    esperado: 'OK',
    obtenido: 'OK',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Servidores',
    destino: 'Internet (80)',
    esperado: 'BLOQ',
    obtenido: 'BLOQ',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Invitados',
    destino: 'Internet (443)',
    esperado: 'OK',
    obtenido: 'OK',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Invitados',
    destino: 'Técnico (ping)',
    esperado: 'BLOQ',
    obtenido: 'BLOQ',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Invitados',
    destino: 'Gestión (SSH 22)',
    esperado: 'BLOQ',
    obtenido: 'BLOQ',
    resultado: 'CUMPLE'
  },
  {
    origen: 'Invitados',
    destino: 'Servidores (443)',
    esperado: 'BLOQ',
    obtenido: 'BLOQ',
    resultado: 'CUMPLE'
  }
];
