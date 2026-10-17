# Arbeitsregeln für Claude Code – Projekt „Grauufer“

Diese Datei liest Claude Code bei jeder Sitzung. Sie hält fest, wie in diesem Repo gearbeitet wird.

## 1. Projekt

- Privates Browser-Rollenspiel „Grauufer“ von **schnoerp-media** im Stil von **Ultima VIII: Pagan**.
- Das Spiel ist **eine einzige Datei**: `index.html` (HTML + CSS + JavaScript, Canvas 2D, isometrisch).
- Konzeptdokumente liegen in `docs/` (16 Markdown-Dateien). Einstieg: `docs/Grauufer_Uebersicht_RevXX.md`.
- Sprache in Spiel, Dokumenten, Commit-Nachrichten und Antworten: **Deutsch**.

## 2. Unverrückbare Anforderungen

1. **Kein Ruckeln.** Testgerät ist ein Android-Tablet mit Chrome. Pro Bild keine teuren Neuberechnungen; Aufwendiges einmalig vorberechnen (Bodenpuffer, Sprite-Cache) oder über mehrere Bilder verteilen.
2. **Nie schwarzer Boden.** Grafikspeicher-Haushalt aus Spiel-Rev 53 beibehalten: nur Spielfläche und zwei Bodenpuffer auf der Grafikkarte, alle Texturen und Sprites im Hauptspeicher (`willReadFrequently`), Notboden und Wächterstufen bei Grafikverlust.
3. **Alles prozedural.** Keine externen Bilder, Skripte oder Schriften laden. Grafiken werden im Code gezeichnet. Die Schrift „Pixelify Sans“ ist eingebettet (SIL OFL 1.1). Das Spiel muss offline als Einzeldatei laufen.
4. **Pixel-Look** (Spiel-Rev 59): Texturen und Sprites gerastert, Palette mit 16 Stufen je Kanal, Bayer-Dithering, keine Glättung, ganzzahlige Zoomstufen.
5. **Spielstand** im Browser (`localStorage`, Schlüssel `grauufer-save-v10`). Alte Spielstände müssen **nicht** mehr übernommen werden, sofern der Auftraggeber nichts anderes vorgibt. Bricht eine Änderung alte Spielstände, den Schlüssel hochzählen (z. B. `grauufer-save-v11`), damit ein alter Stand nicht fehlerhaft geladen wird, und es in der Commit-Nachricht vermerken. Eine Migration in `migrate()` nur auf ausdrücklichen Wunsch.

## 3. Revisionen

- Jede ausgelieferte Änderung erhöht die **Spiel-Revision** um 1 (aktuell **101**).
- Die Revision steht an zwei Stellen in `index.html`: im `<title>` („Rollenspiel-Prototyp (Rev NN)“) und im Titeldialog („Revision NN“). Beide anpassen.
- Commit-Nachricht beginnt mit `Rev NN:` und beschreibt die Änderung auf Deutsch.

## 4. Dokumente immer mitziehen

- **Jede Spieländerung wird in den betroffenen Dokumenten in `docs/` nachgetragen** – im selben Commit.
- Kennzeichnung in allen Dokumenten: **Im Spiel** = umgesetzt (aus dem Code übernommen), **Geplant** = noch nicht im Spiel.
- Kopfzeile jedes Dokuments: „**Revision NN**, Stand: Spiel-Rev NN.“ – Dokument-Revision bei Änderung um 1 erhöhen, Dateinamen entsprechend anpassen (`Grauufer_Story_Rev06.md` → `…_Rev07.md`).
- Verweise zwischen Dokumenten immer als `Grauufer_Name_RevXX.md` (mit „XX“), damit sie nicht veralten.
- Werte (Leben, Schaden, Preise, Koordinaten) nicht schätzen, sondern **aus dem Code auslesen**.
- Neue Inhalte, für die es kein Dokument gibt, bekommen ein neues Dokument und einen Eintrag in der Übersicht.

## 5. Prüfen vor jedem Commit

- **`npm test`** führt alles aus: `scripts/check.js` (Syntax, Revision an beiden Stellen gleich, keine externen Dateien) und die Browser-Tests in `tests/grauufer.spec.js`. Dieselben Prüfungen laufen bei jedem Push als GitHub Action (`.github/workflows/tests.yml`).
- Neue Funktionen bekommen einen eigenen Test in `tests/grauufer.spec.js`.

- JavaScript-Syntax prüfen (z. B. Skript aus `index.html` extrahieren und mit Node parsen).
- Statische Prüfung mit ESLint (Regeln: `no-undef`, `no-redeclare`, `no-dupe-keys`, `no-unreachable` u. a.) – **0 Fehler**.
- Im echten Browser (Playwright/Chromium) mindestens: Spielstart, Charakterwahl, Laufen, alle Fenster öffnen, NPC-Dialog, Speichern und Neuladen. Konsole ohne Fehler.
- Bei Grafikänderungen: Bildzeit vorher/nachher vergleichen; keine neuen Grafikkarten-Leinwände anlegen.
- Fenster (Rucksack, Charakter, Tagebuch …) müssen bei 1250 × 650 ohne Scrollen passen und zentriert sein.

## 6. Stil der Bedienoberfläche

- Fenster im Stil „Pergament auf Holzrollen“, Schließen als rotes Wachssiegel, immer zentriert.
- Fußzeile einzeilig, alle Elemente gleich hoch.
- Texte im Spiel: Deutsch, Du-Form, keine Anglizismen, wenn ein deutsches Wort passt.

## 7. Zusammenarbeit (2 Entwickler)

- Jeder arbeitet in einem eigenen Zweig (`feature/...`), Zusammenführen per Pull Request.
- Vor dem Zusammenführen: Prüfungen aus Abschnitt 5 bestanden, Dokumente nachgezogen, Revision erhöht.
- Später geplant: Migration nach TypeScript + Vite laut `docs/Grauufer_Fahrplan_RevXX.md`, Grundlage ist der aktuelle Stand von `index.html`.
