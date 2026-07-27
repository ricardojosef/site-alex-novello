gsap.registerPlugin(ScrollTrigger);

/* ---------- NAV: fundo ao rolar ---------- */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -60',
  end: 99999,
  toggleClass: { targets: nav, className: 'scrolled' }
});

/* ---------- NAV MOBILE: menu hambúrguer ---------- */
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

function closeMobileNav() {
  if (!navLinks.classList.contains('open')) return;
  navLinks.classList.remove('open');
  burger.classList.remove('active');
  burger.setAttribute('aria-expanded', 'false');
}
function openMobileNav() {
  navLinks.classList.add('open');
  burger.classList.add('active');
  burger.setAttribute('aria-expanded', 'true');
  gsap.from(navLinks.querySelectorAll('a'), { opacity: 0, y: -10, stagger: 0.06, duration: 0.35 });
}
if (burger) {
  burger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileNav));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) closeMobileNav();
  });
}

/* ---------- HERO: sequência de entrada ---------- */
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl
  .from('.nav', { y: -30, opacity: 0, duration: 0.7 })
  .from('.hero-copy .eyebrow', { y: 20, opacity: 0, duration: 0.6 }, 0.2)
  .from('.hero-copy h1', { y: 30, opacity: 0, duration: 0.8 }, 0.35)
  .from('.hero-sub', { y: 24, opacity: 0, duration: 0.7 }, 0.55)
  .from('.hero-actions > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, 0.7)
  .from('.hero-media-shape', { scale: 0.7, opacity: 0, duration: 1, ease: 'expo.out' }, 0.3)
  .from('.hero-photo', { scale: 0.85, opacity: 0, duration: 1, ease: 'expo.out' }, 0.45)
  .from('.hero-tag', { y: 16, opacity: 0, duration: 0.5, stagger: 0.15 }, 1.1)
  .from('.scroll-cue', { opacity: 0, duration: 0.6 }, 1.3);

/* linhas de plantio do hero: desenho sutil */
gsap.from('.hero .row-path', {
  attr: { 'stroke-dasharray': 2000, 'stroke-dashoffset': 2000 },
  duration: 2.2,
  ease: 'power2.out',
  stagger: 0.15,
  delay: 0.2
});

/* ---------- REVEAL ON SCROLL: genérico ----------
   Importante: elementos que já são filhos diretos de um dos grids
   (.benefit-grid, .mentor-grid, .method-grid, .testi-grid) NÃO recebem
   a classe "reveal-up" no HTML — eles são animados uma única vez, em
   conjunto, pelo bloco de stagger mais abaixo. Isso evita que dois
   tweens/ScrollTriggers concorrentes fiquem competindo pelas mesmas
   propriedades (opacity/y) do mesmo elemento, o que antes fazia os
   cards de mentoria (e os demais grids) aparecerem fora de sincronia. */
gsap.utils.toArray('.reveal-up').forEach((el) => {
  if (el.closest('.hero')) return; // hero já tem timeline própria
  gsap.fromTo(el,
    { y: 34, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
    }
  );
});

gsap.utils.toArray('.reveal-scale').forEach((el) => {
  if (el.closest('.hero')) return;
  gsap.fromTo(el,
    { scale: 0.9, opacity: 0 },
    {
      scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
    }
  );
});

/* ---------- Stagger único para cada grid de cards ---------- */
['.benefit-grid', '.mentor-grid', '.method-grid', '.testi-grid'].forEach((sel) => {
  const grid = document.querySelector(sel);
  if (!grid) return;
  gsap.fromTo(grid.children,
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none reverse' }
    }
  );
});

/* ---------- Contadores numéricos das estatísticas ---------- */
gsap.utils.toArray('.stat-num').forEach((el) => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimals = target % 1 !== 0 ? 1 : 0;
  const obj = { val: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
        }
      });
    }
  });
});

/* ---------- Sections escuras: parallax sutil nas linhas de fundo (SVG) ---------- */
gsap.utils.toArray('.hero-rows').forEach((rows) => {
  gsap.to(rows, {
    y: -40,
    ease: 'none',
    scrollTrigger: { trigger: rows.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 1 }
  });
});

/* ---------- Faixas de fundo (fotos de plantação): parallax + zoom sutil ---------- */
gsap.utils.toArray('.field-band').forEach((band) => {
  gsap.fromTo(band,
    { backgroundPosition: '50% 15%' },
    {
      backgroundPosition: '50% 45%',
      ease: 'none',
      scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: 1 }
    }
  );
});

/* ---------- Método A.G.R.O.: leve elevação ao passar o mouse ---------- */
document.querySelectorAll('.method-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { y: -6, duration: 0.4, ease: 'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' });
  });
});

/* ---------- Botões: leve resposta magnética ao passar o mouse ---------- */
document.querySelectorAll('.btn-primary').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.15;
    const y = (e.clientY - r.top - r.height / 2) * 0.3;
    gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1,0.4)' });
  });
});

/* ---------- Robustez: recalcular posições depois que todas as imagens
   carregarem, pra evitar ScrollTriggers com "start" desatualizado
   (causa comum de elementos que não aparecem no scroll esperado) ---------- */
window.addEventListener('load', () => ScrollTrigger.refresh());
document.querySelectorAll('img').forEach((img) => {
  if (!img.complete) img.addEventListener('load', () => ScrollTrigger.refresh());
});