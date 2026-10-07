// Shots, part 2: the plates slide apart (chorus 1), hearsay in halftone (verse 2), masks (pre-chorus 2)
import { g, W, H, clear, rect, rrect, line, circle, ellipse, poly, text, over, layer, blob, curve, limb } from './engine/draw.js';
import { clamp, lerp, seg, ss, eio, eo, ei, back, hash, mulberry, TAU } from '/core/lib.js';
import { R, T, Y, K, P, SKIN, tint, LOOK, figure, head, cup, steam, key, chair, table, lamp, bubble, laptop, moto, rider, sofa, glass, mask, warrior, regmark, scissors, house } from './cast.js';
import { LINES, BEATS, PULSE, BARS, FL, L1, AT, CF, CUES, DUR, FZ, KICKS, L0, OPEN, S, SHOTS, TEXTS, beatAt, before, cafe, cafeRoom, cam, clip, cutL, kf, near, pop, pulse, reset, road, room, say, say2, setData, step, sweepX } from './kit.js';
import { timeline3 } from './shots3.js';

export const hear = (L, a = .55) => ({ ...L, ink: tint(L.ink, a + .2), top: tint(L.top, a), bottom: tint(L.bottom, a), leg: L.leg === SKIN ? SKIN : tint(L.leg, a), shoe: tint(L.shoe, a + .2), arm: L.arm === SKIN ? SKIN : tint(L.arm, a) });
export const CROWD = { ink: Y, top: Y, bottom: Y, leg: Y, shoe: Y, hair: 'bob', arm: Y, w: 62, sh: 34 };
const mirror = fn => { g.save(); g.translate(W, 0); g.scale(-1, 1); try { fn(); } finally { g.restore(); } };
const css = c => 'rgb(' + c.map(v => Math.round(v * 255)).join(',') + ')';

// 4. thank you for not loving me: a handshake over the one shared thing, then the sheet comes apart down the middle
S.thanks = (lt, c) => {
  const tt = step(lt), sh = ss(seg(tt, .3, 1.1)), pump = Math.sin(tt * 9) * 10 * sh * (1 - seg(tt, 3.6, 4.2));
  cam(lerp(1.2, 1.1, ss(lt / c.d)), 960, 560);
  cafe({ keyOn: 1, lampY: 130,
    he: { lean: lerp(0, .22, sh), handF: [lerp(150, 262, sh), lerp(-70, -100, sh) + pump], bendF: -1, headO: { brow: Math.floor(tt * 2) % 2 ? -.5 : -.2, mouth: Math.floor(tt * 4) % 3 === 0 ? 'open' : 'smile' } },
    she: { lean: lerp(-.02, .2, sh), handF: [lerp(150, 262, sh), lerp(-70, -100, sh) + pump], bendF: 1, headO: { brow: Math.floor(tt * 2) % 2 ? -.1 : -.4, mouth: Math.floor(tt * 4) % 3 === 1 ? 'open' : 'smile' } },
    back: () => { if (new URLSearchParams(location.search).has('poster')) say2('sxqz', '最佳路人', 960, 340, FZ(150), 9, 6, 'center', 18); else say('sxqz', '双向欺诈', 960, 340, FZ(140), K, 'center', 18); } });
  return { exact: lt < .8 };
};
S.split = (lt, c) => {
  const tt = step(lt), gap = eio(seg(lt, .5, 3.4)) * 330, z = lerp(1.1, .82, eio(seg(lt, .3, 4.5)));
  const wave = Math.sin(tt * 8) * 30, up = ss(seg(tt, 1.4, 2.2));
  rect(0, 0, W, H, P);
  for (const k of [-1, 1]) {                     // the same café, printed as two halves that slide apart
    g.save(); g.setTransform(z, 0, 0, z, 960 * (1 - z) + k * gap * z, 560 * (1 - z));
    g.beginPath(); if (k < 0) g.rect(-900, -400, 1860, 2200); else g.rect(960, -400, 1860, 2200); g.clip();
    cafe({ keyOn: 1, noHe: k > 0, noShe: k < 0,
      he: { lean: lerp(.22, -.1, up), handF: [lerp(200, 40, up), lerp(-100, -230, up) + wave * up * .4], bendF: -1, headO: { mouth: 'smile', brow: -.3 } },
      she: { lean: lerp(.2, -.08, up), handF: [lerp(200, 40, up), lerp(-100, -230, up) - wave * up * .4], bendF: 1, headO: { mouth: 'smile', lid: .2 } } });
    g.restore();
  }
  reset(); cropMarks2();
  return {};
};
export function cropMarks2(c = K) { for (const [x, sx] of [[70, 1], [W - 70, -1]]) for (const [y, sy] of [[60, 1], [H - 60, -1]]) { rect(x, y - 2, 46 * sx, 4, c); rect(x - 2, y, 4, 46 * sy, c); } }

