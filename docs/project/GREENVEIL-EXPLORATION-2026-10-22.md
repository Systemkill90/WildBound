# Greenveil exploration desktop test — October 22, 2026

![Actual packaged High-setting capture at the first creek bridge](../art/greenveil-exploration-playtest.png)

## Build and scope

The owner's corrected priority is a populated exploration map before animal gameplay. Work began from current GitHub `main` / `6ca9fc9` in the documented desktop project, isolated on `staging/greenveil-exploration-2026-10-22`. Animal-intent PR #9 remained an open, unmerged draft; its commits were not used.

New map: `/Game/Maps/GreenveilExploration`, 180 × 160 m. Three cottage placeholders, two bridges, gardens/fences, workbenches/tool silhouettes, an overlook, creek, terrain and trails sit among instanced vegetation. [Exact counts](evidence/greenveil-generation-2026-10-22.json) and [asset provenance](../art/GREENVEIL-ASSET-INVENTORY.md) are recorded separately.

Engine 5.8.4, [engine build identifier redacted]; MSVC 14.44.35229 toolchain; Windows SDK 10. Editor and Win64 Development game targets compiled. Corrected UAT cook/stage/archive returned 0 after 127 seconds. Package: `<local-project-root>\Builds\GreenveilExploration-2026-10-22-R2`, approximately 1.20 GB before test captures.

## Packaged tests

Machine: [CPU model redacted], [GPU model redacted], approximately [memory amount redacted] RAM; Windows 11. Both runs used the R2 packaged executable, native 1920×1080, screen percentage 100%, dynamic resolution off, VSync off and no FPS cap. Hardware ray tracing is disabled. No build/diagnostic commandlet ran concurrently. High was the first packaged run; Medium followed it, so process/shader caches differ.

The probe feeds the real Character Movement input path, turns the player-controller camera toward each leg and captures rendered screenshots. It does not teleport the pawn. After its initial warm-up window it samples wall-clock intervals between ticks; screenshot overhead and remaining hitches are included. These are complete-frame timings, not isolated GPU times or an exhaustive hardware benchmark.

| Result | High, all groups 2 | Medium, all groups 1 |
| :-- | --: | --: |
| Waypoints | PASS, 15/15 | PASS, 15/15 |
| Travel | 326.1 m | 326.0 m |
| Complete navigation paths | 14/14 | 14/14 |
| Animal actors | 0 | 0 |
| Frame samples | 2,311 | 2,877 |
| Mean frame | 23.968 ms | 19.157 ms |
| Mean FPS | 41.72 | 52.20 |
| p95 frame | 26.480 ms | 22.041 ms |
| p99 frame | 29.668 ms | 24.112 ms |
| Process physical memory at end | 1,528.6 MiB | 1,418.8 MiB |
| Process peak physical memory | 4,408.7 MiB | 1,721.1 MiB |

Both runs entered/exited the first cottage, crossed both bridges and completed the woodland return. All recorded waypoints were grounded; all path queries were valid and non-partial. Machine-written [High](evidence/greenveil-high-2026-10-22.txt) and [Medium](evidence/greenveil-medium-2026-10-22.txt) summaries are tracked. Local raw logs, sorted frame CSV and rendered captures remain in the archive's `Evidence` directories and project `Saved/GreenveilBuild`.

This demonstrates bounded traversal, navigation and memory use. **Neither profile sustained 60 FPS on this machine.** Medium is the normal launcher default, with a 60 FPS ceiling. Further optimization is needed for a native-1080p locked-60 target; no minimum hardware spec is inferred.

## Defects corrected during actual testing

- Named Python rotation arguments fixed tilted foliage. OBJ axis/winding correction restored the terrain; bounds, rendering and collision traversal were checked afterward.
- A bare spawned nav volume had zero extent. The editor volume factory now creates its real brush; asset compilation finishes before the nav build. Generated bounds span X ±9,000, Y ±8,000, Z −1,500 to 2,500 cm. Editor projection and packaged pathfinding pass.
- Four CC0 materials now save instanced-static-mesh usage flags, preventing default-material fallbacks.
- The first return segment collided with a cottage. The tested route returns west of the hamlet and passes.
- The first cook failed with eight Landmass/editor-texture exclusion errors. Omitting `SkipCookingEditorContent` fixed the cook; no missing-content error was suppressed.

## Protection and limits

The prior `WildBoundPreAlpha5` package was not overwritten. Its baseline inventory and the pre-existing local GreenveilField map edit are in `<local-project-root>\Cache\GreenveilExplorationBaseline-2026-10-22`. R2 uses a separate archive. Source-restricted Epic/Fab art stays local; new original map/assets use LFS. See the inventory for exact rights evidence and boundaries.

Static wiring passed 61 checks and both Python files parsed. Documentation validation passed 189 internal links before the rendered-capture link was added. These checks do not substitute for packaged gameplay. The protected package's before/after file inventory matched in paths, sizes and modification times.

This is a local pre-alpha exploration demo. Architecture, tools, creek water and Quinn remain placeholders; interiors are sparse. There is no new fluid/swimming, dynamic weather/day-night, gathering, farming, NPC, animal, multiplayer or persistence system. Daylight and fog provide atmosphere. Terrain is a static heightfield mesh. One automated loop does not exhaustively test physical keyboard/mouse bindings, jumping, every off-trail obstacle, camera obstruction or long-run stability. Those remain manual QA work.

[Current state](CURRENT-STATE.md) · [Handoff](SESSION-HANDOFF.md) · [Roadmap](../../ROADMAP.md)

## Relocated-NVMe package verification

After the storage relocation, the editor and Win64 package were rebuilt from `<local-project-root>\Project` using UE 5.8.4 in local storage. The new package is `<local-project-root>\Builds\GreenveilExploration-2026-10-22-NVMe-Verified`; the packaged game was launched afterward and left open on the desktop.

The uncapped, native-1920×1080 Medium automated cold-start traversal passed **15/15 grounded waypoints**, travelled **326.0 m**, and recorded **zero navigation failures and zero animal actors**. Across 2,700 frames it averaged **49.03 FPS** (20.398 ms), with **23.046 ms p95 / 24.917 ms p99**. End-of-run physical memory was **1,679.1 MiB**, peak was **3,991.0 MiB**. The log recorded many shader/PSO cache misses during startup, so this is a cold-start measurement, not a settled-play estimate or a 60 FPS claim. See [the latest packaged capture](../art/greenveil-exploration-verified-2026-10-22.png) and `GreenveilTraversal-summary.txt` in the packaged game's Saved directory.

The project now resides on `<local-project-root>\Project`, with UE 5.8.4 and the local asset library on the F: NVMe. Legacy D: paths resolve through junctions; the package and its launcher remain on D:. The Unreal Derived Data Cache, VS Code extensions/profile and current local project are on E:. The 2 TB G: USB holds Ollama model files. Buffalo NAS was not mounted during this checkpoint.

Visual review of the new route capture confirms the authored vegetation/creek environment renders in the packaged build. It also shows an over-bright clearing and the current mannequin/cottage placeholders; those remain visible polish work. The automated route verifies movement and grounding, not hand-operated feeding, watering, construction, multiplayer, or animal behavior.
