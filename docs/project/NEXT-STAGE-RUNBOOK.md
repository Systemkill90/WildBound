# Next leg — ordered, evidence-led development runbook

[Checkpoint](TRUCK-STOP-2026-10-21.md) · [Independent audit](INDEPENDENT-AUDIT-2026-10-21.md) · [Prototype playtest](../developers/PROTOTYPE-PLAYTEST.md)

**Planning posture:** prioritize one small, playable loop in Greenveil. These are execution gates, not calendar promises and not evidence of work already done.

## Gate A — Freeze and inspect the last known working build

- Record the exact commit, project branch, UE5 version, toolchain and the directory of the last successfully packaged Windows build.
- Check the locally launched package is still available; do not assume the prior session's preview window is still running.
- Preserve useful logs and local copies without committing binaries, live saves or restricted assets.
- Confirm CC0 assets, experimental Fab content, LFS pointers and project paths on the intended fresh checkout.
- **Pass:** reproducible launch on the actual Windows machine plus a short screenshot/video/log proving what opened.

## Gate B — One session playing the first loop

| Test | Required observation |
| :-- | :-- |
| Third-person movement | WASD, mouse, camera collision, jump, escape/re-focus |
| Greenveil visibility | Spawn facing meaningful landmark; readable deer and props |
| Animal needs | Hunger and thirst change visibly over real elapsed play time |
| Care | E/R/F outcome, supply cost, response and refusal feedback |
| Wild behavior | Deer stands on terrain and short wander stays grounded |
| Building | G places one snapped cube; X removes the aimed cube, collisions work |
| Negative cases | Beyond range, blocked ray, no supplies, repeat inputs during cooldown |

Log each as **PASS / FAIL / BLOCKED**, with UE logs and repro steps. On a failure, fix and retest before expanding environmental content.

**Pass:** a human or scripted in-engine interaction test demonstrates the loop end to end. A successful editor compilation or client joining is insufficient.

## Gate C — Improve readability and creature movement only

- Replace the sphere player placeholder with a properly licensed animated humanoid.
- Replace static deer sliding with a known-compatible rigged deer and simple idle/walk/turn/blend setup; capture a short movement test.
- Keep the Greenveil area small. If moving a slice of Electric Dreams into the project, use a rights-reviewed minimal import and a fresh-checkout reproducibility check.
- **Pass:** clear third-person movement and a grounded, visibly walking animal at a stable small-scene performance budget.

## Gate D — Enclosure-meets-construction test

- Prototype a basic wall, gate, sheltered care area, feeder and drinker.
- Compare a small custom voxel/volume approach with licensed engine-compatible options, recording cost, rights, build/deployment and server suitability.
- Test that an animal routes toward its needs when the gate opens and doesn't cross a closed wall. Update collision/navmesh after edits.
- **Pass:** repeated, measurable enclosure and navigation behavior; basic two-client visual consistency.

## Gate E — Multiplayer truth test

- Run two clients (and a host where required) through actual feeding, watering, reassurance, placing/removing, late-join, invalid-action, and disconnect/reconnect cases.
- Validate inventory/resource consumption on the authority and that all clients see convergent animal and block state.
- Confirm role/ownership checks or log them as unfinished. Do not mistake a listen-server smoke test for dedicated-server validation.
- **Pass:** repeatable action/state assertions, logs and rejection tests.

## Gate F — Dedicated server + save safety

- Build and start a **separate actual headless dedicated server**, not merely a host-listen session.
- Persist stable animal IDs, vitals, ownership, inventory and structures with an explicit schema version.
- Make backups and perform a deliberate corrupt-primary restore. Determine a humane offline care model.
- **Pass:** two clients reconnect after restart and see consistent, restored state; recovery test documented.

## Only after these gates

- First bounded breeding/lineage proof: two parents, one offspring, inheritance, ID and care.
- Farmstock variety and ecological systems with server population budgets.
- One tiny NPC or fantasy-village *behavior* study if owner prioritizes it.
- Additional biome production beginning with a short Drowned March mood/environment prototype.
- Full fantasy anatomy (extra-limbed rigs), sentient trees, mixed villages and settlement AI remain speculative expansions.

## Deliberate non-goals for the next stage

No seven-village NPC rollout. No dozens of dinosaur variants. No full procedural open world. No paid voxel purchase without approval. No Xbox promises. No copied fantasy designs. No large redesign before the first verified care/build/co-op loop.

## Definition of next milestone success

A locally launchable, archived, readable Greenveil test with a controllable character, an animal whose basic care/needs can actually be observed, and basic construction that demonstrably affects an enclosure. Then prove the same behavior is authoritative for two connected clients. Until observed, keep milestone status open.
