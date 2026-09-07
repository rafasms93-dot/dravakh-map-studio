# Next action

Phase 2 is implemented and Phase 3 now has a reproducible source-controlled baseline, deterministic validation and reconstruction plans.

Validated in GitHub Actions on implementation head `d259281438640fb1e5793854e5df1afe394e5e49`:

- dependency installation succeeded;
- deterministic Dravakh baseline generation succeeded;
- baseline invariant validation succeeded;
- TypeScript + production build succeeded;
- lint succeeded;
- unit tests succeeded;
- desktop build succeeded;
- Nix package succeeded;
- Playwright was still running at the time this handoff was written.

Current source state:

- deterministic generator: `scripts/generate-dravakh-heightmap.mjs`;
- generated asset target: `public/heightmaps/dravakh.png`;
- deterministic validator: `scripts/validate-dravakh-baseline.mjs`;
- automatic generation + validation before `dev` and `build`;
- selectable Azgaar entry: `Dravakh Baseline v1`;
- physical control metadata: `maps/dravakh-baseline-v1.json`;
- candidate hydrology plan: `maps/dravakh-hydrology-plan-v1.json`;
- candidate 15-province/landmark anchors: `maps/dravakh-province-anchors-v1.json`;
- runtime approval documents: `BASELINE_V1.md`, `HYDROLOGY_V1.md`, `PROVINCE_PLACEMENT_V1.md`.

Next runtime gate:

1. verify Pages deployment or run the validated build in a persistent environment;
2. open Dravakh Map Studio;
3. select `Dravakh Baseline v1` as the precreated heightmap;
4. visually review the single vertical continent, Highhallow maritime separation, northern Sanctum spine, Ironforge massif, Ironbank massif, center-south basin and southeastern bay;
5. let Azgaar derive hydrology and compare it with `dravakh-hydrology-plan-v1.json`;
6. reconstruct exactly 15 provinces around `dravakh-province-anchors-v1.json`, allowing borders to follow geography;
7. place all 15 canonical primary landmarks;
8. export a durable `.map` backup;
9. reload that `.map` and verify compatibility.

Do not create principal routes until the physical baseline, hydrology, 15 provinces and 15/15 landmarks pass review.
