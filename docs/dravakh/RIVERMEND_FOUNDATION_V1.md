# Rivermend Foundation Pass v1

Status: PREPARED REMOTELY / PENDING INTEGRATION

This pass is the first implementation step governed by Dravakh — World Map Canon & Construction Standard v1.0.

## Scope

Rivermend only.

This branch does not rebuild the province and does not attempt visual completion. It records the infrastructure contract needed to begin the Province → Region/Locality → Place/POI model safely.

## Canonical base preserved

- Rivermend is the centre-south hydrological basin.
- Environmental identity: wetlands + grasslands.
- Canonical landmark: Castelo de Rhyven.
- Province anchor remains x=0.49 / y=0.69 in the existing normalized authoring coordinate system.
- Hydrology, province boundaries, biome identity and landmark placement remain protected.

## First region

Ponte Rasa is approved as a Region/Locality belonging to Rivermend.

Its exact geometry is intentionally NOT hard-coded in this preparatory branch because the GitHub remote currently predates the latest route-candidate/review work.

The position must be resolved only after the route topology from Orders 015–017 is present in the working source state.

Placement must:
1. remain inside Rivermend;
2. relate to real hydrology;
3. prefer a real crossing, route group or junction where supported;
4. avoid collision with Castelo de Rhyven;
5. leave enough spatial room for later settlement and local infrastructure;
6. never be chosen only because it looks visually convenient.

## Remote-work rule

Until human visual review is possible:
- infrastructure work may continue inside Rivermend;
- milestones remain PENDING_HUMAN_VISUAL_REVIEW;
- visual polish is deferred;
- no next province may begin.

## Important repository state

The remote dravakh-studio-v1 branch is still at ce12e3bf, while later local work exists after that point, including the route implementation/audits described by Orders 015–017.

For this reason this preparatory branch MUST NOT modify runtime.ts, route IDs or canonical route integration yet.

## Next integration gate

After the newer route state is synchronized into GitHub:
- resolve Ponte Rasa against actual route groups/junctions;
- implement its persisted region identity;
- create a Place/POI only if the real geometry supports a crossing;
- add deterministic tests;
- run save/reload;
- produce the first Rivermend milestone;
- mark it PENDING_HUMAN_VISUAL_REVIEW.

No settlement pass starts before this foundation is technically integrated.
