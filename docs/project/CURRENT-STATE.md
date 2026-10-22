# Wildbound current state

Updated: October 21, 2026.

## Latest playable character and animal pass — October 22

- The close-range Electric Dreams preview is running again at native 1920×1080 in a window. `WildboundEditor` compiled successfully on UE 5.8.4 before launch.
- Replaced the player’s floating sphere with Unreal’s bundled rigged Quinn mannequin and its Unarmed locomotion Animation Blueprint. Run `Tools/Install-PrototypeCharacterAssets.ps1` once on a checkout; it copies the engine-bundled 125 MB character pack into ignored local `Content/Characters/Mannequins/` while preserving the `/Game/Characters/...` asset paths. No engine assets are committed to Git. This is a development mannequin, not Wildbound’s final homesteader art.
- Set the player and deer capsules to the Pawn collision profile and tuned Character Movement step height, walkable slope and braking. Converted the deer from raw actor translation to `ACharacter` movement, enabling swept collision and floor following, automatic AI-controller possession, direction-facing locomotion and a blocked-path retarget timeout.
- The live startup log confirmed the deer spawned with `AIController_0`; consecutive screenshots showed it walking from the bank into the creek and changing direction. The window rendered the Quinn mesh with the authored forest and HUD. This visually verifies the updated movement path and mesh loading; a full collision-course, movement-input, care and network test has not been run in this pass.

## Latest local preview — Electric Dreams close-range forest base

- Wildbound now uses Epic's authored close-range PCG forest at `/Game/Levels/PCG/ElectricDreams_PCGCloseRange` instead of the generated shrub-ring clearing. This test level has 110 actors and an authored player start; the larger PCG level has 392 actors plus 593 Nanite meshes, and the full `ElectricDreams_Env` world has 15,244 actors. Both larger levels are deliberately excluded from the default after memory-heavy first-run rebuilds.
- The Wildbound C++ Editor target compiled and the map launched at native 1920×1080 with Wildbound's third-person pawn, animal and debug HUD. The sample map overrides its GameMode, so the launcher explicitly selects `/Script/Wildbound.WildboundPrototypeGameMode` via its URL.
- The sample is installed locally at `<local-project-root>\Assets\Samples\ElectricDreamsEnv.uproject`. `Tools/Link-ElectricDreamsSampleContent.ps1` links local sample folders into the project without copying or publishing Epic files. The sample content stays outside Git; another checkout needs the sample installed and linked locally.
- The forest is substantially more detailed than the generated clearing. The sample still displays a ray-tracing geometry-budget warning; frame time has not been measured. The player is now the temporary Quinn mannequin described above.
- The 392-actor PCG level still caused a 593-mesh Nanite rebuild and approached the machine's commit limit, so it was stopped. Use the close-range level, which has rendered successfully in a prior Wildbound run, while evaluating visual quality and performance.

## Verified project and machine setup

