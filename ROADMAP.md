# Wildbound development roadmap

[Home](README.md) · [Current state](docs/project/CURRENT-STATE.md) · [Prototype test guide](docs/developers/PROTOTYPE-PLAYTEST.md)

Milestones show evidence, **not percent-finished guesses**. No playable Unreal build or release date has been established.

| Milestone | Current status | What counts as complete |
| :-- | :-- | :-- |
| 0 — Unreal foundation | **C++ scaffold and gameplay harness authored; UE uncompiled** | Select toolchain; build game/editor/server; launch and save a test level |
| 1 — Small Greenveil test | **Starter ground, character, animal and HUD code authored; untested** | Movement, readable debug feedback and stable map playback |
| 2 — Construction proof | **Grid-block placement/removal authored; portable placement rules unit-tested; not voxel** | Test voxel volumes, chunk collision and animal enclosure navigation in UE |
| 3 — Animal needs and trust | **Portable logic tested; UE component and care RPCs untested** | Observe care, deprivation, stress, trust and credible animal behavior in play |
| 4 — Dedicated co-op and persistence | **RPC/replication source authored; portable versioned snapshot tests; no integrated runtime saves or server tests** | Two clients, server validation, restart, versioned save and backup recovery |
| 5 — Breeding and genetics | Planned | Stable animal ID, parentage, bounded inheritance and safe offspring lifecycle |
| 6 — Greenveil vertical slice | Planned | Polished gather/build/farm/care/explore loop, art and playtesting |
| 7 — Drowned March | Planned | Small original wetland biome with wildlife, fog, hazards, ruins and mystery |
| 8 — Broader content and platforms | Future evaluation | Evidence-based expansion, optimization, accessibility and Xbox feasibility |

## Tracked milestone tasks

[M0 editor build](https://github.com/Systemkill90/WildBound/issues/2) · [M1 multiplayer tests](https://github.com/Systemkill90/WildBound/issues/3) · [M2 voxel/nav](https://github.com/Systemkill90/WildBound/issues/4) · [M3 persistence](https://github.com/Systemkill90/WildBound/issues/5)

## Near-term sequence

**Now:** compile in Unreal, validate the placeholder character/animal/building interactions, and fix failures.

**Next:** one navigable herbivore that can graze, drink and respond to a changing enclosure; a small construction test with server authority and collision; then reliable save identities and recoverability.

**Later:** selective breeding, farm stock, wild ecology, villages, weather, more biomes, trading and optional platform targets.

Native C++ tests are useful independent evidence, but must never be presented as successful UE builds.

## Development constraints

The prototype uses original source code and Unreal's built-in primitive meshes only. No new paid dependencies, external art licenses or third-party voxel plug-ins are committed. PC is the initial proposed development target; console work remains an evaluation.
