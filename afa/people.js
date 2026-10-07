// 人物：阿发（30+ / 70+）、媒婆、阿花的背影、亲戚剪影、全身小人
// 头部局部坐标：颅骨球心 (0,0)，半径 80；眼 +20，鼻底 +56，嘴 +80，下巴 +122。脸朝画面右侧（朝左时外面 scale(-1,1)）。
// 描线：皮肤 = 细的暖深棕，头发 = 深蓝紫，硬道具近黑
import { cel, path, poly, ribbon, flutter, line, TAU, rgba, mix, LWK } from './cel.js';
import { limb } from './stage.js';

const LW = 1.5, LS = LW * .8, LH = LW * 1.05, LP = LW * 1.3;

// brow: [内端 dy, 外端 dy, 眉弓]（正 = 向下）
export const EXPR = {
  neutral: { open: .9, lid: .12, brow: [0, 0, 1.5], mouth: 'flat' },
  bored: { open: .78, lid: .5, brow: [1, 2, .5], mouth: 'down', look: [-.5, .1] },
  cold: { open: .82, lid: .42, brow: [4, -1, .5], mouth: 'flat', look: [.25, 0] },
  inward: { open: .8, lid: .55, brow: [2, 1, .5], mouth: 'flat', look: [0, .5] },
  resolve: { open: 1.05, lid: .08, brow: [7, -4, .5], mouth: 'set', look: [.3, 0], iris: 1.05 },
  smirk: { open: .82, lid: .3, brow: [-2, -3, 2], mouth: 'smirk', look: [.2, 0] },
  smile: { open: .7, lid: .15, brow: [-3, -2, 3], mouth: 'smile', smile: true },
  sing: { open: .8, lid: .15, brow: [-4, -3, 3], mouth: 'talk', smile: true },
  laugh: { laugh: true, brow: [-6, -3, 4], mouth: 'grin' },
  wide: { open: 1.15, lid: -.2, brow: [-8, -6, 4], mouth: 'o', iris: .8 },
  closed: { open: 0, brow: [0, 0, 1.5], mouth: 'flat' },
  pitch: { open: .9, lid: .2, brow: [-7, -2, 5], mouth: 'grin', smile: true },
  pitchtalk: { open: .95, lid: .2, brow: [-8, -3, 5], mouth: 'talk', smile: true },
};

