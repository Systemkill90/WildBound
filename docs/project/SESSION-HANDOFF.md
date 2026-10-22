# Wildbound session handoff

Updated: October 22, 2026.

Read [Current state](CURRENT-STATE.md), [Decisions](DECISIONS.md) and [Roadmap](../../ROADMAP.md) before new work.

## October 22 character, collision and animal movement pass

- `WildboundEditor` compiled successfully on UE 5.8.4 and launched the close-range Electric Dreams map at native 1920×1080.
- The player now uses Unreal’s bundled Quinn rig and Unarmed locomotion Animation Blueprint. Install locally with `Tools/Install-PrototypeCharacterAssets.ps1`; it copies the engine’s 125 MB character pack to ignored `Content/Characters/Mannequins/`. Keep it local; those engine content files are not committed.
- Player and deer use Pawn-profile capsules with Character Movement collision. Deer now auto-possesses `AIController_0`, turns toward its wander input and moves through swept floor-following Character Movement instead of direct transform stepping.
- Live window screenshots several seconds apart showed the deer move down from the bank, across the creek and change direction. The player mesh and forest rendered. This pass did not run an exhaustive obstacle course or re-test care/build/network actions. The Quinn asset is a temporary developer mannequin, not final Wildbound character art.

## Delivered and verified

- Installed toolchain identified on the local development workshop: Unreal Engine 5.8.4, Visual Studio 2022, MSVC toolchain and Windows SDK 10.
- Fixed UE 5.8 target settings and C++ compile diagnostics. `WildboundEditor` and game build pass.
- Generated and saved `/Game/Maps/GreenveilField`: small forest clearing with real imported forest assets, floor, trail, set dressing, player start, deer and default game mode.
- Imported a CC0 deer static model and Poly Haven CC0 environment assets; credits/license record is in `docs/art/ASSET-CREDITS.md`.
- Packaged/cooked Win64 Development build successfully and launched it in a window. Local output: `<local-project-root>\Builds\WildBoundGreenveil\Windows\Wildbound.exe`.
- Static verification passed 58 checks; native simulation, snapshot and placement suites passed 34, 22 and 13 checks respectively.
- Packaged listen server accepted two simulated client connections. No gameplay RPC or replication assertions were run.
- Reproduced and fixed the white-screen defect through movable generated foliage and controlled exposure/lighter fog. Rebuilt the package and visually confirmed the standalone window renders; startup log confirms GreenveilField loaded.
- Owner feedback: use an official free Unreal environment as the visual starting point. Electric Dreams now serves as the bounded local preview; experimental PCG/Substrate features remain outside required Wildbound runtime systems.
- The 1920×1080 output held 60 FPS in the starting view with saved Medium scalability settings and 60% TSR (1152×648 internal); this is upscaled, not a native-1080p or traversal benchmark.
- Ground-probed deer placement and short-range wandering compiled in both the sample plugin and main Wildbound target. Live preview showed the deer moving along the creek bank with its feet grounded; the model still has no walk cycle.
- Updated README, roadmap and developer/project state documents to distinguish compile/package evidence from playtest evidence.

## October 21 asset-integration continuation

- Rebased local work onto current `origin/main` at `c193dc1` after discovering GitHub had advanced 105 commits beyond the original checkout. The older local build commit is preserved on `backup/asset-based-greenveil-2026-10-21`; do not force-push it.
- Integrated the local Fab Animal Variety Pack doe mesh with idle-breath, walk and run sequences; retained the CC0 standing deer as a fallback when that optional local pack is absent. Added 12 Free Shrubs Pack instances around the forest edge in the local generated map.
- Fab packs remain excluded from Git because their source files cannot be redistributed standalone. Asset references, attribution, optional shrub generation and fallback behavior are in the tracked source/docs; the locally generated map that contains Fab references remains uncommitted.
- Rebuilt `WildboundEditor` and the Win64 Development game, reran native suites (34/22/13), static source checks (58) and documentation links (169), then cooked 620 packages and launched `<local-project-root>\Builds\WildBoundPreAlpha2\Windows\Wildbound.exe`.
- PreAlpha5 is the latest package. It cooks 685 packages and is running windowed at 1920×1080, `r.ScreenPercentage=100`, dynamic resolution disabled and a 60 FPS cap; the cap is not evidence of a measured frame rate. A Windows Security firewall prompt still overlays the game; click Cancel to continue offline.

## Current owner playtest

The current launch target is the close-range Electric Dreams forest level, running with Wildbound's GameMode. It uses native 1920×1080, a 60 FPS cap and 100% screen percentage; no traversal frame-time measurement has been made. The window is running with the Quinn mannequin and wandering deer. Check capsule collisions around the roots/logs, player movement, feeding/watering, needs and block placement.

## Known visual and gameplay limits

- The player is now a rigged and animated engine Quinn mannequin, still temporary visual art rather than a finished Wildbound homesteader.
- The doe has a local skeletal mesh and idle/walk/run assets wired into the actor. The AI controller and character movement now visibly change position/direction in the live preview; test ground contact and obstacle response across the whole slice.
- Bowl and pail are environment props; no inventory or actual bowl-target interaction exists.
- Starter supplies and world state are in memory. Blocks are temporary cubes; no voxel terrain.
- White-screen issue is fixed. The current world renders, but still needs a better environmental foundation and visual review.
- Client connections were tested only. No action was sent to verify replication, denial logic, animal vitals or building state.

