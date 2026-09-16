# Dravakh fork changelog

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
