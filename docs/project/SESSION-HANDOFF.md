# Wildbound session handoff

Updated October 22, 2026 after V5 map regeneration, packaging and two traversal probes. Read [Current state](CURRENT-STATE.md), [daily log](DAILY-DEVELOPMENT.md), [test report](GREENVEIL-EXPLORATION-2026-10-22.md), [Decisions](DECISIONS.md) and [Roadmap](../../ROADMAP.md).

## Current owner scope

**No animal gameplay work yet.** Refine the full, walkable Greenveil exploration zone using existing licensed local assets and original placeholders. Concept art remains imagery. Keep animal-intent [PR #9](https://github.com/Systemkill90/WildBound/pull/9) paused, draft and unmerged; do not base this work on it.

## Project and recovery points

- Keep the Unreal checkout, engine, licensed asset sources, local caches, local AI data and packaged builds in workstation-configured locations. Do not publish local paths, host details or source-restricted assets.
- Branch: the Greenveil exploration staging branch, based on the project's current `main`.
- Map/default launch: `/Game/Maps/GreenveilExplorationPolish`.
- Latest package: the local V5 Windows archive; no game process is currently running. The prior V4 package remains intact. Use its root `Launch-Greenveil.cmd` launcher. WASD move, mouse look, Space jump.
- Preserve older package directories and the pre-existing local GreenveilField map edit; the latter is intentionally excluded from this commit.

## Verified

Editor/game compilation, map generation, Windows packaging and two packaged traversals passed. Both runs completed 15/15 grounded points and approximately 326 m with zero nav failures/animals. V5's first cold run averaged **39.38 FPS**, p95/p99 **44.751/66.686 ms**, peak **1,592.1 MiB**; the second cache-warmed run averaged **49.89 FPS**, p95/p99 **22.764/24.609 ms**, peak **1,545.8 MiB**. This is not a locked-60 result. The creek still reads nearly black and clearings over-bright in actual captures; see [daily notes](DAILY-DEVELOPMENT.md) and the [test report](GREENVEIL-EXPLORATION-2026-10-22.md).

The first cook failed because `SkipCookingEditorContent` excluded textures used by Landmass startup materials. The verified helper omits that flag. Authoring defects involving Python rotation order, zero-size navigation bounds, instanced-material usage, terrain axes and the return trail were corrected and retested. Do not restore earlier generated scenes.

## Reproduce locally

1. Verify local content mounts with `Tools/Link-ElectricDreamsSampleContent.ps1 -SampleRoot <locally installed sample directory>` and install Quinn using `Tools/Install-PrototypeCharacterAssets.ps1 -EngineRoot <installed UE 5.8 root>`. Follow the [asset inventory](../art/GREENVEIL-ASSET-INVENTORY.md); never upload the packs.
2. Run `Tools/Build-GreenveilExploration.ps1 -EngineRoot <installed UE 5.8 root> -GenerateMap` to compile the editor and rebuild the scene from its deterministic script.
3. To package, add `-Package -ArchiveDirectory <new local directory outside the repository>`. The helper refuses an existing archive directory. Copy `Tools/Launch-PackagedGreenveil.cmd` to the archive root as `Launch-Greenveil.cmd`.
4. Test using `Tools/Launch-GreenveilExploration.ps1 -Executable <new Windows/Wildbound.exe> -Quality 1 -TraversalTest -ExitAfterTest`. Quality 2 selects High. Test launches are uncapped; read the summary's PASS/FAIL rather than trusting process exit alone.
5. Runtime logs go to ignored project `Saved/GreenveilBuild`. The package's `Windows/Wildbound/Saved` holds the summary, frame CSV and screenshots. Preserve evidence before rerunning because those filenames are reused. The latest summary is the local V5 archive's `Windows/Wildbound/Saved/GreenveilTraversal-summary.txt` (the second run); the cold-run detail remains in ignored `Saved/GreenveilBuild` runtime logs.

## Next bounded work

Diagnose creek visibility and exposure from the packaged captures; then manually inspect side trails, jumping/camera and off-trail collisions when the owner is available. Improve cottage interiors/materials, grass distribution and obvious zone edges. Profile before adding more mesh varieties. Preserve both V4 and V5 packages as recovery points.

Do not resume animal gameplay, huge sample worlds, networking, persistence or other major systems without a new owner priority. The automated route is useful evidence, not exhaustive manual QA or release certification.
