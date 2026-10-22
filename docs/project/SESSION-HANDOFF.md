# Wildbound session handoff

Updated October 22, 2026 after NVMe storage relocation, fresh packaged exploration testing and launch. Read [Current state](CURRENT-STATE.md), [test report](GREENVEIL-EXPLORATION-2026-10-22.md), [Decisions](DECISIONS.md) and [Roadmap](../../ROADMAP.md).

## Current owner scope

**No animal gameplay work yet.** Refine the full, walkable Greenveil exploration zone using existing licensed local assets and original placeholders. Concept art remains imagery. Keep animal-intent [PR #9](https://github.com/Systemkill90/WildBound/pull/9) paused, draft and unmerged; do not base this work on it.

## Project and recovery points

- Workshop checkout: `<local-project-root>\Project`; UE 5.8.4: `<local-project-root>\Engine\UE_5.8`; local licensed asset library: `<local-project-root>\Assets`.
- Legacy `<local-project-root>\Project`, `<local-project-root>\Engine\UE_5.8` and `<local-project-root>\Assets` paths resolve to the new locations through junctions. Package/archive stays on D:.
- Unreal Derived Data Cache: `<local-project-root>\Caches\UnrealDerivedDataCache`. VS Code extensions/profile are on E:, with C: compatibility junctions.
- Ollama model files: `<local-project-root>\LocalAI\Models` (USB). Ollama install was copied and verified at `<local-project-root>\LocalAI\Ollama` and added to the user PATH, but the original C: install remains intact because the cleanup/junction action was blocked by automatic review. The Ollama server is stopped and did not load the model during this session; startup remains unverified. `OLLAMA_MODELS` user setting points to G:.
- C: had about 17.0 GB free at this checkpoint. Buffalo NAS was not mounted and was not used.
- Branch: `staging/greenveil-exploration-2026-10-22`, from `6ca9fc9` on `main`.
- Map/default launch: `/Game/Maps/GreenveilExplorationPolish`.
- Package: `<local-project-root>\Builds\GreenveilExploration-2026-10-22-NVMe-Verified\Windows\Wildbound.exe`; it is currently running windowed at native 1080p Medium. The root launcher is `Launch-Greenveil.cmd`. WASD move, mouse look, Space jump.
- Preserve older package directories, especially `WildBoundPreAlpha5`. The pre-existing local GreenveilField map edit was copied to `Cache/GreenveilExplorationBaseline-2026-10-22` and is excluded from this commit.

## Verified

Editor/game compilation and fresh Windows packaging passed after the storage move. The latest cold Medium run passed 15/15 grounded points and 326 m with zero nav failures/animals, averaging **49.03 FPS**, p95/p99 **23.046/24.917 ms** and peak memory **3,991 MiB**, while shader PSOs warmed. The launched package remains open on the desktop. This is not a locked-60 result; see the test report for earlier results and limitations.

The first cook failed because `SkipCookingEditorContent` excluded textures used by Landmass startup materials. The verified helper omits that flag. Authoring defects involving Python rotation order, zero-size navigation bounds, instanced-material usage, terrain axes and the return trail were corrected and retested. Do not restore earlier generated scenes.

## Reproduce locally

1. Verify local content mounts with `Tools/Link-ElectricDreamsSampleContent.ps1` and install Quinn using `Tools/Install-PrototypeCharacterAssets.ps1`. Follow the [asset inventory](../art/GREENVEIL-ASSET-INVENTORY.md); never upload the packs.
2. Run `Tools/Build-GreenveilExploration.ps1 -GenerateMap` to compile the editor and rebuild the scene from its deterministic script.
3. To package, add `-Package -ArchiveDirectory <local-project-root>\Builds\GreenveilExploration-NEW-NAME`. The helper refuses an existing archive directory. Copy `Tools/Launch-PackagedGreenveil.cmd` to the archive root as `Launch-Greenveil.cmd`.
4. Test using `Tools/Launch-GreenveilExploration.ps1 -Executable <new Windows/Wildbound.exe> -Quality 1 -TraversalTest -ExitAfterTest`. Quality 2 selects High. Test launches are uncapped; read the summary's PASS/FAIL rather than trusting process exit alone.
5. Runtime logs go to project `Saved/GreenveilBuild`. The package's `Windows/Wildbound/Saved` holds the summary, frame CSV and screenshots. Preserve evidence before rerunning because those filenames are reused. Latest summary is `<local-project-root>\Builds\GreenveilExploration-2026-10-22-NVMe-Verified\Windows\Wildbound\Saved\GreenveilTraversal-summary.txt`.

## Next bounded work

Manually inspect side trails, jumping/camera and off-trail collisions; improve cottage interiors/materials, grass distribution and obvious zone edges. Profile before adding more mesh varieties. Preserve the tested package as a recovery point.

Do not resume animal gameplay, huge sample worlds, networking, persistence or other major systems without a new owner priority. The automated route is useful evidence, not exhaustive manual QA or release certification.
