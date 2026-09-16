import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

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

test("Dravakh canonical map derives hydrology and survives a durable .map reload", async ({ page }, testInfo) => {
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

  // Hydrology milestone: export a real machine .map and prove that both terrain
  // and the derived river topology survive a full reload from the authoring file.
  const milestoneFilename = "dravakh-map-v2-20260916-1635-hydrology-v1.map";
  const canonicalMapName = "Dravakh Hydrology v1";

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
  expect(mapData).toContain("|Dravakh Hydrology v1|");

  await testInfo.attach("Dravakh Hydrology v1 — durable .map", {
    path: milestonePath,
    contentType: "text/plain"
  });

  // Deliberately alter a persisted field so the following state can only pass
  // after the downloaded .map has genuinely been parsed and restored.
  await page.evaluate(() => {
    (document.getElementById("mapName") as HTMLInputElement).value = "DRAVAKH-HYDROLOGY-RELOAD-SENTINEL";
  });
  await expect(page.locator("#mapName")).toHaveValue("DRAVAKH-HYDROLOGY-RELOAD-SENTINEL");

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
  const reloadedPhysicalPath = testInfo.outputPath("dravakh-hydrology-v1-physical-after-reload.png");
  await page.locator("#map").screenshot({ path: reloadedPhysicalPath });
  await testInfo.attach("Dravakh Hydrology v1 — physical after .map reload", {
    path: reloadedPhysicalPath,
    contentType: "image/png"
  });
});
