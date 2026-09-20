# Dravakh Map Studio — Project State

## Identity

- Internal development codename: **Nova Valyria OS**
- Official game name: **Dravakh: House of Habits**
- Player-facing rule: **Nova Valyria must never appear in the product UI or world text**
- Kingdom name: chosen by the user
- Default suggested kingdom name: **Dravakh**

## Purpose of this repository

This fork of Azgaar's Fantasy Map Generator is the project-controlled cartography environment for Dravakh: House of Habits.

Azgaar remains the cartographic engine and upstream source. Dravakh Map Studio adds project-specific data, persistence rules, presets and export workflows without removing upstream attribution or the MIT license.

## Approved physical geography baseline

**Revision 1.1 is canonical as of 2026-09-09.**

- One main vertically oriented continental mass.
- Dreamrest in the northwest forest/lake basin.
- Sanctum Crest as the highest north-central mountain spine.
- White Keep on the cold/glacial northeastern coast.
- Highhallow as a clearly separate eastern island domain, with one principal island and small islets.
- Soldier's Wall across the natural choke immediately south of the northern crown.
- Citadel Reach on the western coast and cliffs.
- Swiftstride Pass as a real central corridor/desfiladeiro.
- King's Road as a longitudinal territorial axis.
- Hearthkeep near the geographic and political center.
- Ironforge Reaches as an independent volcanic massif in the center-east.
- Alliance High on elevated eastern/southeastern terrain.
- Rivermend as the major center-south hydrographic basin.
- Harvest Hall as broad fertile western/southwestern lowlands.
- Ironbank Ridge as the old rocky massif in the extreme southwest.
- Highfest Haven on the protected southeastern coast/bay.

Canonical physical milestone:

`dravakh-map-v2-20260909-1141-physical-baseline.map`

SHA-256:

`b20d62e3d200cbdf05baa8d75019a35c17d27c5d0ec0067743ff1d2619c4d814`

The machine-exported milestone was reopened successfully and reproduced the saved seed, `768 × 1152` graph dimensions and full height grid exactly.

## Approved hydrology baseline

**Hydrology v1 is canonical as of 2026-09-16.**

The accepted river network is derived from terrain by Azgaar. A shallow drainage corridor was added to the physical relief only where needed to establish the canonical north-south watershed; final river geometry itself remains generated from relief and drainage.

Canonical hydrology behavior:

- the dominant continental system originates on the southern Sanctum Crest flank;
- western Sanctum meltwater still feeds Dreamrest as a strong secondary system;
- White Keep retains independent northeastern meltwater drainage;
- the dominant river crosses the Soldier's Wall choke and follows the central valley;
- Rivermend is the dominant center-south convergence zone;
- Ironforge Reaches contributes tributaries to the dominant basin;
- Harvest Hall receives alluvial tributaries from that basin;
- Highfest Haven retains smaller local streams and no giant river through the port region;
- Highhallow retains only short, locally scaled island streams;
- river geometry does not override ridges or the approved coastline.

Canonical hydrology milestone:

`dravakh-map-v2-20260916-1635-hydrology-v1.map`

SHA-256:

`160afd20c8ad13abae1c15acf90dfc541fdac2935a9a1451a17bb94f12aec71e`

The milestone was reopened successfully and reproduced the map name, seed, graph dimensions, full height grid and serialized river topology exactly.

## Approved province baseline

**Province Placement v1 is canonical as of 2026-09-18.**

Exactly 15 provinces exist inside one Dravakh kingdom:

1. Rivermend — House Rhyven — Hidratação
2. Harvest Hall — House Goldmere — Nutrição
3. Dreamrest — House Velmora — Sono
4. Ironforge Reaches — House Mordrake — Exercício Físico
5. White Keep — House Vaelmont — Higiene
6. Sanctum Crest — House Asterion — Saúde
7. Citadel Reach — House Caelith — Conhecimento
8. King's Road — House Valeron — Carreira
9. Swiftstride Pass — House Veyrad — Produtividade
10. Hearthkeep — Casa do Soberano — Organização
11. Soldier's Wall — House Dravorn — Disciplina
12. Alliance High — House Aerenth — Relações
13. Highhallow — House Elyrion — Espiritualidade
14. Highfest Haven — House Merraval — Lazer
15. Ironbank Ridge — House Ferrane — Finanças

