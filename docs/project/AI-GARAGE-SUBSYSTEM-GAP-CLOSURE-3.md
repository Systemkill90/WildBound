# AI Garage Subsystem Gap Closure — Conditional Plan (PR #23)

**Status:** PREEMPTIVE PLANNING ONLY. Do not implement before PR #21 stabilization and the evidence-based subsystem audit. Do not assume a subsystem is missing merely because it is listed here.

## Dependencies and sequence

1. **PR #21:** stabilize restart/resume, task state, quality preflight, local worker failures, source-of-truth reconciliation, and eight desktop acceptance cases.
2. **PR #22:** full target architecture for milestone-level production autonomy.
3. **This PR:** reconcile actual Garage code against the architecture, identify confirmed gaps and implement only necessary closure tasks, in bounded follow-up PRs. The planning PR may remain open while implementation tasks are scoped.

## Mandatory inventory (read-only first)

For each subsystem record: purpose, source paths, current interface, dependencies, owner, runtime evidence, tests, status (verified / implemented-unverified / partial / absent / duplicate), risk, cost, and recommended action. Validate against current desktop state and actual GitHub branches, not only documentation.

| Subsystem | Audit questions / required proof |
| --- | --- |
| Capability Discovery & Tool Registry | Does every local model/tool declare verified task fit, I/O, hardware, version and known limitations? Can it prevent TripoSR character routing? |
| Environment & Dependency Manager | Are Unreal, Blender, Python, model weights, drivers and versions checked before execution? Are failures actionable and upgrades gated? |
| Artifact Registry | Are source assets, prompts, approved references, model/tool versions, hashes, derivatives, quality status, approvals and Unreal destination linked? |
| Integration & Compatibility Manager | Does it validate Blender→FBX→Unreal scale, materials, skeleton, animations, collision, gameplay and version compatibility? |
| Testing & Simulation Harness | Can it execute repeatable headless/local tests, actual Unreal smoke tests, negative cases and crash/recovery drills? |
| Observability & Diagnostics | Can owner see job timeline, worker health, stage, evidence, blocked reason, last successful checkpoint and exact next action? |
| Knowledge & Decision Memory | Are failed approaches, root causes, rejected artifacts and approved decisions reusable, with confidence and expiry/revalidation? |
| Resource & Cost Governor | Are CPU/GPU/RAM/VRAM/disk contention, local inference costs, retries and optional cloud spending bounded and reported? |
| Security & Permissions | Are destructive operations, installs, external network calls, paid APIs, protected merges, canon edits and releases gated and audited? |
| Asset Provenance & Licensing | Can source/reference licenses and permitted use/distribution be traced through generated artifacts and Unreal packaging? |

Also check whether Project Manager, roadmap, backlog, scheduling, Quality Supervisor, Creative Library, Idea Board sync, worker orchestration, durable resume and owner approvals already supply these functions. **Prefer consolidating existing services to adding agents.**

## Proposed closure priority (subject to evidence)

- **P0:** missing safety, durable state, truthful acceptance, capability fit, and artifact identity/provenance needed for correct execution.
- **P1:** Unreal integration validation, testing harness, observability, resource scheduling, security and licensing gaps.
- **P2:** long-term decision memory, deeper automated diagnostics, improved scheduling and advanced production capabilities.

## Required implementation method

- First deliver a gap matrix with links to source and reproducible evidence. Separate confirmed defects from recommendations.
- For each confirmed gap, specify smallest viable change, dependencies, owner approval needed, rollback, and measurable acceptance criteria.
- Implement in focused follow-up PRs only after PR #21 acceptance and explicit authorization; avoid bundling speculative subsystem rewrites.
- Keep local-first model execution and deterministic scripts. Never invent credit-saving percentages.
- Preserve WildBound canon, current approved references, protected GitHub branches and original user data.

## Cross-system acceptance scenarios

1. A requested character is blocked before routing to a static-prop-only model.
2. A missing approved dwarf/merfolk reference generates an owner-visible request rather than invented canon.
3. A produced artifact can be traced to all inputs, model versions, reviews, and Unreal destination.
4. A successful FBX export with unusable anatomy is rejected; a technically valid but Unreal-incompatible asset is blocked at integration.
5. A local model failure and application restart do not duplicate a job or lose the last verified checkpoint.
6. A known failed technique is not repeated without new evidence or an approved reason.
7. Resource contention, runaway retries, unapproved paid service and destructive actions are prevented.
8. Owner sees accurate status, evidence, blockers and next actions in Garage.

## Work-session handoff

> After PR #21 stabilization passes, read PR #22 and PR #23. Audit the actual desktop Garage implementation against the subsystem inventory in PR #23. Produce an evidence-backed gap matrix; do not assume missing components. Prioritize confirmed critical gaps, consolidate existing functionality, use local tools, and open small implementation PRs with tests and rollback. Keep approval gates; do not implement the entire roadmap at once.

**No implementation, tests, desktop verification or subsystem absence is claimed by this document.**

## Release boundary: evidence-based gaps only

This is an **audit and improvement backlog**, not ten mandatory new subsystems before Garage 1.0. Compare each candidate to actual existing code, and classify as verified, unverified, partial, missing or duplicate. Only confirmed gaps that block the Garage 1.0 acceptance contract below are release-critical; all other findings become 1.1/2.0 backlog items. Prefer minimal repairs and reuse of existing services. Do not open large implementation PRs or merge without approval.

### Shared Garage 1.0 acceptance contract

**Definition of done:** a dependable, local-first Garage the owner can start daily, give a bounded milestone, leave to work, and return to trustworthy status and results, with human intervention only at explicit approval gates. **Do not claim a completion percentage without an evidence-backed feature/test inventory.** Freeze the 1.0 release scope to the following six outcomes:

1. **Startup and recovery:** cold start, reconnect and restart after interrupted sessions without losing verified work, duplicating jobs or falsely reporting success.
2. **Milestone execution:** plan and execute a bounded milestone using available, capability-matched local workers and deterministic scripts, with visible progress and blockers.
3. **Quality and correction:** preflight rejects unsuitable tools; independent quality checks reject bad outputs; bounded retries or explicit escalation handle failures.
4. **Real Unreal integration:** produce at least one approved, usable asset, import/integrate it into the actual WildBound Unreal project, and verify it in-engine rather than relying on export-only success.
5. **Traceability and approvals:** retain task/artifact provenance, approved Creative Library/canon references, owner decisions and required approval gates; visibly request missing references.
6. **Repeatable end-to-end tests:** run reproducible desktop acceptance tests for the above, including a failure/restart scenario; record pass/fail, logs, evidence, environment and remaining limitations. No hidden manual fixes beyond explicit owner approvals.

**Release rule:** PR #21 establishes a measured baseline and fixes 1.0 blockers. PR #22 is the future autonomy roadmap; PR #25 inventories and scopes only confirmed gaps. Unneeded advanced subsystems are **not** release blockers. Do not merge, deploy, install paid services or change canon without approval.
