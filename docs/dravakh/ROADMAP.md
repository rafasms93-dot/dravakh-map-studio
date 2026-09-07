# Dravakh Map Studio — v1 Roadmap

## Phase 1 — Fork safety and project identity

- [x] isolate development on `dravakh-studio-v1`;
- [x] preserve upstream MIT license;
- [x] add Dravakh project attribution notice;
- [x] add canonical 15-province project data;
- [x] document lost Work-session state;
- [x] document durable `.map` backup policy;
- [x] prepare GitHub Pages deployment from the Dravakh branch.

## Phase 2 — Runtime branding and safe persistence

- [x] replace player/developer-visible upstream title with `Dravakh Map Studio` while keeping Azgaar attribution;
- [x] remove upstream analytics identifiers from the fork runtime;
- [x] add a Dravakh-specific save/export entry point;
- [x] add a clear warning when the current map has changes without a durable external backup;
- [x] add a `.map` backup helper and unload guard.

Implementation notes:

- runtime branding and analytics stripping are applied through `vite.config.ts` without restructuring the large `src/index.html` monolith;
- `src/dravakh/runtime.ts` adds the Dravakh status/backup surface;
- machine and Dropbox saves emit durable-backup events from `src/services/io/save.ts`;
- browser IndexedDB saves are explicitly treated as local-only, not durable authoring backups.

## Phase 3 — Reproducible Dravakh baseline

- [ ] implement/import controlled physical baseline;
- [ ] verify Highhallow as an island domain;
- [ ] verify hydrology;
- [ ] generate or assign exactly 15 canonical provinces;
- [ ] place and verify all 15 primary provincial centers;
- [ ] save and reload the canonical `.map` milestone.

## Phase 4 — Routes and integration exports

- [ ] create principal route network;
- [ ] export SVG;
- [ ] export GeoJSON / JSON useful to the main game project;
- [ ] document mapping from Azgaar province IDs to Dravakh canonical province IDs.

## Phase 5 — Main-game handoff

- [ ] integrate stable geometry/data into the Nova Valyria OS repository;
- [ ] keep Azgaar runtime outside the shipped game unless explicitly required;
- [ ] use the final art layer separately from the technical cartographic geometry.
