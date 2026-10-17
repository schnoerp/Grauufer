# Grauufer – Fahrplan

**Revision 09**, Stand: Spiel-Rev 98. Reihenfolge der Umsetzung mit Claude Code im GitHub-Repo „grauufer“ (TypeScript + Vite), für 2 Entwickler parallel.

Die verbindliche Zuständigkeitsaufteilung und der Branch-Ablauf stehen in der CLAUDE.md. Die Spuren unten sind eine Empfehlung dazu.

## 1. Zwei Spuren

| Spur | Schwerpunkt | Dokumente |
|---|---|---|
| **A: Technik und Welt** | Spielschleife, Darstellung, Karte, Bedienung, Leistung, Speichern | Welt, Bedienung, Stil, Kampfsystem (Logik) |
| **B: Inhalte und Daten** | Gegner, Gegenstände, Waffen und Zauber, Figuren, Quests, Texte, Balancing, Preise | Gegner, Gegenstände, Waffenliste, Gesprächspartner, Quests, Story, Fortschritt, Wirtschaft |

Grundsatz: Spur A baut Systeme, Spur B füllt sie mit Daten unter `data/`. So kommen sich beide selten in die Quere.

## 2. Stufen

### Stufe 0: Grundgerüst ✓ (erledigt mit Spiel-Rev 93)

| Aufgabe | Spur | Stand |
|---|---|---|
| Startpaket ins Repo (CLAUDE.md, README, .gitignore, Rev 29 unter `reference/`) | A | ✓ erledigt; **offen:** Ordner `reference/` mit Rev 29 fehlt noch |
| Vite-Projekt, Ordnerstruktur, Testumgebung | A | ✓ Testumgebung: `npm test` (scripts/check.js + Playwright-Tests in tests/grauufer.spec.js), GitHub Action bei jedem Push; Vite-Projekt wandert in Stufe 1 |
| Alle Konzeptdokumente unter `docs/` | B | ✓ erledigt |

**Fertig, wenn:** leeres Spiel startet im Browser, Tests laufen. Erfüllt: Das Spiel startet als `index.html`, Tests laufen lokal und auf GitHub.

### Stufe 1: Migration auf den aktuellen Stand des Prototyps (vorher Rev 29)

> Hinweis: Der HTML-Prototyp liegt im Repo als `index.html` (aktuell Spiel-Rev 94). Grundlage der Migration ist der jeweils aktuelle Stand von `index.html`, nicht mehr Rev 29. Zuerst das Vite-Projekt mit Ordnerstruktur anlegen (aus Stufe 0 verschoben).


| Aufgabe | Spur |
|---|---|
| Vite-Projekt und Ordnerstruktur (aus Stufe 0) | A |
| Spielschleife, Zugablauf, Karte, Darstellung, Bedienung, Speichern | A |
| Alle Daten aus `index.html` in `data/` übertragen (Gegner, Gegenstände, Zauber, Figuren, Dialoge, Quests) | B |
| Kampfformeln in `src/combat/` mit Tests | A + B |

**Fertig, wenn:** das neue Spiel sich genau wie der Prototyp spielt, flüssig auf dem Tablet, und alle Tests aus tests/grauufer.spec.js bestehen.
Grobe Schätzung aus der Technikentscheidung: 8 bis 15 Arbeitssitzungen.

### Stufe 2: Korrekturen und Balancing-Basis

| Aufgabe | Spur |
|---|---|
| Prüfpunkte aus Kampfsystem Abschnitt 13 entscheiden und umsetzen (Stufenangriff, Sturmherr; Eislanze erledigt in Spiel-Rev 94) | B |
| Ausgleich laut Fortschritt Abschnitt 5 (EP-Kurve, Endgegner, Goldausgaben) | B |
| Balancing-Rechnung als automatischer Test | A |

**Fertig, wenn:** Richtstufen passen zum Ziel-Verlauf im Fortschritts-Dokument.

### Stufe 3: Ausbau Kampfsystem

| Aufgabe | Spur |
|---|---|
| Zustände mit Anzeige über den Figuren | A |
| Elemente, Schwächen und Stärken | B |
| Abklingzeiten mit Anzeige in der Leiste | A |
| Sichtlinie, kritische Treffer, Bögen mit Geschick | A |
| Endgegner-Phasen | B |

### Stufe 4: Neue Waffen, Zauber, Gegenstände

| Aufgabe | Spur |
|---|---|
| Waffen A) und Wurfgeschosse B) aus der Waffenliste, mit Wurfregeln | B |
| Zauber Erdbeben und Wasserkerker | B |
| Erdbohrer mit Unter-der-Erde-Bewegung | A |
| Neue Rüstungen, Rohstoffe, Tränke | B |
| Neue Preise und Goldausgaben laut Wirtschaft (Haus, Verbesserungen, Händlerregeln) | A + B |
| Effekte und Klänge für alles Neue | A |

### Stufe 5: Figuren und Quests

| Aufgabe | Spur |
|---|---|
| Neue Gesprächspartner mit Dialogen | B |
| Neue Quests aus der Questliste | B |
| Neue Orte dafür (Taverne, Rathaus, Nordpass-Lager, Baumhaus) | A |

