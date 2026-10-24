# Wildbound project instructions

These instructions apply to work in this repository. They add a shared working guide; they do not cancel, replace, or silently reinterpret the owner's existing project instructions, approved decisions, or task-specific directions. Follow the more specific applicable instruction. If two owner instructions genuinely conflict, preserve both in the record and ask which one governs before making the conflicting change.

## Start each task with the current record

Before changing the project, read:

1. [Current state](docs/project/CURRENT-STATE.md) for what is built and what has actually been verified.
2. [Session handoff](docs/project/SESSION-HANDOFF.md) for the latest recorded next step and constraints.
3. [Decision log](docs/project/DECISIONS.md) for owner-approved choices.
4. [Roadmap](ROADMAP.md) for milestone order.
5. [Project playbook](docs/project/PROJECT-PLAYBOOK.md) for audit, documentation, and Early Access planning rules.

Also read the relevant system, world, art, developer, and contribution documents for the task. A date-stamped handoff describes a past observation; it does not prove that an application, build, or service is running now.

## Project direction

- **Early Access is Wildbound's first major milestone.** Treat the detailed scope, launch date, price, platform commitments, and final acceptance thresholds as undecided until the owner approves them. Readiness criteria in the playbook are planning gates, not release promises.
- Keep the first verified playable slice small and build from evidence. The current project is PC-first. Do not expand into a large world, add a major system, or introduce expensive asset work before the current Greenveil fundamentals have been checked, unless the owner explicitly changes priority.
- Keep approved lore and product direction distinct from proposals. Draft branches, concept art, suggested names, and generated assets are not approved canon or implemented gameplay by themselves.
- Maintain Wildbound's stated design pillars while accurately describing their implementation status. Never imply a pillar or feature is complete just because its design or code exists.

## Evidence and status language

Use the project's evidence ladder consistently: **proposed → authored → compiled → launched → gameplay-tested → multiplayer-tested → persistent/recoverable**. A result at one level does not imply the next. When reporting a verification result, identify the build or revision, environment, action, observed outcome, and remaining limits when known. Mark unknowns as unknown; do not fill gaps with assumptions or percentages.

Keep these distinctions explicit:

- Native unit/simulation tests are not Unreal gameplay tests.
- Successful compilation or packaging does not prove an interaction works.
- Two clients connecting does not prove gameplay replication or authority.
- A frame cap is not a measured frame rate.
- A locally running preview is not proof it is running now; check the live process when that claim matters.

## Change and asset handling

- Keep changes focused and reversible. Inspect repository status and existing work before edits; never discard user changes to make a task easier. Back up irreplaceable authored maps before risky editor operations.
- Prefer a small implementation and a clear verification path. For gameplay or content changes, update the current-state and handoff records only after checking what actually changed.
- Preserve free/low-cost and documented-license constraints. Record asset source and rights. Do not commit engine-bundled content, Epic sample files, local Fab packs, generated build output, credentials, saves, or machine-specific data unless the owner has explicitly approved a legally distributable artifact for that purpose.
- Keep local-only assets and generated project content out of Git when their source licenses or machine-specific dependencies require it. A source reference or asset credit does not grant redistribution rights.
- Do not add paid dependencies, plugins, or large asset packs without explicit owner approval.

## Documentation responsibilities

Use [the project documentation map](docs/project/README.md) to find the authoritative file. Keep each fact in its proper place:

- `CURRENT-STATE.md`: dated implementation and verification record.
- `SESSION-HANDOFF.md`: latest observed work, next actionable task, blockers, and limits.
- `DECISIONS.md`: owner-approved decisions and their status.
- `ROADMAP.md`: milestones, sequencing, and evidence-based completion gates.
- `PROJECT-PLAYBOOK.md`: shared project workflow and proposed Early Access readiness framework.
- System/world/art pages: design intent, with implementation status linked to the current-state record.
- Draft PRs: exploratory work until reviewed and explicitly approved.

When a change alters evidence or priority, update the smallest set of affected authoritative records and their navigation links. Do not copy the same evolving status into multiple pages without a reason.

## Audit and handoff

For a project-wide audit, review source, build and test paths, content and asset provenance, documentation, repository hygiene, and release/distribution readiness. Separate verified findings from hypotheses; give each actionable finding an impact, evidence pointer, recommended owner decision or action, and milestone. Track follow-up work in GitHub issues or a linked audit record. Do not claim a complete technical, security, licensing, or platform audit unless that scope was actually inspected and checked.

End substantial tasks with a concise handoff: files or systems changed, evidence collected, checks run, remaining risks or unknowns, and the next best action. The owner retains final approval for canon, milestone scope, release commitments, and changes that broaden project cost or asset/licensing exposure.
