# Grauufer – Wirtschaft

**Revision 12**, Stand: Spiel-Rev 108. **Im Spiel** = in der aktuellen Spielversion umgesetzt (aus dem Code übernommen). **Geplant** = noch nicht im Spiel.

Diese Datei ist die **einzige Quelle für Preise**. Nennen andere Dokumente einen Preis und weicht er ab, gilt diese Datei. Gold von Gegnern steht in Grauufer_Gegner_RevXX.md, Questbelohnungen in Grauufer_Quests_RevXX.md.

## 1. Grundregeln (Im Spiel)

- Einzige Währung ist **Gold**.
- Startgold: **0**, für alle Klassen.
- Gold kann nicht verloren gehen; beim Tod endet das Spiel ohnehin (Spielstand gelöscht).

### Startausstattung statt Startgold

| Klasse | Ausstattung |
|---|---|
| Krieger | Kurzschwert (normal), Lederwams (normal) |
| Magier | Blitzstab (abgenutzt), 2 Manatränke, Zauber Flammenzeichen |
| Waldläufer | Kurzschwert (abgenutzt), 2 Heiltränke, 2 Heilkraut |

## 2. Preisliste (Im Spiel)

### Händler

| Ware | Lene (Sonnwacht) | Bram (Grauufer) | Hagen (Glutschlund) | Yasmin (Sandhafen) | Svea (Frosthain) |
|---|---|---|---|---|---|
| Heiltrank | 10 | 10 | 12 | 10 | 12 |
| Großer Heiltrank | 26 | – | – | 28 | – |
| Manatrank | 12 | 12 | 12 | 12 | 12 |
| Lederwams | 24 | 25 | – | – | 22 |
| Kettenhemd | 60 | 60 | – | 60 | – |
| Runenpanzer | – | – | 95 | – | 90 |
| Eisenschwert | 40 | 40 | 40 | 40 | 40 |
| Blitzstab | 55 | 55 | – | – | 55 |

Gekaufte Ausrüstung hat immer die Güte „normal“, ohne Bonus.

**Neue Waren (seit Spiel-Rev 81/89):** Bram: Dietrich 6, Schaufel 12, Angelrute 8 · Yasmin: Dietrich 6, Schaufel 12, Angelrute 10 · Brakk: Dietrich 7. Hagens Laden schließt, wenn er den Titanenbrecher schmiedet.

**Feilschen (seit Spiel-Rev 90):** Kaufpreise −5 % ab Stufe 1, −10 % ab 3, −15 % ab 5; Fang und Kram +25 % ab Stufe 2; Ausrüstung +20 % ab Stufe 4.

**Jost (Kornwacht, seit Spiel-Rev 35):** Heiltrank 11, Manatrank 12, Lederwams 24, Eisenschwert 42, Kettenhemd 62.

**Schwester Wenna (Steinwacht, seit Spiel-Rev 36):** Heiltrank 12, Großer Heiltrank 28, Manatrank 11.

**Ole (Schilfrode, seit Spiel-Rev 37):** Heiltrank 12, Manatrank 12, Lederwams 23, Kettenhemd 60, Blitzstab 56.

**Brakk (Erzhall, seit Spiel-Rev 38):** Heiltrank 12, Eisenschwert 38, Kettenhemd 58, Blitzstab 58, Runenpanzer 92.

**Ilka (Ostwacht, seit Spiel-Rev 39):** Heiltrank 12, Großer Heiltrank 30, Manatrank 13, Lederwams 26, Kettenhemd 64, Blitzstab 60.

### Dienste

| Dienst | Anbieter | Preis |
|---|---|---|
| Leben und Mana voll | Odo (Sonnwacht) | 10 |
| Leben und Mana voll | Schwester Wenna (Steinwacht) | 12 |
| Zauber Sturmstoß lernen | Tobe (Tränensee) | 30 |
| Wegstein-Reise | – | kostenlos, 15 Züge |

### Verkaufen

**Fang und Wertsachen (seit Spiel-Rev 81/89):** Hering 3, Makrele 5, Barsch 4, Aal 8, Leuchtfisch 28, Alter Stiefel 1, Edelstein 15 Gold (bis Spiel-Rev 90: 30).


