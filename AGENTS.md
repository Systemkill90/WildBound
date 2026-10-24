# Wildbound — complete project instructions

These instructions are the shared operating guide for work in the Wildbound repository and project. They supplement the owner's existing ChatGPT project instructions, task-specific directions, and approved decisions; they do not cancel, replace, or silently reinterpret them. Preserve existing instructions when adding this guide. If two owner-authored directions genuinely conflict, identify the conflict and ask which one governs before making the conflicting change. The owner has final authority over canon, priorities, scope, release commitments, cost, and licensing decisions.

## 1. Project identity and creative direction

Wildbound is an original, PC-first cooperative wilderness survival and homesteading game being developed with Unreal Engine 5. The core promise is: **build a home, earn the wild's trust, and grow a life together**. The intended experience joins a believable natural world with quiet, ancient magic. Rustic physical details—mud, timber, mossy stone, creaking barns, animal breath, wet reeds, weathered tools—establish credibility. The strange should emerge through ecology, light, sound, ruins, and folklore rather than constant spectacle or explanation.

Use the five design pillars to guide decisions:

1. **Animals are neighbors and dependents.** Animals have needs, boundaries, temperaments, and behaviors. Care should matter throughout their lives; taming should not erase a creature's nature.
2. **Home is earned through care.** Cottages, gardens, barns, fences, bridges, and shared spaces support a lasting life and should connect to meaningful needs.
3. **The wild remains wild.** Habitats, weather, animal behavior, predators, and consequences matter. Cozy play can still carry risk.
4. **Magic lives in the environment.** Use subtle impossibilities rooted in familiar nature. Preserve mystery and restraint.
5. **Cooperation builds continuity.** Friends share worlds, homes, exploration, and stewardship. Server authority and reliable recovery are necessary before calling a world persistent.

The first complete loop proposed by the project is **explore → approach an animal → provide care → build a safe enclosure → return together**. Treat it as the central prototype target. It must be observable and repeatable in a launched build, with server-authoritative results across clients where co-op is included. Do not expand the world or systems before the smallest representative loop is understandable, enjoyable, and technically viable.

## 2. Canon, proposals, and world

Keep approved direction, design proposals, concept art, authored content, and implemented gameplay clearly separate. A generated image, draft pull request, branch, assistant suggestion, code sketch, or design document is not by itself owner approval, canon, a production asset, or proof of a working feature. Record owner-approved decisions in `docs/project/DECISIONS.md`; keep experiments in their draft/review locations until accepted.

Current world direction:

- **Greenveil Basin** is the first home: pastoral, cottagecore, welcoming but untamed, with meadows, orchards, creeks, timber homesteads, animals, and quiet magic. The repository has a small test clearing/prototype, not a complete production region.
- **The Drowned March** is a planned wetland of mournful blackwater, reeds, low fog, half-lost roads, ruins, and ambiguous environmental mysteries. It is not currently playable.
- **Emberstep Highlands** is a future candidate open-range/ranching region, not a confirmed production biome.
- Names such as Gloamwood, Stonewake Heights, and Sunfield Prairie, as well as creature, tool, costume, village, and magical concepts in the art atlas or drafts, remain exploratory unless the owner approves them.
- Keep regions original. Do not import another game's lore, distinctive assets, names, or recognizable protected expression.
- Make ecology, materials, weather, shelter, animal adaptations, and architecture reinforce each other. Test travel distances and biome boundaries before expanding the map.

Combat, economy, seasons, world scale, player capacity, explicit magical abilities, genetics depth, voxel implementation, offline animal care, persistence details, platforms beyond the initial PC target, and distribution licensing have open decisions unless later approved. Do not turn these into promises.

## 3. Project direction, priority, and scope

**Early Access is the first major milestone.** Treat current engineering milestones as gates toward an owner-defined Early Access candidate, not as independent launch promises. The detailed Early Access scope, included and deferred features, target hardware, platforms, price, release date, player count, content count, and final acceptance thresholds remain owner decisions. Proposed readiness criteria are planning aids until the owner approves measurable gates. Never announce or imply an unapproved commitment.

Work in this order unless the owner explicitly reprioritizes:

1. Read the current records and preserve existing user work.
2. Confirm the actual current build/revision and relevant local state; do not rely on old handoffs for live state.
3. Validate player movement, camera, jump, collision, and readability in the small Greenveil test.
4. Validate animal grounding/movement and the care actions, including visible needs, supply changes, refusal cases, stress/trust feedback, and range/obstruction handling.
5. Validate temporary placement/removal, snapping, ground alignment, and collision. Be clear that temporary blocks are not a voxel engine or editable terrain.
6. Test the same care and building outcomes through two clients with server authority, invalid requests, and late-join cases where applicable.
7. Establish measured performance and an authored, bounded Greenveil slice before broad environment expansion or costly content production.
8. Decide and demonstrate save, restart, backup, and recovery behavior before claiming persistence. Decide separately whether a dedicated server and offline animal care are included or deferred.
9. Replace temporary placeholder character/animal art only when core movement and readability are stable and each asset has approved rights.
10. Plan additional biomes, breeding depth, villages, and platform expansion only after the early loop and owner-approved milestone gates support them.

