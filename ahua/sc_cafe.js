// Verse 1 and pre-chorus 1 (17.6 – 63.7 s): the blind date, one gag per sung line; the tower; the script into the fire basin.
import { W, H, COL, DEG, put, at, mul, T, R, S, ap, cam, ground, step, seg, eio, eo, ei, lerp, clamp, hash, scraps, pop, arrive, keys, hitShake, scaleOf, back } from './engine.js';
import { drawFig, POSE, HUA28, FA, walk, tieEnd } from './figure.js';
import { table, chair, cup, carKey, mask, blabScrap, abacus, apron, priceTag, tier, towerCap, script, paperMan, basin, drawFlames, drawScissors, snipOpen, ridge } from './props.js';
import { cafe, floor, layer } from './sets.js';
import { say } from './film.js';

const sitH = o => ({ ...POSE.sit, x: 770, y: 896, dir: 1, expr: 'cold', ...o });
const sitF = o => ({ ...POSE.sit, x: 1150, y: 896, dir: -1, expr: 'smug', headS: 1, ...o });
const TABLE = [960, 610];
// prop held at a hand: screen-space matrix at the palm, upright (ignores the arm's rotation)
const held = (Ms, C, rot = 0, s = 1, sx = 1) => { const h = ap(Ms, [0, 0]), k = scaleOf(C); return mul(mul([k, 0, 0, k, h[0], h[1]], R(rot)), S(s * sx, s)); };
// world position of a screen point under C (uniform scale + translate cameras only where used)
const wearApron = g => Ms => put(g, apron(), mul(mul(Ms.torso, T(10, -52)), S(.5)), { shadow: .6 });

