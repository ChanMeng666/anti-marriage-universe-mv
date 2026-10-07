// 色指定：日光标准色 → 按场合（饭桌暖灯 / 咖啡馆 / 夜 / 黎明 / 正午 / 电视背光 / 剪影）换算
// 阿发的强调色是青绿（teal），在每一套里都保持跳出来；皮肤每套单独指定
import { hex } from './cel.js';

export const TEAL = '#19c9bd', RED = '#ef3b4a';
export const BASE = {
  skin: { f: '#f6cfae', s: '#d79a80', h: '#ffe9d4', l: '#5a2e2a' },
  skinOld: { f: '#dfa474', s: '#b3724c', h: '#f6cf9e', l: '#55291c' },
  skinF: { f: '#ffdcc8', s: '#e2a395', h: '#fff1e8', l: '#5a2e2e' },
  blush: '#ff9a9a',
  hair: { f: '#2b2f52', s: '#191b36', h: '#7384c8', l: '#14152c' },
  hairOld: { f: '#eef0f4', s: '#b4bccb', h: '#ffffff', l: '#5a6078' },
  hairF: { f: '#3a2a4e', s: '#22172f', h: '#8a6ab0', l: '#1a1026' },
  hairM: { f: '#54405e', s: '#352740', h: '#9a82a8', l: '#1e1428' },
  lash: '#1c1226',
  suit: { f: '#3d4668', s: '#262c48', h: '#6672a0', l: '#141830' },
  shirt: { f: '#f2f4fa', s: '#b9c2da', h: '#ffffff', l: '#48527a' },
  teal: { f: '#19c9bd', s: '#0e8c8a', h: '#93f7ea', l: '#0a4244' },
  red: { f: '#ef3b4a', s: '#b01f3c', h: '#ff9a8c', l: '#5e0f24' },
  leather: { f: '#7a5038', s: '#4e3024', h: '#b08460', l: '#2a1810' },
  pants: { f: '#39405e', s: '#22263e', h: '#5b6490', l: '#0d0f1f' },
  jeans: { f: '#4a66a8', s: '#2e4278', h: '#86a4dc', l: '#162040' },
  boot: { f: '#48424f', s: '#2a2632', h: '#80798f', l: '#121016' },
  glove: { f: '#3e3a4a', s: '#26232f', h: '#7a7690', l: '#100e16' },
  white: { f: '#f3f6fc', s: '#a9b3cd', h: '#ffffff', l: '#39456a' },
  dark: { f: '#2b2d40', s: '#181a26', h: '#50546e', l: '#08090f' },
  chrome: { f: '#dfe7f3', s: '#646f90', h: '#ffffff', l: '#2b3350' },
  gold: { f: '#e2b24e', s: '#9a6c28', h: '#fff0b0', l: '#4d3210' },
  tire: { f: '#23232f', s: '#15151c', h: '#565873', l: '#07070b' },
  seat: { f: '#3a2e30', s: '#221a1e', h: '#6a5a58', l: '#0e0a0c' },
  eye: { f: '#4a5a8c', s: '#232c52', h: '#a8c0f0', l: '#10142c' },
  eyeM: { f: '#7a4a9a', s: '#3c2256', h: '#d0a8ee', l: '#1c0f2c' },
  white_eye: '#fbf8ff',
  mouth: '#9a3b4a',
  lip: '#d0405a',
  purple: { f: '#8a4ab8', s: '#5a2a86', h: '#c69aee', l: '#2a1048' },
  jade: { f: '#5fd8a0', s: '#2e9a70', h: '#c8ffe2', l: '#125038' },
  donkey: { f: '#a8a0a8', s: '#74708a', h: '#d4ced6', l: '#34304a' },
  horse: { f: '#8a5a3c', s: '#5c3826', h: '#c08e68', l: '#2c160e' },
  ox: { f: '#d8c8a8', s: '#a08c74', h: '#f6ecd6', l: '#4a3c2c' },
  wood: { f: '#b07a4e', s: '#7a4e34', h: '#dcae7e', l: '#3e2414' },
  cream: { f: '#f6ecd2', s: '#cdbf9c', h: '#fffaea', l: '#6a5a40' },
  paper: { f: '#efe6cc', s: '#c8b890', h: '#fff8e6', l: '#6a5838' },
};

