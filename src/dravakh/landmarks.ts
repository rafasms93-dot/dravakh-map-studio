import { DRAVAKH_PROVINCES } from "@/data/dravakh-project";
import type { Marker } from "@/generators/markers-generator";
import provincePlan from "../../maps/dravakh-province-anchors-v1.json";

export const DRAVAKH_LANDMARK_TYPE_PREFIX = "dravakh-landmark-";

type LandmarkProfile = {
  coastal?: boolean;
  river?: boolean;
  terrain?: "highland" | "lowland" | "pass" | "neutral";
};

const PROFILES: Record<string, LandmarkProfile> = {
  rivermend: { river: true, terrain: "lowland" },
  "harvest-hall": { river: true, terrain: "lowland" },
  dreamrest: { terrain: "lowland" },
  "ironforge-reaches": { terrain: "highland" },
  "white-keep": { coastal: true, terrain: "highland" },
  "sanctum-crest": { terrain: "highland" },
  "citadel-reach": { coastal: true, terrain: "highland" },
  "kings-road": { terrain: "neutral" },
  "swiftstride-pass": { terrain: "pass" },
  hearthkeep: { terrain: "neutral" },
  "soldiers-wall": { terrain: "neutral" },
  "alliance-high": { terrain: "highland" },
  highhallow: { terrain: "highland" },
  "highfest-haven": { coastal: true, terrain: "lowland" },
  "ironbank-ridge": { terrain: "highland" }
};

const CANONICAL_LANDMARKS = DRAVAKH_PROVINCES.map(definition => {
  const anchor = provincePlan.provinces.find(candidate => candidate.id === definition.id);
  if (!anchor) throw new Error(`Missing Dravakh landmark anchor: ${definition.id}`);
  if (anchor.landmark !== definition.primaryLandmark)
    throw new Error(`Dravakh landmark mismatch for ${definition.id}: ${anchor.landmark}`);
  return { definition, anchor };
});

const markerType = (id: string) => `${DRAVAKH_LANDMARK_TYPE_PREFIX}${id}`;

const normalizedPoint = (cell: number): [number, number] => [
  pack.cells.p[cell][0] / graphWidth,
  pack.cells.p[cell][1] / graphHeight
];

const normalizedDistance = (cell: number, x: number, y: number): number => {
  const [px, py] = normalizedPoint(cell);
  return Math.hypot(px - x, py - y);
};

const isCoastal = (cell: number): boolean => pack.cells.c[cell].some(neighbor => pack.cells.h[neighbor] < 20);

function terrainPenalty(cell: number, terrain: LandmarkProfile["terrain"]): number {
  const height = pack.cells.h[cell];
  if (terrain === "highland") return Math.max(0, 55 - height) * 0.003;
  if (terrain === "lowland") return Math.max(0, height - 45) * 0.002;
  if (terrain === "pass") return Math.abs(height - 35) * 0.0015;
  return 0;
}

function landmarkScore(cell: number, x: number, y: number, profile: LandmarkProfile): number {
  let score = normalizedDistance(cell, x, y);
  if (profile.coastal && !isCoastal(cell)) score += 0.2;
  if (profile.river && !pack.cells.r[cell]) score += 0.12;
  score += terrainPenalty(cell, profile.terrain);
  return score;
}

function selectLandmarkCell(provinceId: number, id: string, x: number, y: number): number {
  const all = Array.from(pack.cells.i).filter(
    cell => pack.cells.h[cell] >= 20 && pack.cells.province[cell] === provinceId
  );
  if (!all.length) throw new Error(`Dravakh landmark ${id} requires a valid province land cell`);

  const nearby = all.filter(cell => normalizedDistance(cell, x, y) <= 0.12);
  const candidates = nearby.length ? nearby : all;
  const profile = PROFILES[id] ?? { terrain: "neutral" };

  return candidates.reduce((best, cell) =>
    landmarkScore(cell, x, y, profile) < landmarkScore(best, x, y, profile) ? cell : best
  );
}

function removeExistingLandmarks(): void {
  const existing = [...(pack.markers ?? [])].filter(marker => marker.type.startsWith(DRAVAKH_LANDMARK_TYPE_PREFIX));
  existing.forEach(marker => {
    Markers.deleteMarker(marker.i);
  });
}

function setLandmarkNote(markerId: number, provinceIndex: number): void {
  const definition = DRAVAKH_PROVINCES[provinceIndex];
  const id = `marker${markerId}`;
  notes = notes.filter(note => note.id !== id);
  notes.push({
    id,
    name: definition.primaryLandmark,
    legend: `<strong>${definition.primaryLandmark}</strong><br>${definition.name} · ${definition.house}<br>${definition.category}`
  });
}

function canonicalMarkerForProvince(provinceIndex: number): Marker | undefined {
  const definition = DRAVAKH_PROVINCES[provinceIndex];
  return (pack.markers ?? []).find(marker => marker.type === markerType(definition.id));
}

export function hasPersistedCanonicalLandmarks(): boolean {
  const landmarks = (pack.markers ?? []).filter(marker => marker.type.startsWith(DRAVAKH_LANDMARK_TYPE_PREFIX));
  if (landmarks.length !== DRAVAKH_PROVINCES.length) return false;

  return DRAVAKH_PROVINCES.every((definition, index) => {
    const marker = canonicalMarkerForProvince(index);
    if (!marker) return false;
    if (pack.cells.h[marker.cell] < 20 || pack.cells.province[marker.cell] !== index + 1) return false;
    const note = notes.find(candidate => candidate.id === `marker${marker.i}`);
    return note?.name === definition.primaryLandmark;
  });
}

export function getCanonicalLandmarkSummary() {
  return DRAVAKH_PROVINCES.map((definition, index) => {
    const marker = canonicalMarkerForProvince(index);
    if (!marker) throw new Error(`Missing canonical Dravakh landmark: ${definition.primaryLandmark}`);
    return {
      id: definition.id,
      name: definition.primaryLandmark,
      province: definition.name,
      provinceId: index + 1,
      markerId: marker.i,
      cell: marker.cell,
      x: marker.x,
      y: marker.y
    };
  });
}

export function applyDravakhLandmarks() {
  if (hasPersistedCanonicalLandmarks()) {
    return { landmarkCount: DRAVAKH_PROVINCES.length, landmarks: getCanonicalLandmarkSummary(), restored: true };
  }

  removeExistingLandmarks();

  CANONICAL_LANDMARKS.forEach(({ definition, anchor }, index) => {
    const provinceId = index + 1;
    const cell = selectLandmarkCell(provinceId, definition.id, anchor.x, anchor.y);
    const [x, y] = pack.cells.p[cell];
    const marker = Markers.add({
      type: markerType(definition.id),
      icon: "◆",
      x,
      y,
      dx: 50,
      dy: 53,
      px: 10,
      size: 34,
      pin: "shield",
      fill: "#d8c7a1",
      stroke: "#423426",
      cell,
      lock: true,
      pinned: true
    } as Marker);
    setLandmarkNote(marker.i, index);
  });

  return { landmarkCount: DRAVAKH_PROVINCES.length, landmarks: getCanonicalLandmarkSummary(), restored: false };
}
