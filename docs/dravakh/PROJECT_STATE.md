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

**Place and approve all 15 canonical primary landmarks on top of Province Placement v1.**

Landmarks must remain physically plausible and belong to their approved provinces.

Do not create principal routes until the physical baseline, hydrology, 15 provinces and 15/15 main landmarks are all verified.