// her half: a night desk and nobody to wait on. Code prints line by line, like a proof of its own
export function codeLines(n, x, y, seed, c1 = R, c2 = P) {
  for (let i = 0; i < n; i++) {
    const ind = [0, 1, 2, 2, 1, 2, 3, 2, 1, 0, 1, 2][i % 12] * 34, w = 90 + hash(i * 3.7 + seed) * 250;
    rrect(x + ind, y + i * 34, w * .45, 16, 8, i % 4 === 1 ? Y : c1); if (i % 3 !== 2) rrect(x + ind + w * .45 + 14, y + i * 34, w * .55, 16, 8, i % 5 === 0 ? c2 : c1);
  }
}
S.herCode = (lt, c) => {
  const tt = step(lt);
  if (c.mode === 'ins') {            // insert: the screen, line by line, a block cursor waiting
    const n = Math.min(13, 3 + Math.floor(lt * 2.4));
    rect(0, 0, W, H, R); cam(lerp(1.0, 1.08, lt / c.d), 700, 500);
    g.save(); g.translate(250, 130); g.scale(3.1, 3.1); codeLines(n, 0, 0, 1, P, P);
    if (Math.floor(tt * 3) % 2) rect([0, 1, 2, 2, 1, 2, 3, 2, 1, 0, 1, 2][n % 12] * 34, n * 34 - 2, 12, 20, P);
    g.restore();
    return { gate: [1, 0, 0] };
  }
  const free = c.mode === 'free', relax = free ? ss(seg(tt, .1, 1.1)) : 0;
  if (free) cam(lerp(1.22, 1.0, eio(seg(lt, 0, 3))), 760, 560, lerp(0, 90, eio(seg(lt, 0, 3))), 0); else cam(lerp(1.0, 1.12, ss(lt / c.d)), 820, 560);
  room({ back: () => { rrect(170, 170, 520, 430, 16, tint(R, .5)); clip(170, 170, 520, 430, () => codeLines(free ? 11 : Math.min(11, Math.floor((lt + .6) * 1.2)), 206, 204, 1)); } });
  const ty = Math.sin(tt * 26) * 5 * (1 - relax), nodk = free ? 0 : .05 * Math.sin(tt * 3.1);
  layer(() => { chair(690, CF.seat, 1, R); figure(700, CF.seat, 1.15, LOOK.hua2, { legs: relax > .5 ? 'feetup' : 'sit', lean: lerp(.14, -.24, relax), nod: nodk, handF: [lerp(150, 60, relax), lerp(-66, -150, relax) + ty], handB: [lerp(140, 30, relax), lerp(-62, -40, relax) - ty], bendF: relax > .5 ? -1 : 1,
    headO: { mouth: relax > .3 ? 'smile' : (Math.floor(tt * 1.5) % 3 ? 'flat' : 'smile'), lid: relax > .7 && tt > 3.4 ? 1 : undefined, brow: free ? -.2 : (Math.floor(tt * .8) % 2 ? .3 : 0) }, hold: relax > .5 ? h => cup(h[0] + 16, h[1] + 20, .9, P, R) : null }); });
  layer(() => { laptop(1010, 592, 1.5, R); if (relax < .5) cup(1210, 592, 1, P, R); }, 4);
  if (relax < .5) steam(1210, 540, lt, R);
  if (free) {   // the order nobody is giving: a slab of the third plate arrives, is not looked at, and drops
    const inn = eo(seg(lt, .7, 1.2)), fall = Math.max(0, lt - 4.3);
    if (lt > .7) layer(() => { g.save(); g.translate(lerp(-360, 330, inn), 250 + fall * fall * 900); g.rotate(-.04 + fall * 1.2); bubble(0, 0, 500, 150, Y, -1, 36); say('fan', '饭好了没？', 0, 28, FZ(76), P); g.restore(); }, 6);
  }
  return { gate: [1, 0, 1], sweep: [OPEN, OPEN, free ? sweepX(lt, 0, .6) : -100] };
};
// his half: the road, and no one checking where he is
S.hisRide = (lt, c) => {
  const tt = step(lt), cx = lt * 620, q = c.t2 - c.t0;
  cam(lerp(1.14, 1.0, ss(lt / c.d)), 900, 700);
  road(cx);
  const bob = Math.sin(lt * 9) * 3;
  layer(() => rider(820, 838 + bob, 1.05, cx / 60, { scarf: () => { const p = []; for (let k = 0; k <= 6; k++) p.push([-20 - k * 24, -150 + Math.sin(tt * 9 - k * .9) * 10 * (k / 3)]); curve(p, 14, T); } }));
  if (lt >= q) {   // the message that never comes: a slab of the third plate, blown off the back
    const u = seg(lt, q, q + 3.0), k = pop(lt, q, .25);
    layer(() => { g.save(); g.translate(lerp(1250, 520, ss(u)), 300 + Math.sin(tt * 5) * 14); g.rotate(-u * .3 + Math.sin(tt * 5) * .05); g.scale(k, k); bubble(0, 0, 330, 120, Y, -1); say('ck', '在哪呢？', 0, 26, FZ(64), P); g.restore(); }, 5);
  }
  return { gate: [0, 1, 1] };
};
// parallel universes: two strips of one sheet, running in opposite directions
export function herStreet(cx) {
  rect(-200, -300, 4000, 1100, tint(R, .24)); rect(-200, 800, 4000, 500, R);
  for (let i = 0; i < 11; i++) { const x = ((i * 380 - cx * .5) % 4180 + 4180) % 4180 - 400, h = 260 + hash(i * 5.1) * 260; rect(x, 800 - h, 250, h, tint(R, .5)); for (let k = 0; k < 3; k++) rect(x + 40 + k * 66, 800 - h + 50, 36, 50, hash(i * 3 + k) > .6 ? Y : P); }
  for (let i = 0; i < 8; i++) { const x = ((i * 520 - cx) % 4160 + 4160) % 4160 - 300; rect(x, 560, 12, 240, R); circle(x + 6, 548, 26, Y); }
}
S.parallel = (lt, c) => {
  const tt = step(lt), z = lerp(1.0, .86, eio(seg(lt, 0, c.d)));
  rect(0, 0, W, H, P);
  const strip = (y, fn) => { g.save(); g.setTransform(z, 0, 0, z, 960 * (1 - z), 540 * (1 - z)); g.beginPath(); g.rect(60, y, 1800, 430); g.clip(); g.transform(.55, 0, 0, .55, 60, y - 130); fn(); g.restore(); };
  strip(70, () => { const cx = 3000 + lt * 620; road(cx); layer(() => rider(900 + lt * 90, 838, 1.05, cx / 60)); });
  strip(580, () => { herStreet(-lt * 300); const ph = tt * 6.2; layer(() => figure(2500 - lt * 190, 800 - 176, 1.0, LOOK.hua2, { dir: -1, legs: 'walk', ph, lean: .06, handF: [50 * Math.sin(ph), -20], handB: [-50 * Math.sin(ph), -20], headO: { mouth: 'smile' } })); });
  reset(); cropMarks2();
  return {};
};
// passers-by: one street, opposite directions, and for a few frames the two inks overprint
S.passers = (lt, c) => {
  const tt = step(lt), meet = c.meet - c.t0, v = 250;
  rect(0, 0, W, H, P); rect(0, 800, W, 280, tint(Y, .34));
  for (let i = 0; i < 6; i++) { const h = 300 + hash(i * 4.3) * 300; rect(40 + i * 320, 800 - h, 250, h, tint(Y, i % 2 ? .5 : .34)); }
  for (let i = 0; i < 6; i++) {   // everyone else, on the third plate
    const dir = i % 2 ? 1 : -1, x = ((hash(i * 9.1) * 2400 + dir * tt * (150 + i * 20)) % 2400 + 2400) % 2400 - 240, ph = tt * 6 + i;
    layer(() => figure(x, 800 - 176 * .9, .9, CROWD, { dir, legs: 'walk', ph, handF: [40 * Math.sin(ph), -20], handB: [-40 * Math.sin(ph), -20], headO: { skin: tint(Y, .5), ink: Y } }), 4);
  }
  const xs = 960 + (lt - meet) * v, xh = 960 - (lt - meet) * v, ph = tt * 6.2;
  layer(() => figure(xs, 800 - 176, 1.0, LOOK.hua2, { legs: 'walk', ph, lean: .06, handF: [50 * Math.sin(ph), -20], handB: [-50 * Math.sin(ph), -20] }));
  over(() => figure(xh, 800 - 176, 1.0, LOOK.fa3, { dir: -1, legs: 'walk', ph: ph + 1, lean: .06, handF: [50 * Math.sin(ph + 1), -20], handB: [-50 * Math.sin(ph + 1), -20] }));
  if (lt >= c.tag - c.t0) {   // each is filed under the other's ink
    layer(() => { rrect(xs - 110, 300, 220, 84, 10, P); say('tagA', '路人甲', xs, 362, FZ(58), T); rect(xs - 3, 384, 6, 40, P); }, 6);
    layer(() => { rrect(xh - 110, 190, 220, 84, 10, P); say('tagB', '路人甲', xh, 252, FZ(58), R); rect(xh - 3, 274, 6, 150, P); }, 6);
  }
  return {};
};
// the roof they did not end up under
S.roof = (lt, c) => {
  const tt = step(lt), zha = c.zha - c.t0, sh = lt >= zha ? pulse(lt, zha, .5) : ss(seg(lt, 1.2, zha)) * .35, jx = Math.sin(lt * 50) * 9 * sh;
  rect(0, 0, W, H, P); rect(0, 860, W, 220, tint(Y, .34));
  cam(lerp(1.0, 1.1, ss(lt / c.d)), 960, 600);
  const drop = eo(seg(lt, 0, .5));
  layer(() => { g.save(); g.translate(jx, (1 - drop) * -900); poly([[360, 430], [960, 90], [1560, 430]], Y); rect(450, 430, 1020, 430, Y); rect(1240, 150, 80, 180, Y); rrect(600, 500, 720, 300, 12, P); g.restore(); }, 0);
  g.save(); g.translate(jx, (1 - drop) * -900);
  clip(600, 500, 720, 300, () => {   // one window, two people, far too close
    const a = Math.sin(tt * 14) * .06;
    g.save(); g.translate(790, 760); g.scale(2.6, 2.6); head(LOOK.fa3, { brow: -.8, mouth: 'open' }); g.restore();
    over(() => { g.save(); g.translate(1130, 760); g.scale(-2.6, 2.6); g.rotate(a); head(LOOK.hua2, { brow: -.8, mouth: 'open' }); g.restore(); });
    for (let i = 0; i < 5; i++) { const y = 520 + i * 44, f = (Math.floor(tt * 12) + i) % 2 * 16; over(() => poly([[910, y], [1010 + f, y + 10], [910, y + 22]], T)); over(() => poly([[1010, y + 16], [910 - f, y + 26], [1010, y + 38]], R)); }
  });
  g.restore();
  if (lt >= zha) for (let i = 0; i < 16; i++) { const u = (lt - zha) * (1 + hash(i) * .6), x = 420 + hash(i * 3.3) * 1080; rect(x + u * (hash(i * 7) - .5) * 200, 400 + hash(i * 2.2) * 300 + u * u * 520, 34, 26, i % 3 ? Y : tint(Y, .5)); }
  return {};
};
// the happiest ending: two lit windows, a long way apart, in one town
S.windows = (lt, c) => {
  const tt = step(lt), z = lerp(1.5, 1.0, eio(seg(lt, 0, c.d * .8)));
  rect(0, 0, W, H, P);
  cam(z, 960, 640);
  circle(960, 230, 90, Y);
  for (let i = 0; i < 9; i++) { const h = 240 + hash(i * 6.1) * 380, x = 30 + i * 210; rect(x, 900 - h, 190, h + 300, tint(Y, i % 2 ? .34 : .5)); }
  const win = (x, y, c1, fn) => { layer(() => { rrect(x - 90, y - 110, 180, 220, 10, tint(c1, .24)); clip(x - 90, y - 110, 180, 220, fn); rect(x - 90, y + 104, 180, 12, c1); }, 4); };
  win(360, 560, R, () => { figure(340, 640, .62, LOOK.hua2, { lean: .1, handF: [130, -60], handB: [120, -56] }); laptop(420, 610, .7, R); });
  win(1560, 470, T, () => { sofa(1480, 540, 150, T); figure(1570, 536, .62, LOOK.fa3, { dir: -1, lean: -.3, legs: 'cross', ph: tt, handF: [60, -120], bendF: -1 }); });
  // the plates breathe apart while the song does, and come back on the next downbeat
  const d = ss(seg(lt, c.d - 3.2, c.d - .3));
  return { off: [[-12 * d, 5 * d], [12 * d, -5 * d], [0, 9 * d]] };
};

