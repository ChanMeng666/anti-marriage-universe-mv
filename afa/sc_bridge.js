// 间奏：四十年快进（同一个路边构图，重画四季）；念白：海堤、搪瓷缸、晒开了花的老脸
import { W, H, TAU, rgba, mix, path, poly, cel, line, hash, rng, vgrad, airbrush, canvas,
  clamp, lerp, seg, ss, eio, eo, ei, back, spring, q12, q8, f12, f8, setCam, celLayer, plate, cached, drawPlate,
  text, flash, limb, F, tag } from './stage.js';
import { ribbon, flutter, LWK } from './cel.js';
import { PAL, TEAL, RED } from './pal.js';
import { head, figure, handFlat } from './people.js';
import { rider, LAMPS } from './bike.js';
import { speedLines, flare, lamp } from './fx.js';
import { cumulus, gulls, noonClouds } from './sc_ride.js';
import { flower } from './sc_v1.js';

const SEAS = [
  { n: 'spring', sky: ['#7fb4f0', '#cfe8ff', '#ffe6ee'], sea: ['#5fa8e0', '#8fd8e0'], hill: '#8fc88a', hill2: '#6aa870', grass: ['#a8dc7a', '#6ab85a'], road: ['#b8b4c8', '#8a8aa4'], leaf: ['#ffb8d0', '#ff8ab0', '#ffe0ea'], trunk: '#6a4a3c', part: '#ffc0d8', pal: 'day' },
  { n: 'summer', sky: ['#1848c0', '#4f96ea', '#bfe6ff'], sea: ['#2f7fd6', '#28a6c8'], hill: '#3f9a5a', hill2: '#2a7a4a', grass: ['#5fc85a', '#2f8a3e'], road: ['#a4a8bc', '#6c6f8c'], leaf: ['#3faa4a', '#2a8a3a', '#7fd86a'], trunk: '#5a3c2c', part: null, pal: 'noon' },
  { n: 'autumn', sky: ['#5a4a9a', '#e88a6a', '#ffd89a'], sea: ['#c87a7a', '#8a6a9a'], hill: '#b8703a', hill2: '#8a4a34', grass: ['#e8b84a', '#b8782a'], road: ['#8a7a8a', '#5a4a60'], leaf: ['#ff8a2a', '#e8502a', '#ffc84a'], trunk: '#4a2c24', part: '#ff8a2a', pal: 'dawn' },
  { n: 'winter', sky: ['#5a6a9a', '#aab8d8', '#e8eef8'], sea: ['#6a84b0', '#9ab0cc'], hill: '#dfe6f2', hill2: '#b8c4dc', grass: ['#f4f8ff', '#c8d4ea'], road: ['#9aa4bc', '#6a7490'], leaf: null, trunk: '#3a3440', part: '#ffffff', pal: 'cold' },
];
function seasonPlate(k) {
  const Sn = SEAS[k];
  return plate('season' + k, W, H, (g, e) => {
    vgrad(g, 0, 0, W, 560, [[0, Sn.sky[0]], [.6, Sn.sky[1]], [1, Sn.sky[2]]]);
    const R = rng(40 + k);
    if (k === 1) { cumulus(g, 500, 566, 2.0, '#ffffff', '#8fb0ea', R, false); cumulus(g, 1560, 560, 1.4, '#ffffff', '#9ab8ee', R, false); }
    else { g.save(); g.filter = 'blur(8px)'; for (let i = 0; i < 9; i++) { const x = R() * 2100 - 80, y = 80 + R() * 360, w = 180 + R() * 260; g.fillStyle = rgba(k === 2 ? '#7a4a8a' : '#ffffff', k === 3 ? .5 : .55); g.beginPath(); g.ellipse(x, y, w, 26, 0, 0, TAU); g.fill(); if (k === 2) { g.fillStyle = rgba('#ffc08a', .7); g.beginPath(); g.ellipse(x + 20, y + 12, w * .85, 10, 0, 0, TAU); g.fill(); } } g.restore(); }
    if (k === 2) { airbrush(g, 420, 556, 600, 220, '#fff0c0', .7); airbrush(e, 420, 556, 320, 120, '#ffe0a0', .4); g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(420, 560, 54, Math.PI, 0); g.fill(); }
    vgrad(g, 0, 556, W, 110, [[0, Sn.sea[0]], [1, Sn.sea[1]]]);
    for (let i = 0; i < 40; i++) { g.fillStyle = rgba('#ffffff', .25 + R() * .3); g.fillRect(R() * W, 562 + R() * 96, 20 + R() * 80, 2); }
    g.fillStyle = Sn.hill2; g.fill(path([[900, 660], [1100, 560], [1400, 500], [1700, 540], [1920, 480], [1920, 700], [900, 700]]));
    g.fillStyle = Sn.hill; g.fill(path([[-20, 700], [-20, 620], [300, 590], [700, 640], [1100, 610], [1500, 650], [1920, 600], [1920, 760], [-20, 760]]));
    vgrad(g, 0, 660, W, 420, [[0, Sn.grass[0]], [1, Sn.grass[1]]]);
    // 路：从左中弯到右下
    const top = [], bot = []; for (let i = 0; i <= 24; i++) { const u = i / 24, x = u * 2100 - 90, y = 800 + Math.sin(u * 2.4 - .5) * 34 + u * 60; top.push([x, y]); bot.push([x, y + 150 + u * 20]); }
    const rd = path(top.concat(bot.reverse())); const rg = g.createLinearGradient(0, 780, 0, 1040); rg.addColorStop(0, Sn.road[0]); rg.addColorStop(1, Sn.road[1]); g.fillStyle = rg; g.fill(rd);
    g.strokeStyle = rgba('#ffffff', .8); g.lineWidth = 6; g.setLineDash([70, 60]); g.stroke(path(top.map(([x, y]) => [x, y + 80]), false)); g.setLineDash([]);
    g.strokeStyle = k === 3 ? '#c8d0e0' : '#f4f0e6'; g.lineWidth = 7; g.stroke(path(top.map(([x, y]) => [x, y - 24]), false)); for (let i = 0; i < 16; i++) { const [x, y] = top[Math.min(24, Math.round(i * 1.6))]; g.fillStyle = k === 3 ? '#c8d0e0' : '#f4f0e6'; g.fillRect(x, y - 26, 7, 30); }
    // 那棵树
    const tx = 1360, ty = 790;
    cel(g, [[tx - 34, ty], [tx - 22, ty - 200], [tx - 70, ty - 330], [tx - 40, ty - 340], [tx - 4, ty - 250], [tx + 16, ty - 380], [tx + 44, ty - 372], [tx + 26, ty - 220], [tx + 90, ty - 300], [tx + 110, ty - 280], [tx + 34, ty - 160], [tx + 40, ty]], { f: Sn.trunk, s: mix(Sn.trunk, '#000000', .4), so: [-12, 0], l: mix(Sn.trunk, '#000000', .6), lw: 4 });
    if (Sn.leaf) { for (let i = 0; i < 26; i++) { const a = R() * TAU, r = R() * 190, bx = tx + 10 + Math.cos(a) * r * 1.25, by = ty - 420 + Math.sin(a) * r * .8, br = 60 + R() * 60; g.fillStyle = Sn.leaf[1]; g.beginPath(); g.arc(bx + 8, by + 12, br, 0, TAU); g.fill(); }
      for (let i = 0; i < 26; i++) { const a = R() * TAU, r = R() * 180, bx = tx + Math.cos(a) * r * 1.25, by = ty - 430 + Math.sin(a) * r * .8, br = 50 + R() * 56; g.fillStyle = i % 4 === 0 ? Sn.leaf[2] : Sn.leaf[0]; g.beginPath(); g.arc(bx, by, br, 0, TAU); g.fill(); } }
    else { for (const [x1, y1, x2, y2] of [[tx - 70, ty - 330, tx - 150, ty - 440], [tx - 40, ty - 340, tx - 60, ty - 480], [tx + 16, ty - 380, tx - 10, ty - 520], [tx + 44, ty - 372, tx + 100, ty - 500], [tx + 110, ty - 280, tx + 210, ty - 360], [tx + 90, ty - 300, tx + 150, ty - 430]]) { line(g, [[x1, y1], [x2, y2]], Sn.trunk, 10); line(g, [[x2, y2], [x2 + (x2 - x1) * .5, y2 - 70]], Sn.trunk, 5); line(g, [[x1, y1 - 6], [x2, y2 - 6]], '#ffffff', 4); } }
    if (k === 3) { g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(tx, ty + 4, 120, 16, 0, 0, TAU); g.fill(); }
    if (k === 0) for (let i = 0; i < 40; i++) { flower(g, R() * W, 690 + R() * 80, 8 + R() * 8, R() * 6, ['#ffffff', '#ffe066', '#ff8ab0'][i % 3]); }
    g.fillStyle = rgba('#000000', .14); g.beginPath(); g.ellipse(tx + 40, ty + 6, 240, 22, 0, 0, TAU); g.fill();
  });
}
// 四季：每季两小节，车从画左驶到画右；年纪在 OSD 上往上跳
export function season(S, k, o) {
  const { g, e, t, lt, u } = S, Sn = SEAS[k], fr = f12(t);
  setCam(S, lerp(930, 990, u), H / 2, 1.03);
  drawPlate(S, seasonPlate(k), 0, 0);
  // 路上的车（两个轮子压着路的那条曲线）
  const ub = lerp(-.06, 1.02, u), x = ub * 2100 - 90, y = 800 + Math.sin(ub * 2.4 - .5) * 34 + ub * 60 + 96, sl = Math.atan2(Math.cos(ub * 2.4 - .5) * 34 * 2.4 / 2100 + 60 / 2100, 1);
  g.fillStyle = rgba('#000000', .2); g.beginPath(); g.ellipse(x, y + 2, 150, 9, 0, 0, TAU); g.fill();
  const old = k >= 2;
  celLayer(S, c => { c.translate(x, y); c.rotate(sl); c.scale(.4, .4); rider(c, PAL[Sn.pal], { wheelA: q12(t) * 30, speed: 1, visor: k === 3 ? 0 : 1, old, pack: true, ph: (fr % 4) / 4, bob: (hash(fr) - .5) * 6 }); });
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); speedLines(g, fr, { type: 'h', n: 14, col: '#ffffff', a: .22, hmax: 3, seed: k }); g.restore();
  // 粒子：花瓣 / 落叶 / 雪（一拍一）
  if (Sn.part) for (let i = 0; i < (k === 3 ? 90 : 46); i++) {
    const R = rng(i * 13 + k), life = ((t * (k === 3 ? .22 : .3) + R()) % 1), px = (R() * 2300 - 200 - life * (k === 3 ? 120 : 420) + 2400) % 2400 - 200, py = -40 + life * 1160, sz = 6 + R() * 10;
    g.save(); g.translate(px + Math.sin(life * 12 + i) * 30, py); g.rotate(life * 9 + i); g.fillStyle = rgba(i % 3 === 0 && k === 2 ? '#ffc84a' : Sn.part, k === 3 ? .9 : .85);
    if (k === 3) { g.beginPath(); g.arc(0, 0, sz * .5, 0, TAU); g.fill(); } else { g.beginPath(); g.ellipse(0, 0, sz, sz * .5, 0, 0, TAU); g.fill(); }
    g.restore();
  }
  if (k === 1) { S.e.save(); S.e.setTransform(1, 0, 0, 1, 0, 0); flare(S.e, 1500, 130, 1, '#ffffff', { rot: .1 }); S.e.restore(); }
  const A = { bloom: .6, halo: .12 };
  return k === 3 ? { ...A, sat: .9, shadowTint: [.1, .14, .3] } : k === 2 ? { ...A, bloom: .8, halo: .25 } : A;
}

