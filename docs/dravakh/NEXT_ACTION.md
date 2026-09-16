# Next action

The physical-baseline and hydrology gates are complete.

## Current validated state

The Dravakh physical baseline revision 1.1 and Hydrology v1 are canonical inputs for the next cartographic phase.

Physical baseline milestone:

`dravakh-map-v2-20260909-1141-physical-baseline.map`

SHA-256:

`b20d62e3d200cbdf05baa8d75019a35c17d27c5d0ec0067743ff1d2619c4d814`

Hydrology milestone:

`dravakh-map-v2-20260916-1635-hydrology-v1.map`

SHA-256:

`160afd20c8ad13abae1c15acf90dfc541fdac2935a9a1451a17bb94f12aec71e`

Hydrology validation confirmed:

- the dominant river system originates on the southern Sanctum flank;
- it crosses the Soldier's Wall choke;
- it follows the central valley and converges through Rivermend;
- it remains the clear dominant continental basin;
- Dreamrest retains independent western meltwater drainage;
- White Keep retains northeastern meltwater drainage;
- Ironforge contributes tributaries to the dominant basin;
- Harvest Hall receives alluvial tributaries;
- Highfest Haven has only locally scaled streams in its port region;
- Highhallow has short, locally scaled island rivers;
- the river network is terrain-derived, not hardcoded;
- `.map` reload reproduced both the height grid and river topology exactly;
- durable milestone archives exist outside browser storage.

The dedicated `Validate Dravakh Map Gate` workflow now provides a focused runtime regression gate for Dravakh map changes. The full repository CI remains required as the general regression suite.

## Current source state

- deterministic physical generator: `scripts/generate-dravakh-heightmap.mjs`;
- generated source asset: `public/heightmaps/dravakh.png`;
- deterministic physical validator: `scripts/validate-dravakh-baseline.mjs`;
- canonical physical metadata: `maps/dravakh-baseline-v1.json`;
- canonical hydrology constraints/evidence: `maps/dravakh-hydrology-plan-v1.json`;
- province/landmark reconstruction anchors: `maps/dravakh-province-anchors-v1.json`;
- focused runtime gate: `.github/workflows/validate-dravakh-map-gate.yml`.

## Next runtime gate — 15 canonical provinces

1. load the canonical Hydrology v1 milestone/state;
2. inspect `maps/dravakh-province-anchors-v1.json` as placement guidance, not as rigid polygon geometry;
3. reconstruct exactly the 15 approved provinces and no others;
4. make borders follow physical geography, watershed logic, coastlines, mountain systems and the Highhallow maritime separation where appropriate;
5. preserve the category → province mapping already approved by the project;
6. treat Soldier's Wall as the special Discipline province without inventing conventional XP behavior here;
7. verify that Highhallow remains fully insular and territorially independent;
8. visually review province balance and spatial legibility in the Map Studio runtime;
9. add deterministic/runtime regression checks for province count and canonical identities;
10. export a new machine `.map` milestone only after the 15-province geometry is approved;
11. reload that milestone and verify the province assignment survives intact;
12. archive a second durable copy before proceeding to landmarks.

Do not place the 15 primary landmarks until the province geometry gate is approved.

Do not create principal routes until the physical baseline, hydrology, 15 provinces and 15/15 landmarks have all passed review.
