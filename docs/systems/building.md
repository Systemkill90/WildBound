# Voxel construction and homesteads

[Vision](../vision.md) · [Cooperative worlds](multiplayer.md)

**Status (last recorded October 20, 2026): prototype code compiled, interactions still unverified.** A 1 m snap-grid block actor and server-side placement/removal request handlers compile in UE 5.8.4; grid policy passed independent C++ tests. The G/X controls, ground alignment, multiplayer effects and actual collisions **have not been playtested** in the current package. This is not a voxel engine, terrain editing or persistent construction. No paid voxel plugin has been selected.

The goal is expressive construction using volumetric building units: shape walls and foundations, combine rustic materials, and build cottages, barns, fences, bridges, and villages. Terrain excavation is a separate scope decision; voxel construction does not yet promise a fully destructible world.

## Prototype questions

- Can players place and remove bounded building volumes with predictable snapping and collision?
- Can two clients see identical changes after a dedicated-server restart?
- Can animal enclosures, doors, navigation, and shelter checks work around player construction?
- Can chunk storage, mesh updates, materials, and replication meet measured budgets?

Compare a small custom prototype against appropriately licensed plugins. Record engine compatibility, server support, rights, and costs before choosing.

Timber, stone, thatch, plaster, and weathering should feel tactile. Barn layouts support movement and care; fencing matters to containment. Gardens, water access, storage, and paths connect construction to farming. Structure damage, support rules, repair, and ownership remain open questions. No actual voxel-building or farming mechanics exist yet; the temporary cube placement harness is for validation only.
