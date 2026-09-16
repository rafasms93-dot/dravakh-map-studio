import { DRAVAKH_PROJECT, DRAVAKH_PROVINCES } from "@/data/dravakh-project";
import type { Province } from "@/generators/provinces-generator";
import type { State } from "@/generators/states-generator";
import provincePlan from "../../maps/dravakh-province-anchors-v1.json";

type TerrainBias = "highland" | "lowland" | "neutral";
type QueueItem = { cell: number; cost: number; province: number };
type ProvinceShape = { xWeight: number; yWeight: number; terrain: TerrainBias };

const COLORS = [
  "#657886",
  "#8a7a52",
  "#596b63",
  "#805a47",
  "#87929a",
  "#695f6f",
  "#6e6658",
  "#766447",
  "#6d7358",
  "#775f50",
  "#64635e",
  "#6a6b58",
  "#625b72",
  "#7b6653",
  "#5e584c"
] as const;

const SHAPES: Record<string, ProvinceShape> = {
  "dreamrest": { xWeight: 1, yWeight: 1, terrain: "lowland" },
  "sanctum-crest": { xWeight: 1, yWeight: 0.85, terrain: "highland" },
  "white-keep": { xWeight: 1, yWeight: 1, terrain: "highland" },
  highhallow: { xWeight: 1, yWeight: 1, terrain: "highland" },
  "soldiers-wall": { xWeight: 0.55, yWeight: 1.8, terrain: "neutral" },
  "citadel-reach": { xWeight: 1, yWeight: 1, terrain: "neutral" },
  "swiftstride-pass": { xWeight: 1.35, yWeight: 0.75, terrain: "neutral" },
  "kings-road": { xWeight: 1.8, yWeight: 0.65, terrain: "neutral" },
  hearthkeep: { xWeight: 1.25, yWeight: 1.25, terrain: "neutral" },
  "ironforge-reaches": { xWeight: 1, yWeight: 1, terrain: "highland" },
  "alliance-high": { xWeight: 1, yWeight: 1, terrain: "highland" },
  rivermend: { xWeight: 1, yWeight: 1, terrain: "lowland" },
  "harvest-hall": { xWeight: 1, yWeight: 1, terrain: "lowland" },
  "ironbank-ridge": { xWeight: 1, yWeight: 1, terrain: "highland" },
  "highfest-haven": { xWeight: 1, yWeight: 1, terrain: "lowland" }
};

class MinHeap {
  private items: QueueItem[] = [];

  get size() {
    return this.items.length;
  }

  push(item: QueueItem) {
    this.items.push(item);
    for (let index = this.items.length - 1; index > 0; ) {
      const parent = Math.floor((index - 1) / 2);
      if (this.items[parent].cost <= item.cost) break;
      this.items[index] = this.items[parent];
      index = parent;
    }
    let index = this.items.indexOf(item);
    this.items[index] = item;
  }

  pop(): QueueItem {
    const root = this.items[0];
    const last = this.items.pop()!;
    if (!this.items.length) return root;
    this.items[0] = last;
    for (let index = 0; ; ) {
      const left = index * 2 + 1;
      const right = left + 1;
      let next = index;
      if (left < this.items.length && this.items[left].cost < this.items[next].cost) next = left;
      if (right < this.items.length && this.items[right].cost < this.items[next].cost) next = right;
      if (next === index) break;
      [this.items[index], this.items[next]] = [this.items[next], this.items[index]];
      index = next;
    }
    return root;
  }
}

const normalizedPoint = (cell: number): [number, number] => [
  pack.cells.p[cell][0] / graphWidth,
  pack.cells.p[cell][1] / graphHeight
];

function nearestLandCell(x: number, y: number): number {
  let best = -1;
  let bestDistance = Infinity;
  for (const cell of pack.cells.i) {
    if (pack.cells.h[cell] < 20) continue;
    const [px, py] = normalizedPoint(cell);
    const distance = (px - x) ** 2 + (py - y) ** 2;
    if (distance >= bestDistance) continue;
    best = cell;
    bestDistance = distance;
  }
  if (best < 0) throw new Error("Dravakh province partition requires at least one land cell");
  return best;
}

function nearestBurg(cell: number, provinceId?: number) {
  const [x, y] = pack.cells.p[cell];
  let selected = pack.burgs[0];
  let bestDistance = Infinity;
  for (const burg of pack.burgs) {
    if (!burg.i || burg.removed || pack.cells.h[burg.cell] < 20) continue;
    if (provinceId && pack.cells.province[burg.cell] !== provinceId) continue;
    const distance = (burg.x - x) ** 2 + (burg.y - y) ** 2;
    if (distance >= bestDistance) continue;
    selected = burg;
    bestDistance = distance;
  }
  return selected;
}

function terrainPenalty(height: number, terrain: TerrainBias): number {
  if (terrain === "highland") return height < 38 ? (38 - height) * 0.00022 : 0;
  if (terrain === "lowland") return height > 48 ? (height - 48) * 0.00028 : 0;
  return 0;
}

function edgeCost(from: number, to: number, provinceId: number): number {
  const definition = provincePlan.provinces[provinceId - 1];
  const shape = SHAPES[definition.id];
  const [x1, y1] = normalizedPoint(from);
  const [x2, y2] = normalizedPoint(to);
  const step = Math.hypot((x2 - x1) * shape.xWeight, (y2 - y1) * shape.yWeight);
  const slope = Math.abs(pack.cells.h[to] - pack.cells.h[from]) * 0.00018;
  const river = pack.cells.r[to] && pack.cells.r[to] !== pack.cells.r[from] ? 0.0025 : 0;
  return step + slope + river + terrainPenalty(pack.cells.h[to], shape.terrain);
}

