# Wildbound next major update — staging handoff

**State:** Staged development preparation, **not installed or released**. Branch: `staging/greenveil-next-playable-2026-10-22`.

## Last verified baseline from main

- UE5.8.4, Visual Studio 2022, Windows editor/game compilation and previous Win64 package reported working.
- Current sample-backed close-range preview with temporary Quinn character and skeletal deer movement; one automated movement/camera smoke test passed.
- Native animal simulation, prototype snapshot, placement and source structure checks passed in earlier GitHub CI.
- Care/feed/water/reassure interactions, temporary construction UX, two-client care/build replication and actual dedicated server/save recovery remain unverified.

## What this staging branch does

- Adds explicit release A/B/C engineering acceptance and rollback gates.
- Adds independent C++ regression coverage for extended care/stress/condition cases, to reduce logic regressions before UE work.
- Adds a machine-independent review of the next playable goal, emphasizing first interaction loop before large content expansion.
- Does **not** alter the current packaged executable, touch the user's desktop, copy Unreal Fab sample assets or claim in-game validation.

## Ordered next desktop development job

1. Pull branch into a **separate development checkout or worktree**, not over the current active preview.
2. Confirm latest current state on desktop, editor build version, existing preview process and local asset mounts.
3. Run standalone native checks and compile Unreal Editor/game. Record any build defects from *actual* UE and fix.
4. Run Release A hands-on/automated gameplay interaction suite with logs, fixing until pass.
5. If stable, build Release B enclosure/needs-aware state loop with a tiny playfield; no full voxel implementation yet.
6. Begin Release C network testing only after core interactions behave reliably.
7. Update evidence-based project docs; merge into main only when verified and reviewed.

## The explicit blockers

No desktop access or installed UE toolchain in the GitHub authoring session. Release A gameplay success, nav, replication, backups and full animal care behavior cannot be verified through GitHub-only tools.

## Creative boundary

Twenty concept creatures, diverse biomes, tools and character art are **pre-production illustrations**. The next practical milestone is one deer and one small enclosure, not 20 new rigs, multiplayer village societies or huge dynamic terrain.

[Release gates](../developers/NEXT-BUILD-RELEASE-GATES.md) · [Current state](CURRENT-STATE.md) · [Decisions](DECISIONS.md)
