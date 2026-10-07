// Shots, part 3: the map (chorus 2, seen from straight above), the bridge, the finished sheet
import { g, W, H, clear, rect, rrect, line, circle, ellipse, poly, text, over, layer, blob, curve, limb } from './engine/draw.js';
import { clamp, lerp, seg, ss, eio, eo, ei, back, hash, mulberry, TAU } from '/core/lib.js';
import { R, T, Y, K, P, SKIN, tint, LOOK, figure, head, cup, steam, key, chair, table, lamp, bubble, laptop, moto, rider, sofa, glass, mask, warrior, regmark, scissors, house } from './cast.js';
import { LINES, BEATS, PULSE, BARS, FL, L1, AT, CF, CUES, DUR, FZ, KICKS, L0, OPEN, S, SHOTS, TEXTS, beatAt, before, cafe, cafeRoom, cam, clip, cutL, kf, near, pop, pulse, reset, road, room, say, say2, setData, step, sweepX } from './kit.js';
import { codeLines, cropMarks2, CROWD } from './shots2.js';

const css = c => 'rgb(' + c.map(v => Math.round(v * 255)).join(',') + ')';
// a person from straight above: shoulders, head, a nose that says which way they face
function topPerson(x, y, s, c, ang = 0, hair = c) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  ellipse(0, 0, 30, 58, 0, c); circle(4, 0, 30, hair); circle(22, 0, 12, SKIN);
  g.restore();
}
const halves = (a = .24) => { rect(0, 0, 960, H, tint(R, a)); rect(960, 0, 960, H, tint(T, a)); };

