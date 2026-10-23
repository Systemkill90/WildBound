# The Road Ahead

*One full, walkable place first — then the wilderness grows.*

[← Wildbound home](README.md) · [Development desk](docs/project/README.md) · [Current state](docs/project/CURRENT-STATE.md) · [First playable](docs/developers/FIRST-PLAYABLE.md)

## The journey in brief

**Verified October 22:** UE 5.8.4 editor/game compilation and a fresh Windows package of the original 180 × 160 m Greenveil exploration zone. The latest 1080p Medium traversal completed 15/15 movement waypoints over 326.1 m with zero navigation failures or animal actors. It averaged 50.61 FPS in one uncapped run, short of 60. The creek reads clearly; exposure tuning restored some clearing detail, but it remains bright. [Evidence and daily field notes](docs/project/DAILY-DEVELOPMENT.md).

**Our next step:** manually inspect side trails, off-trail collision, camera clearance and jumping, then profile the populated zone for the remaining gap to 60 FPS. The latest native-1080p Medium traversal averaged 50.61 FPS (p95 22.616 ms); sustained 60 remains unverified and unmet.

**Owner priority:** no animal gameplay work yet. Animal-intent [PR #9](https://github.com/Systemkill90/WildBound/pull/9) remains paused, draft and unmerged. The older care/enclosure sequence below is deferred, not the current implementation order.

## Detailed milestones

Milestones show evidence, **not percent-finished guesses**. The first packaged Unreal prototype now launches locally. Gameplay quality and interaction checks remain open until verified in play.

| Milestone | Current status | What counts as complete |
| :-- | :-- | :-- |
| 0 — Unreal foundation | **Editor/game compile and Win64 package succeed on UE 5.8.4; packaged app launches. Dedicated-server target not tested.** | Reproducible toolchain setup; clean game/editor/server builds; launch and recover a test world |
| 1 — Greenveil exploration | **Packaged traversal/navigation passed in a populated original zone. 507 canopy trees, 9,036 grass/clover instances, layered understory, creek, bridges and three cottage placeholders.** | Bounded playable zone, controllable pawn, connected route, measured performance and manual visual/collision QA; remaining polish is open |
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

**Now:** explore the packaged Greenveil zone manually. Check side routes, jump/camera and off-trail collisions; refine cottage interiors, materials, grass placement and zone boundaries.

The local Windows demo uses native 1920×1080 and Medium settings by default. The latest scripted traversal measured 19.760 ms mean / 22.616 ms p95. A normal launch caps at 60; optimization for sustained native-1080p 60 remains open.

**Next:** improve this slice from actual exploration feedback and profiling. Keep source-restricted art local, protect the tested package, and expand content only within a measured memory/frame budget.

**Deferred:** animal care/intent, construction systems, co-op, persistence, farming and settlement simulation. Broader biomes and platforms require a later owner priority. Current cottages are visual placeholders, not village simulation; concept illustrations are not 3D models.

Native C++ tests and a successful package are useful but independent evidence. Neither alone proves that the in-game interaction loop works.

## Development constraints

PC is the initial development target. Keep the first map small, use free assets with documented licenses, and verify the core loop before adding large world areas or major systems. No paid dependencies or third-party voxel plug-ins are required for the current prototype. Xbox work remains an evaluation.
