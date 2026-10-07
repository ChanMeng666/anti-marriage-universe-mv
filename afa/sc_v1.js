// 主歌 1 + 导歌里的"室内戏"：饭桌、拉磨的驴、喧哗、媒婆、相亲目录、长期饭票、名为责任的塔、工资袋
import { W, H, TAU, rgba, mix, path, poly, cel, line, hash, rng, vgrad, airbrush, canvas,
  clamp, lerp, seg, ss, eio, eo, ei, back, spring, q12, q8, f12, f8, setCam, celLayer, plate, cached, drawPlate,
  text, neon, neonRect, flash, impact, shake, limb, F, tag } from './stage.js';
import { ribbon, flutter, LWK } from './cel.js';
import { PAL, TEAL, RED } from './pal.js';
import { head, figure, SUITC, poseLerp, silBust, handFlat, sleeve } from './people.js';
import { quad } from './beasts.js';
import { speedLines, flare, lamp } from './fx.js';

// —— 饭厅（纵向长画：吊灯 → 圆桌）——
function dining() {
  return plate('dining', W, 1500, (g, e) => {
    vgrad(g, 0, 0, W, 1500, [[0, '#3a1c18'], [.3, '#7a4428'], [.7, '#8a4e2c'], [1, '#3a1c18']]);
    for (let x = 0; x < W; x += 160) { g.fillStyle = rgba('#000000', .08); g.fillRect(x, 0, 4, 1100); }
    // 墙上：福字、挂历、挂钟
    cel(g, poly([[300, 520], [420, 400], [540, 520], [420, 640]]), { f: '#e8304a', s: '#a81f3a', so: [0, -20], l: '#5a0f20', lw: 4 }); text(g, '福', 420, 524, { size: 120, col: '#ffd86a', fam: F.zh });
    cel(g, poly([[1420, 420], [1640, 420], [1640, 740], [1420, 740]]), { f: '#f6ecd2', s: '#cdbf9c', so: [0, -20], l: '#4a3420', lw: 4 }); g.fillStyle = '#e8304a'; g.fillRect(1420, 420, 220, 70); text(g, '30', 1530, 610, { size: 150, col: '#e8304a', fam: F.it, wt: 'italic 900' });
    const ck = new Path2D(); ck.arc(980, 470, 70, 0, TAU); cel(g, ck, { f: '#f6ecd2', s: '#cdbf9c', so: [-10, -8], l: '#4a3420', lw: 6 }); line(g, [[980, 470], [980, 420]], '#4a3420', 5); line(g, [[980, 470], [1016, 486]], '#4a3420', 5);
    // 吊灯
    g.strokeStyle = '#1a0c08'; g.lineWidth = 6; g.beginPath(); g.moveTo(960, 0); g.lineTo(960, 170); g.stroke();
    cel(g, [[780, 300], [840, 180], [1080, 180], [1140, 300]], { f: '#e8304a', s: '#a81f3a', so: [-24, 0], h: '#ff9a8c', ho: [8, 0], l: '#5a0f20', lw: 4 });
    for (let k = 0; k < 9; k++) { g.strokeStyle = '#ffd86a'; g.lineWidth = 4; g.beginPath(); g.moveTo(800 + k * 40, 302); g.lineTo(800 + k * 40, 340); g.stroke(); }
    g.fillStyle = '#fff4c8'; g.beginPath(); g.ellipse(960, 304, 170, 22, 0, 0, TAU); g.fill(); e.fillStyle = '#ffe0a0'; e.beginPath(); e.ellipse(960, 310, 160, 26, 0, 0, TAU); e.fill();
    const lg = g.createLinearGradient(0, 300, 0, 1400); lg.addColorStop(0, rgba('#ffd08a', .42)); lg.addColorStop(1, rgba('#ffd08a', 0)); g.fillStyle = lg; g.fill(poly([[790, 306], [1130, 306], [1800, 1500], [120, 1500]]));
    // 圆桌 + 转盘 + 菜
    const tb = new Path2D(); tb.ellipse(960, 1330, 760, 210, 0, 0, TAU); cel(g, tb, { f: '#c88a54', s: '#8a5634', so: [0, -30], h: '#eab880', ho: [0, 8], l: '#3e2414', lw: 4 });
    const ls = new Path2D(); ls.ellipse(960, 1310, 420, 110, 0, 0, TAU); cel(g, ls, { f: '#e8d8b8', s: '#b8a480', so: [0, -14], l: '#4a3420', lw: 3 });
    for (const [x, y, c1] of [[760, 1300, '#e8603a'], [960, 1260, '#6aa84a'], [1160, 1300, '#e8b84a'], [900, 1350, '#f6ecd2'], [1060, 1352, '#b84a3a']]) { const d = new Path2D(); d.ellipse(x, y, 84, 30, 0, 0, TAU); cel(g, d, { f: '#fbf8ee', l: '#4a3420', lw: 2.5 }); const f = new Path2D(); f.ellipse(x, y - 8, 60, 20, 0, 0, TAU); cel(g, f, { f: c1, s: mix(c1, '#3a1c18', .4), so: [0, -8], l: '#4a3420', lw: 2 }); }
  });
}
function balloon(S, x, y, w, h, txt, k, col, id, tail = 1) {   // 尖刺对话框：k = 弹出进度
  if (k <= 0) return;
  const { g, e } = S, s = back(clamp(k * 3), 2.2), R = rng(Math.round(x + y));
  const pts = []; for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, r = (i % 2 ? 1 : .78 + R() * .08); pts.push([Math.cos(a) * w / 2 * r, Math.sin(a) * h / 2 * r, 1]); }
  for (const c of [g, e]) { c.save(); c.translate(x, y); c.scale(s, s); c.rotate((hash(f12(S.t) + x) - .5) * .04);
    if (c === g) { cel(c, pts, { f: '#fffbe8', l: '#3a1410', lw: 5 }); c.fillStyle = '#fffbe8'; c.fill(poly([[tail * w * .2, h * .3], [tail * w * .44, h * .78], [tail * w * .02, h * .4]])); text(c, txt, 0, 6, { size: h * .5, col, fam: F.zh }); }
    else { c.fillStyle = '#000'; c.fill(path(pts)); }
    c.restore(); }
  if (id) S.txt(id, txt, x - w / 2, y - h / 2, x + w / 2, y + h / 2);
}

