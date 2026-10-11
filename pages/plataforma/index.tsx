import Head from 'next/head';
import Header from '../../components/home/Header';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import type { Resumen, Seccion } from '../../lib/plataforma/datos';
import { categoriaRiesgo, nivelRiesgo } from '../../lib/plataforma/datos';
import ApiPlayground from '../../components/plataforma/ApiPlayground';
import MapaRiesgos from '../../components/plataforma/MapaRiesgos';
import ArbolEvidencias from '../../components/plataforma/ArbolEvidencias';
import GaleriaImagenes from '../../components/plataforma/GaleriaImagenes';
import PipelineInteractivo from '../../components/plataforma/PipelineInteractivo';
import TopologiaRed from '../../components/plataforma/TopologiaRed';
import { DOCUMENTOS_KIT } from '../../lib/plataforma/visual';
import DemoEnVivo from '../../components/plataforma/DemoEnVivo';
import GaleriaPaneles from '../../components/plataforma/GaleriaPaneles';
import MatrizRed from '../../components/plataforma/MatrizRed';
import Compuerta from '../../components/plataforma/Compuerta';
import FichaServicio from '../../components/plataforma/FichaServicio';

const SITE_URL = 'https://www.ethosia.tech';
type Pestana = Seccion['id'] | 'paneles' | 'servicios' | 'riesgos' | 'api';

const PESTANAS: { id: Pestana; etiqueta: string }[] = [
  { id: 'laboratorios', etiqueta: 'Laboratorios' },
  { id: 'devops', etiqueta: 'DevOps Kit' },
  { id: 'programa', etiqueta: 'Programa de prácticas' },
  { id: 'paneles', etiqueta: 'Paneles' },
  { id: 'servicios', etiqueta: 'Servicios' },
  { id: 'riesgos', etiqueta: 'Riesgos' },
  { id: 'api', etiqueta: 'API' },
];

type Estado = { fase: 'cargando' } | { fase: 'error'; mensaje: string } | { fase: 'listo'; datos: Resumen };

