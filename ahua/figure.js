// Jointed profile figures (facing right; flip with dir = -1). Units: 1 = 1/430 of body height; origin = between the feet, y down.
// Pieces: head (hair cut + swappable face), torso (dress / jacket / suit), 2 × (upper arm, forearm + hand), 2 × (thigh, shin + shoe).
import { COL, DEG, piece, memo, blob, poly, disc, hole, holeC, autoInset, cut, trace, P, curve, cutTaper, within, ellipsePoly,
  sawRow, crescent, crescentRows, swirl, rosette, plum, coin, taper, strands, mul, T, R, S, put, ap, mix, fill, Pl } from './engine.js';

const HEAD = [[-12, 14], [-13, -8], [-22, -16], [-36, -30], [-42, -52], [-38, -78], [-22, -96], [2, -102], [24, -96], [38, -82], [42, -66], [43, -56], [52, -44], [46, -40], [46, -34], [42, -30], [45, -26], [40, -16], [28, -8], [14, -5], [12, 14]];
const HAIR = {
  long: [[-26, -98], [-46, -74], [-54, -34], [-57, 20], [-62, 70], [-54, 108], [-34, 100], [-22, 62], [-16, 20], [-13, -6], [-8, -40]],
  short: [[-34, -96], [-49, -68], [-50, -40], [-43, -20], [-33, -26], [-26, -12], [-16, -22], [-10, -50]],
  bob: [[-28, -98], [-50, -68], [-54, -30], [-48, 2], [-26, 4], [-15, -8], [-8, -44]],
  bun: [[-30, -92], [-44, -70], [-42, -40], [-30, -22], [-16, -22], [-10, -50]],
  pomp: [[-30, -96], [-44, -70], [-42, -44], [-30, -30], [-16, -30], [-8, -56]],
  braid: [[-26, -98], [-46, -70], [-48, -30], [-40, 10], [-46, 50], [-38, 96], [-28, 120], [-22, 96], [-28, 50], [-20, 10], [-13, -6], [-8, -40]]
};
function face(g, expr, col) {
  const pupil = (x, y, r) => disc(g, x, y, r, col);
  const almond = (lid = 0) => cut(g, q => { q.moveTo(12, -57); if (lid) q.lineTo(37, -58); else q.quadraticCurveTo(24, -70, 37, -58); q.quadraticCurveTo(24, -47, 12, -57); q.closePath(); });
  const mouthOpen = (k = 1) => cut(g, q => { q.moveTo(54, -32 - 5 * k); q.lineTo(31 - 3 * k, -30); q.lineTo(52, -28 + 6 * k); q.closePath(); });
  if (expr === 'cold') { almond(1); pupil(27, -56.6, 3.6); taper(g, [[11, -70], [24, -71.5], [38, -69]], 3.4); taper(g, [[45, -29.5], [39, -29], [33, -28]], 2.6); }
  else if (expr === 'smirk') { almond(1); pupil(28, -56.6, 3.6); taper(g, [[11, -73], [24, -80], [38, -77]], 3.4); taper(g, [[45, -30], [39, -28], [32, -32]], 2.8); }
  else if (expr === 'sing') { almond(); pupil(27, -61, 3.8); taper(g, [[11, -74], [24, -79], [38, -76]], 3.2); mouthOpen(.8); }
  else if (expr === 'firm') { almond(); pupil(28, -60.5, 4); taper(g, [[10, -79], [24, -74], [39, -67]], 4.4); taper(g, [[45, -30], [39, -30], [33, -30]], 2.8); }
  else if (expr === 'serene') { crescent(g, 24, -52, 12, Math.PI * 1.1, Math.PI * 1.9, 4.6); taper(g, [[12, -72], [24, -76], [36, -73]], 3); taper(g, [[45, -30], [39, -27.5], [33, -30.5]], 2.6); }
  else if (expr === 'sleep') { crescent(g, 24, -66, 12, Math.PI * .1, Math.PI * .9, 4.2); taper(g, [[12, -74], [24, -76], [36, -74]], 2.8); taper(g, [[45, -30], [39, -29.5], [33, -29.5]], 2.4); }
  else if (expr === 'wide') { holeC(g, 25, -58, 10.5, 9.5); pupil(27, -58, 3.4); fill(g, q => q.rect(26, -69, 2.4, 9), col); taper(g, [[10, -79], [24, -85], [38, -82]], 3.4); mouthOpen(.45); }
  else if (expr === 'scared') { holeC(g, 25, -58, 10, 9.5); pupil(28, -57, 2.4); fill(g, q => q.rect(27, -68.5, 2, 10), col); taper(g, [[10, -71], [24, -78], [38, -84]], 3.4); cut(g, q => { q.moveTo(52, -34); q.lineTo(36, -33); q.lineTo(41, -29); q.lineTo(34, -26); q.lineTo(50, -24); q.closePath(); });
    cut(g, q => { q.moveTo(4, -92); q.quadraticCurveTo(10, -82, 4, -78); q.quadraticCurveTo(-2, -82, 4, -92); }); }
  else if (expr === 'blab') { crescent(g, 24, -52, 11, Math.PI * 1.1, Math.PI * 1.9, 4.2); taper(g, [[11, -70], [24, -78], [38, -78]], 3.8); mouthOpen(1.5); }
  else if (expr === 'smug') { crescent(g, 24, -52, 11, Math.PI * 1.1, Math.PI * 1.9, 4.2); taper(g, [[11, -72], [24, -78], [38, -76]], 3.8); taper(g, [[46, -31], [39, -26], [31, -30]], 3); }
}
function headPiece(spec, expr, K) {
  const col = spec.col, hair = spec.hair, seed = spec.seed || 3;
  return piece([-78, -132, 70, 128], g => {
    if (HAIR[hair]) blob(g, HAIR[hair], col, seed + 1);
    if (hair === 'bun') { disc(g, -46, -76, 21, col, 20, seed + 2); }
    if (hair === 'pomp') blob(g, [[-6, -100], [14, -116], [42, -116], [58, -100], [54, -86], [40, -86], [26, -94]], col, seed + 2);
    if (hair === 'short') blob(g, [[8, -100], [30, -106], [48, -94], [50, -78], [40, -84], [26, -92]], col, seed + 2);
    if (spec.flower) for (let k = 0; k < 5; k++) disc(g, -24 + Math.cos(k * 1.257 - 1.5) * 11, -100 + Math.sin(k * 1.257 - 1.5) * 11, 8.5, col, 8.5, seed + k);
    blob(g, HEAD, col, seed, .3);
    autoInset(g, 3.2, 1.4);
    // hairline, ear
    const hl = curve(hair === 'pomp' ? [[44, -84], [28, -84], [12, -78], [4, -62], [0, -46], [-8, -32]] : [[40, -82], [24, -76], [10, -70], [3, -56], [-3, -40], [-11, -24]], false, 2);
    cutTaper(g, hl, 3.2);
    if (hair !== 'pomp') sawRow(g, hl.slice(0, Math.floor(hl.length * .45)), 9, 5.5, -1, .7);
    cutTaper(g, curve([[-2, -56], [-10, -52], [-10, -42], [-3, -38]], false, 2), 2.6);
    // strands: arcs round the crown; more of them cut away = greyer hair
    const n = 3 + Math.round((spec.grey || 0) * 7);
    within(g, P(HEAD.concat(), true, 0, 1), () => {
      for (let k = 0; k < n; k++) { const r = 20 + (k + .5) * (30 / n), a0 = -2.95 + k * .02, a1 = -1.5 + (hair === 'pomp' ? .35 : .1); const pts = []; for (let i = 0; i <= 18; i++) { const a = a0 + (a1 - a0) * i / 18; pts.push([2 + Math.cos(a) * r, -56 + Math.sin(a) * r]); } cutTaper(g, pts, spec.grey ? 3.4 : 2.8); }
    });
    if (hair === 'long' || hair === 'braid') { if (hair === 'braid') crescentRows(g, -50, -10, -18, 120, 7, 2.8, 0, .8); else for (let k = 0; k < 3; k++) taper(g, [[-34 - k * 6, -60], [-40 - k * 5, 0], [-44 - k * 4, 60], [-44 - k * 3, 94]], 2.8); }
    if (hair === 'bob') for (let k = 0; k < 2 + Math.round((spec.grey || 0) * 3); k++) taper(g, [[-30 - k * 6, -66], [-36 - k * 5, -30], [-34 - k * 4, -4]], 2.8);
    if (hair === 'bun') { swirl(g, -46, -76, 15, 2, 3, -1, 1); for (let k = 0; k < 4; k++) taper(g, [[-20 - k * 5, -84 + k * 6], [-30 - k * 2, -60 + k * 4], [-26, -34]], 2.6); }
    if (hair === 'short') taper(g, [[-36, -66], [-40, -44], [-34, -28]], 2.6);
    if (spec.flower) { plum(g, -24, -100, 9); }
    if (spec.earring) holeC(g, -6, -30, 3);
    face(g, expr, col);
  }, { seed, col, ss: K });
}
const TORSO = {
  dress: [[-8, -150], [10, -152], [22, -140], [28, -122], [27, -96], [21, -70], [26, -40], [34, 0], [50, 90], [62, 190], [-56, 190], [-46, 90], [-34, 0], [-29, -40], [-25, -70], [-30, -100], [-26, -128], [-18, -142]],
  jacket: [[-8, -150], [10, -152], [23, -140], [30, -120], [30, -90], [27, -50], [32, -10], [37, 28], [-37, 28], [-34, -10], [-29, -50], [-32, -100], [-27, -128], [-18, -142]],
  suit: [[-10, -150], [12, -152], [30, -142], [40, -122], [43, -90], [41, -40], [44, 26], [-42, 26], [-39, -40], [-41, -100], [-35, -130], [-22, -144]]
};
function torsoPiece(spec) {
  const col = spec.col, o = spec.outfit, seed = spec.seed || 3;
  return piece([-70, -160, 76, 200], g => {
    const out = P(TORSO[o], true, .3, seed + 7);
    fill(g, q => trace(q, out), col);
    if (spec.shawl) poly(g, [[-36, -134], [30, -140], [44, -96], [30, -60], [8, -84], [-20, -62], [-44, -92]], col, seed + 8);
    autoInset(g, 3.4, 1.5);
    within(g, out, () => {
      if (o === 'dress') {
        taper(g, [[-14, -138], [0, -140], [16, -141], [24, -136]], 2.6);                 // collar
        taper(g, [[20, -136], [10, -118], [-4, -104]], 2.6);                              // slanted placket
        for (const [x, y] of [[13, -124], [3, -112]]) coin(g, x, y, 3.6);
        rosette(g, 0, -84, 13, 6, .3, .22);
        taper(g, [[-28, -42], [0, -38], [26, -42]], 3); taper(g, [[-29, -34], [0, -30], [27, -34]], 2.2);    // sash
        for (const x of [-22, -4, 16]) taper(g, [[x * .6, -14], [x * 1.1, 70], [x * 1.5, 150]], 3);           // skirt pleats
        g.save(); g.beginPath(); g.rect(-70, 158, 150, 20); g.clip(); crescentRows(g, -70, 160, 80, 178, 8, 3, 0, .78); g.restore();
        sawRow(g, [[-58, 186], [64, 186]], 9, 7, -1, .72);
      } else if (o === 'jacket') {
        taper(g, [[-14, -138], [0, -141], [16, -141], [25, -134]], 2.8);
        taper(g, [[22, -134], [26, -90], [27, -40], [33, 20]], 2.6);                      // front edge
        for (const y of [-112, -80, -48]) coin(g, 15, y, 3.4);
        cut(g, q => trace(q, Pl([[-18, -28], [10, -28], [10, -24.5], [-18, -24.5]], true, .2, 2)));          // pocket slit
        if (!spec.shawl) { swirl(g, -8, -92, 11, 1.7, 2.8, .4, 1); }
        sawRow(g, [[-36, 24], [36, 24]], 8, 6.5, -1, .7);
        taper(g, [[-26, -120], [-28, -70], [-30, -10]], 2.2);
      } else {
        // lapels, shirt front, buttons, pocket square
        cut(g, q => trace(q, Pl([[8, -150], [22, -146], [30, -104], [20, -100]], true, .2, 3)));
        taper(g, [[30, -104], [14, -122], [12, -140]], 2.4); taper(g, [[30, -104], [38, -60], [41, -10], [43, 20]], 2.6);
        for (const y of [-78, -50]) holeC(g, 30, y, 3.2);
        cut(g, q => trace(q, Pl([[-16, -112], [-2, -116], [-4, -106], [-14, -103]], true, .2, 4)));
        taper(g, [[-30, -124], [-33, -70], [-34, -10]], 2.2);
        taper(g, [[-30, -30], [-8, -28]], 2.4);
      }
      if (spec.shawl) { sawRow(g, [[-44, -92], [-20, -62], [8, -84], [30, -60], [44, -96]], 11, 6, -1, .72); for (const [x, y] of [[-22, -100], [0, -112], [22, -100]]) plum(g, x, y, 6.5); }
    });
  }, { seed: seed + 7, col });
}
function limb(kind, col, seed, pat) {
  if (kind === 'ua') return piece([-20, -16, 20, 74], g => { blob(g, [[-13, -8], [0, -12], [13, -8], [15, 20], [13, 60], [0, 67], [-12, 60], [-15, 20]], col, seed); autoInset(g, 3, 1.3); if (pat) { g.save(); g.beginPath(); g.rect(-20, 4, 40, 44); g.clip(); crescentRows(g, -20, 4, 20, 46, 7, 2.6, 0, .72); g.restore(); } });
  if (kind === 'fa') return piece([-18, -14, 18, 84], g => { blob(g, [[-11, -6], [0, -9], [11, -6], [12, 24], [10, 50], [0, 54], [-10, 50], [-12, 24]], col, seed); blob(g, [[-8, 48], [8, 48], [11, 60], [7, 73], [-3, 75], [-9, 65]], col, seed + 1); autoInset(g, 2.8, 1.3); taper(g, [[-10, 45], [0, 47], [10, 45]], 2.4); if (pat) taper(g, [[-10, 38], [0, 40], [10, 38]], 2); });
  if (kind === 'th') return piece([-24, -18, 24, 108], g => { blob(g, [[-18, -10], [0, -14], [18, -10], [17, 40], [14, 94], [0, 101], [-14, 94], [-18, 40]], col, seed); autoInset(g, 3, 1.3); taper(g, [[2, 0], [3, 44], [1, 88]], 2.2); });
  return piece([-20, -14, 44, 112], g => { blob(g, [[-13, -6], [0, -9], [13, -6], [12, 40], [10, 82], [-12, 84], [-13, 40]], col, seed); poly(g, [[-12, 80], [10, 80], [30, 89], [38, 99], [34, 105], [-12, 105]], col, seed + 1); autoInset(g, 2.8, 1.3); taper(g, [[-11, 82], [0, 85], [11, 83]], 2.4); if (pat) sawRow(g, [[-12, 72], [12, 72]], 7, 5, -1, .7); });
}
// overlays pasted on top of the cut (collage): rouge dot, tie, crown
const rouge = () => memo('rouge', () => piece([-10, -10, 10, 10], g => { disc(g, 0, 0, 8.5, COL.pale2); rosette(g, 0, 0, 7, 5, 0, .25); }, { seed: 5 }));
const tie = short => memo('tie' + short, () => piece([-12, -6, 14, 70], g => { poly(g, short ? [[-5, 0], [7, 0], [8, 18], [2, 22], [-3, 16], [-6, 20]] : [[-5, 0], [7, 0], [10, 44], [3, 62], [-6, 46]], COL.cream, 3); poly(g, [[-6, -4], [8, -4], [6, 8], [-4, 8]], COL.cream, 4); if (!short) for (const y of [18, 30, 42]) cut(g, q => trace(q, Pl([[-6, y], [9, y - 5], [9, y - 1.5], [-6, y + 3.5]], true, .1, 1))); }, { seed: 6 }));
export const tieEnd = () => memo('tieEnd', () => piece([-12, -4, 14, 46], g => { poly(g, [[-6, 4], [-3, 0], [2, 6], [8, 2], [10, 26], [3, 44], [-6, 28]], COL.cream, 3); for (const y of [12, 24]) cut(g, q => trace(q, Pl([[-6, y], [9, y - 5], [9, y - 1.5], [-6, y + 3.5]], true, .1, 1))); }, { seed: 6 }));
const crown = () => memo('crown', () => piece([-34, -34, 34, 10], g => { poly(g, [[-28, 6], [-32, -24], [-17, -8], [-8, -30], [2, -10], [12, -30], [20, -8], [32, -24], [28, 6]], COL.cream, 2); autoInset(g, 2.6, 1.2); for (const x of [-16, 2, 20]) holeC(g, x, -2, 2.6); }, { seed: 8 }));

