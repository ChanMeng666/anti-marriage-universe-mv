// 《最佳路人》: the timeline. Everything is locked to the song: lyrics.json / lines.json (aligned lyric times)
// and the beat grid. One sheet of paper, two plates that will not register: red = 阿花, teal = 阿发.
import { g, W, H, clear, rect, rrect, line, circle, ellipse, poly, text, over, layer, blob, curve, limb } from './engine/draw.js';
import { clamp, lerp, seg, ss, eio, eo, ei, back, hash, mulberry, TAU } from '/core/lib.js';
import { R, T, Y, K, P, SKIN, tint, LOOK, figure, head, cup, steam, key, chair, table, lamp, bubble, laptop, moto, rider, sofa, glass, mask, warrior, regmark, scissors, house } from './cast.js';
import { LINES, BEATS, PULSE, BARS, FL, L1, AT, CF, CUES, DUR, FZ, KICKS, L0, OPEN, S, SHOTS, TEXTS, beatAt, before, cafe, cafeRoom, cam, clip, cutL, kf, near, pop, pulse, reset, road, room, say, say2, setData, step, sweepX } from './kit.js';
import { CLOCK } from './cast.js';
import './shots1.js';
import { timeline2 } from './shots2.js';
export { DUR, SHOTS, KICKS, CUES };

// ───────── the timeline: every cut on a felt beat of the song ─────────
function shot(id, t0, fn, o = {}) { SHOTS.push({ id, t0, fn, o }); }
export function setup(lines, cues, beats) {
  setData(lines, cues, beats);
  SHOTS.length = 0; KICKS.length = 0;
  const kick = (t, a = 10) => KICKS.push([beatAt(t), a]);
  buildTimeline(kick);
  SHOTS.sort((a, b) => a.t0 - b.t0);
  SHOTS.forEach((s, i) => { s.t1 = i + 1 < SHOTS.length ? SHOTS[i + 1].t0 : DUR; s.n = i; });
  // subtitle cues: on from just before the first syllable, off 0.6 s after the last (≥ 1.8 s), never over the next cue
  const sung = CUES.filter(q => !q.spoken);
  sung.forEach((q, i) => { const nx = sung[i + 1] ? sung[i + 1].t0 - .12 : DUR; q.on = q.t0 - .1; q.off = Math.min(nx, Math.max(q.t1 + .6, q.on + 1.8)); });
}
function buildTimeline(kick) {
  const bar0 = BARS.find(b => b > L0(2) - .5);                         // the downbeat verse 1 starts on
  const tTitle = PULSE.find(b => b > 4.2), tOff = beatAt(L0(0) + .1);
  shot('marks', 0, S.marks, { tTitle, tOff });
  kick(tTitle, 14); for (const t of [11.2, 11.62, 13.34, 13.76]) kick(t, 9);      // title, finger snaps
  shot('hisWide', bar0, S.hisWide); kick(bar0, 12);
  const kHit = beatAt(AT(3, '拍'));
  shot('hisKeyUp', before(PULSE, kHit - 2.2), S.hisKeyUp); shot('hisKeyHit', kHit, S.hisKeyHit); kick(kHit, 16);
  shot('hisTalk', cutL(4), S.hisTalk, { i: 4 }); kick(beatAt(AT(4, '工作')), 6); kick(beatAt(AT(4, '有个家')), 6);
  shot('hisStink', cutL(5), S.hisStink, { i: 5 });
  shot('hisHome', cutL(6), S.hisHome, { i: 6 }); kick(AT(6, '带回家'), 9);
  shot('herWide', cutL(7, .4), S.herWide, { i: 7 }); kick(cutL(7, .4), 12);
  shot('herWarrior', cutL(8), S.herWarrior, { i: 8 }); kick(AT(8, '出土'), 8);
  shot('herCup', cutL(9), S.herCup, { i: 9 }); kick(beatAt(AT(9, '奇葩')), 7);
  shot('herNo', cutL(10, .5), S.herNo, { i: 10 }); kick(AT(10, '终于'), 12);
  shot('herWalk', cutL(11), S.herWalk, { i: 11 });
  shot('preHe', cutL(12, .3), S.preHe, { i: 12 }); kick(cutL(12, .3), 10);
  shot('preShe', cutL(13), S.preShe, { i: 13 }); kick(cutL(13), 10);
  const snap = beatAt(AT(16, '双'));
  shot('preBoth', cutL(14, .3), S.preBoth, { snap });
  timeline2(shot, kick, snap);
}
const shotAt = t => { let r = SHOTS[0]; for (const s of SHOTS) { if (s.t0 <= t + 1e-6) r = s; else break; } return r; };

