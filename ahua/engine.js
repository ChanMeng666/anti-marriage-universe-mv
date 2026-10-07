// Shared helpers on top of lib/ (paper pieces, rig, light): palette, auto inset, text cuts, camera, folds, sheets.
import { canvas, piece as rawPiece, fill, cut, trace, P, Pl, fillPaper, paperGrain, finishPaper, rnd, ellipsePoly } from './lib/paper.js';
import { mul, T, R, S, put, scaleOf, ap } from './lib/rig.js';
import { clamp, lerp, seg, ss, eio, eo, ei, back, hash } from '/core/lib.js';
export { canvas, fill, cut, trace, P, Pl, fillPaper, rnd, ellipsePoly, mul, T, R, S, put, scaleOf, ap, clamp, lerp, seg, ss, eio, eo, ei, back, hash };
export * from './lib/motifs.js';
export { cutTaper, cutLine, within, curve, transmitOf, holesOf, paperShadow, noShadow } from './lib/paper.js';

export const W = 1920, H = 1080, TAU = Math.PI * 2, DEG = Math.PI / 180;
export const COL = {
  red: '#d2201f', near: '#df3229', far: '#ab171c',          // Ah Hua: body, near limb, far limb
  deep: '#8f1218', deep2: '#6f0e17',                        // tradition's things, one and two steps deeper
  pale: '#e2796c', pale2: '#ecab9a', pale3: '#f1cdb8',      // far day layers
  teal: '#1d7c84', tealNear: '#2a959c', tealFar: '#155c66', tealPale: '#7fbcb9',   // Ah Fa's dyed paper
  cream: '#f1e7d0', cream2: '#e2d4b4', steel: '#7f8d9c', steel2: '#5d6a79',
  gold: '#d9a93f', back: '#e98f86', sub: '#7d0c18',
  n0: '#10152b', n1: '#1b2447', n2: '#243060', n3: '#2e3d78', n4: '#3d4f92', n5: '#7a88ba',   // night papers, far → near accents
  wood: '#5a2a22'
};
export const step = (t, fps = 12) => Math.floor(t * fps + 1e-6) / fps;

// ---------- pieces ----------
const CACHE = new Map();
export const memo = (key, fn) => { let v = CACHE.get(key); if (v === undefined) { v = fn(); CACHE.set(key, v); } return v; };
export const piece = (box, draw, opt = {}) => rawPiece(box, draw, opt);
// polygon shorthands (unit coordinates)
export const rectP = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
export const blob = (g, pts, col, seed = 1, amp = .35) => fill(g, q => trace(q, P(pts, true, amp, seed)), col);     // smooth + wobble
export const poly = (g, pts, col, seed = 1, amp = .3) => fill(g, q => trace(q, Pl(pts, true, amp, seed)), col);     // sharp + wobble
export const disc = (g, x, y, rx, col, ry = rx, seed = 1) => fill(g, q => trace(q, P(ellipsePoly(x, y, rx, ry, 0, 28).slice(0, -1), true, .3, seed)), col);
export const hole = (g, pts, seed = 1, smooth = true) => cut(g, q => trace(q, smooth ? P(pts, true, .2, seed) : Pl(pts, true, .2, seed)));
export const holeC = (g, x, y, r, ry = r) => cut(g, q => q.ellipse(x, y, r, ry, 0, 0, 7));

// The classic double outline for any silhouette already painted on g: a thin slit `ins` units inside the edge.
// Works on the alpha mask (two-pass chamfer distance), so call it after the fills and before the pattern cuts.
export function autoInset(g, ins = 3.5, gap = 1.5) {
  const c = g.canvas, w = c.width, h = c.height, K = Math.abs(g.getTransform().a);
  const id = g.getImageData(0, 0, w, h), d = id.data, D = new Float32Array(w * h), INF = 1e6, lo = ins * K, hi = (ins + gap) * K, lim = hi + 3;
  for (let i = 0; i < w * h; i++) D[i] = d[i * 4 + 3] > 127 ? INF : 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x; if (!D[i]) continue; let v = D[i];
    if (x === 0 || y === 0) v = 1; else { v = Math.min(v, D[i - 1] + 1, D[i - w] + 1, D[i - w - 1] + 1.414); if (x < w - 1) v = Math.min(v, D[i - w + 1] + 1.414); else v = Math.min(v, 1); }
    D[i] = v;
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x; if (!D[i]) continue; let v = D[i];
    if (x === w - 1 || y === h - 1) v = Math.min(v, 1); else { v = Math.min(v, D[i + 1] + 1, D[i + w] + 1, D[i + w + 1] + 1.414); if (x > 0) v = Math.min(v, D[i + w - 1] + 1.414); }
    D[i] = v;
    if (v < lim && v > lo - 1) { const a = Math.max(clamp(lo - v + .5), clamp(v - hi + .5)); d[i * 4 + 3] *= a; }
  }
  g.putImageData(id, 0, 0);
}
// text as holes (yin cut) or as paper (yang cut) in the current unit space
export const FONT = '"Noto Serif SC"';
export function cutText(g, s, x, y, size, wt = 900, align = 'center') {
  g.save(); g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; g.font = `${wt} ${size}px ${FONT}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); g.restore();
}
export function inkText(g, s, x, y, size, col, wt = 900, align = 'center') {
  g.save(); g.fillStyle = col; g.font = `${wt} ${size}px ${FONT}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); g.restore();
}
// a single yang-cut glyph as its own piece (title letters)
export function glyph(ch, size, col = COL.red, seed = 3) {
  return memo(`gl|${ch}|${size}|${col}`, () => piece([-size * .62, -size * .66, size * .62, size * .66], g => { inkText(g, ch, 0, 0, size, col); }, { seed, ss: 2, edge: 1.6 }));
}

