# Cooperative dedicated worlds

[Vision](../vision.md) · [Developer setup](../developers/README.md)

**Status (last recorded October 20, 2026): C++ multiplayer code compiled; connection-only listen-server smoke test passed.** The Unreal game and editor built with replicated actor/component declarations and server-side care/block handlers. A **listen server accepted two simulated client connections**, but no care/build state, security or replication assertions passed yet. There is no tested headless dedicated server or persistent in-game saving. The portable versioned snapshot codec passed independent tests but has not been wired to Unreal disk storage.

A dedicated server is intended to own world state, construction, animal needs, breeding outcomes, inventories, permissions, and saves. Clients request actions; the server validates them. Cooperative groups share homesteads with explicit building, storage, care, and administration permissions.

The first network milestone targets two clients on a small test map. Player capacity, crossplay, matchmaking, mods, and hosting providers remain undecided.

## Persistence and care

Plan versioned saves, stable animal identities, construction chunks, ownership records, and recoverable snapshots. Test restoration and interrupted writes. Decide how time passes offline and how animal care accommodates ordinary player absence.

## Validation gates

1. Build and launch a headless dedicated server with an appropriate UE source build.
2. Connect two clients and verify server-validated interactions.
3. Replicate construction and a small animal simulation.
4. Save, restart, reconnect, and verify consistent world state.
5. Test permissions, invalid requests, population limits, backup restoration, and performance.

The recorded listen-server connection result does not establish a usable dedicated-server deployment, secure public hosting or verified network port configuration. Do not advertise these as working without a real headless-server test.
