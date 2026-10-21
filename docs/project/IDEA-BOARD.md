# Wildbound — Idea board and staging queue

Updated: October 21, 2026  
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
| IB-001 | Mythical creature silhouettes, modified animals/dinosaurs, giant fungi, witchy forest/swamp pockets, rare speaking trees | Exploring | Develop creature and enchanted-biome studies independently of milestones |
| IB-002 | **Distinct fantasy villages**, including elven, werewolf, dwarven, mixed-species communities and original folk (Veshari, Nimrui, Kethri) | Exploring — [draft staged](../world/fantasy-peoples-and-villages.md) | Compare settlement identity, daily life and possible NPC interactions; names and mechanics are not approved canon |
| IB-003 | Water-surface and underwater villages populated by fish-folk, sirens, merfolk and mixed communities | Exploring | Develop culturally distinct settlements, ecology, water travel and animal husbandry; not a milestone commitment |
| IB-004 | Aquatic NPCs sing slow, ethereal, eerie and enchanting shanties, work songs and ceremonial songs | Exploring — [songbook staged](../world/aquatic-voices-and-shanties.md) | Owner-selected Luresinger direction: unusually deep **feminine** harmonies; **male** voices angelic and frightening. Review composition, performances and accessibility; no in-game audio implemented |
| IB-005 | **Ellowyn and the Sylweave:** Ellowyn's roots create and connect all life (including harmful beings). Mining machines use a chemical that poisons her and the siphoners; their harvested batches become plagued, so they **siphon deeper and longer looking for a clean batch**, worsening the plague and slowly killing Ellowyn. The faction's attempted immortality may transform them into monsters. | Owner-selected lore premises — [latest Sylweave draft](../world/ellowyn-and-the-sylweave.md) | **Sylweave and the pure-batch extraction vicious cycle are owner-confirmed.** Chemical, product and faction names, particular mutations, cure, player quests, and endings remain subject to creative review; [older Ellowyn draft](../world/ellowyn-and-the-vaelith.md) and [original pitch](../world/main-story-the-last-turning.md) retained |

For each new idea, record: the player experience, what makes it distinctively Wildbound, relevant systems/biomes, minimal testable version, tradeoffs, and owner decision.

## Expanded concept follow-up (separate draft)

[Planning checkpoint PR #6](https://github.com/Systemkill90/WildBound/pull/6) stages original SVG art, a creature candidate roster, witchy forest/marsh and sentient-tree design, extended original-people studies, an independent technical audit and the next-stage runbook. These remain proposals and can be reviewed without importing them into near-term milestones.

## Development staging queue

This is a **proposed work sequence**, not a list of completed tasks or new approvals.

| Candidate | Stage | Gate to progress |
| :-- | :-- | :-- |
| Validate UE5 version + C++ toolchain | Planned | Record exact versions; compile editor target |
| Small Greenveil level + placeholder animal | Planned | Walk in editor; server-owned needs visible on actor |
| Voxel building/enclosure proof | Planned | Check collision, animal navigation, save/load |
| Two-player authoritative care and persistence | Planned | Replication, restart, backup/restore test |
| Breeding/genetics | Later | Only after reliable animals and persistence |

See [current state](CURRENT-STATE.md) and [first playable validation](../developers/FIRST-PLAYABLE.md) for evidence requirements. Since the original idea-board capture, **main has advanced**: the repository now records a successful UE 5.8.4 editor/game build, a packaged and locally launched Greenveil test environment, and two simulated clients joining a listen server. **Actual care/build gameplay replication, dedicated-server packaging and world persistence are not yet verified.** The planning queue above is a historical idea-stage outline; follow [current state](CURRENT-STATE.md) for live evidence.

## Rules for staging from chat

1. Capture speculative ideas here as **Inbox**, **Exploring**, or **Proposed**, not as decisions.
2. When the owner approves a durable design choice, update [DECISIONS.md](DECISIONS.md), and the relevant design document.
3. Stage changes on an isolated branch and link commits/PRs here or in the handoff. Do not call branch presence completion.
4. Update [CURRENT-STATE.md](CURRENT-STATE.md) only with concrete implementation and verification facts; update [SESSION-HANDOFF.md](SESSION-HANDOFF.md) for actionable next work.
5. Do not commit private keys, saves, engine binaries, platform SDKs, or unlicensed assets. Ask before paid dependencies.

## Session starter

**Capture a new idea:** give it a short name and desired player experience; then discuss the smallest prototype, technical risks, gameplay impact, and decision status. When ready, stage a scoped GitHub change and provide a verifiable link.