export default function Plataforma() {
  const [estado, setEstado] = useState<Estado>({ fase: 'cargando' });
  const [activa, setActiva] = useState<Pestana>('laboratorios');
  const { query, isReady } = useRouter();

  useEffect(() => {
    const p = typeof query.pestana === 'string' ? query.pestana : '';
    if (isReady && PESTANAS.some((x) => x.id === p)) setActiva(p as Pestana);
  }, [isReady, query.pestana]);

  const cargar = useCallback(async () => {
    setEstado({ fase: 'cargando' });
    try {
      const r = await fetch('/api/plataforma/resumen');
      if (!r.ok) throw new Error(r.status === 429 ? 'Demasiadas solicitudes; intenta en un minuto.' : `Error ${r.status}`);
      setEstado({ fase: 'listo', datos: (await r.json()) as Resumen });
    } catch (e) {
      setEstado({ fase: 'error', mensaje: e instanceof Error ? e.message : 'No se pudo cargar la información.' });
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const seccion = estado.fase === 'listo' ? estado.datos.secciones.find((s) => s.id === activa) : undefined;

  return (
    <div className="app" id="contenido-principal">
      <Head>
        <title>Ethos Ingeniería — Ethos IA</title>
        <meta name="description" content="Laboratorios, kit DevSecOps y programa de prácticas de ETHOSLAB S.A.S.: la plataforma de ingeniería de Ethos IA." />
        <link rel="canonical" href={`${SITE_URL}/plataforma`} />
      </Head>

      <Header />

      <header className="hero">
        <span className="eyebrow">PLATAFORMA DE INGENIERÍA</span>
        <h1>Lo que Ethos IA construye por dentro</h1>
        <p>
          Laboratorios reproducibles, un kit DevSecOps y un programa de prácticas con evidencia verificable. Esta
          aplicación lee su información de una API REST propia, con un recurso público y otro protegido con JWT.
        </p>
      </header>

      <main className="cuerpo">
        <div className="tabs" role="tablist" aria-label="Secciones">
          {PESTANAS.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={activa === p.id}
              className={activa === p.id ? 'tab on' : 'tab'}
              onClick={() => setActiva(p.id)}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>

        {estado.fase === 'cargando' && <p className="estado" role="status">Cargando…</p>}
        {estado.fase === 'error' && (
          <div className="estado err" role="alert">
            <p>{estado.mensaje}</p>
            <button className="reintentar" onClick={cargar}>Reintentar</button>
          </div>
        )}

        {seccion && (
          <section aria-labelledby="t-sec">
            <h2 id="t-sec">{seccion.nombre}</h2>
            <p className="resumen">{seccion.resumen}</p>
            <ul className="cifras">
              {seccion.cifras.map((c) => (
                <li key={c.etiqueta}><strong>{c.valor}</strong><span>{c.etiqueta}</span></li>
              ))}
            </ul>
            <div className="rejilla">
              {seccion.elementos.map((e) => (
                <article key={e.titulo} className="card">
                  <h3>{e.titulo}</h3>
                  <p>{e.detalle}</p>
                  <div className="tags">{e.etiquetas.map((t) => <span key={t}>{t}</span>)}</div>
                </article>
              ))}
            </div>

            {seccion.id === 'laboratorios' && (
              <>
                <h2 className="h2b">Topología de la red segmentada</h2>
                <p className="resumen">Elige un segmento: en verde, lo que alcanza; en rojo punteado, lo que el firewall bloquea.</p>
                <TopologiaRed />
                <p className="resumen sep"><button className="enlace" onClick={() => setActiva('paneles')}>Ver los paneles reales de los tres laboratorios →</button></p>
              </>
            )}
            {seccion.id === 'devops' && (
              <>
                <h2 className="h2b">Recorrido del pipeline</h2>
                <PipelineInteractivo />
                <h2 className="h2b">Arquitectura</h2>
                <GaleriaImagenes ancha imagenes={[
                  { id: 'D1', titulo: 'Pipeline estándar', descripcion: 'De la propuesta de cambio a producción, con diez compuertas.', src: '/paneles/devops/D1_pipeline.webp' },
                  { id: 'D2', titulo: 'Estándar común, entornos separados', descripcion: 'Un kit común con equipos, repositorios, datos y entornos separados por empresa.', src: '/paneles/devops/D2_empresas_y_entornos.webp' },
                ]} />
                <h2 className="h2b">Documentos de gobierno</h2>
                <GaleriaImagenes imagenes={DOCUMENTOS_KIT.map((d) => ({ id: d.id, titulo: d.titulo, descripcion: 'Primera página del documento en Word y PDF sobre la hoja membretada de la empresa.', src: `/paneles/devops/${d.id}.webp` }))} />
              </>
            )}
            {seccion.id === 'programa' && (
              <>
                <h2 className="h2b">Del cronograma al certificado</h2>
                <ArbolEvidencias />
              </>
            )}
          </section>
        )}

        {activa === 'paneles' && (
          <section aria-labelledby="t-p">
            <h2 id="t-p">Paneles de los laboratorios</h2>
            <p className="resumen">
              Las interfaces reales de lo que se levantó en Docker. Se muestran como capturas porque los contenedores se
              encienden bajo demanda en un equipo de la empresa; no son maquetas.
            </p>
            <DemoEnVivo />
            <GaleriaPaneles />
            <h2 className="h2b">Pruebas de la red segmentada</h2>
            <MatrizRed />
          </section>
        )}

        {estado.fase === 'listo' && activa === 'servicios' && (
          <section aria-labelledby="t-s">
            <h2 id="t-s">Servicios reutilizables</h2>
            <p className="resumen">
              Lo que la empresa ya construyó, ofrecido como servicio. El estado indica lo que existe hoy: «Catálogo» describe el
              servicio y cómo levantarlo; «Demo en el navegador» se puede probar aquí mismo.
            </p>
            <div className="servicios">
              {estado.datos.servicios.map((s) => (
                <FichaServicio key={s.id} s={s} onVerPaneles={() => setActiva('paneles')}>
                  {s.id === 'mesa-de-ayuda' && <DemoEnVivo />}
                  {s.id === 'pipeline-devsecops' && (
                    <>
                      <h4 className="sub">Compuerta de dependencias</h4>
                      <Compuerta />
                    </>
                  )}
                </FichaServicio>
              ))}
            </div>
          </section>
        )}

        {estado.fase === 'listo' && activa === 'riesgos' && (
          <section aria-labelledby="t-r">
            <h2 id="t-r">Registro de riesgos de la plataforma</h2>
            <p className="resumen">Nivel = probabilidad × impacto (1 a 25). Alto ≥ 15, medio 8 a 14, bajo &lt; 8.</p>
            <MapaRiesgos riesgos={estado.datos.riesgos} />
            <h2 className="h2b">Registro ordenado por nivel</h2>
            <div className="tabla" role="table">
              {[...estado.datos.riesgos].sort((a, b) => nivelRiesgo(b) - nivelRiesgo(a)).map((r) => {
                const n = nivelRiesgo(r);
                const cat = categoriaRiesgo(n);
                return (
                  <article key={r.id} className="fila" role="row">
                    <span className={`nivel ${cat.toLowerCase()}`}>{cat} · {n}</span>
                    <div>
                      <h3>{r.id} · {r.riesgo}</h3>
                      <p>P {r.probabilidad} × I {r.impacto}. {r.tratamiento}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {activa === 'api' && (
          <section aria-labelledby="t-a">
            <h2 id="t-a">API REST</h2>
            <p className="resumen">Dos recursos públicos y uno protegido con JWT: el servidor valida firma HS256, vencimiento y rol (gerencia o tutoría). Pruébala aquí mismo.</p>
            <ApiPlayground />
          </section>
        )}
      </main>

      <footer className="foot">
        <span>Ethos IA es una marca de ETHOSLAB S.A.S. — Cuenca, Azuay, Ecuador</span>
        <span>© 2026 ETHOSLAB S.A.S.</span>
      </footer>

      <style jsx>{`
        .app { min-height: 100vh; background: #eaf2f8; color: #05111e; font-family: var(--font-brand), -apple-system, sans-serif; }
        .nav { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; background: #05111e; }
        .nav :global(.brand) { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border: 1px solid #123048; border-radius: 999px; color: #eaf2f8; font-size: 15px; font-weight: 600; }
        .nav :global(.back) { color: #c4d3e0; font-size: 13px; }
        .hero { background: #05111e; color: #eaf2f8; padding: 128px 48px 64px; }
        .eyebrow { font-size: 12px; letter-spacing: 0.18em; color: #04ebff; }
        h1 { font-size: clamp(1.8rem, 3.4vw, 2.6rem); line-height: 1.2; margin: 14px 0 0; max-width: 22ch; text-wrap: balance; }
        .hero p { color: #c4d3e0; line-height: 1.7; max-width: 62ch; margin: 18px 0 0; }
        .cuerpo { max-width: 960px; margin: -28px auto 0; padding: 0 24px 72px; }
        .tabs { display: flex; gap: 6px; flex-wrap: wrap; background: #fff; padding: 8px; border-radius: 14px; box-shadow: 0 18px 40px rgba(5,17,30,0.08); }
        .tab { border: 0; background: transparent; padding: 10px 16px; border-radius: 10px; font: inherit; font-size: 14px; color: #33414d; cursor: pointer; }
        .tab:hover { background: #eaf2f8; }
        .tab.on { background: #05111e; color: #04ebff; }
        .tab:focus-visible, .reintentar:focus-visible { outline: 2px solid #04ebff; outline-offset: 2px; }
        section { margin-top: 32px; }
        h2 { font-size: 1.4rem; margin: 0 0 8px; }
        .resumen { color: #33414d; line-height: 1.7; margin: 0 0 18px; max-width: 70ch; }
        .cifras { list-style: none; padding: 0; margin: 0 0 24px; display: flex; gap: 14px; flex-wrap: wrap; }
        .cifras li { background: #fff; border: 1px solid rgba(5,17,30,0.08); border-radius: 12px; padding: 14px 20px; display: flex; flex-direction: column; min-width: 150px; }
        .cifras strong { font-size: 1.7rem; color: #0b5f75; }
        .cifras span { font-size: 12px; color: #526373; }
        .rejilla { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
        .card { background: #fff; border: 1px solid rgba(5,17,30,0.08); border-radius: 14px; padding: 22px; box-shadow: 0 10px 28px rgba(5,17,30,0.05); }
        .card h3, .fila h3 { font-size: 16px; margin: 0 0 8px; }
        .card p, .fila p { font-size: 14px; color: #33414d; line-height: 1.65; margin: 0 0 14px; }
        .tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .tags span { font-size: 11px; padding: 4px 10px; border-radius: 999px; background: #eaf2f8; color: #0b5f75; }
        .h2b { margin-top: 40px; }
        .sep { margin-top: 20px; }
        .enlace { background: none; border: 0; padding: 0; font: inherit; font-weight: 700; color: #0b5f75; cursor: pointer; }
        .enlace:hover { color: #04ebff; }
        .servicios { display: flex; flex-direction: column; gap: 18px; }
        .sub { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #526373; margin: 22px 0 0; }
        .tabla { display: flex; flex-direction: column; gap: 10px; }
        .fila { display: grid; grid-template-columns: 110px 1fr; gap: 16px; background: #fff; border-radius: 12px; padding: 16px 18px; border: 1px solid rgba(5,17,30,0.08); }
        .fila p { margin: 0; }
        .nivel { font-size: 12px; font-weight: 700; padding: 6px 10px; border-radius: 8px; height: fit-content; text-align: center; }
        .nivel.alto { background: #fde3e3; color: #8a1c1c; }
        .nivel.medio { background: #fff1d6; color: #7a4b00; }
        .nivel.bajo { background: #dff5e6; color: #14653a; }
        pre { background: #05111e; color: #c4d3e0; padding: 18px; border-radius: 12px; overflow-x: auto; font-size: 13px; line-height: 1.6; }
        code { background: #fff; padding: 2px 6px; border-radius: 6px; }
        .estado { margin-top: 28px; color: #33414d; }
        .estado.err { background: #fde3e3; color: #8a1c1c; padding: 16px; border-radius: 12px; }
        .reintentar { border: 0; background: #05111e; color: #04ebff; padding: 8px 14px; border-radius: 8px; cursor: pointer; font: inherit; }
        .foot { background: #030a12; color: #93aabb; padding: 28px 48px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; }
        @media (max-width: 600px) {
          .nav, .foot { padding-left: 18px; padding-right: 18px; }
          .hero { padding: 104px 20px 56px; }
          .cuerpo { padding: 0 16px 56px; }
          .fila { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>
    </div>
  );
}
