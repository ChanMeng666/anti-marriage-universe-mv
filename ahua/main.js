import { W, H } from './engine.js';
const cv = document.getElementById('cv'), g = cv.getContext('2d');
const q = new URLSearchParams(location.search);
await Promise.all([document.fonts.load('600 46px "Noto Serif SC"', '战士阿花 Warrior'), document.fonts.load('900 46px "Noto Serif SC"', '战士阿花 Warrior')]);
if (q.get('test')) {
  const { sheet } = await import('./sheet.js');
  window.DUR = 10; window.render = t => { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); sheet(g, q.get('test'), t); };
} else {
  const { setup } = await import('./film.js');
  await setup(g, q);
}
window.READY = true;
