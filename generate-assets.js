const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Function to render the chosen "U with center dot" logo with smooth anti-aliasing
function createULogoPNG(width, height) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;

  // Proportions scaled to width
  const stemWidth = width * 0.155;
  const outerRadius = width * 0.285;
  const innerRadius = outerRadius - stemWidth;
  const stemTop = height * 0.20;
  const bendCenterY = height * 0.50;
  const dotRadius = width * 0.040;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      const dx = x - cx;
      const dy = y - bendCenterY;
      const distFromBend = Math.sqrt(dx * dx + dy * dy);

      let inU = 0;

      // 1. Top vertical stems (above bend center)
      if (y >= stemTop && y <= bendCenterY) {
        const inLeftStem = (x >= cx - outerRadius && x <= cx - innerRadius);
        const inRightStem = (x >= cx + innerRadius && x <= cx + outerRadius);
        if (inLeftStem || inRightStem) {
          inU = 1.0;
        }
      }
      // 2. Bottom rounded U bend (below bend center)
      else if (y > bendCenterY) {
        if (distFromBend >= innerRadius && distFromBend <= outerRadius) {
          const edgeInner = Math.min(1, Math.max(0, distFromBend - innerRadius));
          const edgeOuter = Math.min(1, Math.max(0, outerRadius - distFromBend));
          inU = Math.min(edgeInner, edgeOuter);
        }
      }

      // 3. Center Focal Dot
      const distFromCenter = Math.sqrt((x - cx) * (x - cx) + (y - (bendCenterY + dotRadius * 0.2)) * (y - (bendCenterY + dotRadius * 0.2)));
      let inDot = 0;
      if (distFromCenter <= dotRadius) {
        inDot = Math.min(1, Math.max(0, (dotRadius - distFromCenter) + 0.5));
      }

      const coverage = Math.min(1, Math.max(inU, inDot));

      // Background: #121214 (18, 18, 20)
      // Foreground: #FFFFFF (255, 255, 255)
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

const iconBuffer = createULogoPNG(1024, 1024);
const faviconBuffer = createULogoPNG(128, 128);

fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuffer);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), iconBuffer);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), iconBuffer);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), faviconBuffer);

console.log('✅ Generated official Unreel "U with Dot" logo assets into /assets');