function eye(g, P, cx, cy, w, h, dir, fs, E, fem) {
  const open = Math.max(0, E.open ?? 1), lid = E.lid || 0, W2 = w / 2, lash = P.lash;
  const X = u => cx + dir * u * W2;
  const inY = cy + h * .12, outY = cy - h * .1 - (E.smile ? h * .06 : 0);
  const t = h * (fem ? .19 : .24);
  if (E.laugh) {   // 笑到眯起来的弯眼 ^
    cel(g, [[X(-1), cy + h * .34, 1], [X(-.35), cy - h * .1], [X(.35), cy - h * .14], [X(1.12), cy + h * .28, 1], [X(.4), cy + h * .1], [X(-.3), cy + h * .13]], { f: lash });
    return;
  }
  const topY = cy - h * .5 * open + lid * h * .34;
  const botY = cy + h * .45 * Math.min(1, open + .25) - (E.smile ? h * .28 : 0);
  if (open > .08) {
    const WP = path([[X(-1), inY, 1], [X(-.4), topY + h * .05], [X(.3), topY], [X(1), outY, 1], [X(.45), botY], [X(-.4), botY - h * .02]], true);
    g.save(); g.clip(WP);
    g.fillStyle = P.white_eye; g.fill(WP);
    g.fillStyle = mix(P.white_eye, P.skin.s, .55); g.fillRect(cx - w, topY - 6, w * 2, h * .24 + 6);
    const sc = E.iris || 1, iw = w * (fem ? .25 : .215) * sc * (fs < 1 ? .92 : 1), ih = h * (fem ? .46 : .6) * sc;
    const ix = cx + dir * W2 * .04 + (E.look?.[0] || 0) * w * .17, iy = cy + h * .06 + (E.look?.[1] || 0) * h * .16;
    const IR = new Path2D(); IR.ellipse(ix, iy, iw, ih, 0, 0, TAU);
    const EY = fem ? P.eyeM : P.eye;
    g.fillStyle = EY.f; g.fill(IR);
    g.save(); g.clip(IR);
    g.fillStyle = EY.s; g.fillRect(ix - iw, iy - ih, iw * 2, ih * .95);
    g.fillStyle = mix(EY.s, lash, .5); g.fillRect(ix - iw, iy - ih, iw * 2, ih * .4);
    g.fillStyle = mix(EY.l, lash, .3); g.beginPath(); g.ellipse(ix, iy - ih * .02, iw * .46, ih * .5, 0, 0, TAU); g.fill();
    g.fillStyle = EY.h; g.beginPath(); g.ellipse(ix, iy + ih * .9, iw * 1.05, ih * .5, 0, 0, TAU); g.fill();
    if (E.reflect) { g.fillStyle = rgba(E.reflect, .8); g.fillRect(ix - iw, iy + ih * .15, iw * 2, ih * .22); }
    g.restore();
    g.strokeStyle = mix(EY.l, lash, .5); g.lineWidth = LW * .75 * LWK.k; g.stroke(IR);
    g.fillStyle = '#ffffff';
    g.beginPath(); g.ellipse(ix - dir * iw * .34, iy - ih * .3, iw * .4, ih * .22, -.5 * dir, 0, TAU); g.fill();
    g.beginPath(); g.arc(ix + dir * iw * .42, iy + ih * .3, iw * .18, 0, TAU); g.fill();
    g.restore();
    line(g, [[X(.95), outY + h * .14], [X(.5), botY + 1], [X(.05), botY + 1.5]], mix(P.skin.l, P.skin.f, .35), LS * .8);
    // 粗上睫毛线
    cel(g, [[X(-1.03), inY + 1, 1], [X(-.4), topY + h * .05 - t * .6], [X(.3), topY - t * .75], [X(.95), outY - t], [X(fem ? 1.25 : 1.12), outY - t * (fem ? 2.1 : 1.2), 1],
      [X(1.03), outY + t * .5], [X(.3), topY + t * .45], [X(-.4), topY + h * .05 + t * .35], [X(-.98), inY + t * .6, 1]], { f: lash });
    if (fem) for (let k = 0; k < 3; k++) { const u = .55 + k * .2, bx = X(u), by = topY + (outY - topY) * ((u - .3) / .7) - t * .5; cel(g, [[bx - dir * 2, by, 1], [bx + dir * (4 + k * 3), by - h * (.16 + k * .05), 1], [bx + dir * 3, by + 1, 1]], { f: lash }); }
    line(g, [[X(-.25), topY - h * .26], [X(.45), topY - h * .3], [X(1), outY - h * .34]], mix(P.skin.l, P.skin.f, .3), LS * .85);
  } else cel(g, [[X(-1), inY, 1], [X(0), cy + h * .26], [X(1.05), outY + h * .06], [X(1.18), outY - t * .6, 1], [X(1), outY + t * .9], [X(0), cy + h * .26 + t * .8], [X(-.98), inY + t * .5, 1]], { f: lash });
}
function eyeSide(g, P, cx, cy, w, h, E) {
  const open = Math.max(0, E.open ?? 1), lid = E.lid || 0, lash = P.lash;
  if (E.laugh) { cel(g, [[cx - w * .6, cy + h * .3, 1], [cx - w * .1, cy - h * .12], [cx + w * .5, cy + h * .16, 1], [cx - w * .1, cy + h * .1]], { f: lash }); return; }
  const topY = cy - h * .5 * open + lid * h * .32, front = cx + w * .5, bk = cx - w * .5;
  const botY = cy + h * .46 - (E.smile ? h * .26 : 0);
  if (open > .08) {
    const WP = path([[bk, cy - h * .12, 1], [cx - w * .1, topY], [front, cy + h * .06, 1], [cx, botY]], true);
    g.save(); g.clip(WP); g.fillStyle = P.white_eye; g.fill(WP);
    const ix = cx + w * .2, iy = cy + h * .1, iw = w * .24, ih = h * .56;
    g.fillStyle = P.eye.f; g.beginPath(); g.ellipse(ix, iy, iw, ih, 0, 0, TAU); g.fill();
    g.fillStyle = P.eye.s; g.fillRect(ix - iw, iy - ih, iw * 2, ih * .95);
    g.fillStyle = P.eye.h; g.beginPath(); g.ellipse(ix, iy + ih * .9, iw, ih * .5, 0, 0, TAU); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(ix - iw * .15, iy - ih * .3, iw * .45, ih * .22, 0, 0, TAU); g.fill();
    g.restore();
    const t = h * .2;
    cel(g, [[bk - w * .3, cy - h * .26 - t, 1], [cx - w * .1, topY - t * .6], [front + w * .04, cy + h * .02, 1], [cx - w * .1, topY + t * .5], [bk, cy - h * .06, 1]], { f: lash });
    line(g, [[cx - w * .15, botY], [front - w * .1, cy + h * .26]], mix(P.skin.l, P.skin.f, .3), LS * .8);
  } else cel(g, [[bk - w * .3, cy - h * .12, 1], [cx, cy + h * .2], [front, cy + h * .08, 1], [cx, cy + h * .3], [bk, cy + h * .02, 1]], { f: lash });
}
function brow(g, col, ix, iy, ox, oy, B, th = 3) {
  const a = [ix, iy + B[0]], c = [ox, oy + B[1]], m = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2 - B[2]];
  cel(g, [[a[0], a[1] - th * .55, 1], [m[0], m[1] - th * .6], [c[0], c[1] - .2, 1], [m[0], m[1] + th * .45], [a[0], a[1] + th * .55, 1]], { f: col });
}
function mouth(g, P, cx, cy, w, type, fs = 1, lipCol = null) {
  const L = cx - w / 2, R = cx + w / 2 * fs, lc = P.skin.l;
  const lower = (y, ww) => line(g, [[cx - ww * .6, y], [cx + ww * .5, y]], mix(lc, P.skin.f, .5), LS * .75);
  const lw = LS * (lipCol ? 1.9 : 1.1), col = lipCol || lc;
  if (type === 'flat' || type === 'set' || type === 'down') {
    const dn = type === 'set' ? 1.6 : type === 'down' ? 3 : 0;
    line(g, [[L, cy + dn], [cx - w * .12, cy - .6], [cx + w * .06, cy + .2], [R, cy + dn]], col, lw); lower(cy + 6, w * .2);
  } else if (type === 'smile') { line(g, [[L - 1, cy - 3], [cx - w * .15, cy + 1.8], [cx + w * .1, cy + 1.8], [R + 1, cy - 3]], col, lw); lower(cy + 7, w * .16); }
  else if (type === 'smirk') { line(g, [[L, cy + 1], [cx - w * .1, cy + 1.2], [cx + w * .2, cy], [R + 2, cy - 5]], col, lw); line(g, [[R + 1, cy - 8], [R + 4, cy - 3]], mix(lc, P.skin.f, .4), LS * .8); lower(cy + 7, w * .16); }
  else {
    let pts, teeth = 0, tongue = 0, bot;
    if (type === 'grin') { pts = [[L - 3, cy - 4, 1], [cx, cy - 2], [R + 3, cy - 4, 1], [cx + w * .3, cy + 9], [cx, cy + 14], [cx - w * .32, cy + 9]]; teeth = 1; tongue = 1; bot = cy + 14; }
    else if (type === 'o') { pts = [[cx - w * .24, cy + 3], [cx, cy - 4], [cx + w * .22, cy + 3], [cx + w * .16, cy + 13], [cx - w * .16, cy + 13]]; bot = cy + 13; }
    else if (type === 'wide') { pts = [[L + 1, cy - 1, 1], [cx, cy - 4], [R - 1, cy - 1, 1], [cx + w * .22, cy + 15], [cx, cy + 18], [cx - w * .24, cy + 15]]; teeth = 1; tongue = 1; bot = cy + 18; }
    else { pts = [[L + 3, cy, 1], [cx, cy - 1], [R - 3, cy, 1], [cx + w * .1, cy + 8], [cx - w * .12, cy + 8]]; tongue = .8; bot = cy + 8; }
    const MP = path(pts, true);
    g.save(); g.clip(MP); g.fillStyle = '#5a1a2a'; g.fill(MP);
    if (tongue) { g.fillStyle = '#e0707a'; g.beginPath(); g.ellipse(cx, bot + 1, w * .28, 6, 0, 0, TAU); g.fill(); }
    if (teeth) { g.fillStyle = '#ffffff'; g.fillRect(cx - w, cy - 9, w * 2, 11.5); }
    g.restore();
    g.strokeStyle = col; g.lineWidth = lw * LWK.k; g.lineJoin = 'round'; g.stroke(MP);
    lower(bot + 5, w * .14);
  }
}
function lock(x0, y0, x1, y1, tx, ty, bend = 0) {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = tx - mx, dy = ty - my, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  return [[x0, y0], [x0 + dx * .55 + nx * bend, y0 + dy * .55 + ny * bend], [tx, ty, 1], [x1 + dx * .5 + nx * bend * .7, y1 + dy * .5 + ny * bend * .7], [x1, y1]];
}
function halo(g, col, cx, cy, rx, ry, a0, a1, th, teeth) {
  const up = [], dn = [];
  for (let i = 0; i <= teeth * 2; i++) {
    const u = i / (teeth * 2), a = a0 + (a1 - a0) * u, env = Math.sin(u * Math.PI) * .7 + .3;
    up.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    const depth = th * env * (i % 2 ? 1.9 : .55);
    dn.push([cx + Math.cos(a) * (rx - depth * .15), cy + Math.sin(a) * ry + depth]);
  }
  g.fillStyle = col; g.beginPath(); up.forEach((p, i) => g[i ? 'lineTo' : 'moveTo'](p[0], p[1])); for (let i = dn.length - 1; i >= 0; i--) g.lineTo(dn[i][0], dn[i][1]); g.closePath(); g.fill();
}

