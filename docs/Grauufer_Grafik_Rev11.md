# Grauufer – Grafik-Werkstatt

**Revision 11**, Stand: Spiel-Rev 108. **Im Spiel** = in der aktuellen Spielversion umgesetzt (aus dem Code übernommen). **Geplant** = noch nicht im Spiel.

Dieses Dokument beschreibt die neue, vorgerenderte Grafik: Figuren, Häuser, Einrichtung und Gegenstände werden als 3D-Modelle im Code gebaut, mit three.js gerendert und als Bilder ins Spiel übernommen. Die heutige Grafik im Spiel beschreibt Grauufer_Stil_RevXX.md.

## 1. Entscheidungen (Gespräch mit dem Auftraggeber, Spiel-Rev 108)

- **Eigenes Grafikpaket statt fremder Pakete.** Alle Grafiken entstehen aus unserem eigenen Code; fremde Grafiken (z. B. Kenney, OpenGameArt, Kaufpakete) werden nicht verwendet. Grund: einheitlicher Stil, keine Lizenzfragen, öffentliches Repo.
- **Oberwelt und Unterwelt** werden gleichermaßen neu gestaltet, nicht nur die Tiefe.
- **Häuser und Inventar wie in Ultima VIII: Pagan:** Häuser dicht eingerichtet, Rucksack als freie Fläche mit Ziehen und Ablegen.
- **Möbel bleiben fest** (Tisch, Bett, Schrank, Regal), **kleine Dinge sind beweglich** (Becher, Kerze, Buch, Brot, Waffen).
- **Rucksack frei wie in Pagan**, dazu ein Knopf **„Aufräumen“**, der alles ordentlich nebeneinanderlegt.
- **Gebrauchter, verwitterter Look („shabby“)** statt sauberer Flächen; der Grad soll später je Haus einstellbar sein.
- Der **Boden** bleibt Codegrafik im Spiel (Bodenpuffer, Notgrund), wird aber an Licht und Farben der neuen Grafik angepasst. Wasser, Lava und andere bewegte Flächen bleiben ebenfalls Codegrafik.

## 2. Werkstatt (vorhanden im Repo, noch nicht im Spiel)

| Teil | Datei | Inhalt |
|---|---|---|
| Ablauf | `werkstatt/render.js` | startet Chromium (Playwright), rendert alle Modelle, setzt Bögen zusammen, rastert wie im Spiel |
| Skelettkrieger | `werkstatt/modelle/skelettkrieger.js` | Figur aus Grundformen mit Gelenken; Stehen, Laufen (8 Bilder), Angriff (6), Sterben (5), 8 Blickrichtungen |
| Hausbau | `werkstatt/modelle/hausbau.js` | erzeugt Häuser aus einer Beschreibung (JSON): Wandart, Dachdeckung, First, Öffnungen, Einrichtung, Verwitterung; außen mit Dach, innen ohne Dach und mit den zwei Wänden zur Kamera niedrig (1,1 m) |
| Haus-Baukasten | `werkstatt/baukasten.html` | Bedienseite zum Selbstbauen (Grauufer_Baukaesten_RevXX.md) |
| Häuser | `werkstatt/haeuser/*.json` | gebaute Häuser; jedes wird von `npm run grafik` gerendert (außen, innen, innen gerastert) |
| three.js | `werkstatt/lib/three.min.js` | three.js 0.149.0 (MIT-Lizenz, `three-LICENSE.txt`), nur für Werkstatt und Baukasten, nicht im Spiel |
| Gegenstände | `werkstatt/modelle/gegenstaende.js` | 14 Gegenstände: Schwert, Schild, Heiltrank, Manatrank, Brot, Apfel, Schlüssel, Kerze, Buch, Gold, Becher, Schriftrolle, Dolch, Edelstein |
| Rucksack-Entwurf | `werkstatt/rucksack.js` | Entwurfsseite im Pergament-Stil (1250 × 650) mit den gerenderten Gegenständen |
| Vorschaubilder | `werkstatt/vorschau/` | Ergebnis von `npm run grafik` |

Aufruf: `npm run grafik` (benötigt `npm install` für Playwright).

## 3. Stilregeln (aus dem Werkstatt-Code)

| Regel | Wert |
|---|---|
| Kamera | rechtwinklige Parallelprojektion, Blickwinkel 45° seitlich und 30° von oben; ergibt das Seitenverhältnis 2 : 1 wie im Spiel |
| Maßstab | ein Feld = 2,1 m; Figuren etwa 2 m hoch (Skelettkrieger: Grundmaß 1,8 m, Faktor 1,1) |
| Spielgröße | ein Feld im Spiel 160 px breit (TW in index.html); Hausbilder werden dafür mit dem Faktor 160/137 umgerechnet |
| Licht | warmes Sonnenlicht von links vorn oben, weiche Schatten, kühles Fülllicht von rechts hinten, Himmels-/Bodenlicht; innen zusätzlich Feuer und Kerzen als Lichtquellen |
| Raster | wie im Spiel (`pxl`, Spiel-Rev 59): 16 Stufen je Farbkanal (Schritt 17), Bayer-Dithering 4 × 4, keine Glättung |
| Oberflächen | prozedurale Texturen: Bruchstein, Putz, Holz, Dielen, Schiefer, Stoff, Teppich, Wiese |
| Verwitterung | Schmutzflecken, Laufspuren, Spritzwasserrand, abgeplatzter Putz, Risse, Moos, fehlende Schieferplatten, schiefe Holzteile, durchhängendes Dach, Unkraut, Stroh, Spinnweben, Ruß |
| Blickrichtungen | Figuren 8, Wände und Möbel bei Bedarf 4 (Nord, Ost, Süd, West), stehende Objekte 1 |