// 7. chorus 2: the same thank-you, from above
S.topTable = (lt, c) => {
  const tt = step(lt), sh = ss(seg(tt, .5, 1.3)) * (1 - ss(seg(tt, 4.2, 5)));
  halves(); cam(lerp(1.7, 1.15, eio(seg(lt, 0, c.d))), 960, 540);
  circle(960, 540, 250, K);
  layer(() => { circle(830, 430, 64, T); circle(830, 430, 44, Y); circle(1090, 650, 64, R); circle(1090, 650, 44, Y); key(900, 640, 1.1, -.4, P); }, 0);
  const pump = Math.sin(tt * 9) * 12 * sh;
  layer(() => { rrect(430, 470, 70, 140, 20, T); limb([600, 590], [lerp(700, 930, sh), lerp(600, 548 + pump, sh)], 46, T); circle(lerp(700, 940, sh), lerp(600, 546 + pump, sh), 26, SKIN); topPerson(590, 540, 1.7, T); });
  layer(() => { rrect(1420, 470, 70, 140, 20, R); limb([1320, 490], [lerp(1220, 990, sh), lerp(480, 534 + pump, sh)], 46, SKIN); circle(lerp(1220, 980, sh), lerp(480, 536 + pump, sh), 26, SKIN); topPerson(1330, 540, 1.7, R, Math.PI); });
  return {};
};
// …and the table becomes a dot on a town plan, with two routes leaving it
const RT = { red: [[960, 540], [680, 540], [680, 260], [400, 260], [400, 120], [120, 120]], teal: [[960, 540], [1240, 540], [1240, 820], [1520, 820], [1520, 960], [1840, 960]] };
function route(pts, u, w, c) {
  let len = 0; const L = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); len += d; }
  let rem = len * clamp(u), out = [pts[0]], endp = pts[0];
  for (let i = 1; i < pts.length && rem > 0; i++) { const k = Math.min(1, rem / L[i - 1]); endp = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; out.push(endp); rem -= L[i - 1]; }
  if (out.length > 1) line(out, w, c);
  return endp;
}
function townPlan() {
  rect(-3000, -3000, 8000, 7000, P);
  for (let i = -8; i < 16; i++) for (let j = -8; j < 12; j++) { const x = i * 280 - 140 + 20, y = j * 280 - 140 + 20 - 20; rrect(x, y, 240, 240, 16, tint(Y, hash(i * 7.1 + j * 3.3) > .7 ? .5 : .34)); }
}
S.topMap = (lt, c) => {
  const z = lerp(9, 1, eio(seg(lt, 0, 2.4))), u = ss(seg(lt, 1.6, c.d - .4));
  cam(z, 960, 540); townPlan();
  const a = route(RT.red, u, 18, R), b = route(RT.teal, u, 18, T);
  layer(() => circle(a[0], a[1], 26, R), 4); layer(() => circle(b[0], b[1], 26, T), 4);
  circle(960, 540, 28, K);
  reset(); if (lt > 2.6) cropMarks2();
  return {};
};
// her desk from above: one of everything
S.topDesk = (lt, c) => {
  const tt = step(lt), mode = c.mode, pan = mode === 'one' ? eio(seg(lt, .0, 1.6)) : 0, n = mode === 'one' ? 11 : Math.min(11, Math.floor((c.t - c.base) * 1.5 + 1));
  rect(0, 0, W, H, tint(R, .24));
  if (mode === 'ins') cam(lerp(2.0, 2.2, lt / c.d), 830, 560);                       // insert: hands and lines
  else cam(lerp(1.1, 1.0, ss(lt / c.d)) + pan * .06, 960, 540, -pan * 330, 0);
  layer(() => rrect(330, 150, 1250, 560, 30, P), 0);
  rrect(520, 190, 620, 430, 22, R); clip(520, 190, 620, 430, () => codeLines(n, 560, 226, 5, P, Y));
  const ty = Math.sin(tt * 26) * 8 * (1 - pan), reach = mode === 'one' ? ss(seg(tt, 2.2, 2.9)) * (1 - ss(seg(tt, 4.4, 5.0))) : 0;
  layer(() => { limb([760, 840], [720, 650 + ty], 44, R); limb([900, 840], [lerp(940, 1270, reach), lerp(650 - ty, 330, reach)], 44, R); circle(720, 640 + ty, 24, SKIN); circle(lerp(940, 1280, reach), lerp(640 - ty, 320, reach), 24, SKIN); topPerson(830, 850, 2.1, R, -Math.PI / 2 + reach * .25); });
  layer(() => { circle(1330, 300, 70, R); circle(1330, 300, 48, Y); rrect(1392, 286, 44, 28, 12, R); }, 0);       // one mug
  layer(() => { circle(1900, 430, 120, P); circle(1900, 430, 84, tint(R, .5)); rrect(1750, 330, 14, 200, 7, R); rrect(2040, 330, 14, 200, 7, R); }, 0);   // one plate, one pair of chopsticks
  layer(() => { rrect(1700, 760, 70, 150, 34, R); rrect(1790, 760, 70, 150, 34, R); }, 0);                         // one pair of slippers
  if (mode === 'one' && lt > 1.2) {   // the second setting: an outline that never gets its plate
    g.setLineDash([16, 14]); g.lineWidth = 6; g.strokeStyle = css(R);
    g.beginPath(); g.arc(1900, 170, 96, 0, TAU); g.stroke(); g.beginPath(); g.roundRect(1930, 760, 70, 150, 34); g.stroke(); g.beginPath(); g.roundRect(2020, 760, 70, 150, 34); g.stroke(); g.setLineDash([]);
  }
  if (mode === 'one' && lt >= c.lab - c.t0) say('one', '一人份', 1900, 700, FZ(96), R);
  return { gate: [1, 0, 1] };
};
// his road from above
S.topRoad = (lt, c) => {
  const tt = step(lt), t2 = c.t2 - c.t0;
  rect(0, 0, W, H, tint(T, .24));
  for (let i = 0; i < 5; i++) { const x = 200 + i * 400, y = 300 + (i % 2) * 460; ellipse(x, y, 300, 200, i, tint(T, .4)); ellipse(x + 20, y - 10, 170, 110, i, tint(T, .62)); }
  const path = u => [lerp(-200, 2120, u), 540 + Math.sin(u * 9.5) * 330];
  const pts = []; for (let i = 0; i <= 80; i++) pts.push(path(i / 80));
  curve(pts, 110, P); g.setLineDash([40, 40]); curve(pts, 8, T); g.setLineDash([]);
  const u = lerp(.04, .9, lt / c.d), p = path(u), q = path(u + .01), a = Math.atan2(q[1] - p[1], q[0] - p[0]);
  layer(() => { g.save(); g.translate(p[0], p[1]); g.rotate(a); poly([[60, -6], [330, -90], [330, 90], [60, 6]], Y); rrect(-90, -18, 180, 36, 16, T); rrect(30, -52, 16, 104, 8, T); topPerson(-10, 0, 1.05, T); g.restore(); }, 4);
  if (lt >= t2) { const k = pop(lt, t2, .25); layer(() => { g.save(); g.translate(1420, 210); g.scale(k, k); bubble(0, 0, 400, 150, Y, 1); say('zero', '未读 0', 0, 28, FZ(76), P); g.restore(); }, 5); }
  return { gate: [0, 1, 1] };
};
// parallel universes, literally: two orbits around one light that never cross
S.orbits = (lt, c) => {
  rect(0, 0, W, H, P); cam(lerp(1.25, 1.0, eio(seg(lt, 0, c.d))), 960, 540);
  for (let i = 0; i < 26; i++) circle(hash(i * 3.1) * 1920, hash(i * 5.7) * 1080, 5 + hash(i) * 6, Y);
  circle(960, 540, 110, Y);
  const ring = (rx, ry, c1) => { g.beginPath(); g.ellipse(960, 540, rx, ry, -.12, 0, TAU); g.lineWidth = 9; g.strokeStyle = css(c1); g.stroke(); };
  ring(430, 190, R); ring(800, 400, T);
  const pos = (rx, ry, a) => { const x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [960 + x * Math.cos(-.12) - y * Math.sin(-.12), 540 + x * Math.sin(-.12) + y * Math.cos(-.12)]; };
  const a = pos(430, 190, 2.2 + lt * .5), b = pos(800, 400, -.6 - lt * .3);
  layer(() => { circle(a[0], a[1], 62, R); laptop(a[0] + 4, a[1] - 60, .5, R); }, 6);
  layer(() => { circle(b[0], b[1], 62, T); moto(b[0], b[1] - 60, .34, lt * 6); }, 6);
  return {};
};
// passers-by, from above: the dots of the screen turn out to be people
S.crowd = (lt, c) => {
  const tt = step(lt), meet = c.meet - c.t0, z = lerp(.2, 1.35, eio(seg(lt, 0, 3.2)));
  rect(0, 0, W, H, P); cam(z, 960, 540);
  const n = z < .5 ? 34 : z < .9 ? 14 : 8, m = z < .5 ? 20 : z < .9 ? 9 : 6;
  for (let j = -m; j <= m; j++) for (let i = -n; i <= n; i++) {
    if (j === 0) continue;                                                         // the middle lane is theirs
    const dir = j % 2 ? 1 : -1, x = 960 + i * 150 + (hash(i * 3.3 + j * 7.7) - .5) * 60 + dir * ((tt * 40) % 150), y = 540 + j * 190 + Math.sign(j) * 70 + (hash(i * 9.1 + j * 1.3) - .5) * 50;
    topPerson(x, y, 1, tint(Y, .5), dir > 0 ? 0 : Math.PI, Y);
  }
  // each leaves a dashed track of their own ink; the tracks run side by side and never cross
  const d = (lt - meet) * 190, xs = 960 + d, xh = 960 - d;
  g.setLineDash([26, 20]); line([[-4000, 450], [xs - 90, 450]], 12, R, 'butt'); line([[xh + 90, 630], [5000, 630]], 12, T, 'butt'); g.setLineDash([]);
  layer(() => topPerson(xs, 450, 1.5, R, 0), 6); layer(() => topPerson(xh, 630, 1.5, T, Math.PI), 6);
  if (lt >= c.tag - c.t0) {
    layer(() => { rrect(xs - 100, 276, 200, 76, 10, P); say('tagC', '路人甲', xs, 332, FZ(52), T); }, 5);
    layer(() => { rrect(xh - 100, 728, 200, 76, 10, P); say('tagD', '路人甲', xh, 784, FZ(52), R); }, 5);
  }
  return {};
};
// one roof, for real this time: every plate at once, the only mud in the film, and it does not hold
S.mud = (lt, c) => {
  const tt = step(lt), zha = c.zha - c.t0, f = Math.max(0, lt - zha), sh = lt < zha ? ss(seg(lt, 1, zha)) * 5 : 0, jx = Math.sin(lt * 55) * sh;
  rect(0, 0, W, H, P); rect(0, 900, W, 180, tint(Y, .34));
  cam(lerp(1.0, 1.08, ss(lt / c.d)), 960, 600);
  const drop = eo(seg(lt, 0, .45));
  g.save(); g.translate(jx, (1 - drop) * -1000 + f * f * 500); g.translate(960, 300); g.rotate(f * .25); g.translate(-960, -300);
  poly([[330, 420], [960, 80], [1590, 420]], Y); rect(1260, 140, 80, 190, Y); g.restore();
  const MUD = [.52, .52, .52], cols = 14, rows = 6, cw = 1080 / cols, ch = 480 / rows;
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
    const h1 = hash(k * 3.7 + r * 9.1), h2 = hash(k * 5.3 + r * 2.9), del = (rows - 1 - r) * .03 + h1 * .15, ff = Math.max(0, f - del);
    const x = 420 + k * cw + jx + (h2 - .5) * ff * 500, y = Math.min(900 - 20 - h1 * 60 - (rows - 1 - r) * 6, 420 + r * ch + ff * ff * 1500);
    g.save(); g.translate(x + cw / 2, y + ch / 2); g.rotate(ff * (h2 - .5) * 6 * (y < 800 ? 1 : 0)); rect(-cw / 2 - .6, -ch / 2 - .6, (cw + 1.2) * (ff > 0 ? .8 : 1), (ch + 1.2) * (ff > 0 ? .8 : 1), MUD); g.restore();
  }
  if (f === 0) {   // two people in there, hard to tell apart
    over(() => { figure(760 + jx, 760, 1.2, { ...LOOK.fa3, top: [0, .45, 0], bottom: [0, .45, 0], leg: [0, .45, 0], arm: [0, .45, 0], shoe: [0, .45, 0], ink: [0, .45, 0] }, { lean: .25, handF: [120, -130 + Math.sin(tt * 12) * 20], bendF: -1, headO: { skin: [0, 0, 0] } }); });
    over(() => { figure(1160 + jx, 760, 1.2, { ...LOOK.hua2, top: [.45, 0, 0], bottom: [.45, 0, 0], leg: [.45, 0, 0], arm: [.45, 0, 0], shoe: [.45, 0, 0], ink: [.45, 0, 0] }, { dir: -1, lean: .25, handF: [120, -130 - Math.sin(tt * 12) * 20], bendF: -1, headO: { skin: [0, 0, 0] } }); });
  }
  return {};
};
// …and the plates come back clean, one each
function cleanHalves(tt, o = {}) {
  rect(0, 0, W, H, P); rect(0, 0, 900, H, tint(R, .24)); rect(1020, 0, 900, H, tint(T, .24)); rect(0, 860, 900, 220, R); rect(1020, 860, 900, 220, T);
  circle(450, 300, 130, Y); circle(1470, 300, 130, Y);
  if (o.her) layer(() => o.her()); if (o.him) layer(() => o.him());
}
S.clean = (lt, c) => {
  const tt = step(lt), st = ss(seg(tt, 1.8, 3)), b1 = c.b1 - c.t0, b2 = c.b2 - c.t0;
  cam(lerp(1.12, 1.0, ss(lt / c.d)), 960, 600);
  cleanHalves(tt, {
    her: () => figure(450, 860 - 176 * 1.5, 1.5, LOOK.hua2, { legs: 'stand', lean: -.05 * st, handF: [lerp(20, 60, st), lerp(-20, -260, st)], handB: [lerp(-10, -50, st), lerp(-20, -250, st)], bendF: -1, bendB: 1, headO: { lid: 1, mouth: 'smile' } }),
    him: () => figure(1470, 860 - 176 * 1.5, 1.5, LOOK.fa3, { dir: -1, legs: 'stand', lean: -.05 * st, handF: [lerp(20, 60, st), lerp(-20, -260, st)], handB: [lerp(-10, -50, st), lerp(-20, -250, st)], bendF: -1, bendB: 1, headO: { lid: 1, mouth: 'smile' } }),
  });
  return { sweep: [sweepX(lt, 0, .7), sweepX(lt, b1, .7), sweepX(lt, b2, .7)] };
};

