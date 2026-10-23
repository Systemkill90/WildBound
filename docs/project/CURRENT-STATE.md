# Wildbound current state

Updated October 23, 2026 after the resource-aware source audit and village-sample inspection attempt.

## Active priority: exploration before animals

The owner's correction supersedes the previous care/enclosure sequence: **no animal gameplay work yet**. Refine a visually full, walkable Greenveil zone first. Animal-intent [PR #9](https://github.com/Systemkill90/WildBound/pull/9) remains a separate, paused, unmerged draft; none of its commits are included here.

The current generated map is a traversal/mechanics test, not the representative art base. It uses a single tiling terrain material, uniform deterministic scatter, a mannequin and box-built cottages. Six optional Poly Haven CC0 asset sets are imported into a local candidate-only Unreal folder; none are placed in a map. Their flower meshes still need proper material/texture bindings. A read-only inventory of Electric Dreams' PCG forest found 391 mesh components, about 572,150 instances and 164 mesh types across roughly 512 × 512 m, so that full scene is too large and dense to use directly. The saved `SaveForestSliceCopy` log shows that a whole-map save started Nanite builds for 199 referenced meshes, with several estimated at 3–6 GB each, and failed allocating 137.3 MiB because the Windows paging file was too small. No candidate map was saved and the source remains unchanged. The editor overhead view confirms a dense canopy asset set, but not a playable ground-level route. A read-only 50 m scatter-sampling grid suggests an interior 100 × 100 m preview window at X=5,000–15,000 cm, Y=5,000–15,000 cm with 552 sampled instances versus a median 1,081 for comparable windows. This remains an unconfirmed review candidate. The latest Greenveil captures still show bright ground, a mannequin and blockout cottages. The owner has now directed the test grounds toward a small starter village; see the [village slice brief](../world/greenveil-starter-village.md). The free Medieval Village Megascans Sample has now been acquired from Fab as a separate local project; its output project is associated with UE 5.8, while the cached source manifest identifies UE 5.3. It contains five village World Partition maps and a crow debug map. The main sample World Partition map loaded in UE 5.8 editor mode, but its 16K minimap started an estimated 11.7 GiB texture rebuild and the editor was stopped before visual inspection. Standalone game mode bypassed the minimap and Zen 507, but rebuilt static-mesh/Nanite data; the warm-cache retry reached 192/258 static meshes before system commit pressure forced a stop, before gameplay. A reversible local sample-only shader-worker cap now limits shader compilation to two workers, and the DDC cache is retained. The original forest editor remains responsive. No sample map has been visually inspected or used in Wildbound. **Next:** resolve local paging/commit capacity or identify a smaller sample slice, inspect its visuals in UE 5.8, then select a bounded village route before deriving a Greenveil map. Keep the existing map/package as rollback, retain the movement foundation, and do not expand animal gameplay. This pass has no new Wildbound compile or package result.

The active Greenveil work is on a staging branch based on the current public `main`. The local checkout, engine installation and licensed source assets are workstation-specific and are intentionally not recorded here. The supported project target is UE **5.8.4**.

## Latest source and resource checkpoint

The source audit added one-second ticking for animal needs, throttled the inactive animal HUD trace to 10 Hz, moved input/navigation dependencies to the private module list, and made the default launcher target the polished Greenveil map. Windows build helpers now select a conservative UBT worker count from available system commit, refuse low-headroom compiles, and require more headroom before map generation or packaging. The resource-policy test, 70 project-wiring checks, 260 documentation links and 69 portable C++ checks pass. Unreal Header Tool completed during the latest build attempt, but the Unreal C++ target did not finish before the safety reserve was reached. No new compile, package or gameplay result is verified; use the prior packaged build as the playable checkpoint.

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

The post-sync baseline editor build and Windows package also succeeded without regenerating the map. Its native-1080p Medium traversal averaged **49.19 FPS**; it remains useful as a comparison, not the latest result. See the [test report](GREENVEIL-EXPLORATION-2026-10-22.md).

The exposure-tuned package passed **15/15 waypoints over 326.1 m**, with zero navigation failures and zero animal actors. Across 2,790 frames it averaged **50.61 FPS**; the clearing remains too bright and Quinn/cottages are placeholders. This was one automated traversal, not manual playtesting.

The latest native-1080p package traversal measured **55.26 FPS** at all-Medium settings with screenshots disabled. Unreal Insights showed an average GPU frame near 17.94 ms and a 5.45 ms average shadow-depth pass. Keeping all other groups at Medium while setting shadows to Low produced a guarded repeat of **75.89 FPS** over 15/15 waypoints, with 15.205 ms p95 and zero nav failures/animal actors. The helper polls Ollama and yields the benchmark if a local model loads. Low shadows remain an opt-in test; visual quality has not been manually checked, and the normal Medium default remains unchanged. These are single traversal results, not sustained-performance certification. See the [latest test report](GREENVEIL-EXPLORATION-2026-10-22.md).

The V5 PBR creek experiment compiled and packaged but rendered nearly black in the actual capture; V6 restores the previous, more readable material. Clearings remain over-bright. Neither package is a graphics-complete milestone. See the [test report](GREENVEIL-EXPLORATION-2026-10-22.md).

Static project wiring passed **65 checks**, documentation validation checked **218 internal links**, and the three portable C++ suites passed **34 animal simulation, 22 snapshot, and 13 placement checks**. These source checks are not Unreal gameplay tests. See the [full report](GREENVEIL-EXPLORATION-2026-10-22.md) and machine-written [High](evidence/greenveil-high-2026-10-22.txt) / [Medium](evidence/greenveil-medium-2026-10-22.txt) results.

## Assets and recovery

The [asset inventory](../art/GREENVEIL-ASSET-INVENTORY.md) distinguishes local Epic/Fab art, CC0 assets, original placeholders and concept images. Sample/mannequin source remains local and ignored. The generated exploration maps/assets and reviewed CC0 material changes are tracked through LFS. Another checkout needs the licensed local mounts and mannequin installation.

`WildBoundPreAlpha5` remains in its original package directory. The pre-existing modified `GreenveilField.umap` remains local and is excluded from this commit. No merge to `main` has occurred.

## Limits and next work

Buildings, creek water, tools and player appearance are placeholders; interiors are sparse. Mist/daylight supply atmosphere without dynamic weather or a day/night cycle. Terrain is a static heightfield mesh, not voxel terrain or an editable Landscape. There is no new fluid/swimming, gathering, farming, NPC, animal, multiplayer or persistence system. The next visual milestone is to inspect the acquired village sample, choose a compact village-plus-forest route, and test a separate map while retaining the existing Greenveil map and package as rollback.

The automated loop is representative, not exhaustive manual QA of keyboard/mouse, jumping, every side path, obstacle or camera angle. The V6 capture shows readable creek water but retains bright clearing patches, Quinn's mannequin and block-built cottages. Next, visually inspect the five village sample maps, establish a separate bounded village map with Wildbound's existing movement foundation, then repeat traversal/collision/camera checks and profile native-1080p performance. Historical animal/native-test and listen-server results in Git history do not validate this exploration build.
