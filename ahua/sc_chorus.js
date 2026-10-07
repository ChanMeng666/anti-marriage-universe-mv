// The chorus, three times: v = 0 (28, one woman and a fire basin), 1 (the traveller and the white horse), 2 (68, a chain of sisters).
// Same eight lines, the same beat offsets (K grid beats later each time), a different staging and a larger frame.
import { W, H, COL, DEG, TAU, canvas, put, at, mul, T, R, S, ap, cam, ground, step, seg, eio, eo, ei, lerp, clamp, hash, scraps, pop, arrive, keys, hitShake, foldPut, foldTh, back, holesOf } from './engine.js';
import { drawFig, POSE, HUA28, HUA, HUA68, PRINCE, SIS, walk, tieEnd } from './figure.js';
import { mask, apron, paperMan, priceTag, basin, drawFlames, drawScissors, drawHorse, castle, castleDoor, flag, calBlock, calLeaf, corset, bouquet, table, orb, world, sun, codeFlower, paneFrame, paneBack, ridge, bundle } from './props.js';
import { nightLand, dayLand, floor, layer, lightPass, pool, lightImage, emitGlow, emitPiece, emitShape, emitEnd, emitCtx, sparks, bloom } from './sets.js';
import { glowWindow, E } from './lib/light.js';
import { say } from './film.js';

export const AMB = 'rgb(140,142,188)';
const HUAS = [HUA28, HUA, HUA68];
// ---- fire: paper pass, light pool, emissive pass ----
export function firePaper(g, C, x, y, sc, t, lit = 1, n = 5) { if (lit > 0) drawFlames(g, C, x, y - 56 * sc, t, sc * lit, n); put(g, basin(), at(C, x, y, sc), { shadow: 1.2 }); }
export function firePool(C, x, y, sc, t, lit = 1) { const p = ap(C, [x, y - 120 * sc]), f = .88 + .12 * hash(Math.floor(t * 12)); pool(p[0], p[1], 820 * sc * C[0] * (.6 + .4 * lit), 'rgba(255,190,120,1)', .7 * f * Math.min(1, lit + .25)); }
export function fireEmit(C, x, y, sc, t, lit = 1, n = 5, sp = 30) {
  const p = ap(C, [x, y - 130 * sc]), f = .88 + .12 * hash(Math.floor(t * 12) + 3);
  if (lit > 0) { emitGlow(p[0], p[1], 250 * sc * C[0] * Math.min(lit, 1.2) * f, .42); drawFlames(null, C, x, y - 56 * sc, t, sc * lit, n, { each: (fp, M) => emitShape(fp, M, '#ff7a28', .5) }); }
  emitPiece(basin(), at(C, x, y, sc), '#1a1420');
  if (lit > 0 && sp) sparks(C, x, y - 150 * sc, t, sp, { rise: 420 * sc, spread: 240 * sc, life: 2.6 });
}
// rider on the horse: pelvis on the saddle point
export function rider(g, C, F, sad, dir, s, pose) { const p = ap(sad, [0, 0]), k = C[0]; return drawFig(g, [1, 0, 0, 1, 0, 0], F, { ...POSE.ride, ...pose, x: p[0], y: p[1] + 104 * s * k, s: s * k, dir }, { noFarLeg: true }); }
const [Uc, Ug] = canvas(W, H);

