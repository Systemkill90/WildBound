# Greenveil engineering prototype — operator playtest guide

**Status: UE 5.8.4 editor/game compile and Win64 package pass; package launched. Controls and gameplay interactions in this checkout still need a hands-on playtest.**

This is a first small playable foundation, not a finished demo. Greenveil is a saved forest clearing with CC0 environment assets and a deer static mesh. Construction is temporary snapped blocks, not a voxel engine. The player pawn remains a primitive, and the deer has no skeletal animation.

## Current local build

The **last reported** packaged build was at `D:\WildBound\Builds\WildBoundGreenveil\Windows\Wildbound.exe`; it was launched in the October 20 desktop session. This documentation review has not verified the file is still present or the process is still running. The package is generated locally and is intentionally not committed. For a source checkout, run [`Tools/Start-Wildbound.cmd`](../../Tools/Start-Wildbound.cmd) to compile and launch the editor-built Greenveil game. Use `-BuildOnly` to compile without launching, or `-EngineRoot "D:\WildBound\Engine\UE_5.8"` to specify an engine.

The verified toolchain is Unreal Engine 5.8.4, Visual Studio Community 2022 17.14.42, MSVC 14.44.35207, and Windows SDK 10.0.26100.0. Build/cook logs are kept in ignored `Saved/WildboundBootstrap`.

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

Compare the HUD's animal values and supply counters before/after care attempts. Check refusal when too far, blocked, or out of supplies. Confirm the deer visually touches the ground and inspect its movement; it currently moves with a static pose, so the absent walk cycle is expected. The bowl and pail are scenery and are not interactive targets.

## Evidence already collected

| Check | Result |
| :-- | :-- |
| Editor/game compile | Passed |
| Saved Greenveil map generation and cook | Passed, 543 packages in the package registry |
| Win64 Development package | Passed, about 145 MiB cooked content |
| Packaged game startup | Launched locally; Greenveil map loaded |
| Native animal rules / snapshot validation / placement rules | Passed 34 / 22 / 13 checks |
| Static source wiring | Passed 58 checks |
| Listen host / two simulated clients | Both clients joined; only connection acceptance checked |
| Keyboard movement, live care effects, building placement/removal | Not manually verified in this checkout |
| Gameplay state replication, dedicated server, save/restart | Not verified / not implemented |

## Known limits

- The character uses a primitive mesh; use this test for controls and collision, not final visual judgment.
- Deer is a static model whose root moves; no skeletal idle/walk cycle or animal navigation system exists.
- Feeding and watering use prototype counters. There is no real inventory or bowl interaction.
- Placed blocks and animal state are in memory only. No voxel terrain, construction persistence or world saves exist.
- The portable snapshot test validates data format only; it is not integrated with Unreal save/load.
- A two-client join test does not prove that animal state, care results or construction replicate correctly.

Record only observed results in [current state](../project/CURRENT-STATE.md), [session handoff](../project/SESSION-HANDOFF.md) and [roadmap](../../ROADMAP.md). Keep the project small until controls, grounding, care and block interactions work reliably.
