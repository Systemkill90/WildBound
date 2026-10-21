# The Road Ahead

*One meadow, one creature, one shared world — then the wilderness grows.*

[← Wildbound home](README.md) · [Development desk](docs/project/README.md) · [Current state](docs/project/CURRENT-STATE.md) · [First playable](docs/developers/FIRST-PLAYABLE.md)

## The journey in brief

**Foundation established:** Unreal Engine 5.8.4 editor/game compilation, a saved Greenveil test map and a locally launched Windows package were recorded on October 20, 2026.

**Our next step:** verify real in-game movement, deer care and construction inputs. The code compiling is not the same as those interactions working.

**After that:** a rigged animal, enclosures that affect navigation, two-client authoritative gameplay, and eventually reliable persistent dedicated worlds. Breeding, villages and new biomes build on those foundations.

## Detailed milestones

Milestones show evidence, **not percent-finished guesses**. The first packaged Unreal prototype now launches locally. Gameplay quality and interaction checks remain open until verified in play.

| Milestone | Current status | What counts as complete |
| :-- | :-- | :-- |
| 0 — Unreal foundation | **Editor/game compile and Win64 package succeed on UE 5.8.4; packaged app launches. Dedicated-server target not tested.** | Reproducible toolchain setup; clean game/editor/server builds; launch and recover a test world |
| 1 — Small Greenveil test | **A Win64 package now cooks and launches with an imported rigged doe, idle/walk/run sequences, and 12 imported wind shrubs in the local map. The package opens at the display's 2560×1440 mode and is waiting behind a Windows Security firewall prompt; 1920×1080 performance, animation, scene readability, and care still need visual/play testing. The pawn remains a placeholder.** | Stable, readable world; controllable pawn; grounded animated animal; working care loop |
| 2 — Construction proof | **Portable placement rules pass; temporary snapped block code compiles. In-game placement/removal is not verified; not voxel.** | Server-validated construction interaction, collision, animal enclosure navigation and tested persistence boundary |
| 3 — Animal needs and trust | **34 portable simulation tests pass; replicated component and care RPCs compile. Runtime needs/care/trust behavior is not yet playtested in this checkout.** | Observe needs, care costs, refusal cases, stress/trust response and credible movement in play |
| 4 — Co-op and persistence | **Listen server accepted two simulated client connections. Gameplay replication and dedicated server untested; no integrated world saves.** | Two-client state/RPC tests, server validation, restart, versioned save and backup recovery |
| 5 — Breeding and genetics | Planned | Stable animal ID, parentage, bounded inheritance and safe offspring lifecycle |
| 6 — Greenveil vertical slice | Planned | Polished gather/build/farm/care/explore loop, grounded art and playtesting |
| 7 — Drowned March | Planned | Small original wetland biome with wildlife, fog, hazards, ruins and mystery |
| 8 — Broader content and platforms | Future evaluation | Evidence-based expansion, optimization, accessibility and Xbox feasibility |

## Tracked milestone tasks

[M0 editor build](https://github.com/Systemkill90/WildBound/issues/2) · [M1 multiplayer tests](https://github.com/Systemkill90/WildBound/issues/3) · [M2 voxel/nav](https://github.com/Systemkill90/WildBound/issues/4) · [M3 persistence](https://github.com/Systemkill90/WildBound/issues/5)

## Near-term sequence

**Now:** use a small forest environment from Epic's free Electric Dreams sample to replace the rough patchwork scene; retain Wildbound gameplay code and keep experimental PCG/Substrate features out of required runtime systems. Then playtest controls, animal care, needs and building, and make the deer grounded and animated before expanding the area.

The earlier Electric Dreams preview held the 60 FPS cap with 60% TSR (1152×648 internal render), which is not evidence of native 1080p performance. The current package must be relaunched windowed at 1920×1080 and measured before a frame-rate claim is made.

**Next:** inspect the locally imported doe locomotion and shrub dressing in the 1080p window, then playtest care/build interactions and validate RPC side effects with two clients. Replace the placeholder player with a properly scaled rigged character afterward. Follow with animal navigation around a small enclosure and persistent-world recovery tests.

**Later:** selective breeding, farm stock, wild ecology, villages, weather, more biomes, trading and optional platform targets.

Native C++ tests and a successful package are useful but independent evidence. Neither alone proves that the in-game interaction loop works.

## Development constraints

PC is the initial development target. Keep the first map small, use free assets with documented licenses, and verify the core loop before adding large world areas or major systems. No paid dependencies or third-party voxel plug-ins are required for the current prototype. Xbox work remains an evaluation.