// 3 —— 家人催他立业成家：一圈探过来的剪影，小小的阿发 ——
export function family(S) {
  const { g, e, t, lt, u } = S, P = PAL.amber, fr = f12(t), L = S.L[2];
  const cy = lerp(430, 960, eio(seg(lt, 0, 1.0)));
  setCam(S, W / 2, cy, 1);
  drawPlate(S, dining(), 0, 0);
  // 阿发：坐在桌子那头，低着眼
  const st = f8(lt);
  celLayer(S, c => { c.translate(960, 890); c.scale(.95, .95); head(c, P, { expr: st % 16 === 9 ? 'closed' : 'bored', look: [0, .7], body: 'suit', rim: { c: '#ffb860', d: [0, -3] } }); });
  // 亲戚们：背光的大剪影，说话时一拍二地耸动；筷子指着他
  const rel = [[150, 1250, 2.0, 0, .16], [520, 1420, 1.7, 1, .08], [1420, 1430, 1.8, 2, -.1], [1790, 1240, 2.1, 3, -.18], [30, 940, 1.2, 2, .22], [1900, 920, 1.25, 1, -.22]];
  rel.forEach(([x, y, s, kind, rot], i) => {
    const bobk = ((fr + i * 2) % 4 < 2 ? 1 : 0) * 10 * (i % 2 ? 1 : -1);
    celLayer(S, c => { c.translate(x, y + bobk); c.rotate(rot + Math.sin(fr * .9 + i) * .02); c.scale(s, s); silBust(c, '#24100e', '#ffb060', kind, { rd: [0, 7] });
      if (i < 4) { const dir = x < 960 ? 1 : -1; c.strokeStyle = '#24100e'; c.lineCap = 'round'; c.lineWidth = 34; c.beginPath(); c.moveTo(dir * 110, 190); c.lineTo(dir * 210, 120 - bobk); c.stroke(); c.strokeStyle = '#e8d8b8'; c.lineWidth = 5; c.beginPath(); c.moveTo(dir * 214, 116 - bobk); c.lineTo(dir * 330, 40 - bobk); c.moveTo(dir * 220, 128 - bobk); c.lineTo(dir * 340, 62 - bobk); c.stroke(); } });
  });
  // 「立业！」「成家！」
  const ct = ch => { for (const [a, b, ts] of L.ct) if (L.text.slice(a, b) === ch) return ts; return L.t0; };
  setCam(S);
  balloon(S, 560, 400, 500, 300, '立业！', (t - ct('立') + .1) * 2, '#e8304a', 'liye', 1);
  balloon(S, 1380, 440, 500, 300, '成家！', (t - ct('成') + .1) * 2, '#e8304a', 'chengjia', -1);
  return { bloom: .85 };
}

// 4 —— 其实是想找头能拉磨的驴把套下 ——
export function donkey(S, o) {
  const { g, e, t, lt, u } = S, P = PAL.amber, fr = f12(t), d = t - o.drop;
  const z = d < 0 ? lerp(1.28, 1.16, eio(seg(lt, 0, o.drop - (t - lt)))) : lerp(1.16, 1, eio(seg(d, .2, 1.6)));
  const [sx, sy] = shake(t, o.drop, 14, .4);
  setCam(S, lerp(1180, W / 2, clamp((1.28 - z) / .28)) - sx, lerp(600, H / 2, clamp((1.28 - z) / .28)) - sy, z);
  // 背景：晒谷场一样的土黄 + 暮色天
  vgrad(g, 0, 0, W, 700, [[0, '#3a4a7a'], [.6, '#c87a5a'], [1, '#ffd08a']]);
  airbrush(g, 400, 640, 700, 260, '#fff0c0', .5);
  g.fillStyle = '#6a4a5a'; g.fill(path([[0, 700], [0, 610], [300, 560], [640, 620], [1000, 580], [1400, 630], [1920, 590], [1920, 700]]));
  vgrad(g, 0, 700, W, 380, [[0, '#d8a45a'], [1, '#8a5a34']]);
  const walk = d < 0 ? 1 : .55, gx = -(t * 260 * walk);
  // 磨道（地上的一圈车辙，向后滑）
  g.strokeStyle = rgba('#6a3e24', .45); g.lineWidth = 10; for (let k = -1; k < 8; k++) { const x = ((gx % 300) + 300) % 300 + k * 300 - 300; g.beginPath(); g.moveTo(x, 930); g.lineTo(x + 120, 938); g.stroke(); g.beginPath(); g.moveTo(x + 150, 1000); g.lineTo(x + 250, 1006); g.stroke(); }
  // 石磨（在左边）：套上之后才转；金币从磨嘴里流出来
  const turn = d > .3 ? (q12(t) - o.drop) * 1.6 : 0;
  celLayer(S, c => {
    c.translate(430, 800);
    cel(c, poly([[-250, 60], [250, 60], [280, 150], [-280, 150]]), { f: '#9a8a8a', s: '#6a5c66', so: [0, -18], l: '#2e2630', lw: 4 });
    const st = new Path2D(); st.ellipse(0, -30, 230, 70, 0, 0, TAU); const sb = [[-230, -30], [-230, 60], [0, 130], [230, 60], [230, -30]];
    cel(c, sb, { f: '#b8a8a8', s: '#84747e', so: [-30, 0], l: '#2e2630', lw: 4 }); cel(c, st, { f: '#d0c2c0', s: '#a8989c', so: [-14, -6], l: '#2e2630', lw: 4 });
    for (let k = 0; k < 8; k++) { const a = turn + k * TAU / 8; c.strokeStyle = '#84747e'; c.lineWidth = 5; c.beginPath(); c.moveTo(Math.cos(a) * 30, -30 + Math.sin(a) * 9); c.lineTo(Math.cos(a) * 210, -30 + Math.sin(a) * 62); c.stroke(); }
    const hb = new Path2D(); hb.ellipse(0, -34, 26, 10, 0, 0, TAU); cel(c, hb, { f: '#6a4a30', l: '#2e2630', lw: 3 });
    // 磨杆：伸向驴
    cel(c, limb([Math.cos(turn) * 6, -40], [560, -150], 26, 22), { f: '#b07a4e', s: '#7a4e34', so: [0, -8], l: '#3e2414', lw: 3 });
  });
  if (d > .6) { for (let k = 0; k < 14; k++) { const life = ((t * 1.1 + k / 14) % 1), cx = 300 - life * 150 + (k % 3) * 14, cy = 880 + life * life * 180, a = Math.min(1, life * 8) * (1 - life * .3); for (const c of [g, e]) { c.save(); c.globalAlpha = a * (c === e ? .6 : 1); c.fillStyle = c === g ? '#ffd86a' : '#ffc040'; c.beginPath(); c.ellipse(cx, cy, 20, 12 + (fr + k) % 3 * 3, 0, 0, TAU); c.fill(); if (c === g) { c.strokeStyle = '#9a6c28'; c.lineWidth = 2.5; c.stroke(); } c.restore(); } }
    celLayer(S, c => { cel(c, [[60, 1090], [80, 960], [160, 930], [270, 950], [300, 1090]], { f: '#c8a878', s: '#94744e', so: [-16, 0], l: '#3e2414', lw: 4 }); tag(c, 186, 1024, 150, 70, { f: '#e8304a', l: '#5a0f20', text: '家用', col: '#fff0c0', size: 46, fam: F.zh }); }); S.txt('jiayong', '家用', 110, 988, 262, 1060); }
  // 驴：系着青绿领带，起先昂头走；套落下 → 蒙上眼罩，耷拉着拉磨
  const DK = PAL.amber.donkey, sq = d > 0 ? Math.sin(Math.min(1, d * 5) * Math.PI) * .08 : 0;
  celLayer(S, c => { c.translate(1180, 1000); c.scale(1.12 * (1 + sq), 1.12 * (1 - sq));
    quad(c, DK, { kind: 'donkey', gait: 'walk', ph: (fr / (d < 0 ? 8 : 12)) % 1, tie: P.teal, yoke: d < -.9 ? null : clamp(1 + d / .9 * 1) * (d < 0 ? ei(1 + d / .9) : 1), blind: d > .08, lid: d > 0, wind: 0 }); });
  if (d < 0 && d > -1.6) {   // 递套的手（从上面伸下来的大剪影）
    const k = eio(seg(d, -1.6, -.9));
    celLayer(S, c => { c.translate(1330, lerp(-300, 60, k)); c.fillStyle = '#2a1418'; for (const s of [-1, 1]) { c.save(); c.scale(s, 1); c.fill(path([[40, -500], [200, -500], [170, 120], [130, 200], [60, 210], [30, 120]])); c.restore(); } }, { alpha: 1 - seg(d, -.3, -.05) });
  }
  if (d > 0 && d < .6) { for (let k = 0; k < 7; k++) { const a = Math.PI * (1 + k / 6), r = 60 + d * 380; g.fillStyle = rgba('#f6e2c0', .7 * (1 - d / .6)); g.beginPath(); g.ellipse(1260 + Math.cos(a) * r, 990 + Math.sin(a) * r * .3, 46 - d * 30, 30 - d * 20, 0, 0, TAU); g.fill(); } }
  if (d >= 0 && d < 2 / 24) flash(S, .6);
  if (d > .5) { const k = ((fr % 12) / 12); celLayer(S, c => { c.translate(1500 + k * 30, 640 - k * 40); cel(c, [[0, -30, 1], [14, 0], [0, 14], [-14, 0]], { f: '#e8f8ff', l: '#4a6a98', lw: 2.5, h: '#ffffff', hi: [[[-6, -4], [-2, -12], [-8, 4]]] }); }, { alpha: 1 - k }); }
  return { bloom: .8 };
}

