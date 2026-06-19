/* ── CURSOR ─────────────────────────────────────────────── */
(function initCursor() {
  const cur  = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  if (!cur || !ring) return;
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function tick() {
    rx += (mx-rx) * .12; ry += (my-ry) * .12;
    cur.style.left  = mx+'px'; cur.style.top  = my+'px';
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a,button,.mag,.card,input,select,textarea').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
  });
})();

/* ── MAGNETIC BUTTONS ───────────────────────────────────── */
document.querySelectorAll('.mag').forEach(btn => {
  let frame;
  btn.addEventListener('mousemove', e => {
    cancelAnimationFrame(frame);
    const r  = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width/2)  * .32;
    const dy = (e.clientY - r.top  - r.height/2) * .32;
    btn.style.transform = `translate(${dx}px,${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    cancelAnimationFrame(frame);
    const cur = btn.style.transform.match(/-?[\d.]+/g);
    let ox = cur ? parseFloat(cur[0]) : 0;
    let oy = cur ? parseFloat(cur[1]) : 0;
    const t0 = performance.now();
    function spring(now) {
      const p = Math.min((now-t0)/280, 1);
      const e = 1 - Math.pow(1-p, 3);
      btn.style.transform = `translate(${ox*(1-e)}px,${oy*(1-e)}px)`;
      if (p < 1) frame = requestAnimationFrame(spring);
    }
    frame = requestAnimationFrame(spring);
  });
});

/* ── SCROLL REVEAL ──────────────────────────────────────── */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: .08, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── COUNTUP ────────────────────────────────────────────── */
(function initCountUp() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const t0 = performance.now();
      const dur = 1400;
      function step(now) {
        const p    = Math.min((now-t0)/dur, 1);
        const ease = 1 - Math.pow(1-p, 3);
        el.textContent = Math.round(ease*target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: .4 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
})();

/* ── ACTIVE NAV LINK ────────────────────────────────────── */
(function markActive() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();
