# Grauufer – Fahrplan

**Revision 06**, Stand: Spiel-Rev 90. Reihenfolge der Umsetzung mit Claude Code im GitHub-Repo „grauufer“ (TypeScript + Vite), für 2 Entwickler parallel.

Die verbindliche Zuständigkeitsaufteilung und der Branch-Ablauf stehen in der CLAUDE.md. Die Spuren unten sind eine Empfehlung dazu.

## 1. Zwei Spuren

| Spur | Schwerpunkt | Dokumente |
|---|---|---|
| **A: Technik und Welt** | Spielschleife, Darstellung, Karte, Bedienung, Leistung, Speichern | Welt, Bedienung, Stil, Kampfsystem (Logik) |
| **B: Inhalte und Daten** | Gegner, Gegenstände, Waffen und Zauber, Figuren, Quests, Texte, Balancing, Preise | Gegner, Gegenstände, Waffenliste, Gesprächspartner, Quests, Story, Fortschritt, Wirtschaft |

Grundsatz: Spur A baut Systeme, Spur B füllt sie mit Daten unter `data/`. So kommen sich beide selten in die Quere.

## 2. Stufen

### Stufe 0: Grundgerüst

| Aufgabe | Spur |
|---|---|
| Startpaket ins Repo (CLAUDE.md, README, .gitignore, Rev 29 unter `reference/`) | A |
| Vite-Projekt, Ordnerstruktur, Testumgebung | A |
| Alle Konzeptdokumente unter `docs/` | B |

**Fertig, wenn:** leeres Spiel startet im Browser, Tests laufen.

### Stufe 1: Migration auf den Stand von Rev 90 (vorher Rev 29)

> Hinweis: Der HTML-Prototyp ist inzwischen bei Rev 90. Grundlage der Migration ist damit Grauufer_Rev90.html, nicht mehr Rev 29.


| Aufgabe | Spur |
|---|---|
| Spielschleife, Zugablauf, Karte, Darstellung, Bedienung, Speichern | A |
| Alle Daten aus Rev 29 in `data/` übertragen (Gegner, Gegenstände, Zauber, Figuren, Dialoge, Quests) | B |
| Kampfformeln in `src/combat/` mit Tests | A + B |

**Fertig, wenn:** das neue Spiel sich genau wie Rev 29 spielt, flüssig auf dem Tablet.
Grobe Schätzung aus der Technikentscheidung: 8 bis 15 Arbeitssitzungen.

### Stufe 2: Korrekturen und Balancing-Basis

| Aufgabe | Spur |
|---|---|
| Prüfpunkte aus Kampfsystem Abschnitt 13 entscheiden und umsetzen (Stufenangriff, Eislanze, Sturmherr) | B |
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

## 3b. Im Prototyp bereits vorweggenommen (Spiel-Rev 42–90)

Grafik-Stufenplan (Rev 58–63), Vulkan und Portale (64–67), Lava-Tod (69), Ansicht verschieben (73/74), Story Stufen 1–4 mit Fraktionen, Büchern und Enden (79–82), Angeln (81), Tagebuch (84), Pergament-Fenster (87), Schatztruhen und Schätze (89), Charakterentwicklung mit Fertigkeiten und Talentbaum (90). Diese Punkte fallen in den Stufen 3–8 weg bzw. werden zur Übernahme.

## 4. Offene Entscheidungen

| Entscheidung | gebraucht bis |
|---|---|
| Prüfpunkte im Kampfsystem (Abschnitt 13) | Stufe 2 |
| Ausgleichsmaßnahmen aus Fortschritt und Wirtschaft | Stufe 2 |
| Tod: nur „Hart“ oder zusätzlich „Normal“ | Stufe 3 |
| Erdbeben als Weltereignis ja oder nein | Stufe 4 |
| Handy: Hoch- oder Querformat | Stufe 9 |
| Namen der Kontinente | entschieden: Tharos, Splittmark, Nullwacht |
