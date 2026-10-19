# Grauufer – Bedienung

**Revision 24**, Stand: Spiel-Rev 128. **Im Spiel** = in der aktuellen Spielversion umgesetzt (aus dem Code übernommen). **Geplant** = noch nicht im Spiel.

## 1. Zielgeräte (Im Spiel)

- Hauptzielgerät: **Android-Tablet in Chrome**, Querformat.
- Auch am Computer mit Maus und Tastatur spielbar.
- Anforderung: flüssig mit 60 Bildern pro Sekunde, **kein Ruckeln**.

## 2. Tippen und Klicken (Im Spiel)

| Aktion | Bedienung |
|---|---|
| Laufen | Zielfeld antippen, die Figur läuft den Weg selbst |
| Angreifen | Gegner einmal antippen: er wird markiert und angegriffen; ist er außer Reichweite, läuft die Figur hin. Seit Spiel-Rev 119 **Dauerangriff** in Echtzeit: Schläge im Waffentakt, bis der Gegner fällt oder du woanders hintippst, danach automatisch der nächste bedrängende Gegner |
| Sprechen, Tür, Altar, Wegstein | antippen, die Figur geht hin und handelt |
| Truhe, Lesepult, Tafel, Hindernis, Kristall | antippen, die Figur geht hin und öffnet, liest oder versucht es (seit Spiel-Rev 82–90) |
| Angeln | mit Angelrute aufs Wasser tippen (max. 3 Felder); wenn der Schwimmer untertaucht und „!“ erscheint, schnell irgendwo tippen (seit Spiel-Rev 81) |
| Graben | mit Schaufel auf das X im Sand tippen (seit Spiel-Rev 89) |
| Ansicht verschieben | **Touch:** zwei Finger ziehen, auseinander/zusammen = Zoom. **Maus:** Strg (Mac: Cmd) + Ziehen. Ein Finger ziehen bewirkt nichts. Antippen des Avatars holt die Ansicht zurück (seit Spiel-Rev 73/74) |
| Schnellzugriff | Feld in der Leiste antippen; Zauber mit Ziel danach Gegner antippen |

## 3. Tastatur (Im Spiel)

| Taste | Funktion |
|---|---|
| Pfeiltasten oder W A S D | ein Feld laufen |
| Leertaste oder Knopf „Rasten“ | kurz rasten (die Welt läuft seit Spiel-Rev 119 trotzdem in Echtzeit weiter): ohne Gegner im Umkreis von 6 Feldern +1 Leben und +1 Mana, sonst nur warten (seit Spiel-Rev 40, vorher „Abwarten“) |
| 1–9 | Schnellzugriffsleiste |
| F | markierten Gegner angreifen |
| I | Rucksack |
| J | Aufgabenbuch |
| T | Tagebuch (seit Spiel-Rev 84) |
| K | Charakter (seit Spiel-Rev 90) |
| G | Geschichte, der Story-Baum (seit Spiel-Rev 101) |
| C | Herstellen |
| Z | Zauberbuch |
| M | Karte |
| + / − | Zoom; mit Maus auch Strg + Mausrad (seit Spiel-Rev 74) |
| Esc | Fenster schließen, Zauber abbrechen |

## 4. Anzeige (Im Spiel)

