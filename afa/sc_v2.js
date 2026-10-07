// 主歌 2：样板间橱窗、资本设计的关卡、低头的一排、白天、买车、安静的屋子、通宵游戏；以及两段副歌里的插入镜头（酒盅、沙堡）
import { W, H, TAU, rgba, mix, path, poly, cel, line, hash, rng, vgrad, airbrush, canvas,
  clamp, lerp, seg, ss, eio, eo, ei, back, spring, q12, q8, f12, f8, setCam, celLayer, plate, cached, drawPlate, loopPlate,
  text, neon, neonRect, flash, impact, shake, limb, F, tag } from './stage.js';
import { ribbon, flutter, LWK } from './cel.js';
import { PAL, TEAL, RED } from './pal.js';
import { head, figure, SUITC, CASUALC, poseLerp, handFlat, sleeve } from './people.js';
import { rider, bike, LAMPS } from './bike.js';
import { speedLines, flare, lamp, rain } from './fx.js';
import { cumulus, gulls, speck, NEON, noonClouds } from './sc_ride.js';
import { carKey, cup as coffeeCup, steam } from './sc_cafe.js';

const WALK = [{ lean: .06, th: [.42, -.38], kn: [.1, .5], ua: [-.3, .3], fa: [.3, .5] }, { lean: .06, th: [-.38, .42], kn: [.5, .1], ua: [.3, -.3], fa: [.5, .3] }];
const walkPose = ph => ph < .5 ? poseLerp(WALK[0], WALK[1], ph * 2) : poseLerp(WALK[1], WALK[0], ph * 2 - 1);
function house(g, x, y, s, o = {}) {   // 小房子（样板间模型 / 背在身上的房贷）
  g.save(); g.translate(x, y); g.scale(s, s);
  cel(g, poly([[-110, 0], [110, 0], [110, -130], [-110, -130]]), { f: o.wall || '#fff3e0', s: '#d8c4b0', so: [-20, 0], l: '#4a3040', lw: 4 });
  cel(g, poly([[-140, -126], [0, -230], [140, -126]]), { f: o.roof || '#e8506a', s: '#a82f4c', so: [-20, 0], l: '#4a1020', lw: 4 });
  cel(g, poly([[-24, 0], [24, 0], [24, -70], [-24, -70]]), { f: '#8a5a3c', l: '#3e2414', lw: 3 }); for (const wx of [-78, 52]) cel(g, poly([[wx, -100], [wx + 36, -100], [wx + 36, -60], [wx, -60]]), { f: '#ffe28a', l: '#4a3040', lw: 3 });
  cel(g, poly([[60, -190], [84, -190], [84, -236], [60, -236]]), { f: '#b8a0a0', l: '#4a3040', lw: 3 });
  if (o.label) tag(g, 0, -168, o.label.length * 44 + 30, 56, { f: '#fff', l: '#4a1020', text: o.label, col: '#c8202e', size: 40, fam: F.zh });
  g.restore();
}

// 1 —— 阿发不需要那个「家」：他从样板间的橱窗前走过，没有停 ——
export function showroom(S) {
  const { g, e, t, lt, u } = S, P = PAL.night;
  const Pl = plate('showroom', 2400, H, (c, ce) => {
    vgrad(c, 0, 0, 2400, H, [[0, '#0c0a24'], [.6, '#241848'], [1, '#140e26']]);
    c.fillStyle = '#1c1634'; c.fillRect(0, 60, 2400, 820); c.fillStyle = '#2a2248'; c.fillRect(0, 880, 2400, 26);
    vgrad(c, 0, 906, 2400, 180, [[0, '#18102c'], [1, '#0b0716']]);
    // 橱窗：冷白的光
    const wp = new Path2D(); wp.rect(420, 170, 1500, 650);
    vgrad(c, 420, 170, 1500, 650, [[0, '#b8d4f0'], [1, '#7fa4d8']]); ce.fillStyle = rgba('#cfe6ff', .1); ce.fill(wp);
    c.fillStyle = '#eef6ff'; c.fillRect(420, 720, 1500, 100);
    // 玻璃罩下的小房子
    cel(c, poly([[980, 720], [1380, 720], [1340, 650], [1020, 650]]), { f: '#fbfbff', s: '#c0c8e0', so: [0, -12], l: '#56628a', lw: 4 });
    house(c, 1180, 650, 1.15);
    c.strokeStyle = rgba('#ffffff', .9); c.lineWidth = 5; c.beginPath(); c.moveTo(1000, 650); c.lineTo(1000, 430); c.arc(1180, 430, 180, Math.PI, 0); c.lineTo(1360, 650); c.stroke(); c.fillStyle = rgba('#ffffff', .22); c.fill(poly([[1040, 640], [1080, 640], [1130, 280], [1100, 270]]));
    for (const x of [600, 1680]) { cel(c, poly([[x - 60, 720], [x + 60, 720], [x + 40, 520], [x - 40, 520]]), { f: '#6fb86a', s: '#3e8a4a', so: [-14, 0], l: '#1e4a2a', lw: 4 }); cel(c, poly([[x - 50, 820], [x + 50, 820], [x + 40, 720], [x - 40, 720]]), { f: '#e8d8c0', l: '#56628a', lw: 4 }); }
    tag(c, 1650, 330, 300, 120, { f: '#e8304a', l: '#5a0f20', text: '0 首付', col: '#fff0a0', size: 78, fam: F.zh, r: 14 });
    c.strokeStyle = '#141024'; c.lineWidth = 18; c.strokeRect(420, 170, 1500, 650); c.fillStyle = '#141024'; c.fillRect(1160, 170, 14, 80);
    for (const cc of [ce]) { cc.strokeStyle = '#000'; cc.lineWidth = 18; cc.strokeRect(420, 170, 1500, 650); }
    neon(c, ce, '「家」', 1170, 110, 110, '#ff3fa4');
    vgrad(c, 300, 880, 1740, 200, [[0, rgba('#cfe6ff', .35)], [1, rgba('#cfe6ff', 0)]]);
  });
  const ax = lerp(560, 1560, u), cx = lerp(900, 1500, u);
  setCam(S, cx, H / 2, 1);
  drawPlate(S, Pl, 0, 0);
  S.txt('jia', '「家」', 1010, 50, 1330, 170); S.txt('shoufu', '0 首付', 1500, 270, 1800, 390);
  const ph = (f12(lt) % 8) / 8, C = CASUALC(P);
  // 玻璃上的倒影（淡，镜像）
  celLayer(S, c => { c.translate(ax + 60, 640); c.scale(.92, .92); figure(c, C, walkPose(ph), {}); }, { alpha: .22, occlude: false });
  g.save(); g.fillStyle = rgba('#05030c', .5); g.beginPath(); g.ellipse(ax, 968, 100, 12, 0, 0, TAU); g.fill(); g.restore();
  celLayer(S, c => { c.translate(ax, 730 - Math.abs(Math.sin(ph * TAU)) * 8); c.scale(1.04, 1.04); figure(c, C, walkPose(ph), { rim: { c: '#cfe6ff', d: [0, -4] } }); });
  return { bloom: .9 };
}

