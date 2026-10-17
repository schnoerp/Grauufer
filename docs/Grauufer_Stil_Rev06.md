# Grauufer – Stil

**Revision 06**, Stand: Spiel-Rev 90. **Im Spiel** = in der aktuellen Spielversion umgesetzt (aus dem Code übernommen). **Geplant** = noch nicht im Spiel.

## 1. Leitbild (Im Spiel)

- Vorbild: *Ultima VIII: Pagan*. Düster, karg, atmosphärisch.
- Alle Grafiken und Töne sind **selbst erzeugt** (Canvas und Web Audio). Keine Fremdgrafiken, keine Tondateien.
- Verfasser: **schnoerp-media**, steht auf der Titelseite.

## 2. Grafik (Im Spiel)

| Vorgabe | Wert |
|---|---|
| Ansicht | isometrisch, Feld 32 × 16 Bildpunkte |
| Interne Auflösung der Figuren | fünffach (scharf auch beim Zoomen) |
| Kanten | glatt, weiche Übergänge zwischen Geländearten |
| Kapuzen (seit Rev 32) | weicher, nach hinten fallender Kragen mit Falten und Überwurf auf den Schultern, offene Gesichtsöffnung mit Schatten von oben, leuchtende Augen bleiben sichtbar; gilt für alle Kapuzenträger und die Spielfigur |
| Bodendetails (seit Rev 31) | Grashalme und Blüten, Kiesel, Risse, Schlammpfützen mit Schilf, Sandrippel, Schneeglitzer, Glut in der Asche, Moos zwischen Pflastersteinen, Kristalle in Höhlen, Eisschlieren, Holzmaserung; einmal pro Kachel vorgezeichnet, daher ohne Leistungskosten beim Spielen |
| Leuchtende Dinge | Glutklinge, Sturmzepter, Splitter, aktive Wegsteine, Kristalle, Augen der Gegner |
| Licht | immer Tag (seit Spiel-Rev 41 kein Tag-Nacht-Wechsel); Höhlen und dunkle Zonen dunkel |

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
| Dünne Hauswände | 63 | Wandscheiben (¼ Kachel) mit Eckpfosten statt Vollblöcken; Stadtmauern bleiben massiv |

### Weitere Grafik (Im Spiel seit Spiel-Rev 64–90)
- Vulkan mit Rauch und Lavasee, Portale mit wirbelndem Licht, animiertes Meer (Wellenkämme, Brandung, seit Spiel-Rev 80), Schiffswrack (Rev 83), Truhen offen/zu, Mimik, Lesepulte, Runentafeln, Felsbrocken, Gittertore, Runentore, Vogelnester.
- Fenster im Stil „Pergament auf Holzrollen“ mit prozeduraler Pergament-Textur, rotes Wachssiegel zum Schließen (seit Spiel-Rev 87).
- Schrift „Pixelify Sans“ eingebettet (SIL Open Font License 1.1, seit Spiel-Rev 78).

## 3. Klang (Im Spiel)

| Art | Beschreibung |
|---|---|
| Jingle | beim Spielstart mit dem Titel |
| Kulissen | grau, Nebel, Glut, Schnee, Staub, Höhle; je nach Gebiet |
| Effekte | Schritt, Treffer, Fehlschlag, Blitz, Feuer, Wind, Stein, Heilen, Münzen, Aufheben, Tür, Stufenaufstieg, Tod |

## 4. Texte (Im Spiel)

- Alle Texte auf Deutsch.
- Ton: düster, knapp, viel Andeutung, wenig Pathos.
- Keine Gedankenstriche in Dialogen, stattdessen Kommas oder Punkte.
- Anrede je nach Geschlecht der Figur („Fremder“ / „Fremde“).

## 5. Leistung (Im Spiel)

- Ziel 60 Bilder pro Sekunde auf dem Android-Tablet.
- Boden wird im Hintergrund vorgezeichnet, Spielstand gedrosselt gespeichert.
- Grafikstufen senken die Auflösung bei Bedarf.

### Grafikspeicher (Im Spiel seit Spiel-Rev 53)
- Nur Spielfläche und zwei Bodenpuffer liegen auf der Grafikkarte, alle Texturen und Sprites im Hauptspeicher.
- Bei Verlust: Notboden (¼-Auflösung), verteilter Neubau, danach stufenweise weniger Auflösung (100 → 80 → 65 → 50 %), zuletzt Notbetrieb. Veralteter Notbetrieb aus Rev 51/52 wird einmalig zurückgesetzt (Rev 70).

## 6. Geplanter Ausbau

- Farbpalette als feste Liste in `data/palette.ts`, damit beide Entwickler dieselben Töne nutzen.
- Jede neue Figur: Grundform, Hauptfarbe, Zweitfarbe, Augenfarbe, Besonderheiten (Risse, Seetang, Rippen, Kapuze).
- Effekte für neue Waffen und Zauber laut Waffenliste (Wasserwürfel, Erdrisse, Netz, Giftwolke).
- Musik: leise, langsame Grundtöne je Gebiet, ebenfalls mit Web Audio erzeugt.
- Neue Grafiken immer auf dem Tablet auf Ruckeln prüfen, bevor sie übernommen werden.
