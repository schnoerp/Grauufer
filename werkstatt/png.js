// Grafik-Werkstatt: PNG-Ausgabe für eingebettete Spielbilder
const zlib = require('zlib');

// Gerastertes Bild als PNG mit Farbtabelle (höchstens 256 Farben, durch das Raster meist um 110) – verlustfrei, etwa ein Drittel
// der Größe eines Vollfarb-PNG
function pngIndex(px, w, h) {
  const farben = new Map(), idx = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    const k = px[i * 4 + 3] ? (px[i * 4] << 16 | px[i * 4 + 1] << 8 | px[i * 4 + 2]) + 1 : 0;
    if (!farben.has(k)) farben.set(k, farben.size); idx[i] = farben.get(k);
  }
  if (farben.size > 256) throw new Error('zu viele Farben: ' + farben.size);
  const n = farben.size, pal = Buffer.alloc(n * 3), trns = Buffer.alloc(n, 255);
  for (const [k, i] of farben) { if (!k) { trns[i] = 0; continue; } const c = k - 1; pal[i * 3] = c >> 16; pal[i * 3 + 1] = c >> 8 & 255; pal[i * 3 + 2] = c & 255; }
  const roh = Buffer.alloc((w + 1) * h); // Filter 0 je Zeile: bei Farbtabellen am kleinsten
  for (let y = 0; y < h; y++) idx.copy(roh, y * (w + 1) + 1, y * w, y * w + w);
  const crcT = []; for (let i = 0; i < 256; i++) { let c = i; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[i] = c >>> 0; }
  const crc = b => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const teil = (typ, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(typ), d]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 3;
  return 'data:image/png;base64,' + Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), teil('IHDR', ih), teil('PLTE', pal), teil('tRNS', trns),
    teil('IDAT', zlib.deflateSync(roh, { level: 9 })), teil('IEND', Buffer.alloc(0))]).toString('base64');
}
module.exports = { pngIndex };
