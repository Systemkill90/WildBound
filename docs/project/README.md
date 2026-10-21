# Development Desk

[← Field Guide](../README.md) · [Project home](../../README.md) · [Roadmap](../../ROADMAP.md)

**The record of what Wildbound actually is, not just what it could become.**

| Need to know | Open |
| :-- | :-- |
| **What's built and verified?** | [Current State](CURRENT-STATE.md) |
| **What happens next?** | [Session Handoff](SESSION-HANDOFF.md) |
| **What did we decide?** | [Decision Log](DECISIONS.md) |
| **What work comes in what order?** | [Roadmap](../../ROADMAP.md) |
| **Where were the docs corrected?** | [Documentation Audit](DOCUMENTATION-AUDIT-2026-10-21.md) |
| **How do I test the first loop?** | [First Playable](../developers/FIRST-PLAYABLE.md) |

## Status in one paragraph

As of the **October 20, 2026 development record**, Unreal Engine 5.8.4 successfully compiled Wildbound's editor/game targets, and a small Greenveil Windows test package was launched. The first deer is still a static-pose model with basic ground-probed wandering. Standalone C++ rules tests pass, but in-game feeding, building, gameplay-state replication, dedicated server operation and world persistence are **not verified or built as complete features**.

## The next practical milestone

[**Issue #2 — Hands-on Greenveil interaction validation**](https://github.com/Systemkill90/WildBound/issues/2)

Confirm character movement, care inputs and the temporary block test, then record what worked and what failed. Build the next system *after* collecting that evidence.

Other tracked engineering gates: [Co-op replication](https://github.com/Systemkill90/WildBound/issues/3) · [Voxel/enclosure proof](https://github.com/Systemkill90/WildBound/issues/4) · [World persistence](https://github.com/Systemkill90/WildBound/issues/5).

### Planning branches

The [Idea Board draft](https://github.com/Systemkill90/WildBound/pull/1) and [concept-art/audit draft](https://github.com/Systemkill90/WildBound/pull/6) capture experimental ideas. They are intentionally separate from confirmed gameplay and durable decisions.

---

*Record what was proposed, authored, compiled, tested and released as different things.*
