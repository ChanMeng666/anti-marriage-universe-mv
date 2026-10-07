// 舞台工具：统一的世界→屏幕摄影机、赛璐璐层（同时在发光层挖剪影）、背景缓存、光带、冲击帧、文字
import { canvas, W, H, TAU, rgba, mix, path, poly, cel, line, hash, rng, vgrad, airbrush } from './cel.js';

export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ss = t => { t = clamp(t); return t * t * (3 - 2 * t); };
export const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const eo = t => 1 - Math.pow(1 - clamp(t), 3);
export const ei = t => Math.pow(clamp(t), 3);
export const back = (t, s = 1.8) => { t = clamp(t) - 1; return 1 + t * t * ((s + 1) * t + s); };
export const spring = (t, k = 7, z = .35) => { t = Math.max(0, t); return 1 - Math.exp(-z * k * t) * Math.cos(k * Math.sqrt(1 - z * z) * t * 1.6); };
// 有限动画：角色一拍二（12fps），表演一拍三（8fps）
export const q12 = t => Math.floor(t * 12 + 1e-6) / 12;
export const q8 = t => Math.floor(t * 8 + 1e-6) / 8;
export const f12 = t => Math.floor(t * 12 + 1e-6);
export const f8 = t => Math.floor(t * 8 + 1e-6);

// —— 摄影机：世界坐标 (cx,cy) 对到画面中心，放大 z，旋转 r；g / e / 赛璐璐层共用同一个矩阵 ——
export function setCam(S, cx = W / 2, cy = H / 2, z = 1, r = 0) {
  const m = new DOMMatrix().translate(W / 2, H / 2).rotate(r * 180 / Math.PI).scale(z).translate(-cx, -cy);
  S.M = m; S.g.setTransform(m); S.e.setTransform(m); S.z = z;
  return m;
}
export const resetCam = S => setCam(S);
export const toScreen = (S, x, y) => { const p = S.M.transformPoint({ x, y }); return [p.x, p.y]; };

const [LC, LG] = canvas(W, H), [MC, MG] = canvas(W, H);
// 赛璐璐层：fn 在离屏层上画（已带摄影机矩阵），贴到画面，并把剪影印到发光层上（霓虹不会透过角色）
// o.bands: [{x, w, col, a, ang}] 屏幕空间的光带，只照亮赛璐璐（source-atop）；o.tint: 整层叠色
export function celLayer(S, fn, o = {}) {
  LG.setTransform(1, 0, 0, 1, 0, 0); LG.globalCompositeOperation = 'source-over'; LG.clearRect(0, 0, W, H); LG.globalAlpha = 1; LG.filter = 'none';
  LG.setTransform(S.M); fn(LG);
  LG.setTransform(1, 0, 0, 1, 0, 0);
  if (o.bands || o.tint) {
    LG.globalCompositeOperation = 'source-atop';
    if (o.tint) { LG.fillStyle = o.tint; LG.fillRect(0, 0, W, H); }
    for (const b of o.bands || []) {
      LG.save(); LG.translate(b.x, H / 2); LG.rotate(b.ang ?? .25);
      const gr = LG.createLinearGradient(-b.w / 2, 0, b.w / 2, 0); gr.addColorStop(0, rgba(b.col, 0)); gr.addColorStop(.5, rgba(b.col, b.a ?? .3)); gr.addColorStop(1, rgba(b.col, 0));
      LG.fillStyle = gr; LG.fillRect(-b.w / 2, -H * 1.2, b.w, H * 2.4); LG.restore();
    }
    LG.globalCompositeOperation = 'source-over';
  }
  const g = S.g, e = S.e;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); if (o.alpha != null) g.globalAlpha = o.alpha; g.drawImage(LC, 0, 0); g.restore();
  if (o.occlude !== false) {
    MG.setTransform(1, 0, 0, 1, 0, 0); MG.globalCompositeOperation = 'source-over'; MG.clearRect(0, 0, W, H); MG.drawImage(LC, 0, 0);
    MG.globalCompositeOperation = 'source-in'; MG.fillStyle = o.occCol || '#000'; MG.fillRect(0, 0, W, H); MG.globalCompositeOperation = 'source-over';
    e.save(); e.setTransform(1, 0, 0, 1, 0, 0); e.globalAlpha = o.occA ?? 1; e.drawImage(MC, 0, 0); e.restore();
  }
}

