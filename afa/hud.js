// 字幕层：卡拉 OK 录像带的歌词（奶黄色 + 深色粗描边，随演唱从左到右染成阿发的青绿色）、念白标签、小号和声、磁带 OSD
// 画在离屏画布上，交给 CRT 管线在调色之后合成（字是录在带子上的）
import { W, H, rgba } from './cel.js';

const FONT = '700 56px "Barlow SC","Noto SC"', Y = H - 96;
const CREAM = '#fff0a0', SUNG = '#58f0e0', OUT = '#120a1e';

function wipeX(c, L, t) {   // 已唱到的 x（相对行首）
  const ct = L.ct; if (!ct.length) return 0;
  if (t <= ct[0][2]) return 0;
  for (let k = 0; k < ct.length; k++) {
    const [a, b, ts] = ct[k], te = k + 1 < ct.length ? ct[k + 1][2] : L.t1;
    if (t < te) { const x0 = c.measureText(L.text.slice(0, a)).width, x1 = c.measureText(L.text.slice(0, b)).width; return x0 + (x1 - x0) * Math.min(1, (t - ts) / Math.max(.08, Math.min(te - ts, .6))); }
  }
  return c.measureText(L.text).width;
}
export function lineAt(LYR, t, kind) { return LYR.find(l => (kind ? l.kind === kind : l.kind !== 'adlib') && t >= l.a && t < l.b); }

export function hud(c, t, LYR, osd) {
  const L = lineAt(LYR, t), A = lineAt(LYR, t, 'adlib');
  c.save(); c.textBaseline = 'middle'; c.lineJoin = 'round'; c.textAlign = 'left';
  if (L) {
    c.font = FONT;
    const tw = c.measureText(L.text).width, spoken = L.kind === 'spoken', tagW = spoken ? 124 : 0, x = (W - tw - tagW) / 2 + tagW;
    if (spoken) {
      const tx = x - tagW, ty = Y - 25;
      c.fillStyle = rgba('#07121a', .78); c.beginPath(); c.roundRect(tx, ty, 100, 50, 8); c.fill();
      c.strokeStyle = SUNG; c.lineWidth = 2.5; c.stroke();
      c.font = '700 30px "Noto SC"'; c.fillStyle = SUNG; c.textAlign = 'center'; c.fillText('念白', tx + 50, Y + 1); c.textAlign = 'left'; c.font = FONT;
    }
    c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 10; c.shadowOffsetY = 3;
    c.strokeStyle = OUT; c.lineWidth = 9; c.strokeText(L.text, x, Y);
    c.shadowColor = 'transparent';
    c.fillStyle = CREAM; c.fillText(L.text, x, Y);
    if (!spoken) {
      const wx = wipeX(c, L, t);
      if (wx > 0) { c.save(); c.beginPath(); c.rect(x - 4, Y - 50, wx + 4, 100); c.clip(); c.fillStyle = SUNG; c.fillText(L.text, x, Y); c.restore(); }
    }
  }
  if (A) {
    c.font = 'italic 800 40px Kanit'; const s = `( ${A.text} )`, tw = c.measureText(s).width, x = (W - tw) / 2, y = Y - 74;
    c.strokeStyle = OUT; c.lineWidth = 8; c.strokeText(s, x, y); c.fillStyle = '#8ff4ff'; c.fillText(s, x, y);
  }
  // 磁带 OSD：左上角
  if (osd) {
    c.font = '700 44px "Barlow SC"'; c.textAlign = 'left';
    const x = 96, y = 92;
    c.strokeStyle = OUT; c.lineWidth = 8; c.strokeText(osd.text, x, y); c.fillStyle = '#eaffea'; c.fillText(osd.text, x, y);
    if (osd.right) { c.textAlign = 'right'; c.strokeText(osd.right, W - 96, y); c.fillText(osd.right, W - 96, y); }
  }
  c.restore();
}
export const SUB_BOX = (c, L) => { c.save(); c.font = FONT; const tw = c.measureText(L.text).width; c.restore(); return [(W - tw) / 2, Y - 34, (W + tw) / 2, Y + 34]; };
