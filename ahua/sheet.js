// Model sheets from the real drawing code: ?test=cast | faces
import { W, H, COL, cam, ground, put, at, inkText, mul, T, S } from './engine.js';
import { drawFig, POSE, HUA28, HUA28B, HUA, HUA40, HUA55, HUA68, FA, PRINCE, SIS, walk } from './figure.js';
export function sheet(g, kind, t) {
  const C = [1, 0, 0, 1, 0, 0];
  ground(g, kind === 'night' ? 'ink' : 'rice', C, kind === 'night' ? null : 'rgba(236,222,190,.35)');
  if (kind === 'faces') {
    const ex = ['cold', 'smirk', 'sing', 'firm', 'serene', 'sleep', 'wide', 'scared', 'blab', 'smug'];
    ex.forEach((e, i) => { const F = i < 7 ? [HUA28, HUA, HUA68, HUA28B, HUA40, HUA55, HUA][i % 7] : FA; drawFig(g, C, F, { ...POSE.stand, x: 200 + (i % 5) * 380, y: 760 + Math.floor(i / 5) * 560, s: 2.6, expr: e }); g.setTransform(1, 0, 0, 1, 0, 0); inkText(g, e, 200 + (i % 5) * 380, 40 + Math.floor(i / 5) * 540, 26, '#333', 600); });
    return;
  }
  const row = [[HUA28, POSE.stand, 'cold'], [HUA28, POSE.sitBack, 'smirk'], [HUA, walk(t), 'serene'], [HUA, POSE.sword, 'firm'], [HUA68, POSE.open, 'sing'], [FA, POSE.point, 'blab'], [PRINCE, POSE.cower, 'scared']];
  row.forEach(([F, p, e], i) => drawFig(g, C, F, { ...p, x: 150 + i * 270, y: 520, s: 1.05, expr: e }));
  const row2 = [[HUA40, POSE.throwA, 'firm'], [HUA55, POSE.throwB, 'sing'], [SIS[0], POSE.hands, 'serene'], [SIS[1], POSE.hands, 'smirk'], [SIS[2], POSE.shrug, 'serene'], [SIS[3], POSE.push, 'firm'], [SIS[4], POSE.stand, 'serene']];
  row2.forEach(([F, p, e], i) => drawFig(g, C, F, { ...p, x: 150 + i * 270, y: 1040, s: 1.05, expr: e, dir: i === 3 ? -1 : 1 }));
}
