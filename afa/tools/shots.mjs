// 每个镜头渲几张静帧（开头后 / 中间 / 结尾前），拼成联络表前的素材：node tools/shots.mjs <outdir> [per=3] [from] [to]
import fs from 'fs'; import path from 'path';
import { openDemo, closeServer } from 'file:///D:/github_repository/lemo-opuscar/core/render/page.mjs';
const here = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const out = path.resolve(process.argv[2] || path.join(here, 'stills/shots')), per = +(process.argv[3] || 3), from = +(process.argv[4] || 0), to = +(process.argv[5] || 1e9);
fs.mkdirSync(out, { recursive: true });
const { browser, page } = await openDemo(here, { w: 1920, h: 1080, q: process.env.Q || '', warnings: true });
const shots = await page.evaluate(async () => (await import('./film.js')).shots().map(s => ({ t0: s.t0, t1: s.t1, name: s.name })));
let i = 0;
for (const s of shots) {
  i++; if (s.t1 < from || s.t0 > to) continue;
  for (let k = 0; k < per; k++) {
    const u = per === 1 ? .5 : .12 + .76 * k / (per - 1), t = s.t0 + (s.t1 - s.t0) * u, t0 = Date.now();
    await page.evaluate(t => window.render(t), t);
    const f = path.join(out, `${String(i).padStart(2, '0')}_${s.name}_${k}_${t.toFixed(2)}.jpg`);
    await page.screenshot({ path: f, type: 'jpeg', quality: 85 });
    console.log(path.basename(f), Date.now() - t0 + 'ms');
  }
}
await browser.close(); closeServer();
