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
5. Verify the local sample mounts and mannequin using the existing install/link helpers. `Tools/Start-Wildbound.cmd` now defaults to `/Game/Maps/GreenveilExploration`. For explicit measured settings, use `Tools/Launch-GreenveilExploration.ps1`; see the [handoff](../project/SESSION-HANDOFF.md).
6. Use `Tools/Build-GreenveilExploration.ps1 -EngineRoot <installed UE 5.8 root> -GenerateMap -Package -ArchiveDirectory <new local directory outside the repository>` to rebuild and package. Never target an existing working archive. Run the packaged traversal probe and manually inspect WASD/mouse/jump, side paths and collisions. Record PASS, FAIL or BLOCKED.
7. The [older prototype playtest](PROTOTYPE-PLAYTEST.md) covers deferred care/build work. Multiplayer, dedicated server operation and persistence remain outside the active exploration task.

## Source layout

| Location | Purpose |
| :-- | :-- |
| `Source/Wildbound` | UE runtime module, actor/component source and portable model code |
| `Source/Wildbound*.Target.cs` | Game, editor and server target definitions; a target is not evidence of a working server |
| `Content/Maps/GreenveilField.umap` | Currently tracked starter level |
| `Content/Wildbound/Art` | Reviewed starter environment/deer assets |
| `Scripts/Editor` | Editor automation; inspect local path assumptions before reuse |
| `Tests/Native`, `Tests/Static` | Standalone rules/snapshot/placement and structural checks |
| `Tools` | Windows build/launch helper |
| `docs/art/ASSET-CREDITS.md` | Asset provenance and distribution limits |

## Asset, safety and version-control boundaries

The repository uses **Git LFS** for `.uasset`, `.umap`, `.glb` and other large editable art formats. Newly added `Content/**` files are intentionally ignored until they have been reviewed and explicitly staged, preventing accidentally publishing proprietary sample assets. Commit only assets whose redistribution rights permit it; the locally used Electric Dreams/Fab sample content must not simply be copied into the public repo.

Never commit engine binaries, private project data, platform SDKs, secrets, live saves, or packaged builds. The public repository has **no project-wide open-source license selected**.

## Definition of a verified step

- **Code authored** means it exists in Git.
- **Compiled** means the relevant Unreal target built on a recorded engine/toolchain.
- **Launched** means the editor/package actually loaded the level.
- **Gameplay tested** means inputs and results were exercised with evidence.
- **Network tested** means state/action assertions passed with more than one client; a successful join alone is insufficient.
- **Persistent** means actual save/restart/restore passed on a server.

Update [Current state](../project/CURRENT-STATE.md) and [Session handoff](../project/SESSION-HANDOFF.md) with the exact evidence, not expectations.
