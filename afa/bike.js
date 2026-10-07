// 阿发的摩托（街车：圆灯、青绿油箱、钢丝辐条）+ 骑手。侧面：原点 = 两轮中间的地面，朝右；背面：原点 = 后轮触地点
import { cel, path, poly, ribbon, flutter, line, TAU, rgba, mix } from './cel.js';
import { limb } from './stage.js';
import { head, helmet } from './people.js';

const RW = [-255, -106], FW = [275, -106], WR = 106;
export const LAMPS = { tail: [-318, -300], head: [246, -352] };

export function wheel(g, c, P, o) {
  const [x, y] = c, sp = o.speed ?? 1;
  g.save(); g.translate(x, y);
  const tire = new Path2D(); tire.arc(0, 0, WR, 0, TAU);
  cel(g, tire, { f: P.tire.f, s: P.tire.s, so: [-9, -11], h: P.tire.h, ho: [4, 5], l: P.tire.l, lw: 2.4 });
  const rim = new Path2D(); rim.arc(0, 0, WR * .74, 0, TAU);
  cel(g, rim, { f: P.dark.s, l: P.chrome.l, lw: 2 });
  g.strokeStyle = P.chrome.f; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, WR * .72, 0, TAU); g.stroke();
  g.strokeStyle = P.chrome.h; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, WR * .72, -2.4, -1.2); g.stroke();
  // 辐条：停着时一根根，跑起来变成半透明的银盘 + 几根残影
  if (sp > .3) { g.fillStyle = rgba(P.chrome.f, .22 * sp); g.beginPath(); g.arc(0, 0, WR * .7, 0, TAU); g.fill(); }
  g.strokeStyle = rgba(P.chrome.f, 1 - .6 * Math.min(1, sp)); g.lineWidth = 1.6;
  const n = sp > .3 ? 8 : 18;
  for (let k = 0; k < n; k++) { const a = o.wheelA + k * TAU / n; g.beginPath(); g.moveTo(Math.cos(a) * 14, Math.sin(a) * 14); g.lineTo(Math.cos(a + .25) * WR * .7, Math.sin(a + .25) * WR * .7); g.stroke(); }
  const hub = new Path2D(); hub.arc(0, 0, 18, 0, TAU);
  cel(g, hub, { f: P.chrome.f, s: P.chrome.s, so: [-4, -4], l: P.chrome.l, lw: 1.6 });
  if (sp > .2) { g.strokeStyle = rgba('#ffffff', .5 * sp); g.lineCap = 'round'; for (let k = 0; k < 4; k++) { const a = -o.wheelA * 1.7 + k * 1.57, r = WR * (.82 + .06 * (k % 2)); g.lineWidth = 2.5; g.beginPath(); g.arc(0, 0, r, a, a + .7); g.stroke(); } }
  g.restore();
}