Province names, houses and category bindings are canonical.

The territorial implementation uses native Azgaar land-cell topology with deterministic multi-source expansion. Water remains a hard barrier while relief, rivers and province-specific terrain preferences influence border cost. Highhallow remains fully insular.

The province gate verified:

- exactly one active state named Dravakh;
- exactly 15 canonical province identities and no extras;
- all valid land cells assigned to one of the 15 provinces;
- all valid land cells assigned to Dravakh;
- all 15 anchors resolved to the expected province cores;
- primary-feature territorial continuity;
- Highhallow main-island exclusivity;
- exact territorial persistence across machine `.map` save/reload.

A reload defect discovered by the gate was corrected: canonical province data already stored in a `.map` is now preserved instead of being recalculated.

Canonical province milestone:

`dravakh-map-v2-20260918-1422-provinces-v1.map`

Size: `4,550,644 bytes`

SHA-256:

`24daf57e2b8a69102abf0cbd67a1d96a94ee75ccea45ff4fba68651eb803cbe0`

Focused map gate:

- run `35374410525`
- job `105695597421`
- artifact `10559333632`
- result **success**

A second durable archive exists in the project Drive Milestones folder with ID:

`1c4JGZB5cQcXB9nVkNh3TRuRIhW_hOBSo`

Physical and hydrology milestones remain preserved separately and must not be overwritten.

## Approved landmark baseline

**Landmarks v1 is canonical as of 2026-09-18.**

Exactly one canonical primary landmark exists for each approved province:

1. Rivermend — Castelo de Rhyven
2. Harvest Hall — Salão de Goldmere
3. Dreamrest — Cidadela de Velmora
4. Ironforge Reaches — Forja de Mordrake
5. White Keep — Fortaleza Branca
6. Sanctum Crest — Sanctum de Asterion
7. Citadel Reach — Cidadela de Caelith
8. King's Road — Centro administrativo da Estrada Real
9. Swiftstride Pass — Fortim de passagem
10. Hearthkeep — Fortaleza da Coroa
11. Soldier's Wall — Grande Muralha
12. Alliance High — Palácio de Aerenth
13. Highhallow — Templo-Fortaleza de Elyrion
14. Highfest Haven — Porto de Merraval
15. Ironbank Ridge — Fortaleza-Cofre Ferrane

Landmarks use native Azgaar markers as persistent cartographic points of interest rather than being forced into burg/city semantics. Canonical landmark markers are locked and pinned, retain their canonical note names, and are deterministically placed on valid cells inside their own provinces.

Placement validation covers province containment, valid land, anchor proximity and geography-sensitive constraints such as coastal placement, river association, highland placement and Highhallow's insular feature.

The default Dravakh map view now prioritizes pinned markers, so the 15 canonical landmarks remain visually legible while non-canonical Azgaar-generated markers remain preserved in map data.

Canonical landmark milestone:

`dravakh-map-v2-20260918-landmarks-v1.map`

Size: `4,561,238 bytes`

SHA-256:

`1de3271d04d38fee37862f698a8148bbe0c93205a4971fc048090301670e51dc`

Final validated head:

`acd9cdb228cfd822e4e8bfbb3ec4d6b4ade0c3cc`

Focused map gate:

- run `35376241737`
- job `105701471298`
- artifact `10560172108`
- artifact digest `sha256:87af2d5b7a84b8c79541ee8884cd1dcd86b3decfbae7f847b03a50f76dd67fcb`
- result **success**

The gate verified that the complete landmark layer survives a real machine `.map` save/reload together with the approved terrain, hydrology and province state.

A second durable archive exists in the project Drive Milestones folder with ID:

`1lBfDcvriok1X1h9_UzckKZOsOmcD3sY_`

All earlier physical, hydrology and province milestones remain preserved separately.

## Approved geographic-detail baseline

**Geographic Detail v1 is canonical as of 2026-09-20.**

This milestone adds deterministic province-aware biome identity and secondary relief presentation without changing the approved structural map.

Preserved invariants:

- coastline and land/water mask;
- Highhallow maritime channel and island separation;
- Physical Baseline v1.1 heightmap;
- Hydrology v1 river topology;
- all 15 Province Placement v1 assignments;
- all 15 Landmarks v1 cells and identities.

