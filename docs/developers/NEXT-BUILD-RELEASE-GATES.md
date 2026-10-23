# Wildbound — next playable update release gates

**Prepared:** 2026-10-22. **Status:** staging-only execution plan. These tasks are NOT implemented or tested merely because they appear here.

The current main handoff records an Unreal Engine 5.8.4 build, a windowed Electric Dreams close-range preview, a temporary Quinn player, a skeletal deer using Character Movement, and one automated movement/camera test. No hands-on care/build playtest or verified two-client gameplay replication has yet been recorded.

## Release A — reliability and the first care/build loop

**Preflight:** preserve the last verified game project at `<local-project-root>\Project` and source clone at `<local-project-root>\Source`; record HEAD, launcher command, UE version and runtime asset mounts. Never overwrite a working packaged build without a recoverable backup.

| Gate | Procedure | Evidence to collect |
| :-- | :-- | :-- |
| Spawn/control | Launch the *same* sample-backed build to be tested, move with keyboard, rotate/look, jump and refocus the game window | startup log, input and camera notes |
| Animal approach | Walk to deer and observe collision, animation transitions, grounding and behavior around creek, rocks and logs | screenshot, movement/collision notes |
| Feeding | Aim at animal and press E. Confirm server applies only when in range and care rules allow; supply decreases only on success | before/after hunger, trust, supply, reject logs |
| Watering | Press R on eligible animal; verify thirst, trust and water portions | before/after values |
| Reassurance | Press F, observe stress decrease and trust increase; verify no effect under the low-stress threshold | before/after values |
| Construction | Press G to add cube; verify orientation/grid/surface and collision; X removes *only* eligible aimed block | actor counts, target, collision result |
| Denials | Out of range, blocked visibility, invalid data, rapid calls and exhausted supply | logs showing expected rejections |
| Stability | Repeat with log capture; confirm no unexpected UE exit or asset mount failure | result log and build SHA |

**Ship gate:** mark A complete only if all user-facing tests pass or explicit known issues are accepted by owner. Any code fixes must be built and retested in UE.

## Release B — animal navigation and a first pen

**First proving ground:** one feeder, one water trough, 6–10 temporary fence modules and a gate in a small Greenveil test space. Do not yet commit to a voxel plugin.

1. Validate that fence collision blocks the deer and opening the gate changes traversability.
2. Replace short random movement with a small, budgeted behavior mode: wander, approach feed, approach water, rest, retreat.
3. Track why an animal changed state in debug HUD/logs.
4. Ensure each server action is authoritative and transitions are visible to another client.
5. Benchmark collision/navigation with 1, 10, then 25 prototype animals before promising large herds.

**Ship gate:** enclosure behavior repeatedly works after placing/removing barriers. No cosmetic-only test passes.

## Release C — network and durability

1. Record build identity for host and two clients.
2. Validate actual care, inventory costs, block placement/removal and animal state convergence—not simply joining a listen server.
3. Add server ownership/resource transaction guarantees and malicious-request denial tests before public hosting.
4. Build a true headless dedicated-server target (separate from listen-server PIE).
5. Integrate persistent animal IDs and structures with versioned disk saves, backup rotation, corrupt-primary recovery and a humane offline-care policy.
6. Verify reconnect, restart and backup restoration.

**Ship gate:** both connected clients observe identical results and recoverable world state under a real dedicated server. Do not advertise persistent server functionality before this.

## Rollback and deployment rules

- Keep the previous known-good packaged build; stage the next build to a separate directory.
- Preserve local rights-restricted Fab/Electric Dreams assets without moving them into public Git.
- Never overwrite a newer world save as part of rollback.
- Archive build log, sanitized runtime log, code commit, UE version and checks run.
- A red GitHub Action is a blocker until investigated; a green native C++ test is not proof of Unreal gameplay.
- Update CURRENT-STATE, SESSION-HANDOFF and ROADMAP only with demonstrated evidence.

[Current state](../project/CURRENT-STATE.md) · [Prototype playtest](PROTOTYPE-PLAYTEST.md) · [Roadmap](../../ROADMAP.md)