// ---------- camera ----------
// world → screen: look at (cx, cy) with zoom z and roll (rad)
export const cam = (cx, cy, z = 1, roll = 0) => mul(mul(mul(T(W / 2, H / 2), R(roll)), S(z)), T(-cx, -cy));
export const shake = (t, amp, seed = 0) => [(hash(Math.floor(t * 24) * 1.7 + seed) - .5) * 2 * amp, (hash(Math.floor(t * 24) * 2.3 + seed + 9) - .5) * 2 * amp];
// decaying hit shake: sum of hits at times ts
export function hitShake(t, ts, amp = 10, dur = .28) {
  let a = 0; for (const h of ts) if (t >= h && t < h + dur) a = Math.max(a, amp * (1 - (t - h) / dur));
  return a ? shake(t, a, 3) : [0, 0];
}
export const at = (C, x, y, s = 1, rot = 0, sx = 1) => mul(mul(mul(C, T(x, y)), R(rot)), S(s * sx, s));
export const ground = (g, kind, C = [1, 0, 0, 1, 0, 0], tint = null) => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); fillPaper(g, kind, 0, 0, W, H, C, tint); g.restore(); };

// keyframes with holds: keys = [[t, value], …]; each change eases over `d` seconds ending at the key (hard poses, tiny eases)
export function keys(t, ks, d = .3, ease = eio) {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = ks.length - 1; i >= 0; i--) if (t >= ks[i][0]) {
    if (i === ks.length - 1) return ks[i][1];
    const n = ks[i + 1], dd = Math.min(n[2] ?? d, n[0] - ks[i][0]), u = ease(seg(t, n[0] - dd, n[0]));
    return mix(ks[i][1], n[1], u);
  }
}
export function mix(a, b, u) {
  if (u <= 0) return a; if (u >= 1) return b;
  if (typeof a === 'number') return lerp(a, b, u);
  if (Array.isArray(a)) return a.map((v, i) => mix(v, b[i] ?? v, u));
  if (a && typeof a === 'object') { const o = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) o[k] = (k in a && k in b) ? mix(a[k], b[k], u) : (u < .5 ? (a[k] ?? b[k]) : (b[k] ?? a[k])); return o; }
  return u < .5 ? a : b;
}
// "pop" on a hit: 1.15× for one 12 fps step
export const pop = (t, t0, k = 1.15) => (t >= t0 && t < t0 + 1 / 12) ? k : 1;
// a thing that arrives on a hit: hidden before, pop, then settled
export const arrive = (t, t0) => t < t0 ? 0 : pop(t, t0);