export function makeFig(spec) {
  const F = { spec, heads: {} };
  F.head = (expr, K = 3) => memo(`head|${spec.id}|${expr}|${K}`, () => headPiece(spec, expr, K));
  F.torso = () => memo(`torso|${spec.id}`, () => torsoPiece(spec));
  const pat = spec.outfit !== 'suit';
  F.limb = (kind, near) => memo(`limb|${spec.id}|${kind}|${near}`, () => limb(kind, near ? (kind === 'ua' || kind === 'fa' ? spec.near : spec.col) : spec.far, (spec.seed || 3) + (near ? 11 : 17) + kind.charCodeAt(0), pat));
  return F;
}
const mk = (id, o) => makeFig({ id, col: COL.red, near: COL.near, far: COL.far, ...o });
export const HUA28 = mk('h28', { hair: 'long', flower: true, outfit: 'dress', rouge: true, seed: 3 });
export const HUA28B = mk('h28b', { hair: 'short', outfit: 'dress', seed: 3 });           // hair cut, make-up off, still in the dress
export const HUA = mk('hua', { hair: 'short', outfit: 'jacket', seed: 4 });
export const HUA40 = mk('h40', { hair: 'bob', grey: .25, outfit: 'jacket', seed: 4 });
export const HUA55 = mk('h55', { hair: 'bob', grey: .6, outfit: 'jacket', shawl: true, seed: 4 });
export const HUA68 = mk('h68', { hair: 'bun', grey: 1, outfit: 'jacket', shawl: true, seed: 4 });
export const FA = makeFig({ id: 'fa', col: COL.teal, near: COL.tealNear, far: COL.tealFar, hair: 'pomp', outfit: 'suit', tie: true, seed: 9, scale: 1.05 });
export const PRINCE = makeFig({ ...FA.spec, id: 'prince', crown: true });
export const SIS = [
  mk('s1', { hair: 'braid', outfit: 'dress', col: COL.pale, near: '#ea8a7c', far: '#c9584f', seed: 21 }),
  mk('s2', { hair: 'bob', grey: .5, outfit: 'jacket', col: COL.deep, near: '#a3171d', far: COL.deep2, seed: 22, earring: true }),
  mk('s3', { hair: 'bun', grey: .8, outfit: 'dress', col: '#c0392f', near: '#cf4a3e', far: '#9c2a24', seed: 23 }),
  mk('s4', { hair: 'short', grey: .4, outfit: 'jacket', shawl: true, col: COL.pale, near: '#ea8a7c', far: '#c9584f', seed: 24 }),
  mk('s5', { hair: 'long', grey: 1, outfit: 'jacket', col: COL.deep, near: '#a3171d', far: COL.deep2, seed: 25 }),
  mk('s6', { hair: 'braid', grey: .7, outfit: 'jacket', shawl: true, col: '#c0392f', near: '#cf4a3e', far: '#9c2a24', seed: 26 }),
  mk('s7', { hair: 'bob', grey: 1, outfit: 'dress', col: COL.red, near: COL.near, far: COL.far, seed: 27 })
];

