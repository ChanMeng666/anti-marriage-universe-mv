// 路上的戏：侧面跟拍（夜 / 黎明 / 正午三套色指定，带各段副歌的变体）、头盔胸像、背后视角、远景
import { W, H, TAU, rgba, mix, path, poly, cel, line, hash, rng, vgrad, airbrush, canvas,
  clamp, lerp, seg, ss, eio, eo, ei, back, q12, q8, f12, f8, setCam, celLayer, plate, cached, drawPlate, loopPlate, smear, reflectPlate,
  text, neon, neonRect, flash, limb, F, tag } from './stage.js';
import { ribbon, flutter } from './cel.js';
import { PAL, TEAL, RED } from './pal.js';
import { rider, riderBack, bike, LAMPS } from './bike.js';
import { head, helmet, figure, CASUALC } from './people.js';
import { quad, beastBust } from './beasts.js';
import { speedLines, flare, lamp, trail, rain } from './fx.js';

const V = 1500, GY = 743;
const NEON = ['#ff3fa4', '#35e7ff', '#ffd23f', '#ff5a3c', '#b36bff', '#4dff9a'];
const SIGN_V = ['歌厅', '夜宵', '录像', '旅社', '发廊', '舞厅', '电器', '照相', '茶楼', '台球'];
const SIGN_H = ['BAR', 'DISCO', '24H', 'VIDEO', '酒', '面', 'CAFE', 'HOTEL', '夜市', 'TAXI'];

// —— 夜的街面（循环）——
function streetNight() {
  return cached('streetNight', () => {
    const LW = 4800, Hh = 700, p = plate('streetNight0', LW, Hh, (g, e) => {
      const R = rng(11);
      for (let x = 0; x < LW;) {
        const w = Math.min(LW - x, 260 + R() * 320); if (w < 140) break;
        const top = R() < .4 ? 120 + R() * 220 : -20, hue = ['#2a1f4a', '#1f2446', '#34203f', '#232a3d'][Math.floor(R() * 4)];
        vgrad(g, x, top, w, Hh - top, [[0, mix(hue, '#000000', .45)], [.7, hue], [1, mix(hue, '#ff4fa8', .18)]]);
        g.fillStyle = rgba('#000000', .25); g.fillRect(x + w - 10, top, 10, Hh - top); g.fillStyle = rgba('#ffffff', .06); g.fillRect(x, top, 5, Hh - top);
        if (top > 0) { g.fillStyle = mix(hue, '#000000', .6); g.fillRect(x - 6, top - 10, w + 12, 12); if (R() < .6) { g.fillRect(x + w * .3, top - 60, 50, 50); g.fillRect(x + w * .3 + 22, top - 110, 5, 50); } }
        const cols = Math.max(2, Math.floor(w / 72)), cw = w / cols;
        for (let yy = top + 40; yy < Hh - 250; yy += 86) for (let i = 0; i < cols; i++) {
          const wx = x + i * cw + cw * .2, ww = cw * .6, lit = R() < .36, cc = R() < .7 ? '#ffd98a' : '#9fe8ff';
          g.fillStyle = lit ? cc : mix(hue, '#000000', .35); g.fillRect(wx, yy, ww, 44);
          if (lit) { e.fillStyle = rgba(cc, .35); e.fillRect(wx, yy, ww, 44); g.fillStyle = rgba('#000000', .25); g.fillRect(wx, yy + 30, ww, 14); if (R() < .3) { g.fillStyle = rgba('#2a1830', .7); g.fillRect(wx + ww * .3, yy + 12, ww * .3, 32); } }
          g.fillStyle = rgba('#000000', .35); g.fillRect(wx, yy + 44, ww, 5);
        }
        const sy = Hh - 210, shop = ['#ffcf7a', '#ffe7b0', '#ff9f7a', '#9fdcff'][Math.floor(R() * 4)];
        g.fillStyle = mix(hue, '#000000', .5); g.fillRect(x + 8, sy - 20, w - 16, 230);
        vgrad(g, x + 20, sy + 10, w - 40, 180, [[0, rgba(mix(shop, '#c8703a', .25), .95)], [1, rgba(mix(shop, '#ff6a3c', .5), .8)]]);
        e.fillStyle = rgba(shop, .2); e.fillRect(x + 20, sy + 10, w - 40, 180);
        g.fillStyle = rgba('#2a1830', .7);
        for (let k = 0; k < 3; k++) { const px = x + 40 + R() * (w - 100); if (R() < .5) { g.beginPath(); g.ellipse(px, sy + 90, 14, 16, 0, 0, TAU); g.fill(); g.fillRect(px - 20, sy + 106, 40, 90); } else g.fillRect(px - 30, sy + 120, 60, 70); }
        g.fillStyle = rgba('#000000', .5); for (let k = 1; k < 3; k++) g.fillRect(x + 20 + (w - 40) * k / 3 - 3, sy + 10, 6, 180);
        const aw = NEON[Math.floor(R() * 6)];
        for (let k = 0; k < (w - 16) / 36; k++) { g.fillStyle = k % 2 ? mix(aw, '#1a1030', .45) : mix('#f0e8f0', '#1a1030', .35); g.beginPath(); g.moveTo(x + 8 + k * 36, sy - 24); g.lineTo(x + 44 + k * 36, sy - 24); g.lineTo(x + 48 + k * 36, sy + 14); g.lineTo(x + 4 + k * 36, sy + 14); g.fill(); }
        const ncol = NEON[Math.floor(R() * 6)], txt = SIGN_H[Math.floor(R() * SIGN_H.length)], sgy = sy - 110, sw = Math.min(w - 40, 80 + [...txt].length * 56);
        g.fillStyle = '#120b1e'; g.fillRect(x + (w - sw) / 2, sgy - 42, sw, 84);
        neon(g, e, txt, x + w / 2, sgy + 4, 58, ncol, { fam: /[A-Z0-9]/.test(txt) ? F.it : F.zh, wt: /[A-Z0-9]/.test(txt) ? 'italic 800' : 400 }); neonRect(g, e, x + (w - sw) / 2 + 8, sgy - 34, sw - 16, 68, ncol, 8);
        airbrush(g, x + w / 2, sgy, sw * .8, 120, ncol, .22);
        if (R() < .75) {
          const vx = x + (R() < .5 ? 30 : w - 30), vt = SIGN_V[Math.floor(R() * SIGN_V.length)], vcol = NEON[Math.floor(R() * 6)], vh = 2 * 74 + 40, vy = Math.max(top + 30, sgy - 70 - vh);
          g.fillStyle = '#150d22'; g.fillRect(vx - 40, vy, 80, vh); g.fillStyle = rgba('#000000', .4); g.fillRect(vx + 34, vy, 6, vh);
          neon(g, e, vt, vx, vy + vh / 2, 62, vcol, { vertical: true }); neonRect(g, e, vx - 34, vy + 6, 68, vh - 12, vcol, 6); airbrush(g, vx, vy + vh / 2, 110, vh * .7, vcol, .2);
        }
        x += w + (R() < .25 ? 60 + R() * 120 : 0);
      }
    });
    const st = smear(p, 16, 8);
    return { st, rf: reflectPlate(st, 340, .8) };
  });
}
function skylineNight() {
  return plate('skylineNight', 3840, 560, (g, e, LW, Hh) => {
    const R = rng(9);
    for (let layer = 0; layer < 2; layer++) {
      const col = layer ? '#241a48' : '#1a1438';
      for (let x = -100; x < LW + 100;) {
        const w = 60 + R() * 160, h = (layer ? 180 : 260) + R() * (layer ? 260 : 420), y = Hh - h;
        g.fillStyle = col; g.fillRect(x, y, w, h);
        if (R() < .3) { g.fillRect(x + w / 2 - 3, y - 60, 6, 60); e.fillStyle = '#ff2a2a'; e.beginPath(); e.arc(x + w / 2, y - 60, 4, 0, TAU); e.fill(); g.fillStyle = '#ff5050'; g.beginPath(); g.arc(x + w / 2, y - 60, 3, 0, TAU); g.fill(); }
        g.fillStyle = rgba('#6a5aa8', layer ? .35 : .22); g.fillRect(x, y, 3, h);
        const cols = Math.max(1, Math.floor(w / 16)), rows = Math.floor(h / 22), lit = layer ? .3 : .18;
        for (let r = 0; r < rows; r++) { if (R() < .3) continue; for (let c = 0; c < cols; c++) { if (R() > lit) continue; const wx = x + 6 + c * 16, wy = y + 12 + r * 22; if (wx > x + w - 10) continue; const cc = R() < .75 ? '#ffcf80' : '#8fdcff'; g.fillStyle = rgba(cc, layer ? .85 : .55); g.fillRect(wx, wy, 7, 9); e.fillStyle = rgba(cc, layer ? .35 : .2); e.fillRect(wx, wy, 7, 9); } }
        x += w + R() * 30;
      }
      vgrad(g, 0, Hh * .45, LW, Hh * .55, [[0, rgba('#ff4fa8', 0)], [1, rgba('#ff4fa8', layer ? .28 : .18)]]);
    }
  });
}
// 云：喷枪积云（亮顶 + 冷色底）
function cumulus(g, x, y, s, top, shade, R, flat = true) {
  // 一朵云单独画在临时画布上（暗部 → 亮部错开叠上去 → 需要的话把底切平），再贴回去：不会切到旁边的云
  const span = 250 * s, hgt = 190 * s, CW = Math.ceil(span * 2 + 240 * s), CH = Math.ceil(hgt + 260 * s), [cc, c] = canvas(CW, CH), ox = CW / 2, oy = CH - 110 * s;
  const blobs = [], n = Math.round(22 + s * 5);
  for (let i = 0; i < n; i++) { const u = R() * 2 - 1, env = 1 - u * u, r = (34 + R() * 46) * s * (.55 + .45 * env); blobs.push([ox + u * span, oy - env * hgt * Math.pow(R(), .6) - r * .2, r]); }
  for (let i = 0; i < 7; i++) { const u = (i / 6) * 2 - 1; blobs.push([ox + u * span * .92, oy - 6 * s, (40 + R() * 20) * s]); }
  c.filter = `blur(${Math.max(1, 1.6 * s).toFixed(1)}px)`;
  c.fillStyle = shade; for (const [bx, by, r] of blobs) { c.beginPath(); c.arc(bx, by, r, 0, TAU); c.fill(); }
  c.fillStyle = mix(shade, top, .55); for (const [bx, by, r] of blobs) { c.beginPath(); c.arc(bx - 5 * s, by - 9 * s, r * .9, 0, TAU); c.fill(); }
  c.fillStyle = top; for (const [bx, by, r] of blobs) { c.beginPath(); c.arc(bx - 10 * s, by - 18 * s, r * .74, 0, TAU); c.fill(); }
  c.filter = 'none';
  if (flat) { c.globalCompositeOperation = 'destination-out'; c.fillStyle = '#000'; c.fillRect(0, oy + 8 * s, CW, CH); c.globalCompositeOperation = 'source-over'; }
  g.drawImage(cc, x - ox, y - oy);
}
function dawnBack() {
  return plate('dawnBack', W, 760, (g, e) => {
    vgrad(g, 0, 0, W, 620, [[0, '#2f3f84'], [.4, '#9a66a4'], [.75, '#ff9a84'], [1, '#ffe0a0']]);
    const R = rng(4);
    g.save(); g.filter = 'blur(7px)';
    for (let i = 0; i < 11; i++) { const x = R() * 2100 - 80, y = 130 + R() * 330, w = 180 + R() * 240; g.fillStyle = rgba('#6a4f96', .55); g.beginPath(); g.ellipse(x, y, w, 24, 0, 0, TAU); g.fill(); g.fillStyle = rgba('#ffb79a', .7); g.beginPath(); g.ellipse(x + 20, y + 11, w * .85, 9, 0, 0, TAU); g.fill(); }
    g.restore();
    airbrush(g, 1480, 616, 820, 250, '#fff0c0', .6); airbrush(e, 1480, 616, 480, 140, '#ffe0a0', .5);
    g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(1480, 620, 64, Math.PI, 0); g.fill(); e.fillStyle = '#fff0c0'; e.beginPath(); e.arc(1480, 620, 64, Math.PI, 0); e.fill();
    // 远岬 + 灯塔
    g.fillStyle = '#5b3f78'; g.fill(path([[-20, 620], [-20, 520], [140, 470], [300, 500], [420, 560], [560, 590], [700, 620]]));
    g.fillStyle = '#7a5590'; g.fill(path([[-20, 620], [60, 560], [200, 540], [330, 580], [470, 620]]));
    g.fillStyle = '#f4e6e0'; g.fillRect(196, 400, 14, 74); g.fillStyle = '#d8506a'; g.fillRect(196, 424, 14, 12); g.fillRect(192, 392, 22, 10);
    vgrad(g, 0, 620, W, 140, [[0, '#ffc49a'], [.5, '#a06a92'], [1, '#5a4476']]);
    for (let k = 0; k < 36; k++) { const y = 624 + k * 3.4, w = 50 + (k * 37) % 220; g.fillStyle = rgba('#fff0c0', .55 * (1 - k / 36)); g.fillRect(1480 - w / 2 + Math.sin(k * 2.3) * k * 3, y, w, 2); }
  });
}
function noonBack() {
  return plate('noonBack', W, 760, (g, e) => {
    vgrad(g, 0, 0, W, 600, [[0, '#1f52c8'], [.6, '#4f96ea'], [1, '#bfe6ff']]);
    vgrad(g, 0, 600, W, 90, [[0, '#2f7fd6'], [.5, '#28a6c8'], [1, '#6fdcd0']]);
    const R = rng(2);
    for (let k = 0; k < 60; k++) { g.fillStyle = rgba('#ffffff', .25 + R() * .4); g.fillRect(R() * W, 606 + R() * 78, 20 + R() * 80, 2); }
    // 远岛
    g.fillStyle = '#5f8fc8'; g.fill(path([[1240, 600], [1320, 560], [1420, 548], [1520, 572], [1600, 600]])); g.fillStyle = '#7fb0d8'; g.fill(path([[1240, 600], [1330, 576], [1430, 570], [1500, 600]]));
    // 沙滩
    vgrad(g, 0, 690, W, 70, [[0, '#f6e6b8'], [1, '#e6cc94']]);
    g.fillStyle = rgba('#ffffff', .8); g.fill(path([[0, 688], [300, 694], [700, 686], [1100, 695], [1500, 687], [1920, 693], [1920, 700], [0, 700]]));
  });
}
function noonClouds() {
  return plate('noonClouds', 3840, 620, (g) => {
    const R = rng(31);
    for (let i = 0; i < 8; i++) cumulus(g, 200 + i * 480 + R() * 120, 560 - (i % 3) * 14, .9 + R() * .7, '#ffffff', '#8fb0ea', R);
    for (let i = 0; i < 6; i++) cumulus(g, 100 + i * 640 + R() * 200, 280 + R() * 80, .4 + R() * .25, '#ffffff', '#a4c0f0', R);
  });
}

