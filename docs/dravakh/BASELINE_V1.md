# Dravakh physical baseline v1

## Status

Candidate technical baseline for Phase 3. This is not final cartographic art and is not yet a canonical `.map` milestone.

## Generation

Run:

```bash
npm run generate:dravakh-heightmap
```

The generator writes:

`public/heightmaps/dravakh.png`

It uses only Node.js built-ins and deterministic mathematical fields. No random runtime seed is required, so the same source version produces the same grayscale source image.

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

## Hydrology

The heightmap does not paint rivers directly. Rivers remain a derived Azgaar layer and must be generated from relief, then reviewed for believable drainage.

Required review after import/generation:

1. principal sources originate around Sanctum Crest;
2. western drainage can feed Dreamrest;
3. eastern drainage can reach White Keep;
4. dominant south-flowing system converges in Rivermend;
5. Harvest Hall receives coherent alluvial water;
6. Highfest Haven does not receive an arbitrary giant river;
7. Highhallow uses short island drainage only.

## Approval gate

Before this baseline becomes canonical:

1. generate `dravakh.png`;
2. import/register it in Dravakh Map Studio;
3. inspect the physical result in the Azgaar engine;
4. correct any coastline/relief defects;
5. save a machine `.map` backup;
6. reload the `.map` and verify it;
7. only then mark the physical baseline as approved.

No province assignment or principal route generation should be treated as canonical before this gate is complete.
