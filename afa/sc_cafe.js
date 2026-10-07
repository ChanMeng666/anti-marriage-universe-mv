// 咖啡馆的戏（片头 / 转折 / 结尾的回声）：拍钥匙、双人镜头、片名、眼睛特写、名牌、起身、扯领带、路灯下、放钥匙、蓝屏
import { W, H, TAU, rgba, mix, path, poly, cel, line, hash, rng, vgrad, airbrush, canvas,
  clamp, lerp, seg, ss, eio, eo, ei, back, spring, q12, q8, f12, f8, setCam, celLayer, plate, cached, drawPlate, loopPlate,
  text, neon, neonRect, flash, impact, shake, limb, F, tag } from './stage.js';
import { ribbon, flutter, LWK } from './cel.js';
import { PAL, TEAL, RED } from './pal.js';
import { head, helmet, ahuaBack, handFlat, sleeve, figure, SUITC, poseLerp } from './people.js';
import { rider, bike, LAMPS } from './bike.js';
import { speedLines, flare, lamp, rain } from './fx.js';
import { cumulus, gulls, noonClouds, NEON } from './sc_ride.js';

// —— 小道具 ——
export function cup(g, P, x, y, s, o = {}) {   // 俯视 3/4 的咖啡杯 + 碟
  g.save(); g.translate(x, y); g.scale(s, s);
  const sau = new Path2D(); sau.ellipse(0, 26, 120, 52, 0, 0, TAU); cel(g, sau, { f: P.white.f, s: P.white.s, so: [0, -10], l: P.white.l, lw: 2.4 });
  cel(g, [[-66, -30], [-60, 30], [-30, 50], [30, 50], [60, 30], [66, -30]], { f: P.white.f, s: P.white.s, so: [-12, 0], h: P.white.h, ho: [5, 0], l: P.white.l, lw: 2.4 });
  line(g, path([[60, -14], [98, -10], [96, 22], [56, 26]], false), P.white.l, 9); line(g, path([[60, -14], [98, -10], [96, 22], [56, 26]], false), P.white.f, 5);
  const top = new Path2D(); top.ellipse(0, -30, 66, 26, 0, 0, TAU); cel(g, top, { f: P.white.s, l: P.white.l, lw: 2.4 });
  const cof = new Path2D(); cof.ellipse(0, -27, 56, 20, 0, 0, TAU); g.fillStyle = o.coffee || '#5a3424'; g.fill(cof);
  if (o.ripple) { g.strokeStyle = rgba('#c89a70', .8); g.lineWidth = 2; for (let k = 1; k < 3; k++) { g.beginPath(); g.ellipse(0, -27, 56 * o.ripple * k / 2, 20 * o.ripple * k / 2, 0, 0, TAU); g.stroke(); } }
  g.fillStyle = rgba('#ffffff', .5); g.beginPath(); g.ellipse(-20, -32, 18, 5, -.2, 0, TAU); g.fill();
  if (o.lip) { g.fillStyle = P.red.f; g.beginPath(); g.ellipse(-44, -42, 14, 6, .5, 0, TAU); g.fill(); }
  g.restore();
}
export function steam(g, x, y, t, s = 1, col = '#ffffff') {
  const fr = f8(t);
  g.save(); g.strokeStyle = rgba(col, .45); g.lineWidth = 5 * s; g.lineCap = 'round';
  for (let k = 0; k < 2; k++) { const pts = []; for (let i = 0; i < 6; i++) pts.push([x + (k ? 22 : -14) * s + Math.sin(i * 1.2 + fr * .8 + k * 2) * 12 * s, y - i * 26 * s]); g.stroke(path(pts, false)); }
  g.restore();
}
export function carKey(g, P, o = {}) {   // 汽车钥匙：原点 = 钥匙环；朝右
  const CH = { f: P.chrome.f, s: P.chrome.s, h: P.chrome.h, l: P.chrome.l };
  g.save();
  const ring = new Path2D(); ring.arc(0, 0, 44, 0, TAU); ring.arc(0, 0, 34, 0, TAU); g.fillStyle = CH.f; g.fill(ring, 'evenodd'); g.strokeStyle = CH.l; g.lineWidth = 2.2; g.beginPath(); g.arc(0, 0, 44, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, 34, 0, TAU); g.stroke();
  if (o.moto) {   // 摩托钥匙：小、带青绿色的牌子
    cel(g, poly([[60, -8], [200, -8], [214, 0], [200, 8], [176, 8], [170, 16], [150, 8], [140, 16], [124, 8], [60, 8]]), { ...CH, so: [0, -4], lw: 2 });
    const hd = new Path2D(); hd.roundRect(22, -30, 64, 60, 14); cel(g, hd, { f: P.dark.f, s: P.dark.s, so: [0, -10], h: P.dark.h, ho: [0, 4], l: P.dark.l, lw: 2.4 });
    g.save(); g.rotate(2.2);
    const tg = new Path2D(); tg.roundRect(30, -40, 170, 80, 16); cel(g, tg, { f: P.teal.f, s: P.teal.s, so: [0, -14], h: P.teal.h, ho: [0, 5], l: P.teal.l, lw: 2.6 });
    g.fillStyle = P.teal.l; g.beginPath(); g.arc(52, 0, 9, 0, TAU); g.fill();
    g.save(); g.translate(126, 2); g.rotate(Math.PI); text(g, '阿发', 0, 0, { size: 50, col: '#ffffff', fam: F.zh }); g.restore();
    g.restore();
  } else {
    cel(g, poly([[70, -12], [280, -12], [300, 0], [280, 12], [250, 12], [240, 24], [216, 12], [200, 24], [176, 12], [70, 12]]), { ...CH, so: [0, -6], ho: [0, 3], lw: 2.2 });
    const hd = new Path2D(); hd.roundRect(20, -50, 110, 100, 22); cel(g, hd, { f: P.dark.f, s: P.dark.s, so: [0, -16], h: P.dark.h, ho: [0, 6], l: P.dark.l, lw: 2.6 });
    const bt = new Path2D(); bt.roundRect(44, -26, 62, 22, 8); cel(g, bt, { f: P.dark.h, l: P.dark.l, lw: 1.6 }); const b2 = new Path2D(); b2.roundRect(44, 6, 62, 22, 8); cel(g, b2, { f: P.dark.h, l: P.dark.l, lw: 1.6 });
    g.save(); g.rotate(2.5); const fob = new Path2D(); fob.roundRect(34, -34, 150, 68, 30); cel(g, fob, { f: P.leather.f, s: P.leather.s, so: [0, -12], h: P.leather.h, ho: [0, 4], l: P.leather.l, lw: 2.4 }); const em = new Path2D(); em.arc(120, 0, 20, 0, TAU); cel(g, em, { ...CH, so: [-3, -3], lw: 1.8 }); g.restore();
  }
  if (o.hl != null) { g.save(); g.globalCompositeOperation = 'source-atop'; g.restore(); }
  g.restore();
}

