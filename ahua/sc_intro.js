// Intro (0 – 17.6 s): scissors cut a woman out of a sheet of wedding paper, next to a finished 囍. Title.
import { W, H, COL, canvas, memo, piece, poly, rectP, put, at, mul, T, R, S, cam, ground, step, seg, eio, eo, ei, lerp, clamp, hash, scraps, glyph, pop, arrive, cutText, autoInset, keys } from './engine.js';
import { drawFig, POSE, HUA28 } from './figure.js';
import { drawXi, drawScissors, snipOpen } from './props.js';
import { say } from './film.js';

const FX = 1380, FY = 900, FS = 1.45;
const PATH0 = [[-80, -300], [-66, -400], [-50, -470], [-28, -500], [10, -478], [56, -440], [72, -402], [56, -362], [34, -330], [34, -240], [40, -190], [54, -110], [68, -6], [-62, -6], [-52, -110], [-40, -200], [-70, -230], [-80, -300]];
const PATH = (() => { // resample by arc length, in screen units at zoom 1
  const pts = PATH0.map(([x, y]) => [FX + x * FS, FY + y * FS]), out = []; let L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, L, tot: L[L.length - 1] };
})();
function pathAt(u) {
  const s = clamp(u) * PATH.tot; let i = 0; while (i < PATH.L.length - 2 && PATH.L[i + 1] < s) i++;
  const f = (s - PATH.L[i]) / (PATH.L[i + 1] - PATH.L[i]), a = PATH.pts[i], b = PATH.pts[i + 1];
  return { p: [lerp(a[0], b[0], f), lerp(a[1], b[1], f)], ang: Math.atan2(b[1] - a[1], b[0] - a[0]) };
}
const FIGPOSE = { ...POSE.stand, x: FX, y: FY, s: FS, expr: 'cold' };
const sheet = () => memo('introSheet', () => piece([-300, -440, 300, 440], g => { poly(g, rectP(-296, -436, 592, 872), COL.red, 4); }, { seed: 200, ss: 1.5 }));
// the silhouette of the figure on the sheet: the slit the scissors leave, and the sheet with her shape missing
const sil = () => memo('introSil', () => {
  const Q = 2, [fc, fg] = canvas(W * Q, H * Q); drawFig(fg, [Q, 0, 0, Q, 0, 0], HUA28, FIGPOSE, { shadow: 0 });
  const [sc, sg] = canvas(W * Q, H * Q);
  for (let k = 0; k < 12; k++) sg.drawImage(fc, Math.cos(k / 12 * 6.283) * 7, Math.sin(k / 12 * 6.283) * 7);
  sg.globalCompositeOperation = 'source-in'; sg.fillStyle = 'rgba(70,8,12,.92)'; sg.fillRect(0, 0, W * Q, H * Q);
  sg.globalCompositeOperation = 'destination-out'; sg.drawImage(fc, 0, 0);
  const [hc, hg] = canvas(W * Q, H * Q); put(hg, sheet(), [Q, 0, 0, Q, 1380 * Q, 500 * Q], { shadow: 0 });
  hg.setTransform(1, 0, 0, 1, 0, 0); hg.globalCompositeOperation = 'destination-out'; for (let k = 0; k < 8; k++) hg.drawImage(fc, Math.cos(k / 8 * 6.283) * 5, Math.sin(k / 8 * 6.283) * 5);
  return { slit: sc, holed: hc };
});
const seal = () => memo('seal', () => piece([-44, -44, 44, 44], g => { poly(g, rectP(-38, -38, 76, 76), COL.deep, 3); autoInset(g, 3, 1.3); cutText(g, '花', 0, 1, 48); }, { seed: 201 }));

