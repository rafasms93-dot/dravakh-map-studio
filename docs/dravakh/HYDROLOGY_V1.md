# Dravakh Map Studio — Hydrology v1

## Status

**Approved canonical hydrology geometry as of 2026-09-16.**

This approval covers drainage structure and river geometry derived by the Azgaar runtime. Automatically generated river names are **not** canonical lore and may be renamed later without changing this hydrology approval.

## Principle

Hydrology follows relief. The order is:

`relief -> drainage -> rivers -> political interpretation`

Rivers are not hardcoded to match province names or visual composition. The accepted network is derived from the physical terrain.

## Canonical constraints

- The dominant continental drainage originates on the southern Sanctum Crest flank.
- The principal southbound system crosses the northern choke near Soldier's Wall.
- The main continental convergence occurs in Rivermend.
- Dreamrest receives western meltwater and may support lakes/wetlands.
- White Keep receives eastern meltwater draining to the northeastern coast.
- Ironforge Reaches contributes tributaries but is not the primary continental source.
- Harvest Hall is an alluvial southern/southwestern lowland fed by the dominant basin.
- Highfest Haven uses smaller local watercourses; no arbitrary giant river crosses the port region.
- Highhallow has short island streams/cascades only.

## Terrain implementation

The canonical river network remains Azgaar-derived.

To make the approved continental watershed physically possible, `scripts/generate-dravakh-heightmap.mjs` contains a shallow north-south drainage corridor in the relief. It connects the southern Sanctum flank, Soldier's Wall choke, Hearthkeep/Rivermend valley and southern outlet without changing the approved land/water mask, coastline, Highhallow channel or protected bays.

No final river geometry is painted directly into the heightmap.

## Runtime acceptance evidence

Validated at head:

`e917a4e59bf135261eed7d7a9a91d55a997ca37f`

Generated heightmap SHA-256:

`de46853a423486fae9dde8b44c4e089d924760fa38ee4bca3ab0af16a5058c3b`

The dominant runtime system was river id `134` in the validation build. Its generated name was `Athre`; that name is diagnostic only and is not canonical.

Observed dominant-system metrics:

- discharge: `12705`;
- second-largest root-system discharge: `3721`;
- dominance ratio: `3.4144×`;
- source: `(0.51785, 0.27991)` on the southern Sanctum flank;
- mouth: `(0.67905, 0.94063)` on the southern/southeastern coast;
- distance to Soldier's Wall choke control point: `0.0047`;
- distance to central-valley control point: `0.0093`;
- distance to Rivermend control point: `0.0019`;
- distance to lower-course control point: `0.0489`;
- distance from mouth to outlet control point: `0.0457`.

Regional checks also passed:

- Dreamrest retains substantial western meltwater drainage without capturing the dominant continental basin;
- White Keep has independent northeastern meltwater outlets;
- Ironforge tributaries join the dominant Rivermend basin;
- Harvest Hall receives tributaries/alluvial drainage from the dominant basin;
- Highfest Haven local streams observed near the review region remained small, with maximum discharge `161`;
- Highhallow observed island rivers remained short, with maximum length `70.66` and maximum discharge `227` in the approval run.

The dedicated `Validate Dravakh Map Gate` workflow enforces these properties without hardcoding a particular generated river name.

## Approval gate — complete

1. `Dravakh Baseline v1` loaded through the real heightmap selector — complete;
2. Azgaar derived drainage from the actual current heightmap — complete;
3. principal flow direction matched the canonical constraints — complete;
4. visual review showed no implausible major ridge crossing — complete;
5. Rivermend functioned as the dominant center-south convergence — complete;
6. Highfest Haven and Highhallow remained locally scaled systems — complete;
7. a durable machine `.map` was exported — complete;
8. the `.map` was reloaded and terrain plus river topology were reproduced exactly — complete;
9. a second durable archive was stored in the project Drive — complete.

## Canonical milestone

`dravakh-map-v2-20260916-1635-hydrology-v1.map`

Size: `4,494,612 bytes`

SHA-256:

`160afd20c8ad13abae1c15acf90dfc541fdac2935a9a1451a17bb94f12aec71e`

Cloud archive:

`03 — World & Design Bible / Mapa & Map Studio / Milestones / dravakh-map-v2-20260916-1635-hydrology-v1-archive.zip`

The physical-baseline milestone from 2026-09-09 remains preserved and must not be overwritten.

## Next gate

Reconstruct **exactly 15 canonical provinces** around `maps/dravakh-province-anchors-v1.json`, allowing borders to follow the now-approved physical geography and hydrology.

Do not create principal routes yet.