// registration: one fixed set of offsets per shot, a kick on accents
function regist(t, s, extra, exact) {
  const base = [[2.5, -1.5], [-2.5, 2], [1, 1.5]];
  const off = base.map((b, i) => exact ? [0, 0] : [b[0] + (hash(s.n * 3 + i) - .5) * 3, b[1] + (hash(s.n * 7 + i + 50) - .5) * 3]);
  for (const [tk, amp] of KICKS) {
    const x = t - tk; if (x < 0 || x > .5) continue;
    const e = Math.exp(-x * 11) * Math.cos(x * 34);
    for (let i = 0; i < 3; i++) { const a = hash(tk * 13 + i * 5) * TAU; off[i][0] += Math.cos(a) * amp * e; off[i][1] += Math.sin(a) * amp * e; }
  }
  if (extra) for (let i = 0; i < 3; i++) { off[i][0] += extra[i][0]; off[i][1] += extra[i][1]; }
  return off;
}
// subtitles: a strip of bare paper, the words on the singer's plate; both voices = both plates, a few px apart
function subtitle(t, ex) {
  const q = CUES.find(q => !q.spoken && t >= q.on && t < q.off); if (!q) return;
  reset(); g.globalCompositeOperation = 'source-over';
  const font = '700 48px NotoSC, Jost'; g.font = font; g.letterSpacing = '2px';
  const w = g.measureText(q.text).width; g.letterSpacing = '0px';
  // the strip is knocked out of each plate where that plate will land, so a shot that drags the plates apart does not drag the words
  const e = ex || [[0, 0], [0, 0], [0, 0]], ZERO = ['rgb(0,255,255)', 'rgb(255,0,255)', 'rgb(255,255,0)'];
  g.globalCompositeOperation = 'multiply';
  for (let i = 0; i < 3; i++) { g.fillStyle = ZERO[i]; g.beginPath(); g.roundRect(960 - w / 2 - 34 - e[i][0], 962 - e[i][1], w + 68, 78, 8); g.fill(); }
  g.globalCompositeOperation = 'lighter';
  const put = (c, i, dx = 0, dy = 0) => text(q.text, 960 + dx - e[i][0], 1018 + dy - e[i][1], font, c, 'center', 'alphabetic', 2);
  if (q.singer === 'M') put(T, 1); else if (q.singer === 'F') put(R, 0); else { put(R, 0, -2, -1); put(T, 1, 2, 1); }
  g.globalCompositeOperation = 'source-over';
}
export function renderFilm(t, opt = {}) {
  t = clamp(t, 0, DUR - 1e-3); TEXTS.length = 0;
  const s = shotAt(t), c = { ...s.o, t, t0: s.t0, d: s.t1 - s.t0 };
  clear(); reset(); g.globalCompositeOperation = 'source-over'; CLOCK.t = Math.floor(t * 12) / 12;
  const r = s.fn(t - s.t0, c) || {};
  reset(); g.globalCompositeOperation = 'source-over';
  if (!opt.nosub) subtitle(t, r.off);
  return { seed: Math.floor(t * 12), sheet: s.n * 1.7 + 3, off: regist(t, s, r.off, r.exact), gate: r.gate || [1, 1, 1], sweep: r.sweep || [OPEN, OPEN, OPEN], period: r.period || 7 };
}
export const texts = t => { renderFilm(t); return TEXTS; };
