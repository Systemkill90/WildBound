# AI Garage completion → modular world asset production

**Staged directive — October 25, 2026.** Owner-requested production order; **not evidence of implementation, testing or acceptance**. This document supplements, and does not replace, the full master project instructions staged in PR #12, the existing AI Garage implementation, and the Creative Library/AI Librarian work staged in PR #18.

## Mission and order of operations

1. **Finish the complete AI Garage pipeline and integrate every approved agent/subsystem end-to-end.** Recover and inspect existing desktop code, persistent task state, open branches and PRs before changing anything. Do not rebuild working components, duplicate PR #18 or assume that planned features are already implemented.
2. **Prove Garage can operate as a durable local-first autonomous production system.** Only after the Garage completion gate below is passed should the next major production effort begin: a library of reusable modular environment/building kits for Greenveil.
3. **Source or produce free, editable, legally usable 3D assets first.** Search for suitable no-cost, already-made meshes/kits and review their actual terms; favor assets with editable source formats and legal modification rights. Where no suitable source exists, use Garage's Asset Foundry/Blender workflow to author original modular pieces. Paid purchases, new recurring services and license commitments require owner approval. No external downloads or purchases are performed by this planning PR.

The first priority for **game output** remains a dense, cohesive, *playable* Greenveil exploration environment. Garage infrastructure is the immediate prerequisite requested by the owner; do not divert into animal gameplay, broad new biomes or decorative castles before a bounded Greenveil asset pipeline works.

## Garage: required integrated subsystems

- **Command Center:** actual dashboard for task/worker status, approvals, builds, errors, resource use, costs and evidence.
- **Production Director:** dependency-aware roadmap, backlog selection, resource scheduling, milestone autonomy and acceptance gates.
- **Creative Authority + Creative Library + AI Librarian:** versioned approved/proposed references, original text/image/audio provenance, task-specific reference bundles, canon safeguards, owner-controlled approvals, cross-category routing and change impact.
- **Idea Board import/sync:** an operational Update Idea Board UI with a *supported* phone-friendly export/import route; incremental reconciliation, deduplication, original-media preservation, manifest/checksum verification, NAS archival when connected and GitHub searchable records. Do **not** assert automatic access to ChatGPT conversations or inaccessible media. If direct API access is unsupported, ship and test a reliable manual/mobile share-upload workflow and document the limitation.
- **Missing Reference Requests:** durable visible owner queue, affected task/agent, missing evidence, attempted retrieval, approval/defer choices, and authorized resume after resolution; unrelated safe work continues.
- **World Forge:** reproducible terrain/hydrology, Unreal Landscape/PCG/asset placement, authored-layer protection, selective regeneration and reversible integration.
- **Character Studio:** distinct reference-driven profiles for all 13 peoples, trait-level approvals, mesh/rig/animation/audio requirements, and no unapproved canon changes.
- **Asset Foundry + Audio Studio:** source/licensing manifests, editable assets, variant generation, optimization, UE-compatible import and evidence.
- **Engineering Lab + QA/Playtest Lab:** isolated execution, build/test runners, artifact capture, real Unreal and packaged verification when desktop is connected.
- **Model Lab + Resource Scheduler:** discover actual Ollama/local-model/executor capabilities, benchmark, route tasks locally where appropriate to conserve Codex Work credits, avoid resource contention and require explicit cloud escalation policy.
- **Knowledge Engine + Visual Review Center:** searchable decisions/history, original media references, comparison/approval workflow and reproducible inputs.
- **Recovery Vault + Release Manager:** persistent tasks, checkpoint/restart reconciliation, versioned verified backups and restores, rollback, release gates and owner-controlled promotion.
- **Autonomous Worker Framework:** bounded agent tool permissions, evidence ledger, retries/timeouts, isolated worktrees, acceptance checks and milestone-level autonomy. Project-level autonomy remains a future capability until explicitly approved.

**Completion gate — Garage:** Every subsystem is wired into one real task lifecycle: intake → canon/reference retrieval → planning → authorized agent assignment → local execution → artifact/build → QA/evidence → approval → archival → recoverable handoff. Demonstrate successful runs, blocked/missing-reference paths, recovery after interruption, permissions/approval enforcement, accurate state reporting and no false claims. Record the exact desktop test environment, commands, results, defects and limitations. A UI mock or document is not a completed subsystem. If a capability depends on an unsupported external API, mark the limitation precisely; do not counterfeit completion.