// 念白 1 —— 有人说孤单？：长长的海堤上，一个老人、一辆车，很小 ——
export function seawall(S) {
  const { g, e, t, lt, u } = S, P = PAL.noon;
  const Pl = plate('seawall', W, H, (c) => {
    vgrad(c, 0, 0, W, 640, [[0, '#1848c0'], [.7, '#4f96ea'], [1, '#c8ecff']]);
    const R = rng(81); cumulus(c, 1450, 650, 2.4, '#ffffff', '#8fb0ea', R, false); cumulus(c, 380, 650, 1.6, '#ffffff', '#9ab8ee', R, false); cumulus(c, 900, 260, 1.0, '#ffffff', '#9ab8ee', R, false);
    vgrad(c, 0, 640, W, 180, [[0, '#2f84da'], [.5, '#24a4c8'], [1, '#6fdcd0']]);
    for (let k = 0; k < 90; k++) { c.fillStyle = rgba('#ffffff', .25 + R() * .4); c.fillRect(R() * W, 646 + R() * 160, 20 + R() * 110, 2); }
    // 海堤：一条长长的水泥带，伸向画外
    cel(c, poly([[-20, 800], [1940, 760], [1940, 840], [-20, 900]]), { f: '#f0ece0', s: '#b8b4c4', so: [0, -26], l: '#6a6a80', lw: 4 });
    vgrad(c, -20, 880, 1960, 220, [[0, '#c8c2b4'], [1, '#9a968c']]); c.fillStyle = '#8a8a9a'; for (let x = 60; x < W; x += 260) c.fillRect(x, 846 + (1 - x / W) * 46, 4, 240);
  });
  setCam(S, lerp(W / 2, 1040, eio(u)), lerp(H / 2, 600, eio(u)), lerp(1, 1.18, eio(u)));
  drawPlate(S, Pl, 0, 0);
  for (let k = 0; k < 10; k++) { g.fillStyle = rgba('#ffffff', .5); g.fillRect(((k * 331 + f8(t) * 14) % W), 660 + (k * 37) % 130, 60, 2); }
  celLayer(S, c => { c.translate(1400, 796); c.scale(.5, .5); rider(c, P, { noRider: true, wheelA: .3, speed: 0, pack: true, lampOn: false }); });
  // 他坐在堤上，面朝海，手里一只搪瓷缸
  const C = { top: P.leather, bottom: P.pants, shoe: P.boot, skin: P.skinOld, hair: P.hairOld };
  celLayer(S, c => { c.translate(1000, 762); c.scale(.6, .6); figure(c, C, { lean: -.06, th: [1.5, 1.42], kn: [1.45, 1.4], ua: [.3, .1], fa: [1.5, .2], headTilt: -.06 });
    const sp = flutter(4, -170, Math.PI - .3, 110, 8, 9, 1.1, (f8(t) % 8) / 8 * TAU, 30); cel(c, ribbon(sp, uu => 26 - uu * 8), { f: P.teal.f, s: P.teal.s, so: [0, -6], l: P.teal.l, lw: 2 }); });
  gulls(S, t, [[520, 380, 1, 0], [700, 300, .7, 1], [1560, 420, .8, 2]]);
  return { bloom: .5, halo: .08, shadowTint: [.1, .14, .3] };
}