- Public repository: [Systemkill90/WildBound](https://github.com/Systemkill90/WildBound). Build checkout: `<local-project-root>\Project`; clean synced clone: `<local-project-root>\Source`.
- Unreal Engine 5.8.4; Visual Studio 2022; MSVC toolchain; Windows SDK 10.
- `WildboundEditor` and game targets compile. The latest Win64 Development package cooked 685 packages, archived to `<local-project-root>\Builds\WildBoundPreAlpha5\Windows\Wildbound.exe`, and launched windowed at 1920×1080 with 100% screen percentage, dynamic resolution disabled, and a 60 FPS cap (generated output is not committed).
- Startup log confirms `/Game/Maps/GreenveilField` loaded in the new package. Windows Security continues to show its firewall prompt over the game; the game’s offline preview needs no network permission. No 1080p frame-time benchmark has been taken.
- A listen-server smoke test accepted two simulated clients. This verifies connection acceptance only, not gameplay replication.
- The opt-in scripted movement/camera test passed in the live game: 547.4 cm planar character movement, 55° PlayerController camera yaw change, and grounded Walking mode. It uses the real Character Movement input path and requires no keyboard/mouse input; launch with `Tools/Start-Wildbound.ps1 -AutoMovementTest` to repeat it. Normal preview is currently running without the test flag.
- Latest live-scene polish adds a high-priority, unbound field color grade (subtle exposure compensation, local highlight/shadow contrast recovery, restrained saturation and bloom) and a compact Wildbound HUD. The launcher suppresses Unreal on-screen debug messages so the red sample RT-residency warning no longer obscures the view; the diagnostic remains in the log and its underlying 171 MiB / 400 MiB budget condition is not claimed fixed. The screenshot was captured from the actual 1920×1080 game window; no FPS benchmark was taken.
- Static scaffold verification passed 58 checks. Native tests passed: 34 animal simulation, 22 snapshot validation, and 13 placement checks.
- Greenveil is a saved 60 m clearing with imported ground, foliage and props, lighting, trail, player start, HUD and deer. The latest local map uses 72 mature European hornbeam meshes (two crown variants) in irregular three-row rings, 12 fern/shrub groupings, eight mossy rocks, four stumps and locally imported wind shrubs. The trees use Nanite-enabled meshes and their seasonal two-sided foliage materials. The added sample binaries remain local and are excluded from Git.
- The generated Greenveil map still has a flat starting floor and is separate from the current Electric Dreams preview. The player model and deer movement changes above apply to the live sample-backed map. A 60 FPS launch cap is not a performance benchmark.
- Earlier Greenveil work used a ground-probe deer mover; the current deer actor now uses Character Movement with auto-possession and swept capsule collision. The October 22 preview visibly showed movement on the creek bed; broader terrain and obstacle traversal still need playtesting.

## Authored and compiled

- Server-updated animal needs, stress/trust rules and owner-controller care requests with preliminary range, line-of-sight and supply checks.
- Third-person pawn, camera, debug HUD, temporary 1 m snapped construction blocks, collision ground and game-mode bootstrap.
- Deer skeletal mesh with capsule collision, server-driven ground-probed local wandering and idle/walk/run sequences from a local Fab asset pack. The editor and game compile and the package cooks with these references. Confirm visual animation in the standalone game; full navigation remains future work.
- 72 Electric Dreams European hornbeam tree instances across three rows. Their static meshes and dependencies are migrated locally into ignored `Content/`; `Scripts/Editor/ImportElectricDreamsTrees.py` documents how to repeat that step from the local sample project.
- Forest floor/foliage and starter props from Poly Haven CC0 assets; supplemental doe and wind shrubs come from local Fab imports. See [asset credits](../art/ASSET-CREDITS.md). Fab source files are ignored by Git and are not redistributed.
- PC-first project. Xbox is only a future feasibility evaluation.

## Still requires hands-on playtest or implementation

- Keyboard movement, jump and camera in this exact packaged checkout.
- Feeding, watering, reassurance, supply decrement, needs changes, stress and trust outcomes in live play.
- Block placement/removal, collision, and visible floor alignment in live play.
- Actual replication of animal values, care side effects and placed blocks. The two-client test joined clients but did not issue gameplay actions.
- Dedicated server build, world persistence/recovery, real inventory, animal navigation, grazing, breeding and enclosure behaviors.
- Playtest collision traversal, player input, deer grounding and imported deer animations on uneven ground; replace the temporary mannequin with Wildbound homesteader art after movement feels stable.

Do not infer that gameplay works solely from source or compilation. The compiled/packaged result is a real first prototype, but the acceptance cases above are unverified until actually played.

## Local launch

The current local preview is launched by `Tools/Start-Wildbound.ps1` from `<local-project-root>\Project`, using `/Game/Levels/PCG/ElectricDreams_PCGCloseRange` and Wildbound's GameMode override. It runs windowed at 1920×1080, with screen percentage at 100%, dynamic resolution disabled and a 60 FPS cap. A cap is not a measured frame rate; verify current controls and performance in the live window. See [the playtest guide](../developers/PROTOTYPE-PLAYTEST.md).

## New pre-production concept references (October 21, 2026)

The GitHub [illustrated concept atlas](../art/concept-atlas/README.md) contains eight art studies depicting twenty proposed creatures, candidate biomes, starter tools and both male/female homesteader costume directions. These are **visual proposals**, not playable content or an approved asset list. No UE compilation, gameplay or multiplayer tests were performed for this art update.

## Next tasks

1. Playtest capsule collision around rocks, logs and foliage, plus movement, deer grounding, care and block placement in this sample-backed map.
2. Reduce the full sample level to a smaller authored Greenveil slice after confirming art direction and performance.
3. Replace the temporary engine Quinn mannequin with a licensed Wildbound homesteader model and animation set after the core movement feels stable.
4. Validate server-authoritative care/build behavior and state replication across two clients.
5. Test animal movement around a small enclosure, then evaluate persistence and dedicated-server packaging.


[Session handoff](SESSION-HANDOFF.md) · [Roadmap](../../ROADMAP.md) · [Decisions](DECISIONS.md)
