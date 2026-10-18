# Grauufer – Kampfsystem

**Revision 10**, Stand: Spiel-Rev 119. **Im Spiel** = in der aktuellen Spielversion umgesetzt (aus dem Code übernommen). **Geplant** = noch nicht im Spiel.

## 1. Grundprinzip (Im Spiel, Echtzeit seit Spiel-Rev 119)

- Der Kampf läuft in **Echtzeit** (bis Spiel-Rev 118 zugbasiert). Die Welt schreitet in einem festen **Takt von 0,5 Sekunden** voran – auch wenn die Figur still steht und auch bei offenem Fenster oder Gespräch (**keine Pause**, Entscheidung des Auftraggebers). Nur wenn der Browser-Reiter im Hintergrund ist, steht die Welt; danach wird nicht nachgeholt.
- In jedem Takt, in fester Reihenfolge:
  1. Taktzähler +1 (ersetzt den früheren Zugzähler; Tageszeit und Wiederbelebung zählen in Takten)
  2. Regeneration (siehe Abschnitt 8)
  3. Steinhaut-Dauer −1
  4. Weltereignisse (Wiederbelebung von Gegnern, Rohstoffe, Wegsteine), Tageszeit
  5. **Alle Gegner handeln** (Abschnitt 7)
  6. Anzeige aktualisieren; alle 10 Takte (5 s) Spielstand speichern
- Die Figur handelt unabhängig vom Takt: Laufen 1 Feld je 0,15 s (im Gebirge 0,26 s), Angriff im Waffentakt (Abschnitt 3), Zauber und Tränke mit Abklingzeiten (Abschnitt 5 und 8). Karte aufdecken und Gebietswechsel werden bei jedem Schritt geprüft.
- Entfernungen werden als **Schachbrett-Abstand** gemessen (diagonal zählt wie gerade, 1 Feld).

## 2. Werte der Spielfigur

### Grundwerte (Im Spiel)

| Wert | Wirkung |
|---|---|
| Stärke | +2 max. Leben je Punkt über 10; +1 Angriff je 3 Punkte über 10 |
| Geschick | +1,5 % Trefferchance je Punkt über 10 |
| Intelligenz | +2 max. Mana je Punkt über 10; +1 Zauberschaden je 3 Punkte über 10 |

### Klassen beim Start (Im Spiel)

| Klasse | Stärke | Geschick | Intelligenz | Leben | Mana | Start |
|---|---|---|---|---|---|---|
| Krieger / Kriegerin | 13 | 10 | 7 | +8 | −3 | Kurzschwert, Lederwams (beide normale Güte) |
| Magier / Magierin | 8 | 9 | 13 | −4 | +6 | Flammenzeichen, Blitzstab (abgenutzt), 2 Manatränke |
| Waldläufer / Waldläuferin | 10 | 13 | 8 | +2 | ±0 | Kurzschwert (abgenutzt), 2 Heiltränke, 2 Heilkraut |

Dazu 5 frei verteilbare Punkte im Charakter-Editor.

**Formeln beim Start**
- Max. Leben = 30 + Klassenbonus + (Stärke − 10) × 2
- Max. Mana = 10 + Klassenbonus + (Intelligenz − 10) × 2, mindestens 4
- Start mit vollem Leben und 70 % Mana

## 3. Angriff des Spielers (Im Spiel)

### Waffentakt und Dauerangriff (seit Spiel-Rev 119)

- **Dauerangriff:** Einmal einen Gegner antippen genügt. Die Figur läuft hin und schlägt im Waffentakt von **0,8 Sekunden** zu, bis der Gegner fällt oder du woanders hintippst. Fällt das Ziel, greift sie den nächsten Gegner in Reichweite an, der sie bedrängt oder schon angegriffen wurde (nicht in der Schutzzone).
- Der Waffentakt gilt für Nahkampf und Stäbe; auch Angriffe über die Schnellzugriffsleiste warten ihn ab.

### Nahkampf

