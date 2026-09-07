# Next action

Phase 2 is implemented and Phase 3 now has a reproducible source-controlled baseline plus validation and reconstruction plans.

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

Next validation gate:

1. enable/confirm GitHub Actions and Pages for the fork;
2. run `Validate Dravakh Map Studio` or a clean `npm run build`;
3. open the deployed Dravakh Map Studio;
4. select `Dravakh Baseline v1` as the precreated heightmap;
5. verify the single vertical continent, Highhallow maritime separation, northern Sanctum spine, Ironforge massif, Ironbank massif, center-south basin and southeastern bay;
6. let Azgaar derive hydrology and compare it with `dravakh-hydrology-plan-v1.json`;
7. reconstruct exactly 15 provinces around `dravakh-province-anchors-v1.json`, allowing borders to follow geography;
8. place all 15 canonical primary landmarks;
9. export a durable `.map` backup;
10. reload that `.map` and verify compatibility.

Do not create principal routes until the physical baseline, hydrology, 15 provinces and 15/15 landmarks pass review.
