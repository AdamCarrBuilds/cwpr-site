// A1 mark: flat 2D kinetic silhouette.
// Two flat charcoal halves on white. No shading, no depth, no bevels: the only
// 3D cue is how the silhouette moves (perspective turns, slide, parting).
// One GSAP timeline, 4 s, paused: loop it as a loader or scrub it with scroll.
// Frame 0 and frame 240 (4 s at 60 fps) are identical.
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/index.js';

export const DURATION = 4;
export const FPS = 60;
export const FRAMES = DURATION * FPS; // 240
export const CHARCOAL = '#2C2C2C';

const VIEWBOX = '0 0 744 743';
// The mark cut along its vertical seam (x = 371.2) into its two interlocking halves.
const HALVES = {
  left: {
    origin: '24.95% 37.5%', // centre of the half's own box: rotations happen about its own axes
    d: 'M371.164 185.012C306.059 185.359 238.861 193.718 176.676 212.865C114.491 232.011 25.3061 274.436 4.57322 342.102L0 360.181V174.599C0 115.107 85.9046 62.295 133.557 42.3354C207.435 11.4029 291.246 -0.650179 371.178 0.0298046C371.178 61.6683 371.138 123.36 371.178 185.012Z'
     + 'M371.191 557.416C276.7 555.176 175.436 540.963 92.3044 493.925C16.9196 451.272 -2.55994 377.821 59.3986 311.169C62.2252 308.129 71.7983 297.623 75.3582 297.756C77.1581 297.823 99.7709 312.036 104.104 314.276C188.862 357.995 277.26 367.168 371.178 371.208C371.204 432.846 371.164 494.538 371.178 556.19Z',
  },
  right: {
    origin: '74.95% 62.4%',
    d: 'M371.178 185.012C462.989 184.532 612.332 208.211 683.557 270.13C742.289 321.182 724.249 400.78 668.251 444.726C603.692 404.393 525.801 382.807 450.176 374.901C423.75 372.141 397.59 372.354 371.178 371.208C371.151 309.156 371.204 247.064 371.178 185.012Z'
     + 'M371.178 556.19C446.789 556.763 524.907 545.883 595.666 519.124C657.971 495.565 728.689 453.912 742.969 383.447L743.635 555.63C740.382 635.148 657.504 682.52 591.092 706.879C521.547 732.385 445.216 742.532 371.191 742.385V557.416Z',
  },
};

const css = `
.a1m{position:relative;width:100%;height:100%}
.a1m__mark{position:absolute;inset:22%;transform-style:preserve-3d}
.a1m__half{position:absolute;inset:0;width:100%;height:100%;overflow:visible;backface-visibility:visible;will-change:transform}
`;

/**
 * @param {HTMLElement} host  the box to draw in (square reads best; the mark fills its middle 56%)
 * @param {{ color?: string, label?: string }} [opts]
 */
export function createLogoMotion(host, opts = {}) {
  if (!document.getElementById('a1m-css')) {
    const s = document.createElement('style');
    s.id = 'a1m-css';
    s.textContent = css;
    document.head.appendChild(s);
  }
  const color = opts.color || CHARCOAL;
  host.innerHTML = '';
  const root = document.createElement('div');
  root.className = 'a1m';
  root.setAttribute('role', 'img');
  root.setAttribute('aria-label', opts.label || 'Center for World Philosophy and Religion');
  const mark = document.createElement('div');
  mark.className = 'a1m__mark';
  root.appendChild(mark);
  const els = {};
  for (const [name, h] of Object.entries(HALVES)) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', VIEWBOX);
    svg.setAttribute('class', 'a1m__half');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<path fill="${color}" d="${h.d}"/>`;
    mark.appendChild(svg);
    els[name] = svg;
  }
  host.appendChild(root);

  const L = els.left, R = els.right;
  // sizes are relative to the mark so it scales with any box
  const size = () => mark.getBoundingClientRect().width || 300;
  // one shared camera: perspective lives on the root, the mark keeps its halves in 3D space
  const setCamera = () => { root.style.perspective = `${size() * 3.2}px`; };
  setCamera();
  gsap.set(mark, { transformOrigin: '50% 50%' });
  gsap.set(L, { transformOrigin: HALVES.left.origin });
  gsap.set(R, { transformOrigin: HALVES.right.origin });

  const SLIDE = 9;     // yPercent: the cut, halves slide along the seam
  const PART = 11;     // xPercent: pull apart sideways
  const DEPTH = 0.16;  // z, as a share of the mark's width: one half comes forward, one goes back
  const TILT = 24;     // degrees of tilt while turning

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
  tl.addLabel('cut', 0.3)
    // 1. cut: the halves slide apart along their central seam
    .to(L, { yPercent: -SLIDE, duration: 0.75 }, 'cut')
    .to(R, { yPercent: SLIDE, duration: 0.75 }, 'cut')
    // 2. part: pull away sideways and in depth (depth reads only as perspective)
    .to(L, { xPercent: -PART, z: () => size() * DEPTH, duration: 0.75, ease: 'power3.inOut' }, 'cut+=0.4')
    .to(R, { xPercent: PART, z: () => -size() * DEPTH, duration: 0.75, ease: 'power3.inOut' }, 'cut+=0.4')
    // 3. turn: each half makes one full turn about its own vertical axis, tilting as it goes
    .addLabel('turn', 'cut+=0.72')
    .to(L, { rotationY: -360, duration: 1.8 }, 'turn')
    .to(R, { rotationY: 360, duration: 1.8 }, 'turn')
    .to(L, { rotationX: TILT, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'turn')
    .to(R, { rotationX: -TILT, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'turn')
    // 4. rejoin: come back together, then slide home along the seam and lock
    .addLabel('join', 'turn+=1.5')
    .to([L, R], { xPercent: 0, z: 0, duration: 0.72, ease: 'power3.inOut' }, 'join')
    .to([L, R], { yPercent: 0, duration: 0.72, ease: 'power3.inOut' }, 'join+=0.42');
  // slow sway of the whole mark across the loop: zero, with zero speed change, at both ends
  const sway = { p: 0 };
  tl.to(sway, {
    p: 1, duration: DURATION, ease: 'none',
    onUpdate: () => gsap.set(mark, { rotationY: 15 * Math.sin(sway.p * Math.PI * 2) }),
  }, 0);

  // keep px-based values (perspective, z) in step with the box size
  const ro = new ResizeObserver(() => {
    const t = tl.time();
    setCamera();
    // rewind to the rest pose first so invalidate() re-reads clean start values
    tl.progress(0).invalidate().time(t);
  });
  ro.observe(mark);

  const wrap = (t) => ((t % DURATION) + DURATION) % DURATION;
  return {
    timeline: tl,
    element: root,
    /** jump to a moment in seconds (wraps) */
    seek(t) { tl.pause(); tl.time(wrap(t)); },
    /** set loop progress 0..1 (wraps, so 1 = 0) */
    progress(p) { tl.progress(((p % 1) + 1) % 1); },
    dispose() { ro.disconnect(); tl.kill(); root.remove(); },
  };
}
