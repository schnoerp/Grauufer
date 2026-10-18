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
  for (const id of ['#bInv', '#bChar', '#bJour', '#bStory']) {
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
    /* Alle Schatzkarten gelten als gefunden, sonst zieht der Haken mit 8 % eine Flaschenpost statt eines Fischs */
    if (!DECOK) buildDeco(); F().tmaps = Object.fromEntries(DIGS.map(d => [d.i, 1]));
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

test('Rev 94: Titanenbrecher-Name, Holzkisten, Eislanze, keine Wiederbelebung von Glutgeist und Mimik', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    const name = eqName(mkEq('titanblade', 3));
    let herb = false, kraut = false;
    for (let i = 0; i < 400; i++) lootFor({ t: 'wood' }).items.forEach(k => { if (k === 'herb') herb = true; if (k === 'kraut') kraut = true; });
    const g = { id: 'gg0_1', k: 'glutgeist', x: S.p.x + 15, y: S.p.y, rx: S.p.x + 15, ry: S.p.y, hx: S.p.x + 15, hy: S.p.y, hp: 0, maxHp: 22, dead: true, deadTurn: 0, face: -1 };
    const m = { ...g, id: 'mim0', k: 'mimic', maxHp: 38 };
    S.enemies.push(g, m); S.turn = 1000; worldTick();
    return [name, herb, kraut, SPELLS.eis.d, g.dead && m.dead];
  });
  expect(r[0]).toBe('Meisterlicher Titanenbrecher');
  expect(r[1]).toBe(false); expect(r[2]).toBe(true);
  expect(r[3]).toContain('3 Züge');
  expect(r[4]).toBe(true);
  expect(fehler).toEqual([]);
});

test('Rev 95: Symbol für Reiter und Lesezeichen ist eingebettet', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => new Promise(res => {
    const l = document.querySelector('link[rel="icon"]');
    if (!l) return res(null);
    const img = new Image(); img.onload = () => res([l.href.slice(0, 18), img.naturalWidth > 0]); img.onerror = () => res([l.href.slice(0, 18), false]); img.src = l.href;
  }));
  expect(r).toEqual(['data:image/svg+xml', true]);
  expect(fehler).toEqual([]);
});

test('Rev 96: Schatten für Ausstattung und Farbstimmung je Gebiet', async ({ page }) => {
  const fehler = await frisch(page);
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => {
    const sp = decoSprite('barrel', 0); DSHA = .5; decoShade(sp, 100, 100, 1);
    return [!!sp.sh, sp.sh.width === sp.c.width, Array.isArray(MOODC), MOOD.mist[1] > MOOD.mist[0], DECOFLAT.rug === 1];
  });
  expect(r).toEqual([true, true, true, true, true]);
  expect(fehler).toEqual([]);
});

test('Rev 97: Südküste schwingt, Startstrand unverändert, Migration setzt aufs Land', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    const wat = []; for (let x = 120; x < 560; x++) { let y = 222; while (y < 240 && map[y][x] !== '~') y++; wat.push(y); }
    const versch = new Set(wat).size;
    const strand = [map[228][89], map[227][88], map[227][90], map[231][87], map[227][91]];
    let wx = 0; for (let x = 120; x < 560; x++) if (map[229][x] !== '~' && map[228][x] === 's') { wx = x; break; }
    S.p.x = S.p.rx = 300; S.p.y = S.p.ry = 236; migrate();
    return [versch, strand.join(''), WALK.has(map[S.p.y][S.p.x])];
  });
  expect(r[0]).toBeGreaterThanOrEqual(4);
  expect(r[1]).toBe('sss~~');
  expect(r[2]).toBe(true);
  expect(fehler).toEqual([]);
});

test('Rev 98: Feine Bodenzeichnung glättet Stufen an Übergängen', async ({ page }) => {
  const fehler = await frisch(page);
  await page.waitForFunction(() => GB && GB.done, null, { timeout: 30000 });
  const r = await page.evaluate(() => {
    const m = cornerMask(0, 0, 1), g = m.getContext('2d'), a = g.getImageData(0, 0, m.width, m.height).data;
    let voll = 0; for (let i = 3; i < a.length; i += 4) if (a[i] > 200) voll++;
    return [CORNC.size > 0, voll > 0, voll < m.width * m.height / 2, FINEK.has('cobble')];
  });
  expect(r).toEqual([true, true, true, false]);
  expect(fehler).toEqual([]);
});

