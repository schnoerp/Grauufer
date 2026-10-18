# Grauufer – Gegner

**Revision 12**, Stand: Spiel-Rev 125. **Im Spiel** = in der aktuellen Spielversion umgesetzt (aus dem Code übernommen). **Geplant** = noch nicht im Spiel.

Diese Datei ist die **einzige Quelle für Gegnerwerte**. Formeln und Regeln (Treffer, Schaden, Aggro, Wiederbelebung) stehen in Grauufer_Kampfsystem_RevXX.md.

## 1. Kampfwerte (Im Spiel)

### Normale Gegner

| Gegner | Leben | Angriff | Treffer | Aggro | EP | Gold | Art |
|---|---|---|---|---|---|---|---|
| Ghul | 10 | 1–3 | 75 % | 5 | 10 | 2–5 | untot |
| Wolf | 12 | 2–4 | 78 % | 5 | 12 | 0–2 | Tier |
| Ertrunkener | 14 | 2–4 | 75 % | 5 | 15 | 3–7 | untot |
| Aschenhund | 16 | 3–5 | 80 % | 6 | 20 | 4–8 | Feuerwesen |
| Bandit | 16 | 2–5 | 78 % | 5 | 18 | 6–12 | Mensch |
| Harpyie | 18 | 3–6 | 80 % | 7 | 25 | 5–10 | fliegend |
| Riesenspinne | 20 | 3–6 | 80 % | 6 | 28 | 0–4 | Tier |
| Moorleiche | 20 | 3–6 | 78 % | 5 | 24 | 2–8 | untot |
| Sandskorpion | 22 | 4–6 | 80 % | 5 | 26 | 0–5 | Tier |
| Frostwolf | 22 | 4–6 | 80 % | 6 | 26 | 0–3 | Tier |
| Skelettkrieger | 24 | 4–7 | 80 % | 6 | 32 | 5–12 | untot |

### Endgegner

| Endgegner | Leben | Angriff | Treffer | Aggro | EP | Gold | Art |
|---|---|---|---|---|---|---|---|
| Gruftwächter | 30 | 2–5 | 80 % | 6 | 40 | 15–20 | Golem |
| Bandenführer | 40 | 3–6 | 80 % | 6 | 45 | 30–40 | Mensch |
| Tiefenwächter | 42 | 3–6 | 80 % | 6 | 60 | 25–30 | einst Mensch |
| Glutfürst | 58 | 4–7 | 80 % | 6 | 90 | 35–40 | Golem, Feuerwesen |
| Sturmherr | 75 | 5–8 | 80 % | 7 | 0 | 0 | fliegend |
| Spinnenkönigin | 90 | 6–9 | 82 % | 7 | 120 | 60–80 | Tier |
| Kristallwächter | 95 | 6–9 | 82 % | 6 | 130 | 60–80 | Golem |
| Eisgolem | 100 | 7–10 | 80 % | 6 | 140 | 70–90 | Golem |
| Knochenkönig | 110 | 7–10 | 82 % | 7 | 150 | 90–120 | untot |
| **Thronhüter** (seit Spiel-Rev 107) | 140 | 7–11 | 82 % | 6 | 180 | 80–110 | Golem; wacht in der Halle der Vier der Tiefe (71,289); beim ersten Sieg erhält man den Ring der Tiefe |
| **Nhal, der Hungernde** (seit Spiel-Rev 82, verstärkt in Rev 91) | 320 | 9–14 | 80 % | 9 | 400 | – | fünfter Titan, Golem aus Glut und Asche; nur mit Titanenbrecher verwundbar, erscheint nur auf Wunsch am Kraterrand. **Phase 2** (unter 50 % Leben): ruft 2 Glutgeister |
| Glutgeist (seit Spiel-Rev 91) | 22 | 4–7 | 82 % | 12 | 0 | – | nur in Nhals Phase 2, glühender Hund aus Lava; kein Endgegner, wird aber seit Spiel-Rev 94 nicht wiederbelebt (vorher nach 320 Zügen neben seinem Erscheinungsort) |