const Q = {   // 3/4
  face: [[-64, -44], [-67, -4], [-66, 32], [-62, 62], [-53, 88], [-33, 109], [2, 122], [26, 116], [40, 102], [47, 84], [49, 66], [54, 48], [57, 30], [51, 16], [54, 0], [54, -40], [18, -64], [-36, -64]],
  faceF: [[-64, -44], [-68, -4], [-68, 30], [-63, 58], [-50, 84], [-28, 103], [2, 112], [24, 106], [38, 92], [46, 76], [48, 62], [53, 46], [55, 30], [50, 16], [53, 0], [54, -40], [18, -64], [-36, -64]],
  neck: [[-40, 64], [14, 94], [22, 160], [-50, 160]],
  chinShadow: [[-50, 62], [22, 62], [22, 100], [2, 123], [-33, 109], [-53, 88]],
  farShade: [[90, 30], [90, 130], [16, 120], [34, 106], [42, 90], [46, 72], [49, 56], [53, 44], [57, 30]],
  ear: [[-60, 6], [-78, -2], [-88, 18], [-82, 46], [-66, 58], [-58, 40]],
};
const SIDE = {
  face: [[60, -50], [72, -24], [76, -4], [72, 12], [77, 28], [89, 49, 1], [80, 55], [80, 61], [83, 66], [78, 71], [81, 77], [75, 87], [80, 105, 1], [64, 119], [30, 113], [2, 95], [-8, 60], [-10, 20], [18, -52]],
  neck: [[-14, 60], [18, 104], [16, 150], [-44, 150]],
  chinShadow: [[-20, 60], [50, 60], [64, 119], [30, 113], [2, 95]],
  farShade: [[-40, -60], [8, -60], [2, 0], [-4, 40], [0, 70], [-40, 90]],
  ear: [[4, 6], [-12, 0], [-20, 20], [-14, 46], [0, 54], [6, 36]],
};
const HAIR = {
  afa: {
    q: { back: [[-76, -40], [-88, 0], [-84, 34], [-70, 48], [-56, 36], [-44, -40]],
      cap: [[-80, 0], [-92, -44], [-74, -90], [-26, -110], [26, -106], [60, -84], [68, -50], [62, -24], [44, -48], [0, -62], [-48, -48], [-60, -16], [-64, 8], [-72, 14]],
      locks: [[-92, -50, -66, -80, -80, -2, -6], [-70, -84, -34, -98, -58, -14, -5], [-40, -96, 0, -102, -30, -34, -4], [-6, -102, 30, -98, 2, -18, -6], [22, -98, 50, -86, 40, -40, 3], [40, -88, 68, -64, 60, -16, 6]],
      strays: [[10, -100, 22, -30, 4]], halo: [-12, -14, 72, 58, Math.PI * 1.12, Math.PI * 1.85, 8, 8] },
    side: { back: [[-20, -60], [-62, -40], [-66, 10], [-52, 44], [-30, 52], [-16, 30], [0, -40]],
      cap: [[-60, 30], [-76, -30], [-60, -80], [-18, -104], [32, -100], [64, -80], [74, -54], [66, -40], [40, -54], [8, -46], [-4, -12], [-8, 18], [-30, 40]],
      locks: [[10, -100, 40, -92, 62, -30, 5], [30, -94, 58, -80, 78, -26, 6], [46, -84, 74, -62, 84, -30, 7]],
      strays: [[38, -90, 70, -18, 6]], halo: [0, -14, 66, 58, Math.PI * 1.1, Math.PI * 1.82, 8, 8] },
  },
  old: {
    q: { back: [[-76, -40], [-94, 6], [-92, 50], [-74, 68], [-56, 50], [-44, -40]],
      cap: [[-84, 10], [-94, -30], [-82, -72], [-52, -96], [-22, -100], [-30, -84], [-48, -64], [-58, -30], [-60, 10], [-72, 22]],
      locks: [[-92, -20, -80, -56, -98, 34, -6]],
      strays: [], halo: [-24, -24, 62, 50, Math.PI * 1.15, Math.PI * 1.7, 7, 6] },
    side: { back: [[-20, -60], [-64, -40], [-70, 14], [-56, 52], [-32, 58], [-16, 30], [0, -40]],
      cap: [[-60, 34], [-78, -30], [-62, -80], [-22, -102], [20, -98], [44, -86], [34, -74], [6, -66], [-8, -30], [-10, 18], [-32, 44]],
      locks: [[-70, -30, -52, -64, -80, 26, -8]], strays: [], halo: [-14, -22, 56, 50, Math.PI * 1.15, Math.PI * 1.7, 7, 6] },
  },
};

