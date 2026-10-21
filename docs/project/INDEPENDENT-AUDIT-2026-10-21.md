# Wildbound — independent-development-perspective audit

**Date:** October 21, 2026  
**Reviewer:** ChatGPT acting as a critical outside developer — **not** a hired third-party studio, security assessor or certified Unreal engineer.  
**Audit mode:** GitHub source/document examination and existing test evidence only. **No PC access, new UE compile, playtest, packaged run, asset redistribution-rights validation or performance benchmark occurred in this audit.**

[Checkpoint](TRUCK-STOP-2026-10-21.md) · [Current state on main](CURRENT-STATE.md) · [Next-stage runbook](NEXT-STAGE-RUNBOOK.md)

## Executive opinion

Wildbound has progressed beyond a paper concept: the recorded UE 5.8.4 editor/game compilation, cooked Windows package and visually loaded Greenveil test map are genuine foundations. The game vision is compelling but ambitious: voxel construction, persistent co-op, animal behavioral simulation, genetics, village society, fantasy peoples, magical ecologies and multiple biomes all interact. **The greatest threat is not a lack of ideas; it is building breadth before the first small player loop is reliable.**

Immediate recommendation: **hold scope**, perform a concise hands-on control/care/build test, fix observed defects, preserve the working packaged baseline, and prove animal enclosure behavior alongside construction before new content-scale features.

## Evidence boundaries

- **Supported by live main-branch project record:** UE 5.8.4; VS 2022 [compiler version redacted]/MSVC toolchain; Windows SDK 10; editor/game compile and Win64 packaging; Greenveil map and imported CC0 artwork; startup; a two-client *join* smoke test; grounded deer movement observed in a local preview.
- **Supported by repository CI:** 34 independent animal-logic assertions, 22 snapshot-format checks, 13 placement-policy tests, 58 static wiring checks. These **do not** constitute runtime Unreal gameplay assertions.
- **Not established:** control usability, successful feeding/watering/reassurance, 2-client care/build state correctness, dedicated server, voxel terrain, enclosures, versioned disk saves, offline animal care, breeding/genetics, NPC simulation, full-biome performance.
- **Local machine state:** a preview was recorded as open on October 20. An earlier session's "left open" is **not live proof** that it is currently open.

## Risks ranked for engineering priority

