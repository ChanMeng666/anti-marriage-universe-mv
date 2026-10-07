// 四足动物（侧面朝右，原点 = 身体正下方的地面）：驴 / 马 / 牛，同一套骨架；以及牛头马面的通勤剪影
import { cel, path, poly, ribbon, flutter, line, TAU, rgba, mix } from './cel.js';
import { limb } from './stage.js';

const KIND = {
  donkey: { neck: [205, -318], headA: .75, headL: 118, ear: 78, mane: 0, legU: 84, legL: 92, belly: 64, tailL: 110 },
  horse: { neck: [200, -372], headA: .95, headL: 122, ear: 30, mane: 1, legU: 100, legL: 112, belly: 62, tailL: 190 },
  ox: { neck: [196, -262], headA: .5, headL: 104, ear: 26, mane: 0, legU: 76, legL: 80, belly: 84, tailL: 120, horns: 1 },
};
// o = { kind, ph (0..1 步态相位), gait: 'walk'|'gallop'|'stand', tie, yoke (0..1 套上的程度), blind, wind }
export function quad(g, C, o = {}) {
  const K = KIND[o.kind || 'horse'], ph = (o.ph || 0) * TAU, gait = o.gait || 'walk';
  const st = { f: C.f, s: C.s, h: C.h, l: C.l, lw: 2.4, rim: o.rim };
  const gal = gait === 'gallop', stand = gait === 'stand';
  const bob = stand ? 0 : gal ? Math.sin(ph) * 12 : Math.sin(ph * 2) * 4, pitch = gal ? Math.sin(ph + .6) * .07 : 0;
  const legAng = (base, off) => {
    if (stand) return [0, 0];
    const a = ph + off, sw = gal ? 1.0 : .42;
    return [base + Math.sin(a) * sw, Math.max(0, Math.sin(a - 1.9)) * (gal ? 1.5 : .8)];
  };
  const drawLeg = (hx, hy, off, far, hind) => {
    const [ua, kn] = legAng(hind ? -.08 : .06, off);
    const c = far ? { ...st, f: C.s, s: mix(C.s, '#000000', .25) } : st;
    const k = [hx + Math.sin(ua) * K.legU, hy + Math.cos(ua) * K.legU];
    const la = ua + (hind ? kn : -kn), f = [k[0] + Math.sin(la) * K.legL, k[1] + Math.cos(la) * K.legL];
    cel(g, limb([hx, hy], k, hind ? 58 : 46, 30), { ...c, so: [-6, 0] }); cel(g, limb(k, f, 28, 20), { ...c, so: [-5, 0] });
    cel(g, limb(f, [f[0] + Math.sin(la) * 16, f[1] + Math.cos(la) * 16], 26, 30), { f: o.hoof || '#2a2430', l: C.l, lw: 2 });
  };
  g.save(); g.translate(0, bob); g.rotate(pitch);
  const top = -(K.legU + K.legL + 16);
  // 尾巴
  const tw = o.wind ?? (gal ? 1 : 0);
  cel(g, ribbon(flutter(-160, top - 40, Math.PI * (.62 - tw * .34), K.tailL, 10, 10 + tw * 14, 1.1, ph * (gal ? 1 : 2), 30 * (1 - tw)), u => (o.kind === 'horse' ? 34 : 14) * (1 - u * .6) + (u > .7 && o.kind !== 'horse' ? 16 : 0)), { ...st, f: o.maneCol || C.s, so: [0, -5] });
  drawLeg(-108, top + 60, Math.PI + (gal ? .5 : 0), true, true); drawLeg(96, top + 54, gal ? 2.6 : 0, true, false);
  // 躯干
  const body = [[-168, top + 10], [-150, top - 46], [-60, top - 60], [60, top - 54], [140, top - 66], [170, top - 20], [150, top + 44], [80, top + K.belly + 10], [-40, top + K.belly + 16], [-130, top + K.belly - 6]];
  cel(g, body, { ...st, so: [-10, -22], ho: [4, 8] });
  // 脖子 + 头
  const nb = [128, top - 30], [hx, hy] = K.neck, nod = stand ? 0 : Math.sin(ph * (gal ? 1 : 2) + 1) * (gal ? .08 : .05);
  cel(g, limb(nb, [hx, hy], 104, 62), { ...st, so: [-12, -6] });
  if (K.mane) { cel(g, ribbon(flutter(hx - 16, hy - 26, Math.PI * (1.0 - .16 * tw) , 150, 9, 12 + 10 * tw, 1.3, ph, 50 * (1 - tw)), u => 46 * (1 - u * .5)), { f: o.maneCol || C.s, s: mix(o.maneCol || C.s, '#000000', .3), so: [0, -6], l: C.l, lw: 2 }); }
  g.save(); g.translate(hx, hy); g.rotate(K.headA + nod);
  // 耳朵
  for (const s of [0, 1]) cel(g, [[-14 + s * 10, -20], [-22 + s * 16, -20 - K.ear], [-2 + s * 12, -24 - K.ear * .5], [4 + s * 10, -18]], { ...st, f: s ? C.f : C.s, so: [-4, 0] });
  if (K.horns) { for (const s of [0, 1]) cel(g, [[-6 + s * 10, -22, 1], [-40 + s * 30, -50], [-36 + s * 34, -84, 1], [-20 + s * 26, -52], [8 + s * 8, -20, 1]], { f: '#f0e6cc', s: '#b8a680', so: [-4, 0], l: C.l, lw: 2 }); }
  const hd = [[-30, -30], [20, -34], [K.headL * .6, -22], [K.headL, -20], [K.headL + 12, 6], [K.headL - 6, 26], [K.headL * .5, 22], [10, 34], [-26, 20]];
  cel(g, hd, { ...st, so: [-8, -10], ho: [3, 5] });
  // 口鼻（浅色）
  g.save(); g.clip(path(hd)); g.fillStyle = o.muzzle || mix(C.f, '#ffffff', .55); g.fillRect(K.headL - 34, -40, 80, 90); g.restore();
  line(g, path(hd), C.l, 2.4);
  g.fillStyle = C.l; g.beginPath(); g.ellipse(K.headL - 2, -4, 4, 6, 0, 0, TAU); g.fill();
  line(g, [[K.headL - 4, 18], [K.headL - 30, 16]], C.l, 2);
  if (o.blind) { cel(g, poly([[16, -30], [56, -26], [54, 8], [14, 6]]), { f: '#2a2434', s: '#16121e', so: [-4, -4], l: '#0a0810', lw: 2 }); line(g, [[-30, -12], [16, -12]], '#2a2434', 5); }
  else { g.fillStyle = '#1a1420'; g.beginPath(); g.ellipse(30, -10, 7, 9, 0, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(32, -13, 2.5, 0, TAU); g.fill(); if (o.lid) { g.fillStyle = C.s; g.fillRect(20, -22, 22, 9); } }
  g.restore();
  if (o.tie) {   // 领带（驴 = 上班的阿发）
    const a = [150, top - 2], sw = stand ? 0 : Math.sin(ph * 2) * 8;
    cel(g, limb(a, [a[0] - 6 + sw, a[1] + 96], 14, 30), { f: o.tie.f, s: o.tie.s, so: [-4, 0], l: o.tie.l, lw: 2 });
    cel(g, poly([[a[0] - 14, a[1] - 12], [a[0] + 14, a[1] - 12], [a[0] + 10, a[1] + 12], [a[0] - 10, a[1] + 12]]), { f: o.tie.f, s: o.tie.s, so: [0, -5], l: o.tie.l, lw: 2 });
  }
  drawLeg(-124, top + 64, gal ? .3 : 0, false, true); drawLeg(110, top + 58, Math.PI + (gal ? 2.9 : 0), false, false);
  if (o.yoke != null) {   // 套（轭）：从上方落到脖子根
    const y = (1 - Math.min(1, o.yoke)) * -520;
    g.save(); g.translate(132, top - 20 + y); g.rotate(.32 + (1 - Math.min(1, o.yoke)) * .4);
    const yk = new Path2D(); yk.ellipse(0, 0, 44, 86, 0, 0, TAU); yk.ellipse(0, 0, 24, 62, 0, 0, TAU);
    g.fillStyle = '#b07a4e'; g.fill(yk, 'evenodd'); g.save(); g.clip(yk, 'evenodd'); g.fillStyle = '#7a4e34'; g.fillRect(-50, -90, 40, 180); g.fillStyle = '#dcae7e'; g.fillRect(28, -90, 8, 180); g.restore();
    g.strokeStyle = '#3e2414'; g.lineWidth = 2.6; g.beginPath(); g.ellipse(0, 0, 44, 86, 0, 0, TAU); g.stroke(); g.beginPath(); g.ellipse(0, 0, 24, 62, 0, 0, TAU); g.stroke();
    g.restore();
  }
  g.restore();
}

// 牛头 / 马面通勤族的剪影胸像（原点 = 肩线中心，朝左或朝右由外面翻转）
export function beastBust(g, kind, col, rim) {
  const P = new Path2D();
  P.addPath(path([[-90, 160], [-84, 40], [-40, 6], [40, 6], [84, 40], [90, 160]]));
  if (kind === 'horse') { P.addPath(path([[-26, 20], [-30, -50], [-14, -92], [-22, -128, 1], [0, -100], [14, -130, 1], [20, -92], [60, -60], [96, -24], [100, 0], [70, 6], [30, -14], [26, 20]])); }
  else { P.addPath(path([[-30, 20], [-40, -40], [-34, -76], [-70, -100], [-76, -134, 1], [-46, -104], [-10, -92], [22, -98], [50, -128, 1], [50, -92], [44, -66], [72, -40], [80, -8], [52, 6], [30, -6], [28, 20]])); }
  g.fillStyle = col; g.fill(P);
  if (rim) { g.save(); g.clip(P); g.fillStyle = rim; const Q = new Path2D(); Q.addPath(P); Q.addPath(P, new DOMMatrix().translate(-4, 5)); g.fill(Q, 'evenodd'); g.restore(); }
}
