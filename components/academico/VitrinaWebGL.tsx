import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import type { Area } from '../../lib/academico';

type Props = {
  areas: Area[];
  iconos: Record<Area['icono'], string>;
  activo: number;
  pausado: boolean;
  onFrente: (i: number) => void;
  onFallo: () => void;
};

const VERT = `
uniform float uOnda; uniform float uTiempo; varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  float d = length(uv - 0.5);
  p.z += sin(d * 18.0 - uTiempo * 8.0) * 0.05 * uOnda;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

// Onda radial que distorsiona la textura y un barrido de luz cian/violeta que cruza la tarjeta.
const FRAG = `
uniform sampler2D uTex; uniform float uOnda; uniform float uTiempo; uniform float uFrente; varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  vec2 c = uv - 0.5;
  float d = length(c);
  uv += (c / max(d, 0.0001)) * sin(d * 30.0 - uTiempo * 10.0) * 0.012 * uOnda;
  vec4 col = texture2D(uTex, uv);
  float pos = (1.0 - uOnda) * 1.9 - 0.3;
  float banda = smoothstep(0.16, 0.0, abs(vUv.x * 0.8 + vUv.y * 0.4 - pos));
  col.rgb += vec3(0.016, 0.92, 1.0) * banda * 0.55 * uOnda + vec3(0.48, 0.65, 1.0) * banda * 0.25 * uOnda;
  col.rgb *= mix(0.35, 1.0, uFrente);
  col.a *= smoothstep(0.0, 0.45, uFrente);
  gl_FragColor = col;
}`;

const CONO_VERT = `varying float vY; void main() { vY = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const CONO_FRAG = `uniform vec3 uColor; uniform float uTiempo; varying float vY;
void main() { float a = pow(vY, 2.2) * (0.14 + 0.04 * sin(uTiempo * 0.8)); gl_FragColor = vec4(uColor * a, a); }`;

function redondo(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function lineas(ctx: CanvasRenderingContext2D, texto: string, ancho: number, max: number): string[] {
  const out: string[] = [];
  let l = '';
  for (const p of texto.split(' ')) {
    const prueba = l ? `${l} ${p}` : p;
    if (ctx.measureText(prueba).width > ancho && l) { out.push(l); l = p; } else l = prueba;
  }
  if (l) out.push(l);
  if (out.length > max) { out.length = max; out[max - 1] = `${out[max - 1].replace(/\s+\S*$/, '')}…`; }
  return out;
}

function cargar(src: string): Promise<HTMLImageElement | null> {
  return new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
}

// Dibuja la tarjeta (imagen, ícono, número, título, texto y temas) en un canvas de 640×896 px.
async function tarjeta(a: Area, i: number, total: number, icono: string, fuente: string): Promise<HTMLCanvasElement> {
  const W = 640, H = 896, cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d')!;
  redondo(ctx, 2, 2, W - 4, H - 4, 36);
  ctx.save(); ctx.clip();
  const g = ctx.createLinearGradient(0, 0, W * 0.4, H);
  g.addColorStop(0, '#0a1b2b'); g.addColorStop(0.7, '#061423');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const IH = 400;
  const img = a.imagen ? await cargar(a.imagen.src) : null;
  if (img) {
    if (a.imagen?.ilustrativa) {
      const s = Math.max(W / img.width, IH / img.height);
      ctx.drawImage(img, (W - img.width * s) / 2, (IH - img.height * s) / 2, img.width * s, img.height * s);
      const f = ctx.createLinearGradient(0, IH * 0.45, 0, IH);
      f.addColorStop(0, 'rgba(5,17,30,0)'); f.addColorStop(1, '#0a1b2b');
      ctx.fillStyle = f; ctx.fillRect(0, 0, W, IH);
    } else {
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, IH);
      const s = Math.min((W - 24) / img.width, (IH - 50) / img.height);
      ctx.drawImage(img, (W - img.width * s) / 2, 12 + (IH - 50 - img.height * s) / 2, img.width * s, img.height * s);
      ctx.fillStyle = '#0b5f75'; ctx.font = `600 18px ui-monospace, monospace`;
      ctx.fillText('Fig. — proyecto propio', 16, IH - 14);
    }
  }
  // Ícono y número
  ctx.fillStyle = 'rgba(4,235,255,0.1)'; ctx.strokeStyle = 'rgba(4,235,255,0.3)'; ctx.lineWidth = 2;
  redondo(ctx, 40, IH + 28, 72, 72, 18); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.translate(55, IH + 43); ctx.scale(42 / 24, 42 / 24);
  ctx.strokeStyle = '#04ebff'; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.stroke(new Path2D(icono)); ctx.restore();
  ctx.fillStyle = '#04ebff'; ctx.font = `600 20px ui-monospace, monospace`; ctx.textAlign = 'right';
  ctx.fillText(`${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, W - 40, IH + 72);
  ctx.textAlign = 'left';
  // Título y texto
  ctx.fillStyle = '#eaf2f8'; ctx.font = `700 40px ${fuente}`;
  let y = IH + 160;
  for (const l of lineas(ctx, a.titulo, W - 80, 2)) { ctx.fillText(l, 40, y); y += 48; }
  ctx.fillStyle = '#b8cad8'; ctx.font = `400 25px ${fuente}`;
  y += 4;
  for (const l of lineas(ctx, a.texto, W - 80, 4)) { ctx.fillText(l, 40, y); y += 37; }
  // Temas
  ctx.font = `500 20px ui-monospace, monospace`;
  let x = 40;
  for (const t of a.temas) {
    const w = ctx.measureText(t).width + 32;
    ctx.fillStyle = 'rgba(5,17,30,0.6)'; ctx.strokeStyle = '#123048';
    redondo(ctx, x, H - 84, w, 44, 22); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#9fe9f5'; ctx.fillText(t, x + 16, H - 55);
    x += w + 10;
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(4,235,255,0.45)'; ctx.lineWidth = 3;
  redondo(ctx, 2, 2, W - 4, H - 4, 36); ctx.stroke();
  return cv;
}

// Vitrina WebGL: anillo de tarjetas en un laboratorio con niebla, haces de luz, partículas y piso reflectante.
export default function VitrinaWebGL({ areas, iconos, activo, pausado, onFrente, onFallo }: Props) {
  const caja = useRef<HTMLDivElement>(null);
  const estado = useRef({ activo, pausado, reportado: activo, onFrente, onFallo });
  useEffect(() => { Object.assign(estado.current, { activo, pausado, onFrente, onFallo }); }, [activo, pausado, onFrente, onFallo]);

  useEffect(() => {
    const el = caja.current;
    if (!el) return undefined;
    let vivo = true;
    let limpiar: (() => void) | null = null;

    const iniciar = async () => {
      const T = await import('three');
      const { Reflector } = await import('three/examples/jsm/objects/Reflector.js');
      if (!vivo) return;
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch {
        estado.current.onFallo();
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x05111e, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      el.appendChild(renderer.domElement);

      const escena = new T.Scene();
      escena.fog = new T.FogExp2(0x05111e, 0.11);
      const camara = new T.PerspectiveCamera(40, 1, 0.1, 60);
      const N = areas.length;
      const paso = (Math.PI * 2) / N;
      const R = Math.max(2, (N * 1.3) / (Math.PI * 2));
      const anillo = new T.Group();
      escena.add(anillo);

      // Tarjetas
      await document.fonts?.ready;
      const fuente = getComputedStyle(document.body).getPropertyValue('--font-brand').trim() || 'sans-serif';
      const geo = new T.PlaneGeometry(1, 1.4, 32, 32);
      const mats: THREE.ShaderMaterial[] = [];
      const texturas: THREE.Texture[] = [];
      await Promise.all(areas.map(async (a, i) => {
        const cv = await tarjeta(a, i, N, iconos[a.icono], fuente);
        const tex = new T.CanvasTexture(cv);
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texturas.push(tex);
        const mat = new T.ShaderMaterial({
          uniforms: { uTex: { value: tex }, uOnda: { value: 0 }, uTiempo: { value: 0 }, uFrente: { value: 0 } },
          vertexShader: VERT, fragmentShader: FRAG, transparent: true, side: T.DoubleSide,
        });
        mats[i] = mat;
        const m = new T.Mesh(geo, mat);
        const th = i * paso;
        m.position.set(Math.sin(th) * R, 0, Math.cos(th) * R);
        m.rotation.y = th;
        anillo.add(m);
      }));
      if (!vivo) { renderer.dispose(); return; }

      // Haces de luz volumétrica
      const conoGeo = new T.CylinderGeometry(0.15, 2.4, 9, 40, 1, true);
      const conos = [0x04ebff, 0x7aa7ff].map((c, k) => {
        const m = new T.Mesh(conoGeo, new T.ShaderMaterial({
          uniforms: { uColor: { value: new T.Color(c) }, uTiempo: { value: 0 } },
          vertexShader: CONO_VERT, fragmentShader: CONO_FRAG, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
        }));
        m.position.set(k ? 2.6 : -2.6, 3.2, R - 1.5);
        m.rotation.z = k ? -0.35 : 0.35;
        escena.add(m);
        return m;
      });

      // Polvo y partículas
      const cuantas = el.clientWidth < 600 ? 450 : 1100;
      const pos = new Float32Array(cuantas * 3);
      for (let k = 0; k < cuantas; k++) {
        pos[k * 3] = (Math.random() - 0.5) * 14;
        pos[k * 3 + 1] = Math.random() * 5 - 1;
        pos[k * 3 + 2] = (Math.random() - 0.5) * 12;
      }
      const pGeo = new T.BufferGeometry();
      pGeo.setAttribute('position', new T.BufferAttribute(pos, 3));
      const pMat = new T.PointsMaterial({ color: 0x7fefff, size: 0.028, transparent: true, opacity: 0.75, blending: T.AdditiveBlending, depthWrite: false });
      const polvo = new T.Points(pGeo, pMat);
      escena.add(polvo);

      // Piso reflectante con rejilla
      // Piso: el reflejo se desvanece en un óvalo alrededor de las tarjetas (sin bordes visibles).
      const base = (Reflector as unknown as { ReflectorShader: { uniforms: Record<string, THREE.IUniform>; vertexShader: string; fragmentShader: string } }).ReflectorShader;
      const sombreado = {
        ...base,
        vertexShader: base.vertexShader.replace('varying vec4 vUv;', 'varying vec4 vUv; varying vec2 vP;').replace('vUv = textureMatrix', 'vP = position.xy; vUv = textureMatrix'),
        fragmentShader: base.fragmentShader.replace('varying vec4 vUv;', 'varying vec4 vUv; varying vec2 vP;').replace(
          'gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );',
          'float a = 1.0 - smoothstep(1.5, 7.5, length((vP - vec2(0.0, -2.0)) * vec2(0.55, 1.0))); a *= 0.55 * clamp(max(base.r, max(base.g, base.b)) * 2.5, 0.0, 1.0); gl_FragColor = vec4( base.rgb * a, a );'),
      };
      const piso = new Reflector(new T.PlaneGeometry(40, 40), { color: 0x2a4a66, textureWidth: 512, textureHeight: 512, shader: sombreado });
      (piso.material as THREE.Material).transparent = true;
      piso.rotation.x = -Math.PI / 2;
      piso.position.y = -0.82;
      escena.add(piso);
      const rejilla = new T.GridHelper(24, 48, 0x04ebff, 0x123048);
      (rejilla.material as THREE.Material).transparent = true;
      (rejilla.material as THREE.Material).opacity = 0.28;
      rejilla.position.y = -0.81;
      escena.add(rejilla);

      // Medidas: la tarjeta frontal ocupa ~70 % del alto y como máximo ~66 % del ancho.
      const medir = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camara.aspect = w / h;
        const t = Math.tan(T.MathUtils.degToRad(camara.fov / 2));
        const d = Math.max(1.4 / (0.7 * 2 * t), 1 / (0.66 * 2 * t * camara.aspect));
        camara.position.set(0, 0.32, R + d);
        camara.lookAt(0, 0, R - 0.6);
        camara.updateProjectionMatrix();
        piso.getRenderTarget().setSize(Math.round(w * dpr * 0.5), Math.round(h * dpr * 0.5));
      };
      const ro = new ResizeObserver(medir);
      ro.observe(el);
      medir();

      // Interacción: parallax con mouse, arrastre con inercia en táctil y mouse.
      let ang = -estado.current.activo * paso;
      let vel = 0;
      let destino: number | null = null;
      let arrastre: { x: number; t: number } | null = null;
      const par = { x: 0, y: 0, tx: 0, ty: 0 };
      const onda = new Array(N).fill(0);
      const abajo = (e: PointerEvent) => { arrastre = { x: e.clientX, t: performance.now() }; destino = null; vel = 0; };
      const mover = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        if (e.pointerType === 'mouse') { par.tx = ((e.clientX - r.left) / r.width) * 2 - 1; par.ty = ((e.clientY - r.top) / r.height) * 2 - 1; }
        if (!arrastre) return;
        const dx = e.clientX - arrastre.x;
        const now = performance.now();
        const da = (dx / r.width) * 2.4;
        ang += da;
        vel = da / Math.max(16, now - arrastre.t) * 16;
        arrastre = { x: e.clientX, t: now };
      };
      const arriba = () => { arrastre = null; };
      const salir = () => { par.tx = 0; par.ty = 0; arrastre = null; };
      el.addEventListener('pointerdown', abajo);
      el.addEventListener('pointermove', mover);
      el.addEventListener('pointerup', arriba);
      el.addEventListener('pointercancel', arriba);
      el.addEventListener('pointerleave', salir);

      let raf = 0;
      let visible = false;
      let previo = performance.now();
      const reloj = { t: 0 };
      let ultimo = -1;
      const cuadro = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - previo) / 1000);
        previo = now;
        reloj.t += dt;
        const s = estado.current;
        // Flechas, puntos o teclado: ir por el camino más corto hasta la tarjeta pedida.
        if (s.activo !== s.reportado) {
          const objetivo = -s.activo * paso;
          let delta = (objetivo - ang) % (Math.PI * 2);
          if (delta > Math.PI) delta -= Math.PI * 2;
          if (delta < -Math.PI) delta += Math.PI * 2;
          destino = ang + delta;
          s.reportado = s.activo;
          vel = 0;
        }
        if (destino !== null) {
          ang += (destino - ang) * Math.min(1, dt * 4);
          if (Math.abs(destino - ang) < 0.002) destino = null;
        } else if (!arrastre) {
          ang += vel;
          vel *= 0.94;
          if (!s.pausado && Math.abs(vel) < 0.002) ang -= (paso / 5) * dt;
        }
        anillo.rotation.y = ang;
        const frente = ((Math.round(-ang / paso) % N) + N) % N;
        if (frente !== s.reportado) { s.reportado = frente; s.onFrente(frente); }
        if (frente !== ultimo) { onda[frente] = 1; ultimo = frente; }
        mats.forEach((m, i) => {
          onda[i] = Math.max(0, onda[i] - dt * 0.7);
          m.uniforms.uOnda.value = onda[i];
          m.uniforms.uTiempo.value = reloj.t;
          const off = Math.abs(Math.atan2(Math.sin(i * paso + ang), Math.cos(i * paso + ang)));
          m.uniforms.uFrente.value = Math.max(0, 1 - off / (paso * 2.6));
        });
        par.x += (par.tx - par.x) * 0.06;
        par.y += (par.ty - par.y) * 0.06;
        escena.rotation.y = par.x * 0.12;
        escena.rotation.x = par.y * 0.04;
        escena.position.x = par.x * -0.15;
        conos.forEach((c, k) => { c.rotation.z = (k ? -0.35 : 0.35) + Math.sin(reloj.t * 0.4 + k) * 0.08; (c.material as THREE.ShaderMaterial).uniforms.uTiempo.value = reloj.t + k; });
        const p = pGeo.attributes.position as THREE.BufferAttribute;
        const empuje = onda[frente] * 0.02;
        for (let k = 0; k < cuantas; k++) {
          let y = p.getY(k) + 0.0025 + empuje;
          if (y > 4) y = -1;
          p.setY(k, y);
        }
        p.needsUpdate = true;
        polvo.rotation.y = reloj.t * 0.02 + par.x * 0.2;
        renderer.render(escena, camara);
        raf = requestAnimationFrame(cuadro);
      };
      const actualizar = () => {
        cancelAnimationFrame(raf);
        if (visible && !document.hidden) { previo = performance.now(); raf = requestAnimationFrame(cuadro); }
      };
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; actualizar(); });
      io.observe(el);
      document.addEventListener('visibilitychange', actualizar);

      limpiar = () => {
        cancelAnimationFrame(raf);
        io.disconnect(); ro.disconnect();
        document.removeEventListener('visibilitychange', actualizar);
        el.removeEventListener('pointerdown', abajo);
        el.removeEventListener('pointermove', mover);
        el.removeEventListener('pointerup', arriba);
        el.removeEventListener('pointercancel', arriba);
        el.removeEventListener('pointerleave', salir);
        texturas.forEach((t) => t.dispose());
        mats.forEach((m) => m.dispose());
        geo.dispose(); conoGeo.dispose(); pGeo.dispose(); pMat.dispose();
        conos.forEach((c) => (c.material as THREE.Material).dispose());
        piso.dispose();
        rejilla.geometry.dispose(); (rejilla.material as THREE.Material).dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // Carga diferida: three solo se descarga cuando la vitrina entra en pantalla.
    const vigia = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      vigia.disconnect();
      iniciar().catch(() => estado.current.onFallo());
    }, { rootMargin: '300px' });
    vigia.observe(el);
    return () => { vivo = false; vigia.disconnect(); limpiar?.(); };
  }, [areas, iconos]);

  return <div ref={caja} className="gl" />;
}
