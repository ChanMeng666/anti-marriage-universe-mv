// Every prop is a cut piece (lazy, cached). Units are screen-ish pixels at scale 1 unless noted; origin noted per piece.
import { COL, TAU, DEG, piece, memo, blob, poly, disc, hole, holeC, autoInset, cut, fill, trace, P, Pl, rectP, curve, cutTaper, within, ellipsePoly, cutText, inkText,
  sawRow, sawEdge, crescent, crescentRows, swirl, cloudCut, rosette, plum, coin, dots, taper, mul, T, R, S, put, at, canvas, hash, lerp, clamp } from './engine.js';

// ---------- 囍: one 喜 (origin = its centre), strokes 40 wide; the bars that join the pair reach the seam on +x ----------
const U = 40;
const XI_RECTS = [[4.5, 0, 1, 4], [.5, 1, 9, 1], [2, 3, 6, 1], [2.5, 4, 1, 3.5], [6.5, 4, 1, 3.5], [2.5, 7, 5, 1], [0, 9.5, 10, 1], [2.5, 10.5, 1, 2.5], [6.5, 10.5, 1, 2.5], [2.5, 13, 5, 1]];
const XI_TICKS = [[[2.9, 8], [3.9, 8], [4.7, 9.5], [3.7, 9.5]], [[7.1, 8], [6.1, 8], [5.3, 9.5], [6.3, 9.5]]];
export const XI_GAP = 14;   // half the gap between the two 喜 (world units at scale 1)
export function xi(col = COL.red, join = true) {
  return memo(`xi|${col}|${join}`, () => piece([-208, -288, 220, 288], g => {
    g.save(); g.translate(-5 * U, -7 * U); g.scale(U, U);
    fill(g, q => { for (const r of XI_RECTS) q.rect(...r); for (const tk of XI_TICKS) { q.moveTo(...tk[0]); for (const p of tk) q.lineTo(...p); q.closePath(); } if (join) { q.rect(9.4, 1, .6 + XI_GAP / U + .02, 1); q.rect(9.9, 9.5, .1 + XI_GAP / U + .02, 1); } }, col);
    g.restore();
    autoInset(g, 6, 2.4);
    // folk details: flowers where strokes cross, sawtooth under the long bars, coins in the boxes' feet
    for (const [x, y] of [[0, -220], [-140, -220], [140, -220], [-160, 120], [160, 120], [0, 120]]) rosette(g, x, y, 11, 6, .2, .25);
    sawRow(g, [[-170, 131], [170, 131]], 7, 9, 1, .7); sawRow(g, [[-90, -129], [90, -129]], 7, 9, 1, .7);
    for (const x of [-80, 80]) for (const y of [-60, 220]) plum(g, x, y, 8);
    for (const y of [20, 280 - 20]) for (const x of [-40, 0, 40]) holeC(g, x, y, 4.5);
  }, { seed: 31, col, ss: 2.5 }));
}
// draw the pair; sep = extra distance of each half from the seam; returns nothing
export function drawXi(g, C, x, y, s, opt = {}) {
  const p = xi(opt.col || COL.red, opt.join !== false), d = 200 + XI_GAP;
  if (!opt.rightOnly) put(g, p, mul(opt.ML || at(C, x - d * s, y, s), [1, 0, 0, 1, 0, 0]), { shadow: opt.shadow ?? 1, alpha: opt.alphaL });
  if (!opt.leftOnly) put(g, p, opt.MR || at(C, x + d * s, y, s, 0, -1), { shadow: opt.shadow ?? 1 });
}

// ---------- scissors: pivot at origin, blades along +x (150), handles along -x ----------
const blade = k => memo('blade' + k, () => piece([-120, -46, 160, 46], g => {
  poly(g, [[-10, -8], [150, -1], [152, 2], [-10, 12]], COL.steel, 3);
  blob(g, [[-8, -6], [-40, 4], [-70, 6], [-104, 18], [-112, 34], [-96, 44], [-70, 40], [-50, 24], [-20, 14], [-6, 12]], COL.steel, 4);
  autoInset(g, 2.6, 1.2);
  holeC(g, -88, 30, 12, 8); taper(g, [[10, 4], [70, 3], [130, 2]], 2.2);
}, { seed: 12 + k, col: COL.steel }));
export function drawScissors(g, C, tx, ty, ang, open = 0, s = 1, opt = {}) {
  // (tx, ty) = the cutting point (40 units ahead of the rivet), ang = direction of travel
  const M = mul(mul(mul(C, T(tx, ty)), R(ang)), S(s)), a = (.06 + .34 * open);
  const M0 = mul(M, T(-46, 0));
  put(g, blade(0), mul(mul(M0, R(a)), S(1, 1)), { shadow: opt.shadow ?? 1.6 });
  put(g, blade(1), mul(mul(M0, R(-a)), S(1, -1)), { shadow: opt.shadow ?? 1.6 });
  g.save(); g.setTransform(...M0); g.fillStyle = COL.steel2; g.beginPath(); g.arc(0, 2, 5, 0, 7); g.fill(); g.restore();
}
// blades close on every grid beat, open between (per = beat period)
export const snipOpen = (t, per, g0 = 0) => { const u = ((t - g0) / per % 1 + 1) % 1; return u < .18 ? 1 - u / .18 : Math.min(1, (u - .18) / .5); };