// —— 背景缓存：只在第一次用到时画一次（color + emissive 一对）——
const PLATES = new Map();
export function plate(key, w, h, paint) {
  let p = PLATES.get(key);
  if (!p) { const [c, g] = canvas(w, h), [ec, e] = canvas(w, h); e.fillStyle = '#000'; e.fillRect(0, 0, w, h); paint(g, e, w, h); p = { c, e: ec, w, h }; PLATES.set(key, p); }
  return p;
}
export function cached(key, fn) { let p = PLATES.get(key); if (!p) { p = fn(); PLATES.set(key, p); } return p; }
export function drawPlate(S, p, x = 0, y = 0, w, h) { S.g.drawImage(p.c, x, y, w ?? p.w, h ?? p.h); S.e.drawImage(p.e, x, y, w ?? p.w, h ?? p.h); }
export function loopPlate(S, p, x, y, span = W) {
  let ox = ((x % p.w) + p.w) % p.w; ox -= p.w;
  for (let xx = ox; xx < span; xx += p.w) { S.g.drawImage(p.c, xx, y); S.e.drawImage(p.e, xx, y); }
}
export function smear(p, px, n = 8) {
  const out = {};
  for (const k of ['c', 'e']) {
    const [c, g] = canvas(p.w, p.h); g.globalAlpha = 1 / n;
    for (let i = 0; i < n; i++) { const dx = (i / (n - 1) - .5) * px; g.drawImage(p[k], dx, 0); g.drawImage(p[k], dx + (dx < 0 ? p.w : -p.w), 0); }
    g.globalAlpha = 1; out[k] = c;
  }
  // 多次半透明叠加会留下半透明：垫一层原图保证不透明处仍不透明
  for (const k of ['c', 'e']) { const [c, g] = canvas(p.w, p.h); g.drawImage(p[k], 0, 0); g.drawImage(out[k], 0, 0); out[k] = c; }
  return { ...out, w: p.w, h: p.h };
}
// 湿路面倒影：翻转 + 纵向拖影 + 模糊 + 压暗
export function reflectPlate(p, Hr, strength = .8, dark = '#05030c') {
  const out = {};
  for (const k of ['c', 'e']) {
    const [c, g] = canvas(p.w, Hr);
    if (k === 'e') { g.fillStyle = '#000'; g.fillRect(0, 0, p.w, Hr); }
    g.save(); g.filter = 'blur(5px)';
    for (let i = 0; i < 6; i++) { g.globalAlpha = .3 * (1 - i / 7); g.save(); g.translate(0, i * 26); g.scale(1, -1.15); g.drawImage(p[k], 0, -p.h, p.w, p.h); g.restore(); }
    g.restore();
    g.globalAlpha = 1; g.globalCompositeOperation = k === 'c' ? 'source-atop' : 'multiply';
    for (let y = 0; y < Hr; y += 6) { const a = .12 + .1 * Math.sin(y * .37) + .08 * Math.sin(y * 1.3); g.fillStyle = k === 'c' ? rgba(dark, a) : `rgb(${255 * (1 - a)},${255 * (1 - a)},${255 * (1 - a)})`; g.fillRect(0, y, p.w, 3); }
    const gr = g.createLinearGradient(0, 0, 0, Hr);
    if (k === 'c') { gr.addColorStop(0, rgba(dark, 0)); gr.addColorStop(1, rgba(dark, .7)); }
    else { gr.addColorStop(0, `rgb(${255 * strength},${255 * strength},${255 * strength})`); gr.addColorStop(1, 'rgb(40,40,40)'); }
    g.fillStyle = gr; g.fillRect(0, 0, p.w, Hr);
    out[k] = c;
  }
  return { ...out, w: p.w, h: Hr };
}

// 肢体：两端圆头的锥形胶囊
export function limb(a, b, w1, w2) {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, px = -uy, py = ux;
  const r1 = w1 / 2, r2 = w2 / 2;
  const cap = (c, r, s) => { const out = []; for (let k = 0; k <= 4; k++) { const an = -Math.PI / 2 + k * Math.PI / 4; const ca = Math.cos(an), sa = Math.sin(an); out.push([c[0] + (ux * ca * s + px * sa * s) * r, c[1] + (uy * ca * s + py * sa * s) * r]); } return out; };
  return cap(b, r2, 1).concat(cap(a, r1, -1));
}

