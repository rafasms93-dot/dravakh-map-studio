# Next action

Phase 2 is implemented and the first Phase 3 controlled physical baseline is now source-controlled.

Current source state:

- deterministic generator: `scripts/generate-dravakh-heightmap.mjs`;
- generated asset target: `public/heightmaps/dravakh.png`;
- automatic generation before `dev` and `build`;
- selectable Azgaar entry: `Dravakh Baseline v1`;
- control metadata: `maps/dravakh-baseline-v1.json`;
- approval rules: `docs/dravakh/BASELINE_V1.md`.

Next validation gate:

1. enable/confirm GitHub Actions and Pages for the fork;
2. run a clean build, which must generate `dravakh.png` first;
3. open Dravakh Map Studio;
4. select `Dravakh Baseline v1` as the precreated heightmap;
5. verify the single vertical continent, Highhallow maritime separation, northern Sanctum spine, Ironforge massif, Ironbank massif, center-south basin and southeastern bay;
6. let Azgaar derive hydrology and review drainage;
7. save an external `.map` backup;
8. reload that `.map` and verify compatibility.

Only after this gate should the baseline be marked canonical and the 15 province assignment be automated/reconstructed.