// 头：o = { who: 'afa'|'old'|'mei', view: 'q'|'side', expr, E, body: 'suit'|'jacket'|'tee'|'old'|'mei'|null, tie: 0..1(松开), rim, light }
export function head(g, P, o = {}) {
  const who = o.who || 'afa', view = o.view || 'q', V = view === 'q' ? Q : SIDE;
  const E = { ...EXPR[o.expr || 'neutral'], ...(o.E || {}) };
  if (o.mouth) E.mouth = o.mouth; if (o.open != null) { E.open = o.open; if (o.open > .2) E.laugh = false; } if (o.look) E.look = o.look; if (o.lid != null) E.lid = o.lid;
  const old = who === 'old', fem = who === 'mei';
  const SK = old ? P.skinOld : fem ? P.skinF : P.skin, HR = old ? P.hairOld : fem ? P.hairM : P.hair;
  const PP = { ...P, skin: SK };
  const lx = o.light?.[0] ?? -1, ly = o.light?.[1] ?? -.8, SO = k => [lx * k, ly * k];
  const rim = o.rim, hairSt = { f: HR.f, s: HR.s, h: HR.h, l: HR.l, lw: LH, rim };
  const Hh = fem ? null : HAIR[old ? 'old' : 'afa'][view];
  const skinRim = o.skinRim ? { c: o.skinRim, d: [-lx * 2.5, -ly * 2] } : null;
  if (o.hair !== false) {
    if (fem) { // 媒婆：烫过的大卷发 + 头顶发髻
      cel(g, [[-80, -30], [-104, 10], [-100, 60], [-78, 84], [-50, 70], [-40, -40]], { ...hairSt, f: HR.s, so: SO(8) });
      const bun = new Path2D(); bun.ellipse(-22, -128, 46, 36, -.2, 0, TAU); cel(g, bun, { ...hairSt, so: SO(9) });
    } else cel(g, Hh.back, { ...hairSt, f: HR.s, so: SO(8), s: mix(HR.s, '#000000', .25) });
  }
  if (o.body) body(g, P, o.body, view, E, o);
  if (o.neck !== false) cel(g, poly(V.neck.map(([x, y]) => [x, Math.min(y, o.neckEnd ?? 999)])), { f: SK.f, s: SK.s, l: SK.l, lw: LS, sh: [V.chinShadow] });
  if (o.body) collar(g, P, o.body, view, E, o);
  // 耳朵（在脸的后面露出外缘）
  cel(g, V.ear, { f: SK.f, s: SK.s, so: SO(4), l: SK.l, lw: LS });
  line(g, view === 'q' ? [[-72, 12], [-78, 26], [-70, 42]] : [[-6, 12], [-12, 26], [-4, 40]], mix(SK.l, SK.f, .3), LS * .8);
  if (fem) { const er = new Path2D(); er.ellipse(-72, 70, 8, 13, 0, 0, TAU); cel(g, er, { f: P.jade.f, s: P.jade.s, so: [-3, -3], h: P.jade.h, ho: [2, 2], l: P.jade.l, lw: LW }); }
  // 颅顶（老年发际线后退时露出来）
  if (view === 'q') { const sk = new Path2D(); sk.ellipse(-8, -14, 66, 70, 0, 0, TAU); g.fillStyle = SK.f; g.fill(sk); if (old) { g.strokeStyle = SK.l; g.lineWidth = LS * LWK.k; g.beginPath(); g.ellipse(-8, -14, 66, 70, 0, -1.9, -.2); g.stroke(); } }
  else { const sk = new Path2D(); sk.ellipse(4, -14, 70, 72, 0, 0, TAU); g.fillStyle = SK.f; g.fill(sk); if (old) { g.strokeStyle = SK.l; g.lineWidth = LS * LWK.k; g.beginPath(); g.ellipse(4, -14, 70, 72, 0, -1.7, -.35); g.stroke(); } }
  const facePts = fem ? Q.faceF : V.face;
  cel(g, facePts, { f: SK.f, s: SK.s, l: SK.l, lw: LS, h: SK.h, sh: o.light ? [] : [V.farShade], so: o.light ? SO(12) : null, rim: skinRim,
    clipFn: gg => {
      if (!Hh || old) return;
      gg.fillStyle = mix(SK.f, SK.s, .7);
      for (const L of Hh.locks) { const [x0, y0, x1, y1, tx, ty, b] = L; gg.fill(path(lock(x0 - 4, y0 + 8, x1 + 6, y1 + 8, tx + 3, ty + 8, b))); }
      gg.fillRect(-120, -120, 240, 78);
    } });
  if (fem) { for (const [x, y, rx, ry] of [[-30, 50, 15, 6], [44, 48, 7, 4]]) { g.fillStyle = rgba(P.blush, .55); g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill(); } }
  else if (o.blush) { for (const [x, y, rx, ry] of view === 'q' ? [[-30, 52, 14, 4.5], [46, 50, 6, 3.5]] : [[58, 52, 9, 3.5]]) { g.fillStyle = rgba(P.blush, o.blush); g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill(); } }
  // 五官
  if (view === 'q') {
    if (fem) { g.fillStyle = SK.s; g.fill(path([[42, 42], [45, 51], [39, 55], [39, 49]])); line(g, [[38, 55.5], [44, 53]], SK.l, LS); }
    else { g.fillStyle = SK.s; g.fill(poly([[45, 40], [51, 52], [41, 58], [41, 50]])); line(g, [[37, 58], [45, 57], [52, 52], [48, 38]], SK.l, LS); }
    if (old) {   // 皱纹：抬头纹、鱼尾纹、法令纹、眼袋
      const wc = mix(SK.l, SK.f, .25);
      line(g, [[-40, -38], [-6, -42], [34, -38]], wc, LS * .9); line(g, [[-34, -26], [0, -30], [36, -27]], wc, LS * .8);
      line(g, [[-50, 16], [-60, 10]], wc, LS * .8); line(g, [[-50, 22], [-62, 22]], wc, LS * .8); line(g, [[-49, 28], [-60, 34]], wc, LS * .8);
      line(g, [[30, 58], [14, 68], [8, 86]], wc, LS); line(g, [[-36, 36], [-22, 40], [-6, 37]], wc, LS * .8);
      line(g, [[-48, 70], [-42, 92]], wc, LS * .8);
    }
    const mo = fem ? { x: 24, y: 76, w: 30, fs: .7 } : { x: 22, y: 82, w: 26, fs: .7 };
    mouth(g, PP, mo.x, mo.y, mo.w, E.mouth, mo.fs, fem ? P.lip : null);
    if (fem) { g.fillStyle = '#3a1c20'; g.beginPath(); g.arc(2, 90, 3.2, 0, TAU); g.fill(); line(g, [[-30, 106], [-4, 116], [18, 110]], mix(SK.l, SK.f, .4), LS * .8); }
    const eh = fem ? 30 : 24;
    if (fem && !E.laugh) { g.fillStyle = rgba(P.purple.f, .5); g.beginPath(); g.ellipse(-21, 10, 26, 10, -.1, 0, TAU); g.fill(); g.beginPath(); g.ellipse(35, 9, 15, 9, .1, 0, TAU); g.fill(); }
    eye(g, PP, -21, 20, 43, eh, -1, 1, E, fem); eye(g, PP, 35, 19, 25, eh - 2, 1, .6, E, fem);
  } else {
    line(g, [[76, 50], [82, 52]], SK.l, LS);
    if (old) { const wc = mix(SK.l, SK.f, .25); line(g, [[40, -40], [64, -36]], wc, LS * .8); line(g, [[38, -28], [66, -24]], wc, LS * .8); line(g, [[40, 14], [28, 8]], wc, LS * .8); line(g, [[40, 22], [26, 24]], wc, LS * .8); line(g, [[66, 56], [58, 70], [60, 86]], wc, LS); }
    sideMouth(g, PP, E.mouth);
    eyeSide(g, PP, 56, 20, 24, 24, E);
  }
  // 头发
  if (o.hair !== false) {
    if (fem) {
      cel(g, [[-90, 10], [-98, -44], [-72, -92], [-24, -110], [28, -104], [62, -80], [70, -46], [62, -18], [46, -38], [8, -50], [-30, -40], [-56, -14], [-62, 20], [-80, 40]], { ...hairSt, so: SO(10) });
      for (let k = 0; k < 7; k++) { const a = Math.PI * (1.02 + k * .13), cx = -8 + Math.cos(a) * 74, cy = -22 + Math.sin(a) * 66; const c = new Path2D(); c.ellipse(cx, cy, 22, 19, a, 0, TAU); cel(g, c, { ...hairSt, so: SO(5), lw: LH * .7 }); }
      for (const [x, y] of [[-84, 16], [-88, 44], [-78, 66]]) { const c = new Path2D(); c.ellipse(x, y, 17, 16, 0, 0, TAU); cel(g, c, { ...hairSt, so: SO(5), lw: LH * .7 }); }
      // 金簪 + 玉珠
      cel(g, poly([[-70, -140], [30, -118], [32, -112], [-70, -132]]), { f: P.gold.f, s: P.gold.s, so: [0, -3], l: P.gold.l, lw: LW });
      const jd = new Path2D(); jd.arc(34, -114, 9, 0, TAU); cel(g, jd, { f: P.jade.f, h: P.jade.h, ho: [2, 2], l: P.jade.l, lw: LW });
    } else {
      cel(g, Hh.cap, { ...hairSt, so: SO(10) });
      if (view === 'q') cel(g, [[-72, -12], [-58, -16], [-55, 14], [-58, 26], [-66, 30]], { ...hairSt, f: HR.s, lw: LH * .7 });
      else cel(g, [[-14, -14], [2, -18], [6, 14], [2, 26], [-8, 30]], { ...hairSt, f: HR.s, lw: LH * .7 });
      const lf = Math.sin((o.ph || 0) * TAU) * 2.5 * (o.wind ?? 0);
      g.save(); g.fillStyle = HR.s; for (const L of Hh.locks) { const [x0, y0, x1, y1, tx, ty, b] = L; g.fill(path(lock(x0 - 8, y0, x1 + 8, y1, tx, ty + 3 + lf, b))); } g.restore();
      const lockSt = { ...hairSt, l: mix(HR.l, HR.s, .45), lw: LH * .6 };
      for (const L of Hh.locks) { const [x0, y0, x1, y1, tx, ty, b] = L; cel(g, lock(x0, y0, x1, y1, tx, ty + lf, b), { ...lockSt, so: SO(6) }); }
      for (const [x0, y0, tx, ty, b] of Hh.strays) cel(g, lock(x0 - 2, y0, x0 + 2, y0, tx, ty + lf, b), { f: HR.f, l: mix(HR.l, HR.s, .3), lw: LH * .6 });
      const hz = Hh.halo;
      g.save(); const HC = new Path2D(); HC.addPath(path(Hh.cap)); for (const L of Hh.locks) { const [x0, y0, x1, y1, tx, ty, b] = L; HC.addPath(path(lock(x0, y0, x1, y1, tx, ty + lf, b))); }
      g.clip(HC); halo(g, mix(HR.h, '#ffffff', old ? .6 : .3), hz[0], hz[1], hz[2], hz[3], hz[4], hz[5], hz[6], hz[7]); g.restore();
    }
  }
  // 眉毛（画在刘海上面）
  const B = E.brow || [0, 0, 2], bc = old ? mix(HR.f, HR.s, .5) : fem ? P.hairM.l : P.lash;
  if (view === 'q') { brow(g, bc, 0, fem ? -6 : 0, -44, fem ? -4 : 1, B, old ? 5 : fem ? 1.8 : 3.6); brow(g, bc, 24, fem ? -8 : -2, 49, fem ? -3 : 1, B, old ? 4.5 : fem ? 1.6 : 3.2); if (old) { line(g, [[0, 0 + B[0]], [-44, 1 + B[1]]], P.hairOld.l, LS * .6); } }
  else { brow(g, bc, 74, -3, 46, -1, B, old ? 5 : 3.4); }
  // 老年：白胡子
  if (old) {
    if (view === 'q') cel(g, [[18, 64], [36, 59], [52, 62], [60, 74], [46, 70], [30, 72], [14, 78]], { f: P.hairOld.f, s: P.hairOld.s, so: [0, -4], l: P.hairOld.l, lw: LS });
    else cel(g, [[60, 62], [80, 58], [88, 66], [84, 74], [70, 70], [58, 76]], { f: P.hairOld.f, s: P.hairOld.s, so: [0, -4], l: P.hairOld.l, lw: LS });
  }
}
function sideMouth(g, P, type) {
  const lc = P.skin.l;
  if (type === 'flat' || type === 'set' || type === 'down') line(g, [[70, 72], [79, 72]], lc, LS * 1.05);
  else if (type === 'smile' || type === 'smirk') line(g, [[66, 68], [71, 73], [79, 71]], lc, LS * 1.05);
  else { const MP = path([[66, 68, 1], [80, 68], [78, type === 'grin' || type === 'wide' ? 84 : 78], [70, 78]], true); g.fillStyle = '#5a1a2a'; g.fill(MP); if (type === 'grin') { g.save(); g.clip(MP); g.fillStyle = '#fff'; g.fillRect(60, 62, 30, 9); g.restore(); } g.strokeStyle = lc; g.lineWidth = LS * LWK.k; g.stroke(MP); }
}