| Größe | Formel |
|---|---|
| Trefferchance | 85 % + Trefferbonus |
| Schaden | Zufall 2–4 + Angriffsbonus |

### Fernkampf mit Stab (Blitzstab, Sturmzepter)

| Größe | Formel |
|---|---|
| Reichweite | Blitzstab 5, Sturmzepter 6 |
| Trefferchance | 90 % + Trefferbonus |
| Schaden | Zufall 2–4 + Angriffsbonus + Zauberbonus |
| Kosten | kein Mana |

### Boni

| Bonus | Zusammensetzung |
|---|---|
| Angriffsbonus | ⌊(Stärke − 10) / 3⌋ + Waffenangriff + „des Zorns“ auf der Rüstung + Stufenangriff + (Stufe − 1) |
| Waffenangriff | Grundwert der Waffe + Güte (abgenutzt −1, normal 0, fein +1, meisterlich +2) + „des Zorns“ |
| Trefferbonus | (Geschick − 10) × 1,5 % + „des Falken“ (je 8 %) auf Waffe und Rüstung |
| Zauberbonus | ⌊(Intelligenz − 10) / 3⌋ |

### Zielmarkierung

- Ein Tippen auf einen Gegner markiert ihn sichtbar und greift sofort an (Nahkampf oder Stab, je nach Waffe). Ist er außer Reichweite, läuft die Figur hin und greift dann an.
- Zielzauber: erst Zauber wählen, dann Gegner antippen.
- Taste F greift den markierten Gegner an, wenn er in Reichweite ist.
- Stirbt der Gegner, wird die Markierung aufgehoben.

## 4. Verteidigung und Angriff der Gegner (Im Spiel)

| Größe | Formel |
|---|---|
| Trefferchance | fester Wert je Gegnerart (75–82 %) |
| Schaden | Zufall aus Gegner-Angriffsspanne − Rüstung, **mindestens 1** |
| Rüstung | Rüstungswert + Güte (fein und meisterlich +1) + „des Steins“ auf Waffe oder Rüstung + Steinhaut (+2) |

- **Angriffstakt der Gegner (seit Spiel-Rev 119):** Ein Gegner direkt neben der Figur schlägt alle 1,5 Sekunden zu (jeden dritten Takt), flinke Gegner (Wolf, Frostwolf, Aschenhund, Harpyie) alle 1 Sekunde.
- Es gibt keinen Ausweichwert. Rüstung senkt nur den Schaden, nicht die Trefferchance.
- In der Schutzzone von Sonnwacht greifen Gegner nicht an und betreten sie nicht.

## 5. Zauber (Im Spiel)

| Zauber | Schule | Mana | Ziel | Wirkung |
|---|---|---|---|---|
| Flammenzeichen | Feuer | 4 | 1 Gegner, 5 Felder | 6–9 + (Stufe − 1) + Zauberbonus |
| Steinhaut | Erde | 4 | selbst | +2 Rüstung für 10 Sekunden (20 Takte) |
| Heilwasser | Wasser | 5 | selbst | heilt 12 + 2 × (Stufe − 1) + 2 × Zauberbonus |
| Glutregen | Feuer | 6 | alle direkt benachbarten Gegner | 7–10 + (Stufe − 1) + Zauberbonus |
| Sturmstoß | Luft | 5 | 1 Gegner, 4 Felder | 5–8 + (Stufe − 1) + Zauberbonus; Rückstoß bis 2 Felder |
| Eislanze | Wasser | 6 | 1 Gegner, 5 Felder | 8–11 + (Stufe − 1) + Zauberbonus; Ziel erstarrt 3 Sekunden (6 Takte) |

**Sonderregeln**
- Zauber treffen immer, es gibt keinen Trefferwurf.
- **Sturmstoß:** Landet der Gegner auf Abgrund, Lava, Wasser oder Schlucht, stürzt er hinab und stirbt sofort. Endgegner werden nicht zurückgestoßen.
- **Eislanze:** Ein erstarrter Gegner setzt aus.
- **Abklingzeiten (seit Spiel-Rev 119)** zusätzlich zu den Manakosten: Flammenzeichen 1,5 s, Sturmstoß 3 s, Glutregen 4 s, Eislanze 5 s, Heilwasser 6 s, Steinhaut 8 s. Die Schnellzugriffsleiste dunkelt das Feld ab und lässt die Abdunklung mit der Restzeit schrumpfen.

