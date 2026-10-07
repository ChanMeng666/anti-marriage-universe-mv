// The film: one timeline (lyrics.json + the beat grid) drives shots, sheet transitions, subtitles and TEXTS.
import { W, H, COL, canvas, memo, piece, poly, trace, Pl, fill, inkText, rosette, step, peel, slide, fall, snip, clamp, hash, FONT } from './engine.js';
import { drawScissors } from './props.js';

export const TL = { lines: [], byId: {}, per: .434782, g0: 4.9888, dur: 239.52 };
TL.G = i => TL.g0 + TL.per * i;                                   // time of grid beat i (eighth notes at 69 BPM; i % 8 === 0 starts a bar)
TL.gi = t => Math.floor((t - TL.g0) / TL.per + 1e-6);
TL.L = id => TL.byId[id];
TL.cut = (id, lead = .15) => TL.G(TL.gi(TL.byId[id].t0 + lead));   // the grid beat at or just before a sung line starts
TL.next = (t, k = 0) => TL.G(Math.ceil((t - TL.g0) / TL.per - 1e-6) + k);   // first grid beat at or after t (+k)
TL.snare = (t, n = 0) => { let i = Math.ceil((t - TL.g0) / TL.per - 1e-6); while (((i % 4) + 4) % 4 !== 2) i++; return TL.G(i + 4 * n); };   // n-th backbeat at or after t
TL.HITS = [];                                                      // [{id, t, on}] every picture hit, for cuecheck
TL.hit = (id, t) => { TL.HITS.push({ id, t }); return t; };

const TEXTS = [];
export const say = (id, text, x0, y0, x1, y1) => TEXTS.push({ id, text, x0: Math.max(0, x0), y0: Math.max(0, y0), x1: Math.min(W, x1), y1: Math.min(H, y1) });

// ---------- subtitles: a deep-red banner strip pasted low in the frame ----------
function banner(text) {
  return memo('sub|' + text, () => {
    const [m, mg] = canvas(10, 10); mg.font = `600 46px ${FONT}`;
    const tw = mg.measureText(text).width, w = Math.ceil(tw + 150), h = 78, K = 1.5, [c, g] = canvas(w * K, h * K); g.scale(K, K);
    const pts = []; for (let x = 0; x <= w; x += 10) pts.push([x, 4 + (x / 10 % 2) * 3.2]);
    pts.push([w - 24, h / 2]); for (let x = w; x >= 0; x -= 10) pts.push([x, h - 4 - (x / 10 % 2) * 3.2]); pts.push([24, h / 2]);
    g.beginPath(); trace(g, Pl(pts, true, .3, 5)); g.fillStyle = COL.sub; g.fill();
    rosette(g, 48, h / 2, 12, 6, 0, .25); rosette(g, w - 48, h / 2, 12, 6, .5, .25);
    const [n, ng] = canvas(c.width, c.height); ng.drawImage(c, 0, 0);
    // paper grain + cut edge like every other piece
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(255,255,255,.04)'; for (let k = 0; k < 260; k++) g.fillRect(hash(k) * c.width, hash(k + 9) * c.height, 26 * hash(k + 3) + 4, 1.2);
    g.globalCompositeOperation = 'source-over'; g.setTransform(K, 0, 0, K, 0, 0);
    g.font = `600 46px ${FONT}`; g.fillStyle = '#fff1d6'; g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillText(text, w / 2, h / 2 + 1);
    return { c, w, h };
  });
}
function slip(text) {   // an ad-lib: a small cream slip, printed ink
  return memo('slip|' + text, () => { const [m, mg] = canvas(10, 10); mg.font = `600 30px ${FONT}`; const w = Math.ceil(mg.measureText(text).width + 56), h = 50, K = 1.5, [c, g] = canvas(w * K, h * K); g.scale(K, K);
    g.beginPath(); trace(g, Pl([[2, 3], [w - 3, 2], [w - 2, h - 4], [3, h - 2]], true, .4, 7)); g.fillStyle = COL.cream; g.fill(); g.font = `600 30px ${FONT}`; g.fillStyle = COL.sub; g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillText(text, w / 2, h / 2 + 1); return { c, w, h }; });
}
function drawSubs(g, t) {
  for (const l of TL.lines) {
    if (t < l.t0 || t >= l.s1) continue;
    const u = step(t - l.t0), drop = u < 1 / 12 ? -16 : u < 2 / 12 ? -5 : 0;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.shadowColor = 'rgba(20,4,8,.5)'; g.shadowBlur = 8; g.shadowOffsetX = 3; g.shadowOffsetY = 5;
    if (l.adlib) { const s = slip(l.text), x = 1500 - s.w / 2, y = 884 + drop; g.translate(x + s.w / 2, y + s.h / 2); g.rotate(-.045); g.drawImage(s.c, -s.w / 2, -s.h / 2, s.w, s.h); }
    else { const s = banner(l.text), x = W / 2 - s.w / 2, y = H - 62 - s.h + drop; g.drawImage(s.c, x, y, s.w, s.h); }
    g.restore();
  }
}

