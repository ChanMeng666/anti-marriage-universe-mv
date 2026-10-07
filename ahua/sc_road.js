// Verse 2, pre-chorus 2 and the bridge: the haircut, the pie, the road, four window panes; then one long walk to sixty-eight, the house, the fence, the sisters.
import { W, H, COL, DEG, TAU, put, at, mul, T, R, S, ap, cam, ground, step, seg, eio, eo, ei, lerp, clamp, hash, scraps, pop, arrive, keys, hitShake, foldPut, foldTh, scaleOf } from './engine.js';
import { drawFig, POSE, HUA28, HUA28B, HUA, HUA40, HUA55, HUA68, FA, SIS, walk } from './figure.js';
import { table, tableTop, pie, priceTag, bundle, hairLock, flowerPin, rougeDot, house, clock, fence, orb, tree, paneFrame, paneBack, book, barbell, boat, waves, laptop, codeFlower, desk, stool, drawScissors, snipOpen, sun, apron } from './props.js';
import { nightLand, dayLand, floor, layer, lightPass, pool, emitGlow, emitPiece, emitEnd, sparks } from './sets.js';
import { AMB, firePaper, firePool, fireEmit } from './sc_chorus.js';
import { say } from './film.js';

const held = (Ms, C, rot = 0, s = 1, sx = 1) => { const h = ap(Ms, [0, 0]), k = scaleOf(C); return mul(mul([k, 0, 0, k, h[0], h[1]], R(rot)), S(s * sx, s)); };

