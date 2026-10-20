# Wildbound — Idea board and staging queue

Updated: October 20, 2026  
Status: **Planning workspace** — not proof of implemented gameplay.

[Repository](../../README.md) · [Vision](../vision.md) · [Current state](CURRENT-STATE.md) · [Decisions](DECISIONS.md) · [Roadmap](../../ROADMAP.md)

## Purpose

Use this board to capture ideas from the Wildbound brainstorming/staging chat, evaluate them in manageable slices, and prepare approved work for GitHub. Conversation alone does not update GitHub. Changes must be expressly staged as commits or pull requests.

### Workflow

`Inbox` → `Exploring` → `Proposed` → `Approved` → `GitHub staged` → `Implemented` → `Verified`

- **Inbox**: A new thought, not yet specified or committed to.
- **Exploring**: Tradeoffs, lore, scope, technical feasibility, or gameplay loop under discussion.
- **Proposed**: A concrete candidate awaiting the owner's decision.
- **Approved**: The owner explicitly accepted the direction. This is **not** implementation.
- **GitHub staged**: Draft design/code exists in a branch, commit or pull request. This is **not** implementation evidence.
- **Implemented**: A real working change has been integrated, with limitations documented.
- **Verified**: Relevant compile/editor/gameplay/server tests have actually passed and evidence is recorded.
- **Parked**: Saved for later or deliberately set aside; can be re-opened.

Only an explicit owner decision should promote `Proposed` to `Approved`. The main decision record contains durable approvals; do not elevate assistant suggestions to decisions.

## Confirmed creative directions (not implementation claims)

| Theme | Direction from prior project decisions | Record |
| :-- | :-- | :-- |
| Homesteading | Expressive voxel construction for cottages, barns, farms, and settlements | [Building](../systems/building.md) |
| Animals | Wildlife behavior, earned trust, wild-caught animals, breeding, genetics, and ongoing husbandry | [Animals](../systems/animals.md) |
| Cooperative life | Shared stewardship on persistent dedicated-server worlds | [Multiplayer](../systems/multiplayer.md) |
| Greenveil Basin | Warm, pastoral cottagecore wilderness with believable risks | [Biomes](../world/biomes.md) |
| Drowned March | Ancient, mournful, spooky wetland shaped by mystery rather than constant combat | [Biomes](../world/biomes.md) |
| World identity | Rustic realism with subtle, original environmental magic | [Vision](../vision.md) |

These are design anchors, **not** claims that those systems exist.

## Unordered brainstorming rule

Ideas can be suggested in **any order**, regardless of current development status, roadmap milestone, or technical readiness. Capture ideas when they arrive without reorganizing them into milestone order, rejecting them for being early, or implying a commitment to build them next. Record dependencies, feasibility, and possible scope only as optional context. Keep the original suggestion recognizable. This is a creative idea backlog, **not** the development schedule.

## New idea inbox

| ID | Idea | Stage | Suggested next action |
| :-- | :-- | :-- | :-- |
| — | No additional ideas captured yet | Inbox | Capture the next chat proposal here before assigning scope |

For each new idea, record: the player experience, what makes it distinctively Wildbound, relevant systems/biomes, minimal testable version, tradeoffs, and owner decision.

## Development staging queue

This is a **proposed work sequence**, not a list of completed tasks or new approvals.

| Candidate | Stage | Gate to progress |
| :-- | :-- | :-- |
| Validate UE5 version + C++ toolchain | Planned | Record exact versions; compile editor target |
| Small Greenveil level + placeholder animal | Planned | Walk in editor; server-owned needs visible on actor |
| Voxel building/enclosure proof | Planned | Check collision, animal navigation, save/load |
| Two-player authoritative care and persistence | Planned | Replication, restart, backup/restore test |
| Breeding/genetics | Later | Only after reliable animals and persistence |

See [current state](CURRENT-STATE.md) and [first playable validation](../developers/FIRST-PLAYABLE.md) for evidence requirements. As of October 20, 2026, the existing UE5 scaffold and animal-needs component are **uncompiled and unverified**. There is no playable build, tested dedicated server, or selected voxel plugin.

## Rules for staging from chat

1. Capture speculative ideas here as **Inbox**, **Exploring**, or **Proposed**, not as decisions.
2. When the owner approves a durable design choice, update [DECISIONS.md](DECISIONS.md), and the relevant design document.
3. Stage changes on an isolated branch and link commits/PRs here or in the handoff. Do not call branch presence completion.
4. Update [CURRENT-STATE.md](CURRENT-STATE.md) only with concrete implementation and verification facts; update [SESSION-HANDOFF.md](SESSION-HANDOFF.md) for actionable next work.
5. Keep Wildbound separate from ShroudForge. Do not commit private keys, saves, engine binaries, platform SDKs, or unlicensed assets. Ask before paid dependencies.

## Session starter

**Capture a new idea:** give it a short name and desired player experience; then discuss the smallest prototype, technical risks, gameplay impact, and decision status. When ready, stage a scoped GitHub change and provide a verifiable link.
