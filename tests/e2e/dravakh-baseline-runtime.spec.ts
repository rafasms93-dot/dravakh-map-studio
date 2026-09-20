import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { DRAVAKH_PROJECT, DRAVAKH_PROVINCES } from "../../src/data/dravakh-project";
import { DRAVAKH_GEOGRAPHY_VERSION } from "../../src/dravakh/geography";
import provincePlan from "../../maps/dravakh-province-anchors-v1.json";

const selectPreset = (page: Page, name: string) =>
  page.evaluate(name => {
    const select = document.getElementById("layersPreset") as HTMLSelectElement;
    select.value = name;
    select.dispatchEvent(new Event("change"));
  }, name);

const dismissUpdateDialog = async (page: Page) => {
  const updateDialog = page.locator(".ui-dialog").filter({ hasText: "Fantasy Map Generator update" }).last();
  await updateDialog.waitFor({ state: "visible", timeout: 5000 }).catch(() => undefined);
  if (await updateDialog.isVisible()) {
    await updateDialog.locator(".ui-dialog-titlebar-close").click();
    await expect(updateDialog).toBeHidden();
  }
};

type NormalizedPoint = [number, number];
type HydrologyRiver = {
  i: number;
  name: string;
  type: string;
  source: number;
  mouth: number;
  parent: number;
  basin: number;
  length: number;
  discharge: number;
  width: number;
  sourcePoint: NormalizedPoint | null;
  mouthPoint: NormalizedPoint | null;
  path: NormalizedPoint[];
};

const distance = (a: NormalizedPoint, b: NormalizedPoint) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const pathDistance = (river: HydrologyRiver, point: NormalizedPoint) =>
  Math.min(...river.path.map(candidate => distance(candidate, point)));