export function bike(g, P, o = {}) {
  const rim = o.rim, CH = { f: P.chrome.f, s: P.chrome.s, h: P.chrome.h, l: P.chrome.l };
  wheel(g, RW, P, o); wheel(g, FW, P, o);
  // 后摇臂 + 后减震
  cel(g, poly([[-30, -150], [-20, -128], [-255, -96], [-258, -116]]), { f: P.dark.f, s: P.dark.s, so: [0, -5], l: P.dark.l, lw: 2 });
  cel(g, limb([-150, -290], [-236, -122], 16, 16), { ...CH, so: [-4, 0], lw: 1.8 });
  for (let k = 0; k < 5; k++) line(g, [[-164 - k * 14, -268 + k * 28], [-146 - k * 14, -262 + k * 28]], CH.l, 1.6);
  // 后挡泥板 + 前挡泥板
  line(g, path([[-360, -150], [-340, -214], [-270, -232], [-200, -214]], false), P.dark.f, 9);
  line(g, path([[196, -196], [250, -224], [310, -218], [352, -186]], false), P.teal.f, 10); line(g, path([[196, -196], [250, -224], [310, -218], [352, -186]], false), P.teal.l, 1.5);
  // 前叉
  cel(g, limb([158, -388], [FW[0], FW[1]], 20, 16), { ...CH, so: [-5, 0], ho: [2, 0], lw: 2 });
  cel(g, limb([176, -330], [228, -214], 24, 24), { f: P.dark.f, s: P.dark.s, so: [-5, 0], l: P.dark.l, lw: 2 });
  // 发动机 + 散热片
  cel(g, [[-70, -128], [-90, -180], [-60, -250], [70, -262], [128, -200], [110, -128]], { f: P.dark.f, s: P.dark.s, so: [0, -14], h: P.dark.h, ho: [3, 4], l: P.dark.l, lw: 2.2 });
  for (let k = 0; k < 6; k++) line(g, [[-40 + k * 4, -240 + k * 16], [84 + k * 5, -248 + k * 17]], P.chrome.s, 2);
  const cc = new Path2D(); cc.arc(-10, -160, 30, 0, TAU); cel(g, cc, { ...CH, so: [-6, -6], ho: [3, 3], lw: 1.8 });
  // 排气管（镀铬，贴地向后）
  cel(g, [[96, -236, 1], [124, -150], [60, -112, 1], [-180, -118, 1], [-380, -150, 1], [-384, -116, 1], [-180, -92, 1], [70, -90, 1], [146, -146], [118, -240, 1]], { ...CH, so: [0, -9], ho: [0, 4], lw: 2 });
  // 车架尾段 + 尾灯
  cel(g, poly([[-60, -286], [-300, -300], [-330, -286], [-300, -270], [-80, -250]]), { f: P.dark.f, s: P.dark.s, so: [0, -8], l: P.dark.l, lw: 2 });
  cel(g, poly([[-306, -312], [-330, -306], [-330, -288], [-306, -286]]), { f: '#ff4050', l: '#5a0a14', lw: 1.4 });
  // 坐垫
  cel(g, [[-20, -310], [-40, -338], [-190, -334], [-290, -322], [-300, -302], [-60, -292]], { f: P.seat.f, s: P.seat.s, so: [0, -8], h: P.seat.h, ho: [0, 3], l: P.seat.l, lw: 2 });
  if (o.pack) {   // 后座的铺盖卷 + 鱼竿
    const pk = new Path2D(); pk.roundRect(-300, -392, 110, 62, 26); cel(g, pk, { f: P.leather.f, s: P.leather.s, so: [0, -12], h: P.leather.h, ho: [0, 4], l: P.leather.l, lw: 2 });
    line(g, [[-270, -392], [-270, -330]], P.cream.f, 5); line(g, [[-222, -392], [-222, -330]], P.cream.f, 5);
    line(g, [[-320, -350], [-150, -470]], P.dark.f, 4);
  }
  // 油箱（青绿）
  const tank = [[-30, -304], [-36, -344], [20, -376], [110, -382], [164, -360], [170, -326], [120, -298], [30, -292]];
  cel(g, tank, { f: P.teal.f, s: P.teal.s, so: [-8, -14], h: P.teal.h, ho: [4, 6], l: P.teal.l, lw: 2.2, rim,
    clipFn: gg => { gg.fillStyle = P.white.f; gg.fill(poly([[-40, -332], [180, -340], [180, -330], [-40, -322]])); } });
  g.fillStyle = P.teal.h; g.fill(poly([[30, -372], [108, -376], [106, -370], [32, -366]]));
  // 车头：仪表 + 圆灯 + 把手 + 后视镜
  cel(g, limb([150, -396], [176, -430], 20, 18), { f: P.dark.f, l: P.dark.l, lw: 1.8 });
  line(g, [[150, -410], [126, -440], [100, -436]], P.chrome.f, 6); line(g, [[150, -410], [126, -440], [100, -436]], P.chrome.l, 1.2);
  cel(g, limb([84, -434], [112, -438], 16, 16), { f: P.dark.f, l: P.dark.l, lw: 1.6 });
  line(g, [[126, -440], [120, -492]], P.chrome.l, 3); const mr = new Path2D(); mr.ellipse(118, -500, 20, 13, -.2, 0, TAU); cel(g, mr, { ...CH, so: [-3, -3], lw: 1.8 });
  const hl = new Path2D(); hl.ellipse(214, -352, 38, 42, 0, 0, TAU);
  cel(g, hl, { ...CH, so: [-8, -6], ho: [3, 3], lw: 2.2 });
  const lens = new Path2D(); lens.ellipse(240, -352, 14, 38, 0, 0, TAU); cel(g, lens, { f: o.lampOn === false ? '#c8d0e0' : '#fff7d6', l: P.chrome.l, lw: 1.6 });
}