Endgegner werden nicht wiederbelebt, lassen immer Ausrüstung fallen und werden vom Sturmstoß nicht zurückgestoßen. Seit Spiel-Rev 89 erscheint nach dem Sieg über einen Altarwächter zusätzlich eine **Bosstruhe** neben dem Altar.

### Gegner der Tiefe (Im Spiel seit Spiel-Rev 106, für Stufe 4–5)

| Gegner | Leben | Angriff | Treffer | Aggro | EP | Gold | Art |
|---|---|---|---|---|---|---|---|
| Ruheloser | 28 | 4–7 | 80 % | 6 | 34 | 4–10 | untot; Tote, die seit dem gebrochenen Siegel aus der Tiefe aufsteigen |
| Steinwächter | 36 | 5–8 | 78 % | 5 | 42 | 0–6 | Golem; Wächter der Titanen ohne Herrn |
| Echo | 22 | 5–8 | 86 % | 7 | 38 | 2–8 | Schatten einer Titanenstimme, durchscheinend |

Beute wie bei allen normalen Gegnern (14 % Ausrüstung, bei diesen EP aus der höchsten Stufe). Sie werden wie Gegner fester Gebiete nach 320 Zügen in der Nähe ihres Platzes wiederbelebt.

### Neue Gegner (Im Spiel seit Spiel-Rev 89)

| Gegner | Leben | Angriff | Treffer | Aggro | EP | Gold | Art |
|---|---|---|---|---|---|---|---|
| Mimik | 38 | 4–7 | 80 % | 4 | 45 | 25–45 | Truhe mit Zahnreihe, Zunge und gelbem Auge; 2 Stück (Kristallhöhle, Spinnengrotte), sieht aus wie eine verschlossene Truhe; wird seit Spiel-Rev 94 nicht wiederbelebt (vorher nach 320 Zügen als laufende Truhe) |

## 2. Vorkommen (Im Spiel)

### Feste Gebiete

| Gebiet | Gegner | Endgegner | bewacht |
|---|---|---|---|
| Grauufer, Gräberfeld und Gruft | 3 Ghule | Gruftwächter | Splitter der Erde |
| Tränensee | 3 Ertrunkene | Tiefenwächter | Splitter des Wassers |
| Glutschlund (seit Spiel-Rev 76 in der Sengenden Ödnis) | 4 Aschenhunde | Glutfürst | Splitter des Feuers |
| Sturmspitze | 4 Harpyien | Sturmherr | Splitter der Luft |
| Alte Feste | 4 Banditen | Bandenführer | Quest von Bram |
| Kristallhöhle | 2 Riesenspinnen, 1 Skelettkrieger | Kristallwächter | Sturmzepter |
| Die Tiefe (seit Spiel-Rev 106) | 21: 7 Ruhelose, 5 Echos, 4 Steinwächter, 5 Skelettkrieger (2 im Flügel der Luft unter dem Versunkenen Tempel, je 1 in den Flügeln des Wassers und des Feuers und im oberen Gang) | Thronhüter (seit Spiel-Rev 107) | Ring der Tiefe |
| Spinnengrotte | 5 Riesenspinnen | Spinnenkönigin | Quest von Svea |
| Gefrorener See | 2 Frostwölfe | Eisgolem | Quest von Birger |
| Versunkener Tempel | 4 Skelettkrieger | Knochenkönig | Quest von Yasmin |

Normale Gegner stehen beim Spielstart bis zu 3 Felder um ihren festen Platz verstreut, Endgegner genau auf ihrem Platz.

### Wildnis und Biome

