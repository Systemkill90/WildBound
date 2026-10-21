# First playable — Greenveil acceptance gates

[Current state](../project/CURRENT-STATE.md) · [Developer setup](README.md) · [Detailed playtest](PROTOTYPE-PLAYTEST.md) · [Roadmap](../../ROADMAP.md)

**Last evidence updated:** October 20, 2026. **Documentation review:** October 21, 2026. This is a continuing engineering checklist, not a fresh Unreal playtest.

## What is already evidenced

| Gate | Recorded evidence | Still required |
| :-- | :-- | :-- |
| 0 — Toolchain and boot | UE 5.8.4 editor/game compiled; Win64 package cooked and launched; `GreenveilField` level loaded | Clean-checkout reproducibility; separate headless server target |
| 1 — Small Greenveil map | Saved approximately 60 m clearing with CC0 trees, ground, rocks, path, player start and deer | Keyboard/mouse/camera/jump and gameplay readability playtest |
| 2 — Observe animal care | Hunger, thirst, stress/trust core logic passes native tests; actor/RPC source compiled; debug HUD present | Actual feeding/watering/reassuring with visible values, supplies and refusal feedback |
| 3 — Animal and enclosure | Ground-probed short deer wandering was observed along a creek; temporary snap-grid block code compiled | Rigged walk animation, real navigation, gates, enclosed animal behavior |
| 4 — Two-player authority | Listen server accepted two simulated client connections | Action/state replication, malicious/invalid requests, late join, true dedicated server |
| 5 — Save and recovery | Portable versioned snapshot codec passes native tests | Actual server-integrated world save, atomic backups, restart, corruption recovery |

**Do not promote the next gate based on the previous gate alone.** A running package is not a functioning gameplay loop. A client join is not proof of state synchronization. Standalone serialization is not runtime persistence.

## Next hands-on session

1. Record the local Git commit, engine/toolchain, command, map and package path. Verify the package can be launched again.
2. Move, look, jump, and refocus the game window. Record PASS/FAIL/BLOCKED and a short log.
3. Aim at the deer; test E feed, R water, F reassure. Compare HUD stats and resource portions before/after. Test too-far and obstructed actions.
4. Use G and X on the temporary construction blocks, check snapped positions, ground alignment and collisions.
5. Observe deer movement on more than the previously reported creek bank. Capture failure cases, especially nearby props and obstacles.
6. Fix reproducible defects first. Then run two-client care/build state assertions on server authority.
7. Reserve actual dedicated-server and persistence checks for separate gates once the prerequisites exist.

## Blockers and project hygiene

- The player remains a primitive placeholder; the deer model has no locomotion animation.
- The temporary cubes are not expressive voxel construction or editable terrain.
- Basic animal wandering is not navigation around player-built enclosures.
- Core care and construction gameplay have not been confirmed through user input on the package.
- Real inventories, land permissions, stable lineage identities, offline care policy and server backup recovery are absent.
- All license-restricted local sample content stays off public GitHub; see [Asset credits](../art/ASSET-CREDITS.md).

This updated checklist supersedes the original uncompiled-scaffold assumptions. Refer to [Session handoff](../project/SESSION-HANDOFF.md) for the last recorded desktop session and [Current state](../project/CURRENT-STATE.md) for evidence.
