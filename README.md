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
| `werkstatt/` | Grafik-Werkstatt: 3D-Modelle im Code, mit three.js gerendert (`npm run grafik`, Vorschaubilder in `werkstatt/vorschau/`); **Haus-Baukasten** `werkstatt/baukasten.html` (über GitHub Pages unter `https://schnoerp.github.io/Grauufer/werkstatt/baukasten.html`, Häuser per „Über GitHub an Claudia senden“ als GitHub-Issue; als Claude-Seite mit gemeinsamem Speicher über `node werkstatt/artefakt.js`); **Avatar-Baukasten** `werkstatt/avatarbaukasten.html` (Spielfigur einstellen, gleiche Ablage, Claude-Seite über `node werkstatt/artefakt.js <Ziel> avatar`); **Häuser im Spiel** aus `werkstatt/spielhaeuser/*.json`, eingebettet mit `npm run haeuser`; **Startbild** nach der Vorlage `werkstatt/logo/startbild_vorlage.jpg`, eingebettet mit `npm run logo` |
| `docs/` | Konzeptdokumente (Übersicht, Story, Welt, Quests, Gegner, Charakter, Schätze, Baukästen, Aufgabenliste …) |
| `CLAUDE.md` | Arbeitsregeln für Claude Code |

Einstieg in die Dokumente: `docs/Grauufer_Uebersicht_RevXX.md` (aktuell Rev 21).

## Tests

Bei jedem Push prüft GitHub automatisch (Reiter **Actions**): Syntax und Revision von `index.html` sowie 47 Browser-Tests (Start, Fenster, Fußzeile, Gespräch, Speichern, Truhe, Charakter, Angeln, Lava, zwei Enden, Fehlerbehebungen aus Rev 94, Symbol, Schatten und Farbstimmung, Südküste, feine Bodenzeichnung, Bäume, automatische Bildqualität, Story-Baum, Kugeln für Leben und Mana, Spieltitel, Logo, Die Tiefe mit Gegnern, Tafeln, Truhen, Thronhüter und Ring, Notgrund gegen schwarzen Boden, Häuser aus der Werkstatt in Grauufer, Sonnwacht und Sandhafen, Gruft, schlanke Stadtmauer, Flüsse und Berge, Echtzeitkampf, Figurengröße).

Lokal: `npm install`, `npx playwright install chromium`, dann `npm test`.

## Stand

Spiel-Revision **125** (Versionsnummer 1.0.125). Alle Dokumente in `docs/` sind geprüft; die Kopfzeile nennt den Spielstand ihrer letzten Änderung.
