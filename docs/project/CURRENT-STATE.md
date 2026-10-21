# Wildbound current state

Updated: October 21, 2026.

## Verified project and machine setup

- Public repository: [Systemkill90/WildBound](https://github.com/Systemkill90/WildBound), checked out at `<local-project-root>\Source`.
- Unreal Engine 5.8.4; Visual Studio 2022; MSVC toolchain; Windows SDK 10.
- `WildboundEditor` and the game target compile successfully on October 21. The Win64 Development package cooked 620 packages and was archived to `<local-project-root>\Builds\WildBoundPreAlpha2\Windows\Wildbound.exe` (generated output is not committed).
- The new package launched and startup log confirms `/Game/Maps/GreenveilField` loaded. Its initial mode was 2560×1440; the requested 1920×1080/60 FPS window launch remains to be checked. A Windows Security firewall prompt covers the preview and awaits a user click on **Cancel**; no network access is needed for this demo.
- A listen-server smoke test accepted two simulated clients. This verifies connection acceptance only, not gameplay replication.
- Static scaffold verification passed 58 checks. Native tests passed: 34 animal simulation, 22 snapshot validation, and 13 placement checks.
- Greenveil is a saved 60 m clearing with imported CC0 ground, foliage and props, lighting, trail, a player start, HUD and deer. The local generated map adds 12 wind-shrub instances from the Fab Free Shrubs pack around the edge of the clearing.
- The scene remains a rough prototype and does not meet the intended visual quality. A prior Electric Dreams preview held its 60 FPS cap at 1920×1080 output with 60% TSR, which is not native 1080p rendering. Sustained traversal and the new package's native-1080p frame rate have not been measured.
- Deer spawn now snaps to a nearby walkable WorldStatic surface, and server wandering only accepts ground steps within bounded height and slope limits. Both the Electric Dreams plugin target and WildboundEditor compiled; live preview showed the deer moving along the creek bank with its feet on the ground.

## Authored and compiled

- Server-updated animal needs, stress/trust rules and owner-controller care requests with preliminary range, line-of-sight and supply checks.
- Third-person pawn, camera, debug HUD, temporary 1 m snapped construction blocks, collision ground and game-mode bootstrap.
- Deer skeletal mesh with capsule collision, server-driven ground-probed local wandering and idle/walk/run sequences from a local Fab asset pack. The editor and game compile and the package cooks with these references. Visual confirmation of the sequences remains pending behind the firewall dialog; full navigation remains future work.
- Forest floor/foliage and starter props from Poly Haven CC0 assets; supplemental doe and wind shrubs come from local Fab imports. See [asset credits](../art/ASSET-CREDITS.md). Fab source files are ignored by Git and are not redistributed.
- PC-first project. Xbox is only a future feasibility evaluation.

## Still requires hands-on playtest or implementation

- Keyboard movement, jump and camera in this exact packaged checkout.
- Feeding, watering, reassurance, supply decrement, needs changes, stress and trust outcomes in live play.
- Block placement/removal, collision, and visible floor alignment in live play.
- Actual replication of animal values, care side effects and placed blocks. The two-client test joined clients but did not issue gameplay actions.
- Dedicated server build, world persistence/recovery, real inventory, animal navigation, grazing, breeding and enclosure behaviors.
- Replace the primitive player pawn with a proper rigged character. Test the imported doe animation and ground following on uneven terrain.

Do not infer that gameplay works solely from source or compilation. The compiled/packaged result is a real first prototype, but the acceptance cases above are unverified until actually played.

## Local launch

The October 21 standalone build is running from `<local-project-root>\Builds\WildBoundPreAlpha2\Windows\Wildbound.exe`, but a Windows Security firewall prompt is covering the game. Click **Cancel** on that prompt to continue with the offline preview. For the requested native 1080p/60 FPS test, relaunch windowed with `-ResX=1920 -ResY=1080 -fps=60`. The source checkout helper now also uses that mode. See the playtest guide in docs/developers/PROTOTYPE-PLAYTEST.md.

## New pre-production concept references (October 21, 2026)

The GitHub [illustrated concept atlas](../art/concept-atlas/README.md) contains eight art studies depicting twenty proposed creatures, candidate biomes, starter tools and both male/female homesteader costume directions. These are **visual proposals**, not playable content or an approved asset list. No UE compilation, gameplay or multiplayer tests were performed for this art update.

## Next tasks

1. Reveal the newly packaged 1080p window and visually check the local doe, shrubs, grounding and frame rate; capture any remaining scene-quality defects.
2. Playtest controls, care, animal needs and block placement in the current preview, then fix reproduced defects.
3. Source a licensed rigged player model while preserving the existing small map and offline setup.
4. Validate server-authoritative care/build behavior and state replication across two clients.
5. Test animal movement around a small enclosure, then evaluate persistence and dedicated-server packaging.


[Session handoff](SESSION-HANDOFF.md) · [Roadmap](../../ROADMAP.md) · [Decisions](DECISIONS.md)
