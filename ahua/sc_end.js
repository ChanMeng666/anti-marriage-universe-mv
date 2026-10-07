// Finale (chorus 3 line 8 and the outro, 206.7 – 239.5 s), one continuous shot: every sister throws a bouquet, the great 囍 lights from behind,
// the scissors run down its seam, one half goes into the fire, and a single 喜 stays lit.
import { W, H, COL, TAU, put, at, mul, T, R, S, ap, cam, step, seg, eio, eo, ei, lerp, clamp, hash, scraps, pop, arrive, keys, hitShake, holesOf } from './engine.js';
import { drawFig, POSE, HUA28, HUA, HUA68, SIS } from './figure.js';
import { xi, XI_GAP, bouquet, drawScissors, snipOpen, apron, script, abacus, mask, pie, calLeaf, priceTag, paperMan } from './props.js';
import { nightLand, floor, lightPass, pool, lightImage, emitGlow, emitPiece, emitEnd, emitCtx, emitDot, sparks, rays } from './sets.js';
import { firePaper, firePool, fireEmit } from './sc_chorus.js';

export function shots(TL) {
  const G = TL.G, B = i => G(i + 272), t0 = B(192);
  const FX = 960, FS = 1.1, FY = 900 - 110 * FS, XY = 250, XS = .6, HD = (200 + XI_GAP) * XS;
  const tRel = k => TL.hit('fin.throw' + k, B(193) + k * TL.per / 2), tFl = TL.hit('fin.flare', B(196)), syl = [198, 200, 202, 203].map(B);
  for (let k = 0; k < 8; k++) tRel(k);
  const O = ['OUT.0', 'OUT.1', 'OUT.2', 'OUT.3'].map(id => TL.L(id).t0);
  const tA = TL.hit('seam.cutA', G(503)), tC = TL.hit('seam.cutC', G(508)), tBurn = TL.hit('half.burn', G(510)), tAges = [513, 515, 517].map(i => TL.hit('ages', G(i)));
  // what the film collected goes into the fire, one thing per quarter note, thrown by one sister after another
  const FEED = [() => apron(), () => script(0), () => abacus(), () => mask(), () => pie(), () => calLeaf('昨天', true), () => paperMan(0), () => priceTag('¥')], FS_ = [.42, .4, .5, .4, .42, .5, .6, 1.1];
  const tFeed = k => TL.hit('fin.feed' + k, G(480 + 2 * k));
  for (let k = 0; k < 8; k++) tFeed(k);
  const SX = [[250, 1], [1670, -1], [370, 1], [1550, -1], [490, 1], [1430, -1], [610, 1], [1310, -1]];      // sisters, alternating sides; index 6 is Ah Hua
  const seamY = u => lerp(XY - 300 * XS, XY + 300 * XS, u);
  function draw(g, t) {
    const st = step(t), sk = hitShake(t, [tFl, tC, tBurn], 8), sk2 = hitShake(t, [0, 1, 2, 3, 4, 5, 6, 7].map(k => tFeed(k) + .75), 4); sk[0] += sk2[0]; sk[1] += sk2[1];
    // camera: push (chorus) → tilt up to the 囍 → ECU down the seam → pull back → settle on the single 喜
    const cu = keys(t, [[t0, [960, 610, 1.08]], [O[0] - .3, [960, 560, 1.2], 5], [O[1], [960, 500, 1.2], 3.6], [O[2] - 1.2, [960, 470, 1.3], 3.2], [O[2] - .3, [960, 300, 1.7], .9], [tA - .3, [960, 130, 3.3], 1.0], [tC, [960, 320, 3.3], tC - tA + .3], [tBurn + .5, [980, 560, 1.12], 1.3], [G(528), [960 + HD, 510, 1.32], 5]], 1, eio);
    const C = cam(cu[0] + sk[0], cu[1] + sk[1], cu[2]), z = cu[2];
    const dim = seg(t, 230.5, 237), fall = Math.max(0, t - tC), halfGone = t > tC;
    nightLand(g, cu[0], cu[1], z, t, { moon: false }); floor(g, C, 900, COL.n2, -900);
    // sisters: throw one after another, then watch
    const lit = (st < tFl ? .8 : Math.min(1.18, .8 + (st - tFl) * 6)) * (1 - .2 * seg(t, O[0], O[2])) + (t > tBurn ? .3 * Math.max(0, 1 - (t - tBurn) / 2.5) : 0);
    const pulse = t > tFl ? Math.exp(-((((t - TL.g0) / (2 * TL.per)) % 1 + 1) % 1) * 2 * TL.per * 7) : 0;      // fire and backlight breathe on the quarter notes
    const fl = lit * (1 - .82 * dim) * (1 + .14 * pulse * (1 - dim));
    const bqs = [];
    SX.forEach(([x, dir], k) => {
      const F = k === 6 ? HUA68 : SIS[k % 7], tr = tRel(k), ph = Math.floor((st - TL.g0) / TL.per) % 2;
      const tf = tFeed(k), rest = { ...POSE.stand, x, y: 900, s: .86, dir, expr: 'serene', head: -12, aN: [-14, 100], aF: [-22, 104] };
      const P = keys(st, [[t0, { ...POSE.stand, x, y: 900, s: .86, dir, expr: 'firm', aN: [20, 60] }], [tr - .22, { ...POSE.throwA, x, y: 900, s: .86, dir, expr: 'firm' }], [tr, { ...POSE.throwB, x, y: 900, s: .86, dir, expr: 'sing' }], [tr + .6, { ...POSE.throwB, x, y: 900, s: .86, dir, expr: 'sing' }], [tr + 1, rest],
        [tf - .5, rest], [tf - .2, { ...POSE.throwA, x, y: 900, s: .86, dir, expr: 'firm' }], [tf, { ...POSE.throwB, x, y: 900, s: .86, dir, expr: 'sing' }], [tf + .5, { ...POSE.throwB, x, y: 900, s: .86, dir, expr: 'sing' }], [tf + .9, { ...rest, aN: [150, 10], expr: 'sing' }], [O[2] - .6, { ...rest, aN: [150, 10], expr: 'sing' }], [O[2], rest]], .1);
      if (st > tr + 1 && t < 230) P.bob = ph ^ (k % 2) ? -4 : 0;
      const r = drawFig(g, C, F, P); const u = seg(t, tr, tr + .85), h = ap(r.handN, [0, 0]);
      if (t < tr) bqs.push(mul([z, 0, 0, z, h[0], h[1]], mul(R(-.6 * dir), S(.34))));
      else if (u < 1) bqs.push(at(C, lerp(x + dir * 60, FX + (k - 3.5) * 16, u), lerp(620, FY - 120, u) - Math.sin(u * Math.PI) * (330 + k * 14), .36, (-.6 + u * 7) * dir));
    });
    // the 囍 above the fire; after the cut the left half drops into it
    const pX = xi(COL.red, true);
    const dropU = Math.min(1, fall / 1.0), ML = halfGone ? mul(mul(at(C, FX - HD - fall * 40, XY + 60 * fall + 500 * fall * fall, XS), R(-fall * .9)), S(1 - .5 * seg(t, tBurn, tBurn + 1.6))) : at(C, FX - HD, XY, XS);
    const MR = at(C, FX + HD, XY, XS, 0, -1), leftVis = t < tBurn + 1.6;
    if (leftVis && halfGone) put(g, pX, ML, { shadow: 1.6 });
    firePaper(g, C, FX, FY, FS, t, fl, 7);
    if (!halfGone) put(g, pX, ML, { shadow: 1.6 }); put(g, pX, MR, { shadow: 1.6 });
    for (const M of bqs) put(g, bouquet(), M, { shadow: 1.2 });
    for (let k = 0; k < 8; k++) { const u2 = (t - tFeed(k)) / .75; if (u2 < 0 || u2 >= 1) continue; const [x, dir] = SX[k]; put(g, FEED[k](), at(C, lerp(x + dir * 70, FX, u2), lerp(600, FY - 80, u2) - Math.sin(u2 * Math.PI) * (300 + k * 12), FS_[k] * (1 - .3 * u2), (-1 + u2 * 8) * dir), { shadow: 1.4 }); }
    // the three ages under the single 喜
    const AG = [[HUA28, FX + HD - 124], [HUA, FX + HD], [HUA68, FX + HD + 124]], agesOn = AG.map((a, i) => arrive(st, tAges[i]));
    const ages = (ctx, fo) => AG.forEach(([F, x], i) => { if (agesOn[i]) drawFig(ctx, C, F, { ...POSE.stand, x, y: 912, s: .95 * (fo ? 1 : agesOn[i]), dir: i === 2 ? -1 : 1, expr: 'serene', head: -14, aN: [-14, 100], aF: [-22, 104] }, fo); });
    ages(g);
    // scissors: wait above the seam, then run down it
    if (t > O[1] - .2 && t < tC + .9) {
      const inn = eo(seg(t, O[1] - .2, O[1] + 2.2)), cutU = t < tA ? lerp(0, .22, eio(seg(t, O[2] - .2, tA))) : lerp(.22, .66, eio(seg(t, tA, tC))), away = ei(seg(t, tC + .1, tC + .9));
      drawScissors(g, C, FX + away * 500, lerp(-260, seamY(cutU), inn) - away * 500, Math.PI / 2 - away, t < O[2] - .2 ? .3 + .5 * snipOpen(t, TL.per * 2, TL.g0) : (st >= tC ? 0 : snipOpen(t, TL.per, TL.g0)), .62);
    }
    for (const s0 of [tA, tC]) scraps(g, C, t, s0, FX, s0 === tA ? XY - 132 : XY + 72, 6, [COL.red, COL.near, COL.far], { size: 5, spread: 60, up: 60, life: 1.4, seed: s0 });
    // light: the fire, the paper lit from behind, its pattern thrown on the ground
    const amb = Math.round(lerp(128, 34, dim)), I = clamp((t - tFl) * 1.1) * (1 - .1 * dim) * (.88 + .12 * pulse * (1 - dim)), cR = ap(C, [FX + HD, XY]), cL = ap(C, [FX - HD, XY]), c0 = ap(C, [FX, XY]);
    lightPass(g, `rgb(${amb},${amb},${Math.round(amb * 1.38)})`, () => { firePool(C, FX, FY, FS, t, fl);
      if (I > 0) { const hp = { c: holesOf(pX), x0: pX.x0, y0: pX.y0, w: pX.w, h: pX.h }, k = z * XS * 1.5, b = ap(C, [FX + HD, 985]); lightImage(hp, [-k, 0, .35 * k, .34 * k, b[0], b[1]], I * (.35 + .45 * dim), 'rgb(255,190,130)', 3); pool(b[0], b[1] - 40 * z, 420 * z, 'rgba(255,196,130,1)', .55 * dim); } });
    if (I > 0) {
      if (!halfGone) { emitGlow(c0[0], c0[1], 560 * XS * z, I * .8, 1.06); emitPiece(pX, ML, '#c9241a'); }
      else emitGlow(cR[0], cR[1], 430 * XS * z, I * .86, 1.06);
      emitPiece(pX, MR, '#c9241a');
    }
    fireEmit(C, FX, FY, FS, t, fl, 7, Math.round(40 * (1 - dim * .7)));
    if (leftVis && halfGone && t > tBurn - .2) { const p = ap(ML, [0, 0]); emitGlow(p[0], p[1], 260 * z, .8 * (1 - seg(t, tBurn, tBurn + 1.6))); }
    ages(emitCtx(), { shadow: 0, filter: 'brightness(.2)' });
    for (const s0 of [tFl, ...syl, tBurn, ...[0, 1, 2, 3, 4, 5, 6, 7].map(k => tFeed(k) + .75)]) { const d = t - s0; if (d >= 0 && d < 1.6) for (let k = 0; k < 18; k++) { const a = -Math.PI * (.12 + .76 * hash(k * 3.1 + s0)), sp = 280 + 460 * hash(k * 1.7 + s0), p = ap(C, [FX + Math.cos(a) * sp * d, FY - 120 * FS + Math.sin(a) * sp * d + 260 * d * d]); emitDot(p[0], p[1], 5 * (1 - d / 1.6) + 1.5, 1 - d / 1.6, '255,190,110'); } }
    // sparks drift up and stay: the scraps become stars
    if (t > O[0] - 1) for (let k = 0; k < 70; k++) { const born = O[0] - 1 + hash(k * 2.7) * 14, d = t - born; if (d < 0) continue; const x = FX + (hash(k * 5.1) - .5) * 1700, yEnd = 60 + hash(k * 7.3) * 520, y = lerp(FY - 100, yEnd, 1 - Math.exp(-d * .5)), p = ap(cam(960 + (cu[0] - 960) * .6, 540 + (cu[1] - 540) * .6, 1 + (z - 1) * .6), [x + Math.sin(d + k) * 12, y]); emitDot(p[0], p[1], 1.6 + hash(k) * 1.8, .55 + .4 * hash(k + Math.floor(t * 3)), k % 3 ? '255,206,150' : '255,236,200'); }
    emitEnd(g, 1, .8);
    if (I > .2 && !halfGone) rays(g, c0[0], c0[1], .16 * I, 14, 1.9);
    if (halfGone) rays(g, cR[0], cR[1], .2 * (I - .2), 14, 1.9);
  }
  return [{ id: 'finale', t0, draw, tr: { type: 'slide', d: .22, dir: [1, 0] } }];
}
