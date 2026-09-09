# Implementation notes

## Current branch

`dravakh-studio-v1`

## Safety rules

- Keep `master` as the clean upstream-derived baseline until the Dravakh fork changes are reviewed.
- Do not remove `LICENSE` or upstream attribution.
- Do not rely on browser IndexedDB as the only copy of any approved map.
- Do not treat the previous lost Work-session map as recoverable unless an actual `.map` file is found.
- Keep the final in-game map UI separate from the Azgaar authoring application.
- Do not create principal routes before physical geography, hydrology, all 15 provinces and all 15 primary landmarks are approved.

## Phase 2 runtime changes

- package/PWA metadata identifies the fork as Dravakh Map Studio;
- Vite applies runtime branding without restructuring the large `src/index.html` monolith;
- the upstream Google Analytics runtime is stripped;
- `src/dravakh/runtime.ts` exposes durable `.map` backup state and an unload guard;
- machine and Dropbox saves dispatch durable-backup events while browser saves remain explicitly local-only.

## Phase 3 reproducible baseline

- `scripts/generate-dravakh-heightmap.mjs` creates a deterministic 768×1152 grayscale source at `public/heightmaps/dravakh.png`;
- `src/data/precreated-heightmaps.ts` registers it as `Dravakh Baseline v1`;
- `scripts/validate-dravakh-baseline.mjs` decodes the generated PNG with Node built-ins and validates dimensions, ocean/channel points, required land anchors and relief hierarchy using the same grayscale-to-height mapping used by Azgaar precreated heightmaps;
- `predev` and `prebuild` run generation and validation before the application starts or builds;
- `.github/workflows/validate-dravakh.yml` is ready to run the generator, validator and production build once GitHub Actions is available;
- `maps/dravakh-baseline-v1.json` stores physical control anchors;
- `maps/dravakh-hydrology-plan-v1.json` stores candidate drainage guidance;
- `maps/dravakh-province-anchors-v1.json` stores candidate cores for all 15 canonical provinces and landmarks without fixing political polygons.

## Current gate

Source-controlled reconstruction infrastructure is in place. Runtime approval remains required for:

1. physical baseline;
2. Highhallow maritime separation;
3. Azgaar-derived hydrology;
4. exactly 15 canonical provinces;
5. 15/15 primary landmarks;
6. durable `.map` export and reload compatibility.
