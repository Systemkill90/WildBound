# Wildbound current state

## October 25 Creative Library pilot

The Garage now has a private-NAS Creative Library importer, an Update Idea Board button, desktop supply form, searchable versioned Git design records, a controlled reference-package service, an AI Librarian staff role, and persistent Missing Reference Requests. A mixed-media transport fixture (Idea Board text, original concept JPG, unrelated Garage voice QA WAV) was copied to the NAS and archived with matching SHA-256 checksums. It is explicitly exploratory and cannot be approved as a coherent design. The Librarian now uses validated subject/facet needs and indexed relationships rather than Dwarf/Merfolk special cases. Focused checks are in [pilot instructions and limits](../creative-library/README.md). The work is on `feature/creative-library-pilot` for PR review; no Unreal maps, builds, saves, licensed assets, or paused animal gameplay were changed.

Updated October 24, 2026: local AI recovery checks passed; World Partition Greenveil package and automated traversal passed. See the newest entry in [daily development](DAILY-DEVELOPMENT.md) and [session handoff](SESSION-HANDOFF.md).

## October 24 verified checkpoint

The local Ollama endpoint and `qwen3.5:9b` completed a real Garage chat and a routed read-only village brief; the AMD image backend started and released cleanly. Ollama was unloaded afterward. These checks confirm those tools work when invoked, not that every task is routed locally.

The authored `/Game/Maps/GreenveilExplorationPolish` is the canonical map generator input; `/Game/Maps/GreenveilExplorationPolish_WP` is the generated runtime map. The 180 × 160 m World Partition slice is smaller than its default streaming load range, so current tests prove startup and traversal, not cell unloading or large-world memory behavior.

**Newest game checkpoint — October 24 follow-up:** UE 5.8.4 editor compile, deterministic map generation, World Partition conversion, and a separate Win64 Development cook/package succeeded. The cook processed 1,028 packages. The village generator now uses locally installed, free Medieval Village Megascans modules for its facade, gable, boarded walls, shingled roof, shuttered window details and shared well, alongside existing local foliage and CC0 ground/path assets. The full sample map was not copied. The clean packaged route passed 15/15 grounded points over 330 m with no navigation failures or animal actors. At native 1920×1080, Medium with Low shadows averaged 89.41 FPS; p95 was 13.493 ms, p99 14.116 ms, and process peak memory 1,547.6 MiB. This is one automated route, not sustained 60 FPS certification.

Visual review found two real problems: post-process eye adaptation produced a black frame, and disabling eye adaptation exposed a disconnected scene rather than a designed village. The user rejected the current asset composition. A launch-time eye-adaptation override was added for the next preview, but it has not yet been rebuilt and visually verified. The firewall dialog was cleared and was not the cause of the black render. Previous packages remain intact. Source-restricted sample assets and generated World Partition outputs stay local; no commit or push was made.

## Active priority: exploration before animals

