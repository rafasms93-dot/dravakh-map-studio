import { expect, test, type Page } from "@playwright/test";

const selectPreset = (page: Page, name: string) =>
  page.evaluate(name => {
    const select = document.getElementById("layersPreset") as HTMLSelectElement;
    select.value = name;
    select.dispatchEvent(new Event("change"));
  }, name);

test("Dravakh Baseline v1 loads through the real heightmap selector", async ({ page }, testInfo) => {
  test.setTimeout(120000);

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

  const updateDialog = page.locator(".ui-dialog:visible").filter({ hasText: "Fantasy Map Generator update" });
  if ((await updateDialog.count()) > 0) {
    await updateDialog.locator(".ui-dialog-titlebar-close").click();
    await expect(updateDialog).toBeHidden();
  }

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
