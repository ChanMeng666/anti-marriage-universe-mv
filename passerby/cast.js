// The cast and props, as plate densities [red, teal, sun]. Flat silhouettes, no outlines.
// Red plate = 阿花 and what is hers; teal plate = 阿发 and what is his; sun plate = everyone else and the light.
import { g, inkA, circle, ellipse, rect, rrect, poly, blob, line, curve, limb, ik, over, text, rot2 } from './engine/draw.js';
import { clamp, lerp, hash, TAU } from '/core/lib.js';

export const R = [1, 0, 0], T = [0, 1, 0], Y = [0, 0, 1], K = [1, 1, 0], P = [0, 0, 0], SKIN = [0, 0, .34];
export const tint = (c, a) => c.map(v => v * a);
export const CLOCK = { t: 0 };   // film time on twos; open eyes blink by it
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];

// who: the ink a character is printed in, and the wardrobe of each era
export const LOOK = {
  hua1: { ink: R, top: R, bottom: R, leg: SKIN, shoe: R, hair: 'long', arm: SKIN, w: 56, sh: 30 },             // the date: long hair, a dress
  hua2: { ink: R, top: R, bottom: tint(R, .45), leg: tint(R, .45), shoe: R, hair: 'bob', arm: R, w: 62, sh: 34 }, // after: a bob, a hoodie
  fa1: { ink: T, top: T, bottom: T, leg: T, shoe: T, hair: 'quiff', arm: T, w: 74, sh: 48, tie: true },         // the date: the suit
  fa2: { ink: T, top: T, bottom: tint(T, .5), leg: tint(T, .5), shoe: T, hair: 'helmet', arm: T, w: 70, sh: 42 }, // after: helmet and jacket
  fa3: { ink: T, top: T, bottom: tint(T, .5), leg: tint(T, .5), shoe: T, hair: 'messy', arm: T, w: 70, sh: 42 },  // after, helmet off
};

// Profile head facing +x, centre (0,0), radius ≈ 36.
export function head(L, o = {}) {
  const ink = o.ink || L.ink, hair = o.hair || L.hair, skin = o.skin || SKIN;
  if (hair === 'helmet') {
    circle(0, -4, 44, ink);
    poly([[8, -16], [45, -14], [44, 8], [10, 6]], P);                 // visor: a slot of paper
    circle(0, 30, 16, skin); rect(-16, 26, 34, 14, ink);             // chin under the collar
    return;
  }
  // long hair hangs behind the neck: draw its back part first
  if (hair === 'long') {
    const up = o.hairUp || 0, sw = o.sway || 0;
    blob([[-10, -44], [-44, -30], [-52 - sw * 10, 30], [-58 - sw * 26, 110 - up * 40], [-40 - sw * 30, 150 - up * 70], [-14 - sw * 12, 120 - up * 30], [-8, 40], [0, 0]], ink);
  }
  circle(0, 0, 35, skin);
  poly([[30, -8], [45, 6], [31, 12]], skin);                           // nose
  rrect(-10, 26, 26, 26, 6, skin);                                     // neck
  // hair cap
  if (hair === 'long') {
    blob([[-38, 8], [-44, -26], [-18, -46], [16, -44], [36, -22], [24, -22], [6, -18], [-10, 0], [-14, 26], [-30, 30]], ink);
    if (o.hairUp) for (let i = 0; i < 9; i++) {                         // the scalp crawls: strands stand up as a travelling wave
      const a = -2.5 + i * .24, ph = (o.ph || 0) * 9 + i * 1.3, len = (20 + 12 * Math.sin(ph)) * o.hairUp;
      const bx = Math.cos(a) * 36, by = Math.sin(a) * 36 - 4;
      curve([[bx, by], [bx + Math.cos(a) * len * .5 + Math.sin(ph) * 5, by + Math.sin(a) * len * .5], [bx + Math.cos(a) * len + Math.sin(ph + 1) * 7, by + Math.sin(a) * len]], 5, ink);
    }
  } else if (hair === 'bob') {
    blob([[-40, 20], [-46, -22], [-20, -47], [18, -45], [38, -22], [22, -22], [4, -16], [-6, 6], [-8, 30], [-34, 36]], ink);
  } else if (hair === 'quiff') {
    blob([[-36, 2], [-42, -24], [-24, -42], [4, -45], [28, -52], [42, -38], [32, -24], [8, -22], [-12, -14], [-20, 4]], ink);
  } else if (hair === 'messy') {
    blob([[-36, 6], [-44, -24], [-30, -48], [-8, -42], [4, -54], [20, -42], [38, -40], [30, -22], [8, -24], [-12, -14], [-20, 8]], ink);
  }
  // eye: one dot of the character's own ink; lid = how closed (0 open … 1 shut), brow = angle
  const ex = 15 + (o.look || 0) * 4, ey = -5;
  const lid = o.lid ?? (!o.wide && ((CLOCK.t + (ink[0] ? 0 : 1.3)) % 2.9) < .17 ? 1 : 0);
  if (lid >= 1) line([[ex - 6, ey + 1], [ex + 6, ey + 1]], 3.5, ink);
  else { circle(ex, ey, o.wide ? 6.5 : 5, ink); if (lid > 0) rect(ex - 8, ey - 8, 16, 3 + lid * 6, skin); }
  if (o.brow != null) line([[ex - 9, ey - 13 - o.brow * 5], [ex + 8, ey - 13 + o.brow * 5]], 3.5, ink);
  if (o.mouth === 'open') ellipse(22, 17, 6, 5, 0, ink);
  else if (o.mouth === 'smile') curve([[14, 15], [21, 19], [28, 14]], 3, ink);
  else if (o.mouth === 'flat') line([[16, 17], [28, 17]], 3, ink);
}

