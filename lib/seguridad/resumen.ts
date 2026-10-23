// Validación y firma del resumen que envía el colector local de Ethos SecMon (seguridad/colector).
import crypto from 'crypto';
import { z } from 'zod';

const Estado = z.enum(['ok', 'alerta', 'falla', 'error']);
const texto = (max: number) => z.string().max(max).nullable().optional();
const numero = z.union([z.number(), z.string().regex(/^\d+(\.\d+)?$/)]).nullable().optional();

export const ResumenSchema = z.object({
  dominio: z.string().regex(/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i).max(120),
  generado: z.string().datetime({ offset: true }),
  totales: z.object({
    activos: numero, controles: numero, hallazgos_abiertos: numero, hallazgos_corregidos: numero,
    chequeos_ok: numero, chequeos_con_alerta: numero, incidentes_abiertos: numero, ultima_ejecucion: texto(40),
  }),
  disponibilidad: z.object({ porcentaje: numero, ms_promedio: numero, mediciones: numero }).nullable().optional(),
  chequeos: z.array(z.object({
    codigo: z.string().regex(/^C-\d{2}$/), nombre: z.string().max(120), categoria: z.string().max(40),
    estado: Estado, valor: texto(200), detalle: texto(300), medido_en: z.string().max(40),
  })).max(60),
  hallazgos: z.array(z.object({
    codigo: z.string().regex(/^H-\d{2}$/), titulo: z.string().max(200),
    severidad: z.enum(['Alta', 'Media', 'Baja', 'Informativa']),
    estado: z.enum(['Abierto', 'En corrección', 'Corregido', 'Aceptado']),
    detectado: z.string().max(40), vence: z.string().max(40),
  })).max(100),
});

export type Resumen = z.infer<typeof ResumenSchema>;

export const firmar = (cuerpo: string, clave: string): string =>
  crypto.createHmac('sha256', clave).update(cuerpo).digest('hex');

// Comprueba la firma HMAC-SHA256 del cuerpo exacto recibido, en tiempo constante.
export function firmaValida(cuerpo: string, firma: string | undefined, clave: string | undefined): boolean {
  if (!clave || !firma || !/^[0-9a-f]{64}$/i.test(firma)) return false;
  const a = Buffer.from(firmar(cuerpo, clave), 'hex');
  const b = Buffer.from(firma, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Puntaje 0–100: proporción de chequeos en 'ok' (las alertas cuentan la mitad).
export function puntaje(r: Pick<Resumen, 'chequeos'>): number {
  const medidos = r.chequeos.filter((c) => c.estado !== 'error');
  if (!medidos.length) return 0;
  const pts = medidos.reduce((s, c) => s + (c.estado === 'ok' ? 1 : c.estado === 'alerta' ? 0.5 : 0), 0);
  return Math.round((100 * pts) / medidos.length);
}