// —— 桌面俯拍（夜的木桌 / 正午的白桌）——
function tablePlate(noon) {
  return plate(noon ? 'tableNoon' : 'tableNight', W, H, (g, e) => {
    if (noon) {
      vgrad(g, 0, 0, W, H, [[0, '#f6f2e6'], [1, '#e6dcc4']]);
      g.strokeStyle = rgba('#b8a888', .35); g.lineWidth = 3; for (let k = 0; k < 9; k++) { g.beginPath(); g.moveTo(0, 60 + k * 130); g.lineTo(W, 20 + k * 130); g.stroke(); }
      // 树叶 / 遮阳伞的蓝影
      const R = rng(6); g.fillStyle = rgba('#6a8fd8', .32);
      for (let i = 0; i < 26; i++) { const x = R() * 900 - 100, y = R() * H, a = R() * 3; g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.ellipse(0, 0, 70 + R() * 60, 22 + R() * 14, 0, 0, TAU); g.fill(); g.restore(); }
      g.fillStyle = rgba('#6a8fd8', .25); g.fill(poly([[1300, 0], [W, 0], [W, 420], [1560, 300]]));
      airbrush(g, 1100, 420, 700, 500, '#ffffff', .5);
    } else {
      vgrad(g, 0, 0, W, H, [[0, '#6a3f2c'], [1, '#42241c']]);
      const R = rng(3); for (let k = 0; k < 40; k++) { g.strokeStyle = rgba(R() < .5 ? '#2a140e' : '#9a6444', .25); g.lineWidth = 1 + R() * 3; const y = R() * H; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(600, y + R() * 40 - 20, 1300, y + R() * 40 - 20, W, y + R() * 30 - 15); g.stroke(); }
      airbrush(g, 900, 480, 900, 620, '#ffcf8a', .42); airbrush(e, 900, 480, 500, 340, '#ffb860', .1);
      vgrad(g, 0, 0, W, H, [[0, rgba('#1a0c1e', .35)], [.4, rgba('#1a0c1e', 0)], [1, rgba('#1a0c1e', .3)]]);
      // 窗外霓虹落在桌面上的色斑
      airbrush(g, 300, 880, 360, 200, '#ff3fa4', .16); airbrush(g, 1700, 180, 320, 200, '#35e7ff', .14);
    }
  });
}

// 1 —— 拍钥匙（第一拍）——
export function keyslap(S, o) {
  const { g, e, t } = S, P = PAL.cafe, sl = o.slap, d = t - sl;
  const [sx, sy] = shake(t, sl, 16, .4);
  setCam(S, W / 2 - sx, H / 2 - sy, 1 + .03 * seg(t, 0, sl) - .03 * eo(seg(d, 0, .3)));
  drawPlate(S, tablePlate(false), 0, 0);
  const hop = d > 0 ? Math.abs(Math.sin(d * 14)) * 26 * Math.exp(-d * 5) : 0;
  celLayer(S, c => {
    cup(c, P, 420, 330 - hop, 1.5, { lip: true, ripple: d > 0 && d < 1 ? d : 0 });
    cup(c, P, 1420, 760 - hop * .8, 1.7, { ripple: d > 0 && d < 1 ? d : 0 });
  });
  steam(g, 420, 260, t, 1.5); steam(g, 1420, 680, t, 1.7);
  // 手：悬着（钥匙晃）→ 抬起（预备）→ 拍下 → 抽走
  const up = d < 0 ? 1 + .12 * ss(seg(d, -.42, -.12)) - 1.12 * ei(seg(d, -.1, 0)) * 0 : 0;
  const lift = d < 0 ? lerp(1, 1.16, ss(seg(d, -.45, -.1))) * lerp(1, .86, ei(seg(d, -.09, 0))) : 1;   // 抬高 = 画大一点 + 影子离得远
  const away = eio(seg(d, .95, 1.7));
  const hx = 1010 + away * 1200, hy = 520 - away * 120;
  const kx = 800, ky = 600;
  const drawKey = c => { c.save(); c.translate(kx, ky); c.rotate(-.5); c.scale(1.15, 1.15); carKey(c, P); c.restore(); };
  // 桌上的钥匙（拍下之后）
  if (d >= 0) {
    g.save(); g.fillStyle = rgba('#1a0c12', .4); g.translate(12, 16); g.beginPath(); g.ellipse(kx + 60, ky - 30, 220, 90, -.5, 0, TAU); g.fill(); g.restore();
    celLayer(S, drawKey);
    // 高光滑过 + 星芒
    const hl = seg(d, 1.2, 2.1); if (hl > 0 && hl < 1) { S.e.save(); S.e.setTransform(S.M); S.e.globalAlpha = Math.sin(hl * Math.PI); flare(S.e, lerp(kx - 40, kx + 240, hl), lerp(ky + 20, ky - 140, hl), .34, '#ffffff', { ghosts: false, streak: 260 }); S.e.restore(); }
  }
  if (away < 1) {
    const hs = 1.5 * (d < 0 ? lift : 1), off = d < 0 ? (lift - .86) * 260 : 0;
    g.save(); g.globalAlpha = .4; g.fillStyle = '#12080e'; g.beginPath(); g.ellipse(hx - 120 + off * .6, hy + 60 + off, 330, 190, .1, 0, TAU); g.fill(); g.restore();
    celLayer(S, c => {
      c.translate(hx, hy - off * .4); c.scale(-hs, hs); c.rotate(-.12 + (d < 0 ? Math.sin(t * 3) * .02 : 0));
      if (d < 0) { c.save(); c.translate(120, 40); c.rotate(.9 + Math.sin(t * 5) * .16); c.scale(.8, .8); carKey(c, P); c.restore(); }
      c.translate(-140, 0); sleeve(c, P.suit, P.shirt, 1000, { button: P.gold.f }); handFlat(c, P.skin, { spread: d >= 0 ? .6 : .2, curl: d < 0 ? .25 : 0 });
    });
  }
  // 冲击帧（两帧）
  if (d >= 0 && d < 2 / 24 - 1e-6) impact(S, Math.floor(d * 24 + 1e-6), kx + 80, ky - 40, '#ffffff', '#140a1e', (c, fg) => { c.save(); c.translate(kx, ky); c.rotate(-.5); c.scale(1.15, 1.15); c.fillStyle = fg; c.beginPath(); c.arc(0, 0, 46, 0, TAU); c.fill(); c.fillRect(20, -50, 280, 100); c.restore(); });
  else if (d >= 2 / 24 && d < .5) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); speedLines(g, f12(t), { type: 'radial', cx: kx + 80, cy: ky - 40, n: 50, col: '#ffffff', a: .6 * (1 - d / .5), r0: 380 }); g.restore(); }
  return { bloom: .8 };
}