// ---------- café ----------
export const table = () => memo('table', () => piece([-190, -30, 190, 300], g => {
  poly(g, [[-180, -14], [180, -14], [184, 6], [-184, 6]], COL.wood, 2); poly(g, sawEdge([[-176, 6], [176, 6]], 16, 22, -1).concat([[176, 6]]), COL.cream, 3);
  poly(g, [[-16, 6], [16, 6], [14, 240], [70, 270], [72, 286], [-72, 286], [-70, 270], [-14, 240]], COL.wood, 4);
  autoInset(g, 3, 1.4); swirl(g, 0, 120, 9, 1.6, 2.6, 0, 1); for (const x of [-120, -60, 0, 60, 120]) holeC(g, x, 14, 2.2);
}, { seed: 14 }));
// the table on its edge, seen face-on: something broad enough to hide behind
export const tableTop = () => memo('tableTop', () => piece([-190, -190, 190, 190], g => {
  disc(g, 0, 0, 178, COL.wood, 178, 3);
  const sc = []; for (let i = 0; i < 32; i++) { const a = i / 32 * TAU, r = i % 2 ? 150 : 134; sc.push([Math.cos(a) * r, Math.sin(a) * r]); } blob(g, sc, COL.cream, 4, .2);
  autoInset(g, 3.2, 1.4); rosette(g, 0, 0, 58, 8, .2, .2);
  for (let k = 0; k < 8; k++) { const a = k * TAU / 8 + .39; plum(g, Math.cos(a) * 100, Math.sin(a) * 100, 11, a); }
  for (let k = 0; k < 16; k++) { const a = k * TAU / 16; holeC(g, Math.cos(a) * 164, Math.sin(a) * 164, 3); }
}, { seed: 160 }));
export const chair = () => memo('chair', () => piece([-70, -230, 80, 110], g => {
  poly(g, [[-58, -220], [-44, -222], [-40, -8], [60, -8], [62, 6], [54, 6], [56, 100], [44, 100], [42, 6], [-40, 6], [-42, 100], [-54, 100]], COL.wood, 5);
  autoInset(g, 2.6, 1.2); for (const y of [-180, -130, -80]) holeC(g, -49, y, 3);
}, { seed: 15 }));
export const cup = () => memo('cup', () => piece([-40, -70, 44, 14], g => {
  poly(g, [[-22, -30], [22, -30], [18, 0], [-18, 0]], COL.cream, 2); blob(g, [[20, -24], [36, -22], [36, -8], [20, -6]], COL.cream, 3); poly(g, [[-34, 0], [34, 0], [28, 8], [-28, 8]], COL.cream, 4);
  autoInset(g, 2.4, 1.1); holeC(g, 29, -15, 4, 5); crescent(g, 0, -8, 12, .2, 2.9, 3);
}, { seed: 16 }));
export const carKey = () => memo('key', () => piece([-50, -22, 60, 22], g => {
  blob(g, [[-44, -14], [-18, -18], [-6, -8], [-6, 8], [-18, 18], [-44, 14]], COL.tealFar, 2);
  poly(g, [[-8, -5], [50, -5], [54, 0], [50, 5], [40, 5], [36, 11], [30, 5], [22, 5], [18, 10], [12, 5], [-8, 5]], COL.steel, 3);
  autoInset(g, 2, 1); holeC(g, -32, 0, 5); holeC(g, -17, 0, 3.4, 5);
}, { seed: 17 }));
export const lattice = (col = COL.pale2) => memo('lattice' + col, () => piece([-200, -260, 200, 260], g => {
  poly(g, rectP(-190, -250, 380, 500), col, 2);
  cut(g, q => { for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) q.rect(-172 + i * 120, -232 + j * 118, 104, 102); });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { const x = -120 + i * 120, y = -181 + j * 118; fill(g, q => { q.rect(x - 52, y - 3, 104, 6); q.rect(x - 3, y - 51, 6, 102); }, col); if ((i + j) % 2 === 0) { fill(g, q => q.arc(x, y, 26, 0, 7), col); rosette(g, x, y, 22, 6, 0, .22); } }
}, { seed: 18, col }));
export const lamp = () => memo('lamp', () => piece([-70, -200, 70, 80], g => {
  poly(g, [[-3, -200], [3, -200], [3, -20], [-3, -20]], COL.wood, 1); blob(g, [[-16, -22], [16, -22], [60, 40], [64, 60], [-64, 60], [-60, 40]], COL.pale, 2);
  autoInset(g, 3, 1.4); sawRow(g, [[-56, 54], [56, 54]], 10, 8, -1, .7); for (const x of [-22, 0, 22]) plum(g, x, 24, 7);
}, { seed: 19 }));
// "seeing through" the patriarch: a mask on a stick, all holes
export const mask = () => memo('mask', () => piece([-110, -170, 110, 260], g => {
  poly(g, [[-5, 60], [5, 60], [6, 250], [-6, 250]], COL.wood, 1);
  blob(g, [[-70, -70], [-60, -120], [0, -140], [60, -120], [70, -70], [66, 0], [40, 60], [0, 78], [-40, 60], [-66, 0]], COL.deep, 2);
  poly(g, [[-96, -112], [96, -112], [86, -134], [40, -140], [30, -164], [-30, -164], [-40, -140], [-86, -134]], COL.deep, 3);     // official's hat
  poly(g, sawEdge([[-40, 56], [0, 74], [40, 56]], 44, 13, 1), COL.deep, 4);                                                // beard
  autoInset(g, 3.4, 1.5);
  for (const sx of [-1, 1]) { hole(g, [[sx * 14, -52], [sx * 34, -66], [sx * 54, -52], [sx * 34, -38]], 3); taper(g, [[sx * 10, -78], [sx * 34, -90], [sx * 58, -80]], 5); crescent(g, sx * 40, -8, 16, sx > 0 ? .3 : 1.6, sx > 0 ? 1.5 : 2.8, 5); }
  hole(g, [[-22, 22], [0, 12], [22, 22], [0, 46]], 5); taper(g, [[0, -40], [-6, -8], [4, 2]], 4);
  sawRow(g, [[-84, -118], [84, -118]], 9, 9, -1, .7); coin(g, 0, -150, 7);
}, { seed: 20 }));
// his talk: a teal speech scrap with 爹 cut out of it; origin = tail tip (left-bottom)
export const blabScrap = (ch = '爹') => memo('blab' + ch, () => piece([-190, -150, 10, 12], g => {   // origin = tail tip (right-bottom, towards his mouth)
  blob(g, [[0, 4], [22, -28], [14, -70], [40, -120], [100, -142], [160, -122], [180, -74], [160, -30], [100, -12], [50, -18]].map(([x, y]) => [-x, y]), COL.teal, 2);
  autoInset(g, 3, 1.4); cutText(g, ch, -100, -76, 78);
}, { seed: 21, col: COL.teal }));
export const abacus = () => memo('abacus', () => piece([-150, -90, 150, 90], g => {
  poly(g, rectP(-140, -80, 280, 160), COL.tealFar, 2);
  cut(g, q => { q.rect(-126, -66, 252, 38); q.rect(-126, -18, 252, 84); });
  fill(g, q => { for (let i = 0; i < 7; i++) q.rect(-110 + i * 36 - 2, -68, 4, 136); }, COL.tealFar);
  fill(g, q => { for (let i = 0; i < 7; i++) { q.ellipse(-108 + i * 36, -56 + (i % 2) * 10, 13, 8, 0, 0, 7); for (let k = 0; k < 3; k++) q.ellipse(-108 + i * 36, 8 + k * 19 + ((i * 3 + k) % 4 === 0 ? 8 : 0), 13, 8, 0, 0, 7); } }, COL.teal);
}, { seed: 22, col: COL.teal }));
export const bead = () => memo('bead', () => piece([-16, -11, 16, 11], g => { disc(g, 0, 0, 13, COL.teal, 8); holeC(g, 0, 0, 3, 2); }, { seed: 23 }));
export const apron = () => memo('apron', () => piece([-90, -150, 90, 150], g => {
  poly(g, [[-30, -140], [30, -140], [36, -60], [80, -40], [84, 130], [-84, 130], [-80, -40], [-36, -60]], COL.deep, 2);
  poly(g, sawEdge([[-84, 126], [84, 126]], 14, 20, -1), COL.deep, 3);
  blob(g, [[-30, -140], [-44, -150], [-40, -128]], COL.deep, 4); blob(g, [[30, -140], [44, -150], [40, -128]], COL.deep, 5);
  autoInset(g, 3.2, 1.5);
  cut(g, q => trace(q, Pl(rectP(-36, 10, 72, 5), true, .2, 1)));
  rosette(g, 0, -80, 20, 8, 0, .2); crescentRows(g, -60, 70, 60, 112, 9, 3.2, 0, .78); for (const x of [-52, 52]) plum(g, x, -10, 8);
  // ladle + broom: the job description
  taper(g, [[-40, 40], [-26, 56], [-10, 40]], 5); taper(g, [[-10, 40], [20, 22], [44, 26]], 3.4);
}, { seed: 24 }));
export const priceTag = (txt = '¥') => memo('tag' + txt, () => piece([-52, -34, 52, 34], g => {
  poly(g, [[-46, -12], [-30, -28], [46, -28], [46, 28], [-30, 28], [-46, 12]], COL.cream, 2); autoInset(g, 2.4, 1.1); holeC(g, -32, 0, 5);
  inkText(g, txt, 10, 1, txt.length > 1 ? 30 : 44, COL.deep);
}, { seed: 25 }));
// the tower called tradition: tier k (0 = base) and the cap; origin = bottom centre of each tier
export const tier = k => memo('tier' + k, () => { const w = 300 - k * 34, h = 118; return piece([-w / 2 - 60, -h - 30, w / 2 + 60, 6], g => {
  poly(g, rectP(-w / 2, -h + 30, w, h - 30), COL.deep, k + 2);
  poly(g, [[-w / 2 - 54, -h + 34], [-w / 2 - 20, -h + 10], [0, -h + 2], [w / 2 + 20, -h + 10], [w / 2 + 54, -h + 34], [w / 2 + 40, -h + 44], [-w / 2 - 40, -h + 44]], COL.deep, k + 9);
  blob(g, [[-w / 2 - 54, -h + 34], [-w / 2 - 66, -h + 14], [-w / 2 - 44, -h + 24]], COL.deep, 3); blob(g, [[w / 2 + 54, -h + 34], [w / 2 + 66, -h + 14], [w / 2 + 44, -h + 24]], COL.deep, 4);
  autoInset(g, 3.2, 1.5);
  sawRow(g, [[-w / 2 - 34, -h + 40], [w / 2 + 34, -h + 40]], 10, 9, 1, .7);
  if (k === 0) { cut(g, q => trace(q, Pl(rectP(-84, -62, 168, 52), true, .2, 2))); fill(g, q => trace(q, Pl(rectP(-76, -56, 152, 40), true, .2, 3)), COL.deep); cutText(g, '传统', 0, -36, 36); }
  else { hole(g, [[-16, 0], [-16, -34], [0, -48], [16, -34], [16, 0]], 5, false); for (const sx of [-1, 1]) coin(g, sx * (w / 2 - 40), -34, 9); }
}, { seed: 30 + k }); });
export const towerCap = () => memo('towerCap', () => piece([-60, -120, 60, 6], g => { poly(g, [[-50, 0], [-10, -40], [-4, -110], [4, -110], [10, -40], [50, 0]], COL.deep, 2); disc(g, 0, -62, 12, COL.deep); disc(g, 0, -86, 9, COL.deep); autoInset(g, 2.6, 1.2); }, { seed: 39 }));
// the good-wife script: a booklet; side = -1 / +1 gives the two halves after the cut (0 = whole)
export const script = side => memo('script' + side, () => piece([-120, -150, 120, 150], g => {
  poly(g, rectP(-104, -136, 208, 272), COL.deep, 2);
  const zig = () => { if (side) cut(g, q => { const z = []; for (let i = 0; i <= 12; i++) z.push([(i % 2 ? 12 : -12), -160 + i * 27]); q.moveTo(side < 0 ? 200 : -200, -160); for (const p of z) q.lineTo(...p); q.lineTo(side < 0 ? 200 : -200, 170); q.closePath(); }); };
  zig();
  autoInset(g, 3.4, 1.5);
  cut(g, q => trace(q, Pl(rectP(-70, -112, 140, 96), true, .2, 2))); fill(g, q => trace(q, Pl(rectP(-62, -104, 124, 80), true, .2, 3)), COL.deep);
  cutText(g, '贤妻', 0, -84, 34); cutText(g, '良母', 0, -46, 34);
  for (const y of [14, 40, 66, 92]) cut(g, q => trace(q, Pl(rectP(-70, y, 140 - (y % 3) * 14, 6), true, .2, y)));
  for (const y of [-110, -60, -10, 40, 90]) holeC(g, -92, y, 3.4);
  zig();   // the label was pasted back over the cut: cut again
}, { seed: 40 }));
export const paperMan = k => memo('pman' + k, () => piece([-50, -150, 50, 160], g => {
  const c = k ? COL.tealPale : COL.teal;
  poly(g, [[-4, 20], [4, 20], [5, 156], [-5, 156]], COL.wood, 1);
  disc(g, 0, -108, 26, c, 28); blob(g, [[-34, -74], [34, -74], [44, 10], [30, 40], [-30, 40], [-44, 10]], c, 3); blob(g, [[-10, -128], [10, -140], [30, -128], [26, -116]], c, 5);
  autoInset(g, 2.8, 1.3);
  cut(g, q => { q.moveTo(0, -16); q.bezierCurveTo(-30, -44, -30, -4, 0, 16); q.bezierCurveTo(30, -4, 30, -44, 0, -16); });   // a heart
  crescent(g, -8, -106, 9, Math.PI * 1.1, Math.PI * 1.9, 3.4); crescent(g, 12, -106, 9, Math.PI * 1.1, Math.PI * 1.9, 3.4); crescent(g, 2, -98, 12, .4, 2.7, 3);
}, { seed: 41 + k }));

