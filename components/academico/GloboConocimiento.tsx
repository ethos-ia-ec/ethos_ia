import { useEffect, useRef } from 'react';

// «Globo de conocimiento»: red bibliométrica sobre una esfera (espiral de Fibonacci) en canvas 2D con
// perspectiva, rotación lenta, inclinación según el puntero y palabras clave que aparecen junto a nodos del frente.
// Se detiene fuera de pantalla o con la pestaña oculta; con «reducir movimiento» dibuja un fotograma estático.

const COLORES = ['#04ebff', '#7aa7ff', '#e8b23a', '#2fd8c9', '#ff8a7a'];
// Orden intercalado (diseño · fuentes · herramientas · análisis) para que las palabras vecinas varíen de tema.
const PALABRAS = [
  'Diseño de investigación', 'Scopus', 'Python', 'Revisión sistemática',
  'Metodología de la investigación', 'Google Académico', 'RStudio', 'PRISMA 2020',
  'Enfoque cuantitativo', 'Web of Science', 'Stata', 'Análisis bibliométrico',
  'Enfoque cualitativo', 'SciELO', 'Bibliometrix', 'Pregunta de investigación',
  'Enfoque mixto', 'Redalyc', 'VOSviewer', 'Hipótesis',
  'Diseño experimental', 'ScienceDirect', 'SPSS', 'Marco teórico',
  'Diseño no experimental', 'IEEE Xplore', 'Power BI', 'Estado del arte',
  'Estudio transversal', 'PubMed', 'Jupyter', 'Operacionalización de variables',
  'Estudio longitudinal', 'Latindex', 'Zotero', 'Población y muestra',
  'Investigación descriptiva', 'DOAJ', 'Mendeley', 'Instrumentos de recolección',
  'Investigación correlacional', 'Ecuación de búsqueda', 'Atlas.ti', 'Validez y confiabilidad',
  'Investigación explicativa', 'Criterios de inclusión', 'Machine learning', 'Alfa de Cronbach',
  'Estadística descriptiva', 'Análisis de regresión', 'Normas APA 7', 'Meta-análisis',
  'Estadística inferencial', 'Series de tiempo', 'Vancouver', 'Ética de la investigación',
  'Pruebas de hipótesis', 'Análisis de contenido', 'Artículo científico', 'Tesis',
];
const N = 230;
const VECINOS = 3;
const DIST = 3.2; // distancia de la cámara en radios

type P = { x: number; y: number; z: number; c: number };

function fibonacci(n: number): [number, number, number][] {
  const out: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i += 1) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    out.push([Math.cos(phi * i) * r, y, Math.sin(phi * i) * r]);
  }
  return out;
}

function construir() {
  const centros = fibonacci(5);
  const nodos: P[] = fibonacci(N).map(([x, y, z]) => {
    let c = 0;
    let mejor = -Infinity;
    centros.forEach(([a, b, d], k) => { const p = a * x + b * y + d * z; if (p > mejor) { mejor = p; c = k; } });
    return { x, y, z, c };
  });
  const aristas: [number, number][] = [];
  const visto = new Set<string>();
  nodos.forEach((n, i) => {
    const dist = nodos.map((m, j) => [j, (m.x - n.x) ** 2 + (m.y - n.y) ** 2 + (m.z - n.z) ** 2] as [number, number]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]);
    dist.slice(0, VECINOS).forEach(([j]) => {
      const k = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!visto.has(k)) { visto.add(k); aristas.push([i, j]); }
    });
  });
  // Algunos puentes largos entre clústeres, como en un mapa de coocurrencia.
  for (let i = 0; i < 18; i += 1) aristas.push([(i * 37) % N, (i * 91 + 53) % N]);
  return { nodos, aristas };
}

const RED = construir();

type Etiqueta = { nodo: number; texto: string; nacio: number; lado: number };