// 念白 2 —— 呵，那是自由的味道。：抿一口，呼一口气 ——
export function sip(S) {
  const { g, e, t, lt, u } = S, P = PAL.noon, st = f8(lt);
  setCam(S, lerp(W / 2, 1010, eio(u)), H / 2, lerp(1, 1.07, eio(u)));
  vgrad(g, 0, 0, W, 760, [[0, '#1b4cc4'], [.7, '#5fa4f0'], [1, '#c8ecff']]);
  const C = noonClouds(); g.save(); g.filter = 'blur(3px)'; { let ox = ((-700 - t * 10) % C.w + C.w) % C.w - C.w; for (let x = ox; x < W + 200; x += C.w) g.drawImage(C.c, x, 200); } g.restore();
  vgrad(g, 0, 760, W, 330, [[0, '#2f84da'], [.5, '#24a4c8'], [1, '#6fdcd0']]);
  for (let k = 0; k < 14; k++) { g.fillStyle = rgba('#ffffff', .45); g.fillRect(((k * 271 + f8(t) * 18) % W), 780 + (k * 53) % 280, 90, 3); }
  // 举杯（一拍三）：0–5 举，6–15 喝，16–20 放，之后呼气 + 嘴角
  const up = st < 6 ? ss(st / 5) : st < 16 ? 1 : 1 - ss((st - 16) / 4), drink = st >= 6 && st < 16, after = st >= 21;
  celLayer(S, c => { c.translate(820, 470); c.scale(2.3, 2.3);
    for (let k = 0; k < 2; k++) { const sp = flutter(-90, 150 + k * 10, Math.PI - .25 + k * .1, 200 - k * 40, 12, 10, 1.1, (st % 8) / 8 * TAU + k * 2, 30); cel(c, ribbon(sp, uu => 32 - uu * 10 - k * 5), { f: k ? P.teal.s : P.teal.f, s: P.teal.s, so: [0, -8], l: P.teal.l, lw: 1.6 }); }
    c.save(); c.rotate(drink ? -.1 : 0); head(c, P, { who: 'old', view: 'side', expr: drink ? 'closed' : after ? 'smile' : 'neutral', mouth: after ? 'smile' : 'flat', body: 'old' }); c.restore();
    // 手臂 + 搪瓷缸
    const hx = lerp(150, 110, up), hy = lerp(330, 96, up);
    cel(c, limb([-60, 330], [hx - 60, hy + 90], 80, 60), { f: P.leather.f, s: P.leather.s, so: [-10, -6], h: P.leather.h, ho: [3, 3], l: P.leather.l, lw: 1.8 });
    c.save(); c.translate(hx, hy); c.rotate(-up * .5 - (drink ? .25 : 0));
    cel(c, poly([[-36, -44], [36, -44], [32, 44], [-32, 44]]), { f: P.white.f, s: P.white.s, so: [-10, 0], h: P.white.h, ho: [4, 0], l: P.white.l, lw: 1.8 }); c.fillStyle = P.teal.f; c.fillRect(-37, -46, 74, 9); c.strokeStyle = P.white.l; c.lineWidth = 5; c.beginPath(); c.arc(-40, 0, 20, Math.PI * .5, Math.PI * 1.5); c.stroke();
    const hd = new Path2D(); hd.ellipse(8, 14, 30, 34, 0, 0, TAU); cel(c, hd, { f: P.skinOld.f, s: P.skinOld.s, so: [-6, -6], l: P.skinOld.l, lw: 1.6 }); for (let i = 0; i < 3; i++) line(c, [[-14, -2 + i * 14], [30, -4 + i * 14]], mix(P.skinOld.l, P.skinOld.f, .4), 1.2);
    c.restore(); });
  if (st >= 20 && st < 30) { const k = (st - 20) / 10; for (let i = 0; i < 3; i++) { g.fillStyle = rgba('#ffffff', .6 * (1 - k)); g.beginPath(); g.ellipse(1060 + k * 200 + i * 50, 640 - k * 50 - i * 14, 30 + k * 40 - i * 6, 20 + k * 20 - i * 4, 0, 0, TAU); g.fill(); } }
  S.e.save(); S.e.setTransform(1, 0, 0, 1, 0, 0); flare(S.e, 1650, 150, .9, '#fff6d8', { rot: .2 }); S.e.restore();
  return { bloom: .5, halo: .1, shadowTint: [.1, .14, .3] };
}

