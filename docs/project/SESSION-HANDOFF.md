# Wildbound session handoff

## Creative Library handoff — October 25

Review `feature/creative-library-pilot` and [Creative Library pilot](../creative-library/README.md). Garage and Dashboard source were deployed to the local runtime; the runtime's private config points the Library record root to this review worktree and the archive/inbox to the existing private NAS. The Update Idea Board UI, verified original-media archival, exploratory record, approved version-pinned package lookup, and visible Missing Reference Request are working. The desktop supply form and general subject/facet Librarian replace phone-specific work and example-specific rules. The pilot mixed-media fixture must stay exploratory. After PR merge, point the runtime record root to the merged checkout and restart Garage. No Unreal work or animal gameplay was resumed.

The final live generation pass left five owner-review tasks in Garage: texture `63d704ee-431d-4f97-a44e-16c59d954e6b`, voice `e9919377-b19c-415d-b114-fbb122535908`, music `66fe8014-5655-4608-8bcf-02110f90a4ff`, ambience `6eab92ac-b21a-4374-aaaa-1e353ff7fe52`, and SFX `f6728823-f021-43a4-9e5a-856778dcc597`. All have inspected artifacts and status `awaiting_review`; leave them for the owner to approve, revise, or reject. The stone texture may not tile cleanly. The first SFX attempt failed because the model emitted 44.1 kHz WAV; the final adapter preserves that original and converts a 48 kHz review copy. The repaired live attempt passed. Prompt-to-3D is now locally installed and boundary-smoke-tested; new rig/animation authoring remains Limited. The existing supplied-model preparation check is still the earlier BoxAnimated Test; no new character model was approved.

Garage `2.5.0-pilot` is deployed locally. Its supported task lifecycle now includes Recovery archive and Handoff after engine verification. Startup reconciliation processed the existing approved BoxAnimated task `f21f0b8f-dbbe-4d97-a010-db34795eab7d` without another Unreal import: its archived artifact SHA-256 matches the reviewed artifact, its archive manifest hash verifies, and all nine stages are complete. The full Node suite passes 39/39. See [machine-readable evidence](evidence/ai-garage-completion-2026-10-25.json). The final Edge click-through still needs repeating because Windows browser automation could not establish the tab URL during the prior attempt; API and persisted-file checks passed independently.

### 3D pipeline continuation — October 25

TripoSR is now locally installed and checksum-verified from the official Stability AI model files. Its cache is pinned to the local data volume and inference runs with Hugging Face offline flags. Garage source now requests OBJ from TripoSR, creates the no-background output directory, and imports OBJ in Blender before exporting the prepared FBX. The direct CPU boundary smoke passed with a mesh, baked texture, prepared FBX, and model report. The live API reports prompt-to-3D available; rigging/animation authoring remains Limited.

The first full 3D queue run reached mesh extraction and baking, then exposed the exporter/Blender format mismatch; that is fixed. A second full run was bounded after local Qwen returned `token repeat limit reached` during the director brief. No 3D output was approved or imported. Combined Garage + Dashboard tests pass 40/40. The next action is a fresh owner-directed 3D request from the Garage UI; keep it in review and do not claim character production until a reference-approved model and rigging path exist.

Updated October 24, 2026 after local AI recovery checks and successful World Partition packaging/traversal. Read [Current state](CURRENT-STATE.md), [daily log](DAILY-DEVELOPMENT.md), [Decisions](DECISIONS.md) and [Roadmap](../../ROADMAP.md).

## Latest verified checkpoint — October 24

Local AI: Qwen 3.5 9B completed a Garage chat and a router-approved read-only village brief, and the AMD image backend prepared/released cleanly. Ollama is unloaded while idle.

Game: UE 5.8.4 compiled WildboundEditor, regenerated `/Game/Maps/GreenveilExplorationPolish`, converted `/Game/Maps/GreenveilExplorationPolish_WP` for runtime, and packaged a new Win64 Development build. The cook processed 1,028 packages. A bounded set of locally acquired Medieval Village Megascans assets is now used for modular cottage facades/gables/board walls/roofs/windows and the shared well. The full sample world remains separate. The packaged native-1920×1080 Medium/Low-shadow route passed all 15 grounded waypoints over 330 m, with zero navigation failures and zero animals; mean was 89.41 FPS, p95 13.493 ms, p99 14.116 ms, and peak process memory 1,547.6 MiB. This is an automated route, not sustained 60 FPS certification.

The latest package is not currently running. The optional trace-hub firewall prompt was cleared. A game-native capture confirmed the black frame came from post-process eye adaptation; setting `r.EyeAdaptationQuality 0` restored a visible but compositionally poor scene. That override is now in the launch helpers and project config, but it still needs a fresh in-game verification. The render reads as scattered assets: three separated partial cottages, broad empty ground and disconnected prop groups. The owner rejected this composition. Next, inspect the local village sample for a compact cluster of complete structures and redesign the hamlet around a clear lane, shared commons, one working garden edge, creek crossing and return path. Keep the sample source project untouched and preserve all previous packages. The 180 × 160 m map fits inside the current load range; cell unloading and large-world memory savings remain unproven. No animal gameplay work was done, and no commit or push was made.

## Current owner scope

**Active scope:** make the canonical Greenveil slice feel like a compact, lived-in starter village and prove its movement/collision foundation. Add to `/Game/Maps/GreenveilExplorationPolish`; keep the authored landscape, route, cottages, garden edge, creek, bridges and woodland in this continuing world. No animal gameplay yet.

