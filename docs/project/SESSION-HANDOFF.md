# Wildbound session handoff

Updated: October 20, 2026.

Read [Current state](CURRENT-STATE.md), [Decisions](DECISIONS.md) and [Roadmap](../../ROADMAP.md) before new work.

## Delivered this session

- Created a platform-independent deterministic animal needs/trust model with tests.
- Refactored `UWildboundAnimalNeedsComponent` to call that model, replicate a condition snapshot and update roughly once per second instead of firing Blueprint events every frame.
- Authored a Greenveil engineering prototype: character and camera, placeholder replicated animal, player-controller care interactions with server-side distance/LOS/resource/cooldown checks, temporary 100 cm grid blocks, temporary ground, game mode bootstrap and debug HUD.
- Added legacy input bindings for temporary testing, plus GitHub Actions native C++ and static project-wiring checks.
- Added a portable versioned snapshot format with malformed-input tests, and a bounded snap-grid policy with native tests. The grid policy is called from the prototype player-controller placement path. Snapshot serialization is not yet connected to Unreal or disk.
- **All four** independent checks passed on [CI run 39516848594](https://github.com/Systemkill90/WildBound/actions/runs/39516848594).

## Exact status

No Unreal Engine build, editor launch, map asset, two-player test, dedicated server, AI, actual voxel terrain, **runtime persistent saves** or complete taming gameplay exists. Newly authored actors/RPCs are uncompiled. Network checks in code are preliminary and require adversarial testing.

Engineering tasks are tracked in [M0 editor compilation](https://github.com/Systemkill90/WildBound/issues/2), [M1 multiplayer](https://github.com/Systemkill90/WildBound/issues/3), [M2 voxel and enclosure](https://github.com/Systemkill90/WildBound/issues/4), and [M3 persistent saves](https://github.com/Systemkill90/WildBound/issues/5).

## Next operator action

1. Determine and record the UE minor version and Windows C++ toolchain installed on the development PC.
2. Follow [prototype playtest guide](../developers/PROTOTYPE-PLAYTEST.md) to generate project files, compile the Editor target, create an empty level and inspect the runtime harness.
3. Capture every compile error and resolve it in code. Check the first launch, spawn behavior, input, animal condition and block placement before any new major features.
4. Run a two-client test and verify RPC authority, replication, denial of invalid actions, late joining, and block population limit.
5. Only after that, evaluate voxel implementation and prototype animal navigation around player-built walls.

## Remaining engineering risks

UE version compatibility is unknown. Empty-level spawn behavior and placeholder mesh visibility are untested. Construction and care lack persistence, true resource inventory integration, role permissions and sophisticated anti-exploit checks. Initial code has no backup recovery, offline care model, genetics or population scaling. Platform budget and animal navigation around changing voxel geometry remain unresolved.

Keep binary engine/platform dependencies, real save files, private information, and unlicensed assets out of the repository. Do not mark untested scaffolds complete.
