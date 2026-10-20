# Developer setup

[Home](../../README.md) · [Current state](../project/CURRENT-STATE.md)

For the latest prototype interaction test, see [Greenveil prototype playtest](PROTOTYPE-PLAYTEST.md). Portable animal, placement and snapshot rules are tested in GitHub Actions; UE-specific code has not been compiled.

For a Windows PC preflight/build/launch attempt, use [`Tools/Start-Wildbound.cmd`](../../Tools/Start-Wildbound.cmd). This wrapper was syntax-tested on GitHub's Windows runner but has **not** launched Unreal on the project owner's PC.

## First launch

1. Select and record a UE5 minor version. This scaffold deliberately has no EngineAssociation pin.
2. Install that engine and its supported C++ toolchain. Plan a matching Unreal source build for dedicated-server development.
3. Associate `Wildbound.uproject` with the engine and generate project files.
4. Compile `WildboundEditor`, open the project, and create a small test map under `Content/Wildbound/Maps`. No map is supplied.
5. Compile game/server targets and record engine, toolchain, commands, and results. These steps have not been executed for this scaffold.

## Layout and assets

`Source/Wildbound` contains a minimal runtime module. The three target files define game/editor/server builds, not executables. `Config` holds initial settings. `Content/Wildbound` reserves Maps, Blueprints, Art, Audio, Data, and UI folders. `Plugins` reserves future project plugins; `Build` reserves platform resources.

Keep generated Binaries, Intermediate, Saved, caches, IDE files, and packaged output out of Git. Unreal `.uasset` and `.umap` files are source assets and must be retained. Agree on Git LFS rules and quotas before adding large binary assets; LFS is not configured for this text-only foundation.

Compile before claiming buildability. Validate editor behavior, two clients on a dedicated server, and restart/restore persistence. No placeholder CI workflow is presented as a successful Unreal build.

Commit original or appropriately licensed assets only. Exclude engine distributions, paid assets without redistribution rights, platform SDKs, credentials, and live saves. No distribution license is selected.
