# Dravakh Map Studio — Backup Protocol

## Rule

Browser IndexedDB is a convenience cache, never the source of truth for Dravakh maps.

Every approved cartographic milestone must produce a machine-exported `.map` file.

## Required milestone backups

Save a new `.map` file after each of these checkpoints:

1. physical geography approved;
2. Highhallow and coastline approved;
3. hydrology approved;
4. 15 canonical provinces approved;
5. 15/15 provincial centers approved;
6. principal routes approved;
7. final authoring baseline before export to the game project.

## File naming

Use:

`dravakh-map-v2-YYYYMMDD-HHMM-<milestone>.map`

Examples:

- `dravakh-map-v2-20260906-2300-physical-baseline.map`
- `dravakh-map-v2-20260906-2330-provinces-15.map`
- `dravakh-map-v2-20260907-0015-centers-15.map`

## Storage targets

At least two durable copies are required for approved milestones:

- local/device download or project working storage;
- project-controlled cloud storage or repository artifact/archive.

A browser-only save does not satisfy the backup requirement.

## Verification

After downloading a milestone `.map`:

1. confirm the file exists and has non-zero size;
2. keep the previous milestone until the new one has been reopened successfully;
3. when practical, reload the exported `.map` in Dravakh Map Studio and visually verify the map;
4. never overwrite the only known-good milestone.

## Exports

SVG, GeoJSON and JSON are derivatives and are not substitutes for the `.map` authoring source.

The `.map` file is the editable cartographic source; exports are integration artifacts.