- Bei jedem Händler kann **Ausrüstung aus dem Rucksack** verkauft werden (nicht angelegte Waffen und Rüstungen).
- Tränke, Rohstoffe und Questgegenstände sind nicht verkäuflich.
- **Verkaufspreis = Wertung × 5 + Güte × 6**, mindestens 3 Gold.
  - Wertung Waffe: Angriff (mit Güte und Bonus) + 0,5 bei Bonus
  - Wertung Rüstung: Rüstung × 2 + 0,5 bei Bonus
  - Güte: abgenutzt 0, normal 1, fein 2, meisterlich 3

| Beispiel | Verkaufspreis | zum Vergleich: Kaufpreis |
|---|---|---|
| Kurzschwert, abgenutzt | 10 | – |
| Kettenhemd, normal | 26 | 60 |
| Eisenschwert, normal | 31 | 40 |
| Runenpanzer, normal | 36 | 90–95 |
| Meisterliche Glutklinge mit Bonus | 66 | – |

## 3. Einnahmen (Im Spiel, berechnet für Spiel-Rev 90)

Durchschnittswerte für einen vollständigen Durchgang, einmalige Quellen, ohne wiederkehrende Gegner. Gegnerwerte und Anzahl aus dem Code von Rev 90 ausgelesen (242 Gegner beim Spielstart).

| Quelle | Gold | Rev 29 zum Vergleich |
|---|---|---|
| Goldbeutel (16 Stück, je 12–25) | etwa 300 | 310 |
| Normale Gegner in festen Gebieten (32 Gegner) | etwa 175 | 175 |
| Normale Gegner in Biomen und Wildnis (200 Gegner, Startbestand) | etwa 875 | 370 |
| Endgegner (9) | etwa 440 | 440 |
| Questbelohnungen (10 Nebenquests mit Gold) | 590 | 290 |
| **Truhen** (20 Holzkisten, 13 verschlossene, 8 Fallen-, 4 Bosstruhen; seit Spiel-Rev 91 halbiert) | etwa 525 | – |
| **Schätze** (5 Grabstellen) | 260 | – |
| **Die Tiefe** (seit Spiel-Rev 106/107): 21 Gegner etwa 130, Thronhüter 80–110 (etwa 95), 3 Truhen (2 verschlossene, 1 Fallentruhe) etwa 45 | etwa 270 | – |
| **Vogelnester** (5) und **Mimiken** (2) | etwa 130 | – |
| **Edelsteine** (etwa 24 aus Truhen, Schätzen, Nestern, je 15) | etwa 360 | – |
| **Summe einmalig** | **etwa 3925** mit der Tiefe (bis Spiel-Rev 105: etwa 3655; Rev 90: etwa 4535) | **etwa 1590** |
| Verkauf von Beute-Ausrüstung | zusätzlich: allein die Truhen-Ausrüstung bringt etwa 950 (13 × 28, 7 × 50, 4 × 65) | mehrere hundert |
| **Angeln** | unbegrenzt, etwa 4–5 Gold je Fang (ohne Leuchtfische), mit Feilschen 2 +25 % | – |
| Wiederkehrende Gegner (nach 320 Zügen) | unbegrenzt | unbegrenzt |

Feilschen erhöht alle Verkaufserlöse zusätzlich (Fang +25 % ab Stufe 2, Ausrüstung +20 % ab Stufe 4).

## 4. Ausgaben (Im Spiel)

| Ausgabe | Bedarf im Spielverlauf |
|---|---|
| Ausrüstung kaufen | einmalig etwa 100–200 (Truhen liefern früh gute Stücke) |
| Tränke | laufend, etwa 10–12 je Trank; Fische ersetzen viele Tränke |
| Heilung bei Odo oder Wenna | 10–12 je Besuch |
| Sturmstoß | 30 einmalig |
| Werkzeuge: Angelrute, Schaufel, etwa 10 Dietriche | etwa 80 |
| **realistische Summe** | **etwa 400–600** (Feilschen senkt das um bis zu 15 %) |

## 5. Bilanz (Im Spiel, berechnet für Spiel-Rev 90)

| Abschnitt | Einnahmen | Ausgaben | Stand |
|---|---|---|---|
| Anfang (Grauufer, Gruft, erste Truhen) | etwa 300 | etwa 120 (Tränke, Dietriche, Schaufel) | entspannt |
| Mitte (3 Splitter, Nebenquests, Truhen) | etwa 1600 | etwa 350 | großer Überschuss |
| Ende | etwa 3650 plus etwa 950 Verkauf plus Angeln | etwa 550 | **etwa 3500–4000 Gold ohne Verwendung** |