// 5 —— 阿发冷眼看喧哗：他定着，背后四条嘴在滑 ——
export function noise(S) {
  const { g, e, t, lt, u } = S, P = PAL.amber, fr = f8(t);
  setCam(S, W / 2, H / 2, lerp(1, 1.06, u));
  const cols = ['#e8603a', '#e8b84a', '#c84a6a', '#d8843a'];
  for (let r = 0; r < 4; r++) {
    const y = r * 270, dir = r % 2 ? 1 : -1, off = t * 520 * dir;
    g.fillStyle = cols[r]; g.fillRect(-50, y, W + 100, 270); g.fillStyle = rgba('#3a1410', .25); g.fillRect(-50, y + 256, W + 100, 14);
    for (let k = -1; k < 7; k++) {
      const x = ((off % 360) + 360) % 360 + k * 360 - 200, op = [.15, .9, .5, 1, .3][(fr + k * 2 + r) % 5 < 0 ? 0 : (fr + k * 2 + r) % 5];
      g.save(); g.translate(x, y + 135);
      const mp = path([[-120, -10 - 20 * op, 1], [0, -30 - 30 * op], [120, -10 - 20 * op, 1], [70, 30 + 70 * op], [0, 44 + 80 * op], [-70, 30 + 70 * op]]);
      g.fillStyle = '#5a1a2a'; g.fill(mp); g.save(); g.clip(mp); g.fillStyle = '#fffbf0'; g.fillRect(-130, -80, 260, 54 + 6 * op); g.fillStyle = '#e0707a'; g.beginPath(); g.ellipse(0, 60 + 80 * op, 70, 50, 0, 0, TAU); g.fill(); g.restore();
      g.strokeStyle = '#a81f3a'; g.lineWidth = 14; g.lineJoin = 'round'; g.stroke(mp); g.strokeStyle = '#3a1410'; g.lineWidth = 3; g.stroke(mp);
      g.restore();
    }
  }
  vgrad(g, 0, 0, W, H, [[0, rgba('#2a1410', .3)], [.5, rgba('#2a1410', 0)], [1, rgba('#2a1410', .4)]]);
  celLayer(S, c => { c.translate(930, 430); c.scale(2.0, 2.0); head(c, P, { expr: f8(lt) === 7 ? 'closed' : 'cold', look: [.5, 0], body: 'suit', rim: { c: '#fff0c0', d: [-3, 0] } }); });
  return { bloom: .7 };
}

