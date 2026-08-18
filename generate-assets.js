const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Function to render the chosen "Slashed Circle / Ø" logo at high resolution with anti-aliasing
function createLogoPNG(width, height) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const outerR = width * 0.32;
  const innerR = width * 0.24;

  // Diagonal slash angle ~45 degrees (from bottom-left to top-right)
  const angle = -Math.PI / 4; // 45 degrees
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const slashLength = width * 0.96;
  const maxSlashHalfWidth = width * 0.038;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 1. Ring calculation
      let inRing = 0;
      if (dist >= innerR && dist <= outerR) {
        // Anti-alias edges
        const edge1 = Math.min(1, Math.max(0, dist - innerR));
        const edge2 = Math.min(1, Math.max(0, outerR - dist));
        inRing = Math.min(edge1, edge2);
      }

      // 2. Tapered Diagonal Slash calculation
      // Rotate coordinates along slash axis
      const u = dx * cosA + dy * sinA; // along slash
      const v = -dx * sinA + dy * cosA; // perpendicular to slash

      let inSlash = 0;
      if (Math.abs(u) <= slashLength / 2) {
        // Slash thickness tapers from center to sharp needle points
        const taper = 1 - Math.pow(Math.abs(u) / (slashLength / 2), 1.5);
        const currentHalfWidth = maxSlashHalfWidth * Math.max(0, taper);
        const distFromCenterline = Math.abs(v);

        if (distFromCenterline <= currentHalfWidth) {
          inSlash = Math.min(1, Math.max(0, (currentHalfWidth - distFromCenterline) + 0.5));
        }
      }

      const coverage = Math.min(1, Math.max(inRing, inSlash));

      // Background color: #121214 (18, 18, 20)
      // Foreground color: #FFFFFF (255, 255, 255)
      const r = Math.round(18 + (255 - 18) * coverage);
      const g = Math.round(18 + (255 - 18) * coverage);
      const b = Math.round(20 + (255 - 20) * coverage);

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = 255;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (((crc ^ byte) & 1) ? 0xedb88320 : 0);
        byte >>>= 1;
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(len + 12);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    const crcVal = crc32(chunk.subarray(4, len + 8));
    chunk.writeUInt32BE(crcVal, len + 8);
    return chunk;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate the 1024x1024 icons and splash assets
const iconBuffer = createLogoPNG(1024, 1024);
const faviconBuffer = createLogoPNG(128, 128);

fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuffer);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), iconBuffer);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), iconBuffer);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), faviconBuffer);

console.log('✅ Generated official Unreel logo assets into /assets directory!');
