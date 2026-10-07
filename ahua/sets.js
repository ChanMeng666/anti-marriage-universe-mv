// Sets and the night light pass. Paper first (front-lit), then frame × light map, then emissive backlit pieces + bloom.
import { W, H, COL, TAU, canvas, memo, piece, poly, rectP, put, at, mul, T, R, S, cam, ground, hash, clamp, lerp, transmitOf, holesOf, sawEdge } from './engine.js';
import { beginLight, pool, lightImage, applyLight, bloom, rays, E } from './lib/light.js';
import { ridge, lattice, lamp, orb, drawXi } from './props.js';
export { pool, lightImage, bloom, rays };

const [Tc, Tg] = canvas(W, H);
function emitBegin() { Tg.setTransform(1, 0, 0, 1, 0, 0); Tg.globalCompositeOperation = 'source-over'; Tg.globalAlpha = 1; Tg.filter = 'none'; Tg.fillStyle = '#000'; Tg.fillRect(0, 0, W, H); }
// frame × light map; fn() adds pools / projected patterns to the map first
export function lightPass(g, amb, fn) { beginLight(amb); if (fn) fn(); applyLight(g); emitBegin(); }
// a source of light behind the paper (screen coordinates)
export function emitGlow(x, y, r, I = 1, warm = 1) {
  const gr = Tg.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, `rgba(255,${222 * warm | 0},${150 * warm | 0},${I})`); gr.addColorStop(.45, `rgba(255,${170 * warm | 0},${84 * warm | 0},${I * .7})`); gr.addColorStop(1, 'rgba(230,110,40,0)');
  Tg.save(); Tg.setTransform(1, 0, 0, 1, 0, 0); Tg.globalCompositeOperation = 'lighter'; Tg.fillStyle = gr; Tg.fillRect(x - r, y - r, 2 * r, 2 * r); Tg.restore();
}
// a cut piece in front of that light: paper = light × transmission, holes = the light itself
export function emitPiece(p, M, tcol = '#c9241a') { Tg.save(); Tg.setTransform(...M); Tg.globalCompositeOperation = 'multiply'; Tg.drawImage(transmitOf(p, tcol), p.x0, p.y0, p.w, p.h); Tg.restore(); }
// a piece that is itself light (flames)
export function emitShape(p, M, tcol = '#ff8a2a', a = 1) { Tg.save(); Tg.setTransform(...M); Tg.globalCompositeOperation = 'lighter'; Tg.globalAlpha = a; Tg.drawImage(transmitOf(p, tcol), p.x0, p.y0, p.w, p.h); Tg.restore(); }
export function emitDot(x, y, r, a = 1, col = '255,200,120') { Tg.save(); Tg.setTransform(1, 0, 0, 1, 0, 0); Tg.globalCompositeOperation = 'lighter'; Tg.fillStyle = `rgba(${col},${a})`; Tg.beginPath(); Tg.arc(x, y, r, 0, 7); Tg.fill(); Tg.restore(); }
// anything drawn in front of the light source blocks it: paint it black on the emissive layer
export const emitCtx = () => { Tg.globalCompositeOperation = 'source-over'; Tg.globalAlpha = 1; return Tg; };
export const BLOCK = 'brightness(0)';
export function emitEnd(g, a = 1, bl = .8) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter'; g.globalAlpha = a; g.drawImage(Tc, 0, 0); g.restore();
  E.save(); E.setTransform(1, 0, 0, 1, 0, 0); E.globalCompositeOperation = 'lighter'; E.globalAlpha = a; E.drawImage(Tc, 0, 0); E.restore();
  if (bl) bloom(g, bl * .5);
}
// sparks: embers rising from (x, y) (world), looping; deterministic, on ones
export function sparks(C, x, y, t, n = 40, opt = {}) {
  const life = opt.life || 3, rise = opt.rise || 260, sp = opt.spread || 200;
  for (let k = 0; k < n; k++) {
    const ph = hash(k * 3.1 + (opt.seed || 0)), u = ((t / life + ph) % 1 + 1) % 1, born = t - u * life; if (opt.from != null && born < opt.from) continue; if (opt.until != null && born > opt.until) continue;
    const px = x + (hash(k * 5.7 + 1) - .5) * sp * (.3 + u) + Math.sin(u * 9 + k) * 18, py = y - u * rise * (.6 + hash(k * 2.3 + 2) * .8);
    emitDot(C[0] * px + C[2] * py + C[4], C[1] * px + C[3] * py + C[5], (1.6 + hash(k) * 2.4) * Math.sqrt(Math.abs(C[0])) * (opt.size || 1), (1 - u) * (opt.a || .9), k % 3 ? '255,170,80' : '255,220,150');
  }
}
// stars: tiny holes punched in the night sheet
export function stars(g, C, t, n = 90, y1 = 560, seed = 0) {
  g.save(); g.setTransform(...C);
  for (let k = 0; k < n; k++) { const x = hash(k * 1.7 + seed) * 2800 - 440, y = hash(k * 2.9 + seed + 4) * y1 - 60, r = 1.4 + hash(k * 4.1) * 2.2; g.fillStyle = k % 5 ? COL.n5 : COL.cream; g.globalAlpha = .55 + .45 * hash(k + Math.floor(t * 3 + hash(k) * 9)); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.restore();
}
const floorP = col => memo('floor' + col, () => piece([0, -14, 3400, 220], g => { poly(g, rectP(0, 0, 3400, 220), col, 3); poly(g, sawEdge([[0, 0], [3400, 0]], 9, 22, -1), col, 4); }, { seed: 150, col, ss: 1.2, edge: 1 }));
export const floor = (g, C, y, col, x = -700) => put(g, floorP(col), at(C, x, y), { shadow: .6 });

// the café: rice-paper day, a pale-red window lattice and a pale 囍 on the wall (the matchmaker's taste)
export function cafe(g, C, t) {
  ground(g, 'rice', C, 'rgba(238,224,192,.4)');
  put(g, lattice(COL.pale3), at(C, 330, 420, 1.05), { shadow: .5 });
  drawXi(g, C, 1560, 400, .46, { col: COL.pale2, shadow: .5 });
  put(g, lamp(), at(C, 960, 200, 1.1, Math.sin(t * 1.3) * .03), { shadow: .7 });
  floor(g, C, 896, COL.pale3);
}
// parallax camera for a layer at depth f (0 = infinitely far, 1 = the action plane)
export const layer = (cx, cy, z, f) => cam(960 + (cx - 960) * f, 540 + (cy - 540) * f, 1 + (z - 1) * f);
// night: one blue-black family of papers
export function nightLand(g, cx, cy, z, t, opt = {}) {
  ground(g, 'ink', layer(cx, cy, z, .1));
  stars(g, layer(cx, cy, z, .08), t, 110, 620, opt.seed || 0);
  if (opt.moon !== false) put(g, orb(COL.n4, 78, 10, 2), at(layer(cx, cy, z, .1), opt.moonX ?? 1500, 210, 1), { shadow: .5 });
  put(g, ridge(4200, 300, COL.n1, 3), at(layer(cx, cy, z, .3), -900, 800), { shadow: .6 });
  put(g, ridge(4200, 230, COL.n2, 5, true), at(layer(cx, cy, z, .55), -1100, 870), { shadow: .7 });
}
// day road: rice paper, pale-red far hills
export function dayLand(g, cx, cy, z, t, opt = {}) {
  ground(g, 'rice', layer(cx, cy, z, .1), opt.tint || 'rgba(238,224,192,.4)');
  put(g, ridge(5200, 300, COL.pale3, 3), at(layer(cx, cy, z, .3), -900, 800), { shadow: .5 });
  put(g, ridge(5200, 220, COL.pale2, 5, true), at(layer(cx, cy, z, .55), -1100, 870), { shadow: .6 });
}
