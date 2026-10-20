# Wildbound current state

Updated: October 20, 2026.

## Source and project assets authored

- Unreal Engine 5 project descriptor, module and game/editor/server target definitions; no engine version pin.
- Initial C++ animal simulation model with hunger, thirst, physical condition, stress and trust.
- UE-side replicated animal needs component with server-only simulation and care entry points.
- Prototype animal actor, third-person character, player controller, placeholder build block, ground, game mode, and debug HUD.
- Input mappings for walking, looking, feeding, watering, reassuring, placing and removing temporary blocks.
- Game mode selects a code-assembled starter area when a level is opened in Play; no `.umap` is committed.
- Portable native C++ tests for animal needs/trust, a strict **versioned snapshot format** (not connected to engine saves), and **bounded grid-placement rules**, plus a dependency-free static project-wiring checker in GitHub Actions.
- A local Windows [build/launch script](../../Tools/Start-Wildbound.ps1) and .cmd convenience launcher with engine discovery, compiler exit handling, on-disk diagnostics and a provisional built-in-map game launch command.
- Core game vision, systems, biome documents, [engineering playtest guide](../developers/PROTOTYPE-PLAYTEST.md), and milestone roadmap.

## Actually verified

- GitHub accepted and served the source commits.
- [GitHub Actions run 39516848594](https://github.com/Systemkill90/WildBound/actions/runs/39516848594) completed successfully with **four passing jobs**: animal rules, versioned snapshot validation, bounded block placement, and source wiring.
- [Windows bootstrap CI](https://github.com/Systemkill90/WildBound/actions/runs/39517592126) successfully parsed the PowerShell script and ran its engine discovery mode on a hosted Windows runner. This **does not** indicate that the build helper ran on the developer's desktop.
- Portable simulation, snapshot, and placement tests run independently of Unreal. These checks do not test Unreal actors, RPCs, replication, rendering, in-engine saving, or recovery.

## Not verified or implemented

**No Unreal editor/game/server build has been compiled or launched. The developer's desktop is not available to this chat session.** No map has been opened, no player or animal spawned during gameplay, no multiplayer simulation or network authorization tested, and no saved-game recovery tested.

The runtime classes are authored **prototype source, not verified working features**. Test-floor and snapped mesh blocks are placeholders, **not** a voxel construction or terraforming system. AI navigation, grazing/water seeking, actual shelters, genetics, breeding, husbandry interfaces, world persistence, purchased assets and animations are absent.

No Unreal minor version, voxel plugin, paid dependency or Xbox platform approval has been selected.

## Tracked next tasks

- [M0 editor compile and Greenveil](https://github.com/Systemkill90/WildBound/issues/2)
- [M1 two-client replication](https://github.com/Systemkill90/WildBound/issues/3)
- [M2 voxel + animal navigation](https://github.com/Systemkill90/WildBound/issues/4)
- [M3 recoverable persistence](https://github.com/Systemkill90/WildBound/issues/5)

## Next concrete action

1. Install and record an Unreal Engine 5 version and compatible Windows C++ toolchain.
2. Compile `WildboundEditor`, fix UHT/C++ errors and open an empty test level.
3. Run the [engineering playtest](../developers/PROTOTYPE-PLAYTEST.md), confirm pawn controls, on-screen condition values, care resource checks and grid blocks.
4. Run a two-client PIE test, then a real headless-server test with a matching source-engine build when available.
5. After validation, tackle a minimal animal navigation/enclosure proof and a versioned persistent-world save design.

[Session handoff](SESSION-HANDOFF.md) · [Roadmap](../../ROADMAP.md) · [Decision record](DECISIONS.md)