## Next implementation sequence

1. Playtest the player/deer capsule collision around sample roots, logs and foliage; verify movement, care, needs and block placement.
2. Measure native-1080p traversal frame time and assess the sample ray-tracing warning.
3. Source/import licensed Wildbound homesteader art and improve the small forest slice only after its packaged readability/performance is assessed.
4. Add two-client functional assertions for authoritative care and block replication.
5. Test animal movement around a small enclosure, then evaluate persistence and dedicated-server packaging.


Do not start a large world, major new systems, or expensive asset generation before this foundation behaves correctly.

## Documentation-only review — October 21, 2026

Developer setup, first-playable gates, system-status summaries, asset-rights wording and documentation navigation were updated against the recorded UE 5.8.4 prototype evidence. [Audit findings](DOCUMENTATION-AUDIT-2026-10-21.md) describe corrected drift and open security/configuration and reproducibility follow-ups. **No desktop check, new Unreal compile, game interaction test, server session or game feature implementation was performed in the documentation audit.** The next real work remains the hands-on Greenveil interaction acceptance in [Issue #2](https://github.com/Systemkill90/WildBound/issues/2).

## Concept art homepage addition — October 21, 2026

Eight generated art plates from the preceding design session were prepared as original-dimension, optimized WebP files and added to the GitHub homepage and [illustrated concept atlas](../art/concept-atlas/README.md) in one atomic repository update: four plates covering **20 creature ideas**, a six-biome mood board, one starter equipment sheet and two male/female homesteader costume/model-reference sheets. All are **concept art only**; no new Unreal characters, models, items, biomes or gameplay were implemented or tested. Existing decisions and the next practical milestone (Greenveil hands-on care/build validation) remain unchanged.

## Repository presentation refresh — October 21, 2026

The public `README.md` now opens with existing Wildbound concept art, a concise game introduction, simpler thematic navigation, an evidence-based prototype summary, and an expandable developer section. Added dedicated landing pages for art, the world, gameplay systems, and project records; reorganized the documentation hub and visually clarified the roadmap. This was **presentation/documentation work only**: no Unreal source changes, no new gameplay verification, and no changes to approved game lore. Draft speculative concepts remain in their review PRs. Next technical step remains [hands-on Greenveil care/build validation](https://github.com/Systemkill90/WildBound/issues/2).

## Greenveil canopy update — October 21, 2026

- Replaced the sparse tree line with 72 instances of two mature European hornbeam forest meshes from the local Electric Dreams sample, arranged in three irregular rows around the open animal-care meadow. The assets use the sample’s textured trunk, seasonal foliage, wind-capable materials and Nanite geometry. Meshes and dependencies are local-only; the public Git repository does not contain them.
- Removed the unsuccessful Grab3D willow experiment from the generated level. Its stylized drooping leaves did not fit Wildbound’s realism target.
- Regenerated and map-checked `/Game/Maps/GreenveilField` with zero Unreal map errors/warnings. Cooked 685 packages, archived `<local-project-root>\Builds\WildBoundPreAlpha5\Windows\Wildbound.exe`, and launched it windowed at 1920×1080 with 100% screen percentage, dynamic resolution disabled, and a 60 FPS cap.
- The Windows Security firewall prompt overlays the game. Click **Cancel** to reveal the offline demo. Do not treat the cap as a frame-rate measurement; gameplay interactions, doe animation and traversal performance remain untested in PreAlpha5.
- The generated map remains local because it includes local Fab asset references. The repeatable tree dependency migration helper is `Scripts/Editor/ImportElectricDreamsTrees.py` and expects the locally installed sample at `<local-project-root>\Assets\Samples\ElectricDreamsEnv.uproject`.

## Electric Dreams full-world foundation — October 21, 2026

- Owner rejected the generated shrub-ring visual and asked for a prebuilt world as the base. Inspection found `/Game/Levels/PCG/ElectricDreams_PCG` has 392 level actors (four landscape proxies) and a designated player start; the full `/Game/Levels/ElectricDreams_Env` has 15,244 actors.
- `Tools/Link-ElectricDreamsSampleContent.ps1` locally junctions the Epic sample's content folders into `Project/Content`; no Epic sample files are added to Git. A partial earlier migration is retained under `<local-project-root>\Cache\SampleContentLinkBackup-2026-10-21`.
- `/Game/Levels/ElectricDreams_Env` overrides its default GameMode with `GM_AnimSandbox_C`. `Tools/Start-Wildbound.ps1` now appends Wildbound's GameMode via a map URL option so the Wildbound pawn, deer, needs HUD and construction controls are used.
- `WildboundEditor` compiled successfully and the full level reached gameplay with the Wildbound HUD. The first image was from the sample's AnimSandbox GameMode and showed a camera under the level; after the override, the view showed the detailed forest/river environment and Wildbound HUD. The Wildbound pawn remains a primitive placeholder.
- The first override run showed sample ray-tracing and exposure-budget warnings. The sample-matched renderer configuration is now restored for the close-range level; its live HUD still shows a ray-tracing geometry-budget warning. The 15,244-actor main level caused an 829-mesh Nanite rebuild and nearly exhausted virtual-memory commit, so it was stopped. The smaller PCG forest map is the current default to bound the local test.
