// Model sheet: ?sheet=1 (cast, expressions, key poses, palette, and the same pair with 1 / 2 / 3 plates)
import { g, W, H, S, clear, rect, text, layer, circle } from './engine/draw.js';
import { R, T, Y, K, SKIN, tint, LOOK, figure, head, cup, key, chair, table, moto, rider, laptop, mask, warrior, glass, regmark, scissors, sofa } from './cast.js';
export function modelSheet() {
  clear();
  const lab = (s, x, y) => text(s, x, y, '700 26px NotoSC', K);
  // row 1: the date
  lab('阿发 · 相亲那天', 60, 60); lab('阿花 · 相亲那天', 560, 60); lab('后来的阿花', 1040, 60); lab('后来的阿发', 1460, 60);
  layer(() => { chair(210, 330, 1, T); figure(210, 330, .8, LOOK.fa1, { lean: -.22, handB: [-70, -30], bendB: -1, handF: [90, -40], headO: { brow: -.5, mouth: 'smile' } }); });
  layer(() => { figure(400, 300, .72, LOOK.fa1, { legs: 'stand', handF: [70, -150], bendF: -1, headO: { mouth: 'open', brow: -.6 } }); });
  layer(() => { chair(720, 330, -1, R); figure(720, 330, .8, LOOK.hua1, { dir: -1, lean: .04, handF: [84, -34], headO: { lid: .5, brow: 0, mouth: 'flat' } }); });
  layer(() => { figure(900, 300, .72, LOOK.hua1, { dir: -1, legs: 'walk', ph: .9, handF: [-30, -20], headO: { sway: .6 } }); });
  layer(() => { figure(1180, 330, .8, LOOK.hua2, { legs: 'feetup', lean: -.2, handF: [80, -60], handB: [70, -56], headO: { mouth: 'smile' } }); laptop(1290, 300, .9, R); });
  layer(() => rider(1640, 440, .8, .6));
  // row 2: heads / expressions
  lab('表情', 60, 520);
  const hs = [[LOOK.fa1, { brow: -.5, mouth: 'smile' }], [LOOK.fa1, { mouth: 'open', wide: 1, brow: .5 }], [LOOK.fa1, { lid: 1, mouth: 'flat' }], [LOOK.fa3, { mouth: 'smile' }],
    [LOOK.hua1, { lid: .5, mouth: 'flat' }], [LOOK.hua1, { wide: 1, brow: .6, hairUp: 1 }], [LOOK.hua1, { lid: 1, mouth: 'smile' }], [LOOK.hua2, { mouth: 'smile', brow: -.2 }]];
  hs.forEach(([L, o], i) => layer(() => { g.save(); g.translate(130 + i * 150, 640); g.scale(1.25, 1.25); head(L, o); g.restore(); }));
  // props
  lab('道具', 1300, 520);
  table(1400, 620, 160); cup(1360, 620, .8); cup(1440, 620, .8); key(1540, 640, .7, .3); glass(1680, 760, .7, R, tint(Y, 1)); glass(1760, 760, .7, T, Y);
  mask(1560, 900, .5, 'suit', T); mask(1720, 900, .5, 'doll', R); scissors(1340, 860, .7, .6, R, -.4); regmark(1860, 620, 34, R); regmark(1866, 626, 34, T);
  warrior(1320, 1040, .55, .45);
  // row 3: plates = story. the same table with his plate, her plate, both, and the light
  lab('一版 · 他的样张', 60, 790); lab('一版 · 她的样张', 370, 790); lab('两版', 680, 790); lab('三版', 990, 790);
  const pair = (x, m) => {
    const keep = S.mask; S.mask = m;
    rect(x, 810, 140, 240, [.24, 0, 0]); rect(x + 140, 810, 140, 240, [0, .24, 0]);
    layer(() => { table(x + 140, 960, 90); cup(x + 120, 960, .4); cup(x + 160, 960, .4); figure(x + 60, 990, .42, LOOK.fa1, { lean: -.2, handF: [90, -40] }); figure(x + 220, 990, .42, LOOK.hua1, { dir: -1, handF: [84, -34] }); }, 3);
    S.mask = keep;
  };
  pair(60, [0, 1, 0]); pair(370, [1, 0, 0]); pair(680, [1, 1, 0]); pair(990, [1, 1, 1]);
  // palette
  [[R, '红 · 她'], [T, '青 · 他'], [Y, '黄 · 别人与光'], [K, '红×青 · 唯一共有的桌子'], [tint(R, .45), '45%'], [tint(T, .5), '50%'], [SKIN, '肤']].forEach(([c, n], i) => { rect(60 + i * 0, 0, 0, 0, c); });
  return { seed: 1, off: [[2, -1.5], [-2.5, 2], [1, 1]] };
}
