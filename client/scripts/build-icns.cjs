const fs = require('fs');
const path = require('path');

const PNG_DIR = path.join(__dirname, '..', 'build', 'icons', 'png');
const MAC_DIR = path.join(__dirname, '..', 'build', 'icons', 'mac');
const SIZES = [1024, 512, 256, 128, 64, 32, 16];

fs.mkdirSync(MAC_DIR, { recursive: true });

const typeMap = {
  16: 'icp4', 32: 'icp5', 64: 'icp6', 128: 'ic07',
  256: 'ic08', 512: 'ic09', 1024: 'ic10',
};

const entries = SIZES.map(s => {
  const type = typeMap[s];
  if (!type) return null;
  const p = path.join(PNG_DIR, s + 'x' + s + '.png');
  if (!fs.existsSync(p)) return null;
  const data = fs.readFileSync(p);
  return { type, data };
}).filter(Boolean);

const dataSize = entries.reduce((sum, e) => sum + e.data.length, 0);
const totalSize = 8 + entries.length * 8 + dataSize;

const buf = Buffer.alloc(totalSize);
let offset = 0;

buf.write('icns', offset, 4, 'ascii');
offset += 4;
buf.writeUInt32BE(totalSize, offset);
offset += 4;

for (const e of entries) {
  const entryLen = 8 + e.data.length;
  buf.write(e.type, offset, 4, 'ascii');
  offset += 4;
  buf.writeUInt32BE(entryLen, offset);
  offset += 4;
  e.data.copy(buf, offset);
  offset += e.data.length;
}

const outPath = path.join(MAC_DIR, 'icon.icns');
fs.writeFileSync(outPath, buf);
console.log('Generated ' + outPath + ' — ' + buf.length + ' bytes');
