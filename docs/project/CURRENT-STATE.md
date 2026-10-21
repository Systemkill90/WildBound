# Wildbound current state

Updated: October 20, 2026.

## Verified project and machine setup

- Public repository: [Systemkill90/WildBound](https://github.com/Systemkill90/WildBound), checked out at `D:\WildBound\Source`.
- Unreal Engine 5.8.4; Visual Studio Community 2022 17.14.42; MSVC 14.44.35207; Windows SDK 10.0.26100.0.
- `WildboundEditor` and the game target compile successfully. The Windows Development package built and cooked successfully with 543 runtime packages / about 145 MiB of cooked content.
- Packaged game launched locally in a window, and Greenveil loaded. The white-screen defect was fixed by correcting generated foliage mobility and calibrating exposure/fog. The rebuilt standalone package visibly renders sky, ground and set dressing; startup log confirms `/Game/Maps/GreenveilField` loaded. Current local package: `D:\WildBound\Builds\WildBoundGreenveil\Windows\Wildbound.exe` (generated output is not committed).
- A listen-server smoke test accepted two simulated clients. This verifies connection acceptance only, not gameplay replication.
- Static scaffold verification passed 58 checks. Native tests passed: 34 animal simulation, 22 snapshot validation, and 13 placement checks.
- Greenveil is a saved 60 m clearing with imported CC0 ground, foliage and props, lighting, trail, a player start, HUD and deer mesh. The map generator saved 65 actors.
- The scene is still a rough prototype and does not meet the intended visual quality. Evaluate a free Unreal sample environment as Greenveil's visual foundation before calling this a polished playtest world.

## Authored and compiled

- Server-updated animal needs, stress/trust rules and owner-controller care requests with preliminary range, line-of-sight and supply checks.
- Third-person pawn, camera, debug HUD, temporary 1 m snapped construction blocks, collision ground and game-mode bootstrap.
- Deer static mesh with capsule collision and server-driven local wandering. It slides in a static pose; there is no skeletal walk animation.
- Forest floor/foliage and starter props from Poly Haven CC0 assets; deer model from an Innerscene CC0 download. See [asset credits](../art/ASSET-CREDITS.md).
- PC-first project. Xbox is only a future feasibility evaluation.

## Still requires hands-on playtest or implementation

- Keyboard movement, jump and camera in this exact packaged checkout.
- Feeding, watering, reassurance, supply decrement, needs changes, stress and trust outcomes in live play.
- Block placement/removal, collision, and visible floor alignment in live play.
- Actual replication of animal values, care side effects and placed blocks. The two-client test joined clients but did not issue gameplay actions.
- Dedicated server build, world persistence/recovery, real inventory, animal navigation, grazing, breeding and enclosure behaviors.
- Replace the primitive player pawn with a proper rigged character. Add a rigged, grounded deer with walk/idle cycles; user feedback specifically noted the earlier demo's floating, motionless deer and underspecified environment.

Do not infer that gameplay works solely from source or compilation. The compiled/packaged result is a real first prototype, but the acceptance cases above are unverified until actually played.

## Local launch

The corrected packaged build is at `D:\WildBound\Builds\WildBoundGreenveil\Windows\Wildbound.exe` and has been left open for the owner to inspect. Source checkout launch helper: [`Tools/Start-Wildbound.cmd`](../../Tools/Start-Wildbound.cmd). See [playtest guide](../developers/PROTOTYPE-PLAYTEST.md).

## Next tasks

1. Evaluate Epic's free Electric Dreams sample for a bounded small-forest environment and asset foundation; keep Wildbound gameplay code and avoid experimental PCG/Substrate systems as required runtime dependencies.
2. Build and launch an attractive, small Greenveil test clearing from those assets, then check performance.
3. Playtest the package and fix reproduced control, floor-collision, care and building issues.
4. Upgrade deer and player to appropriate rigged assets and animation before enlarging the map.
5. Validate server-authoritative interactions and state replication across two clients.
6. Build the dedicated server and implement save/restart recovery after core state is confirmed.

[Session handoff](SESSION-HANDOFF.md) · [Roadmap](../../ROADMAP.md) · [Decisions](DECISIONS.md)
