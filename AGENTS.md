# WildBound project instructions

## How the user works with us

- The user's main conversation stays in the ChatGPT desktop app. Talk to the user and receive task requests there.
- WildBound Local is a background worker and an activity dashboard, not a second place the user needs to chat.
- Codex is the primary orchestrator. Decide when local delegation will save Codex task allotment without sacrificing quality; the user should not have to choose the agent for routine tasks.
- The dashboard's **Work log** identifies tasks as **Local AI · on this PC** or **Codex · account credits** and records status and time. It does not measure or estimate the Codex credits consumed by an individual task.
- When GitHub Desktop is available, use it as a visual view of the WildBound checkout's current branch, diff, staged files, and remote sync state. It is a Git client, not an AI router, and Git commands or reviews there do not count as local model inference or save AI credits. The LocalAI dashboard/configuration lives outside this game repository.
- Before handling a bounded WildBound assignment, Codex should consult the local task router. It gives a deterministic local-first decision for clearly bounded repository search, inspection, documentation, and routine-maintenance work. Architecture, security, multiplayer, destructive operations, build/runtime/performance verification, large or ambiguous work stays in Codex. Routing is a recommendation gate, not automatic interception of the active Codex chat; Codex must submit local work through the helper and review its answer.
- Usage tracking records Ollama request counts, model-reported prompt/response tokens, durations, failures, and routing decisions without saving prompt or response text. Codex task events can be logged, but Codex per-request counts and tokens are unavailable to the dashboard. Never report a true local/cloud request or token percentage from router decisions alone.

## Storage and machine-specific paths

- Keep WildBound checkouts, assets, generated outputs, build scratch, Unreal's local cache, local AI tools/models, and recovery copies on non-system data volumes. Never create project-related files on the operating-system volume.
- Resolve paths from the checkout or configured workspace root. Do not put user-profile names, machine-specific absolute paths, or drive letters in tracked scripts or documentation.
- Windows build and launch helpers must reject a checkout on the system volume before creating output, and route temporary files and Unreal's local data cache to the configured non-system workspace.

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

## Local media generation

- When the `wildbound-workshop` MCP server is available and the user requests WildBound concept art, textures, or audio, prefer its local generation tools over cloud media generation. Apply the checked-in WildBound generation profile and Idea Board references; keep prompts and generated media on the workstation during inference.
- `wildbound_generate_image` defaults to 1024px, includes a preview, copies the source into the game repository, and attempts an Unreal `Texture2D` import. For exploratory concepts use `add_to_unreal:false`; import only after review and approval. It does not create a mesh/material or place an asset in a level. Inspect it before treating it as production-ready. If the local GPU or memory checks reject generation, let Codex take over with image generation rather than retrying locally.
- `wildbound_generate_audio` uses the shared local ACE-Step model for short instrumental cues and musical ambience, returns a 320 kbps MP3 preview, converts to 48 kHz WAV, and attempts to import a `SoundWave`. It does not generate isolated SFX. The Garage also has an offline Kokoro 82M CPU voice renderer that preserves native 24 kHz mono and exports normalized 48 kHz, 24-bit dual-mono stereo WAV; it does not add spatial width or change the model's voice quality. The direct voice endpoint is documented by the local Audio Studio service even though the Workshop audio tool itself generates only music and ambience. It will stop music/ambience generation when free RAM is below 12 GiB or the shared ComfyUI queue is occupied. Never silently switch audio generation to a cloud provider; cloud audio requires the user's approval.
- The Garage production queue has a separate local Stable Audio 3 worker for isolated SFX. A backend availability check is not an art-quality approval; inspect each SFX output and leave it for owner review. Prompt-to-3D and new rigging/animation authoring remain limited until a local worker produces acceptable reviewed results.
- Only use `wildbound_publish_generated_assets` after the user explicitly asks to publish. Pass only generated files under `Content/GeneratedAIAssets/`; the tool is designed to refuse unrelated staged changes and never publishes other project files.
- Local inference and Unreal import do not count as Codex model usage. Returning media previews uses context, but do so by default when the user asks for generated media so Codex can inspect and return the result.

## Idea Board art direction and project workflow

- The Garage Creative Library stores original media on the private NAS and versioned design records in Git. The AI Librarian serves only approved, accessible, version-pinned references to workers. Director-proposed `subject:facet` reference needs must be validated against the Library; missing, inaccessible, or explicitly conflicting references pause only the affected task. Exploratory records, transport tests, and rejected designs must never become canon or positive production references without owner approval. The Garage UI can supply originals, approve or withdraw versions, and recheck blocked work; review the resulting Git changes in a PR.