// 2 / 3 —— 那是资本精心设计的关卡 / 一旦背上房贷有了那个娃 ——
export function level(S, o) {
  const { g, e, t } = S, tl = t - o.t0, fr = f12(t);
  const z = o.close ? lerp(1.0, 1.12, eio(seg(S.u, 0, 1))) : lerp(.78, 1, eo(seg(S.lt, 0, .9)));
  setCam(S, W / 2, H / 2 + (o.close ? 60 : 0), z);
  // 街机外壳（一开始看得见，推进去之后出画）
  g.fillStyle = '#0a0814'; g.fillRect(-400, -300, W + 800, H + 600);
  const sp = new Path2D(); sp.roundRect(0, 0, W, H, 60);
  g.save(); g.clip(sp);
  vgrad(g, 0, 0, W, H, [[0, '#0e1440'], [.7, '#2a1f6a'], [1, '#4a2a7a']]);
  g.strokeStyle = rgba('#5a6ad8', .25); g.lineWidth = 2; for (let x = -((tl * 60) % 120); x < W; x += 120) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 760); g.stroke(); } for (let y = 40; y < 760; y += 120) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  const house_d = t - o.house, pram_d = t - o.pram;
  const load = clamp(house_d * 4) * .55 + clamp(pram_d * 4) * .45, spd = lerp(520, 150, load), sx = -(Math.min(tl, o.house - o.t0) * 520 + Math.max(0, house_d) * lerp(520, 150, clamp(house_d * 2)) * 1) ;
  // 地面砖 + 坑 + 尖刺 + 金币 + 越来越远的旗子
  const GYv = 800;
  for (let k = -1; k < 14; k++) { const x = ((sx % 160) + 160) % 160 + k * 160 - 160, id = Math.round((x - sx) / 160); if (((id % 9) + 9) % 9 === 6) { for (let j = 0; j < 4; j++) { g.fillStyle = '#ff5a7a'; g.fill(poly([[x + j * 40, GYv + 110], [x + j * 40 + 20, GYv + 30], [x + j * 40 + 40, GYv + 110]])); } continue; }
    cel(g, poly([[x, GYv], [x + 160, GYv], [x + 160, GYv + 110], [x, GYv + 110]]), { f: '#c8703a', s: '#8a4428', so: [0, -18], l: '#3a1a10', lw: 4 }); g.fillStyle = '#3a1a10'; g.fillRect(x + 76, GYv + 4, 4, 50); g.fillRect(x, GYv + 54, 160, 4);
    if (((id % 5) + 5) % 5 === 2) for (const c of [g, e]) { c.fillStyle = c === g ? '#ffd86a' : rgba('#ffc040', .5); c.beginPath(); c.ellipse(x + 80, GYv - 260 + Math.sin(fr * .8 + id) * 10, 30 * Math.abs(Math.cos(fr * .5 + id)) + 6, 38, 0, 0, TAU); c.fill(); } }
  g.fillStyle = '#3a1a10'; g.fillRect(0, GYv + 110, W, 400);
  { const fx = 1660 + Math.sin(tl * 2) * 20; g.fillStyle = '#e8e8f8'; g.fillRect(fx, 420, 10, 380); cel(g, poly([[fx + 10, 424], [fx + 150, 464], [fx + 10, 508]]), { f: '#4dff9a', s: '#2a9a5a', so: [0, -10], l: '#0a3a20', lw: 3 }); text(g, '幸福', fx + 60, 468, { size: 40, col: '#0a3a20', fam: F.zh }); text(g, '→ 还很远', fx - 30, 390, { size: 40, col: '#bcd0ff', fam: F.zh }); }
  // 设计关卡的那只手（袖扣是金的）：从上面把尖刺 / 砖块放下来
  if (!o.close) { const hk = Math.sin(tl * Math.PI / .5825) * .5 + .5; celLayer(S, c => { c.translate(1240, 150 + hk * 60); c.rotate(Math.PI / 2 + .1); c.scale(.82, .82); c.translate(-140, 0); sleeve(c, PAL.day.dark, PAL.day.shirt, 900, { button: '#ffd86a' }); handFlat(c, PAL.cold.skin, { curl: .5, spread: .1 }); });
    g.fillStyle = '#ff5a7a'; g.fill(poly([[1200, 470 + hk * 60], [1240, 400 + hk * 60], [1280, 470 + hk * 60]])); }
  // 小人：跑 → 背上房子（弯腰）→ 挂上婴儿车（更慢）
  const C = SUITC(PAL.day), px = o.close ? 760 : 620, ph = ((fr / lerp(6, 14, load)) % 1), bend = load * .62;
  const pose = { ...walkPose(ph), lean: .1 + bend };
  celLayer(S, c => {
    c.translate(px, GYv - 232 + load * 14); c.scale(1.0, 1.0);
    if (pram_d > 0) { const k = back(clamp(pram_d * 4), 2); c.save(); c.translate(-250 * k - 60, 150); cel(c, [[-90, -40], [-80, 30], [60, 30], [90, -70], [0, -90]], { f: '#ffb0c8', s: '#d87a98', so: [-10, 0], l: '#5a2038', lw: 4 }); for (const wx of [-50, 40]) { const w = new Path2D(); w.arc(wx, 60, 26, 0, TAU); cel(c, w, { f: '#2a2434', l: '#0a0810', lw: 3 }); } line(c, [[90, -70], [170, -120]], '#5a2038', 6); tag(c, 0, -130, 90, 60, { f: '#fff', l: '#5a2038', text: '娃', col: '#c8202e', size: 44, fam: F.zh }); c.restore(); }
    figure(c, C, pose, { tieSwing: .2 });
    if (house_d > 0) { const k = house_d < .25 ? ei(house_d / .25) : 1, by = lerp(-900, -150, k) + (house_d > .25 ? -Math.abs(Math.sin((house_d - .25) * 14)) * 26 * Math.exp(-(house_d - .25) * 6) : 0); c.save(); c.translate(-30 + bend * 90, by); c.rotate(bend * .7); house(c, 0, 0, 1.15, { label: '房贷' }); c.restore(); }
  });
  g.restore();
  // HUD（街机屏幕上的字）
  if (o.close) setCam(S);
  g.save(); g.clip(sp);
  text(g, 'STAGE 3', 150, 80, { size: 56, col: '#ffffff', fam: F.it, wt: 'italic 900', align: 'left' }); text(g, '成家', 430, 82, { size: 56, col: '#ffd86a', fam: F.zh, align: 'left' });
  text(g, 'TIME  30 年', W - 150, 80, { size: 56, col: '#ffffff', fam: '"Barlow SC","Noto SC"', wt: 700, align: 'right' });
  text(g, '负重', 150, 168, { size: 44, col: '#ff9ab0', fam: F.zh, align: 'left' });
  g.strokeStyle = '#ffffff'; g.lineWidth = 4; g.strokeRect(260, 146, 520, 40); const lw = 512 * clamp(load * 1.0 + .08 * Math.sin(fr)); g.fillStyle = load > .9 ? '#ff3050' : '#ff9ab0'; g.fillRect(264, 150, lw, 32); e.fillStyle = rgba('#ff3050', load > .9 ? .5 : .2); e.fillRect(264, 150, lw, 32);
  if (load > .95 && fr % 4 < 2) text(g, 'MAX', 830, 168, { size: 48, col: '#ff3050', fam: F.it, wt: 'italic 900', align: 'left' });
  g.restore();
  S.txt('stage', 'STAGE 3 成家', 150, 44, 560, 116);
  if (!o.close) setCam(S, W / 2, H / 2, z);
  // 屏幕玻璃的弧形反光 + 外壳边
  if (!o.close) { g.strokeStyle = '#2a2440'; g.lineWidth = 50; g.stroke(sp); g.strokeStyle = '#5a4a7a'; g.lineWidth = 6; const s2 = new Path2D(); s2.roundRect(-30, -30, W + 60, H + 60, 80); g.stroke(s2); }
  return { bloom: 1, scan: .26, sat: 1.15 };
}

