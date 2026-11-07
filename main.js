// Concept 05.4: smooth scroll, the concept 03 menu and progress line, the hero entrance (the print unveils upward), and the
// scroll-linked motion: words coming into focus, photographs passing sideways (05.2), the last plate (the School of Athens) opening to the full
// screen, the logo turning in The Solution, the shelves easing back, the orbits drawing outward, and the dive into their centre that opens onto the invitation.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideScreen = matchMedia('(min-width: 1024px)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const range = (p, a, b) => clamp((p - a) / (b - a));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const easeIO = t => -(Math.cos(Math.PI * t) - 1) / 2;

  if (!reduced && window.Lenis) new Lenis({ autoRaf: true, anchors: { offset: -20 }, lerp: .085 });

  (document.fonts ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]) : Promise.resolve())
    .then(() => requestAnimationFrame(() => root.classList.add('is-loaded')));

  const btn = document.querySelector('[data-menu-btn]');
  const menu = document.querySelector('[data-menu]');
  const setMenu = open => {
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    menu.classList.toggle('is-open', open);
    if (open) menu.querySelector('a').focus();
  };
  btn.addEventListener('click', e => { e.stopPropagation(); setMenu(menu.hidden); });
  addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target)) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  const orbits = document.querySelector('[data-orbits]');
  if (reduced) { orbits.style.setProperty('--op', 1); return; }

  const wordBlocks = [...document.querySelectorAll('[data-words]')].map(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    return { el, words: [...el.querySelectorAll('.w')] };
  });

  const heroArt = document.querySelector('[data-hero-art]');
  const pan = document.querySelector('[data-pan]');
  const track = document.querySelector('[data-pan-track]');
  const stage = pan.querySelector('.pan__stage');
  const textCol = pan.querySelector('.pan__text');
  const last = pan.querySelector('[data-centre]');
  const full = pan.querySelector('[data-full]');
  const lerp = (a, b, t) => a + (b - a) * t;
  const evo = document.querySelector('[data-evo]');
  const settle = document.querySelector('[data-settle]');
  const progress = document.querySelector('[data-progress]');
  const portal = document.querySelector('[data-portal]');
  const pStage = portal.querySelector('.portal__stage');
  const field = portal.querySelector('[data-field]');
  const closeBox = portal.querySelector('[data-close]');
  const easeIO3 = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const main = document.querySelector('main');

  const pinP = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight)); };
  const passP = (el, start = 1, end = .3) => { const r = el.getBoundingClientRect(); return clamp((innerHeight * start - r.top) / (innerHeight * (start - end))); };
  // 0 as an element enters at the bottom of the screen, 1 as it leaves at the top
  const crossP = el => { const r = el.getBoundingClientRect(); return clamp((innerHeight - r.top) / (innerHeight + r.height)); };

  const frame = () => {
    // Hero: the photograph pushes in slowly and the large mark drifts upward (no rotation)
    heroArt.style.setProperty('--hp', clamp(scrollY / innerHeight).toFixed(3));

    // The question: the plates pass sideways until the second to last, the School of Athens, sits exactly in the centre of the screen
    // (the quote column fading away as it nears, so nothing covers it); then it is lifted out and grows to the full screen.
    if (wideScreen.matches) {
      const p = pinP(pan);
      const W = stage.clientWidth, H = stage.clientHeight;
      const pw = last.offsetWidth, ph = last.offsetHeight;
      const travel = Math.max(0, track.offsetLeft + last.offsetLeft + pw / 2 - W / 2);
      track.style.setProperty('--tx', (-range(p, .03, .55) * travel).toFixed(1) + 'px');
      // a slow, even opening over the last part of the hold
      const g = easeIO(range(p, .58, .97));
      const x0 = W / 2 - pw / 2, y0 = track.offsetTop + last.offsetTop;
      const left = lerp(x0, 0, g);
      full.style.setProperty('--fl', left.toFixed(1) + 'px');
      // the quote column (and its rule) fades as the School of Athens grows, gone just as the picture's edge reaches the rule
      const rule = textCol.offsetWidth;
      textCol.style.setProperty('--to', p < .55 ? 1 : (1 - clamp((x0 - left) / Math.max(1, x0 - rule))).toFixed(3));
      full.style.setProperty('--ft', lerp(y0, 0, g).toFixed(1) + 'px');
      full.style.setProperty('--fw', lerp(pw, W, g).toFixed(1) + 'px');
      full.style.setProperty('--fh', lerp(ph, H, g).toFixed(1) + 'px');
      pan.classList.toggle('is-lifted', p >= .55);
    } else {
      track.style.removeProperty('--tx'); textCol.style.removeProperty('--to'); pan.classList.remove('is-lifted');
    }

    // The Solution: the logo motion in the photograph's corner, from its halves parted and turning (1.45 s into the 4 s loop) to
    // rejoined as the mark (4 s), as the picture rises from the bottom of the screen until its top is 30% down: coming together
    logoTarget = easeIO(passP(evo, 1, .3));
    if (!logoRunning) { logoRunning = true; requestAnimationFrame(glide); }

    settle.style.setProperty('--sp', ease(passP(settle, 1, .3)).toFixed(3));
    orbits.style.setProperty('--op', ease(passP(orbits, .95, .45)).toFixed(3));

    // The portal: with the figure pinned in the middle of the screen, the camera dives into the navy centre. The field is a circle
    // clip that starts exactly on the dot and grows exponentially (so the speed feels constant, as in a real zoom) until it covers
    // the screen; the orbits scale with it, rushing outward past the viewer, their bodies swinging round, and fade; then the
    // invitation rises on the navy in three steps.
    {
      const pp = pinP(portal);
      const sw = pStage.clientWidth, sh = pStage.clientHeight, fw = orbits.offsetWidth;
      const cx = orbits.offsetLeft + fw / 2, cy = orbits.offsetTop + orbits.offsetHeight / 2;
      const r0 = fw * 8 / 628, r1 = Math.hypot(Math.max(cx, sw - cx), Math.max(cy, sh - cy)) * 1.02;
      const e = easeIO3(range(pp, .1, .68));
      const cr = Math.exp(Math.log(r0) + Math.log(r1 / r0) * e), zs = cr / r0;
      const zo = 1 - range(Math.log(zs), Math.log(2), Math.log(9));
      field.style.setProperty('--cx', cx.toFixed(1) + 'px');
      field.style.setProperty('--cy', cy.toFixed(1) + 'px');
      field.style.setProperty('--cr', (e > 0 ? cr : 0).toFixed(1) + 'px');
      orbits.style.setProperty('--zs', zs.toFixed(4));
      orbits.style.setProperty('--zo', zo.toFixed(3));
      orbits.style.setProperty('--zr', (e * 140).toFixed(2) + 'deg');
      portal.classList.toggle('is-deep', zo <= 0);
      closeBox.style.setProperty('--c1', ease(range(pp, .7, .8)).toFixed(3));
      closeBox.style.setProperty('--c2', ease(range(pp, .74, .87)).toFixed(3));
      closeBox.style.setProperty('--c3', ease(range(pp, .8, .92)).toFixed(3));
      portal.classList.toggle('is-open', pp > .85);
    }

    wordBlocks.forEach(({ el, words }) => {
      const k = Math.round(passP(el, .95, .62) * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < k));
    });
    progress.style.transform = `scaleX(${clamp(scrollY / (main.offsetHeight - innerHeight)).toFixed(4)})`;
  };

  // The Solution: the logo motion runs from its halves parted and turning (1.45 s into the 4 s loop) to rejoined as the mark (4 s)
  // over most of the figure's passage across the screen, eased in and out and then glided towards the scroll position each frame,
  // so it moves slowly and settles softly rather than tracking every flick of the wheel.
  let logoTarget = 0, logoNow = 0, logoRunning = false;
  const glide = () => {
    logoNow += (logoTarget - logoNow) * .045;
    if (window.cwprLogo) window.cwprLogo.seek(1.45 + 2.549 * logoNow);
    if (Math.abs(logoTarget - logoNow) > .0005) requestAnimationFrame(glide); else logoRunning = false;
  };

  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; frame(); }); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  addEventListener('cwpr-logo-ready', onScroll);
  frame();
})();