## After Garage acceptance: modular asset library

**Goal:** A reusable, editable, performant Greenveil production library that can populate varied forests, cottages, homesteads, farms, roads, bridges, villages and ruins, with castles/large fortifications later unless needed for the bounded playable area.

**Acquisition-first workflow:**
1. Query approved/free sources (for example Epic/Fab free offerings, Poly Haven, other clearly licensed repositories), and maintain a candidate catalog with source URL, creator, exact license/terms, attribution, commercial use, modification rights, redistribution restrictions, source formats, version, dependencies and any account/download restrictions. **Free price does not imply CC0 or redistribution rights.**
2. Prefer reusable high-quality production meshes with editable Blender/FBX/glTF source where allowed. Verify actual license before download/import and keep restricted assets out of public GitHub. Never automatically scrape protected stores, bypass logins, repackage restricted Fab assets or commit third-party binaries to the public repository.
3. For gaps, create original modular geometry and materials using Blender/procedural tools and approved creative references. Distinguish concept art from 3D assets. Preserve authoring files and provenance.
4. Normalize scale, grid/socket conventions, pivots, material families, collision, LOD/Nanite strategy, instancing, interior/exterior variants, texture budgets and Unreal import rules. Generate Blueprint assemblies and curated variants, not uncontrolled random combinations.
5. Organize **shared technical kits** plus **culture-specific visual kits** informed by approved Greenveil settlements, biome and people documents; never flatten all 13 peoples into generic medieval architecture. The AI Librarian must supply version-locked design references and flag missing canon.
6. World Forge/Settlement Composer may place modular buildings, paths, farms, props and vegetation with terrain-aware rules, editable layouts, deterministic seeds, manual override, protected authored areas and rollback. Do not promise finished interiors until explicitly scoped.
7. Verify real asset loading, licenses, collision, traversal, visual coherence, streaming, performance and Windows packaged behavior in an isolated Greenveil test scene before large-scale placement.

**First acceptance slice:** One real Greenveil cottage kit with several curated variants, one small farm/yard kit, one bridge/path kit and one vegetation/forest-dressing kit, assembled into a coherent walkable settlement in Unreal. Supply asset manifest, source/editability and license ledger, actual screenshots/build evidence, measured performance, known placeholders and reproducible import steps. Do not claim this is implemented from this document.

## Dependencies, protection and handoff

- Read `README.md`, `docs/project/CURRENT-STATE.md`, `docs/project/SESSION-HANDOFF.md`, `docs/project/DECISIONS.md`, `ROADMAP.md`, the master instructions on **PR #12** (not assumed merged), relevant world/art docs and **PR #18** before coding.
- Inspect and preserve Greenveil environment **PR #10** and terrain **PR #15**; avoid overwriting protected levels, working builds, saves or unrelated animal staging **PR #9**.
- Existing GitHub docs may reflect older animal-first priorities; retain history and apply the newer master Greenveil-first instruction, without misreporting the actual tested state.
- Use protected main, isolated branches/worktrees, reviewable PRs, durable commits and evidence-based status: proposed/staged/implemented/compiled/tested/accepted/released.
- Windows desktop contains UE5 and local licensed assets; NAS W: is an archive target only when verified accessible, not the live task database. Use versioned backups, checksums and recovery checks; an old NAS/RAID is not an independent backup.
- No automatic protected-branch merges, canon approval, purchases, security changes or releases. Owner retains approval gates.
- During implementation update CURRENT-STATE with verified facts, SESSION-HANDOFF with exact next actions/blockers, DECISIONS only for actual owner-approved choices, and ROADMAP with milestone evidence. Keep this staging directive separate from implementation evidence.

## Restart instruction for Codex/Work

> Continue the Wildbound AI Garage from its surviving desktop source and GitHub state. First reconcile actual code, processes, task DB, logs, worktrees and PRs; do not redo finished work or mistake planning for implementation. Complete and prove the **entire approved Garage pipeline across all agents**, preserving owner gates. Then proceed to **free-first, editable modular Greenveil building/settlement/environment kits**, acquiring appropriately licensed existing assets or generating original missing modules. Work through dependency-ready tasks autonomously, save recoverable checkpoints, test real behavior, and keep staged changes reviewable. If credits or access run out, preserve exact progress, blockers and a deterministic resume instruction rather than declaring success.
