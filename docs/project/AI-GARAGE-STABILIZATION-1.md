# AI Garage Stabilization 1.0 — Work-session handoff

Status: **PLANNING ONLY — no production implementation authorized by this PR**  
Owner decision: prioritize stabilization before new capabilities.  
Branch: `planning/garage-stabilization-1`

## Objective

Audit and stabilize the existing AI Garage so it can recover after interrupted Work sessions, resume without duplicate work, use local AI and deterministic scripts wherever capable, reject unusable outputs, and deliver traceable evidence. Preserve working architecture, approved WildBound canon, and existing approval gates. Do not rewrite functioning subsystems.

## Known evidence and limits

- PR #20 (`feature/garage-triposr-boundary`) reports 40/40 Garage/Dashboard tests and nine lifecycle stages, but its character prototype was blob-like, ~0.97 m, lacked armature/animations, used no Library references, and was not approved/imported.
- PR #20 documents a transient local Qwen `token repeat limit reached` failure and an earlier exporter/Blender mismatch.
- PR #20 is stacked on `feature/creative-library-pilot`; review integration and merge order before claiming functionality on `main`.
- The owner reports Garage did not reconnect/resume after Work credits ran out. Treat as a reproduction target, not a diagnosed root cause.
- Static/unit success is not proof of end-to-end production or Unreal integration.

## Execution order (next Work session)

1. **Read-only discovery first.** Inspect active branches/PRs, Garage/Dashboard source, tests, task persistence, local runtime state, service launch/reconnect behavior, logs, recovery archives, Library and Unreal adapter. Compare claimed and actual capabilities. Preserve user work.
2. **Baseline and safety.** Record versions, commit SHAs, clean/dirty state, backups, active jobs, available local AI models, hardware/resource limits, and existing acceptance gates. Do not overwrite uncommitted changes. Establish reproducible tests and a rollback point.
3. **P0 recovery.** Reproduce interruption/restart, verify durable job IDs and checkpoints, idempotent stage transitions, worker reconnect, lease expiration, recovery of incomplete jobs, safe cancellation, and no duplicate artifact generation/import. Distinguish blocked, failed, awaiting review, and complete.
4. **P0 source of truth.** Reconcile local workspace, GitHub branches/PRs, job state, approvals, references, artifacts, and engine-import evidence. Do not auto-merge stacked PRs or rewrite history.
5. **P0 minimum viable Quality Supervisor.** Implement *preflight + acceptance gates first*, not an always-on new agent. Check tool capability against request, approved reference availability, stage-specific acceptance contracts, and actual output evidence. Block character generation through static-prop-only TripoSR; reject unusable geometry even when export succeeds. Distinguish concept prototype from rigged production character.
6. **P1 operational resilience.** Test local Qwen repetition/timeouts, worker crash, missing dependencies, resource contention, queue concurrency, retries, and backoff. Retry only with meaningful changed parameters; cap retries; route to approved alternatives or human gate. Prefer deterministic validation and local models/scripts over metered Work/Codex; log resource usage without inventing credit savings.
7. **P1 end-to-end tests.** Test reference request/retrieval, generation/preparation, independent quality evaluation, human approval, Unreal handoff, archive/restart, and intentionally defective outputs. Verify actual engine state, not just file creation.
8. **Evidence and handoff.** Record commands/results, unresolved blockers, changed files, tests, screenshots or reports where available, rollback steps, and exact next-resume instruction. Continue only within approved scope.

## Quality Supervisor authority

- Automatically inspect, reject, pause, request existing references, retry within bounded budgets, and reroute to *approved* capable local workers.
- Never change canon, expand milestone/budget, install unapproved software, use paid services, merge protected branches, publish/release, or bypass owner approval.
- Independent evaluator should inspect output evidence; producer cannot solely approve its own work. If uncertain, request more evidence or escalate.
- Trigger at preflight, high-risk checkpoints, anomalies, and acceptance gates; avoid continuous costly polling.

## Acceptance checklist (all currently unverified)

- [ ] Full Garage + worker restart recovers durable task state.
- [ ] Interrupted task resumes from last verified checkpoint without duplicated work.
- [ ] GitHub, workspace, approvals, Library, and Garage state are reconciled and reported.
- [ ] Clearly defective character mesh fails quality acceptance despite valid FBX.
- [ ] Missing approved references produce a visible actionable request.
- [ ] Local AI errors are diagnosed, recovered within limits, or safely blocked.
- [ ] A representative task reaches owner review with independently verified evidence.
- [ ] Owner-approved output is verified in Unreal, or explicitly marked blocked with reason.

## Scope control

**Do now:** audit, repair, tests, minimum viable quality preflight, recovery, visibility, documentation.  
**Defer:** new character-generation models, more specialist agents, broad UI overhaul, new game features, project-level autonomy, unapproved software/paid dependencies.

## Exit criteria

Do not claim stabilization complete until all eight acceptance cases are demonstrated on the actual desktop environment, with reproducible evidence. If blocked by unavailable desktop access or credits, leave an exact durable checkpoint and next-step command; do not mark blocked work done.

## Work resume prompt

> Resume WildBound AI Garage from draft PR **AI Garage Stabilization 1.0** and this document. Inspect the existing implementation and current desktop state before editing. Prioritize restart/recovery, truthful acceptance states, branch integration, and minimum viable independent quality preflight. Prefer local AI and scripts to conserve Work credits. Work through the eight acceptance tests with evidence, preserve all approval gates and existing work, and leave a durable handoff if interrupted. Do not expand feature scope or merge without authorization.