// 肩 / 上身（胸像用）
function body(g, P, kind, view, E, o) {
  const dx = view === 'q' ? -14 : -34, dy = (E.shoulders || 0) + (o.shrug || 0);
  const C = kind === 'suit' ? P.suit : kind === 'jacket' ? P.teal : kind === 'tee' ? P.white : kind === 'old' ? P.leather : P.purple;
  const sh = [[-206 + dx, 420], [-204 + dx, 262 + dy], [-186 + dx, 206 + dy, 1], [-74 + dx, 156 + dy * .5], [60 + dx, 156 + dy * .5], [150 + dx, 196 + dy, 1], [176 + dx, 250 + dy], [184 + dx, 420]];
  cel(g, sh, { f: C.f, s: C.s, so: [-26, -10], h: C.h, ho: [6, 5], l: C.l, lw: LW * 1.2, rim: o.rim });
  line(g, [[-150 + dx, 420], [-146 + dx, 300], [-160 + dx, 250]], C.l, LW); line(g, [[136 + dx, 420], [132 + dx, 300], [142 + dx, 252]], C.l, LW);
  if (kind === 'suit') {   // 衬衫 V 区 + 领带
    cel(g, poly([[-40 + dx, 150], [44 + dx, 152], [14 + dx, 300], [-4 + dx, 300]]), { f: P.shirt.f, s: P.shirt.s, so: [-10, 0], l: P.shirt.l, lw: LW });
    const tl = o.tie ?? 0, ty = 168 + tl * 26, tx = 6 + dx + tl * 8;
    if (tl < 1.5) {
      cel(g, poly([[tx - 10, ty + 14], [tx + 12, ty + 14], [tx + 20 + tl * 10, 420], [tx - 16 + tl * 10, 420]]), { f: P.teal.f, s: P.teal.s, so: [-6, 0], h: P.teal.h, ho: [3, 0], l: P.teal.l, lw: LW });
      cel(g, poly([[tx - 13, ty - 6], [tx + 14, ty - 6], [tx + 10, ty + 16], [tx - 9, ty + 16]]), { f: P.teal.f, s: P.teal.s, so: [0, -6], l: P.teal.l, lw: LW });
    }
    // 翻领
    cel(g, [[-70 + dx, 152, 1], [-38 + dx, 150, 1], [-2 + dx, 300, 1], [-60 + dx, 240, 1], [-36 + dx, 226, 1]], { f: C.f, s: C.s, so: [-8, -4], l: C.l, lw: LW });
    cel(g, [[60 + dx, 152, 1], [42 + dx, 152, 1], [14 + dx, 300, 1], [56 + dx, 244, 1], [40 + dx, 230, 1]], { f: C.s, l: C.l, lw: LW });
  } else if (kind === 'jacket' || kind === 'old') {
    line(g, [[6 + dx, 170], [10 + dx, 420]], C.l, LW * 1.2);
    if (kind === 'jacket') { g.save(); g.clip(path(sh)); g.fillStyle = P.white.f; g.fill(poly([[-210 + dx, 262 + dy], [-186 + dx, 224 + dy], [-164 + dx, 420], [-196 + dx, 420]])); g.fill(poly([[156 + dx, 218 + dy], [178 + dx, 252 + dy], [176 + dx, 420], [150 + dx, 420]])); g.restore(); }
  } else if (kind === 'mei') {
    line(g, [[0 + dx, 160], [60 + dx, 240], [50 + dx, 420]], P.gold.f, 5);
    for (const [x, y] of [[20, 186], [44, 218]]) { g.fillStyle = P.gold.f; g.beginPath(); g.arc(x + dx, y, 6, 0, TAU); g.fill(); }
  }
}
function collar(g, P, kind, view, E, o) {
  const dx = view === 'q' ? -14 : -34;
  if (kind === 'suit') {   // 衬衫领
    cel(g, [[-44 + dx, 134, 1], [-6 + dx, 150, 1], [2 + dx, 176, 1], [-40 + dx, 158, 1]], { f: P.shirt.f, s: P.shirt.s, so: [-4, -4], l: P.shirt.l, lw: LW });
    cel(g, [[46 + dx, 140, 1], [20 + dx, 152, 1], [10 + dx, 176, 1], [42 + dx, 160, 1]], { f: P.shirt.s, l: P.shirt.l, lw: LW });
  } else if (kind === 'jacket') {   // 立领
    cel(g, [[-66 + dx, 158], [-46 + dx, 122], [40 + dx, 126], [62 + dx, 158], [40 + dx, 174], [-40 + dx, 174]], { f: P.teal.f, s: P.teal.s, so: [-8, -8], h: P.teal.h, ho: [3, 3], l: P.teal.l, lw: LW });
  } else if (kind === 'tee') {
    line(g, [[-50 + dx, 152], [-10 + dx, 172], [44 + dx, 154]], P.white.l, LW);
  } else if (kind === 'old') {   // 青绿围巾
    cel(g, [[-52 + dx, 130], [-20 + dx, 122], [34 + dx, 126], [58 + dx, 134], [60 + dx, 160], [30 + dx, 170], [-24 + dx, 166], [-54 + dx, 156]], { f: P.teal.f, s: P.teal.s, so: [-4, -10], h: P.teal.h, ho: [0, 4], l: P.teal.l, lw: LW,
      sh: [[[-4 + dx, 124], [6 + dx, 168], [-4 + dx, 168], [-14 + dx, 124]], [[30 + dx, 126], [38 + dx, 168], [30 + dx, 168], [22 + dx, 126]]] });
    cel(g, [[14 + dx, 162], [40 + dx, 166], [50 + dx, 250], [34 + dx, 270], [18 + dx, 244]], { f: P.teal.f, s: P.teal.s, so: [-6, -4], l: P.teal.l, lw: LW });
  } else if (kind === 'mei') {
    cel(g, [[-54 + dx, 140], [-40 + dx, 112], [34 + dx, 116], [54 + dx, 142], [20 + dx, 166], [-10 + dx, 166]], { f: P.purple.f, s: P.purple.s, so: [-6, -8], l: P.purple.l, lw: LW });
    line(g, [[-52 + dx, 138], [-40 + dx, 114], [34 + dx, 118], [52 + dx, 140]], P.gold.f, 3);
  }
}