// 5. verse 2: what each has only heard about the other is a tint on a phone, never a solid
function phone(c1, fn, tilt = 0) {
  g.save(); g.translate(960, 560); g.rotate(tilt);
  layer(() => { rrect(-330, -500, 660, 1000, 70, c1); rrect(-290, -440, 580, 860, 30, P); rrect(-70, -482, 140, 22, 11, P); }, 0);
  clip(-290, -440, 580, 860, fn);
  layer(() => { limb([-700, 700], [-420, 330], 150, c1); for (let i = 0; i < 4; i++) limb([360, -80 + i * 110], [300, -60 + i * 110], 70, SKIN); circle(-350, 250, 62, SKIN); limb([-420, 330], [-350, 250], 90, SKIN); });
  g.restore();
}
S.hearHer = (lt, c) => {
  const tt = step(lt), cut = c.cut - c.t0, sw = eio(seg(lt, c.swipe - c.t0, c.swipe - c.t0 + .45));
  rect(0, 0, W, H, tint(T, .24));
  cam(lerp(1.0, 1.06, lt / c.d), 960, 540);
  phone(T, () => {
    g.save(); g.translate(-sw * 620, 0);
    rect(-290, -440, 580, 860, tint(R, .2));
    const L = hear(lt >= cut ? LOOK.hua2 : LOOK.hua1); L.hair = lt >= cut ? 'bob' : 'long'; L.leg = SKIN; L.arm = SKIN;
    figure(-30, 170, 1.5, L, { lean: 0, handF: [40, -40], headO: { ink: tint(R, .75), lid: 1, mouth: 'smile' } });
    scissors(lerp(-270, -160, ss(seg(tt, .3, cut))), -40, 1.1, 1 - seg(tt, cut - .15, cut) + seg(tt, cut + .2, cut + .6), R, -.2);
    if (lt >= cut) { const u = lt - cut, dy = u * u * 900; blob([[-110, 20 + dy], [-150, 80 + dy], [-120, 190 + dy], [-80, 110 + dy]], tint(R, .75)); }
    // next picture: the dress that stayed on its hanger
    g.translate(620, 0); rect(-290, -440, 580, 860, tint(R, .34));
    line([[-90, -250], [0, -300], [90, -250]], 10, R); line([[0, -300], [0, -340]], 10, R); circle(0, -350, 14, R);
    blob([[-70, -250], [70, -250], [60, -120], [120, 60], [200, 330], [0, 370], [-200, 330], [-120, 60], [-60, -120]], P);
    poly([[-58, -130], [58, -130], [50, -100], [-50, -100]], tint(R, .5));
    g.restore();
  }, -.05);
  return {};
};
// the tea he did not buy: a cup-shaped hole that never gets its plate
function ghostCup(x, y, s, c) {
  g.save(); g.translate(x, y); g.scale(s, s); g.setLineDash([14, 12]); g.lineWidth = 6; g.strokeStyle = css(c); g.lineCap = 'butt';
  g.beginPath(); g.moveTo(-30, -110); g.lineTo(30, -110); g.lineTo(22, 0); g.lineTo(-22, 0); g.closePath(); g.stroke(); g.beginPath(); g.moveTo(8, -110); g.lineTo(22, -170); g.stroke(); g.setLineDash([]); g.restore();
}
S.hisTea = (lt, c) => {
  const tt = step(lt), tea = c.tea - c.t0, heart = c.heart - c.t0, popT = c.pop - c.t0, hug = ss(seg(tt, .4, 1.3));
  const close = lt >= heart - .01, z = !close ? lerp(1.3, 1.42, ss(lt / heart)) : lerp(1.75, 1.85, seg(lt, heart, c.d));
  cam(z, close ? 930 : 800, close ? 500 : 540);
  const rise = ss(seg(lt, heart + .3, popT - .25)), gone = lt >= popT, reach = ss(seg(tt, popT - .45, popT));
  cafe({
    he: { lean: -.2 + (gone ? 0 : .1 * rise), handF: reach > 0 ? [lerp(30, 215, reach), lerp(-70, -175, reach)] : [lerp(118, 30, hug), lerp(-62, -70, hug)], bendF: -1, handB: [lerp(-60, 44, hug), lerp(-30, -58, hug)],
      headO: { brow: gone ? -.4 : .8 * rise - .4, look: 1, mouth: gone ? 'smile' : 'flat', wide: rise > .3 && !gone }, mid: () => { rrect(14, -100, 78, 60, 8, P); rrect(18, -96, 70, 52, 8, T); } },
    she: { headO: { lid: .5 } },
    front: () => {
      if (lt >= tea) ghostCup(1070, CF.top, 1.1, T);
      if (lt >= heart + .3 && lt - popT < .5) {
        const f = Math.max(0, lt - popT), x = lerp(1070, 900, rise), y = lerp(430, 330, rise) + Math.sin(tt * 5) * 8, s = .5 + rise * .6;
        for (const k of [-1, 1]) { g.save(); g.translate(x + k * f * 300, y + f * f * 900); g.scale(s, s); g.rotate(k * f * 2); clip(k < 0 ? -80 : 0, -80, 80, 160, () => { circle(-24, -16, 30, tint(T, .5)); circle(24, -16, 30, tint(T, .5)); poly([[-50, 0], [50, 0], [0, 62]], tint(T, .5)); }); g.restore(); }
      }
    },
  });
  return { gate: [0, 1, 0] };
};
// what he was actually guarding: a wallet and a sofa
S.hisSofa = (lt, c) => {
  const tt = step(lt), lift = ss(seg(tt, .5, 1.2)) * (1 - ss(seg(tt, 2.6, 3.3))), kiss = pulse(tt, 1.9, .3), pat = lift < .1 ? Math.sin(tt * 7) * .5 + .5 : 0;
  rect(0, 0, W, H, tint(T, .24)); rect(0, 820, W, 260, T);
  cam(lerp(2.0, 1.7, ss(lt / c.d)), 1010, 610);
  lamp(700, -100, 330, 70, Y, T);
  layer(() => sofa(560, 660, 820, T), 6);
  // flat on his back, the wallet held up to the light, kissed, and tucked back on his chest
  layer(() => { g.save(); g.translate(1170, 628); g.rotate(-Math.PI / 2 + .12); figure(0, 0, 1.15, LOOK.fa3, { legs: 'stand', lean: .1, handF: [lerp(74 + pat * 14, 176, lift), lerp(-44, -150 + kiss * 20, lift)], bendF: -1, handB: [-20, -150], bendB: -1, nod: .25 * lift,
    headO: { lid: lift > .5 ? undefined : 1, look: 1, mouth: kiss > .3 ? 'open' : 'smile', brow: lift > .5 ? -.5 : 0 },
    hold: h => { g.save(); g.translate(h[0] + 6, h[1] - 6); g.rotate(lift * .5); rrect(-40, -52, 80, 104, 12, P); rrect(-34, -46, 68, 92, 9, T); rect(-34, -6, 68, 8, P); circle(16, 22, 9, Y); g.restore(); } }); g.restore(); });
  if (kiss > .05) for (let i = 0; i < 3; i++) circle(900 + i * 34, 430 - (tt - 1.9) * 120 - i * 16, 9 - i * 2, Y);
  return { gate: [0, 1, 1] };
};
S.hearHim = (lt, c) => {
  rect(0, 0, W, H, tint(R, .24));
  cam(lerp(1.0, 1.06, lt / c.d), 960, 540);
  mirror(() => phone(R, () => {
    g.save(); g.scale(-1, 1); g.translate(-290, -440); g.scale(.62, .62); g.translate(-420, 200); g.globalAlpha = .62;
    road(lt * 420); rider(900, 838 + Math.sin(lt * 9) * 3, 1.05, lt * 7); g.globalAlpha = 1; g.restore();
  }, -.05));
  return {};
};
// if he had been normal that day: the polite version, printed as a tint of her own ink, and cut loose
S.herIf = (lt, c) => {
  const tt = step(lt), cutT = c.cut - c.t0, on = lt < cutT, hm = ss(seg(tt, c.hm - c.t0, c.hm - c.t0 + .6)), t2 = c.t2 - c.t0;
  cam(lt < t2 - .3 ? lerp(1.2, 1.3, lt / c.d) : 1.5, 960, 540);
  const gone = on ? 0 : seg(lt, cutT, cutT + .5), rs = ss(seg(tt, cutT - .5, cutT));
  cafe({ noHe: 1,
    she: { lean: on ? -.02 : -.12, tilt: -.16 * hm * (on ? 1 : 0), handF: lt > t2 - .3 ? [lerp(100, 190, rs), lerp(-66, -130, rs)] : [100, -66], headO: { lid: on ? .2 : 1, brow: on ? .4 * hm : -.3, mouth: on ? 'flat' : 'smile' }, hold: lt > t2 - .3 ? h => scissors(h[0] + 10, h[1], .9, on ? 1 - seg(tt, cutT - .2, cutT) : 0, R, -.1) : null },
    mid: () => {
      if (gone < 1) { g.save(); g.translate(0, gone * gone * 700); layer(() => figure(CF.heX, CF.seat, 1.15, hear(LOOK.fa1, .5), { lean: .1, handF: [150, -80], bendF: -1, headO: { ink: tint(R, .75), mouth: 'smile' }, hold: h => cup(h[0] + 20, h[1] + 26, .9, tint(R, .5), tint(R, .75)) }), 4); g.restore(); }
      if (hm > 0 && lt < t2 - .3) say('q', '？', 1330, 330 - hm * 20, FZ(120), R);
      // the tangle between them, and the cut
      const n = 40, pts = []; for (let i = 0; i <= n; i++) { const u = i / n, drop = on ? 0 : (lt - cutT) ** 2 * 900 * (u < .5 ? 1 : .25); pts.push([lerp(760, 1160, u) + Math.sin(u * 37 + 1) * 40, 430 + Math.sin(u * 23) * 46 + Math.cos(u * 51) * 24 + drop]); }
      if (lt > t2 - .3 && lt < cutT + .7) { if (on) curve(pts, 9, R); else { curve(pts.slice(0, 21), 9, R); curve(pts.slice(22), 9, R); } }
    } });
  return { gate: [1, 0, 0] };
};
S.herFree = (lt, c) => {
  const tt = step(lt), turn = c.turn - c.t0, z = lerp(1.25, .8, eio(seg(lt, .2, c.d))), go0 = Math.max(0, lt - turn);
  g.setTransform(z, 0, 0, z, lerp(1280, 1000, ss(seg(lt, turn, c.d))) - (1280 + go0 * 250) * z, 620 * (1 - z));   // the camera leaves with her
  rect(-2000, -2000, 9000, 5000, P); circle(2900, 300, 330, Y); rect(-2000, CF.floor, 9000, 1400, R);
  clip(-900, -400, 2760, 2400, () => cafeRoom());
  layer(() => { chair(CF.heX - 12, CF.seat, 1, T); chair(CF.sheX + 12, CF.seat, -1, R); table(CF.cx, CF.top, 300); });
  const go = Math.max(0, lt - turn), x = CF.sheX + 40 + go * 250, ph = tt * 6.2, op = ss(seg(tt, turn + 1.2, turn + 2.2));
  layer(() => figure(x, CF.floor - 176 * 1.15, 1.15, LOOK.hua1, { dir: lt < turn ? -1 : 1, legs: go > 0 ? 'walk' : 'stand', ph, lean: .06, handF: [lerp(50 * Math.sin(ph), 110, op), lerp(-20, -210, op)], handB: [lerp(-50 * Math.sin(ph), -90, op), lerp(-20, -200, op)], bendF: -1, bendB: 1, headO: { mouth: 'smile', lid: 1, sway: go > 0 ? .8 : 0 } }));
  return { gate: [1, 0, 1], sweep: [OPEN, OPEN, sweepX(lt, turn - .2, .8)] };
};

