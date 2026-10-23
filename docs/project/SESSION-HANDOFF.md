# Wildbound session handoff

Updated October 22, 2026 after an exposure-tuned build, packaging and a traversal probe. Read [Current state](CURRENT-STATE.md), [daily log](DAILY-DEVELOPMENT.md), [test report](GREENVEIL-EXPLORATION-2026-10-22.md), [Decisions](DECISIONS.md) and [Roadmap](../../ROADMAP.md).

## Current owner scope

**No animal gameplay work yet.** Refine the full, walkable Greenveil exploration zone using existing licensed local assets and original placeholders. Concept art remains imagery. Keep animal-intent [PR #9](https://github.com/Systemkill90/WildBound/pull/9) paused, draft and unmerged; do not base this work on it.

## Project and recovery points

- Keep the Unreal checkout, engine, licensed asset sources, local caches, local AI data and packaged builds in workstation-configured locations. Do not publish local paths, host details or source-restricted assets.
- Branch: the Greenveil exploration staging branch, based on the project's current `main`.
- Map/default launch: `/Game/Maps/GreenveilExplorationPolish`.
- Latest package: a fresh exposure-tuned Windows archive. Its automated 1080p Medium traversal passed 15/15 waypoints over 326.1 m at 50.61 FPS average; the clearing remains bright and character/buildings remain placeholders. Earlier package checkpoints were left intact. Use the archive's `Launch-Greenveil.cmd` launcher for a human visual check. WASD move, mouse look, Space jump.
- Preserve older package directories and the pre-existing local GreenveilField map edit; the latter is intentionally excluded from this commit.

## Verified

Editor/game compilation, map generation, Windows packaging and the V6 packaged traversal passed. It completed 15/15 grounded points over 326.1 m with 14/14 valid navigation legs, zero nav failures and zero animals. Native-1080p Medium averaged **50.03 FPS**, p95/p99 **22.649/24.587 ms**, peak **1,614.6 MiB**. This historical V6 result is not a locked-60 result. The exposure-tuned package now averages **50.61 FPS** in one traversal; 60 FPS remains unmet and unverified. Some additional ground detail is visible, but the clearing remains too bright. See [daily notes](DAILY-DEVELOPMENT.md) and the [test report](GREENVEIL-EXPLORATION-2026-10-22.md).

The first cook failed because `SkipCookingEditorContent` excluded textures used by Landmass startup materials. The verified helper omits that flag. Authoring defects involving Python rotation order, zero-size navigation bounds, instanced-material usage, terrain axes and the return trail were corrected and retested. Do not restore earlier generated scenes.

## Reproduce locally

1. Verify local content mounts with `Tools/Link-ElectricDreamsSampleContent.ps1 -SampleRoot <locally installed sample directory>` and install Quinn using `Tools/Install-PrototypeCharacterAssets.ps1 -EngineRoot <installed UE 5.8 root>`. Follow the [asset inventory](../art/GREENVEIL-ASSET-INVENTORY.md); never upload the packs.
2. Run `Tools/Build-GreenveilExploration.ps1 -EngineRoot <installed UE 5.8 root> -GenerateMap` to compile the editor and rebuild the scene from its deterministic script.
3. To package, add `-Package -ArchiveDirectory <new local directory outside the repository>`. The helper refuses an existing archive directory. Copy `Tools/Launch-PackagedGreenveil.cmd` to the archive root as `Launch-Greenveil.cmd`.
4. Test using `Tools/Launch-GreenveilExploration.ps1 -Executable <new Windows/Wildbound.exe> -Quality 1 -TraversalTest -ExitAfterTest`. Quality 2 selects High. Test launches are uncapped; read the summary's PASS/FAIL rather than trusting process exit alone.
5. Runtime logs go to ignored project `Saved/GreenveilBuild`. The package's `Windows/Wildbound/Saved` holds the summary, frame CSV and screenshots. Preserve evidence before rerunning because those filenames are reused. The current verification summary and its limits are in the [test report](GREENVEIL-EXPLORATION-2026-10-22.md).

Portable C++ and static checks, with their scope clearly separated from gameplay evidence, are documented in the [developer setup](../developers/README.md#repeatable-source-checks).

## Next bounded work

When the owner is available, manually inspect side trails, jumping/camera and off-trail collisions. Continue from actual captures to refine clearing light, cottage materials and grass distribution; profile before adding more mesh varieties. Preserve the existing packages as recovery points.

Do not resume animal gameplay, huge sample worlds, networking, persistence or other major systems without a new owner priority. The automated route is useful evidence, not exhaustive manual QA or release certification.