test('Rev 99: Bäume unterschiedlich hoch und verschiedene Arten', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    const hoehen = new Set(), arten = new Set();
    for (let v = 0; v < TREEV; v++) { hoehen.add(treeSprite(v, 'wild').c.height); arten.add(treeKind(v, 'wild').t); }
    return [hoehen.size, [...arten].sort().join(','), treeKind(0, 'frost').t, treeKind(0, 'wueste').t];
  });
  expect(r[0]).toBeGreaterThanOrEqual(5);
  expect(r[1]).toBe('birch,fir,leaf,oak,young');
  expect(r[2]).toBe('fir'); expect(r[3]).toBe('palm');
  expect(fehler).toEqual([]);
});

test('Rev 100: Kein Knopf „Grafik“, Bildqualität automatisch, Notstufen beim Start zurückgesetzt', async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('grauufer-gpucap', '0.65'); localStorage.setItem('grauufer-soft', '1'); } catch (e) {} });
  const fehler = await frisch(page);
  const r = await page.evaluate(() => [!!document.querySelector('#bGfx'), GFX, GPUCAP, SOFT, localStorage.getItem('grauufer-gpucap')]);
  expect(r).toEqual([false, 'auto', 1, false, null]);
  expect(fehler).toEqual([]);
});

test('Rev 101: Story-Baum zeigt erreichten Stand, Künftiges verborgen', async ({ page }) => {
  const fehler = await frisch(page);
  await page.keyboard.press('g');
  const r1 = await page.evaluate(() => [!document.querySelector('#panel').hidden, document.querySelectorAll('#story .sn.done').length, document.querySelectorAll('#story .sn.hid').length > 20]);
  expect(r1).toEqual([true, 1, true]);
  const r2 = await page.evaluate(() => {
    closePanel(); const f = S.flags; f.amulet = 1; f.quest = 1; f.key = 1; f.doorOpen = 1; f.shard_erde = 1; f.fac_erde = -1; openStory();
    const st = id => [...document.querySelectorAll(`#story [data-sn="${id}"]`)].map(g => g.getAttribute('class')).join('|');
    return [stState(STN.find(n => n.id === 'erde')), stState(STN.find(n => n.id === 'wasser')), stState(STN.find(n => n.id === 'reveal')),
            document.querySelectorAll('#story .sn.rej').length, st('dE')];
  });
  expect(r2).toEqual(['done', 'av', 'hid', 1, 'sn rej|sn done|sn done']);
  expect(fehler).toEqual([]);
});

test('Rev 102: Leben und Mana als Kugeln, Fußzeile frei', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    S.p.hp = Math.round(S.p.maxHp / 2); updateHUD();
    const hp = document.querySelector('#orbHp'), mp = document.querySelector('#orbMp'), H = hp.getBoundingClientRect(), M = mp.getBoundingClientRect();
    const knoepfe = [...document.querySelectorAll('#bottom button')].filter(b => b.offsetParent).map(b => b.getBoundingClientRect());
    const ueberlappt = knoepfe.some(k => k.left < H.right || k.right > M.left);
    const px = hp.querySelector('canvas').getContext('2d').getImageData(18, 30, 1, 1).data;
    return [Math.round(H.width), document.querySelector('#hpt').textContent === S.p.hp + '/' + S.p.maxHp, ueberlappt, px[0] > px[2], !!document.querySelector('#bottom .bar')];
  });
  expect(r).toEqual([90, true, false, true, false]);
  expect(fehler).toEqual([]);
});

test('Rev 103: Spieltitel „Grauufer 1.0“', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => { intro(); return [document.title.startsWith('Grauufer 1.0 (Rev '), document.querySelector('#splash .sp-t').textContent.trim(), document.querySelector('#overlay h1').textContent]; });
  expect(r).toEqual([true, 'Grauufer 1.0', 'Grauufer 1.0']);
  expect(fehler).toEqual([]);
});

test('Rev 104: Logo im Titelbild als Pixelgrafik', async ({ page }) => {
  const fehler = [];
  page.on('pageerror', e => fehler.push(String(e)));
  await page.goto(URL);
  await page.waitForFunction(() => document.querySelector('#spLogo').dataset.ok === '1', null, { timeout: 30000 });
  const r = await page.evaluate(() => {
    const c = document.querySelector('#spLogo'), d = c.getContext('2d').getImageData(0, 0, 48, 48).data;
    let deckend = 0, stufen = true; for (let i = 0; i < d.length; i += 4) { if (d[i + 3] === 255) { deckend++; if (d[i] % 17 || d[i + 1] % 17 || d[i + 2] % 17) stufen = false; } }
    return [c.width, deckend > 600, stufen, Math.round(c.getBoundingClientRect().width) % 48];
  });
  expect(r).toEqual([48, true, true, 0]);
  expect(fehler).toEqual([]);
});