## 6. Zustände (Im Spiel)

| Zustand | Auslöser | Wirkung | Dauer |
|---|---|---|---|
| Erstarrt | Eislanze | Gegner handelt nicht | 3 Sekunden (6 Takte) |
| Steinhaut | Zauber | +2 Rüstung | 10 Sekunden (20 Takte) |

Weitere Zustände sind geplant (Abschnitt 12).

## 7. Verhalten der Gegner (Im Spiel)

Jeder Gegner prüft in jedem Takt (0,5 s) der Reihe nach:

| Schritt | Bedingung | Handlung |
|---|---|---|
| 1 | erstarrt | setzt aus |
| 2 | mehr als 16 Felder entfernt | ruht |
| 3 | direkt neben dem Spieler, Spieler nicht in Schutzzone | greift an |
| 4 | Spieler im Aggro-Radius, nicht in Schutzzone | geht 1 Feld auf kürzestem Weg zum Spieler, wenn der Weg höchstens Aggro × 2 + 2 Felder lang ist |
| 5 | sonst | 30 % Chance, 1 Feld zufällig zu laufen, höchstens 3 Felder vom Heimatpunkt entfernt |

- **Wiederbelebung:** Alle 25 Takte wird geprüft. Normale Gegner, die seit mindestens 320 Takten (160 s) tot sind, erscheinen mit vollem Leben neu, außer Sichtweite (mehr als 10 bis 14 Felder vom Spieler). Endgegner bleiben tot.

## 8. Regeneration, Heilung und Tod (Im Spiel)

| Quelle | Wirkung |
|---|---|
| Natürliche Erholung | +1 Mana alle 3 Takte (1,5 s), +1 Leben alle 5 Takte (2,5 s) |
| Rasten (seit Spiel-Rev 40) | zusätzlich +1 Leben und +1 Mana je Druck auf „Rasten“ bzw. die Leertaste, nur wenn kein Gegner im Umkreis von 6 Feldern ist |
| Abklingzeit Tränke (seit Spiel-Rev 119) | nach Heil-, Großem Heil- oder Manatrank 3 s bis zum nächsten Trank |
| Heiltrank | +15 Leben; mit Kräuterkunde 2 +15 % (17), ab Kräuterkunde 3 +30 % (20) |
| Großer Heiltrank | +35 Leben; mit Kräuterkunde 2 +15 % (40), ab Kräuterkunde 3 +30 % (46) |
| Manatrank | +8 Mana |
| Heiler Odo (Sonnwacht) | Leben und Mana voll, 10 Gold |
| Stufenaufstieg | Leben und Mana voll |

**Tod:** Fällt das Leben auf 0, ist das Spiel vorbei („Gefallen“). Der Spielstand wird **gelöscht**, es geht mit einer neuen Figur weiter (dauerhafter Tod).

**Weitere Gefahren (seit Spiel-Rev 64–89):**
| Gefahr | Wirkung |
|---|---|
| Lava betreten | sofortiger Tod; mit Talent Titanenblut 20 Schaden und kein Schritt |
| Lavabombe am Aschenhorn | 6–10 minus Rüstung; Schildwall halbiert, Glutbindung verhindert |
| Fallen-Truhe mit Gewalt | 5–9 (Giftnadel bzw. Stichflamme im Glutschlund); Fallenkunde 2: ×0,6, Schildwall halbiert, Fallenkunde 5 oder Kräuterkunde 5 (Gift) verhindern |

## 9. Erfahrung und Stufen (Im Spiel)