// ---------- fire ----------
export const basin = () => memo('basin', () => piece([-170, -70, 170, 120], g => {
  poly(g, [[-150, -50], [150, -50], [120, 40], [-120, 40]], COL.n3, 2); poly(g, [[-160, -62], [160, -62], [160, -44], [-160, -44]], COL.n3, 3);
  for (const sx of [-1, 1]) poly(g, [[sx * 70, 40], [sx * 96, 40], [sx * 112, 110], [sx * 96, 110]], COL.n3, 4);
  autoInset(g, 3, 1.4); crescentRows(g, -110, -30, 110, 26, 14, 4.5, Math.PI, .8); sawRow(g, [[-150, -46], [150, -46]], 8, 10, 1, .7);
}, { seed: 50, col: COL.n3 }));
export const flameP = k => memo('flame' + k, () => piece([-70, -230, 70, 12], g => {
  const sh = [[[-44, 0], [-56, -50], [-30, -110], [-38, -150], [-6, -220], [8, -160], [34, -128], [22, -90], [54, -50], [44, 0]],
    [[-40, 0], [-50, -60], [-20, -90], [-26, -150], [10, -210], [20, -150], [44, -110], [30, -70], [50, -30], [40, 0]],
    [[-46, 0], [-40, -70], [-52, -110], [-14, -150], [-10, -214], [22, -164], [16, -116], [46, -84], [38, -40], [46, 0]]][k];
  blob(g, sh, COL.red, k + 2); autoInset(g, 3, 1.4);
  hole(g, sh.map(([x, y]) => [x * .42, y * .55 - 4]), k + 3); swirl(g, 0, -150 + k * 6, 9, 1.4, 3, 0, k % 2 ? 1 : -1);
}, { seed: 51 + k, col: COL.red }));
// paper flames on ones; n tongues; returns nothing. sc = overall size, lit = 0..1 growth
export function drawFlames(g, C, x, y, t, sc = 1, n = 5, opt = {}) {
  for (let k = 0; k < n; k++) {
    const u = (k + .5) / n - .5, f = Math.floor(t * 24), w = hash(f * .37 + k * 7.1), h = .7 + .5 * hash(Math.floor(t * 12) * .91 + k * 3.3) - Math.abs(u) * .7;
    const M = mul(mul(mul(C, T(x + u * 190 * sc, y)), R((w - .5) * .22 + u * .3)), S(sc * (.8 + .25 * w) * (k % 2 ? -1 : 1), sc * h));
    const fp = flameP((k + Math.floor(t * 8)) % 3); if (opt.each) opt.each(fp, M); else put(g, fp, M, { shadow: opt.shadow ?? .6 });
  }
}
// ---------- the bride's kit ----------
export const corset = () => memo('corset', () => piece([-120, -150, 120, 150], g => {
  blob(g, [[-96, -130], [-50, -112], [0, -124], [50, -112], [96, -130], [84, -40], [70, 0], [84, 60], [100, 132], [0, 142], [-100, 132], [-84, 60], [-70, 0], [-84, -40]], COL.deep, 2);
  autoInset(g, 3.4, 1.5);
  for (let i = 0; i < 6; i++) { const y = -96 + i * 38; taper(g, [[-22, y], [0, y + 14], [22, y + 28]], 4.4); taper(g, [[22, y], [0, y + 14], [-22, y + 28]], 4.4); holeC(g, -28, y, 4); holeC(g, 28, y, 4); }
  for (const sx of [-1, 1]) { for (const x of [48, 70]) taper(g, [[sx * x, -100], [sx * (x - 10), 0], [sx * (x + 4), 112]], 3.4);
    for (const [x, y] of [[58, -60], [56, 50], [62, 96]]) cut(g, q => { q.moveTo(sx * x, y - 12); q.quadraticCurveTo(sx * x + 8, y + 2, sx * x, y + 7); q.quadraticCurveTo(sx * x - 8, y + 2, sx * x, y - 12); }); }   // drops
}, { seed: 60 }));
export const bouquet = () => memo('bouquet', () => piece([-110, -130, 110, 170], g => {
  poly(g, [[-40, -10], [40, -10], [10, 150], [-10, 150]], COL.deep, 2);
  for (const [x, y, r] of [[-46, -50, 44], [46, -50, 44], [0, -84, 46], [0, -30, 40]]) disc(g, x, y, r, COL.deep, r, x + 5);
  blob(g, [[-10, 60], [-70, 80], [-60, 110], [-8, 84]], COL.deep, 6); blob(g, [[10, 60], [70, 80], [60, 110], [8, 84]], COL.deep, 7);
  autoInset(g, 3.2, 1.5);
  for (const [x, y, r] of [[-46, -50, 36], [46, -50, 36], [0, -84, 38]]) rosette(g, x, y, r, 8, x * .01, .2);
  swirl(g, 0, -28, 20, 2, 3.4, 0, 1);
  for (let i = 0; i < 4; i++) { const y = 14 + i * 30; taper(g, [[-30 + i * 6, y], [0, y + 12], [30 - i * 6, y + 22]], 4); taper(g, [[30 - i * 6, y], [0, y + 12], [-30 + i * 6, y + 22]], 4); }   // the corset's lacing still shows
}, { seed: 61 }));
export const calBlock = () => memo('cal', () => piece([-130, -170, 130, 170], g => {
  poly(g, rectP(-116, -150, 232, 306), COL.cream2, 2); poly(g, rectP(-120, -160, 240, 50), COL.deep, 3);
  autoInset(g, 3, 1.4); for (const x of [-70, 70]) holeC(g, x, -136, 8); sawRow(g, [[-110, -114], [110, -114]], 7, 9, 1, .7);
}, { seed: 62 }));
// a calendar leaf: day = text, withBride = the little bride of yesterday
export const calLeaf = (day, bride, col = COL.cream) => memo('leaf' + day + bride + col, () => piece([-112, -112, 112, 150], g => {
  poly(g, rectP(-104, -104, 208, 248), col, 2); autoInset(g, 3, 1.3);
  inkText(g, day, 0, -64, 52, COL.deep);
  if (bride) { // veil, phoenix crown, tiny dress: yin cut
    hole(g, [[0, -24], [34, 6], [40, 60], [56, 128], [-56, 128], [-40, 60], [-34, 6]], 3);
    fill(g, q => q.arc(0, 26, 17, 0, 7), col); fill(g, q => trace(q, Pl([[-22, 50], [22, 50], [36, 118], [-36, 118]], true, .2, 2)), col);
    crescent(g, -6, 26, 6, Math.PI * 1.1, Math.PI * 1.9, 2.2); crescent(g, 8, 26, 6, Math.PI * 1.1, Math.PI * 1.9, 2.2); rosette(g, 0, 84, 11, 6, 0, .25);
  } else { rosette(g, 0, 50, 46, 8, .2, .2); }
}, { seed: 63 + day.charCodeAt(0) % 7 }));
export const castle = (col = COL.n3) => memo('castle' + col, () => piece([-210, -420, 210, 10], g => {
  poly(g, rectP(-150, -220, 300, 220), col, 2);
  for (const [x, w, h] of [[-150, 70, 330], [80, 70, 330], [-35, 70, 400]]) { poly(g, rectP(x, -h, w, h), col, x + 200); poly(g, [[x - 12, -h], [x + w / 2, -h - 80 + (w === 70 && x === -35 ? -6 : 14)], [x + w + 12, -h]], col, 7); }
  poly(g, sawEdge([[-150, -220], [150, -220]], 22, 34, -1, 0), col, 9);
  autoInset(g, 3, 1.4);
  for (const [x, y] of [[-115, -260], [115, -260], [0, -320]]) hole(g, [[x - 10, y + 26], [x - 10, y], [x, y - 12], [x + 10, y], [x + 10, y + 26]], 4, false);
  crescentRows(g, -140, -200, 140, -120, 16, 4.5, 0, .7);
}, { seed: 64, col }));
export const castleDoor = (col = COL.n4) => memo('cdoor' + col, () => piece([-50, -112, 50, 4], g => { poly(g, [[-42, 0], [-42, -70], [0, -106], [42, -70], [42, 0]], col, 3); autoInset(g, 2.6, 1.2); taper(g, [[0, -96], [0, -50], [0, -6]], 3); for (const sx of [-1, 1]) holeC(g, sx * 12, -44, 4); }, { seed: 65, col }));
export const flag = () => memo('flag', () => piece([-4, -70, 70, 4], g => { poly(g, [[-3, 0], [3, 0], [3, -66], [-3, -66]], COL.tealPale, 1); poly(g, [[3, -64], [62, -52], [3, -36]], COL.teal, 2); }, { seed: 66, col: COL.teal }));