test('Rev 105: Die Tiefe – vier Treppen hinab und wieder hinauf', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    const out = [];
    for (const i of [2, 4, 6, 8]) {
      const P = PORTALS[i], D = PORTALS[P.to];
      S.p.x = S.p.rx = P.x; S.p.y = S.p.ry = P.y; G.ptT = 0; portalTick(performance.now());
      const unten = ZD().name, imBereich = S.p.y >= MORVH && cheb(S.p.x, S.p.y, D.x, D.y) <= 1;
      S.p.x = S.p.rx = D.x; S.p.y = S.p.ry = D.y; G.ptT = 0; portalTick(performance.now());
      out.push(unten === 'Die Tiefe' && imBereich && S.p.y < MORVH && cheb(S.p.x, S.p.y, P.x, P.y) <= 1);
    }
    return [out, map[MORVH + 5][10], H];
  });
  expect(r).toEqual([[true, true, true, true], 'v', 316]);
  expect(fehler).toEqual([]);
});

test('Rev 106: Die Tiefe – Gegner, Tafeln und Truhen', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    if (!DECOK) buildDeco();
    const g = S.enemies.filter(e => e.y >= MORVH);
    const arten = [...new Set(g.map(e => e.k))].sort().join(',');
    const tafeln = LECT.filter(l => l.y >= MORVH).map(l => BOOKS[l.i].t).sort().join('|');
    const truhen = CHESTS.filter(c => c.y >= MORVH).map(c => c.t).join(',');
    readBook(LECT.find(l => l.y >= MORVH).i); closeOverlay();
    return [g.length, arten, tafeln, truhen, CHESTS.length - 3 === 47];
  });
  expect(r).toEqual([22, 'echo,ruhelos,skeleton,steinwaechter,thronhueter', 'Tafel der Erde|Tafel der Luft|Tafel des Feuers|Tafel des Wassers', 'locked,locked,trap', true]);
  expect(fehler).toEqual([]);
});

test('Rev 107: Thronhüter, Ring der Tiefe und Hinweise der Figuren', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    const b = S.enemies.find(e => e.k === 'thronhueter'); KINDS.thronhueter.xp = 0; const hp0 = S.p.maxHp; /* ohne Stufenaufstieg, damit nur der Ring zählt */
    damage(b, b.hp + 5, '#fff');
    openDialog('mareth'); const hinweis = DLG.mareth.start.o.some(o => o.go === 'tiefe') && ['oswin', 'tobe', 'hagen'].every(id => DLG[id].tiefe);
    return [b.x, b.y, b.dead, S.inv.includes('tiefring'), S.p.maxHp - hp0, hinweis];
  });
  await page.waitForTimeout(900);
  expect(r).toEqual([71, 289, true, true, 10, true]);
  expect(fehler).toEqual([]);
});

test('Rev 108: Notgrund füllt Lücken, solange der Bodenpuffer nicht alles bedeckt', async ({ page }) => {
  const fehler = await frisch(page);
  await page.waitForFunction(() => GB && GB.done, null, { timeout: 30000 });
  await page.evaluate(() => { window.stepBuf = function () {}; ZOOM = .6; resize(); });
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const d = GRUND && GRUND.getContext('2d').getImageData(SHORE.ship[0], SHORE.ship[1], 1, 1).data;
    return [!!GRUND, GRUND && GRUND.width === W && GRUND.height === H, d && [d[0], d[1], d[2]].join(',')];
  });
  expect(r).toEqual([true, true, '34,52,76']);
  expect(fehler).toEqual([]);
});