### Stufe 6: Schmuck und exotische Waffen

| Aufgabe | Spur |
|---|---|
| Schmuckplätze, Fertigkeiten, Sets, verfluchter Schmuck | A + B |
| Exotische Waffen G) mit ihren Sonderregeln (Verbündete, Heranziehen, Zeit anhalten) | A + B |

### Stufe 7: Neue Gegner und Gebiete

| Aufgabe | Spur |
|---|---|
| Neue Gegner aus der Gegnerliste, eigenes Verhalten | B |
| Nebelwald ausbauen, verschüttete Schatzkammern, Wetter | A |

### Stufe 8: Geschichte vollenden

| Aufgabe | Spur |
|---|---|
| Erinnerungsszenen, Pakt-Ort, drei Enden | B |
| Zwischensequenzen und Abspann | A |

### Stufe 9: Feinschliff

| Aufgabe | Spur |
|---|---|
| Handy-Unterstützung (Ausrichtung vorher entscheiden) | A |
| Musik je Gebiet | A |
| Gesamttest mit allen Klassen, Texte prüfen | A + B |

### Stufe 10: Weitere Kontinente

| Aufgabe | Spur |
|---|---|
| Mehrere Karten, Reisen per Schiff, Ballon und Riss zwischen Kontinenten | A |
| Gebiete, Gegner, Figuren, Quests und Story je Kontinent | B |

**Voraussetzung:** Morvenn ist vollständig fertig.

## 3. Regeln für jede Stufe

- Jede Stufe in kleinen Schritten über eigene Branches, Zusammenführen nur mit bestandenen Tests.
- Vor dem Zusammenführen: Test auf dem Android-Tablet in Chrome, **kein Ruckeln**.
- Umgesetzte Vorschläge in den Dokumenten von „Geplant“ auf „Im Spiel“ umstellen, Revision erhöhen.
- Jede Lieferung bekommt eine neue Spiel-Revision.

## 3b. Im Prototyp bereits vorweggenommen (Spiel-Rev 42–98)

Grafik-Stufenplan (Rev 58–63), Vulkan und Portale (64–67), Lava-Tod (69), Ansicht verschieben (73/74), Story Stufen 1–4 mit Fraktionen, Büchern und Enden (79–82), Angeln (81), Tagebuch (84), Pergament-Fenster (87), Schatztruhen und Schätze (89), Charakterentwicklung mit Fertigkeiten und Talentbaum (90), Endgegner-Phase für Nhal und halbiertes Truhengold (91), Ausstattungssuche während des Titelbilds (92), Testknopf entfernt sowie Repo mit Tests und GitHub Action (93), Fehlerbehebungen aus dem Dokumentenprüfbericht (94), Symbol für Lesezeichen (95), kräftigere Schatten, Schatten der Ausstattung und Farbstimmung je Gebiet (96), geschwungene Südküste (97), feine Bodenzeichnung (98). Diese Punkte fallen in den Stufen 3–8 weg bzw. werden zur Übernahme.

### Halbes Raster (Felder halb so groß), verschoben in Stufe 1

Gewünscht: kleinere Felder, also die Karte mit 1360 × 496 statt 680 × 248 Feldern. Eine Machbarkeitsmessung mit Spiel-Rev 97 (Tablet-Bildschirm 1280 × 800, doppelte Pixeldichte, CPU 4-fach gedrosselt, etwa dreifache Felderzahl im Bild) ergab mit dem jetzigen Zeichenverfahren:
- **Bildzeit:** 2- bis 2,5-fach (Strand 112 → 214 ms, Sonnwacht 115 → 249 ms, Küste Ost 32 → 80 ms).
- **Bodenpuffer:** nach 30 s nicht fertig. Das heißt Gefahr von schwarzem Boden.

Deshalb wurde zunächst die feine Bodenzeichnung umgesetzt (Spiel-Rev 98, siehe Grauufer_Stil_RevXX.md). Das echte halbe Raster gehört in die Umstellung auf TypeScript + Vite, zusammen mit einem schnelleren Zeichenverfahren (z. B. Meer und Boden als vorberechnete große Flächen, weniger Zeichenaufrufe je Feld). Umzustellen sind dann alle Koordinaten, Entfernungen, Reichweiten, das Lauftempo, die Bodengrafiken und die Dokumente. Alte Spielstände müssen dafür nicht übernommen werden.

## 4. Offene Entscheidungen

| Entscheidung | gebraucht bis |
|---|---|
| Prüfpunkte im Kampfsystem (Abschnitt 13) | Stufe 2 |
| Ausgleichsmaßnahmen aus Fortschritt und Wirtschaft | Stufe 2 |
| Tod: nur „Hart“ oder zusätzlich „Normal“ | Stufe 3 |
| Erdbeben als Weltereignis ja oder nein | Stufe 4 |
| Handy: Hoch- oder Querformat | Stufe 9 |
| Namen der Kontinente | entschieden: Tharos, Splittmark, Nullwacht |
