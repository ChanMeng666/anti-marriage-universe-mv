// Shared kit for the shots: song data (aligned lyrics, beat grid), time helpers, in-picture type,
// and the three places of the film (the café, her room, his road).
import { g, W, H, clear, rect, rrect, line, circle, ellipse, poly, text, over, layer, blob, curve, limb } from './engine/draw.js';
import { clamp, lerp, seg, ss, eio, eo, ei, back, hash, mulberry, TAU } from '/core/lib.js';
import { R, T, Y, K, P, SKIN, tint, LOOK, figure, head, cup, steam, key, chair, table, lamp, bubble, laptop, moto, rider, sofa, glass, mask, warrior, regmark, scissors, house } from './cast.js';

export let DUR = 354.8;
export const SHOTS = [];          // [{id, t0, t1, fn, o}]
export const KICKS = [];          // [t, px]: registration kicks, on beats
export let CUES = [], LINES = [], BEATS = [], PULSE = [], BARS = [];
export function setData(lines, cues, beats) {
  LINES = lines; CUES = cues; BEATS = beats.beats; DUR = beats.dur;
  PULSE = BEATS.filter((_, i) => i % 2 === 0);            // the felt pulse (~72 BPM)
  BARS = BEATS.filter((_, i) => i % 8 === 6);             // bar lines (the low hits)
}
export const TEXTS = [];           // in-picture text of the frame being drawn (for readcheck)

// ───────── time helpers ─────────
export const near = (arr, t) => arr.reduce((a, b) => Math.abs(b - t) < Math.abs(a - t) ? b : a, arr[0]);
export const before = (arr, t) => { let r = arr[0]; for (const b of arr) { if (b <= t) r = b; else break; } return r; };
export const L0 = i => LINES[i].t0, L1 = i => LINES[i].t1;
// time of a word inside a lyric line (first char of `w`), from the aligned per-character times
export const AT = (i, w) => { const l = LINES[i], s = l.text.replace(/[^一-鿿A-Za-z]/g, ''), k = s.indexOf(w); return k < 0 ? l.t0 : l.ct[k]; };
export const cutL = (i, lead = .12) => before(PULSE, L0(i) - lead);      // the felt beat just before line i
export const beatAt = t => near(BEATS, t);
export const step = t => Math.floor(t * 12) / 12;                         // characters act on twos
export const kf = (t, keys) => {                                          // smooth keyframes; values are numbers or arrays
  if (t <= keys[0][0]) return keys[0][1]; const n = keys.length; if (t >= keys[n - 1][0]) return keys[n - 1][1];
  let i = 0; while (t > keys[i + 1][0]) i++;
  const u = ss(seg(t, keys[i][0], keys[i + 1][0])), a = keys[i][1], b = keys[i + 1][1];
  return Array.isArray(a) ? a.map((v, j) => lerp(v, b[j], u)) : lerp(a, b, u);
};
export const pulse = (t, t0, d = .25) => t < t0 ? 0 : Math.exp(-(t - t0) / d);      // a decaying accent
export const pop = (t, t0, d = .3) => back(seg(t, t0, t0 + d), 2.2);                // overshoot in
export const cam = (z, px, py, dx = 0, dy = 0) => g.setTransform(z, 0, 0, z, px * (1 - z) + dx, py * (1 - z) + dy);
export const reset = () => g.setTransform(1, 0, 0, 1, 0, 0);
export const sweepX = (t, a, d = .6) => lerp(-80, W + 240, eio(seg(t, a, a + d)));
export const OPEN = 1e5;
export const clip = (x, y, w, h, fn) => { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); try { fn(); } finally { g.restore(); } };

// in-picture type: drawn on a plate and reported to readcheck with its on-screen box
export function say(id, s, x, y, font, c, align = 'center', track = 0, lead = 0) {
  g.font = font; if (track) g.letterSpacing = track + 'px';
  const m = g.measureText(s), w = m.width, a = m.actualBoundingBoxAscent, d = m.actualBoundingBoxDescent; g.letterSpacing = '0px';
  text(s, x, y, font, c, align, 'alphabetic', track);
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, M = g.getTransform();
  const p0 = M.transformPoint({ x: x0, y: y - a }), p1 = M.transformPoint({ x: x0 + w, y: y + d });
  if (id) TEXTS.push({ id, text: s, x0: Math.min(p0.x, p1.x), y0: Math.min(p0.y, p1.y), x1: Math.max(p0.x, p1.x), y1: Math.max(p0.y, p1.y) });
}
// double hit: the same word on both plates, a few px apart
export function say2(id, s, x, y, font, dx = 8, dy = 6, align = 'center', track = 0) {
  say(id, s, x, y, font, R, align, track); over(() => text(s, x + dx, y + dy, font, T, align, 'alphabetic', track));
}
export const FZ = (px, w = 900) => `${w} ${px}px NotoSC, Jost`, FL = (px, w = 600) => `${w} ${px}px Jost, NotoSC`;

