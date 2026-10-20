# Wildbound current state

Updated: October 20, 2026.

## Source and project assets authored

- Unreal Engine 5 project descriptor, module and game/editor/server target definitions; no engine version pin.
- Initial C++ animal simulation model with hunger, thirst, physical condition, stress and trust.
- UE-side replicated animal needs component with server-only simulation and care entry points.
- Prototype animal actor, third-person character, player controller, placeholder build block, ground, game mode, and debug HUD.
- Input mappings for walking, looking, feeding, watering, reassuring, placing and removing temporary blocks.
- Game mode selects a code-assembled starter area when a level is opened in Play; no `.umap` is committed.
- Portable native C++ tests and a dependency-free static project-wiring checker in GitHub Actions.
- Core game vision, systems, biome documents, [engineering playtest guide](../developers/PROTOTYPE-PLAYTEST.md), and milestone roadmap.

## Actually verified

- GitHub accepted and served the source commits.
- [GitHub Actions run 39516040708](https://github.com/Systemkill90/WildBound/actions/runs/39516040708) completed successfully for **native C++ simulation compile/tests** and **static source-layout checks**.
- The portable animal model was compiled independently of Unreal. These checks are not tests of Unreal actors, RPCs, replication, rendering or persistence.

## Not verified or implemented

**No Unreal editor/game/server build has been compiled or launched.** No map has been opened, no player or animal spawned during gameplay, no multiplayer simulation or network authorization tested, and no saved-game recovery tested.

The runtime classes are authored **prototype source, not verified working features**. Test-floor and snapped mesh blocks are placeholders, **not** a voxel construction or terraforming system. AI navigation, grazing/water seeking, actual shelters, genetics, breeding, husbandry interfaces, world persistence, purchased assets and animations are absent.

No Unreal minor version, voxel plugin, paid dependency or Xbox platform approval has been selected.

## Next concrete action

1. Install and record an Unreal Engine 5 version and compatible Windows C++ toolchain.
2. Compile `WildboundEditor`, fix UHT/C++ errors and open an empty test level.
3. Run the [engineering playtest](../developers/PROTOTYPE-PLAYTEST.md), confirm pawn controls, on-screen condition values, care resource checks and grid blocks.
4. Run a two-client PIE test, then a real headless-server test with a matching source-engine build when available.
5. After validation, tackle a minimal animal navigation/enclosure proof and a versioned persistent-world save design.

[Session handoff](SESSION-HANDOFF.md) · [Roadmap](../../ROADMAP.md) · [Decision record](DECISIONS.md)