const mul = (c, m) => { const v = hex(c); return '#' + v.map((x, i) => Math.max(0, Math.min(255, Math.round(x * m[i]))).toString(16).padStart(2, '0')).join(''); };

export const LIGHTS = {
  day: { lit: [1, 1, 1], shade: [1, 1, 1], line: [1, 1, 1] },
  amber: { lit: [1.04, .9, .72], shade: [.8, .56, .58], line: [.95, .7, .7] },
  cafe: { lit: [.96, .88, .9], shade: [.62, .54, .8], line: [.85, .7, .95] },
  night: { lit: [.78, .74, 1.0], shade: [.56, .5, .92], line: [.8, .7, 1.1] },
  dawn: { lit: [1.04, .9, .86], shade: [.84, .64, .8], line: [1, .8, .85] },
  noon: { lit: [1.03, 1.01, .97], shade: [.82, .86, 1.04], line: [.9, .9, 1.05] },
  tv: { lit: [.62, .8, 1.04], shade: [.26, .28, .56], line: [.4, .4, .8] },
  sil: { lit: [.2, .16, .32], shade: [.14, .1, .24], line: [.3, .2, .5] },
  cold: { lit: [.72, .8, .92], shade: [.46, .5, .74], line: [.7, .7, 1] },
};
export function palette(name) {
  const L = LIGHTS[name], out = {};
  for (const [k, v] of Object.entries(BASE)) {
    if (typeof v === 'string') { out[k] = mul(v, L.lit); continue; }
    out[k] = {};
    // 强调色（青绿 / 红）只吃一半的乘色：每套光里都保持跳色
    const acc = k === 'teal' || k === 'red';
    const half = m => m.map(x => acc ? (x + 1) / 2 + (x < 1 ? .04 : 0) : x);
    for (const [kk, c] of Object.entries(v)) out[k][kk] = mul(c, half(kk === 's' ? L.shade : kk === 'l' ? L.line : L.lit));
  }
  return out;
}
export const PAL = {};
for (const k of Object.keys(LIGHTS)) PAL[k] = palette(k);
// 皮肤每套单独指定（乘色会把脸染成粉色 / 橙色）
const skins = {
  amber: { f: '#f4c79a', s: '#c98a66', h: '#ffe6c0' }, cafe: { f: '#ecc6b0', s: '#a8829e', h: '#ffeadc' },
  night: { f: '#e4c4c0', s: '#957cae', h: '#fff0f0' }, dawn: { f: '#f8cba6', s: '#cc8a86', h: '#ffe9c8' },
  noon: { f: '#f8d2b0', s: '#d0998a', h: '#fff0de' }, tv: { f: '#a8c4e0', s: '#4a5a94', h: '#dcf2ff' }, cold: { f: '#d4c4c4', s: '#8c84a8', h: '#f0ecf0' },
};
const skinsOld = { noon: { f: '#e0a878', s: '#b47650', h: '#f8d6a4' }, dawn: { f: '#e4a47a', s: '#b06a5c', h: '#fad0a0' }, day: { f: '#dfa474', s: '#b3724c', h: '#f6cf9e' } };
for (const [k, v] of Object.entries(skins)) { Object.assign(PAL[k].skin, v); Object.assign(PAL[k].skinF, v); }
for (const [k, v] of Object.entries(skinsOld)) Object.assign(PAL[k].skinOld, v);
PAL.night.white_eye = '#e6e2fa'; PAL.tv.white_eye = '#d6e8ff'; PAL.cafe.white_eye = '#f2ecfa';
