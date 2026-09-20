import { Styles } from "@/generators/styles";
import { DRAVAKH_LANDMARK_TYPE_PREFIX } from "./landmarks";

export const DRAVAKH_VISUAL_FINISH_VERSION = "dravakh-visual-finish-v1";
const VISUAL_NOTE_ID = DRAVAKH_VISUAL_FINISH_VERSION;

const CANONICAL_STYLE = {
  landmass: { fill: "#b7af99" },
  biomes: { opacity: 0.88 },
  relief: { opacity: 0.72 },
  rivers: { opacity: 0.94, fill: "#587784" },
  freshwater: { opacity: 0.78, fill: "#718895", stroke: "#4e6570", strokeWidth: 0.55 },
  frozenLake: { opacity: 0.92, fill: "#c9d4d4", stroke: "#94a7aa", strokeWidth: 0.3 },
  coastline: { opacity: 0.82, stroke: "#403a31", strokeWidth: 0.62 },
  lakeCoast: { opacity: 0.88, stroke: "#526872", strokeWidth: 0.38 },
  provinceBorder: {
    opacity: 0.86,
    stroke: "#735d40",
    strokeWidth: 0.18,
    dash: "1.1 0.65",
    linecap: "round"
  },
  provinceFill: { opacity: 0.22, fill: "#4d3d2f" },
  markers: { opacity: 1 },
  vignette: { opacity: 0.42, fill: "#17120e" },
  landmark: { fill: "#bea46e", stroke: "#3d3022", px: 10, size: 34 }
} as const;

function hasPersistedVisualFinish(): boolean {
  const metadata = notes.find(note => note.id === VISUAL_NOTE_ID);
  return metadata?.name === "Dravakh Visual Finish v1";
}

function persistVisualMetadata(): void {
  notes = notes.filter(note => note.id !== VISUAL_NOTE_ID);
  notes.push({
    id: VISUAL_NOTE_ID,
    name: "Dravakh Visual Finish v1",
    legend: "Canonical Dravakh Map Studio visual-finish styling. Preserve on .map reload."
  });
}

function styleCanonicalLandmarks(): number {
  let count = 0;
  for (const marker of pack.markers ?? []) {
    if (!marker.type.startsWith(DRAVAKH_LANDMARK_TYPE_PREFIX)) continue;
    marker.fill = CANONICAL_STYLE.landmark.fill;
    marker.stroke = CANONICAL_STYLE.landmark.stroke;
    marker.px = CANONICAL_STYLE.landmark.px;
    marker.size = CANONICAL_STYLE.landmark.size;
    marker.pin = "shield";
    marker.lock = true;
    marker.pinned = true;
    count++;
  }
  return count;
}

function applyStyleData(): void {
  styles.landmass.attrs.fill = CANONICAL_STYLE.landmass.fill;

  styles.biomes.attrs.opacity = CANONICAL_STYLE.biomes.opacity;
  styles.relief.attrs.opacity = CANONICAL_STYLE.relief.opacity;

  styles.rivers.attrs.opacity = CANONICAL_STYLE.rivers.opacity;
  styles.rivers.attrs.fill = CANONICAL_STYLE.rivers.fill;

  styles.lakes.freshwater.attrs.opacity = CANONICAL_STYLE.freshwater.opacity;
  styles.lakes.freshwater.attrs.fill = CANONICAL_STYLE.freshwater.fill;
  styles.lakes.freshwater.attrs.stroke = CANONICAL_STYLE.freshwater.stroke;
  styles.lakes.freshwater.attrs["stroke-width"] = CANONICAL_STYLE.freshwater.strokeWidth;

  styles.lakes.frozen.attrs.opacity = CANONICAL_STYLE.frozenLake.opacity;
  styles.lakes.frozen.attrs.fill = CANONICAL_STYLE.frozenLake.fill;
  styles.lakes.frozen.attrs.stroke = CANONICAL_STYLE.frozenLake.stroke;
  styles.lakes.frozen.attrs["stroke-width"] = CANONICAL_STYLE.frozenLake.strokeWidth;

  styles.coastline.sea_island.attrs.opacity = CANONICAL_STYLE.coastline.opacity;
  styles.coastline.sea_island.attrs.stroke = CANONICAL_STYLE.coastline.stroke;
  styles.coastline.sea_island.attrs["stroke-width"] = CANONICAL_STYLE.coastline.strokeWidth;

  styles.coastline.lake_island.attrs.opacity = CANONICAL_STYLE.lakeCoast.opacity;
  styles.coastline.lake_island.attrs.stroke = CANONICAL_STYLE.lakeCoast.stroke;
  styles.coastline.lake_island.attrs["stroke-width"] = CANONICAL_STYLE.lakeCoast.strokeWidth;

  styles.borders.provinceBorders.attrs.opacity = CANONICAL_STYLE.provinceBorder.opacity;
  styles.borders.provinceBorders.attrs.stroke = CANONICAL_STYLE.provinceBorder.stroke;
  styles.borders.provinceBorders.attrs["stroke-width"] = CANONICAL_STYLE.provinceBorder.strokeWidth;
  styles.borders.provinceBorders.attrs["stroke-dasharray"] = CANONICAL_STYLE.provinceBorder.dash;
  styles.borders.provinceBorders.attrs["stroke-linecap"] = CANONICAL_STYLE.provinceBorder.linecap;

  styles.provinces.attrs.opacity = CANONICAL_STYLE.provinceFill.opacity;
  styles.provinces.attrs.fill = CANONICAL_STYLE.provinceFill.fill;

  styles.markers.attrs.opacity = CANONICAL_STYLE.markers.opacity;

  styles.vignette.attrs.opacity = CANONICAL_STYLE.vignette.opacity;
  styles.vignette.attrs.fill = CANONICAL_STYLE.vignette.fill;
}

function writeStyleData(): void {
  Styles.write(
    "landmass",
    "biomes",
    "relief",
    "rivers",
    "lakes",
    "coastline",
    "borders",
    "provinces",
    "markers",
    "vignette"
  );
}

export function getDravakhVisualFinishSummary(restored: boolean) {
  return {
    version: DRAVAKH_VISUAL_FINISH_VERSION,
    restored,
    landmarkCount: (pack.markers ?? []).filter(marker => marker.type.startsWith(DRAVAKH_LANDMARK_TYPE_PREFIX)).length,
    relief: structuredClone(styles.relief.options),
    palette: {
      river: styles.rivers.attrs.fill,
      coast: styles.coastline.sea_island.attrs.stroke,
      provinceBorder: styles.borders.provinceBorders.attrs.stroke,
      vignette: styles.vignette.attrs.fill
    }
  };
}

export function applyDravakhVisualFinish() {
  if (hasPersistedVisualFinish()) {
    writeStyleData();
    return getDravakhVisualFinishSummary(true);
  }

  applyStyleData();
  const landmarkCount = styleCanonicalLandmarks();
  if (landmarkCount !== 15) throw new Error(`Visual Finish v1 expected 15 canonical landmarks, got ${landmarkCount}`);

  writeStyleData();
  persistVisualMetadata();
  return getDravakhVisualFinishSummary(false);
}