export function shots(TL) {
  const G = TL.G, out = [];
  const add = (id, t0, draw, tr) => out.push({ id, t0, draw, tr });
  for (const v of [0, 1, 2]) {
    const K = [0, 152, 272][v], B = i => G(i + K), HF = HUAS[v], cid = 'C' + (v + 1), day = v === 2;
    const c = [135, 145, 152, 161, 169, 177, 184, 192].map(B), cEnd = v === 0 ? TL.cut('V2.0') : v === 1 ? B(210) : B(192);
    const land = day ? dayLand : nightLand;

    // ---------- C.0 觉醒吧 觉醒吧 ----------
    const tW1 = TL.hit(cid + '.wake1', B(137)), tW2 = TL.hit(cid + '.wake2', B(142));
    if (v === 0) add(cid + '.0', c[0], (g, t) => {     // the eye opens, by firelight
      const st = step(t), u = seg(t, c[0], c[1]), C = cam(960, 540, lerp(1, 1.1, u));
      nightLand(g, 960 + u * 60, 540, 1, t, { moonX: 1640 });
      drawFig(g, C, HUA28, { ...POSE.stand, x: 760, y: 3190, s: 6.3, head: st < tW1 ? 6 : st < tW2 ? 0 : -5, expr: st < tW1 ? 'sleep' : st < tW2 ? 'cold' : 'firm', headS: pop(st, tW1, 1.03) * pop(st, tW2, 1.04) }, { K: 7, shadow: 1.6 });
      lightPass(g, 'rgb(112,112,160)', () => { const f = .85 + .15 * hash(Math.floor(t * 12)); pool(1500, 900, 1300, 'rgba(255,186,120,1)', (st < tW1 ? .5 : st < tW2 ? .75 : 1) * f); });
      emitGlow(1900, 1160, 620, .9); sparks([1, 0, 0, 1, 0, 0], 1650, 1100, t, 46, { rise: 1100, spread: 700, life: 3.4, size: 1.6 });
      emitEnd(g, 1, .8);
    }, { type: 'peel', d: .82, back: COL.n3 });
    if (v === 1) {   // one lit window, then many
      const cols = 5, rows = 3, PW = 300, PH = 250, GX = 372, GY = 316, pane = (i, j) => [960 + (i - 2) * GX, 540 + (j - 1) * GY];
      const order = [[2, 1], [0, 0], [4, 2], [1, 2], [3, 0], [4, 1], [0, 1], [2, 0], [3, 2], [1, 0], [0, 2], [2, 2], [4, 0], [1, 1], [3, 1]];
      const onAt = k => k === 0 ? -1 : k <= 2 ? tW1 + (k - 1) * TL.per / 2 : k <= 7 ? tW2 + (k - 3) * TL.per / 2 : tW2 + TL.per * 2 + (k - 8) * TL.per / 2;
      add(cid + '.0', c[0], (g, t) => {
        const st = step(t), u = eio(seg(t, c[0] + .3, tW2 + .4)), C = cam(960, 540, lerp(2.5, .98, u));
        ground(g, 'ink', layer(960, 540, C[0], .2));
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const [x, y] = pane(i, j); put(g, paneBack(COL.n2), at(C, x, y, PW / 320, 0, 1), { shadow: .5 }); put(g, paneFrame(), at(C, x, y, PW / 316 * 1.02), { shadow: .8 }); }
        lightPass(g, 'rgb(150,150,196)', () => order.forEach(([i, j], k) => { if (st >= onAt(k)) { const p = ap(C, pane(i, j)); pool(p[0], p[1], 300 * C[0], 'rgba(255,190,120,1)', .5); } }));
        order.forEach(([i, j], k) => { if (st < onAt(k)) return; const [x, y] = pane(i, j), I = k === 0 ? 1 : Math.min(1, .7 + .3 * pop(st, onAt(k), 2));
          const fl = k === 0 ? { p: codeFlower(), M: [1.9, 0, 0, 1.9, x, y] } : { p: orb(COL.red, 84, 8 + (k % 3) * 2, k), M: [.92, 0, 0, .92, x, y] };
          for (const ctx of [g, E]) glowWindow(ctx, C, { x, y, w: PW - 22, h: PW - 22 }, I, fl, { tcol: '#c9241a' }); });
        bloom(g, .6);
      }, { type: 'peel', d: .8, back: COL.n3 });
    }
    // v = 2: fold – cut – unfold. One figure, then 2, 4, 8: every unfold on a call.
    const D = 214, CS = 1, chainX = k => 960 + (k - 4.5) * D;          // k = 2 … 9 after three unfolds
    const tU = [tW1, B(139), tW2], swapAt = k => tW2 + .45 + ((k * 5) % 8) * TL.per / 2;
    const chainFig = (k, st) => k === 4 || st < swapAt(k) ? HUA68 : SIS[(k + 3) % 7];
    function chain(g, C, t, st, ks, o = {}) {
      for (const k of ks) { const dir = k % 2 ? -1 : 1, ph = Math.floor((st - TL.g0) / TL.per) % 2;
        drawFig(g, C, chainFig(k, st), { ...POSE.hands, x: chainX(k), y: o.y || 900, s: CS * pop(st, swapAt(k), k === 4 ? 1 : 1.12), dir, bob: st > tW2 + .5 ? (ph ^ (k % 2) ? -6 : 0) : 0, expr: st < tW1 ? 'sleep' : st < tW2 ? 'serene' : (k === 4 ? 'sing' : 'serene'), head: st > tW2 ? -6 : 0 }, { shadow: o.shadow ?? 1 }); }
    }
    function daySet(g, cx, z, t, sunY = 250, cy = 640) { dayLand(g, cx, cy, z, t, { tint: 'rgba(240,214,170,.5)' }); put(g, sun(), at(layer(cx, cy, z, .12), 1500, sunY, 1.05, t * .05), { shadow: .8 }); floor(g, layer(cx, cy, z, 1), 900, COL.pale2, -1400); floor(g, layer(cx, cy, z, 1), 900, COL.pale2, 2000); }
    if (v === 2) add(cid + '.0', c[0], (g, t) => {
      const st = step(t), stage = st < tU[0] ? 0 : st < tU[1] ? 1 : st < tU[2] ? 2 : 3, cxs = [chainX(4), 960 - D * .5 + D * .5, chainX(3.5), 960 + D];
      const cx = keys(t, [[c[0], chainX(4)], [tU[0] + .3, chainX(4.5), .3], [tU[1] + .3, chainX(3.5), .3], [tU[2] + .4, chainX(5.5), .4]], .3, eo), z = keys(t, [[c[0], 1.6], [tU[0] + .3, 1.4, .3], [tU[1] + .3, 1.16, .3], [tU[2] + .45, 1.0, .45]], .3, eo);
      const sk = hitShake(t, [tU[0], tU[2]], 5), C = cam(cx + sk[0], 650 + sk[1], z * pop(st, tU[2] + .3, 1.02));
      daySet(g, cx, z, t);
      const sets = [[4], [4, 5], [2, 3, 4, 5], [2, 3, 4, 5, 6, 7, 8, 9]], folds = [chainX(4.5), chainX(3.5) - D / 2, chainX(5.5)];
      const prev = stage === 0 ? [4] : sets[stage - 1], fu = stage === 0 ? 1 : eo(seg(t, tU[stage - 1], tU[stage - 1] + .3));
      if (stage > 0 && fu < 1) {      // the new half swings out of the fold: the mirror image of what is there
        chain(g, C, t, st, prev);
        Ug.setTransform(1, 0, 0, 1, 0, 0); Ug.clearRect(0, 0, W, H); chain(Ug, C, t, st, prev, { shadow: 0 });
        const k = Math.cos(Math.PI * fu), fx = ap(C, [folds[stage - 1], 0])[0];
        g.save(); g.setTransform(k, 0, 0, 1 + .1 * Math.sin(Math.PI * fu), fx * (1 - k), -H * .05 * Math.sin(Math.PI * fu)); g.shadowColor = 'rgba(52,6,10,.45)'; g.shadowBlur = 16 * Math.sin(Math.PI * fu) + 4; g.shadowOffsetX = 6; g.shadowOffsetY = 10;
        if (k > 0) g.filter = 'brightness(1.18) saturate(.8)'; g.drawImage(Uc, 0, 0); g.restore();
      } else chain(g, C, t, st, sets[stage]);
      for (const tu of tU) scraps(g, C, t, tu, cx, 500, 10, [COL.red, COL.pale, COL.gold], { size: 9, spread: 620, up: 320, life: 1.8, seed: tu });
    }, { type: 'slide', d: .22, dir: [0, -1] });

    // ---------- C.1 + C.2 就算王子真的骑着白马 / 也直接让他滚回城堡吧 ----------
    const tPoint = TL.hit(cid + '.point', B(152)), tRear = B(153), tOff = B(154), tRoll = B(v === 0 ? 155 : 154) + (v === 0 ? .2 : 0), tSlam = TL.hit(cid + '.slam', B(v === 0 ? 159 : 158)), CX = 3300;
    const tBack = B(158) + .1, tMount = TL.hit(cid + '.mount', B(159));
    function princeShot(g, t) {
      const st = step(t);
      // the horse arrives
      const arr = eo(seg(t, c[1] + .1, c[1] + 2.3)), hx = lerp(2500, 1330, arr), stopped = arr >= 1, rearU = st < tRear ? (stopped && st < c[2] ? 0 : 0) : Math.min(1, (st - tRear) / .16) * (v === 1 && st >= tMount ? 1 : st > tRear + .9 && v !== 1 ? Math.max(0, 1 - (st - tRear - .9) / .3) : 1);
      const gone = st >= tOff, rollU = seg(t, tRoll, tSlam), px = gone ? lerp(1470, CX - 20, v === 0 ? eio(rollU) : ei(rollU) * .5 + rollU * .5) : hx;
      // camera: pan with the arrival, whip with the roll, and (v1) whip back to her on the horse
      let cx = lerp(1300, 1000, arr); if (t > tRoll) cx = lerp(1000, CX - 240, eio(seg(t, tRoll + .15, tSlam - .1)));
      if (v === 1 && t > tBack) cx = lerp(CX - 240, 1080, eio(seg(t, tBack, tMount + .1)));
      const sk = hitShake(t, [tSlam, ...(v === 2 ? [tSlam + .95] : [])], 12), z = 1.3, C = cam(cx + sk[0], 640 + sk[1], z);
      if (day) daySet(g, cx, z, t); else { nightLand(g, cx, 640, z, t); floor(g, C, 900, COL.n2, -900); floor(g, C, 900, COL.n2, 2500); }
      // castle (far right)
      const fold = v === 2 ? seg(t, tSlam + .5, tSlam + .95) : 0, flat = 0, ccol = day ? COL.pale : COL.n3;
      const cM = mul(at(C, CX, 902, 1.45), S(1, 1 - .93 * flat));
      if (fold > 0) foldPut(g, castle(ccol), cM, 0, 1, Math.PI * eo(fold), { back: day ? COL.pale3 : COL.n4 }); else put(g, castle(ccol), cM, {});
      if (!flat) put(g, flag(), mul(cM, mul(T(0, -474), R(Math.sin(t * 7) * (st >= tSlam ? .25 * Math.max(0, 1 - (t - tSlam)) : .04)))), { shadow: .6 });
      if (st >= tSlam && fold <= 0) put(g, castleDoor(day ? COL.deep : COL.n4), mul(cM, mul(T(0, 0), S(pop(st, tSlam, 1.12)))), { shadow: 1 });
      // her side
      const hy = 900;
      if (v === 0) { firePaper(g, C, 330, 762, 1.15, t, .8); drawFig(g, C, HF, keys(st, [[c[1], { ...POSE.stand, x: 640, y: hy, expr: 'cold', aN: [-14, 100], aF: [-22, 104] }], [tPoint, { ...POSE.point, x: 660, y: hy, expr: 'sing' }], [tRoll + .5, { ...POSE.point, x: 660, y: hy, expr: 'smirk' }], [tRoll + .9, { ...POSE.stand, x: 660, y: hy, expr: 'smirk', aN: [-14, 100], aF: [-22, 104] }]], .12)); }
      if (v === 1 && st < tMount) { const r = drawFig(g, C, HF, keys(st, [[c[1], { ...POSE.stand, x: 760, y: hy, expr: 'cold' }], [tPoint - .3, { ...POSE.stand, x: 900, y: hy, expr: 'firm', aN: [60, 40] }], [tPoint, { ...POSE.stand, x: 1000, y: hy, expr: 'firm', aN: [96, 4], lean: 10 }], [tRoll, { ...POSE.stand, x: 1000, y: hy, expr: 'smirk', aN: [60, 60] }]], .14));
        const h = ap(r.handN, [0, 0]); drawScissors(g, [1, 0, 0, 1, 0, 0], h[0] + 130 * C[0], h[1] - 30 * C[0], -.35, st < tPoint ? 1 : 0, C[0] * .8); }
      if (v === 2) [[HUA68, 560, 'smirk', 1], [SIS[1], 400, 'smirk', .96], [SIS[3], 250, 'serene', .94]].forEach(([F, x, e, s], i) => drawFig(g, C, F, keys(st, [[c[1], { ...POSE.sitBack, bob: 0, lN: [3, 0], lF: [-4, 2], x, y: hy, s, expr: e, lean: -4 }], [tPoint - .12, { ...POSE.stand, x, y: hy, s, expr: e, aN: [60, 100], aF: [50, 104] }], [tPoint, { ...POSE.stand, x, y: hy, s, expr: 'sing', aN: [70, 60], aF: [66, 62], lean: 6 }], [tPoint + .5, { ...POSE.sitBack, bob: 0, lN: [3, 0], lF: [-4, 2], x, y: hy, s, expr: 'smirk', lean: -4 }]], .1)));
      // the prince's train of paper copies (v2): they concertina shut on the clap
      // (chorus 3 once had a train of paper princes here; one prince reads better)
      // horse + prince
      const kind = !stopped ? 'gallop' : rearU > 0 ? 'rear' : 'walk', ph = !stopped ? (2500 - hx) / 430 : 0;
      const hdir = v === 1 && st >= tMount ? 1 : -1, hxx = v === 1 && st >= tMount ? 1130 : hx;
      const sad = drawHorse(g, C, hxx, hy, 1, hdir, ph + (stopped ? t * .4 : 0), kind, { rear: rearU });
      if (!gone) rider(g, C, PRINCE, sad, -1, 1, { expr: st >= tPoint ? 'scared' : st > c[1] + 2.3 ? 'blab' : 'smug', aN: st >= tRear ? [150, 30] : [50, 40], aF: st >= tRear ? [140, 40] : [44, 44], lean: st >= tRear ? -20 : 6 });
      else if (st < tSlam) { // off the horse, then literally rolling home
        const fall = seg(t, tOff, tRoll), rot = t < tRoll ? fall * 1.6 : 1.6 + (px - 1470) / 105, y = hy - 60 - (1 - fall) * 200 - Math.abs(Math.sin(rollU * 22)) * 14 * (t > tRoll ? 1 : 0);
        for (let k = 0; k >= 0; k--) drawFig(g, mul(mul(C, T(px, y - 104 * .8)), R(rot)), PRINCE, { ...POSE.cower, x: 0, y: 190 * .8, s: .9, dir: -1, expr: 'scared', lean: 40, bob: 80 });
        if (t > tRoll) scraps(g, C, t, tRoll, 1500, 880, 6, [COL.cream2, COL.n4], { size: 8, spread: 200, up: 160, life: 1 });
      }
      if (v === 1 && st >= tMount) { const r = rider(g, C, HF, sad, 1, 1, { expr: 'sing', aN: [150, 8], lean: -10, head: -8 }); const h = ap(r.handN, [0, 0]); drawScissors(g, [1, 0, 0, 1, 0, 0], h[0] + 20 * C[0], h[1] - 120 * C[0], -1.35, .8, C[0] * .8); }
      if (st >= tSlam) scraps(g, C, t, tSlam, CX, 800, 8, day ? [COL.pale, COL.pale2] : [COL.n4, COL.n5], { size: 9, spread: 300, up: 260, life: 1.3 });
      if (!day) {
        lightPass(g, v === 1 ? 'rgb(168,168,208)' : AMB, () => { if (v === 0) firePool(C, 330, 762, 1.15, t, .8); const p = ap(C, [CX, 700]); pool(p[0], p[1], 520, 'rgba(160,190,255,1)', .35); });
        if (v === 0) fireEmit(C, 330, 762, 1.15, t, .8, 5, 20);
        emitEnd(g, 1, .7);
      }
    }
    add(cid + '.1', c[1], princeShot, v === 0 ? { type: 'slide', d: .25, dir: [1, 0] } : v === 1 ? { type: 'slide', d: .25, dir: [1, 0] } : { type: 'slide', d: .25, dir: [1, 0] });

    // ---------- C.3 我的广阔天地无需那个他 ----------
    if (v === 0) add(cid + '.3', c[3], (g, t) => {      // pull back: the land, and her on it
      const st = step(t), u = eio(seg(t, c[3], c[3] + 3)), z = lerp(1.8, 1.02, u), cy = lerp(680, 620, u), C = cam(960, cy, z), tO = B(162);
      nightLand(g, 960, cy, z, t, { moonX: 1400 }); floor(g, C, 900, COL.n2, -1400);
      put(g, ridge(4200, 150, COL.n3, 9, true), at(C, -1200, 1010), { shadow: 1 });
      firePaper(g, C, 250, 762, 1.15, t, .8);
      drawFig(g, C, HF, keys(st, [[c[3], { ...POSE.stand, x: 960, y: 900, expr: 'firm', head: -4 }], [tO, { ...POSE.open, x: 960, y: 900, expr: 'sing' }]], .16));
      for (let k = 0; k < 3; k++) scraps(g, C, t, c[3] + k * .9, 300 + k * 500, 300, 7, [COL.pale2, COL.cream2, COL.n5], { size: 7, spread: 500, up: 60, grav: 50, vx: 380, life: 3.4, float: 1, seed: k });
      lightPass(g, 'rgb(160,160,205)', () => firePool(C, 250, 762, 1.15, t, .8)); fireEmit(C, 250, 762, 1.15, t, .8, 5, 20); emitEnd(g, 1, .7);
    }, { type: 'slide', d: .25, dir: [-1, 0] });
    if (v === 1) add(cid + '.3', c[3], (g, t) => {      // she rides: the widest, fastest shot
      const st = step(t), x = 600 + (t - c[3]) * 980, cx = x + 150, C = cam(cx, 640, 1.32);
      nightLand(g, 960 + (cx - 960) * .5, 640, 1.32, t, { moonX: 1500 + (cx - 960) * .92 }); floor(g, C, 900, COL.n2, Math.floor(cx / 1700) * 1700 - 1700);
      const sad = drawHorse(g, C, x, 900, 1, 1, (t - c[3]) * 2.3, 'gallop');
      rider(g, C, HF, sad, 1, 1, { expr: 'sing', aN: [70, 30], aF: [60, 34], lean: 14, head: -8 });
      put(g, ridge(4200, 90, COL.n0, 12, true), at(mul(cam(cx * 1.5, 560, 1.06), T(Math.floor(cx * 1.5 / 4000) * 4000 - 1000, 0)), 0, 1090), { shadow: 0 });
      scraps(g, C, t, c[3], x - 150, 880, 9, [COL.n4, COL.n5], { size: 8, spread: 200, up: 220, vx: -300, life: 3.5, seed: 3 });
      lightPass(g, 'rgb(176,176,214)', () => { const p = ap(C, [x, 700]); pool(p[0], p[1], 700, 'rgba(190,205,255,1)', .5); }); emitEnd(g, 1, 0);
    }, { type: 'slide', d: .25, dir: [-1, 0] });
    if (v === 2) add(cid + '.3', c[3], (g, t) => {      // the sisters in a ring: rotation round the rosette's centre
      const st = step(t), u = seg(t, c[3], c[4]), z = lerp(1.12, .98, eio(u)), C = cam(960, 520, z), a0 = (t - c[3]) * .42, R0 = 196;
      daySet(g, 960, z, t, 200);
      put(g, world(COL.red, 330), at(C, 960, 500, .61, a0), { shadow: 1.4 });
      for (let k = 0; k < 8; k++) { const a = a0 + k * TAU / 8, ph = Math.floor((st - TL.g0) / TL.per) % 2;
        drawFig(g, mul(mul(C, T(960 + Math.cos(a) * R0, 500 + Math.sin(a) * R0)), R(a + Math.PI / 2)), k === 0 ? HUA68 : SIS[(k + 2) % 7], { ...POSE.hands, x: 0, y: 0, s: .68, dir: 1, aN: [70, 10], aF: [-70, -10], bob: ph ^ (k % 2) ? -5 : 0, expr: 'serene' }, { shadow: .8 }); }
    }, { type: 'slide', d: .25, dir: [0, 1] });

    // ---------- C.4 觉醒吧 战士阿花 ----------
    const tSw = TL.hit(cid + '.sword', B(173));
    add(cid + '.4', c[4], (g, t) => {
      const st = step(t), sk = hitShake(t, [tSw], 8), z = lerp(1.3, 1.38, seg(t, c[4], c[5])) * pop(st, tSw, 1.03), C = cam(960 + sk[0], (v === 1 ? 560 : 600) + sk[1], z), up = st >= tSw;
      const sw = (F, x, y, s, o = {}, ctx = g, fo = {}) => { const r = drawFig(ctx, C, F, keys(st, [[c[4], { ...POSE.stand, x, y, s, expr: 'firm', aN: [10, 30], ...o }], [tSw - .16, { ...POSE.stand, x, y, s, expr: 'firm', aN: [-30, 60], lean: 6, ...o }], [tSw, { ...POSE.sword, x, y, s, expr: 'sing', ...o }]], .1), fo); if (ctx !== g) return; const h = ap(r.handN, [0, 0]); drawScissors(g, [1, 0, 0, 1, 0, 0], h[0] + (up ? 8 : 60) * C[0] * s, h[1] - (up ? 120 : -70) * C[0] * s, up ? -1.42 : .9, up ? .85 : .1, C[0] * .86 * s); };
      if (v === 0) { nightLand(g, 960, 600, z, t, { moon: false }); floor(g, C, 912, COL.n2, -900); firePaper(g, C, 960, 800, 1.7, t, up ? 1.25 : .8, 7); sw(HF, 960, 912, 1.22);
        lightPass(g, 'rgb(128,128,176)', () => firePool(C, 960, 800, 1.7, t, 1)); fireEmit(C, 960, 800, 1.7, t, up ? 1.25 : .8, 7, 44); sw(HF, 960, 912, 1.22, {}, emitCtx(), { shadow: 0, filter: 'brightness(.22)' });
        emitEnd(g, 1, .85); }
      if (v === 1) { nightLand(g, 960, 560, z, t, { moon: false }); put(g, orb(COL.cream2, 250, 16, 5), at(layer(960, 560, z, .3), 980, 400, 1, t * .04), { shadow: .6 }); floor(g, C, 930, COL.n2, -900);
        const rr = st < tSw ? 0 : Math.min(1, (st - tSw) / .1 + .4), sad = drawHorse(g, C, 900, 930, 1.05, 1, t * .5, rr ? 'rear' : 'walk', { rear: rr });
        const r = rider(g, C, HF, sad, 1, 1.05, up ? { expr: 'sing', aN: [150, 8], lean: -14, head: -8 } : { expr: 'firm', aN: [40, 60] }); const h = ap(r.handN, [0, 0]);
        drawScissors(g, [1, 0, 0, 1, 0, 0], h[0] + (up ? 10 : 70) * C[0], h[1] - (up ? 120 : -20) * C[0], up ? -1.4 : .3, up ? .85 : .1, C[0] * .86);
        lightPass(g, 'rgb(170,170,210)', () => { pool(980, 380, 700, 'rgba(200,210,255,1)', .5); }); emitEnd(g, 1, 0); }
      if (v === 2) { daySet(g, 960, z, t, 9999); put(g, sun(), at(layer(960, 600, z, .5), 985, 395, 1.75, t * .06), { shadow: 1 });
        [[SIS[0], 420, 1], [SIS[4], 560, 1], [SIS[2], 700, 1], [SIS[5], 1500, -1], [SIS[1], 1360, -1], [SIS[6], 1220, -1]].forEach(([F, x, dir], i) => { const tk = tSw + .1 + i * TL.per / 4;
          drawFig(g, C, F, keys(st, [[c[4], { ...POSE.stand, x, y: 896, s: .82, dir, expr: 'serene' }], [tk, { ...POSE.stand, x, y: 896, s: .82, dir, expr: 'sing', aN: [150, 10], head: -8 }]], .09)); });
        sw(HF, 960, 930, 1.12); }
      if (up) scraps(g, C, t, tSw, 960, 380, 14, v === 2 ? [COL.red, COL.gold, COL.pale] : [COL.red, COL.pale, COL.cream2], { size: 10, spread: 700, up: 380, life: 1.8, seed: 5 + v });
    }, { type: 'slide', d: .22, dir: [0, 1] });

    // ---------- C.5 少女的梦早已经死在昨天啦 ----------
    const tTear = TL.hit(cid + '.tear', B(182));
    add(cid + '.5', c[5], (g, t) => {
      const st = step(t), C = cam(960, 540, lerp(1, 1.06, seg(t, c[5], c[6]))), X = 1040, Y = 460, SC = 1.85;
      ground(g, 'ink', C); put(g, ridge(4200, 300, COL.n1, 3), at(C, -900, 1140), { shadow: .5 });
      const Hp = keys(st, [[c[5], { ...POSE.stand, x: 400, y: 1660, s: 2.2, aN: [20, 40], expr: 'cold' }], [tTear - .14, { ...POSE.stand, x: 400, y: 1660, s: 2.2, aN: [96, 20], expr: 'firm', lean: 6 }], [tTear, { ...POSE.stand, x: 400, y: 1660, s: 2.2, aN: [60, 96], expr: 'smirk', lean: -4 }]], .2);
      drawFig(g, C, HF, Hp, { shadow: 1.5 });
      put(g, calBlock(), at(C, X, Y, SC), { shadow: 2 });
      put(g, calLeaf('', false, v === 2 ? COL.gold : COL.cream), at(C, X, Y + 34 * SC, SC), { shadow: .5 });
      const leaves = v === 1 ? 11 : 1;
      for (let k = leaves - 1; k >= 0; k--) { const t0 = tTear + k * TL.per / 2, d = t - t0, p = calLeaf(k ? '' : '昨天', k === 0, k % 2 ? COL.cream2 : COL.cream);
        if (d < 0) { if (k === 0 || t > t0 - TL.per / 2) put(g, p, at(C, X, Y + 34 * SC, SC, k ? 0 : Math.sin(Math.floor(st / TL.per) * 2.1) * .012), { shadow: .6 }); continue; }
        if (d > 2.4) continue;
        put(g, p, mul(mul(mul(C, T(X - 104 * SC + d * (420 + k * 30), Y - 70 * SC - d * 380 + 900 * d * d + (k ? 0 : 0))), R(d * (2.6 + (k % 3) * .5))), mul(S(SC * (1 - d * .1), SC * (1 - d * .1) * Math.cos(d * 5 + k)), T(104, 104))), { shadow: 1.6 }); }
      scraps(g, C, t, tTear, X, Y, 8, [COL.cream, COL.cream2], { size: 9, spread: 300, up: 220, life: 1.5 });
      if (st < tTear) say('yday', '昨天', X - 70 * SC, Y - 64 * SC, X + 70 * SC, Y + 2 * SC);
      lightPass(g, 'rgb(150,150,196)', () => { const f = .9 + .1 * hash(Math.floor(t * 12)); pool(1040, 520, 760, 'rgba(255,200,140,1)', .8 * f); });
      emitGlow(960, 1250, 520, .5); sparks([1, 0, 0, 1, 0, 0], 960, 1120, t, 22, { rise: 900, spread: 1500, life: 3.6 }); emitEnd(g, 1, .6);
    }, { type: 'slide', d: .22, dir: [1, 0] });

    // ---------- C.6 那带血的束身衣扎成捧花 ----------
    const tF1 = TL.hit(cid + '.fold1', B(186)), tF2 = TL.hit(cid + '.fold2', B(188)), tBq = TL.hit(cid + '.bouquet', B(190)), tLift = B(191);
    add(cid + '.6', c[6], (g, t) => {      // top-down tabletop: folding as plot
      const st = step(t), sk = hitShake(t, [tF1 + .3, tF2 + .3, tBq], 5), C = cam(960 + sk[0], 540 + sk[1], lerp(1, 1.05, seg(t, c[6], c[7])));
      ground(g, 'indigo', C);
      const xs = v === 2 ? [440, 960, 1480] : [960], SC = v === 2 ? 1.6 : 2.5;
      xs.forEach((x, i) => { const dl = i * TL.per / 4, th = foldTh(t, tF1 + dl, .34), sq = eo(seg(t, tF2 + dl, tF2 + dl + .34));
        if (st < tBq + dl) foldPut(g, corset(), mul(mul(at(C, x - sq * 30 * SC, 500, SC, -.5 * sq), S(1 - .45 * sq, 1)), T(0, 0)), 0, 1, th, { back: '#b5524c', shadow: 1.6 });
        else { const lift = eo(seg(t, tLift + dl, tLift + dl + .3)); put(g, bouquet(), at(C, x, 500 - lift * 26, SC * 1.05 * pop(st, tBq + dl, 1.15) * (1 + lift * .08), -.5 * (1 - eo(seg(t, tBq + dl, tBq + dl + .25))) + lift * .14), { shadow: 1.6 + lift * 2 });
          if (v === 1) put(g, tieEnd(), at(C, x + 14, 500 + 96 * SC, SC * 1.5, .3 + lift * .1), { shadow: 1 }); } });
      drawScissors(g, C, 1600, 250, 2.2, .6, 1.5);
      for (const [tt, n] of [[tF1 + .3, 4], [tF2 + .3, 4], [tBq, 12]]) scraps(g, C, t, tt, 960, 520, n, [COL.deep, COL.deep2, COL.pale], { size: 9, spread: 620, up: 200, life: 1.5, seed: tt });
      lightPass(g, 'rgb(170,168,200)', () => { const f = .9 + .1 * hash(Math.floor(t * 12)); pool(960, 560, 900, 'rgba(255,200,140,1)', .75 * f); }); emitEnd(g, 1, 0);
    }, { type: 'slide', d: .22, dir: [-1, 0] });

    // ---------- C.7 扔进火里烧了个稀里哗啦 (v0, v1; the third one is the finale, sc_end.js) ----------
    if (v < 2) {
      const tRel = TL.hit(cid + '.throw', B(193)), tLand = TL.hit(cid + '.land', B(195)), tFl = TL.hit(cid + '.flare', B(196)), syl = [198, 200, 202, 203].map(B);
      const toss = v === 0 ? [[205, () => mask(), .42], [207, () => apron(), .5], [209, () => paperMan(0), .6], [211, () => paperMan(1), .6], [213, () => priceTag('¥'), 1.1]].map(([i, p, s]) => [TL.hit(cid + '.toss', B(i)), p, s]) : [];
      const FX = v ? 1420 : 1330, FS = v ? 1.75 : 1.3, FY = 900 - 110 * FS;
      add(cid + '.7', c[7], (g, t) => {
        const st = step(t), push = eio(seg(t, tLand - .2, syl[1])) * (1 - .42 * eio(seg(t, syl[3] + .4, cEnd))), sk = hitShake(t, [tFl, ...syl, ...toss.map(x => x[0] + .7)], 6);
        const z = lerp(1.2, v ? 1.36 : 1.7, push), cx = lerp(980, FX - 60, push), cy = lerp(620, v ? 500 : 600, push), C = cam(cx + sk[0], cy + sk[1], z);
        nightLand(g, cx, cy, z, t, { moonX: 500 }); floor(g, C, 900, COL.n2, -900);
        const pulse = t > tFl ? Math.exp(-((((t - TL.g0) / (2 * TL.per)) % 1 + 1) % 1) * 2 * TL.per * 7) : 0;      // the fire breathes on the quarter notes
        const lit = (st < tFl ? .75 : Math.min(1.75, .75 + (st - tFl) * 6) - .3 * seg(t, syl[3] + .5, cEnd)) * (1 + .13 * pulse);
        // the bouquet: in her hand, in the air, in the fire
        const bu = seg(t, tRel, tLand), inFire = t >= tLand;
        let r, hx = 640;
        if (v === 0) { const ks = [[c[7], { ...POSE.throwA, x: 640, y: 900, expr: 'firm' }], [tRel, { ...POSE.throwB, x: 660, y: 900, expr: 'sing' }], [tLand + .3, { ...POSE.throwB, x: 660, y: 900, expr: 'sing' }], [tLand + .8, { ...POSE.stand, x: 660, y: 900, expr: 'smirk', aN: [-14, 100], aF: [-22, 104], lean: -4 }]];
          for (const [tt] of toss) ks.push([tt - .2, { ...POSE.throwA, x: 650, y: 900, expr: 'firm' }], [tt, { ...POSE.throwB, x: 660, y: 900, expr: 'sing' }], [tt + .45, { ...POSE.throwB, x: 660, y: 900, expr: 'smirk' }]);
          r = drawFig(g, C, HF, keys(st, ks, .1)); }
        else { const sad = drawHorse(g, C, 620, 900, 1, 1, t * .4, 'walk'); r = rider(g, C, HF, sad, 1, 1, st < tRel ? { expr: 'firm', aN: [-60, 50], lean: -12 } : { expr: 'sing', aN: st < tLand + .4 ? [118, 4] : [50, 40], lean: st < tLand + .4 ? 12 : 4 }); }
        const hand = ap(r.handN, [0, 0]), bq = bouquet();
        const BM = inFire ? at(C, FX, FY - 200 * FS + Math.sin(t * 2.2) * 6, .8 * FS, .08 * Math.sin(t * 3)) : t < tRel ? mul([C[0], 0, 0, C[0], hand[0], hand[1]], mul(R(-.6), S(.5))) : at(C, lerp((hand[0] - C[4]) / C[0], FX, bu), lerp((hand[1] - C[5]) / C[3], FY - 200 * FS, bu) - Math.sin(bu * Math.PI) * 300, lerp(.5, .8 * FS, bu), -.6 + bu * 7);
        if (inFire) put(g, bq, BM, { shadow: 1 });
        firePaper(g, C, FX, FY, FS, t, lit, v ? 7 : 5);
        if (!inFire) put(g, bq, BM, { shadow: 1.6 });
        for (const [tt, pc, s] of toss) { const u2 = (t - tt) / .7; if (u2 < 0 || u2 >= 1) continue; put(g, pc(), at(C, lerp(700, FX, u2), lerp(560, FY - 90 * FS, u2) - Math.sin(u2 * Math.PI) * 260, s * (1 - .3 * u2), -1 + u2 * 8), { shadow: 1.5 }); }
        const I = inFire ? Math.min(1, .35 + (t - tLand) * 1.6) * (1 - .25 * seg(t, syl[3] + .5, cEnd)) * (.86 + .14 * pulse) : 0;
        lightPass(g, 'rgb(128,128,176)', () => { firePool(C, FX, FY, FS, t, lit);
          if (I > 0) { const hp = { c: holesOf(bq), x0: bq.x0, y0: bq.y0, w: bq.w, h: bq.h }, b0 = ap(C, [FX, 900]), k = C[0] * FS * 2.3;   // the pattern thrown on the ground, towards her
            lightImage(hp, [-1.5 * k, 0, 1.25 * k, -.42 * k, b0[0] - 140 * k, b0[1] + 60 * k * .1], I * .5, 'rgb(255,190,130)', 5); } });
        fireEmit(C, FX, FY, FS, t, lit, v ? 7 : 5, 34);
        if (I > 0) { const p = ap(C, [FX, FY - 200 * FS]); emitGlow(p[0], p[1], 170 * FS * C[0], I * .8, 1.08); emitPiece(bq, BM, '#b81c18'); }
        for (const s0 of [tFl, ...syl, ...toss.map(x => x[0] + .7)]) { const d = t - s0; if (d >= 0 && d < 1.6) for (let k = 0; k < 16; k++) { const a = -Math.PI * (.15 + .7 * hash(k * 3.1 + s0)), sp = 260 + 420 * hash(k * 1.7 + s0), p = ap(C, [FX + Math.cos(a) * sp * d, FY - 120 * FS + Math.sin(a) * sp * d + 260 * d * d]); emitShapeDot(p, d); } }
        emitEnd(g, 1, .85);
      }, { type: 'slide', d: .22, dir: [1, 0] });
    }
  }
  return out;
}
import { emitDot } from './sets.js';
function emitShapeDot(p, d) { emitDot(p[0], p[1], 5 * (1 - d / 1.6) + 1.5, 1 - d / 1.6, '255,190,110'); }
