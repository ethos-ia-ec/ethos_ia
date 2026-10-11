// Sonido sintético (Web Audio, sin archivos) acompasado a la intro del cubo, con estética metálica y cibernética.
// Línea de tiempo (s), igual a la de components/home/IntroCubo.js:
//   0.00  zumbido de encendido + barrido ascendente        (el cubo aparece y se expande)
//   1.15  despegue · 1.47 golpe grave al caer · 1.66 rebote
//   1.55–2.65  tictacs digitales          (las letras se despliegan de izquierda a derecha)
//   2.55–3.85  «shing» metálico con parciales inarmónicos (brillo que recorre las letras)
//   4.30  barrido descendente             (salida)
// `ctx` puede ser AudioContext u OfflineAudioContext; `t0` es el instante de inicio en su reloj.

export function programarSonidoIntro(ctx, t0 = 0, volumen = 0.5, desde = 0) {
  // `desde` (s): omite los sonidos que ya deberían haber sonado, para activar el audio a mitad de la intro.
  const maestro = ctx.createGain();
  maestro.gain.value = volumen;
  const filtro = ctx.createBiquadFilter();
  filtro.type = 'lowpass';
  filtro.frequency.value = 9000;
  const comp = ctx.createDynamicsCompressor();
  maestro.connect(filtro); filtro.connect(comp); comp.connect(ctx.destination);

  const envolvente = (g, t, ataque, pico, caida) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(pico, t + ataque);
    g.gain.exponentialRampToValueAtTime(0.0001, t + ataque + caida);
  };
  const tono = (tipo, f0, f1, t, dur, pico, ataque = 0.01, destino = maestro) => {
    if (t < t0 + desde - 0.02) return;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = tipo;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    envolvente(g, t, ataque, pico, dur - ataque);
    o.connect(g); g.connect(destino);
    o.start(t); o.stop(t + dur + 0.05);
  };
  const ruido = (t, dur, pico, f0, f1, q = 4) => {
    if (t < t0 + desde - 0.02) return;
    const largo = Math.max(1, Math.floor(ctx.sampleRate * (dur + 0.05)));
    const buf = ctx.createBuffer(1, largo, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < largo; i += 1) d[i] = Math.random() * 2 - 1;
    const fuente = ctx.createBufferSource(); fuente.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q;
    bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain(); envolvente(g, t, dur * 0.25, pico, dur * 0.75);
    fuente.connect(bp); bp.connect(g); g.connect(maestro);
    fuente.start(t); fuente.stop(t + dur + 0.05);
  };

  const s = (x) => t0 + x;

  // 1) Encendido: zumbido grave + barrido ascendente con filtro
  tono('sawtooth', 70, 110, s(0), 1.1, 0.10, 0.25);
  tono('sine', 55, 55, s(0), 1.4, 0.14, 0.3);
  tono('sawtooth', 180, 1500, s(0.05), 0.55, 0.07, 0.2);
  ruido(s(0.05), 0.6, 0.10, 400, 6000, 2);

  // 2) Salto, golpe y rebote
  tono('sine', 360, 760, s(1.15), 0.2, 0.12, 0.02);
  tono('sine', 150, 42, s(1.47), 0.34, 0.5, 0.005);
  ruido(s(1.47), 0.08, 0.16, 1800, 700, 1.2);
  tono('sine', 190, 60, s(1.66), 0.2, 0.2, 0.005);

  // 3) Letras: tictacs digitales de izquierda a derecha (subiendo de tono), uno por letra de «ETHOS IA»
  for (let i = 0; i < 8; i += 1) {
    const t = s(1.6 + i * 0.125);
    tono('square', 1300 + i * 190, 1300 + i * 190, t, 0.05, 0.07, 0.003);
    tono('sine', 2600 + i * 380, 2600 + i * 380, t, 0.07, 0.04, 0.003);
  }

  // 4) Brillo metálico: «shing» con parciales inarmónicos y barrido de aire
  ruido(s(2.55), 1.0, 0.12, 2500, 9000, 3);
  [2480, 3720, 5130, 6890].forEach((f, i) => tono('sine', f, f * 0.995, s(2.65), 1.15 - i * 0.12, 0.10 / (i + 1), 0.02));
  tono('triangle', 820, 3280, s(2.55), 0.9, 0.05, 0.2);

  // 5) Salida: barrido descendente
  tono('sawtooth', 1400, 90, s(4.3), 0.55, 0.07, 0.03);
  ruido(s(4.3), 0.5, 0.08, 5000, 400, 2);

  return () => { try { maestro.gain.setTargetAtTime(0, ctx.currentTime, 0.04); } catch { /* contexto cerrado */ } };
}
