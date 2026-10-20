# First playable: Greenveil animal-care proof

**Status:** Engineering plan, not implemented or validated.
**Scope:** The smallest repeatable Unreal Engine test that proves animal care can work alongside co-op and construction.

## Gate 0: Compile the existing project

1. Record the exact Unreal Engine 5 version and Windows C++ compiler toolchain.
2. Generate project files from `Wildbound.uproject`.
3. Build `WildboundEditor` and log the command, warnings and errors.
4. Build the game target. Server-target compilation requires a suitable Unreal source build.
5. Correct errors before adding major systems. Unreal has **not** been available to this GitHub authoring session.

**Done when:** an actual editor compile succeeds and the project opens without critical errors.

## Gate 1: Tiny Greenveil playground

Create a small test map with a meadow, one water source, basic collision and placeholder lighting. Use locally created or properly licensed assets. Add a controllable third-person pawn and one stationary placeholder animal actor.

**Done when:** a player can enter the map, move around the animal and return to the saved level.

## Gate 2: Observable animal needs

Attach `UWildboundAnimalNeedsComponent` to a replicated animal actor. Display hunger, thirst and condition with temporary debugging UI. Keep simulation authority on the server. Use valid resource-consuming, ownership-aware gameplay interactions to feed and water the animal; do not expose unchecked client RPCs.

**Done when:** values decrease only on the authority, clients receive updates, and validated feeding restores values.

## Gate 3: Animal movement and enclosure proof

Give one herbivore grazing, drinking, resting, mild stress, and a basic trust response. Build a tiny enclosure using temporary walls and a gate. Test navigation and escape behavior as barriers change.

**Done when:** the animal can reliably navigate to food and water, respond to a gate and remain in a properly closed enclosure.

## Gate 4: Two-player dedicated-server proof

Build/run a real headless server, connect two clients, and verify authoritative animal needs and interactions. Test simultaneous feeding requests and unauthorized actions. Restart and verify saved world and animal state **after a versioned persistence format exists**.

**Done when:** two players see identical results, no unauthorized action succeeds, and state survives restart and backup restoration.

## Checks and pitfalls

- The current needs component is code only; it has never been compiled or bound to an animal.
- An owning actor must replicate for replicated component state to reach clients.
- The current needs tick raises a Blueprint event every server frame; UI and network updates should be throttled before production.
- Do not confuse replicated state with persistent saved state.
- Do not simulate offline starvation before deciding on fair offline-care rules.
- Track stable animal identities, server ownership, versioned saves and population limits before introducing breeding.
- Evaluate voxel implementations against dedicated-server needs, animal navigation and license costs before committing.

## Test record template

| Field | Result |
| :-- | :-- |
| UE version | Not selected |
| C++ compiler/toolchain | Not selected |
| Editor compile | Not run |
| Game compile | Not run |
| Server compile | Not run |
| Map launch | Not run |
| Two-client replication | Not run |
| Save/restore | Not run |

Update [Current state](../project/CURRENT-STATE.md), [Handoff](../project/SESSION-HANDOFF.md), and [Roadmap](../../ROADMAP.md) only after evidence exists.
