# Dravakh Map Studio — Province Placement v1

## Status

Candidate technical placement plan. Province borders are not yet canonical in the reconstructed map.

## Purpose

Preserve the approved macro-position of all 15 provinces while allowing Azgaar borders to follow believable terrain, rivers, valleys, coasts and choke points.

Candidate normalized province/landmark anchors are stored in:

`maps/dravakh-province-anchors-v1.json`

Anchors identify the intended province core and primary landmark. They do **not** define polygon borders.

## Placement rules

- Exactly 15 provinces.
- Highhallow remains fully insular.
- Soldier's Wall occupies the natural northern choke.
- Swiftstride Pass remains a narrow real corridor/pass.
- King's Road remains a longitudinal territorial domain, not only a route overlay.
- Hearthkeep remains compact and central.
- Ironforge Reaches remains physically distinct from Sanctum Crest.
- Rivermend must align with the dominant hydrographic basin.
- Harvest Hall occupies fertile alluvial lowlands.
- Ironbank Ridge remains the extreme southwestern rocky massif.
- Highfest Haven remains associated with the protected southeastern bay.

## Approval gate

Province reconstruction is approved only after:

1. physical baseline is approved;
2. hydrology is approved;
3. exactly 15 province cores are assigned to the canonical anchors;
4. borders follow physical geography rather than arbitrary equal partitioning;
5. all 15 primary landmarks can be placed on valid land cells;
6. a durable `.map` backup is exported and successfully reloaded.

Routes remain deferred until this entire gate is complete.
