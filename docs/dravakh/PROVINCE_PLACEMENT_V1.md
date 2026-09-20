# Dravakh Map Studio — Province Placement v1

## Status

**Canonical and technically approved as of 2026-09-18.**

The reconstructed map now contains exactly the 15 canonical Dravakh provinces on top of the approved physical baseline v1.1 and Hydrology v1.

## Purpose

Preserve the approved macro-position of all 15 provinces while allowing borders to follow believable terrain, rivers, valleys, coasts and choke points.

Canonical normalized placement anchors remain stored in:

`maps/dravakh-province-anchors-v1.json`

Anchors identify intended province cores and future primary-landmark placement areas. They do **not** define polygon borders.

## Implementation

The deterministic territorial partition is implemented in:

`src/dravakh/provinces.ts`

The runtime:

- resolves canonical anchors by province `id`, not JSON array position;
- resolves all 15 anchors to distinct valid land cells;
- expands provinces through the native Azgaar land-cell graph;
- treats ocean/water as an absolute territorial barrier;
- applies slope, river-crossing and terrain-bias costs so borders react to geography;
- assigns detached land features by nearest canonical province core;
- normalizes the political layer to one kingdom, **Dravakh**;
- assigns every valid land cell to state 1 and to exactly one province from 1 through 15;
- preserves Highhallow as an eastern insular province;
- stores the result in native `pack.cells.province`, `pack.provinces`, `pack.cells.state` and `pack.states`.

## Placement rules preserved

- Exactly 15 provinces.
- Highhallow remains fully insular.
- Soldier's Wall occupies the natural northern choke.
- Swiftstride Pass remains a real corridor/pass.
- King's Road remains a longitudinal territorial domain, not only a future route overlay.
- Hearthkeep remains central.
- Ironforge Reaches remains physically distinct from Sanctum Crest.
- Rivermend aligns with the dominant hydrographic basin.
- Harvest Hall occupies western/southwestern fertile lowlands.
- Ironbank Ridge remains the extreme southwestern rocky massif.
- Highfest Haven remains associated with the protected southeastern coast/bay.

## Validation gate

The focused runtime gate verifies:

1. exactly one active state named `Dravakh`;
2. exactly 15 active provinces;
3. exact canonical province identities and ordering;
4. every land cell assigned to one canonical province;
5. every land cell assigned to the Dravakh state;
6. every canonical anchor resolves to the expected province core;
7. each province is connected on its primary land feature;
8. Highhallow's main island contains no foreign province cells;
9. Highhallow contains no mainland cells west of the maritime separation;
10. the complete territorial model survives a real machine `.map` save/reload.

The first persistence run exposed a real defect: loading an already-canonical `.map` caused the runtime to recompute province borders. `src/dravakh/runtime.ts` now detects a fully persisted canonical layer and preserves it 1:1 instead of regenerating it.

## Canonical milestone

`dravakh-map-v2-20260918-1422-provinces-v1.map`

Size: `4,550,644 bytes`

SHA-256:

`24daf57e2b8a69102abf0cbd67a1d96a94ee75ccea45ff4fba68651eb803cbe0`

Focused map-gate run:

- run: `35374410525`
- job: `105695597421`
- result: **success**
- artifact: `10559333632`
- artifact digest: `sha256:71a5515430c421293c365ab4df3d270e0d26bde500283914850115343a0599ce`

A second durable archive is stored in the project Drive under:

`03 — World & Design Bible / Mapa & Map Studio / Milestones`

Drive archive ID:

`1c4JGZB5cQcXB9nVkNh3TRuRIhW_hOBSo`

## Next gate

Place and validate the **15/15 primary landmarks** on this approved territorial baseline.

Principal routes remain deferred until all 15 landmarks have passed review.
