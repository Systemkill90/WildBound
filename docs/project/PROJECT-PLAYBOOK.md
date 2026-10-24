# Wildbound project playbook

[← Development desk](README.md) · [Current state](CURRENT-STATE.md) · [Decision log](DECISIONS.md) · [Roadmap](../../ROADMAP.md)

This playbook keeps project work organized around the owner's direction, the actual state of the build, and reviewable evidence. It supplements the existing project instructions and decision log; it does not supersede either.

## First major milestone: Early Access

**Early Access is the first major milestone for Wildbound.** Intermediate engineering milestones are gates toward a reviewable Early Access candidate. They are not separate launch commitments.

The detailed Early Access scope and acceptance thresholds are still owner decisions. No release date, price, platform promise, player-count promise, content count, or feature commitment is set by this playbook. Do not infer one from a design pillar, roadmap idea, or prototype experiment.

### Proposed readiness gates

Use these gates to organize the audit and planning discussion. They are a working framework, not an approved product specification. Convert them into measurable acceptance criteria with the owner before calling a candidate ready.

1. **Product scope:** define the intended Early Access experience, supported platforms, included systems, deferred systems, and known limitations. Keep public copy aligned with approved scope.
2. **Core playable loop:** verify the owner-approved core loop from a clean launch through its intended player outcome in a repeatable build. Record observable acceptance steps for movement, world interaction, animal care, construction, and any other system advertised as included.
3. **Stability and performance:** choose target hardware and budgets; test representative play sessions, loading, save/restart where applicable, and recovery from expected failures. Report measurements, not caps or estimates.
4. **Co-op and authority:** if cooperative play is in the Early Access promise, verify the included player count, server authority, gameplay state replication, reconnect behavior, and failure handling with real gameplay actions. Connection acceptance alone is insufficient.
5. **Persistence:** decide whether persistence and dedicated servers are included, deferred, or out of scope. If included, demonstrate versioned saves, restart, backup, and recovery; if deferred, communicate that limitation clearly.
6. **Content and art readiness:** audit the representative slice for readability, unfinished or placeholder assets, collisions, progression blockers, and dependencies on local-only content. Confirm provenance and redistribution rights for every shipped asset.
7. **Player-facing readiness:** review onboarding, controls, UI, accessibility basics, settings, support expectations, and known-issues communication against the approved audience and platforms.
8. **Build and release process:** produce a reproducible release candidate from a clean checkout, document the toolchain and build steps, verify packaging and distribution requirements, and keep secrets and development-only assets out of the release.
9. **Quality and approval:** maintain a prioritized blocker list, run the agreed regression and acceptance checks, record results against a specific build, and obtain the owner's explicit go/no-go decision.

A readiness review should end with a short evidence-linked report: each gate marked **pass**, **fail**, **deferred by owner**, or **not yet checked**. A missing result is not a pass.

## Project-wide audit workflow

Audit in bounded passes so findings can be reviewed and scheduled instead of triggering a broad rewrite.

| Pass | Review | Record |
| :-- | :-- | :-- |
| Product and design | Pillars, approved decisions, proposed ideas, player-facing claims, and gaps between them | Approved direction, open owner decisions, and inaccurate claims to correct |
| Playable build | Current build, launch path, controls, interactions, representative levels, blockers, and performance evidence | Exact build/revision, reproducible steps, observations, and open tests |
| Engineering | Runtime boundaries, server authority, replication, persistence, build and test reliability | Verified behavior, failure modes, and tests needed |
| World and content | Level scope, navigation, readability, assets, animation, dependencies, and placeholder status | Content inventory, risks, asset origin, and local-only boundaries |
| Rights and repository | Licenses, generated files, secrets, Git LFS, clean checkout, branches, issues, and draft PRs | Corrective actions with evidence; never publish restricted material |
| Documentation and release | Navigation, stale claims, current-state links, onboarding, release build, support, and known issues | One authoritative location per evolving fact and release readiness gaps |

For every finding, record its evidence source, impact, confidence, next action, and whether an owner decision is required. Separate direct observation from inference. Track work in issues and link the issue from the relevant roadmap or audit record. Do not label the whole project audited when only documentation or source code was sampled.

## Source-of-truth map

- [Current state](CURRENT-STATE.md) answers what is implemented and verified.
- [Session handoff](SESSION-HANDOFF.md) answers what was last observed and what to do next.
- [Decision log](DECISIONS.md) answers what the owner approved.
- [Roadmap](../../ROADMAP.md) answers milestone order and completion evidence.
- System, world, and art documents describe design intent and link to current implementation status.
- The dated [documentation audit](DOCUMENTATION-AUDIT-2026-10-21.md) records its own scope and limits; a documentation audit is not a full product or release audit.
- Draft pull requests remain proposals until reviewed and accepted by the owner.

If two records disagree, preserve the stronger direct evidence, identify the conflict, and correct the stale record with a date and source. Do not silently promote a draft idea or treat an old handoff as current live state.

## Recurring review

At each meaningful milestone review:

1. Re-check the current build and owner priorities.
2. Close or revise stale issues using new evidence.
3. Update the current-state record, roadmap, and handoff only where facts changed.
4. Review public README claims and the documentation map for drift.
5. Re-check licenses and local-only asset boundaries before publishing.
6. List what remains unverified and name the next concrete test.

The owner approves canon, Early Access scope and commitments, and any change to project constraints.