test('Werkstatt: Hausbau erzeugt Häuser aus der Beschreibung (alle Wand-, Dach- und Dachformen)', async ({ page }) => {
  const fehler = []; page.on('pageerror', e => fehler.push(String(e)));
  await page.goto('file://' + path.resolve(__dirname, '..', 'werkstatt', 'baukasten.html'));
  await page.waitForFunction(() => window.Hausbau && window.THREE, null, { timeout: 30000 });
  const r = await page.evaluate(() => {
    const zaehle = g => { let n = 0; g.traverse(o => { if (o.isMesh) n++; }); return n; };
    const ergebnis = [];
    for (const wand of ['fachwerk', 'stein', 'holz']) for (const dach of ['schiefer', 'schindeln', 'reet']) for (const first of ['x', 'z']) for (const dachform of ['sattel', 'walm', 'pult']) {
      const spec = Object.assign(JSON.parse(JSON.stringify(Hausbau.BEISPIEL)), { wand, dach, first, dachform });
      ergebnis.push(zaehle(Hausbau.Bau(spec, false)) > 100 && zaehle(Hausbau.Bau(spec, true, 2)) > 200);
    }
    return [ergebnis.every(Boolean), ergebnis.length, Object.keys(Hausbau.KATALOG).length];
  });
  expect(r).toEqual([true, 54, 22]);
  expect(fehler).toEqual([]);
});

test('Werkstatt: Baukasten erlaubt je Feld nur ein Möbelstück und entfernt zuverlässig', async ({ page }) => {
  const fehler = []; page.on('pageerror', e => fehler.push(String(e)));
  await page.goto('file://' + path.resolve(__dirname, '..', 'werkstatt', 'baukasten.html'));
  await page.waitForFunction(() => window.Hausbau && typeof spec === 'object', null, { timeout: 30000 });
  await page.click('#neu');
  const feld = async (x, z) => { await page.locator('#plan').scrollIntoViewIfNeeded(); const b = await page.locator('#plan').boundingBox(), c = b.width / await page.evaluate(() => spec.breite + 2);
    await page.mouse.click(b.x + (x + 1.5) * c, b.y + (z + 1.5) * c); };
  const inhalt = () => page.evaluate(() => spec.einrichtung.filter(e => e.x === 1 && e.z === 1).map(e => e.art + e.dreh).sort().join(','));
  await page.getByRole('button', { name: 'Truhe' }).click();
  for (let i = 0; i < 3; i++) await feld(1, 1);
  const a = await inhalt();
  await page.getByRole('button', { name: 'Schrank' }).click(); await feld(1, 1);
  await page.getByRole('button', { name: 'Teppich' }).click(); await feld(1, 1);
  const b = await inhalt();
  await page.getByRole('button', { name: 'Säcke' }).click(); await feld(1, 1);
  const c = await inhalt();
  await page.getByRole('button', { name: '✕ Entfernen' }).click(); await feld(1, 1);
  const d = await inhalt();
  const alt = await page.evaluate(() => Hausbau.bereinige([{ art: 'truhe', x: 0, z: 0 }, { art: 'truhe', x: 0, z: 0 }, { art: 'bett', x: 0, z: 0 }, { art: 'teppich', x: 0, z: 0 }]).map(e => e.art).join(','));
  expect([a, b, c, d, alt]).toEqual(['truhe2', 'schrank0,teppich0', 'saecke0,teppich0', '', 'truhe,teppich']);
  expect(fehler).toEqual([]);
});

test('Werkstatt: Baukasten erzeugt den Versand an Claudia als GitHub-Issue', async ({ page }) => {
  const fehler = []; page.on('pageerror', e => fehler.push(String(e)));
  await page.goto('file://' + path.resolve(__dirname, '..', 'werkstatt', 'baukasten.html'));
  await page.waitForFunction(() => window.Hausbau && typeof window.hausLink === 'function', null, { timeout: 30000 });
  await page.click('#beispiel');
  const r = await page.evaluate(() => { const u = new URL(hausLink()), b = u.searchParams.get('body');
    const j = JSON.parse(b.slice(b.indexOf('```json') + 7, b.lastIndexOf('```')));
    return [u.origin + u.pathname, u.searchParams.get('title'), j.name, j.breite, hausLink().length < 7500, !document.getElementById('senden').hidden]; });
  expect(r).toEqual(['https://github.com/schnoerp/Grauufer/issues/new', 'Haus: Fischerhaus', 'Fischerhaus', 5, true, true]);
  expect(fehler).toEqual([]);
});

