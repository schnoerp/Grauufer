# Grauufer – Stil

**Revision 27**, Stand: Spiel-Rev 125. **Im Spiel** = in der aktuellen Spielversion umgesetzt (aus dem Code übernommen). **Geplant** = noch nicht im Spiel.

## 1. Leitbild (Im Spiel)

- Vorbild: *Ultima VIII: Pagan*. Düster, karg, atmosphärisch.
- Alle Grafiken und Töne sind **selbst erzeugt** (Canvas und Web Audio). Keine Fremdgrafiken, keine Tondateien.
- Verfasser: **schnoerp-media**, steht auf der Titelseite.

### Startbild und Logo (Im Spiel seit Spiel-Rev 104, neue Vorlagen seit Spiel-Rev 113 und 121)

- **Motiv:** ein „G“ aus verwittertem grauem Stein mit eingemeißelten Runen, Rissen und Efeu; in seiner Mitte hängt das zerbrochene Amulett: goldenes Kreuz auf dunkelblauem Grund (Wappen der Siegelwächter) mit Goldrand, von einem schwarzen Zickzack-Riss durchzogen. Darunter der Schriftzug „Grauufer“ in rissigen Steinbuchstaben mit Goldschein, alles vor dunklem Grund.
- **Herkunft (seit Spiel-Rev 121):** Vorlage vom Auftraggeber mit Gemini erstellt (`werkstatt/logo/startbild_vorlage.jpg`, 2734 × 1452 Pixel, aus seinem Bildschirmfoto ohne Bedienleiste zugeschnitten); ausdrückliche Ausnahme von der Regel „Alle Grafiken aus eigenem Code“ (CLAUDE.md, Abschnitt 2). Vorher: Spiel-Rev 104–111 SVG im Code (48 × 48 Pixel), Spiel-Rev 112 3D-Modell aus der Werkstatt, Spiel-Rev 113–120 Logo nach einer selbst erstellten Vorlage des Auftraggebers (216 × 216 Pixel, gerastert).
- **Umsetzung:** `npm run logo` (`werkstatt/logo.js`) schneidet Logo und Schriftzug aus, übermalt die eingebrannte Versionsnummer mit Hintergrund, lässt die Ränder weich in die Hintergrundfarbe auslaufen (#0d1010) und bettet das Bild als JPEG ein (**1800 × 994 Pixel**, etwa 208 KB). **Kein Pixel-Raster** – erster Schritt weg vom Pixel-Look (siehe Grauufer_Grafik_RevXX.md).
- **Titelbild:** das Bild füllt höchstens 96 % der Breite (höchstens 1300 Punkte) und lässt unten Platz für drei Textzeilen. Die **Versionsnummer** „1.0.NNN“ steht als echter Text rechts neben dem Schriftzug (aus dem `<title>` übernommen), darunter „Ein Rollenspiel in der Welt Vharos“, „ein Spiel von schnoerp-media ©“ und „Lade Welt …“ bzw. „Tippe, um zu beginnen“ in einer Serifenschrift des Geräts (Palatino, Georgia oder Noto Serif). Das Symbol im Browser-Reiter bleibt das Wappen der Siegelwächter.

### Bäume (Im Spiel seit Spiel-Rev 99)

Bisher gab es je Gebiet eine Baumart in 4 fast gleich hohen Spielarten. Jetzt gibt es je Gebiet 8 Spielarten aus Baumart und Größe. Welche auf einem Feld steht, ist fest nach dem Feld bestimmt, also in jedem Spiel gleich. Kleine Bäume haben eine kleinere Leinwand und kosten pro Bild weniger Fläche.

| Gebiet | Baumarten (Größe als Faktor der bisherigen Baumhöhe) |
|---|---|
| Wildnis, Grauufer, Sonnwacht, Brachfeld und übrige grüne Gebiete | Laubbaum (1,0 und 0,86), breite Eiche (1,22), Tanne (1,32 und 1,12), Birke mit weißem Stamm (1,05 und 0,92), junger Baum (0,66) |
| Nebelwald | dunkle Tannen (0,72–1,12), dunkle Eichen (1,25–1,38), dunkle Laubbäume (0,8–1,05) |
| Tränensee | kahle Bäume, Trauerbäume mit hängenden Zweigen, Tannen |
| Fahlmoor, Miras Kate | kahle Bäume, Birken, Tannen |
| Frostmark, Frosthain, Gefrorener See | verschneite Tannen (0,72–1,38), vereinzelt kahle Bäume |
| Sengende Ödnis, Sandhafen, Tempel | Palmen mit 8 bis 10 Stammringen, vereinzelt kahle Bäume |
| Sturmspitze | kahle Bäume in allen Größen |

Bildzeit (Waldgebiete Wildnis, Nebelwald, Frostmark, Fahlmoor, CPU 4-fach gedrosselt, je zwei Läufe): Summe 83,7 ms vorher, 85,4 ms nachher, also im Messrauschen.

### Figurengrößen in Bildpunkten

| Grundform | Breite × Höhe | Beispiele |
|---|---|---|
| Mensch | 34 × 40 | Spieler, Bewohner, Ghul, Skelett, Bandit |
| Golem | 46 × 48 | Gruftwächter, Kristallwächter, Eisgolem |
| Hund | 46 × 32 | Wolf, Frostwolf, Aschenhund |
| Harpyie | 48 × 44 | Harpyie, Sturmherr (schwebt und flattert) |
| Spinne | 52 × 32 | Riesenspinne, Spinnenkönigin |
| Skorpion | 54 × 34 | Sandskorpion |

Endgegner werden 1,2- bis 1,6-fach vergrößert.

**Seit Spiel-Rev 110** werden alle Figuren (Spielfigur, Gesprächspartner, Gegner) auf **75 %** dieser Maße verkleinert (`FIGF` in `index.html`), damit sie zu den Häusern aus der Grafik-Werkstatt passen: etwa 2,2 m bei einem Feld = 2,1 m, knapp über Türhöhe (2,4 m). Verkleinert wird einmal beim Anlegen des Bildes vor dem Rastern; der Pixel-Look bleibt gleich fein, die Bildzeit unverändert. Namen über den Figuren sitzen entsprechend tiefer; die Tippfläche zum Ansprechen und Angreifen bleibt so groß wie vorher.

### Feste Spielfiguren im Ziel-Stil A (Im Spiel seit Spiel-Rev 125)

- Entscheidung des Auftraggebers (Spiel-Rev 124): statt eines Avatar-Baukastens **feste Figuren** – Krieger, Magier, Waldläufer, je als Mann und Frau.
- **Im Spiel:** **Magier, Krieger und Waldläufer (je die Männerfigur; Frauen nutzen sie vorerst mit)**. Vorgerendert in der Grafik-Werkstatt (`npm run figuren`, `werkstatt/figuren.js`, Modell `werkstatt/modelle/figur.js`) in **8 Blickrichtungen**, glatt ohne Pixel-Raster, 120 Bildpunkte je Meter (doppelte Spielauflösung, gezeichnet mit 60 Einheiten je Meter), als WebP eingebettet (alle drei zusammen etwa 160 KB). Licht der Werkstatt: Stimmung „nacht“ (warmes Hauptlicht von oben links, kalte Lichtkante, Faltenschatten).
- **Blickrichtung:** folgt der letzten Bewegung (`dir8` aus dem Schritt, 0 = zur Kamera); die bisherigen Figuren werden weiter nur gespiegelt.
- **Leuchten:** Stein am Stab und Kugel über der linken Hand flackern blau – das Spiel zeichnet in jedem Bild einen radialen, additiven Lichtschein (Radius etwa 13 Einheiten) mit unregelmäßigem Flackern darüber.
- **Bewegung:** beim Laufen leichtes Auf und Ab (die Robe verdeckt die Beine), beim Angriff der bisherige Ausfallschritt, bei Treffern ein heller Blitz.
- **Bildzeit** (1250 × 650, je 200 Bilder): 18,6 ms mit der bisherigen Figur (Krieger), 17,7 ms mit dem Magier – im Messrauschen.
- **Krieger:** Kettenhemd mit Kettenkragen, blauer Wappenrock mit goldenem Kreuz (Wappen der Siegelwächter), Schulterplatten, Beinschienen, Lederarmschienen, Schwert in der rechten Hand, Tropfenschild mit Goldkreuz am linken Arm, kurzes Haar.
- **Waldläufer:** grüner Kapuzenumhang (vorn offen, mit Faltenschatten), Hemd und geschnürtes Lederwams, Armschienen, Gürtel mit Tasche und Messer, Köcher mit Pfeilen auf dem Rücken, Langbogen in der linken Hand, Bart.
- **Gegner Skelettkrieger** (seit Spiel-Rev 125, Zielbild des Auftraggebers): Knochenkörper, Lederschulterstücke, Brustriemen, Gürtel mit Rundschnalle, zerrissener roter Lendenschurz, Stiefel, Schwert, runder Holzschild; Einzelheiten in Grauufer_Gegner_RevXX.md. Gegner neben der Spielfigur schauen sie an.
- **Bewegungsbilder** (bisher Skelettkrieger): Laufen 8 Bilder (90 ms je Bild) und Angriff 6 Bilder (450 ms ab dem Ausfallschritt) je Richtung, gerendert in 70 % der Auflösung (WebP), das Spiel gleicht den Maßstab aus. Figuren ohne Gelenkgerüst wippen beim Laufen nur auf und ab.
- Alle Figuren zusammen etwa 692 KB (davon Skelettkrieger mit Bewegungen etwa 470 KB).
- **Geplant:** die drei Frauenfiguren im selben Stil (zurückgestellt, Entscheidung des Auftraggebers Spiel-Rev 125); weitere Gegner; Lauf- und Angriffsbilder für Krieger, Magier und Waldläufer (Gelenkgerüst wie beim Skelettkrieger).

### Farbwelt je Gebiet

| Gebiet | Stimmung | Material |
|---|---|---|
| Grauufer, Sonnwacht, Wildnis | grau, kühl | Backstein, Stein |
| Tränensee, Fahlmoor, Nebelwald | neblig, grünlich | Stein, Sumpf |
| Glutschlund | Glut, Rot und Schwarz | Basalt, Asche |
| Sturmspitze, Frostmark | Schnee, Weiß und Blau | Ruinen, Fels |
| Sengende Ödnis | Staub, Ocker | Stein, Sand |
| Höhlen | dunkel, violett | Gebirgsfels |

### Grafik-Stufenplan „wie Ultima 8 Pagan“ (Im Spiel, Spiel-Rev 58–63)

| Stufe | Spiel-Rev | Umsetzung |
|---|---|---|
| Mauern und Gebäude | 58 | Pixelmauerwerk mit unregelmäßigem Steinverband, Licht oben links, Moos, Risse; tiefe Türen und Fenster; höhere Mauern |
| Pixel-Look | 59 | alle Texturen und Sprites gerastert, 16 Stufen je Farbkanal, geordnetes Bayer-Dithering, keine Glättung, ganzzahlige Zoomstufen |
| Figuren | 60 | schlanker, längere Beine, kleinerer Kopf (ca. 6 Köpfe hoch), harte Farbstufen statt Verläufe |
| Ausstattung | 61 | Möbel innen, Stadtdeko außen |
| Licht | 62 | Schlagschatten von Mauern und Bäumen nach rechts unten, Figurenschatten, Lichtkarte mit Lampen in Höhlen und dunklen Orten |
| Schatten und Stimmung | 96 | siehe Abschnitt „Schatten und Farbstimmung“ unten |
| Dünne Hauswände | 63 | Wandscheiben (¼ Kachel) mit Eckpfosten statt Vollblöcken; Stadtmauern bleiben massiv – Ausnahme seit Spiel-Rev 115: die Stadtmauer von Sonnwacht ist eine schlanke Mauer (gut ½ Kachel, etwa 1 m dick, Höhe unverändert), passend zu den Häusern aus der Werkstatt; Türme und Tor bleiben massiv |

### Feine Bodenzeichnung (Im Spiel seit Spiel-Rev 98)

- Übergänge zwischen natürlichen Böden (Wasser, Eis, Schlamm, Düne, Sand, Erde, Wiese, Fels, Schnee, Asche) folgten bisher den Feldkanten. An Stufen, etwa an der Küste, entstanden eckige Treppen.
- Jetzt wird an jeder inneren Ecke einer Stufe, also dort, wo zwei gleiche, höherrangige Nachbarn an einer Ecke zusammenstoßen und die Diagonale nicht zum eigenen Boden gehört, ein rundes Eckstück (Radius 0,7 Feld, leicht gewellt) eingesetzt. Aus der Treppe wird so eine schräge, natürlich wirkende Kante in Viertelfeld-Feinheit.
- Pflaster, Schiefer, Dielen und Höhlenboden bleiben kantig, damit Gebäude und Wege gerade wirken.
- Die Spiellogik bleibt beim bisherigen Raster (680 × 248 Felder); nur die Zeichnung ist feiner.
- Leistung: Die Eckstücke werden beim Aufbau des Bodenpuffers einmal mitgezeichnet und liegen in einem begrenzten Vorrat im Hauptspeicher (höchstens 500). Pro Bild entstehen keine Kosten. Messung der Bodenmischung über 11 500 Küstenfelder: 56 ms vorher, 59 ms nachher.

### Schatten und Farbstimmung (Im Spiel seit Spiel-Rev 96)

| Element | Umsetzung | Werte |
|---|---|---|
| Bodenschatten von Mauern, Türmen, Toren und Bäumen | beim Aufbau des Bodenpuffers einmal mitgezeichnet, kostet pro Bild nichts | Deckkraft direkt neben Turm 0,62 (vorher 0,5), neben Mauer 0,54 (0,42), zwei Felder entfernt 0,34/0,24 (0,24/0,16), schräg 0,18 (0,12), Baum 0,28 (0,16); an dünnen Hauswänden × 0,55 |
| Figurenschatten | schräger Schattenriss nach rechts unten | Stärke 0,5 bei Tag (vorher 0,38); in Höhlen, dunklen Orten und Innenräumen keiner |
| Schatten der Ausstattung | Fässer, Kisten, Säcke, Bänke, Laternen, Möbel, Truhen, Felsbrocken, Tore, Tafeln werfen denselben schrägen Schatten; Schattenriss je Sprite einmal im Hauptspeicher angelegt, pro Bild ein Zeichenaufruf | draußen 1,2 × Figurenschatten (0,6), in Innenräumen 0,25, in Höhlen und dunklen Orten keiner; flache Dinge (Teppich, Wrackteil, Vogelnest) ohne Schatten |
| Farbstimmung je Gebiet | dünne Farbschicht über dem ganzen Bild, beim Gebietswechsel weich überblendet (ca. 1 s) | Grau (Grauufer, Sonnwacht, Wildnis): kühles Blaugrau, 8 %; Nebel (Tränensee, Fahlmoor, Nebelwald, Miras Kate): Grün, 11 %; Glut (Glutschlund): Rot, 10 %; Schnee (Sturmspitze, Frostmark): Eisblau, 7 %; Staub (Sandhafen, Ödnis, Tempel): Ocker, 8 %; Höhle (Grotte, Kristallhöhle): Violett, 12 %; Innenraum: warmes Braun, 6 % |

Bildzeit (Messung mit Playwright, 1250 × 650, CPU 4-fach gedrosselt, Mittel aus 6 Orten): Rev 95 24,8 ms, Rev 96 24,8 ms, also keine messbare Mehrlast. Es werden keine neuen Grafikkarten-Leinwände angelegt.

### Flüsse, Berge und Brücken (Im Spiel seit Spiel-Rev 116/117)

- **Flüsse** liegen seit Spiel-Rev 117 auf Bodenhöhe, ohne Höhensprung: nasses Ufer, Wasser in der mittleren Farbe der Seen mit Lichtreflexen, Grashalme an den Kanten. Jedes Flussende mündet in einen kleinen See (etwa 7 × 5 Felder), damit kein Fluss aus der Erde kommt. Bis Spiel-Rev 116 waren es abgesenkte Täler mit Felswänden.
- **Berge** fallen zum Ufer hin ab: Abstand zum nächsten Flussfeld 1 Feld → Wiese, 2 Felder → 35 % der Höhe, 3 Felder → 70 %. Vor jedem Brückenende entsteht ein flacher Durchlass (2 Felder flach, dann 40 % und 75 %).
- **Brücken** spannen 3 Felder über den Fluss und haben an beiden Enden einen gemauerten Steinblock auf festem Boden.
- Wege und Fundorte bleiben erreichbar. Die Berge selbst bleiben vorerst Codegrafik; als Felsmassive aus der Werkstatt sind sie mit dem Landschafts-Baukasten geplant (Grauufer_Baukaesten_RevXX.md).

### Vorgerenderte Häuser (Im Spiel seit Spiel-Rev 109)

Die fünf Häuser in Grauufer seit Spiel-Rev 111 die acht Häuser und die Wachhalle in Sonnwacht, seit Spiel-Rev 114 die vier Lehmhäuser in Sandhafen und seit Spiel-Rev 115 die Gruft von Grauufer sind keine Codegrafik mehr, sondern Bilder aus der Grafik-Werkstatt (Stilregeln: Grauufer_Grafik_RevXX.md, Häuser: Grauufer_Baukaesten_RevXX.md). Alle anderen Häuser, Mauern und Bäume bleiben vorerst Codegrafik.

### Weitere Grafik (Im Spiel seit Spiel-Rev 64–90)
- Vulkan mit Rauch und Lavasee, Portale mit wirbelndem Licht, animiertes Meer (Wellenkämme, Brandung, seit Spiel-Rev 80), Schiffswrack (Rev 83), Truhen offen/zu, Mimik, Lesepulte, Runentafeln, Felsbrocken, Gittertore, Runentore, Vogelnester.
- Kugeln für Leben und Mana (seit Spiel-Rev 102): je 36 × 36 Spielpixel, gerastert auf 90 Punkte vergrößert; Eisenring mit acht Nieten, dunkle Glaskugel, kugelförmig schattierte Flüssigkeit (Leben #d83420 auf #5a0c06, Mana #3a8ad0 auf #0a1a48) mit Bayer-Dithering, heller Oberflächenstreifen und Glanzbogen links oben. Neu gezeichnet nur bei Wertänderung.
- Fenster im Stil „Pergament auf Holzrollen“ mit prozeduraler Pergament-Textur, rotes Wachssiegel zum Schließen (seit Spiel-Rev 87).
- Schrift „Pixelify Sans“ eingebettet (SIL Open Font License 1.1, seit Spiel-Rev 78).
- Symbol für Browser-Reiter und Lesezeichen (seit Spiel-Rev 95): Wappen der Siegelwächter als Pixelgrafik 16 × 16, goldenes Kreuz (#f2b13c) auf blauem Schild (#2e4e8a) mit dunklem Riss durch das Kreuz, auf dunkelbraunem Grund (#241610); als SVG direkt in `index.html` eingebettet, keine externe Datei. Die Leistenfarbe des Browsers (theme-color) ist ebenfalls #241610.

## 3. Klang (Im Spiel)

| Art | Beschreibung |
|---|---|
| Jingle | beim Spielstart mit dem Titel |
| Kulissen | grau, Nebel, Glut, Schnee, Staub, Höhle; je nach Gebiet |
| Effekte | Schritt, Treffer, Fehlschlag, Blitz, Feuer, Wind, Stein, Heilen, Münzen, Aufheben, Tür, Stufenaufstieg, Tod |

## 4. Texte (Im Spiel)

- Alle Texte auf Deutsch.
- Ton: düster, knapp, viel Andeutung, wenig Pathos.
- Gedankenstriche in Dialogen sparsam verwenden, lieber Kommas oder Punkte. Im Spiel stehen noch einige Gedankenstriche in Dialogen (z. B. Siegel-Enthüllung, Nhal); sie sind geduldet.
- Anrede je nach Geschlecht der Figur („Fremder“ / „Fremde“).

## 5. Leistung (Im Spiel)

- Ziel 60 Bilder pro Sekunde auf dem Android-Tablet.
- Boden wird im Hintergrund vorgezeichnet, Spielstand gedrosselt gespeichert.
- Die Suche nach Möbeln, Truhen, Nischen und anderer Ausstattung (`buildDeco`) läuft schon während des Titelbilds, damit der erste Schritt im Spiel nicht hakt (seit Spiel-Rev 92).
- Bildqualität fest auf „Automatisch“ (seit Spiel-Rev 100): volle Auflösung; liegt die Bildzeit im Mittel über 30 ms, senkt das Spiel die Auflösung stufenweise auf 80 % und 65 %. Bis Spiel-Rev 99 gab es dafür den Knopf „Grafik“ mit Hoch, Mittel, Niedrig und Automatisch.

### Grafikspeicher (Im Spiel seit Spiel-Rev 53)
- **Notgrund (seit Spiel-Rev 108):** Solange der Bodenpuffer das Bild nicht ganz bedeckt (beim Laufen, Zoomen oder kurz nach Treppen und Portalen, besonders auf großen Bildschirmen in voller Auflösung), wird darunter ein grober Kartenboden gezeichnet: ein Feld = ein Bildpunkt in der Geländefarbe (Meer #22344c, Wald #24361e, Fels #4a4648, Wüste und Sand #8e7a52, Wiese #3e4a26 usw.), mit einer einzigen schrägen Abbildung auf die Rauten gelegt. Die Leinwand (680 × 316) liegt im Hauptspeicher und wird einmal angelegt; gezeichnet wird sie nur, solange eine Lücke besteht. Vorher blieben solche Lücken schwarz.
- **Schneller nachbauen (seit Spiel-Rev 108):** Deckt der alte Bodenpuffer das Bild nicht ganz, bekommt der Neubau 14 ms pro Bild statt 6 ms.
- Nur Spielfläche und zwei Bodenpuffer liegen auf der Grafikkarte, alle Texturen und Sprites im Hauptspeicher.
- Bei Verlust: Notboden (¼-Auflösung), verteilter Neubau, danach stufenweise weniger Auflösung (100 → 80 → 65 → 50 %), zuletzt Notbetrieb. Veralteter Notbetrieb aus Rev 51/52 wird einmalig zurückgesetzt (Rev 70). Seit Spiel-Rev 100 gelten diese Notstufen nur bis zum nächsten Start des Spiels und werden dann zurückgesetzt.

## 6. Geplanter Ausbau

- Farbpalette als feste Liste in `data/palette.ts`, damit beide Entwickler dieselben Töne nutzen.
- Jede neue Figur: Grundform, Hauptfarbe, Zweitfarbe, Augenfarbe, Besonderheiten (Risse, Seetang, Rippen, Kapuze).
- Effekte für neue Waffen und Zauber laut Waffenliste (Wasserwürfel, Erdrisse, Netz, Giftwolke).
- Musik: leise, langsame Grundtöne je Gebiet, ebenfalls mit Web Audio erzeugt.
- Neue Grafiken immer auf dem Tablet auf Ruckeln prüfen, bevor sie übernommen werden.
- **Vorgerenderte 3D-Grafik** für Figuren, Häuser, Einrichtung und Gegenstände aus der Grafik-Werkstatt (`werkstatt/`), gebrauchter, verwitterter Look; Boden, Wasser und Lava bleiben Codegrafik. Stilregeln und Fahrplan: Grauufer_Grafik_RevXX.md.