export default function GloboConocimiento({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let rotY = 0.6;
    let incl = -0.25;
    let objIncl = -0.25;
    let objYaw = 0;
    let yaw = 0;
    let visible = true;
    let raf = 0;
    let previo = 0;
    let ultimaEtiqueta = 0;
    let siguientePalabra = 0;
    const etiquetas: Etiqueta[] = [];
    const proy = RED.nodos.map(() => ({ x: 0, y: 0, z: 0, s: 1 }));

    const medir = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const dibujar = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!w || !h) return;
      const R = Math.min(w, h) * 0.42;
      const cx = w / 2;
      const cy = h / 2;
      const ay = rotY + yaw;
      const cyw = Math.cos(ay); const syw = Math.sin(ay);
      const cx_ = Math.cos(incl); const sx_ = Math.sin(incl);

      RED.nodos.forEach((n, i) => {
        const x1 = n.x * cyw + n.z * syw;
        const z1 = -n.x * syw + n.z * cyw;
        const y2 = n.y * cx_ - z1 * sx_;
        const z2 = n.y * sx_ + z1 * cx_;
        const s = DIST / (DIST - z2);
        const p = proy[i];
        p.x = cx + x1 * R * s; p.y = cy + y2 * R * s; p.z = z2; p.s = s;
      });

      // Halo de la esfera.
      const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.35);
      g.addColorStop(0, 'rgba(4, 235, 255, 0.10)');
      g.addColorStop(0.6, 'rgba(122, 167, 255, 0.05)');
      g.addColorStop(1, 'rgba(5, 17, 30, 0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2); ctx.fill();

      ctx.lineWidth = 0.8;
      RED.aristas.forEach(([a, b]) => {
        const pa = proy[a]; const pb = proy[b];
        const prof = ((pa.z + pb.z) / 2 + 1) / 2;
        ctx.strokeStyle = COLORES[RED.nodos[a].c];
        ctx.globalAlpha = 0.03 + prof * prof * 0.32;
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
      });

      // Nodos de atrás hacia adelante.
      const orden = proy.map((p, i) => i).sort((a, b) => proy[a].z - proy[b].z);
      orden.forEach((i) => {
        const p = proy[i];
        const prof = (p.z + 1) / 2;
        const color = COLORES[RED.nodos[i].c];
        const r = (1 + prof * 2.4) * p.s * (i % 7 === 0 ? 1.6 : 1);
        if (prof > 0.78) {
          ctx.globalAlpha = (prof - 0.78) * 0.9;
          ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(p.x, p.y, r * 3.2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 0.18 + prof * 0.82;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      });

      // Palabras clave sobre nodos del frente.
      if (t - ultimaEtiqueta > 1400 || etiquetas.length === 0) {
        const candidatos = proy.map((p, i) => i).filter((i) => proy[i].z > 0.55 && !etiquetas.some((e) => e.nodo === i));
        if (candidatos.length) {
          const nodo = candidatos[Math.floor((t / 97) % candidatos.length)];
          etiquetas.push({ nodo, texto: PALABRAS[siguientePalabra % PALABRAS.length], nacio: t, lado: proy[nodo].x > cx + R * 0.35 ? -1 : 1 });
          siguientePalabra += 1;
          ultimaEtiqueta = t;
        }
        while (etiquetas.length > 3) etiquetas.shift();
      }
      const fs = Math.max(11, Math.min(15, R * 0.055));
      ctx.font = `600 ${fs}px Sora, system-ui, sans-serif`;
      ctx.textBaseline = 'middle';
      for (let k = etiquetas.length - 1; k >= 0; k -= 1) {
        const e = etiquetas[k];
        const edad = reducido ? 1500 : t - e.nacio;
        // Vida de 4,2 s: con una palabra cada 1,4 s nunca hay más de 3 y ninguna desaparece de golpe.
        if (edad > 4200) { etiquetas.splice(k, 1); continue; }
        const p = proy[e.nodo];
        const aparicion = Math.min(1, edad / 500) * Math.min(1, (4200 - edad) / 700) * Math.max(0, Math.min(1, (p.z - 0.15) * 2.5));
        if (aparicion <= 0) continue;
        const color = COLORES[RED.nodos[e.nodo].c];
        const ex = p.x + e.lado * R * 0.32;
        const ey = p.y - R * 0.16;
        ctx.globalAlpha = aparicion * 0.8;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(ex, ey); ctx.lineTo(ex + e.lado * 10, ey); ctx.stroke();
        ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); ctx.stroke();
        const tw = ctx.measureText(e.texto).width;
        // Las etiquetas largas no deben salirse del lienzo en móvil.
        const tx = Math.max(8, Math.min(w - tw - 8, e.lado > 0 ? ex + 14 : ex - 14 - tw));
        ctx.globalAlpha = aparicion * 0.85;
        ctx.fillStyle = 'rgba(5, 17, 30, 0.82)';
        ctx.fillRect(tx - 7, ey - fs * 0.85, tw + 14, fs * 1.7);
        ctx.globalAlpha = aparicion;
        ctx.fillStyle = color;
        ctx.fillText(e.texto, tx, ey);
      }
      ctx.globalAlpha = 1;
    };

    const cuadro = (t: number) => {
      const dt = previo ? Math.min(64, t - previo) : 16;
      previo = t;
      rotY += dt * 0.00009;
      incl += (objIncl - incl) * 0.04;
      yaw += (objYaw - yaw) * 0.04;
      dibujar(t);
      raf = requestAnimationFrame(cuadro);
    };
    const arrancar = () => { if (!raf && visible && !document.hidden && !reducido) { previo = 0; raf = requestAnimationFrame(cuadro); } };
    const parar = () => { cancelAnimationFrame(raf); raf = 0; };

    const alMover = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      objYaw = Math.max(-0.35, Math.min(0.35, nx * 0.6));
      objIncl = -0.25 + Math.max(-0.3, Math.min(0.3, ny * 0.5));
    };
    const alVisibilidad = () => (document.hidden ? parar() : arrancar());

    medir();
    const ro = new ResizeObserver(() => { medir(); if (reducido || !raf) dibujar(performance.now()); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) arrancar(); else parar(); });
    io.observe(canvas);
    document.addEventListener('visibilitychange', alVisibilidad);
    if (reducido) {
      dibujar(0);
    } else {
      window.addEventListener('pointermove', alMover, { passive: true });
      arrancar();
    }
    return () => {
      parar();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', alVisibilidad);
      window.removeEventListener('pointermove', alMover);
    };
  }, []);

  return (
    <canvas ref={ref} className={className} aria-hidden="true" style={{ display: 'block', width: '100%', height: '100%' }} />
  );
}
