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

## Hydrology baseline

- Main river systems originate in Sanctum Crest.
- Western meltwater can feed Dreamrest.
- Eastern drainage can reach White Keep.
- The dominant river system flows south and converges in Rivermend.
- Harvest Hall is sustained by the southern alluvial system.
- Highfest Haven uses smaller regional watercourses; no arbitrary giant river through the city.
- Rivers must follow relief and believable drainage.

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

That browser-local `.map` state is considered **lost unless independently recovered**. It must not be treated as a durable project artifact.

## Current reconstruction policy

The new reconstruction must be done in a persistent, version-controlled workflow.

Priorities:

1. preserve compatibility with Azgaar `.map` files;
2. keep canonical Dravakh project data in source control;
3. save milestone `.map` files outside browser-only IndexedDB;
4. export useful SVG / GeoJSON / JSON artifacts when stable;
5. keep the main game repository independent from Azgaar runtime internals;
6. use Dravakh Map Studio as a cartographic authoring tool, not as the final in-game UI.

## Next technical milestone

Create a reproducible Dravakh baseline that can be saved as a `.map` file and restored without relying on browser storage.

Do not start routes before the physical baseline, 15 province assignment and 15/15 main centers are verified.