export function shots(TL) {
  const G = TL.G, cut = TL.cut, out = [];
  const add = (id, t0, draw, tr) => out.push({ id, t0, draw, tr });
  const FB = [470, 762, 1.15];       // the fire basin in the yard

  // V2.0 阿发吓坏了看阿花 — he peeks over the fallen table
  const tv0 = cut('V2.0');
  add('v2.0', tv0, (g, t) => {
    const st = step(t), u = seg(t, tv0, tv0 + 3), C = cam(lerp(1120, 1180, eio(u)), 650, lerp(1.45, 1.6, eio(u)));
    nightLand(g, 1100, 650, 1.45, t, { moonX: 1700 }); floor(g, C, 900, COL.n2, -900);
    firePaper(g, C, ...FB, t, 1.1);
    drawFig(g, C, HUA28, { ...POSE.stand, x: 800, y: 900, expr: 'cold', aN: [-14, 100], aF: [-22, 104], lean: -4 });
    const sh = (hash(Math.floor(st * 12)) - .5) * 9, up = keys(st, [[tv0, 170], [tv0 + .55, 0], [tv0 + 1.5, 0], [tv0 + 1.62, 170], [tv0 + 2.2, 170], [tv0 + 2.35, 0]], .12);
    g.save(); g.setTransform(...C); g.beginPath(); g.rect(-4000, -4000, 9000, 4900); g.clip();      // he ducks behind the table top, not through the floor
    drawFig(g, C, FA, { ...POSE.cower, x: 1470 + sh, y: 900 + up, dir: -1, expr: 'scared', tieCut: true, headS: 1.15, lean: 12, bob: 80, head: -6, aN: [150, 60], aF: [146, 64] }, { mid: Ms => put(g, apron(), mul(mul(Ms.torso, T(10, -52)), S(.5)), { shadow: .6 }) });
    g.restore();
    put(g, tableTop(), at(C, 1420, 900 - 190, 1.07, .3 + (up < 20 ? Math.sin(st * 40) * .01 : 0)), { shadow: 1.6 });
    lightPass(g, AMB, () => firePool(C, ...FB, t, 1.1)); fireEmit(C, ...FB, t, 1.1, 5, 26); emitEnd(g, 1, .8);
  }, { type: 'slide', d: .25, dir: [1, 0] });

  // V2.1 她剪掉长发洗去了妆容啊 — cut, peel: the medium's own verbs
  const tv1 = cut('V2.1'), tSnip = TL.hit('hair.snip', G(223)), tRouge = TL.hit('rouge.peel', G(225)), tPin = TL.hit('pin.drop', G(227));
  add('v2.1', tv1, (g, t) => {
    const st = step(t), sk = hitShake(t, [tSnip], 6), u = seg(t, tv1, tv1 + 3.4), C = cam(960 + sk[0], 540 + sk[1], lerp(1, 1.08, u));
    nightLand(g, 900, 540, 1, t, { moonX: 1640 });
    const Sx = 3.6, r = drawFig(g, C, st < tSnip ? HUA28 : HUA28B, { ...POSE.stand, x: 1004, y: 1900, s: Sx, noRouge: true, expr: st < tSnip ? 'cold' : st < tPin ? 'sleep' : 'firm', head: st < tPin ? 2 : -6 }, { K: 7, shadow: 1.6 });
    const hm = r.head, dl = Math.max(0, t - tSnip), dr = Math.max(0, t - tRouge), dp = Math.max(0, t - tPin);
    // the long hair, until the scissors take it
    const lockM = mul(mul(hm, T(-8 - dl * 40, 26 + 80 * dl + 420 * dl * dl)), mul(R(-dl * 1.3 + Math.sin(dl * 9) * .12), S(1.0)));
    if (st >= tSnip && dl < 1.6) put(g, hairLock(), lockM, { shadow: 1.4 });
    if (st >= tSnip && dp < 1.4) put(g, flowerPin(), mul(mul(hm, T(-24 + dp * 30, -100 + 60 * dp + 500 * dp * dp)), mul(R(dp * 5), S(1.05))), { shadow: 1 });
    if (dr < 1.2) put(g, rougeDot(), mul(mul(hm, T(24 + dr * 26, -36 + 30 * dr + 320 * dr * dr)), mul(R(dr * 3), S(Math.cos(Math.min(dr * 6, Math.PI / 2 * .96)), 1))), { shadow: .6 + dr * 3 });
    if (t < tSnip + .7) { const p = ap(hm, [-30, 24]), a = eo(seg(t, tv1 + .05, tSnip - .12)), o2 = ei(seg(t, tSnip + .2, tSnip + .7)); drawScissors(g, [1, 0, 0, 1, 0, 0], lerp(-200, p[0] - 60, a) - o2 * 900, p[1] + 30 - o2 * 200, -.12, st < tSnip ? snipOpen(t, TL.per / 2, TL.g0) * .6 + .4 : 0, 2.1); }
    scraps(g, C, t, tSnip, 760, 600, 12, [COL.red, COL.near, COL.far], { size: 12, spread: 260, up: 160, life: 1.7 });
    lightPass(g, 'rgb(120,120,170)', () => { const f = .85 + .15 * hash(Math.floor(t * 12)); pool(1500, 860, 1300, 'rgba(255,188,122,1)', f); });
    emitGlow(1960, 1180, 600, .6); sparks([1, 0, 0, 1, 0, 0], 1700, 1100, t, 40, { rise: 1100, spread: 700, life: 3.4, size: 1.6 }); emitEnd(g, 1, .8);
  }, { type: 'slide', d: .22, dir: [-1, 0] });

  // V2.2 一生一世这画饼太廉价 — the pie in the sky, with its price tag
  const tv2 = cut('V2.2'), tPie = G(230), tTag = G(232), tFlk = TL.hit('tag.flick', G(234)), tPoke = TL.hit('pie.poke', G(237));
  add('v2.2', tv2, (g, t) => {
    const st = step(t), sk = hitShake(t, [tPoke], 5), C = cam(1000 + sk[0], 640 + sk[1], lerp(1.5, 1.6, seg(t, tv2, tv2 + 4)));
    nightLand(g, 1000, 640, 1.5, t, { moonX: 1750 }); floor(g, C, 900, COL.n2, -900);
    firePaper(g, C, ...FB, t, 1.1);
    drawFig(g, C, HUA28B, keys(st, [[tv2, { ...POSE.stand, x: 800, y: 900, expr: 'cold', aN: [-14, 100], aF: [-22, 104], lean: -4 }], [tFlk - .12, { ...POSE.stand, x: 800, y: 900, expr: 'smirk', aN: [40, 120] }], [tFlk, { ...POSE.stand, x: 810, y: 900, expr: 'smirk', aN: [86, 10], lean: 6 }], [tPoke - .2, { ...POSE.stand, x: 810, y: 900, expr: 'cold', aN: [40, 120] }], [tPoke, { ...POSE.point, x: 830, y: 900, expr: 'firm', aN: [100, 0], lean: 10 }], [tPoke + .5, { ...POSE.stand, x: 810, y: 900, expr: 'smirk', aN: [-14, 100], aF: [-22, 104], lean: -4 }]], .12));
    const gone = st >= tPoke, r = drawFig(g, C, FA, keys(st, [[tv2, { ...POSE.cower, x: 1300, y: 900, dir: -1, expr: 'scared', tieCut: true, headS: 1.15 }], [tPie, { ...POSE.stand, x: 1240, y: 900, dir: -1, bob: 70, lean: 8, lN: [80, 150], lF: [10, 96], aN: [76, 20], aF: [70, 24], expr: 'blab', tieCut: true, headS: 1.15, head: -8 }], [tPoke, { ...POSE.stand, x: 1240, y: 900, dir: -1, bob: 70, lean: 8, lN: [80, 150], lF: [10, 96], aN: [76, 20], aF: [70, 24], expr: 'smug', tieCut: true, headS: 1.15, head: -8 }], [tPoke + .15, { ...POSE.stand, x: 1250, y: 900, dir: -1, bob: 80, lean: -10, lN: [80, 150], lF: [10, 96], aN: [30, 100], aF: [24, 104], expr: 'scared', tieCut: true, headS: 1.15, head: 10 }]], .14));
    if (st >= tPie - .1) {
      const d = Math.max(0, t - tPoke), h = ap(r.handN, [0, 0]), M0 = mul([C[0], 0, 0, C[0], h[0], h[1]], R(.05 + (gone ? d * 2.2 : 0)));
      const pm = mul(M0, mul(T(0, -250 + (gone ? 700 * d * d : 0)), S(.95 * (arrive(st, tPie - .1) || 1) * (gone ? Math.cos(Math.min(d * 9, 20)) * .5 + .5 : 1), .95 * (arrive(st, tPie - .1) || 1))));
      put(g, pie(), pm, { shadow: 1.5 });
      if (st >= tTag && !gone) { const sw = st >= tFlk ? Math.sin((t - tFlk) * 11) * Math.exp(-(t - tFlk) * 2.2) * .9 : 0; put(g, priceTag('廉价'), mul(mul(pm, T(60, 96)), mul(R(.5 + sw), mul(S(1.25 * pop(st, tTag, 1.2)), T(46, 0)))), { shadow: 1 }); }
      if (!gone) { const a = ap(pm, [-90, -60]), b = ap(pm, [90, 60]); say('pie', '一生一世', a[0], a[1], b[0], b[1]); if (st >= tTag) { const c = ap(pm, [70, 60]); say('cheap', '廉价', c[0] - 40, c[1] - 20, c[0] + 150, c[1] + 130); } }
    }
    lightPass(g, AMB, () => firePool(C, ...FB, t, 1.1)); fireEmit(C, ...FB, t, 1.1, 5, 26); emitEnd(g, 1, .8);
  }, { type: 'slide', d: .22, dir: [1, 0] });

  // V2.3 独行出发吧 — she shoulders the bundle and walks out of the night
  const tv3 = cut('V2.3'), tBun = G(240), tGo = G(241), tDay = G(246);
  add('v2.3', tv3, (g, t) => {
    const st = step(t), x = 810 + Math.max(0, st - tGo) * 250, cx = lerp(1000, x + 150, eio(seg(t, tGo, tGo + 1.2))), C = cam(cx, 640, 1.5);
    nightLand(g, cx, 640, 1.5, t, { moonX: 1750 }); floor(g, C, 900, COL.n2, -900);
    firePaper(g, C, ...FB, t, 1.1);
    drawFig(g, C, FA, { ...POSE.stand, bob: 80, lN: [80, 150], lF: [10, 96], x: 1250, y: 900, dir: st > tGo + .6 ? 1 : -1, expr: 'scared', tieCut: true, headS: 1.15, lean: -6, aN: st > tGo + .8 && Math.floor(st * 3) % 2 ? [150, 30] : [130, 60], aF: [20, 60] });
    const P = st < tGo ? keys(st, [[tv3, { ...POSE.stand, x: 810, y: 900, expr: 'smirk', aN: [-14, 100], aF: [-22, 104] }], [tBun, { ...POSE.stand, x: 810, y: 900, expr: 'firm', aN: [-20, 150], aF: [-8, 10] }]], .14) : { ...walk((st - tGo) * 1.9), x, y: 900, expr: 'serene', aN: [-20, 150] };
    const r = drawFig(g, C, HUA28B, P);
    if (st >= tBun - .1) put(g, bundle(), held(r.handN, C, -.25, arrive(st, tBun - .1) || 1), { shadow: 1 });
    lightPass(g, AMB, () => firePool(C, ...FB, t, 1.1)); fireEmit(C, ...FB, t, 1.1, 5, 26); emitEnd(g, 1, .8);
  }, { type: 'slide', d: .22, dir: [-1, 0] });

  // road (to P2.1): 后来故事发展更潇洒 / 再也没有谁能等着阿花回家 — one lateral track
  const tSpin = TL.hit('spin', G(258)), tWave = TL.hit('wave', G(267)), HX = 2900;
  const roadSet = (g, cx, cy, z, t, o = {}) => { dayLand(g, cx, cy, z, t); put(g, orb(COL.pale, 86, 12, 3), at(layer(cx, cy, z, .12), o.sunX ?? 1480, 230, 1, t * .04), { shadow: .5 }); const C = cam(cx, cy, z), f0 = Math.floor((cx - 1700) / 3400) * 3400; floor(g, C, 900, COL.pale2, f0); floor(g, C, 900, COL.pale2, f0 + 3400); };
  add('road', tDay, (g, t) => {
    const st = step(t), x = 700 + (t - tDay) * 240, cx = x + 170, C = cam(cx, 640, 1.3);
    roadSet(g, cx, 640, 1.3, t);
    put(g, house(COL.deep), at(C, HX, 900, 1.1), { shadow: 1.2 }); put(g, clock(), at(C, HX + 30, 660, 1.1), { shadow: .6 });
    const sp = st >= tSpin && st < tSpin + TL.per * 2, k = Math.floor((st - tSpin) / (TL.per / 2));
    const late = st >= cut('P2.1') - .1;
    const P = { ...walk((t - tDay) * 1.75), x, y: 900, expr: sp ? 'sing' : 'serene', dir: sp && k % 2 ? -1 : 1, ...(late ? { aN: [150, 130], aF: st >= tWave ? [-140, Math.floor(st * 6) % 2 ? -30 : 10] : [150, 126], head: -6 } : sp ? { aN: [150, 10], aF: [140, 14], bob: -14 } : { aN: [-20, 150] }) };
    const r = drawFig(g, C, HUA, P);
    if (!late) { const up = sp ? Math.sin(seg(t, tSpin, tSpin + TL.per * 2) * Math.PI) : 0; put(g, bundle(), mul(held(r.handN, C, -.25 - up * 6.283), T(0, -up * 230)), { shadow: 1 }); }
    for (let k2 = 0; k2 < 4; k2++) scraps(g, C, t, tDay + k2 * 2.2, x - 500 + k2 * 60, 360, 6, [COL.pale2, COL.pale, COL.pale3], { size: 7, spread: 380, up: 40, grav: 44, vx: 330, life: 4, float: 1, seed: k2 });
  }, { type: 'peel', d: .9, back: COL.cream2 });

  // panes: 一个人读书健身闯荡天下 / 搞搞事业也会研究研究代码 (Coding my life) — a list reads best as window panes
  const tp = cut('P2.2'), tP = [tp - 1, G(271), G(273), G(276)], tPush = G(277), PX = [252, 724, 1196, 1668], PY = 480, PS = 1.38;
  tP.forEach((x, i) => i && TL.hit('pane' + i, x));
  add('panes', tp, (g, t) => {
    const st = step(t), u = eio(seg(t, tPush, tPush + 1.3)), C = cam(lerp(960, PX[3] - 30, u), lerp(540, PY + 20, u), lerp(1, 2.25, u)), bt = Math.floor((st - TL.g0) / TL.per) % 2;
    ground(g, 'rice', layer(960, 540, C[0], .3), 'rgba(238,224,192,.4)'); floor(g, C, 870, COL.pale3, -900);
    PX.forEach((x, i) => {
      const a = arrive(st, tP[i]);      // the four frames hang there from the cut; each picture is pasted in on its beat
      const M = at(C, x, PY, PS), Ci = mul(M, S(a || 1));
      put(g, paneBack(i === 3 ? COL.cream2 : COL.cream), M, { shadow: 1.2 });
      if (!a) { put(g, paneFrame(), M, { shadow: 1.4 }); return; }
      g.save(); g.setTransform(...M); g.beginPath(); g.rect(-158, -158, 316, 316); g.clip();
      const F = (pose, s = .6) => drawFig(g, Ci, HUA, { x: 0, y: 150, s, ...pose }, { shadow: .6 });
      if (i === 0) { put(g, stool(), mul(Ci, T(-40, 86)), { shadow: .5 }); const r = F({ ...POSE.sit, x: -40, aN: [50, 96], aF: [44, 100], head: 10 + (bt ? 3 : 0), expr: 'serene' }); put(g, book(), mul(mul(Ci, T(24, 40 + (bt ? -3 : 0))), mul(R(-.5), S(.9))), { shadow: .5 }); put(g, orb(COL.pale2, 30, 8, 4), mul(Ci, T(96, -100)), { shadow: .3 }); }
      if (i === 1) { const upp = bt, r = F(upp ? { ...POSE.stand, x: -6, aN: [170, 6], aF: [172, 4], expr: 'sing' } : { ...POSE.stand, x: -6, bob: 44, lN: [50, 80], lF: [40, 76], aN: [150, 150], aF: [148, 152], expr: 'firm' }); const h = ap(r.handN, [0, 0]), k = scaleOf(M); put(g, barbell(), [k * .8, 0, 0, k * .8, h[0] + 4 * k, h[1]], { shadow: .6 }); }
      if (i === 2) { const rock = Math.sin(t * 2.4) * .06, B = mul(mul(Ci, T(0, 120)), R(rock)); put(g, waves(400, COL.pale2), mul(Ci, T(-200 - (t * 30 % 40), 150)), { shadow: .3 }); drawFig(g, B, HUA, { ...POSE.point, x: 40, y: -2, s: .5, expr: 'sing', aN: [96, 0] }, { shadow: .5 }); put(g, boat(), mul(B, S(.92)), { shadow: .6 }); put(g, waves(400, COL.pale), mul(Ci, T(-240 + (t * 46 % 40), 172)), { shadow: .4 }); }
      if (i === 3) { put(g, stool(), mul(Ci, T(-78, 86)), { shadow: .5 }); const ty = Math.floor(st * 8) % 2; F({ ...POSE.sit, x: -78, aN: [52, ty ? 80 : 66], aF: [46, ty ? 64 : 82], head: 4, expr: st > tPush + 2.6 ? 'smirk' : 'firm' });
        put(g, desk(), mul(Ci, mul(T(54, 40), S(.86))), { shadow: .5 }); put(g, laptop(), mul(Ci, mul(T(66, 32), S(.86))), { shadow: .5 });
        const sm = mul(Ci, mul(T(66 + 6, 32 - 55), S(.84))), cf = codeFlower(); g.setTransform(...sm); g.fillStyle = '#ffe9b8'; g.fillRect(-64, -43, 128, 86); put(g, cf, sm, { shadow: 0 }); }
      g.restore();
      put(g, paneFrame(), M, { shadow: 1.4 });
    });
  }, { type: 'slide', d: .25, dir: [0, -1] });

  // ---------- bridge ----------
  // B0: one continuous walk; every trunk that wipes her takes some years with it. 阿花今年六十八.
  const tb0 = G(357), tStop = TL.hit('stop68', G(374)), TRX = [1020, 1470, 1920], V = 250, X0 = 640;
  const wx = t => t < tStop - .8 ? X0 + (t - tb0) * V : X0 + (tStop - .8 - tb0) * V + V * .8 * (1 - Math.pow(1 - seg(t, tStop - .8, tStop), 2)) * .5;
  const XS = wx(tStop + 1), FX = XS + 700;      // where she stops; where the house / fence stand
  const ages = [HUA, HUA40, HUA55, HUA68];
  function roadB(g, cx, cy, z, t) { roadSet(g, cx, cy, z, t, { sunX: 400 });
    [[COL.pale, 10, 1], [COL.pale2, 16, 2], [COL.pale, 24, 3], [COL.cream2, 6, 4]].forEach(([c, n, s], k) => put(g, orb(c, 66, n, s + 10), at(layer(cx, cy, z, .32), 900 + k * 520, 250 + (k % 2) * 40, 1, t * .1 * (k % 2 ? 1 : -1)), { shadow: .5 })); }
  add('b0', tb0, (g, t) => {
    const st = step(t), x = wx(t), stopped = st >= tStop, zu = eio(seg(t, tStop - .5, tStop + 1.2)), z = lerp(1.3, 1.55, zu), C = cam(x + lerp(170, 60, zu), lerp(640, 660, zu), z);
    roadB(g, x + 170, 640, z, t);
    const age = TRX.filter(tx => x > tx).length;
    const P = stopped ? keys(st, [[tStop, { ...POSE.stand, x, y: 900, expr: 'serene' }], [tStop + .12, { ...POSE.stand, x, y: 900, expr: 'serene', bob: -8, aN: [-14, 100], aF: [-22, 104] }], [tStop + .5, { ...POSE.stand, x, y: 900, expr: 'smirk', aN: [-14, 100], aF: [-22, 104], lean: -4 }]], .1) : { ...walk((x - X0) / 150, 1 - age * .06), x, y: 900, expr: 'serene' };
    drawFig(g, C, ages[age], P);
    TRX.forEach((tx, k) => put(g, tree(COL.deep, k + 1), at(C, tx, 930, 1.25), { shadow: 2 }));
    for (let k2 = 0; k2 < 4; k2++) scraps(g, C, t, tb0 + k2 * 2, x - 400, 330, 6, [[COL.pale2, COL.pale][k2 % 2], COL.pale3, COL.cream2], { size: 7, spread: 380, up: 40, grav: 44, vx: 300, life: 4, float: 1, seed: k2 + 9 });
  }, { type: 'peel', d: .85, back: COL.n3 });

  // B1: 她早已不再需要家 — the house folds flat; then the fold opens sideways into a fence
  const tb1 = cut('BR.1'), tFold = TL.hit('house.fold', G(381)), tSq = G(382) + .2, tUn = G(384), tb2 = cut('BR.2'), tb3 = cut('BR.3');
  const NP = 9, panelX = k => FX - 48 + (k < 0 ? k * 236 : k * 236), unAt = j => TL.hit('fence' + j, tUn + j * TL.per / 2);   // j = order of unfolding
  const ORDER = [0, -1, 1, -2, 2, -3, 3, -4, 4];
  const tSn = [389, 390, 391, 392].map(G), tGate = TL.hit('gate', G(393)); tSn.forEach((x, i) => TL.hit('fence.snip' + i, x));
  const tSis = k => G(395 + k), tSun = TL.hit('sun', G(399)), tDown = G(402), tGather = G(405);
  ORDER.forEach((k, j) => unAt(j));
  function fenceDraw(g, C, t, o = {}) {
    ORDER.forEach((k, j) => { const t0 = tUn + j * TL.per / 2; if (t < t0) return; const th = foldTh(t, t0, .3, true), gate = k === 0;
      let flat = o.down ? eo(seg(t, tDown + Math.abs(k) * TL.per / 4, tDown + Math.abs(k) * TL.per / 4 + .3)) : 0;
      if (gate && t >= tGate) flat = Math.max(flat, eo(seg(t, tGate, tGate + .3)));
      const M = mul(at(C, panelX(k) + (k < 0 ? 236 : 0), 902, 1, 0, k < 0 ? -1 : 1), S(1, 1 - .94 * flat));
      if (th > .01) foldPut(g, fence(240), M, 6, 1, th, { back: '#b5524c', shadow: 1.2 }); else put(g, fence(240), M, { shadow: 1.2 }); });
  }
  add('b1', tb1, (g, t) => {
    const st = step(t), u = eio(seg(t, tUn - .2, tb2)), sk = hitShake(t, [tFold + .3, tSq + .2], 6), z = lerp(1.45, 1.12, u), C = cam(lerp(XS + 330, FX + 60, u) + sk[0], lerp(650, 630, u) + sk[1], z);
    roadB(g, lerp(XS + 330, FX + 60, u), 640, z, t);
    const th = foldTh(t, tFold, .34), sq = eo(seg(t, tSq, tSq + .3));
    if (t < tUn) foldPut(g, house(COL.deep), mul(at(C, FX, 900, 1.6), mul(T(-150 * sq, 0), S(1 - .7 * sq, 1))), 0, 1, th, { back: '#b5524c', shadow: 1.4 });
    else { fenceDraw(g, C, t); }
    drawFig(g, C, HUA68, keys(st, [[tb1, { ...POSE.stand, x: XS, y: 900, expr: 'smirk', aN: [-14, 100], aF: [-22, 104], lean: -4 }], [tb1 + .25, { ...walk(.25), x: XS + 60, y: 900, expr: 'serene' }], [tFold - .5, { ...walk(.75), x: FX - 400, y: 900, expr: 'serene' }], [tFold - .14, { ...POSE.stand, x: FX - 370, y: 900, expr: 'firm', aN: [-20, 60], lean: -6 }], [tFold, { ...POSE.push, x: FX - 340, y: 900, expr: 'firm', lean: 10, aN: [90, 4], aF: [-20, 30] }], [tSq, { ...POSE.push, x: FX - 300, y: 900, expr: 'firm', lean: 10, aN: [90, 4], aF: [-20, 30] }], [tSq + .4, { ...POSE.stand, x: FX - 260, y: 900, expr: 'smirk', aN: [-14, 100], aF: [-22, 104], lean: -4 }], [tUn + .2, { ...POSE.stand, x: FX - 260, y: 900, expr: 'wide', lean: -10, aN: [60, 90], aF: [50, 94] }]], .2));
    for (const tt of [tFold + .3, tSq + .2]) scraps(g, C, t, tt, FX, 760, 6, [COL.deep, COL.deep2, COL.pale], { size: 9, spread: 300, up: 220, life: 1.3, seed: tt });
  }, { type: 'slide', d: .22, dir: [1, 0] });

  // B2: 那是父权编织的篱笆 — the scissors go through it
  add('b2', tb2, (g, t) => {
    const st = step(t), sk = hitShake(t, [tGate + .28], 10), C = cam(FX + 60 + sk[0], 690 + sk[1], lerp(1.5, 1.62, seg(t, tb2, tb3)));
    roadB(g, FX + 60, 640, 1.2, t);
    fenceDraw(g, C, t);
    const n = tSn.filter(x => st >= x).length, side = n < 2 ? 0 : 1, ex = panelX(0) + (side ? 236 : 4), yy = n === 0 ? 880 : n === 1 ? 800 : n === 2 ? 880 : n === 3 ? 800 : 700;
    const tipY = st >= tGate ? 690 : lerp(yy, yy - 80, seg(t, tSn[Math.min(3, n)] - .3, tSn[Math.min(3, n)]));
    const hx = ex - 190;
    const r = drawFig(g, C, HUA68, keys(st, [[tb2, { ...POSE.stand, x: panelX(0) - 186, y: 900, expr: 'firm', aN: [70, 20] }], [tSn[1] + .1, { ...POSE.stand, x: panelX(0) - 186, y: 900, expr: 'firm', aN: [82, 10] }], [tSn[2] - .1, { ...walk(.3), x: panelX(0) + 50, y: 900, expr: 'firm', aN: [82, 10] }], [tGate, { ...POSE.stand, x: panelX(0) + 50, y: 900, expr: 'sing', aN: [100, 8] }], [tGate + .3, { ...POSE.sword, x: panelX(0) + 50, y: 900, expr: 'sing' }]], .16));
    const h = ap(r.handN, [0, 0]), up = st >= tGate + .3;
    drawScissors(g, [1, 0, 0, 1, 0, 0], h[0] + (up ? 10 : 110) * C[0], h[1] - (up ? 120 : 30) * C[0], up ? -1.4 : -.5, st >= tGate ? .8 : snipOpen(t, TL.per, TL.g0), C[0] * .8);
    for (const s0 of tSn) scraps(g, C, t, s0, panelX(0) + (tSn.indexOf(s0) < 2 ? 4 : 236), 800, 5, [COL.deep, COL.deep2], { size: 9, spread: 140, up: 200, life: 1.2, seed: s0 });
    // the cut lines
    g.save(); g.setTransform(...C); g.strokeStyle = 'rgba(40,6,10,.7)'; g.lineWidth = 3;
    [0, 1].forEach(sd => { const done = clamp(n - sd * 2, 0, 2) / 2; if (done > 0 && st < tGate) { g.beginPath(); g.moveTo(panelX(0) + (sd ? 236 : 4), 900); g.lineTo(panelX(0) + (sd ? 236 : 4), 900 - 226 * done); g.stroke(); } }); g.restore();
  }, { type: 'slide', d: .2, dir: [-1, 0] });

  // B3: 她和姐妹在此刻 拥有了天下 — the sisters come through the gap; the gold-foil sun; the fence lies down
  const rowX = k => FX + 70 + (k - 3.5) * 132;
  add('b3', tb3, (g, t) => {
    const st = step(t), u = seg(t, tb3, tGather), z = lerp(1.12, 1.22, eio(u)), cy = lerp(650, 630, u), cx = FX + 70, C = cam(cx, cy, z), gat = eio(seg(t, tGather, tGather + .7));
    roadB(g, cx, cy, z, t);
    const sy = lerp(1080, 400, eo(seg(t, tSun, tSun + 1.9)));
    if (t > tSun) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(244,196,96,${.16 * seg(t, tSun, tSun + 1.9)})`; g.fillRect(0, 0, W, H); g.restore(); put(g, sun(), at(C, FX + 70, sy, 1.6, t * .08), { shadow: 1 }); }
    fenceDraw(g, C, t, { down: true });
    const order = [3, 4, 2, 5, 1, 6, 0, 7];
    order.forEach((k, j) => {
      const isH = k === 3, t0 = isH ? tb3 - 9 : tSis(j - 1), a = isH ? 1 : arrive(st, t0); if (!a) return;
      const mv = isH ? 1 : eo(seg(st, t0, t0 + .5)), x0 = isH ? panelX(0) + 50 : panelX(0) + 120, xr = lerp(lerp(x0, rowX(k), mv), FX + 70, gat * .96), F = isH ? HUA68 : SIS[(k + 4) % 7], dir = k < 4 ? 1 : -1, ph = Math.floor((st - TL.g0) / TL.per) % 2;
      const P = !isH && mv < 1 ? { ...walk((st - t0) * 3), x: xr, y: 900, s: lerp(.74, .9, mv) * a, dir: rowX(k) < x0 ? -1 : 1, expr: 'serene' } : { ...POSE.stand, x: xr, y: 900, s: .9, dir, expr: st >= tSun ? 'sing' : 'serene', head: st >= tSun ? -10 : 0, aN: st >= tSun + .3 && st < tGather ? [150, 10] : [8, 10], aF: st >= tSun + .5 && st < tGather ? [-150, -10] : [-8, 10], bob: st < tGather && (ph ^ (k % 2)) ? -5 : 0 };
      if (isH && st < tb3 + .5) Object.assign(P, POSE.sword, { expr: 'sing' });
      drawFig(g, C, F, P);
    });
    scraps(g, C, t, tSun + .4, FX + 80, 380, 16, [COL.gold, COL.red, COL.pale], { size: 9, spread: 900, up: 240, grav: 120, life: 3.2, float: 1, seed: 6 });
  }, { type: 'slide', d: .22, dir: [1, 0] });
  return out;
}
