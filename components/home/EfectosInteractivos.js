import { useEffect } from 'react';

// Mejoras interactivas de la portada (no modifica el hero):
//  - foco de luz que sigue al cursor sobre las tarjetas,
//  - botones magnéticos,
//  - parallax suave en las imágenes grandes,
//  - entrada escalonada de listas y tarjetas,
//  - brillo que sigue al cursor en las secciones oscuras.
// Todo se aplica con atributos data-* y propiedades CSS independientes de `transform`, así no pisa
// las animaciones de aparición ni el estado de React. Se desactiva con «reducir movimiento».
const TARJETAS = '.desafio-item, .serv-card, .mv-card, .valor, .ing-card, .nos-item';
const MAGNETICOS = '.nav-cta, .nos-btn, .qf-submit, .ing-more a, .social-link';
const PARALLAX = '.nos-img, .brand-banner-img';
const ESCALONADOS = '.serv-list li, .principios li, .valor, .nos-item, .ing-card, .faq .item, .social-link';
const SECCIONES_OSCURAS = '.ing, .mv, .contacto, .cifras';

export default function EfectosInteractivos() {
  useEffect(() => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const limpiar = [];

    const marcar = (sel, attr) => document.querySelectorAll(sel).forEach((el) => el.setAttribute(attr, ''));

    if (!reducir) {
      // Entrada escalonada
      document.querySelectorAll(ESCALONADOS).forEach((el, i) => {
        el.setAttribute('data-rvx', '');
        el.style.setProperty('--rvx-delay', `${(i % 6) * 70}ms`);
      });
      const io = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); } });
      }, { threshold: 0.15 });
      document.querySelectorAll('[data-rvx]').forEach((el) => io.observe(el));
      limpiar.push(() => io.disconnect());
    }

    if (!reducir && fino) {
      marcar(TARJETAS, 'data-fx');
      marcar(SECCIONES_OSCURAS, 'data-fxglow');

      const mover = (e) => {
        const t = e.target instanceof Element ? e.target : null;
        if (!t) return;
        const card = t.closest('[data-fx]');
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${e.clientX - r.left}px`);
          card.style.setProperty('--my', `${e.clientY - r.top}px`);
        }
        const sec = t.closest('[data-fxglow]');
        if (sec) {
          const r = sec.getBoundingClientRect();
          sec.style.setProperty('--gx', `${e.clientX - r.left}px`);
          sec.style.setProperty('--gy', `${e.clientY - r.top}px`);
        }
        const mag = t.closest(MAGNETICOS);
        if (mag) {
          const r = mag.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          mag.style.translate = `${(dx * 10).toFixed(1)}px ${(dy * 8).toFixed(1)}px`;
        }
      };
      const salir = (e) => {
        const mag = e.target instanceof Element ? e.target.closest(MAGNETICOS) : null;
        if (mag) mag.style.translate = '';
      };
      document.addEventListener('pointermove', mover, { passive: true });
      document.addEventListener('pointerout', salir, { passive: true });
      limpiar.push(() => { document.removeEventListener('pointermove', mover); document.removeEventListener('pointerout', salir); });
    }

    if (!reducir) {
      const imgs = Array.from(document.querySelectorAll(PARALLAX));
      let pendiente = false;
      const actualizar = () => {
        pendiente = false;
        const alto = window.innerHeight;
        imgs.forEach((img) => {
          const r = img.parentElement.getBoundingClientRect();
          if (r.bottom < 0 || r.top > alto) return;
          const prog = (r.top + r.height / 2 - alto / 2) / alto; // -1 a 1
          img.style.scale = '1.12';
          img.style.translate = `0 ${(-prog * 28).toFixed(1)}px`;
        });
      };
      const alScroll = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); } };
      actualizar();
      window.addEventListener('scroll', alScroll, { passive: true });
      window.addEventListener('resize', alScroll);
      limpiar.push(() => { window.removeEventListener('scroll', alScroll); window.removeEventListener('resize', alScroll); });
    }

    return () => limpiar.forEach((f) => f());
  }, []);

  return (
    <style jsx global>{`
      [data-fx] { position: relative; }
      [data-fx]::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity 0.25s ease;
        background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(4,235,255,0.16), transparent 70%); }
      [data-fx]:hover::after { opacity: 1; }

      [data-rvx] { opacity: 0; translate: 0 18px; transition: opacity 0.6s ease var(--rvx-delay, 0ms), translate 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--rvx-delay, 0ms); }
      [data-rvx][data-in] { opacity: 1; translate: 0 0; }

      .cifras[data-fxglow] {
        background-image: radial-gradient(520px circle at var(--gx, 70%) var(--gy, 20%), rgba(4,235,255,0.10), transparent 60%), linear-gradient(180deg, #05111e 0%, #0a1b2b 100%) !important;
      }
      .ing[data-fxglow], .contacto[data-fxglow] {
        background-image: radial-gradient(520px circle at var(--gx, 70%) var(--gy, 20%), rgba(4,235,255,0.10), transparent 60%) !important;
      }
      .mv[data-fxglow] .mv-glow {
        background:
          radial-gradient(460px circle at var(--gx, 50%) var(--gy, 30%), rgba(4,235,255,0.16), transparent 62%),
          radial-gradient(circle at 18% 20%, rgba(4,235,255,0.10), transparent 38%),
          radial-gradient(circle at 85% 85%, rgba(15,88,118,0.30), transparent 42%);
      }

      .nav-cta, .nos-btn, .qf-submit { transition: translate 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
      .enfoque-img, .nos-img, .brand-banner-img { will-change: translate, scale; }

      .pw { display: inline-block; opacity: 0; translate: 0 0.6em; transition: opacity 0.55s ease, translate 0.55s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: calc(var(--i, 0) * 45ms); }
      .reveal.in .pw { opacity: 1; translate: 0 0; }
      @media (prefers-reduced-motion: reduce) { .social-link svg { animation: none !important; } .pw { opacity: 1; translate: none; transition: none; } [data-rvx] { opacity: 1; translate: none; transition: none; } }
    `}</style>
  );
}