// 6. the masks come off
function bigHead(x, y, s, L, o, dir = 1) { g.save(); g.translate(x, y); g.scale(s * dir, s); rrect(-80, 44, 170, 300, 40, L.top); head(L, o); g.restore(); }
S.maskHe = (lt, c) => {
  const tt = step(lt), off = ss(seg(tt, c.off - c.t0 - .5, c.off - c.t0 + .3));
  rect(0, 0, W, H, tint(R, .24)); cam(lerp(1.0, 1.08, lt / c.d), 900, 500);
  layer(() => bigHead(860, 500, 5.2, LOOK.fa3, { mouth: off > .6 ? (Math.floor(tt * 4) % 3 === 0 ? 'open' : 'smile') : 'flat', brow: off > .6 ? (Math.floor(tt * 2) % 2 ? -.5 : -.1) : .3, look: off > .6 && Math.floor(tt * 1.5) % 2 ? 1 : 0 }));
  layer(() => { const mx = lerp(960, 1380, off), my = lerp(480, 760, off); limb([mx + 120, 1300], [mx + 60, my + 150], 110, T); mask(mx, my, 1.75, 'suit', T, off * .5); circle(mx + 60, my + 150, 58, SKIN); }, 7);
  return {};
};
S.maskShe = (lt, c) => {
  const tt = step(lt), off = ss(seg(tt, c.off - c.t0 - .5, c.off - c.t0 + .3));
  rect(0, 0, W, H, tint(T, .24)); cam(lerp(1.0, 1.08, lt / c.d), 1020, 500);
  layer(() => bigHead(1060, 500, 5.2, LOOK.hua2, { mouth: off > .6 ? (Math.floor(tt * 4) % 3 === 1 ? 'open' : 'smile') : 'flat', brow: off > .6 ? (Math.floor(tt * 2) % 2 ? -.5 : -.1) : .3, look: off > .6 && Math.floor(tt * 1.5) % 2 ? 1 : 0 }, -1));
  layer(() => { const mx = lerp(960, 540, off), my = lerp(480, 760, off); limb([mx - 120, 1300], [mx - 60, my + 150], 110, R); mask(mx, my, 1.75, 'doll', R, -off * .5); circle(mx - 60, my + 150, 58, SKIN); }, 7);
  return {};
};
// under the masks: the same thought, printed twice. Then the ring neither of them wants, and two backs
S.maskBoth = (lt, c) => {
  const tt = step(lt), ringT = c.ring - c.t0, awayT = c.away - c.t0, fT = c.flick - c.t0;
  rect(0, 0, W, H, P); rect(0, 0, 960, 860, tint(R, .24)); rect(960, 0, 960, 860, tint(T, .24));
  cam(lerp(1.06, 1.0, ss(lt / c.d)), 960, 560);
  const up = eo(seg(lt, .2, 1.6)), away = ss(seg(tt, awayT, awayT + 1.0)), apart = ss(seg(lt, ringT, ringT + .5));
  const bx = lerp(330, 120, up) + apart * 700, by = lerp(560, 270, up);
  if (apart < 1) {
    layer(() => { circle(960 - bx, by, 215 * up, T); over(() => circle(960 + bx, by, 215 * up, R)); }, 0);
    if (up > .8 && lt < ringT) say('free', '自由', 960, by + 36, FZ(96), P);
  }
  if (lt >= ringT - .1) {   // the ring: flicked off the sheet
    const fl = Math.max(0, lt - fT), y = lerp(-200, 400, eo(seg(lt, ringT, ringT + .5))) - fl * 1500 + fl * fl * 500;
    layer(() => { g.save(); g.translate(960, y); g.rotate(fl * 6); g.beginPath(); g.arc(0, 0, 120, 0, TAU); g.lineWidth = 40; g.strokeStyle = css(Y); g.stroke(); poly([[-34, -150], [34, -150], [0, -214]], Y); g.restore(); }, 5);
  }
  const flk = pulse(tt, fT - .1, .3);
  const pose = k => ({ dir: k * (away > .5 ? -1 : 1), legs: away > .05 ? 'walk' : 'stand', ph: tt * 6.2, lean: .04, handF: lt >= ringT && away < .05 ? [110 + flk * 80, -150 - flk * 90] : [30, -30], bendF: -1, headO: { mouth: 'smile', lid: away > .5 ? 1 : 0 } });
  const dx = away > .5 ? (lt - awayT - .5) * 190 : 0;
  layer(() => figure(600 - dx, 860 - 176 * 1.05, 1.05, LOOK.fa3, pose(1)));
  layer(() => figure(1320 + dx, 860 - 176 * 1.05, 1.05, LOOK.hua2, pose(-1)));
  return {};
};
// the break before the last chorus: the screen itself opens up until the dots are discs
S.dots = (lt, c) => {
  rect(0, 0, 960, H, tint(R, .3)); rect(960, 0, 960, H, tint(T, .3));
  const u = eio(seg(lt, 0, c.d));
  return { period: lerp(7, 120, u * u), gate: [1, 1, 0] };
};