// —— 头盔（喷气式半盔 + 泡泡镜片）：visor 0 = 放下（遮脸），1 = 掀起；old = 旧了，配风镜 ——
export function helmet(g, P, o = {}) {
  const view = o.view || 'side', v = o.visor ?? 0, rim = o.rim;
  const HC = { f: P.white.f, s: P.white.s, h: P.white.h, l: P.white.l };
  if (view === 'side') {
    const shell = [[-62, 56], [-80, 18], [-84, -30], [-64, -84], [-14, -110], [44, -102], [76, -68], [80, -38], [40, -34], [12, -8], [6, 44], [-14, 64]];
    cel(g, shell, { f: HC.f, s: HC.s, so: [-12, -10], h: HC.h, ho: [5, 5], l: HC.l, lw: LP, rim,
      clipFn: gg => { gg.fillStyle = P.teal.f; gg.fill(poly([[-90, -62], [90, -80], [90, -64], [-90, -44]])); gg.fillStyle = P.teal.s; gg.fill(poly([[-90, -48], [90, -68], [90, -64], [-90, -44]])); } });
    cel(g, [[40, -40], [84, -44], [96, -34], [80, -30], [42, -30]], { f: P.dark.f, l: P.dark.l, lw: LW });   // 帽檐
    line(g, [[-6, 60], [20, 96], [44, 104]], P.dark.f, 5);   // 下巴带
    if (o.goggles) {
      const L = new Path2D(); L.ellipse(58, -62, 24, 15, -.15, 0, TAU);
      cel(g, L, { f: '#86e6ff', s: '#3a9fd0', sh: [[[30, -60], [86, -66], [86, -40], [30, -40]]], h: '#ffffff', hi: [[[42, -70], [58, -74], [48, -62]]], l: '#141420', lw: LP });
      line(g, [[34, -60], [-80, -40]], P.leather.f, 7);
    } else {
      const piv = [8, -30];
      g.save(); g.translate(piv[0], piv[1]); g.rotate(-v * 1.15); g.translate(-piv[0], -piv[1]);
      const vis = [[10, -40], [60, -44], [96, -20], [104, 24], [92, 68], [60, 92], [20, 70], [8, 20]];
      g.fillStyle = rgba(o.visorCol || '#1a2140', v > .5 ? .55 : .93); const VP = path(vis); g.fill(VP);
      g.save(); g.clip(VP); g.fillStyle = rgba('#ffffff', .5); g.fill(poly([[40, -50], [56, -50], [110, 30], [100, 50]])); g.fillStyle = rgba(P.teal.h, .5); g.fill(poly([[66, -50], [72, -50], [112, 10], [110, 22]])); g.restore();
      g.strokeStyle = P.dark.l; g.lineWidth = LP * LWK.k; g.stroke(VP);
      g.restore();
      const pv = new Path2D(); pv.arc(piv[0], piv[1], 8, 0, TAU); cel(g, pv, { f: P.chrome.f, s: P.chrome.s, so: [-2, -2], l: P.chrome.l, lw: LW });
    }
  } else {   // 3/4
    const shell = [[-74, 70], [-94, 30], [-102, -30], [-80, -92], [-26, -118], [34, -110], [70, -80], [78, -44], [60, -34], [20, -42], [-30, -36], [-56, -18], [-62, 30], [-56, 66]];
    cel(g, shell, { f: HC.f, s: HC.s, so: [-14, -10], h: HC.h, ho: [5, 5], l: HC.l, lw: LP, rim,
      clipFn: gg => { gg.fillStyle = P.teal.f; gg.fill(poly([[-110, -70], [90, -92], [90, -74], [-110, -50]])); gg.fillStyle = P.teal.s; gg.fill(poly([[-110, -56], [90, -78], [90, -74], [-110, -50]])); } });
    cel(g, [[-30, -40], [20, -46], [62, -38], [84, -30], [60, -26], [20, -32], [-28, -28]], { f: P.dark.f, l: P.dark.l, lw: LW });
    line(g, [[-58, 62], [-30, 110], [0, 122]], P.dark.f, 5);
    if (o.goggles) {
      for (const [x, y, rw] of [[-14, -70, 26], [40, -66, 17]]) { const L = new Path2D(); L.ellipse(x, y, rw, rw * .64, 0, 0, TAU); cel(g, L, { f: '#86e6ff', s: '#3a9fd0', sh: [[[x - rw, y], [x + rw, y - 4], [x + rw, y + rw], [x - rw, y + rw]]], h: '#ffffff', hi: [[[x - rw * .6, y - rw * .35], [x - rw * .1, y - rw * .5], [x - rw * .4, y]]], l: '#141420', lw: LP }); }
      line(g, [[-40, -68], [-96, -50]], P.leather.f, 7);
    } else if (v < .5) {
      const vis = [[-58, -34], [20, -44], [70, -34], [84, 10], [72, 70], [34, 106], [-24, 100], [-56, 62]];
      const VP = path(vis); g.fillStyle = rgba(o.visorCol || '#1a2140', .94); g.fill(VP);
      g.save(); g.clip(VP);
      if (o.visorFn) o.visorFn(g);
      g.fillStyle = rgba('#ffffff', .4); g.fill(poly([[-40, -50], [-14, -50], [50, 110], [30, 110]])); g.fillStyle = rgba(P.teal.h, .4); g.fill(poly([[0, -50], [8, -50], [70, 100], [64, 110]]));
      g.restore();
      g.strokeStyle = P.dark.l; g.lineWidth = LP * LWK.k; g.stroke(VP);
    } else {
      cel(g, [[-40, -58], [20, -70], [70, -60], [86, -44], [60, -40], [20, -48], [-34, -40]], { f: '#2a3358', s: '#161c38', so: [0, -4], h: '#8fa0e0', ho: [0, 3], l: P.dark.l, lw: LP });
    }
  }
}

