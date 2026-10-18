# Grauufer – Baukästen

**Revision 1**, Stand: Spiel-Rev 108. **Im Spiel** = in der aktuellen Spielversion umgesetzt (aus dem Code übernommen). **Geplant** = noch nicht im Spiel.

Dieses Dokument beschreibt die Baukästen, mit denen der Auftraggeber und der zweite Entwickler Teile der Spielwelt selbst zusammenstellen. Die Baukästen gehören zur Grafik-Werkstatt; Technik, Stilregeln und Kamera stehen in Grauufer_Grafik_RevXX.md.

## 1. Überblick

| Baukasten | Stand | Inhalt |
|---|---|---|
| Haus-Baukasten | vorhanden in der Werkstatt, noch nicht im Spiel | einzelne Häuser vom Schuppen bis zur Residenz: Grundriss, Wände, Dach, Geschosse, Fenster und Türen, Einrichtung (Abschnitt 2) |
| Anlagen-Baukasten | Geplant | Burg und Schloss als Anlagen aus mehreren Teilen (Abschnitt 3) |

| Teil | Datei |
|---|---|
| Bedienseite | `werkstatt/baukasten.html` |
| Hausbau (Modelle, Vorlagen, Einrichtung) | `werkstatt/modelle/hausbau.js` |
| Claude-Seite erzeugen | `werkstatt/artefakt.js` (bettet three.js und Hausbau in die Bedienseite ein) |
| gebaute Häuser | `werkstatt/haeuser/*.json` |
| Tests | `tests/grauufer.spec.js` (Abschnitt „Werkstatt“) |

## 2. Haus-Baukasten (vorhanden, noch nicht im Spiel)

**Aufruf, zwei Wege:**
- **Claude-Seite „Grauufer Haus-Baukasten“** im Claude-Konto des Auftraggebers (empfohlen): gespeicherte Häuser liegen im Speicher der Seite (Sammlung `haeuser`, ein Dokument je Haus mit `name`, `spec`, `geaendert`); Claude liest sie dort direkt aus, legt sie unter `werkstatt/haeuser/` ab und baut sie ins Spiel ein. Der Auftraggeber muss keine Dateien ablegen. Die Seite wird mit `node werkstatt/artefakt.js <Zieldatei>` aus `baukasten.html` erzeugt (three.js und Hausbau eingebettet).
- **`werkstatt/baukasten.html`** über GitHub Pages unter `https://schnoerp.github.io/Grauufer/werkstatt/baukasten.html` (wie das Spiel) oder lokal: „Speichern“ legt nur im Browser ab. **„Über GitHub an Claudia senden“** öffnet auf GitHub ein vorausgefülltes Issue „Haus: <Name>“ mit der Beschreibung als JSON; nach „Submit“ liest Claude es aus, legt das Haus unter `werkstatt/haeuser/` ab, baut es ein und schließt das Issue. Voraussetzung: beim Absenden bei GitHub angemeldet (beide Entwickler haben Zugriff aufs Repo).

Beide Wege sind für Tablet (1280 × 800), Rechner und Handy ausgelegt.

