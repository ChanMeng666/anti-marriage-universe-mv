// Shots, part 1: make-ready, his proof, her proof, both plates down (intro → pre-chorus 1)
import { S as PLATES, g, W, H, clear, rect, rrect, line, circle, ellipse, poly, text, over, layer, blob, curve, limb } from './engine/draw.js';
import { clamp, lerp, seg, ss, eio, eo, ei, back, hash, mulberry, TAU } from '/core/lib.js';
import { R, T, Y, K, P, SKIN, tint, LOOK, figure, head, cup, steam, key, chair, table, lamp, bubble, laptop, moto, rider, sofa, glass, mask, warrior, regmark, scissors, house } from './cast.js';
import { LINES, BEATS, PULSE, BARS, FL, L1, AT, CF, CUES, DUR, FZ, KICKS, L0, OPEN, S, SHOTS, TEXTS, beatAt, before, cafe, cafeRoom, cam, clip, cutL, kf, near, pop, pulse, reset, road, room, say, say2, setData, step, sweepX } from './kit.js';

// 0. make-ready: two registration crosses that will not line up
S.marks = (lt, c) => {
  const tTitle = c.tTitle, tOff = c.tOff, tt = lt;
  const xr = kf(tt, [[0, -160], [2.9, 930], [3.4, 1000], [tTitle - .05, 1320], [tTitle + .35, 300], [tOff, 300], [tOff + .5, 900]]);
  const xt = kf(tt, [[0, 2080], [2.9, 990], [3.4, 920], [tTitle - .05, 600], [tTitle + .35, 1620], [tOff, 1620], [tOff + .5, 1020]]);
  const y = kf(tt, [[0, 540], [tTitle, 540], [tTitle + .35, 210], [tOff, 210], [tOff + .5, 520]]);
  const r = kf(tt, [[0, 170], [tTitle, 170], [tTitle + .35, 60], [tOff, 60], [tOff + .5, 110]]);
  cropMarks();
  regmark(xr, y + 14 * Math.sin(tt * .8), r, R, r * .07 + 3); over(() => regmark(xt, y - 14 * Math.sin(tt * .8 + 1), r, T, r * .07 + 3));
  if (lt >= tTitle && lt < tOff) {
    say2('title', '最佳路人', 960, 610, FZ(250), 14, 10, 'center', 10);
    say('title-en', 'THE BEST STRANGERS', 960, 730, FL(46, 700), K, 'center', 16);
  }
  introTalk(c.t);
  return { gate: [1, 1, 0] };
};
function cropMarks(c = K) {
  for (const [x, sx] of [[70, 1], [W - 70, -1]]) for (const [y, sy] of [[60, 1], [H - 60, -1]]) { rect(x, y - 2, 46 * sx, 4, c); rect(x - 2, y, 4, 46 * sy, c); }
}
// the spoken exchange of the intro: two slabs from opposite margins (they stay up over the cut into verse 1)
function introTalk(t) {
  const a = LINES[0], b = LINES[1], end = b.t0 + 3.3;
  if (t >= a.t0 - .1 && t < end) layer(() => { bubble(520, 250, 880, 130, T, -1); say('sp0', 'Yeah… remember that day?', 520, 270, FL(58, 600), P); }, 6);
  if (t >= b.t0 - .1 && t < end) layer(() => { bubble(1420, 790, 800, 130, R, 1); say('sp1', 'Oh, I try to forget it.', 1420, 810, FL(58, 600), P); }, 6);
}

