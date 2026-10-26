# AI Garage Production Autonomy 2.0 — Full Target Architecture

**Status:** Planning only. **Dependency:** PR #21, Garage Stabilization 1.0, must pass its eight desktop acceptance checks before implementation of this roadmap. Do not interpret this document as authorization to install paid services, modify canon, merge protected branches, or release builds.

## North star

AI Garage is a persistent, local-first, milestone-autonomous game production system for WildBound. The human owner defines goals, approves creative direction and consequential decisions, and reviews milestone deliverables. Garage plans, schedules, builds, tests, evaluates, corrects and resumes work within bounded permissions. **Milestone-level autonomy first; project-level autonomy only after demonstrated reliability.**

## Preserve existing work

Audit and extend existing Garage, Dashboard, Unreal adapter, Creative Library, Idea Board, roadmap, project documentation, approval gates, and GitHub workflow. Avoid replacement architectures or duplicating existing capabilities. Explicitly distinguish implemented, partially implemented, planned and verified on the actual desktop.

## Workstreams

### A. Project Manager, roadmap and backlog

- Represent projects, milestones, deliverables, tasks, dependencies, priorities, risk, estimated local compute and external credit cost.
- Convert owner goals and approved canon into milestone plans with explicit acceptance contracts and budgets.
- Select ready tasks based on dependencies, value, capability availability and resource constraints; avoid speculative scope expansion.
- Track blocked tasks, owner decisions, approvals and revised plans with immutable provenance.
- Stop and request owner approval for new milestone scope, canon changes, major direction changes, paid services and releases.

### B. Worker orchestration and resource scheduling

- Capability registry: each worker/model/tool declares supported asset/task types, input/output formats, hardware needs, known limitations and validated quality level.
- Assign specialists to modeling, rigging, animation, environments, programming, UI, audio, testing and Unreal integration only when capabilities are demonstrated.
- Schedule CPU/GPU/RAM/VRAM/disk and model loading; avoid concurrent resource oversubscription; use bounded queues, leases, heartbeat and backpressure.
- Prefer deterministic scripts, cached artifacts and capable local AI; metered Work/Codex handles orchestration or escalation when genuinely needed. Record actual usage, never claim invented credit savings.
- Separate worker failures, missing capability, missing reference, awaiting approval and completed output.

### C. Independent Quality Supervisor

- Required preflight before execution: tool fit, available references, realistic method, acceptance contract, dependencies, safety and cost.
- Event-driven inspections at high-risk checkpoints, anomalies and acceptance; inspect rendered visual evidence, actual engine output and technical reports.
- Compare to approved WildBound references and canon; evaluate semantic fitness, visual fidelity, scale, topology, rigging, animations, performance and gameplay behavior as appropriate to the stage.
- Reject bad output despite successful tool invocation or export; use independent assessment from producer where feasible.
- Diagnose root cause, change strategy rather than blindly retry, allow bounded repairs and approved worker switching, and preserve previous good checkpoints.
- Escalate uncertainty, missing capability, missing references and major decisions; never self-approve protected owner gates.
- Start with PR #21 minimum viable preflight; expand only after proven.

### D. Creative Library and Idea Board

- A reliable, user-visible **Sync Idea Board** button in Garage; show last sync, pending changes, conflict detection, success/failure, provenance and retry.
- Phone-authored ideas become proposals, not automatically approved canon. Track proposed/approved/rejected/superseded states.
- Maintain searchable references by race/culture, biome, settlement, creature, character, props, environment, style, maps and technical specifications.
- Resolve references before assigning work. For a dwarf character or merfolk stove, provide the correct approved references to workers.
- If no suitable reference exists, create a visible Missing Reference Request for owner action. Never silently invent approved designs.
- Version, attribute, and trace every reference used to generate an asset; keep licenses and redistribution constraints.

### E. Production pipelines and Unreal

- Distinct, capability-validated pipelines for static props, environment assets, creatures, humanoid characters, materials, animation, audio and code.
- **TripoSR is a static-mesh/prototype worker, not a player-character generator.** PR #20 demonstrated successful geometry/export but unacceptable character quality and no armature/animation.
- Character pipeline must support approved multi-view design, coherent silhouette/anatomy, modeling, topology/UVs/materials, scale, rigging, skinning, animation, LOD/collision as applicable, and Unreal import/in-game validation.
- If no approved local model can generate a production-ready character, mark the capability unavailable and request an approved tool/asset strategy. Do not present blobs or placeholders as finished.
- For each artifact, define staged contracts: concept, prototype, production-ready, integrated, tested. A prototype does not automatically satisfy a playable character contract.
- Validate outputs in Blender/Unreal with actual renders, skeleton/animation reports, import and runtime checks; preserve source assets and reproducibility.

### F. Durable autonomy and recovery

- Persist job graph, IDs, event log, worker leases, checkpoints, input/reference versions, artifact hashes, tool versions, approvals and exact next action.
- Survive Work credit exhaustion, chat/session interruption, desktop app restart, model crash, network loss and machine reboot.
- On startup reconcile local jobs, GitHub, references and artifacts; resume idempotently from last verified checkpoint, without duplicate jobs/imports or overriding newer work.
- Support safe pause/resume/cancel, rollback, dead-letter queue and owner-visible blocked reasons. Work credits returning must not require reconstruction of the entire plan.

### G. Owner UI and oversight

