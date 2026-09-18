import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { inflateSync } from "node:zlib";

const FILE = resolve("public/heightmaps/dravakh.png");
const EXPECTED_WIDTH = 768;
const EXPECTED_HEIGHT = 1152;

function readChunks(buffer) {
  const signature = buffer.subarray(0, 8);
  const expected = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!signature.equals(expected)) throw new Error("dravakh.png is not a valid PNG file");

  const chunks = [];
  let offset = 8;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    chunks.push({ type, data });
    offset += 12 + length;
    if (type === "IEND") break;
  }
  return chunks;
}

function decodeGrayscalePng(buffer) {
  const chunks = readChunks(buffer);
  const ihdr = chunks.find(chunk => chunk.type === "IHDR")?.data;
  if (!ihdr) throw new Error("dravakh.png has no IHDR chunk");

  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const bitDepth = ihdr[8];
  const colorType = ihdr[9];
  if (bitDepth !== 8 || colorType !== 0) {
    throw new Error(`Expected 8-bit grayscale PNG, got bitDepth=${bitDepth} colorType=${colorType}`);
  }

  const compressed = Buffer.concat(chunks.filter(chunk => chunk.type === "IDAT").map(chunk => chunk.data));
  const raw = inflateSync(compressed);
  const rowSize = width + 1;
  if (raw.length !== rowSize * height) throw new Error("Unexpected PNG scanline size");

  const pixels = Buffer.alloc(width * height);
  for (let y = 0; y < height; y++) {
    const row = y * rowSize;
    const filter = raw[row];
    if (filter !== 0) throw new Error(`Unexpected PNG filter ${filter} at row ${y}`);
    raw.copy(pixels, y * width, row + 1, row + 1 + width);
  }

  return { width, height, pixels };
}

function sample(image, x, y) {
  const px = Math.round(x * (image.width - 1));
  const py = Math.round(y * (image.height - 1));
  return image.pixels[py * image.width + px];
}

function toAzgaarHeight(gray) {
  const lightness = gray / 255;
  const powered = lightness < 0.2 ? lightness : 0.2 + (lightness - 0.2) ** 0.8;
  return Math.max(0, Math.min(100, Math.floor(powered * 100)));
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

const png = await readFile(FILE);
const image = decodeGrayscalePng(png);

expect(image.width === EXPECTED_WIDTH, `Expected width ${EXPECTED_WIDTH}, got ${image.width}`);
expect(image.height === EXPECTED_HEIGHT, `Expected height ${EXPECTED_HEIGHT}, got ${image.height}`);

const heights = Object.fromEntries(
  Object.entries({
    sanctum: [0.49, 0.18],
    whiteKeep: [0.64, 0.2],
    ironforge: [0.63, 0.51],
    ironbank: [0.3, 0.83],
    highhallow: [0.86, 0.4],
    dreamrest: [0.29, 0.22],
    hearthkeep: [0.49, 0.51],
    rivermend: [0.49, 0.69],
    harvestHall: [0.34, 0.72],
    highhallowChannel: [0.765, 0.4],
    highfestBay: [0.7, 0.8],
    citadelInlet: [0.23, 0.5],
    outerOcean: [0.98, 0.4]
  }).map(([name, [x, y]]) => [name, toAzgaarHeight(sample(image, x, y))])
);

for (const id of ["sanctum", "whiteKeep", "ironforge", "ironbank", "highhallow", "dreamrest", "hearthkeep", "rivermend", "harvestHall"]) {
  expect(heights[id] >= 20, `${id} anchor must be land, got Azgaar height ${heights[id]}`);
}

for (const id of ["highhallowChannel", "highfestBay", "citadelInlet", "outerOcean"]) {
  expect(heights[id] < 20, `${id} must be water, got Azgaar height ${heights[id]}`);
}

expect(heights.sanctum >= 90, `Sanctum Crest must remain the dominant northern massif, got ${heights.sanctum}`);
expect(heights.sanctum > heights.ironforge, "Sanctum Crest must be higher than Ironforge Reaches");
expect(heights.ironforge > heights.hearthkeep, "Ironforge Reaches must remain distinct from the central basin");
expect(heights.ironbank > heights.rivermend, "Ironbank Ridge must remain elevated above Rivermend");
expect(heights.highhallow >= 45, "Highhallow must retain meaningful island relief");

console.log("Dravakh baseline validation passed");
console.table(heights);
