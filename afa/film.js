// 《浪子阿发》时间线：唯一的时间来源是 lyrics.json（对齐后的歌词）和 beats.json（节拍格）。
// 每个镜头的起点 = 某一行歌词开唱前一点，吸附到最近的一拍；关键动作落在拍点上。
import { W, H, setCam, flash, clamp, seg } from './stage.js';
import { hud, lineAt } from './hud.js';
import * as R from './sc_ride.js';
import * as C from './sc_cafe.js';
import * as V1 from './sc_v1.js';
import * as V2 from './sc_v2.js';
import * as BR from './sc_bridge.js';

export const DUR = 295.08;
export const AUDIO_END = 292.96;   // 歌的最后一个采样之后是 2.1 秒静音：磁带停、蓝屏
let LYR = [], BEATS = [], SHOTS = [], CUES = {};
export let EV = [];
let texts = [];

const snap = t => BEATS.reduce((a, b) => Math.abs(b - t) < Math.abs(a - t) ? b : a, BEATS[0]);
const bi = t => BEATS.indexOf(snap(t));
const B = n => BEATS[n];
const Ls = (i, off = -.3) => snap(LYR[i].t0 + off);          // 第 i 行开唱前的那一拍
const charT = (i, ch, nth = 0) => { const L = LYR[i]; let n = 0; for (const [a, b, ts] of L.ct) if (L.text.slice(a, b) === ch && n++ === nth) return ts; return L.t0; };

export async function init() {
  LYR = await (await fetch('lyrics.json')).json();
  BEATS = (await (await fetch('beats.json')).json()).beats;
  build();
}