// —— 咖啡馆（夜）——
function cafePlate() {
  return plate('cafeNight', W, H, (g, e) => {
    vgrad(g, 0, 0, W, H, [[0, '#2c2440'], [.6, '#4a3450'], [1, '#3a2638']]);
    // 大窗：窗外是虚掉的夜城
    const wx = 620, wy = 70, ww = 1240, wh = 600;
    const wp = new Path2D(); wp.rect(wx, wy, ww, wh);
    g.save(); g.clip(wp); vgrad(g, wx, wy, ww, wh, [[0, '#0e0a2a'], [.7, '#33185a'], [1, '#6b2a70']]);
    const R = rng(8);
    for (let i = 0; i < 70; i++) { const x = wx + R() * ww, y = wy + 120 + R() * (wh - 140), r = 14 + R() * 40, col = NEON[Math.floor(R() * 6)]; g.fillStyle = rgba(col, .16 + R() * .3); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); e.fillStyle = rgba(col, .1 + R() * .12); e.beginPath(); e.arc(x, y, r, 0, TAU); e.fill(); }
    g.save(); g.translate(wx + 300, wy + 140); g.scale(-1, 1); neon(g, e, 'CAFE', 0, 0, 120, '#ff3fa4', { fam: F.it, wt: 'italic 900' }); g.restore();
    g.restore();
    g.fillStyle = '#1c1428'; for (const x of [wx - 14, wx + ww / 3, wx + ww * 2 / 3, wx + ww]) g.fillRect(x - 7, wy - 14, 14, wh + 28); g.fillRect(wx - 14, wy - 14, ww + 28, 14); g.fillRect(wx - 30, wy + wh, ww + 60, 22);
    for (const c of [e]) { c.fillStyle = '#000'; for (const x of [wx - 14, wx + ww / 3, wx + ww * 2 / 3, wx + ww]) c.fillRect(x - 7, wy - 14, 14, wh + 28); }
    // 墙：护墙板、一幅画、窗帘
    g.fillStyle = '#3a2434'; g.fillRect(0, 690, W, 400); g.fillStyle = '#54344a'; g.fillRect(0, 690, W, 10);
    cel(g, poly([[150, 180], [470, 180], [470, 470], [150, 470]]), { f: '#d8c4a0', l: '#2a1a26', lw: 10 }); vgrad(g, 170, 200, 280, 250, [[0, '#6a9ad0'], [.6, '#c8e0e8'], [1, '#e8d49a']]); g.fillStyle = '#3a5a8a'; g.fill(path([[170, 400], [250, 340], [330, 380], [450, 330], [450, 450], [170, 450]]));
    g.fillStyle = '#5a2a4a'; g.fill(path([[1860, 40], [1930, 40], [1930, 720], [1880, 700], [1850, 400]]));
    // 吊灯
    g.strokeStyle = '#1a1220'; g.lineWidth = 5; g.beginPath(); g.moveTo(960, 0); g.lineTo(960, 150); g.stroke();
    cel(g, [[880, 230], [900, 160], [1020, 160], [1040, 230]], { f: '#e8a84a', s: '#a86a2a', so: [-14, 0], l: '#4a2a10', lw: 3 });
    g.fillStyle = '#fff4c8'; g.beginPath(); g.ellipse(960, 232, 78, 14, 0, 0, TAU); g.fill(); e.fillStyle = '#ffe0a0'; e.beginPath(); e.ellipse(960, 236, 70, 16, 0, 0, TAU); e.fill();
    const lg = g.createLinearGradient(0, 230, 0, 900); lg.addColorStop(0, rgba('#ffcf8a', .3)); lg.addColorStop(1, rgba('#ffcf8a', 0)); g.fillStyle = lg; g.fill(poly([[884, 234], [1036, 234], [1500, 1000], [420, 1000]]));
  });
}
function cafeTable(S, P, t, o = {}) {   // 前景的桌子：两只杯子 + 钥匙
  const { g } = S;
  celLayer(S, c => {
    cel(c, [[250, 1090], [330, 830], [520, 800], [1400, 800], [1600, 830], [1700, 1090]], { f: P.wood.f, s: P.wood.s, so: [0, -26], h: P.wood.h, ho: [0, 6], l: P.wood.l, lw: 3 });
    if (!o.one) cup(c, P, 640, 850, .8, { lip: true });
    cup(c, P, 1260, 850, .8);
    if (o.key !== false) { c.save(); c.translate(1000, 884); c.scale(.42, .26); c.rotate(-.4); carKey(c, P, { moto: o.moto }); c.restore(); }
  });
  if (!o.one) steam(g, 640, 810, t, .8); steam(g, 1260, 810, t, .8);
}
// 2 —— 双人镜头：他（西装，抱臂，百无聊赖）和她（过肩背影，长发，红）——
export function twoshot(S) {
  const { g, e, t, lt, u } = S, P = PAL.cafe, fr = f8(t);
  setCam(S, lerp(W / 2, 1010, eio(u)), lerp(H / 2, 500, eio(u)), lerp(1, 1.1, eio(u)));
  drawPlate(S, cafePlate(), 0, 0);
  // 窗外驶过的车灯：一条暖光扫过他
  const bx = W + 300 - ((t * 700) % 3400);
  const blink = (lt > 1.6 && lt < 1.6 + 1 / 8) || (lt > 3.6 && lt < 3.6 + 1 / 8);
  const look = lt < 1.2 ? [-.7, .1] : lt < 2.6 ? [.5, -.1] : [-.2, .5];
  celLayer(S, c => { c.translate(1180, 470); c.scale(1.6, 1.6); head(c, P, { expr: blink ? 'closed' : 'bored', look, body: 'suit', rim: { c: '#ff8ad0', d: [3, 2] } });
    // 抱在胸前的手臂
    cel(c, limb([-200, 300], [40, 330], 80, 70), { f: P.suit.f, s: P.suit.s, so: [0, -16], l: P.suit.l, lw: 2 }); cel(c, limb([170, 300], [-60, 350], 80, 70), { f: P.suit.f, s: P.suit.s, so: [0, -16], h: P.suit.h, ho: [0, 5], l: P.suit.l, lw: 2 });
    const hd = new Path2D(); hd.ellipse(-80, 352, 34, 26, .1, 0, TAU); cel(c, hd, { f: P.skin.f, s: P.skin.s, so: [0, -6], l: P.skin.l, lw: 1.6 });
  }, { bands: [{ x: bx, w: 520, col: '#ffd8a0', a: .22, ang: .2 }] });
  cafeTable(S, P, t);
  celLayer(S, c => { c.translate(380, 640 + Math.sin(fr * .7) * 2); c.scale(1.5, 1.5); c.rotate(Math.sin(fr * .5) * .012 - .03); ahuaBack(c, P, { ph: fr / 8 }); });
  return { bloom: .8 };
}

