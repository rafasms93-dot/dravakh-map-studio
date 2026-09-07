import { expect, test, type Page } from "@playwright/test";

const selectPreset = (page: Page, name: string) =>
  page.evaluate(name => {
    const select = document.getElementById("layersPreset") as HTMLSelectElement;
    select.value = name;
    select.dispatchEvent(new Event("change"));
  }, name);

test("Dravakh Baseline v1 loads through the real heightmap selector", async ({ page }, testInfo) => {
  test.setTimeout(120000);

  await page.goto("/?seed=dravakh-baseline-gate&width=1280&height=720");
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
  const heightmapPath = testInfo.outputPath("dravakh-baseline-v1-heightmap.png");
  await page.locator("#map").screenshot({ path: heightmapPath });
  await testInfo.attach("Dravakh Baseline v1 — heightmap", {
    path: heightmapPath,
    contentType: "image/png"
  });

  await selectPreset(page, "physical");
  await page.waitForTimeout(800);
  const physicalPath = testInfo.outputPath("dravakh-baseline-v1-physical.png");
  await page.locator("#map").screenshot({ path: physicalPath });
  await testInfo.attach("Dravakh Baseline v1 — physical", {
    path: physicalPath,
    contentType: "image/png"
  });
});