// 4 —— 这辈子只能低头做谁的犬牙 ——
export function bow(S, o) {
  const { g, e, t, lt, u } = S, P = PAL.cold, fr = f12(t), dh = t - o.hand, du = t - o.unbow;
  const Pl = plate('office', W, 2000, (c, ce) => {
    vgrad(c, 0, 0, W, 2000, [[0, '#0e1226'], [.5, '#28344e'], [1, '#3a465e']]);
    // 上面：云里伸下来的手所在的冷光
    airbrush(c, 960, 380, 900, 520, '#b8d0ff', .3); airbrush(ce, 960, 360, 500, 300, '#b8d0ff', .18);
    c.save(); c.filter = 'blur(14px)'; const R = rng(15); for (let i = 0; i < 14; i++) { c.fillStyle = rgba('#5a6a94', .6); c.beginPath(); c.ellipse(R() * W, 80 + R() * 500, 300 + R() * 300, 50, 0, 0, TAU); c.fill(); } c.restore();
    // 下面：办公室，一排日光灯，隔间
    for (let k = 0; k < 5; k++) { c.fillStyle = '#e8f4ff'; c.fillRect(160 + k * 380, 1100, 220, 14); ce.fillStyle = rgba('#cfe6ff', .7); ce.fillRect(160 + k * 380, 1100, 220, 14); const lg = c.createLinearGradient(0, 1110, 0, 1700); lg.addColorStop(0, rgba('#cfe6ff', .16)); lg.addColorStop(1, rgba('#cfe6ff', 0)); c.fillStyle = lg; c.fill(poly([[160 + k * 380, 1114], [380 + k * 380, 1114], [520 + k * 380, 1800], [20 + k * 380, 1800]])); }
    c.fillStyle = '#1e2638'; c.fillRect(0, 1840, W, 160); c.fillStyle = '#4a5a78'; c.fillRect(0, 1836, W, 6);
    for (let k = 0; k < 6; k++) { c.fillStyle = '#2a3448'; c.fillRect(40 + k * 330, 1560, 250, 280); c.fillStyle = '#18202e'; c.fillRect(40 + k * 330, 1560, 250, 14); c.fillStyle = rgba('#8fb8ff', .5); c.fillRect(110 + k * 330, 1600, 110, 80); ce.fillStyle = rgba('#8fb8ff', .25); ce.fillRect(110 + k * 330, 1600, 110, 80); }
  });
  const up = eio(seg(dh, -.3, 1.3)) - .55 * eio(seg(du, -.2, 1.2)), cy = lerp(1500, 860, clamp(up)), panx = lerp(-120, 120, seg(lt, 0, o.hand - (t - lt)));
  setCam(S, W / 2 + (dh < 0 ? panx : lerp(panx, 0, clamp(dh))), cy, 1);
  drawPlate(S, Pl, 0, 0);
  const HX = 960, HY = 700;
  // 牵绳
  const men = [0, 1, 2, 3, 4].map(i => 300 + i * 330), tug = dh > 0 ? Math.max(0, Math.sin((dh) * Math.PI / .5825)) ** 4 : 0;
  const free = clamp(du / .5);
  men.forEach((mx, i) => {
    const me = i === 2, bowk = clamp((lt - .3 - i * .29) * 3) * (me ? 1 - eio(free) : 1), lean = .15 + bowk * (.95 + tug * .12);
    const nx = mx + Math.sin(lean) * 150 + 8, ny = 1610 - Math.cos(lean) * 150 - 20;
    if (!(me && free > .2)) { g.strokeStyle = rgba('#d8e0f0', .85); g.lineWidth = 4; g.beginPath(); g.moveTo(nx, ny); g.quadraticCurveTo(lerp(nx, HX, .5), lerp(ny, HY, .5) + 160 - tug * 150, HX - 60 + i * 30, HY + 150); g.stroke(); }
    else { const k = seg(du, .1, .9); g.strokeStyle = rgba('#d8e0f0', .85 * (1 - k)); g.lineWidth = 4; g.beginPath(); g.moveTo(HX - 60 + i * 30, HY + 150); g.quadraticCurveTo(HX + 100 * k, 900, HX + 60 * Math.sin(k * 9), 1200 + k * 300); g.stroke(); }
    const C = { top: P.suit, bottom: P.suit, shoe: P.dark, skin: P.skin, hair: P.hair, tie: me ? PAL.day.teal : { f: '#8a2a3a', s: '#5a1826', l: '#2a0810' } };
    celLayer(S, c => { c.translate(mx, 1610); figure(c, C, { lean, th: [.04, -.04], kn: [.0, .0], ua: [lean * .9, lean * .7], fa: [.1, .1], headTilt: bowk * .5 - (me ? free * .3 : 0) }, { rim: { c: '#cfe6ff', d: [0, -4] } });
      if (!(me && free > .2)) { const cx = Math.sin(lean) * 150 + 6, cyy = -Math.cos(lean) * 150 - 22; cel(c, limb([cx - 16, cyy - 4], [cx + 20, cyy + 4], 12, 12), { f: '#d83040', l: '#5a0f20', lw: 2 }); } });
  });
  // 那只巨大的手
  celLayer(S, c => { c.translate(HX + 320, HY - 330 + tug * -50); c.rotate(Math.PI / 2 + .25); c.scale(2.3, 2.3); c.translate(-140, 0); sleeve(c, PAL.cold.dark, PAL.cold.shirt, 900, { button: '#ffd86a' }); handFlat(c, PAL.cold.skin, { curl: .7, spread: .0, thumb: 1 });
    const rg = new Path2D(); rg.roundRect(186, 0, 30, 46, 8); cel(c, rg, { f: '#ffd86a', s: '#b88a2a', so: [0, -8], l: '#4d3210', lw: 2 }); });
  if (du > 0 && du < 2 / 24) flash(S, .35);
  return { bloom: .85, sat: .92, shadowTint: [.08, .1, .22] };
}