// —— 片名：铬金属渐变（天蓝 → 白色地平线 → 紫 → 粉 → 金）+ 深色与霓虹描边，12fps 闪亮，光条扫过，星芒 ——
export function chromeTitle(S, d, o = {}) {
  const { g, e } = S, x = o.x ?? W / 2, y = o.y ?? 520, size = o.size ?? 300, zh = '浪子阿发', chars = [...zh];
  const fl = Math.floor(d * 12 + 1e-6);
  for (const c of [g, e]) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); }
  g.font = e.font = `400 ${size}px ${F.zh}`; g.textBaseline = e.textBaseline = 'middle'; g.textAlign = e.textAlign = 'left'; g.lineJoin = e.lineJoin = 'round';
  const adv = size * 1.02, x0 = x - adv * chars.length / 2;
  chars.forEach((ch, i) => {
    const on = fl - i * 2;   // 每个字隔两张亮起，先闪两下
    if (on < 0 || on === 1) return;
    const cx = x0 + i * adv;
    for (const c of [g, e]) {
      c.save(); c.transform(1, 0, -.18, 1, cx + y * .18, 0);
      if (c === g) {
        c.strokeStyle = '#ff3fa4'; c.lineWidth = size * .11; c.strokeText(ch, 0, y);
        c.strokeStyle = '#140a2a'; c.lineWidth = size * .075; c.strokeText(ch, 0, y);
        const gr = c.createLinearGradient(0, y - size * .5, 0, y + size * .46);
        for (const [p, col] of [[0, '#2f6fe0'], [.34, '#aee6ff'], [.47, '#ffffff'], [.5, '#3a1f7a'], [.62, '#8a4ad8'], [.8, '#ff6ab0'], [1, '#ffd86a']]) gr.addColorStop(p, col);
        c.fillStyle = gr; c.fillText(ch, 0, y);
        c.strokeStyle = rgba('#ffffff', .8); c.lineWidth = 2; c.strokeText(ch, 0, y);
      } else { c.strokeStyle = rgba('#ff3fa4', .5); c.lineWidth = size * .11; c.strokeText(ch, 0, y); c.fillStyle = '#000'; c.fillText(ch, 0, y); c.strokeStyle = '#000'; c.lineWidth = size * .06; c.strokeText(ch, 0, y); }
      c.restore();
    }
  });
  const tw = adv * chars.length;
  if (fl >= 10) {   // 拉丁文一行 + 小字
    const s2 = size * (o.small ? .3 : .27);
    for (const c of [g, e]) { c.save(); c.font = `italic 900 ${s2}px Kanit`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.letterSpacing = `${s2 * .16}px`;
      if (c === g) { c.strokeStyle = '#140a2a'; c.lineWidth = s2 * .3; c.strokeText('DRIFTER AH FA', x + s2 * .1, y + size * .68); c.fillStyle = '#8ff7ea'; c.fillText('DRIFTER AH FA', x + s2 * .1, y + size * .68); }
      else { c.fillStyle = rgba(TEAL, .7); c.fillText('DRIFTER AH FA', x + s2 * .1, y + size * .68); }
      c.restore(); }
  }
  // 光条扫过（只照亮字）
  const sw = seg(d, 1.1, 1.8); if (sw > 0 && sw < 1) { const sx = x0 - 200 + sw * (tw + 400); for (const c of [g, e]) { c.save(); c.globalCompositeOperation = 'lighter'; const gr = c.createLinearGradient(sx - 90, 0, sx + 90, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, `rgba(255,255,255,${c === g ? .5 : .35})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gr; c.transform(1, 0, -.4, 1, 0, 0); c.fillRect(sx - 90 + y * .4, y - size * .6, 180, size * 1.2); c.restore(); } }
  const gl = seg(d, 1.8, 2.5); if (gl > 0 && gl < 1) flare(e, x0 + tw * .93, y - size * .42, .6 * Math.sin(gl * Math.PI), '#ffffff', { ghosts: false, streak: 420, rot: gl });
  for (const c of [g, e]) c.restore();
  if (fl >= 8) S.txt?.(o.id || 'title', zh, x0 - 20, y - size * .6, x0 + tw + 20, y + size * .6, true);
}
export function titlecard(S) {
  const { g, e, t, lt, u } = S;
  const SK = plate('titleSky', 2400, H, (c, ce) => {
    vgrad(c, 0, 0, 2400, H, [[0, '#06041c'], [.5, '#22124e'], [.8, '#5e2468'], [1, '#2a1238']]);
    const R = rng(14); for (let i = 0; i < 160; i++) { c.fillStyle = rgba('#e8e0ff', .3 + R() * .5); c.fillRect(R() * 2400, R() * 520, 2, 2); }
    for (let layer = 0; layer < 3; layer++) for (let x = -60; x < 2460;) { const w = 80 + R() * 170, top = 520 + layer * 110 + R() * 220; const col = ['#1a1236', '#221842', '#2c1f50'][layer]; vgrad(c, x, top, w, H - top, [[0, mix(col, '#6a4aa0', .25)], [.2, col], [1, mix(col, '#000000', .3)]]); for (let yy = top + 16; yy < H; yy += 22) for (let i = 0; i < w / 16; i++) { if (R() > .16 + layer * .06) continue; const cc = R() < .7 ? '#ffcf80' : '#8fdcff'; c.fillStyle = rgba(cc, .75); c.fillRect(x + 6 + i * 16, yy, 7, 9); ce.fillStyle = rgba(cc, .25); ce.fillRect(x + 6 + i * 16, yy, 7, 9); } x += w + R() * 16; }
    vgrad(c, 0, 700, 2400, 380, [[0, rgba('#ff4fa8', 0)], [1, rgba('#ff4fa8', .22)]]);
  });
  setCam(S, lerp(1100, 1300, u), H / 2, lerp(1.12, 1, eo(u)));
  drawPlate(S, SK, 0, 0);
  // 玻璃上的雨痕 + 虚掉的霓虹
  for (let k = 0; k < 9; k++) { const x = 300 + k * 240 + Math.sin(k * 5) * 80, y = 760 + (k * 97) % 200, col = NEON[k % 6]; airbrush(g, x, y, 90, 90, col, .22); airbrush(e, x, y, 60, 60, col, .14); }
  setCam(S); rain(g, e, f12(t), { n: 90, ang: .12, len: [60, 150], a: .22, w: 1.6, seed: 4 });
  chromeTitle(S, lt, { y: 470, size: 290 });
  if (lt > .9) { text(g, '《 反 婚 宇 宙 》', W / 2, 250, { size: 44, col: '#ffe6a8', fam: F.sub, wt: 700, stroke: '#140a2a', sw: 8 }); S.txt?.('album', '《反婚宇宙》', 730, 220, 1190, 280, true); }
  return { bloom: 1.05, halo: .3 };
}

// —— 眼睛大特写 ——  mode: 'inward'（看着她 → 看向心里）| 'seen'（饭桌上：早已看透）| 'open'（三张画睁开）
export function eyes(S, o) {
  const { g, e, t, lt, u } = S, m = o.mode, P = m === 'seen' ? PAL.amber : PAL.cafe;
  const z = lerp(1, 1.1, eio(u));
  setCam(S, W / 2, H / 2, z);
  if (m === 'seen') { vgrad(g, 0, 0, W, H, [[0, '#5a3020'], [1, '#2a1418']]); airbrush(g, 400, 200, 700, 500, '#ffb860', .35); }
  else { vgrad(g, 0, 0, W, H, [[0, '#241a3c'], [1, '#3a2040']]); airbrush(g, 1500, 300, 600, 500, '#ff3fa4', .16); airbrush(g, 300, 800, 600, 500, '#35e7ff', .1); }
  let E = {}, expr = 'bored';
  const st = f8(lt);   // 表演一拍三
  if (m === 'inward') { const k = clamp((st - 8) / 8); expr = 'bored'; E = { look: [lerp(-.8, 0, eio(k)), lerp(0, .7, eio(k))], lid: lerp(.4, .62, k) }; if (st === 6) expr = 'closed'; }
  else if (m === 'seen') { expr = 'cold'; const k = clamp((st - 10) / 5); E = { look: [lerp(.1, .9, eio(k)), 0], lid: .44, reflect: '#ffcf80' }; if (st === 8 || st === 9) expr = 'closed'; }
  else { const k = st - Math.floor((o.open - (t - lt)) * 8 + 1e-6); if (k < 0) { expr = 'bored'; E = { open: .32, lid: .7, look: [0, .6] }; } else if (k === 0) { expr = 'cold'; E = { open: .6, lid: .4 }; } else if (k === 1) { expr = 'resolve'; E = { open: .9 }; } else { expr = 'resolve'; E = { reflect: '#8ff7ea' }; } }
  const bx = W + 400 - ((t * 900) % 3200);
  LWK.k = .55;
  celLayer(S, c => { c.translate(960 - 7 * 6.2, 500 - 16 * 6.2); c.scale(6.2, 6.2); head(c, P, { expr, E, body: null, neck: false }); },
    { bands: [{ x: bx, w: 620, col: m === 'seen' ? '#ffd8a0' : '#ff8ad0', a: .2, ang: .25 }, { x: bx - 1300, w: 420, col: '#8fe8ff', a: m === 'seen' ? 0 : .16, ang: .25 }] });
  LWK.k = 1;
  if (m === 'open') { const d = t - o.open; if (d >= 0 && d < .7) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); speedLines(g, f12(t), { type: 'radial', cx: 960, cy: 500, n: 60, col: '#ffffff', a: .5 * (1 - d / .7), r0: 520 }); g.restore(); if (d < 2 / 24) flash(S, .6); } }
  // 上下遮幅（宽银幕特写）
  for (const c of [g, e]) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = c === g ? '#0a0612' : '#000'; c.fillRect(0, 0, W, 150); c.fillRect(0, 850, W, 230); c.restore(); }
  return { bloom: .7 };
}

// —— 名牌：同一个构图画两次（三十加 / 七十加）——
function diningBlur() {
  return plate('diningBlur', W, H, (g, e) => {
    vgrad(g, 0, 0, W, H, [[0, '#6a3c24'], [.6, '#8a4e2c'], [1, '#4a2418']]);
    airbrush(g, 1300, 160, 700, 420, '#ffd08a', .6); airbrush(e, 1300, 150, 300, 160, '#ffcf80', .35);
    g.fillStyle = rgba('#2a1410', .5); for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(180 + k * 420, 760 + (k % 2) * 60, 150, 240, 0, 0, TAU); g.fill(); }
    g.fillStyle = rgba('#e8304a', .3); g.fillRect(1560, 260, 150, 150); g.fillStyle = rgba('#ffd86a', .5); g.font = `400 110px ${F.zh}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('福', 1635, 340);
  });
}
function seaNoon() {
  return plate('seaNoon', W, H, (g) => {
    vgrad(g, 0, 0, W, 700, [[0, '#1b4cc4'], [.7, '#5fa4f0'], [1, '#c8ecff']]);
    const R = rng(44); cumulus(g, 1500, 710, 2.3, '#ffffff', '#8fb0ea', R, false); cumulus(g, 450, 720, 1.6, '#ffffff', '#9ab8ee', R, false); cumulus(g, 1050, 300, .9, '#ffffff', '#9ab8ee', R, false);
    vgrad(g, 0, 700, W, 380, [[0, '#2f84da'], [.4, '#24a4c8'], [1, '#6fdcd0']]);
    for (let k = 0; k < 120; k++) { g.fillStyle = rgba('#ffffff', .25 + R() * .4); g.fillRect(R() * W, 706 + R() * 360, 20 + R() * 110, 2 + R() * 2); }
  });
}
export function nameCard(S, o) {
  const { g, e, t, lt, u } = S, old = !!o.old, P = old ? PAL.noon : PAL.amber, st = f8(lt);
  setCam(S, W / 2, H / 2, lerp(1.04, 1, eo(u)));
  drawPlate(S, old ? seaNoon() : diningBlur(), 0, 0);
  const expr = old ? (st < 10 ? 'smile' : 'smirk') : (st === 9 ? 'closed' : st < 9 ? 'bored' : 'cold');
  celLayer(S, c => { c.translate(640, 440); c.scale(2.35, 2.35); head(c, P, { who: old ? 'old' : 'afa', expr, body: old ? 'old' : 'suit', rim: old ? null : { c: '#ffb860', d: [-3, 2] } }); },
    { bands: old ? [{ x: W + 300 - ((t * 500) % 3000), w: 500, col: '#ffffff', a: .12, ang: .3 }] : null });
  if (old) { S.e.save(); S.e.setTransform(1, 0, 0, 1, 0, 0); flare(S.e, 1700, 120, .9, '#fff6d8', { rot: .2 }); S.e.restore(); }
  // 名牌：从右边滑进来（回弹），拍点上落定
  const k = back(seg(lt, -.12, .16), 1.4), tx = lerp(W + 500, 1400, k), ty = 600;
  for (const c of [g, e]) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); }
  const bp = new Path2D(); bp.roundRect(tx - 330, ty - 190, 660, 380, 22);
  g.fillStyle = rgba('#0a1420', .82); g.fill(bp); g.strokeStyle = TEAL; g.lineWidth = 6; g.stroke(bp); e.fillStyle = '#000'; e.fill(bp); e.strokeStyle = rgba(TEAL, .6); e.lineWidth = 6; e.stroke(bp);
  text(g, '阿发', tx - 110, ty - 40, { size: 190, col: '#ffffff', fam: F.zh, stroke: '#0a1420', sw: 10 });
  text(g, old ? '70+' : '30+', tx + 190, ty - 30, { size: 130, col: '#8ff7ea', fam: F.it, wt: 'italic 900', stroke: '#0a4244', sw: 10 });
  g.fillStyle = TEAL; g.fillRect(tx - 290, ty + 70, 580, 5);
  text(g, old ? '自由' : '未婚', tx, ty + 124, { size: 70, col: '#fff0a0', fam: F.zh, ls: 30 });
  for (const c of [g, e]) c.restore();
  if (k > .9) { S.txt('name', '阿发', tx - 330, ty - 150, tx + 60, ty + 60, true); S.txt('age', old ? '70+' : '30+', tx + 70, ty - 110, tx + 320, ty + 50, true); S.txt('role', old ? '自由' : '未婚', tx - 120, ty + 80, tx + 120, ty + 170, true); }
  return old ? { bloom: .5, halo: .1, shadowTint: [.1, .14, .3] } : { bloom: .8 };
}

