# WildBound project instructions

## How the user works with us

- The user's main conversation stays in the ChatGPT desktop app. Talk to the user and receive task requests there.
- WildBound Local is a background worker and an activity dashboard, not a second place the user needs to chat.
- Codex is the primary orchestrator. Decide when local delegation will save Codex task allotment without sacrificing quality; the user should not have to choose the agent for routine tasks.
- The dashboard's **Work log** identifies tasks as **Local AI · on this PC** or **Codex · account credits** and records status and time. It does not measure or estimate the Codex credits consumed by an individual task.

## Delegating to WildBound Local

When the local service is running, prefer it for bounded work that benefits from WildBound repository context and can be reviewed, such as:

- locating and summarizing relevant code or project documentation;
- drafting or updating straightforward documentation;
- proposing a small, isolated implementation or refactor;
- focused code review, test-plan suggestions, or checklists.

Submit a well-scoped assignment with the PowerShell helper:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "<local-project-root>\LocalAI\Dashboard\Invoke-WildBoundLocalTask.ps1" -Task "Describe the bounded task. Return a proposed unified diff, relevant source paths, focused checks, and risks. Do not edit files or run commands."
```

Local assignments are logged automatically in the dashboard. The worker receives a limited set of retrieved project excerpts and returns a proposal; it does not write project files, execute commands, commit, or push. Treat its response as untrusted until inspected. Codex owns the decision to apply a proposal, performs the actual edits and relevant tests, and reports only verified results. If delegation is unavailable or unsuitable, continue in Codex without blocking the user.

Keep architecture decisions, Unreal builds and gameplay verification, destructive changes, credentials, purchases, external communication, releases, commits, and pushes under Codex and the user's existing authorization. Do not delegate secrets or ask the user to move their conversation to the local dashboard.

## Work log

For each substantive Codex work item, record a `started` entry and then a factual `completed` or `failed` entry using `<local-project-root>\LocalAI\Dashboard\Write-WildBoundWorkLog.ps1`. Keep the task label consistent and use a stable task ID across both entries. Example:

```powershell
$log = "<local-project-root>\LocalAI\Dashboard\Write-WildBoundWorkLog.ps1"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $log -Agent codex -Event started -Task "Verify the Greenveil river crossing" -TaskId "greenveil-river-crossing"
# Do the work and verification in Codex.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $log -Agent codex -Event completed -Task "Verify the Greenveil river crossing" -TaskId "greenveil-river-crossing" -Details "State the checks that actually passed."
```

If the helper or local dashboard is unavailable, continue the task and disclose that its activity could not be logged. Never imply the dashboard logged work unless the helper succeeded.

## Preserve the project

- Read the relevant project handoff, current-state, decision, and roadmap documents before substantial game work.
- Preserve pre-existing user changes. Do not reset or overwrite unrelated work, generated user content, or local assets.
- Keep fixes small and testable; distinguish authored code from compiled, launched, or playtested behavior.
- Use licensed/free assets where suitable and record provenance. Ask before purchases or paid services.