## 4. Baukästen

Haus-Baukasten (vorhanden, noch nicht im Spiel), Anlagen-Baukasten für Burg und Schloss (Geplant) Figuren-Baukasten (Geplant) und Landschafts-Baukasten (Geplant) stehen in Grauufer_Baukaesten_RevXX.md: Bedienung, Haustypen, Beschreibung eines Hauses als JSON und Weg ins Spiel.

## 5. Haus wie in Pagan (Probe „Fischerhaus“)

- 5 × 4 Felder, Fachwerk auf Bruchstein, Schieferdach, Verwitterung „verwittert“ (0,75), Schornstein über dem Kamin; Beschreibung in `werkstatt/haeuser/fischerhaus.json`.
- **Außen:** Kiste, Fässer, Brennholzstapel, schief hängende Fensterläden, kaputtes Fenster, mit Brettern geflicktes Dach, ausgetretener Dreck vor der Tür, Unkraut am Sockel.
- **Innen, feste Möbel:** Kamin mit Feuer, Kessel, Bett mit zerwühlter Decke, Truhe, Schrank, Bücherregal, Wandbrett mit Geschirr, Tisch mit zwei Bänken, Teppich, Fässer, Säcke, Kiste, Hocker, Besen, umgekippter Stuhl.
- **Innen, bewegliche Dinge (Geplant: aufheben und verschieben):** Brot, Äpfel, Becher, Kerze, Kessel.
- Bedingung für das Spiel: Häuser bleiben **feldweise** aufgebaut (Mauerstück je Feld, Dach als eigenes Bild), damit Betreten, abnehmbares Dach und Durchsicht wie heute funktionieren.

## 6. Rucksack wie in Pagan (Entwurf, Geplant)

- Links **Ausrüstung**: Plätze für Kopf, Brust, Waffe, Schild, Ring, Amulett, Füße um die Figur; beim Ziehen über die Figur **Wertevorschau** (z. B. Rüstung alt → neu).
- Rechts **Ledertasche**: Gegenstände liegen frei und dürfen sich überlappen; Taschen in Taschen; Truhen und Schränke öffnen sich als eigene Fenster.
- **Mengenregler** beim Teilen eines Stapels, Knopf **„Aufräumen“**, Goldanzeige.
- Fensterstil bleibt „Pergament auf Holzrollen“ mit Wachssiegel.
- Jeder Gegenstand hat **ein** 3D-Modell, aus dem das Bild am Boden und das Bild im Rucksack entstehen.

## 7. Fahrplan (Geplant)

1. **Werkstatt und Stilregeln** – erledigt als Probe (dieses Dokument).
2. **Haus-Baukasten im Browser** – erledigt (Grauufer_Baukaesten_RevXX.md): Grundriss, Mauern (Stein, Fachwerk, Holz), Dachform und -deckung, Fenster, Türen, Schornstein und Verwitterungsgrad selbst zusammenstellen; 3D-Vorschau aus Spielsicht; Ergebnis wird gespeichert und von der Werkstatt gerendert.
3. **Pilot A – Startgebiet Grauufer:** Landschafts-Bausteine aus dem Landschafts-Baukasten, Teil A (Grauufer_Baukaesten_RevXX.md): Bäume (per Code gewachsen, 10–20 Exemplare je Art), Felsen, Häuser aus dem Baukasten, Boden an das neue Licht angepasst; im Spiel eingebaut, auf dem Tablet gemessen.
4. **Figuren-Baukasten** (Grauufer_Baukaesten_RevXX.md): gemeinsames Skelett und gemeinsame Bewegungen je Körperbau-Familie.
5. **Pilot B – Die Tiefe:** Ruheloser, Steinwächter, Echo, Skelettkrieger, Thronhüter.
6. Spielerfiguren (3 Klassen mit fester Ausrüstung je Klasse, Entscheidung des Auftraggebers).
7. Restliche Oberwelt Gebiet für Gebiet, restliche Gegner und Gesprächspartner.
8. Rucksack- und Bodenbilder aller Gegenstände; Weltgegenstände-System (aufheben, ablegen, Behälter).

## 8. Offene Punkte und Grenzen (Schätzwerte)

| Punkt | Einschätzung | Lösungsweg |
|---|---|---|
| Dateigröße | etwa 40 Figurtypen × rund 160 Einzelbilder; mit 16 Farben je Bild etwa 1–3 KB, zusammen etwa 6–20 MB | gespiegelte Richtungen, weniger Bilder je Bewegung; später mehrere Dateien statt einer (TypeScript + Vite, Grauufer_Fahrplan_RevXX.md), offline über installierbare Web-App |
| Arbeitsspeicher Tablet | alle Figuren gleichzeitig entpackt weit über 100 MB | nur Figuren der Umgebung laden |
| Einzeldatei | CLAUDE.md verlangt eine Datei, die offline läuft | für die Piloten Bilder in `index.html` einbetten; danach Umstellung entscheiden |
| Weltgegenstände | Spielstand muss bewegliche Dinge der Welt speichern | neuer Speicherschlüssel, wenn umgesetzt |
| Qualität | Grundformen ohne Feinheiten („Low-Poly“), kein Grafiker-Niveau | Texturen und Bewegungen schrittweise verfeinern |
