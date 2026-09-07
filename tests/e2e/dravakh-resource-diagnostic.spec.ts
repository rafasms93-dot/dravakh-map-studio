import {test, expect} from "@playwright/test";

const PRESETS = [
  "default", "ancient", "gloom", "pale", "light", "watercolor",
  "clean", "atlas", "darkSeas", "cyberpunk", "night", "monochrome"
];

test("diagnose missing resources while switching shipped presets", async ({page}) => {
  const missing: Array<{preset: string; url: string}> = [];
  let currentPreset = "initial-load";

  page.on("response", response => {
    if (response.status() === 404) {
      missing.push({preset: currentPreset, url: response.url()});
    }
  });

  await page.goto("/?seed=test-seed&width=1280&height=720");
  await page.waitForFunction(() => (window as any).mapId !== undefined, {timeout: 60000});
  await page.waitForSelector("#burgIcons > g", {state: "attached", timeout: 60000});
  await page.waitForSelector("#labels > g", {state: "attached", timeout: 60000});
  await page.waitForTimeout(500);
  await page.evaluate(() => sessionStorage.setItem("styleChangeConfirmed", "true"));

  for (const preset of PRESETS) {
    currentPreset = preset;
    await page.evaluate(async name => {
      await (window as any).changeStyle(name);
    }, preset);
    await page.waitForTimeout(150);
  }

  console.log("DRAVAKH_404_DIAGNOSTIC", JSON.stringify(missing));
  expect(missing, "404 responses with the preset active when requested").toEqual([]);
});