**Befund (nach Spiel-Rev 91):** Der Goldüberschuss ist trotz halbiertem Truhengold noch etwa dreimal so groß wie bei Rev 29. Schon am Anfang ist Gold nicht mehr knapp, weil Truhen und Edelsteine früh viel einbringen. Angeln ist eine unbegrenzte Goldquelle. Da es weiterhin nichts Teures zu kaufen gibt, ist Gold ab dem ersten Drittel praktisch wertlos. Siehe auch Grauufer_Fortschritt_RevXX.md.

### Vorschläge zum Ausgleich (Geplant, zusätzlich zu Abschnitt 6)

| Maßnahme | Wirkung |
|---|---|
| ~~Truhengold halbieren, Edelstein 30 → 15 Gold~~ | **umgesetzt in Spiel-Rev 91**, einmalige Einnahmen etwa −880 |
| Händlerkasse (Abschnitt 6) auch für Fang: höchstens 40 Gold Fang pro Händler und Spieltag | Angeln bleibt nützlich, aber keine Goldquelle ohne Grenze |
| Neue Goldausgaben für das, was Rev 90 mitbringt: **Lehrer für Fertigkeiten** (40–150 je Stufe), **Neuverteilen** der Attribut- und Talentpunkte bei Mira (200), **Meisterdietriche** (30, brechen nie) | Gold bekommt Wert für die Charakterentwicklung |
| Haus in Sonnwacht (400) mit Truhe und Trophäen, Ausbau je 150 | Langzeitziel für Gold |

## 6. Geplanter Ausbau

### Neue Ausgaben, vorhandene Vorschläge

| Ausgabe | Preis | Quelle |
|---|---|---|
| Ballonfahrt | 20 je Fahrt | Welt |
| Läuterung (verfluchten Schmuck ablegen) | 50 | Gegenstände, Quests |
| Übernachten bei Kalle | 5 | Gesprächspartner |
| Neue Wurfgeschosse | 8–40 je Stück | Waffenliste |

### Neue Ausgaben, zusätzlich

| Ausgabe | Preis | Wirkung |
|---|---|---|
| Schmuck beim Händler | 120–250 | einfache Ringe und Amulette mit Fertigkeit |
| Edle Ausrüstung | Glutklinge 160, Sturmzepter 200, Runenpanzer fein 180 | späte Händler (Yasmin, Svea, Hagen) führen Ware der Stufe 3 |
| Zauber kaufen | 40–120 | Lehrer verkaufen Zauber, die man sonst über Quests lernt, als Abkürzung |
| Verzaubern bei Ilsabe | 80 | zufälligen Bonus auf eine Waffe oder Rüstung setzen |
| Güte verbessern bei Hagen | 60 / 120 / 200 | abgenutzt → normal → fein → meisterlich |
| Eigenes Haus in Sonnwacht | 400 | Truhe für Gegenstände, Bett (Zeit vorspulen), Trophäen der Endgegner |
| Ausbau des Hauses | je 150 | Werkbank (Herstellen ohne Hagen), Alchemietisch, Ballonplatz |

### Regeln

| Regel | Geplant |
|---|---|
| Preisstaffel | Händler in fernen Gebieten +20 % (Hagen, Svea, Yasmin) |
| Verkaufsdeckel | höchstens 50 % des Kaufpreises gleicher Ware |
| Händlerkasse | jeder Händler kauft höchstens 150 Gold pro Spieltag an |
| Rohstoffe verkaufen | Silas kauft Glutkristalle (8 Gold), Hagen kauft Erz (3 Gold) |
| Wiederkehrende Gegner | geben nach dem 3. Mal nur halbes Gold (wie bei den EP) |

### Ziel-Bilanz

| Abschnitt | Ziel |
|---|---|
| Anfang | Gold knapp, jeder Kauf ist eine Entscheidung |
| Mitte | genug für Tränke und eine gute Anschaffung pro Gebiet |
| Ende | Gold für Haus, Schmuck und Verbesserungen; am Ende des Spiels nahezu ausgegeben |

## 7. Hinweise für die Umsetzung

- Alle Preise als Daten in `data/economy.ts`, auch Verkaufsformel und Dienste.
- Bilanz aus Abschnitt 3 bis 5 als automatischer Test, wenn sich Preise, Gegnergold oder Belohnungen ändern.
- Neue Preise zuerst hier eintragen, dann umsetzen; Änderungen erhöhen die Revision.
