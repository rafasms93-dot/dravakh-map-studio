# Next action

The physical-baseline, hydrology, 15-province and 15-landmark gates are complete.

## Current validated state

### Physical baseline v1.1

`dravakh-map-v2-20260909-1141-physical-baseline.map`

SHA-256:

`b20d62e3d200cbdf05baa8d75019a35c17d27c5d0ec0067743ff1d2619c4d814`

### Hydrology v1

`dravakh-map-v2-20260916-1635-hydrology-v1.map`

SHA-256:

`160afd20c8ad13abae1c15acf90dfc541fdac2935a9a1451a17bb94f12aec71e`

### Province Placement v1

`dravakh-map-v2-20260918-1422-provinces-v1.map`

Size: `4,550,644 bytes`

SHA-256:

`24daf57e2b8a69102abf0cbd67a1d96a94ee75ccea45ff4fba68651eb803cbe0`

### Landmarks v1

`dravakh-map-v2-20260918-landmarks-v1.map`

Size: `4,561,238 bytes`

SHA-256:

`1de3271d04d38fee37862f698a8148bbe0c93205a4971fc048090301670e51dc`

Landmark validation confirmed:

- exactly 15 canonical primary landmarks;
- one landmark bound to each of the 15 canonical provinces;
- every landmark sits on valid land inside its own province;
- coastal landmarks satisfy coastal placement where required;
- Rivermend and Harvest Hall landmarks preserve river association;
- highland landmarks satisfy the approved elevated-terrain rule;
- Highhallow's landmark remains on the insular Highhallow feature;
- canonical landmark names are persisted in Azgaar notes;
- markers are locked and pinned against random regeneration;
- the default Dravakh marker view prioritizes the 15 pinned canonical landmarks without deleting Azgaar's auxiliary marker data;
- machine `.map` save/reload preserves the complete landmark layer exactly.

Final validated landmark head:

`acd9cdb228cfd822e4e8bfbb3ec4d6b4ade0c3cc`

Focused map gate:

- run `35376241737`
- job `105701471298`
- artifact `10560172108`
- artifact digest `sha256:87af2d5b7a84b8c79541ee8884cd1dcd86b3decfbae7f847b03a50f76dd67fcb`

Second durable Drive archive:

`1lBfDcvriok1X1h9_UzckKZOsOmcD3sY_`

## Current source state

- deterministic physical generator: `scripts/generate-dravakh-heightmap.mjs`;
- generated source asset: `public/heightmaps/dravakh.png`;
- deterministic physical validator: `scripts/validate-dravakh-baseline.mjs`;
- canonical physical metadata: `maps/dravakh-baseline-v1.json`;
- canonical hydrology constraints/evidence: `maps/dravakh-hydrology-plan-v1.json`;
- canonical province/landmark anchors: `maps/dravakh-province-anchors-v1.json`;
- deterministic territorial partition: `src/dravakh/provinces.ts`;
- canonical landmark layer: `src/dravakh/landmarks.ts`;
- canonical runtime integration/persistence guard: `src/dravakh/runtime.ts`;
- focused runtime gate: `.github/workflows/validate-dravakh-map-gate.yml`.

## Next runtime gate — Geographic Detail v1

1. treat Landmarks v1 as the immutable structural baseline;
2. preserve the approved coastline, Highhallow channel, main relief systems and dominant hydrology;
3. preserve all 15 province assignments and all 15 canonical landmark cells;
4. improve secondary relief and local geographic texture only where it increases world readability;
5. enrich vegetation/biome expression while preserving province identity and physical plausibility;
6. refine local coast, lake, tributary and valley detail without changing approved macro-hydrology;
7. verify Sanctum, White Keep, Ironforge, Ironbank and Alliance High remain geographically distinct;
8. preserve Dreamrest, Harvest Hall, Rivermend and Hearthkeep as readable lowland/basin regions;
9. keep Highhallow visibly insular at all zoom levels;
10. add focused regression checks for any new deterministic geography rules;
11. visually review the complete map before declaring Geographic Detail v1 canonical;
12. export/reload a new durable `.map` milestone only after the gate passes.

**Do not create principal routes during Geographic Detail v1.**