- Benötigte Erfahrung für die nächste Stufe: **Stufe × 30**
- Pro Stufe: +5 max. Leben, +2 max. Mana, +1 Angriff, Leben und Mana voll
- Seit Spiel-Rev 90 zusätzlich **2 Attributpunkte und 1 Talentpunkt** pro Stufe (Grauufer_Charakter_RevXX.md). Stärke +1 gibt +2 Leben, Intelligenz +1 gibt +2 Mana.

## 10. Beute (Im Spiel)

| Regel | Wert |
|---|---|
| Beute-Stufe | Gegner bis 15 EP: Stufe 1; bis 30 EP: Stufe 2; darüber: Stufe 3 |
| Ausrüstung Stufe 1 | Kurzschwert, Lederwams |
| Ausrüstung Stufe 2 | Eisenschwert, Kettenhemd, Blitzstab |
| Ausrüstung Stufe 3 | Glutklinge, Runenpanzer, Sturmzepter |
| Fallchance Ausrüstung | Bandit 25 %, Wolf 5 %, andere 14 % |
| Endgegner | immer 1 Ausrüstung, mindestens „fein“, 70 % mit Bonus |
| Güte | abgenutzt 25 %, normal 45 %, fein 23 %, meisterlich 7 % |
| Bonus-Chance | 15 % + 15 % je Gütestufe über „abgenutzt“ |
| Rohstoffe | Wolf 65 % Fell, Frostwolf 70 % Fell, Aschenhund 50 % Glutkristall, Riesenspinne 60 % Spinnenseide |

Gold fällt je Gegnerart in einer festen Spanne (siehe Grauufer_Gegner_RevXX.md).

## 11. Gegnerwerte

Alle Werte, Vorkommen, Aussehen und Beute der Gegner stehen in **Grauufer_Gegner_RevXX.md**. Dort ist die einzige Quelle für Gegnerdaten.

## 11b. Neu seit Spiel-Rev 82–90 (Im Spiel)

| Regel | Wirkung |
|---|---|
| Nhal | nur mit dem Titanenbrecher verwundbar, sonst „unverwundbar“ (auch Zauber); Phase 2 unter 50 % Leben mit 2 Glutgeistern (seit Spiel-Rev 91) |
| Überraschungsangriff | Schleichen 3 (inkl. Leise Sohlen +2): erster Treffer auf einen unverletzten, nicht aufgeschreckten Gegner doppelt |
| Schleichen | verringert die Aggro-Reichweite um 0,6 je Stufe (mindestens 1) |
| Tierfreund / Bannkreis | Wölfe, Frostwölfe, Aschenhunde bzw. Untote greifen nicht von selbst an, bis man sie angreift |
| Ring des Kapitäns | +2 Rüstung, solange er im Rucksack ist |
| Unbeugsam | Rasten heilt +2 statt +1 |

## 12. Geplanter Ausbau

> Hinweis (Spiel-Rev 119): Die geplanten Werte sind noch in Zügen angegeben. Bei der Umsetzung in Echtzeit gilt 1 Zug ≈ 1 Sekunde (2 Takte).

### Neue Zustände

| Zustand | Auslöser (laut Waffenliste) | Wirkung | Dauer |
|---|---|---|---|
| Brennend | Glutstab, Brandflasche | 2 Schaden pro Zug | 3 Züge |
| Gestürzt | Erdbeben, Bebenstein, Bebenhammer, Erdbohrer | setzt 1 Zug aus | 1 Zug |
| Blutend | Dornenpeitsche | 2 Schaden pro Zug | 3 Züge |
| Betäubt | Steinfaust | setzt 1 Zug aus | 1 Zug |
| Verlangsamt | Frostaxt | handelt nur jeden zweiten Zug | 3 Züge |
| Gefangen | Wasserkerker, Wasserkugel | weder Bewegung noch Angriff, Erstickungsschaden | 1–3 Züge |
| Festgesetzt | Netzwerfer, Wurzelstab | keine Bewegung, Angriff möglich | 2–3 Züge |
| Blind | Rauchtopf | verliert den Spieler aus den Augen | 3 Züge |
| Bezaubert | Nebelharfe | kämpft für den Spieler | 4 Züge |
| Vergiftet | Sporenbeutel | 2–3 Schaden pro Zug | 4 Züge |

