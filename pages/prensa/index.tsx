import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import type { Bloque, Noticia } from '../../lib/noticias';
import BotonesSociales from '../../components/cuenta/BotonesSociales';
import { miRol, revalidar, sb, subirMedio, type Rol } from '../../lib/prensa/cliente';
import { aSlug, idDeVideo, LIMITE_RESUMEN_SEO, LIMITE_TITULO_SEO, problemasParaPublicar } from '../../lib/prensa/validar';

// Ethos Prensa: sala de redacción de Ethos Noticias. Crear, editar, enviar a revisión, publicar o programar,
// despublicar, archivar y restaurar versiones, sin tocar código. Los permisos los aplica la base (RLS).

type Estado = 'borrador' | 'revision' | 'publicada' | 'archivada';
type Fila = {
  id?: string; slug: string; titulo: string; resumen: string; categoria: Noticia['categoria']; etiquetas: string[];
  cuerpo: Bloque[]; fuentes: { texto: string; url: string }[]; imagen: { src: string; alt: string; credito?: string; ancho: number; alto: number } | null;
  destacada: boolean; estado: Estado; publicada_en: string | null; autor_nombre: string | null; actualizado_en?: string;
};
type Version = { id: number; estado: string; guardado_en: string; datos: Fila };

const NUEVA: Fila = { slug: '', titulo: '', resumen: '', categoria: 'Comunidad', etiquetas: [], cuerpo: [{ tipo: 'p', texto: '' }], fuentes: [], imagen: null, destacada: false, estado: 'borrador', publicada_en: null, autor_nombre: null };
const ETIQUETA_ESTADO: Record<Estado, string> = { borrador: 'Borrador', revision: 'En revisión', publicada: 'Publicada', archivada: 'Archivada' };
const CATEGORIAS: Noticia['categoria'][] = ['Medios', 'Comunidad', 'Producto', 'Equipo'];

