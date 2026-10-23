# Developer setup — Wildbound (Windows / Unreal Engine)

[Home](../../README.md) · [Current verified state](../project/CURRENT-STATE.md) · [Handoff](../project/SESSION-HANDOFF.md) · [Prototype playtest](PROTOTYPE-PLAYTEST.md)

**Verified October 22, 2026:** UE 5.8.4 editor/game targets compiled and `/Game/Maps/GreenveilExploration` packaged successfully. Both actual packaged route tests passed, with measured native-1080p performance. [Report and limits](../project/GREENVEIL-EXPLORATION-2026-10-22.md). No animal gameplay work is active; older care/build/network plans are deferred.

## Known Windows setup

| Component | Last recorded working version |
| :-- | :-- |
| Unreal Engine | **5.8.4** |
| Supported compiler | Visual Studio 2022 with the Unreal C++ workload |
| Windows SDK | A version supported by the installed Unreal Engine |
| Source checkout | Any local development directory |
| Latest Windows package | Local-only archive; no machine-specific location is published |

Do not assume the previous package exists on a new machine or that the editor is still open. No packaged executable is committed. Record your actual engine/toolchain versions when repeating the build.

## From a clean checkout

1. Clone `https://github.com/Systemkill90/WildBound.git` using Git with Git LFS enabled (`git lfs install`, then `git lfs pull`). LFS fetch success and asset import must be checked; a source clone is **not** automatically a functional build.
2. Verify a compatible Unreal Engine 5 install and supported Windows C++ workload. The project targets UE 5.8 settings but `Wildbound.uproject` does not contain a machine-specific `EngineAssociation`.
3. Use `Tools/Start-Wildbound.cmd -ShowEngines` to inspect recognized local editor installs, or pass `-EngineRoot` to the helper.
4. Run `Tools/Start-Wildbound.cmd -BuildOnly` to try compiling `WildboundEditor` with the selected installation. Look in ignored `Saved/WildboundBootstrap` for build logs and the exact result.
5. Verify the local sample mounts and mannequin using the existing install/link helpers. `Tools/Start-Wildbound.cmd` defaults to `/Game/Maps/GreenveilExplorationPolish`, the current packaged test map. For explicit measured settings, use `Tools/Launch-GreenveilExploration.ps1`; see the [handoff](../project/SESSION-HANDOFF.md).
6. Use `Tools/Build-GreenveilExploration.ps1 -EngineRoot <installed UE 5.8 root> -GenerateMap -Package -ArchiveDirectory <new local directory outside the repository>` to rebuild and package. Never target an existing working archive. Run the packaged traversal probe and manually inspect WASD/mouse/jump, side paths and collisions. Record PASS, FAIL or BLOCKED.
7. The [older prototype playtest](PROTOTYPE-PLAYTEST.md) covers deferred care/build work. Multiplayer, dedicated server operation and persistence remain outside the active exploration task.

## Source layout

| Location | Purpose |
| :-- | :-- |
| `Source/Wildbound` | UE runtime module, actor/component source and portable model code |
| `Source/Wildbound*.Target.cs` | Game, editor and server target definitions; a target is not evidence of a working server |
| `Content/Maps` | Three Greenveil maps are retained: the original exploration map, the current Polish test map, and the locally edited GreenveilField map. Check the active launch target before editing or generating a map. |
| `Content/Wildbound/Art` | Reviewed starter environment/deer assets |
| `Scripts/Editor` | Editor automation; inspect local path assumptions before reuse |
| `Tests/Native`, `Tests/Static` | Standalone rules/snapshot/placement and structural checks |
| `Tools` | Windows build/launch helper |
| `docs/art/ASSET-CREDITS.md` | Asset provenance and distribution limits |

## Repeatable source checks

From the repository root, run the two dependency-light Python checks:

```powershell
python Tests/Static/verify_scaffold.py
python Tests/Static/verify_docs.py
```

On Windows, validate the resource-aware build helpers with:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File Tests/Static/verify_build_resources.ps1
```

The Windows build helpers read free system commit before starting UnrealBuildTool,
reserve 2 GiB for Windows, and budget 4.5 GiB per build action from measured
Wildbound compile use. They cap parallel build actions at two and reduce that
cap as commit headroom shrinks. One action can run at 6.5 GiB free commit; no
blanket 16 GiB map/package gate remains. These are commit limits, distinct from
physical RAM. Override `-MaxParallelActions` to request a lower cap; resource
checks may still reduce it further.

The native C++17 tests can be compiled from a Visual Studio x64 Developer Command Prompt. These commands mirror the three suites in [the source-check workflow](../../.github/workflows/animal-native-tests.yml):

```cmd
cl /nologo /std:c++17 /O2 /W4 /WX /EHsc /permissive- /ISource/Wildbound/Public Tests/Native/AnimalSimulationTests.cpp /Fe:%TEMP%\WildboundAnimalTests.exe
%TEMP%\WildboundAnimalTests.exe
cl /nologo /std:c++17 /O2 /W4 /WX /EHsc /permissive- /ISource/Wildbound/Public Tests/Native/PrototypePersistenceTests.cpp /Fe:%TEMP%\WildboundSnapshotTests.exe
%TEMP%\WildboundSnapshotTests.exe
cl /nologo /std:c++17 /O2 /W4 /WX /EHsc /permissive- /ISource/Wildbound/Public Tests/Native/PrototypePlacementTests.cpp /Fe:%TEMP%\WildboundPlacementTests.exe
%TEMP%\WildboundPlacementTests.exe
```

These checks cover portable rules, snapshots, placement policy, project wiring and internal documentation links. They do **not** compile Unreal, launch the map, or verify in-game movement, animal care, construction, multiplayer or persistence. For those, use the Unreal build and packaged traversal procedure in the [session handoff](../project/SESSION-HANDOFF.md), then record what actually passed.

## Asset, safety and version-control boundaries

The repository uses **Git LFS** for `.uasset`, `.umap`, `.glb` and other large editable art formats. Newly added `Content/**` files are intentionally ignored until they have been reviewed and explicitly staged, preventing accidentally publishing proprietary sample assets. Commit only assets whose redistribution rights permit it; the locally used Electric Dreams/Fab sample content must not simply be copied into the public repo.

Never commit engine binaries, private project data, platform SDKs, secrets, live saves, or packaged builds. The public repository has **no project-wide open-source license selected**.

Android File Server is disabled for the current Windows prototype, with network access off and its token empty. Keep it that way until Android deployment is an active target; never commit an Android File Server token.

## Definition of a verified step

- **Code authored** means it exists in Git.
- **Compiled** means the relevant Unreal target built on a recorded engine/toolchain.
- **Launched** means the editor/package actually loaded the level.
- **Gameplay tested** means inputs and results were exercised with evidence.
- **Network tested** means state/action assertions passed with more than one client; a successful join alone is insufficient.
- **Persistent** means actual save/restart/restore passed on a server.

Update [Current state](../project/CURRENT-STATE.md) and [Session handoff](../project/SESSION-HANDOFF.md) with the exact evidence, not expectations.
