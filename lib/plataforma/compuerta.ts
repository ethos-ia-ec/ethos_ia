// Compuerta de dependencias del pipeline: aplica los umbrales de
// «Ethos DevOps Kit/politicas/umbrales.yml» a la salida de `npm audit --json`.
// Toda la lógica es pura (sin red ni estado) para poder probarla y ejecutarla
// en el navegador sin enviar el JSON pegado a ningún servidor.
import { z } from 'zod';

export type Severidad = 'critical' | 'high' | 'moderate' | 'low' | 'info';

// Espejo de umbrales.yml: compuertas.vulnerabilidades_dependencias.bloquea y plazos_de_remediacion_dias.
export const UMBRALES = {
  bloquea: ['critical', 'high'] as Severidad[],
  plazoDias: { critical: 7, high: 30, moderate: 90, low: 180, info: 180 } as Record<Severidad, number>,
};

const ORDEN: Severidad[] = ['critical', 'high', 'moderate', 'low', 'info'];

const Vulnerabilidad = z.object({
  name: z.string().optional(),
  severity: z.enum(['critical', 'high', 'moderate', 'low', 'info']),
  via: z.array(z.union([z.string(), z.object({ title: z.string().optional(), url: z.string().optional() }).passthrough()])).optional(),
  fixAvailable: z.union([z.boolean(), z.object({ name: z.string().optional(), version: z.string().optional() }).passthrough()]).optional(),
});

const Auditoria = z.object({ vulnerabilities: z.record(z.string(), Vulnerabilidad) });

export interface Excepcion {
  hallazgo: string; // nombre del paquete o identificador del hallazgo
  vence: string; // AAAA-MM-DD; una excepción vencida deja de contar
}

export interface Hallazgo {
  paquete: string;
  severidad: Severidad;
  titulo: string;
  plazoDias: number;
  conParche: boolean;
  bloquea: boolean;
  exceptuado: boolean;
}

export type Evaluacion =
  | { ok: false; error: string }
  | {
      ok: true;
      pasa: boolean;
      conteo: Record<Severidad, number>;
      hallazgos: Hallazgo[];
      bloqueantes: Hallazgo[];
    };

const vigente = (e: Excepcion, hoy: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(e.vence) && e.vence >= hoy;

export function evaluarAuditoria(
  entrada: unknown,
  excepciones: Excepcion[] = [],
  hoy: string = new Date().toISOString().slice(0, 10)
): Evaluacion {
  let datos: unknown = entrada;
  if (typeof entrada === 'string') {
    if (!entrada.trim()) return { ok: false, error: 'Pega la salida de «npm audit --json».' };
    try {
      datos = JSON.parse(entrada);
    } catch {
      return { ok: false, error: 'El texto no es un JSON válido.' };
    }
  }

  const r = Auditoria.safeParse(datos);
  if (!r.success) {
    return { ok: false, error: 'El JSON no tiene el formato de «npm audit --json» (falta «vulnerabilities»).' };
  }

  const activas = new Set(excepciones.filter((e) => vigente(e, hoy)).map((e) => e.hallazgo));
  const conteo: Record<Severidad, number> = { critical: 0, high: 0, moderate: 0, low: 0, info: 0 };

  const hallazgos: Hallazgo[] = Object.entries(r.data.vulnerabilities).map(([clave, v]) => {
    const paquete = v.name ?? clave;
    conteo[v.severity] += 1;
    const titulo = (v.via ?? []).map((x) => (typeof x === 'string' ? `por ${x}` : x.title)).find(Boolean) ?? 'Sin descripción';
    return {
      paquete,
      severidad: v.severity,
      titulo,
      plazoDias: UMBRALES.plazoDias[v.severity],
      conParche: Boolean(v.fixAvailable),
      bloquea: UMBRALES.bloquea.includes(v.severity),
      exceptuado: activas.has(paquete),
    };
  });

  hallazgos.sort((a, b) => ORDEN.indexOf(a.severidad) - ORDEN.indexOf(b.severidad) || a.paquete.localeCompare(b.paquete));
  const bloqueantes = hallazgos.filter((h) => h.bloquea && !h.exceptuado);
  return { ok: true, pasa: bloqueantes.length === 0, conteo, hallazgos, bloqueantes };
}

// Ejemplo ficticio para probar la herramienta; no corresponde a ningún proyecto real.
export const EJEMPLO_AUDITORIA = JSON.stringify(
  {
    auditReportVersion: 2,
    vulnerabilities: {
      'paquete-ejemplo-a': { name: 'paquete-ejemplo-a', severity: 'critical', via: [{ title: 'Ejecución remota de código (ejemplo)' }], fixAvailable: true },
      'paquete-ejemplo-b': { name: 'paquete-ejemplo-b', severity: 'moderate', via: ['paquete-ejemplo-a'], fixAvailable: false },
      'paquete-ejemplo-c': { name: 'paquete-ejemplo-c', severity: 'low', via: [{ title: 'Consumo excesivo de memoria (ejemplo)' }], fixAvailable: true },
    },
  },
  null,
  2
);