// ---------- folding (STYLE §5): the flap beyond the local line x = fx is split into strips ----------
const [Fc, Fg] = canvas(W, H);
// th: 0 = flat, PI = folded over onto the fixed part. side = +1 folds the x > fx part, -1 the x < fx part.
export function foldPut(g, p, M, fx, side, th, opt = {}) {
  const x0 = p.x0, x1 = p.x0 + p.w, y0 = p.y0, y1 = p.y0 + p.h, cy = (y0 + y1) / 2;
  // fixed part
  g.save(); g.setTransform(...M); g.beginPath(); if (side > 0) g.rect(x0 - 2, y0 - 50, fx - x0 + 2, p.h + 100); else g.rect(fx, y0 - 50, x1 - fx + 2, p.h + 100); g.clip();
  put(g, p, M, { shadow: opt.shadow ?? 1 }); g.restore();
  if (th <= .001) { g.save(); g.setTransform(...M); g.beginPath(); if (side > 0) g.rect(fx, y0 - 50, x1 - fx + 2, p.h + 100); else g.rect(x0 - 2, y0 - 50, fx - x0 + 2, p.h + 100); g.clip(); put(g, p, M, { shadow: opt.shadow ?? 1 }); g.restore(); return; }
  const c = Math.cos(th), lift = Math.sin(th), span = side > 0 ? x1 - fx : fx - x0, N = 14;
  Fg.setTransform(1, 0, 0, 1, 0, 0); Fg.clearRect(0, 0, W, H);
  for (let i = 0; i < N; i++) {
    const a = fx + side * span * i / N, b = fx + side * span * (i + 1) / N, m = (a + b) / 2, sc = 1 + .28 * Math.abs(m - fx) / Math.max(span, 1) * lift * (c < 0 ? .6 : 1);
    // x' = fx + (x - fx) * c ; y' = cy + (y - cy) * sc
    const L = [c, 0, 0, sc, fx * (1 - c), cy * (1 - sc)];
    Fg.save(); Fg.setTransform(...mul(M, L)); Fg.beginPath(); Fg.rect(Math.min(a, b) - .4, y0 - 4, Math.abs(b - a) + .8, p.h + 8); Fg.clip();
    Fg.drawImage(p.c, p.x0, p.y0, p.w, p.h);
    Fg.globalCompositeOperation = 'source-atop';
    if (c < 0) { Fg.fillStyle = opt.back || COL.back; Fg.globalAlpha = .93; Fg.fillRect(x0 - 5, y0 - 5, p.w + 10, p.h + 10); Fg.globalAlpha = 1; }
    Fg.fillStyle = `rgba(40,0,6,${.42 * lift})`; Fg.fillRect(x0 - 5, y0 - 5, p.w + 10, p.h + 10);
    Fg.restore();
  }
  const z = scaleOf(M);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.shadowColor = `rgba(40,6,8,${.3 + .25 * lift})`; g.shadowBlur = (5 + 22 * lift) * z; g.shadowOffsetX = (3 + 14 * lift) * z; g.shadowOffsetY = (4 + 18 * lift) * z;
  g.drawImage(Fc, 0, 0); g.restore();
}
// fold angle on a hit: closes (0 → PI) or opens (PI → 0) in `d` seconds with the "pa!" ease-out
export const foldTh = (t, t0, d = .5, open = false) => { const u = eo(seg(t, t0, t0 + d)); return open ? Math.PI * (1 - u) : Math.PI * u; };

// ---------- loose paper: scraps that flutter down ----------
// n scraps born at t0 from (x, y); deterministic; drawn on ones
export function scraps(g, C, t, t0, x, y, n, col, opt = {}) {
  if (t < t0) return; const dt = t - t0, life = opt.life || 2.2; if (dt > life) return;
  const sp = opt.spread || 160, gr = opt.grav || 520, sz = opt.size || 12, up = opt.up || 180;
  g.save();
  for (let k = 0; k < n; k++) {
    const s = (opt.seed || 0) * 31 + k, vx = (hash(s + .1) - .5) * 2 * sp + (opt.vx || 0), vy = -up * (.3 + hash(s + .2)), flutter = Math.sin(dt * (6 + hash(s + .3) * 6) + s) * 14;
    const px = x + vx * dt + flutter, py = y + vy * dt + .5 * gr * dt * dt * (opt.float ? .25 : 1), r = dt * (3 + hash(s + .4) * 5) * (hash(s + .5) < .5 ? -1 : 1), w = sz * (.5 + hash(s + .6)), sq = Math.cos(dt * (5 + hash(s + .7) * 5) + s);
    const M = mul(mul(mul(C, T(px, py)), R(r)), S(1, .25 + .75 * Math.abs(sq)));
    g.setTransform(...M); g.globalAlpha = clamp((life - dt) / .3);
    g.shadowColor = 'rgba(40,6,10,.3)'; g.shadowBlur = 3; g.shadowOffsetX = 2; g.shadowOffsetY = 3;
    g.fillStyle = Array.isArray(col) ? col[k % col.length] : col; g.beginPath();
    if (k % 3 === 0) { g.moveTo(-w, -w * .3); g.lineTo(w, 0); g.lineTo(-w * .6, w * .5); } else if (k % 3 === 1) { g.moveTo(-w * .7, -w * .5); g.lineTo(w * .7, -w * .3); g.lineTo(w * .5, w * .5); g.lineTo(-w * .8, w * .3); } else g.ellipse(0, 0, w * .7, w * .35, 0, 0, 7);
    g.closePath(); g.fill();
  }
  g.restore();
}