function backdrop(S, mode, t) {
  const { g, e } = S;
  if (mode === 'night') {
    const { st, rf } = streetNight(), SK = skylineNight(), fx = -t * V * .6;
    vgrad(g, 0, 0, W, 720, [[0, '#0a0924'], [.55, '#261452'], [1, '#6b2a70']]);
    loopPlate(S, SK, -t * 70, 700 - SK.h); loopPlate(S, st, fx, 700 - st.h);
    return () => {
      vgrad(g, 0, 700, W, 44, [[0, '#2a2240'], [1, '#1a1430']]); g.fillStyle = '#4a3d66'; g.fillRect(0, 738, W, 5);
      vgrad(g, 0, GY, W, H - GY, [[0, '#140d24'], [1, '#0b0716']]); loopPlate(S, rf, fx, GY);
    };
  }
  if (mode === 'dawn') {
    drawPlate(S, dawnBack(), 0, 0);
    for (let k = 0; k < 14; k++) { const y = 630 + k * 5, w = 60 + (k * 53) % 160; g.fillStyle = rgba('#fff0c0', .35); g.fillRect(1480 - w / 2 + Math.sin(k * 2.3 + f12(t) * .8) * k * 5, y, w, 2); }
    const lb = (Math.sin(t * 2.2) > .6) ? 1 : 0; if (lb) lamp(g, e, 203, 398, 8, '#fff0b0', .8);
    return () => {
      const gx = -t * V * .8; g.fillStyle = '#3a2440';
      for (let k = -1; k < 12; k++) { const x = ((gx % 200) + 200) % 200 + k * 200 - 200; g.fillRect(x, 690, 12, 56); }
      g.fillStyle = '#c8a0b0'; g.fillRect(0, 692, W, 10); g.fillStyle = '#5a3a58'; g.fillRect(0, 702, W, 6);
      vgrad(g, 0, GY, W, H - GY, [[0, '#6a4a6a'], [1, '#3a2840']]);
      g.save(); g.globalAlpha = .3; g.translate(0, GY * 2); g.scale(1, -1); g.filter = 'blur(6px)'; g.drawImage(g.canvas, 0, 430, W, 313, 0, 430, W, 313); g.restore();
    };
  }
  // noon
  drawPlate(S, noonBack(), 0, 0);
  const C = noonClouds(); let ox = ((-t * 24) % C.w + C.w) % C.w - C.w; for (let x = ox; x < W; x += C.w) g.drawImage(C.c, x, 0);
  return () => {
    const gx = -t * V * .8;
    g.fillStyle = '#e9e2d0'; g.fillRect(0, 712, W, 34); g.fillStyle = '#b9b0a0'; g.fillRect(0, 738, W, 8); g.fillStyle = '#fbf6ea'; g.fillRect(0, 708, W, 6);
    for (let k = -1; k < 8; k++) { const x = ((gx % 320) + 320) % 320 + k * 320 - 320; g.fillStyle = rgba('#8a8478', .6); g.fillRect(x, 712, 4, 30); }
    vgrad(g, 0, GY + 3, W, H - GY, [[0, '#8a8ea6'], [1, '#5c5f7c']]);
  };
}
const RIDE = {
  night: { P: 'night', rim: { c: '#ff6ad0', d: [3, 4.5] }, visor: 0, streak: '#8f7cc8', lane: '#b8a8e8' },
  dawn: { P: 'dawn', rim: { c: '#ffe0a8', d: [-3.5, 2.5] }, visor: 1, pack: true, streak: '#ffd0b0', lane: '#ffe6d0', expr: 'smirk' },
  noon: { P: 'noon', rim: null, old: true, pack: true, streak: '#ffffff', lane: '#ffffff', expr: 'smile' },
};

