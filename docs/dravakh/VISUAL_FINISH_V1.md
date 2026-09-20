# Dravakh Map Studio — Visual Finish v1

## Status

**Canonical and technically approved as of 2026-09-20.**

Visual Finish v1 polishes the authoring-map presentation on top of Geographic Detail v1 without changing the canonical physical, hydrographic, territorial or landmark structure.

## Immutable baseline

This phase preserves exactly:

- Physical Baseline v1.1;
- Hydrology v1;
- Province Placement v1;
- Landmarks v1;
- Geographic Detail v1 biome assignments;
- all 15 canonical landmark cells;
- Highhallow maritime separation;
- all saved terrain and river topology.

No principal routes were created in this phase.

## Implementation

Canonical visual-finish logic lives in:

`src/dravakh/visual-finish.ts`

The runtime applies Visual Finish v1 after the canonical geography layer.

## Approved authoring-map treatment

### Landmass and biome material

- underlying landmass fill: `#b7af99`;
- biome opacity: `0.88`;
- gray relief opacity: `0.72`.

### Water

Rivers:

- opacity: `0.94`;
- fill: `#587784`.

Freshwater lakes:

- opacity: `0.78`;
- fill: `#718895`;
- stroke: `#4e6570`;
- stroke width: `0.55`.

Frozen lakes:

- opacity: `0.92`;
- fill: `#c9d4d4`;
- stroke: `#94a7aa`;
- stroke width: `0.3`.

### Coastline

Sea-island coastline:

- opacity: `0.82`;
- stroke: `#403a31`;
- stroke width: `0.62`.

Lake-island coastline:

- opacity: `0.88`;
- stroke: `#526872`;
- stroke width: `0.38`.

### Territorial hierarchy

Province borders:

- opacity: `0.86`;
- stroke: `#735d40`;
- stroke width: `0.18`;
- dash: `1.1 0.65`;
- line cap: `round`.

Province fill, when the province overlay is enabled:

- opacity: `0.22`;
- fill: `#4d3d2f`.

The intent is to keep geography dominant while retaining readable territorial structure.

### Canonical landmarks

All 15 canonical landmark markers retain their existing cells and identities but receive a unified heraldic shield presentation:

- shield fill: `#bea46e`;
- stroke: `#3d3022`;
- icon size: `10`;
- marker size: `34`;
- pin shape: `shield`.

Markers remain locked and pinned.

### Framing

Vignette:

- opacity: `0.42`;
- fill: `#17120e`.

This deepens the map frame without changing any world data.

## Persistence

Visual Finish v1 writes canonical metadata:

- note id: `dravakh-visual-finish-v1`;
- note name: `Dravakh Visual Finish v1`.

On reload the saved style state is preserved instead of being reinterpreted as a new visual pass.

## Validation gate

The focused runtime gate verifies:

1. every previous structural and Geographic Detail v1 assertion still passes;
2. the exact Visual Finish version contract;
3. landmass, biome, relief, river, lake, coastline, province-border, province-fill, marker and vignette styles;
4. all 15 canonical landmark markers retain the approved shield presentation;
5. Visual Finish metadata exists;
6. structural map state remains unchanged;
7. the exact visual-style state survives machine `.map` save/reload;
8. landmark marker style survives reload through the existing landmark equality gate.

## Canonical milestone

`dravakh-map-v2-20260920-visual-finish-v1.map`

Size:

`4,836,783 bytes`

SHA-256:

`c91c28211d18c0ed64a1859a0a93d853f9bd423e461338c6999446f526a9a8fb`

Final validated head:

`7aada0b32f35beacf1ba6320681a6ff0ce2685fe`

Focused map gate:

- run: `35532027212`
- job: `106134214750`
- artifact: `10612165408`
- artifact digest: `sha256:5853c35162757e215b58b8107ab0a7d71912f165dafd6f052f4d00bbbbfb62f6`
- result: **success**

Second durable Drive archive:

`1AscKpEGVUVP0UcckcSso4sMMR8W9Tepk`

All prior milestone archives remain independently preserved.

## Next gate

**Routes & Infrastructure v1.**

The next cartographic gate may define the principal overland and maritime infrastructure needed to connect the approved provinces and landmarks.

It must remain a map/infrastructure concern only. Gameplay economy, wars, progression and unrelated systems remain out of scope.
