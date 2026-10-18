# Grauufer – Baukästen

**Revision 4**, Stand: Spiel-Rev 114. **Im Spiel** = in der aktuellen Spielversion umgesetzt (aus dem Code übernommen). **Geplant** = noch nicht im Spiel.

Dieses Dokument beschreibt die Baukästen, mit denen der Auftraggeber und der zweite Entwickler Teile der Spielwelt selbst zusammenstellen. Die Baukästen gehören zur Grafik-Werkstatt; Technik, Stilregeln und Kamera stehen in Grauufer_Grafik_RevXX.md.

## 1. Überblick

| Baukasten | Stand | Inhalt |
|---|---|---|
| Haus-Baukasten | vorhanden in der Werkstatt; im Spiel: fünf Häuser in Grauufer (seit Spiel-Rev 109) und neun in Sonnwacht (seit Spiel-Rev 111), Abschnitt 6 | einzelne Häuser vom Schuppen bis zur Residenz: Grundriss, Wände, Dach, Geschosse, Fenster und Türen, Einrichtung (Abschnitt 2) |
| Anlagen-Baukasten | Geplant | Burg und Schloss als Anlagen aus mehreren Teilen (Abschnitt 3) |
| Figuren-Baukasten | Geplant | Gesprächspartner, Gegner und Spielerfiguren aus gemeinsamen Körperbau-Familien (Abschnitt 4) |
| Landschafts-Baukasten | Geplant | Teil A: Bäume, Felsen, Ufer, Klippen, Höhlen als Bausteine; Teil B (optional, später): Gebiete auf dem Raster entwerfen (Abschnitt 5) |

| Teil | Datei |
|---|---|
| Bedienseite | `werkstatt/baukasten.html` |
| Hausbau (Modelle, Vorlagen, Einrichtung) | `werkstatt/modelle/hausbau.js` |
| Claude-Seite erzeugen | `werkstatt/artefakt.js` (bettet three.js und Hausbau in die Bedienseite ein) |
| gebaute Häuser | `werkstatt/haeuser/*.json` |
| Häuser im Spiel | `werkstatt/spielhaeuser/*.json`, eingebettet mit `npm run haeuser` (`werkstatt/spielhaeuser.js`) |
| Tests | `tests/grauufer.spec.js` (Abschnitt „Werkstatt“) |

## 2. Haus-Baukasten (vorhanden; erste Häuser im Spiel seit Spiel-Rev 109)

**Aufruf, zwei Wege:**
- **Claude-Seite „Grauufer Haus-Baukasten“** im Claude-Konto des Auftraggebers (empfohlen): gespeicherte Häuser liegen im Speicher der Seite (Sammlung `haeuser`, ein Dokument je Haus mit `name`, `spec`, `geaendert`); Claude liest sie dort direkt aus, legt sie unter `werkstatt/haeuser/` ab und baut sie ins Spiel ein. Der Auftraggeber muss keine Dateien ablegen. Die Seite wird mit `node werkstatt/artefakt.js <Zieldatei>` aus `baukasten.html` erzeugt (three.js und Hausbau eingebettet).
- **`werkstatt/baukasten.html`** über GitHub Pages unter `https://schnoerp.github.io/Grauufer/werkstatt/baukasten.html` (wie das Spiel) oder lokal: „Speichern“ legt nur im Browser ab. **„Über GitHub an Claudia senden“** öffnet auf GitHub ein vorausgefülltes Issue „Haus: <Name>“ mit der Beschreibung als JSON; nach „Submit“ liest Claude es aus, legt das Haus unter `werkstatt/haeuser/` ab, baut es ein und schließt das Issue. Voraussetzung: beim Absenden bei GitHub angemeldet (beide Entwickler haben Zugriff aufs Repo).

Beide Wege sind für Tablet (1280 × 800), Rechner und Handy ausgelegt.

