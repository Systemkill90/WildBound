# Decision record

| Date | Decision | Reason |
| :-- | :-- | :-- |
| 2026-10-22 | Center Greenveil's next bounded playable slice on a small starter village | The player needs believable, useful testing grounds: arrival point, enterable home/work spaces, garden edge, creek crossing, and a short forest loop. Keep animals deferred and preserve the existing tested map/package as rollback. |
| 2026-10-22 | Evaluate the free Quixel Medieval Village Megascans Sample as a village shell, not as a drop-in final map | It may provide realistic authored buildings and street dressing missing from the Electric Dreams forest sample; verify actual downloaded content, license, UE 5.8 behavior, and bounded performance before adoption. |
| 2026-10-23 | Acquire the free Medieval Village Megascans Sample as a local, isolated source project | Fab completed the download and generated a separate UE 5.8-associated project containing five village World Partition maps plus a crow debug map. The cached package source identifies UE 5.3; inspect the actual maps and check compatibility before adapting assets. Keep the licensed content local and out of Git. |
| 2026-10-22 | Keep Unreal source, engine, licensed assets, packages and local-model data in separately configured local storage; keep machine-specific locations out of the public project | Reduce Windows-drive pressure without moving active source assets to removable/network storage |
| 2026-10-22 | Prioritize populated Greenveil exploration; pause animal gameplay and PR #9 | Explicit owner correction supersedes the earlier care/enclosure implementation sequence |
| 2026-10-22 | Author a new 180 × 160 m map with selected local assets, HISM vegetation and original structure placeholders | Bound memory/performance, preserve the old map and packages, and avoid loading the full sample world |
| 2026-10-22 | Disable hardware ray tracing; use Medium native-1080p as the normal demo launch | Actual packaged tests remain below the 60 FPS target; continue profiling within the bounded zone |
| 2026-10-20 | Independent public Wildbound repository | Dedicated record for this original game |
| 2026-10-20 | Unreal Engine 5.8.4 for current Windows prototype | Installed engine and MSVC toolchain compile/package the editor and game; keep version evidence explicit |
| 2026-10-20 | UE targets use BuildSettingsVersion V7 and Unreal 5.8 include order | Avoid shared-target environment conflicts in installed UE 5.8.4 |
| 2026-10-20 | Small saved Greenveil forest clearing is the first test map | A repeatable, bounded real map makes interaction and grounding issues easy to inspect |
| 2026-10-20 | Poly Haven environment assets and Innerscene deer model are CC0 | Use free redistributable source art and keep attribution/license records in the repository |
| 2026-10-20 | First playable remains PC-first; Xbox is feasibility-only | Console access, certification and performance are future work |
| 2026-10-20 | Animal care is a core pillar | Wildlife, farm animals, trust, breeding and husbandry shape daily play |
| 2026-10-20 | Dedicated cooperative worlds are a target | Shared homes require authoritative simulation and recovery |
| 2026-10-20 | Environmental magical realism | Grounded ecology with Greenveil warmth and March unease |
| 2026-10-20 | No voxel plugin or license selected | Evaluate technical fit and rights first; current blocks are only a temporary proof |
| 2026-10-20 | Static deer movement is temporary | Replace root-sliding placeholder movement with a grounded rig and locomotion before judging animal feel |
| 2026-10-20 | Use Epic's free Electric Dreams sample as Greenveil's visual starting point | Retain Wildbound gameplay code; migrate a small forest environment and assets instead of building the scene from unrelated props. Avoid requiring experimental PCG/Substrate features for core runtime gameplay. |
| 2026-10-21 | Use Electric Dreams' authored forest environment as the local pre-alpha visual base | The generated clearing and shrub ring missed the realism goal. Launch the authored landscape with Wildbound's GameMode; keep Epic's sample files local and obtain them through the owner's Epic installation rather than redistributing them through Git. Derive a bounded Greenveil slice after checking readability and native-1080p performance. |
| 2026-10-23 | Test Wildbound in a representative authored biome before expanding the mechanics | The generated Greenveil scene verifies traversal but its flat terrain treatment, random foliage scatter, mannequin and box-built cottages are visibly graybox. Inspect the local Electric Dreams forest/PCG breakdown and use a bounded authored slice as the environment base, preserving the current map/package as rollback. Retain Wildbound controls and interaction code; no animal gameplay. Do not benchmark or render while local Ollama inference is active. |
| 2026-10-23 | Do not save a full copy of the Electric Dreams PCG forest as the Greenveil candidate | Unreal rebuilt heavy Nanite data during a whole-map copy and exceeded the available system commit before writing the candidate. Keep the source untouched; select and render-test a bounded source region first, then derive a smaller map without serializing the full generated world. |

Open: voxel implementation, offline care, world scale, player capacity, genetics depth, full rig/animation pipeline, persistence, platform scope, and distribution license.
