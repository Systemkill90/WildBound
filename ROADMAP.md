# The Road Ahead

## Creative Library pilot — October 25

The first vertical slice is implemented on `feature/creative-library-pilot`: private NAS inbox/archive, direct desktop upload of accessible originals, checksummed media, Git design records, explicit approval, worker reference packages, and Garage Missing Reference Requests. Garage `2.5.0-pilot` also persists nine supported lifecycle stages through checksum-verified recovery archival and final handoff. The combined Garage + Dashboard suite passes 40/40, and startup reconciliation completed the two new stages for an existing owner-approved Unreal import without rerunning it. The local TripoSR static-mesh path is installed, checksum-verified, and boundary-smoke-tested through Blender; new rigging/animation authoring remains Limited. The next creative acceptance step is a coherent owner-supplied design bundle and approved worker retrieval. Semantic conflict review and automated PR creation remain later increments. See [pilot workflow](docs/creative-library/README.md) and [completion evidence](docs/project/evidence/ai-garage-completion-2026-10-25.json). Do not resume paused animal gameplay during this work.

## Asset pipeline backbone — October 26

Branch `feature/garage-asset-pipeline-backbone` unifies typed production and review routes for 2D concept art, textures, skybox/VFX source art, voice, music, ambience, SFX, static props, and supplied model/rig/animation inspection. The October 27 live asset-readiness workflow verified 28/28 artifact checksums, 14 owner-review outputs, and no artifact-structure issues; it found one missing Greenveil lantern reference. A concept-art smoke then failed on the local AMD ROCm image worker with HIP OOM and produced no artifact. `expandable_segments` is unsupported by installed PyTorch ROCm 7.2.1, so no second image attempt was made. Latest voice/music/ambience/SFX files pass structural checks and await owner review. Concept-art/texture/skybox/VFX and image-dependent static-prop generation are not verified as operational today. Texture output is one bitmap, skybox/VFX are source art only, supplied model routes inspect/prep existing GLB/FBX, and new character modeling/rigging/animation remain unavailable. The Dashboard's fixed Local Production Manager plan/run proxy routes were broken and are now added and live-verified. Combined Garage + Dashboard source suite passes 84/84. See [current state](docs/project/CURRENT-STATE.md) and [session handoff](docs/project/SESSION-HANDOFF.md).

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
| 1 — Greenveil exploration | **World Partition traversal and performance baseline verified; village art is in progress.** The 180 × 160 m slice now uses locally installed modular village assets for three cottage shells, shuttered windows, a shared well, creek and bridges; visual review is still pending. | Bounded playable zone based on authored forest content, Wildbound pawn/game mode, readable materials, connected route, measured performance and manual visual/collision QA |
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

**Now:** get a clear visual review of the current Greenveil package, then improve the compact village with existing local licensed assets where the render shows gaps. The canonical generator map is `/Game/Maps/GreenveilExplorationPolish`; its World Partition runtime copy is `/Game/Maps/GreenveilExplorationPolish_WP`. Preserve the current package/revisions and avoid saving the full sample world.

The new Win64 build is 1920×1080, Medium with Low shadows. One clean automated route measured 89.41 FPS mean, 13.493 ms p95, and 14.116 ms p99, with peak process memory 1,547.6 MiB. This is a route sample, not sustained certification. A Windows prompt for the optional Unreal trace hub currently obscures visual inspection.

**Next:** review the scene against the Idea Board; refine cottage/yard/bridge composition and collision based on that render; repeat the route/performance check after substantive changes. Keep sample assets local and out of public Git.

**Deferred:** animal care/intent, construction expansion, co-op, persistence and settlement simulation. No animal gameplay work before the Greenveil village baseline is reviewed. Broader biomes and platforms remain later work.

## Development constraints

PC is the initial development target. Keep the first map small, use free assets with documented licenses, and verify the core loop before adding large world areas or major systems. No paid dependencies or third-party voxel plug-ins are required for the current prototype. Xbox work remains an evaluation.