| Bereich | Bedienung |
|---|---|
| Haustyp | Vorlagen nach Größe und Aufwand: **Schuppen** (2×2–3×3, Holz, Pultdach, Tor, Werkbank), **Cottage** (3×3–5×4, Bruchstein, Reet-Walmdach, Dachboden), **Bauernhaus** (5×4–8×5, Wohnteil und Stall mit Tor, Futterkrippen und Heu, Heuboden), **Wohnhaus** (3×3–5×5, schmal und hoch, 3 Geschosse, unten Laden mit Theke), **Landhaus** (6×5–9×7, 2 Geschosse, Walmdach mit Gauben), **Residenz** (7×6–9×9, Stein, Portal, regelmäßige Fensterreihen, 2 Geschosse und Dachboden). „Vorlage laden“ setzt Größe, Bauart, Öffnungen und Einrichtung; danach ist alles frei änderbar. Burg und Schloss folgen später als eigener Anlagen-Baukasten |
| Haus | Breite und Tiefe 2–12 Felder (bis Spiel-Rev 110: 2–9); Wände: Fachwerk auf Bruchstein, Bruchstein, Holzbohlen, Lehm (seit Spiel-Rev 114: sandfarbener Lehmputz mit Rissen und abgeplatzten Stellen, ohne Steinsockel); Dachdeckung: Schiefer, Holzschindeln, Reet; Dachform: Satteldach (mit Giebeln), Walmdach (rundum geneigt) Pultdach (eine Schräge, vorn tief, hinten hoch; ohne Dachboden) oder Flachdach (seit Spiel-Rev 114: Lehmdecke mit Brüstung, hervorstehenden Balkenköpfen und Wasserspeiern; ohne Dachboden und Gauben), Reet standardmäßig als Walmdach; Gauben auf der vorderen Dachfläche (nicht beim Pult- und Flachdach); First entlang der Breite oder der Tiefe; Verwitterung in 5 Stufen (neu, gepflegt, gebraucht, verwittert, verfallen); Schornstein ein/aus (steht über dem Kamin, falls einer gesetzt ist) |
| Geschosse und Dachboden | 1, 2 oder 3 Geschosse, dazu auf Wunsch ein **begehbarer Dachboden**; bei mehreren Ebenen Umschalter über dem Grundriss (Erdgeschoss, 1. Obergeschoss, 2. Obergeschoss, Dachboden): Fenster, Türen und Einrichtung werden je Ebene gesetzt. Teil **„Treppe (nach oben)“** auf jeder Ebene außer der obersten, steigt in einem Feld auf 3 m und erzeugt darüber an derselben Stelle ein Treppenloch mit Geländer (dort nichts stellbar). Eine Tür im Obergeschoss bekommt einen kleinen Austritt mit Brüstung. Der Dachboden hat keine Fenster- und Türwerkzeuge; innen zeigt er Boden, Kniestock, Giebelwand mit Fenster (Satteldach) und den offenen Dachstuhl mit Firstpfosten – die Dachschrägen selbst stehen in der Spielansicht fast in Blickrichtung und werden deshalb weggelassen. Außen bekommt ein Satteldach mit Dachboden je ein Giebelfenster. „Innen“ zeigt die gewählte Ebene |
| Grundriss | von oben, oben = hinten, unten = vorn (zur Kamera); ein Feldrand um das Haus für Dinge im Freien (nur Erdgeschoss) |
| Fenster und Türen | sieben eigene Werkzeuge: Fenster, Tür, Fenster kaputt, Fenster vernagelt, **Tor** (zwei Flügel, 1,9 m breit), **Portal** (Doppeltür mit Steinrahmen, Bogen und Stufen), **Luke** (kleiner Holzladen); auf eine Wand tippen setzt die Öffnung, nochmal tippen macht wieder Wand daraus. Im Grundriss: Fenster als hellblaue Doppellinie (kaputt mit schwarzem Kreuz, vernagelt mit Brettern), Tür als Lücke mit Türblatt und Schwenkbogen ins Haus; die Knöpfe zeigen dasselbe Zeichen |
| Einrichtung | 22 Teile: Treppe, Futterkrippe, Heu, Werkbank, Ladentheke, Bett, Truhe, Schrank, Bücherregal, Kamin, Wandbrett, Waffen an der Wand, Tisch mit Bänken, Fässer, Kiste, Säcke, Hocker, Teppich, Kessel, Stuhl (umgekippt), Besen, Brennholz; Wandteile drehen sich beim Setzen zur nächsten Wand. **Je Feld ein Möbelstück**; Teppich, Kessel, Wandbrett und Waffen an der Wand dürfen als Zusatzteil dazukommen (höchstens eines). Ein zweites Möbelstück ersetzt das erste, erneutes Tippen mit derselben Sorte dreht das Teil. „Drehen“ dreht das zuletzt gesetzte Teil, „Entfernen“ leert das ganze Feld. Ältere gespeicherte Häuser mit mehreren Teilen je Feld werden beim Laden bereinigt |
| Vorschau | Spielsicht (45°/30°), Außen- oder Innenansicht, in 90°-Schritten drehbar |
| Speichern | „Speichern“ legt das Haus unter seinem Namen ab (Claude-Seite: im gemeinsamen Speicher, sonst im Browser), Liste „Gespeicherte Häuser“ zum Öffnen; „Löschen“ fragt durch zweites Tippen nach; „Herunterladen“ (nur Browser-Weg) erzeugt eine JSON-Datei, „Datei laden“ öffnet eine solche Datei |