| Bereich | Bedienung |
|---|---|
| Haustyp | Vorlagen nach Größe und Aufwand: **Schuppen** (2×2–3×3, Holz, Pultdach, Tor, Werkbank), **Cottage** (3×3–5×4, Bruchstein, Reet-Walmdach, Dachboden), **Bauernhaus** (5×4–8×5, Wohnteil und Stall mit Tor, Futterkrippen und Heu, Heuboden), **Wohnhaus** (3×3–5×5, schmal und hoch, 3 Geschosse, unten Laden mit Theke), **Landhaus** (6×5–9×7, 2 Geschosse, Walmdach mit Gauben), **Residenz** (7×6–9×9, Stein, Portal, regelmäßige Fensterreihen, 2 Geschosse und Dachboden). „Vorlage laden“ setzt Größe, Bauart, Öffnungen und Einrichtung; danach ist alles frei änderbar. Burg und Schloss folgen später als eigener Anlagen-Baukasten |
| Haus | Breite und Tiefe 2–9 Felder; Wände: Fachwerk auf Bruchstein, Bruchstein, Holzbohlen; Dachdeckung: Schiefer, Holzschindeln, Reet; Dachform: Satteldach (mit Giebeln), Walmdach (rundum geneigt) oder Pultdach (eine Schräge, vorn tief, hinten hoch; ohne Dachboden), Reet standardmäßig als Walmdach; Gauben auf der vorderen Dachfläche (nicht beim Pultdach); First entlang der Breite oder der Tiefe; Verwitterung in 5 Stufen (neu, gepflegt, gebraucht, verwittert, verfallen); Schornstein ein/aus (steht über dem Kamin, falls einer gesetzt ist) |
| Geschosse und Dachboden | 1, 2 oder 3 Geschosse, dazu auf Wunsch ein **begehbarer Dachboden**; bei mehreren Ebenen Umschalter über dem Grundriss (Erdgeschoss, 1. Obergeschoss, 2. Obergeschoss, Dachboden): Fenster, Türen und Einrichtung werden je Ebene gesetzt. Teil **„Treppe (nach oben)“** auf jeder Ebene außer der obersten, steigt in einem Feld auf 3 m und erzeugt darüber an derselben Stelle ein Treppenloch mit Geländer (dort nichts stellbar). Eine Tür im Obergeschoss bekommt einen kleinen Austritt mit Brüstung. Der Dachboden hat keine Fenster- und Türwerkzeuge; innen zeigt er Boden, Kniestock, Giebelwand mit Fenster (Satteldach) und den offenen Dachstuhl mit Firstpfosten – die Dachschrägen selbst stehen in der Spielansicht fast in Blickrichtung und werden deshalb weggelassen. Außen bekommt ein Satteldach mit Dachboden je ein Giebelfenster. „Innen“ zeigt die gewählte Ebene |
| Grundriss | von oben, oben = hinten, unten = vorn (zur Kamera); ein Feldrand um das Haus für Dinge im Freien (nur Erdgeschoss) |
| Fenster und Türen | sieben eigene Werkzeuge: Fenster, Tür, Fenster kaputt, Fenster vernagelt, **Tor** (zwei Flügel, 1,9 m breit), **Portal** (Doppeltür mit Steinrahmen, Bogen und Stufen), **Luke** (kleiner Holzladen); auf eine Wand tippen setzt die Öffnung, nochmal tippen macht wieder Wand daraus. Im Grundriss: Fenster als hellblaue Doppellinie (kaputt mit schwarzem Kreuz, vernagelt mit Brettern), Tür als Lücke mit Türblatt und Schwenkbogen ins Haus; die Knöpfe zeigen dasselbe Zeichen |
| Einrichtung | 22 Teile: Treppe, Futterkrippe, Heu, Werkbank, Ladentheke, Bett, Truhe, Schrank, Bücherregal, Kamin, Wandbrett, Waffen an der Wand, Tisch mit Bänken, Fässer, Kiste, Säcke, Hocker, Teppich, Kessel, Stuhl (umgekippt), Besen, Brennholz; Wandteile drehen sich beim Setzen zur nächsten Wand. **Je Feld ein Möbelstück**; Teppich, Kessel, Wandbrett und Waffen an der Wand dürfen als Zusatzteil dazukommen (höchstens eines). Ein zweites Möbelstück ersetzt das erste, erneutes Tippen mit derselben Sorte dreht das Teil. „Drehen“ dreht das zuletzt gesetzte Teil, „Entfernen“ leert das ganze Feld. Ältere gespeicherte Häuser mit mehreren Teilen je Feld werden beim Laden bereinigt |
| Vorschau | Spielsicht (45°/30°), Außen- oder Innenansicht, in 90°-Schritten drehbar |
| Speichern | „Speichern“ legt das Haus unter seinem Namen ab (Claude-Seite: im gemeinsamen Speicher, sonst im Browser), Liste „Gespeicherte Häuser“ zum Öffnen; „Löschen“ fragt durch zweites Tippen nach; „Herunterladen“ (nur Browser-Weg) erzeugt eine JSON-Datei, „Datei laden“ öffnet eine solche Datei |

