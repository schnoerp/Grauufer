# Grauufer – Bedienung

**Revision 13**, Stand: Spiel-Rev 100. **Im Spiel** = in der aktuellen Spielversion umgesetzt (aus dem Code übernommen). **Geplant** = noch nicht im Spiel.

## 1. Zielgeräte (Im Spiel)

- Hauptzielgerät: **Android-Tablet in Chrome**, Querformat.
- Auch am Computer mit Maus und Tastatur spielbar.
- Anforderung: flüssig mit 60 Bildern pro Sekunde, **kein Ruckeln**.

## 2. Tippen und Klicken (Im Spiel)

| Aktion | Bedienung |
|---|---|
| Laufen | Zielfeld antippen, die Figur läuft den Weg selbst |
| Angreifen | Gegner einmal antippen: er wird markiert und sofort angegriffen; ist er außer Reichweite, läuft die Figur hin und greift dann an |
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
| Leertaste oder Knopf „Rasten“ | einen Zug rasten: ohne Gegner im Umkreis von 6 Feldern +1 Leben und +1 Mana, sonst nur warten (seit Spiel-Rev 40, vorher „Abwarten“) |
| 1–9 | Schnellzugriffsleiste |
| F | markierten Gegner angreifen |
| I | Rucksack |
| J | Aufgabenbuch |
| T | Tagebuch (seit Spiel-Rev 84) |
| K | Charakter (seit Spiel-Rev 90) |
| C | Herstellen |
| Z | Zauberbuch |
| M | Karte |
| + / − | Zoom; mit Maus auch Strg + Mausrad (seit Spiel-Rev 74) |
| Esc | Fenster schließen, Zauber abbrechen |

## 4. Anzeige (Im Spiel)

| Element | Lage | Inhalt |
|---|---|---|
| Untere Leiste | unten, eine Reihe | Leben links, Schnellzugriff, Knöpfe Rucksack, Charakter, Zauber, Karte, Tagebuch, Rasten, Mana rechts; alle gleich hoch (seit Spiel-Rev 71): 50 px, bei Bildschirmbreite bis 980 px 44 px, bei Bildschirmhöhe bis 520 px 42 px |
| Kompass | am Rand | Nordpfeil und Pfeil zur aktuellen Quest |
| Zoomanzeige | oben rechts | Zoomstufe in %, Start immer bei 100 %; Bereich 50–250 % in Schritten von 10 % |
| Karte | Taste M | große Karte von Morvenn (keine Minikarte); Knopf „Weltkarte“ öffnet den drehbaren Globus von Vharos |
| Meldungen | Textprotokoll | Kampf, Funde, Gespräche |
| Fenster | **immer zentriert** (seit Spiel-Rev 86) | Rucksack, Charakter, Tagebuch, Aufgaben, Herstellen, Zauber, Karte, Händler, Gespräch; Stil „Pergament auf Holzrollen“, Schließen als rotes Wachssiegel (seit Spiel-Rev 87); der Rucksack passt ohne Scrollen auf den Bildschirm (seit Spiel-Rev 85/90) |
| Ego-Sicht | oben rechts, nur in Höhlen | Knopf „Ego-Sicht“ schaltet in Höhlen auf eine Sicht aus Augenhöhe mit Steuerkreuz, „Iso-Sicht“ schaltet zurück; Auswahl wird gespeichert (Testfunktion seit Spiel-Rev 44) |
| Testknöpfe | – | entfernt: „zur Höhle“ seit Spiel-Rev 88, „Test: Gegner an/aus“ samt Diagnosezeile seit Spiel-Rev 93 |

**Regeln**
- Kein Zoom mit dem Mausrad allein, nur mit Strg (seit Spiel-Rev 74).
- Maßstab (seit Spiel-Rev 31): Bei 100 % ist ein Feld etwa 1/22 der kürzeren Bildschirmseite breit (32 bis 66 Punkte); vorher 1/16 (44 bis 90 Punkte). Die Oberfläche (Schrift, Leiste, Fenster) bleibt davon unberührt.
- Beenden-Knopf vorhanden.
- Kein Knopf für die Grafik mehr (seit Spiel-Rev 100): Die Bildqualität regelt sich automatisch (volle Auflösung, bei Ruckeln 80 % bzw. 65 %), siehe Grauufer_Stil_RevXX.md, Abschnitt 5. Vorher: Knopf „Grafik“ mit Hoch, Mittel, Niedrig, Automatisch.
- Ton ein und aus, Auswahl wird gespeichert.
- Rucksack als Ledertasche gestaltet, mit Ausrüstungsplätzen und Fächern; in der Mitte steht die eigene Spielfigur mit ihrem Aussehen und der angelegten Ausrüstung (seit Spiel-Rev 33).

## 5. Spielstart (Im Spiel)

1. Intro mit Titel „Grauufer“, Jingle und „schnoerp-media“; danach Titeldialog mit „Weiterspielen“ (nur wenn ein Spielstand vorhanden ist, dann vorausgewählt) und „Neues Spiel“
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
- Abklingzeiten als dunkle Überblendung in der Schnellzugriffsleiste.
- Einstellbare Textgröße.
- Bestätigung vor gefährlichen Würfen, wenn der Spieler selbst im Wirkungsbereich steht.
- Minikarte am Bildschirmrand (gibt es in Rev 29 nicht).
- Weltkarte per Zwei-Finger-Zoom aus der Kontinentkarte öffnen (siehe Welt, Abschnitt 7).
