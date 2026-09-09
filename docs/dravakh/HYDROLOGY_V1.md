# Dravakh Map Studio — Hydrology v1

## Status

Candidate technical reconstruction plan. Not canonical until reviewed in the Azgaar runtime.

## Principle

Hydrology follows relief. The order is:

`relief -> drainage -> rivers -> political interpretation`

Rivers must not be placed merely to match province names or visual composition.

## Canonical constraints

- The dominant continental drainage originates in Sanctum Crest.
- The principal southbound system crosses the northern choke near Soldier's Wall.
- The main continental convergence occurs in Rivermend.
- Dreamrest receives western meltwater and may support lakes/wetlands.
- White Keep receives eastern meltwater draining to the northeastern coast.
- Ironforge Reaches contributes tributaries but is not the primary continental source.
- Harvest Hall is an alluvial southern/southwestern lowland.
- Highfest Haven uses smaller local watercourses; no arbitrary giant river through the port.
- Highhallow has short island streams/cascades only.

## Technical plan

Candidate normalized control paths are stored in:

`maps/dravakh-hydrology-plan-v1.json`

These points are guidance for reconstruction/review, not hardcoded final river geometry.

## Approval gate

Hydrology may be marked approved only after:

1. `Dravakh Baseline v1` is loaded in Dravakh Map Studio;
2. Azgaar derives drainage from the actual heightmap;
3. the main flow direction is consistent with the canonical constraints above;
4. no major river crosses a ridge implausibly;
5. Rivermend functions as the dominant center-south convergence zone;
6. Highfest Haven and Highhallow remain locally scaled systems;
7. a durable external `.map` backup is saved after approval.