test('Werkstatt: Baukasten setzt Fenster und Tür mit eigenen Werkzeugen', async ({ page }) => {
  const fehler = []; page.on('pageerror', e => fehler.push(String(e)));
  await page.goto('file://' + path.resolve(__dirname, '..', 'werkstatt', 'baukasten.html'));
  await page.waitForFunction(() => window.Hausbau && typeof spec === 'object', null, { timeout: 30000 });
  await page.click('#neu');
  const wand = async () => { await page.locator('#plan').scrollIntoViewIfNeeded(); const b = await page.locator('#plan').boundingBox(), c = b.width / await page.evaluate(() => spec.breite + 2);
    await page.mouse.click(b.x + 1.5 * c, b.y + 1 * c); };
  const hinten = () => page.evaluate(() => spec.oeffnungen.filter(o => o.seite === 'hinten' && o.feld === 0).map(o => o.art).join(','));
  await page.getByRole('button', { name: 'Tür', exact: true }).click(); await wand(); const a = await hinten();
  await page.getByRole('button', { name: 'Fenster', exact: true }).click(); await wand(); const b = await hinten();
  await wand(); const c = await hinten();
  await page.getByRole('button', { name: 'Fenster vernagelt' }).click(); await wand(); const d = await hinten();
  expect([a, b, c, d]).toEqual(['tuer', 'fenster', '', 'fenster_vernagelt']);
  expect(fehler).toEqual([]);
});

test('Werkstatt: zweigeschossiges Haus mit Treppe, Obergeschoss getrennt einrichtbar', async ({ page }) => {
  const fehler = []; page.on('pageerror', e => fehler.push(String(e)));
  await page.goto('file://' + path.resolve(__dirname, '..', 'werkstatt', 'baukasten.html'));
  await page.waitForFunction(() => window.Hausbau && typeof spec === 'object', null, { timeout: 30000 });
  await page.click('#neu');
  await page.selectOption('#geschosse', '2');
  const feld = async (x, z) => { await page.locator('#plan').scrollIntoViewIfNeeded(); const b = await page.locator('#plan').boundingBox(), c = b.width / await page.evaluate(() => spec.breite + 2);
    await page.mouse.click(b.x + (x + 1.5) * c, b.y + (z + 1.5) * c); };
  await page.getByRole('button', { name: 'Treppe (nach oben)' }).click(); await feld(1, 1);
  await page.locator('#ebenen').getByRole('button', { name: '1. Obergeschoss' }).click();
  const treppeOben = await page.getByRole('button', { name: 'Treppe (nach oben)' }).count();
  await page.getByRole('button', { name: 'Bett' }).click(); await feld(1, 1); await feld(2, 1);
  const r = await page.evaluate(() => {
    const zaehle = g => { let n = 0; g.traverse(o => { if (o.isMesh) n++; }); return n; };
    const eg = Hausbau.Bau(spec, true, 0, 0), og = Hausbau.Bau(spec, true, 0, 1), aussen = Hausbau.Bau(spec, false);
    return [spec.geschosse, spec.einrichtung.map(e => e.art + (e.geschoss | 0) + ':' + e.x + e.z).sort().join(','), og.userData.ebene, zaehle(og) > zaehle(eg), zaehle(aussen) > 100];
  });
  expect(treppeOben).toBe(0);
  expect(r).toEqual([2, 'bett1:21,treppe0:11', 1, true, true]);
  expect(fehler).toEqual([]);
});

test('Werkstatt: drei Geschosse und begehbarer Dachboden, je Ebene eine Treppe nach oben', async ({ page }) => {
  const fehler = []; page.on('pageerror', e => fehler.push(String(e)));
  await page.goto('file://' + path.resolve(__dirname, '..', 'werkstatt', 'baukasten.html'));
  await page.waitForFunction(() => window.Hausbau && typeof spec === 'object', null, { timeout: 30000 });
  await page.click('#neu');
  await page.selectOption('#geschosse', '3'); await page.check('#dachboden');
  const ebenen = await page.locator('#ebenen button').allTextContents();
  const feld = async (x, z) => { await page.locator('#plan').scrollIntoViewIfNeeded(); const b = await page.locator('#plan').boundingBox(), c = b.width / await page.evaluate(() => spec.breite + 2);
    await page.mouse.click(b.x + (x + 1.5) * c, b.y + (z + 1.5) * c); };
  const treppe = page.getByRole('button', { name: 'Treppe (nach oben)' });
  for (let i = 0; i < 3; i++) { await page.locator('#ebenen button').nth(i).click(); await treppe.click(); await feld(i, 1); }
  await page.locator('#ebenen button').nth(3).click();
  const dach = [await treppe.count(), await page.getByRole('button', { name: 'Fenster', exact: true }).count()];
  await page.getByRole('button', { name: 'Kiste' }).click(); await feld(3, 1);
  const r = await page.evaluate(() => {
    const zaehle = g => { let n = 0; g.traverse(o => { if (o.isMesh) n++; }); return n; };
    const db = Hausbau.Bau(spec, true, 0, 3), og2 = Hausbau.Bau(spec, true, 1, 2), aussen = Hausbau.Bau(spec, false);
    return [spec.einrichtung.map(e => e.art + (e.geschoss | 0)).sort().join(','), db.userData.ebene, og2.userData.ebene, zaehle(db) > 50, aussen.userData.hoehe > 9];
  });
  expect(ebenen).toEqual(['Erdgeschoss', '1. Obergeschoss', '2. Obergeschoss', 'Dachboden']);
  expect(dach).toEqual([0, 0]);
  expect(r).toEqual(['kiste3,treppe0,treppe1,treppe2', 3, 2, true, true]);
  expect(fehler).toEqual([]);
});