// 骑手（侧面）：o = { old, visor, ph, wind, rim, expr, bob, pack }
export function rider(g, P, o = {}) {
  const ph = o.ph || 0, rim = o.rim, bob = o.bob || 0, wind = o.wind ?? 1, old = !!o.old;
  const J = old ? P.leather : P.teal, PT = old ? P.pants : P.jeans;
  g.save(); g.translate(0, bob * .4); bike(g, P, o); g.restore();
  if (o.noRider) return;
  g.save(); g.translate(0, bob);
  if (old) for (let k = 0; k < 2; k++) {   // 围巾尾巴
    const sp = flutter(-14, -494 + k * 8, (Math.PI - .04 + k * .08) * wind + (Math.PI / 2 + .3) * (1 - wind), (280 - k * 60) * (.5 + .5 * wind), 16, (18 + k * 6) * wind + 3, 1.35, ph * TAU + k * 2.1, -(20 + k * 18) * wind);
    cel(g, ribbon(sp, u => 30 - u * 10 - k * 5), { f: k ? P.teal.s : P.teal.f, s: P.teal.s, so: [0, -8], h: P.teal.h, ho: [0, 3], l: P.teal.l, lw: 2, rim });
  }
  // 腿
  cel(g, limb([-100, -326], [46, -300], 62, 50), { f: PT.f, s: PT.s, so: [0, -12], h: PT.h, ho: [0, 4], l: PT.l, lw: 2.2, rim });
  cel(g, limb([46, -300], [0, -186], 48, 36), { f: PT.f, s: PT.s, so: [-9, 0], l: PT.l, lw: 2.2 });
  cel(g, [[-22, -200], [20, -196], [28, -160], [74, -152], [76, -134], [-24, -136]], { f: P.boot.f, s: P.boot.s, so: [-5, -6], h: P.boot.h, ho: [3, 3], l: P.boot.l, lw: 2 });
  // 躯干
  const torso = [[-142, -318], [-136, -378], [-104, -452], [-62, -504], [-14, -514], [18, -486], [14, -430], [-10, -372], [-36, -312]];
  cel(g, torso, { f: J.f, s: J.s, so: [-10, -22], h: J.h, ho: [4, 7], l: J.l, lw: 2.4, rim,
    clipFn: old ? null : gg => { gg.fillStyle = P.white.f; gg.fill(poly([[-150, -340], [-70, -520], [-56, -514], [-136, -332]])); } });
  line(g, [[-104, -400], [-70, -380]], J.l, 1.6); line(g, [[-90, -350], [-52, -338]], J.l, 1.6);
  // 头 + 头盔
  g.save(); g.translate(2, -584); g.rotate(.06); g.scale(.72, .72);
  head(g, P, { who: old ? 'old' : 'afa', view: 'side', expr: o.expr || (old ? 'smile' : 'cold'), neckEnd: 120, mouth: o.mouth });
  helmet(g, P, { view: 'side', visor: o.visor ?? 0, goggles: old, rim });
  g.restore();
  if (old) cel(g, [[-46, -512], [-6, -520], [20, -500], [10, -480], [-30, -476]], { f: P.teal.f, s: P.teal.s, so: [0, -7], h: P.teal.h, l: P.teal.l, lw: 2 });
  else cel(g, [[-48, -508], [-8, -520], [14, -506], [6, -488], [-36, -482]], { f: P.teal.f, s: P.teal.s, so: [0, -6], l: P.teal.l, lw: 2 });
  // 手臂
  cel(g, limb([-34, -486], [44, -418], 54, 42), { f: J.f, s: J.s, so: [-7, -8], h: J.h, ho: [3, 3], l: J.l, lw: 2.2, rim });
  if (o.salute) {   // 两根手指从车把上抬起来打个招呼
    cel(g, limb([44, -418], [78, -500], 40, 32), { f: J.f, s: J.s, so: [-6, 0], l: J.l, lw: 2.2 });
    cel(g, limb([84, -520], [80, -572], 12, 10), { f: P.glove.f, l: P.glove.l, lw: 2 }); cel(g, limb([92, -518], [102, -566], 12, 10), { f: P.glove.f, l: P.glove.l, lw: 2 });
    const gl = new Path2D(); gl.arc(82, -506, 20, 0, TAU); cel(g, gl, { f: P.glove.f, s: P.glove.s, so: [-3, -4], l: P.glove.l, lw: 2 });
  } else {
  cel(g, limb([44, -418], [96, -430], 40, 32), { f: J.f, s: J.s, so: [0, -8], l: J.l, lw: 2.2 });
  cel(g, [[86, -448], [112, -452], [124, -436], [116, -418], [90, -416]], { f: P.glove.f, s: P.glove.s, so: [-3, -5], h: P.glove.h, ho: [2, 3], l: P.glove.l, lw: 2 });
  }
  g.restore();
}