// A figure in profile. Origin = hip, units ≈ px at s = 1 (standing height ≈ 390). dir = +1 faces right.
// o: lean (torso angle, + = forward), nod, legs 'sit' | 'stand' | 'walk' | 'ride' | 'squat', ph (walk phase),
//    handF / handB (hand targets in local coords, default: hanging), headO, hold(handF) callbacks
export function figure(x, y, s, L, o = {}) {
  const dir = o.dir ?? 1;
  g.save(); g.translate(x, y); g.scale(s * dir, s);
  const lean = o.lean || 0, TL = 124;
  const sh = rot2([0, -TL], lean), hc = add(sh, rot2([6, -56], lean + (o.nod || 0)));
  const legs = o.legs || 'sit';
  let kF, fF, kB, fB;
  if (legs === 'sit') { kF = [84, 2]; fF = [88 + (o.footX || 0), 96]; kB = [80, 6]; fB = [70 + (o.footX || 0) * .5, 96]; }
  else if (legs === 'cross') { kF = [84, -4]; fF = [150, 30 + Math.sin((o.ph || 0) * 5) * 8]; kB = [80, 6]; fB = [78, 96]; }
  else if (legs === 'ride') { kF = [72, 30]; fF = [50, 100]; kB = [68, 34]; fB = [44, 102]; }
  else if (legs === 'feetup') { kF = [70, -52]; fF = [118, -8]; kB = [60, -46]; fB = [112, 2]; }
  else {
    const ph = o.ph || 0, st = legs === 'walk' ? 1 : 0, G = 176;
    const foot = p => [Math.sin(p) * 50 * st, G - Math.max(0, Math.cos(p)) * 22 * st];
    fF = legs === 'stand' ? [10, G] : foot(ph); fB = legs === 'stand' ? [-12, G] : foot(ph + Math.PI);
    kF = ik([0, 0], fF, 90, 90, -1)[0]; kB = ik([0, 0], fB, 90, 90, -1)[0];
  }
  const hang = add(sh, [10 + lean * 30, 118]);
  const arm = (t, bend) => ik(sh, t || hang, 64, 60, bend);
  const [eB, hB] = arm(o.handB, o.bendB ?? 1), [eF, hF] = arm(o.handF, o.bendF ?? 1);
  const legW = L.hair === 'long' ? 22 : 34, dress = L.hair === 'long';
  // back arm, back leg
  limb(sh, eB, 26, L.arm); limb(eB, hB, 22, L.arm); circle(hB[0], hB[1], 12, SKIN);
  if (dress) { limb(kB, fB, 20, L.leg); } else { limb([0, 0], kB, legW + 4, L.bottom); limb(kB, fB, legW - 4, L.leg); }
  ellipse(fB[0] + 12, fB[1] + 2, 24, 11, 0, L.shoe);
  // long hair's back part and the torso
  if (o.pre) o.pre();
  g.save(); g.translate(hc[0], hc[1]); g.rotate(lean * .5 + (o.nod || 0) + (o.tilt || 0)); head(L, { ...o.headO, ph: o.ph });
  g.restore();
  limb([0, -4], sh, L.w, L.top);
  poly([add(sh, rot2([-L.sh, -12], lean)), add(sh, rot2([L.sh, -12], lean)), add(sh, rot2([L.sh + 4, 30], lean)), add(sh, rot2([-L.sh - 2, 30], lean))], L.top);   // shoulders
  circle(sh[0] - L.sh * .5, sh[1] - 4, 16, L.top); circle(sh[0] + L.sh * .5, sh[1] - 4, 16, L.top);
  if (L.tie) {   // shirt front and tie: paper and a strip of his ink
    const a = add(sh, rot2([24, -16], lean)), b = add(sh, rot2([34, 40], lean)), c = add(sh, rot2([14, 44], lean));
    poly([a, b, c], P); line([add(sh, rot2([22, -8], lean)), add(sh, rot2([26, 34], lean))], 7, L.ink);
  }
  if (L.hair === 'bob') { circle(sh[0] - 18, sh[1] - 22, 22, L.top); }   // hood
  // front leg
  if (dress) {
    if (legs === 'sit' || legs === 'cross') { poly([[-26, -14], [kF[0] + 14, kF[1] - 20], [kF[0] + 22, kF[1] + 26], [-20, 30]], L.bottom); }
    else { poly([[-30, -10], [30, -10], [44, 92], [-40, 92]], L.bottom); }
    limb(legs === 'sit' || legs === 'cross' ? kF : [fF[0] * .5, 90], fF, 20, L.leg);
  } else { limb([0, 0], kF, legW + 6, L.bottom); limb(kF, fF, legW - 2, L.leg); circle(0, 0, legW * .62, L.bottom); }
  ellipse(fF[0] + 12, fF[1] + 2, 25, 11, legs === 'cross' ? .5 : 0, L.shoe);
  if (o.mid) o.mid();
  // front arm, with a line of paper where it crosses the body
  limb(sh, eF, 34, P); limb(eF, hF, 30, P);
  limb(sh, eF, 26, L.arm); limb(eF, hF, 22, L.arm); circle(hF[0], hF[1], 12.5, SKIN);
  if (o.hold) o.hold(hF, hB);
  g.restore();
  return { hF: [x + hF[0] * s * dir, y + hF[1] * s], hc: [x + hc[0] * s * dir, y + hc[1] * s] };
}