The owner's current scope is to build Greenveil's small starter village and its walkable surroundings as the continuing game map. Keep `/Game/Maps/GreenveilExplorationPolish` canonical, preserve the existing pawn/game-mode foundation, and extend the village, farm edge, creek crossing and forest loop cumulatively. **No animal gameplay work yet.** Animal-intent [PR #9](https://github.com/Systemkill90/WildBound/pull/9) stays paused, draft and unmerged.

A bounded set of assets from the free Medieval Village Megascans Sample has been migrated into the local Wildbound content tree with dependencies; the sample's full World Partition world remains separate and was not copied. The authored cottages combine actual sample facade, gable, board-wall, roof and shuttered-window meshes with restrained custom fitting details. Existing Poly Haven ground/path materials and local Epic/Quixel environment meshes remain in use. Continue to treat source-restricted assets as local-only and verify repository ignore rules before any future Git operation.

Next, replace the scattered cottage layout with a compact, authored hamlet composition. Inspect the acquired village sample for complete building assemblies, adapt only a bounded cluster that fits Greenveil, and keep its source map and licensed assets separate. Do not spend the next pass adding isolated props or foliage. Rebuild and capture the result before claiming visual improvement, then check collision on the route. Preserve existing packages and do not begin animal, multiplayer, persistence or large-world systems yet.

## Latest source and resource checkpoint

On October 24, UE 5.8.4 compiled WildboundEditor. Scripted Greenveil map generation finished with zero errors (two warnings), World Partition conversion finished with zero errors and warnings, and BuildCookRun successfully cooked, staged and archived the Windows target. The packaged map launched and completed a full automated traversal. This verifies the existing movement foundation and the new map content; no animal gameplay work was added.

## What is playable

`/Game/Maps/GreenveilExplorationPolish` is the current launch map, an original **180 × 160 m** zone with rolling collision terrain, a creek, two timber bridges, connected trails, three walk-in cottage placeholders, gardens/fences, worktables/tool silhouettes, household props, an overlook shelter, daylight and valley mist. Quinn supplies controllable third-person movement and animation. This is a bounded slice, not the complete Greenveil region.

The regenerated scene has **370 actors**, with HISM groups containing **507 hornbeams, 9,041 grass/clover instances, 5,703 understory plants, 259 wind shrubs, 140 moss rocks, 36 creek-bank stones and 25 stumps**. [V5 generation evidence](evidence/greenveil-generation-v5-2026-10-22.json) records exact counts and route coordinates.

This map suppresses animal spawning, care/construction bindings and their HUD prompts. Both packaged tests counted **zero animal actors**. Legacy classes remain in the module and can still pull unused prototype art into the cook; they were not extended.

## Verified results

The October 24 Win64 Development package passed the automated native-1080p route: 15/15 grounded waypoints over 330.0 m, zero navigation failures and zero animal actors. At uncapped Medium with Low shadows it measured 89.66 mean FPS (p95 13.314 ms, p99 14.095 ms); peak process memory was 1,818.5 MiB. This is one automated traversal, not sustained-performance certification. Earlier V4 and V5 packages remain untouched.

The earlier V4 package passed **15/15 waypoints over approximately 326 m**, including cottage entry/exit and both bridges, using real Character Movement input. Every recorded waypoint was grounded and all **14 navigation queries** passed at both settings below.

| Native 1920×1080, uncapped | Mean FPS | p95 / p99 frame | Process peak |
| :-- | --: | --: | --: |
| High, all scalability groups 2 | 41.72 | 26.480 / 29.668 ms | 4,408.7 MiB |
| Medium, all groups 1 | 52.20 | 22.041 / 24.112 ms | 1,721.1 MiB |

The October 22 V6 package passed **15/15 grounded waypoints over 326.1 m** with zero navigation failures and zero animal actors. At native 1920×1080 Medium, it averaged **50.03 FPS**. The newer October 23 package averages 75.65 FPS with Medium settings and Low shadows in one automated route; its click launcher defaults to that measured profile. Neither single traversal demonstrates sustained 60 FPS. The restored creek material is readable in the actual capture; the clearing remains over-bright. Full results are in the [test report](GREENVEIL-EXPLORATION-2026-10-22.md). Test hardware details and local paths are intentionally omitted from this public report.

The post-sync baseline editor build and Windows package also succeeded without regenerating the map. Its native-1080p Medium traversal averaged **49.19 FPS**; it remains useful as a comparison, not the latest result. See the [test report](GREENVEIL-EXPLORATION-2026-10-22.md).

The exposure-tuned package passed **15/15 waypoints over 326.1 m**, with zero navigation failures and zero animal actors. Across 2,790 frames it averaged **50.61 FPS**; the clearing remains too bright and Quinn/cottages are placeholders. This was one automated traversal, not manual playtesting.

An earlier GPU trace found shadows were a large cost at all-Medium quality. The October 23 package confirmed the balanced profile at 75.65 FPS (Medium with Low shadows), versus 50.38 FPS all-Medium and 93.53 FPS Low, all at native 1080p. The launch helper now defaults to Medium with Low shadows. These are single-route results, not sustained-performance certification. See the [latest test report](GREENVEIL-EXPLORATION-2026-10-22.md).

The V5 PBR creek experiment compiled and packaged but rendered nearly black in the actual capture; V6 restores the previous, more readable material. Clearings remain over-bright. Neither package is a graphics-complete milestone. See the [test report](GREENVEIL-EXPLORATION-2026-10-22.md).

Static project wiring passed **65 checks**, documentation validation checked **218 internal links**, and the three portable C++ suites passed **34 animal simulation, 22 snapshot, and 13 placement checks**. These source checks are not Unreal gameplay tests. See the [full report](GREENVEIL-EXPLORATION-2026-10-22.md) and machine-written [High](evidence/greenveil-high-2026-10-22.txt) / [Medium](evidence/greenveil-medium-2026-10-22.txt) results.

## Assets and recovery

The [asset inventory](../art/GREENVEIL-ASSET-INVENTORY.md) distinguishes local Epic/Fab art, CC0 assets, original placeholders and concept images. Sample/mannequin source remains local and ignored. The generated exploration maps/assets and reviewed CC0 material changes are tracked through LFS. Another checkout needs the licensed local mounts and mannequin installation.

`WildBoundPreAlpha5` remains in its original package directory. The pre-existing modified `GreenveilField.umap` remains local and is excluded from this commit. No merge to `main` has occurred.

## Limits and next work

Buildings, creek water, tools and player appearance are placeholders; interiors are sparse. Mist/daylight supply atmosphere without dynamic weather or a day/night cycle. Terrain is a static heightfield mesh, not voxel terrain or an editable Landscape. There is no new fluid/swimming, gathering, farming, NPC, animal, multiplayer or persistence system. The next visual milestone is to inspect the acquired village sample, then expand the village and surrounding route inside the canonical Greenveil world. The existing package and prior Git revision are recovery points.

The automated loop is representative, not exhaustive manual QA of keyboard/mouse, jumping, every side path, obstacle or camera angle. The current capture shows the underlying forest and creek but also a broad bare clearing, separated partial cottage assemblies, a mannequin and scattered props; it does not meet the starter-village goal. The post-process black-frame cause is eye adaptation interacting with the current exposure setup; the trace-hub firewall prompt was cleared and was not causal. Next, inspect and adapt a compact group of complete structures from the acquired village source, then capture and test the actual in-game result. Historical animal/native-test and listen-server results in Git history do not validate this exploration build.