The Medieval Village Megascans sample remains a separate local project; only a bounded set of modular assets and dependencies was migrated into Wildbound. Its source map/minimap and the large Electric Dreams map were not copied or saved into this project. Do not load or serialize either full sample world for routine village work. Keep Fab source assets out of public Git, and preserve the prior package and map revisions.

## Source maintenance checkpoint

The build helper uses a 6.5 GiB one-action floor for compilation, bounded map generation and packaging; the 16 GiB special gate was removed. UBT parallel actions remain selected from live commit headroom. The local model was unloaded and the old Electric Dreams editor closed normally before building. The editor compile, map generation, UAT package and movement traversal passed. Preserve the new package and its evidence; next inspect a bounded village-asset subset and continue cumulative work on the canonical map.

## Project and recovery points

- Keep the Unreal checkout, engine, licensed asset sources, local caches, local AI data and packaged builds in workstation-configured locations. Do not publish local paths, host details or source-restricted assets.
- Branch: the Greenveil exploration staging branch, based on the project's current `main`.
- Authoring/generator source: `/Game/Maps/GreenveilExplorationPolish`; generated runtime/default launch map: `/Game/Maps/GreenveilExplorationPolish_WP` (run the build helper with `-GenerateMap` after a clean checkout).
- Latest package: the October 24 Greenveil package. Native-1920×1080 Medium/Low-shadow traversal passed 15/15 grounded points over 330 m, with zero navigation failures and no animals; mean 89.41 FPS, p95 13.493 ms, p99 14.116 ms. This is a single route, not sustained certification. The click-to-play launcher defaults to Medium/Low-shadow and accepts high for High settings. Earlier package checkpoints remain intact. WASD move, mouse look, Space jump.
- Preserve older package directories and the pre-existing local GreenveilField map edit; the latter is intentionally excluded from this commit.

## Verified

Editor compilation, canonical-map generation, World Partition conversion, and separate Win64 packaging passed on UE 5.8.4. Packaged automated traversal passed 15/15 grounded points over 330 m with zero navigation failures and no animal actors. At native 1920×1080 Medium/Low-shadow, mean was **89.41 FPS** (p95 13.493 ms, p99 14.116 ms; peak process memory 1,547.6 MiB). A first run while an older game instance was still open averaged 56.03 FPS; after closing that stale build, the clean run returned 89.41 FPS. These are single-route measurements, not sustained performance certification.

The new map generator adds the imported shuttered-window mesh to the three cottage fronts and already uses the imported village modules. A clear visual review remains blocked by the optional Unreal trace-hub Windows Firewall dialog, so do not claim the new view has passed art QA. The route test did not verify feeding, watering, animal needs, construction interactions, multiplayer, persistence, or all keyboard/camera/collision cases.

## Reproduce locally

1. Verify local content mounts with `Tools/Link-ElectricDreamsSampleContent.ps1 -SampleRoot <locally installed sample directory>` and install Quinn using `Tools/Install-PrototypeCharacterAssets.ps1 -EngineRoot <installed UE 5.8 root>`. Follow the [asset inventory](../art/GREENVEIL-ASSET-INVENTORY.md); never upload the packs.
2. Run `Tools/Build-GreenveilExploration.ps1 -EngineRoot <installed UE 5.8 root> -GenerateMap` to compile the editor and rebuild the scene from its deterministic script.
3. To package, add `-Package -ArchiveDirectory <new local directory outside the repository>`. The helper refuses an existing archive directory. Copy `Tools/Launch-PackagedGreenveil.cmd` to the archive root as `Launch-Greenveil.cmd`.
4. Test using `Tools/Launch-GreenveilExploration.ps1 -Executable <new Windows/Wildbound.exe> -Quality 1 -TraversalTest -ExitAfterTest`. Quality 2 selects High; use `-ShadowQualityOverride 0` for the experimental Medium-with-Low-shadows comparison. The script defers to Ollama models. Use `-SkipScreenshots` for cleaner frame timing and `-TraceFile <local .utrace path>` for a local-only Insights capture. Test launches are uncapped; read the summary's PASS/FAIL rather than trusting process exit alone.
5. Runtime logs go to ignored project `Saved/GreenveilBuild`. The package's `Windows/Wildbound/Saved` holds the summary, frame CSV and screenshots. Preserve evidence before rerunning because those filenames are reused. The current verification summary and its limits are in the [test report](GREENVEIL-EXPLORATION-2026-10-22.md).

Portable C++ and static checks, with their scope clearly separated from gameplay evidence, are documented in the [developer setup](../developers/README.md#repeatable-source-checks).

## Next bounded work

1. Clear the optional trace-hub dialog on the desktop and capture a clear view of the new package; assess material brightness, asset scale, cottage silhouettes and stream/bridge composition against the Idea Board.
2. Make visually justified village improvements using the already migrated licensed assets. Keep the slice and streaming chunks bounded; do not open or save the sample's full map.
3. Manually check cottage doorways, bridge banks, paths and edges, then repeat the packaged route/performance check after substantive collision or asset changes.
4. Keep animal gameplay, multiplayer, persistence and large-world expansion deferred until the village baseline is reviewed.

The current package path is recorded in the daily log. No Git commit or push was made. Keep project, engine, build and temp work on the configured non-C: volumes.
