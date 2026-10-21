# Wildbound documentation audit — October 21, 2026

**Type:** Internal documentation quality and source-consistency review.  
**Scope:** `main` project record, roadmap, developer guides, design/system pages, license credits, navigation, existing planning PRs and sampled code/configuration.  
**Evidence method:** Read GitHub source and records; inspect existing CI and open draft PRs. **No new UE compilation, desktop inspection, gameplay test, dedicated-server test, asset licensing opinion or security penetration test.**

[Documentation hub](../README.md) · [Current state](CURRENT-STATE.md) · [Session handoff](SESSION-HANDOFF.md) · [Roadmap](../../ROADMAP.md)

## Verdict

**Documentation was structurally useful but had significant status drift.** Several pages still called the code an uncompiled scaffold or said no Greenveil map existed, while the authoritative project record described a UE 5.8.4 Windows editor/game build, packaged Greenveil map and successful local startup. A future developer following older instructions could waste time redoing work or mistake a prototype system for validated gameplay.

Corrections were committed to main as routine record hygiene. A separate draft PR preserves the more speculative Idea Board work. **The project is past the initial engine build, but still lacks documented human-in-the-loop care/build validation, gameplay replication, a verified dedicated server and persistent world saves.**

## Findings, impact and disposition

| Severity | Finding | Impact | Disposition |
| :-- | :-- | :-- | :-- |
| **High — corrected** | `docs/developers/README.md` instructed first-time engine setup and claimed no UE target compiled or map supplied | Contradicted build/handoff record | Rewritten with last verified UE 5.8.4 toolchain, tracked map, current instructions, clean-checkout caveats and LFS |
| **High — corrected** | `docs/developers/FIRST-PLAYABLE.md` assumed needs component never compiled and per-frame tick still needed throttling | False technical handoff to Codex/UE developer | Rebuilt as evidence/remaining-acceptance gate matrix |
| **High — corrected** | Animals, construction and multiplayer design documents said Unreal had not compiled or that no network session existed | Artificially regressed project status and hid the actual untested boundaries | Updated to distinguish compiled UE actors, native tests, ground-probed wander and connection-only listen-server smoke test |
| **Medium — corrected** | `docs/vision.md` stated "all gameplay in this vision is planned" without acknowledging a compiled prototype | Obscured real engineering progress | Linked authoritative current state, preserved proposed systems |
| **Medium — corrected** | `CURRENT-STATE.md` and `SESSION-HANDOFF.md` described a previous session's preview as currently open | A subsequent chat cannot verify the PC's current process state | Rephrased as dated last-observed desktop status |
| **Medium — corrected** | `docs/README.md` omitted key verification, visual, licensing and staging links | Navigation was incomplete | Reorganized into project record / game concepts / developer reference / separate idea drafts |
| **Low — corrected** | Asset credits contained a duplicated word and weak distinction between Git LFS and redistribution rights | Could give false sense of permission to publish third-party files | Clarified provenance, rights review and local Fab sample separation |
| **High — open** | Gameplay controls, E/R/F care, G/X blocks and actor replication are not validated in actual packaged play | Cannot truthfully label the loop complete or co-op functional | Follow [Issue #2](https://github.com/Systemkill90/WildBound/issues/2), then [Issue #3](https://github.com/Systemkill90/WildBound/issues/3) |
| **High — open** | No demonstrated headless dedicated server, true world save or backup recovery | Persistent co-op pillar remains a proposal | [Issue #3](https://github.com/Systemkill90/WildBound/issues/3) and [Issue #5](https://github.com/Systemkill90/WildBound/issues/5) |
| **Medium — open** | Main documentation and existing draft ideas have separate status lifecycles | Merging an early draft without review could reintroduce stale claims or inadvertently promote names to canon | Leave [draft Idea Board PR #1](https://github.com/Systemkill90/WildBound/pull/1) and [draft checkpoint PR #6](https://github.com/Systemkill90/WildBound/pull/6) unmerged until editorial review |
| **Medium — open** | Local `Scripts/Editor/ImportGreenveilDeer.py` contains machine-specific absolute source path | Reduces fresh-clone reproducibility | Parameterize/resolve project-relative source path and actually retest on Windows before claiming portability |
| **Medium — open** | LFS objects for tracked Unreal assets and licensed sample separation are not demonstrated by docs alone | GitHub file names do not guarantee successful clean checkout or valid future redistribution | Run a fresh clone / LFS pull, inspect source/license inventory and confirm local Fab sample is not committed |
| **Security follow-up — open** | The public Unreal config includes an Android File Server section with a generated-looking `SecurityToken` field and enabled network option | Unknown whether token is meaningful or plugin config needs hardening; cannot infer exploit or compromised credentials | Have the UE operator inspect whether this plugin is required, disable/remove unneeded settings and rotate any genuinely active token. **Do not paste the value into tickets or logs.** |
| **Low — open** | Helper script and project descriptor retain historical 'initial attempt/scaffold' wording | Misleading, but does not override build evidence | Fix alongside the next verified desktop build/tooling update rather than changing gameplay/runtime files in a docs-only pass |

## Source of truth and terminology

1. **`CURRENT-STATE.md`** records implementation and verification, with exact date, engine/toolchain and supporting logs or a prior work-session report.
2. **`SESSION-HANDOFF.md`** records next concrete desktop task, blockers and last **reported** app state. Do not say the application *is running now* without a fresh process check.
3. **`DECISIONS.md`** contains explicit owner decisions; an assistant's suggested names/creatures or draft PR does not equal owner approval.
4. **`ROADMAP.md`** tracks milestone evidence; an implementation sketch should not be shown as functioning or a milestone percentage.
5. **System and biome docs** describe intended behavior; include a short, current implementation-status disclaimer and link to current state.
6. **Draft PRs** organize speculative designs and staged art. Only reviewed/approved choices should enter a confirmed canon record.
7. **Verification tiers:** proposed -> authored -> UE compiled -> launched -> gameplay tested -> multiplayer-tested -> persistent/recoverable. These are not interchangeable.

## Source evidence already in GitHub

- Desktop record on main describes UE 5.8.4, VS Community 2022, Win64 Editor/game compilation, saved `/Game/Maps/GreenveilField`, package/cook success and local launch.
- Initial native CI check [39516848594](https://github.com/Systemkill90/WildBound/actions/runs/39516848594) passed 34 animal, 22 snapshot, 13 placement and 58 static wiring checks. Native checks are not UE gameplay tests.
- Later desktop record reports deer ground-probed wander and a two-client listen-server **join**. No state/action verification was performed.
- `Tools/Start-Wildbound.ps1` builds the Editor and attempts the map; a launcher source file does not mean the desktop is running.

## Automated documentation checks

A standard-library Python checker `Tests/Static/verify_docs.py` now verifies **relative link targets** across the repository's Markdown docs and homepage, with the `Documentation links` GitHub Actions workflow. It is a navigation test only. It does **not** assert engine status truth, semantic consistency, link targets on the public web, or GitHub anchor correctness.

## Outstanding documentation improvements

- Record an exact executable/build artifact hash and source commit with the next actual package launch. Keep logs private/local or publish sanitized excerpts only.
- Add screenshot-based human acceptance results for first controls/care/blocks. A PASS should name the observer, build, input and observed result.
- Record the difference between editor/game compile, listen-server connections, authoritative two-client gameplay and a true headless server.
- Document first migration/rollback and offline animal care decisions before claiming persistent-world support.
- Continue asset provenance and license checks per imported asset and keep speculative art distinct from runtime media.
- Prevent outdated draft branches from being merged as historical snapshots of current implementation.

## What this audit did *not* do

It did not inspect the live desktop, rebuild the UE project, execute a gameplay walkthrough, verify third-party license conditions with the suppliers, test save/restart, or evaluate real server security. This is a document audit, not a certification or third-party studio report.