test('Werkstatt: Haustypen als Vorlagen mit Tor, Portal, Luke, Pultdach und Gauben', async ({ page }) => {
  const fehler = []; page.on('pageerror', e => fehler.push(String(e)));
  await page.goto('file://' + path.resolve(__dirname, '..', 'werkstatt', 'baukasten.html'));
  await page.waitForFunction(() => window.Hausbau && typeof spec === 'object', null, { timeout: 30000 });
  const typen = await page.locator('#typ option').allTextContents();
  await page.selectOption('#typ', 'bauernhaus'); await page.click('#vorlage');
  const geladen = await page.evaluate(() => [spec.typ, spec.breite, spec.oeffnungen.some(o => o.art === 'tor'), spec.einrichtung.filter(e => e.art === 'krippe').length, document.getElementById('typhinweis').textContent.startsWith('Typisch')]);
  const gebaut = await page.evaluate(() => Object.entries(Hausbau.VORLAGEN).map(([k, v]) => { const sp = Object.assign({ name: v.name }, v.spec()); let n = 0;
    Hausbau.Bau(sp, false).traverse(o => { if (o.isMesh) n++; }); let m = 0; Hausbau.Bau(sp, true, 0, 0).traverse(o => { if (o.isMesh) m++; }); return k + ':' + (n > 100 && m > 100); }).join(','));
  expect(typen).toEqual(['frei', 'Schuppen', 'Cottage', 'Bauernhaus', 'Wohnhaus', 'Landhaus', 'Residenz']);
  expect(geladen).toEqual(['bauernhaus', 7, true, 3, true]);
  expect(gebaut).toBe('schuppen:true,cottage:true,bauernhaus:true,wohnhaus:true,landhaus:true,residenz:true');
  expect(fehler).toEqual([]);
});

test('Grauufer: fünf Häuser aus der Grafik-Werkstatt, außen und innen', async ({ page }) => {
  const fehler = await frisch(page);
  await page.waitForFunction(() => Object.keys(HAUSBILD).length === 5, null, { timeout: 10000 });
  const r = await page.evaluate(async () => {
    const warte = () => new Promise(f => requestAnimationFrame(() => requestAnimationFrame(f)));
    const m = BILDHAUS.find(b => b.bild === 'mareth'), mareth = NPCS.find(n => n.id === 'mareth');
    S.p.x = S.p.rx = m.x0 + 1; S.p.y = S.p.ry = m.y0 + 1; await warte(); const drin = m._m;
    S.p.x = S.p.rx = m.x0 - 6; S.p.y = S.p.ry = m.y0 - 6; await warte(); const draussen = m._m;
    return { namen: BILDHAUS.map(b => b.bild).sort(), drin, draussen, mitte: mareth.x === m.x0 + 1 && mareth.y === m.y0 + 1,
      bilder: Object.values(HAUSBILD).every(h => ['a', 'h', 'v'].every(s => h[s].c.width > 100)) };
  });
  expect(r.namen).toEqual(['bram', 'ilsabe', 'mareth', 'oswin', 'verlassen']);
  expect(r.drin).toBe('i'); expect(r.draussen).toBe('a'); expect(r.mitte).toBe(true); expect(r.bilder).toBe(true);
  expect(fehler).toEqual([]);
});

test('Figuren auf 75 % verkleinert, Pixel-Look bleibt', async ({ page }) => {
  const fehler = await frisch(page);
  const r = await page.evaluate(() => {
    const e = charSprite('player', 0), g = charSprite('mareth', 0);
    return { f: FIGF, klein: !!(e.fk && g.fk), hoch: e.ay / RES };
  });
  expect(r.f).toBe(0.75); expect(r.klein).toBe(true);
  expect(r.hoch).toBeLessThan(32);
  expect(fehler).toEqual([]);
});