| Element | Lage | Inhalt |
|---|---|---|
| Untere Leiste | unten, eine Reihe | Schnellzugriff, Knöpfe Rucksack, Charakter, Zauber, Karte, Tagebuch, Geschichte, Rasten; alle gleich hoch (seit Spiel-Rev 71): 50 px, bei Bildschirmbreite bis 980 px 44 px, bei Bildschirmhöhe bis 520 px 42 px. Seit Spiel-Rev 102 ohne Balken für Leben und Mana; die Leiste hält links und rechts 110 px für die Kugeln frei und bleibt bis 800 Punkte Breite einzeilig |
| Kugeln Leben und Mana | links unten (Leben, rot), rechts unten (Mana, blau), außerhalb der Fußzeile | seit Spiel-Rev 102, vorher Balken in der Fußzeile: 90 Punkte Durchmesser, Eisenring mit acht Nieten, Glaskugel; die Füllhöhe zeigt den Anteil, die Zahl (z. B. „30/30“) steht immer in der Mitte; ruhig, ohne Bewegung |
| Kompass | am Rand | Nordpfeil und Pfeil zur aktuellen Quest |
| Zoomanzeige | oben rechts | Zoomstufe in %, Start immer bei 100 %; Bereich 50–600 % (bis Spiel-Rev 124: 250 %) in Schritten von 10 %; die Stufen rasten auf ganze Bildschirmpunkte je Spielpixel, daher endet der Zoom z. B. bei 556 % (1250 × 650) |
| Karte | Taste M | große Karte von Morvenn (keine Minikarte), in der Tiefe stattdessen „Karte der Tiefe“ (seit Spiel-Rev 105); Knopf „Weltkarte“ öffnet den drehbaren Globus von Vharos |
| Meldungen | Textprotokoll | Kampf, Funde, Gespräche |
| Fenster | **immer zentriert** (seit Spiel-Rev 86) | Rucksack, Charakter, Tagebuch, Aufgaben, Herstellen, Zauber, Karte, Händler, Gespräch; Stil „Pergament auf Holzrollen“, Schließen als rotes Wachssiegel oben rechts (seit Spiel-Rev 87; seit Spiel-Rev 122 ohne zusätzlichen Knopf „Schließen“ unten, Tastaturfokus liegt auf dem Siegel); der Rucksack passt ohne Scrollen auf den Bildschirm (seit Spiel-Rev 85/90) |
| Ego-Sicht | oben rechts, nur in Höhlen | Knopf „Ego-Sicht“ schaltet in Höhlen auf eine Sicht aus Augenhöhe mit Steuerkreuz, „Iso-Sicht“ schaltet zurück; Auswahl wird gespeichert (Testfunktion seit Spiel-Rev 44) |
| Testknöpfe | – | entfernt: „zur Höhle“ seit Spiel-Rev 88, „Test: Gegner an/aus“ samt Diagnosezeile seit Spiel-Rev 93 |

**Regeln**
- Kein Zoom mit dem Mausrad allein, nur mit Strg (seit Spiel-Rev 74).
- Der Browser selbst vergrößert die Seite nicht mehr (seit Spiel-Rev 128, `user-scalable=no` im Viewport): vorher konnte der Zwei-Finger-Zoom auf dem Tablet über einem Fenster (z. B. Flaschenpost) die ganze Seite vergrößern, das Fenster ragte dann über den Bildschirm. Gezoomt wird nur die Spielwelt.
- Ereignisfenster (Flaschenpost, Fundstücke, Traumfetzen) haben eine kleinere Überschrift als der Spieltitel (30–46 Punkte statt 46–80), damit lange Titel nicht abgeschnitten werden (seit Spiel-Rev 128).
- Maßstab (seit Spiel-Rev 31): Bei 100 % ist ein Feld etwa 1/22 der kürzeren Bildschirmseite breit (32 bis 66 Punkte); vorher 1/16 (44 bis 90 Punkte). Die Oberfläche (Schrift, Leiste, Fenster) bleibt davon unberührt.
- Beenden-Knopf vorhanden.
- Kein Knopf für die Grafik mehr (seit Spiel-Rev 100): Die Bildqualität regelt sich automatisch (volle Auflösung, bei Ruckeln 80 % bzw. 65 %), siehe Grauufer_Stil_RevXX.md, Abschnitt 5. Vorher: Knopf „Grafik“ mit Hoch, Mittel, Niedrig, Automatisch.
- Ton ein und aus, Auswahl wird gespeichert.
- Rucksack als Ledertasche gestaltet, mit Ausrüstungsplätzen und Fächern; in der Mitte steht die eigene Spielfigur mit ihrem Aussehen und der angelegten Ausrüstung (seit Spiel-Rev 33).

## 5. Spielstart (Im Spiel)

1. Intro mit Logo (seit Spiel-Rev 104; seit Spiel-Rev 121 Startbild mit Logo und Schriftzug nach der Vorlage des Auftraggebers, siehe Grauufer_Stil_RevXX.md) und Titel „Grauufer 1.0“ (seit Spiel-Rev 103, vorher „Grauufer“), seit Spiel-Rev 112 mit Versionsnummer „1.0.NNN“ (Spiel-Revision), Jingle und „schnoerp-media“; danach Titeldialog mit „Weiterspielen“ (nur wenn ein Spielstand vorhanden ist, dann vorausgewählt) und „Neues Spiel“
2. Charakter-Editor: Name, Geschlecht, Klasse, Werte, Aussehen; Charaktere speicherbar. Kompakt in drei Spalten (seit Spiel-Rev 65/72), Start mit Glatze und Karohemd, Kleidung auch „Weißes T-Shirt“
3. Start am Strand südlich von Grauufer mit Erzählkarte „Am Ufer“ (seit Spiel-Rev 79)
4. Spielstand wird automatisch im Browserspeicher gespeichert (localStorage, Schlüssel grauufer-save-v10), beim Tod gelöscht. Neues Spiel nur noch über Beenden → Titelbildschirm (der Knopf im Rucksack entfällt seit Spiel-Rev 90)
5. Ton verstummt, sobald das Spiel nicht sichtbar ist oder beendet wird (seit Spiel-Rev 68)
6. Schrift „Pixelify Sans“ ist eingebettet, das Spiel läuft ohne Internet (seit Spiel-Rev 78)
7. Eigenes Symbol im Browser-Reiter und bei Lesezeichen: Wappen der Siegelwächter (seit Spiel-Rev 95, Aussehen siehe Grauufer_Stil_RevXX.md)
8. Online spielbar über GitHub Pages aus dem Zweig `main` (Adresse unter *Settings → Pages* im Repo)

