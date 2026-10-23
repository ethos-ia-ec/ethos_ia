// Colector de Ethos SecMon: cada SECMON_INTERVALO_MIN minutos mide el sitio propio, guarda los
// resultados en PostgreSQL local, abre o cierra incidentes, marca hallazgos corregidos cuando su
// chequeo pasa y, si está configurado, envía un resumen firmado al panel del sitio web.
const crypto = require('crypto');
const { Pool } = require('pg');
const { medir } = require('./sondas');
const { evaluarTodo, severidadDe } = require('./chequeos');

const DOMINIO = process.env.SECMON_DOMINIO || 'ethosia.tech';
const INTERVALO_MIN = Math.max(5, Number(process.env.SECMON_INTERVALO_MIN || 30));
const pool = new Pool({ connectionString: process.env.SECMON_DB_URL });

async function guardar(resultados) {
  const db = await pool.connect();
  try {
    await db.query('begin');
    const { rows: [ej] } = await db.query('insert into ejecuciones (objetivo) values ($1) returning id', [`www.${DOMINIO}`]);
    for (const x of resultados) {
      await db.query('insert into resultados (ejecucion, chequeo, estado, valor, detalle) values ($1,$2,$3,$4,$5)', [ej.id, x.codigo, x.estado, x.valor, x.detalle]);
      if (x.estado === 'falla') {
        await db.query(`insert into incidentes (chequeo, severidad, descripcion) values ($1,$2,$3)
                        on conflict (chequeo) where cerrado_en is null do nothing`, [x.codigo, severidadDe(x.codigo), x.detalle]);
      } else if (x.estado === 'ok') {
        await db.query('update incidentes set cerrado_en = now() where chequeo = $1 and cerrado_en is null', [x.codigo]);
      }
    }
    // Un hallazgo queda «Corregido» cuando todos sus chequeos pasan; vuelve a «Abierto» si reaparece.
    await db.query(`
      update hallazgos h set estado = 'Corregido', corregido = now()
      where h.estado in ('Abierto','En corrección')
        and exists (select 1 from v_ultimo_resultado u where u.hallazgo = h.codigo)
        and not exists (select 1 from v_ultimo_resultado u where u.hallazgo = h.codigo and u.estado <> 'ok')`);
    await db.query(`
      update hallazgos h set estado = 'Abierto', corregido = null
      where h.estado = 'Corregido'
        and exists (select 1 from v_ultimo_resultado u where u.hallazgo = h.codigo and u.estado = 'falla')`);
    const ok = resultados.filter((x) => x.estado === 'ok').length;
    await db.query('update ejecuciones set fin = now(), aprobados = $2, fallidos = $3 where id = $1', [ej.id, ok, resultados.length - ok]);
    await db.query('commit');
    return ej.id;
  } catch (e) {
    await db.query('rollback');
    throw e;
  } finally {
    db.release();
  }
}

// Resumen sin datos personales ni secretos: estados de chequeos, conteos y hallazgos por severidad.
async function resumen() {
  const q = (s) => pool.query(s).then((r) => r.rows);
  const [tot] = await q('select * from v_resumen');
  const [disp] = await q('select * from v_disponibilidad_30d');
  const chequeos = await q('select chequeo as codigo, nombre, categoria, estado, valor, detalle, medido_en from v_ultimo_resultado order by chequeo');
  const hallazgos = await q(`select codigo, titulo, severidad, estado, detectado,
                               detectado + plazo_dias as vence from hallazgos order by codigo`);
  return { dominio: DOMINIO, generado: new Date().toISOString(), totales: tot, disponibilidad: disp, chequeos, hallazgos };
}

async function publicar(datos) {
  const url = process.env.SECMON_PANEL_URL; const clave = process.env.SECMON_INGEST_KEY;
  if (!url || !clave) return 'sin publicar (panel no configurado)';
  const cuerpo = JSON.stringify(datos);
  const firma = crypto.createHmac('sha256', clave).update(cuerpo).digest('hex');
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-SecMon-Firma': firma }, body: cuerpo });
  return `panel respondió ${res.status}`;
}

async function ciclo() {
  const t0 = Date.now();
  try {
    const med = await medir(DOMINIO);
    const res = evaluarTodo(med);
    const id = await guardar(res);
    await pool.query('select purgar_antiguos()');
    const pub = await publicar(await resumen()).catch((e) => `error al publicar: ${e.message}`);
    const malos = res.filter((x) => x.estado !== 'ok').map((x) => `${x.codigo}:${x.estado}`);
    console.log(`[secmon] ejecución ${id} · ${res.length - malos.length}/${res.length} ok · ${malos.join(' ') || 'sin alertas'} · ${pub} · ${Date.now() - t0} ms`);
  } catch (e) {
    console.error('[secmon] error en el ciclo:', e.message);
  }
}

if (require.main === module) {
  const unaVez = process.argv.includes('--una-vez');
  ciclo().then(() => {
    if (unaVez) return pool.end();
    setInterval(ciclo, INTERVALO_MIN * 60_000);
    console.log(`[secmon] vigilando www.${DOMINIO} cada ${INTERVALO_MIN} min`);
  });
}

module.exports = { ciclo, resumen };
