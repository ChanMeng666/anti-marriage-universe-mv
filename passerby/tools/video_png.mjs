// PNG frames → lossless yuv444 segments → one lossless intermediate (JPEG 4:2:0 screenshots smear saturated halftone dots).
// usage (from the library root): node <film>/tools/video_png.mjs <film> [--fps 24] [--workers 4] [--from s] [--to s] [--out file]
// Segments are kept per worker and a finished segment is reused when --resume is passed.
import fs from 'fs'; import path from 'path'; import { spawn, execFileSync } from 'child_process'; import { pathToFileURL } from 'url';
const LIB = process.env.LIB || process.cwd();
const { openDemo, closeServer } = await import(pathToFileURL(path.join(LIB, 'core/render/page.mjs')).href);
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const dir = args[0], FPS = +opt('--fps', 24), WK = +opt('--workers', 4), Q = opt('--q', ''), CHUNK = +opt('--chunk', 20), RESUME = args.includes('--resume');
const outDir = path.join(dir, 'out'); fs.mkdirSync(outDir, { recursive: true });
const out = path.resolve(opt('--out', path.join(outDir, 'video.mp4'))), tag = path.basename(out, '.mp4');
const segDir = path.join(outDir, tag + '_segs'); fs.mkdirSync(segDir, { recursive: true });
const probe = await openDemo(dir, { q: Q }); const DUR = await probe.page.evaluate(() => window.DUR); await probe.browser.close();
const F0 = Math.round(+opt('--from', 0) * FPS), F1 = Math.round(+opt('--to', DUR) * FPS), t0 = Date.now();
// fixed-length chunks (CHUNK seconds each): a crashed render resumes at the first missing chunk
const chunks = []; for (let a = F0; a < F1; a += CHUNK * FPS) chunks.push([a, Math.min(F1, a + CHUNK * FPS)]);
const name = ([a, b]) => path.join(segDir, `seg_${String(a).padStart(6, '0')}_${String(b).padStart(6, '0')}.mp4`);
let next = 0, doneFrames = 0;
await Promise.all([...Array(WK)].map(async (_, w) => {
  let ctx = null;
  for (;;) {
    const i = next++; if (i >= chunks.length) break;
    const [a, b] = chunks[i], file = name(chunks[i]);
    if (RESUME && fs.existsSync(file)) { doneFrames += b - a; continue; }
    if (!ctx) ctx = await openDemo(dir, { q: Q });
    const tmp = file + '.part.mp4';
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
      '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv444p', '-c:v', 'libx264', '-preset', 'veryfast', '-qp', '0',
      '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
    const closed = new Promise(r => ff.on('close', r));
    for (let f = a; f < b; f++) {
      // the canvas encodes its own PNG: ~6x faster here than a page screenshot, and byte-exact
      let timer;   // watchdog: a frame that never comes back stops the render instead of hanging it (cleared each frame, or the pending timers pin every PNG string in memory)
      const url = await Promise.race([ctx.page.evaluate(t => { window.render(t); return document.getElementById('c').toDataURL('image/png'); }, f / FPS),
        new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`frame ${f} (t = ${(f / FPS).toFixed(3)} s) did not come back in 90 s`)), 90000); })]);
      clearTimeout(timer);
      const buf = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); const code = await closed; if (code !== 0) { console.error('ffmpeg failed on', file); process.exit(1); }
    fs.renameSync(tmp, file); doneFrames += b - a;
    const el = (Date.now() - t0) / 1000; console.log(`w${w} chunk ${i + 1}/${chunks.length}  ${doneFrames}/${F1 - F0} frames  ${el.toFixed(0)}s`);
  }
  if (ctx) await ctx.browser.close();
}));
const list = path.join(segDir, 'segs.txt');
fs.writeFileSync(list, chunks.map(c => `file '${path.basename(name(c))}'`).join('\n'));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'segs.txt', '-c', 'copy', out], { cwd: segDir });
console.log('done', out, F1 - F0, 'frames', ((Date.now() - t0) / 1000).toFixed(0) + 's');
closeServer();