## 5b. Tagebuch (Im Spiel seit Spiel-Rev 84)

- Schreibt automatisch mit: Geschichte und Aufgaben, Entscheidungen, Träume und Erinnerungen (vollständig nachlesbar), Schriften und Schatzkarten, Entdeckungen.
- Kopfzeile: Tag, Name, Schriften x/10, Truhen x/y, Schätze x/5; Kasten „Aktuelles Ziel“; Filter Alles / Geschichte / Träume & Erinnerungen / Schriften / Entdeckungen; „Nachlesen“ öffnet die Erzählkarte.

## 5d. Geschichte: der Story-Baum (Im Spiel seit Spiel-Rev 101)

Knopf „Geschichte“ in der Fußzeile oder Taste **G**. Ein Pergamentfenster zeigt die **Hauptgeschichte** als Baum (Nebenaufgaben nicht):

- **Hauptlinie:** Erwachen am Strand → Das Amulett → Das Gräberfeld → Die Gruft → Splitter der Erde → Splitter des Wassers, des Feuers, der Luft (freie Reihenfolge) → Mareths Enthüllung → Das Finale → Der Steinkreis (Enden „Das neue Siegel“, „Der freie Wächter“) oder Der Krater (Enden „Der Erlöser“, „Der Hungernde“).
- **Entscheidungen** als eigene Leiste darunter: Mareth (vergeben/verstoßen), Die Stillen (schweigen/aufdecken), Die Seelotsen (vergeben/verurteilen), Die Glutschmiede (schmieden/befreien), Die Sturmbrüder (Eid leisten/ablehnen).
- **Darstellung:** erreicht = goldenes Siegel mit Häkchen; als Nächstes möglich = rot gestrichelter Kreis; noch verborgen = grauer Kreis mit „???“ (Name wird nicht verraten); nicht gewählter Ast = verblasst und durchgestrichen.
- **Antippen einer Station** zeigt darunter, was geschehen ist, bzw. einen Hinweis, wie es weitergeht.
- Kopfzeile: „Erreicht: x von 12 Stationen der Hauptgeschichte“.
- Alle Angaben kommen aus den Spielmerkern. Neu ist nur der Merker `krater` (gesetzt, wenn man mit vier Splittern den Kraterrand erreicht). Das Fenster wird nur beim Öffnen gezeichnet und kostet pro Bild nichts.

## 5c. Charakterfenster (Im Spiel seit Spiel-Rev 90)

Knopf „Charakter“ oder Taste K, rotes „!“ bei freien Punkten. Reiter Attribute, Fertigkeiten, Talente. Inhalt: Grauufer_Charakter_RevXX.md.

## 6. Geplanter Ausbau

- Spielstand: mehrere Speicherplätze, Export/Import als Datei, Regel beim Tod (besprochen, Entscheidung offen).


### Handy

| Thema | Geplant |
|---|---|
| Ausrichtung | offen: Querformat (wie Tablet, weniger Umbau) oder Hochformat (Bedienung mit einer Hand) |
| Leiste | Schnellzugriff auf 5 Felder, Rest per Wischen |
| Fenster | bildschirmfüllend statt mittig |
| Zoom | Zwei-Finger-Zoom zusätzlich zu + / − |
| Lange antippen | Infos zu Gegner oder Gegenstand |

### Allgemein

- Zustände (brennend, gefangen usw.) als Symbole über den Figuren.
- ~~Abklingzeiten als dunkle Überblendung in der Schnellzugriffsleiste~~ – im Spiel seit Spiel-Rev 119.
- Einstellbare Textgröße.
- Bestätigung vor gefährlichen Würfen, wenn der Spieler selbst im Wirkungsbereich steht.
- Minikarte am Bildschirmrand (gibt es in Rev 29 nicht).
- Weltkarte per Zwei-Finger-Zoom aus der Kontinentkarte öffnen (siehe Welt, Abschnitt 7).
