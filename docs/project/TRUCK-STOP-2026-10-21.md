# Wildbound truck stop — October 21, 2026

**Type:** development checkpoint, art/concept staging, repo review and next-journey plan.  
**Changes in this branch:** design and original vector art only; **no Unreal gameplay source changes** and **no engine tests**.  
**Status:** review proposal, not a decision to ship all depicted species/biomes/villages.

[Home](../../README.md) · [Technical audit](INDEPENDENT-AUDIT-2026-10-21.md) · [Next-stage runbook](NEXT-STAGE-RUNBOOK.md) · [New concept art](../art/concepts/README.md) · [Expanded idea board](../world/idea-board-expansion.md)

## Where we've come from — verified versus still aspirational

| Area | Current recorded reality | Remaining gap |
| :-- | :-- | :-- |
| Toolchain | UE 5.8.4, VS 2022 and Win64 editor/game targets built successfully on Windows | Verify repeatability on clean checkout; headless server not tested |
| Scene | Saved 60 m Greenveil forest-clearing map, CC0 assets, deer, camera/HUD; Windows Development package cooked and launched | Still rough; proper player and deer animation, clear care feedback and authored ecology |
| Animal behavior | Portable needs/stress/trust model passes native tests; ground-probed deer wander observed in a local preview | In-game feeding/watering and stat changes not hands-on validated; no animal navigation, husbandry or breeding |
| Construction | Snapped test blocks and server-authority request source compiled; placement math native-tested | Placement interaction and collision unverified in play; no voxel terrain or building persistence |
| Co-op | Listen server accepted two simulated connections | No care/build replication assertions, actual dedicated server, shared permissions or save/restart |
| Persistence | Versioned portable prototype snapshot passes input validation tests | Not integrated with Unreal disk saves, backups or real animal lineage |
| Art and atmosphere | CC0 forest art imported; Electric Dreams close-range preview recorded locally; atmospheric JPEG references in repo | Visual consistency, playable readability, license-safe migration, proper animation and optimization |
| Future fantasy | Creative direction and initial village brainstorm staged on a separate draft PR | None of the seven villages or new fantastical species are canon/implemented |

The **latest reliable gameplay evidence is the on-repo recorded result**, not a live view of the PC. A locally open preview documented earlier may have changed since.

## Progress assessment

**Real achievement:** the project advanced from design-only to a compiled, packaged, visually launched PC prototype with a saved map, authored animal code and basic connectivity. No reason to dismiss it as mere scaffolding.

**Reality check:** it is not yet a verified enjoyable *game loop*. The most valuable next hour at a desktop is not another creature model; it is moving, feeding/watering, placing/removing a block, reading the result and reproducing defects.

**Identity:** preserve cozy, believable Greenveil; mournful blackwater March; animals as dependents, not inventory; subtle magic; building and persistent co-op as future pillars.

## Scope and scheduling decision

- **Now / first work order:** hands-on control and interaction acceptance, bug fixes, reproducible packaged build.
- **Next:** rigged player + grounded deer locomotion; small visual slice only if required for readability.
- **Then:** animal enclosure navigation tested *with* a construction approach, not in isolation.
- **Then:** authoritative multiplayer actions and persistent server state/restore.
- **After foundations:** breeding, fantasy variants, weather/ecology, Drowned March production, and NPC communities.
- **Free to imagine at any time:** fantasy people, extra-legged dinosaurs, walking trees, mushroom villages and additional biomes — **creative board != sprint commitment**.

See [next-stage runbook](NEXT-STAGE-RUNBOOK.md) for pass/fail gates and [audit](INDEPENDENT-AUDIT-2026-10-21.md) for ranked risks.

## Idea board coverage

The staged expansion addresses:
- **IB-001:** altered animals/dinosaurs (horn/eye/body/extra-limb studies), original creatures, giant fungi, witchy woodland/marsh subregions and rare tree beings.
- **IB-002:** woodland elves, wolfkin/werewolves, mountain dwarves, mixed villages and original Veshari/Nimrui/Kethri residents.
- Four illustrative SVG plates for Greenveil Witchwood, Drowned March/Lanthfen, candidate creatures and village building silhouettes.
- Existing [draft PR #1](https://github.com/Systemkill90/WildBound/pull/1) retains the original inbox and fantasy-village document. This checkpoint deliberately leaves it unmerged; all suggested names/abilities are subject to review.

## Audit verdict and repository housekeeping

- Keep the existing UE source architecture; **do not rewrite** to chase visual ambition.
- Preserve the rights-reviewed forest/deer source assets and local non-redistributable Fab sample separation.
- Use Git LFS intentionally; maintain accurate credits for every incoming asset.
- Resolve the old draft PR's out-of-date uncompiled status before merging it.
- Do not silently update DECISIONS.md with assistant-made species/village choices.
- Keep design-proposal branches separate from code and tested state.
- Do not treat GitHub Actions' portable unit checks as proof of Unreal game behavior.

## Next check-in questions (not blockers to staging)

1. Which *one* fantastical animal silhouette should get the first full turntable and rig-readiness study after the deer works?
2. Are fantasy peoples NPC-only initially? (No answer needed until NPC development is prioritized.)
3. Should enchanted Greenveil be rare pockets near the pastoral core, as proposed here?
4. Do any candidate names or villages feel especially right for Wildbound?

No purchased services, paid plugins, new Unreal content, or proprietary assets are required by this planning branch.
