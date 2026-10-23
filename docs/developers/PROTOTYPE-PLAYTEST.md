# Greenveil engineering prototype — operator playtest guide

**Historical/deferred guide:** October 22 owner priority is exploration before animal gameplay. Use the [current exploration handoff](../project/SESSION-HANDOFF.md) and [packaged test report](../project/GREENVEIL-EXPLORATION-2026-10-22.md). The older actor/control descriptions below do not describe the current exploration map.

**Status: UE 5.8.4 editor/game compile and Win64 package pass; package launched. Controls and gameplay interactions in this checkout still need a hands-on playtest.**

This is a first small playable foundation, not a finished demo. Greenveil is a saved forest clearing with CC0 environment assets and a deer actor that can use a locally imported rigged doe and idle/walk/run sequences. Construction is temporary snapped blocks, not a voxel engine. The player pawn remains a primitive. The Fab assets are local-only and are not included in Git.

## Current local build

The October 21 package was generated locally and is intentionally not committed. For a source checkout, run [`Tools/Start-Wildbound.cmd`](../../Tools/Start-Wildbound.cmd), which builds and opens the editor game at 1920×1080 with a 60 FPS cap. Use `-BuildOnly` to compile without launching, or pass `-EngineRoot <installed Unreal Engine root>` to specify an engine. This guide is historical; follow the current exploration handoff for active test instructions.

The recorded build used Unreal Engine 5.8.4 and Visual Studio 2022. Build/cook logs are kept in ignored `Saved/WildboundBootstrap`.

## Controls to check

| Input | Prototype action |
| :-- | :-- |
| WASD / mouse | Move / look |
| Space | Jump |
| E while aiming at animal | Feed (starter feed portion if accepted) |
| R while aiming at animal | Water (starter water portion if accepted) |
| F while aiming at animal | Reassure |
| G | Place a temporary snapped block ahead |
| X while aiming at block | Remove a temporary block |

Compare the HUD's animal values and supply counters before/after care attempts. Check refusal when too far, blocked, or out of supplies. Confirm the doe visually touches the ground and that idle/walk/run sequences change with movement. The bowl and pail are scenery and are not interactive targets.

## Evidence already collected

| Check | Result |
| :-- | :-- |
| Editor/game compile | Passed |
| Saved Greenveil map generation and cook | Passed; latest cook completed 620 runtime packages |
| Win64 Development package | Passed; latest package is in a local-only archive |
| Packaged game startup | Launched locally; Greenveil map loaded. Windows Security prompt currently obscures the game |
| Native animal rules / snapshot validation / placement rules | Passed 34 / 22 / 13 checks |
| Static source wiring | Passed 58 checks |
| Listen host / two simulated clients | Both clients joined; only connection acceptance checked |
| Keyboard movement, live care effects, building placement/removal | Not manually verified in this checkout |
| Gameplay state replication, dedicated server, save/restart | Not verified / not implemented |

## Known limits

- The character uses a primitive mesh; use this test for controls and collision, not final visual judgment.
- The local packaged build includes the rigged doe and imported wind shrubs. In-game animation, close inspection of the updated scene, and sustained 1080p performance still need visual checks; full animal navigation does not exist.
- Feeding and watering use prototype counters. There is no real inventory or bowl interaction.
- Placed blocks and animal state are in memory only. No voxel terrain, construction persistence or world saves exist.
- The portable snapshot test validates data format only; it is not integrated with Unreal save/load.
- A two-client join test does not prove that animal state, care results or construction replicate correctly.

Record only observed results in [current state](../project/CURRENT-STATE.md), [session handoff](../project/SESSION-HANDOFF.md) and [roadmap](../../ROADMAP.md). Keep the project small until controls, grounding, care and block interactions work reliably.