PC is the initial development target. Xbox is a future feasibility evaluation, not a commitment. Keep the first map small. No paid voxel plugin or major paid dependency has been selected. Do not introduce a paid tool, plugin, large asset pack, major system, or expensive world/asset-generation effort without explicit owner approval. Avoid making experimental PCG or Substrate features required to core runtime gameplay.

## 4. Current implementation boundaries

The repository documentation is the changing source of truth; read it before work and re-check it after work. The recorded prototype uses Unreal Engine 5.8.4 on Windows, has compiled editor/game targets and launched a small Greenveil/sample-backed build. Treat this as dated evidence, not proof that the same machine, build, app, asset, or process is available now.

The following distinctions are mandatory:

- Animal hunger, thirst, stress/trust rules and care-request code have compiled and had standalone native-rule tests, but care interactions and their feedback still require hands-on playtesting.
- Deer movement and a temporary rig/collision setup have been observed in a preview; that does not prove full navigation, obstacle traversal, enclosure behavior, or final animation quality.
- Temporary 1 m snapped blocks and placement rules are a validation harness, not a voxel engine, destructible terrain, persistent construction, or a completed building system.
- A listen server accepting two simulated clients proves connection acceptance only. It does not prove action/state replication, authorization, late join, public-host security, or a working dedicated server.
- A portable snapshot codec test is not Unreal disk persistence. Persistence requires actual save, restart, restore, backup, and failure-recovery evidence.
- A 60 FPS launch cap is not measured performance. Distinguish native resolution from internal render resolution and record target hardware, settings, route, frame-time data, and duration.
- Placeholder models, concept art, environmental props, and generated world maps must be described accurately. A bowl or pail prop is not an interactive care target; an art image is not an in-game asset.
- Historical audit/handoff claims can conflict or become stale. Prefer the latest direct evidence and note uncertainty rather than silently treating older notes as current.

Before proposing implementation, check `docs/project/CURRENT-STATE.md`, `docs/project/SESSION-HANDOFF.md`, `docs/project/DECISIONS.md`, `ROADMAP.md`, the relevant system/world/art/developer documents, and the current issue/PR when applicable.

## 5. Evidence and verification

Use this evidence ladder precisely: **proposed → authored → compiled → launched → gameplay-tested → multiplayer-tested → persistent/recoverable**. A result at one level does not imply any later level. Use explicit statuses such as **PASS**, **FAIL**, **BLOCKED**, **NOT RUN**, and **NOT VERIFIED**; do not invent completion percentages.

For any verification claim, record what is known: source commit/build, engine and toolchain, target, map, command, inputs, expected and observed outcome, logs/screenshots when useful, and the limits of the check. Separate current direct observation from an earlier session report and from inference.

Examples:

- Native C++/simulation tests do not prove Unreal gameplay.
- A successful compile or cook does not prove the game is playable.
- A launch does not prove the intended interaction works.
- A client join does not prove state or action replication.
- A frame cap does not prove a frame-rate target.
- A source snapshot test does not prove server persistence.
- A document/link check does not prove technical correctness, legal rights, or product readiness.

Run only checks relevant to the requested change and the repository workflow. Preserve failing results and report them accurately; do not hide, delete, or rewrite logs to make a result look successful. Do not claim a complete gameplay, security, licensing, platform, or release audit unless that specific scope was examined.

## 6. Technical and developer workflow

The last recorded working setup is Windows with Unreal Engine 5.8.4, Visual Studio 2022, MSVC, and Windows SDK 10. Verify actual installed versions rather than assuming a new checkout matches. The project does not bind itself to one machine-specific engine path.

For a clean checkout, follow `docs/developers/README.md` and `docs/developers/PROTOTYPE-PLAYTEST.md`. Use Git with Git LFS enabled, verify the LFS fetch and asset import, then use the documented `Tools/Start-Wildbound.cmd` workflow to inspect engines, build, or attempt launch. A helper script returning or starting is not evidence until its logs and the launched game confirm success. Check exact path assumptions in editor scripts before reuse.

Repository layout:

- `Source/Wildbound`: Unreal runtime module and portable model code.
- `Content/Maps/GreenveilField.umap`: tracked starter map.
- `Content/Wildbound/Art`: reviewed starter art assets; new Content files are ignored until reviewed and explicitly staged.
- `Scripts/Editor`: editor automation; inspect for machine-specific paths.
- `Tests/Native`, `Tests/Static`: standalone rule/snapshot/placement and structural checks.
- `Tools`: Windows build/launch and local setup helpers.
- `docs/`: design, art, developer and project records.
- `ROADMAP.md`, `CONTRIBUTING.md`, `.github/workflows`: milestones, contribution expectations, and repository automation.

Prefer small, reversible changes. Check the branch and working tree before editing, preserve all existing changes, and do not use destructive resets or overwrite user work. Back up irreplaceable authored maps before risky editor transformations. Keep gameplay/source changes distinct from documentation-only updates. When implementation changes evidence, update the smallest set of authoritative records.

## 7. Assets, licenses, privacy, and repository hygiene

Record source, creator, license, intended use, and distribution limits for every imported asset. Git LFS is storage only; it is not permission to redistribute. Existing credits are not automatic re-verification of a license. Confirm exact terms before publishing new assets.

Poly Haven and the Innerscene standing deer are recorded as CC0 in asset credits. Electric Dreams and the Fab Animal Variety/Free Shrubs packs have Fab Standard License restrictions: integrated use in an Unreal product may be allowed, but source files must not be redistributed as standalone assets. The user's locally installed Epic/Fab samples and local imports must stay out of public GitHub. Engine-bundled Quinn content is a local temporary development asset and must not be committed. Confirm current credit/license records before touching assets.

Never commit credentials, tokens, personal/private data, engine binaries, SDKs, local saves, generated builds, private logs, local Fab/Epic source assets, machine-specific paths, or unapproved generated content. Sanitize logs and screenshots before sharing. The public repository currently has no project-wide open-source license selected; do not imply it is open source or invite substantial external contributions without owner direction. Do not add or expose network permissions, public hosting, or credentials as a convenience; document and validate network behavior and server authority.

## 8. Documentation and project organization

Use each record for its intended purpose; avoid duplicate evolving status across pages:

- `AGENTS.md`: repository-level working rules.
- `docs/project/PROJECT-PLAYBOOK.md`: audit workflow and provisional Early Access readiness framework.
- `docs/project/CURRENT-STATE.md`: dated implementation and verification facts.
- `docs/project/SESSION-HANDOFF.md`: last observed work, blockers, next task, and limits.
- `docs/project/DECISIONS.md`: owner-approved decisions and open decisions.
- `ROADMAP.md`: milestone order, state, and completion evidence.
- `docs/developers/FIRST-PLAYABLE.md` and `PROTOTYPE-PLAYTEST.md`: acceptance gates and hands-on checks.
- `docs/vision.md`, `docs/world/`, and `docs/systems/`: intended experience and design concepts, with implementation status linked to Current State.
- `docs/art/ASSET-CREDITS.md`: asset origins and rights; `docs/art/` and the concept atlas: art studies, not production promises.
- `CONTRIBUTING.md`: focused contribution, evidence, licensing, and repository rules.

When records disagree, state the inconsistency, compare dates and direct evidence, and correct the stale record with a source. Never silently promote an idea to canon or turn an old handoff into current live state. Maintain valid navigation links and clearly label drafts, candidates, prototypes, and verified features.

## 9. Project-wide audit and Early Access readiness

Audit the project in bounded, evidence-linked passes: product/design; playable build and user experience; code/architecture; testing and multiplayer authority; persistence/recovery; world/content/art; licensing and repository hygiene; documentation; build/distribution; support and known issues. Do not combine unverified assumptions into a broad verdict.

For each finding, record evidence, impact/severity, confidence, owner decision needed, recommended action, and milestone. Track follow-up work in GitHub issues and link it from the relevant roadmap/audit record. Keep unrelated speculative design work separate from urgent blockers and working prototype changes.

Before calling an Early Access candidate ready, require owner-approved scope and limitations; a repeatable end-to-end core loop in a packaged build; measurable stability/performance on approved target hardware; gameplay-level multiplayer and authority proof for anything advertised; tested persistence/recovery for any persistence claim; a representative slice without critical progression blockers; verified asset rights; clean-checkout build/package instructions; a triaged known-issues list; and an explicit owner go/no-go decision. Mark each gate **PASS**, **FAIL**, **DEFERRED BY OWNER**, or **NOT YET CHECKED**. A missing test is not a pass. These are proposed gates until the owner approves final measurable criteria.

## 10. Handoffs and communication

For substantial work, report plainly: what changed and why; files/systems touched; checks run and results; evidence level; risks, limits, and unanswered owner decisions; the next concrete action. Be concise but never conceal a blocker. Do not describe proposed, generated, compiled, or locally imported work as shipped or finished. The owner decides canon, priorities, milestone scope, release claims, asset exposure, and project cost.
