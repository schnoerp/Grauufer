# Grauufer – Stil

**Revision 13**, Stand: Spiel-Rev 102. **Im Spiel** = in der aktuellen Spielversion umgesetzt (aus dem Code übernommen). **Geplant** = noch nicht im Spiel.

## 1. Leitbild (Im Spiel)

- Vorbild: *Ultima VIII: Pagan*. Düster, karg, atmosphärisch.
- Alle Grafiken und Töne sind **selbst erzeugt** (Canvas und Web Audio). Keine Fremdgrafiken, keine Tondateien.
- Verfasser: **schnoerp-media**, steht auf der Titelseite.

## 2. Grafik (Im Spiel)

| Vorgabe | Wert |
|---|---|
| Ansicht | isometrisch, Feld 32 × 16 Bildpunkte |
| Interne Auflösung der Figuren | fünffach (scharf auch beim Zoomen) |
| Kanten | harte Pixelkanten ohne Glättung (seit Spiel-Rev 59, siehe Pixel-Look unten); Übergänge zwischen Geländearten gerastert und gedithert |
| Kapuzen (seit Rev 32) | weicher, nach hinten fallender Kragen mit Falten und Überwurf auf den Schultern, offene Gesichtsöffnung mit Schatten von oben, leuchtende Augen bleiben sichtbar; gilt für alle Kapuzenträger und die Spielfigur |
| Bodendetails (seit Rev 31) | Grashalme und Blüten, Kiesel, Risse, Schlammpfützen mit Schilf, Sandrippel, Schneeglitzer, Glut in der Asche, Moos zwischen Pflastersteinen, Kristalle in Höhlen, Eisschlieren, Holzmaserung; einmal pro Kachel vorgezeichnet, daher ohne Leistungskosten beim Spielen |
| Leuchtende Dinge | Glutklinge, Sturmzepter, Splitter, aktive Wegsteine, Kristalle, Augen der Gegner |
| Licht | immer Tag (seit Spiel-Rev 41 kein Tag-Nacht-Wechsel); Höhlen und dunkle Zonen dunkel; Bildrand draußen leicht abgedunkelt (Randdunkel 0,34, seit Spiel-Rev 96, vorher 0,24) |

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
| Dünne Hauswände | 63 | Wandscheiben (¼ Kachel) mit Eckpfosten statt Vollblöcken; Stadtmauern bleiben massiv |

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
- Nur Spielfläche und zwei Bodenpuffer liegen auf der Grafikkarte, alle Texturen und Sprites im Hauptspeicher.
- Bei Verlust: Notboden (¼-Auflösung), verteilter Neubau, danach stufenweise weniger Auflösung (100 → 80 → 65 → 50 %), zuletzt Notbetrieb. Veralteter Notbetrieb aus Rev 51/52 wird einmalig zurückgesetzt (Rev 70). Seit Spiel-Rev 100 gelten diese Notstufen nur bis zum nächsten Start des Spiels und werden dann zurückgesetzt.

## 6. Geplanter Ausbau

- Farbpalette als feste Liste in `data/palette.ts`, damit beide Entwickler dieselben Töne nutzen.
- Jede neue Figur: Grundform, Hauptfarbe, Zweitfarbe, Augenfarbe, Besonderheiten (Risse, Seetang, Rippen, Kapuze).
- Effekte für neue Waffen und Zauber laut Waffenliste (Wasserwürfel, Erdrisse, Netz, Giftwolke).
- Musik: leise, langsame Grundtöne je Gebiet, ebenfalls mit Web Audio erzeugt.
- Neue Grafiken immer auf dem Tablet auf Ruckeln prüfen, bevor sie übernommen werden.