// 6 —— 媒婆嘴里那天花乱坠的话 ——
export function flower(g, x, y, r, rot, col) {
  g.save(); g.translate(x, y); g.rotate(rot);
  for (let k = 0; k < 5; k++) { g.save(); g.rotate(k * TAU / 5); cel(g, [[0, 0, 1], [-r * .45, -r * .6], [0, -r], [r * .45, -r * .6]], { f: col, s: mix(col, '#7a2a5a', .35), so: [-r * .12, 0], l: mix(col, '#3a1028', .7), lw: 1.8 }); g.restore(); }
  g.fillStyle = '#ffe066'; g.beginPath(); g.arc(0, 0, r * .24, 0, TAU); g.fill(); g.restore();
}
function meiFigure(c, P, t, o = {}) {
  const flap = ['pitchtalk', 'pitch', 'pitchtalk', 'pitch', 'pitchtalk'][f8(t) % 5];
  head(c, P, { who: 'mei', expr: o.expr || flap, mouth: o.mouth || (f8(t) % 3 === 0 ? 'wide' : f8(t) % 3 === 1 ? 'talk' : 'grin'), body: 'mei' });
}
export function mei(S) {
  const { g, e, t, lt, u } = S, P = PAL.amber, fr = f8(t);
  setCam(S, lerp(W / 2, 1000, u), H / 2, lerp(1, 1.06, u));
  vgrad(g, 0, 0, W, H, [[0, '#7a3a4a'], [.6, '#b05a4a'], [1, '#5a2a30']]);
  airbrush(g, 600, 300, 900, 600, '#ffd08a', .4);
  for (let k = 0; k < 8; k++) { g.fillStyle = rgba('#ffd86a', .1); g.save(); g.translate(640, 430); g.rotate(k * TAU / 8 + t * .2); g.fill(poly([[0, 0], [1600, -160], [1600, 160]])); g.restore(); }
  celLayer(S, c => { c.translate(600, 470 + ((f12(t) % 4 < 2) ? 6 : 0)); c.scale(2.2, 2.2); meiFigure(c, P, t);
    // 扇子
    c.save(); c.translate(140, 250); c.rotate(-.5 + Math.sin(fr * 1.6) * .22);
    for (let k = 0; k < 7; k++) { c.save(); c.rotate(-.9 + k * .3); cel(c, poly([[-8, 0], [8, 0], [34, -150], [-22, -156]]), { f: k % 2 ? P.gold.f : '#f6ecd2', s: P.gold.s, so: [-4, 0], l: P.gold.l, lw: 1.4 }); c.restore(); }
    const hd = new Path2D(); hd.ellipse(0, 14, 30, 24, 0, 0, TAU); cel(c, hd, { f: P.skinF.f, s: P.skinF.s, so: [-5, -5], l: P.skinF.l, lw: 1.4 });
    const br = new Path2D(); br.ellipse(-4, 44, 30, 9, 0, 0, TAU); cel(c, br, { f: P.jade.f, s: P.jade.s, so: [0, -3], l: P.jade.l, lw: 1.4 }); c.restore(); });
  // 从她嘴里涌出来的纸花（一拍一）：一道弧线向右，然后往下落
  const cols = ['#ff8ab8', '#ffd24a', '#c69aee', '#ff6a7a', '#8fe8d8', '#ffffff'];
  for (let k = 0; k < 46; k++) {
    const life = ((t * .42 + k / 46) % 1), R = rng(k * 7 + 3), sp = R(), x0 = 700, y0 = 640;
    const x = x0 + life * (700 + sp * 900), y = y0 - Math.sin(life * 2.6) * (220 + sp * 260) + life * life * (500 + sp * 500), r = 22 + R() * 30;
    const a = Math.min(1, life * 12);
    g.save(); g.globalAlpha = a; flower(g, x, y, r * Math.min(1, life * 6 + .3), life * 9 + k, cols[k % 6]); g.restore();
  }
  return { bloom: .8 };
}