// ───────── the café: one table, printed once per plate ─────────
// He sits left against a wall of her ink, she sits right against a wall of his: each is the other's background,
// so in a one-plate proof the other person is a hole of bare paper.
export const CF = { floor: 786, seat: 664, heX: 640, sheX: 1280, top: 592, cx: 960 };
export function cafeRoom(o = {}) {
  rect(-900, -400, 1860, CF.floor + 400, tint(R, o.wall ?? .24)); rect(960, -400, 1860, CF.floor + 400, tint(T, o.wall ?? .24));
  rect(-900, CF.floor, 3720, 700, P);
  ellipse(960, CF.floor + 78, 640, 58, 0, K);                         // the rug: the one patch of both inks
  rect(-900, CF.floor - 4, 3720, 8, K);
  lamp(960, -400, o.lampY ?? 250, 96);                                           // the light belongs to the third plate
  if (o.back) o.back();
}
export function cafe(o = {}) {
  cafeRoom(o);
  const he = { lean: -.16, handF: [118, -62], handB: [-60, -30], bendB: -1, ...o.he }, she = { dir: -1, lean: .03, handF: [112, -64], handB: [60, -20], ...o.she };
  layer(() => { chair(CF.heX - 12, CF.seat, 1, T); chair(CF.sheX + 12, CF.seat, -1, R); table(CF.cx, CF.top, 300); });
  if (o.mid) o.mid();
  if (!o.noHe) layer(() => figure(CF.heX, CF.seat, 1.15, o.heL || LOOK.fa1, he));
  if (!o.noShe) layer(() => figure(CF.sheX, CF.seat, 1.15, o.sheL || LOOK.hua1, she));
  if (!o.noCups) layer(() => { cup(CF.cx - 78, CF.top, 1, Y, T); cup(CF.cx + 78, CF.top, 1, Y, R); if (o.keyOn) key(CF.cx - 20, CF.top - 6, .5, .1, P); }, 3);
  if (o.front) o.front();
}

// ───────── her room, his road ─────────
export function room(o = {}) {   // night desk: red and the light only
  rect(-600, -300, 3200, 1200, tint(R, .24));
  rect(-600, 800, 3200, 500, R);
  rrect(1180, 150, 520, 420, 14, P);                                   // window
  circle(1560, 270, 54, Y);
  for (let i = 0; i < 6; i++) { const h = 90 + hash(i * 3.1) * 150; rect(1188 + i * 84, 562 - h, 76, h, tint(R, .5)); }
  rect(1432, 150, 14, 420, R); rect(1180, 350, 520, 12, R);
  rect(560, 640, 760, 26, R); rect(600, 666, 22, 140, R); rect(1260, 666, 22, 140, R);   // desk
  if (o.back) o.back();
}
export function road(cx, o = {}) {   // the open road: teal and the light only
  rect(-200, -200, 4000, 900, P);
  circle(1420 - cx * .01, 330, 150, Y);
  const ridge = (par, base, amp, seed, c) => {
    g.beginPath(); g.moveTo(-200, 1200);
    for (let x = -200; x <= 3800; x += 40) { const wx = (x + cx * par) / 300; g.lineTo(x, base - amp * (.5 + .5 * Math.sin(wx + seed) * Math.cos(wx * .37 + seed * 2)) - amp * .3 * Math.sin(wx * 2.3 + seed)); }
    g.lineTo(3800, 1200); g.closePath(); g.fillStyle = `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`; g.fill();
  };
  ridge(.06, 620, 190, 1, tint(T, .2)); ridge(.14, 690, 150, 4, tint(T, .4)); ridge(.3, 760, 90, 7, tint(T, .62));
  rect(-200, 800, 4000, 500, T);
  for (let i = -1; i < 19; i++) { const x = ((i * 220 - cx) % 4180 + 4180) % 4180 - 200; rect(x, 884, 110, 12, P); }            // lane dashes
  for (let i = 0; i < 9; i++) { const x = ((i * 460 - cx * .8) % 4140 + 4140) % 4140 - 300; rect(x, 640, 10, 164, T); rect(x - 22, 640, 54, 10, T); }   // poles
  if (o.back) o.back();
}

export const S = {};   // the shots, by name