// 5 —— 后来故事发展更潇洒：第一次出现白天；西装挂上了衣钩，青绿色成了他的衣服 ——
export function day(S) {
  const { g, e, t, lt, u } = S, P = PAL.day, fr = f12(t);
  const Pl = plate('doorway', W, H, (c) => {
    vgrad(c, 0, 0, W, H, [[0, '#f0e6d2'], [1, '#d8c8ae']]);
    // 敞开的门：外面是蓝天
    const dp = new Path2D(); dp.rect(760, 60, 760, 1100);
    c.save(); c.clip(dp); vgrad(c, 760, 60, 760, 900, [[0, '#2f6fe0'], [.7, '#8fc8f8'], [1, '#dff4ff']]); const R = rng(3); cumulus(c, 1300, 760, 1.8, '#ffffff', '#a9c0ee', R, false); cumulus(c, 900, 420, .8, '#ffffff', '#b4c8f0', R, false);
    c.fillStyle = '#6fb86a'; c.fill(path([[760, 900], [900, 840], [1100, 870], [1300, 830], [1520, 880], [1520, 1100], [760, 1100]])); c.restore();
    c.strokeStyle = '#8a6a50'; c.lineWidth = 26; c.strokeRect(760, 60, 760, 1100);
    cel(c, poly([[1533, 50], [1840, 110], [1840, 1100], [1533, 1100]]), { f: '#b8845a', s: '#8a5a3c', so: [-30, 0], l: '#3e2414', lw: 5 });
    // 墙上的衣钩
    c.fillStyle = '#8a6a50'; c.fillRect(180, 300, 460, 22); for (const x of [250, 410, 570]) { c.strokeStyle = '#4a3420'; c.lineWidth = 10; c.beginPath(); c.moveTo(x, 322); c.lineTo(x, 360); c.arc(x + 16, 360, 16, Math.PI, 0, true); c.stroke(); }
    const lg = c.createLinearGradient(760, 0, 0, 0); lg.addColorStop(0, rgba('#ffffff', .5)); lg.addColorStop(1, rgba('#ffffff', 0)); c.fillStyle = lg; c.fill(poly([[760, 300], [760, 1100], [0, 1100], [0, 760]]));
  });
  setCam(S, lerp(W / 2, 1010, eio(u)), H / 2, lerp(1, 1.1, eio(u)));
  drawPlate(S, Pl, 0, 0);
  // 西装外套：飞过去，挂上（落在拍点上）
  const k = seg(q12(lt), .25, .85), jx = lerp(1040, 410, eo(k)), jy = lerp(520, 520, k) - Math.sin(k * Math.PI) * 300, jr = lerp(-1.2, 0, eo(k)), sw = k >= 1 ? Math.sin((lt - .85) * 9) * .12 * Math.exp(-(lt - .85) * 2.5) : 0;
  celLayer(S, c => { c.translate(jx, k >= 1 ? 360 : jy); c.rotate(jr + sw); const SU = P.suit;
    for (const s of [-1, 1]) cel(c, [[s * 110, 10, 1], [s * 190, 80], [s * 200, 400], [s * 140, 410, 1], [s * 130, 120]], { f: SU.s, s: mix(SU.s, '#000000', .3), so: [-10, 0], l: SU.l, lw: 3 });
    cel(c, [[-110, 0, 1], [-140, 90], [-130, 470, 1], [130, 470, 1], [140, 90], [110, 0, 1], [40, 26], [-40, 26]], { f: SU.f, s: SU.s, so: [-24, -10], h: SU.h, ho: [6, 6], l: SU.l, lw: 3 });
    cel(c, [[-40, 26, 1], [0, 230, 1], [-78, 150, 1], [-56, 130, 1]], { f: SU.s, l: SU.l, lw: 2 }); cel(c, [[40, 26, 1], [0, 230, 1], [78, 150, 1], [56, 130, 1]], { f: SU.s, l: SU.l, lw: 2 });
    line(c, [[0, 230], [0, 470]], SU.l, 2); for (const y of [290, 370]) { c.fillStyle = SU.l; c.beginPath(); c.arc(14, y, 7, 0, TAU); c.fill(); } });
  celLayer(S, c => { c.translate(1130, 470); c.scale(1.9, 1.9); head(c, P, { expr: f8(lt) === 12 ? 'closed' : 'smirk', body: 'jacket', wind: 1, ph: (fr % 6) / 6, rim: { c: '#ffffff', d: [3, 0] } }); });
  S.e.save(); S.e.setTransform(1, 0, 0, 1, 0, 0); flare(S.e, 1420, 140, .8, '#fff6d8', { rot: .2 }); S.e.restore();
  return { bloom: .5, halo: .08, shadowTint: [.12, .12, .24] };
}

// 6 —— 阿发买了摩托这周末就出发：三个快切（车 / 日历 / 钥匙）——
export function buy(S, o) {
  const { g, e, t } = S, P = PAL.day, [c0, c1, c2] = o.cuts;
  if (t < c1) {   // 车行里的车：高光沿油箱滑过，「已售」贴上去
    const lt = t - c0, d = c1 - c0;
    setCam(S, lerp(900, 1000, lt / d), 560, lerp(1.25, 1.1, lt / d));
    vgrad(g, 0, 0, W, H, [[0, '#f0ead8'], [.7, '#d8ccb0'], [1, '#a89a80']]);
    for (let k = 0; k < 6; k++) { g.fillStyle = rgba('#8a7a5c', .2); g.fillRect(k * 340 - 60, 0, 12, 800); } g.fillStyle = '#8a7a64'; g.fillRect(0, 800, W, 300); g.fillStyle = '#6a5c4a'; g.fillRect(0, 796, W, 8);
    cel(g, poly([[1300, 150], [1760, 150], [1760, 420], [1300, 420]]), { f: '#3a4a5a', l: '#1a2028', lw: 6 }); for (let k = 0; k < 5; k++) line(g, [[1340 + k * 90, 190], [1340 + k * 90, 380 - (k % 2) * 60]], '#c8d0e0', 10);
    g.fillStyle = rgba('#2a2038', .3); g.beginPath(); g.ellipse(960, 806, 420, 20, 0, 0, TAU); g.fill();
    celLayer(S, c => { c.translate(960, 800); c.scale(1.05, 1.05); rider(c, P, { noRider: true, wheelA: .3, speed: 0, lampOn: false }); });
    const hl = seg(lt, .1, .9); if (hl > 0 && hl < 1) { S.e.save(); S.e.setTransform(S.M); S.e.globalAlpha = Math.sin(hl * Math.PI); flare(S.e, lerp(920, 1140, hl), lerp(480, 420, hl), .4, '#ffffff', { ghosts: false, streak: 300 }); S.e.restore(); }
    const sd = lt - (d - .62); if (sd > 0) { const s = sd < 3 / 24 ? [1.6, 1.25, .95][Math.floor(sd * 24)] : 1; celLayer(S, c => { c.translate(1330, 640); c.rotate(.14); c.scale(s, s); tag(c, 0, 0, 200, 150, { f: '#e8304a', l: '#5a0f20', r: 16 }); c.strokeStyle = '#fff0a0'; c.lineWidth = 22; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(-56, 4); c.lineTo(-14, 42); c.lineTo(60, -40); c.stroke(); }); if (sd < 1 / 24) flash(S, .4); }
    return { bloom: .5, halo: .08 };
  }
  if (t < c2) {   // 日历：周六被青绿色的笔圈起来
    const lt = t - c1, d = c2 - c1;
    setCam(S, W / 2, H / 2, lerp(1.08, 1, lt / d));
    vgrad(g, 0, 0, W, H, [[0, '#e6dcc8'], [1, '#cdbf9c']]);
    const cp = new Path2D(); cp.roundRect(260, 120, 1400, 840, 20); cel(g, cp, { f: '#fffbf0', s: '#e0d6bc', so: [0, -30], l: '#4a3420', lw: 6 });
    g.fillStyle = '#e8304a'; g.fillRect(260, 120, 1400, 150); text(g, '本 周', 960, 200, { size: 96, col: '#fff0c0', fam: F.zh });
    const days = ['一', '二', '三', '四', '五', '六', '日'];
    days.forEach((dd, i) => { const x = 400 + i * 187; text(g, dd, x, 400, { size: 80, col: i > 4 ? '#e8304a' : '#4a3420', fam: F.zh }); g.strokeStyle = rgba('#4a3420', .3); g.lineWidth = 3; g.strokeRect(x - 86, 470, 172, 380); if (i < 5) { text(g, '上班', x, 600, { size: 50, col: rgba('#4a3420', .5), fam: F.zh }); g.strokeStyle = '#8a8a9a'; g.lineWidth = 6; g.beginPath(); g.moveTo(x - 60, 720); g.lineTo(x + 60, 780); g.moveTo(x + 60, 720); g.lineTo(x - 60, 780); g.stroke(); } });
    const k = seg(q12(lt), .08, .5), x6 = 400 + 5 * 187;
    for (const c of [g, e]) { c.save(); c.strokeStyle = c === g ? TEAL : rgba(TEAL, .5); c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.ellipse(x6, 400, 96, 80, -.1, -1.2, -1.2 + k * (TAU + .5)); c.stroke(); c.restore(); }
    if (k >= 1) { for (const c of [g, e]) { c.save(); c.strokeStyle = c === g ? TEAL : rgba(TEAL, .5); c.lineWidth = 14; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x6 - 70, 640); c.lineTo(x6 + 50, 640); c.moveTo(x6 + 10, 600); c.lineTo(x6 + 56, 640); c.lineTo(x6 + 10, 680); c.stroke(); c.restore(); } }
    return { bloom: .45, halo: .06 };
  }
  // 钥匙落进手心
  const lt = t - c2, d = S.shot.t1 - c2;
  setCam(S, W / 2, H / 2, lerp(1, 1.1, lt / d));
  vgrad(g, 0, 0, W, H, [[0, '#8fc8f8'], [1, '#dff4ff']]); const R = rng(9); cumulus(g, 1400, 900, 2.6, '#ffffff', '#a9c0ee', R, false); cumulus(g, 300, 1000, 2, '#ffffff', '#b4c8f0', R, false);
  const kq = q12(lt), fallk = ei(seg(kq, 0, .34)), ky = lerp(-200, 560, fallk), bounce = kq > .34 ? Math.abs(Math.sin((kq - .34) * 12)) * 40 * Math.exp(-(kq - .34) * 6) : 0, close = ss(seg(kq, .5, .9));
  celLayer(S, c => { c.translate(880, 640); c.rotate(.12); c.scale(1.9, 1.9); c.translate(-140, 0); sleeve(c, P.teal, null, 900); handFlat(c, P.skin, { spread: .3, curl: close * .8, thumb: close });
    line(c, [[60, -30], [130, -10], [150, 40]], mix(P.skin.l, P.skin.f, .4), 2); line(c, [[40, 20], [110, 30]], mix(P.skin.l, P.skin.f, .4), 2); });
  celLayer(S, c => { c.translate(960, ky - bounce + 40); c.rotate(-.5 + (1 - fallk) * 3); c.scale(1.3, 1.3); carKey(c, P, { moto: true }); });
  if (kq > .34 && kq < .34 + 2 / 12) { S.e.save(); S.e.setTransform(1, 0, 0, 1, 0, 0); flare(S.e, 1040, 560, .7, '#ffffff', { ghosts: false }); S.e.restore(); }
  return { bloom: .5, halo: .08 };
}