// ---------- sheet transitions (paper actions between two rendered sheets) ----------
function clipHalf(pts, nx, ny, d) {   // keep n·p >= d
  const o = []; for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], da = a[0] * nx + a[1] * ny - d, db = b[0] * nx + b[1] * ny - d;
    if (da >= 0) o.push(a); if ((da >= 0) !== (db >= 0)) { const u = da / (da - db); o.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]); }
  } return o;
}
// A (outgoing) lifts off B (incoming) along a line with normal angle `ang` sweeping across the frame; the back of the sheet shows.
export function peel(g, A, B, u, ang = -Math.PI / 4, backCol = COL.cream2) {
  const nx = Math.cos(ang), ny = Math.sin(ang), R4 = rectP(0, 0, W, H), ds = R4.map(p => p[0] * nx + p[1] * ny), dmax = Math.max(...ds), dmin = Math.min(...ds);
  const d = lerp(dmax + 40, dmin - 60, u);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(B, 0, 0);
  const keep = clipHalf(R4, -nx, -ny, -d);     // part of A still lying flat: n·p <= d
  if (keep.length > 2) { g.save(); g.beginPath(); trace(g, keep); g.clip(); g.drawImage(A, 0, 0); g.restore(); }
  const gone = clipHalf(R4, nx, ny, d);        // lifted part, mirrored across the line
  if (gone.length > 2) {
    const fl = gone.map(([x, y]) => { const k = 2 * (x * nx + y * ny - d); return [x - k * nx * .62, y - k * ny * .62]; });   // .62: the flap curls, it does not lie flat
    g.save(); g.shadowColor = 'rgba(20,6,10,.5)'; g.shadowBlur = 38; g.shadowOffsetX = -18 * nx; g.shadowOffsetY = -18 * ny + 10;
    g.beginPath(); trace(g, fl); g.fillStyle = backCol; g.fill(); g.restore();
    g.save(); g.beginPath(); trace(g, fl); g.clip();
    const pat = g.createPattern(paperGrain(), 'repeat'); g.globalCompositeOperation = 'soft-light'; g.fillStyle = pat; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'source-over';
    const x0 = nx * d, y0 = ny * d, gr = g.createLinearGradient(x0, y0, x0 - nx * 260, y0 - ny * 260); gr.addColorStop(0, 'rgba(40,10,10,.34)'); gr.addColorStop(.25, 'rgba(255,255,255,.14)'); gr.addColorStop(1, 'rgba(40,10,10,.1)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore();
  }
  g.restore();
}
// B is laid over A from a side (dir = [dx, dy] where it comes from), like a fresh sheet put on the table
export function slide(g, A, B, u, dir = [1, 0]) {
  const e = eo(u), x = dir[0] * W * (1 - e), y = dir[1] * H * (1 - e);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(A, 0, 0);
  g.shadowColor = 'rgba(20,6,10,.5)'; g.shadowBlur = 30; g.shadowOffsetX = -10 * dir[0]; g.shadowOffsetY = -10 * dir[1] + 6;
  g.drawImage(B, x, y); g.restore();
}
// A drops away (the sheet flies off), B was under it
export function fall(g, A, B, u) {
  const e = ei(u);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(B, 0, 0);
  g.translate(W / 2, H / 2 + e * H * 1.25); g.rotate(e * .22); g.shadowColor = 'rgba(20,6,10,.5)'; g.shadowBlur = 40; g.shadowOffsetY = 20;
  g.drawImage(A, -W / 2, -H / 2); g.restore();
}
// a cut through the frame: A is snipped along a zigzag diagonal and its two halves slide apart
export function snip(g, A, B, u) {
  const zig = []; for (let i = 0; i <= 12; i++) zig.push([W * (.62 - .24 * i / 12) + (i % 2 ? 26 : -26), H * i / 12]);
  const cutU = seg(u, 0, .35), e = ei(seg(u, .3, 1)), yc = H * cutU;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(B, 0, 0);
  for (const sgn of [-1, 1]) {
    g.save(); g.translate(sgn * e * W * .62, e * 160); g.rotate(sgn * e * .12);
    g.beginPath(); if (sgn < 0) { g.moveTo(-200, -200); for (const p of zig) g.lineTo(p[0], p[1] <= 0 ? -200 : p[1]); g.lineTo(zig[12][0], H + 200); g.lineTo(-200, H + 200); } else { g.moveTo(W + 200, -200); g.lineTo(zig[0][0], -200); for (const p of zig) g.lineTo(p[0], p[1]); g.lineTo(zig[12][0], H + 200); g.lineTo(W + 200, H + 200); }
    g.closePath(); g.shadowColor = 'rgba(20,6,10,.5)'; g.shadowBlur = 30; g.shadowOffsetY = 10; g.save(); g.clip(); g.drawImage(A, 0, 0); g.restore(); g.restore();
  }
  if (cutU < 1 && e === 0) {   // the cut line opening behind the blades
    g.strokeStyle = 'rgba(20,6,10,.55)'; g.lineWidth = 5; g.beginPath(); for (const p of zig) { if (p[1] > yc) break; g.lineTo(p[0], p[1]); } g.stroke();
  }
  g.restore();
  return { tip: [W * (.62 - .24 * cutU) , yc], cutting: cutU < 1 };
}