| Priority | Finding | Evidence / reasoning | Concrete action and proof |
| :-- | :-- | :-- | :-- |
| **P0** | Interaction loop still not manually validated | README and playtest record mark pawn movement, care RPC effects and cube placement as unchecked | Record keyboard/camera/jump, target interaction, supply count, changes to stats and visible blocks from packaged build |
| **P0** | Co-op joins are not co-op gameplay tests | Main record says two simulated clients connected to a *listen* server, without action/state assertions | Host + 2 clients; intentionally run all care/block actions, rejected requests and late-join state checks; verify authoritative logging |
| **P0** | Server and persistence not yet demonstrated | Server target exists, but no dedicated executable/run; snapshot codec isn't connected to disk | Separate dedicated-server build, save versioning, atomic snapshot/backups, reconnect/restart/restore proof |
| **P1** | Voxel/animal-navigation dependency collision | Current blocks are independent actors snapped to 1 m grid; deer wanders with ground traces/sweep but has no real navmesh planning | One tiny removable wall/gate + feeder test where opening/closing changes pathing; evaluate voxel cost on live server |
| **P1** | No credible animal locomotion yet | Deer static pose slides across ground; ground probes keep it from floating but not from bad step/gate behavior | Licensed rig + idle/walk transitions + turn-in-place, ground alignment, collision behavior and acceptable net smoothing |
| **P1** | Gameplay authorization is only an early prototype | `ServerPlaceBlock` checks distance, 2D grid, arena occupancy/count, collisions and cooldown; no resource consumption, land ownership, LOS test or player permissions. `ServerRemoveBlock` can destroy any nearby block. `ServerCareAnimal` has basic range/LOS/cooldown and temporary supplies | Define proper actor permissions, inventory transaction and a bad-RPC abuse test; do not publicly host it as secure |
| **P1** | Movement scaling and ecological plausibility | `WildboundPrototypeAnimal.cpp` repeatedly makes ground traces and uses random local destinations; no flock coordination, exclusion volumes or navigation; per-animal work must be budgeted | Stress test 1/10/50 placeholder animals with server tick profiles; later move to budgeted AI/navigation |
| **P1** | Art and example-project portability | Local Electric Dreams project is used for preview; imported source art under Fab Standard License is intentionally not redistributed. The GitHub version may look different from the developer's local preview | Audit every migrated asset, include only publishable license-permitted source or provide a reproducible local install recipe; verify clean checkout |
| **P1** | Gitignore may hide essential map/content revisions | `.gitignore` contains `/Content/**` to prevent accidentally uploading restricted assets. Curated currently tracked assets remain, but new authored maps/assets won't stage automatically | Keep safety guard, use explicit file-by-file rights review and LFS checks when intentional Unreal content changes are ready |
| **P1** | Editor automation is machine-path dependent | `Scripts/Editor/ImportGreenveilDeer.py` embeds `<local-project-root>\Source\...`. This is not portable to a new developer path | Resolve source from project directory, expose validated parameters, and test on a fresh checkout |
| **P2** | Visual benchmarking is too narrow | Reported 60 FPS at 1920×1080 output is 60% TSR internal on Medium in a starting view; not a traversal stress test or native-1080 result | Capture scalability settings, GPU/CPU/VRAM, movement through the scene, 1% lows and representative actor counts |
| **P2** | Documentation has stale staged statements | Existing draft PR #1 said initial scaffold uncompiled, but `main` now documents a working Windows package | Rebase/update planning docs to current evidence while retaining idea status as exploratory |
| **P2** | Public repo contains third-party/source binary assets | `.uasset`, `.umap`, `.glb` use Git LFS; CC0 sources are recorded but each imported object must retain provenance and limits | Track exact download source/license, verify LFS pointers and quotas, check no restricted Fab content entered commits |
| **P2** | Lore/asset explosion | Brainstorm now includes novel morphologies, fantasy villages, ancient trees and huge fungi; each implies rigs, audio, AI, culture, environments | Keep a separate reviewable candidate queue, never quietly promote a sketch to canon or the near-term roadmap |

## Technical details worth checking before another large feature

### Prototype care actions

The player controller receives an actor reference and an action, validates server-side range/line of sight, short cooldown and finite starter supply counts; it then calls `TryCare`. This is a sensible *scaffold*, but the supply source is a controller counter rather than real replicated inventory or a persistent owned item. Visual effects, simultaneous actions, refusal UI and exact gameplay behavior are **unverified**. Add tests first.

### Construction

The `WildboundPrototypePlacement` policy is well bounded and independently tested, but `SpawnActor` places individual cube actors at a fixed Z. That is a deliberate toy arena; it will not translate directly to arbitrary sloped terrain, chunk mesh rebuilds, enclosure barriers or hundreds of thousands of edits. Avoid polishing this system as if it were the final voxel implementation.

### Wildlife

The deer wanders with local random points and a world-static ground probe. Ground observation reported along a creek bank is good progress but does not verify navigation around gates or hazards. A new six-legged creature would multiply skeletal, animation, locomotion, interaction and collision costs. Use ordinary-rig antler/eye variations before pursuing novel body plans.

### Persistence/server design

The standalone snapshot is only one animal plus grid cells. A real world needs unique animal identities and lineages, inventories, permissions, save schema migrations, backed-up structures, and a welfare policy for time elapsed while players or servers are offline. Server authority and recoverability must be designed early; do not rely on client files as the source of truth.

### Legal and workflow hygiene

The repository contains CC0-source records for Poly Haven and the standing deer. The Electric Dreams sample is locally used under Fab terms and must not be pushed as standalone source assets merely because it loads in Unreal. Git LFS use and source-file provenance deserve periodic review. Public repository visibility is not an open-source license.

## Independent verdict

**Continue, selectively. Do not rewrite.** The foundation has advanced to a compiled and packaged early prototype. There is no evidence demanding a ground-up engine or architecture rewrite. Prioritize proven control/care/build interactions, animal locomotion around a tiny constructed enclosure, and two-client authoritative behavior. Keep the imaginative future in the idea board until those foundations earn expansion.

**No new Unreal verification was performed during this audit.**
