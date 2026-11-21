// Sonido sintético (Web Audio, sin archivos) de la intro de Ethos Académico: cristal y campanas que evocan descubrimiento.
// Línea de tiempo (s), igual a la de components/academico/IntroInvestigacion.tsx:
//   0.00–4.50  fondo armónico grave (La2 + Mi3) que entra despacio
//   0.15 + c·0.23  una campana por clúster de la red (escala pentatónica)
//   1.10  brillo de aire mientras se trazan las aristas
//   2.45 + i·0.30  cuatro toques de cristal: Scopus, PRISMA, Bibliometrix, Matrices
//   3.30  acorde final Do maj9 con «Ethos Académico»
// `ctx` puede ser AudioContext u OfflineAudioContext; `t0` es el instante de inicio en su reloj.

export function programarSonidoAcademico(ctx, t0 = 0, volumen = 0.45) {
  const maestro = ctx.createGain();
  maestro.gain.value = volumen;
  const comp = ctx.createDynamicsCompressor();
  maestro.connect(comp); comp.connect(ctx.destination);

  const s = (x) => t0 + x;

  // Campana: fundamental + parciales inarmónicos con caída larga.
  const campana = (f, t, dur, pico) => {
    [[1, 1], [2.76, 0.35], [5.4, 0.12]].forEach(([m, a]) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f * m;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(pico * a, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur / m ** 0.3);
      o.connect(g); g.connect(maestro);
      o.start(t); o.stop(t + dur + 0.05);
    });
  };

  // Fondo armónico.
  [110, 164.81].forEach((f) => {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, s(0));
    g.gain.exponentialRampToValueAtTime(0.05, s(1.2));
    g.gain.setValueAtTime(0.05, s(3.6));
    g.gain.exponentialRampToValueAtTime(0.0001, s(4.6));
    o.connect(g); g.connect(maestro);
    o.start(s(0)); o.stop(s(4.7));
  });

  // Una campana por clúster.
  [523.25, 659.25, 783.99, 880, 1174.66].forEach((f, c) => campana(f, s(0.15 + c * 0.23), 1.6, 0.09));

  // Brillo de aire mientras se trazan las aristas.
  const largo = Math.floor(ctx.sampleRate * 1.3);
  const buf = ctx.createBuffer(1, largo, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < largo; i += 1) d[i] = Math.random() * 2 - 1;
  const ruido = ctx.createBufferSource(); ruido.buffer = buf;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 3;
  bp.frequency.setValueAtTime(3000, s(1.1)); bp.frequency.exponentialRampToValueAtTime(9000, s(2.3));
  const gr = ctx.createGain();
  gr.gain.setValueAtTime(0.0001, s(1.1)); gr.gain.exponentialRampToValueAtTime(0.025, s(1.5)); gr.gain.exponentialRampToValueAtTime(0.0001, s(2.4));
  ruido.connect(bp); bp.connect(gr); gr.connect(maestro);
  ruido.start(s(1.1)); ruido.stop(s(2.4));

  // Cuatro toques de cristal (etapas del método).
  [1567.98, 1760, 2093, 2349.32].forEach((f, i) => campana(f, s(2.45 + i * 0.3), 0.7, 0.05));

  // Acorde final.
  [261.63, 329.63, 392, 493.88, 587.33].forEach((f, i) => campana(f, s(3.3 + i * 0.04), 2.2, 0.07));

  return () => { try { maestro.gain.setTargetAtTime(0, ctx.currentTime, 0.05); } catch { /* contexto cerrado */ } };
}
