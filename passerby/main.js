import { makeRiso } from './engine/riso.js';
import { W, H, plate } from './engine/draw.js';
import { modelSheet } from './sheet.js';
import { setup, renderFilm, texts, DUR, SHOTS, KICKS, CUES } from './film.js';
const out = document.getElementById('c');
const print = makeRiso(out, W, H);
const Q = new URLSearchParams(location.search);
await Promise.all(['500 40px Jost', '600 40px Jost', '700 40px Jost', '700 40px NotoSC', '900 40px NotoSC'].map(f => document.fonts.load(f, '最佳路人Aa')));
const J = async u => (await fetch(u)).json();
const [lines, cues, beats] = await Promise.all([J('lines.json'), J('lyrics.json'), J('beats.json')]);
setup(lines, cues, beats);
window.DUR = DUR; window.SHOTS = SHOTS.map(s => ({ id: s.id, t0: s.t0, t1: s.t1 })); window.KICKS = KICKS;
window.EV = [...SHOTS.map(s => ({ t: s.t0, type: 'cut', id: s.id })), ...KICKS.map(k => ({ t: k[0], type: 'kick', px: k[1] }))];
window.TEXTS = t => texts(t);
window.render = t => {
  if (Q.has('sheet')) { print(plate, modelSheet()); return; }
  const o = renderFilm(t, { nosub: Q.has('nosub') || Q.has('poster') });
  if (Q.has('plate')) o.gate = Q.get('plate').split(',').map(Number);
  print(plate, o);
};
window.READY = true;