function build() {
  const s = [], add = (t, name, fn) => s.push({ t0: t, name, fn });
  const X = {};   // 落在拍点上的关键动作
  // —— 前奏 ——
  X.slap = B(3);
  add(0, 'key', S => C.keyslap(S, { slap: X.slap }));
  add(B(7), 'twoshot', S => C.twoshot(S));
  X.title = B(15);
  add(B(15), 'title', S => C.titlecard(S));
  add(B(25), 'eyes', S => C.eyes(S, { mode: 'inward' }));
  // —— 主歌 1 ——
  add(Ls(0), 'name30', S => C.nameCard(S, { old: false }));
  add(Ls(1), 'seen', S => C.eyes(S, { mode: 'seen' }));
  add(Ls(2), 'family', S => V1.family(S));
  X.yoke = snap(charT(3, '套'));
  add(Ls(3), 'donkey', S => V1.donkey(S, { drop: X.yoke }));
  add(Ls(4), 'noise', S => V1.noise(S));
  add(Ls(5), 'mei', S => V1.mei(S));
  X.stick = [snap(LYR[6].t0 + .55), snap(LYR[6].t0 + 1.15), snap(LYR[6].t0 + 1.75)];
  add(Ls(6), 'catalog', S => V1.catalog(S, { sticks: X.stick }));
  X.flip = snap(LYR[7].t0 + .8); X.stamp = snap(charT(7, '饭'));
  add(Ls(7), 'ticket', S => V1.ticket(S, { flip: X.flip, stamp: X.stamp }));
  // —— 导歌 ——
  X.open = snap(LYR[8].t0 + 1.0); X.rise = BEATS[bi(X.open) + 2];
  add(Ls(8), 'stand', S => C.stand(S, { open: X.open, rise: X.rise }));
  X.kick = snap(charT(9, '踢') + .1);
  add(Ls(9), 'tower', S => V1.tower(S));
  add(X.kick - 2 / 24, 'kick', S => V1.kick(S, { hit: X.kick }));
  add(BEATS[bi(X.kick) + 1], 'fall', S => V1.fall(S));
  add(Ls(10), 'pay', S => V1.pay(S));
  add(Ls(11), 'tie', S => C.tie(S));
  X.go = BEATS[bi(Ls(13)) - 1];
  add(Ls(12), 'lamp', S => C.lampStreet(S, { go: X.go }));
  // —— 副歌 1：夜 ——
  const hits = i => [charT(i, '清', 0), charT(i, '清', 1)];
  add(Ls(13), 'ride-night', S => R.side(S, 'night', { hits: hits(13) }));
  add(Ls(14), 'billboard', S => R.side(S, 'night', { variant: 'billboard' }));
  add(Ls(15), 'train', S => R.side(S, 'night', { variant: 'train' }));
  X.snap1 = snap(charT(16, '无'));
  add(Ls(16), 'thread', S => R.side(S, 'night', { variant: 'thread', snap: X.snap1, zoom: 1.22 }));
  add(Ls(17), 'visor', S => R.bust(S, 'night', { variant: 'visor', zoomTo: 1.2 }));
  X.cup = snap(charT(18, '不'));
  add(Ls(18), 'cup', S => V2.cup(S, { out: X.cup }));
  add(Ls(19), 'moon', S => R.moon(S));
  add(Ls(20), 'rear-night', S => R.rear(S, 'night', { variant: 'out' }));
  add(B(199), 'taillight', S => R.taillight(S));
  // —— 主歌 2 ——
  add(B(201), 'showroom', S => V2.showroom(S));
  X.level0 = Ls(22); X.house = snap(charT(23, '房')); X.pram = snap(charT(23, '娃') - .1);
  add(Ls(22), 'level', S => V2.level(S, { t0: X.level0, house: X.house, pram: X.pram }));
  add(Ls(23), 'load', S => V2.level(S, { t0: X.level0, house: X.house, pram: X.pram, close: true }));
  X.hand = snap(charT(24, '做') - .2); X.unbow = snap(LYR[24].t1 + .4);
  add(Ls(24), 'bow', S => V2.bow(S, { hand: X.hand, unbow: X.unbow }));
  add(Ls(25), 'day', S => V2.day(S));
  X.buy = [Ls(26), snap(charT(26, '这') - .1), snap(charT(26, '出') - .05)];
  add(Ls(26), 'buy', S => V2.buy(S, { cuts: X.buy }));
  X.pops = [0, 1, 2, 3].map(k => BEATS[bi(Ls(27)) + 2 + k]);
  add(Ls(27), 'quiet', S => V2.quiet(S, { pops: X.pops }));
  X.over = snap(LYR[28].t1 + .35); X.start = snap(LYR[29].t0 + .5);
  add(Ls(28), 'game', S => V2.game(S, { over: X.over, start: X.start }));
  // —— 副歌 2：黎明 ——
  add(Ls(30), 'ride-dawn', S => R.side(S, 'dawn', { hits: hits(30) }));
  add(Ls(31), 'fork', S => R.rear(S, 'dawn', { variant: 'fork' }));
  add(Ls(32), 'jam', S => R.side(S, 'dawn', { variant: 'jam' }));
  add(Ls(33), 'pillion', S => R.rear(S, 'dawn', { variant: 'pillion' }));
  add(Ls(34), 'bust-dawn', S => R.bust(S, 'dawn', { variant: 'sing', zoomTo: 1.1 }));
  add(Ls(35), 'sing', S => R.side(S, 'dawn', { variant: 'sing', expr: 'sing' }));
  add(Ls(36), 'cliff', S => R.cliff(S));
  add(snap(charT(37, '哪', 0) - .2), 'tunnel', S => R.rear(S, 'dawn', { variant: 'tunnel' }));
  // —— 间奏：四十年快进；念白 ——
  X.ff = B(343);                                   // 第 85 小节
  add(B(339), 'tunnel-in', S => R.rear(S, 'night', { variant: 'tunnelIn' }));
  X.seasons = [B(343), B(351), B(359), B(367)];
  X.seasonsEnd = snap(LYR[38].t0 - .8);
  X.seasons.forEach((t, k) => add(t, 'season' + k, S => BR.season(S, k, { t0: X.seasons[0], t1: X.seasonsEnd })));
  add(X.seasonsEnd, 'seawall', S => BR.seawall(S));
  add(snap(LYR[39].t0 - .4), 'sip', S => BR.sip(S));
  add(snap(LYR[40].t0 - .5), 'name70', S => C.nameCard(S, { old: true }));
  X.laugh = snap(charT(41, '笑'));
  add(snap(LYR[41].t0 - .4), 'laugh', S => BR.laugh(S, { laugh: X.laugh }));
  // —— 副歌 3：正午，七十岁 ——
  X.c3 = Ls(42);
  add(X.c3, 'ride-noon', S => R.side(S, 'noon', { hits: hits(42) }));
  X.wave = snap(charT(43, '公'));
  add(Ls(43), 'sandcastle', S => V2.sandcastle(S, { wave: X.wave }));
  add(Ls(44), 'horses', S => R.side(S, 'noon', { variant: 'horses' }));
  X.pass = snap(charT(45, '无'));
  add(Ls(45), 'pass', S => R.side(S, 'noon', { variant: 'pass', th: X.pass, hold: BEATS[bi(X.pass) + 2] - X.pass }));
  X.freeze = snap(LYR[46].t0 + .9);
  add(Ls(46), 'freeze', S => R.bust(S, 'noon', { variant: 'freeze', at: X.freeze, zoomTo: 1.1, title: (S2, d) => C.chromeTitle(S2, d * 2, { x: 1430, y: 300, size: 130, small: true }) }));
  add(Ls(47), 'whistle', S => R.side(S, 'noon', { variant: 'sing', expr: 'laugh' }));
  add(Ls(48), 'sky', S => R.rear(S, 'noon', { variant: 'sky' }));
  add(Ls(49), 'bridge', S => R.bridge(S));
  // —— 尾声 ——
  X.set = snap(LYR[51].t0 - .1);
  add(Ls(50), 'keydown', S => C.keydown(S, { set: X.set }));
  add(Ls(52), 'rest', S => C.rest(S));
  X.stop = AUDIO_END - 4 / 24;
  add(snap(LYR[52].t1 + 1.2), 'tiltup', S => C.tiltup(S));
  add(AUDIO_END, 'blue', S => C.bluescreen(S));
  s.sort((a, b) => a.t0 - b.t0);
  s.forEach((x, i) => { x.t1 = i + 1 < s.length ? s[i + 1].t0 : DUR; });
  SHOTS = s.filter(x => x.t1 - x.t0 > 1e-3); CUES = X;
  // 给 cuecheck / events.json 用：每个剪辑点和关键动作
  EV = SHOTS.map(x => ({ t: +x.t0.toFixed(3), type: 'cut', name: x.name }));
  for (const [k, v] of Object.entries(X)) for (const t of [].concat(v)) EV.push({ t: +(+t).toFixed(3), type: 'hit', name: k });
  EV.sort((a, b) => a.t - b.t);
}