| Gebiet | Gegner beim Spielstart |
|---|---|
| Wildnis von Vharos | 28–40 Gegner, je 65 % Wolf, 35 % Bandit, nicht näher als 14 Felder an Sonnwacht |
| Nebelwald | 9 Riesenspinnen, 7 Moorleichen, 7 Wölfe, 3 Skelettkrieger |
| Fahlmoor | 11 Moorleichen, 3 Riesenspinnen, 3 Wölfe |
| Sengende Ödnis | 11 Sandskorpione, 4 Skelettkrieger |
| Frostmark | 9 Frostwölfe, 2 Banditen |
| Brachfeld (seit Rev 34) | 12 Wölfe, 8 Banditen, 4 Ghule |
| Titanenrücken (seit Rev 34) | 9 Harpyien, 6 Skelettkrieger, 5 Frostwölfe |
| Glimmerseen (seit Rev 34) | 9 Ertrunkene, 5 Moorleichen, 4 Riesenspinnen, 4 Wölfe |
| Rotsteinschluchten (seit Rev 34) | 9 Sandskorpione, 7 Aschenhunde, 6 Banditen |
| Klippenküste (seit Rev 34) | 5 Harpyien, 5 Ertrunkene, 4 Banditen |
| Sonnwacht, Sandhafen, Frosthain, Miras Kate | keine (Sonnwacht ist Schutzzone) |

### Tag und Nacht

- Seit Spiel-Rev 41 gibt es keine Nacht mehr. Untote haben keinen Nachtbonus.

## 3. Aussehen (Im Spiel)

Alle Gegner sind selbst gezeichnet (Canvas), ohne Fremdgrafiken. Grundformen: Mensch, Golem, Hund, Harpyie, Spinne, Skorpion.

| Gegner | Grundform | Aussehen |
|---|---|---|
| Ghul | Mensch, gebückt | fahlgrüne Haut, kahl, sichtbare Rippen, Krallen, rote Augen |
| Ertrunkener | Mensch, gebückt | blaugraue Haut, nasses dunkelgrünes Haar, Seetang, hellblaue Augen |
| Moorleiche | Mensch, gebückt, Kapuze | moosgrüne Haut, Seetang, hellgrüne Augen |
| Skelettkrieger | feste Figur (seit Spiel-Rev 125) | Im neuen Stil nach Zielbild des Auftraggebers, in 8 Blickrichtungen (Grauufer_Stil_RevXX.md): Knochen mit Gelenkköpfen, Schädel mit dunklen Augenhöhlen und Zähnen, Rippenbögen, Lederschulterstücke mit Nieten, Brustriemen, Gürtel mit runder Schnalle, zerrissener roter Lendenschurz, Lederstiefel, Schwert und runder Holzschild mit Eisenrand und Buckel; schaut die Spielfigur an, wenn er neben ihr steht. **Bewegungen:** Gelenkgerüst (Becken, Wirbelsäule, Kopf mit Unterkiefer, Schultern, Ellbogen, Hände, Hüften, Knie, Füße, Lendenschurz); Laufen mit 8 Bildern (Beine schwingen, Knie beugen, Arme pendeln gegenläufig, Kiefer klappert), Angriff mit 6 Bildern (Schwert über den Kopf ausholen, nach vorn unten zuschlagen, Ausfallschritt), je in 8 Richtungen. Vorher: Mensch mit Knochen, Rippen, roten Augen und Schwert |
| Bandit | Mensch, Kapuze | erdfarbener Umhang, Schwert |
| Wolf | Hund | graues Fell, gelbe Augen |
| Frostwolf | Hund | weißgraues Fell, eisblaue Augen |
| Aschenhund | Hund | dunkelbraun mit glühenden Rissen, orange Augen |
| Harpyie | Harpyie, schwebend | violettgraue Flügel, dunkles Haar, rote Augen |
| Riesenspinne | Spinne | dunkelbraun, rote Augen |
| Sandskorpion | Skorpion | sandfarben |
| Gruftwächter | Golem | grauer Stein, türkise Augen |
| Glutfürst | Golem, groß | dunkles Gestein mit glühenden Rissen, goldene Augen |
| Kristallwächter | Golem, groß | violetter Kristall, leuchtende Risse |
| Eisgolem | Golem, sehr groß | hellblaues Eis, weiße Risse |
| Tiefenwächter | Mensch, groß, Kapuze | dunkelblaue Haut, Seetang, türkise Augen |
| Bandenführer | Mensch, etwas größer, Kapuze | rotbrauner Umhang, Rüstung mit Goldbesatz, Schwert |
| Sturmherr | Harpyie, groß | silbergraue Flügel, weißes Haar, eisblaue Augen |
| Spinnenkönigin | Spinne, sehr groß | dunkelviolett mit roter Zeichnung, pinke Augen |
| Knochenkönig | Mensch, sehr groß | Knochen, goldene Rüstung, violette Augen |
| Thronhüter | Golem, sehr groß (1,5) | fast schwarzer Stein mit violett glühenden Rissen und violetten Augen |
| Nhal, der Hungernde | Golem, riesig (1,75-fach) | fast schwarzes Gestein mit orange glühenden Rissen, rote Augen |
| Glutgeist | Hund | rotbraun glühend mit gelborangen Rissen, gelbe Augen |
| Mimik | eigene Form (Truhe, 40 × 32) | Truhe mit Zahnreihe, Zunge und gelbem Auge; der Kiefer klappt auf und zu |
| Ruheloser | Mensch, Kapuze | graubrauner Umhang, fahlgrüne Haut, gelbe Augen |
| Steinwächter | Golem, etwas kleiner (0,9) | grauer Stein mit violetten Rissen, fliederfarbene Augen |
| Echo | Mensch, Kapuze, durchscheinend | blassblauer Umhang, eisblaue Augen; flackert zwischen 42 % und 67 % Deckkraft |