**Verwitterung je Stufe:** mehr Schmutz, Laufspuren, abgeplatzter Putz, Risse und Moos auf den Oberflächen; durchhängendes Dach und schiefe Holzteile; ab „gebraucht“ Spinnweben, ab „verwittert“ Putzbrocken, geflicktes Dach und schief hängende Fensterläden; mehr Stroh innen und Unkraut außen.

**Dächer:** gekrümmte, leicht durchhängende Flächen mit sichtbarer Dicke an der Traufe. Reet: etwa 45° steil, 0,34 m dick, weich gewölbt, mit Firstwulst und Graten, Halme quer zur Traufe; Schiefer und Schindeln: etwa 32° steil, Holzkante an der Traufe und an den Ortgängen, ab „verwittert“ mit Brettern geflickt.

**Beschreibung eines Hauses (JSON):** `name`, `breite`, `tiefe`, `wand`, `dach`, `dachform` (sattel/walm/pult/flach, optional), `wand` auch `lehm`, `gauben` (true/false, optional), `typ` (Haustyp der geladenen Vorlage, optional), `first`, `verwitterung` (0–1), `schornstein`, `oeffnungen` (Liste aus `seite` = hinten/vorn/links/rechts, `feld`, `art`), `einrichtung` (Liste aus `art`, `x`, `z`, `dreh` 0–3; 0 = Rückseite zur hinteren Wand), `geschosse` (1–3, optional), `dachboden` (true/false, optional) und bei Öffnungen und Einrichtung oberhalb des Erdgeschosses `geschoss` (1, 2 …; der Dachboden hat die Nummer nach dem obersten Geschoss).

**Beispiele:** `werkstatt/haeuser/fischerhaus.json` (Fachwerk, Schiefer-Satteldach), `werkstatt/haeuser/reetkate.json` (Holzbohlen, Reet-Walmdach); Bild aller Haustypen: `werkstatt/vorschau/haustypen.jpg` (`npm run grafik`).

## 3. Anlagen-Baukasten für Burg und Schloss (Geplant)

- **Entscheidung (Gespräch mit dem Auftraggeber, Spiel-Rev 108):** Burg und Schloss werden **nicht** als Haustyp im Haus-Baukasten angelegt, sondern später in einem **eigenen Baukasten**. Reihenfolge: zuerst Haus-Baukasten fertig und Pilot „Startgebiet Grauufer“ (Abschnitt 4), danach der Anlagen-Baukasten.
- Grund: Burg und Schloss sind keine einzelnen Häuser, sondern Anlagen aus mehreren Teilen auf einer größeren Fläche.
- Umfang und Bedienung sind noch nicht festgelegt. Vorschlag zur Abstimmung: Ringmauer mit Wehrgang, Türme, Torhaus, Hof, Bergfried oder Hauptbau; Gebäude im Hof aus dem Haus-Baukasten wiederverwenden.