// ───────── props ─────────
export function cup(x, y, s, c = Y, sau = K) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rrect(-34, -4, 68, 9, 4, sau);
  poly([[-20, -40], [20, -40], [15, -5], [-15, -5]], c); ring2(24, -26, 9, 5, c);
  g.restore();
}
function ring2(x, y, r, w, c) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.lineWidth = w; g.strokeStyle = inkA(c); g.stroke(); }
export function steam(x, y, t, c, n = 2, h = 70) {
  for (let i = 0; i < n; i++) { const pts = []; for (let k = 0; k <= 6; k++) pts.push([x + i * 16 - (n - 1) * 8 + Math.sin(k * .9 - t * 2.4 + i * 2) * 7 * (k / 6 + .3), y - k * h / 6]); curve(pts, 5, c); }
}
// a plain key on a ring with a blank fob; origin at the ring
export function key(x, y, s, rot = 0, c = K) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  ring2(0, 0, 20, 7, c);
  rrect(14, -9, 86, 18, 5, c); rect(62, 6, 10, 15, c); rect(80, 6, 12, 20, c);            // blade and bits
  g.rotate(2.3); rrect(14, -19, 60, 38, 10, c); circle(28, 0, 6, P);                        // blank fob
  g.restore();
}
export function chair(x, y, dir, c) {   // seat top at y, front towards dir
  g.save(); g.translate(x, y); g.scale(dir, 1);
  rrect(-52, 0, 108, 14, 6, c);
  line([[-44, 12], [-52, 122]], 10, c); line([[46, 12], [52, 122]], 10, c);
  curve([[-46, 4], [-58, -70], [-52, -150]], 11, c); rrect(-66, -164, 26, 64, 10, c);
  g.restore();
}
export function table(x, y, w, c = K) {   // top surface at y
  rrect(x - w / 2, y, w, 16, 7, c); rect(x - 7, y + 12, 14, 150, c); rrect(x - 70, y + 160, 140, 14, 7, c);
}
export function lamp(x, y0, y1, r, c = Y, cord = K) {
  rect(x - 2.5, y0, 5, y1 - y0 - r * .5, cord);
  g.beginPath(); g.arc(x, y1, r, Math.PI, 0); g.closePath(); g.fillStyle = inkA(c); g.fill();
  circle(x, y1 + 4, r * .2, c);
}
// speech shape: a rounded slab with a tail towards (tx,ty)
export function bubble(x, y, w, h, c, tail = 0, r = 26) {
  rrect(x - w / 2, y - h / 2, w, h, r, c);
  if (tail) poly([[x + tail * w * .28, y + h / 2 - 2], [x + tail * w * .28 + tail * 16, y + h / 2 + 34], [x + tail * w * .28 + tail * 46, y + h / 2 - 2]], c);
}
export function laptop(x, y, s, c, glow = Y) {   // hinge at (x,y), screen leans away from the user on the +x side
  g.save(); g.translate(x, y); g.scale(s, s);
  rrect(-104, -3, 112, 9, 4, c);
  poly([[0, 0], [26, -92], [36, -90], [10, 2]], c); poly([[1, -4], [24, -86], [19, -86], [-3, -5]], glow);
  g.restore();
}
// generic motorcycle in profile, facing +x; origin on the ground between the wheels. wa = wheel angle
export function moto(x, y, s, wa = 0, c = T, light = Y) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const wheel = wx => {
    circle(wx, -46, 46, c); circle(wx, -46, 30, P); circle(wx, -46, 9, c);
    for (let i = 0; i < 3; i++) { const a = wa + i * TAU / 3; line([[wx - Math.cos(a) * 30, -46 - Math.sin(a) * 30], [wx + Math.cos(a) * 30, -46 + Math.sin(a) * 30]], 4, c); }
  };
  wheel(-110); wheel(118);
  line([[118, -46], [78, -150]], 12, c); line([[78, -150], [54, -168]], 9, c);                     // fork, bar
  blob([[-20, -128], [40, -138], [76, -110], [60, -80], [-10, -84]], c);                           // tank
  poly([[-120, -122], [-10, -128], [-6, -100], [-96, -98]], c);                                    // seat
  blob([[-40, -98], [50, -92], [44, -44], [-20, -40], [-56, -60]], c);                             // engine
  line([[-110, -46], [-30, -66]], 12, c); rrect(-176, -70, 120, 14, 7, c);                         // swing arm, exhaust
  circle(96, -128, 15, light);                                                                     // headlamp
  g.restore();
}
// rider on the motorcycle (fa2), same origin
export function rider(x, y, s, wa, o = {}) {
  const m = s * 1.3;
  moto(x, y, m, wa);
  figure(x - 50 * m, y - 126 * m, s, o.L || LOOK.fa2, { legs: 'ride', lean: .5 + (o.lean || 0), handF: [135, -56], handB: [130, -50], bendF: -1, bendB: -1, nod: -.3, headO: o.headO, pre: o.scarf });
}
export function sofa(x, y, w, c, c2) {   // seat top at y, left edge at x
  rrect(x - 30, y - 96, w + 60, 150, 28, c2 || c);       // back
  rrect(x, y, w, 60, 16, c); rrect(x - 44, y - 40, 60, 110, 22, c); rrect(x + w - 16, y - 40, 60, 110, 22, c);
  rect(x - 20, y + 62, 14, 26, c); rect(x + w + 6, y + 62, 14, 26, c);
}
export function glass(x, y, s, c, fillc, tiltA = 0) {   // stem glass, origin at the base
  g.save(); g.translate(x, y); g.rotate(tiltA); g.scale(s, s);
  rrect(-26, -6, 52, 8, 4, c); rect(-3.5, -70, 7, 66, c);
  poly([[-36, -150], [36, -150], [6, -68], [-6, -68]], c); poly([[-27, -128], [27, -128], [4, -74], [-4, -74]], fillc);
  g.restore();
}
// a mask: the face someone wore to the date. kind 'suit' (quiff and grin) | 'doll' (lashes and bow)
export function mask(x, y, s, kind, c, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  blob([[-100, -110], [100, -110], [118, 10], [60, 130], [-60, 130], [-118, 10]], c);
  ellipse(-44, -18, 26, 13, kind === 'suit' ? -.25 : .15, P); ellipse(44, -18, 26, 13, kind === 'suit' ? .25 : -.15, P);
  if (kind === 'suit') { g.beginPath(); g.arc(0, 40, 54, .15, Math.PI - .15); g.closePath(); g.fillStyle = inkA(P); g.fill(); blob([[-110, -100], [-60, -170], [40, -180], [120, -150], [100, -100]], c); }
  else { ellipse(0, 70, 22, 14, 0, P); for (const k of [-1, 1]) for (let i = 0; i < 3; i++) line([[k * (30 + i * 16), -34], [k * (36 + i * 20), -52]], 5, P); poly([[0, -128], [-60, -168], [-60, -100]], c); poly([[0, -128], [60, -168], [60, -100]], c); }
  g.restore();
}
// a clay warrior from an old dynasty, seated or standing: topknot, square shoulders, plated armour. a = tint
export function warrior(x, y, s, a = .5, dir = 1, crack = 0) {
  const c = tint(R, a), d = tint(R, Math.min(1, a + .3));
  g.save(); g.translate(x, y); g.scale(s * dir, s);
  rrect(-62, -150, 124, 160, 20, c); rrect(-78, -150, 156, 46, 18, d);                      // body, shoulder guards
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) rrect(-50 + k * 26 + (r % 2) * 0, -96 + r * 24, 21, 19, 4, d);
  rrect(-18, -176, 36, 34, 6, c); circle(0, -206, 38, c); rrect(8, -262, 26, 30, 8, d);     // neck, head, topknot
  rect(-30, -214, 64, 7, d); circle(18, -200, 4.5, d); poly([[32, -202], [46, -190], [32, -184]], c);
  rrect(-66, 4, 150, 46, 16, c); rrect(46, 30, 44, 100, 14, c); rrect(40, 118, 74, 20, 8, d);   // lap, shin, boot
  rrect(20, -100, 34, 110, 14, d); circle(40, 14, 16, c);                                    // arm on the knee
  if (crack) { curve([[-20, -236], [-4, -200], [-22, -170], [-6, -120], [-26, -60]], 5 * crack, P); curve([[-22, -170], [-50, -160]], 4 * crack, P); }
  g.restore();
}
// registration cross: a ring and a cross-hair, on one plate
export function regmark(x, y, r, c, w = 5) {
  g.beginPath(); g.arc(x, y, r * .55, 0, TAU); g.lineWidth = w; g.strokeStyle = inkA(c); g.stroke();
  rect(x - r, y - w / 2, r * 2, w, c); rect(x - w / 2, y - r, w, r * 2, c);
}
export function scissors(x, y, s, open, c, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  for (const k of [-1, 1]) { g.save(); g.rotate(k * (.08 + open * .32)); poly([[0, -7], [150, -2], [150, 3], [0, 7]], c); line([[0, 0], [-60, k * 26]], 9, c); ring2(-78, k * 34, 22, 9, c); g.restore(); }
  circle(0, 0, 7, P);
  g.restore();
}
export function house(x, y, s, c) { g.save(); g.translate(x, y); g.scale(s, s); poly([[-70, -60], [0, -124], [70, -60]], c); rect(-52, -62, 104, 62, c); rect(-12, -36, 24, 36, P); g.restore(); }
