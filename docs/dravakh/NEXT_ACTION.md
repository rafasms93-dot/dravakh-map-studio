# Next action

The physical-baseline, hydrology, province, landmark, Geographic Detail v1 and Visual Finish v1 gates are complete.

## Latest canonical milestone

`dravakh-map-v2-20260920-visual-finish-v1.map`

Size: `4,836,783 bytes`

SHA-256:

`c91c28211d18c0ed64a1859a0a93d853f9bd423e461338c6999446f526a9a8fb`

Visual Finish validation confirmed:

- physical/hydrology/province/landmark/geographic-detail gates remain intact;
- exact muted landmass, biome and relief presentation;
- canonical river and lake colors;
- canonical coastline styling;
- aged-bronze province-border hierarchy;
- canonical province overlay treatment;
- bronze heraldic presentation for all 15 official landmarks;
- dark vignette framing;
- complete visual style survives machine `.map` save/reload exactly.

Final validated head:

`7aada0b32f35beacf1ba6320681a6ff0ce2685fe`

Focused map gate:

- run `35532027212`
- job `106134214750`
- artifact `10612165408`
- artifact digest `sha256:5853c35162757e215b58b8107ab0a7d71912f165dafd6f052f4d00bbbbfb62f6`

Second durable Drive archive:

`1AscKpEGVUVP0UcckcSso4sMMR8W9Tepk`

## Current canonical source layers

- physical generator: `scripts/generate-dravakh-heightmap.mjs`;
- physical validator: `scripts/validate-dravakh-baseline.mjs`;
- hydrology plan: `maps/dravakh-hydrology-plan-v1.json`;
- province/landmark anchors: `maps/dravakh-province-anchors-v1.json`;
- territorial partition: `src/dravakh/provinces.ts`;
- landmarks: `src/dravakh/landmarks.ts`;
- geographic detail: `src/dravakh/geography.ts`;
- visual finish: `src/dravakh/visual-finish.ts`;
- runtime integration/persistence guards: `src/dravakh/runtime.ts`;
- focused runtime gate: `.github/workflows/validate-dravakh-map-gate.yml`.

## Next runtime gate — Routes & Infrastructure v1

1. treat Visual Finish v1 as an immutable cartographic baseline;
2. identify the minimum principal network needed to connect the 15 provincial landmarks;
3. make routes follow valleys, passes, river crossings and coast access rather than straight-line geometry;
4. preserve Soldier's Wall and Swiftstride Pass as meaningful physical choke points;
5. keep King's Road a territorial province while allowing a distinct principal road to traverse the wider kingdom;
6. connect Hearthkeep as the central political hub without forcing every route through a single cell;
7. connect Rivermend and Harvest Hall through physically plausible basin/alluvial corridors;
8. connect Citadel Reach and Highfest Haven to coastal infrastructure where appropriate;
9. treat Highhallow as maritime-separated: no land bridge or road across open water;
10. add only necessary maritime connection(s) to Highhallow, with no invented gameplay economy;
11. distinguish principal routes from local/generated Azgaar route clutter;
12. persist and reload the route network exactly before approving the milestone.

Do not add economy, wars, quests, progression effects or unrelated gameplay systems in this gate.
