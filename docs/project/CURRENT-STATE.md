# Wildbound current state

Updated October 22, 2026 after V6 creek material rollback, packaging and a packaged traversal.

## Active priority: exploration before animals

The owner's correction supersedes the previous care/enclosure sequence: **no animal gameplay work yet**. Refine a visually full, walkable Greenveil zone first. Animal-intent [PR #9](https://github.com/Systemkill90/WildBound/pull/9) remains a separate, paused, unmerged draft; none of its commits are included here.

The active Greenveil work is on a staging branch based on the current public `main`. The local checkout, engine installation and licensed source assets are workstation-specific and are intentionally not recorded here. The supported project target is UE **5.8.4**.

## What is playable

`/Game/Maps/GreenveilExplorationPolish` is the current launch map, an original **180 × 160 m** zone with rolling collision terrain, a creek, two timber bridges, connected trails, three walk-in cottage placeholders, gardens/fences, worktables/tool silhouettes, household props, an overlook shelter, daylight and valley mist. Quinn supplies controllable third-person movement and animation. This is a bounded slice, not the complete Greenveil region.

The regenerated scene has **370 actors**, with HISM groups containing **507 hornbeams, 9,041 grass/clover instances, 5,703 understory plants, 259 wind shrubs, 140 moss rocks, 36 creek-bank stones and 25 stumps**. [V5 generation evidence](evidence/greenveil-generation-v5-2026-10-22.json) records exact counts and route coordinates.

This map suppresses animal spawning, care/construction bindings and their HUD prompts. Both packaged tests counted **zero animal actors**. Legacy classes remain in the module and can still pull unused prototype art into the cook; they were not extended.

## Verified results

Editor and Win64 Development targets compiled. V6 map regeneration reported zero errors; fresh Windows cook, stage and archive succeeded. The V6 Windows package remains in its local archive outside the repository and the automated test process has exited. Earlier V4 and V5 packages remain untouched.

The earlier V4 package passed **15/15 waypoints over approximately 326 m**, including cottage entry/exit and both bridges, using real Character Movement input. Every recorded waypoint was grounded and all **14 navigation queries** passed at both settings below.

| Native 1920×1080, uncapped | Mean FPS | p95 / p99 frame | Process peak |
| :-- | --: | --: | --: |
| High, all scalability groups 2 | 41.72 | 26.480 / 29.668 ms | 4,408.7 MiB |
| Medium, all groups 1 | 52.20 | 22.041 / 24.112 ms | 1,721.1 MiB |

The latest V6 package passed **15/15 grounded waypoints over 326.1 m** in one run, with 14/14 valid navigation legs, zero navigation failures and zero animal actors. At native 1920×1080 Medium, it averaged **50.03 FPS** (p95/p99 22.649/24.587 ms; peak 1,614.6 MiB). Screen percentage was 100%, dynamic resolution and VSync off. **This single traversal does not demonstrate a sustained 60 FPS.** Medium is the normal launch default, with a 60 FPS ceiling. The restored creek material is readable in the actual capture; the clearing remains over-bright. Full results are in the [test report](GREENVEIL-EXPLORATION-2026-10-22.md). Test hardware details and local paths are intentionally omitted from this public report.

The V5 PBR creek experiment compiled and packaged but rendered nearly black in the actual capture; V6 restores the previous, more readable material. Clearings remain over-bright. Neither package is a graphics-complete milestone. See the [test report](GREENVEIL-EXPLORATION-2026-10-22.md).

Static project wiring passed **61 checks**. See the [full report](GREENVEIL-EXPLORATION-2026-10-22.md) and machine-written [High](evidence/greenveil-high-2026-10-22.txt) / [Medium](evidence/greenveil-medium-2026-10-22.txt) results.

## Assets and recovery

The [asset inventory](../art/GREENVEIL-ASSET-INVENTORY.md) distinguishes local Epic/Fab art, CC0 assets, original placeholders and concept images. Sample/mannequin source remains local and ignored. The generated exploration maps/assets and reviewed CC0 material changes are tracked through LFS. Another checkout needs the licensed local mounts and mannequin installation.

`WildBoundPreAlpha5` remains in its original package directory. The pre-existing modified `GreenveilField.umap` remains local and is excluded from this commit. No merge to `main` has occurred.

## Limits and next work

Buildings, creek water, tools and player appearance are placeholders; interiors are sparse. Mist/daylight supply atmosphere without dynamic weather or a day/night cycle. Terrain is a static heightfield mesh, not voxel terrain or an editable Landscape. There is no new fluid/swimming, gathering, farming, NPC, animal, multiplayer or persistence system.

The automated loop is representative, not exhaustive manual QA of keyboard/mouse, jumping, every side path, obstacle or camera angle. The V6 capture shows readable creek water but retains bright clearing patches, Quinn's mannequin and block-built cottages. Resume with exposure refinement, then manual off-trail collision/camera/jump checks and profiling within this zone. Historical animal/native-test and listen-server results in Git history do not validate this exploration build.
