# Dravakh physical baseline v1

## Status

**Canonical physical baseline — revision 1.1, approved 2026-09-09.**

The deterministic physical geography has passed programmatic validation, runtime visual review, machine `.map` export and `.map` reload verification. It is now the cartographic source for the hydrology phase.

## Generation

Run:

```bash
npm run generate:dravakh-heightmap
```

The generator writes:

`public/heightmaps/dravakh.png`

It uses only Node.js built-ins and deterministic mathematical fields. No random runtime seed is required, so the same source version produces the same grayscale source image.

Approved generated asset for revision 1.1:

- dimensions: `768 × 1152`;
- SHA-256: `301046ba2d330118b1893aa1ca46ba286c5e35389679ed218632d4f2facaa415`.

## Geometry intent

The generated heightmap encodes the approved physical macrogeography:

- one vertically oriented main continental mass;
- broad northern crown;
- natural central choke for Soldier's Wall;
- wider center/south rather than two independent continents;
- southeastern protected bay for Highfest Haven;
- Highhallow as a separate eastern island with small islets and a strict maritime channel.

## Relief intent

- Sanctum Crest: highest north-central mountain spine;
- White Keep: elevated northeastern coast;
- Soldier's Wall: elevated shoulders around the natural choke;
- Citadel Reach: western coastal/cliff relief;
- Ironforge Reaches: independent center-east massif;
- Alliance High: elevated east/southeast transition;
- Ironbank Ridge: old southwestern massif;
- Highhallow: independent island relief;
- Dreamrest: lower northwestern basin;
- Hearthkeep: moderated central basin;
- Rivermend / Harvest Hall: lower center-south alluvial basin.

Revision 1.1 replaced overly concentric relief domes with asymmetric ridge chains while preserving the approved coastline, land/water mask, Highhallow channel, basins and macro anchors.

## Hydrology

The heightmap does not paint rivers directly. Rivers remain a derived Azgaar layer and must be generated from relief, then reviewed for believable drainage.

Required hydrology review:

1. principal sources originate around Sanctum Crest;
2. western drainage can feed Dreamrest;
3. eastern drainage can reach White Keep;
4. dominant south-flowing system converges in Rivermend;
5. Harvest Hall receives coherent alluvial water;
6. Highfest Haven does not receive an arbitrary giant river;
7. Highhallow uses short island drainage only.

## Approval gate — complete

- [x] generate `dravakh.png`;
- [x] register/select it in Dravakh Map Studio;
- [x] inspect the physical result in the Azgaar engine at the native `768 × 1152` ratio;
- [x] correct coastline/relief defects;
- [x] save a machine `.map` backup;
- [x] reload the `.map` and verify it;
- [x] mark the physical baseline as approved.

Approved milestone:

`dravakh-map-v2-20260909-1141-physical-baseline.map`

- size: `4,383,073 bytes`;
- SHA-256: `b20d62e3d200cbdf05baa8d75019a35c17d27c5d0ec0067743ff1d2619c4d814`;
- reload verification: exact map name, seed, graph dimensions and full height-grid equality;
- cloud archive: `Projeto: Nova Valyria OS / 03 — World & Design Bible / Mapa & Map Studio / Milestones`.

No principal routes should be treated as canonical before hydrology, province assignment and landmark gates are complete.
