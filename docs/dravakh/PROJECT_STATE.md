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

The v1.1 refinement replaced overly concentric relief domes with asymmetric ridge chains without changing the approved coastline or land/water mask.

Canonical physical milestone:

`dravakh-map-v2-20260909-1141-physical-baseline.map`

SHA-256: `b20d62e3d200cbdf05baa8d75019a35c17d27c5d0ec0067743ff1d2619c4d814`

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

Approval-run evidence showed a dominant root-system discharge of `12705` against `3721` for the second-largest root system. Runtime-generated river names are diagnostic only and are **not canonical lore**.

Canonical hydrology milestone:

`dravakh-map-v2-20260916-1635-hydrology-v1.map`

SHA-256: `160afd20c8ad13abae1c15acf90dfc541fdac2935a9a1451a17bb94f12aec71e`

The milestone was reopened successfully and reproduced the map name, seed, graph dimensions, full height grid and serialized river topology exactly.

The physical-baseline milestone remains preserved separately and must not be overwritten by later milestones.

## Canonical provinces

Exactly 15 provinces must exist:

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

Province names, houses and category bindings are canonical. Current province boundaries have not yet been reconstructed on the new persistent baseline.

## Lost Work-session state

A prior Azgaar session in ChatGPT Work reached this state before the browser session was lost:

- physical base approved;
- Highhallow corrected to be fully insular;
- one kingdom renamed to Dravakh;
- exactly 15 canonical provinces created and nominally verified;
- 13 of 15 provincial centers created;
- pending centers:
  - Highfest Haven → Porto de Merraval;
  - Swiftstride Pass → fortim/passagem;
- no principal route network had been created yet.

That browser-local `.map` state is considered **lost unless independently recovered**. It must not be treated as a durable project artifact and does not override the current canonical physical or hydrology milestones.

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

**Reconstruct and approve exactly 15 canonical province geometries on top of the canonical physical and hydrology baselines.**

Province anchors are guidance, not rigid polygon geometry. Borders should follow believable geography and the approved world structure.

Do not place the full landmark layer before the 15-province geometry gate is complete. Do not start principal routes until the physical baseline, hydrology, 15 province assignment and 15/15 main landmarks are verified.