// 1. his proof: the café in teal only
S.hisWide = (lt, c) => {
  const tt = step(lt), z = lerp(1.0, 1.12, ss(lt / c.d));
  cam(z, 760 + lt * 22, 620);
  const sweepArm = Math.sin(tt * 2.6) * .5 + .5;                    // he overplays: a broad arm, a chin in the air
  PLATES.mask = [0, 1, 0];                                          // only his plate is drawn; her slab of speech still hangs over the cut
  cafe({ he: { lean: -.2 + .05 * Math.sin(tt * 1.3), handF: [lerp(96, 140, sweepArm), lerp(-60, -190, sweepArm)], bendF: -1, nod: -.12, headO: { brow: -.5, mouth: tt % 1 < .5 ? 'open' : 'smile' } }, she: { lean: -.04, headO: { lid: .5 } } });
  PLATES.mask = [1, 1, 1]; reset(); introTalk(c.t);
  return { gate: [1, 1, 0], sweep: [OPEN, sweepX(lt, 0, .7), OPEN] };
};
// the key comes down: wide anticipation, then a top-down insert on the hit
S.hisKeyUp = (lt, c) => {
  const tt = step(lt), up = ss(seg(tt, 0, c.d - .25)), down = seg(lt, c.d - .22, c.d);
  cam(1.5, 800, 560);
  const hand = [lerp(110, 96, up) + down * 40, lerp(-60, -250, up) + down * 190];
  cafe({ he: { lean: lerp(-.16, -.3, up) + down * .42, handF: hand, bendF: -1, nod: -.15 * up, headO: { brow: -.6, mouth: 'smile', look: 1 }, hold: h => key(h[0] + 6, h[1] + 4, .5, 1.2 + up * .4, T) }, she: { lean: -.03, headO: { lid: .5 } } });
  return { gate: [0, 1, 0] };
};
S.hisKeyHit = (lt, c) => {
  const tt = step(lt), hit = pulse(lt, 0, .18), z = 1 + hit * .05;
  cam(z, 960, 540);
  rect(-200, -200, 2400, 1500, tint(T, .24));
  circle(960, 560, 470, K);                                          // the table from above
  const j = Math.sin(lt * 60) * 9 * hit;
  layer(() => { circle(560, 380 - hit * 26, 74, Y); circle(560, 380 - hit * 26, 108, T); circle(560, 380 - hit * 26, 74, Y); circle(1360, 740 - hit * 22, 108, R); circle(1360, 740 - hit * 22, 74, Y); }, 4);   // two cups jump
  layer(() => key(880 + j, 560, 2.3, -.25 + j * .004, P), 0);
  const away = ss(seg(tt, .5, 1.3));                                 // the hand that did it withdraws, slowly, pleased with itself
  layer(() => { limb([-80 - away * 260, 1010 + away * 80], [600 - away * 330, 650 + away * 120], 150, T); circle(640 - away * 330, 630 + away * 120, 62, SKIN); });
  if (lt > 1.7) { const k = pop(lt, 1.7); layer(() => { g.save(); g.translate(1330, 300); g.scale(k, k); g.rotate(-.08); bubble(0, 0, 330, 120, T, -1); say('pa', '啪！', 0, 30, FZ(84), P); g.restore(); }); }
  return { gate: [0, 1, 0] };
};
// he lectures: the words stack up like merchandise
S.hisTalk = (lt, c) => {
  const tt = step(lt), w1 = AT(c.i, '工作') - c.t0, w2 = AT(c.i, '有个家') - c.t0;
  cam(lerp(1.28, 1.4, ss(lt / c.d)), 760, 560);
  cafe({
    he: { lean: -.1 + .04 * Math.sin(tt * 5), handF: [130, -150 + 30 * Math.sin(tt * 5)], bendF: -1, headO: { brow: -.6, mouth: Math.floor(tt * 6) % 2 ? 'open' : 'flat' } }, she: { lean: -.06 * ss(seg(lt, w1, w1 + 1)), headO: { lid: .6 } },
  });
  reset(); lecture(c.t, w1 + c.t0, w2 + c.t0);
  return { gate: [0, 1, 0] };
};
// his two selling points, in screen space: they hang in the air over the cut into the next shot
function lecture(t, t1, t2) {
  if (t >= t1) { const k = pop(t, t1); layer(() => { g.save(); g.translate(1200, 270); g.scale(k, k); g.rotate(-.05); bubble(0, 0, 500, 150, T, -1); say('w1', '工作稳定', 0, 36, FZ(100), P); g.restore(); }); }
  if (t >= t2) { const k = pop(t, t2); layer(() => { g.save(); g.translate(1340, 110); g.scale(k, k); g.rotate(.04); bubble(0, 0, 420, 150, T, 0); say('w2', '有个家', 0, 36, FZ(100), P); g.restore(); }); }
}
// the smell of it: a cloud of his ink rolls over the blank where she sits
S.hisStink = (lt, c) => {
  const tt = step(lt), run = AT(c.i, '吓跑') - c.t0, peek = c.d - 3.2;
  cam(1.16, 960 + ss(lt / 4) * 120, 600);
  const adv = ss(seg(lt, 0, run + .6)), flee = ss(seg(tt, run, run + .7));
  cafe({
    he: { lean: lerp(-.16, .12, adv), handF: [150, -110], handB: [140, -150], bendF: -1, bendB: -1, headO: { brow: -.7, mouth: 'open', lid: lt > peek ? (step(lt - peek) % 1.2 < .6 ? 1 : 0) : 0 } },
    she: { lean: -.3 * flee, handF: [70, -170 * flee - 40], bendF: 1, nod: -.2 * flee, headO: { lid: 1, hairUp: flee * .6 } },
    front: () => {
      for (let i = 0; i < 9; i++) {                                    // stepped tints of teal, drifting on a sine
        const u = adv * (1 - i * .06), x = lerp(880, 1360, u) - i * 40 * adv, y = 330 + Math.sin(tt * 2 + i * 1.7) * 40 + (i % 3) * 70;
        if (u > .05) circle(x, y, (58 + (i % 4) * 22) * Math.min(1, u * 3), tint(T, [.62, .4, .5][i % 3]));
      }
      for (let i = 0; i < 5; i++) { const x = lerp(820, 1300, adv) - i * 90 * adv; curve([[x, 470], [x + 14, 430 + Math.sin(tt * 4 + i) * 10], [x - 10, 392], [x + 12, 356]], 9, T); }
    },
  });
  reset(); if (lt < 1.35) lecture(c.t, 0, 0);
  return { gate: [0, 1, 0] };
};
// what he is actually afraid of: being taken home
S.hisHome = (lt, c) => {
  const tt = step(lt), hm = AT(c.i, '带回家') - c.t0, come = ss(seg(lt, .2, hm)), jolt = pulse(tt, hm, .5);
  cam(1.3, 800 - come * 60, 580);
  cafe({
    he: { lean: -.16 - .3 * ss(seg(tt, hm - .5, hm + .2)), handF: [60, -210 * ss(seg(tt, hm - .6, hm)) - 40], handB: [20, -200 * ss(seg(tt, hm - .5, hm + .1)) - 30], bendF: -1, bendB: -1, nod: -.2 * jolt, headO: { wide: 1, brow: .7, mouth: lt > hm - .4 ? 'open' : 'flat' } },
    she: { headO: { lid: .5 } },
    front: () => layer(() => { const x = lerp(1560, 930, come), y = 360 + Math.sin(tt * 3) * 10; house(x, y, 1.5 + jolt * .2, tint(T, .62)); line([[x + 100, y - 40], [1700, y - 60]], 8, T); }),
  });
  return { gate: [0, 1, 0] };
};
// 2. her proof: the same table in red only, shot from the other side of the line
S.herWide = (lt, c) => {
  const tt = step(lt), z = lerp(1.12, 1.0, ss(lt / c.d)), ma = AT(c.i, '头皮') - c.t0;
  cam(z, 1160 - lt * 22, 620);
  const sweepArm = Math.sin(tt * 2.6) * .5 + .5, cr = ss(seg(lt, ma - .2, ma + .4));
  cafe({ keyOn: 1, he: { lean: -.2, handF: [lerp(96, 140, sweepArm), lerp(-60, -190, sweepArm)], bendF: -1, nod: -.12 }, she: { lean: -.02 - .03 * cr, handF: [104, -60], nod: .06 * cr, headO: { lid: Math.floor(tt * 2) % 5 === 0 ? 1 : .3, look: Math.floor(tt * 1.5) % 2 ? 1 : -1, brow: .5 * cr + (Math.floor(tt * 1.5) % 2 ? .2 : 0), mouth: 'flat', hairUp: cr } } });
  return { gate: [1, 0, 0], sweep: [sweepX(lt, 0, .7), OPEN, OPEN] };
};
// the blank across the table fills in: a clay soldier dug out of an old dynasty, printed as a tint of her ink
S.herWarrior = (lt, c) => {
  const tt = step(lt), dig = AT(c.i, '出土') - c.t0, z = lerp(1.15, 1.5, ss(seg(lt, 0, c.d)));
  cam(z, 760, 520);
  const up = eo(seg(lt, dig - .1, dig + .9));
  cafe({ keyOn: 1, noHe: 1, she: { lean: -.05, headO: { lid: .5, mouth: 'flat', brow: .3, hairUp: .4 } },
    mid: () => {
      clip(300, -400, 620, CF.floor + 400 - 4, () => layer(() => warrior(CF.heX + 6, CF.seat + 12 + (1 - up) * 560, 1.7, .5, 1, up), 5));
      for (let i = 0; i < 8; i++) { const a = hash(i * 7.3), u = seg(lt, dig + a * .5, dig + 1.4 + a); if (u > 0 && u < 1) circle(CF.heX - 120 + i * 36, CF.seat - 20 - u * 180 * (.5 + a), 10 * (1 - u) + 4, tint(R, .5)); }   // dust
    } });
  return { gate: [1, 0, 0] };
};
// relief, hidden behind a cup
S.herCup = (lt, c) => {
  const tt = step(lt), up = kf(tt, [[0, 0], [.8, 1], [c.d - 1.0, 1], [c.d - .3, .5]]), qp = AT(c.i, '奇葩') - c.t0;
  const cringe = seg(tt, 1.6, 2.0) * (1 - seg(tt, 3.0, 3.4)), laugh = lt >= qp ? pulse(tt, qp, .7) : 0, shake = Math.sin(tt * 44) * (cringe * .02 + laugh * .035);
  const sip = ss(seg(tt, 3.6, 4.1)) * (1 - ss(seg(tt, 4.7, 5.1)));
  cam(lerp(1.75, 1.95, ss(lt / c.d)), 1210, 470);
  // over the rim: eyes left to the performance, away, back; a wince; and at 奇葩 a laugh she swallows
  const look = tt < 1.2 ? 0 : tt < 2.2 ? 1 : tt < 3.0 ? -1 : tt < qp ? 1 : 0;
  cafe({ keyOn: 1, noCups: 1, he: { lean: -.2 + .05 * Math.sin(tt * 2.5), handF: [130, -150 + 34 * Math.sin(tt * 5)], bendF: -1, nod: .1 * Math.sin(tt * 5) },
    she: { lean: .02 + shake - .05 * cringe, nod: -.1 * sip + laugh * .12 * Math.sin(tt * 20), handF: [lerp(112, 58 - sip * 10, up), lerp(-64, -146 - sip * 12, up) + laugh * 8 * Math.sin(tt * 30)],
      headO: { lid: laugh > .15 ? 1 : cringe > .5 ? .55 : undefined, wide: cringe > 0 && cringe <= .5, look, brow: laugh > .15 ? -.5 : cringe > .3 ? .8 : (look > 0 ? .35 : 0), hairUp: cringe * .7 },
      hold: h => { cup(h[0] + 14, h[1] + 22, 1, tint(R, .5), R); if (laugh > .1) for (let i = 0; i < 3; i++) { const u = (tt - qp) * 1.6 + i * .12; circle(h[0] + 30 + u * (30 + i * 16), h[1] - 26 - u * 60 + u * u * 110, 5, R); } } },
    front: () => { cup(CF.cx - 78, CF.top, 1, Y, T); } });
  return { gate: [1, 0, 0] };
};
// the matchmaker calls: the third plate arrives as a voice from off the sheet, and is turned down
S.herNo = (lt, c) => {
  const tt = step(lt), no = AT(c.i, '终于') - c.t0, hit = pulse(lt, no, .22);
  cam(1.2, 940, 620);
  rect(-200, -200, 2400, 1500, tint(R, .24)); rect(-200, 820, 2400, 500, R);
  rrect(1340, 250, 300, 570, 10, R); rect(1368, 280, 244, 250, tint(R, .5)); circle(1392, 560, 12, P);     // her own front door
  const inn = eo(seg(lt, .1, .7)), out = eo(seg(lt, no, no + .3));
  layer(() => { const x = lerp(-420, 580, inn) - out * 60; g.save(); g.translate(x, 330 + out * 30); g.rotate(-out * .14); bubble(0, 0, 640, 190, Y, -1, 40); say('mp', '怎么样？成了吧？', 0, 26, FZ(68), P); g.restore(); }, 6);
  if (lt >= no) { const k = pop(lt, no, .22); layer(() => { g.save(); g.translate(900, 540); g.scale(k, k); g.rotate(.04); bubble(0, 0, 420, 170, R, 1, 34); say('no', '不合适！', 0, 30, FZ(86), P); g.restore(); }, 6); }
  layer(() => figure(1190, 640, 1.2, LOOK.hua1, { dir: -1, legs: 'stand', lean: .03 - hit * .08, handF: [40, -150], bendF: -1, handB: lt >= no ? [130, -120] : undefined, bendB: -1, headO: { lid: lt >= no ? 1 : .3, mouth: lt >= no ? 'smile' : 'flat', sway: -hit }, hold: h => rrect(h[0] - 10, h[1] - 44, 22, 46, 6, R) }));
  return { gate: [1, 0, 1] };
};
// thank you for being greasy: she crosses the sheet, getting lighter
S.herWalk = (lt, c) => {
  const tt = step(lt), x = lerp(-140, 2080, lt / c.d);
  rect(0, 0, W, H, P); circle(1380, 470, 250, Y); rect(0, 760, W, 320, R);
  for (let i = 0; i < 5; i++) rect(180 + i * 400, 560 - hash(i * 2.2) * 150, 150, 200 + hash(i * 2.2) * 150, tint(R, .24));
  const ph = tt * 6.2, hop = Math.abs(Math.sin(ph)) * 16;
  layer(() => figure(x, 760 - 176 * .9 - hop, .9, LOOK.hua1, { legs: 'walk', ph, lean: .08, handF: [50 * Math.sin(ph), -20], handB: [-50 * Math.sin(ph), -20], headO: { lid: 1, mouth: 'smile', sway: Math.sin(ph + 1) * .8 } }));
  return { gate: [1, 0, 1] };
};
// 3. both plates down, far out of register. First his version over a ghost of hers, then the reverse
S.preHe = (lt, c) => {
  const tt = step(lt), drop = ss(seg(tt, 1.2, 2.4));
  cam(lerp(1.3, 1.42, ss(lt / c.d)), 760, 540);
  cafe({ keyOn: 1, he: { lean: lerp(-.2, .2, drop), handF: [lerp(118, 60, drop), lerp(-62, -150, drop)], bendF: -1, nod: .14 * drop, headO: { lid: drop > .9 && Math.floor(tt * 2) % 4 === 1 ? 1 : drop * .6, look: tt > 3.2 ? (Math.floor(tt * 1.2) % 2 ? 1 : -1) : 0, brow: .2 * drop + (tt > 3.2 && Math.floor(tt * 1.2) % 2 ? .3 : 0), mouth: tt > 2.6 && Math.floor(tt * 4) % 3 === 0 ? 'open' : 'flat' }, hold: drop > .5 ? h => line([[h[0] - 6, h[1] + 8], [h[0] + 4, h[1] + 44]], 7, T) : null }, she: { headO: { lid: .5 } } });
  return { gate: [.3, 1, 0], off: [[34, -20], [-10, 6], [0, 0]] };
};
S.preShe = (lt, c) => {
  const tt = step(lt), drop = ss(seg(tt, .8, 2.0));
  cam(lerp(1.3, 1.42, ss(lt / c.d)), 1160, 540);
  cafe({ keyOn: 1, he: { lean: .2, handF: [60, -150], bendF: -1, nod: .14, headO: { lid: .6 } },
    she: { lean: lerp(.03, -.16, drop), handF: [lerp(112, 40, drop), lerp(-64, -74, drop)], handB: [lerp(60, 50, drop), lerp(-20, -64, drop)], bendF: -1, tilt: -.12 * drop, headO: { lid: tt > 2.4 && Math.floor(tt * 2) % 5 === 0 ? 1 : lerp(.3, .7, drop), brow: -.4 * drop + (tt > 2.4 && Math.floor(tt) % 2 ? .5 : 0), mouth: tt > 2.2 && Math.floor(tt * 4) % 3 === 0 ? 'open' : 'flat', look: tt > 3 && Math.floor(tt * 1.3) % 2 ? 1 : -1 } } });
  return { gate: [1, .3, 0], off: [[10, -6], [-34, 20], [0, 0]] };
};
// the double take, the plates drifting; then the one moment of true register
S.preBoth = (lt, c) => {
  const tt = step(lt), snapT = c.snap - c.t0, on = lt >= snapT, look = ss(seg(tt, .5, 1.3));
  const z = on ? lerp(1.12, 1.2, eo(seg(lt, snapT, snapT + 3))) : lerp(1.0, 1.06, lt / snapT);
  cam(z, 960, 560);
  const grin = on ? 1 : 0, lf = ss(seg(tt, snapT - 2.2, snapT - .6));
  cafe({ keyOn: 1, lampY: on ? 130 : 250,
    he: { lean: lerp(.2, .0, look) + .1 * lf, handF: on ? [150, -70] : [90, -110], bendF: -1, nod: -.1 * look, headO: { wide: !on && look > .5 && tt < 2.6, brow: on ? -.3 : .5, mouth: on ? 'smile' : (look > .5 ? 'open' : 'flat') } },
    she: { lean: lerp(-.16, -.02, look) + .1 * lf, handF: on ? [150, -70] : [60, -90], handB: [56, -40], bendF: on ? 1 : -1, headO: { wide: !on && look > .5 && tt < 2.6, lid: on ? 0 : .2, brow: on ? -.2 : .5, mouth: on ? 'smile' : (look > .5 ? 'open' : 'flat') } },
    back: () => { if (on) { say('sxqz', '双向欺诈', 960, 340, FZ(140), K, 'center', 18); } } });
  // drift apart, wider and wider, then snap true on 双向欺诈
  const d = on ? Math.exp(-(lt - snapT) * 16) * Math.cos((lt - snapT) * 42) * .5 : lerp(.5, 1, ss(lt / snapT));
  return { gate: [1, 1, on ? 1 : 0], off: [[46 * d, -26 * d], [-46 * d, 26 * d], [0, 0]], exact: on };
};