## 4. Beute (Im Spiel)

| Gegner | Rohstoff | Chance auf Ausrüstung |
|---|---|---|
| Wolf | Wolfsfell 65 % | 5 % |
| Frostwolf | Wolfsfell 70 % | 14 % |
| Aschenhund | Glutkristall 50 % | 14 % |
| Riesenspinne | Spinnenseide 60 % | 14 % |
| Bandit | – | 25 % |
| alle anderen normalen Gegner (auch Glutgeist und Mimik) | – | 14 % |
| alle Endgegner (auch Nhal, kurz vor dem Ende „Der Erlöser“) | – | 100 %, mindestens „fein“, 70 % mit Bonus |

Ausrüstungsstufe und Güte nach Grauufer_Kampfsystem_RevXX.md, Abschnitt 10.

## 5. Schwächen und Stärken (Geplant)

Noch nicht im Spiel. Schwäche: Schaden × 1,5. Stärke: Schaden × 0,5.

| Gegner | schwach gegen | stark gegen | Besonderheit |
|---|---|---|---|
| Ghul, Ertrunkener, Moorleiche | Feuer, Totenglocke | – | ersticken nicht im Wasserkerker |
| Skelettkrieger, Knochenkönig | stumpf, Runenklinge | Bögen | ersticken nicht im Wasserkerker |
| Wolf, Frostwolf | Feuer | – | Frostwolf stark gegen Eis |
| Aschenhund | Eis, Wasser | Feuer | Wasserkerker verdampft nach 1 Zug, doppelter Schaden |
| Harpyie, Sturmherr | Bögen, Netzwerfer | Blitz | fliegend: immun gegen Erdbeben und Bebenstein |
| Riesenspinne, Spinnenkönigin | Feuer | – | – |
| Sandskorpion | Eis | stumpf | – |
| Bandit, Bandenführer | – | – | Rauchtopf wirkt doppelt so lang |
| Golems (Gruft, Kristall) | stumpf, Blitz, Steinfaust | Klingen, Dolche | halber Schaden durch Erdbeben, kein Erstickungsschaden |
| Glutfürst | Eis, Wasser | Feuer | – |
| Eisgolem | Feuer | Eis | – |
| Tiefenwächter | Blitz | Wasser | – |

## 6. Verhalten und Eigenheiten (Geplant)

Im Spiel verhalten sich bisher alle Gegner gleich (siehe Kampfsystem, Abschnitt 7). Geplant sind eigene Verhaltensweisen:

| Gegner | Eigenheit |
|---|---|
| Ghul | kommt auch außerhalb des Gräberfelds vor |
| Wolf, Frostwolf | jagen im Rudel: steht ein zweiter Wolf neben dem Spieler, +1 Schaden |
| Bandit | flieht bei weniger als 25 % Leben |
| Harpyie | greift an und zieht sich danach 2 Felder zurück |
| Riesenspinne | 20 % Chance, den Spieler 1 Zug festzusetzen (Netz) |
| Sandskorpion | 25 % Chance auf Gift (Schaden über 3 Züge) |
| Skelettkrieger | zerfällt, steht nach 3 Zügen einmal wieder auf, wenn kein stumpfer Schlag den Rest erledigt |
| Moorleiche | taucht aus dem Moorboden auf, unsichtbar bis 3 Felder Abstand |
| Aschenhund | hinterlässt brennende Felder |

Endgegner-Phasen: siehe Kampfsystem, Abschnitt 12.

## 7. Hintergrund (Im Spiel und Geplant)

| Gegner | Hintergrund |
|---|---|
| Ghul, Ertrunkener, Moorleiche | Im Spiel: Seit der Riss aufging, stehen die Toten wieder auf. |
| Gruftwächter, Tiefenwächter, Glutfürst, Sturmherr | Im Spiel: frühere Hüter der Splitter, von deren Macht verzehrt (Story, Abschnitt 6). Geplant: Der Tiefenwächter war Tobes Bruder. |
| Bandit, Bandenführer | Im Spiel: Eine Bande nutzt das Chaos und überfällt Reisende. |
| Riesenspinne, Spinnenkönigin | Geplant: von der fremden Magie des Risses angelockt und mit ihr gewachsen |
| Eisgolem | Geplant: entstanden, weil Wasser und Luft ohne ihre Titanen aus dem Gleichgewicht geraten sind |
| Knochenkönig, Skelettkrieger | Geplant: der Priesterkönig, der den ersten Riss schließen wollte, und sein Gefolge |
| Kristallwächter | Geplant: von den Titanen geschaffen, um das Sturmzepter zu hüten; folgt noch immer seinem alten Auftrag |

## 8. Neue Gegner (Geplant)

Für Gebiete, die bisher nur Gegner aus anderen Gebieten haben, und für die Gegner, die in Waffenliste und Story erwähnt sind.

| Gegner | Gebiet | Leben | Angriff | EP | Art | Eigenheit |
|---|---|---|---|---|---|---|
| Nebelgeist | Nebelwald | 18 | 3–6 | 26 | untot | nur in Nebel sichtbar, Waffen ohne Element treffen nur zu 50 % |
| Wurzelschrat | Nebelwald | 34 | 5–8 | 40 | Pflanze | bewegt sich nicht, Reichweite 2, schwach gegen Feuer |
| Moorschlange | Fahlmoor | 16 | 3–5 | 20 | Tier | Gift, taucht im Wasser unter |
| Sandwurm | Sengende Ödnis | 40 | 6–9 | 50 | Tier | gräbt sich ein und taucht neben dem Spieler auf (wie der Erdbohrer) |
| Eisgeist | Frostmark | 20 | 4–6 | 28 | Geist | Treffer verlangsamen 1 Zug |
| Gefallener Fremder | wandernd | 30 | 5–8 | 45 | Mensch | ein anderer Fremder aus dem Riss, der den Verstand verloren hat (Story, Abschnitt 11) |
| Schatten der Leere | Steinkreis, nach allen Splittern | 120 | 8–12 | – | Leere | möglicher Endkampf einer Fortsetzung (Story, Abschnitt 9) |

## 9. Hinweise für die Umsetzung

- Werte als Daten in `data/enemies.ts`, Aussehen in `data/enemyLooks.ts`, Vorkommen in `data/spawns.ts`.
- Jeder neue Gegner braucht: Werte, Aussehen, Vorkommen, Beute und Todesmeldung.
- Neue Gegner zuerst in dieser Datei eintragen, dann umsetzen; Änderungen erhöhen die Revisionsnummer.