// —— 文字 ——
export const F = { zh: '"HuangYou","Noto SC"', sub: '"Noto SC"', lat: '"Barlow SC"', it: 'Kanit' };
export function text(g, s, x, y, o = {}) {
  g.save(); g.font = o.font || `${o.wt || 700} ${o.size || 40}px ${o.fam || F.zh}`; g.textAlign = o.align || 'center'; g.textBaseline = o.base || 'middle'; g.lineJoin = 'round';
  if (o.rot) { g.translate(x, y); g.rotate(o.rot); x = 0; y = 0; }
  if (o.ls) g.letterSpacing = o.ls + 'px';
  if (o.stroke) { g.strokeStyle = o.stroke; g.lineWidth = o.sw || 6; g.strokeText(s, x, y); }
  g.fillStyle = o.col || '#fff'; g.fillText(s, x, y); g.restore();
}
// 霓虹字：画面上白芯 + 色边，发光层上同形色光
export function neon(g, e, s, x, y, size, col, o = {}) {
  const chars = o.vertical ? [...s] : [s];
  for (const [ctx, pass] of [[g, 0], [e, 1]]) {
    if (!ctx) continue;
    ctx.save(); ctx.font = `${o.wt || 400} ${size}px ${o.fam || F.zh}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    chars.forEach((ch, i) => {
      const yy = o.vertical ? y + (i - (chars.length - 1) / 2) * size * 1.08 : y;
      if (pass === 0) { ctx.fillStyle = rgba(col, o.on ?? 1); ctx.fillText(ch, x, yy); ctx.fillStyle = rgba(mix(col, '#ffffff', .75), o.on ?? 1); ctx.save(); ctx.globalAlpha = .9; ctx.strokeStyle = rgba(col, .9 * (o.on ?? 1)); ctx.lineWidth = size * .09; ctx.strokeText(ch, x, yy); ctx.restore(); ctx.fillText(ch, x, yy); }
      else { ctx.globalAlpha = o.on ?? 1; ctx.strokeStyle = col; ctx.lineWidth = size * .14; ctx.strokeText(ch, x, yy); ctx.fillStyle = mix(col, '#ffffff', .4); ctx.fillText(ch, x, yy); }
    });
    ctx.restore();
  }
}
export function neonRect(g, e, x, y, w, h, col, r = 10, on = 1) {
  for (const [ctx, pass] of [[g, 0], [e, 1]]) {
    if (!ctx) continue;
    ctx.save(); ctx.globalAlpha = on; ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
    ctx.strokeStyle = pass ? col : rgba(col, .85); ctx.lineWidth = pass ? 8 : 6; ctx.stroke();
    ctx.strokeStyle = mix(col, '#ffffff', pass ? .4 : .75); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  }
}

// 冲击帧：两帧的单色反相剪影 + 放射线（k = 0 / 1 第几帧）
export function impact(S, k, cx, cy, colA = '#ffffff', colB = '#0a0618', drawSil) {
  const { g, e } = S;
  for (const c of [g, e]) c.setTransform(1, 0, 0, 1, 0, 0);
  const bg = k ? colB : colA, fg = k ? colA : colB;
  g.fillStyle = bg; g.fillRect(0, 0, W, H); e.fillStyle = k ? '#000' : rgba(colA, .1); e.fillRect(0, 0, W, H);
  const R = rng(900 + k * 17);
  g.fillStyle = fg;
  for (let i = 0; i < 70; i++) { const a = R() * TAU, w = .006 + R() * .02, r0 = 220 + R() * 240; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a - w) * 2600, cy + Math.sin(a - w) * 2600); g.lineTo(cx + Math.cos(a + w) * 2600, cy + Math.sin(a + w) * 2600); g.fill(); }
  if (drawSil) drawSil(g, fg, bg);
}
// 白闪：a = 0..1
export function flash(S, a, col = '#ffffff') {
  if (a <= 0) return;
  const { g, e } = S;
  for (const c of [g, e]) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = Math.min(1, a) * (c === e ? .1 : .9); c.fillStyle = col; c.fillRect(0, 0, W, H); c.restore(); }
}
// 屏幕抖动量（确定性）
export const shake = (t, t0, amp = 10, dur = .35) => { const k = 1 - seg(t, t0, t0 + dur); if (t < t0 || k <= 0) return [0, 0]; const f = Math.floor((t - t0) * 24); return [(hash(f * 3.1 + 1) - .5) * 2 * amp * k, (hash(f * 5.7 + 2) - .5) * 2 * amp * k]; };

// 圆角矩形贴纸 / 标签
export function tag(g, x, y, w, h, o = {}) {
  const P = new Path2D(); P.roundRect(x - w / 2, y - h / 2, w, h, o.r ?? 8);
  cel(g, P, { f: o.f || '#fff', s: o.s, so: o.s ? [0, -h * .18] : null, l: o.l || '#222', lw: o.lw || 2.5 });
  if (o.text) text(g, o.text, x, y + (o.dy || 2), { size: o.size || h * .6, col: o.col || '#222', fam: o.fam, wt: o.wt, ls: o.ls });
}
export { W, H, TAU, rgba, mix, path, poly, cel, line, hash, rng, vgrad, airbrush, canvas };