// ---------- poses (degrees; arms / hips: + = forward; elbow: + = bend forward-up; knee: + = shin back) ----------
export const POSE = {
  stand: { lean: 0, bob: 0, head: 0, aN: [6, 12], aF: [-8, 10], lN: [3, 0], lF: [-4, 2] },
  sit: { lean: 0, bob: 96, head: 0, aN: [38, 70], aF: [30, 64], lN: [88, 88], lF: [82, 84] },
  sitBack: { lean: -10, bob: 96, head: -2, aN: [-12, 96], aF: [-20, 100], lN: [86, 80], lF: [80, 76] },   // arms folded, unimpressed
  point: { lean: 4, bob: 0, head: -2, aN: [88, 4], aF: [-22, 30], lN: [8, 0], lF: [-10, 4] },
  sword: { lean: -3, bob: 0, head: -8, aN: [150, 8], aF: [-30, 40], lN: [14, 4], lF: [-14, 2] },          // scissors raised
  open: { lean: -6, bob: 0, head: -14, aN: [128, 6], aF: [-128, -6], lN: [8, 0], lF: [-8, 0] },           // arms flung wide (far arm back and up)
  shrug: { lean: -2, bob: 0, head: 6, aN: [30, 120], aF: [-34, -120], lN: [3, 0], lF: [-4, 2] },
  push: { lean: 16, bob: 6, head: 4, aN: [84, 10], aF: [74, 14], lN: [30, 34], lF: [-28, 6] },
  throwA: { lean: -14, bob: 4, head: -6, aN: [-70, 50], aF: [40, 30], lN: [16, 10], lF: [-18, 4] },       // wind-up
  throwB: { lean: 14, bob: 2, head: 2, aN: [118, 4], aF: [-40, 30], lN: [24, 20], lF: [-22, 2] },         // release
  ride: { lean: 6, bob: 96, head: -2, aN: [50, 40], aF: [44, 44], lN: [58, 70], lF: [52, 66] },
  cower: { lean: 26, bob: 60, head: 14, aN: [110, 120], aF: [100, 124], lN: [70, 110], lF: [60, 104] },
  hands: { lean: 0, bob: 0, head: -3, aN: [58, 0], aF: [-58, 0], lN: [4, 0], lF: [-4, 0] }                // hand in hand in a chain (front hand forward, back hand back)
};
export const pmix = (a, b, u) => mix(a, b, u);
export function walk(ph, amp = 1) {   // ph in cycles
  const s = Math.sin(ph * 6.2832), c = Math.cos(ph * 6.2832);
  return { lean: 4 * amp, bob: -Math.abs(c) * 5 * amp + 3, head: -1, aN: [-26 * s * amp, 16 + 10 * Math.max(0, -s)], aF: [26 * s * amp, 16 + 10 * Math.max(0, s)], lN: [30 * s * amp, 34 * Math.max(0, -c) * amp + 4], lF: [-30 * s * amp, 34 * Math.max(0, c) * amp + 4] };
}