**Regeln für Zustände**
- Gleiche Zustände stapeln sich nicht, die Dauer wird auf den höheren Wert gesetzt.
- Endgegner: alle Kontrollzustände (erstarrt, gestürzt, betäubt, gefangen, festgesetzt, bezaubert) höchstens 1 Zug.
- Jeder Zustand wird an der Figur sichtbar angezeigt (Symbol über dem Kopf).

### Elemente und Schwächen

- Jede Gegnerart bekommt Schwächen und Stärken laut Grauufer_Gegner_RevXX.md, Abschnitt 5.
- Schwäche: Schaden × 1,5. Stärke: Schaden × 0,5.
- Neue Schadensart **stumpf** (Hämmer): × 1,5 gegen Golems und Skelette.

### Kritische Treffer

- Grundchance 5 %, Dolche +15 % bis +20 %.
- Kritischer Treffer: doppelter Schaden, eigene Zahl in Gold und kurzer Bildruck.

### Fernkampf mit Bögen und Wurf

- Bögen und Armbrust nutzen Geschick statt Stärke für den Angriffsbonus.
- **Sichtlinie:** Fernangriffe und Zielzauber brauchen freie Sicht; Bäume, Felsen und Mauern blockieren.
- Wurfgeschosse: Reichweite 5, Flächenschaden trifft auch den Spieler (siehe Waffenliste, Wurfregeln).

### Abklingzeiten

- **Im Spiel seit Spiel-Rev 119** (Abschnitt 5 und 8).

### Endgegner-Phasen

| Endgegner | Phase bei 50 % Leben |
|---|---|
| Gruftwächter | ruft 2 Ghule |
| Tiefenwächter | zieht sich ins Wasser zurück, heilt 3 Züge lang |
| Glutfürst | Glutregen auf alle Felder um sich |
| Sturmherr | stößt den Spieler 2 Felder zurück |
| Spinnenkönigin | Netz auf den Spieler (festgesetzt) |
| Knochenkönig | erweckt gefallene Skelette |

### Tod (Geplant, als Option)

- Wählbarer Schwierigkeitsgrad beim Start: **Hart** (wie bisher, dauerhafter Tod) oder **Normal** (Wiedererwachen in Sonnwacht, Verlust von 25 % Gold).

## 13. Auffälligkeiten im Code (zuerst bei Spiel-Rev 29 gefunden, geprüft mit Spiel-Rev 94)

Beim Auslesen sind drei Stellen aufgefallen. Bitte bei der Migration bewusst entscheiden:

| Stelle | Beobachtung | Empfehlung |
|---|---|---|
| Stufenangriff | Der Angriff steigt pro Stufe doppelt: einmal über den gespeicherten Stufenangriff (+1 je Aufstieg) und zusätzlich über (Stufe − 1) im Angriffsbonus. Effektiv +2 Angriff je Stufe. | Klären, ob gewollt; sonst einen der beiden Anteile streichen |
| Eislanze | Beschreibung im Spiel sagte „2 Züge erstarrt“, tatsächlich setzt der Gegner 3 Züge aus. | **Erledigt in Spiel-Rev 94:** Beschreibung auf „3 Züge“ angeglichen, Wert unverändert |
| Sturmherr | gibt 0 EP und 0 Gold | gewollt, wenn das Spiel danach endet; sonst Werte ergänzen |

## 14. Hinweise für die Umsetzung

- Alle Werte dieses Dokuments gehören als Daten nach `data/` (z. B. `data/enemies.ts`, `data/spells.ts`), nicht fest in die Spiellogik.
- Kampfformeln zentral in einem Modul (z. B. `src/combat/`) bündeln, damit beide Entwickler dieselben Regeln nutzen.
- Für jede Formel einen automatischen Test anlegen (Trefferchance, Schaden, Rüstung, Stufenaufstieg).
- Änderungen an Werten erhöhen die Revisionsnummer dieses Dokuments.
