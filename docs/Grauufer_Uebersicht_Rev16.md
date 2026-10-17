# Grauufer – Übersicht

**Revision 16**, Stand: Spiel-Rev 103. Einstieg in die Spieldefinition: welches Dokument wofür zuständig ist und wie Namen geschrieben werden.

**Spieltitel:** „Grauufer 1.0“ (seit Spiel-Rev 103). So steht er im Browser-Reiter („Grauufer 1.0 (Rev NN)“), im Titelbild, im Titeldialog („Ein Rollenspiel von schnoerp-media, Revision NN“) und im Beenden-Dialog. „Grauufer“ allein bleibt der Name des Fischerdorfs in der Spielwelt; die Dokumente behalten ihre Dateinamen `Grauufer_<Thema>_RevXX.md`.

## 1. Die Dokumente

| Dokument | Zuständig für | nicht darin |
|---|---|---|
| Grauufer_Uebersicht_RevXX.md | Verzeichnis, Glossar, Regeln für Dokumente | Inhalte |
| Grauufer_Story_RevXX.md | Welt Vharos, Hintergrund, Hauptgeschichte, Enden, Figurenhintergrund | Questablauf |
| Grauufer_Welt_RevXX.md | Gebiete mit Koordinaten, Gelände, Wegsteine, Tageszählung | Erzählung zu den Orten |
| Grauufer_Kampfsystem_RevXX.md | Zugablauf, Formeln, Zustände, Gegnerverhalten, Tod, Stufen, Beuteregeln | Gegnerwerte |
| Grauufer_Waffenliste_RevXX.md | **Waffen und Zauber**, Wurfgeschosse, Werkzeuge, exotische Waffen | Schwächen der Gegner |
| Grauufer_Gegner_RevXX.md | **einzige Quelle** für Gegnerwerte, Vorkommen, Aussehen, Beute, Schwächen | Formeln |
| Grauufer_Gegenstaende_RevXX.md | Rüstungen, Tränke, Rohstoffe, Herstellen, Schmuck | Waffen, Preise |
| Grauufer_Gespraechspartner_RevXX.md | alle Figuren, Dienste, Gesprächsthemen, Dialogregeln | Questablauf |
| Grauufer_Quests_RevXX.md | Haupt- und Nebenquests mit Ablauf und Belohnung | Hintergrund |
| Grauufer_Bedienung_RevXX.md | Tippen, Tastatur, Anzeige, Spielstart, Tagebuch, Charakterfenster, Handy | Grafik |
| Grauufer_Stil_RevXX.md | Grafik, Farben, Figurengrößen, Klang, Texte, Leistung | Bedienung |
| Grauufer_Fortschritt_RevXX.md | Balancing: Stufen, Erfahrung, Richtstufen je Gebiet | Formeln, Preise |
| Grauufer_Wirtschaft_RevXX.md | **einzige Quelle** für Preise, Dienste, Verkaufen, Goldbilanz | Gegnergold, Questbelohnungen |
| Grauufer_Fahrplan_RevXX.md | Reihenfolge der Umsetzung, Aufteilung auf 2 Entwickler | Inhalte |
| Grauufer_Charakter_RevXX.md | Attribute, Fertigkeiten, Talentbaum, Freischaltungen in der Welt (seit Spiel-Rev 90) | Kampfformeln |
| Grauufer_Schaetze_RevXX.md | Truhen, Mimiken, Schatzkarten, Grabstellen, Lesepulte, Tafeln, Hindernisse mit Fundorten (seit Spiel-Rev 89/90) | Gegenstandswerte |

Karte von Morvenn als Bild: `Morvenn_Karte_Rev34.png` (im Ordner `docs/`, Stand der Karte: Spiel-Rev 34; neuere Orte und Koordinaten stehen in Grauufer_Welt_RevXX.md).

Spielcode und Technik: CLAUDE.md und README.md im Repo.

**Lesereihenfolge für Neue:** Übersicht → Story → Welt → Kampfsystem → Fahrplan, die übrigen bei Bedarf.

## 2. Regeln für alle Dokumente

- Dateiname `Grauufer_<Thema>_RevXX.md`, fortlaufende Revision; Zeile „**Revision NN**“ am Anfang.
- Jede inhaltliche Änderung erhöht die Revision der geänderten Datei, nur dieser.
- Querverweise immer als `Grauufer_<Thema>_RevXX.md` (= jeweils aktuelle Revision), nie mit fester Nummer.
- **Spiel-Rev** = Stand des Spiels (z. B. Spiel-Rev 29), **Revision** = Stand des Dokuments.
- **Im Spiel** = in der aktuellen Spielversion umgesetzt, **Geplant** = noch nicht im Spiel. Wird etwas Geplantes umgesetzt, wird es auf „Im Spiel“ umgestellt.
- Jeder Wert steht nur an einer Stelle; andere Dokumente verweisen.
- Ablage im Repo unter `docs/`.