// —— 导歌：睁眼（三张画）→ 起身 ——
export function stand(S, o) {
  const rise = o.rise;
  if (S.t < rise) return eyes(S, { mode: 'open', open: o.open });
  const { g, e, t } = S, P = PAL.cafe, d = t - rise, D = S.shot.t1 - rise;
  setCam(S, lerp(1010, 1060, d / D), lerp(500, 440, eo(seg(d, .1, .8))), 1.1);
  drawPlate(S, cafePlate(), 0, 0);
  // 预备（往下一沉）→ 站起来
  const dq = q12(d), y = 470 + 30 * ss(seg(dq, 0, .18)) - 250 * back(seg(dq, .2, .62), 1.5);
  celLayer(S, c => { c.translate(1180, y); c.scale(1.6, 1.6); head(c, P, { expr: 'resolve', body: 'suit', rim: { c: '#ff8ad0', d: [3, 2] } });
    cel(c, limb([-190, 290], [-230, 520], 84, 70), { f: P.suit.f, s: P.suit.s, so: [-14, 0], l: P.suit.l, lw: 2 }); cel(c, limb([160, 290], [190, 520], 84, 70), { f: P.suit.f, s: P.suit.s, so: [-14, 0], l: P.suit.l, lw: 2 });
    cel(c, poly([[-200, 400], [180, 400], [190, 700], [-210, 700]]), { f: P.suit.f, s: P.suit.s, so: [-20, 0], l: P.suit.l, lw: 2 }); });
  cafeTable(S, P, t);
  celLayer(S, c => { c.translate(380, 640); c.scale(1.5, 1.5); c.rotate(-.03 + .05 * ss(seg(d, .3, .7))); ahuaBack(c, P, { ph: 0 }); });
  if (d > .25 && d < .8) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); speedLines(g, f12(t), { type: 'h', n: 20, col: '#ffffff', a: .25, hmax: 4, seed: 9 }); g.restore(); }
  return { bloom: .8 };
}