**Verwitterung je Stufe:** mehr Schmutz, Laufspuren, abgeplatzter Putz, Risse und Moos auf den Oberflächen; durchhängendes Dach und schiefe Holzteile; ab „gebraucht“ Spinnweben, ab „verwittert“ Putzbrocken, geflicktes Dach und schief hängende Fensterläden; mehr Stroh innen und Unkraut außen.

**Dächer:** gekrümmte, leicht durchhängende Flächen mit sichtbarer Dicke an der Traufe. Reet: etwa 45° steil, 0,34 m dick, weich gewölbt, mit Firstwulst und Graten, Halme quer zur Traufe; Schiefer und Schindeln: etwa 32° steil, Holzkante an der Traufe und an den Ortgängen, ab „verwittert“ mit Brettern geflickt.

**Beschreibung eines Hauses (JSON):** `name`, `breite`, `tiefe`, `wand`, `dach`, `dachform` (sattel/walm/pult, optional), `gauben` (true/false, optional), `typ` (Haustyp der geladenen Vorlage, optional), `first`, `verwitterung` (0–1), `schornstein`, `oeffnungen` (Liste aus `seite` = hinten/vorn/links/rechts, `feld`, `art`), `einrichtung` (Liste aus `art`, `x`, `z`, `dreh` 0–3; 0 = Rückseite zur hinteren Wand), `geschosse` (1–3, optional), `dachboden` (true/false, optional) und bei Öffnungen und Einrichtung oberhalb des Erdgeschosses `geschoss` (1, 2 …; der Dachboden hat die Nummer nach dem obersten Geschoss).

**Beispiele:** `werkstatt/haeuser/fischerhaus.json` (Fachwerk, Schiefer-Satteldach), `werkstatt/haeuser/reetkate.json` (Holzbohlen, Reet-Walmdach); Bild aller Haustypen: `werkstatt/vorschau/haustypen.jpg` (`npm run grafik`).

## 3. Anlagen-Baukasten für Burg und Schloss (Geplant)

- **Entscheidung (Gespräch mit dem Auftraggeber, Spiel-Rev 108):** Burg und Schloss werden **nicht** als Haustyp im Haus-Baukasten angelegt, sondern später in einem **eigenen Baukasten**. Reihenfolge: zuerst Haus-Baukasten fertig und Pilot „Startgebiet Grauufer“ (Abschnitt 4), danach der Anlagen-Baukasten.
- Grund: Burg und Schloss sind keine einzelnen Häuser, sondern Anlagen aus mehreren Teilen auf einer größeren Fläche.
- Umfang und Bedienung sind noch nicht festgelegt. Vorschlag zur Abstimmung: Ringmauer mit Wehrgang, Türme, Torhaus, Hof, Bergfried oder Hauptbau; Gebäude im Hof aus dem Haus-Baukasten wiederverwenden.

## 4. Weg ins Spiel (Geplant)

1. **Abgeben:** Der Auftraggeber oder der zweite Entwickler speichert ein Haus auf der Claude-Seite oder sendet es über GitHub (Abschnitt 2). Claude legt es unter `werkstatt/haeuser/` ab; niemand muss Dateien selbst ablegen.
2. **Rendern:** `npm run grafik` erzeugt die Bilder (außen, innen, wie im Spiel gerastert).
3. **Einbauen:** Häuser bleiben **feldweise** aufgebaut (Mauerstück je Feld, Dach als eigenes Bild), damit Betreten, abnehmbares Dach und Durchsicht wie heute funktionieren. Die Bilder werden in `index.html` eingebettet (das Spiel bleibt eine Einzeldatei, siehe Grauufer_Grafik_RevXX.md, offene Punkte).
4. **Obere Ebenen:** wie die Treppen zur Tiefe (seit Spiel-Rev 105): Jedes Obergeschoss und der Dachboden liegen als eigener kleiner Bereich auf der Karte, die Treppe führt dorthin und zurück.
5. **Erster Einsatz:** Pilot A „Startgebiet Grauufer“ (Fahrplan in Grauufer_Grafik_RevXX.md), auf dem Tablet gemessen.
