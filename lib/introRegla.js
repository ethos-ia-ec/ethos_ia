// Cuándo se muestra la intro de la marca (función pura para poder probarla).
//  - Siempre en una recarga intencional de la portada (F5, botón de actualizar, arrastrar para recargar).
//  - Si no, una vez cada 24 horas por navegador.
//  - Nunca al volver a la portada desde otra página del sitio (navegación interna), ni con «reducir movimiento».
//  - `?intro=1` la fuerza (para enseñarla o probarla).
const DIA_MS = 24 * 60 * 60 * 1000;

function debeMostrarIntro({ pathInicial, tipo, ultima, ahora, forzar = false, reducir = false }) {
  if (reducir) return false;
  if (forzar) return true;
  if (pathInicial !== '/') return false;
  if (tipo === 'reload') return true;
  const t = Number(ultima);
  return !t || ahora - t >= DIA_MS;
}

module.exports = { debeMostrarIntro, DIA_MS };
