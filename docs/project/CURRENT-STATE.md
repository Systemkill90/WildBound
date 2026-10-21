# Wildbound current state

Updated: October 20, 2026.

## Verified project and machine setup

- Public repository: [Systemkill90/WildBound](https://github.com/Systemkill90/WildBound), checked out at `<local-project-root>\Source`.
- Unreal Engine 5.8.4; Visual Studio 2022; MSVC toolchain; Windows SDK 10.
- `WildboundEditor` and the game target compile successfully. The Windows Development package built and cooked successfully with 543 runtime packages / about 145 MiB of cooked content.
- Packaged game launched locally in a window, and Greenveil loaded. The white-screen defect was fixed by correcting generated foliage mobility and calibrating exposure/fog. The rebuilt standalone package visibly renders sky, ground and set dressing; startup log confirms `/Game/Maps/GreenveilField` loaded. Current local package: `<local-project-root>\Builds\WildBoundGreenveil\Windows\Wildbound.exe` (generated output is not committed).
- A listen-server smoke test accepted two simulated clients. This verifies connection acceptance only, not gameplay replication.
- Static scaffold verification passed 58 checks. Native tests passed: 34 animal simulation, 22 snapshot validation, and 13 placement checks.
- Greenveil is a saved 60 m clearing with imported CC0 ground, foliage and props, lighting, trail, a player start, HUD and deer mesh. The map generator saved 65 actors.
- The scene is still a rough prototype and does not meet the intended visual quality. The local Electric Dreams close-range preview held 60 FPS in a 1920×1080 output window at 60% TSR (1152×648 internal) with Medium scalability settings; the overlay showed 12.28 ms GPU time. Sustained traversal has not been benchmarked.
- Deer spawn now snaps to a nearby walkable WorldStatic surface, and server wandering only accepts ground steps within bounded height and slope limits. Both the Electric Dreams plugin target and WildboundEditor compiled; live preview showed the deer moving along the creek bank with its feet on the ground.

## Authored and compiled

- Server-updated animal needs, stress/trust rules and owner-controller care requests with preliminary range, line-of-sight and supply checks.
- Third-person pawn, camera, debug HUD, temporary 1 m snapped construction blocks, collision ground and game-mode bootstrap.
- Deer static mesh with capsule collision and server-driven, ground-probed local wandering. It still has no skeletal walk animation or full navigation.
- Forest floor/foliage and starter props from Poly Haven CC0 assets; deer model from an Innerscene CC0 download. See [asset credits](../art/ASSET-CREDITS.md).
- PC-first project. Xbox is only a future feasibility evaluation.

## Still requires hands-on playtest or implementation

- Keyboard movement, jump and camera in this exact packaged checkout.
- Feeding, watering, reassurance, supply decrement, needs changes, stress and trust outcomes in live play.
- Block placement/removal, collision, and visible floor alignment in live play.
- Actual replication of animal values, care side effects and placed blocks. The two-client test joined clients but did not issue gameplay actions.
- Dedicated server build, world persistence/recovery, real inventory, animal navigation, grazing, breeding and enclosure behaviors.
- Replace the primitive player pawn with a proper rigged character. Add a rigged deer with walk/idle cycles; its current ground following has only been observed along the sample creek bank.

Do not infer that gameplay works solely from source or compilation. The compiled/packaged result is a real first prototype, but the acceptance cases above are unverified until actually played.

## Local launch

At the **October 20 desktop handoff**, a preview was reported open from `<local-project-root>\Assets\Samples\ElectricDreamsEnv.uproject` on `/Game/Levels/PCG/ElectricDreams_PCGCloseRange`; it used 1920×1080 output, a 60 FPS cap and local Medium scalability settings. **Its present running state has not been checked in this documentation audit.** The separately packaged Wildbound build was reported at `<local-project-root>\Builds\WildBoundGreenveil\Windows\Wildbound.exe`; availability on the machine has not been rechecked. Source checkout launch helper: [Tools/Start-Wildbound.cmd](../../Tools/Start-Wildbound.cmd). See the playtest guide in docs/developers/PROTOTYPE-PLAYTEST.md.

## New pre-production concept references (October 21, 2026)

The GitHub [illustrated concept atlas](../art/concept-atlas/README.md) contains eight art studies depicting twenty proposed creatures, candidate biomes, starter tools and both male/female homesteader costume directions. These are **visual proposals**, not playable content or an approved asset list. No UE compilation, gameplay or multiplayer tests were performed for this art update.

## Next tasks

1. Migrate a bounded Electric Dreams forest slice into the Wildbound project and verify the packaged result; keep experimental sample systems optional.
2. Playtest controls, care, animal needs and block placement in the current preview, then fix reproduced defects.
3. Add rigged player and deer assets with documented licenses; preserve grounded deer movement and add locomotion.
4. Validate server-authoritative care/build behavior and state replication across two clients.
5. Test animal movement around a small enclosure, then evaluate persistence and dedicated-server packaging.


[Session handoff](SESSION-HANDOFF.md) · [Roadmap](../../ROADMAP.md) · [Decisions](DECISIONS.md)
