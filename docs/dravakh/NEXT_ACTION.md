# Next action

The physical-baseline, hydrology and 15-province gates are complete.

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

Province validation confirmed:

- one kingdom: Dravakh;
- exactly 15 canonical provinces and no extras;
- 100% of valid land assigned to the kingdom and one canonical province;
- all 15 canonical anchors resolve to the correct province core;
- primary territorial continuity for every province;
- Highhallow remains insular and exclusive to its eastern main island;
- machine `.map` save/reload preserves terrain, rivers, state assignment, province assignment and canonical identities;
- a runtime bug that recalculated borders after reload was detected and corrected;
- a second durable archive exists in the project Drive Milestones folder.

The dedicated `Validate Dravakh Map Gate` workflow is green for Province Placement v1.

## Current source state

- deterministic physical generator: `scripts/generate-dravakh-heightmap.mjs`;
- generated source asset: `public/heightmaps/dravakh.png`;
- deterministic physical validator: `scripts/validate-dravakh-baseline.mjs`;
- canonical physical metadata: `maps/dravakh-baseline-v1.json`;
- canonical hydrology constraints/evidence: `maps/dravakh-hydrology-plan-v1.json`;
- canonical province/landmark anchors: `maps/dravakh-province-anchors-v1.json`;
- deterministic territorial partition: `src/dravakh/provinces.ts`;
- canonical runtime integration/persistence guard: `src/dravakh/runtime.ts`;
- focused runtime gate: `.github/workflows/validate-dravakh-map-gate.yml`.

## Next runtime gate — 15/15 primary landmarks

1. use Province Placement v1 as the immutable territorial baseline;
2. place exactly one approved primary landmark for each canonical province;
3. place each landmark on a valid land cell inside its own province;
4. preserve the approved house/category/landmark bindings;
5. keep landmark placement physically plausible relative to relief, rivers, coasts and provincial function;
6. verify Hearthkeep's sovereign landmark remains central and politically legible;
7. verify Soldier's Wall expresses the northern choke without inventing Discipline Engine behavior;
8. verify Highhallow's landmark remains fully insular;
9. add runtime regression checks for 15/15 landmark identities and province containment;
10. visually review all 15 placements;
11. export and reload a new machine `.map` milestone;
12. archive a second durable copy before proceeding.

**Do not create principal routes yet.**

Routes remain deferred until the 15/15 primary-landmark gate is complete.
