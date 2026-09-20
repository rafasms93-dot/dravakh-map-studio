# Next action

The physical-baseline, hydrology, 15-province, 15-landmark and Geographic Detail v1 gates are complete.

## Current validated state

### Physical baseline v1.1

`dravakh-map-v2-20260909-1141-physical-baseline.map`

SHA-256: `b20d62e3d200cbdf05baa8d75019a35c17d27c5d0ec0067743ff1d2619c4d814`

### Hydrology v1

`dravakh-map-v2-20260916-1635-hydrology-v1.map`

SHA-256: `160afd20c8ad13abae1c15acf90dfc541fdac2935a9a1451a17bb94f12aec71e`

### Province Placement v1

`dravakh-map-v2-20260918-1422-provinces-v1.map`

Size: `4,550,644 bytes`

SHA-256: `24daf57e2b8a69102abf0cbd67a1d96a94ee75ccea45ff4fba68651eb803cbe0`

### Landmarks v1

`dravakh-map-v2-20260918-landmarks-v1.map`

Size: `4,561,238 bytes`

SHA-256: `1de3271d04d38fee37862f698a8148bbe0c93205a4971fc048090301670e51dc`

### Geographic Detail v1

`dravakh-map-v2-20260920-geographic-detail-v1.map`

Size: `4,836,553 bytes`

SHA-256: `b1204c9ff2407923dfa0275c760739718335bf2c859665fc3198007498f2d390`

Geographic Detail validation confirmed:

- deterministic province-aware biomes;
- muted Dravakh authoring palette;
- deterministic gray secondary relief at size `0.9` and density `0.22`;
- Rivermend / Harvest alluvial readability;
- Dreamrest / Highhallow forest identity;
- White Keep / Sanctum cold and glacial identity;
- Ironforge / Ironbank exposed highland identity;
- Highhallow remains visibly insular;
- no structural terrain, river, province or landmark changes;
- biome IDs, palette, relief style, geographic metadata and relief icons survive a machine `.map` save/reload exactly.

Final validated head:

`ae7f0f6d64c87b007ee9a67c927db58416b5f86c`

Focused map gate:

- run `35531601933`
- job `106133071551`
- artifact `10611426383`
- artifact digest `sha256:dd2d8235ca0207e45482e2e79f4079877ba0ae7ade89da5e17eb158f157b43a5`

Second durable Drive archive:

`1lyf9stSSZhTZr3Fl4dsFYCpusdvSymRo`

## Current source state

- deterministic physical generator: `scripts/generate-dravakh-heightmap.mjs`;
- deterministic physical validator: `scripts/validate-dravakh-baseline.mjs`;
- canonical physical metadata: `maps/dravakh-baseline-v1.json`;
- canonical hydrology constraints/evidence: `maps/dravakh-hydrology-plan-v1.json`;
- canonical province/landmark anchors: `maps/dravakh-province-anchors-v1.json`;
- deterministic territorial partition: `src/dravakh/provinces.ts`;
- canonical landmark layer: `src/dravakh/landmarks.ts`;
- deterministic geographic-detail layer: `src/dravakh/geography.ts`;
- canonical runtime integration/persistence guards: `src/dravakh/runtime.ts`;
- focused runtime gate: `.github/workflows/validate-dravakh-map-gate.yml`.

## Next runtime gate — Visual Finish v1

1. treat Geographic Detail v1 as immutable structural input;
2. preserve coastline, relief heights, river topology, provinces, biomes and landmark positions;
3. refine province-border hierarchy so territory is legible without overpowering geography;
4. refine river and coastline styling for premium cartographic readability;
5. tune biome opacity / material feel without changing biome assignments;
6. refine vignette and map framing to support the Dark Fantasy Heráldico Premium direction;
7. refine the canonical landmark marker presentation without changing landmark identities or cells;
8. evaluate labels only where they improve map readability and do not turn the Map Studio into final game UI;
9. keep generated Azgaar auxiliary markers non-canonical and visually secondary;
10. add regression assertions for any persisted visual-style choices;
11. visually review the complete map at full-map and closer zoom levels;
12. export/reload a new durable `.map` milestone only after the visual gate passes.

**Do not create principal routes during Visual Finish v1.**

Principal routes remain deferred until a dedicated infrastructure/route gate is explicitly opened.