Regional biome treatment now distinguishes wetlands and alluvial lowlands, temperate forests, exposed highlands, taiga, tundra and glacier zones according to the approved province identities. The authoring palette was deliberately muted and the relief layer changed to a gray, lower-density treatment to stay aligned with the Dark Fantasy Heráldico Premium direction.

Canonical relief presentation:

- set: `gray`
- size: `0.9`
- density: `0.22`

Geographic Detail v1 persists a canonical metadata note and, after `.map` reload, preserves the stored biome array, palette, relief style and deterministic relief icons rather than recomputing from derived packed-cell values.

Canonical geographic-detail milestone:

`dravakh-map-v2-20260920-geographic-detail-v1.map`

Size: `4,836,553 bytes`

SHA-256:

`b1204c9ff2407923dfa0275c760739718335bf2c859665fc3198007498f2d390`

Final validated head:

`ae7f0f6d64c87b007ee9a67c927db58416b5f86c`

Focused map gate:

- run `35531601933`
- job `106133071551`
- artifact `10611426383`
- artifact digest `sha256:dd2d8235ca0207e45482e2e79f4079877ba0ae7ade89da5e17eb158f157b43a5`
- result **success**

The strengthened persistence gate reproduced exactly the saved terrain, rivers, states, provinces, landmarks, biome IDs, biome palette, relief style, geographic metadata and deterministic relief icon array.

A second durable archive exists in the project Drive Milestones folder with ID:

`1lyf9stSSZhTZr3Fl4dsFYCpusdvSymRo`

No principal routes were created during Geographic Detail v1.

## Approved visual-finish baseline

**Visual Finish v1 is canonical as of 2026-09-20.**

This milestone polishes the Dravakh Map Studio authoring presentation without changing physical geography, hydrology, province assignment, biome assignment or landmark placement.

Approved treatment includes:

- muted landmass support color;
- biome opacity `0.88`;
- gray relief opacity `0.72`;
- subdued blue-gray rivers and lakes;
- dark earth coastline;
- thin aged-bronze province borders;
- low-opacity province fill for editor overlays;
- unified bronze heraldic shield styling for all 15 canonical landmarks;
- deeper dark vignette framing.

The visual-finish layer is persisted through native style data plus canonical metadata and is verified after machine `.map` reload.

Canonical visual-finish milestone:

`dravakh-map-v2-20260920-visual-finish-v1.map`

Size: `4,836,783 bytes`

SHA-256:

`c91c28211d18c0ed64a1859a0a93d853f9bd423e461338c6999446f526a9a8fb`

Final validated head:

`7aada0b32f35beacf1ba6320681a6ff0ce2685fe`

Focused map gate:

- run `35532027212`
- job `106134214750`
- artifact `10612165408`
- artifact digest `sha256:5853c35162757e215b58b8107ab0a7d71912f165dafd6f052f4d00bbbbfb62f6`
- result **success**

A second durable archive exists in the project Drive Milestones folder with ID:

`1AscKpEGVUVP0UcckcSso4sMMR8W9Tepk`

No principal routes were created during Visual Finish v1.

## Historical lost Work-session state

A prior Azgaar session in ChatGPT Work created a browser-local reconstruction that was lost before durable export. It remains historical context only and does not override the current canonical physical, hydrology or province milestones.

## Current reconstruction policy

The reconstruction is performed in a persistent, version-controlled workflow.

Priorities:

1. preserve compatibility with Azgaar `.map` files;
2. keep canonical Dravakh project data in source control;
3. save milestone `.map` files outside browser-only IndexedDB;
4. export useful SVG / GeoJSON / JSON artifacts when stable;
5. keep the main game repository independent from Azgaar runtime internals;
6. use Dravakh Map Studio as a cartographic authoring tool, not as the final in-game UI.

The dedicated `Validate Dravakh Map Gate` workflow is the focused runtime gate for map-specific changes. Full repository CI remains the general regression gate.

## Next technical milestone

**Routes & Infrastructure v1 — define the principal cartographic connections of the approved world.**

This gate may add principal overland routes, passes, crossings and necessary maritime connections while treating Physical Baseline v1.1, Hydrology v1, Province Placement v1, Landmarks v1, Geographic Detail v1 and Visual Finish v1 as immutable inputs.

This remains a map/infrastructure phase only. Economy, wars, progression and other gameplay systems remain out of scope.