export default function Prensa() {
  const [sesion, setSesion] = useState<{ correo: string } | null | undefined>(undefined);
  const [rol, setRol] = useState<Rol | null>(null);
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [aviso, setAviso] = useState('');
  const [lista, setLista] = useState<Fila[]>([]);
  const [filtro, setFiltro] = useState<Estado | 'todas'>('todas');
  const [nota, setNota] = useState<Fila | null>(null);
  const [versiones, setVersiones] = useState<Version[]>([]);
  const [ocupado, setOcupado] = useState(false);

  const cargar = useCallback(async () => {
    const { data, error } = await sb().from('noticias').select('*').order('actualizado_en', { ascending: false });
    if (error) setAviso(error.message);
    else setLista(data as Fila[]);
  }, []);

  useEffect(() => {
    const iniciar = async (correoSesion?: string) => {
      setSesion(correoSesion ? { correo: correoSesion } : null);
      if (correoSesion) {
        setRol(await miRol());
        cargar();
      }
    };
    sb().auth.getSession().then(({ data }) => iniciar(data.session?.user.email));
    const { data } = sb().auth.onAuthStateChange((_e, s) => iniciar(s?.user.email));
    return () => data.subscription.unsubscribe();
  }, [cargar]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (clave) {
      const { error } = await sb().auth.signInWithPassword({ email: correo, password: clave });
      setAviso(error ? 'Correo o contraseña incorrectos.' : '');
      return;
    }
    const { error } = await sb().auth.signInWithOtp({ email: correo, options: { emailRedirectTo: `${location.origin}/prensa`, shouldCreateUser: false } });
    setAviso(error ? error.message : 'Te enviamos un enlace de acceso a tu correo.');
  }

  async function abrir(f: Fila | null) {
    setAviso('');
    setNota(f ? structuredClone(f) : { ...structuredClone(NUEVA) });
    setVersiones([]);
    if (f?.id) {
      const { data } = await sb().from('noticias_versiones').select('id,estado,guardado_en,datos').eq('noticia_id', f.id).order('guardado_en', { ascending: false }).limit(20);
      setVersiones((data as Version[]) ?? []);
    }
  }

  async function guardar(estado: Estado, publicarEn?: string) {
    if (!nota) return;
    const slug = nota.slug || aSlug(nota.titulo);
    if (estado === 'publicada') {
      const p = problemasParaPublicar({ ...nota, slug });
      if (p.length) { setAviso(p.join(' ')); return; }
    }
    setOcupado(true);
    const { data: u } = await sb().auth.getUser();
    const fila = { ...nota, slug, estado, publicada_en: estado === 'publicada' ? (publicarEn ? new Date(publicarEn).toISOString() : nota.publicada_en ?? new Date().toISOString()) : nota.publicada_en };
    delete (fila as Partial<Fila>).actualizado_en;
    const consulta = nota.id
      ? sb().from('noticias').update(fila).eq('id', nota.id).select().single()
      : sb().from('noticias').insert({ ...fila, autor_id: u.user?.id, autor_nombre: nota.autor_nombre || u.user?.email }).select().single();
    const { data, error } = await consulta;
    setOcupado(false);
    if (error) { setAviso(error.message.includes('duplicate') ? 'Ya existe una nota con esa dirección (slug).' : error.message); return; }
    if (rol !== 'redactor') await revalidar(slug);
    setAviso(estado === 'publicada' ? (new Date(fila.publicada_en!) > new Date() ? 'Nota programada.' : 'Nota publicada.') : 'Cambios guardados.');
    await abrir(data as Fila);
    cargar();
  }

  async function borrarDefinitivo() {
    if (!nota?.id || !confirm('Se eliminará la nota de forma definitiva. Esta acción no se puede deshacer.')) return;
    const { error } = await sb().from('noticias').delete().eq('id', nota.id);
    if (error) { setAviso(error.message); return; }
    await revalidar(nota.slug);
    setNota(null);
    cargar();
  }

  const editar = (cambios: Partial<Fila>) => setNota((n) => (n ? { ...n, ...cambios } : n));
  const editarBloque = (i: number, b: Bloque) => editar({ cuerpo: nota!.cuerpo.map((x, j) => (j === i ? b : x)) });
  const mover = (i: number, d: number) => {
    const c = [...nota!.cuerpo];
    const [x] = c.splice(i, 1);
    c.splice(Math.max(0, Math.min(c.length, i + d)), 0, x);
    editar({ cuerpo: c });
  };

  async function subirPrincipal(archivo?: File) {
    if (!archivo) return;
    try {
      setOcupado(true);
      const m = await subirMedio(archivo);
      editar({ imagen: { src: m.src, alt: nota?.imagen?.alt ?? '', credito: nota?.imagen?.credito ?? '', ancho: m.ancho, alto: m.alto } });
    } catch (e) { setAviso((e as Error).message); } finally { setOcupado(false); }
  }

  async function agregarMedio(archivo?: File) {
    if (!archivo || !nota) return;
    try {
      setOcupado(true);
      const m = await subirMedio(archivo);
      const b: Bloque = m.tipo === 'video'
        ? { tipo: 'video', proveedor: 'archivo', id: m.src, titulo: '' }
        : { tipo: 'imagen', src: m.src, alt: '', credito: '', pie: '', ancho: m.ancho, alto: m.alto };
      editar({ cuerpo: [...nota.cuerpo, b] });
    } catch (e) { setAviso((e as Error).message); } finally { setOcupado(false); }
  }

  const puedePublicar = rol === 'editor' || rol === 'admin';
  const visibles = lista.filter((f) => filtro === 'todas' || f.estado === filtro);

  return (
    <div className="prensa">
      <Head>
        <title>Ethos Prensa</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <header className="barra">
        <strong>Ethos Prensa</strong>
        {sesion && <span>{sesion.correo} · {rol ?? 'sin acceso de prensa'} <button onClick={() => sb().auth.signOut()}>Salir</button></span>}
      </header>

      {aviso && <p className="aviso" role="status">{aviso}</p>}

      {sesion === null && (
        <form className="tarjeta acceso" onSubmit={entrar}>
          <h1>Acceso de la redacción</h1>
          <BotonesSociales destino="/prensa" />
          <p className="o"><span>o con su correo</span></p>
          <label>Correo institucional<input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} /></label>
          <label>Contraseña <small>(opcional: sin ella recibes un enlace en tu correo)</small><input type="password" autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} /></label>
          <button className="prim">{clave ? 'Entrar' : 'Recibir enlace de acceso'}</button>
        </form>
      )}

      {sesion && !rol && <p className="tarjeta">Tu cuenta no tiene un rol de prensa. Pide a la gerencia que te asigne como redactor o editor.</p>}

      {sesion && rol && !nota && (
        <main className="tarjeta">
          <div className="fila">
            <h1>Noticias</h1>
            <button className="prim" onClick={() => abrir(null)}>Nueva noticia</button>
          </div>
          <div className="filtros">
            {(['todas', 'borrador', 'revision', 'publicada', 'archivada'] as const).map((e) => (
              <button key={e} className={filtro === e ? 'on' : ''} onClick={() => setFiltro(e)}>{e === 'todas' ? 'Todas' : ETIQUETA_ESTADO[e]}</button>
            ))}
          </div>
          <table>
            <thead><tr><th>Título</th><th>Estado</th><th>Fecha</th><th>Autor</th></tr></thead>
            <tbody>
              {visibles.map((f) => (
                <tr key={f.id} onClick={() => abrir(f)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && abrir(f)}>
                  <td>{f.titulo}</td>
                  <td><span className={`est ${f.estado}`}>{f.estado === 'publicada' && f.publicada_en && new Date(f.publicada_en) > new Date() ? 'Programada' : ETIQUETA_ESTADO[f.estado]}</span></td>
                  <td>{(f.publicada_en ?? f.actualizado_en ?? '').slice(0, 10)}</td>
                  <td>{f.autor_nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      )}

      {sesion && rol && nota && (
        <main className="editor">
          <section className="tarjeta">
            <button onClick={() => { setNota(null); setAviso(''); }}>← Volver al listado</button>
            <h1>{nota.id ? 'Editar noticia' : 'Nueva noticia'} <span className={`est ${nota.estado}`}>{ETIQUETA_ESTADO[nota.estado]}</span></h1>

            <label>Título <small>{nota.titulo.length}/{LIMITE_TITULO_SEO}</small>
              <input value={nota.titulo} maxLength={140} onChange={(e) => editar({ titulo: e.target.value, ...(!nota.id ? { slug: aSlug(e.target.value) } : {}) })} />
            </label>
            <label>Bajada (resumen) <small>{nota.resumen.length}/{LIMITE_RESUMEN_SEO}</small>
              <textarea rows={2} value={nota.resumen} maxLength={300} onChange={(e) => editar({ resumen: e.target.value })} />
            </label>
            <div className="dos">
              <label>Dirección <small>ethosia.tech/noticias/…</small><input value={nota.slug} onChange={(e) => editar({ slug: aSlug(e.target.value) })} disabled={nota.estado === 'publicada'} /></label>
              <label>Categoría<select value={nota.categoria} onChange={(e) => editar({ categoria: e.target.value as Noticia['categoria'] })}>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}</select></label>
            </div>
            <label>Firma del autor<input value={nota.autor_nombre ?? ''} onChange={(e) => editar({ autor_nombre: e.target.value })} /></label>

            <h2>Imagen principal</h2>
            {nota.imagen?.src && <img className="prev" src={nota.imagen.src} alt="" />}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => subirPrincipal(e.target.files?.[0])} />
            {nota.imagen && (
              <div className="dos">
                <label>Texto alternativo (qué se ve)<input value={nota.imagen.alt} onChange={(e) => editar({ imagen: { ...nota.imagen!, alt: e.target.value } })} /></label>
                <label>Crédito de la foto<input value={nota.imagen.credito ?? ''} onChange={(e) => editar({ imagen: { ...nota.imagen!, credito: e.target.value } })} /></label>
              </div>
            )}

            <h2>Cuerpo</h2>
            {nota.cuerpo.map((b, i) => (
              <div key={i} className="bloque">
                <div className="herr">
                  <span>{{ p: 'Párrafo', h2: 'Subtítulo', lista: 'Lista', cita: 'Cita', imagen: 'Foto', video: 'Video' }[b.tipo]}</span>
                  <button onClick={() => mover(i, -1)} aria-label="Subir">↑</button>
                  <button onClick={() => mover(i, 1)} aria-label="Bajar">↓</button>
                  <button onClick={() => editar({ cuerpo: nota.cuerpo.filter((_, j) => j !== i) })} aria-label="Quitar">✕</button>
                </div>
                {(b.tipo === 'p' || b.tipo === 'h2') && <textarea rows={b.tipo === 'p' ? 4 : 1} value={b.texto} onChange={(e) => editarBloque(i, { ...b, texto: e.target.value })} />}
                {b.tipo === 'lista' && <textarea rows={4} placeholder="Un punto por línea" value={b.items.join('\n')} onChange={(e) => editarBloque(i, { ...b, items: e.target.value.split('\n') })} />}
                {b.tipo === 'cita' && (<><textarea rows={2} value={b.texto} onChange={(e) => editarBloque(i, { ...b, texto: e.target.value })} /><input placeholder="Quién lo dijo" value={b.autor} onChange={(e) => editarBloque(i, { ...b, autor: e.target.value })} /></>)}
                {b.tipo === 'imagen' && (<><img className="prev" src={b.src} alt="" /><input placeholder="Texto alternativo" value={b.alt} onChange={(e) => editarBloque(i, { ...b, alt: e.target.value })} /><input placeholder="Pie de foto" value={b.pie ?? ''} onChange={(e) => editarBloque(i, { ...b, pie: e.target.value })} /><input placeholder="Crédito" value={b.credito ?? ''} onChange={(e) => editarBloque(i, { ...b, credito: e.target.value })} /></>)}
                {b.tipo === 'video' && (<>
                  {b.proveedor !== 'archivo' && <input placeholder="Enlace de YouTube o Vimeo" defaultValue={b.id ? (b.proveedor === 'youtube' ? `https://youtu.be/${b.id}` : `https://vimeo.com/${b.id}`) : ''} onBlur={(e) => { const v = idDeVideo(e.target.value); if (v) editarBloque(i, { ...b, ...v }); else setAviso('El enlace no es de YouTube ni de Vimeo.'); }} />}
                  <input placeholder="Título del video" value={b.titulo} onChange={(e) => editarBloque(i, { ...b, titulo: e.target.value })} />
                </>)}
              </div>
            ))}
            <div className="agregar">
              <button onClick={() => editar({ cuerpo: [...nota.cuerpo, { tipo: 'p', texto: '' }] })}>+ Párrafo</button>
              <button onClick={() => editar({ cuerpo: [...nota.cuerpo, { tipo: 'h2', texto: '' }] })}>+ Subtítulo</button>
              <button onClick={() => editar({ cuerpo: [...nota.cuerpo, { tipo: 'lista', items: [''] }] })}>+ Lista</button>
              <button onClick={() => editar({ cuerpo: [...nota.cuerpo, { tipo: 'cita', texto: '', autor: '' }] })}>+ Cita</button>
              <button onClick={() => editar({ cuerpo: [...nota.cuerpo, { tipo: 'video', proveedor: 'youtube', id: '', titulo: '' }] })}>+ Video de YouTube/Vimeo</button>
              <label className="subir">+ Foto o video corto<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm" onChange={(e) => agregarMedio(e.target.files?.[0])} /></label>
            </div>

            <h2>Fuentes</h2>
            {nota.fuentes.map((f, i) => (
              <div key={i} className="dos">
                <input placeholder="Descripción" value={f.texto} onChange={(e) => editar({ fuentes: nota.fuentes.map((x, j) => (j === i ? { ...x, texto: e.target.value } : x)) })} />
                <input placeholder="https://…" value={f.url} onChange={(e) => editar({ fuentes: nota.fuentes.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)) })} />
              </div>
            ))}
            <button onClick={() => editar({ fuentes: [...nota.fuentes, { texto: '', url: '' }] })}>+ Fuente</button>
          </section>

          <aside>
            <div className="tarjeta">
              <h2>Acciones</h2>
              <button disabled={ocupado} onClick={() => guardar(nota.estado === 'publicada' ? 'publicada' : 'borrador')}>Guardar</button>
              {nota.estado === 'borrador' && <button disabled={ocupado} onClick={() => guardar('revision')}>Enviar a revisión</button>}
              {puedePublicar && (<>
                <button className="prim" disabled={ocupado} onClick={() => guardar('publicada')}>Publicar ahora</button>
                <label>Programar para<input type="datetime-local" onChange={(e) => e.target.value && confirm('¿Programar la publicación para esa fecha?') && guardar('publicada', e.target.value)} /></label>
                {nota.estado === 'publicada' && <button disabled={ocupado} onClick={() => guardar('borrador')}>Despublicar</button>}
                {nota.id && nota.estado !== 'archivada' && <button disabled={ocupado} onClick={() => guardar('archivada')}>Archivar (borrar del sitio)</button>}
              </>)}
              {rol === 'admin' && nota.id && <button className="peligro" onClick={borrarDefinitivo}>Eliminar definitivamente</button>}
              {nota.estado === 'publicada' && <a href={`/noticias/${nota.slug}`} target="_blank" rel="noreferrer">Ver en el sitio →</a>}
            </div>
            <div className="tarjeta">
              <h2>Así se verá en Google</h2>
              <div className="google">
                <span>ethosia.tech › noticias › {nota.slug || '…'}</span>
                <strong>{(nota.titulo || 'Título de la noticia').slice(0, LIMITE_TITULO_SEO)}{nota.titulo.length > LIMITE_TITULO_SEO ? '…' : ''}</strong>
                <p>{(nota.resumen || 'Bajada de la noticia').slice(0, LIMITE_RESUMEN_SEO)}{nota.resumen.length > LIMITE_RESUMEN_SEO ? '…' : ''}</p>
              </div>
            </div>
            {versiones.length > 0 && (
              <div className="tarjeta">
                <h2>Versiones</h2>
                <ul className="versiones">
                  {versiones.map((v) => (
                    <li key={v.id}>
                      {new Date(v.guardado_en).toLocaleString('es-EC')} · {ETIQUETA_ESTADO[v.estado as Estado] ?? v.estado}
                      <button onClick={() => setNota({ ...v.datos, id: nota.id, estado: nota.estado })}>Restaurar</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </main>
      )}

      <style jsx>{`
        .prensa { min-height: 100vh; background: var(--c-fondo); color: var(--c-texto); font-family: var(--font-brand), -apple-system, sans-serif; padding-bottom: 48px; }
        .barra { display: flex; justify-content: space-between; align-items: center; gap: 12px; background: var(--c-azul); color: var(--c-claro); padding: 14px 24px; font-size: 14px; }
        .barra strong { color: var(--c-cian); }
        .barra button { margin-left: 8px; }
        .aviso { max-width: 1100px; margin: 16px auto 0; background: var(--c-aviso-bg); color: var(--c-aviso); padding: 12px 16px; border-radius: 10px; }
        .tarjeta { background: var(--c-tarjeta); border: 1px solid var(--c-borde); border-radius: 14px; padding: 20px; margin: 16px auto; max-width: 1100px; }
        .acceso { max-width: 420px; }
        .o { text-align: center; color: var(--c-texto-3); font-size: 12px; margin: 16px 0 12px; }
        h1 { font-size: 1.4rem; margin: 8px 0 16px; }
        h2 { font-size: 1rem; margin: 22px 0 8px; }
        label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 600; margin-bottom: 12px; }
        small { font-weight: 400; color: var(--c-texto-3); }
        input, textarea, select { font: inherit; font-weight: 400; padding: 9px 11px; border: 1px solid #c4d3e0; border-radius: 8px; background: #fff; width: 100%; box-sizing: border-box; }
        button, .subir { font: inherit; font-size: 13px; padding: 8px 12px; border-radius: 8px; border: 1px solid #c4d3e0; background: #fff; cursor: pointer; }
        button:disabled { opacity: 0.5; cursor: wait; }
        .prim { background: var(--c-azul); color: var(--c-cian); border-color: var(--c-azul); }
        .peligro { color: var(--c-error); border-color: var(--c-error); }
        .fila { display: flex; justify-content: space-between; align-items: center; }
        .filtros { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
        .filtros .on { background: var(--c-azul); color: var(--c-cian); }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid var(--c-borde); }
        tbody tr { cursor: pointer; }
        tbody tr:hover, tbody tr:focus { background: var(--c-claro); outline: none; }
        .est { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; background: var(--c-claro); color: var(--c-teal); vertical-align: middle; }
        .est.publicada { background: var(--c-ok-bg); color: var(--c-ok); }
        .est.revision { background: var(--c-aviso-bg); color: var(--c-aviso); }
        .est.archivada { background: #eee; color: #666; }
        .editor { display: grid; grid-template-columns: 1fr 320px; gap: 16px; max-width: 1100px; margin: 0 auto; padding: 0 16px; }
        .editor .tarjeta { margin: 16px 0 0; }
        aside .tarjeta { display: flex; flex-direction: column; gap: 8px; }
        .dos { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .prev { max-width: 100%; max-height: 220px; border-radius: 10px; display: block; margin: 8px 0; }
        .bloque { border: 1px dashed #c4d3e0; border-radius: 10px; padding: 10px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 6px; }
        .herr { display: flex; gap: 6px; align-items: center; font-size: 12px; color: var(--c-texto-3); }
        .herr span { flex: 1; font-weight: 700; }
        .herr button { padding: 2px 8px; }
        .agregar { display: flex; flex-wrap: wrap; gap: 6px; }
        .subir { display: inline-flex; flex-direction: row; margin: 0; font-weight: 400; }
        .subir input { display: none; }
        .google { font-family: arial, sans-serif; }
        .google span { font-size: 12px; color: #4d5156; }
        .google strong { display: block; color: #1a0dab; font-weight: 400; font-size: 18px; margin: 4px 0; }
        .google p { font-size: 13px; color: #4d5156; margin: 0; }
        .versiones { list-style: none; padding: 0; margin: 0; font-size: 12px; display: flex; flex-direction: column; gap: 6px; }
        .versiones button { margin-left: 6px; padding: 2px 8px; }
        @media (max-width: 860px) { .editor { grid-template-columns: 1fr; } .dos { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