function assignConnectedLand(seedCells: number[]): Uint16Array {
  const provinceIds = new Uint16Array(pack.cells.i.length);
  const costs = new Float64Array(pack.cells.i.length);
  costs.fill(Infinity);
  const queue = new MinHeap();

  seedCells.forEach((cell, index) => {
    const province = index + 1;
    provinceIds[cell] = province;
    costs[cell] = 0;
    queue.push({ cell, cost: 0, province });
  });

  while (queue.size) {
    const current = queue.pop();
    if (current.cost !== costs[current.cell] || provinceIds[current.cell] !== current.province) continue;

    for (const next of pack.cells.c[current.cell]) {
      if (pack.cells.h[next] < 20) continue;
      const cost = current.cost + edgeCost(current.cell, next, current.province);
      if (cost >= costs[next]) continue;
      costs[next] = cost;
      provinceIds[next] = current.province;
      queue.push({ cell: next, cost, province: current.province });
    }
  }

  return provinceIds;
}

function assignDetachedFeatures(provinceIds: Uint16Array): void {
  const detached = new Map<number, number[]>();
  for (const cell of pack.cells.i) {
    if (pack.cells.h[cell] < 20 || provinceIds[cell]) continue;
    const feature = pack.cells.f[cell];
    const cells = detached.get(feature) ?? [];
    cells.push(cell);
    detached.set(feature, cells);
  }

  for (const cells of detached.values()) {
    const center = cells.reduce<[number, number]>((sum, cell) => {
      const [x, y] = normalizedPoint(cell);
      return [sum[0] + x, sum[1] + y];
    }, [0, 0]);
    center[0] /= cells.length;
    center[1] /= cells.length;

    let province = 1;
    let bestDistance = Infinity;
    provincePlan.provinces.forEach((anchor, index) => {
      const distance = (center[0] - anchor.x) ** 2 + (center[1] - anchor.y) ** 2;
      if (distance >= bestDistance) return;
      bestDistance = distance;
      province = index + 1;
    });
    cells.forEach(cell => (provinceIds[cell] = province));
  }
}

function normalizeKingdom(hearthkeepCell: number, provinceIds: Uint16Array): State {
  const template = pack.states.find(state => state.i && !state.removed);
  const neutral = pack.states[0];
  if (!template || !neutral) throw new Error("Dravakh province partition requires generated state templates");

  const capital = nearestBurg(hearthkeepCell);
  const state: State = {
    ...structuredClone(template),
    i: 1,
    name: DRAVAKH_PROJECT.defaultKingdomName,
    fullName: `Kingdom of ${DRAVAKH_PROJECT.defaultKingdomName}`,
    form: "Monarchy",
    formName: "Kingdom",
    center: hearthkeepCell,
    capital: capital?.i ?? 0,
    culture: pack.cells.culture[hearthkeepCell],
    color: "#514535",
    expansionism: 1,
    lock: true,
    removed: false,
    provinces: DRAVAKH_PROVINCES.map((_, index) => index + 1),
    neighbors: [],
    campaigns: [],
    diplomacy: [],
    military: []
  };

  const stateIds = new Uint16Array(pack.cells.i.length);
  for (const cell of pack.cells.i) if (pack.cells.h[cell] >= 20 && provinceIds[cell]) stateIds[cell] = 1;
  pack.cells.state = stateIds;
  pack.states = [neutral, state];

  for (const burg of pack.burgs) {
    if (!burg.i || burg.removed) continue;
    burg.state = pack.cells.h[burg.cell] >= 20 ? 1 : 0;
    burg.capital = burg.i === state.capital ? 1 : 0;
  }

  return state;
}

export function applyDravakhProvinces() {
  if (provincePlan.provinces.length !== DRAVAKH_PROVINCES.length || DRAVAKH_PROVINCES.length !== 15) {
    throw new Error("Dravakh province partition requires exactly 15 canonical definitions");
  }

  const seedCells = provincePlan.provinces.map(anchor => nearestLandCell(anchor.x, anchor.y));
  if (new Set(seedCells).size !== 15) throw new Error("Dravakh province anchors must resolve to 15 distinct land cells");

  const provinceIds = assignConnectedLand(seedCells);
  assignDetachedFeatures(provinceIds);
  pack.cells.province = provinceIds;

  const hearthkeepIndex = provincePlan.provinces.findIndex(province => province.id === "hearthkeep");
  const state = normalizeKingdom(seedCells[hearthkeepIndex], provinceIds);

  const provinces: Province[] = [0 as unknown as Province];
  DRAVAKH_PROVINCES.forEach((definition, index) => {
    const i = index + 1;
    const burg = nearestBurg(seedCells[index], i);
    provinces.push({
      i,
      state: 1,
      lock: true,
      center: seedCells[index],
      burg: burg?.i ?? 0,
      name: definition.name,
      formName: "Province",
      fullName: definition.name,
      color: COLORS[index],
      coa: structuredClone(burg?.coa ?? state.coa)
    });
  });

  pack.provinces = provinces;
  Provinces.getPoles();

  return {
    kingdom: state.name,
    provinceCount: provinces.length - 1,
    provinceNames: provinces.slice(1).map(province => province.name),
    seedCells
  };
}
