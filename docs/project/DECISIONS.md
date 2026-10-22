# Decision record

| Date | Decision | Reason |
| :-- | :-- | :-- |
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

Open: voxel implementation, offline care, world scale, player capacity, genetics depth, full rig/animation pipeline, persistence, platform scope, and distribution license.