// —— 扯掉领带，出门；车钥匙留在桌上（焦点从他拉到钥匙）——
export function tie(S) {
  const { g, e, t, lt, u } = S, P = PAL.cafe, dq = q12(lt);
  const D = plate('cafeDoor', W, H, (c, ce) => {
    vgrad(c, 0, 0, W, H, [[0, '#2c2440'], [.6, '#4a3450'], [1, '#3a2638']]);
    c.fillStyle = '#3a2434'; c.fillRect(0, 760, W, 330); c.fillStyle = '#54344a'; c.fillRect(0, 760, W, 10);
    // 敞开的门：外面是夜街
    const dp = new Path2D(); dp.rect(1080, 90, 520, 760);
    c.save(); c.clip(dp); vgrad(c, 1080, 90, 520, 760, [[0, '#0e0a2a'], [.6, '#33185a'], [1, '#7a2e78']]);
    const R = rng(18); for (let i = 0; i < 26; i++) { const x = 1080 + R() * 520, y = 300 + R() * 420, r = 16 + R() * 44, col = NEON[Math.floor(R() * 6)]; c.fillStyle = rgba(col, .2 + R() * .3); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); ce.fillStyle = rgba(col, .14); ce.beginPath(); ce.arc(x, y, r, 0, TAU); ce.fill(); }
    c.fillStyle = '#1a1030'; c.fillRect(1080, 760, 520, 90); c.restore();
    c.fillStyle = '#1c1428'; c.fillRect(1060, 70, 20, 790); c.fillRect(1600, 70, 20, 790); c.fillRect(1060, 70, 560, 20);
    cel(c, poly([[1620, 80], [1820, 130], [1820, 880], [1620, 850]]), { f: '#6a4a3a', s: '#3e2a26', so: [-20, 0], l: '#1c1014', lw: 4 });
    neon(c, ce, '出口', 1340, 40, 44, '#4dff9a');
    c.strokeStyle = '#e2b24e'; c.lineWidth = 4; c.beginPath(); c.moveTo(1560, 90); c.lineTo(1560, 150); c.stroke(); cel(c, [[1540, 190], [1548, 150], [1572, 150], [1580, 190]], { f: '#e2b24e', s: '#9a6c28', so: [-5, 0], l: '#4d3210', lw: 2 });
    vgrad(c, 0, 0, 900, H, [[0, rgba('#120a1e', .5)], [1, rgba('#120a1e', .2)]]);
  });
  const focus = eio(seg(u, .5, .72));   // 0 = 他清楚，1 = 钥匙清楚
  setCam(S, W / 2, H / 2, 1.03);
  g.save(); g.filter = `blur(${(focus * 7).toFixed(1)}px)`; g.drawImage(D.c, 0, 0); g.restore(); S.e.drawImage(D.e, 0, 0);
  // 他：站在门口，一把扯松领带 → 扔掉 → 走出去
  const pull = seg(dq, .35, .7), walk = eio(seg(lt, 1.5, S.d - .1)), x = 1180 + walk * 360, y = 420;
  g.save(); g.filter = `blur(${(focus * 7).toFixed(1)}px)`;
  celLayer(S, c => { c.translate(x, y); c.scale(1.25 - walk * .25, 1.25 - walk * .25); c.scale(walk > .25 ? 1 : 1, 1);
    head(c, P, { expr: pull > .5 ? 'smirk' : 'resolve', body: 'suit', tie: pull < 1 ? pull * 1.2 : 2, rim: { c: '#ff8ad0', d: [3, 2] } });
    cel(c, poly([[-206, 400], [184, 400], [200, 900], [-220, 900]]), { f: P.suit.f, s: P.suit.s, so: [-20, 0], l: P.suit.l, lw: 2 });
    cel(c, limb([-190, 290], [-110, 420], 84, 70), { f: P.suit.f, s: P.suit.s, so: [-14, 0], l: P.suit.l, lw: 2 });
    if (pull < 1) { cel(c, limb([-110, 420], [-10, lerp(250, 330, pull)], 70, 56), { f: P.suit.f, s: P.suit.s, so: [-10, 0], l: P.suit.l, lw: 2 }); const hd = new Path2D(); hd.ellipse(-6, lerp(236, 320, pull), 30, 26, 0, 0, TAU); cel(c, hd, { f: P.skin.f, s: P.skin.s, so: [-5, -5], l: P.skin.l, lw: 1.6 }); }
  });
  g.restore();
  // 扔出去的领带（青绿的一条，12fps）
  if (pull >= 1) { const k = seg(dq, .7, 1.7), tx = lerp(1160, 760, k), ty = 720 - Math.sin(k * Math.PI) * 300 + k * 240; if (k < 1) celLayer(S, c => { const sp = flutter(tx, ty, 1.2 + k * 5, 230, 10, 26, 1.2, k * 14, 0); cel(c, ribbon(sp, uu => 40 - uu * 22), { f: P.teal.f, s: P.teal.s, so: [-5, -5], h: P.teal.h, l: P.teal.l, lw: 2.2 }); }); }
  // 前景：桌角 + 那把车钥匙
  g.save(); g.filter = `blur(${((1 - focus) * 9).toFixed(1)}px)`;
  celLayer(S, c => {
    cel(c, [[-40, 1090], [-40, 800], [300, 760], [860, 800], [1000, 1090]], { f: P.wood.f, s: P.wood.s, so: [0, -26], h: P.wood.h, ho: [0, 6], l: P.wood.l, lw: 3 });
    cup(c, P, 250, 850, 1.1); c.save(); c.translate(560, 900); c.scale(.8, .5); c.rotate(-.4); carKey(c, P); c.restore();
  });
  g.restore();
  if (focus > .6) { const hl = seg(u, .74, .98); if (hl > 0 && hl < 1) { S.e.save(); S.e.setTransform(S.M); S.e.globalAlpha = Math.sin(hl * Math.PI); flare(S.e, lerp(540, 760, hl), lerp(900, 850, hl), .3, '#ffffff', { ghosts: false, streak: 240 }); S.e.restore(); } }
  return { bloom: .8 };
}

