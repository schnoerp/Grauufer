# Grauufer 1.0

Ein Browser-Rollenspiel im Stil von **Ultima VIII: Pagan** – isometrisch, Pixel-Look, prozedural gezeichnet.
Ein Spiel von **schnoerp-media**.

## Spielen

- **Online:** über GitHub Pages (Adresse unter *Settings → Pages*, sobald eingeschaltet).
- **Offline:** `index.html` herunterladen und im Browser öffnen. Das Spiel ist eine einzige Datei ohne externe Abhängigkeiten.

Bedienung kurz: Tippen = laufen und handeln · zwei Finger bzw. Strg + Ziehen = Ansicht verschieben · Taste **T** Tagebuch · **K** Charakter · **I** Rucksack · **G** Geschichte.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | das komplette Spiel (HTML, CSS, JavaScript, eingebettete Schrift) |
| `docs/` | Konzeptdokumente (Übersicht, Story, Welt, Quests, Gegner, Charakter, Schätze …) |
| `CLAUDE.md` | Arbeitsregeln für Claude Code |

Einstieg in die Dokumente: `docs/Grauufer_Uebersicht_Rev15.md`.

## Tests

Bei jedem Push prüft GitHub automatisch (Reiter **Actions**): Syntax und Revision von `index.html` sowie 25 Browser-Tests (Start, Fenster, Fußzeile, Gespräch, Speichern, Truhe, Charakter, Angeln, Lava, zwei Enden, Fehlerbehebungen aus Rev 94, Symbol, Schatten und Farbstimmung, Südküste, feine Bodenzeichnung, Bäume, automatische Bildqualität, Story-Baum, Kugeln für Leben und Mana, Spieltitel, Logo, Die Tiefe mit Gegnern, Tafeln, Truhen, Thronhüter und Ring).

Lokal: `npm install`, `npx playwright install chromium`, dann `npm test`.

## Stand

Spiel-Revision **107**. Alle Dokumente in `docs/` sind geprüft; die Kopfzeile nennt den Spielstand ihrer letzten Änderung.