// —— 阿花的背影（过肩前景）：长发 + 红色 ——
export function ahuaBack(g, P, o = {}) {
  const ph = o.ph || 0;
  cel(g, [[-260, 520], [-250, 270], [-190, 200], [-70, 170], [70, 170], [190, 200], [250, 270], [260, 520]], { f: P.red.f, s: P.red.s, so: [-30, -14], h: P.red.h, ho: [8, 6], l: P.red.l, lw: 2.4 });
  cel(g, poly([[-34, 110], [34, 110], [40, 190], [-40, 190]]), { f: P.skinF.f, s: P.skinF.s, so: [-10, 0], l: P.skinF.l, lw: 1.6 });
  const HR = P.hairF;
  cel(g, [[-96, 20], [-104, -50], [-76, -112], [0, -138], [76, -112], [104, -50], [100, 40], [124, 200], [110, 330], [60, 360], [0, 344], [-60, 360], [-110, 330], [-124, 200]], { f: HR.f, s: HR.s, so: [-18, -12], h: HR.h, l: HR.l, lw: 2.2 });
  for (let k = 0; k < 6; k++) { const x = -90 + k * 36, sw = Math.sin(ph * TAU + k) * 3; line(g, [[x, 20], [x + (k - 2.5) * 6 + sw, 180], [x + (k - 2.5) * 8 + sw, 330]], mix(HR.l, HR.f, .3), 1.6); }
  g.save(); g.clip(path([[-96, 20], [-104, -50], [-76, -112], [0, -138], [76, -112], [104, -50], [100, 40]])); halo(g, mix(HR.h, '#ffffff', .25), 0, -30, 96, 80, Math.PI * 1.1, Math.PI * 1.9, 9, 9); g.restore();
  // 耳边一枚红色耳坠
  const er = new Path2D(); er.ellipse(104, 74, 7, 12, 0, 0, TAU); cel(g, er, { f: P.red.f, h: P.red.h, ho: [2, 2], l: P.red.l, lw: 1.4 });
}

// —— 全身小人（侧面，朝右）：hip 在原点；角度从"竖直向下"量起，正 = 向前（右）——
// pose: { lean, th:[近,远], kn:[近,远], ua:[近,远], fa:[近,远], hy, headTilt }
export function figure(g, C, pose, o = {}) {
  const p = { lean: 0, th: [0, 0], kn: [0, 0], ua: [0, 0], fa: [0, 0], hy: 0, headTilt: 0, ...pose };
  const TH = 112, SHN = 112, UA = 78, FA = 74, TO = 150;
  const d = (a, l) => [Math.sin(a) * l, Math.cos(a) * l];
  const hip = [0, p.hy], sh = [hip[0] + Math.sin(p.lean) * TO, hip[1] - Math.cos(p.lean) * TO];
  const leg = k => { const kn = [hip[0] + d(p.th[k], TH)[0], hip[1] + d(p.th[k], TH)[1]]; const an = [kn[0] + d(p.th[k] - p.kn[k], SHN)[0], kn[1] + d(p.th[k] - p.kn[k], SHN)[1]]; return [kn, an, p.th[k] - p.kn[k]]; };
  const arm = k => { const el = [sh[0] + d(p.ua[k], UA)[0], sh[1] + d(p.ua[k], UA)[1]]; const ha = [el[0] + d(p.ua[k] + p.fa[k], FA)[0], el[1] + d(p.ua[k] + p.fa[k], FA)[1]]; return [el, ha]; };
  const st = (c, so) => ({ f: c.f, s: c.s, so, h: c.h, l: c.l, lw: 2.4, rim: o.rim });
  const drawLeg = (k, far) => {
    const [kn, an, sa] = leg(k), c = far ? { ...C.bottom, f: C.bottom.s } : C.bottom;
    cel(g, limb(hip, kn, 50, 40), st(c, [-6, -4])); cel(g, limb(kn, an, 38, 28), st(c, [-6, 0]));
    g.save(); g.translate(an[0], an[1]); g.rotate(-sa * .6);
    cel(g, [[-16, -10], [14, -12], [44, 8], [46, 20], [-16, 20]], { f: C.shoe.f, s: C.shoe.s, so: [0, -5], l: C.shoe.l, lw: 2.2, rim: o.rim }); g.restore();
    return an;
  };
  const drawArm = (k, far) => { const [el, ha] = arm(k), c = far ? { ...C.top, f: C.top.s } : C.top; cel(g, limb(sh, el, 40, 32), st(c, [-5, -4])); cel(g, limb(el, ha, 30, 24), st(c, [-4, -3])); const hd = new Path2D(); hd.arc(ha[0], ha[1], 15, 0, TAU); cel(g, hd, { f: C.skin.f, s: C.skin.s, so: [-3, -3], l: C.skin.l, lw: 1.8 }); return ha; };
  drawArm(1, true); const footFar = drawLeg(1, true);
  // 躯干
  const nx = Math.cos(p.lean), ny = Math.sin(p.lean);
  const torso = [[hip[0] - nx * 34, hip[1] - ny * 34 + 8], [hip[0] + nx * 34, hip[1] + ny * 34 + 8], [sh[0] + nx * 40, sh[1] + ny * 40 + 6], [sh[0] + nx * 26, sh[1] + ny * 26 - 22], [sh[0] - nx * 30, sh[1] - ny * 30 - 22], [sh[0] - nx * 44, sh[1] - ny * 44 + 6]];
  cel(g, torso, st(C.top, [-12, -8]));
  if (C.tie) { const a = [sh[0] + nx * 22, sh[1] + ny * 22 - 8], b = [a[0] + Math.sin(p.lean * .3 - (o.tieSwing || 0)) * -10 - (o.tieSwing || 0) * 60, a[1] + 80]; cel(g, limb(a, b, 12, 20), { f: C.tie.f, s: C.tie.s, so: [-3, 0], l: C.tie.l, lw: 1.6 }); }
  const footNear = drawLeg(0, false);
  // 头
  const hc = [sh[0] + Math.sin(p.lean + p.headTilt) * 48 + nx * 4, sh[1] - Math.cos(p.lean + p.headTilt) * 48 - 14];
  cel(g, limb([sh[0] + nx * 2, sh[1] - 14], [hc[0], hc[1] + 20], 26, 24), { f: C.skin.f, s: C.skin.s, so: [-6, 0], l: C.skin.l, lw: 1.6 });
  g.save(); g.translate(hc[0], hc[1]); g.rotate(p.lean * .5 + p.headTilt);
  if (o.headFn) o.headFn(g);
  else {
    cel(g, [[-30, -24], [-32, 6], [-22, 30], [0, 42], [22, 36], [30, 18], [33, 4], [28, -6], [30, -24], [10, -38], [-16, -38]], { f: C.skin.f, s: C.skin.s, so: [-8, -4], l: C.skin.l, lw: 1.6 });
    cel(g, [[-36, 4], [-42, -24], [-28, -46], [0, -54], [26, -46], [36, -26], [30, -10], [14, -22], [-10, -26], [-24, -8], [-28, 12]], { f: C.hair.f, s: C.hair.s, so: [-6, -5], h: C.hair.h, l: C.hair.l, lw: 1.8, rim: o.rim });
    line(g, [[10, 2], [22, 1]], C.hair.l, 3); line(g, [[12, 24], [22, 23]], C.skin.l, 1.6);
  }
  g.restore();
  const hand = drawArm(0, false);
  return { footNear, footFar, hand, sh, head: hc };
}
export const poseLerp = (a, b, t) => { const o = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const x = a[k] ?? (Array.isArray(b[k]) ? [0, 0] : 0), y = b[k] ?? (Array.isArray(a[k]) ? [0, 0] : 0); o[k] = Array.isArray(x) ? x.map((v, i) => v + (y[i] - v) * t) : x + (y - x) * t; } return o; };
export const SUITC = P => ({ top: P.suit, bottom: P.suit, shoe: P.dark, skin: P.skin, hair: P.hair, tie: P.teal });
export const CASUALC = P => ({ top: P.teal, bottom: P.jeans, shoe: P.boot, skin: P.skin, hair: P.hair });