// 8. the bridge. Two messages across a keyboard that plays itself
S.talk = (lt, c) => {
  const tt = step(lt), a = LINES[46], b = LINES[47];
  rect(0, 0, W, H, P); rect(0, 0, W, 700, tint(Y, .34));
  const nk = 24, kw = W / nk;
  for (let i = 0; i < nk; i++) {   // keys go down on the song's own beats
    const bi = BEATS.findIndex(x => x > c.t) - 1, hit = hash(bi * 7.7 + i * 3.1) > .8, dn = hit ? pulse(c.t, BEATS[bi], .22) * 16 : 0;
    rect(i * kw + 3, 700 + dn, kw - 6, 400, P);
    if (hit) { const u = c.t - BEATS[bi], col = i < nk / 2 ? R : T; over(() => circle(i * kw + kw / 2, 640 - u * 520, 30 * (1 - u * .9), col)); }
    if (i % 7 !== 2 && i % 7 !== 6) rect(i * kw + kw * .68, 700, kw * .64, 210, K);
  }
  rect(0, 692, W, 12, K);
  layer(() => figure(170, 692 - 4, 1.0, LOOK.hua2, { dir: -1, lean: -.1, legs: 'cross', ph: tt, handF: [60, -110], bendF: -1, headO: { mouth: 'smile' }, hold: h => rrect(h[0] - 8, h[1] - 40, 18, 44, 5, R) }));
  layer(() => figure(1750, 692 - 4, 1.0, LOOK.fa3, { lean: -.1, legs: 'cross', ph: tt + 1, handF: [60, -110], bendF: -1, headO: { mouth: 'smile' }, hold: h => rrect(h[0] - 8, h[1] - 40, 18, 44, 5, T) }));
  if (c.t >= a.t0 - .15) { const k = pop(c.t, a.t0 - .15, .25); layer(() => { g.save(); g.translate(1130, 190); g.scale(k, k); bubble(0, 0, 900, 150, T, 1, 40); say('sp46', '哎，听说你过得不错？', 0, 28, FZ(74), P); g.restore(); }, 6); }
  if (c.t >= b.t0 - .15) { const k = pop(c.t, b.t0 - .15, .25); layer(() => { g.save(); g.translate(800, 420); g.scale(k, k); bubble(0, 0, 1040, 150, R, -1, 40); say('sp47', '彼此彼此，你也挺滋润的嘛。', 0, 28, FZ(74), P); g.restore(); }, 6); }
  return {};
};
// 圆满 is a ring standing in the road. He goes past it
S.ringRoad = (lt, c) => {
  const tt = step(lt), cx = 5000 + lt * 620, rx = lerp(2300, -500, lt / c.d);
  cam(lerp(1.0, 1.1, ss(lt / c.d)), 900, 700);
  road(cx, { back: () => {
    layer(() => { g.beginPath(); g.arc(rx, 520, 250, 0, TAU); g.lineWidth = 70; g.strokeStyle = css(Y); g.stroke(); poly([[rx - 50, 240], [rx + 50, 240], [rx, 150]], Y);
      const sw = Math.sin(tt * 5) * .12; g.save(); g.translate(rx + 250, 560); g.rotate(sw); rect(-3, 0, 6, 70, Y); rrect(-80, 66, 160, 110, 12, Y); say('tag', '一生', 0, 146, FZ(64), P); g.restore(); }, 5);
  } });
  const wv = ss(seg(tt, 2.2, 2.8)) * (1 - ss(seg(tt, 4, 4.6)));
  layer(() => rider(820, 838 + Math.sin(lt * 9) * 3, 1.05, cx / 60, { L: LOOK.fa2 }));
  if (wv > 0) layer(() => { limb([800, 590], [760 - wv * 30, 500 - wv * 40 + Math.sin(tt * 14) * 14], 24, T); circle(760 - wv * 30, 492 - wv * 40 + Math.sin(tt * 14) * 14, 14, SKIN); }, 3);
  return { gate: [0, 1, 1] };
};
// the most expensive car there is: room
S.longSofa = (lt, c) => {
  const tt = step(lt), u = eio(seg(lt, .3, c.d - .3)), z = lerp(1.5, .62, u);
  g.setTransform(z, 0, 0, z, lerp(-200, 60, u), 620 * (1 - z) + 40 * u);
  rect(-800, -800, 5000, 1620, tint(R, .24)); rect(-800, 820, 5000, 900, R);
  for (let i = 0; i < 4; i++) lamp(900 + i * 640, -800, 250, 70, Y, R);
  layer(() => sofa(360, 640, 2300, R), 6);
  layer(() => figure(520, 640, 1.15, LOOK.hua2, { legs: 'feetup', lean: -.34, handF: [70, -150 + Math.sin(tt * 3) * 8], bendF: -1, handB: [-60, -90], bendB: -1, headO: { lid: 1, mouth: 'smile' }, hold: h => glass(h[0] + 8, h[1] + 60, .6, R, Y) }));
  return { gate: [1, 0, 1] };
};
// cheers: two glasses that stop short of each other, on purpose
S.cheers = (lt, c) => {
  const tt = step(lt), hit = c.hit - c.t0, inn = eo(seg(lt, .1, hit)), bounce = pulse(lt, hit, .2), dn = ss(seg(tt, hit + 2.2, hit + 3.2));
  rect(0, 0, W, H, P); rect(0, 0, 880, H, tint(R, .24)); rect(1040, 0, 880, H, tint(T, .24));
  const x = lerp(-300, 560, inn) - bounce * 26 - dn * 260, tilt = .32 - bounce * .1, y = 900 + dn * 200;
  layer(() => { limb([x - 700, y + 400], [x - 30, y - 40], 120, R); glass(x, y, 3.0, R, Y, tilt); circle(x - 6, y - 150, 60, SKIN); });
  layer(() => { limb([W - x + 700, y + 400], [W - x + 30, y - 40], 120, T); glass(W - x, y, 3.0, T, Y, -tilt); circle(W - x + 6, y - 150, 60, SKIN); });
  if (lt >= hit && lt < hit + 1.2) for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .34, r0 = 60 + (lt - hit) * 260, r1 = r0 + 60 * (1 - (lt - hit) / 1.2); line([[960 + Math.cos(a) * r0, 430 + Math.sin(a) * r0], [960 + Math.cos(a) * r1, 430 + Math.sin(a) * r1]], 12, Y); }
  return {};
};
// 9. goodbye, take care; and the finished sheet: one sheet, two prints that never touched
function byeHalves(lt, tt, t, o = {}) {
  const wv = Math.sin(tt * 10) * 26, m = LINES[52].t0 - .1, gone = o.gone || 0;
  rect(0, 0, 900, H, tint(R, .24)); rect(0, 860, 900, 220, R); circle(250, 300, 130, Y);
  layer(() => figure(lerp(560, 300, seg(t, LINES[51].t0 - .5, LINES[53].t1 + 4)), 860 - 176 * 1.4, 1.4, LOOK.hua2, { dir: -1, legs: 'walk', ph: tt * 5, lean: .05, handB: [-40, -230 + wv], bendB: 1, handF: [30 * Math.sin(tt * 5), -20], headO: { lid: 1, mouth: 'smile' } }));
  if (t >= m) {
    clip(1020, 0, 900, H, () => { g.save(); g.translate(0, 60); road(t * 500); g.restore(); });
    layer(() => { const bx = lerp(1300, 1560, seg(t, m, LINES[53].t1 + 4)); rider(bx, 898, .95, t * 8, { L: LOOK.fa2 }); limb([bx - 34, 672], [bx - 80, 570 + wv * .5], 24, T); circle(bx - 82, 562 + wv * .5, 14, SKIN); });
  }
}
S.bye = (lt, c) => {
  const tt = step(lt), m = LINES[52].t0 - .1 - c.t0;
  rect(0, 0, W, H, P); byeHalves(lt, tt, c.t);
  return { sweep: [OPEN, lt < m + 1 ? sweepX(lt, m, .5) : OPEN, OPEN] };
};
S.sheet = (lt, c) => {
  const tt = step(lt), cutT = c.cutT - c.t0, z = lerp(1, .62, eio(seg(lt, 0, cutT - .1))), f = Math.max(0, lt - cutT);
  const apart = eio(seg(f, 0, 1.2)) * 150 + ei(seg(f, 2.4, 6.2)) * 1500, end = seg(f, 5.6, 6.2);
  rect(0, 0, W, H, P);
  for (const k of [-1, 1]) {
    g.save(); g.setTransform(z, 0, 0, z, 960 * (1 - z) + k * apart, 500 * (1 - z));
    g.beginPath(); if (k < 0) g.rect(0, 0, 960, H); else g.rect(960, 0, 960, H); g.clip();
    byeHalves(lt, tt, c.t);
    g.restore();
    // trim marks travel with each half
    g.save(); g.setTransform(z, 0, 0, z, 960 * (1 - z) + k * apart, 500 * (1 - z));
    const x0 = k < 0 ? 0 : 1020, x1 = k < 0 ? 900 : 1920;
    for (const [x, sx] of [[x0, -1], [x1, 1]]) for (const [y, sy] of [[0, -1], [H, 1]]) { rect(x + sx * 16, y - 2, sx * 50, 4, K); rect(x - 2, y + sy * 16, 4, sy * 50, K); }
    g.restore();
  }
  // the two crosses of the opening, side by side, at peace
  const ry = lerp(-200, 105, eo(seg(lt, .4, cutT))), fin = eio(seg(f, 3.6, 6.2)), cy = lerp(ry, 470, fin), r = lerp(52, 120, fin), dxm = lerp(90, 170, fin);
  regmark(960 - dxm, cy, r, R, r * .07 + 3); regmark(960 + dxm, cy, r, T, r * .07 + 3);
  if (f < 2.4 && lt > cutT - 1.2) { g.setLineDash([18, 14]); line([[960, 60], [960, lerp(60, 880, seg(lt, cutT - 1.2, cutT))]], 5, K); g.setLineDash([]); }
  if (f > 5.2) { say2('end', '最佳路人', 960, 740, FZ(110), 6, 4, 'center', 10); say('end2', '祝我们永远 只是路人甲', 960, 830, FZ(44, 700), K, 'center', 6); cropMarks2(); }
  return {};
};

