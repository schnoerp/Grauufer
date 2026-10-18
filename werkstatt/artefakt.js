// Baut aus werkstatt/baukasten.html (Haus-Baukasten) oder werkstatt/avatarbaukasten.html (Avatar-Baukasten, seit Spiel-Rev 122)
// eine eigenständige Seite für Claude (Artifact): three.js und das Modell eingebettet, ohne eigenes Dokumentgerüst.
// Gespeicherte Häuser bzw. Figuren landen dort im gemeinsamen Speicher (db), den Claude lesen kann.
// Aufruf: node werkstatt/artefakt.js <Zieldatei> [avatar]
const fs = require('fs'), path = require('path');
const DIR = __dirname, ziel = process.argv[2];
if (!ziel) { console.error('Zieldatei fehlt: node werkstatt/artefakt.js <Zieldatei> [avatar]'); process.exit(1); }
const AVATAR = process.argv[3] === 'avatar';
const SEITE = AVATAR ? { html: 'avatarbaukasten.html', modell: 'modelle/avatar.js', titel: 'Avatar-Baukasten' } : { html: 'baukasten.html', modell: 'modelle/hausbau.js', titel: 'Haus-Baukasten' };
let h = fs.readFileSync(path.join(DIR, SEITE.html), 'utf8');
const ein = (tag, datei) => { const src = fs.readFileSync(path.join(DIR, datei), 'utf8');
  if (/<\/script/i.test(src)) throw new Error(datei + ' enthält </script>'); if (!h.includes(tag)) throw new Error(tag + ' fehlt');
  h = h.replace(tag, () => '<script>' + src + '</script>'); };
ein('<script src="lib/three.min.js"></script>', 'lib/three.min.js');
ein(`<script src="${SEITE.modell}"></script>`, SEITE.modell);
if (AVATAR) ein('<script src="modelle/formfeld.js"></script>', 'modelle/formfeld.js');
h = h.replace(/<!doctype html>\s*<html[^>]*><head><meta charset="utf-8"><meta name="viewport"[^>]*>\s*/i, '')
  .replace('</head>\n<body>', '').replace(/<\/body><\/html>\s*$/, '');
h = h.replace(`<title>Grauufer – ${SEITE.titel}</title>`, `<title>Grauufer ${SEITE.titel}</title>\n<meta name="claude:viewport-fit-sides" content="cover">`);
if (/<head>|<body>|<html/i.test(h)) throw new Error('Dokumentgerüst nicht vollständig entfernt');
fs.writeFileSync(ziel, h);
console.log('Seite geschrieben:', ziel, Math.round(h.length / 1024) + ' KB');