// 背面（远去 / 第一人称前方的自己）：原点 = 后轮触地点
export function riderBack(g, P, o = {}) {
  const old = !!o.old, J = old ? P.leather : P.teal, rim = o.rim, lean = o.lean || 0, ph = o.ph || 0;
  g.save(); g.rotate(lean);
  const tire = new Path2D(); tire.roundRect(-34, -190, 68, 190, 30); cel(g, tire, { f: P.tire.f, s: P.tire.s, so: [-8, 0], h: P.tire.h, ho: [4, 0], l: P.tire.l, lw: 2.4 });
  cel(g, [[-52, -180], [-44, -232], [44, -232], [52, -180]], { f: P.dark.f, s: P.dark.s, so: [0, -8], l: P.dark.l, lw: 2 });
  for (const s of [-1, 1]) { cel(g, limb([s * 60, -150], [s * 76, -40], 26, 30), { f: P.chrome.f, s: P.chrome.s, so: [-5, 0], h: P.chrome.h, ho: [2, 0], l: P.chrome.l, lw: 1.8 }); }
  // 腿
  for (const s of [-1, 1]) { cel(g, limb([s * 60, -270], [s * 104, -150], 60, 44), { f: (old ? P.pants : P.jeans).f, s: (old ? P.pants : P.jeans).s, so: [-8, 0], l: (old ? P.pants : P.jeans).l, lw: 2.2 }); cel(g, poly([[s * 86, -160], [s * 124, -160], [s * 128, -120], [s * 84, -120]]), { f: P.boot.f, s: P.boot.s, so: [-4, 0], l: P.boot.l, lw: 2 }); }
  cel(g, [[-90, -250], [-70, -296], [70, -296], [90, -250], [60, -226], [-60, -226]], { f: P.seat.f, s: P.seat.s, so: [0, -8], l: P.seat.l, lw: 2 });
  if (o.pack) { const pk = new Path2D(); pk.roundRect(-96, -340, 192, 70, 30); cel(g, pk, { f: P.leather.f, s: P.leather.s, so: [-10, -8], h: P.leather.h, ho: [0, 4], l: P.leather.l, lw: 2 }); line(g, [[-50, -340], [-50, -270]], P.cream.f, 6); line(g, [[50, -340], [50, -270]], P.cream.f, 6); }
  const tl = new Path2D(); tl.roundRect(-30, -228, 60, 22, 8); cel(g, tl, { f: '#ff4050', l: '#5a0a14', lw: 1.6 });
  // 手臂 + 把手 + 后视镜
  for (const s of [-1, 1]) {
    line(g, [[s * 90, -470], [s * 190, -452]], P.chrome.f, 8);
    cel(g, limb([s * 96, -520], [s * 150, -440], 56, 42), { f: J.f, s: J.s, so: [-8, -6], l: J.l, lw: 2.2, rim });
    const gl = new Path2D(); gl.arc(s * 160, -448, 22, 0, TAU); cel(g, gl, { f: P.glove.f, s: P.glove.s, so: [-4, -4], l: P.glove.l, lw: 2 });
    line(g, [[s * 176, -456], [s * 196, -540]], P.chrome.l, 4); const mr = new Path2D(); mr.ellipse(s * 204, -556, 28, 18, s * .2, 0, TAU); cel(g, mr, { f: P.chrome.f, s: P.chrome.s, so: [-4, -4], l: P.chrome.l, lw: 2 });
  }
  // 躯干
  cel(g, [[-84, -270], [-112, -420], [-116, -516], [-70, -560], [70, -560], [116, -516], [112, -420], [84, -270]], { f: J.f, s: J.s, so: [-18, -10], h: J.h, ho: [5, 5], l: J.l, lw: 2.4, rim,
    clipFn: old ? null : gg => { gg.fillStyle = P.white.f; gg.fillRect(-130, -470, 260, 16); } });
  line(g, [[0, -540], [0, -280]], J.l, 1.6);
  if (old) for (let k = 0; k < 2; k++) { const sp = flutter(10 - k * 20, -560, Math.PI / 2 + (k ? .5 : -.4) + Math.sin(ph * TAU + k) * .2, 150 - k * 30, 10, 14, 1.2, ph * TAU + k * 2, 0); cel(g, ribbon(sp, u => 30 - u * 8), { f: k ? P.teal.s : P.teal.f, s: P.teal.s, so: [-4, -4], l: P.teal.l, lw: 2 }); }
  // 头盔
  const hm = new Path2D(); hm.ellipse(0, -636, 84, 90, 0, 0, TAU);
  cel(g, hm, { f: P.white.f, s: P.white.s, so: [-14, -10], h: P.white.h, ho: [5, 5], l: P.white.l, lw: 2.4, rim,
    clipFn: gg => { gg.fillStyle = P.teal.f; gg.fillRect(-100, -676, 200, 20); gg.fillStyle = P.teal.s; gg.fillRect(-100, -662, 200, 6); } });
  cel(g, [[-60, -580], [0, -566], [60, -580], [50, -556], [-50, -556]], { f: P.teal.f, s: P.teal.s, so: [0, -6], l: P.teal.l, lw: 2 });
  g.restore();
}