// 骑手（侧面）的通用绘制：地面阴影 / 倒影、光带、尾灯、车头灯
function drawRider(S, mode, t, X, Y, s, o = {}) {
  const { g, e } = S, M = RIDE[mode], P = o.P || PAL[M.P], fr = f12(t), night = mode === 'night';
  const bob = o.still ? 0 : (hash(fr * 1.3) - .5) * 5 + Math.sin(fr * 1.9) * 2.5;
  const ro = { ph: (fr % 4) / 4, wheelA: o.still ? .4 : q12(t) * 40, speed: o.still ? 0 : 1, bob, rim: M.rim, visor: o.visor ?? M.visor, old: o.old ?? M.old, pack: o.pack ?? M.pack, expr: o.expr || M.expr, mouth: o.mouth, salute: o.salute };
  const tail = [X + LAMPS.tail[0] * s * (o.flip ? -1 : 1), Y + (LAMPS.tail[1] + bob * .4) * s], hd = [X + LAMPS.head[0] * s * (o.flip ? -1 : 1), Y + (LAMPS.head[1] + bob * .4) * s];
  if (night && !o.still) { const pts = []; for (let k = 0; k < 24; k++) { const tt = q12(t) - k * .03, f2 = Math.floor(tt * 12), bb = (hash(f2 * 1.3) - .5) * 5 + Math.sin(f2 * 1.9) * 2.5; pts.push([tail[0] - k * 38, Y + (LAMPS.tail[1] + bb * .4) * s]); } trail(g, e, pts, '#ff2a40', 7); }
  if (night) { g.save(); g.globalAlpha = .35; g.translate(X, Y + 6); g.scale(s * (o.flip ? -1 : 1), -s * .5); g.filter = 'blur(4px)'; rider(g, P, { ...ro, rim: null }); g.restore(); }
  g.save(); g.fillStyle = rgba(night ? '#05030c' : '#2a2038', night ? .5 : .32); g.beginPath(); g.ellipse(X, Y + 4, 380 * s, 16 * s, 0, 0, TAU); g.fill(); g.restore();
  const bands = night && !o.still ? [0, 1, 2].map(k => ({ x: W + 400 - ((t * 1300 + k * 900) % 2900), w: 440, col: ['#ff3fa4', '#35e7ff', '#ffd23f'][k], a: .26, ang: .2 })) : null;
  celLayer(S, c => { c.translate(X, Y); c.scale(s * (o.flip ? -1 : 1), s); rider(c, P, ro); if (o.extra) o.extra(c); }, { bands });
  lamp(g, e, tail[0], tail[1], 12 * s, '#ff2a40', night ? 1 : .5);
  if (mode !== 'noon') {
    e.save(); e.globalCompositeOperation = 'lighter';
    const dir = o.flip ? -1 : 1, bg = e.createLinearGradient(hd[0], 0, hd[0] + dir * 900, 0); bg.addColorStop(0, rgba('#fff4c8', night ? .28 : .14)); bg.addColorStop(1, rgba('#fff4c8', 0));
    e.fillStyle = bg; e.beginPath(); e.moveTo(hd[0], hd[1] - 10); e.lineTo(hd[0] + dir * 1100, hd[1] - 150); e.lineTo(hd[0] + dir * 1100, hd[1] + 260); e.lineTo(hd[0], hd[1] + 14); e.fill(); e.restore();
    lamp(g, e, hd[0], hd[1], 18 * s, '#fff2c0', night ? 1 : .7);
  }
  return { tail, hd, bob };
}
function notes(S, t, x0, y0, col, n = 6, seed = 0) {   // 从 (x0,y0) 向后上方飘走的音符（透过光）
  const { g, e } = S;
  for (let k = 0; k < n; k++) {
    const life = ((t * .55 + k / n + seed) % 1), x = x0 - life * 900 - k * 20, y = y0 - 60 - life * 220 + Math.sin(life * 9 + k * 2) * 40, a = Math.min(1, life * 6) * (1 - life), sz = 54 + (k % 3) * 16;
    const ch = k % 2 ? '♪' : '♫';
    for (const [c, al] of [[g, a], [e, a * .8]]) { c.save(); c.globalAlpha = al; c.font = `700 ${sz}px "Noto SC"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.translate(x, y); c.rotate(Math.sin(k * 3 + life * 4) * .3); c.fillStyle = c === g ? mix(col, '#ffffff', .6) : col; c.fillText(ch, 0, 0); c.restore(); }
  }
}
function gulls(S, t, list) {
  const { g } = S, fr = f8(t);
  for (const [x, y, s, k] of list) {
    const up = (fr + k) % 4, a = [0.5, .1, -.35, .1][up], yy = y + Math.sin(t * 1.3 + k) * 14;
    g.save(); g.translate(x + Math.sin(t * .7 + k * 2) * 20, yy); g.scale(s, s);
    for (const d of [-1, 1]) cel(g, [[0, 0, 1], [d * 34, -30 * a - 6], [d * 76, -50 * a + 6, 1], [d * 36, -18 * a + 4]], { f: '#ffffff', s: '#b9c6e2', so: [0, -4], l: '#56628a', lw: 1.6 });
    cel(g, [[-12, 2], [0, -6], [18, 0, 1], [0, 8]], { f: '#ffffff', l: '#56628a', lw: 1.6 });
    g.restore();
  }
}
// 轿车（侧面朝左停着 / 慢行），驾驶位里是牛头马面
function car(g, x, y, s, col, kind) {
  g.save(); g.translate(x, y); g.scale(s, s);
  cel(g, [[-230, -20], [-236, -70], [-200, -96], [-110, -104], [-70, -170], [90, -176], [140, -108], [220, -96], [236, -60], [232, -20]], { f: col, s: mix(col, '#2a1a3a', .45), so: [0, -22], h: mix(col, '#ffffff', .5), ho: [0, 5], l: mix(col, '#000000', .7), lw: 2.6 });
  const win = path([[-98, -108], [-62, -160], [84, -164], [124, -108]]);
  g.fillStyle = '#ffdcb8'; g.fill(win); g.save(); g.clip(win); g.translate(-30, -120); g.scale(.42, .42); beastBust(g, kind, '#3a2440'); g.restore();
  g.strokeStyle = '#2a1a30'; g.lineWidth = 3; g.stroke(win); line(g, [[14, -164], [14, -108]], '#2a1a30', 4);
  for (const wx of [-150, 150]) { const w = new Path2D(); w.arc(wx, -20, 44, 0, TAU); cel(g, w, { f: '#23232f', s: '#15151c', so: [-5, -5], l: '#07070b', lw: 2.4 }); const hb = new Path2D(); hb.arc(wx, -20, 20, 0, TAU); cel(g, hb, { f: '#c8cede', l: '#2b3350', lw: 1.6 }); }
  g.fillStyle = '#ff4050'; g.fillRect(222, -92, 14, 22); g.fillStyle = '#fff0b0'; g.fillRect(-238, -86, 10, 18);
  g.restore();
}

// —— 侧面跟拍 ——  o = { variant, hits:[t..], snap, zoom, L (歌词行), hold }
export function side(S, mode, o = {}) {
  const { g, e, lt } = S, v = o.variant, night = mode === 'night';
  let t = S.t;
  // 相遇的定格：th 起停住背景滚动 hold 秒
  let frozen = 0;
  if (v === 'pass') { const th = o.th, hd = o.hold; if (S.t > th) { frozen = S.t < th + hd ? 1 : 0; t = S.t < th + hd ? th : S.t - hd; } }
  const z = o.zoom ?? 1, zz = typeof z === 'function' ? z(S.u) : z;
  setCam(S, lerp(W / 2, 900, clamp((zz - 1) * 3)), lerp(H / 2, 700, clamp((zz - 1) * 2.4)), zz);
  const road = backdrop(S, mode, t);
  const X = 900 + Math.sin(q12(t) * .9) * 18, Y = 985, s = .9;
  // 中景变体（在路面之前）
  if (v === 'billboard') {
    const B = plate('billboard', 820, 420, (c, ce) => {
      vgrad(c, 0, 0, 820, 420, [[0, '#f0dcb8'], [1, '#e8c090']]);
      c.fillStyle = '#ffb9c8'; c.beginPath(); c.arc(590, 250, 190, 0, TAU); c.fill();
      // 跪着的新郎剪影 + 高举的皇冠 + 空着的台座
      c.fillStyle = '#3a2a55'; c.fill(path([[110, 400], [120, 300], [150, 250], [140, 200], [176, 170], [210, 200], [200, 250], [300, 180], [316, 196], [236, 290], [250, 330], [330, 350], [330, 400]]));
      cel(c, [[300, 130, 1], [316, 80, 1], [340, 116, 1], [364, 66, 1], [388, 116, 1], [412, 80, 1], [428, 130, 1]], { f: '#ffd23f', s: '#d89a20', so: [0, -8], l: '#7a4a10', lw: 3 });
      c.fillStyle = '#ffffff'; c.fill(poly([[520, 400], [540, 250], [640, 250], [660, 400]])); c.fillStyle = '#e8d8ff'; c.fillRect(516, 236, 148, 18);
      text(c, '？', 590, 180, { size: 110, col: '#ff4f8a', fam: F.zh });
      text(c, '幸福套餐', 410, 60, { size: 92, col: '#e8304a', fam: F.zh, stroke: '#fff3d6', sw: 10 });
      text(c, '分期 · 三十年', 640, 380, { size: 44, col: '#3a2a55', fam: F.zh });
      c.strokeStyle = '#3a2a55'; c.lineWidth = 12; c.strokeRect(6, 6, 808, 408);
      ce.drawImage(c.canvas, 0, 0); ce.fillStyle = 'rgba(0,0,0,.93)'; ce.fillRect(0, 0, 820, 420);
    });
    const bx = W - 100 - lt * 480, by = 150;
    g.fillStyle = '#1a1230'; g.fillRect(bx + 120, by + 420, 24, 200); g.fillRect(bx + 676, by + 420, 24, 200);
    drawPlate(S, B, bx, by);
    for (let k = 0; k < 4; k++) lamp(g, e, bx + 110 + k * 200, by - 14, 9, '#fff0c0', .9);
    S.txt?.('billboard', '幸福套餐', bx + 200, by + 10, bx + 620, by + 110);
  }
  if (v === 'train') {
    const px = -t * V * .6, tx = -lt * 620;
    g.fillStyle = '#17112a'; g.fillRect(0, 418, W, 30); g.fillStyle = '#2c2148'; g.fillRect(0, 414, W, 6);
    for (let k = -1; k < 5; k++) { const x = ((px % 700) + 700) % 700 + k * 700 - 350; g.fillStyle = '#17112a'; g.fillRect(x, 440, 46, 300); g.fillStyle = '#231a3c'; g.fillRect(x, 440, 10, 300); }
    const CL = 960, base = Math.floor(-tx / CL) - 1;
    for (let ci = base; ci < base + 5; ci++) {
      const cx = tx + ci * CL + 2400;
      if (cx > W + 50 || cx + CL < -50) continue;
      const body = new Path2D(); body.roundRect(cx + 8, 196, CL - 16, 222, 22);
      g.fillStyle = '#394066'; g.fill(body); g.fillStyle = '#272c4a'; g.fillRect(cx + 8, 196, CL - 16, 36); g.fillStyle = TEAL; g.fillRect(cx + 8, 366, CL - 16, 12);
      e.fillStyle = '#000'; e.fill(body);
      for (let wi = 0; wi < 5; wi++) {
        const wx = cx + 50 + wi * 180, wp = new Path2D(); wp.roundRect(wx, 244, 140, 106, 10);
        g.fillStyle = '#ffe2a0'; g.fill(wp); e.fillStyle = rgba('#ffd98a', .5); e.fill(wp);
        g.save(); g.clip(wp); g.translate(wx + 70, 300); const kd = (ci * 5 + wi) % 2 ? 'horse' : 'ox'; g.scale((ci + wi) % 3 ? -.62 : .62, .62); beastBust(g, kd, '#2a1c3c'); g.restore();
        g.save(); g.clip(wp); g.strokeStyle = '#2a1c3c'; g.lineWidth = 4; g.beginPath(); g.moveTo(wx + 104, 244); g.lineTo(wx + 104, 276); g.stroke(); g.beginPath(); g.arc(wx + 104, 286, 10, 0, TAU); g.stroke(); g.restore();
        e.save(); e.clip(wp); e.translate(wx + 70, 300); e.scale((ci + wi) % 3 ? -.62 : .62, .62); beastBust(e, kd, '#000'); e.restore();
      }
    }
  }
  if (v === 'horses') { g.fillStyle = '#8fc86a'; g.fillRect(0, 690, W, 24); g.fillStyle = '#6aa850'; g.fillRect(0, 704, W, 10); }
  road();
  // 路面拖影 + 车道线
  speedLines(g, f12(t), { type: 'h', n: 26, col: RIDE[mode].streak, a: frozen ? .5 : .25, hmax: 3, seed: 7 });
  { const lx = -t * V * 1.25; g.fillStyle = rgba(RIDE[mode].lane, night ? .35 : .7); for (let k = -1; k < 6; k++) { const x = ((lx % 520) + 520) % 520 + k * 520 - 520; g.fillRect(x, 1046, 300, 9); } }
  if (night) rain(g, e, f12(t), { n: 120, ang: -.55, len: [30, 70], a: .16, w: .8, seed: 1 });
  if (v === 'jam') {
    const jx = -t * V * .5;
    for (let k = -1; k < 6; k++) { const x = ((jx % 520) + 520) % 520 + k * 520 - 300; const id = Math.floor((x - jx) / 520 + .5); celLayer(S, c => car(c, x, 832 + (f12(t) + id) % 2 * 1.5, .9, ['#b9a8b8', '#8f9ab8', '#c8b49a', '#a8b8b0'][((id % 4) + 4) % 4], id % 2 ? 'ox' : 'horse')); lamp(null, e, x + 206, 832 - 74, 12, '#ff3040', .7); }
  }
  if (v === 'horses') {
    const HP = PAL.noon;
    const herd = [[300, 'horse', HP.horse, 0, .5, '#3a2418'], [640, 'ox', HP.ox, .37, .52, null], [1320, 'horse', { f: '#f2ece2', s: '#b9b4c4', h: '#ffffff', l: '#4a4660' }, .6, .5, '#cfc8d8'], [1640, 'horse', { f: '#4a3a44', s: '#2c2230', h: '#7a6878', l: '#140e18' }, .2, .46, '#1a1420']];
    for (const [hx, kind, C, po, hs, mane] of herd) celLayer(S, c => { c.translate(hx + Math.sin(t * .6 + po * 9) * 50, 742); c.scale(hs, hs); quad(c, C, { kind, gait: 'gallop', ph: (f12(t) / 6 + po) % 1, maneCol: mane, wind: 1 }); });
  }
  if (v === 'pass') {   // 对向来的骑手：白发、红围巾
    const tp = S.t, th = o.th, hd = o.hold;
    const rel = tp < th ? tp - th : tp < th + hd ? 0 : tp - th - hd, ox = 1540 - rel * 2600;
    if (ox > -600 && ox < W + 600) {
      const P2 = { ...PAL.noon, teal: PAL.noon.red, leather: PAL.noon.cream, white: { f: '#fff4ee', s: '#d8b8c0', h: '#ffffff', l: '#6a3a4a' } };
      drawRider(S, 'noon', tp, ox, 900, .78, { flip: true, P: P2, salute: frozen || Math.abs(rel) < .25, expr: 'smile', pack: false, still: !!frozen });
    }
  }
  // 骑手
  const R = drawRider(S, mode, frozen ? o.th : S.t, X, Y, s, { expr: o.expr, mouth: o.mouth, visor: o.visor, salute: v === 'pass' && (frozen || (S.t > o.th - .25 && S.t < o.th + o.hold + .35)), still: !!frozen });
  if (frozen) speedLines(g, 3, { type: 'h', n: 60, col: '#ffffff', a: .55, hmax: 5, seed: 3 });
  if (v === 'thread') {   // 手腕上的红线：绷紧 → 崩断 → 甩走
    const wx = X + 100 * s, wy = Y + (-432 + R.bob) * s, dt = S.t - o.snap;
    const draw = pts => { for (const [c, w, col] of [[g, 8, RED], [e, 12, rgba(RED, .8)]]) { c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.stroke(path(pts, false)); c.restore(); } };
    if (dt < 0) { const vib = Math.sin(S.t * 60) * (2 + 10 * seg(dt, -1.2, 0)); const pts = []; for (let k = 0; k <= 8; k++) { const u = k / 8; pts.push([wx - u * (wx + 80), wy - u * 30 + Math.sin(u * Math.PI) * vib + u * (1 - u) * 60 * (1 - seg(dt, -2.5, -.4))]); } draw(pts); }
    else {
      const k = eo(seg(dt, 0, .5)); const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push([lerp(wx - 120, -120, k) - u * (wx * (1 - k) + 60), wy - 30 + Math.sin(u * 8 + dt * 30) * 40 * (1 - k) - k * 80 * u]); } if (k < 1) draw(pts);
      // 手腕上剩下的线头 + 蝴蝶结飘走
      const kk = seg(dt, 0, 1.6), bx = wx - 30 - kk * 900, by = wy - 10 - Math.sin(kk * 3) * 120 - kk * 60;
      if (kk < 1) for (const c of [g, e]) { c.save(); c.translate(bx, by); c.rotate(dt * 6); c.fillStyle = RED; c.globalAlpha = c === e ? .6 : 1; c.fill(path([[0, 0, 1], [-26, -18], [-30, 14], [0, 0, 1], [26, -18], [30, 14]])); c.restore(); }
      if (dt < 2 / 24) flash(S, .7);
    }
  }
  if (v === 'sing') { notes(S, S.t, X - 20 * s, Y - 600 * s, mode === 'dawn' ? '#fff0a8' : '#ffffff', 6, 0); gulls(S, S.t, mode === 'dawn' ? [[1380, 250, 1.1, 0], [1560, 190, .8, 1], [1700, 300, .9, 2]] : [[1300, 220, 1.2, 0], [1520, 150, .9, 1], [1680, 280, 1, 2], [420, 180, .7, 3]]); }
  // 近层：路灯杆 / 护栏柱飞过
  if (night) { const px = ((-t * V * 1.7) % 2600 + 2600) % 2600 - 300; g.save(); g.filter = 'blur(10px)'; g.fillStyle = '#0a0612'; g.fillRect(px, -50, 70, H + 100); g.restore(); rain(g, e, f12(t), { n: 50, ang: -.6, len: [90, 180], a: .22, w: 2.2, seed: 2 }); }
  // 「清醒吧」：灯 / 太阳的光晕打满两帧
  for (const h of o.hits || []) {
    const d = S.t - h; if (d < -.02 || d > .5) continue;
    if (d < 2 / 24) flash(S, mode === 'night' ? .85 : .7, mode === 'dawn' ? '#fff0c8' : '#ffffff');
    S.e.save(); S.e.setTransform(1, 0, 0, 1, 0, 0);
    if (mode === 'dawn') flare(S.e, 1480, 616, 1.6 * (1 - d / .5), '#ffd9a0', { rot: .2 }); else if (mode === 'noon') flare(S.e, 1500, 150, 1.5 * (1 - d / .5), '#ffffff', { rot: .1 }); else flare(S.e, R.hd[0], R.hd[1], 1.4 * (1 - d / .5), '#bfe6ff');
    S.e.restore();
  }
  if (mode === 'noon') return { bloom: .55, halo: .1, expo: 1.02, shadowTint: [.1, .14, .3] };
  if (mode === 'dawn') return { bloom: .75, shadowTint: [.2, .1, .22] };
}

// —— 头盔胸像（3/4），光带扫过 ——  o = { variant: 'visor'|'sing'|'freeze', title }
export function bust(S, mode, o = {}) {
  const { g, e, t, lt, u } = S, night = mode === 'night', P = PAL[RIDE[mode].P], old = mode === 'noon', fr = f12(t);
  const frz = o.variant === 'freeze' ? o.at : null, held = frz != null && t >= frz;
  const tt = held ? frz : t;
  const z = lerp(1, o.zoomTo ?? 1.12, eio(held ? (frz - (t - lt)) / S.d : u));
  setCam(S, W / 2, H / 2, z);
  // 流动的背景
  if (night) {
    vgrad(g, 0, 0, W, H, [[0, '#0a0924'], [.6, '#2a1552'], [1, '#521f66']]);
    for (let k = 0; k < 16; k++) { const y = 80 + (k * 137) % 900, L = 500 + (k * 211) % 900, x = W + 600 - ((tt * (1700 + k * 90) + k * 520) % (W + 1800)), col = NEON[k % 6]; const gr = g.createLinearGradient(x, 0, x + L, 0); gr.addColorStop(0, rgba(col, 0)); gr.addColorStop(.3, rgba(col, .85)); gr.addColorStop(1, rgba(col, 0)); const hh = 6 + (k % 4) * 6; g.fillStyle = gr; g.fillRect(x, y, L, hh); e.fillStyle = gr; e.fillRect(x, y, L, hh); }
  } else if (mode === 'dawn') {
    vgrad(g, 0, 0, W, H, [[0, '#34407e'], [.45, '#a86a9e'], [.75, '#ff9e86'], [1, '#ffd49a']]);
    airbrush(g, 1560, 700, 700, 320, '#fff0c0', .7); airbrush(e, 1560, 700, 420, 200, '#ffe0a0', .5);
    vgrad(g, 0, 760, W, 320, [[0, '#c88a9a'], [1, '#5a4476']]);
    speedLines(g, held ? 2 : fr, { type: 'h', n: 40, col: '#ffe8d0', a: .4, hmax: 6, seed: 5 });
  } else {
    vgrad(g, 0, 0, W, H, [[0, '#1f52c8'], [.7, '#5fa4f0'], [1, '#bfe6ff']]);
    const C = noonClouds(); let ox = ((-tt * 500) % C.w + C.w) % C.w - C.w; g.save(); g.globalAlpha = .9; for (let x = ox; x < W; x += C.w) g.drawImage(C.c, x, 120, C.w, C.h * 1.5); g.restore();
    if (held) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); speedLines(g, 1, { type: 'radial', cx: 900, cy: 480, n: 70, col: '#ffffff', a: .5, r0: 420, wmul: 1.2 }); g.restore(); }
    else speedLines(g, fr, { type: 'h', n: 30, col: '#ffffff', a: .35, hmax: 5, seed: 5 });
  }
  const bob = held ? 0 : (hash(fr * 1.3) - .5) * 5;
  const flap = ['talk', 'o', 'smile', 'grin', 'talk', 'flat'];
  const expr = o.variant === 'sing' ? { expr: 'sing', mouth: flap[f8(tt) % flap.length] } : old ? { expr: 'laugh' } : { expr: 'cold' };
  const bands = night ? [0, 1, 2].map(k => ({ x: W + 500 - ((tt * 1500 + k * 1000) % 3200), w: 560, col: ['#ff3fa4', '#35e7ff', '#ffd23f'][k], a: .3, ang: .22 })) : mode === 'dawn' ? [{ x: W + 500 - ((tt * 900) % 3600), w: 700, col: '#fff0c0', a: .22, ang: .22 }] : null;
  celLayer(S, c => {
    c.translate(880, 500 + bob); c.scale(2.7, 2.7);
    if (old) { for (let k = 0; k < 2; k++) { const sp = flutter(-50, 150 + k * 10, Math.PI - .1 + k * .1, 240 - k * 50, 14, held ? 14 : 16 + k * 5, 1.3, (held ? .3 : (fr % 6) / 6) * TAU + k * 2, -20); cel(c, ribbon(sp, uu => 34 - uu * 10 - k * 5), { f: k ? P.teal.s : P.teal.f, s: P.teal.s, so: [0, -8], h: P.teal.h, ho: [0, 3], l: P.teal.l, lw: 1.6 }); } }
    head(c, P, { who: old ? 'old' : 'afa', body: old ? 'old' : 'jacket', ...expr, rim: night ? { c: '#ff6ad0', d: [2.5, 3] } : null, skinRim: null });
    helmet(c, P, { view: 'q', visor: night ? 0 : 1, goggles: old, rim: night ? { c: '#ff6ad0', d: [2.5, 3] } : null,
      visorFn: night ? gg => { for (let k = 0; k < 7; k++) { const x = 120 - ((tt * (220 + k * 30) + k * 71) % 300), y = -30 + (k * 37) % 120, col = NEON[k % 6]; gg.fillStyle = rgba(col, .75); gg.beginPath(); gg.ellipse(x, y, 16 + (k % 3) * 8, 5 + (k % 2) * 3, -.2, 0, TAU); gg.fill(); } } : null });
  }, { bands });
  if (night) rain(g, e, fr, { n: 60, ang: -.9, len: [120, 240], a: .2, w: 2.2, seed: 3 });
  if (held) { const d = t - frz; if (d < 3 / 24) flash(S, 1 - d * 6); if (o.title) o.title(S, d); }
  if (old) return { bloom: .5, halo: .1, shadowTint: [.1, .14, .3] };
}

// —— 背后视角：伪 3D 的路 ——  o = { variant: 'out'|'fork'|'pillion'|'tunnel'|'tunnelIn'|'sky' }
export function rear(S, mode, o = {}) {
  const { g, e, t, lt, u } = S, v = o.variant, fr = f12(t), night = mode === 'night', P = PAL[RIDE[mode].P], old = mode === 'noon';
  const HZ = v === 'sky' ? 600 : 470, sway = Math.sin(t * .9) * 26;
  let vx = W / 2 + sway * .5, panx = 0;
  if (v === 'fork') { panx = eio(seg(u, .45, .85)) * 520; }
  const z = v === 'pillion' ? lerp(1.35, 1.55, u) : 1;
  setCam(S, W / 2, v === 'pillion' ? 640 : H / 2, z);
  // 天空 / 远景
  if (v === 'tunnelIn') { g.fillStyle = '#07060f'; g.fillRect(0, 0, W, H); }
  else if (night) {
    vgrad(g, 0, 0, W, HZ + 10, [[0, '#05041a'], [.6, '#1a1244'], [1, '#3a1c5a']]);
    const R = rng(77); for (let i = 0; i < 160; i++) { const x = R() * W, y = R() * (HZ - 40), tw = .5 + .5 * Math.sin(t * 2 + i); g.fillStyle = rgba('#e8e0ff', .3 + R() * .5 * tw); g.fillRect(x, y, R() < .1 ? 3 : 2, 2); }
    g.fillStyle = '#120c2a'; g.fill(path([[0, HZ], [0, HZ - 90], [260, HZ - 150], [520, HZ - 70], [800, HZ - 110], [1100, HZ - 60], [1400, HZ - 130], [1700, HZ - 80], [1920, HZ - 120], [1920, HZ]]));
  } else if (mode === 'dawn') {
    vgrad(g, 0, 0, W, HZ + 4, [[0, '#2f3f84'], [.45, '#9a66a4'], [.8, '#ff9a84'], [1, '#ffe0a0']]);
    const sx = 1380 - panx;
    airbrush(g, sx, HZ, 700, 240, '#fff0c0', .6); airbrush(e, sx, HZ, 420, 130, '#ffe0a0', .5); g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(sx, HZ + 2, 58, Math.PI, 0); g.fill(); e.fillStyle = '#fff0c0'; e.beginPath(); e.arc(sx, HZ + 2, 58, Math.PI, 0); e.fill();
    // 右边是海，左边是山；岔路时左山上有一座城堡
    vgrad(g, vx - panx, HZ, W + panx + 600, 60, [[0, '#ffc49a'], [1, '#a06a92']]);
    g.fillStyle = '#5b3f78'; g.fill(path([[-600 - panx, HZ + 4], [-600 - panx, HZ - 60], [100 - panx, HZ - 210], [420 - panx, HZ - 150], [700 - panx, HZ - 60], [900 - panx, HZ + 4]]));
    if (v === 'fork') { const cx0 = 300 - panx, cy0 = HZ - 196; g.fillStyle = '#3f2a5e'; for (const [dx, w, h] of [[-70, 36, 110], [-20, 60, 80], [50, 36, 130]]) { g.fillRect(cx0 + dx, cy0 - h + 30, w, h); g.beginPath(); g.moveTo(cx0 + dx - 6, cy0 - h + 30); g.lineTo(cx0 + dx + w / 2, cy0 - h - 20); g.lineTo(cx0 + dx + w + 6, cy0 - h + 30); g.fill(); } lamp(g, e, cx0 + 68, cy0 - 60, 5, '#ffd0e8', .7); }
  } else {
    vgrad(g, 0, 0, W, HZ + 10, [[0, '#1848c0'], [.7, '#4f96ea'], [1, '#bfe6ff']]);
    const R = rng(8); g.save(); g.translate(0, lerp(40, -30, u));
    cumulus(g, 960, HZ + 40, 2.6, '#ffffff', '#8fb0ea', R, false); cumulus(g, 250, HZ + 60, 1.7, '#ffffff', '#9ab8ee', R, false); cumulus(g, 1700, HZ + 50, 1.9, '#ffffff', '#9ab8ee', R, false); cumulus(g, 600, 180, .8, '#ffffff', '#9ab8ee', R, false); cumulus(g, 1400, 130, .7, '#ffffff', '#9ab8ee', R, false); g.restore();
  }
  // 路面
  const D = 300, road = (zf, xw) => [vx - panx * (1 - 1 / zf) + xw * 1000 / zf, HZ + D * 2.1 / zf * (v === 'sky' ? .8 : 1)];
  const zN = .56, zFar = 40;
  if (v === 'tunnelIn') {
    // 隧道内：拱顶灯带一圈圈迎面扫过
    for (let k = 0; k < 14; k++) { const zz = ((k * 2.2 - t * 26) % 30 + 30) % 30 + .7, s = 1 / zz, cx = vx, cy = HZ + 40 * s, w = 1500 * s, h = 1250 * s, a = clamp(1.4 - zz / 22);
      g.strokeStyle = rgba('#3a2f5a', a); g.lineWidth = 70 * s; g.beginPath(); g.ellipse(cx, cy + h * .35, w, h, 0, Math.PI, 0); g.stroke();
      for (const c of [g, e]) { c.strokeStyle = rgba('#ffcf80', a * (c === e ? .7 : 1)); c.lineWidth = 22 * s; c.beginPath(); c.ellipse(cx, cy + h * .35, w * .96, h * .96, 0, Math.PI * 1.42, Math.PI * 1.58); c.stroke(); } }
    g.fillStyle = '#131026'; g.fill(poly([road(zFar, -1.2), road(zFar, 1.2), road(zN, 1.2), road(zN, -1.2)]));
  } else {
    if (v === 'sky') { g.fillStyle = '#7fb86a'; g.fill(poly([[0, HZ + 40], [vx - 300, HZ], [vx + 300, HZ], [W, HZ + 40], [W, H], [0, H]])); }
    else { g.fillStyle = night ? '#0c0a1c' : '#4a3a5a'; g.fillRect(0, HZ, W, H - HZ); if (mode === 'dawn') { vgrad(g, vx - panx + 400, HZ + 50, W, H, [[0, '#a06a92'], [1, '#5a4476']]); } }
    const rg = g.createLinearGradient(0, HZ, 0, H); if (night) { rg.addColorStop(0, '#231a40'); rg.addColorStop(1, '#0e0a1c'); } else if (mode === 'dawn') { rg.addColorStop(0, '#8a6a8a'); rg.addColorStop(1, '#3a2840'); } else { rg.addColorStop(0, '#a4a8bc'); rg.addColorStop(1, '#5c5f7c'); }
    g.fillStyle = rg; g.fill(poly([road(zFar, -1), road(zFar, 1), road(zN, 1), road(zN, -1)]));
    if (v === 'fork') {   // 左边分出去的岔路（通往城堡），越来越远
      g.fillStyle = '#6a5078'; g.fill(poly([road(6, -1), road(3.2, -1), [road(5, -4.2)[0], road(9, 0)[1]], [road(7, -3.6)[0], road(14, 0)[1]]]));
    }
  }
  // 车道线 + 路边柱 / 灯
  const spd = v === 'tunnelIn' ? 26 : 16;
  for (let k = 0; k < 16; k++) {
    const zz = ((k * 2.4 - t * spd) % 38.4 + 38.4) % 38.4 + zN, z2 = Math.max(zN, zz - .9);
    const a = clamp(1.3 - zz / 30);
    g.fillStyle = rgba(night || v === 'tunnelIn' ? '#d8ccff' : '#ffffff', a * .9);
    const p1 = road(zz, -.03), p2 = road(zz, .03), p3 = road(z2, .03), p4 = road(z2, -.03); g.fill(poly([p1, p2, p3, p4]));
    if (v === 'tunnelIn') continue;
    for (const sd of [-1, 1]) {
      const b = road(zz, sd * 1.18), hgt = (night ? 520 : 90) / zz;
      if (night) { g.strokeStyle = rgba('#2a2248', a); g.lineWidth = Math.max(1.5, 12 / zz); g.beginPath(); g.moveTo(b[0], b[1]); g.lineTo(b[0], b[1] - hgt); g.lineTo(b[0] - sd * 180 / zz, b[1] - hgt - 30 / zz); g.stroke(); lamp(g, e, b[0] - sd * 180 / zz, b[1] - hgt - 30 / zz, Math.max(2, 26 / zz), '#ffb860', a); }
      else { g.fillStyle = rgba(mode === 'dawn' ? '#f0d0d8' : '#fbf6ea', a); g.fillRect(b[0] - 5 / zz, b[1] - hgt, 10 / zz, hgt); }
    }
  }
  if (!night && v !== 'tunnelIn') for (const sd of [-1, 1]) { g.strokeStyle = mode === 'dawn' ? '#c8a0b0' : '#e9e2d0'; g.lineWidth = 5; g.beginPath(); const a = road(zFar, sd * 1.18), b = road(zN, sd * 1.18); g.moveTo(a[0], a[1] - 90 / zFar); g.lineTo(b[0], b[1] - 90 / zN); g.stroke(); }
  if (v === 'fork') {   // 路牌：迎面而来，过了就没了
    const zz = lerp(9, .9, seg(u, 0, .72)); const sc = 1 / zz, b = road(zz, 0);
    if (zz > 1.05) {
      const bw = 1500 * sc, bh = 380 * sc, by = b[1] - 1150 * sc;
      g.fillStyle = '#3a2c50'; g.fillRect(b[0] - bw / 2 - 16 * sc, by, 16 * sc, 1150 * sc); g.fillRect(b[0] + bw / 2, by, 16 * sc, 1150 * sc);
      const bp = new Path2D(); bp.roundRect(b[0] - bw / 2, by, bw, bh, 20 * sc); g.fillStyle = '#1f6a8a'; g.fill(bp); g.strokeStyle = '#f4f8ff'; g.lineWidth = 8 * sc; g.stroke(bp); e.fillStyle = '#000'; e.fill(bp);
      g.fillStyle = '#f4f8ff'; g.fillRect(b[0] - 4 * sc, by + 30 * sc, 8 * sc, bh - 60 * sc);
      text(g, '← 城堡', b[0] - bw / 4, by + bh / 2, { size: 170 * sc, col: '#ffd0e8', fam: F.zh }); text(g, '海 →', b[0] + bw / 4, by + bh / 2, { size: 190 * sc, col: '#8ff7ea', fam: F.zh });
      S.txt?.('fork', '← 城堡 海 →', b[0] - bw / 2, by, b[0] + bw / 2, by + bh);
    }
  }
  if (v === 'tunnel') {   // 隧道口迎面变大，最后吞没画面
    const zz = lerp(14, .5, ei(u) * .55 + u * .45), sc = 1 / zz, b = road(zz, 0), w = 1500 * sc, h = 1500 * sc;
    g.fillStyle = '#4a3a5a'; g.fill(path([[b[0] - w * 2.6, b[1]], [b[0] - w * 2.2, b[1] - h * 1.5], [b[0] - w, b[1] - h * 2.1], [b[0] + w, b[1] - h * 2.0], [b[0] + w * 2.4, b[1] - h * 1.4], [b[0] + w * 2.6, b[1]]]));
    for (const c of [g, e]) { c.fillStyle = c === g ? '#0a0814' : '#000'; c.beginPath(); c.ellipse(b[0], b[1], w, h, 0, Math.PI, 0); c.fill(); }
    g.strokeStyle = '#d8c0c8'; g.lineWidth = 26 * sc; g.beginPath(); g.ellipse(b[0], b[1], w * 1.03, h * 1.03, 0, Math.PI, 0); g.stroke();
    for (let k = 0; k < 5; k++) lamp(g, e, b[0], b[1] - h * (.95 - k * .0) + k * 40 * sc, 20 * sc, '#ffcf80', .9 - k * .15);
  }
  // 骑手背影
  const lean = v === 'fork' ? Math.sin(seg(u, .35, .9) * Math.PI) * .14 : Math.sin(t * .9) * .03;
  const rx = W / 2 + sway + (v === 'fork' ? Math.sin(seg(u, .35, .9) * Math.PI) * 60 : 0), ry = 930 + (hash(fr * 1.7) - .5) * 4, rs = v === 'sky' ? lerp(.7, .56, u) : .7;
  g.save(); g.fillStyle = rgba('#05030c', .4); g.beginPath(); g.ellipse(rx, ry + 2, 150 * rs, 14 * rs, 0, 0, TAU); g.fill(); g.restore();
  const bands = night ? [0, 1].map(k => ({ x: W / 2 + (k ? 1 : -1) * (((t * 1.4 + k * .5) % 1) * 900 - 100), w: 300, col: '#ffb860', a: .3, ang: k ? -.5 : .5 })) : v === 'tunnelIn' ? [{ x: W / 2, w: 900, col: '#ffcf80', a: .32 * (.5 + .5 * Math.sin(t * 26 / 2.2 * TAU)), ang: 1.57 }] : null;
  celLayer(S, c => { c.translate(rx, ry - (v === 'sky' ? lerp(0, 90, u) : 0)); c.scale(rs, rs); riderBack(c, v === 'tunnelIn' ? PAL.night : P, { old, pack: mode !== 'night', lean, ph: (fr % 6) / 6, rim: night ? { c: '#ffb860', d: [0, 5] } : null }); }, { bands });
  lamp(g, e, rx, ry - 216 * rs, 16 * rs, '#ff2a40', night || v === 'tunnelIn' ? 1 : .5);
  if (night) {   // 后视镜里：越来越小的城市
    const sh = lerp(1, .35, u);
    for (const sd of [-1, 1]) { const mx = rx + sd * 204 * rs, my = ry - 556 * rs; g.save(); g.beginPath(); g.ellipse(mx, my, 24 * rs, 15 * rs, sd * .2, 0, TAU); g.clip(); g.fillStyle = '#1a1244'; g.fillRect(mx - 30, my - 20, 60, 40); for (let k = 0; k < 9; k++) { g.fillStyle = NEON[k % 6]; g.fillRect(mx + (k - 4) * 3 * sh, my + 2 - ((k * 7) % 9) * sh, 2, 2 + ((k * 7) % 9) * sh); } g.restore(); lamp(null, e, mx, my, 8 * sh, '#ff6ad0', .5); }
  }
  if (v === 'tunnel') { const k = seg(u, .9, 1); if (k > 0) { for (const c of [g, e]) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = k; c.fillStyle = c === g ? '#07060f' : '#000'; c.fillRect(0, 0, W, H); c.restore(); } } }
  if (old) return { bloom: .55, halo: .1, shadowTint: [.1, .14, .3] };
  if (mode === 'dawn') return { bloom: .75 };
}

// 小小的骑手（远景里的一个点）：一盏车头灯 + 一盏尾灯 + 青绿色的一点
function speck(S, x, y, s, dir = 1, mode = 'night') {
  const { g, e } = S;
  celLayer(S, c => { c.translate(x, y); c.scale(s * dir, s); rider(c, PAL[RIDE[mode].P], { wheelA: 0, speed: 1, visor: RIDE[mode].visor, old: RIDE[mode].old, pack: RIDE[mode].pack }); });
  if (mode !== 'noon') { lamp(g, e, x + dir * 246 * s, y - 352 * s, Math.max(5, 40 * s), '#fff2c0', 1); }
  lamp(g, e, x - dir * 318 * s, y - 300 * s, Math.max(3, 26 * s), '#ff2a40', mode === 'noon' ? .4 : 1);
}

// —— 远景 ——
export function moon(S) {   // 夜：高架、巨大的月亮；镜头上摇
  const { g, e, t, u } = S;
  const Pp = plate('moon', W, 1500, (c, ce) => {
    vgrad(c, 0, 0, W, 1500, [[0, '#04031a'], [.4, '#140e3c'], [.7, '#3a1a5c'], [1, '#6a2468']]);
    const R = rng(21); for (let i = 0; i < 320; i++) { c.fillStyle = rgba('#e8e0ff', .3 + R() * .6); const r = R() < .08 ? 2.2 : 1.1; c.beginPath(); c.arc(R() * W, R() * 900, r, 0, TAU); c.fill(); }
    airbrush(c, 620, 520, 620, 620, '#b9a8ff', .22); airbrush(ce, 620, 520, 420, 420, '#d8ccff', .35);
    const mg = c.createRadialGradient(560, 440, 40, 620, 520, 300); mg.addColorStop(0, '#fffbe8'); mg.addColorStop(1, '#f2e2c0'); c.fillStyle = mg; c.beginPath(); c.arc(620, 520, 290, 0, TAU); c.fill();
    ce.fillStyle = rgba('#fff0d0', .55); ce.beginPath(); ce.arc(620, 520, 290, 0, TAU); ce.fill();
    c.fillStyle = rgba('#d8c49a', .5); for (const [x, y, r] of [[540, 430, 60], [700, 560, 80], [610, 650, 40], [730, 420, 34], [500, 570, 30]]) { c.beginPath(); c.ellipse(x, y, r, r * .8, .3, 0, TAU); c.fill(); }
    c.save(); c.filter = 'blur(14px)'; for (let i = 0; i < 12; i++) { const y = 760 + R() * 300, x = R() * 2200 - 140, w = 300 + R() * 400; c.fillStyle = rgba('#3a2a6a', .6); c.beginPath(); c.ellipse(x, y, w, 40, 0, 0, TAU); c.fill(); c.fillStyle = rgba('#c0508a', .3); c.beginPath(); c.ellipse(x + 20, y + 20, w * .8, 16, 0, 0, TAU); c.fill(); } c.restore();
    // 城市灯海
    for (let layer = 0; layer < 3; layer++) { const col = ['#1a1236', '#221842', '#2c1f50'][layer]; for (let x = -60; x < 1980;) { const w = 60 + R() * 130, top = 1090 + layer * 110 + R() * 160; c.fillStyle = col; c.fillRect(x, top, w, 1500 - top); c.fillStyle = rgba('#8a6ad0', .25); c.fillRect(x, top, 3, 1500 - top); for (let yy = top + 12; yy < 1500; yy += 18) for (let i = 0; i < w / 14; i++) { if (R() > .2) continue; const cc = R() < .7 ? '#ffcf80' : '#8fdcff'; c.fillStyle = rgba(cc, .8); c.fillRect(x + 5 + i * 14, yy, 6, 8); ce.fillStyle = rgba(cc, .3); ce.fillRect(x + 5 + i * 14, yy, 6, 8); } x += w + R() * 12; } }
    vgrad(c, 0, 1100, W, 400, [[0, rgba('#ff4fa8', 0)], [1, rgba('#ff4fa8', .25)]]);
  });
  const cy = lerp(1500 - H / 2, 620, eio(clamp(u * 1.05)));
  setCam(S, W / 2, cy, 1);
  drawPlate(S, Pp, 0, 0);
  // 高架：一条从右下弯向左上的带子
  const hw = k => [lerp(2100, -200, k), 1260 - Math.sin(k * Math.PI * .9) * 330 + k * 60];
  const top = [], bot = []; for (let k = 0; k <= 30; k++) { const [x, y] = hw(k / 30), th = lerp(46, 20, k / 30); top.push([x, y]); bot.push([x, y + th]); }
  g.fillStyle = '#0e0a20'; g.fill(poly(top.concat(bot.reverse()))); line(g, path(top, false), '#5a4a8a', 4);
  for (let k = 0; k < 9; k++) { const [x, y] = hw(k / 9 + .05), s = lerp(1, .5, k / 9); g.fillStyle = '#0e0a20'; g.fillRect(x - 12 * s, y + 20, 24 * s, 400); g.strokeStyle = '#2a2248'; g.lineWidth = 4 * s; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 110 * s); g.stroke(); lamp(g, e, x, y - 112 * s, 12 * s, '#ffb860', .9); }
  const k = lerp(.12, .62, u), [bx, by] = hw(k), [bx2, by2] = hw(k + .01);
  S.g.save(); speck(S, bx, by + 2, lerp(.16, .1, u), -1, 'night'); S.g.restore();
  { const pts = []; for (let i = 0; i < 14; i++) { const [tx, ty] = hw(k - i * .012); pts.push([tx, ty - 44 * lerp(.16, .1, u) * 6]); } trail(g, e, pts, '#ff2a40', 4); }
  return { bloom: 1, halo: .3 };
}
export function cliff(S) {   // 黎明：海崖公路、一整面被朝阳点亮的积云——"留住高潮"的那张画
  const { g, e, t, u } = S, PW = 2640;
  const Pp = plate('cliff', PW, H, (c, ce) => {
    vgrad(c, 0, 0, PW, 700, [[0, '#33408a'], [.35, '#8f62a8'], [.7, '#ff9a84'], [1, '#ffe6a8']]);
    const R = rng(5);
    for (const [x, y, s] of [[1300, 690, 2.6], [520, 700, 1.9], [2250, 690, 2.2], [900, 420, 1.0], [1900, 330, 1.2], [200, 300, .8]]) cumulus(c, x, y, s, '#fff0d8', '#eeaaa8', R, false);
    airbrush(c, 1960, 700, 900, 300, '#fff0c0', .7); airbrush(ce, 1960, 700, 520, 180, '#ffe0a0', .55);
    c.fillStyle = '#fff6d8'; c.beginPath(); c.arc(1960, 704, 70, Math.PI, 0); c.fill(); ce.fillStyle = '#fff0c0'; ce.beginPath(); ce.arc(1960, 704, 70, Math.PI, 0); ce.fill();
    vgrad(c, 0, 700, PW, 380, [[0, '#ffc8a0'], [.3, '#b878a0'], [1, '#4a3c7a']]);
    for (let k = 0; k < 60; k++) { const y = 706 + k * 5, w = 60 + (k * 37) % 300; c.fillStyle = rgba('#fff0c0', .5 * (1 - k / 60)); c.fillRect(1960 - w / 2 + Math.sin(k * 2.3) * k * 4, y, w, 2.5); }
    // 一层层的海岬（暗紫，顶缘被朝阳勾亮）
    const capes = [[[-20, 1080], [-20, 560], [200, 520], [520, 560], [760, 640], [900, 760], [1000, 1080]], [[300, 1080], [380, 780], [700, 700], [1100, 720], [1400, 800], [1560, 940], [1640, 1080]], [[1200, 1080], [1300, 900], [1700, 850], [2200, 880], [2500, 960], [2640, 1080]]];
    capes.forEach((pts, i) => { const col = ['#5a3f7a', '#4a3068', '#3a2456'][i]; c.fillStyle = col; const Pth = path(pts); c.fill(Pth); c.save(); c.clip(Pth); c.strokeStyle = '#ffc8a0'; c.lineWidth = 10; c.stroke(Pth); c.strokeStyle = rgba('#000000', .15); c.lineWidth = 3; for (let k = 0; k < 12; k++) { c.beginPath(); c.moveTo(pts[1][0] + k * 120, pts[1][1]); c.lineTo(pts[1][0] + k * 120 - 80, 1080); c.stroke(); } c.restore(); });
  });
  const cx = lerp(W / 2, PW - W / 2, eio(u) * .9 + u * .1);
  setCam(S, cx, H / 2, 1);
  drawPlate(S, Pp, 0, 0);
  for (let k = 0; k < 16; k++) { const y = 712 + k * 9, w = 80 + (k * 53) % 200; g.fillStyle = rgba('#fff6d8', .4); g.fillRect(1960 - w / 2 + Math.sin(k * 2.3 + f8(t) * .9) * k * 6, y, w, 2.5); }
  // 崖上的公路 + 小小的车
  const rd = k => [lerp(360, 1640, k), 792 - Math.sin(k * Math.PI) * 96 + k * 150];
  const pts = []; for (let k = 0; k <= 20; k++) pts.push(rd(k / 20)); line(g, path(pts, false), '#d8b0b8', 7);
  const k = lerp(.2, .75, u), [bx, by] = rd(k);
  speck(S, bx, by, .12, 1, 'dawn');
  gulls(S, t, [[cx + 300, 330, .8, 0], [cx + 420, 290, .6, 1], [cx - 500, 380, .7, 2]]);
  return { bloom: .9, halo: .3, soft: .35 };
}
export function bridge(S) {   // 正午：长桥、大海、巨大的天；一个人，画面说这很好
  const { g, e, t, u } = S, PW = 2700;
  const Pp = plate('bridge', PW, 1300, (c) => {
    vgrad(c, 0, 0, PW, 900, [[0, '#1642b8'], [.6, '#4f96ea'], [1, '#c8ecff']]);
    const R = rng(12);
    for (const [x, y, s] of [[600, 900, 2.4], [1700, 900, 3.0], [2500, 900, 2.0], [1100, 520, 1.3], [2100, 380, 1.1], [300, 330, 1.0], [1500, 200, .8]]) cumulus(c, x, y, s, '#ffffff', '#8fb0ea', R, false);
    vgrad(c, 0, 900, PW, 400, [[0, '#2f84da'], [.3, '#24a4c8'], [1, '#0f6a9a']]);
    for (let k = 0; k < 220; k++) { c.fillStyle = rgba('#ffffff', .2 + R() * .4); c.fillRect(R() * PW, 906 + R() * 380, 20 + R() * 120, 2 + R() * 2); }
    c.fillStyle = '#5f8fc8'; c.fill(path([[-20, 902], [-20, 800], [200, 760], [420, 820], [560, 902]])); c.fillStyle = '#7ab85a'; c.fill(path([[-20, 902], [-20, 830], [180, 800], [380, 850], [500, 902]]));
    c.fillStyle = '#5f8fc8'; c.fill(path([[2300, 902], [2460, 830], [2720, 800], [2720, 902]]));
    // 桥
    c.fillStyle = '#f4f0e6'; c.fillRect(300, 1010, 2200, 22); c.fillStyle = '#b8b4c4'; c.fillRect(300, 1032, 2200, 10);
    for (let k = 0; k < 12; k++) { const x = 380 + k * 190; c.fillStyle = '#e4dfd4'; c.fillRect(x, 1042, 30, 260); c.fillStyle = '#b8b4c4'; c.fillRect(x + 22, 1042, 8, 260); c.fillStyle = rgba('#ffffff', .5); c.fillRect(x - 20, 1180 + (k % 3) * 20, 70, 3); }
    c.strokeStyle = '#f4f0e6'; c.lineWidth = 3; c.beginPath(); c.moveTo(300, 992); c.lineTo(2500, 992); c.stroke(); for (let x = 300; x < 2500; x += 40) { c.beginPath(); c.moveTo(x, 992); c.lineTo(x, 1010); c.stroke(); }
  });
  const cx = lerp(W / 2 + 60, PW - W / 2 - 60, u), cy = lerp(1300 - H / 2, H / 2 + 20, eio(seg(u, .25, 1)));
  setCam(S, cx, cy, 1);
  drawPlate(S, Pp, 0, 0);
  const bx = lerp(700, 2000, u);
  speck(S, bx, 1011, .14, 1, 'noon');
  gulls(S, t, [[cx - 400, cy - 60, .9, 0], [cx - 300, cy - 140, .7, 1], [cx + 500, cy + 40, .8, 2], [cx + 380, cy - 220, .6, 3]]);
  return { bloom: .5, halo: .08, shadowTint: [.1, .14, .3] };
}
// 间奏的一口气：只剩一盏尾灯，越来越小
export function taillight(S) {
  const { g, e, t, u } = S; setCam(S);
  vgrad(g, 0, 0, W, H, [[0, '#0c0a34'], [.34, '#241a5c'], [.5, '#5a2a78'], [.52, '#1a1236'], [1, '#0e0a20']]);
  airbrush(g, W / 2, 548, 1100, 150, '#ff6ab0', .3); airbrush(e, W / 2, 548, 700, 60, '#ff6ab0', .12);
  const R = rng(5); for (let i = 0; i < 90; i++) { g.fillStyle = rgba('#e8e0ff', .25 + R() * .5); g.fillRect(R() * W, R() * 500, 2, 2); }
  g.fillStyle = '#231a44'; g.fill(poly([[W / 2 - 6, 540], [W / 2 + 6, 540], [W / 2 + 900, H], [W / 2 - 900, H]]));
  for (let k = 0; k < 12; k++) { const zz = ((k * 2.4 - t * 10) % 28.8 + 28.8) % 28.8 + .6; g.fillStyle = rgba('#b8a8e8', clamp(1.2 - zz / 22) * .6); g.fillRect(W / 2 - 3 / zz * 4, 540 + 560 / zz, 6 / zz * 4, 60 / zz / zz + 2); }
  const s = lerp(1, .18, eo(u)), y = lerp(760, 556, eo(u));
  lamp(g, e, W / 2, y, 30 * s + 3, '#ff2a40', 1);
  for (const c of [g, e]) { const gr = c.createLinearGradient(0, y, 0, y + 400 * s + 30); gr.addColorStop(0, rgba('#ff2a40', .6)); gr.addColorStop(1, rgba('#ff2a40', 0)); c.fillStyle = gr; c.fillRect(W / 2 - 6 * s - 2, y, 12 * s + 4, 400 * s + 30); }
  S.e.save(); S.e.setTransform(1, 0, 0, 1, 0, 0); flare(S.e, W / 2, y, .5 * s + .12, '#ff5060', { ghosts: false, streak: 500 }); S.e.restore();
  return { bloom: 1.1, halo: .35 };
}
export { cumulus, gulls, notes, noonClouds, speck, NEON, drawRider };
