# The Road Ahead

*One full, walkable place first — then the wilderness grows.*

[← Wildbound home](README.md) · [Development desk](docs/project/README.md) · [Current state](docs/project/CURRENT-STATE.md) · [First playable](docs/developers/FIRST-PLAYABLE.md)

## The journey in brief

**Verified October 23:** UE 5.8.4 editor compile, canonical Greenveil map generation, and a fresh separate Windows package all succeeded. The packaged native-1080p route passed 15/15 grounded waypoints over 326.1 m. Medium with Low shadows averaged 75.65 FPS; all-Medium averaged 50.38 FPS and Low averaged 93.53 FPS. The click-to-play launcher now uses the measured Medium/Low-shadow profile by default, with a High option. These are automated single-route runs, not sustained-performance certification. [Evidence and daily field notes](docs/project/DAILY-DEVELOPMENT.md).

**Our next step:** grow the current Greenveil world into a representative authored biome built around a compact starter village. `/Game/Maps/GreenveilExplorationPolish` is the canonical starting world: the village is the player's first home and the in-world test route, with an arrival green, enterable homes/work buildings, garden/farm edge, creek and bridge, and a returning forest loop. Extend this world cumulatively as the map grows. Use Git revisions and the preserved package as recovery points, not a disposable parallel WildBound test map. Use licensed authored environment content, retain Wildbound's working player/game-mode foundation, and keep the area bounded until traversal and performance are verified. The full map is not a large empty forest or a whole sample demo. See the [starter village slice brief](docs/world/greenveil-starter-village.md). No animal gameplay. Run Unreal builds/renders only when local Ollama is idle and resource guards pass. Sustained native-1080p 60 remains unverified.

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

**Now:** inspect the acquired free Medieval Village Megascans Sample by loading a bounded asset subset; do not open its full World Partition/minimap rebuild or repeat the failed full-map Electric Dreams save. No sample asset has been transferred into WildBound. Select a suitable village asset set and grow the canonical Greenveil world; verify route, collision, lighting, and native-1080p performance.

The local Windows demo uses native 1920×1080, Medium settings, and Low shadows by default. Low-shadow visual impact still needs owner review; Medium with Low shadows measured 13.218 ms mean and 15.354 ms p95 in the latest packaged run.

**Next:** use actual sample-world assets and materials instead of trying to make graybox geometry look finished. Keep the area small and representative; run profiling after the visual baseline exists and local Ollama is idle. Keep source-restricted art local and preserve the tested package.

**Deferred:** animal care/intent, construction systems, co-op, persistence, farming and settlement simulation. Broader biomes and platforms require a later owner priority. Current cottages are visual placeholders, not village simulation; concept illustrations are not 3D models.

Native C++ tests and a successful package are useful but independent evidence. Neither alone proves that the in-game interaction loop works.

## Development constraints

PC is the initial development target. Keep the first map small, use free assets with documented licenses, and verify the core loop before adding large world areas or major systems. No paid dependencies or third-party voxel plug-ins are required for the current prototype. Xbox work remains an evaluation.