export function timeline3(shot, kick) {
  shot('topTable', before(PULSE, L0(38) - .3), S.topTable); kick(before(PULSE, L0(38) - .3), 14);
  shot('topMap', cutL(39, .5), S.topMap); kick(AT(39, '错过'), 10);
  const td = cutL(40, .4), tdB = PULSE.find(b => b >= td + 4.1), tdC = before(PULSE, AT(40, '也不用') - .2);
  shot('topDesk', td, S.topDesk, { mode: 'desk', base: td }); shot('topDeskIns', tdB, S.topDesk, { mode: 'ins', base: td }); shot('topDeskOne', tdC, S.topDesk, { mode: 'one', base: td, lab: AT(40, '也不用') + .3 });
  kick(td, 9); kick(tdB, 8); kick(tdC, 9);
  shot('topRoad', cutL(41, .4), S.topRoad, { t2: AT(41, '没人查岗') }); kick(cutL(41, .4), 9);
  shot('orbits', cutL(42), S.orbits); kick(cutL(42), 8);
  const meet = beatAt(AT(43, '路人甲') + .5);
  shot('crowd', before(PULSE, L1(42) + .3), S.crowd, { meet, tag: AT(43, '只是') }); kick(meet, 10);
  const zha = beatAt(AT(44, '豆腐渣'));
  shot('mud', cutL(44, .5), S.mud, { zha }); kick(cutL(44, .5), 8); kick(zha, 18);
  const c0 = cutL(45, .3), pi = PULSE.findIndex(b => b >= c0 - 1e-6);
  shot('clean', c0, S.clean, { b1: PULSE[pi + 1], b2: PULSE[pi + 2] }); kick(c0, 8);
  shot('talk', before(PULSE, L0(46) - .3), S.talk);
  const tr = PULSE.find(b => b >= L1(47) - .35);
  shot('ringRoad', tr, S.ringRoad); kick(tr, 9);
  shot('longSofa', cutL(49, .3), S.longSofa); kick(cutL(49, .3), 9);
  const hit = beatAt(AT(50, 'freedom'));
  shot('cheers', cutL(50, .5), S.cheers, { hit }); kick(hit, 14);
  shot('bye', before(PULSE, L0(51) - .3), S.bye); kick(before(PULSE, L0(51) - .3), 8); kick(LINES[52].t0, 8);
  const cutT = beatAt(AT(53, '别'));
  shot('sheet', cutL(53, .1), S.sheet, { cutT }); kick(cutT, 14);
}