// —— 路灯下的摩托：扣下面罩，点亮车头灯，冲出去（白闪进副歌）——
export function lampStreet(S, o) {
  const { g, e, t, lt, u } = S, P = PAL.night, go = o.go, d = t - go;
  const Pl = plate('lampStreet', W, H, (c, ce) => {
    vgrad(c, 0, 0, W, H, [[0, '#070620'], [.5, '#1c1246'], [.72, '#4a2060'], [1, '#120c22']]);
    const R = rng(52); for (let i = 0; i < 120; i++) { c.fillStyle = rgba('#e8e0ff', .3 + R() * .5); c.fillRect(R() * W, R() * 420, 2, 2); }
    for (let x = -40; x < W;) { const w = 150 + R() * 240, top = 240 + R() * 260, col = ['#1a1438', '#221a44', '#2a1c48'][Math.floor(R() * 3)]; vgrad(c, x, top, w, 760 - top, [[0, mix(col, '#000000', .3)], [1, col]]); for (let yy = top + 24; yy < 700; yy += 50) for (let i = 0; i < w / 44; i++) { if (R() > .22) continue; const cc = R() < .7 ? '#ffcf80' : '#8fdcff'; c.fillStyle = rgba(cc, .8); c.fillRect(x + 12 + i * 44, yy, 22, 28); ce.fillStyle = rgba(cc, .3); ce.fillRect(x + 12 + i * 44, yy, 22, 28); } x += w + 6; }
    neon(c, ce, '咖啡', 330, 560, 80, '#ff3fa4'); neonRect(c, ce, 220, 500, 220, 120, '#ff3fa4', 10); c.fillStyle = '#ffd98a'; c.fillRect(240, 640, 180, 120); ce.fillStyle = rgba('#ffd98a', .35); ce.fillRect(240, 640, 180, 120);
    c.fillStyle = '#2a2240'; c.fillRect(0, 760, W, 30); c.fillStyle = '#4a3d66'; c.fillRect(0, 786, W, 5);
    vgrad(c, 0, 791, W, 300, [[0, '#18102c'], [1, '#0b0716']]);
    // 路灯
    c.strokeStyle = '#2a2248'; c.lineWidth = 16; c.beginPath(); c.moveTo(1240, 790); c.lineTo(1240, 190); c.lineTo(1080, 150); c.stroke();
    const lg = c.createLinearGradient(0, 160, 0, 1000); lg.addColorStop(0, rgba('#ffcf80', .34)); lg.addColorStop(1, rgba('#ffcf80', 0)); c.fillStyle = lg; c.fill(poly([[1050, 160], [1110, 160], [1560, 1000], [600, 1000]]));
    c.fillStyle = rgba('#ffcf80', .22); c.beginPath(); c.ellipse(1080, 960, 460, 60, 0, 0, TAU); c.fill();
    c.fillStyle = '#fff4c8'; c.beginPath(); c.ellipse(1080, 158, 40, 12, .2, 0, TAU); c.fill(); const eg = ce.createRadialGradient(1080, 160, 0, 1080, 160, 150); eg.addColorStop(0, '#ffe0a0'); eg.addColorStop(1, 'rgba(255,224,160,0)'); ce.fillStyle = eg; ce.fillRect(900, 0, 360, 340);
  });
  const z = lerp(1, 1.5, eio(seg(lt, 0, go - (t - lt) - .2)));
  setCam(S, lerp(W / 2, 1060, clamp((z - 1) * 2)), lerp(H / 2, 700, clamp((z - 1) * 2)), z);
  drawPlate(S, Pl, 0, 0);
  rain(g, e, f12(t), { n: 90, ang: -.2, len: [40, 90], a: .16, w: 1, seed: 6 });
  const flip = go - 1.75, on = go - 1.17, visor = 1 - ss(seg(q8(t), flip, flip + .26)), lit = t >= on;
  const rev = d < 0 && t > on ? (hash(f12(t) * 2.3) - .5) * 5 : 0;
  const run = d > 0 ? d * d * 9000 + d * 500 : 0, X = 1060 + run, Y = 962;
  g.save(); g.fillStyle = rgba('#05030c', .5); g.beginPath(); g.ellipse(X, Y + 4, 300, 14, 0, 0, TAU); g.fill(); g.restore();
  celLayer(S, c => { c.translate(X, Y + rev); c.scale(.72, .72); if (d > 0) c.rotate(-.05 * Math.min(1, d * 6)); rider(c, P, { wheelA: d > 0 ? d * 30 : .4, speed: d > 0 ? 1 : 0, visor, rim: { c: '#ffcf80', d: [-3, -4] }, lampOn: lit }); });
  lamp(g, e, X + LAMPS.tail[0] * .72, Y + LAMPS.tail[1] * .72, 9, '#ff2a40', lit ? 1 : .4);
  if (lit) {
    const hx = X + LAMPS.head[0] * .72, hy = Y + LAMPS.head[1] * .72, k = Math.min(1, (t - on) * 12);
    e.save(); e.globalCompositeOperation = 'lighter'; const bg = e.createLinearGradient(hx, 0, hx + 900, 0); bg.addColorStop(0, rgba('#fff4c8', .34 * k)); bg.addColorStop(1, rgba('#fff4c8', 0)); e.fillStyle = bg; e.beginPath(); e.moveTo(hx, hy - 8); e.lineTo(hx + 1100, hy - 130); e.lineTo(hx + 1100, hy + 230); e.lineTo(hx, hy + 12); e.fill(); e.restore();
    lamp(g, e, hx, hy, 16, '#fff2c0', k);
    S.e.save(); S.e.setTransform(S.M); flare(S.e, hx, hy, (.45 + .1 * Math.sin(t * 30)) * k + (d > 0 ? d * 5 : 0), '#fff2d0', { rot: .3, ghostA: .6 }); S.e.restore();
    if (t - on < 2 / 24) flash(S, .5);
  }
  if (d > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); speedLines(g, f12(t), { type: 'h', n: 40, col: '#ffffff', a: .5, hmax: 6, seed: 2 }); g.restore(); flash(S, Math.pow(seg(d, .1, S.shot.t1 - go), 1.5)); }
  return { bloom: 1, halo: .3 };
}