// —— 亲戚 / 路人的剪影胸像：kind 0..3 换发型 ——
export function silBust(g, col, rimCol, kind = 0, o = {}) {
  const shapes = [
    [[-150, 300], [-140, 150], [-70, 100], [-44, 70], [-58, 20], [-56, -40], [-20, -78], [30, -74], [58, -36], [58, 24], [44, 70], [70, 100], [140, 150], [150, 300]],
    [[-170, 300], [-150, 140], [-80, 96], [-50, 70], [-70, 30], [-78, -40], [-40, -96], [20, -100], [70, -56], [74, 20], [50, 70], [80, 96], [150, 140], [170, 300]],
    [[-130, 300], [-120, 160], [-60, 110], [-40, 76], [-52, 30], [-50, -30], [-30, -70], [-36, -110], [10, -120], [40, -80], [54, -30], [52, 30], [40, 76], [60, 110], [120, 160], [130, 300]],
    [[-160, 300], [-150, 150], [-76, 104], [-46, 72], [-62, 26], [-62, -44], [-24, -84], [26, -84], [62, -44], [62, 26], [46, 72], [76, 104], [150, 150], [160, 300]],
  ];
  const P = path(shapes[kind % 4]);
  g.fillStyle = col; g.fill(P);
  if (rimCol) { g.save(); g.clip(P); g.fillStyle = rimCol; const Q2 = new Path2D(); Q2.addPath(P); Q2.addPath(P, new DOMMatrix().translate(o.rd?.[0] ?? 0, o.rd?.[1] ?? 7)); g.fill(Q2, 'evenodd'); g.restore(); }
}

// —— 手（俯视 / 侧视通用的简化手）：掌心朝下平放，手指朝右；local：腕在 (0,0) ——
export function handFlat(g, SK, o = {}) {
  const sp = o.spread ?? 0, cur = o.curl ?? 0;
  const st = { f: SK.f, s: SK.s, h: SK.h, l: SK.l, lw: 2.2 };
  for (let i = 0; i < 4; i++) {   // 四指
    const y = -54 + i * 36, a = (i - 1.5) * (.08 + sp * .1), len = (i === 0 ? 120 : i === 3 ? 100 : 136) * (1 - cur * .45);
    const b = [150 + Math.cos(a) * len * .55, y + Math.sin(a) * len * .55], c = [150 + Math.cos(a) * len, y + Math.sin(a) * len + cur * 10];
    cel(g, limb([140, y], b, 36, 34), { ...st, so: [0, -8] }); cel(g, limb(b, c, 33, 28), { ...st, so: [0, -8] });
  }
  cel(g, [[0, -66], [70, -76], [150, -72], [168, -30], [168, 30], [150, 70], [70, 78], [0, 62]], { ...st, so: [-4, -20], ho: [0, 6] });
  // 拇指
  const ta = .9 - (o.thumb ?? 0) * .7;
  const t1 = [70 + Math.cos(ta) * 70, 70 + Math.sin(ta) * 60], t2 = [t1[0] + Math.cos(ta - .5) * 56, t1[1] + Math.sin(ta - .5) * 50];
  cel(g, limb([50, 60], t1, 48, 40), { ...st, so: [-4, -8] }); cel(g, limb(t1, t2, 38, 30), { ...st, so: [-4, -8] });
  for (let i = 0; i < 3; i++) line(g, [[150, -38 + i * 36], [164, -36 + i * 36]], mix(SK.l, SK.f, .4), 1.6);
}
// 袖口：从左边伸进来（衬衫袖 + 外套袖）
export function sleeve(g, C, CU, len = 900, o = {}) {
  cel(g, poly([[-len, -112], [-40, -96], [-40, 96], [-len, 130]]), { f: C.f, s: C.s, so: [0, -40], h: C.h, ho: [0, 10], l: C.l, lw: 2.6 });
  if (CU) { cel(g, poly([[-60, -88], [14, -78], [14, 76], [-60, 86]]), { f: CU.f, s: CU.s, so: [0, -22], l: CU.l, lw: 2.2 }); if (o.button) { g.fillStyle = o.button; g.beginPath(); g.arc(-22, 52, 8, 0, TAU); g.fill(); } }
}