// 念白 4 —— 阳光晒得那个老脸…笑开花：全片的情绪顶点，定住 ——
export function laugh(S, o) {
  const { g, e, t, lt, u } = S, P = PAL.noon, d = t - o.laugh, st = f8(t) - f8(o.laugh);
  setCam(S, lerp(W / 2, 1000, eio(u)), lerp(H / 2, 500, eio(u)), lerp(1, 1.14, eio(u)));
  // 背景：暖金色的天，放射的光
  vgrad(g, 0, 0, W, H, [[0, '#ffd86a'], [.5, '#ffb07a'], [1, '#ff8a9a']]);
  for (let k = 0; k < 14; k++) { g.fillStyle = rgba('#ffffff', .12); g.save(); g.translate(400, 100); g.rotate(k * TAU / 14 + t * .06); g.fill(poly([[0, 0], [2600, -150], [2600, 150]])); g.restore(); }
  airbrush(g, 400, 100, 900, 700, '#ffffff', .6); airbrush(e, 400, 100, 420, 320, '#fff0c0', .5);
  // 脸：先是抿着的笑 → 三张画笑开
  const expr = d < 0 ? { expr: 'smile', E: { open: .5, lid: .3 } } : st === 0 ? { expr: 'smirk', mouth: 'smile', E: { open: .4 } } : st === 1 ? { expr: 'laugh', mouth: 'grin', E: { open: .25, laugh: false, smile: true } } : { expr: 'laugh', mouth: st % 6 < 3 ? 'grin' : 'wide' };
  const bx = d < 0 ? lerp(-300, W + 400, seg(lt, .2, o.laugh - (t - lt))) : -900;
  const bob = d > .2 ? ((f12(t) % 4 < 2) ? 7 : 0) : 0;
  LWK.k = .62;
  celLayer(S, c => { c.translate(900, 420 + bob); c.scale(4.3, 4.3); head(c, P, { who: 'old', ...expr, body: 'old', light: [-1, -.6], blush: .25, skinRim: '#fff0b0' }); },
    { bands: [{ x: bx, w: 760, col: '#fff6c0', a: .34, ang: .3 }] });
  LWK.k = 1;
  // 那张"留住"的画：整层压一道暖色渐变（harmony，全片只有这一处赛璐璐里用渐变）
  for (const c of [g]) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'soft-light'; const gr = c.createLinearGradient(0, 0, W, H); gr.addColorStop(0, 'rgba(255,240,180,.6)'); gr.addColorStop(1, 'rgba(120,60,140,.5)'); c.fillStyle = gr; c.fillRect(0, 0, W, H); c.restore(); }
  // 笑开的那一刻：路边的花一朵朵开（一拍一）
  if (d > 0) { setCam(S); const cols = ['#ffffff', '#ffe066', '#ff8ab0', '#8fe8d8', '#ff6a7a']; celLayer(S, c => { for (let i = 0; i < 26; i++) { const R = rng(i * 5 + 1), k = back(seg(d, i * .045, i * .045 + .3), 2.4); if (k <= 0) continue; const side = i % 2, x = side ? W - 60 - R() * 420 : 60 + R() * 380, y = 1080 - R() * 520 - (R() < .3 ? 260 : 0), r = (40 + R() * 60) * k; flower(c, x, y, r, i + Math.sin(t * 2 + i) * .1, cols[i % 5]); } }, { occlude: false }); if (d < 2 / 24) flash(S, .55, '#fff6d8'); }
  return { bloom: .7, halo: .2, soft: .3 };
}