## 3. Glossar

### Welt und Geschichte

| Begriff | Bedeutung |
|---|---|
| Vharos | die Welt des Spiels, mit mehreren Kontinenten |
| Morvenn | Kontinent 1, auf dem das bisherige Spiel stattfindet |
| Tharos | Kontinent 2: Pakt und Titanen (Geplant) |
| Splittmark | Kontinent 3: Ursprung des Risses (Geplant) |
| Nullwacht | Kontinent 4: Reich der Leere, Endkampf (Geplant) |
| der Riss | Spalt im Himmel über dem Meer, bringt Fremde und weckt die Toten |
| der Fremde / die Fremde | die Spielfigur |
| Titanen | die vier verstummten Mächte: Erde, Wasser, Feuer, Luft |
| Splitter | je ein Machtstück eines Titanen, Ziel der Hauptquest |
| Hüter | Wächter der Splitter, inzwischen Ungeheuer |
| Steinkreis | Ort bei Grauufer, an dem die Splitter den Riss öffnen |
| die Leere | Geplant: fünfter, eingesperrter Titan, Gegenspieler |

### Orte (Schreibweise)

Sonnwacht, Grauufer, Tränensee, Glutschlund, Sturmspitze, Nordpass, Alte Feste, Kristallhöhle, Fahlmoor, Miras Kate, Spinnengrotte, Frostmark, Frosthain, Gefrorener See, Sengende Ödnis, Sandhafen, Versunkener Tempel, Nebelwald, Küstenstraße, Wegkreuz, Wildnis von Vharos.
Neu seit Spiel-Rev 34: Brachfeld, Titanenrücken, Glimmerseen, Rotsteinschluchten, Klippenküste; Orte Kornwacht, Steinwacht, Schilfrode, Erzhall, Ostwacht.

### Figuren (Schreibweise)

Vorhanden: Gerold, Lene, Odo, zwei Wachen (Sonnwacht), Mareth, Oswin, Ilsabe, Bram, Tobe, Hagen, Yasmin, Birger, Svea, Mira, Hanne, Jost, Bruder Aldo, Schwester Wenna, Maren, Ole, Gunda, Brakk, Gerwin, Ilka.
Vorgeschlagen: Edda, Kalle, Rune, Jorek, Silas, Die Stimme, Fenna, Wendel, Grim.

### Gegner (Schreibweise)

Ghul, Wolf, Ertrunkener, Aschenhund, Bandit, Harpyie, Riesenspinne, Moorleiche, Sandskorpion, Frostwolf, Skelettkrieger; Endgegner: Gruftwächter, Bandenführer, Tiefenwächter, Glutfürst, Sturmherr, Spinnenkönigin, Kristallwächter, Eisgolem, Knochenkönig, Nhal (der Hungernde); seit Spiel-Rev 89/91 außerdem Mimik und Glutgeist.

### Spielbegriffe

| Begriff | Bedeutung |
|---|---|
| Zug | eine Aktion des Spielers, danach handeln die Gegner |
| Schutzzone | Sonnwacht, dort greift niemand an |
| Schnellzugriffsleiste | Leiste unten mit 9 Feldern für Waffen, Zauber, Tränke |
| Güte | abgenutzt, normal, fein, meisterlich |
| Bonus | Zusatz wie „des Bären“ an Waffen und Rüstungen |
| Fertigkeit | Fähigkeit durch Schmuck |
| Aggro-Radius | Entfernung, ab der ein Gegner angreift |
| Abklingzeit | Züge bis zum nächsten Einsatz |
| Wegstein | Schnellreise-Punkt |


### Neue Begriffe (seit Spiel-Rev 64–90)
Aschenhorn, Nhal (der Hungernde), Siegelwächter, Morgenwind (Schiff), Haldor (Kapitän), Die Stillen, Die Seelotsen, Die Glutschmiede, Die Sturmbrüder, Titanenbrecher, Portal, Lesepult, Runentafel, Titanentafel, Runentor, Gittertor, Felsbrocken, Vogelnest, Mimik, Glutgeist, Flaschenpost, Schatzkarte, Grabstelle, Fertigkeit, Talent, Attributpunkt, Talentpunkt, Tagebuch.
