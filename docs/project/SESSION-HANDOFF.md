# Session handoff

Updated: October 20, 2026.

Start with [Current state](CURRENT-STATE.md), [Decisions](DECISIONS.md), and [Roadmap](../../ROADMAP.md).

## Latest change

Added a C++ `UWildboundAnimalNeedsComponent` with bounded hunger, thirst and condition, server-authority simulation and replicated properties. It has not been compiled in Unreal, connected to an actor, or gameplay tested. Never call it a functioning animal-care system.

The [first playable validation plan](../developers/FIRST-PLAYABLE.md) now defines explicit engine, animal, enclosure, multiplayer, and save/recovery gates. It is planning documentation, not proof of progress.

## Next concrete action

Pin a UE5 minor version and supported C++ compiler. Compile the UE5 scaffold and new component. Then create a small Greenveil placeholder map and replicated animal actor; test two clients observing authoritative needs, including feeding via a validated server-side gameplay interaction. Record compiler output and screenshots/logs where available. Do not enable unvalidated client-triggered care functions, save formats, or paid voxel dependencies.

## Remaining blockers

No Unreal engine/toolchain confirmation in this environment; therefore editor/game/server builds, gameplay and replication remain unverified. Voxel plugin/approach and animal save identity remain open.

Keep Wildbound separate from ShroudForge. Exclude credentials, server saves, unlicensed assets, engine binaries and platform SDKs. Conversations are not automatically synced to GitHub.
