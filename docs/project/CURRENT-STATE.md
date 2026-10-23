# Wildbound current state

Updated October 22, 2026 after the regenerated creek/bridge pass and two packaged traversal runs.

## Active priority: exploration before animals

The owner's correction supersedes the previous care/enclosure sequence: **no animal gameplay work yet**. Refine a visually full, walkable Greenveil zone first. Animal-intent [PR #9](https://github.com/Systemkill90/WildBound/pull/9) remains a separate, paused, unmerged draft; none of its commits are included here.

The active Greenveil work is on a staging branch based on the current public `main`. The local checkout, engine installation and licensed source assets are workstation-specific and are intentionally not recorded here. The supported project target is UE **5.8.4**.

## What is playable

`/Game/Maps/GreenveilExplorationPolish` is the current launch map, an original **180 × 160 m** zone with rolling collision terrain, a creek, two timber bridges, connected trails, three walk-in cottage placeholders, gardens/fences, worktables/tool silhouettes, household props, an overlook shelter, daylight and valley mist. Quinn supplies controllable third-person movement and animation. This is a bounded slice, not the complete Greenveil region.

The regenerated scene has **370 actors**, with HISM groups containing **507 hornbeams, 9,041 grass/clover instances, 5,703 understory plants, 259 wind shrubs, 140 moss rocks, 36 creek-bank stones and 25 stumps**. [V5 generation evidence](evidence/greenveil-generation-v5-2026-10-22.json) records exact counts and route coordinates.

This map suppresses animal spawning, care/construction bindings and their HUD prompts. Both packaged tests counted **zero animal actors**. Legacy classes remain in the module and can still pull unused prototype art into the cook; they were not extended.

## Verified results

Editor and Win64 Development targets compiled. The regenerated map reported zero errors; the fresh V5 Windows cook, stage and archive succeeded. The V5 Windows package remains in a local build archive outside the repository; it is not currently running. The prior V4 package remains untouched.

The earlier V4 package passed **15/15 waypoints over approximately 326 m**, including cottage entry/exit and both bridges, using real Character Movement input. Every recorded waypoint was grounded and all **14 navigation queries** passed at both settings below.

| Native 1920×1080, uncapped | Mean FPS | p95 / p99 frame | Process peak |
| :-- | --: | --: | --: |
| High, all scalability groups 2 | 41.72 | 26.480 / 29.668 ms | 4,408.7 MiB |
| Medium, all groups 1 | 52.20 | 22.041 / 24.112 ms | 1,721.1 MiB |

The latest V5 package passed **15/15 grounded waypoints over 325.9–326.0 m** in two runs, with 14/14 valid navigation legs, zero navigation failures and zero animal actors. At native 1920×1080 Medium, the cold run averaged **39.38 FPS** (p95/p99 44.751/66.686 ms; peak 1,592.1 MiB); the cache-warmed repeat averaged **49.89 FPS** (p95/p99 22.764/24.609 ms; peak 1,545.8 MiB). The cold log contains shader/PSO misses. Screen percentage was 100%, dynamic resolution and VSync off. Hardware ray tracing is disabled. **Neither run demonstrates a sustained 60 FPS.** Medium is the normal launch default, with a 60 FPS ceiling. Full results are in the [test report](GREENVEIL-EXPLORATION-2026-10-22.md). Test hardware details and local paths are intentionally omitted from this public report.

The V4 checkpoint passed **15/15 grounded waypoints over 326.1 m**, with 14/14 navigation legs, zero animals and zero navigation failures at native 1920×1080 Medium. It measured **50.20 mean FPS**, **22.661 / 24.505 ms p95 / p99**, and **1,606.7 MiB peak memory**. V5 shortens the crossings and adds a PBR creek material; it packages and compiles, but screenshots still show the creek nearly black and clearings over-bright. **The water visual is unresolved.** Neither V4 nor V5 is a graphics-complete milestone. See the [test report](GREENVEIL-EXPLORATION-2026-10-22.md).

Static project wiring passed **61 checks**. See the [full report](GREENVEIL-EXPLORATION-2026-10-22.md) and machine-written [High](evidence/greenveil-high-2026-10-22.txt) / [Medium](evidence/greenveil-medium-2026-10-22.txt) results.

## Assets and recovery

The [asset inventory](../art/GREENVEIL-ASSET-INVENTORY.md) distinguishes local Epic/Fab art, CC0 assets, original placeholders and concept images. Sample/mannequin source remains local and ignored. The generated exploration maps/assets and reviewed CC0 material changes are tracked through LFS. Another checkout needs the licensed local mounts and mannequin installation.

`WildBoundPreAlpha5` remains in its original package directory. The pre-existing modified `GreenveilField.umap` remains local and is excluded from this commit. No merge to `main` has occurred.

## Limits and next work

Buildings, creek water, tools and player appearance are placeholders; interiors are sparse. Mist/daylight supply atmosphere without dynamic weather or a day/night cycle. Terrain is a static heightfield mesh, not voxel terrain or an editable Landscape. There is no new fluid/swimming, gathering, farming, NPC, animal, multiplayer or persistence system.

The automated loop is representative, not exhaustive manual QA of keyboard/mouse, jumping, every side path, obstacle or camera angle. The V5 capture still shows the dark creek, bright patches in the clearing, Quinn's mannequin and block-built cottages. Resume with creek surface/geometry and exposure diagnosis, then manual off-trail collision/camera/jump checks and profiling within this zone. Historical animal/native-test and listen-server results in Git history do not validate this exploration build.