## 4. Figuren-Baukasten (Geplant)

**Entscheidungen (Gespräch mit dem Auftraggeber, Spiel-Rev 108):**
- Ein eigener Baukasten für Figuren: Gesprächspartner, Gegner und die Spielerfiguren.
- **Reihenfolge:** Haus-Baukasten → Pilot A „Startgebiet Grauufer“ mit den Landschafts-Bausteinen (Abschnitt 5) → Figuren-Baukasten → Pilot B „Die Tiefe“ (dort werden die Gegner gebraucht). Fahrplan in Grauufer_Grafik_RevXX.md.
- **Eigene Spielfigur: fest je Klasse** (3 Figuren mit fester Ausrüstung je Klasse). Keine Auswahl von Gesicht oder Frisur und kein Wechsel des Aussehens mit der Ausrüstung, weil jede Wahlmöglichkeit die vorgerenderten Bilder und die Dateigröße vervielfacht.

**Aufbau (Vorschlag):**
- **Gemeinsames Skelett und gemeinsame Bewegungen** je Körperbau-Familie: Stehen, Laufen, Angriff, Sterben in 8 Blickrichtungen werden einmal gebaut und gelten für alle Figuren der Familie. Grundlage ist der Aufbau des Skelettkriegers (`werkstatt/modelle/skelettkrieger.js`: Gelenke, Arme und Beine als Bausteine, Haltung getrennt davon).
- **Wählbar je Figur:** Körperbau (Größe, Statur, Alter), Kopf (Gesicht, Haare, Bart, Haut), Kleidung und Rüstungsteile, Waffe und Schild, Farben, bei Untoten der Grad des Verfalls.
- **Körperbau-Familien:** menschenähnlich (alle Gesprächspartner, Spielerfiguren, Bandit, Ghul, Moorleiche, Ertrunkener, Skelettkrieger, Ruheloser), Vierbeiner (Wolf, Frostwolf, Aschenhund), Spinnentiere (Riesenspinne, Sandskorpion), Geflügelte (Harpyie). Sonderwesen und Endgegner (z. B. Golem, Glutgeist, Echo, Nhal) werden einzeln gebaut.
- Ergebnis wie beim Haus-Baukasten als Beschreibung (JSON), Abgabe über die Claude-Seite oder GitHub.

## 5. Landschafts-Baukasten (Geplant)

**Entscheidungen (Gespräch mit dem Auftraggeber, Spiel-Rev 108):**
- **Zunächst nur Teil A** (Landschafts-Bausteine), zusammen mit Pilot A „Startgebiet Grauufer“, also vor dem Figuren-Baukasten.
- **Teil B** (Gebietsentwurf) **optional und später**, frühestens vor dem ersten neuen Kontinent.
- Boden, Wasser, Meer und Lava bleiben Codegrafik im Spiel (Bodenpuffer, Notgrund; Grauufer_Grafik_RevXX.md, Abschnitt 1). Der Baukasten liefert nur, was auf und an diesen Flächen steht.

**Ausgangslage im Spiel (aus dem Code):** Die Karte von Morvenn mit der Tiefe (680 × 316 Felder) ist im Code festgelegt; Gebiete, Seen, Gebirge und Wege stehen dort mit Koordinaten, an denen Quests, Wegsteine und Schätze hängen. Bäume zeichnet das Spiel selbst (`treeKind`, `treeHD`, `treeSprite`; eigene Arten für Frost- und Wüstengebiete); Felsen, Höhlen und Gebirge sind Geländearten der Karte (Grauufer_Welt_RevXX.md, Abschnitt 3).

