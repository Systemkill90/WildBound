# The Road Ahead

*One full, walkable place first — then the wilderness grows.*

[← Wildbound home](README.md) · [Development desk](docs/project/README.md) · [Current state](docs/project/CURRENT-STATE.md) · [First playable](docs/developers/FIRST-PLAYABLE.md)

## The journey in brief

**Verified October 22:** UE 5.8.4 editor/game compilation and a fresh Windows package of the original 180 × 160 m Greenveil exploration zone. A guarded 1080p traversal with all groups at Medium except Low shadows completed 15/15 waypoints over 327.7 m and averaged 75.89 FPS (p95 15.205 ms), with zero navigation failures or animal actors. The normal Medium default remains unchanged pending visual QA of Low shadows; this single traversal is not sustained-performance certification. [Evidence and daily field notes](docs/project/DAILY-DEVELOPMENT.md).

**Our next step:** move Greenveil into a representative authored biome built around a compact starter village. The village is the player's first home and the test grounds: arrival green, a few enterable homes/work buildings, garden/farm edge, creek and bridge, and a short returning forest loop. Use licensed authored environment content as the visual starting point, retain Wildbound's working player/game-mode foundation, and preserve the current map/package as rollback. The full map is not a large empty forest or a whole sample demo. See the [starter village slice brief](docs/world/greenveil-starter-village.md). No animal gameplay. Run Unreal builds/renders only when local Ollama is idle; the guarded test helper yields to inference. Sustained native-1080p 60 remains unverified.

**Owner priority:** no animal gameplay work yet. Animal-intent [PR #9](https://github.com/Systemkill90/WildBound/pull/9) remains paused, draft and unmerged. The older care/enclosure sequence below is deferred, not the current implementation order.

## Detailed milestones

Milestones show evidence, **not percent-finished guesses**. The first packaged Unreal prototype now launches locally. Gameplay quality and interaction checks remain open until verified in play.

| Milestone | Current status | What counts as complete |
| :-- | :-- | :-- |
| 0 — Unreal foundation | **Editor/game compile and Win64 package succeed on UE 5.8.4; packaged app launches. Dedicated-server target not tested.** | Reproducible toolchain setup; clean game/editor/server builds; launch and recover a test world |
| 1 — Greenveil exploration | **Gameplay/traversal foundation verified; visual environment remains an art-blockout.** The current generated slice has canopy/ground-cover instances, creek, bridges and cottage placeholders, but is not yet a representative finished biome. | Bounded playable zone based on authored forest content, Wildbound pawn/game mode, readable materials, connected route, measured performance and manual visual/collision QA |
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

**Now:** select a prebuilt authored environment that can support the small Greenveil starter-village composition, and inspect it in the installed UE 5.8 workflow before committing to a new map. The Electric Dreams forest supplies woodland but no suitable village buildings. Quixel's free Medieval Village Megascans Sample is a candidate, not yet acquired or verified. Build a separate bounded village map, keep the current Greenveil map/package untouched as rollback, then verify Wildbound game mode, controls, collision, route, lighting, and native-1080p performance. Do not repeat the failed full-map Electric Dreams save.

The local Windows demo uses native 1920×1080 and Medium settings by default. A guarded traversal with Low shadows and all other settings at Medium measured 13.178 ms mean / 15.205 ms p95. Visual impact remains to be checked, and sustained native-1080p 60 remains open.

**Next:** use actual sample-world assets and materials instead of trying to make graybox geometry look finished. Keep the area small and representative; run profiling after the visual baseline exists and local Ollama is idle. Keep source-restricted art local and preserve the tested package.

**Deferred:** animal care/intent, construction systems, co-op, persistence, farming and settlement simulation. Broader biomes and platforms require a later owner priority. Current cottages are visual placeholders, not village simulation; concept illustrations are not 3D models.

Native C++ tests and a successful package are useful but independent evidence. Neither alone proves that the in-game interaction loop works.

## Development constraints

PC is the initial development target. Keep the first map small, use free assets with documented licenses, and verify the core loop before adding large world areas or major systems. No paid dependencies or third-party voxel plug-ins are required for the current prototype. Xbox work remains an evaluation.