// ---------- draw ----------
// pose: {x, y, s, dir, rot} + angles + expr; returns the joint matrices (hands: Ms.handN / Ms.handF, head: Ms.head, torso: Ms.torso)
export function drawFig(g, C, F, p, opt = {}) {
  const sp = F.spec, s = (p.s ?? 1) * (sp.scale || 1), dir = p.dir ?? 1, sh = opt.shadow ?? 1;
  let M0 = mul(C, T(p.x, p.y)); if (p.rot) M0 = mul(mul(mul(M0, T(0, -200 * s)), R(p.rot)), T(0, 200 * s)); M0 = mul(M0, S(s * dir, s));
  const Mh = mul(M0, T(0, -200 + (p.bob || 0))), Mt = mul(Mh, R((p.lean || 0) * DEG));
  const arm = a => { const U = mul(mul(Mt, T(2, -132)), R(-(a[0]) * DEG)), Fm = mul(mul(U, T(0, 60)), R(-(a[1]) * DEG)); return [U, Fm, mul(Fm, T(0, 64))]; };
  const leg = l => { const U = mul(mul(Mh, T(0, -2)), R(-(l[0]) * DEG)), L = mul(mul(U, T(0, 94)), R(l[1] * DEG)); return [U, L]; };
  const aN = arm(p.aN || [0, 0]), aF = arm(p.aF || [0, 0]), lN = leg(p.lN || [0, 0]), lF = leg(p.lF || [0, 0]);
  const Mhead = mul(mul(Mt, T(2, -148)), R((p.head || 0) * DEG));
  const o = { shadow: sh, alpha: opt.alpha, filter: opt.filter };
  const pp = (pc, M) => put(g, opt.map ? opt.map(pc) : pc, M, opt.map ? { shadow: 0, img: opt.map(pc).c } : o);
  const dress = sp.outfit === 'dress';
  if (!opt.noFar) { pp(F.limb('ua', 0), aF[0]); pp(F.limb('fa', 0), aF[1]); }
  if (!opt.noFarLeg) { pp(F.limb('th', 0), lF[0]); pp(F.limb('sh', 0), lF[1]); }
  if (dress) { pp(F.limb('th', 1), lN[0]); pp(F.limb('sh', 1), lN[1]); pp(F.torso(), Mt); }
  else { pp(F.limb('th', 1), lN[0]); pp(F.limb('sh', 1), lN[1]); pp(F.torso(), Mt); }
  if (sp.tie && !opt.map) put(g, tie(p.tieCut ? 1 : 0), mul(Mt, T(26, -138)), { shadow: opt.filter ? 0 : .5, filter: opt.filter });
  const MheadS = mul(Mhead, S((p.headS || 1) * 1.22));
  pp(F.head(p.expr || 'cold', opt.K || 3), MheadS);
  if (!opt.map && !opt.filter) {
    if (sp.rouge && !p.noRouge) put(g, rouge(), mul(MheadS, T(24, -36)), { shadow: .4 });
    if (sp.crown) put(g, crown(), mul(mul(MheadS, T(6, -100)), R(.12)), { shadow: .6 });
  }
  if (opt.mid) opt.mid({ handN: aN[2], handF: aF[2], torso: Mt, head: Mhead });
  pp(F.limb('ua', 1), aN[0]); pp(F.limb('fa', 1), aN[1]);
  return { handN: aN[2], handF: aF[2], head: MheadS, torso: Mt, root: M0, pelvis: Mh, foreN: aN[1], foreF: aF[1] };
}