**Teil A – Landschafts-Bausteine (Vorschlag):**
- Bäume nach Art (Laub, Nadel, Frost, Wüste, abgestorben), je Art 10–20 Exemplare, per Code gewachsen.
- Büsche, Schilf, Felsen und Findlinge.
- Klippen und Bergflanken, Ufer- und Küstenkanten.
- Höhleneingänge und Höhlenwände, Brücken.
- Wählbar: Art, Größe, Gebiet (Wiese, Frost, Wüste, Moor), Moos und Verwitterung.
- Gerendert in der Werkstatt wie die Häuser, Abgabe über die Claude-Seite oder GitHub.

**Teil B – Gebietsentwurf (optional, später):** Berge, Seen, Meer, Wald und Wege auf einem Raster malen; Claude baut das Ergebnis in die Karte ein. Nur für neue Gebiete (z. B. weitere Kontinente, Grauufer_Welt_RevXX.md, Abschnitt 7); Morvenn wird nicht neu gemalt, weil Quests und Koordinaten daran hängen.

## 6. Weg ins Spiel

**Im Spiel seit Spiel-Rev 109 (Pilot in Grauufer):** fünf Häuser, Vorschlag von Claude, Beschreibungen in `werkstatt/spielhaeuser/`:

| Haus | Datei | Bauart | Feld (linke obere Ecke) |
|---|---|---|---|
| Mareths Haus (Dorfälteste) | `mareth.json` | Fachwerk, Schiefer-Satteldach, gepflegt; Kamin, Regal, Bett, Truhe, Tisch, Schrank | 85,220 |
| Oswins Hütte (Totengräber, verschanzt) | `oswin.json` | Bruchstein, Schindeldach, verwittert, vernagelte Fenster; Bett, Truhe, Waffen an der Wand | 88,213 |
| Ilsabes Kate (Kräuterkundige) | `ilsabe.json` | Holzbohlen, Reet-Walmdach; Kamin mit Kessel, Regal, Säcke, Wandbrett, Bett | 69,220 |
| Brams Laden (Händler) | `bram.json` | Fachwerk, Schiefer-Satteldach; Ladentheke, Regal, Schrank, Fässer, Kisten | 73,220 |
| Verlassene Kate (neu, leer) | `verlassen.json` | Holzbohlen, Reet-Satteldach, verfallen, kaputte Fenster; umgekippter Stuhl, Brennholz | 89,219 |

**Im Spiel seit Spiel-Rev 111 (Sonnwacht):** acht Stadthäuser und die Wachhalle, gepflegter als in Grauufer (Verwitterung 0,2–0,45), Dateien `sw_*.json`. Die Häuser stehen leer und sind begehbar; Gerold, Lene und Odo bleiben an ihren Plätzen auf dem Marktplatz.

| Haus | Datei | Bauart | Feld (linke obere Ecke) |
|---|---|---|---|
| Haus des Schreibers | `sw_schreiber.json` | Fachwerk, Schiefer-Satteldach, 2 Geschosse; Regale, Kamin, Tisch | 98,180 |
| Lenes Haus | `sw_lene.json` | Bruchstein, Schindeldach; Truhe, Kisten, Fässer, Säcke | 101,180 |
| Kate am Nordwall | `sw_kate.json` | Holzbohlen, Reet-Walmdach; Kamin mit Kessel, Bett, Wandbrett | 119,180 |
| Odos Haus | `sw_odo.json` | Fachwerk, Schiefer-Walmdach, 2 Geschosse; Kessel, Regal, Säcke, Bett | 122,180 |
| Gerolds Haus | `sw_gerold.json` | Bruchstein, Schiefer-Satteldach; Waffen an der Wand, Truhe, Schrank | 98,193 |
| Gästehaus | `sw_gaeste.json` | Fachwerk, Schindeldach, 2 Geschosse; zwei Betten, Tisch | 102,193 |
| Werkstatt | `sw_werkstatt.json` | Holzbohlen, Pultdach, Tor und Luke; zwei Werkbänke, Brennholz | 117,193 |
| Bauernkate | `sw_bauer.json` | Fachwerk, Reet-Satteldach; Kamin, Heu, Säcke | 121,193 |
| Wachhalle | `sw_wachhalle.json` | Bruchstein, Schiefer-Walmdach mit Gauben, 2 Geschosse, Portal; Betten, Waffen, Kamin, Regal, Tisch | 105,180 (11 × 5 Felder) |