const WHITE_IN = { 'ride-night': .5, day: .35, 'ride-noon': .4, 'ride-dawn': .3 };   // 白闪切入（秒）

export function frame(S, qs) {
  const t = Math.min(S.t, DUR - 1e-3);
  let sh = SHOTS.find(x => t >= x.t0 && t < x.t1) || SHOTS[SHOTS.length - 1];
  const only = qs.get('shot'); if (only) { const f = SHOTS.find(x => x.name === only); if (f) sh = f; }
  S.lt = t - sh.t0; S.d = sh.t1 - sh.t0; S.u = clamp(S.lt / S.d); S.L = LYR; S.X = CUES; S.shot = sh;
  texts = []; S.txt = (id, text, x0, y0, x1, y1, screen) => { if (!screen) { const a = S.M.transformPoint({ x: x0, y: y0 }), b = S.M.transformPoint({ x: x1, y: y1 }); x0 = Math.min(a.x, b.x); x1 = Math.max(a.x, b.x); y0 = Math.min(a.y, b.y); y1 = Math.max(a.y, b.y); } texts.push({ id, text, x0, y0, x1, y1 }); };
  setCam(S);
  const over = sh.fn(S) || {};
  if (WHITE_IN[sh.name] && S.lt < WHITE_IN[sh.name]) flash(S, Math.pow(1 - S.lt / WHITE_IN[sh.name], 1.6));
  // 字幕 + OSD
  let osd = null;
  if (t < B(7)) osd = { text: '▶ PLAY', right: 'SP' };
  else if (t >= CUES.ff - .1 && t < CUES.seasonsEnd) { const k = seg(t, CUES.seasons[0], CUES.seasonsEnd); osd = { text: '▶▶ FF', right: `${Math.round(30 + k * 40)} 岁` }; }
  else if (t >= CUES.stop) osd = { text: '■ STOP', right: '4:53' };
  if (!qs.get('nosub')) hud(S.ov, t, LYR, osd);
  // 磁带：开机、快进时的跟踪噪声、停带
  const crt = { power: Math.min(1, t / .6), track: 0 };
  const tr = (t0, n, a = 1) => { const f = (t - t0) * 24; if (f >= -.5 && f < n) crt.track = Math.max(crt.track, a * (1 - .5 * f / n)); };
  tr(CUES.ff, 10); for (const ts of CUES.seasons.slice(1)) tr(ts, 5, .8); tr(CUES.seasonsEnd, 6, .7); tr(AUDIO_END - 4 / 24, 9, 1); tr(CUES.stop, 4, .6);
  return { ...over, ...crt };
}
export const TEXTS = () => texts;
export const shots = () => SHOTS;
