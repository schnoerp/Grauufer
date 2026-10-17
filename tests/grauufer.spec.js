// Automatische Browser-Tests für Grauufer. Jeder Test startet ein frisches Spiel.
const { test, expect } = require('@playwright/test');
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');

async function frisch(page) {
  const fehler = [];
  page.on('pageerror', e => fehler.push(String(e)));
  await page.goto(URL);
  await page.waitForFunction(() => typeof READY !== 'undefined' && READY, null, { timeout: 30000 });
  await page.evaluate(() => { const s = document.querySelector('#splash'); if (s) s.hidden = true; startNew(null); });
  await page.waitForTimeout(2200);
  await page.evaluate(() => closeOverlay());
  return fehler;
}

test('Spiel startet am Strand ohne Fehler', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => [S.p.x, S.p.y, S.p.hp > 0, typeof buildDeco]);
  expect(r[0]).toBe(89); expect(r[1]).toBe(228); expect(r[2]).toBe(true);
  expect(fehler).toEqual([]);
});

test('Fenster öffnen sich zentriert und ohne Scrollen', async ({ page }) => {
  const fehler = await frisch(page);
  for (const id of ['#bInv', '#bChar', '#bJour']) {
    const r = await page.evaluate(sel => {
      if (!document.querySelector('#panel').hidden) closePanel();
      document.querySelector(sel).click();
      const p = document.querySelector('#panel'), R = p.getBoundingClientRect();
      return { offen: !p.hidden, scrollt: p.scrollHeight > p.clientHeight + 2 || p.scrollWidth > p.clientWidth + 2,
               links: Math.round(R.left), rechts: Math.round(innerWidth - R.right) };
    }, id);
    expect(r.offen, id).toBe(true);
    expect(r.scrollt, id + ' scrollt').toBe(false);
    expect(Math.abs(r.links - r.rechts), id + ' nicht zentriert').toBeLessThanOrEqual(2);
  }
  expect(fehler).toEqual([]);
});

test('Fußzeile ist einzeilig', async ({ page }) => {
  const fehler = await frisch(page);
  const zeilen = await page.evaluate(() => new Set([...document.querySelectorAll('#bottom button, #bottom .bar')]
    .filter(e => e.offsetParent).map(e => Math.round(e.getBoundingClientRect().top))).size);
  expect(zeilen).toBe(1);
  expect(fehler).toEqual([]);
});

test('Gespräch mit Mareth', async ({ page }) => {
  const fehler = await frisch(page);
  const n = await page.evaluate(() => { openDialog('mareth'); return document.querySelectorAll('#choices button').length; });
  expect(n).toBeGreaterThan(0);
  expect(fehler).toEqual([]);
});

test('Speichern und Neuladen', async ({ page }) => {
  const fehler = await frisch(page);
  await page.evaluate(() => { S.p.x = S.p.rx = 92; S.gold = 77; save(true); });
  const d = await page.evaluate(() => { const s = loadSave(); return s && [s.p.x, s.gold]; });
  expect(d).toEqual([92, 77]);
  expect(fehler).toEqual([]);
});

test('Truhe öffnen und Beute nehmen', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    buildDeco(); const i = CHESTS.findIndex(c => c.t === 'wood'); const g0 = S.gold; openChest(i);
    const titel = document.querySelector('#overlay h1').textContent;
    [...document.querySelectorAll('#overlay button')].find(b => /Alles/.test(b.textContent)).click();
    return [titel, S.gold >= g0, chestsOpened()];
  });
  expect(r[0]).toBe('Holzkiste'); expect(r[1]).toBe(true); expect(r[2]).toBe(1);
  expect(fehler).toEqual([]);
});

test('Charakter: Stufenaufstieg, Attribut, Talent', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    S.p.xp = S.p.lvl * 30; checkLevel(); const ap = S.p.ap, tp = S.p.tp;
    openChar(); document.querySelector('[data-aa=str]').click();
    learnTal('w', 0); return [ap, tp, hasT('kraft'), S.p.tp];
  });
  expect(r).toEqual([2, 1, true, 0]);
  expect(fehler).toEqual([]);
});

test('Angeln: Biss und Fang', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    give('rod'); startFish(S.p.x, S.p.y + 2); G.fish.ph = 'bite'; G.fish.bt = performance.now(); const n0 = S.inv.length; reelIn();
    return S.inv.length > n0;
  });
  expect(r).toBe(true);
  expect(fehler).toEqual([]);
});

test('Lava ist tödlich', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    let t = null; for (let y = 190; y < 225 && !t; y++) for (let x = 160; x < 192; x++) if (map[y][x] === 'L' && terrainWalk(x - 1, y)) { t = [x, y]; break; }
    S.p.x = S.p.rx = t[0] - 1; S.p.y = S.p.ry = t[1]; initRender(); tryStep(1, 0); return [S.p.hp, S.over];
  });
  expect(r).toEqual([0, true]);
  expect(fehler).toEqual([]);
});

test('Story: Ende „Das neue Siegel“ am Steinkreis', async ({ page }) => {
  const fehler = await frisch(page);
  await page.evaluate(() => { ['erde', 'wasser', 'feuer', 'luft'].forEach(e => { F()['shard_' + e] = 1; give('shard_' + e); }); F().reveal = 1; interactRift(); });
  await page.waitForTimeout(1800);
  expect(await page.evaluate(() => document.querySelector('#overlay h1').textContent)).toBe('Das neue Siegel');
  expect(fehler).toEqual([]);
});

test('Story: Nhal, Phase 2 und Ende „Der Erlöser“', async ({ page }) => {
  const fehler = await frisch(page);
  const geister = await page.evaluate(() => {
    ['erde', 'wasser', 'feuer', 'luft'].forEach(e => { F()['shard_' + e] = 1; give('shard_' + e); }); F().reveal = 1;
    giveEq(mkEq('titanblade', 3)); S.p.x = S.p.rx = VOLC.x - 4; S.p.y = S.p.ry = VOLC.y; initRender(); spawnNhal();
    const n = S.enemies.find(e => e.k === 'nhal'); damage(n, Math.ceil(n.maxHp / 2) + 1, '#fff');
    const g = S.enemies.filter(e => e.k === 'glutgeist').length; damage(n, n.hp + 5, '#fff'); return g;
  });
  expect(geister).toBe(2);
  await page.waitForTimeout(2500);
  expect(await page.evaluate(() => document.querySelector('#overlay h1').textContent)).toBe('Der Erlöser');
  expect(fehler).toEqual([]);
});
