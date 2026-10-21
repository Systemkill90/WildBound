# Wildbound current state

Updated: October 21, 2026.

## Verified project and machine setup

- Public repository: [Systemkill90/WildBound](https://github.com/Systemkill90/WildBound). Build checkout: `<local-project-root>\Project`; clean synced clone: `<local-project-root>\Source`.
- Unreal Engine 5.8.4; Visual Studio 2022; MSVC toolchain; Windows SDK 10.
- `WildboundEditor` and game targets compile. The latest Win64 Development package cooked 685 packages, archived to `<local-project-root>\Builds\WildBoundPreAlpha5\Windows\Wildbound.exe`, and launched windowed at 1920×1080 with 100% screen percentage, dynamic resolution disabled, and a 60 FPS cap (generated output is not committed).
- Startup log confirms `/Game/Maps/GreenveilField` loaded in the new package. Windows Security continues to show its firewall prompt over the game; the game’s offline preview needs no network permission. No 1080p frame-time benchmark has been taken.
- A listen-server smoke test accepted two simulated clients. This verifies connection acceptance only, not gameplay replication.
- Static scaffold verification passed 58 checks. Native tests passed: 34 animal simulation, 22 snapshot validation, and 13 placement checks.
- Greenveil is a saved 60 m clearing with imported ground, foliage and props, lighting, trail, player start, HUD and deer. The latest local map uses 72 mature European hornbeam meshes (two crown variants) in irregular three-row rings, 12 fern/shrub groupings, eight mossy rocks, four stumps and locally imported wind shrubs. The trees use Nanite-enabled meshes and their seasonal two-sided foliage materials. The added sample binaries remain local and are excluded from Git.
- The view now has a layered forest edge around the clear play space, replacing the isolated sapling silhouette and unsuccessful stylized willow experiment. It is still a rough prototype: the pawn is primitive, the starting floor is flat, and gameplay/animation quality needs hands-on iteration. A 60 FPS launch cap is not a performance benchmark.
- Deer spawn now snaps to a nearby walkable WorldStatic surface, and server wandering only accepts ground steps within bounded height and slope limits. Both the Electric Dreams plugin target and WildboundEditor compiled; live preview showed the deer moving along the creek bank with its feet on the ground.

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
- Replace the primitive player pawn with a proper rigged character. Test the imported doe animation and ground following on uneven terrain.

Do not infer that gameplay works solely from source or compilation. The compiled/packaged result is a real first prototype, but the acceptance cases above are unverified until actually played.

## Local launch

The current standalone build is running from `<local-project-root>\Builds\WildBoundPreAlpha5\Windows\Wildbound.exe` in a 1920×1080 window, forced to 100% screen percentage with dynamic resolution disabled and a 60 FPS cap. A Windows Security firewall prompt covers the game; click **Cancel** to reveal the offline preview. Movement, animal care, needs, deer animation, construction and measured performance remain unverified in this package. See [the playtest guide](../developers/PROTOTYPE-PLAYTEST.md).

## New pre-production concept references (October 21, 2026)

The GitHub [illustrated concept atlas](../art/concept-atlas/README.md) contains eight art studies depicting twenty proposed creatures, candidate biomes, starter tools and both male/female homesteader costume directions. These are **visual proposals**, not playable content or an approved asset list. No UE compilation, gameplay or multiplayer tests were performed for this art update.

## Next tasks

1. Reveal and playtest the running PreAlpha5 window: movement, animal care/needs, deer animation, block placement and forest readability; measure native-1080p frame rate during a short traversal.
2. Fix reproduced playtest defects, including any dark foliage, asset scale, collision or interaction problems.
3. Replace the primitive pawn with a free licensed rigged player model; keep the Greenveil slice small.
4. Validate server-authoritative care/build behavior and state replication across two clients.
5. Test animal movement around a small enclosure, then evaluate persistence and dedicated-server packaging.


[Session handoff](SESSION-HANDOFF.md) · [Roadmap](../../ROADMAP.md) · [Decisions](DECISIONS.md)