export function shots(TL) {
  const G = TL.G, cut = TL.cut, out = [];
  const add = (id, t0, draw, tr) => out.push({ id, t0, draw, tr });
  // chairs, both figures, table, things on the table
  function setDate(g, C, t, hua, fa, o = {}) {
    cafe(g, C, t);
    put(g, chair(), at(C, 760, 796), {}); put(g, chair(), at(C, 1160, 796, 1, 0, -1), {});
    let Mh, Mf;
    if (hua) Mh = drawFig(g, C, HUA28, hua, { mid: o.midH });
    if (fa) Mf = drawFig(g, C, FA, fa, { mid: o.midF });
    const tm = o.tableM || at(C, ...TABLE);
    put(g, table(), tm, {});
    const jump = o.jump || 0;
    if (!o.noCupA) put(g, cup(), mul(tm, T(-80 + (o.slide || 0), -14 - jump)), { shadow: .7 });
    put(g, cup(), mul(tm, mul(T(84 + (o.slide || 0) * 1.3, -14 - jump * .8), S(-1, 1))), { shadow: .7 });
    if (o.key) put(g, carKey(), mul(tm, mul(T(14 + (o.slide || 0) * 1.6, -24 - jump * 1.2), R(.1))), { shadow: .7 });
    return { Mh, Mf, tm };
  }

  // S4 阿花今年二十八 — meet her: alone at the table, a slow push
  const t4 = cut('V1.0');
  add('v1.0', t4, (g, t) => {
    const st = step(t), u = seg(t, t4, t4 + 3.6), C = cam(lerp(900, 830, eio(u)), 612, lerp(1.4, 1.62, eio(u)));
    const tUp = TL.hit('sip', G(33)), P = keys(st, [[t4, sitH({})], [tUp, sitH({ aN: [64, 128], head: -6 })], [tUp + 1.0, sitH({ aN: [64, 128], head: -6 })], [tUp + 1.5, sitH({})]], .3);
    const lifted = st > tUp - .3 && st < tUp + 1.5;
    const r = setDate(g, C, t, P, null, { noCupA: lifted });
    if (lifted) put(g, cup(), held(r.Mh.handN, C, -.25), { shadow: .7 });
  }, { type: 'turn', d: .7, back: COL.cream2 });

  // S5 早已看透父权虚假 — the patriarch's mask: turn it sideways and it is nothing but a sheet of paper
  const t5 = cut('V1.1');
  add('v1.1', t5, (g, t) => {
    const st = step(t), C = cam(880, 548, lerp(1.56, 1.68, seg(t, t5, t5 + 3.5)));
    const tM = G(38), tFlip = TL.hit('mask.flip', G(42)), tToss = G(44);
    const P = keys(st, [[t5, sitH({})], [tM, sitH({ aN: [86, 30], head: -4, lean: 4 })], [tFlip, sitH({ aN: [92, 24], head: 2, lean: 8 })], [tToss, sitH({ aN: [92, 24], head: -4, lean: 0, expr: 'smirk' })], [tToss + .35, sitH({ aN: [-40, 60], head: -8, lean: -6, expr: 'smirk' })]], .22);
    const r = setDate(g, C, t, P, null, {});
    if (st >= tM - .22) {
      const fl = st < tFlip ? 1 : st < tToss ? Math.cos((st - tFlip) / (tToss - tFlip) * Math.PI * 3) : 1, k = arrive(st, tM - .22) || 1;
      let M = held(r.Mh.handN, C, -.08, 1.0 * k, Math.abs(fl) < .12 ? .06 * Math.sign(fl || 1) : fl);
      if (t > tToss) { const dt = t - tToss, h = ap(r.Mh.handN, [0, 0]); M = mul(mul([C[0], 0, 0, C[0], h[0] - 520 * dt * C[0], h[1] + (-560 * dt + 1400 * dt * dt) * C[0]], R(-5 * dt)), S(1)); }
      put(g, mask(), mul(M, T(0, -236)), { shadow: 1.4 });
    }
  }, { type: 'slide', d: .25, dir: [-1, 0] });

  // S6 相亲对象那个阿发 — he arrives; the car key hits the table
  const t6 = cut('V1.2'), tSlap = TL.hit('key.slap', TL.snare(26.3));
  add('v1.2', t6, (g, t) => {
    const st = step(t), sk = hitShake(t, [tSlap], 9), C = cam(1000 + sk[0], 620 + sk[1], 1.42);
    const u = seg(st, t6, t6 + 1.0), tSit = t6 + 1.3;
    const F = st < tSit - .25 ? { ...walk((st - t6) * 2.2), x: lerp(1820, 1290, u), y: 896, dir: -1, expr: 'smug' }
      : keys(st, [[tSit - .25, { ...POSE.stand, x: 1290, y: 896, dir: -1, expr: 'smug' }], [tSit, sitF({})], [tSlap - .12, sitF({ aN: [140, 30], lean: -6 })], [tSlap, sitF({ aN: [58, 44], lean: 10 })]], .12);
    const Hp = keys(st, [[t6, sitH({})], [tSlap + .1, sitH({ ...POSE.sitBack, expr: 'cold' })]], .1);
    const j = st >= tSlap && st < tSlap + 1 / 12 ? 18 : st >= tSlap + 1 / 12 && st < tSlap + 2 / 12 ? 6 : 0;
    setDate(g, C, t, Hp, F, { key: st >= tSlap, jump: j });
  }, { type: 'slide', d: .25, dir: [1, 0] });

  // S7 张口闭口不仅是爹味 甚至还有点大 — his talk comes out as scraps, each bigger; on 大 his head goes up a size
  const t7 = cut('V1.3'), tBl = [53, 55, 57, 59].map(i => G(i)), tBig = TL.hit('head.big', G(59));
  const SCR = [[990, 452, .5], [884, 392, .64], [1034, 334, .78], [836, 404, 1.2]];
  function blabs(g, C, t, mouth) {
    tBl.forEach((tb, k) => { if (t < tb) return; const e = eo(seg(t, tb, tb + .4)), d = t - tb, [x, y, s] = SCR[k];
      put(g, blabScrap(k === 3 ? '大' : '爹'), at(C, lerp(mouth[0], x, e) - d * 9, lerp(mouth[1], y, e) - d * 7 + Math.sin(d * 2 + k) * 5, s * lerp(.2, 1, e) * pop(step(t), tb + .4, 1.12), Math.sin(d * 1.7 + k * 2) * .05), { shadow: 1.5 }); });
  }
  add('v1.3', t7, (g, t) => {
    const st = step(t), u = seg(t, t7, t7 + 4.6), C = cam(lerp(960, 1000, eio(u)), 566, lerp(1.3, 1.38, u));
    const talk = Math.floor(st * 6) % 2 ? 'blab' : 'smug', wag = Math.floor((st - t7) / TL.per) % 2;
    const hs = st < tBig ? 1 : st < tBig + 1 / 12 ? 1.66 : 1.48;
    const F = sitF({ expr: st > tBig + .5 ? 'smug' : talk, aN: wag ? [112, 62] : [128, 26], aF: [40, 50], lean: 6, headS: hs, head: st >= tBig ? -6 : 0 });
    const tUp = G(56), Hp = keys(st, [[t7, sitH({ ...POSE.sitBack })], [tUp, sitH({ aN: [64, 128], head: -6, lean: -6 })], [tUp + .9, sitH({ aN: [64, 128], head: -6, lean: -6 })], [tBig, sitH({ ...POSE.sitBack, lean: -16, head: -8 })]], .25);
    const lifted = st > tUp - .25 && st < tUp + 1.1;
    const r = setDate(g, C, t, Hp, F, { key: true, noCupA: lifted });
    if (lifted) put(g, cup(), held(r.Mh.handN, C, -.25), { shadow: .7 });
    blabs(g, C, t, [1076, 572]);
  });

  // S8 阿花冷眼看阿发 — the cold eye, as big as the frame allows
  const t8 = cut('V1.4');
  add('v1.4', t8, (g, t) => {
    const st = step(t), u = seg(t, t8, t8 + 2.2), z = lerp(1, 1.07, u), C = cam(960, 540, z), Cb = cam(1010, 420, 2.5);
    cafe(g, Cb, t);
    blabs(g, mul(cam(960, 540, 1.9), T(140, -40)), t7 + 5 + (t - t8), [1076, 572]);
    const blink = st >= t8 + .87 && st < t8 + 1.04;
    drawFig(g, C, HUA28, { ...POSE.stand, x: 850, y: 2250, s: 4.5, expr: blink ? 'sleep' : 'cold', head: -2 }, { K: 7, shadow: 1.6 });
  }, { type: 'slide', d: .2, dir: [-1, 0] });

  // S9 收起你那如意算盘吧 — the abacus; one flick and the beads are everywhere
  const t9 = G(68), tAb = G(69), tFlick = TL.hit('abacus.flick', G(74));
  add('v1.5', t9, (g, t) => {
    const st = step(t), sk = hitShake(t, [tFlick], 7), C = cam(985 + sk[0], 606 + sk[1], 1.42);
    const tick = Math.floor((st - tAb) / (TL.per / 2)) % 2;
    const F = keys(st, [[t9, sitF({ headS: 1.3 })], [tAb, sitF({ headS: 1.3, aN: [86, 40], aF: [70, 30 + tick * 26], lean: 8, expr: Math.floor(st * 6) % 2 ? 'blab' : 'smug' })], [tFlick - .01, sitF({ headS: 1.3, aN: [86, 40], aF: [70, 30 + tick * 26], lean: 8, expr: Math.floor(st * 6) % 2 ? 'blab' : 'smug' })], [tFlick + .1, sitF({ headS: 1.3, aN: [150, 20], aF: [140, 30], lean: -16, expr: 'wide', head: -8 })]], .1);
    const Hp = keys(st, [[t9, sitH({ ...POSE.sitBack, expr: 'smirk' })], [TL.L('V1.5').t0, sitH({ ...POSE.sitBack, expr: 'cold' })], [tFlick - .2, sitH({ aN: [40, 130], lean: 4 })], [tFlick, sitH({ aN: [100, 4], lean: 10, expr: 'cold' })], [tFlick + .8, sitH({ ...POSE.sitBack, expr: 'smirk' })]], .14);
    setDate(g, C, t, Hp, F, { key: true });
    if (st >= tAb) {
      const d = Math.max(0, t - tFlick), k = arrive(st, tAb);
      put(g, abacus(), at(C, 1010 + d * 520, 486 - d * 900 + 900 * d * d + (st < tFlick ? (tick ? 3 : -3) : 0), .78 * k, .12 + d * 9), { shadow: 1.5 });
      scraps(g, C, t, tFlick, 1010, 486, 16, [COL.teal, COL.tealNear, COL.tealPale], { size: 15, spread: 430, up: 520, seed: 4, life: 1.5 });
    }
  }, { type: 'slide', d: .2, dir: [1, 0] });

  // S10 想要保姆请你自己花钱雇佣她 — the apron comes with a price tag, and goes back on him
  const t10 = cut('V1.6'), tAp = G(78), tTag = TL.hit('tag', TL.snare(40.5)), tBack = TL.hit('apron.back', G(85));
  add('v1.6', t10, (g, t) => {
    const st = step(t), C = cam(985, 606, lerp(1.4, 1.5, seg(t, t10, t10 + 4)));
    const worn = st >= tBack + .2;
    const F = keys(st, [[t10, sitF({ headS: 1.3 })], [tAp, sitF({ headS: 1.3, aN: [92, 10], aF: [84, 12], lean: 12, expr: 'blab' })], [tBack, sitF({ headS: 1.3, aN: [92, 10], aF: [84, 12], lean: 12, expr: 'smug' })], [tBack + .2, sitF({ headS: 1.3, aN: [30, 80], aF: [24, 84], lean: -8, expr: 'wide' })]], .16);
    const Hp = keys(st, [[t10, sitH({ ...POSE.sitBack })], [tTag - .2, sitH({ aN: [20, 140], lean: 2 })], [tTag, sitH({ aN: [96, 6], lean: 12 })], [tTag + .5, sitH({ aN: [50, 60], lean: 2, expr: 'smirk' })], [tBack - .1, sitH({ aN: [60, 100], lean: 0, expr: 'smirk' })], [tBack + .1, sitH({ aN: [98, 0], aF: [90, 4], lean: 14, expr: 'smirk' })], [tBack + .9, sitH({ ...POSE.sitBack, expr: 'smirk' })]], .14);
    setDate(g, C, t, Hp, F, { key: true, midF: worn ? Ms => { wearApron(g)(Ms); put(g, priceTag('¥'), mul(mul(Ms.torso, T(4, -62)), mul(R(.14), S(-.8, .8))), { shadow: .6 }); const p = ap(Ms.torso, [4, -62]); say('yen', '¥', p[0] - 60, p[1] - 50, p[0] + 60, p[1] + 50); } : null });
    if (st >= tAp && !worn) {
      const e = eo(seg(t, tBack, tBack + .2)), x = lerp(960, 1120, e), y = lerp(480, 600, e), s = lerp(.86, .52, e) * arrive(st, tAp);
      put(g, apron(), at(C, x, y, s, -.06 * (1 - e)), { shadow: 1.5 });
      if (st >= tTag) put(g, priceTag('¥'), at(C, x - 10 * s, y - 20 * s, s * 1.5 * pop(st, tTag, 1.2), -.14), { shadow: 1 });
    }
    if (st >= tTag && !worn) say('yen', '¥', 880, 420, 1200, 640);   // the tag stays readable while the apron travels back to him
  });

  // S11 别想白嫖我的年华 — he reaches for the flower in her hair; the scissors take his tie
  const t11 = cut('V1.7'), tSnip = TL.hit('tie.snip', TL.snare(43.8));
  add('v1.7', t11, (g, t) => {
    const st = step(t), sk = hitShake(t, [tSnip], 5), C = cam(985 + sk[0], 590 + sk[1], lerp(1.6, 1.76, eio(seg(t, t11, tSnip))));
    const cutDone = st >= tSnip;
    const F = keys(st, [[t11, sitF({ headS: 1.3, expr: 'smug' })], [t11 + .5, { ...POSE.stand, x: 1130, y: 896, dir: -1, bob: 40, lean: 34, aN: [118, 6], aF: [40, 40], lN: [40, 60], lF: [30, 50], headS: 1.3, expr: 'blab', head: -20 }], [tSnip, { ...POSE.stand, x: 1120, y: 896, dir: -1, bob: 40, lean: 38, aN: [124, 4], aF: [40, 40], lN: [40, 60], lF: [30, 50], headS: 1.3, expr: 'smug', head: -22 }], [tSnip + .16, { ...POSE.stand, x: 1190, y: 896, dir: -1, bob: 10, lean: -18, aN: [150, 60], aF: [140, 70], headS: 1.3, expr: 'scared', head: -6 }]], .22);
    F.tieCut = cutDone;
    const Hp = keys(st, [[t11, sitH({ ...POSE.sitBack, expr: 'smirk' })], [tSnip - .45, sitH({ aN: [70, 50], lean: 2, expr: 'cold' })], [tSnip - .08, sitH({ aN: [84, 14], lean: 8, expr: 'cold' })], [tSnip + .6, sitH({ aN: [84, 14], lean: 8, expr: 'smirk' })], [tSnip + 1.1, sitH({ aN: [60, 110], lean: -4, expr: 'smirk' })]], .16);
    let Mf; const r = setDate(g, C, t, Hp, F, { key: true, midF: Ms => { wearApron(g)(Ms); Mf = Ms; } });
    if (st >= tSnip - .5) { const h = ap(r.Mh.handN, [0, 0]); drawScissors(g, [1, 0, 0, 1, 0, 0], h[0] + 150 * C[0], h[1] - 8 * C[0], -.06, st < tSnip - .1 ? 1 : st < tSnip ? .5 : st < tSnip + .5 ? 0 : .6, C[0] * .9); }
    if (cutDone) { const d = t - tSnip, p0 = ap(Mf.torso, [22, -100]); put(g, tieEnd(), mul(mul([C[0], 0, 0, C[0], p0[0] + Math.sin(d * 7) * 16, p0[1] + (60 * d + 700 * d * d) * C[0]], R(Math.sin(d * 6) * .5)), S(1.05)), { shadow: 1 }); scraps(g, C, t, tSnip, 1050, 600, 5, [COL.cream, COL.cream2], { size: 8, spread: 120, up: 160, life: 1.2 }); }
  }, { type: 'slide', d: .2, dir: [-1, 0] });

  // S12 后来故事发展很火辣 — she stands; the table goes over
  const t12 = cut('P1.0'), tFlip = TL.hit('table.flip', G(98));
  add('p1.0', t12, (g, t) => {
    const st = step(t), sk = hitShake(t, [tFlip + .3], 12), u = seg(t, t12, tFlip), C = cam(990 + sk[0], 610 + sk[1], lerp(1.3, 1.4, u), lerp(0, .045, eio(u)));
    const tilt = t < tFlip ? -.2 * eio(seg(t, t12 + .5, tFlip)) : -.2 - 1.5 * eo(seg(t, tFlip, tFlip + .38));
    const tm = mul(mul(mul(C, T(1032, 896)), R(-tilt)), T(TABLE[0] - 1032 + (t > tFlip ? (t - tFlip) * 240 : 0), TABLE[1] - 896));
    const fd = Math.max(0, st - tFlip - .12);
    const F = sitF({ headS: 1.3, expr: st < t12 + .8 ? 'scared' : 'wide', tieCut: true, aN: [140, 40], aF: [130, 50], lean: -10 - 60 * eo(seg(st, tFlip + .12, tFlip + .5)), x: 1150 + fd * 520, rot: fd * 2.2 });
    const Hp = keys(st, [[t12, sitH({ expr: 'cold' })], [t12 + .5, { ...POSE.stand, x: 810, y: 896, lean: 22, bob: 26, aN: [50, 50], aF: [44, 52], lN: [30, 40], lF: [20, 30], expr: 'firm' }], [tFlip, { ...POSE.stand, x: 830, y: 896, lean: 12, bob: 10, aN: [70, 40], aF: [64, 42], expr: 'firm' }], [tFlip + .2, { ...POSE.stand, x: 850, y: 896, lean: -8, aN: [150, 10], aF: [140, 14], expr: 'sing' }]], .2);
    const sl = t < tFlip ? 150 * ei(seg(t, t12 + .7, tFlip)) : 150;
    cafe(g, C, t);
    put(g, chair(), at(C, 760, 796), {}); put(g, chair(), at(C, 1160 + fd * 520, 796, 1, fd * 2.2, -1), {});
    drawFig(g, C, FA, F, { mid: wearApron(g) }); drawFig(g, C, HUA28, Hp);
    put(g, table(), tm, {});
    if (t < tFlip) { put(g, cup(), mul(tm, T(-80 + sl, -14)), { shadow: .7 }); put(g, cup(), mul(tm, mul(T(84 + sl * .5, -14), S(-1, 1))), { shadow: .7 }); put(g, carKey(), mul(tm, mul(T(14 + sl * .9, -24), R(.1))), { shadow: .7 }); }
    else { const d = t - tFlip; [[70, 0], [160, 1], [150, 2]].forEach(([x, k]) => put(g, k === 2 ? carKey() : cup(), at(C, 960 + x + d * (340 + k * 90), 590 - d * (520 + k * 60) + 1100 * d * d, 1, d * (6 + k * 2)), { shadow: .8 })); }
  }, { type: 'slide', d: .2, dir: [1, 0] });

  // S13 阿花当场掀翻了名为传统的塔 — low wide: the tower stands up out of the ground, and comes down a tier per beat
  const t13 = cut('P1.1'), tPush = TL.hit('tower.push', G(104)), tEnd = TL.hit('tower.base', G(108));
  const tierT = k => tPush + .08 + (5 - k) * TL.per / 2;       // cap = 5, then tiers 4…1
  const BASE = [1190, 930];
  function towerSet(g, C, t) {
    ground(g, 'rice', layer(C[4] ? 960 : 960, 540, 1, .1), 'rgba(238,224,192,.4)');
    put(g, ridge(5200, 300, COL.pale3, 3), at(mul(C, [1, 0, 0, 1, 0, 0]), -1500, 850, 1), { shadow: .5 });
    floor(g, C, 930, COL.pale2, -900);
  }
  function tower(g, C, t, st) {
    for (let k = 0; k <= 5; k++) {
      const rise = back(seg(t, t13 + .1 + k * .09, t13 + .45 + k * .09), 2.2), p = k === 5 ? towerCap() : tier(k), y0 = BASE[1] - k * 96;
      if (rise <= 0) continue;
      if (k === 0) { const tip = st < tPush ? 0 : st < tEnd ? .09 : .09 + 1.4 * eo(seg(t, tEnd, tEnd + .4)); put(g, p, mul(mul(mul(C, T(BASE[0] + 150, y0)), R(tip)), mul(T(-150, 0), S(1, rise))), { shadow: 1.4 }); continue; }
      const tf = tierT(k), d = Math.max(0, t - tf), land = .52, e = Math.min(1, d / land);
      const w2 = k === 5 ? 50 : (300 - k * 34) / 2, tx = 1500 + (4 - Math.min(k, 4)) * 84 + (k === 5 ? 330 : 0), rot = (st < tPush ? 0 : .06) + ei(e) * (1.57 + (k % 2 ? .12 : -.08)) + (d > land ? 0 : 0);
      const x = lerp(BASE[0] + w2, tx, e), y = lerp(y0, 930 - 4, e * e) - Math.sin(e * Math.PI) * 60;
      put(g, p, mul(mul(mul(C, T(x, y)), R(rot)), mul(T(-w2, 0), S(1, rise))), { shadow: 1.4 });
    }
  }
  const lands = [5, 4, 3, 2, 1].map(k => tierT(k) + .5);
  add('p1.1', t13, (g, t) => {
    const st = step(t), sk = hitShake(t, [tPush, ...lands, tEnd + .35], 11), C = cam(1090 + sk[0], lerp(640, 624, seg(t, t13, t13 + 4)) + sk[1], lerp(1.1, 1.18, seg(t, t13, t13 + 4)));
    towerSet(g, C, t); tower(g, C, t, st);
    const tRun = tPush - .75;
    const Hp = st < tRun ? { ...POSE.stand, x: 560, y: 930, head: -14, expr: 'cold', aN: [-10, 100], aF: [-18, 104] } : st < tPush - .3 ? { ...walk((st - tRun) * 3.2, 1.2), x: lerp(560, 860, seg(st, tRun, tPush - .3)), y: 930, expr: 'firm' }
      : keys(st, [[tPush - .3, { ...POSE.stand, x: 860, y: 930, lean: -12, aN: [-30, 40], aF: [-40, 40], expr: 'firm' }], [tPush, { ...POSE.push, x: 918, y: 930, expr: 'sing' }], [tPush + 1.0, { ...POSE.push, x: 918, y: 930, expr: 'sing' }], [tPush + 1.4, { ...POSE.stand, x: 900, y: 930, expr: 'smirk', aN: [40, 90], aF: [50, 80] }], [tEnd, { ...POSE.stand, x: 900, y: 930, expr: 'smirk', aN: [70, 80], aF: [30, 100] }], [tEnd + .3, { ...POSE.stand, x: 900, y: 930, expr: 'smirk', aN: [-14, 100], aF: [-22, 104], lean: -4 }]], .14);
    drawFig(g, C, HUA28, Hp);
    for (const tl of lands) scraps(g, C, t, tl, 1700, 900, 4, [COL.deep, COL.deep2, COL.pale], { size: 10, spread: 260, up: 260, life: 1.2, seed: tl });
    if (t > t13 + .5 && st < tEnd) { const a = ap(C, [BASE[0] - 80, BASE[1] - 62]), b = ap(C, [BASE[0] + 80, BASE[1] - 10]); say('trad', '传统', a[0], a[1], b[0], b[1]); }
  }, { type: 'fall', d: .45 });

  // S14 什么旧爱新欢 / 都不care啊 — two paper men on sticks; one flick
  const t14 = cut('P1.2'), tM = [G(111), G(113)], tShrug = G(114), tFl = TL.hit('men.flick', G(116));
  add('p1.2', t14, (g, t) => {
    const st = step(t), C = cam(1010, 640, 1.5);
    towerSet(g, C, t); tower(g, C, 60, 60);
    const Hp = keys(st, [[t14, { ...POSE.stand, x: 800, y: 930, expr: 'cold', aN: [-14, 100], aF: [-22, 104] }], [tShrug, { ...POSE.shrug, x: 800, y: 930, expr: 'smirk' }], [tFl - .12, { ...POSE.shrug, x: 800, y: 930, expr: 'smirk', aN: [-30, 120] }], [tFl, { ...POSE.stand, x: 810, y: 930, expr: 'smirk', aN: [112, 0], aF: [-30, 30], lean: 8 }]], .14);
    drawFig(g, C, HUA28, Hp);
    tM.forEach((tm, k) => { if (st < tm) return; const d = Math.max(0, t - tFl - k * .06), x = 1090 + k * 170, y = 590 - k * 30;
      put(g, paperMan(k), at(C, x + d * (700 + k * 200), y - d * 900 + 500 * d * d, 1.15 * arrive(st, tm), Math.sin(t * 5 + k) * .07 + d * (9 + k * 3)), { shadow: 1.4 }); });
  }, { type: 'slide', d: .2, dir: [1, 0] });

  // S15 + S16 什么贤妻良母的剧本 / 去死吧 (Let it burn) — the script, cut in two, into the fire basin a bride is meant to step over
  const t15 = cut('P1.4'), tS = t15 + .1, t16 = cut('P1.5'), tCut = TL.hit('script.cut', G(124)), tBurn = TL.hit('burn', G(129));
  const BAS = [1020, 1570];
  function scriptShot(g, t) {
    const st = step(t), down = eio(seg(t, tCut + .05, tCut + 1.35)), sk = hitShake(t, [tCut], 6), C = cam(960 + sk[0], 690 + down * 590 + sk[1], lerp(1, .9, down));
    ground(g, 'rice', C, 'rgba(238,224,192,.4)');
    put(g, ridge(5200, 300, COL.pale3, 3), at(C, -1500, 1700), { shadow: .5 }); floor(g, C, 1790, COL.pale2, -900);
    const Hp = keys(st, [[t15, { ...POSE.stand, x: 400, y: 1790, s: 2.2, aN: [20, 40], aF: [-10, 20], expr: 'cold' }], [tS, { ...POSE.stand, x: 400, y: 1790, s: 2.2, aN: [128, 10], aF: [-10, 20], expr: 'cold', head: -10 }], [tCut, { ...POSE.stand, x: 400, y: 1790, s: 2.2, aN: [128, 10], aF: [-10, 20], expr: 'firm', head: -4 }], [tCut + .2, { ...POSE.stand, x: 400, y: 1790, s: 2.2, aN: [10, 30], aF: [-10, 20], expr: 'smirk', head: 6 }]], .16);
    drawFig(g, C, HUA28, Hp, { shadow: 1.5 });
    const k = arrive(st, tS - .1);
    if (k && st < tCut) put(g, script(0), at(C, 1020, 470, 1.5 * k, -.05), { shadow: 2 });
    if (st >= tCut) {
      const d = t - tCut;
      for (const sd of [-1, 1]) { const fall = Math.min(1080 - sd * 20, 120 * d + 900 * d * d), landed = fall >= 1080 - sd * 20, bd = Math.max(0, t - tBurn - .6);
        put(g, script(sd), at(C, 1020 + sd * (30 + Math.min(d, .9) * 70), 470 + fall + bd * 30, 1.5 * (1 - .25 * clamp(bd / 2)), -.05 + sd * (landed ? .5 : d * 1.1)), { shadow: 1.6 }); }
    }
    if (st >= tS && st < tCut - .1) say('script', '贤妻良母', 880, 300, 1160, 450);
    if (t >= t16 && st < tCut + .1) { const u = seg(t, t16 + .1, tCut - .08); drawScissors(g, C, 1024, lerp(170, 790, u) + (st >= tCut ? (t - tCut) * 900 : 0), Math.PI / 2, snipOpen(t, TL.per / 2, TL.g0), 1.9); }
    scraps(g, C, t, tCut, 1020, 560, 9, [COL.deep, COL.deep2], { size: 11, spread: 200, up: 120, life: 1.6, seed: 2 });
    const lit = keys(t, [[tBurn, 0], [tBurn + .5, .55, .5], [tBurn + 1.3, 1, .8]], .5, eo);
    if (lit > 0) drawFlames(g, C, BAS[0], BAS[1] - 110, t, 1.9 * lit, 6);
    put(g, basin(), at(C, BAS[0], BAS[1], 2), { shadow: 1.6 });
    if (t > tCut + 1.3 && t < tBurn + .6) scraps(g, C, t, tCut + 1.3, BAS[0], BAS[1] - 130, 6, [COL.cream2, COL.pale3], { size: 7, spread: 60, up: 240, grav: 60, life: 2.4, float: 1, seed: 8 });
  }
  add('p1.4', t15, scriptShot, { type: 'slide', d: .2, dir: [-1, 0] });
  return out;
}