test("Dravakh canonical map preserves structural gates, applies Geographic Detail v1, and survives a durable .map reload", async ({ page }, testInfo) => {
  test.setTimeout(180000);

  // Match the canonical Dravakh baseline aspect ratio (768 × 1152) so the
  // visual gate does not horizontally distort the source heightmap.
  await page.setViewportSize({ width: 900, height: 1300 });
  await page.goto("/?seed=dravakh-baseline-gate&width=768&height=1152");
  await page.waitForFunction(() => (window as any).mapId !== undefined, { timeout: 60000 });

  await expect(page.locator("#dravakh-map-studio-status")).toBeAttached();

  await page.evaluate(() => {
    (window as any).__dravakhGenerated = new Promise<void>(resolve =>
      window.addEventListener("map:generated", () => resolve(), { once: true })
    );
    (window as any).Controllers.HeightmapSelection.open();
  });

  const selector = page.locator("#heightmapSelection");
  await expect(selector).toBeVisible();

  const baseline = selector.locator('article[data-id="dravakh"]');
  await expect(baseline).toContainText("Dravakh Baseline v1");
  await baseline.click();
  await page.getByRole("button", { name: "New Map", exact: true }).click();

  await page.evaluate(() => (window as any).__dravakhGenerated);
  await page.waitForTimeout(1200);
  await expect(page.locator("#templateInput")).toHaveValue("dravakh");

  await selectPreset(page, "heightmap");
  await page.waitForTimeout(800);
  await dismissUpdateDialog(page);
  const heightmapPath = testInfo.outputPath("dravakh-baseline-v1-heightmap.png");
  await page.locator("#map").screenshot({ path: heightmapPath });
  await testInfo.attach("Dravakh Baseline v1 — heightmap", {
    path: heightmapPath,
    contentType: "image/png"
  });

  await selectPreset(page, "physical");
  await page.waitForTimeout(800);
  await dismissUpdateDialog(page);
  const physicalPath = testInfo.outputPath("dravakh-baseline-v1-physical.png");
  await page.locator("#map").screenshot({ path: physicalPath });
  await testInfo.attach("Dravakh Baseline v1 — physical", {
    path: physicalPath,
    contentType: "image/png"
  });

  // Rivers remain Azgaar-derived. These assertions protect the approved
  // continental drainage intent without hardcoding individual river geometry.
  const hydrology = (await page.evaluate(() => {
    const world = window as any;
    const { pack, graphWidth, graphHeight } = world;
    const points = pack.cells.p as [number, number][];
    const normalize = (point: [number, number] | undefined): [number, number] | null =>
      point ? [point[0] / graphWidth, point[1] / graphHeight] : null;

    return (pack.rivers as any[]).map(river => ({
      i: river.i,
      name: river.name,
      type: river.type,
      source: river.source,
      mouth: river.mouth,
      parent: river.parent,
      basin: river.basin,
      length: river.length,
      discharge: river.discharge,
      width: river.width,
      sourcePoint: normalize(points[river.source]),
      mouthPoint: normalize(points[river.mouth]),
      path: river.cells
        .filter((cell: number) => cell >= 0)
        .map((cell: number) => normalize(points[cell]))
        .filter((point: [number, number] | null): point is [number, number] => point !== null)
    }));
  })) as HydrologyRiver[];

  expect(hydrology.length).toBeGreaterThan(0);
  const roots = hydrology.filter(river => river.parent === river.i).sort((a, b) => b.discharge - a.discharge);
  expect(roots.length).toBeGreaterThan(1);

  const dominant = roots[0];
  expect(dominant.sourcePoint).not.toBeNull();
  expect(dominant.mouthPoint).not.toBeNull();
  expect(dominant.discharge).toBeGreaterThan(roots[1].discharge * 2);

  // Sanctum -> Soldier's Wall -> Hearthkeep -> Rivermend -> southern outlet.
  expect(distance(dominant.sourcePoint!, [0.49, 0.23])).toBeLessThan(0.08);
  expect(pathDistance(dominant, [0.50, 0.36])).toBeLessThan(0.04);
  expect(pathDistance(dominant, [0.49, 0.52])).toBeLessThan(0.05);
  expect(pathDistance(dominant, [0.49, 0.69])).toBeLessThan(0.04);
  expect(pathDistance(dominant, [0.58, 0.82])).toBeLessThan(0.08);
  expect(distance(dominant.mouthPoint!, [0.70, 0.90])).toBeLessThan(0.08);

  // Dreamrest keeps western meltwater, but no longer captures the continental main system.
  expect(hydrology.some(river => river.discharge > 300 && pathDistance(river, [0.29, 0.28]) < 0.05)).toBe(true);

  // White Keep gets its own northeastern meltwater drainage.
  expect(
    hydrology.some(
      river =>
        river.mouthPoint !== null &&
        river.mouthPoint[0] > 0.68 &&
        river.mouthPoint[1] < 0.35 &&
        pathDistance(river, [0.64, 0.23]) < 0.07
    )
  ).toBe(true);

  // Ironforge and Harvest Hall must contribute tributaries to the dominant Rivermend basin.
  expect(hydrology.some(river => river.basin === dominant.i && pathDistance(river, [0.62, 0.54]) < 0.04)).toBe(true);
  expect(hydrology.some(river => river.basin === dominant.i && pathDistance(river, [0.34, 0.80]) < 0.04)).toBe(true);

  // Highfest Haven may have local streams, but no giant continental river through the port region.
  const highfestLocal = hydrology.filter(river => pathDistance(river, [0.70, 0.80]) < 0.08);
  expect(highfestLocal.length).toBeGreaterThan(0);
  expect(Math.max(...highfestLocal.map(river => river.discharge))).toBeLessThan(1000);

  // Highhallow remains an island-scale system: short rivers and modest discharge only.
  const highhallowRivers = hydrology.filter(
    river =>
      river.sourcePoint !== null &&
      river.mouthPoint !== null &&
      river.sourcePoint[0] > 0.795 &&
      river.mouthPoint[0] > 0.795 &&
      river.sourcePoint[1] > 0.25 &&
      river.sourcePoint[1] < 0.58
  );
  expect(highhallowRivers.length).toBeGreaterThan(0);
  expect(Math.max(...highhallowRivers.map(river => river.length))).toBeLessThan(100);
  expect(Math.max(...highhallowRivers.map(river => river.discharge))).toBeLessThan(500);

  await testInfo.attach("Dravakh Hydrology v1 — derived river data", {
    body: Buffer.from(
      JSON.stringify(
        {
          width: 768,
          height: 1152,
          dominantRiverId: dominant.i,
          dominantRiverName: dominant.name,
          rivers: hydrology
        },
        null,
        2
      )
    ),
    contentType: "application/json"
  });

  const hydrologyPath = testInfo.outputPath("dravakh-hydrology-v1-derived.png");
  await page.locator("#map").screenshot({ path: hydrologyPath });
  await testInfo.attach("Dravakh Hydrology v1 — derived rivers", {
    path: hydrologyPath,
    contentType: "image/png"
  });

  const canonicalProvinceSpec = DRAVAKH_PROVINCES.map(definition => {
    const anchor = provincePlan.provinces.find(candidate => candidate.id === definition.id);
    if (!anchor) throw new Error(`Missing canonical test anchor for ${definition.id}`);
    return { id: definition.id, name: definition.name, landmark: definition.primaryLandmark, x: anchor.x, y: anchor.y };
  });

  const territory = await page.evaluate(spec => {
    const world = window as any;
    const { pack, graphWidth, graphHeight } = world;
    const { cells, provinces, states } = pack;
    const landCells = Array.from(cells.i as ArrayLike<number>).filter((cell: number) => cells.h[cell] >= 20);
    const activeStates = states.filter((state: any) => state.i && !state.removed);
    const activeProvinces = provinces.filter((province: any) => province.i && !province.removed);

    const provinceCellCounts = activeProvinces.map((province: any) => ({
      i: province.i,
      name: province.name,
      cells: landCells.filter((cell: number) => cells.province[cell] === province.i).length
    }));

    const centers = activeProvinces.map((province: any) => {
      const point = cells.p[province.center] as [number, number];
      return {
        i: province.i,
        name: province.name,
        cell: province.center,
        x: point[0] / graphWidth,
        y: point[1] / graphHeight,
        assignedProvince: cells.province[province.center]
      };
    });

    const connectivity = activeProvinces.map((province: any) => {
      const primaryFeature = cells.f[province.center];
      const targetCells = landCells.filter(
        (cell: number) => cells.province[cell] === province.i && cells.f[cell] === primaryFeature
      );
      const target = new Set(targetCells);
      const visited = new Set<number>();
      const queue = [province.center];

      while (queue.length) {
        const cell = queue.pop()!;
        if (visited.has(cell) || !target.has(cell)) continue;
        visited.add(cell);
        for (const neighbor of cells.c[cell]) {
          if (!visited.has(neighbor) && target.has(neighbor)) queue.push(neighbor);
        }
      }

      return {
        i: province.i,
        name: province.name,
        primaryFeature,
        primaryFeatureCells: targetCells.length,
        reachableCells: visited.size
      };
    });

    const highhallow = activeProvinces.find((province: any) => province.name === "Highhallow");
    if (!highhallow) throw new Error("Highhallow province was not generated");
    const highhallowFeature = cells.f[highhallow.center];
    const highhallowMainIslandIntruders = landCells.filter(
      (cell: number) => cells.f[cell] === highhallowFeature && cells.province[cell] !== highhallow.i
    ).length;
    const highhallowWestCells = landCells.filter((cell: number) => {
      if (cells.province[cell] !== highhallow.i) return false;
      const point = cells.p[cell] as [number, number];
      return point[0] / graphWidth < 0.78;
    }).length;

    return {
      activeStateCount: activeStates.length,
      stateName: activeStates[0]?.name ?? null,
      stateProvinceIds: Array.from(activeStates[0]?.provinces ?? []),
      activeProvinceCount: activeProvinces.length,
      provinceNames: activeProvinces.map((province: any) => province.name),
      provinceStates: activeProvinces.map((province: any) => province.state),
      landCellCount: landCells.length,
      unassignedLandCells: landCells.filter(
        (cell: number) => cells.province[cell] < 1 || cells.province[cell] > spec.length
      ).length,
      wrongStateLandCells: landCells.filter((cell: number) => cells.state[cell] !== 1).length,
      provinceCellCounts,
      centers,
      connectivity,
      highhallowFeature,
      highhallowMainIslandIntruders,
      highhallowWestCells
    };
  }, canonicalProvinceSpec);

  expect(territory.activeStateCount).toBe(1);
  expect(territory.stateName).toBe(DRAVAKH_PROJECT.defaultKingdomName);
  expect(territory.stateProvinceIds).toEqual(DRAVAKH_PROVINCES.map((_, index) => index + 1));
  expect(territory.activeProvinceCount).toBe(15);
  expect(territory.provinceNames).toEqual(DRAVAKH_PROVINCES.map(province => province.name));
  expect(territory.provinceStates).toEqual(DRAVAKH_PROVINCES.map(() => 1));
  expect(territory.landCellCount).toBeGreaterThan(0);
  expect(territory.unassignedLandCells).toBe(0);
  expect(territory.wrongStateLandCells).toBe(0);
  expect(territory.provinceCellCounts.every(province => province.cells > 0)).toBe(true);
  expect(territory.connectivity.every(province => province.reachableCells === province.primaryFeatureCells)).toBe(true);

  territory.centers.forEach((center, index) => {
    const anchor = canonicalProvinceSpec[index];
    expect(center.name).toBe(anchor.name);
    expect(center.assignedProvince).toBe(index + 1);
    expect(Math.hypot(center.x - anchor.x, center.y - anchor.y)).toBeLessThan(0.08);
  });

  expect(territory.highhallowMainIslandIntruders).toBe(0);
  expect(territory.highhallowWestCells).toBe(0);

  const landmarks = await page.evaluate(spec => {
    const world = window as any;
    const { pack, graphWidth, graphHeight } = world;
    return (pack.markers as any[])
      .filter(marker => marker.type.startsWith("dravakh-landmark-"))
      .map(marker => {
        const note = (notes as any[]).find(candidate => candidate.id === `marker${marker.i}`);
        const [x, y] = pack.cells.p[marker.cell] as [number, number];
        return {
          i: marker.i,
          type: marker.type,
          noteName: note?.name ?? null,
          cell: marker.cell,
          province: pack.cells.province[marker.cell],
          state: pack.cells.state[marker.cell],
          height: pack.cells.h[marker.cell],
          river: pack.cells.r[marker.cell] || 0,
          feature: pack.cells.f[marker.cell],
          coastal: pack.cells.c[marker.cell].some((neighbor: number) => pack.cells.h[neighbor] < 20),
          x: x / graphWidth,
          y: y / graphHeight,
          lock: marker.lock === true,
          pinned: marker.pinned === true,
          known: spec.some(candidate => `dravakh-landmark-${candidate.id}` === marker.type)
        };
      });
  }, canonicalProvinceSpec);

  expect(landmarks).toHaveLength(15);
  canonicalProvinceSpec.forEach((definition, index) => {
    const marker = landmarks.find(candidate => candidate.type === `dravakh-landmark-${definition.id}`);
    expect(marker).toBeDefined();
    expect(marker!.known).toBe(true);
    expect(marker!.noteName).toBe(definition.landmark);
    expect(marker!.province).toBe(index + 1);
    expect(marker!.state).toBe(1);
    expect(marker!.height).toBeGreaterThanOrEqual(20);
    expect(marker!.lock).toBe(true);
    expect(marker!.pinned).toBe(true);
    expect(Math.hypot(marker!.x - definition.x, marker!.y - definition.y)).toBeLessThan(0.13);
  });

  for (const id of ["white-keep", "citadel-reach", "highfest-haven"]) {
    expect(landmarks.find(marker => marker.type === `dravakh-landmark-${id}`)?.coastal).toBe(true);
  }
  for (const id of ["rivermend", "harvest-hall"]) {
    expect(landmarks.find(marker => marker.type === `dravakh-landmark-${id}`)?.river).toBeGreaterThan(0);
  }
  for (const id of ["sanctum-crest", "ironforge-reaches", "ironbank-ridge", "alliance-high", "highhallow"]) {
    expect(landmarks.find(marker => marker.type === `dravakh-landmark-${id}`)?.height).toBeGreaterThanOrEqual(38);
  }

  const highhallowLandmark = landmarks.find(marker => marker.type === "dravakh-landmark-highhallow");
  expect(highhallowLandmark?.x).toBeGreaterThan(0.795);
  expect(highhallowLandmark?.feature).toBe(territory.highhallowFeature);

  await testInfo.attach("Dravakh Landmarks v1 — canonical placement", {
    body: Buffer.from(JSON.stringify({ canonicalProvinceSpec, landmarks }, null, 2)),
    contentType: "application/json"
  });

  await page.evaluate(() => {
    const markers = document.getElementById("markers") as SVGGElement | null;
    if (markers) markers.style.display = "block";
  });
  await page.waitForTimeout(400);
  const landmarksPath = testInfo.outputPath("dravakh-landmarks-v1-canonical-placement.png");
  await page.locator("#map").screenshot({ path: landmarksPath });
  await testInfo.attach("Dravakh Landmarks v1 — canonical placement", {
    path: landmarksPath,
    contentType: "image/png"
  });

  const geography = await page.evaluate(spec => {
    const world = window as any;
    const { pack } = world;
    const landCells = Array.from(pack.cells.i as ArrayLike<number>).filter(
      (cell: number) => pack.cells.h[cell] >= 20
    );

    const provinceBiomes = spec.map((definition, index) => {
      const provinceId = index + 1;
      const cells = landCells.filter((cell: number) => pack.cells.province[cell] === provinceId);
      const counts: Record<string, number> = {};
      for (const cell of cells) {
        const biome = String(pack.cells.biome[cell]);
        counts[biome] = (counts[biome] ?? 0) + 1;
      }
      return { id: definition.id, name: definition.name, cells: cells.length, counts };
    });

    return {
      version: (world.DravakhGeography?.apply?.() as any)?.version ?? null,
      landCellCount: landCells.length,
      marineLandCells: landCells.filter((cell: number) => pack.cells.biome[cell] === 0).length,
      provinceBiomes,
      reliefIconCount: (pack.relief ?? []).length,
      reliefTypes: Array.from(
        new Set((pack.relief ?? []).map((icon: any) => String(icon.icon).replace(/^relief-/, "").replace(/-\d+.*$/, "")))
      ).sort()
    };
  }, canonicalProvinceSpec);

  expect(geography.version).toBe(DRAVAKH_GEOGRAPHY_VERSION);
  expect(geography.landCellCount).toBe(territory.landCellCount);
  expect(geography.marineLandCells).toBe(0);
  expect(geography.reliefIconCount).toBeGreaterThan(0);
  expect(geography.reliefTypes.length).toBeGreaterThan(1);

  const allowedBiomes: Record<string, number[]> = {
    rivermend: [4, 6, 12],
    "harvest-hall": [4, 6, 12],
    dreamrest: [6, 8, 9, 12],
    "ironforge-reaches": [2, 4, 6],
    "white-keep": [9, 10, 11],
    "sanctum-crest": [6, 9, 10, 11],
    "citadel-reach": [2, 6, 8],
    "kings-road": [4, 6, 12],
    "swiftstride-pass": [2, 4, 6],
    hearthkeep: [4, 6, 12],
    "soldiers-wall": [4, 6, 9],
    "alliance-high": [4, 6, 9],
    highhallow: [8, 9, 10, 12],
    "highfest-haven": [4, 6, 12],
    "ironbank-ridge": [2, 4, 6]
  };

  for (const province of geography.provinceBiomes) {
    expect(province.cells).toBeGreaterThan(0);
    const allowed = new Set(allowedBiomes[province.id]);
    expect(Object.keys(province.counts).every(biome => allowed.has(Number(biome)))).toBe(true);
  }

  const biomeCounts = (id: string) => geography.provinceBiomes.find(province => province.id === id)!.counts;
  expect(Number(biomeCounts("rivermend")["12"] ?? 0)).toBeGreaterThan(0);
  expect(Number(biomeCounts("harvest-hall")["4"] ?? 0)).toBeGreaterThan(0);
  expect(Number(biomeCounts("dreamrest")["8"] ?? 0) + Number(biomeCounts("dreamrest")["6"] ?? 0)).toBeGreaterThan(0);
  expect(Number(biomeCounts("ironforge-reaches")["2"] ?? 0)).toBeGreaterThan(0);
  expect(Number(biomeCounts("white-keep")["10"] ?? 0) + Number(biomeCounts("white-keep")["11"] ?? 0)).toBeGreaterThan(0);
  expect(Number(biomeCounts("sanctum-crest")["10"] ?? 0) + Number(biomeCounts("sanctum-crest")["11"] ?? 0)).toBeGreaterThan(0);
  expect(Number(biomeCounts("highhallow")["8"] ?? 0) + Number(biomeCounts("highhallow")["9"] ?? 0)).toBeGreaterThan(0);

  await testInfo.attach("Dravakh Geographic Detail v1 — biome evidence", {
    body: Buffer.from(JSON.stringify(geography, null, 2)),
    contentType: "application/json"
  });

  await page.evaluate(() => {
    (window as any).Layers.set(["biomes", "lakes", "rivers", "relief", "borders", "markers", "vignette"]);
    document.getElementById("markers")?.setAttribute("pinned", "1");
  });
  await page.waitForTimeout(700);
  const geographyPath = testInfo.outputPath("dravakh-geographic-detail-v1.png");
  await page.locator("#map").screenshot({ path: geographyPath });
  await testInfo.attach("Dravakh Geographic Detail v1 — biome and relief", {
    path: geographyPath,
    contentType: "image/png"
  });

  await testInfo.attach("Dravakh Provinces v1 — territorial gate", {
    body: Buffer.from(JSON.stringify({ canonicalProvinceSpec, territory }, null, 2)),
    contentType: "application/json"
  });

  await page.evaluate(() => {
    const provinces = document.getElementById("provs") as SVGGElement | null;
    const borders = document.getElementById("borders") as SVGGElement | null;
    if (provinces) provinces.style.display = "block";
    if (borders) borders.style.display = "block";
  });
  await page.waitForTimeout(600);
  const provincesPath = testInfo.outputPath("dravakh-provinces-v1-territorial-gate.png");
  await page.locator("#map").screenshot({ path: provincesPath });
  await testInfo.attach("Dravakh Provinces v1 — territorial gate", {
    path: provincesPath,
    contentType: "image/png"
  });

  // Geographic-detail milestone: export a real machine .map and prove that terrain,
  // hydrology, territories, landmarks, biomes and deterministic relief survive a full authoring reload.
  const milestoneFilename = "dravakh-map-v2-20260920-geographic-detail-v1.map";
  const canonicalMapName = "Dravakh Geographic Detail v1";

  await page.evaluate(name => {
    const input = document.getElementById("mapName") as HTMLInputElement;
    input.value = name;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, canonicalMapName);

  const savedState = await page.evaluate(() => ({
    mapName: (document.getElementById("mapName") as HTMLInputElement).value,
    seed: (window as any).seed as string,
    graphWidth: (window as any).graphWidth as number,
    graphHeight: (window as any).graphHeight as number,
    heights: Array.from((window as any).grid.cells.h as ArrayLike<number>),
    cellsProvince: Array.from((window as any).pack.cells.province as ArrayLike<number>),
    cellsState: Array.from((window as any).pack.cells.state as ArrayLike<number>),
    states: ((window as any).pack.states as any[]).map(state =>
      state?.i
        ? {
            i: state.i,
            name: state.name,
            fullName: state.fullName,
            form: state.form,
            formName: state.formName,
            center: state.center,
            capital: state.capital,
            culture: state.culture,
            color: state.color,
            provinces: Array.from(state.provinces ?? []),
            lock: state.lock,
            removed: state.removed ?? false
          }
        : { i: 0, name: state?.name ?? "Neutrals" }
    ),
    provinces: ((window as any).pack.provinces as any[]).map(province =>
      province?.i
        ? {
            i: province.i,
            state: province.state,
            lock: province.lock,
            center: province.center,
            burg: province.burg,
            name: province.name,
            formName: province.formName,
            fullName: province.fullName,
            color: province.color,
            pole: province.pole
          }
        : { i: 0 }
    ),
    landmarks: ((window as any).pack.markers as any[])
      .filter(marker => marker.type.startsWith("dravakh-landmark-"))
      .map(marker => {
        const note = notes.find(candidate => candidate.id === `marker${marker.i}`);
        return {
          i: marker.i,
          type: marker.type,
          icon: marker.icon,
          x: marker.x,
          y: marker.y,
          dx: marker.dx,
          dy: marker.dy,
          px: marker.px,
          size: marker.size,
          pin: marker.pin,
          fill: marker.fill,
          stroke: marker.stroke,
          cell: marker.cell,
          lock: marker.lock,
          pinned: marker.pinned,
          noteName: note?.name ?? null,
          noteLegend: note?.legend ?? null
        };
      }),
    biomes: Array.from((window as any).pack.cells.biome as ArrayLike<number>),
    relief: ((window as any).pack.relief as any[]).map(icon => ({
      icon: icon.icon,
      x: icon.x,
      y: icon.y,
      s: icon.s
    })),
    rivers: ((window as any).pack.rivers as any[]).map(river => ({
      i: river.i,
      source: river.source,
      mouth: river.mouth,
      parent: river.parent,
      basin: river.basin,
      length: river.length,
      discharge: river.discharge,
      width: river.width,
      cells: Array.from(river.cells as ArrayLike<number>)
    }))
  }));

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Baixar backup .map", exact: true }).click()
  ]);
  expect(download.suggestedFilename()).toMatch(/\.map$/);

  const milestonePath = testInfo.outputPath(milestoneFilename);
  await download.saveAs(milestonePath);
  const mapData = await readFile(milestonePath, "utf8");
  expect(mapData.length).toBeGreaterThan(10000);
  expect(mapData).toContain("|Dravakh Geographic Detail v1|");

  await testInfo.attach("Dravakh Geographic Detail v1 — durable .map", {
    path: milestonePath,
    contentType: "text/plain"
  });

  // Deliberately alter a persisted field so the following state can only pass
  // after the downloaded .map has genuinely been parsed and restored.
  await page.evaluate(() => {
    (document.getElementById("mapName") as HTMLInputElement).value = "DRAVAKH-GEOGRAPHY-RELOAD-SENTINEL";
  });
  await expect(page.locator("#mapName")).toHaveValue("DRAVAKH-GEOGRAPHY-RELOAD-SENTINEL");

  await page.evaluate(async serializedMap => {
    const blob = new Blob([serializedMap], { type: "text/plain" });
    await (window as any).Services.Load.uploadMap(blob);
  }, mapData);

  await page.waitForFunction(
    expected => (document.getElementById("mapName") as HTMLInputElement)?.value === expected,
    savedState.mapName,
    { timeout: 60000 }
  );
  await page.waitForTimeout(1200);

  const reloadedState = await page.evaluate(() => ({
    mapName: (document.getElementById("mapName") as HTMLInputElement).value,
    seed: (window as any).seed as string,
    graphWidth: (window as any).graphWidth as number,
    graphHeight: (window as any).graphHeight as number,
    heights: Array.from((window as any).grid.cells.h as ArrayLike<number>),
    cellsProvince: Array.from((window as any).pack.cells.province as ArrayLike<number>),
    cellsState: Array.from((window as any).pack.cells.state as ArrayLike<number>),
    states: ((window as any).pack.states as any[]).map(state =>
      state?.i
        ? {
            i: state.i,
            name: state.name,
            fullName: state.fullName,
            form: state.form,
            formName: state.formName,
            center: state.center,
            capital: state.capital,
            culture: state.culture,
            color: state.color,
            provinces: Array.from(state.provinces ?? []),
            lock: state.lock,
            removed: state.removed ?? false
          }
        : { i: 0, name: state?.name ?? "Neutrals" }
    ),
    provinces: ((window as any).pack.provinces as any[]).map(province =>
      province?.i
        ? {
            i: province.i,
            state: province.state,
            lock: province.lock,
            center: province.center,
            burg: province.burg,
            name: province.name,
            formName: province.formName,
            fullName: province.fullName,
            color: province.color,
            pole: province.pole
          }
        : { i: 0 }
    ),
    landmarks: ((window as any).pack.markers as any[])
      .filter(marker => marker.type.startsWith("dravakh-landmark-"))
      .map(marker => {
        const note = notes.find(candidate => candidate.id === `marker${marker.i}`);
        return {
          i: marker.i,
          type: marker.type,
          icon: marker.icon,
          x: marker.x,
          y: marker.y,
          dx: marker.dx,
          dy: marker.dy,
          px: marker.px,
          size: marker.size,
          pin: marker.pin,
          fill: marker.fill,
          stroke: marker.stroke,
          cell: marker.cell,
          lock: marker.lock,
          pinned: marker.pinned,
          noteName: note?.name ?? null,
          noteLegend: note?.legend ?? null
        };
      }),
    biomes: Array.from((window as any).pack.cells.biome as ArrayLike<number>),
    relief: ((window as any).pack.relief as any[]).map(icon => ({
      icon: icon.icon,
      x: icon.x,
      y: icon.y,
      s: icon.s
    })),
    rivers: ((window as any).pack.rivers as any[]).map(river => ({
      i: river.i,
      source: river.source,
      mouth: river.mouth,
      parent: river.parent,
      basin: river.basin,
      length: river.length,
      discharge: river.discharge,
      width: river.width,
      cells: Array.from(river.cells as ArrayLike<number>)
    }))
  }));

  expect(reloadedState).toEqual(savedState);

  await selectPreset(page, "physical");
  await page.waitForTimeout(800);
  await dismissUpdateDialog(page);
  const reloadedPhysicalPath = testInfo.outputPath("dravakh-geographic-detail-v1-physical-after-reload.png");
  await page.locator("#map").screenshot({ path: reloadedPhysicalPath });
  await testInfo.attach("Dravakh Geographic Detail v1 — physical after .map reload", {
    path: reloadedPhysicalPath,
    contentType: "image/png"
  });
});
