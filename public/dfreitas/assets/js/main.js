(() => {
  const WA = '5561982602730';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  $$('[data-wa]').forEach(a => a.href = `https://wa.me/${WA}?text=${encodeURIComponent(a.dataset.wa)}`);
  $$('[data-year]').forEach(e => e.textContent = new Date().getFullYear());

  document.body.classList.add('is-loading');
  let done = false;
  const ready = () => {
    if (done) return; done = true;
    $('.loader')?.classList.add('is-done');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    setTimeout(() => $('.wa-float')?.classList.add('is-in'), 1200);
  };
  window.addEventListener('load', () => setTimeout(ready, 900));
  setTimeout(ready, 3500);

  // Nav
  const nav = $('[data-nav]'); let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 30);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
    lastY = y;
  }, { passive: true });
  const burger = $('[data-burger]');
  const setMenu = o => { document.body.classList.toggle('menu-open', o); burger.setAttribute('aria-expanded', o); $('[data-menu]').setAttribute('aria-hidden', !o); };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('[data-menu] a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .15 });
  $$('.reveal').forEach((el, i) => { el.style.setProperty('--d', `${(i % 4) * 0.08}s`); io.observe(el); });

  // Manifesto words light up on scroll
  const mq = $('[data-words]');
  if (mq) {
    const gold = ['bênção', 'caminho.', 'mais'];
    mq.innerHTML = mq.textContent.trim().split(/\s+/).map(w => `<span class="w${gold.includes(w) ? ' gold' : ''}">${w}</span>`).join(' ');
    const ws = $$('.w', mq);
    const upd = () => {
      const r = mq.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .35)));
      const n = Math.round(p * ws.length);
      ws.forEach((w, i) => w.classList.toggle('on', i < n));
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  // Counters
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  // Hero video + fluid captions
  const CAPS = [
    [0, 2.6, 'Igual uma festa que teve do…'], [2.6, 4, 'noventa anos do meu pai, né?'], [4, 5, 'Hum…'],
    [5, 7.6, 'Eu não fui por causa de *vergonha*.'], [7.6, 10, 'Minha família toda reunida, né?'],
    [10, 11.5, 'Eu, chegar lá…'], [11.5, 13, '*Careca*, né!'], [13, 15, 'A gente tem preconceito com a gente.'],
    [15, 18.5, 'Agora, da próxima, se Deus quiser, ele vai…'], [18.5, 19.6, 'Eu vou, né!?'],
    [19.6, 23.5, 'Vai de *cabelo!* Totalmente *diferente.*']
  ];
  const hv = $('[data-hero-video]'), cap = $('[data-captions]'), prog = $('[data-hero-progress]');
  let cur = -2;
  const render = i => i < 0 ? '' : CAPS[i][2].split(' ').map((w, k) => {
    const hl = w.includes('*');
    return `<span class="w${hl ? ' hl' : ''}" style="animation-delay:${k * 0.06}s">${w.replace(/\*/g, '')}</span>`;
  }).join('');
  const show = i => {
    cur = i; cap.classList.add('is-out');
    setTimeout(() => { if (cur !== i) return; cap.classList.remove('is-out'); cap.innerHTML = render(i); }, 250);
  };
  if (hv) {
    hv.addEventListener('timeupdate', () => {
      const t = hv.currentTime;
      if (hv.duration) prog.style.transform = `scaleX(${t / hv.duration})`;
    });
    const p = hv.play && hv.play(); if (p && p.catch) p.catch(() => {});
    const sb = $('[data-hero-sound]'), lbl = $('[data-sound-label]');
    sb.addEventListener('click', () => {
      hv.muted = !hv.muted;
      if (!hv.muted) { hv.currentTime = 0; hv.play(); $$('[data-reel] video').forEach(v => v.pause()); }
      sb.classList.toggle('is-on', !hv.muted); lbl.textContent = hv.muted ? 'Ativar som' : 'Som ativado';
    });
  }

  // Social proof reels
  const reels = $$('[data-reel]');
  reels.forEach(r => {
    const v = $('video', r), bar = $('.reel__bar span', r);
    $('.reel__media', r).addEventListener('click', () => {
      if (v.paused) {
        reels.forEach(o => { if (o !== r) $('video', o).pause(); });
        if (hv && !hv.muted) $('[data-hero-sound]').click();
        v.muted = false; v.play();
      } else v.pause();
    });
    v.addEventListener('play', () => { r.classList.add('is-playing'); r.classList.remove('is-paused'); });
    v.addEventListener('pause', () => { r.classList.remove('is-playing'); r.classList.add('is-paused'); });
    v.addEventListener('timeupdate', () => { if (v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`; });
  });

  // Pointer effects (desktop only)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => { const b = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * .2}px,${(e.clientY - b.top - b.height / 2) * .3}px)`; });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
        el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
        el.style.transform = `perspective(900px) rotateY(${(x - .5) * 8}deg) rotateX(${(.5 - y) * 8}deg)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }
})();
