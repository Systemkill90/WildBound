# The Road Ahead

*One meadow, one creature, one shared world — then the wilderness grows.*

[← Wildbound home](README.md) · [Development desk](docs/project/README.md) · [Current state](docs/project/CURRENT-STATE.md) · [First playable](docs/developers/FIRST-PLAYABLE.md)

## The journey in brief

**Foundation established:** Unreal Engine 5.8.4 editor/game compilation, a locally launched Wildbound prototype and an authored Electric Dreams environment as the visual base were recorded on October 21, 2026.

**Our next step:** verify real in-game movement, deer care and construction inputs. The code compiling is not the same as those interactions working.

**After that:** a rigged animal, enclosures that affect navigation, two-client authoritative gameplay, and eventually reliable persistent dedicated worlds. Breeding, villages and new biomes build on those foundations.

## Detailed milestones

Milestones show evidence, **not percent-finished guesses**. The first packaged Unreal prototype now launches locally. Gameplay quality and interaction checks remain open until verified in play.

| Milestone | Current status | What counts as complete |
| :-- | :-- | :-- |
| 0 — Unreal foundation | **Editor/game compile and Win64 package succeed on UE 5.8.4; packaged app launches. Dedicated-server target not tested.** | Reproducible toolchain setup; clean game/editor/server builds; launch and recover a test world |
| 1 — Small Greenveil test | **The launch map is Epic's close-range Electric Dreams PCG forest, now with a Wildbound field grade, compact field HUD, Quinn rig and moving deer. An opt-in no-input movement/camera test passed. The sample's ray-tracing residency warning is hidden from the play view but remains a logged optimization issue; care/build controls, full collision traversal and frame time remain unverified. The larger 15,244-actor world remains outside the prototype launch.** | Stable, readable world; controllable pawn; grounded animated animal; working care loop |
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

**Now:** playtest the Electric Dreams-based window. Check movement, deer animation and grounding, feeding/watering/needs, block placement and native-1080p traversal frame time. Reduce the sample to a smaller Greenveil slice after confirming its art direction and performance.

The current preview runs at native 1920×1080, with screen percentage forced to 100%, dynamic resolution disabled and a 60 FPS cap; the cap is not evidence of measured frame rate during traversal.

**Next:** playtest the new capsule collision and deer ground movement around rocks, logs and foliage. Validate care/build RPC side effects with two clients. Replace the temporary engine mannequin with Wildbound homesteader art afterward, then test animal navigation around a small enclosure and persistent-world recovery.

**Later:** selective breeding, farm stock, wild ecology, villages, weather, more biomes, trading and optional platform targets.

Native C++ tests and a successful package are useful but independent evidence. Neither alone proves that the in-game interaction loop works.

## Development constraints

PC is the initial development target. Keep the first map small, use free assets with documented licenses, and verify the core loop before adding large world areas or major systems. No paid dependencies or third-party voxel plug-ins are required for the current prototype. Xbox work remains an evaluation.
