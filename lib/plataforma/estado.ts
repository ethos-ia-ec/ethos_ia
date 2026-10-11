// Estado de la demostración en vivo (mesa de ayuda GLPI alojada en un equipo de la empresa).
// El sitio solo la anuncia «En línea» cuando el servidor responde; si el equipo está apagado
// o el túnel caído, la interfaz vuelve a las capturas sin mostrar errores.

export interface EstadoDemo {
  enLinea: boolean;
  url?: string;
  usuario?: string;
  clave?: string; // credencial PÚBLICA de solo lectura, pensada para visitantes
}

export interface ConfigDemo {
  url?: string;
  usuario?: string;
  clave?: string;
}

const FUERA: EstadoDemo = { enLinea: false };

export async function consultarEstado(
  cfg: ConfigDemo,
  consultar: typeof fetch = fetch,
  esperaMs = 3000
): Promise<EstadoDemo> {
  if (!cfg.url) return FUERA;

  let destino: URL;
  try {
    destino = new URL(cfg.url);
  } catch {
    return FUERA;
  }
  // Solo se anuncian demostraciones servidas por HTTPS (el túnel siempre lo usa).
  if (destino.protocol !== 'https:') return FUERA;

  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), esperaMs);
  try {
    const r = await consultar(destino.toString(), { method: 'HEAD', signal: control.signal, redirect: 'manual' });
    // GLPI responde 200 o redirige (3xx) a su pantalla de acceso: ambos indican servicio vivo.
    const vivo = r.status >= 200 && r.status < 400;
    if (!vivo) return FUERA;
    return { enLinea: true, url: destino.toString(), usuario: cfg.usuario || undefined, clave: cfg.clave || undefined };
  } catch {
    return FUERA;
  } finally {
    clearTimeout(temporizador);
  }
}