- One Garage dashboard for project/milestone status, next tasks, running workers, queue, resource use, quality outcomes, approvals, blockers, missing references and recovery state.
- Prominent Idea Board sync, **Resume Garage**, inspect evidence, approve/reject/request revision, and emergency pause controls.
- Show what is real, planned, in progress, blocked, rejected, approved, imported and verified; never equate tests passing with a finished creative artifact.
- Keep desktop-first workflows and phone-friendly Idea Board review/sync status.

### H. Security, release and provenance

- Human gates for canon, protected branch merges, external publishing, paid services, unapproved installs and destructive operations.
- Least-privilege tools, bounded filesystem access, protected credentials, provenance and licensing, audit trail and reproducible builds.
- Maintain compatibility with current GitHub branch structure and existing PRs; avoid unsafe automatic merges.

## Rollout sequence after PR #21

1. **P2-A — Control plane:** reliable Project Manager, roadmap/backlog/dependency and scheduler integration.
2. **P2-B — Creative data plane:** approved Creative Library retrieval and phone Idea Board sync with conflict handling.
3. **P2-C — Quality autonomy:** independent visual/semantic review and bounded corrective routing.
4. **P2-D — Asset pipelines:** verified environment/prop/character/creature/animation production with Unreal integration.
5. **P2-E — Vertical-slice proof:** demonstrate autonomous completion of one small approved WildBound milestone with real in-game acceptance evidence.
6. **P2-F — Expanded autonomy evaluation:** consider project-level autonomy only with measured reliability and owner approval.

## Acceptance gates

- [ ] Project Manager generates a dependency-correct milestone plan with explicit owner-approved scope.
- [ ] Backlog selects and schedules ready tasks without resource contention or unapproved budget expansion.
- [ ] Idea Board sync is reliable, idempotent, conflict-aware and visible from Garage.
- [ ] Approved references reach the correct workers; missing references create visible requests.
- [ ] Independent Supervisor blocks a bad production plan before execution and rejects bad output afterward.
- [ ] Corrective action uses bounded retries and alternate approved tools with evidence.
- [ ] A character or creature asset is only accepted at the stage actually verified; no static prop worker is misrepresented as a rigged-character pipeline.
- [ ] Real Unreal import and in-game behavior are verified for integrated deliverables.
- [ ] Full restart and Work-credit interruption preserve progress, approvals and next action without duplication.
- [ ] A complete small milestone is autonomously produced and submitted to owner review with cost, evidence and rollback record.

## Instructions for future Work sessions

1. Read PR #21 stabilization plan and results first; do not begin this roadmap while its acceptance tests are unresolved.
2. Audit existing code and docs, map each workstream to existing components, and write a gap analysis. Do not assume everything listed here is missing.
3. Implement one bounded milestone at a time with tests, visual/engine evidence, resource measurements and durable checkpoints.
4. Use local AI/scripts wherever capable; request explicit owner approval before paid dependencies or major changes.
5. Preserve owner approvals, existing game canon, working code and Git history. Do not silently expand scope.
6. At interruption, record exact current state, unfinished tasks, failures, and next resume command in repo-accessible handoff.

## Relationship to current PRs

- **PR #20:** local TripoSR boundary and viewport; do not mistake technical success for character acceptance.
- **PR #21:** stabilize Garage and introduce minimum viable quality preflight.
- **This PR:** full long-term production autonomy specification and phased acceptance criteria; **documentation only**.

## Release boundary: 1.0 versus later autonomy

This document is the **long-term capability roadmap**, not a checklist of mandatory features before the first reliable Garage release. Implement only features proven necessary to pass the Garage 1.0 acceptance contract below; defer richer planning, advanced scheduling, broad worker fleets, deep self-correction and project-level autonomy to 1.1/2.0. Preserve milestone-level autonomy and owner gates. Do not expand the release scope simply because a subsystem is proposed.

### Shared Garage 1.0 acceptance contract

**Definition of done:** a dependable, local-first Garage the owner can start daily, give a bounded milestone, leave to work, and return to trustworthy status and results, with human intervention only at explicit approval gates. **Do not claim a completion percentage without an evidence-backed feature/test inventory.** Freeze the 1.0 release scope to the following six outcomes:

1. **Startup and recovery:** cold start, reconnect and restart after interrupted sessions without losing verified work, duplicating jobs or falsely reporting success.
2. **Milestone execution:** plan and execute a bounded milestone using available, capability-matched local workers and deterministic scripts, with visible progress and blockers.
3. **Quality and correction:** preflight rejects unsuitable tools; independent quality checks reject bad outputs; bounded retries or explicit escalation handle failures.
4. **Real Unreal integration:** produce at least one approved, usable asset, import/integrate it into the actual WildBound Unreal project, and verify it in-engine rather than relying on export-only success.
5. **Traceability and approvals:** retain task/artifact provenance, approved Creative Library/canon references, owner decisions and required approval gates; visibly request missing references.
6. **Repeatable end-to-end tests:** run reproducible desktop acceptance tests for the above, including a failure/restart scenario; record pass/fail, logs, evidence, environment and remaining limitations. No hidden manual fixes beyond explicit owner approvals.

**Release rule:** PR #21 establishes a measured baseline and fixes 1.0 blockers. PR #22 is the future autonomy roadmap; PR #25 inventories and scopes only confirmed gaps. Unneeded advanced subsystems are **not** release blockers. Do not merge, deploy, install paid services or change canon without approval.
