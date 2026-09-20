import { DRAVAKH_PROVINCES } from "@/data/dravakh-project";

export const DRAVAKH_GEOGRAPHY_VERSION = "dravakh-geographic-detail-v1";

const BIOME = {
  marine: 0,
  hotDesert: 1,
  coldDesert: 2,
  savanna: 3,
  grassland: 4,
  tropicalSeasonalForest: 5,
  temperateDeciduousForest: 6,
  tropicalRainforest: 7,
  temperateRainforest: 8,
  taiga: 9,
  tundra: 10,
  glacier: 11,
  wetland: 12
} as const;

const PROVINCE_ID_BY_INDEX = new Map(DRAVAKH_PROVINCES.map((province, index) => [index + 1, province.id]));

const isCoastal = (cell: number): boolean => pack.cells.c[cell].some(neighbor => pack.cells.h[neighbor] < 20);

const isNearRiver = (cell: number): boolean =>
  Boolean(pack.cells.r[cell]) || pack.cells.c[cell].some(neighbor => Boolean(pack.cells.r[neighbor]));

const getTemperature = (cell: number): number => grid.cells.temp[pack.cells.g[cell]];

function selectBiome(cell: number, provinceId: string): number {
  const height = pack.cells.h[cell];
  const temperature = getTemperature(cell);
  const nearRiver = isNearRiver(cell);
  const coastal = isCoastal(cell);

  switch (provinceId) {
    case "rivermend":
      if (nearRiver && height < 45) return BIOME.wetland;
      if (height < 34) return BIOME.grassland;
      return BIOME.temperateDeciduousForest;

    case "harvest-hall":
      if (nearRiver && height < 30) return BIOME.wetland;
      if (height < 43) return BIOME.grassland;
      return BIOME.temperateDeciduousForest;

    case "dreamrest":
      if (nearRiver && height < 31) return BIOME.wetland;
      if (height < 39) return BIOME.temperateRainforest;
      if (height < 55) return BIOME.temperateDeciduousForest;
      return temperature < 2 ? BIOME.taiga : BIOME.temperateDeciduousForest;

    case "ironforge-reaches":
      if (height >= 49) return BIOME.coldDesert;
      if (height >= 38) return BIOME.grassland;
      return BIOME.temperateDeciduousForest;

    case "white-keep":
      if (temperature < -4 || height >= 72) return BIOME.glacier;
      if (height >= 42) return BIOME.tundra;
      return BIOME.taiga;

    case "sanctum-crest":
      if (temperature < -4 || height >= 82) return BIOME.glacier;
      if (height >= 65) return BIOME.tundra;
      if (height >= 45) return BIOME.taiga;
      return BIOME.temperateDeciduousForest;

    case "citadel-reach":
      if (coastal && height < 42) return BIOME.temperateRainforest;
      if (height >= 60) return BIOME.coldDesert;
      return BIOME.temperateDeciduousForest;

    case "kings-road":
      if (nearRiver && height < 28) return BIOME.wetland;
      if (height >= 48) return BIOME.temperateDeciduousForest;
      return BIOME.grassland;

    case "swiftstride-pass":
      if (height >= 54) return BIOME.coldDesert;
      if (height >= 40) return BIOME.temperateDeciduousForest;
      return BIOME.grassland;

    case "hearthkeep":
      if (nearRiver && height < 28) return BIOME.wetland;
      if (height >= 45) return BIOME.temperateDeciduousForest;
      return BIOME.grassland;

    case "soldiers-wall":
      if (height >= 58) return BIOME.taiga;
      if (height >= 40) return BIOME.temperateDeciduousForest;
      return BIOME.grassland;

    case "alliance-high":
      if (height >= 65) return BIOME.taiga;
      if (height >= 45) return BIOME.temperateDeciduousForest;
      return BIOME.grassland;

    case "highhallow":
      if (temperature < 0 && height >= 65) return BIOME.tundra;
      if (height >= 52) return BIOME.taiga;
      if (nearRiver && height < 31) return BIOME.wetland;
      return BIOME.temperateRainforest;

    case "highfest-haven":
      if (coastal && nearRiver && height < 27) return BIOME.wetland;
      if (height >= 45) return BIOME.temperateDeciduousForest;
      return BIOME.grassland;

    case "ironbank-ridge":
      if (height >= 55) return BIOME.coldDesert;
      if (height >= 40) return BIOME.temperateDeciduousForest;
      return BIOME.grassland;

    default:
      return pack.cells.biome[cell];
  }
}

function regenerateReliefDeterministically(): void {
  const originalRandom = Math.random;
  let state = 0x44524156;

  Math.random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };

  try {
    Relief.generate();
  } finally {
    Math.random = originalRandom;
  }
}

export function applyDravakhGeography() {
  const before = Array.from(pack.cells.biome as ArrayLike<number>);
  const provinceBiomeCounts = new Map<number, Map<number, number>>();

  for (const cell of pack.cells.i) {
    if (pack.cells.h[cell] < 20) {
      pack.cells.biome[cell] = BIOME.marine;
      continue;
    }

    const provinceIndex = pack.cells.province[cell];
    const provinceId = PROVINCE_ID_BY_INDEX.get(provinceIndex);
    if (!provinceId) continue;

    const biome = selectBiome(cell, provinceId);
    pack.cells.biome[cell] = biome;

    const counts = provinceBiomeCounts.get(provinceIndex) ?? new Map<number, number>();
    counts.set(biome, (counts.get(biome) ?? 0) + 1);
    provinceBiomeCounts.set(provinceIndex, counts);
  }

  regenerateReliefDeterministically();

  const changedCells = before.reduce(
    (count, biome, cell) => count + Number(pack.cells.h[cell] >= 20 && pack.cells.biome[cell] !== biome),
    0
  );

  return {
    version: DRAVAKH_GEOGRAPHY_VERSION,
    changedCells,
    reliefIconCount: pack.relief.length,
    provinces: DRAVAKH_PROVINCES.map((province, index) => ({
      id: province.id,
      name: province.name,
      biomes: Object.fromEntries(provinceBiomeCounts.get(index + 1) ?? [])
    }))
  };
}
