# Wildbound current state

Updated October 22, 2026 after storage relocation, fresh Windows packaging and packaged traversal.

## Active priority: exploration before animals

The owner's correction supersedes the previous care/enclosure sequence: **no animal gameplay work yet**. Refine a visually full, walkable Greenveil zone first. Animal-intent [PR #9](https://github.com/Systemkill90/WildBound/pull/9) remains a separate, paused, unmerged draft; none of its commits are included here.

Branch: `staging/greenveil-exploration-2026-10-22`, started from current GitHub `main` at `6ca9fc9`. Working desktop project: `<local-project-root>\Project`; UE **5.8.4**, [engine build identifier redacted], and the local source asset library reside in local storage. The cloud storage chat workspace is not the Unreal checkout.

## What is playable

`/Game/Maps/GreenveilExplorationPolish` is the current launch map, an original **180 × 160 m** zone with rolling collision terrain, a creek, two timber bridges, connected trails, three walk-in cottage placeholders, gardens/fences, worktables/tool silhouettes, household props, an overlook shelter, daylight and valley mist. Quinn supplies controllable third-person movement and animation. This is a bounded slice, not the complete Greenveil region.

The saved scene has **318 actors**, with HISM groups containing **507 hornbeams, 9,036 grass/clover instances, 5,703 understory plants, 259 wind shrubs, 140 moss rocks and 24 stumps**. [Generation evidence](evidence/greenveil-generation-2026-10-22.json) records exact counts and route coordinates.

This map suppresses animal spawning, care/construction bindings and their HUD prompts. Both packaged tests counted **zero animal actors**. Legacy classes remain in the module and can still pull unused prototype art into the cook; they were not extended.

## Verified results

Editor and Win64 Development targets compiled. Windows cooking, staging and archiving succeeded with UAT exit code 0 after storage relocation. Latest package: `<local-project-root>\Builds\GreenveilExploration-2026-10-22-NVMe-Verified`. The packaged game is currently open on the desktop at native 1920×1080 Medium.

The actual packaged game passed **15/15 waypoints over approximately 326 m**, including cottage entry/exit and both bridges, using real Character Movement input. Every recorded waypoint was grounded and all **14 navigation queries** passed, on both settings below.

| Native 1920×1080, uncapped | Mean FPS | p95 / p99 frame | Process peak |
| :-- | --: | --: | --: |
| High, all scalability groups 2 | 41.72 | 26.480 / 29.668 ms | 4,408.7 MiB |
| Medium, all groups 1 | 52.20 | 22.041 / 24.112 ms | 1,721.1 MiB |

The latest relocated local storage package cold run at native 1920×1080 Medium again passed 15/15 checkpoints, 326.0 m, and zero navigation failures. It recorded **49.03 mean FPS**, **23.046 / 24.917 ms p95 / p99**, **1,679.1 MiB** end memory, and **3,991.0 MiB** process peak over 2,700 frames. Numerous shader/PSO cache misses were logged during this cold run. Screen percentage was 100%, dynamic resolution and VSync off. Machine: [CPU model redacted], [GPU model redacted], approximately [memory amount redacted] RAM. Hardware ray tracing is disabled. **No run demonstrates a sustained 60 FPS.** Medium is the normal launch default, with a 60 FPS ceiling. Full prior and latest results are in the [test report](GREENVEIL-EXPLORATION-2026-10-22.md).

Static project wiring passed **61 checks**. See the [full report](GREENVEIL-EXPLORATION-2026-10-22.md) and machine-written [High](evidence/greenveil-high-2026-10-22.txt) / [Medium](evidence/greenveil-medium-2026-10-22.txt) results.

## Assets and recovery

The [asset inventory](../art/GREENVEIL-ASSET-INVENTORY.md) distinguishes local Epic/Fab art, CC0 assets, original placeholders and concept images. Sample/mannequin source remains local and ignored. The generated exploration maps/assets and reviewed CC0 material changes are tracked through LFS. Another checkout needs the licensed local mounts and mannequin installation.

`WildBoundPreAlpha5` remains in its original package directory. The pre-existing modified `GreenveilField.umap` remains local and is excluded from this commit. No merge to `main` has occurred.

## Limits and next work

Buildings, creek water, tools and player appearance are placeholders; interiors are sparse. Mist/daylight supply atmosphere without dynamic weather or a day/night cycle. Terrain is a static heightfield mesh, not voxel terrain or an editable Landscape. There is no new fluid/swimming, gathering, farming, NPC, animal, multiplayer or persistence system.

The automated loop is representative, not exhaustive manual QA of keyboard/mouse, jumping, every side path, obstacle or camera angle. The latest visual capture shows an over-bright clearing plus the current mannequin and cottage placeholders; next work is exposure/material refinement, manual exploration, off-trail collision checks and further profiling within this zone. Historical animal/native-test and listen-server results in Git history do not validate this exploration build.