export function timeline2(shot, kick, snap) {
  shot('thanks', cutL(17, .5), S.thanks); kick(cutL(17, .5), 8);
  shot('split', cutL(18, .7), S.split); kick(AT(18, '错过'), 12);
  const hc = cutL(19, .4), hcB = PULSE.find(b => b >= hc + 4.1), hcC = before(PULSE, AT(19, '也不用') - .2);
  shot('herCode', hc, S.herCode, { mode: 'desk' }); shot('herCodeIns', hcB, S.herCode, { mode: 'ins' }); shot('herCodeFree', hcC, S.herCode, { mode: 'free' });
  kick(hc, 10); kick(hcB, 8); kick(hcC, 10);
  shot('hisRide', cutL(20, .4), S.hisRide, { t2: AT(20, '没人查岗') }); kick(cutL(20, .4), 10);
  shot('parallel', cutL(21), S.parallel); kick(cutL(21), 8);
  const meet = beatAt(AT(22, '路人甲') + .5);
  shot('passers', before(PULSE, L0(22) - 1.2), S.passers, { meet, tag: AT(22, '路人甲') }); kick(meet, 12);
  const zha = beatAt(AT(23, '豆腐渣'));
  shot('roof', cutL(23, .5), S.roof, { zha }); kick(cutL(23, .5), 8); kick(zha, 16);
  shot('windows', cutL(24, .3), S.windows); kick(cutL(25, .2), 10);
  shot('hearHer', cutL(25, .2), S.hearHer, { cut: beatAt(AT(25, '剪')), swipe: AT(25, '也没穿') - .25 }); kick(AT(25, '剪'), 9);
  const popT = beatAt(AT(27, '拿下'));
  shot('hisTea', cutL(26, .3), S.hisTea, { tea: AT(26, '没给'), heart: cutL(27, .1), pop: popT }); kick(cutL(26, .3), 8); kick(popT, 10);
  shot('hisSofa', cutL(28, .1), S.hisSofa); kick(cutL(28, .1), 8);
  shot('hearHim', cutL(29, .3), S.hearHim); kick(cutL(29, .3), 8);
  const cutT = beatAt(AT(31, '斩断'));
  shot('herIf', cutL(30, .3), S.herIf, { hm: AT(30, '纠结'), t2: L0(31), cut: cutT }); kick(cutL(30, .3), 8); kick(cutT, 14);
  shot('herFree', cutL(32, .1), S.herFree, { turn: AT(32, '转身') }); kick(AT(32, '自由'), 8);
  shot('maskHe', cutL(33, .3), S.maskHe, { off: AT(33, '想要') }); kick(cutL(33, .3), 9);
  shot('maskShe', cutL(34, .1), S.maskShe, { off: AT(34, '寻找') }); kick(cutL(34, .1), 9);
  const flick = beatAt(AT(36, '不结婚') + .4);
  shot('maskBoth', cutL(35, .3), S.maskBoth, { ring: L0(36) - .3, flick, away: L0(37) + .4 }); kick(cutL(35, .3), 9); kick(flick, 12);
  shot('dots', before(PULSE, L1(37) + .9), S.dots);
  timeline3(shot, kick);
}
