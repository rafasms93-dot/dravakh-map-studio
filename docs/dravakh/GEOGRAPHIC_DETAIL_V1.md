# Dravakh Map Studio — Geographic Detail v1

## Status

**Canonical and technically approved as of 2026-09-20.**

Geographic Detail v1 enriches the approved map with deterministic biome identity and secondary relief presentation while preserving all structural milestones that came before it.

## Immutable structural baseline

This phase does **not** alter:

- the approved coastline and land/water mask;
- the Highhallow maritime channel and island separation;
- Physical Baseline v1.1;
- Hydrology v1 river topology;
- Province Placement v1 assignments;
- the 15 canonical landmark cells;
- the one-kingdom Dravakh political model.

Principal routes were not created during this phase.

## Implementation

Canonical geographic-detail logic lives in:

`src/dravakh/geography.ts`

The runtime applies the layer only after canonical provinces and landmarks are available.

### Province-aware biome identity

Biome assignments remain native Azgaar biome IDs, but their deterministic distribution is refined by province role, altitude, river proximity, coast proximity and local temperature.

Key regional identities include:

- **Rivermend** — wetlands and grasslands organized around the dominant basin;
- **Harvest Hall** — broad grasslands with alluvial wetlands and deciduous transition;
- **Dreamrest** — temperate rainforest / deciduous forest basin with wetter river margins;
- **Ironforge Reaches** — exposed cold-desert highlands, grassland shoulders and wooded lower slopes;
- **White Keep** — taiga, tundra and glacial terrain;
- **Sanctum Crest** — deciduous foothills, taiga, tundra and glacier by elevation;
- **Citadel Reach** — wet western coastal forest with exposed high cliffs;
- **King's Road** — readable central grassland axis with wooded elevations and wet river pockets;
- **Swiftstride Pass** — grassland corridor transitioning into wooded and exposed high passes;
- **Hearthkeep** — central grassland / deciduous basin with local wetlands;
- **Soldier's Wall** — grassland choke with deciduous and taiga elevations;
- **Alliance High** — elevated grassland / deciduous / taiga progression;
- **Highhallow** — insular temperate rainforest, taiga, tundra and wet river pockets;
- **Highfest Haven** — sheltered grassland coast with local wetlands and wooded elevations;
- **Ironbank Ridge** — grassland approaches, deciduous slopes and exposed cold-desert ridge tops.

## Visual palette

The default Azgaar biome colors were deliberately replaced by a more muted dark-fantasy palette for the Dravakh authoring view:

- Marine: `#466eab`
- Hot desert: `#b6a276`
- Cold desert: `#878675`
- Savanna: `#9e986d`
- Grassland: `#909a6d`
- Tropical seasonal forest: `#708456`
- Temperate deciduous forest: `#527052`
- Tropical rainforest: `#456a4b`
- Temperate rainforest: `#41604d`
- Taiga: `#3d503e`
- Tundra: `#817663`
- Glacier: `#d7e1df`
- Wetland: `#416b58`

This palette is an authoring/cartographic presentation choice and does not redefine the physical simulation.

## Secondary relief

Relief icons are generated deterministically using a fixed pseudo-random seed so the same canonical map produces the same visual detail.

Approved relief presentation:

- set: `gray`
- size: `0.9`
- density: `0.22`

A denser, more colorful first pass was rejected during visual review because it reduced legibility and moved away from the Dark Fantasy Heráldico Premium direction.

## Persistence

Geographic Detail v1 writes canonical metadata:

- note id: `dravakh-geographic-detail-v1`
- note name: `Dravakh Geographic Detail v1`

When that metadata, the persisted biome array and relief data are present in a loaded `.map`, the runtime preserves the saved geographic-detail layer instead of recalculating it from derived packed-cell values.

This guard was added after the first persistence test exposed minor biome drift after reload.

## Validation gate

The focused Playwright gate verifies:

1. all previous physical, hydrology, province and landmark gates still pass;
2. no valid land cell uses the marine biome;
3. every province contains only its approved biome family;
4. key province identities are present, including Rivermend wetlands, Harvest grassland, Dreamrest forest, Ironforge exposed highland, White Keep/Sanctum cold biomes and Highhallow forest;
5. deterministic relief exists and includes multiple relief types;
6. exact province and landmark assignments remain unchanged;
7. complete biome cell IDs survive save/reload;
8. biome palette survives save/reload;
9. relief style options survive save/reload;
10. canonical geographic metadata survives save/reload;
11. every deterministic relief icon survives save/reload exactly;
12. terrain, river topology, states, provinces and landmarks remain identical across the same machine `.map` reload.

## Canonical milestone

`dravakh-map-v2-20260920-geographic-detail-v1.map`

Size:

`4,836,553 bytes`

SHA-256:

`b1204c9ff2407923dfa0275c760739718335bf2c859665fc3198007498f2d390`

Final validated head:

`ae7f0f6d64c87b007ee9a67c927db58416b5f86c`

Focused map gate:

- run: `35531601933`
- job: `106133071551`
- artifact: `10611426383`
- artifact digest: `sha256:dd2d8235ca0207e45482e2e79f4079877ba0ae7ade89da5e17eb158f157b43a5`
- result: **success**

Second durable Drive archive:

`1lyf9stSSZhTZr3Fl4dsFYCpusdvSymRo`

All earlier physical, hydrology, province and landmark milestones remain independently preserved.

## Next gate

**Visual Finish v1.**

The next phase may polish cartographic presentation — borders, rivers, coastline treatment, material feel, vignette, landmark symbol presentation and overall visual hierarchy — but must not change the canonical geography, territorial model or landmark placement.

Principal routes remain deferred until a dedicated infrastructure/route gate is explicitly opened.