// —— 尾声：同一张桌子，重画在阳光里；一把摩托钥匙，轻轻放下 ——
export function keydown(S, o) {
  const { g, e, t, lt, u } = S, P = PAL.noon, d = t - o.set;
  setCam(S, W / 2, H / 2, lerp(1.04, 1, eio(u)));
  drawPlate(S, tablePlate(true), 0, 0);
  celLayer(S, c => cup(c, P, 1420, 760, 1.7, { coffee: '#6a4028' }));
  steam(g, 1420, 680, t, 1.7, '#ffffff');
  const kx = 800, ky = 600, low = eio(seg(d, -1.5, 0)), away = eio(seg(d, .7, 2.2));
  const settle = d > 0 ? Math.sin(d * 16) * 3 * Math.exp(-d * 6) : 0;
  const drawKey = c => { c.save(); c.translate(kx, ky + settle); c.rotate(-.5); c.scale(1.5, 1.5); carKey(c, P, { moto: true }); c.restore(); };
  if (d >= 0) { g.save(); g.fillStyle = rgba('#3a5aa8', .3); g.beginPath(); g.ellipse(kx + 80, ky - 10, 230, 110, -.5, 0, TAU); g.fill(); g.restore(); celLayer(S, drawKey);
    const hl = seg(d, 1.3, 2.4); if (hl > 0 && hl < 1) { S.e.save(); S.e.setTransform(S.M); S.e.globalAlpha = Math.sin(hl * Math.PI); flare(S.e, lerp(kx - 40, kx + 300, hl), lerp(ky + 40, ky - 170, hl), .36, '#ffffff', { ghosts: false, streak: 280 }); S.e.restore(); } }
  if (away < 1) {
    const hgt = 1 - low, hs = 1.5 * (1 + hgt * .14), hx = 1030 + away * 1200 + hgt * 160, hy = 520 - away * 100 - hgt * 60;
    g.save(); g.globalAlpha = .28; g.fillStyle = '#3a5aa8'; g.beginPath(); g.ellipse(hx - 120 + hgt * 60, hy + 60 + hgt * 130, 330, 190, .1, 0, TAU); g.fill(); g.restore();
    celLayer(S, c => { c.translate(hx, hy); c.scale(-hs, hs); c.rotate(-.12);
      if (d < 0) { c.save(); c.translate(120, 40); c.rotate(.9 + Math.sin(t * 2) * .05); c.scale(.9, .9); carKey(c, P, { moto: true }); c.restore(); }
      c.translate(-140, 0); sleeve(c, P.leather, null, 1000); handFlat(c, P.skinOld, { spread: .3, curl: d < 0 ? .25 : .05 });
      for (let k = 0; k < 3; k++) line(c, [[40 + k * 30, -30 + k * 8], [100 + k * 20, -40 + k * 14]], mix(P.skinOld.l, P.skinOld.f, .4), 1.6); });
  }
  return { bloom: .5, halo: .08, shadowTint: [.1, .14, .3] };
}
// —— 他一个人坐着，脸朝太阳 ——（双人镜头的构图，对面的位子空着）
function terrace() {
  return plate('terrace', W, 2300, (g) => {
    vgrad(g, 0, 0, W, 1900, [[0, '#123aa8'], [.5, '#2f6fe0'], [.82, '#6fb4f4'], [1, '#c8ecff']]);
    const R = rng(71);
    for (const [x, y, s] of [[1450, 1900, 2.2], [380, 1900, 1.6], [900, 1350, 1.5], [1650, 1050, 1.1], [300, 800, 1.3], [1400, 560, 1.5], [800, 260, 1.0]]) cumulus(g, x, y, s, '#ffffff', '#8fb0ea', R, false);
    vgrad(g, 0, 1900, W, 150, [[0, '#2f84da'], [.5, '#24a4c8'], [1, '#6fdcd0']]);
    for (let k = 0; k < 70; k++) { g.fillStyle = rgba('#ffffff', .25 + R() * .4); g.fillRect(R() * W, 1906 + R() * 130, 20 + R() * 100, 2); }
    g.fillStyle = '#5f8fc8'; g.fill(path([[1300, 1900], [1420, 1850], [1580, 1840], [1700, 1870], [1780, 1900]]));
    // 露台：白栏杆 + 木地板
    g.fillStyle = '#f6f2e6'; g.fillRect(0, 2000, W, 16); for (let x = 20; x < W; x += 90) g.fillRect(x, 2010, 14, 110); g.fillRect(0, 2110, W, 12);
    vgrad(g, 0, 2122, W, 180, [[0, '#d8c8a8'], [1, '#b8a484']]);
    for (let k = 0; k < 8; k++) { g.fillStyle = rgba('#8a7a5c', .4); g.fillRect(0, 2140 + k * 22, W, 2); }
    // 遮阳伞的一角
    cel(g, [[-40, 1240], [520, 1280], [620, 1420], [300, 1380], [-40, 1400]], { f: '#19c9bd', s: '#0e8c8a', so: [0, -30], l: '#0a4244', lw: 4 }); g.fillStyle = '#f6f2e6'; g.fill(poly([[120, 1252], [280, 1264], [330, 1384], [150, 1390]]));
    g.fillStyle = '#e8e2d2'; g.fillRect(232, 1380, 14, 760);
  });
}
function terraceScene(S, t, camY, z, o = {}) {
  const { g, e } = S, P = PAL.noon, T = terrace(), fr = f8(t);
  setCam(S, o.cx ?? W / 2, camY, z);
  drawPlate(S, T, 0, 0);
  // 停在露台边的车
  celLayer(S, c => { c.translate(1600, 2140); c.scale(.42, .42); rider(c, P, { noRider: true, wheelA: .3, speed: 0, pack: true, lampOn: false }); });
  // 空着的对面座位（椅背）
  celLayer(S, c => { cel(c, [[150, 2300], [170, 1860], [250, 1800], [470, 1800], [550, 1860], [570, 2300]], { f: '#c89464', s: '#8a5a3c', so: [-24, 0], h: '#e8be8a', ho: [6, 4], l: '#3e2414', lw: 3 }); for (let k = 0; k < 4; k++) c.fillStyle = '#8a5a3c', c.fillRect(230 + k * 70, 1860, 14, 300); });
  // 他
  const breathe = Math.sin(fr * .5) * 3;
  celLayer(S, c => { c.translate(1180, 1590 + breathe); c.scale(1.7, 1.7); c.rotate(-.05);
    for (let k = 0; k < 2; k++) { const sp = flutter(-50, 150 + k * 10, Math.PI - .5 + k * .1, 200 - k * 40, 12, 9, 1.1, (fr % 8) / 8 * TAU + k * 2, 40); cel(c, ribbon(sp, uu => 32 - uu * 10 - k * 5), { f: k ? P.teal.s : P.teal.f, s: P.teal.s, so: [0, -8], l: P.teal.l, lw: 1.6 }); }
    head(c, P, { who: 'old', expr: 'laugh', mouth: o.mouth || 'smile', body: 'old' }); });
  // 桌子、一只杯子、钥匙
  celLayer(S, c => { c.translate(0, 1220); cel(c, [[250, 1090], [330, 830], [520, 800], [1400, 800], [1600, 830], [1700, 1090]], { f: '#fbf8ee', s: '#c8cee0', so: [0, -26], l: '#5a6078', lw: 3 }); cup(c, P, 1260, 850, .8, { coffee: '#6a4028' }); c.save(); c.translate(1000, 884); c.scale(.5, .3); c.rotate(-.4); carKey(c, P, { moto: true }); c.restore(); });
  steam(g, 1260, 2030, t, .8);
  S.e.save(); S.e.setTransform(S.M); flare(S.e, 1640, camY - 380, .9, '#fff6d8', { rot: .2 }); S.e.restore();
}
export function rest(S) {
  const { u, t } = S;
  terraceScene(S, t, 1760 - 20 * u, lerp(1, 1.08, eio(u)), { cx: lerp(W / 2, 1000, eio(u)) });
  return { bloom: .5, halo: .1, shadowTint: [.1, .14, .3] };
}
// —— 慢慢摇向天空 ——
export function tiltup(S) {
  const { g, e, t, u } = S;
  const cy = lerp(1740, H / 2 + 40, eio(clamp(u * 1.04)));
  terraceScene(S, t, cy, lerp(1.08, 1, eio(u)), { cx: lerp(1000, W / 2, eio(u)) });
  gulls(S, t, [[700, cy - 120, 1.1, 0], [900, cy - 240, .8, 1], [1240, cy - 60, .9, 2], [500, cy + 80, .7, 3]]);
  return { bloom: .5, halo: .1, shadowTint: [.1, .14, .3] };
}
// —— 带子走完：录像机的蓝屏 ——
export function bluescreen(S) {
  const { g, e } = S; setCam(S);
  g.fillStyle = '#1626d8'; g.fillRect(0, 0, W, H);
  S.txt('stop', 'STOP', 96, 60, 300, 124);
  return { bloom: 0, halo: 0, sat: 1.1 };
}