export function shots(TL) {
  const G = TL.G, tDrop = TL.hit('intro.drop', G(14)), tL = [16, 18, 20, 22].map(i => TL.hit('title', G(i))), tSeal = TL.hit('seal', G(24));
  const snips = [.6, 1.2, 1.8, 2.4, 3.0, 3.6, 4.2, 4.8];
  for (let i = 0; i <= 12; i++) snips.push(G(i));
  const prog = t => t < 4.8 ? .17 * t / 4.8 : lerp(.17, 1, eio(seg(t, 4.8, 10.5)) * .45 + seg(t, 4.8, 10.5) * .55);
  function draw(g, t) {
    const st = step(t), u = prog(t), tip = pathAt(u), S = sil();
    // open flat on the finished 囍 (the thing this film takes apart), whip to the scissors at work, then pull back to both
    const k1 = eio(seg(t, .45, 1.75)), zin = eio(seg(t, 4.4, 9.6)), z = lerp(lerp(1.72, 2.5, k1), 1, zin);
    const C = cam(lerp(lerp(540, tip.p[0] + 70, k1), 960, zin), lerp(lerp(440, tip.p[1] + 10, k1), 540, zin), z);
    ground(g, 'rice', C, 'rgba(238,224,192,.4)');
    drawXi(g, C, 540, 440, .72);
    const dropU = seg(t, tDrop, tDrop + .75);
    if (dropU < 1) {
      g.save(); const e = ei(dropU);
      if (dropU <= 0) { put(g, sheet(), at(C, 1380, 500), { shadow: 1.4 }); g.setTransform(...C); g.beginPath(); for (let k = 0; k <= 60 * u; k++) { const q = pathAt(k / 60).p; g.moveTo(q[0] + 64, q[1]); g.arc(q[0], q[1], 64, 0, 7); } g.clip(); g.drawImage(S.slit, 0, 0, W, H); g.restore(); g.save();
        // behind the blades the finished cut shows: face, hair and dress pattern come up as the scissors pass
        g.setTransform(...C); g.beginPath(); for (let k = 0; k <= 60 * Math.max(0, u - .025); k++) { const q = pathAt(k / 60).p; g.moveTo(q[0] + 118, q[1]); g.arc(q[0], q[1], 118, 0, 7); } g.clip(); drawFig(g, C, HUA28, FIGPOSE, { shadow: 0 }); }
      else { g.setTransform(...mul(mul(C, T(1380, 500 + e * 1500)), mul(R(e * .35), T(-1380, -500)))); g.shadowColor = 'rgba(52,6,10,.4)'; g.shadowBlur = 14; g.shadowOffsetX = 8; g.shadowOffsetY = 12; g.drawImage(S.holed, 0, 0, W, H); }
      g.restore();
    }
    if (dropU > 0) {     // she stays; the offcut falls away around her
      const look = st >= tL[1] && st < tSeal + .9 ? -1 : 1, P = keys(st, [[tDrop, { ...FIGPOSE }], [tL[3], { ...FIGPOSE, aN: [-14, 100], aF: [-22, 104], lean: -4, expr: 'cold' }], [tSeal, { ...FIGPOSE, ...POSE.point, aN: [96, 6], expr: 'smirk' }], [tSeal + 1.3, { ...FIGPOSE, aN: [-14, 100], aF: [-22, 104], expr: 'smirk' }]], .25);
      drawFig(g, C, HUA28, { ...P, dir: look, s: FS });
    }
    for (const s0 of snips) if (s0 < 10.5) { const q = pathAt(prog(s0)).p; scraps(g, C, t, s0, q[0], q[1], 3, [COL.red, COL.near, COL.far], { seed: s0 * 7, size: 9, spread: 90, up: 120, life: 1.6 }); }
    if (t < 11.2) {      // the scissors: blade axis along the direction of travel; they leave once the outline closes
      const out = eo(seg(t, 10.5, 11.1)), op = t < 4.9 ? snipOpen(t, .6) : snipOpen(t, TL.per, TL.g0);
      drawScissors(g, C, tip.p[0] + out * 700, tip.p[1] - out * 900, tip.ang - out * 1.2, op, 1.25);
    }
    // title: cut letters popping in on the beats, a sawtooth rule and a seal
    const X0 = 318, Y0 = 842, SZ = 132;
    '战士阿花'.split('').forEach((ch, i) => { const a = arrive(st, tL[i]); if (a) put(g, glyph(ch, SZ), at(C, X0 + i * 148, Y0, a, (hash(i * 3.3) - .5) * .06), { shadow: 1.2 }); });
    if (st >= tL[0]) { const p = C[0]; say('title', '战士阿花', (X0 - 80) * p + C[4], (Y0 - 90) * p + C[5], (X0 + 3 * 148 + 80) * p + C[4], (Y0 + 90) * p + C[5]); }
    const a = arrive(st, tSeal); if (a) put(g, seal(), at(C, 940, 870, a, .08), { shadow: 1 });
  }
  return [{ id: 'intro', t0: 0, draw }];
}
