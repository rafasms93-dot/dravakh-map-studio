# Dravakh Map Studio — Landmarks v1

## Status

**Canonical and technically approved as of 2026-09-18.**

Landmarks v1 adds exactly one approved primary landmark to each of the 15 canonical provinces on top of Province Placement v1.

## Canonical landmarks

| Province | House | Primary landmark |
| --- | --- | --- |
| Rivermend | House Rhyven | Castelo de Rhyven |
| Harvest Hall | House Goldmere | Salão de Goldmere |
| Dreamrest | House Velmora | Cidadela de Velmora |
| Ironforge Reaches | House Mordrake | Forja de Mordrake |
| White Keep | House Vaelmont | Fortaleza Branca |
| Sanctum Crest | House Asterion | Sanctum de Asterion |
| Citadel Reach | House Caelith | Cidadela de Caelith |
| King's Road | House Valeron | Centro administrativo da Estrada Real |
| Swiftstride Pass | House Veyrad | Fortim de passagem |
| Hearthkeep | Casa do Soberano | Fortaleza da Coroa |
| Soldier's Wall | House Dravorn | Grande Muralha |
| Alliance High | House Aerenth | Palácio de Aerenth |
| Highhallow | House Elyrion | Templo-Fortaleza de Elyrion |
| Highfest Haven | House Merraval | Porto de Merraval |
| Ironbank Ridge | House Ferrane | Fortaleza-Cofre Ferrane |

## Implementation

Canonical landmark logic lives in:

`src/dravakh/landmarks.ts`

The implementation:

- uses native Azgaar markers for persistence and editor compatibility;
- resolves canonical anchor data by province ID;
- places each landmark on valid land inside its own canonical province;
- applies geography-aware scoring for coastal, river, highland, lowland and pass landmarks;
- stores canonical landmark names in marker notes;
- locks and pins all 15 canonical markers;
- recognizes a persisted canonical landmark layer after `.map` reload;
- avoids destructive deletion of unrelated Azgaar marker data.

The Dravakh runtime sets the markers layer to pinned mode by default after applying the canonical landmark layer. This keeps the 15 official landmarks readable while preserving auxiliary Azgaar marker data for authoring/debug purposes.

## Validation gate

The focused runtime gate verifies:

1. exactly 15 canonical landmark markers;
2. exact canonical landmark identities;
3. correct province assignment for every landmark;
4. correct Dravakh state assignment;
5. valid land placement;
6. canonical anchor proximity;
7. coastal placement for White Keep, Citadel Reach and Highfest Haven;
8. river association for Rivermend and Harvest Hall;
9. minimum highland placement for Sanctum Crest, Ironforge Reaches, Ironbank Ridge, Alliance High and Highhallow;
10. Highhallow landmark remains east of the maritime channel and on the Highhallow feature;
11. every canonical marker is locked and pinned;
12. all canonical landmark marker and note data survives a real machine `.map` save/reload exactly.

## Canonical milestone

`dravakh-map-v2-20260918-landmarks-v1.map`

Size:

`4,561,238 bytes`

SHA-256:

`1de3271d04d38fee37862f698a8148bbe0c93205a4971fc048090301670e51dc`

Final validated head:

`acd9cdb228cfd822e4e8bfbb3ec4d6b4ade0c3cc`

Focused map gate:

- run: `35376241737`
- job: `105701471298`
- artifact: `10560172108`
- artifact digest: `sha256:87af2d5b7a84b8c79541ee8884cd1dcd86b3decfbae7f847b03a50f76dd67fcb`
- result: **success**

Second durable Drive archive:

`1lBfDcvriok1X1h9_UzckKZOsOmcD3sY_`

The physical-baseline, hydrology and province milestones remain independently preserved.

## Next gate

**Geographic Detail v1.**

This phase may enrich secondary terrain, local geography and biome readability, but must not change the approved macro coastline, hydrology, province assignments or the 15 canonical landmark cells.

Principal routes remain deferred during this phase.
