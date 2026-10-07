// 《浪子阿发》MV — 80s Cel Anime
import { canvas, W, H } from './cel.js';
import { makePost } from './post.js';

const qs = new URLSearchParams(location.search);
const [sc, g] = canvas(W, H), [gc, e] = canvas(W, H), [ovc, ov] = canvas(W, H);
const post = makePost(document.getElementById('gl'));
const TEST = qs.get('test');
const RAW = { bloom: 0, halo: 0, soft: 0, flick: 0, lift: 0, contrast: 0, fade: 0, sat: 1, tint: [1, 1, 1], scan: 0, grille: 0, bleed: 1, rshift: 0, glow: 0, corner: 0, noiseA: 0, power: 1, track: 0, expo: 1 };
const CH = await (await fetch('fonts/chars.txt')).text();   // 中文字体按用到的字切成了几块：把全部用字交给 fonts.load，每一块才都会载入
for (const f of ['700 40px "Noto SC"', '400 40px "HuangYou"']) await document.fonts.load(f, CH);
for (const f of ['600 40px "Barlow SC"', '700 40px "Barlow SC"', 'italic 800 40px Kanit', 'italic 900 40px Kanit']) await document.fonts.load(f, 'Ag09');

let film = null, testMod = null;
if (TEST) testMod = await import('./test.js'); else film = await import('./film.js');
if (film) await film.init();

function render(t) {
  for (const x of [g, e]) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none'; }
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H); e.fillStyle = '#000'; e.fillRect(0, 0, W, H);
  ov.setTransform(1, 0, 0, 1, 0, 0); ov.clearRect(0, 0, W, H);
  const S = { t, g, e, ov };
  let over = {};
  if (testMod) testMod.test(S, TEST); else over = film.frame(S, qs) || {};
  post.render(sc, gc, Math.round(t * 24), ovc, qs.get('raw') ? RAW : over);
}
window.render = render; window.DUR = film ? film.DUR : 5;
if (film) { window.TEXTS = film.TEXTS; window.EV = film.EV; }
render(parseFloat(qs.get('t') ?? '0'));
window.READY = true;
