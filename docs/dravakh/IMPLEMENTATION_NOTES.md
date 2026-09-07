# Implementation notes

## Current branch

`dravakh-studio-v1`

## Safety rules

- Keep `master` as the clean upstream-derived baseline until the Dravakh fork changes are reviewed.
- Do not remove `LICENSE` or upstream attribution.
- Do not rely on browser IndexedDB as the only copy of any approved map.
- Do not treat the previous lost Work-session map as recoverable unless an actual `.map` file is found.
- Keep the final in-game map UI separate from the Azgaar authoring application.

## Initial code changes

- package metadata identifies the fork as Dravakh Map Studio while keeping lockfile-compatible package naming;
- PWA manifest points to the fork's GitHub Pages path;
- Pages workflow is scoped to the Dravakh development branch;
- canonical Dravakh province metadata is represented in TypeScript;
- project state, backup protocol and roadmap are versioned in the repository.

## Next code change

The next runtime-facing change should be small and auditable: update the application title/metadata and remove the upstream Google Analytics tag from `src/index.html` without restructuring the large HTML file.
