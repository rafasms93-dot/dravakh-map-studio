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

test("Dravakh Baseline v1 loads through the real heightmap selector", async ({ page }, testInfo) => {
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

  // Approved physical-baseline milestone: export a real machine .map and prove
  // that the authoring source can be reopened without changing the height grid.
  const milestoneFilename = "dravakh-map-v2-20260909-1141-physical-baseline.map";
  const canonicalMapName = "Dravakh Physical Baseline v1.1";

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
    heights: Array.from((window as any).grid.cells.h as ArrayLike<number>)
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
  expect(mapData).toContain("|Dravakh Physical Baseline v1.1|");

  await testInfo.attach("Dravakh physical baseline — durable .map", {
    path: milestonePath,
    contentType: "text/plain"
  });

  // Deliberately alter an in-memory field so reload must restore persisted data.
  await page.evaluate(() => {
    (document.getElementById("mapName") as HTMLInputElement).value = "DRAVAKH-RELOAD-SENTINEL";
  });
  await expect(page.locator("#mapName")).toHaveValue("DRAVAKH-RELOAD-SENTINEL");

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
    heights: Array.from((window as any).grid.cells.h as ArrayLike<number>)
  }));

  expect(reloadedState).toEqual(savedState);

  await selectPreset(page, "physical");
  await page.waitForTimeout(800);
  await dismissUpdateDialog(page);
  const reloadedPhysicalPath = testInfo.outputPath("dravakh-baseline-v1-physical-after-reload.png");
  await page.locator("#map").screenshot({ path: reloadedPhysicalPath });
  await testInfo.attach("Dravakh Baseline v1 — physical after .map reload", {
    path: reloadedPhysicalPath,
    contentType: "image/png"
  });
});