// 7 —— 没有人碎碎念也没有那低气压 ——
export function quiet(S, o) {
  const { g, e, t, lt, u } = S, P = PAL.dawn, fr = f12(t);
  const Pl = plate('flat', W, H, (c, ce) => {
    vgrad(c, 0, 0, W, H, [[0, '#6a4a6a'], [.7, '#a86a7a'], [1, '#5a3a50']]);
    // 窗：傍晚
    const wp = new Path2D(); wp.rect(1050, 110, 700, 520); c.save(); c.clip(wp); vgrad(c, 1050, 110, 700, 520, [[0, '#4a4a9a'], [.6, '#ff9a84'], [1, '#ffe0a0']]); c.fillStyle = '#5b3f78'; for (let x = 1050; x < 1750;) { const w = 50 + (x * 7 % 70), h = 100 + (x * 13 % 200); c.fillRect(x, 630 - h, w, h); x += w + 6; } c.restore();
    ce.fillStyle = rgba('#ffc49a', .3); ce.fill(wp);
    c.strokeStyle = '#3a2438'; c.lineWidth = 18; c.strokeRect(1050, 110, 700, 520); c.fillStyle = '#3a2438'; c.fillRect(1392, 110, 16, 520);
    const lg = c.createLinearGradient(1050, 0, 300, 0); lg.addColorStop(0, rgba('#ffd0a0', .3)); lg.addColorStop(1, rgba('#ffd0a0', 0)); c.fillStyle = lg; c.fill(poly([[1050, 630], [1750, 630], [1300, 1080], [200, 1080]]));
    c.fillStyle = '#4a2e44'; c.fillRect(0, 820, W, 270); c.fillStyle = '#7a4a62'; c.fillRect(0, 814, W, 8);
    // 沙发 + 盆栽
    cel(c, [[980, 1080], [1000, 760], [1060, 700], [1780, 700], [1840, 760], [1860, 1080]], { f: '#2a8a8a', s: '#16585e', so: [0, -30], h: '#5fc8c0', ho: [0, 8], l: '#0a3038', lw: 5 });
    cel(c, [[940, 1080], [950, 840], [1000, 810], [1060, 840], [1070, 1080]], { f: '#2a8a8a', s: '#16585e', so: [-16, 0], l: '#0a3038', lw: 5 });
    cel(c, poly([[120, 1080], [150, 900], [330, 900], [360, 1080]]), { f: '#d8843a', s: '#a05a24', so: [-20, 0], l: '#4a2410', lw: 5 }); for (let k = 0; k < 7; k++) { c.save(); c.translate(240, 900); c.rotate(-1 + k * .33); cel(c, [[0, 0, 1], [-34, -160], [0, -330, 1], [34, -160]], { f: '#4a9a5a', s: '#2a6a40', so: [-10, 0], l: '#143a20', lw: 3 }); c.restore(); }
    // 气压计
    const bp = new Path2D(); bp.arc(640, 330, 150, 0, TAU); cel(c, bp, { f: '#fff3e0', s: '#d8c4b0', so: [-16, -12], l: '#3a2438', lw: 8 });
    text(c, '低气压', 548, 400, { size: 40, col: '#5a6a94', fam: F.zh }); text(c, '晴', 746, 400, { size: 56, col: '#e8603a', fam: F.zh });
    for (let k = 0; k < 9; k++) { const a = Math.PI + k * Math.PI / 8; c.strokeStyle = '#3a2438'; c.lineWidth = 4; c.beginPath(); c.moveTo(640 + Math.cos(a) * 120, 330 + Math.sin(a) * 120); c.lineTo(640 + Math.cos(a) * 138, 330 + Math.sin(a) * 138); c.stroke(); }
  });
  setCam(S, lerp(900, 980, u), H / 2, lerp(1.06, 1, eio(u)));
  drawPlate(S, Pl, 0, 0);
  S.txt('baro', '低气压 晴', 480, 360, 800, 440);
  const done = o.pops.filter(p => t >= p).length, na = lerp(Math.PI * 1.12, Math.PI * 1.88, spring(Math.max(0, t - o.pops[3]) * .8, 7, .3)) + (done < 4 ? Math.sin(t * 20) * .03 : 0);
  line(g, [[640, 330], [640 + Math.cos(na) * 112, 330 + Math.sin(na) * 112]], '#e8304a', 8); g.fillStyle = '#3a2438'; g.beginPath(); g.arc(640, 330, 14, 0, TAU); g.fill();
  // 他：瘫在沙发上，脚翘着
  celLayer(S, c => { c.translate(1400, 560 + Math.sin(f8(t) * .5) * 3); c.scale(1.25, 1.25); c.rotate(.1); head(c, P, { expr: done >= 4 ? 'smile' : done > 0 ? 'smirk' : 'bored', E: done >= 4 ? { laugh: true } : {}, body: 'tee' }); });
  // 挤过来的唠叨（没有字，只有波浪线和感叹号）：一拍爆一个
  const BL = [[420, 700, 520, 300, 1], [1180, 300, 480, 280, -1], [900, 820, 460, 260, 1], [1560, 880, 440, 250, -1]];
  setCam(S);
  BL.forEach(([x, y, w, h, tl], i) => {
    const d = t - o.pops[i];
    if (d < 0) {
      const inn = back(seg(lt, .05 + i * .1, .4 + i * .1), 2), R = rng(i * 9 + 4), jig = (hash(fr + i) - .5) * 8;
      if (inn <= 0) return;
      const pts = []; for (let k = 0; k < 20; k++) { const a = k / 20 * TAU, r = k % 2 ? 1 : .8; pts.push([Math.cos(a) * w / 2 * r, Math.sin(a) * h / 2 * r, 1]); }
      g.save(); g.translate(x + jig, y); g.scale(inn, inn);
      cel(g, pts, { f: '#fffbe8', l: '#3a1410', lw: 5 }); g.fillStyle = '#fffbe8'; g.fill(poly([[tl * w * .2, h * .3], [tl * w * .46, h * .8], [tl * w * .02, h * .4]]));
      g.strokeStyle = '#5a4a6a'; g.lineWidth = 7; g.lineCap = 'round'; for (let r = 0; r < 3; r++) { const pp = []; for (let k = 0; k <= 10; k++) pp.push([-w * .28 + k * w * .05, -h * .18 + r * h * .16 + Math.sin(k * 1.6 + fr * .9 + r) * 9]); g.stroke(path(pp, false)); }
      g.fillStyle = '#e8304a'; g.font = `400 ${h * .34}px ${F.zh}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('!!', w * .3, -h * .04);
      g.restore();
    } else if (d < .42) {   // 爆掉：星形 + 碎片
      const k = d / .42;
      if (d < 2 / 24) { const sp = []; for (let j = 0; j < 20; j++) { const a = j / 20 * TAU, r = j % 2 ? w * .62 : w * .3; sp.push([x + Math.cos(a) * r, y + Math.sin(a) * r * .7, 1]); } for (const c of [g, e]) { c.fillStyle = c === g ? '#ffffff' : rgba('#fff0c0', .6); c.fill(path(sp)); } }
      for (let j = 0; j < 10; j++) { const a = j / 10 * TAU + i; g.fillStyle = rgba('#fffbe8', 1 - k); g.save(); g.translate(x + Math.cos(a) * (60 + k * 300), y + Math.sin(a) * (40 + k * 200)); g.rotate(a + k * 4); g.fillRect(-16, -10, 32, 20); g.restore(); }
    }
  });
  return { bloom: .7 };
}

// 8 —— 打一通宵游戏也没人敢把他骂（Game over, baby）——
function gameScreen(S, t, over, start, big) {
  const { g, e } = S, fr = f12(t), d = t - over, ds = t - start;
  vgrad(g, 0, 0, W, H, [[0, '#0a1038'], [.7, '#241a6a'], [1, '#4a2a7a']]);
  for (let k = 0; k < 40; k++) { g.fillStyle = rgba('#ffffff', .5); g.fillRect((k * 197 + (d < 0 ? -t * 300 : 0)) % W < 0 ? 0 : ((k * 197 - (d < 0 ? t * 300 : over * 300)) % W + W) % W, (k * 89) % 600, 4, 4); }
  g.fillStyle = '#16c8b8'; g.fillRect(0, 800, W, 16); g.fillStyle = '#0e3a4a'; g.fillRect(0, 816, W, 300);
  for (let k = -1; k < 9; k++) { const x = (((-(d < 0 ? t : over) * 900) % 260) + 260) % 260 + k * 260 - 260; g.fillStyle = '#16c8b8'; g.fillRect(x, 880, 130, 10); }
  if (d < 0) { celLayer(S, c => { c.translate(700, 800 - Math.abs(Math.sin(t * 5)) * 120); c.scale(.62, .62); c.rotate(-.12 * Math.cos(t * 5)); rider(c, PAL.day, { wheelA: t * 30, speed: 1, visor: 0 }); }); text(g, 'SCORE ' + String(Math.floor(t * 137) % 100000).padStart(6, '0'), 120, 90, { size: 60, col: '#ffffff', fam: F.it, wt: 'italic 900', align: 'left' }); text(g, '04:0' + (t < over - 3 ? 7 : 8) + ' AM', W - 120, 90, { size: 60, col: '#ffd86a', fam: F.it, wt: 'italic 900', align: 'right' }); }
  else {
    for (const c of [g, e]) { c.save(); c.fillStyle = c === g ? rgba('#0a0618', .55) : 'rgba(0,0,0,.4)'; c.fillRect(0, 0, W, H); c.restore(); }
    const blink = ds < 0 && fr % 6 < 1 ? 0 : 1;
    if (blink) for (const c of [g, e]) { c.save(); c.font = 'italic 900 250px Kanit'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; if (c === g) { c.strokeStyle = '#ff3fa4'; c.lineWidth = 30; c.strokeText('GAME OVER', W / 2, 380); c.strokeStyle = '#140a2a'; c.lineWidth = 16; c.strokeText('GAME OVER', W / 2, 380); c.fillStyle = '#fff6d8'; c.fillText('GAME OVER', W / 2, 380); } else { c.fillStyle = rgba('#ff3fa4', .7); c.fillText('GAME OVER', W / 2, 380); } c.restore(); }
    S.txt('over', 'GAME OVER', 260, 250, 1660, 510, true);
    text(g, 'CONTINUE ?', W / 2 - 180, 640, { size: 90, col: '#ffffff', fam: F.it, wt: 'italic 900' });
    const sel = ds >= 0; for (const c of [g, e]) { c.save(); c.globalAlpha = c === e ? .6 : 1; const bp = new Path2D(); bp.roundRect(W / 2 + 150, 580, 280, 120, 16); c.fillStyle = sel ? TEAL : 'rgba(0,0,0,0)'; if (sel) c.fill(bp); c.strokeStyle = TEAL; c.lineWidth = 8; c.stroke(bp); c.restore(); }
    text(g, '▶ YES', W / 2 + 290, 642, { size: 80, col: sel ? '#0a2a2c' : '#8ff7ea', fam: '"Barlow SC","Noto SC"', wt: 700 });
    if (sel && ds < 2 / 24) flash(S, .5, '#8ff7ea');
  }
}
export function game(S, o) {
  const { g, e, t, lt, u } = S, P = PAL.tv, fr = f12(t), d = t - o.over;
  if (d >= 0) {   // 推进电视：GAME OVER → CONTINUE? ▶ YES；玻璃上映着他的笑
    const z = lerp(.86, 1, eo(seg(d, 0, .5)));
    setCam(S, W / 2, H / 2, z);
    g.fillStyle = '#0a0812'; g.fillRect(-300, -300, W + 600, H + 600); const sp = new Path2D(); sp.roundRect(0, 0, W, H, 70); g.save(); g.clip(sp);
    gameScreen(S, t, o.over, o.start, true); g.restore();
    g.strokeStyle = '#2a2438'; g.lineWidth = 46; g.stroke(sp);
    celLayer(S, c => { c.translate(380, 760); c.scale(1.5, 1.5); head(c, P, { expr: t >= o.start ? 'laugh' : 'smirk', mouth: t >= o.start ? 'grin' : 'smirk', body: 'tee' }); }, { alpha: .2, occlude: false });
    return { bloom: 1.1, scan: .28, sat: 1.15 };
  }
  // 电视的光打在脸上：一明一暗
  const fl = .75 + .25 * hash(Math.floor(t * 8));
  setCam(S, lerp(W / 2, 900, eio(u)), H / 2, lerp(1, 1.12, eio(seg(lt, 0, o.over - (t - lt)))));
  vgrad(g, 0, 0, W, H, [[0, '#0a0a22'], [1, '#141230']]);
  airbrush(g, 800, 900, 1100, 600, '#3a6ad8', .3 * fl); airbrush(g, 1200, 900, 700, 400, '#ff3fa4', .12 * (1 - fl + .5));
  // 墙上的电子钟：4:07
  { const cp = new Path2D(); cp.roundRect(1380, 170, 360, 150, 14); g.fillStyle = '#0a0812'; g.fill(cp); g.strokeStyle = '#2a2a44'; g.lineWidth = 6; g.stroke(cp); const tx = '4:0' + (t < o.over - 3 ? '7' : '8'); for (const c of [g, e]) { c.save(); c.font = 'italic 900 110px Kanit'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = c === g ? '#ff4050' : rgba('#ff2a40', .7); c.fillText(tx, 1560, 250); c.restore(); } S.txt('clock', tx, 1420, 190, 1700, 310); }
  // 零食：披萨盒 + 汽水罐
  celLayer(S, c => { cel(c, poly([[130, 1090], [200, 960], [560, 960], [600, 1090]]), { f: '#8a6a50', s: '#5a4434', so: [0, -14], l: '#1a1220', lw: 4 }); cel(c, poly([[1560, 1090], [1570, 940], [1650, 940], [1660, 1090]]), { f: '#4a6ad8', s: '#2a3a8a', so: [-10, 0], l: '#0a1030', lw: 4 }); });
  const bands = [{ x: W / 2 + Math.sin(t * 7) * 500, w: 900, col: fr % 5 < 2 ? '#ff6ad0' : '#8fe8ff', a: .16 * fl, ang: 1.57 }];
  const lean = Math.sin(t * 5) * .04;
  const tongue = fr % 24 < 16;
  celLayer(S, c => { c.translate(930 + lean * 300, 470); c.rotate(lean); c.scale(2.05, 2.05);
    head(c, P, { expr: 'resolve', mouth: tongue ? 'smirk' : 'o', look: [Math.sin(t * 5) * .5, .5], body: 'tee', rim: { c: '#8fe8ff', d: [0, 4] } });
    // 手柄
    c.save(); c.translate(-10 + lean * 100, 380); c.rotate(lean * 3);
    cel(c, [[-150, -30], [-120, -56], [120, -56], [150, -30], [160, 40], [110, 60], [70, 20], [-70, 20], [-110, 60], [-160, 40]], { f: '#3a3a52', s: '#1e1e30', so: [0, -12], h: '#6a6a8a', ho: [0, 4], l: '#08080c', lw: 2 });
    for (const [bx, col] of [[80, '#ff4050'], [112, TEAL]]) { c.fillStyle = col; c.beginPath(); c.arc(bx, -18 - (bx === 80 && fr % 3 === 0 ? -3 : 0), 11, 0, TAU); c.fill(); }
    c.fillStyle = '#08080c'; c.fillRect(-116, -24, 44, 12); c.fillRect(-100, -40, 12, 44);
    for (const s of [-1, 1]) { const th = new Path2D(); th.ellipse(s * 96, -4 + (fr % 2) * 3 * (s > 0 ? 1 : 0), 24, 30, s * .4, 0, TAU); cel(c, th, { f: P.skin.f, s: P.skin.s, so: [-4, -6], l: P.skin.l, lw: 1.6 }); }
    c.restore(); }, { bands });
  return { bloom: .9 };
}

// —— 副歌 1 插入：少年的歌不用憋进酒盅啦 ——
export function cup(S, o) {
  const { g, e, t, lt, u } = S, d = t - o.out, fr = f12(t);
  setCam(S, lerp(900, 1000, u), lerp(600, 540, u), lerp(1.15, 1, eio(u)));
  vgrad(g, 0, 0, W, H, [[0, '#120c2a'], [.6, '#2a1648'], [1, '#1a1030']]);
  const R = rng(33); for (let i = 0; i < 44; i++) { const x = R() * W, y = 60 + R() * 560, r = 22 + R() * 60, col = NEON[i % 6]; g.fillStyle = rgba(col, .14 + R() * .22); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); e.fillStyle = rgba(col, .08 + R() * .08); e.beginPath(); e.arc(x, y, r, 0, TAU); e.fill(); }
  // 吧台边两个低着头的剪影（虚）
  g.save(); g.filter = 'blur(7px)'; g.fillStyle = '#0c0818'; for (const [x, s] of [[330, 1], [1560, 1.1]]) g.fill(path([[x - 230 * s, 790], [x - 200 * s, 520], [x - 90 * s, 440], [x - 60 * s, 330], [x + 30 * s, 300], [x + 110 * s, 360], [x + 90 * s, 460], [x + 200 * s, 540], [x + 240 * s, 790]])); g.restore();
  // 窗外驶过的车灯：一道光从左到右（歌从杯子里跟出去）
  if (d > -.25 && d < .9) { const k = seg(d, -.25, .9), x = lerp(-400, W + 600, k); for (const c of [g, e]) { const gr = c.createLinearGradient(x - 900, 0, x, 0); gr.addColorStop(0, rgba('#fff4c8', 0)); gr.addColorStop(1, rgba('#fff4c8', c === g ? .7 : .6)); c.fillStyle = gr; c.fillRect(x - 900, 250, 900, 12); } lamp(g, e, x, 256, 22, '#fff2c0', 1); }
  // 吧台
  vgrad(g, 0, 790, W, 300, [[0, '#6a3a2a'], [.12, '#4a2418'], [1, '#2a120e']]); g.fillStyle = rgba('#ffcf8a', .5); g.fillRect(0, 790, W, 5);
  airbrush(g, 960, 860, 520, 110, '#ffcf8a', .22);
  // 酒盅：小小的白瓷杯，里头憋着一个发光的音符
  const tip = d > .15 ? eo(seg(d, .15, .6)) : 0, cxp = 960, cyp = 800;
  celLayer(S, c => { c.translate(cxp, cyp); c.rotate(tip * 1.25); c.translate(0, -tip * 20);
    cel(c, [[-120, -230], [-96, -40], [-60, -6], [60, -6], [96, -40], [120, -230]], { f: '#f6f8ff', s: '#aab4d0', so: [-22, 0], h: '#ffffff', ho: [8, 0], l: '#39456a', lw: 3.4 });
    cel(c, poly([[-70, -6], [70, -6], [80, 14], [-80, 14]]), { f: '#dfe6f6', s: '#aab4d0', so: [-16, 0], l: '#39456a', lw: 3 });
    const top = new Path2D(); top.ellipse(0, -230, 120, 34, 0, 0, TAU); cel(c, top, { f: '#c8d2ea', l: '#39456a', lw: 3.4 });
    const liq = new Path2D(); liq.ellipse(0, -224, 104, 26, 0, 0, TAU); c.fillStyle = d < .1 ? '#f0e0a8' : '#d8c890'; c.fill(liq);
    line(c, [[-70, -160], [-64, -90]], '#3a6ad0', 5); line(c, [[-40, -168], [-36, -110]], '#3a6ad0', 5); });
  // 音符：先在杯口一沉一浮；"不用"那一拍跳出来，越飞越大
  const col = '#58f0e0';
  const drawNote = (x, y, s, rot, a = 1, ch = '♪') => { for (const c of [g, e]) { c.save(); c.globalAlpha = a * (c === e ? .9 : 1); c.translate(x, y); c.rotate(rot); c.font = `700 ${s}px "Noto SC"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; if (c === g) { c.strokeStyle = '#0a4244'; c.lineWidth = s * .12; c.strokeText(ch, 0, 0); c.fillStyle = mix(col, '#ffffff', .5); } else c.fillStyle = col; c.fillText(ch, 0, 0); c.restore(); } };
  if (d < 0) { const bobk = Math.sin(f8(t) * 1.1) * 14; g.save(); g.beginPath(); g.rect(0, 0, W, 574); g.clip(); drawNote(cxp, 560 + bobk + 20, 150, Math.sin(f8(t) * .7) * .1); g.restore(); lamp(null, e, cxp, 570, 60, col, .5); }
  else {
    const k = seg(d, 0, 1.3), x = lerp(cxp, W + 300, ei(k) * .7 + k * .3), y = cyp - 240 - Math.sin(Math.min(1, k * 1.6) * Math.PI * .6) * 330;
    drawNote(x, y, lerp(150, 330, k), -.2 + k * .5);
    for (let i = 1; i < 5; i++) { const kk = seg(d, i * .28, i * .28 + 1.5); if (kk > 0 && kk < 1) drawNote(lerp(cxp, W + 200, ei(kk) * .6 + kk * .4), cyp - 240 - Math.sin(Math.min(1, kk * 1.5) * Math.PI * .6) * (240 + i * 40), 110 + i * 14, kk * 2 - .3, 1, i % 2 ? '♫' : '♪'); }
    if (d < .5) for (let i = 0; i < 9; i++) { const a = -Math.PI * (.15 + i * .09), r = d * 520; g.fillStyle = rgba('#f0e0a8', 1 - d / .5); g.beginPath(); g.ellipse(cxp + Math.cos(a) * r * .5, 570 + Math.sin(a) * r * .6 + d * d * 500, 12, 18, a, 0, TAU); g.fill(); }
    if (d < 2 / 24) flash(S, .5, '#8ff7ea');
  }
  return { bloom: 1, halo: .3 };
}

// —— 副歌 3 插入：公主的城堡，不过是沙子 ——
export function sandcastle(S, o) {
  const { g, e, t, lt, u } = S, d = t - o.wave, fr = f12(t);
  setCam(S, lerp(900, 1000, u), lerp(580, 540, u), lerp(1.12, 1, eio(u)));
  vgrad(g, 0, 0, W, 520, [[0, '#1b4cc4'], [.7, '#5fa4f0'], [1, '#c8ecff']]);
  const C = noonClouds(); { let ox = ((-300 - t * 12) % C.w + C.w) % C.w - C.w; for (let x = ox; x < W + 200; x += C.w) g.drawImage(C.c, x, -110); }
  vgrad(g, 0, 500, W, 130, [[0, '#2f84da'], [1, '#30b4c8']]);
  // 远处堤上的路：一个小点从左到右
  g.fillStyle = '#e9e2d0'; g.fillRect(0, 484, W, 18); g.fillStyle = '#b9b0a0'; g.fillRect(0, 498, W, 5);
  speck(S, lerp(300, 1500, u), 486, .13, 1, 'noon');
  vgrad(g, 0, 620, W, 470, [[0, '#f6e6b8'], [1, '#e2c68c']]);
  for (let k = 0; k < 60; k++) { g.fillStyle = rgba('#c8a868', .35); g.fillRect((k * 173) % W, 660 + (k * 97) % 400, 14, 4); }
  // 浪：从右边漫上来，退下去
  const wk = d < 0 ? 0 : Math.sin(clamp(d / 1.9) * Math.PI), wx = lerp(W + 200, 380, wk);
  const melt = clamp((d - .45) / .7);
  // 沙堡
  celLayer(S, c => { c.translate(900, 900); c.scale(1.5, 1.5 * (1 - melt * .62)); c.transform(1, 0, melt * .15, 1, 0, 0);
    const SD = { f: '#f0d49a', s: '#c8a060', l: '#7a5a2a' }; const st = { ...SD, so: [-16, -4], lw: 3 };
    cel(c, [[-260, 0], [-230, -70], [230, -70], [260, 0]], st);
    for (const [x, w, h] of [[-200, 90, 190], [110, 90, 170], [-50, 110, 260]]) { cel(c, poly([[x, -70], [x + w, -70], [x + w - 8, -70 - h], [x + 8, -70 - h]]), st); for (let k = 0; k < 3; k++) cel(c, poly([[x + 6 + k * (w - 12) / 3, -70 - h], [x + 6 + k * (w - 12) / 3 + (w - 12) / 4.5, -70 - h], [x + 6 + k * (w - 12) / 3 + (w - 12) / 4.5, -92 - h], [x + 6 + k * (w - 12) / 3, -92 - h]]), st); }
    cel(c, [[-30, -70], [-30, -130], [0, -160], [30, -130], [30, -70]], { f: '#a8824a', l: '#7a5a2a', lw: 3 });
    // 贝壳拼的小皇冠 + 小旗
    if (melt < .5) { cel(c, [[-34, -360, 1], [-26, -396, 1], [-12, -372, 1], [5, -404, 1], [22, -372, 1], [36, -396, 1], [44, -360, 1]], { f: '#ffd24a', s: '#d89a20', so: [0, -5], l: '#7a4a10', lw: 2.4 }); line(c, [[150, -240], [150, -330]], '#7a5a2a', 4); cel(c, ribbon(flutter(150, -322, 0, 80, 8, 8, 1.2, fr * .9, 0), uu => 36 * (1 - uu * .7)), { f: '#ff7ab0', s: '#d84a88', so: [0, -5], l: '#7a1a48', lw: 2 }); } });
  if (d > 0) { for (const c of [g, e]) { c.save(); const wp = path([[wx, 620], [wx + 60, 760], [wx - 40 + Math.sin(fr * .8) * 20, 900], [wx + 50, 1090], [W + 300, 1090], [W + 300, 620]]); if (c === g) { c.fillStyle = rgba('#48c8d8', .78); c.fill(wp); c.strokeStyle = '#ffffff'; c.lineWidth = 26; c.stroke(wp); c.strokeStyle = rgba('#ffffff', .6); c.lineWidth = 8; c.translate(60, 0); c.stroke(wp); } c.restore(); } }
  if (melt > 0 && melt < 1) for (let k = 0; k < 8; k++) { g.fillStyle = rgba('#ffffff', .8 * (1 - melt)); g.beginPath(); g.arc(700 + k * 60 + Math.sin(k * 3) * 30, 880 - melt * 80 - (k % 3) * 30, 14 - melt * 8, 0, TAU); g.fill(); }
  if (melt >= 1) { celLayer(S, c => { c.translate(lerp(1050, 700, seg(d, 1.1, 2.6)), 960); c.rotate(.4); cel(c, ribbon(flutter(0, 0, 0, 80, 8, 6, 1.2, fr * .5, 0), uu => 36 * (1 - uu * .7)), { f: '#ff7ab0', s: '#d84a88', so: [0, -5], l: '#7a1a48', lw: 2 }); }); }
  gulls(S, t, [[420, 200, 1, 0], [600, 150, .7, 1]]);
  return { bloom: .5, halo: .08, shadowTint: [.1, .14, .3] };
}
