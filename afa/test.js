// 设定表：?test=model | bike | ...
import { W, H, vgrad, LWK } from './cel.js';
import { PAL } from './pal.js';
import { head, helmet, ahuaBack, figure, SUITC, CASUALC, silBust, handFlat, sleeve } from './people.js';
import { text, setCam, celLayer } from './stage.js';

export function test(S, name) {
  const { g, e } = S;
  setCam(S);
  vgrad(g, 0, 0, W, H, [[0, '#cfd6e6'], [1, '#aab3c8']]);
  if (name === 'model') {
    const row = (y, list, s = .95) => list.forEach((o, i) => { const x = 150 + i * (W - 200) / list.length; celLayer(S, c => { c.translate(x, y); c.scale(s, s); if (o.flip) c.scale(-1, 1); const P = PAL[o.pal || 'day']; head(c, P, o); if (o.helm) helmet(c, P, o.helm); }, { occlude: false }); text(g, o.label || o.expr || '', x, y + 250 * s, { size: 26, col: '#223', fam: '"Barlow SC","Noto SC"' }); });
    row(150, [{ expr: 'neutral', body: 'suit' }, { expr: 'bored', body: 'suit' }, { expr: 'cold', body: 'suit' }, { expr: 'resolve', body: 'suit', tie: 1 }, { expr: 'smirk', body: 'jacket' }, { expr: 'sing', body: 'jacket' }, { expr: 'laugh', body: 'tee' }, { view: 'side', expr: 'neutral', body: 'suit', label: 'side' }], .62);
    row(480, [{ who: 'old', expr: 'neutral', body: 'old' }, { who: 'old', expr: 'smirk', body: 'old' }, { who: 'old', expr: 'laugh', body: 'old' }, { who: 'old', view: 'side', expr: 'smile', body: 'old', label: 'old side' }, { who: 'mei', expr: 'pitch', body: 'mei', label: 'matchmaker' }, { who: 'mei', expr: 'pitchtalk', body: 'mei' }, { expr: 'cold', body: 'suit', pal: 'amber', label: 'amber' }, { expr: 'cold', body: 'suit', pal: 'cafe', label: 'cafe' }], .62);
    row(810, [{ expr: 'cold', body: 'jacket', pal: 'night', helm: { view: 'q', visor: 0 }, label: 'night visor' }, { expr: 'sing', body: 'jacket', pal: 'dawn', helm: { view: 'q', visor: 1 }, label: 'dawn' }, { who: 'old', expr: 'laugh', body: 'old', pal: 'noon', helm: { view: 'q', goggles: 1 }, label: 'noon 70+' }, { view: 'side', expr: 'cold', body: 'jacket', pal: 'night', helm: { view: 'side', visor: 0 }, label: 'side' }, { view: 'side', who: 'old', expr: 'smile', body: 'old', pal: 'noon', helm: { view: 'side', goggles: 1 }, label: 'side old' }, { expr: 'smirk', body: 'tee', pal: 'tv', label: 'tv' }], .62);
    celLayer(S, c => { c.translate(1500, 900); c.scale(.5, .5); ahuaBack(c, PAL.cafe); }, { occlude: false });
    celLayer(S, c => { c.translate(1760, 820); c.scale(.8, .8); figure(c, SUITC(PAL.day), { th: [.2, -.2], kn: [.1, .3], ua: [-.3, .3], fa: [.4, .4] }); }, { occlude: false });
  }
  if (name === 'close') {
    LWK.k = .6;
    celLayer(S, c => { c.translate(620, 420); c.scale(3.2, 3.2); head(c, PAL.cafe, { expr: 'bored', body: 'suit' }); }, { occlude: false });
    celLayer(S, c => { c.translate(1500, 420); c.scale(3.2, 3.2); head(c, PAL.noon, { who: 'old', expr: 'laugh', body: 'old' }); }, { occlude: false });
    LWK.k = 1;
  }
  if (name === 'bike') test2(S, name);
  if (name === 'hand') {
    celLayer(S, c => { c.translate(700, 500); sleeve(c, PAL.day.suit, PAL.day.shirt); handFlat(c, PAL.day.skin, {}); }, { occlude: false });
    for (let k = 0; k < 4; k++) celLayer(S, c => { c.translate(300 + k * 400, 900); c.scale(.6, .6); silBust(c, '#221830', '#ffb060', k); }, { occlude: false });
  }
}
import { rider, riderBack } from './bike.js';
export function test2(S, name) {
  const { g } = S;
  if (name === 'bike') {
    celLayer(S, c => { c.translate(480, 620); c.scale(.72, .72); rider(c, PAL.day, { wheelA: .3, speed: 0, visor: 0 }); }, { occlude: false });
    celLayer(S, c => { c.translate(1400, 620); c.scale(.72, .72); rider(c, PAL.noon, { wheelA: .3, speed: 1, old: true, pack: true, ph: .3 }); }, { occlude: false });
    celLayer(S, c => { c.translate(380, 1060); c.scale(.55, .55); rider(c, PAL.night, { wheelA: .3, speed: 1, visor: 0, rim: { c: '#ff6ad0', d: [3, 4.5] } }); }, { occlude: false });
    celLayer(S, c => { c.translate(960, 1060); c.scale(.55, .55); rider(c, PAL.dawn, { wheelA: .3, speed: 1, visor: 1, expr: 'sing', pack: true }); }, { occlude: false });
    celLayer(S, c => { c.translate(1500, 1060); c.scale(.55, .55); riderBack(c, PAL.day, { pack: true }); }, { occlude: false });
    celLayer(S, c => { c.translate(1780, 1060); c.scale(.55, .55); riderBack(c, PAL.noon, { old: true, ph: .2 }); }, { occlude: false });
  }
}