// —— 相亲目录的一页 / 翻过来是饭票 ——
function catalogCard() {
  return plate('catalogCard', 900, 620, (g) => {
    const bp = new Path2D(); bp.roundRect(4, 4, 892, 612, 22); cel(g, bp, { f: '#fff3e6', s: '#e8ccc0', so: [0, -30], l: '#5a2a3a', lw: 6 });
    g.fillStyle = '#ffd0dc'; g.fillRect(40, 40, 400, 540); g.strokeStyle = '#e2b24e'; g.lineWidth = 10; g.strokeRect(40, 40, 400, 540);
    // 新娘的剪影（红）：没有脸，只是一件商品
    g.save(); g.beginPath(); g.rect(45, 45, 390, 530); g.clip();
    g.fillStyle = '#ffffff'; g.globalAlpha = .7; g.fill(path([[140, 150], [240, 60], [340, 150], [400, 580], [80, 580]])); g.globalAlpha = 1;
    g.fillStyle = '#3a2a4e'; g.beginPath(); g.ellipse(240, 220, 74, 90, 0, 0, TAU); g.fill(); g.fill(path([[170, 220], [150, 420], [200, 440], [240, 300], [280, 440], [330, 420], [310, 220]]));
    g.fillStyle = '#ef3b4a'; g.fill(path([[110, 600], [130, 400], [200, 340], [280, 340], [350, 400], [370, 600]]));
    g.fillStyle = '#ffdcc8'; g.beginPath(); g.ellipse(240, 232, 50, 62, 0, 0, TAU); g.fill();
    g.fillStyle = '#ffd24a'; for (const [x, y] of [[90, 100], [390, 130], [100, 300], [400, 330]]) { g.save(); g.translate(x, y); g.fill(poly([[0, -22], [6, -6], [22, 0], [6, 6], [0, 22], [-6, 6], [-22, 0], [-6, -6]])); g.restore(); }
    g.restore();
    text(g, '相 亲 目 录', 660, 86, { size: 56, col: '#a81f3a', fam: F.zh });
    g.fillStyle = '#a81f3a'; g.fillRect(480, 124, 370, 5);
    text(g, '编号  No.028', 660, 170, { size: 40, col: '#5a2a3a', fam: F.zh });
    for (let k = 0; k < 6; k++) { g.fillStyle = rgba('#5a2a3a', .2); g.fillRect(490, 230 + k * 58, 350, 12); }
  });
}
function ticketCard() {
  return plate('ticketCard', 900, 620, (g) => {
    const bp = new Path2D(); bp.roundRect(4, 4, 892, 612, 14); cel(g, bp, { f: '#f6ecd2', s: '#d8c8a0', so: [0, -30], l: '#4a3420', lw: 6 });
    g.strokeStyle = '#b8444a'; g.lineWidth = 5; g.strokeRect(26, 26, 848, 568); g.lineWidth = 2; g.strokeRect(38, 38, 824, 544);
    // 存根的齿孔线
    g.fillStyle = '#4a3420'; for (let y = 40; y < 590; y += 22) { g.beginPath(); g.arc(250, y, 4, 0, TAU); g.fill(); }
    // 头像（双色印刷）
    g.fillStyle = '#f0d8b0'; g.fillRect(52, 110, 180, 230); g.save(); g.beginPath(); g.rect(52, 110, 180, 230); g.clip(); g.translate(142, 220); g.scale(.72, .72);
    head(g, PAL.amber, { expr: 'bored', body: 'suit' }); g.restore(); g.strokeStyle = '#4a3420'; g.lineWidth = 3; g.strokeRect(52, 110, 180, 230);
    text(g, '持票人', 142, 76, { size: 34, col: '#4a3420', fam: F.zh }); text(g, '阿发', 142, 392, { size: 64, col: '#4a3420', fam: F.zh }); text(g, '男 · 三十加', 142, 452, { size: 30, col: '#4a3420', fam: F.zh }); text(g, 'No.000030', 142, 540, { size: 32, col: '#b8444a', fam: F.it, wt: 'italic 800' });
    text(g, '饭 票', 660, 250, { size: 230, col: '#b8444a', fam: F.zh });
    g.fillStyle = '#b8444a'; g.fillRect(290, 380, 560, 5);
    text(g, '凭票供应：房 · 车 · 彩礼 · 工资卡', 570, 430, { size: 34, col: '#4a3420', fam: F.zh });
    text(g, '有效期：一辈子', 570, 500, { size: 46, col: '#4a3420', fam: F.zh });
    text(g, '概不退换', 570, 556, { size: 28, col: '#8a6a50', fam: F.zh });
  });
}
function meiHand(c, P, x, y, rot, s = 1) {   // 媒婆的手：玉镯、红指甲
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  cel(c, poly([[-700, -80], [-30, -64], [-30, 64], [-700, 90]]), { f: P.purple.f, s: P.purple.s, so: [0, -30], l: P.purple.l, lw: 2.6 });
  c.fillStyle = P.gold.f; c.fillRect(-60, -70, 12, 140);
  handFlat(c, P.skinF, { spread: .2, curl: .1 });
  for (let i = 0; i < 4; i++) { c.fillStyle = P.lip; c.beginPath(); c.ellipse(262 + (i === 0 || i === 3 ? -22 : 6), -54 + i * 36, 16, 11, 0, 0, TAU); c.fill(); }
  const br = new Path2D(); br.ellipse(-6, 0, 16, 84, 0, 0, TAU); cel(c, br, { f: P.jade.f, s: P.jade.s, so: [-4, 0], h: P.jade.h, ho: [2, 0], l: P.jade.l, lw: 2 });
  c.restore();
}
function burstTag(S, x, y, r, txt, col, d, id, rot = 0) {
  if (d < 0) return;
  const { g, e } = S, s = d < 3 / 24 ? [1.5, 1.2, .94][Math.floor(d * 24)] : 1;
  const pts = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, rr = i % 2 ? r : r * .8; pts.push([Math.cos(a) * rr, Math.sin(a) * rr, 1]); }
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.save(); g.translate(8, 10); g.fillStyle = rgba('#3a1028', .35); g.fill(path(pts)); g.restore();
  cel(g, pts, { f: col, s: mix(col, '#7a2a3a', .3), so: [0, -r * .12], l: '#3a1028', lw: 4 });
  const n = [...txt].length; text(g, txt, 0, 4, { size: n > 2 ? r * .42 : r * .7, col: '#3a1028', fam: F.zh });
  g.restore();
  S.txt(id, txt, x - r, y - r, x + r, y + r);
  if (d < 1 / 24) flash(S, .45);
}
// 7 —— 什么温柔贤惠宜室宜家 ——
export function catalog(S, o) {
  const { g, e, t, lt, u } = S, P = PAL.amber;
  setCam(S, W / 2, H / 2, lerp(1, 1.07, u));
  vgrad(g, 0, 0, W, H, [[0, '#7a3a4a'], [1, '#4a2230']]); airbrush(g, 960, 500, 1100, 700, '#ffd08a', .32);
  for (let k = 0; k < 10; k++) { g.fillStyle = rgba('#ffd86a', .07); g.save(); g.translate(960, 520); g.rotate(k * TAU / 10 + t * .15); g.fill(poly([[0, 0], [1800, -150], [1800, 150]])); g.restore(); }
  const C = catalogCard(), inK = back(seg(lt, 0, .35), 1.3), cx = 960, cy = lerp(1500, 510, inK), rot = -.06 + Math.sin(q8(t) * 2) * .008;
  g.save(); g.translate(cx, cy); g.rotate(rot); g.fillStyle = rgba('#2a0c18', .4); g.fillRect(-440, -290, 900, 640); g.restore();
  celLayer(S, c => { c.translate(cx, cy); c.rotate(rot); c.scale(1.12, 1.12); c.drawImage(C.c, -450, -310); });
  celLayer(S, c => { meiHand(c, P, 330, cy + 250, -.25, .9); c.save(); c.scale(-1, 1); meiHand(c, P, -1650, cy + 290, -.3, .9); c.restore(); });
  // 高光滑过照片
  const hl = seg(lt, .5, 1.5); if (hl > 0 && hl < 1) { g.save(); g.translate(cx, cy); g.rotate(rot); g.beginPath(); g.rect(-460, -300, 440, 600); g.clip(); g.globalCompositeOperation = 'lighter'; const x = -560 + hl * 700; const gr = g.createLinearGradient(x, 0, x + 120, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.transform(1, 0, -.3, 1, 0, 0); g.fillRect(x, -320, 120, 660); g.restore(); }
  // 贴纸一拍一张
  setCam(S);
  burstTag(S, 1150, 330, 130, '温柔', '#ffb0c8', t - o.sticks[0], 's1', -.12);
  burstTag(S, 1430, 500, 130, '贤惠', '#ffe066', t - o.sticks[1], 's2', .1);
  burstTag(S, 1180, 700, 170, '宜室宜家', '#8fe8d8', t - o.sticks[2], 's3', -.05);
  return { bloom: .8 };
}
// 8 —— 不过是看上我也能算个长期饭票吧 ——
export function ticket(S, o) {
  const { g, e, t, lt, u } = S, P = PAL.amber, d = t - o.stamp;
  const [sx, sy] = shake(t, o.stamp, 18, .4);
  const pre = t < o.flip, push = pre ? lerp(1.07, 1.1, S.u * 6) : d > 0 ? lerp(1.0, 1.1, eio(seg(d, .3, S.shot.t1 - o.stamp))) : lerp(1.16, 1.0, eio(seg(t, o.flip + .5, o.stamp)));
  const panx = pre || d > 0 ? 0 : lerp(-90, 90, eio(seg(t, o.flip + .6, o.stamp - .2)));
  setCam(S, W / 2 + panx - sx, H / 2 - sy, push);
  vgrad(g, 0, 0, W, H, [[0, '#7a3a4a'], [1, '#4a2230']]); airbrush(g, 960, 500, 1100, 700, '#ffd08a', .32);
  for (let k = 0; k < 10; k++) { g.fillStyle = rgba('#ffd86a', .07); g.save(); g.translate(960, 520); g.rotate(k * TAU / 10 + t * .15); g.fill(poly([[0, 0], [1800, -150], [1800, 150]])); g.restore(); }
  // 翻面：目录 → 饭票（一拍二的 5 张）
  const fk = clamp((q12(t) - o.flip) / (5 / 12)), sxk = Math.abs(Math.cos(fk * Math.PI)), front = fk < .5;
  const C = front ? catalogCard() : ticketCard(), cx = 960, cy = 510, rot = lerp(-.06, .04, fk), cs = lerp(1.12, 1.15, fk);
  g.save(); g.translate(cx + 14, cy + 20); g.rotate(rot); g.scale(Math.max(.02, sxk), 1); g.fillStyle = rgba('#2a0c18', .4); g.fillRect(-500, -340, 1000, 700); g.restore();
  celLayer(S, c => { c.translate(cx, cy - Math.sin(fk * Math.PI) * 40); c.rotate(rot); c.scale(cs * Math.max(.02, sxk), cs * (1 + Math.sin(fk * Math.PI) * .06)); c.drawImage(C.c, -450, -310); });
  if (pre) celLayer(S, c => { meiHand(c, P, 330, cy + 250, -.25, .9); c.save(); c.scale(-1, 1); meiHand(c, P, -1650, cy + 290, -.3, .9); c.restore(); });
  if (fk <= 0) { burstTag(S, 1150, 330, 130, '温柔', '#ffb0c8', 9, 's1', -.12); burstTag(S, 1430, 500, 130, '贤惠', '#ffe066', 9, 's2', .1); burstTag(S, 1180, 700, 170, '宜室宜家', '#8fe8d8', 9, 's3', -.05); }
  if (fk >= 1) { S.txt('fanpiao', '饭票', 900, 300, 1500, 580); S.txt('valid', '有效期：一辈子', 900, 690, 1300, 770); }
  // 媒婆的手指点着头像（落在拍点上的两下）
  if (fk >= 1 && d < -.2) { const tap = Math.max(0, Math.sin((t - o.flip) * Math.PI / .5825)) ** 6; celLayer(S, c => meiHand(c, P, 300 - tap * 20, 900 + tap * 26, -.5, .85)); }
  // 印章：「长期」——盖在「饭票」上面
  if (d > -.25) {
    const k = d < 0 ? ei(seg(d, -.25, 0)) : 1, sc = lerp(3, 1, k), sxp = 1010, syp = 250;
    for (const c of [g, e]) { c.save(); c.setTransform(S.M); c.translate(sxp, syp); c.rotate(-.16); c.scale(sc, sc); c.globalAlpha = (d < 0 ? k : 1) * (c === e ? .35 : 1);
      const bp = new Path2D(); bp.roundRect(-190, -100, 380, 200, 18); c.strokeStyle = '#e0202e'; c.lineWidth = 16; c.stroke(bp); c.lineWidth = 5; const b2 = new Path2D(); b2.roundRect(-166, -78, 332, 156, 10); c.stroke(b2);
      text(c, '长期', 0, 8, { size: 150, col: '#e0202e', fam: F.zh }); c.restore(); }
    if (d >= 0) S.txt('changqi', '长期', 800, 130, 1220, 370);
  }
  if (d >= 0 && d < 2 / 24 - 1e-6) impact(S, Math.floor(d * 24 + 1e-6), 1010, 300, '#ffffff', '#b8202e', (c, fg) => { c.save(); c.translate(1010, 300); c.rotate(-.16); c.fillStyle = fg; c.fillRect(-240, -130, 480, 260); c.restore(); });
  return { bloom: .8 };
}

// —— 名为责任的塔 ——
const BLOCKS = [['面子', '#e8b84a'], ['彩礼', '#e8603a'], ['车', '#6a9ad8'], ['房', '#c84a6a'], ['房贷', '#8a6ad0'], ['娃', '#6ac8a0'], ['学区', '#d8843a'], ['养老', '#9aa8c8'], ['责任', '#f2f0e8']];
const BW = 560, BH = 250;
function block(g, i, o = {}) {
  const [txt, col] = BLOCKS[i], top = i === BLOCKS.length - 1;
  const bp = new Path2D(); bp.roundRect(-BW / 2, -BH / 2, BW, BH, 18);
  cel(g, bp, { f: col, s: mix(col, '#2a1a4a', .42), so: [-26, -18], h: mix(col, '#ffffff', .6), ho: [8, 8], l: mix(col, '#140a2a', .75), lw: 5, rim: o.rim });
  text(g, txt, 0, 10, { size: top ? 190 : 150, col: top ? '#e0202e' : mix(col, '#140a2a', .78), fam: F.zh });
}
const stackPos = i => [960 + [0, 34, -26, 18, -34, 22, -12, 30, 0][i], 2760 - BH / 2 - i * BH];
function towerPlate() {
  return plate('towerSky', W, 2900, (g, e) => {
    vgrad(g, 0, 0, W, 2900, [[0, '#070522'], [.35, '#231456'], [.7, '#6a2a78'], [.93, '#c85a7a'], [1, '#3a1c3a']]);
    const R = rng(61); for (let i = 0; i < 300; i++) { g.fillStyle = rgba('#e8e0ff', .3 + R() * .5); g.fillRect(R() * W, R() * 1500, 2, 2); }
    g.save(); g.filter = 'blur(16px)'; for (let i = 0; i < 22; i++) { const y = 500 + R() * 1900, x = R() * 2300 - 190, w = 300 + R() * 460; g.fillStyle = rgba('#3a2a6a', .55); g.beginPath(); g.ellipse(x, y, w, 46, 0, 0, TAU); g.fill(); g.fillStyle = rgba('#ff7aa8', .3); g.beginPath(); g.ellipse(x + 20, y + 22, w * .8, 16, 0, 0, TAU); g.fill(); } g.restore();
    airbrush(g, 960, 300, 700, 500, '#ffe6a0', .2); airbrush(e, 960, 300, 400, 300, '#ffe6a0', .18);
    g.fillStyle = '#1c1030'; g.fillRect(0, 2760, W, 140); g.fillStyle = '#4a3466'; g.fillRect(0, 2756, W, 6);
    for (let x = -60; x < W;) { const w = 80 + R() * 150, h = 60 + R() * 200; g.fillStyle = '#241640'; g.fillRect(x, 2760 - h, w, h); for (let k = 0; k < 6; k++) { if (R() < .5) continue; g.fillStyle = rgba('#ffcf80', .7); g.fillRect(x + 10 + (k % 3) * 24, 2760 - h + 14 + Math.floor(k / 3) * 30, 10, 14); } x += w + 4; }
  });
}
const KPOSE = {
  stand: { lean: .04, th: [.05, -.05], kn: [.05, .05], ua: [.1, -.1], fa: [.2, .2] },
  wind: { lean: -.22, th: [-.75, .2], kn: [1.3, .25], ua: [.7, -.6], fa: [.6, .5], hy: 6 },
  kick: { lean: -.38, th: [1.55, -.12], kn: [.04, .2], ua: [-.9, .8], fa: [.3, .7], hy: -6 },
  after: { lean: .0, th: [.3, -.1], kn: [.3, .1], ua: [-.1, .2], fa: [.5, .3] },
  walkA: { lean: .06, th: [.42, -.38], kn: [.1, .5], ua: [-.12, .1], fa: [.9, .9] },
  walkB: { lean: .06, th: [-.38, .42], kn: [.5, .1], ua: [-.12, .1], fa: [.9, .9] },
};
// 9a —— 从塔顶的「责任」一路摇下来，摇到塔脚的他 ——
export function tower(S) {
  const { g, e, t, lt, u } = S, P = PAL.night, T = towerPlate();
  const k = eio(seg(lt, .42, S.d - .22)), cy = lerp(700, 2380, k);
  setCam(S, W / 2, cy, lerp(1.0, 1.0, k));
  drawPlate(S, T, 0, 0);
  celLayer(S, c => { for (let i = 0; i < BLOCKS.length; i++) { const [x, y] = stackPos(i); c.save(); c.translate(x, y); c.rotate([0, .01, -.012, .008, -.01, .012, -.006, .01, 0][i]); block(c, i, { rim: { c: '#ff8ad0', d: [5, 4] } }); c.restore(); } });
  { const [x, y] = stackPos(8); lamp(null, e, x, y, 60, '#fff0c0', .5 + .2 * Math.sin(t * 9)); }
  // 塔脚的他：往后收腿（预备）
  const pk = ss(seg(lt, S.d - .5, S.d - .05));
  celLayer(S, c => { c.translate(560, 2530); c.scale(1.0, 1.0); figure(c, SUITC(P), poseLerp(KPOSE.stand, KPOSE.wind, pk), { rim: { c: '#ff8ad0', d: [3, 3] } }); });
  return { bloom: .9, halo: .26 };
}
// 9b —— 一脚：冲击帧 ×2，然后一拍的定格 ——
export function kick(S, o) {
  const { g, e, t } = S, P = PAL.night, d = t - o.hit;
  const draw = (c, sil) => { c.save(); c.translate(760, 800); c.scale(2.3, 2.3); if (sil) { figure(c, { top: { f: sil, s: sil, l: sil }, bottom: { f: sil, s: sil, l: sil }, shoe: { f: sil, s: sil, l: sil }, skin: { f: sil, s: sil, l: sil }, hair: { f: sil, s: sil, l: sil }, tie: { f: sil, s: sil, l: sil } }, KPOSE.kick); } else figure(c, SUITC(P), KPOSE.kick, { rim: { c: '#ff8ad0', d: [3, 3] }, tieSwing: .5 }); c.restore(); };
  if (d < 0) {   // 两帧预备：他已经抡起腿
    setCam(S); vgrad(g, 0, 0, W, H, [[0, '#231456'], [1, '#6a2a78']]);
    celLayer(S, c => { c.translate(700, 800); c.scale(2.3, 2.3); figure(c, SUITC(P), poseLerp(KPOSE.wind, KPOSE.kick, .3), { rim: { c: '#ff8ad0', d: [3, 3] } }); });
    return;
  }
  if (d < 2 / 24 - 1e-6) { impact(S, Math.floor(d * 24 + 1e-6), 1380, 760, '#ffffff', '#1a0a2e', (c, fg) => { draw(c, fg); c.fillStyle = fg; c.save(); c.translate(1560, 760); c.rotate(.12); c.fillRect(-200, -260, 400, 520); c.restore(); }); return; }
  const [sx, sy] = shake(t, o.hit, 22, .5);
  setCam(S, W / 2 - sx, H / 2 - sy, 1);
  vgrad(g, 0, 0, W, H, [[0, '#231456'], [1, '#b84a8a']]);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); speedLines(g, 4, { type: 'radial', cx: 1400, cy: 760, n: 110, col: '#ffffff', a: .8, r0: 300, wmul: 1.2 }); g.restore();
  // 最底下那块被踢歪了
  celLayer(S, c => { for (const [i, yy, r] of [[1, 250, .06], [0, 760, .14]]) { c.save(); c.translate(1620 + (i ? 30 : 60), yy + (i ? 0 : -20)); c.rotate(r); c.scale(1.9, 1.9); block(c, i); c.restore(); } });
  celLayer(S, c => draw(c, null));
  // 击中处的星
  { const sp = []; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = i % 2 ? 150 : 60; sp.push([1330 + Math.cos(a) * r, 770 + Math.sin(a) * r, 1]); } for (const c of [g, e]) { c.save(); c.fillStyle = c === g ? '#fff6c0' : '#ffe080'; c.fill(path(sp)); c.restore(); } }
  return { bloom: .9 };
}
// 9c —— 塔倒了；他头也不回地走开；「责任」最后落地 ——
export function fall(S) {
  const { g, e, t, lt, u } = S, P = PAL.night, T = towerPlate(), land = S.shot.t1 - S.shot.t0 - 1.5;
  const [sx, sy] = shake(t, S.shot.t0 + land, 22, .45), [s2x, s2y] = shake(t, S.shot.t0 + .5, 10, .5);
  setCam(S, W / 2 - sx - s2x + lt * 16, 2330 - sy - s2y, 1.02);
  drawPlate(S, T, 0, 0);
  const GY = 2760, n = BLOCKS.length;
  celLayer(S, c => {
    for (let i = 0; i < n; i++) {
      const [x0, y0] = stackPos(i), del = .04 * i, tt = Math.max(0, lt - del), top = i === n - 1;
      // 倒向右边：越高的块飞得越远；落地后停在一堆里
      const rx = 860 + i * 90 + (i % 2) * 40, ry = GY - BH / 2 - (i % 3) * 70 - (top ? 150 : 0), dur = top ? land - del : .6 + i * .1;
      const k = clamp(tt / dur), kk = k * k;
      let x = lerp(x0, rx, k), y = lerp(y0, ry, kk) - Math.sin(k * Math.PI) * 60, r = top ? lerp(0, TAU - .14, k) : lerp(0, (i % 2 ? 1 : -1) * (.5 + i * .22) + 3.1, k);
      if (k >= 1) { const b = tt - dur; y -= Math.abs(Math.sin(b * 12)) * 40 * Math.exp(-b * 6); r += Math.sin(b * 10) * .05 * Math.exp(-b * 5); }
      c.save(); c.translate(x, y); c.rotate(r); block(c, i, { rim: { c: '#ff8ad0', d: [5, 4] } }); c.restore();
    }
  });
  // 尘土
  for (let i = 0; i < n; i++) { const top = i === n - 1, dur = (top ? land - .04 * i : .6 + i * .1) + .04 * i, b = lt - dur; if (b < 0 || b > .7) continue; const rx = 860 + i * 90; for (let k = 0; k < 6; k++) { g.fillStyle = rgba('#e8d0f0', .55 * (1 - b / .7)); g.beginPath(); g.ellipse(rx + (k - 2.5) * (70 + b * 260), GY - 20 - b * 60, 70 - b * 40, 44 - b * 30, 0, 0, TAU); g.fill(); } }
  if (lt >= land && lt < land + 2 / 24) flash(S, .7);
  // 他：手插兜，往左走开（一拍二的走路循环）
  const ph = (f12(lt) % 8) / 8, wp = ph < .5 ? poseLerp(KPOSE.walkA, KPOSE.walkB, ph * 2) : poseLerp(KPOSE.walkB, KPOSE.walkA, ph * 2 - 1);
  const ax = lerp(640, 250, u);
  g.save(); g.fillStyle = rgba('#05030c', .45); g.beginPath(); g.ellipse(ax, GY + 2, 90, 12, 0, 0, TAU); g.fill(); g.restore();
  celLayer(S, c => { c.translate(ax, GY - 228 - Math.abs(Math.sin(ph * TAU)) * 8); c.scale(-1, 1); figure(c, SUITC(P), wp, { rim: { c: '#ff8ad0', d: [3, 3] }, tieSwing: .25 }); });
  return { bloom: .9, halo: .26 };
}

