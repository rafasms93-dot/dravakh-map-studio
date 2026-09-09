# Next action

Phase 3 physical-baseline gate is complete.

## Current validated state

The Dravakh physical baseline revision 1.1 is now canonical for the next cartographic phase.

Validated on 2026-09-09 through GitHub Actions and the Dravakh runtime:

- deterministic heightmap generation passed;
- invariant validation passed;
- TypeScript + production build passed;
- lint passed;
- unit tests passed;
- desktop build passed;
- Nix package passed;
- Playwright passed with a rebuilt Dravakh-aware `dist`;
- the baseline was selected through the real Azgaar heightmap selector at `768 × 1152`;
- visual review confirmed the vertical continent, Highhallow separation, Sanctum chain, Ironforge, Ironbank, center-south basin and southeastern bay;
- a real machine `.map` was exported;
- the exported `.map` was reloaded successfully;
- reload preserved exact map name, seed, graph dimensions and the complete height grid.

Canonical physical milestone:

`dravakh-map-v2-20260909-1141-physical-baseline.map`

SHA-256:

`b20d62e3d200cbdf05baa8d75019a35c17d27c5d0ec0067743ff1d2619c4d814`

Cloud archive:

`Projeto: Nova Valyria OS / 03 — World & Design Bible / Mapa & Map Studio / Milestones`

## Current source state

- deterministic generator: `scripts/generate-dravakh-heightmap.mjs`;
- generated asset target: `public/heightmaps/dravakh.png`;
- deterministic validator: `scripts/validate-dravakh-baseline.mjs`;
- automatic generation + validation before `dev` and `build`;
- selectable Azgaar entry: `Dravakh Baseline v1`;
- canonical physical metadata: `maps/dravakh-baseline-v1.json`;
- candidate hydrology plan: `maps/dravakh-hydrology-plan-v1.json`;
- candidate 15-province/landmark anchors: `maps/dravakh-province-anchors-v1.json`.

## Next runtime gate — hydrology

1. load the canonical physical baseline;
2. inspect the rivers Azgaar derives from revision 1.1 relief;
3. compare the derived drainage against `dravakh-hydrology-plan-v1.json`;
4. verify Sanctum-origin drainage, Dreamrest/White Keep branches, the dominant south-flowing system, Rivermend convergence, Harvest Hall alluvial support, Highfest Haven scale and short Highhallow drainage;
5. correct only hydrologically necessary defects while preserving the approved physical macrogeography;
6. rerun programmatic and visual gates;
7. export a new machine `.map` milestone after hydrology approval;
8. reload and verify that hydrology milestone;
9. only then reconstruct exactly 15 provinces around `dravakh-province-anchors-v1.json`.

Do not create principal routes until the physical baseline, hydrology, 15 provinces and 15/15 landmarks pass review.