// ---------- shots ----------
const [Ac, Ag] = canvas(W, H), [Bc, Bg] = canvas(W, H);
let SHOTS = [];
function drawShot(g, sh, t) { g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.shadowColor = 'rgba(0,0,0,0)'; g.clearRect(0, 0, W, H); sh.draw(g, t, sh); }
export function frame(g, t, nosub) {
  TEXTS.length = 0;
  let i = SHOTS.length - 1; while (i > 0 && SHOTS[i].t0 > t) i--;
  const sh = SHOTS[i], tr = sh.tr, pv = SHOTS[i - 1];
  if (tr && pv && t < sh.t0 + tr.d) {
    const u = clamp((t - sh.t0) / tr.d);
    drawShot(Ag, pv, t); const keep = TEXTS.slice(); drawShot(Bg, sh, t); TEXTS.length = 0; TEXTS.push(...keep);   // texts of the sheet still on top
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
    if (tr.type === 'peel') peel(g, Ac, Bc, u, tr.ang ?? -Math.PI / 4, tr.back);
    else if (tr.type === 'turn') peel(g, Ac, Bc, u, tr.ang ?? 0, tr.back);
    else if (tr.type === 'slide') slide(g, Ac, Bc, u, tr.dir || [1, 0]);
    else if (tr.type === 'fall') fall(g, Ac, Bc, u);
    else if (tr.type === 'snip') { const r = snip(g, Ac, Bc, u); if (r.cutting) drawScissors(g, [1, 0, 0, 1, 0, 0], r.tip[0], r.tip[1] + 30, 1.72, hash(Math.floor(t * 12)) > .5 ? 1 : 0, 2.2); }
  } else drawShot(g, sh, t);
  if (!nosub) drawSubs(g, t);
}
export async function setup(g, q) {
  const [lines, beats] = await Promise.all([fetch('lyrics.json').then(r => r.json()), fetch('beats.json').then(r => r.json())]);
  Object.assign(TL, { lines, per: beats.period, g0: beats.g0, dur: beats.dur, intro: beats.intro });
  for (const l of lines) TL.byId[l.id] = l;
  const mods = await Promise.all(['./sc_intro.js', './sc_cafe.js', './sc_chorus.js', './sc_road.js', './sc_end.js'].map(m => import(m)));
  for (const m of mods) SHOTS.push(...m.shots(TL));
  SHOTS.sort((a, b) => a.t0 - b.t0);
  SHOTS.forEach((s, i) => { s.t1 = i + 1 < SHOTS.length ? SHOTS[i + 1].t0 : TL.dur; s.d = s.t1 - s.t0; });
  const nosub = q.get('nosub') === '1';
  window.DUR = TL.dur;
  window.SHOTS = SHOTS.map(s => ({ id: s.id, t0: +s.t0.toFixed(3), t1: +s.t1.toFixed(3), tr: s.tr ? s.tr.type : 'cut' }));
  window.EV = [...SHOTS.map(s => ({ t: +s.t0.toFixed(3), type: 'cut', id: s.id })), ...TL.HITS.map(h => ({ t: +h.t.toFixed(3), type: 'hit', id: h.id }))].sort((a, b) => a.t - b.t);
  window.render = t => frame(g, Math.min(t, TL.dur - 1e-3), nosub);
  window.TEXTS = t => { window.render(t); return TEXTS.slice(); };
}
