# Dravakh fork changelog

## 2026-09-18 — Landmarks v1 approved

- added `src/dravakh/landmarks.ts` as a canonical 15-landmark layer using native persistent Azgaar markers;
- bound one approved primary landmark to every canonical province without converting landmarks into artificial city/burg semantics;
- resolved placement deterministically from the canonical province/landmark anchor plan;
- validated province containment, valid land, anchor proximity, coastal requirements, river association, highland placement and Highhallow insularity;
- stored canonical landmark names in marker notes and locked/pinned all canonical markers against random regeneration;
- preserved non-canonical Azgaar-generated marker data but changed the default Dravakh map view to prioritize pinned canonical landmarks, removing visual clutter without destructive deletion;
- extended the focused Playwright gate to require all 15 canonical landmark identities and exact landmark persistence across a real machine `.map` save/reload;
- passed final focused map-gate run `35376241737`, job `105701471298`, on head `acd9cdb228cfd822e4e8bfbb3ec4d6b4ade0c3cc`;
- archived final map-gate artifact `10560172108`, digest `sha256:87af2d5b7a84b8c79541ee8884cd1dcd86b3decfbae7f847b03a50f76dd67fcb`;
- machine-exported canonical milestone `dravakh-map-v2-20260918-landmarks-v1.map`, size `4,561,238 bytes`;
- recorded milestone SHA-256 `1de3271d04d38fee37862f698a8148bbe0c93205a4971fc048090301670e51dc`;
- archived a second durable copy under the project Drive Milestones folder with file ID `1lBfDcvriok1X1h9_UzckKZOsOmcD3sY_`;
- preserved the physical, hydrology and province milestones separately;
- advanced the next official gate to Geographic Detail v1;
- kept principal routes deferred through the geographic-detail phase.

## 2026-09-18 — Province Placement v1 approved

- implemented deterministic territorial reconstruction in `src/dravakh/provinces.ts` using native Azgaar land-cell topology instead of hand-drawn SVG polygons;
- resolved canonical anchors by province `id`, preventing JSON ordering from misbinding province identities;
- corrected the territorial priority-queue implementation before approval;
- normalized the political layer to one Dravakh kingdom with exactly 15 canonical provinces;
- made water an absolute border barrier while relief, rivers and province-specific terrain preferences influence expansion cost;
- preserved Highhallow as a fully insular eastern domain;
- connected the canonical partition to the real Dravakh generation runtime;
- extended the focused Playwright gate to verify exact canonical identities, full land coverage, anchor assignment, primary-feature continuity and Highhallow exclusivity;
- generated and visually inspected the province overlay without obvious long tendrils or territorial leakage;
- exported a real machine `.map` during the gate and detected that reload was recomputing a small number of border cells;
- fixed `src/dravakh/runtime.ts` so an already-persisted canonical province layer is recognized and preserved 1:1 rather than regenerated;
- passed focused map-gate run `35374410525`, job `105695597421`;
- archived map-gate artifact `10559333632`, digest `sha256:71a5515430c421293c365ab4df3d270e0d26bde500283914850115343a0599ce`;
- machine-exported canonical milestone `dravakh-map-v2-20260918-1422-provinces-v1.map`, size `4,550,644 bytes`;
- recorded milestone SHA-256 `24daf57e2b8a69102abf0cbd67a1d96a94ee75ccea45ff4fba68651eb803cbe0`;
- archived a second durable copy under `03 — World & Design Bible / Mapa & Map Studio / Milestones` with Drive file ID `1c4JGZB5cQcXB9nVkNh3TRuRIhW_hOBSo`;
- preserved the physical-baseline and hydrology milestones separately;
- advanced the next official gate to placement and validation of all 15 primary landmarks;
- kept principal routes explicitly deferred.

## 2026-09-16 — hydrology v1 approved

- audited the river network Azgaar derived from physical baseline v1.1 and identified that the original dominant basin drained west instead of originating in Sanctum Crest and converging through Rivermend;
- corrected the cause in terrain rather than hardcoding river geometry, adding a shallow north-south drainage corridor from the southern Sanctum flank through Soldier's Wall, the central valley and Rivermend toward the southern coast;
- preserved the approved coastline, Highhallow maritime channel, protected bays, island separation and physical macrogeography;
- regenerated the current heightmap at `768 × 1152`, SHA-256 `de46853a423486fae9dde8b44c4e089d924760fa38ee4bca3ab0af16a5058c3b`;
- validated a dominant terrain-derived continental river system with discharge `12705`, more than 3.4× the second-largest root basin;
- verified Dreamrest western meltwater, White Keep northeastern drainage, Ironforge tributaries, Harvest Hall alluvial support, locally scaled Highfest Haven streams and short Highhallow island drainage;
- explicitly kept Azgaar-generated river names non-canonical; runtime names remain diagnostic only;
- added a focused `Validate Dravakh Map Gate` workflow for map-specific runtime regression checks while preserving the full repository CI as the general regression gate;
- added runtime assertions for the canonical hydrology constraints without hardcoding a generated river name or exact river geometry;
- machine-exported `dravakh-map-v2-20260916-1635-hydrology-v1.map`;
- verified `.map` reload with exact map name, seed, graph dimensions, full height grid and serialized river topology equality;
- recorded hydrology milestone SHA-256 `160afd20c8ad13abae1c15acf90dfc541fdac2935a9a1451a17bb94f12aec71e`;
- archived a second durable copy under `03 — World & Design Bible / Mapa & Map Studio / Milestones` in the project Drive while preserving the previous physical-baseline milestone;
- advanced the next official gate to reconstruction of exactly 15 canonical province geometries.

## 2026-09-09 — physical baseline v1.1 approved

- fixed production runtime bundling so the Dravakh module no longer requests raw `/dravakh/runtime.ts`;
- enabled and validated branch deployment through GitHub Pages;
- added a real runtime gate for `Dravakh Baseline v1` at the canonical `768 × 1152` ratio;
- fixed Playwright build-cache invalidation so generator changes cannot reuse stale `dist` output;
- refined Sanctum Crest, Ironforge Reaches, Ironbank Ridge, Highhallow and supporting relief from concentric domes into asymmetric ridge systems;
- preserved the approved continental coastline, Highhallow channel, basins and land/water constraints;
- approved physical baseline revision 1.1 after deterministic and visual validation;
- machine-exported `dravakh-map-v2-20260909-1141-physical-baseline.map`;
- verified `.map` reload with exact seed, graph dimensions and full height-grid equality;
- archived the physical milestone under `03 — World & Design Bible / Mapa & Map Studio / Milestones` in the project Drive;
- advanced the next official gate to hydrology validation.

## 2026-09-06 — dravakh-studio-v1 bootstrap

- created isolated development branch;
- branded package/PWA metadata for Dravakh Map Studio;
- prepared GitHub Pages workflow for the branch;
- added canonical Dravakh project/province data;
- documented the lost Work-session map state;
- added backup, deployment, upstream and implementation policies;
- reserved `maps/` for durable cartographic artifacts.
