import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { deflateSync } from "node:zlib";

const WIDTH = 768;
const HEIGHT = 1152;
const OUTPUT = resolve("public/heightmaps/dravakh.png");

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const gaussian = (x, y, cx, cy, sx, sy, amplitude) =>
  amplitude * Math.exp(-0.5 * (((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2));

function superellipseField(x, y, cx, cy, rx, ry, power = 2) {
  return 1 - (Math.abs((x - cx) / rx) ** power + Math.abs((y - cy) / ry) ** power);
}

function coastNoise(x, y) {
  return (
    Math.sin(x * 31.1 + y * 11.7) * 0.030 +
    Math.sin(x * 57.7 - y * 19.3) * 0.018 +
    Math.cos(x * 17.9 + y * 43.1) * 0.016 +
    Math.sin(x * 103.3 + y * 71.9) * 0.008
  );
}

function terrainNoise(x, y) {
  return (
    Math.sin(x * 91.7 + y * 67.1) * 0.9 +
    Math.cos(x * 139.1 - y * 83.3) * 0.7 +
    Math.sin(x * 53.9 - y * 147.7) * 0.5
  );
}

function mainContinentField(x, y) {
  const lobes = [
    superellipseField(x, y, 0.48, 0.16, 0.34, 0.16, 2.4),
    superellipseField(x, y, 0.48, 0.29, 0.33, 0.17, 2.2),
    superellipseField(x, y, 0.48, 0.42, 0.21, 0.12, 2),
    superellipseField(x, y, 0.49, 0.54, 0.28, 0.17, 2.1),
    superellipseField(x, y, 0.47, 0.69, 0.32, 0.22, 2),
    superellipseField(x, y, 0.35, 0.84, 0.22, 0.15, 2.1),
    superellipseField(x, y, 0.59, 0.82, 0.22, 0.18, 2.2)
  ];

  let field = Math.max(...lobes) + coastNoise(x, y);
  field -= gaussian(x, y, 0.70, 0.80, 0.095, 0.11, 0.95); // Highfest Haven bay
  field -= gaussian(x, y, 0.23, 0.50, 0.055, 0.10, 0.45); // western inlet / Citadel coast
  field -= gaussian(x, y, 0.70, 0.23, 0.050, 0.065, 0.38); // northeastern coastal break
  field -= gaussian(x, y, 0.67, 0.41, 0.055, 0.070, 0.55); // eastern notch at the choke
  return field;
}

function highhallowField(x, y) {
  return superellipseField(x, y, 0.86, 0.40, 0.075, 0.10, 2.1) + coastNoise(x, y) * 0.45;
}

function isInsideIslet(x, y, cx, cy, rx, ry) {
  return superellipseField(x, y, cx, cy, rx, ry, 2) > 0;
}

function getHeight(x, y) {
  const mainField = mainContinentField(x, y);
  const highhallow = highhallowField(x, y);
  const islet =
    isInsideIslet(x, y, 0.91, 0.31, 0.020, 0.025) ||
    isInsideIslet(x, y, 0.925, 0.50, 0.017, 0.022) ||
    isInsideIslet(x, y, 0.80, 0.52, 0.014, 0.019);

  const inStrictChannel = x > 0.735 && x < 0.795 && y > 0.25 && y < 0.58;
  const onMainland = mainField > 0 && !inStrictChannel;
  const onHighhallow = highhallow > 0;
  const isLand = onMainland || onHighhallow || islet;
  if (!isLand) return 0;

  let height = onMainland ? 22 + 12 * clamp(mainField, 0, 1) : onHighhallow ? 24 + 13 * clamp(highhallow, 0, 1) : 23;

  // Sanctum Crest: highest north-central spine
  const sanctum = [
    [0.43, 0.15, 0.045, 0.035, 35],
    [0.49, 0.15, 0.050, 0.040, 44],
    [0.55, 0.17, 0.045, 0.040, 38],
    [0.46, 0.21, 0.050, 0.040, 33],
    [0.53, 0.24, 0.045, 0.045, 28]
  ];
  for (const feature of sanctum) height += gaussian(x, y, ...feature);

  height += gaussian(x, y, 0.64, 0.20, 0.050, 0.050, 22); // White Keep
  height += gaussian(x, y, 0.38, 0.36, 0.045, 0.035, 18); // Soldier's Wall western shoulder
  height += gaussian(x, y, 0.59, 0.36, 0.045, 0.035, 18); // Soldier's Wall eastern shoulder
  height += gaussian(x, y, 0.27, 0.42, 0.035, 0.100, 15); // Citadel Reach cliffs
  height += gaussian(x, y, 0.63, 0.51, 0.055, 0.060, 42); // Ironforge Reaches
  height += gaussian(x, y, 0.66, 0.54, 0.035, 0.040, 24);
  height += gaussian(x, y, 0.62, 0.65, 0.070, 0.070, 21); // Alliance High
  height += gaussian(x, y, 0.30, 0.83, 0.065, 0.070, 35); // Ironbank Ridge
  height += gaussian(x, y, 0.36, 0.87, 0.045, 0.050, 20);
  height += gaussian(x, y, 0.86, 0.40, 0.040, 0.055, 30); // Highhallow relief

  // Lower basins: Dreamrest, Hearthkeep and the Rivermend / Harvest Hall system
  height -= gaussian(x, y, 0.29, 0.22, 0.110, 0.080, 7);
  height -= gaussian(x, y, 0.49, 0.51, 0.080, 0.060, 4);
  height -= gaussian(x, y, 0.49, 0.69, 0.110, 0.100, 9);
  height -= gaussian(x, y, 0.34, 0.72, 0.120, 0.090, 5);

  height += terrainNoise(x, y);
  return clamp(height, 20.5, 100);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function encodePng(pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8; // 8-bit
  ihdr[9] = 0; // grayscale
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const scanlines = Buffer.alloc((WIDTH + 1) * HEIGHT);
  for (let y = 0; y < HEIGHT; y++) {
    const rowOffset = y * (WIDTH + 1);
    scanlines[rowOffset] = 0;
    pixels.copy(scanlines, rowOffset + 1, y * WIDTH, (y + 1) * WIDTH);
  }

  const idat = deflateSync(scanlines, { level: 9 });
  return Buffer.concat([signature, pngChunk("IHDR", ihdr), pngChunk("IDAT", idat), pngChunk("IEND", Buffer.alloc(0))]);
}

const pixels = Buffer.alloc(WIDTH * HEIGHT);
for (let py = 0; py < HEIGHT; py++) {
  const y = py / (HEIGHT - 1);
  for (let px = 0; px < WIDTH; px++) {
    const x = px / (WIDTH - 1);
    const height = getHeight(x, y);
    pixels[py * WIDTH + px] = Math.round((height / 100) * 255);
  }
}

const png = encodePng(pixels);
await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, png);

const hash = createHash("sha256").update(png).digest("hex");
console.log(`Generated ${OUTPUT}`);
console.log(`Dimensions: ${WIDTH}x${HEIGHT}`);
console.log(`SHA256: ${hash}`);
