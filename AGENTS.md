# WildBound project instructions

## How the user works with us

- The user's main conversation stays in the ChatGPT desktop app. Talk to the user and receive task requests there.
- WildBound Local is a background worker and an activity dashboard, not a second place the user needs to chat.
- Codex is the primary orchestrator. Decide when local delegation will save Codex task allotment without sacrificing quality; the user should not have to choose the agent for routine tasks.
- The dashboard's **Work log** identifies tasks as **Local AI · on this PC** or **Codex · account credits** and records status and time. It does not measure or estimate the Codex credits consumed by an individual task.
- When GitHub Desktop is available, use it as a visual view of the WildBound checkout's current branch, diff, staged files, and remote sync state. It is a Git client, not an AI router, and Git commands or reviews there do not count as local model inference or save AI credits. The LocalAI dashboard/configuration lives outside this game repository.
- Before handling a bounded WildBound assignment, Codex should consult the local task router. It gives a deterministic local-first decision for clearly bounded repository search, inspection, documentation, and routine-maintenance work. Architecture, security, multiplayer, destructive operations, build/runtime/performance verification, large or ambiguous work stays in Codex. Routing is a recommendation gate, not automatic interception of the active Codex chat; Codex must submit local work through the helper and review its answer.
- Usage tracking records Ollama request counts, model-reported prompt/response tokens, durations, failures, and routing decisions without saving prompt or response text. Codex task events can be logged, but Codex per-request counts and tokens are unavailable to the dashboard. Never report a true local/cloud request or token percentage from router decisions alone.

## Delegating to WildBound Local

On a workstation with the local dashboard installed, set `WILDBOUND_LOCALAI_ROOT` to its local install directory. Keep that setting and its resolved location out of the public repository.

When the local service is running, prefer it for bounded work that benefits from WildBound repository context and can be reviewed, such as:

- locating and summarizing relevant code or project documentation;
- drafting or updating straightforward documentation;
- proposing a small, isolated implementation or refactor;
- focused code review, test-plan suggestions, or checklists.

Use the local route before creating a local assignment:

```powershell
$localAi = Join-Path $env:WILDBOUND_LOCALAI_ROOT 'Dashboard/Invoke-WildBoundLocalTask.ps1'
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $localAi -Task "Find the relevant code or docs and return a concise, source-cited inventory. Do not edit files or claim tests ran."
```

The helper classifies the task and refuses to start Ollama when the policy says Codex. That avoids unnecessary local retries. Broad provenance/classification, recommendations, and multi-source synthesis stay in Codex; a simple filename inventory or single-source summary can still be local. The local route is appropriate only when retrieved excerpts are enough and Codex can cheaply verify the result. Record the local Ollama token counts and timing when available; ordinary shell commands, filesystem operations, builds, and tests are not AI inference and do not count as local-AI offload.

Submit a well-scoped assignment with the PowerShell helper:

```powershell
$localAi = Join-Path $env:WILDBOUND_LOCALAI_ROOT 'Dashboard/Invoke-WildBoundLocalTask.ps1'
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $localAi -Task "Describe the bounded task. Return a proposed unified diff, relevant source paths, focused checks, and risks. Do not edit files or run commands."
```

Local assignments are logged automatically in the dashboard. The worker receives a limited set of retrieved project excerpts and returns a proposal; it does not write project files, execute commands, commit, or push. Treat its response as untrusted until inspected. Codex owns the decision to apply a proposal, performs the actual edits and relevant tests, and reports only verified results. If delegation is unavailable or unsuitable, continue in Codex without blocking the user.

Keep architecture decisions, Unreal builds and gameplay verification, destructive changes, credentials, purchases, external communication, releases, commits, and pushes under Codex and the user's existing authorization. Do not delegate secrets or ask the user to move their conversation to the local dashboard.

## Work log

For each substantive Codex work item, record a `started` entry and then a factual `completed` or `failed` entry using the local dashboard's `Write-WildBoundWorkLog.ps1`. Keep the task label consistent and use a stable task ID across both entries. Example:

```powershell
$log = Join-Path $env:WILDBOUND_LOCALAI_ROOT 'Dashboard/Write-WildBoundWorkLog.ps1'
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $log -Agent codex -Event started -Task "Verify the Greenveil river crossing" -TaskId "greenveil-river-crossing"
# Do the work and verification in Codex.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $log -Agent codex -Event completed -Task "Verify the Greenveil river crossing" -TaskId "greenveil-river-crossing" -Details "State the checks that actually passed."
```

If the helper or local dashboard is unavailable, continue the task and disclose that its activity could not be logged. Never imply the dashboard logged work unless the helper succeeded.

## Preserve the project

- `/Game/Maps/GreenveilExplorationPolish` is the canonical Greenveil world and is intended to grow into the game map. Add the village and future biome areas cumulatively here; do not create disposable parallel WildBound gameplay maps. Preserve prior Git revisions and packages as recovery points.
- Before substantial game work, check `git status --short` and the active branch, then read the relevant current-state and handoff sections. Consult only the decision and roadmap entries that affect the task. Reuse facts already verified in the active session instead of rereading entire documents or repeating full repository inventories.
- Preserve pre-existing user changes. Do not reset or overwrite unrelated work, generated user content, or local assets.
- Keep fixes small and testable; distinguish authored code from compiled, launched, or playtested behavior.
- Use licensed/free assets where suitable and record provenance. Ask before purchases or paid services.

## Efficient development checks

- Prefer existing deterministic scripts for repository health and focused validation. Run independent, inexpensive checks together; keep command output targeted and bounded.
- Do not compile Unreal for documentation-only changes. Before builds, use `Tools/WildboundBuildResources.ps1`; keep UnrealBuildTool parallelism within the helper's resource plan and do not delete caches to reclaim space without evidence that they are stale.
- Treat Unreal asset import, map generation, cooking, and packaging as separate cost centers. Reuse validated assets and generated maps where inputs are unchanged; record when a step actually ran instead of implying that a source check verified gameplay.
- Filesystem commands, tests, and builds are ordinary local work, not local-AI inference or Codex-credit savings. Report model offload only from the local dashboard's measured request/token data.