// ---------- the white horse (cream paper). origin = belly centre ----------
const horseBody = () => memo('hbody', () => piece([-190, -110, 190, 100], g => {
  blob(g, [[-150, -40], [-120, -78], [-40, -80], [40, -74], [110, -84], [150, -56], [156, -6], [130, 40], [60, 52], [-40, 52], [-120, 46], [-156, 10]], COL.cream, 2);
  autoInset(g, 3.4, 1.5); swirl(g, -112, -14, 26, 2, 4, 0, 1); swirl(g, 112, -20, 24, 2, 4, 3, -1); crescentRows(g, -60, -60, 60, -6, 13, 4, 0, .75);
  taper(g, [[-70, 30], [0, 38], [70, 30]], 3.4);
}, { seed: 70, col: COL.cream }));
const horseHead = () => memo('hhead', () => piece([-60, -230, 150, 60], g => {
  blob(g, [[-40, 30], [-30, -60], [0, -140], [20, -196], [34, -220], [42, -196], [60, -186], [112, -130], [130, -108], [124, -92], [100, -90], [60, -110], [50, -70], [40, 0], [20, 40]], COL.cream, 3);
  autoInset(g, 3.2, 1.4);
  sawRow(g, [[-34, 20], [-22, -70], [6, -150], [24, -200]], 22, 12, -1, .75);            // mane
  hole(g, [[58, -160], [72, -168], [84, -158], [70, -150]], 4); taper(g, [[104, -104], [116, -108], [124, -104]], 3); taper(g, [[66, -126], [86, -118], [100, -100]], 2.6);
}, { seed: 71, col: COL.cream }));
const horseLeg = k => memo('hleg' + k, () => piece([-26, -12, 34, 120], g => {
  if (k === 0) blob(g, [[-20, -8], [20, -8], [16, 60], [10, 104], [-10, 104], [-16, 60]], COL.cream, 4);
  else { blob(g, [[-11, -6], [11, -6], [9, 70], [-9, 70]], COL.cream, 5); poly(g, [[-10, 66], [10, 66], [22, 96], [22, 106], [-12, 106]], COL.cream2, 6); }
  autoInset(g, 2.6, 1.2); if (k === 0) swirl(g, 0, 20, 10, 1.6, 2.8, 0, 1);
}, { seed: 72 + k, col: COL.cream }));
const horseTail = () => memo('htail', () => piece([-150, -40, 20, 130], g => {
  blob(g, [[0, -10], [-50, -34], [-110, -10], [-140, 50], [-130, 120], [-100, 70], [-70, 40], [-30, 30], [4, 16]], COL.cream, 7); autoInset(g, 2.8, 1.3);
  for (let k = 0; k < 4; k++) taper(g, [[-20 - k * 8, -6 + k * 5], [-70 - k * 10, 0 + k * 10], [-112 - k * 4, 50 + k * 14]], 3.2);
}, { seed: 74, col: COL.cream }));
// gait: ph in cycles; kind 'gallop' | 'walk' | 'rear'. returns the saddle matrix for the rider
export function drawHorse(g, C, x, y, s, dir, ph, kind = 'gallop', opt = {}) {
  const rear = kind === 'rear' ? (opt.rear ?? 1) : 0, gal = kind === 'gallop';
  const bobY = gal ? -Math.abs(Math.sin(ph * TAU)) * 26 : kind === 'walk' ? Math.sin(ph * 2 * TAU) * 3 : 0, pitch = gal ? Math.sin(ph * TAU + .6) * .1 : -rear * .62;
  const M = mul(mul(mul(mul(C, T(x, y + bobY - 196 * s)), S(s * dir, s)), T(-110, 30)), mul(R(pitch), T(110, -30)));
  const sh = opt.shadow ?? 1, A = gal ? 52 : kind === 'walk' ? 22 : 0;
  const leg = (hx, hy, ph0, front, far) => {
    const a = (rear && front ? -70 - 20 * Math.sin(ph * TAU * 2 + ph0) : Math.sin((ph + ph0) * TAU) * A + (gal ? (front ? -8 : 8) : 0)) * DEG, kn = (rear && front ? 80 : Math.max(0, Math.cos((ph + ph0) * TAU)) * (gal ? 70 : 30) + 4) * DEG * (front ? 1 : -1);
    const U1 = mul(mul(M, T(hx, hy)), R(-a)), L = mul(mul(U1, T(0, 96)), R(kn));
    put(g, horseLeg(0), U1, { shadow: sh, filter: far ? 'brightness(.86)' : undefined }); put(g, horseLeg(1), L, { shadow: sh, filter: far ? 'brightness(.86)' : undefined });
  };
  leg(-104, 20, .5, false, true); leg(108, 20, .12, true, true);
  put(g, horseTail(), mul(mul(M, T(-148, -30)), R(gal ? -.5 + Math.sin(ph * TAU) * .2 : .1 + Math.sin(ph * TAU) * .05)), { shadow: sh });
  put(g, horseBody(), M, { shadow: sh });
  put(g, horseHead(), mul(mul(M, T(118, -40)), R(gal ? .32 + Math.sin(ph * TAU + 1) * .12 : rear ? .1 : .05)), { shadow: sh });
  leg(-118, 22, .62, false, false); leg(96, 22, 0, true, false);
  return mul(M, T(-10, -72));    // saddle point (rider's pelvis sits here), in horse space incl. flip
}
// ---------- small things ----------
export const bundle = () => memo('bundle', () => piece([-150, -60, 60, 70], g => { poly(g, [[-140, 30], [40, -30], [44, -22], [-136, 38]], COL.wood, 1); blob(g, [[-150, 0], [-120, -40], [-80, -34], [-66, 0], [-80, 44], [-126, 50]], COL.red, 2); autoInset(g, 2.8, 1.3); rosette(g, -108, 6, 22, 6, .2, .22); }, { seed: 80 }));
export const pie = () => memo('pie', () => piece([-110, -110, 110, 260], g => {
  poly(g, [[-5, 80], [5, 80], [6, 250], [-6, 250]], COL.wood, 1);
  const sc = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, r = i % 2 ? 100 : 88; sc.push([Math.cos(a) * r, Math.sin(a) * r]); } blob(g, sc, COL.tealPale, 2, .2);
  autoInset(g, 3, 1.4); cut(g, q => { q.arc(0, 0, 70, 0, 7); q.arc(0, 0, 64, 0, 7, true); });
  fill(g, q => { for (let k = 0; k < 4; k++) { const a = k * TAU / 4 + .4; q.moveTo(Math.cos(a) * 62, Math.sin(a) * 62); q.lineTo(Math.cos(a) * 72, Math.sin(a) * 72); q.lineTo(Math.cos(a + .12) * 72, Math.sin(a + .12) * 72); q.lineTo(Math.cos(a + .12) * 62, Math.sin(a + .12) * 62); } }, COL.tealPale);
  cutText(g, '一生', 0, -22, 40); cutText(g, '一世', 0, 22, 40);
}, { seed: 81, col: COL.tealPale }));
export const hairLock = () => memo('lock', () => piece([-70, -60, 40, 130], g => { blob(g, [[-40, -52], [-10, -56], [-4, -20], [-8, 20], [-14, 62], [-30, 100], [-52, 108], [-60, 70], [-55, 20], [-52, -20]], COL.red, 4); autoInset(g, 3.2, 1.4); for (let k = 0; k < 3; k++) taper(g, [[-28 - k * 6, -40], [-34 - k * 5, 10], [-40 - k * 4, 80]], 2.8); }, { seed: 82 }));
export const flowerPin = () => memo('fpin', () => piece([-24, -24, 24, 24], g => { for (let k = 0; k < 5; k++) disc(g, Math.cos(k * 1.257 - 1.5) * 11, Math.sin(k * 1.257 - 1.5) * 11, 8.5, COL.red, 8.5, k); disc(g, 0, 0, 8, COL.red); plum(g, 0, 0, 9); }, { seed: 83 }));
export const rougeDot = () => memo('rougeBig', () => piece([-12, -12, 12, 12], g => { disc(g, 0, 0, 8.5, COL.pale2); rosette(g, 0, 0, 7, 5, 0, .25); }, { seed: 5 }));
export const house = (col = COL.deep) => memo('house' + col, () => piece([-190, -330, 190, 10], g => {
  poly(g, rectP(-150, -200, 300, 200), col, 2); poly(g, [[-186, -196], [0, -320], [186, -196], [170, -180], [-170, -180]], col, 3); poly(g, rectP(90, -300, 34, 80), col, 4);
  autoInset(g, 3.2, 1.5); crescentRows(g, -150, -290, 150, -206, 15, 4.5, 0, .75);
  cut(g, q => trace(q, Pl(rectP(-110, -150, 80, 80), true, .2, 2))); fill(g, q => { q.rect(-73, -150, 6, 80); q.rect(-110, -113, 80, 6); }, col);
  cut(g, q => trace(q, Pl([[20, 0], [20, -130], [110, -130], [110, 0], [104, 0], [104, -124], [26, -124], [26, 0]], true, .2, 5)));           // door outline
  cutText(g, '囍', 65, -70, 54);
}, { seed: 84, col }));
export const clock = () => memo('clock', () => piece([-34, -34, 34, 34], g => { disc(g, 0, 0, 30, COL.cream); autoInset(g, 2.4, 1.1); for (let k = 0; k < 12; k++) holeC(g, Math.cos(k * TAU / 12) * 21, Math.sin(k * TAU / 12) * 21, 1.8); g.strokeStyle = COL.deep; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-2, -18); g.moveTo(0, 0); g.lineTo(-10, -6); g.stroke(); }, { seed: 85 }));
// a strip of woven fence, origin = left bottom; w wide
export const fence = (w = 240, col = COL.deep) => memo('fence' + w + col, () => piece([-4, -250, w + 4, 6], g => {
  poly(g, rectP(0, -220, w, 220), col, 2); poly(g, sawEdge([[0, -220], [w, -220]], 26, 30, -1), col, 3);
  cut(g, q => { for (let i = -8; i < w / 30 + 8; i++) for (let j = 0; j < 9; j++) { const x = i * 30 + (j % 2) * 15, y = -200 + j * 24; q.moveTo(x, y - 9); q.lineTo(x + 10, y); q.lineTo(x, y + 9); q.lineTo(x - 10, y); q.closePath(); } });
  fill(g, q => { q.rect(0, -226, w, 10); q.rect(0, -12, w, 12); q.rect(0, -220, 9, 220); q.rect(w - 9, -220, 9, 220); }, col);
}, { seed: 86, col }));
// a round moon / sun disc with a rosette cut
export const orb = (col, r = 100, n = 12, seed = 1) => memo(`orb|${col}|${r}|${n}|${seed}`, () => piece([-r - 30, -r - 30, r + 30, r + 30], g => {
  const pts = []; for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * TAU, rr = i % 2 ? r + 22 : r; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); } poly(g, pts, col, seed);
  autoInset(g, 3, 1.4); cut(g, q => { q.arc(0, 0, r * .78, 0, 7); q.arc(0, 0, r * .72, 0, 7, true); });
  fill(g, q => { for (let k = 0; k < n; k++) { const a = k * TAU / n; q.moveTo(Math.cos(a) * r * .7, Math.sin(a) * r * .7); q.lineTo(Math.cos(a) * r * .8, Math.sin(a) * r * .8); q.lineTo(Math.cos(a + .1) * r * .8, Math.sin(a + .1) * r * .8); q.lineTo(Math.cos(a + .1) * r * .7, Math.sin(a + .1) * r * .7); } }, col);
  rosette(g, 0, 0, r * .66, n, 0, .22);
}, { seed: 90 + seed, col }));
// hills: a long ridge strip (origin left-bottom), jagged = sawtooth trees on the ridge
export const ridge = (w, h, col, seed = 1, trees = false) => memo(`ridge|${w}|${h}|${col}|${seed}|${trees}`, () => piece([0, -h - 40, w, 4], g => {
  const pts = [[0, 0]]; for (let i = 0; i <= 24; i++) { const x = w * i / 24; pts.push([x, -h * (.45 + .55 * (.5 + .5 * Math.sin(i * .9 + seed * 2.1)) * (.6 + .4 * Math.sin(i * .37 + seed)))]); } pts.push([w, 0]);
  fill(g, q => trace(q, P(pts.slice(1, -1), false, .4, seed).concat([[w, 0], [0, 0]])), col);
  if (trees) sawRow(g, pts.slice(1, -1).map(([x, y]) => [x, y + 16]), 16, 13, -1, .7);
  for (let k = 0; k < Math.floor(w / 260); k++) cloudCut(g, 130 + k * 260 + (hash(k + seed) - .5) * 80, -h * .28, 22, 3.4, hash(k) * 3, k % 2 ? 1 : -1);
}, { seed: 100 + seed, col, ss: 1.5, edge: 1 }));
export const tree = (col = COL.deep, seed = 1) => memo(`tree|${col}|${seed}`, () => piece([-200, -1000, 200, 20], g => {
  poly(g, [[-46, 0], [-34, -400], [-40, -980], [40, -980], [30, -400], [48, 0]], col, seed);
  blob(g, [[-36, -620], [-150, -700], [-180, -760], [-120, -740], [-36, -680]], col, seed + 1); blob(g, [[34, -520], [140, -610], [176, -690], [110, -660], [34, -590]], col, seed + 2);
  autoInset(g, 3.4, 1.5); for (let k = 0; k < 7; k++) crescent(g, (hash(k + seed) - .5) * 30, -90 - k * 120, 22, .3, 2.8, 6); swirl(g, 0, -460, 16, 1.8, 3.6, 0, 1);
}, { seed: 110 + seed, col, ss: 1.5 }));
// window pane with a wooden frame; the content is drawn by the caller
export const paneFrame = () => memo('pane', () => piece([-190, -190, 190, 190], g => {
  poly(g, rectP(-180, -180, 360, 360), COL.wood, 2); cut(g, q => trace(q, Pl(rectP(-158, -158, 316, 316), true, .3, 3)));
  for (const [x, y] of [[-169, -169], [169, -169], [-169, 169], [169, 169]]) holeC(g, x, y, 4);
}, { seed: 120 }));
export const paneBack = (col = COL.cream) => memo('paneB' + col, () => piece([-164, -164, 164, 164], g => { poly(g, rectP(-160, -160, 320, 320), col, 4); }, { seed: 121, col }));
export const book = () => memo('book', () => piece([-46, -30, 46, 30], g => { poly(g, [[-42, -22], [0, -14], [42, -22], [42, 20], [0, 28], [-42, 20]], COL.cream, 2); autoInset(g, 2.2, 1); taper(g, [[0, -12], [0, 26]], 2.4); for (const y of [-8, 2, 12]) { taper(g, [[-34, y - 4], [-8, y]], 2); taper(g, [[34, y - 4], [8, y]], 2); } }, { seed: 122 }));
export const barbell = () => memo('barbell', () => piece([-150, -50, 150, 50], g => { poly(g, rectP(-140, -4, 280, 8), COL.steel, 1); for (const sx of [-1, 1]) { disc(g, sx * 112, 0, 16, COL.steel2, 44); disc(g, sx * 88, 0, 10, COL.steel2, 32); } autoInset(g, 2.4, 1.1); for (const sx of [-1, 1]) holeC(g, sx * 112, 0, 5, 14); }, { seed: 123 }));
export const boat = () => memo('boat', () => piece([-150, -210, 150, 50], g => { poly(g, [[-130, 0], [130, 0], [96, 40], [-96, 40]], COL.wood, 1); poly(g, [[-4, 0], [4, 0], [4, -200], [-4, -200]], COL.wood, 2); poly(g, [[8, -190], [110, -30], [8, -30]], COL.cream, 3); autoInset(g, 2.6, 1.2); crescentRows(g, 14, -150, 100, -40, 12, 3.6, 0, .7); sawRow(g, [[-110, 8], [110, 8]], 8, 10, 1, .7); }, { seed: 124 }));
export const waves = (w = 400, col = COL.pale2) => memo('waves' + w + col, () => piece([0, -40, w, 30], g => { const pts = [[0, 26]]; for (let i = 0; i <= w / 20; i++) pts.push([i * 20, i % 2 ? -22 : -4]); pts.push([w, 26]); fill(g, q => trace(q, P(pts, true, .3, 2)), col); for (let i = 0; i < w / 80; i++) swirl(g, 40 + i * 80, 4, 9, 1.4, 2.6, 0, 1); }, { seed: 125, col }));
export const laptop = () => memo('laptop', () => piece([-110, -130, 110, 20], g => {
  poly(g, [[-70, -120], [84, -120], [84, -8], [-70, -8]], COL.steel2, 1); poly(g, [[-100, -8], [100, -8], [104, 6], [-104, 6]], COL.steel2, 2);
  autoInset(g, 2.4, 1.1); cut(g, q => trace(q, Pl(rectP(-58, -108, 130, 88), true, .2, 2)));
}, { seed: 126 }));
// the screen of the laptop: a window flower made of code
export const codeFlower = (col = COL.red) => memo('code' + col, () => piece([-66, -46, 66, 46], g => {
  poly(g, rectP(-64, -43, 128, 86), col, 3);
  cutText(g, '{ }', -30, -22, 26, 900); cutText(g, '</>', 28, -22, 22, 900); cutText(g, 'if(){', -22, 4, 18, 900); cutText(g, '花++', 30, 6, 18, 900); cutText(g, '}', -48, 26, 18, 900);
  for (const x of [-20, 0, 20, 40]) holeC(g, x, 28, 2.6);
}, { seed: 127, col }));
export const desk = () => memo('desk', () => piece([-150, -20, 150, 190], g => { poly(g, rectP(-140, -10, 280, 18), COL.wood, 1); for (const sx of [-1, 1]) poly(g, rectP(sx * 118 - 7, 8, 14, 176), COL.wood, 2); autoInset(g, 2.4, 1.1); }, { seed: 128 }));
export const stool = () => memo('stool', () => piece([-50, -10, 50, 110], g => { poly(g, rectP(-44, -6, 88, 14), COL.wood, 1); for (const sx of [-1, 1]) poly(g, [[sx * 30 - 5, 8], [sx * 30 + 5, 8], [sx * 40 + 5, 104], [sx * 40 - 5, 104]], COL.wood, 2); }, { seed: 129 }));
export const peak = (col = COL.pale) => memo('peak' + col, () => piece([-190, -260, 190, 10], g => { poly(g, [[-180, 0], [-90, -110], [-50, -90], [0, -250], [44, -150], [80, -170], [180, 0]], col, 2); autoInset(g, 3, 1.4); sawRow(g, [[-60, -86], [0, -232], [40, -146]], 14, 12, 1, .7); crescentRows(g, -120, -70, 120, -10, 14, 4, 0, .7); }, { seed: 130, col }));
// a small banner flag on a pole for the summit
export const pennant = () => memo('pennant', () => piece([-6, -110, 70, 6], g => { poly(g, rectP(-3, -104, 6, 108), COL.wood, 1); poly(g, [[3, -102], [62, -86], [3, -68]], COL.red, 2); }, { seed: 131 }));
// a big rosette "world": rings of yang and yin cut, 16-fold
export function world(col = COL.red, r = 330) {
  return memo(`world|${col}|${r}`, () => piece([-r - 24, -r - 24, r + 24, r + 24], g => {
    const N = 16, pts = []; for (let i = 0; i < N * 2; i++) { const a = i / (N * 2) * TAU, rr = i % 2 ? r + 16 : r - 4; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); } blob(g, pts, col, 3, .3);
    const ring = (r0, r1) => cut(g, q => { q.arc(0, 0, r1, 0, 7); q.arc(0, 0, r0, 0, 7, true); });
    const spokes = (r0, r1, n, w, off = 0) => fill(g, q => { for (let k = 0; k < n; k++) { const a = k * TAU / n + off; q.moveTo(Math.cos(a - w) * r0, Math.sin(a - w) * r0); q.lineTo(Math.cos(a - w * r0 / r1) * r1, Math.sin(a - w * r0 / r1) * r1); q.lineTo(Math.cos(a + w * r0 / r1) * r1, Math.sin(a + w * r0 / r1) * r1); q.lineTo(Math.cos(a + w) * r0, Math.sin(a + w) * r0); q.closePath(); } }, col);
    ring(r * .78, r * .9); spokes(r * .77, r * .91, N, .05); for (let k = 0; k < N; k++) { const a = (k + .5) * TAU / N; fill(g, q => q.arc(Math.cos(a) * r * .84, Math.sin(a) * r * .84, r * .05, 0, 7), col); plum(g, Math.cos(a) * r * .84, Math.sin(a) * r * .84, r * .034, a); fill(g, q => { q.rect(-1, -1, 0, 0); }, col); }
    // bridges for the little flowers
    fill(g, q => { for (let k = 0; k < N; k++) { const a = (k + .5) * TAU / N; q.moveTo(Math.cos(a - .012) * r * .76, Math.sin(a - .012) * r * .76); q.lineTo(Math.cos(a + .012) * r * .76, Math.sin(a + .012) * r * .76); q.lineTo(Math.cos(a + .012) * r * .92, Math.sin(a + .012) * r * .92); q.lineTo(Math.cos(a - .012) * r * .92, Math.sin(a - .012) * r * .92); q.closePath(); } }, col);
    for (let k = 0; k < N; k++) { const a = k * TAU / N; for (const rr of [.62, .7]) crescent(g, Math.cos(a) * r * rr, Math.sin(a) * r * rr, r * .07, a - 1.1, a + 1.1, r * .028); }
    ring(r * .38, r * .52); spokes(r * .37, r * .53, 8, .16, TAU / 16);
    rosette(g, 0, 0, r * .34, 8, 0, .2);
    for (let k = 0; k < N; k++) { const a = (k + .5) * TAU / N; cut(g, q => { q.moveTo(Math.cos(a) * r * .93, Math.sin(a) * r * .93); q.lineTo(Math.cos(a - .05) * r * .99, Math.sin(a - .05) * r * .99); q.lineTo(Math.cos(a + .05) * r * .99, Math.sin(a + .05) * r * .99); q.closePath(); }); }
  }, { seed: 140, col, ss: 2 }));
}
export const sun = () => memo('sun', () => { const p = orb(COL.gold, 150, 16, 7); return p; });
// stars / sparks are drawn straight on the light layers by the scenes