- Applies to every contributor and AI worker, including Codex, WildBound Local/Ollama, image, audio, video, and 3D tools: before creating, selecting, editing, importing, or publishing visual or audio assets, consult the Idea Board chat in this project and the latest relevant Git history and working-tree guidance (generation profile, art/audio documentation, and current design decisions). Do not rely on stale prompts or memory when newer direction exists.
- When new approved direction appears in the Idea Board chat, Codex must carry it into versioned project guidance or the relevant generation profile before assigning local-AI work. Local and other tools must follow the newest project guidance; when that conflicts with the chat or is ambiguous, pause and have Codex reconcile it.
- Treat the full Idea Board chat, including embedded and attached artwork, as a reference source. The checked-in concept atlas is a partial index, not proof that a race or style has no reference; search the board visuals before claiming a reference is absent. The user has confirmed the Idea Board includes Siren references. Use the race name Sirens in prompts, documentation, and asset metadata. When local tools cannot access the chat imagery, Codex must translate the relevant approved visual/audio constraints into versioned project guidance before delegating.
- Keep every character and race within its established group identity, and every biome within its own established visual and audio bounds. Maintain consistency across anatomy, silhouette, palette, materials, clothing/culture, creatures, architecture, lighting, animation language, voice, ambience, and music. A race may belong in a shared world without losing its own defining traits; a biome's palette or motifs must not be indiscriminately applied to other groups.
- Art direction is allowed to evolve. Treat the Idea Board's latest user-authored direction as authoritative and update checked-in art guidance when a direction is established. After reviewing the full Idea Board text and images plus current Git guidance, if a material visual-style question is still unanswered, ask the user to define the missing direction before making a consequential or hard-to-reverse style choice. For low-impact exploratory drafts, state the assumption and label them as drafts. Apply this rule to voices, ambience, and music as well as visual style.
- When the user rejects a visual or audio style or generated asset, remove it from active/candidate/game-ready use or clearly mark it as rejected and a style to avoid. Preserve a rejected copy only in a clearly labeled review/archive location when needed for provenance; never reuse it as a positive reference. Ask what specifically they disliked unless the reason is already explicit, then update the relevant visual/audio avoid guidance before generating a replacement.
- Keep the production workflow streamlined and stable: inspect current assets and project state first; reuse validated, licensed assets; generate only what fills a real gap; validate anatomy, scale, materials, provenance, file format, and Unreal import before reuse; avoid duplicate downloads, repeated generation, unnecessary full builds, and parallel jobs that contend for the same GPU or memory.
- Prefer repeatable, incremental steps with clear checkpoints and recovery paths. Record provenance and checks; separate concept previews from approved game assets; preserve user changes; keep generated files and instructions synchronized with the project without committing or publishing unless authorized.

## Cohesive race and biome asset pipeline

- Treat each playable race and its home biome as one coherent design package. Reuse the same documented palette, anatomy, materials, cultural details, environmental acoustics, voice characterization, and musical motifs across concept art, 3D models, animations, dialogue, ambience, and score. Consult the current Idea Board and checked-in generation profile; art direction can evolve, so update the profile when the user changes it.
- Work in dependency order: approve the visual character/biome reference; create or source the 3D mesh from that reference; check silhouette and anatomy; rig the model and author movement appropriate to its body; select a matching voice; then build the biome ambience and music around that race and place. Do not let a voice, animation, or soundscape define a different character than the visual reference.
- For Sirens, derive anatomy and silhouette from the Idea Board Siren references. Do not assume generic mythological morphology or import unrelated wing, tail, limb, clothing, or cultural traits; reject outputs that contradict the reference and ask only when the referenced anatomy or style remains unclear.
- Do not use `PLACEHOLDER_REJECTED_Trench_Naga_Siren_CC0.glb` as Siren art guidance or production art. The user rejected its flat playdough-like finish and multi-armed serpent silhouette as a mismatch to the concept; keep it as a clearly labeled Asset Studio placeholder only.
- The Garage Asset Studio is an offline GLB library and previewer. It can display embedded animation clips and play/pause/change speed; it does not generate 3D meshes, auto-rig models, author animations, or import GLB files into Unreal. Do not claim those features or imply a concept image is a 3D model. No local 3D generation model is configured unless the Garage status and installed weights confirm otherwise.
- Use a generated image as a 3D-generation reference only after anatomy, composition, and race/biome style pass review. Keep unapproved alternatives out of Unreal and public GitHub. When model generation or audio work is delegated to a cloud service, tell the user which asset left the workstation and why; prefer local inference when it can meet the quality target.
- Keep voice and music assets game-ready and consistent: voice exports are 48 kHz/24-bit stereo dual-mono from a mono source; spatial character placement and width belong in Unreal's audio mix. ACE-Step provides musical ambience and score beds, not isolated environmental SFX. Label these limits honestly.


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