// 10 —— 我的工资只需供我自己花 ——
export function pay(S) {
  const { g, e, t, lt, u } = S, P = PAL.cafe, L = S.L[10];
  const own = (() => { for (const [a, b, ts] of L.ct) if (L.text.slice(a, b) === '需') return ts - .1; return L.t0 + 1.9; })();
  const yank = S.shot.t0 + 1.17, d = t - yank, ds = t - own;
  setCam(S, W / 2, H / 2, lerp(1.0, 1.08, eio(u)));
  vgrad(g, 0, 0, W, H, [[0, '#1c1a40'], [1, '#3a2450']]);
  const R = rng(27); for (let i = 0; i < 36; i++) { const x = R() * W, y = R() * H, r = 30 + R() * 80, col = ['#ff3fa4', '#35e7ff', '#ffd23f', '#b36bff'][i % 4]; g.fillStyle = rgba(col, .1 + R() * .14); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); e.fillStyle = rgba(col, .06); e.beginPath(); e.arc(x, y, r, 0, TAU); e.fill(); }
  const up = d < 0 ? 0 : back(seg(d, 0, .3), 2), ex = 960, ey = 620 - up * 150, rot = -.08 + up * .1;
  // 四面伸过来的手（剪影）：扑了个空
  const reach = d < 0 ? eio(seg(lt, .1, 1.1)) : 1 - eo(seg(d, .25, .9));
  celLayer(S, c => { for (const [x, y, a] of [[-60, 380, .2], [-40, 900, -.25], [1980, 420, Math.PI - .2], [1980, 940, Math.PI + .22], [960, 1180, -Math.PI / 2]]) { c.save(); c.translate(x, y); c.rotate(a); c.translate(-520 + reach * 520 + (d > 0 && d < .25 ? 40 : 0), 0); c.scale(1.1, 1.1); c.fillStyle = '#120a22'; c.fill(path([[-600, -80], [0, -66], [150, -72], [168, -30], [168, 30], [150, 70], [0, 62], [-600, 90]])); for (let i = 0; i < 4; i++) c.fill(path(limb([140, -54 + i * 36], [270 - (d > 0 ? 70 : 0), -58 + i * 38], 36, 28))); c.restore(); } });
  // 工资袋 + 他的手
  celLayer(S, c => {
    c.translate(ex, ey); c.rotate(rot);
    c.save(); c.translate(-560, 240); c.rotate(-.5); sleeve(c, P.suit, P.shirt, 900, { button: P.gold.f }); c.restore();
    const ep = new Path2D(); ep.roundRect(-330, -210, 660, 420, 10);
    cel(c, ep, { f: '#d8b078', s: '#a8804c', so: [0, -30], h: '#f0d0a0', ho: [0, 8], l: '#4a3014', lw: 4 });
    cel(c, poly([[-330, -210], [330, -210], [0, -40]]), { f: '#c8a068', l: '#4a3014', lw: 3 });
    c.strokeStyle = '#b8202e'; c.lineWidth = 5; c.strokeRect(-290, -10, 580, 190);
    text(c, '工 资 袋', 0, 44, { size: 96, col: '#b8202e', fam: F.zh }); text(c, '姓名：阿发　　实发：全额', 0, 136, { size: 38, col: '#b8202e', fam: F.zh });
    // 拇指压在袋子上
    c.save(); c.translate(-380, 150); c.rotate(-.5); cel(c, limb([0, 0], [150, -40], 70, 58), { f: P.skin.f, s: P.skin.s, so: [0, -12], h: P.skin.h, l: P.skin.l, lw: 2.2 }); c.restore();
    if (ds >= 0) {   // 印章：自己花
      const s = ds < 3 / 24 ? [1.6, 1.25, .95][Math.floor(ds * 24)] : 1;
      c.save(); c.translate(170, -110); c.rotate(.2); c.scale(s, s); const sp = new Path2D(); sp.arc(0, 0, 130, 0, TAU); c.strokeStyle = TEAL; c.lineWidth = 14; c.stroke(sp); c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 108, 0, TAU); c.stroke();
      text(c, '自己花', 0, 6, { size: 70, col: TEAL, fam: F.zh }); c.restore();
    }
  });
  if (ds >= 0) { const [px, py] = [ex + 170, ey - 110]; S.txt('ziji', '自己花', px - 140, py - 140, px + 140, py + 140); lamp(null, e, px, py, 50, TEAL, .35); if (ds < 2 / 24) flash(S, .5); }
  if (up > .5) S.txt('gongzi', '工资袋', ex - 300, ey - 20, ex + 300, ey + 110);
  const hl = seg(lt, 1.8, 2.7); if (hl > 0 && hl < 1) { g.save(); g.globalCompositeOperation = 'lighter'; const x = 500 + hl * 900; const gr = g.createLinearGradient(x, 0, x + 140, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,255,255,.3)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x, ey - 230, 140, 460); g.restore(); }
  return { bloom: .8 };
}