**Im Spiel seit Spiel-Rev 114 (Sandhafen):** vier Lehmhäuser mit Flachdach (neue Wandart Lehm und Dachform Flachdach), kleine Luken statt großer Fenster, Dateien `sh_*.json`. Die Häuser stehen leer und sind begehbar; Yasmin bleibt auf dem Platz.

| Haus | Datei | Bauart | Feld (linke obere Ecke) |
|---|---|---|---|
| Hafenmeisterei | `sh_hafenmeister.json` | 2 Geschosse; Regal, Truhe, Waffen an der Wand, Tisch, Teppich | 212,212 |
| Lagerhaus am Hafen | `sh_lager.json` | Tor und Luken; Kisten, Fässer, Säcke | 223,212 |
| Wohnhaus am Markt | `sh_wohnhaus.json` | Teppiche, Bett, Kessel mit Brennholz, Wandbrett | 212,220 |
| Yasmins Haus | `sh_yasmin.json` | 2 Geschosse; Ladentheke, Regale, Fässer, Säcke | 223,220 |

- Die fünf Häuser in Grauufer sind 3 × 3 Felder groß mit der Tür vorn in der Mitte, wie die bisherigen Hütten. Die Bewohner stehen im mittleren Feld, die Einrichtung steht in den Randfeldern, die im Spiel als Wand gelten. Die verlassene Kate ist neu und steht leer.
- Je Haus drei Bilder, gerendert mit `npm run haeuser` im Maßstab des Spiels (ein Feld 160 Einheiten breit, Raster wie im Spiel) und als PNG mit Farbtabelle in `index.html` eingebettet (seit Spiel-Rev 111 verlustfrei mit höchstens 256 Farben je Bild; alle 18 Häuser zusammen etwa 760 KB): **außen** mit Dach, **innen hinten** (Boden, hintere Wände, Einrichtung) und **innen vorn** (die zwei niedrigen Wände zur Kamera).
- Steht die Figur im Haus oder dahinter, zeigt das Spiel die Innenansicht: das hintere Bild vor den Figuren, die niedrigen vorderen Wände danach. Seit Spiel-Rev 111 wird das hintere Bild in senkrechten Streifen je Feldlinie gezeichnet, jeweils beim hintersten Hausfeld; so verdeckt nichts, was hinter dem Haus steht (z. B. die Stadtmauer), die Rückwand. Sonst das Haus von außen mit Dach. Die Bilder werden beim Start einmal im Hauptspeicher entpackt, in der kleinen Rastergröße, und beim Zeichnen ohne Glättung vergrößert; bis dahin zeichnet das Spiel die alte Hütte.

**Weiter geplant:**

1. **Abgeben:** Der Auftraggeber oder der zweite Entwickler speichert ein Haus auf der Claude-Seite oder sendet es über GitHub (Abschnitt 2). Claude legt es unter `werkstatt/spielhaeuser/` ab, bettet es mit `npm run haeuser` ein und setzt es auf die Karte; niemand muss Dateien selbst ablegen.
2. **Größere Häuser:** Häuser über 3 × 3 Felder brauchen auf der Karte mehr begehbare Innenfelder; dafür werden die Wände auf der Karte an den Grundriss angepasst.
3. **Obere Ebenen:** wie die Treppen zur Tiefe (seit Spiel-Rev 105): Jedes Obergeschoss und der Dachboden liegen als eigener kleiner Bereich auf der Karte, die Treppe führt dorthin und zurück.
4. **Weitere Gebiete:** nach Pilot A Gebiet für Gebiet (Fahrplan in Grauufer_Grafik_RevXX.md), jeweils auf dem Tablet gemessen.
