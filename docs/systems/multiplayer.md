# Cooperative dedicated worlds

[Vision](../vision.md) · [Developer setup](../developers/README.md)

**Status: planned architecture.** A server build target is scaffold only. No executable, hosting, replication, or persistence has been validated.

A dedicated server would own world state, construction, animal needs, breeding outcomes, inventories, permissions, and saves. Clients request actions; the server validates them. Cooperative groups share homesteads with explicit building, storage, care, and administration permissions.

The first network milestone targets two clients on a small test map. Player capacity, crossplay, matchmaking, mods, and hosting providers remain undecided.

## Persistence and care

Plan versioned saves, stable animal identities, construction chunks, ownership records, and recoverable snapshots. Test restoration and interrupted writes. Decide how time passes offline and how animal care accommodates ordinary player absence.

## Validation gates

1. Build and launch a headless dedicated server with an appropriate UE source build.
2. Connect two clients and verify server-validated interactions.
3. Replicate construction and a small animal simulation.
4. Save, restart, reconnect, and verify consistent world state.
5. Test permissions, invalid requests, population limits, backup restoration, and performance.

No launch commands or network ports are advertised as working until an engine build and deployment configuration exist.
