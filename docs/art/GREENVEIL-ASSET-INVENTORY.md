# Greenveil exploration asset inventory

Inspected October 23, 2026 in the local development environment. This is an availability and provenance audit, not a purchase receipt or a grant of redistribution rights.

| Local source | Available content | Exploration use and boundary |
| :-- | :-- | :-- |
| `Assets/PolyHaven/ForestGround01` | Ground PBR textures; existing imported floor/path materials | Terrain and walking trail. [Poly Haven CC0 terms](https://polyhaven.com/license) permit redistribution. |
| `Assets/PolyHaven/fern_02`, `shrub_02` | Fern and shrub FBX/textures | Instanced understory; existing CC0 materials now have instancing usage enabled. |
| `Assets/PolyHaven/rock_moss_set_02`, `tree_stump_01` | Mossy rocks and stump FBX/textures | Rocks and woodland dressing. CC0. |
| `Assets/PolyHaven/wooden_bowl_01`, `wooden_bucket_01` | Household prop FBX/textures | Cottage supply props. CC0; decorative only. |
| `Assets/PolyHaven/TreeSmall02` | Additional tree FBX/textures | Inspected, not required by this slice; keep the selected canopy cohesive. |
| Poly Haven CC0 2K FBX sources: `grass_medium_01`, `flower_gazania`, `flower_ursinia`, `boulder_01`, `root_cluster_01`, `modular_wooden_pier` | Six model/texture sets; about 172 MB source; 40 Unreal candidate assets imported locally | Import commandlet passed in UE 5.8.4. Candidates are isolated under `/Game/Wildbound/Art/Environment/PolyHavenCandidates`; no map references them yet. All source textures are imported. The flower FBX materials have empty texture-parameter bindings and need a foliage material pass before use. Meshes/materials/textures remain local and are not committed. Optional assets, not a fixed Greenveil species/palette decision. [Source pages and CC0 terms](ASSET-CREDITS.md). |
| Electric Dreams `ElectricDreams_PCGForest` breakdown map | Authored two-tile landscape and PCG forest blueprint, with Epic/Fab foliage, rock and ground assets | Read-only UE 5.8.4 inventory: 17 top-level actors; the forest blueprint has 391 mesh components, about 572,150 instances and 164 unique mesh paths across a roughly 512 × 512 m area. Use it as a source for selected assemblies and composition; direct use is too large and dense for the bounded Greenveil test zone. No sample map was saved or redistributed. |
| `Assets/Samples/Content/Megascans` | Electric Dreams hornbeam canopy, Kikuyu grass, clover, forest-ground material, elderberry and fern; many additional forest/rock/landscape assets | Two hornbeam meshes, two grass meshes and one clover mesh are in the existing bounded scene. The current generator selects `MI_ForestGround_01`, `SM_Elderberry_03`, and `SM_Fern_01` to replace the basin's broad brown floor and layer the understory; regeneration and packaged runtime review are still pending. Sample source remains local and is not added to Git. |
| Local Medieval Village Megascans Sample installation | Installed house façade, gable, board-wall, roof, shutter, and well meshes | The current generator assembles these source meshes into cottage shells and a shared well. The source installation is outside the project checkout. Verify account-specific acquisition terms before any external package distribution. |
| `Content/Asmbly/Assemblies` | Existing local fern, small-rock, and riverbank grouping actors | Selected by the current generator for clustered forest-floor dressing. Original source and license evidence have not been located; keep local and exclude from redistribution pending provenance review. |
| `Assets/Samples/Content/Megascans/Surfaces/SwampWater` | Swamp-water normal texture | Referenced by the original Greenveil creek material for local testing. Keep the source texture and Epic sample installation local; the authored material does not embed or redistribute that texture. Confirm the owner's Fab/Epic entitlement before any external package distribution. |
| `Assets/Samples/Content/GV_FreeShrubsPack` | Wind-authored shrub pack | Three shrub variants selected, with distance culling. Source remains local. |
| Engine-bundled `Characters/Mannequins` | Quinn rig and unarmed locomotion | Controllable temporary player; locally installed using the existing helper. Source remains ignored. |
| `Assets/Grab3D/WeepingWillow` | FBX, manifest and local `LICENSE.txt` declaring CC0 | Inspected and excluded: prior visual review rejected its stylized silhouette. |
| Local Animal Variety Pack and standing-deer source | Existing animal art | Excluded from authored exploration actors. No animal gameplay work is part of this branch. Existing legacy class references can still cause unused prototype assets to cook. |
| `docs/art/concept-atlas` | Biome, equipment, creature and costume illustrations | Reference images only. No illustration is treated as a mesh, rig or implemented item. |

## Original placeholders

`Scripts/Editor/CreateGreenveilExploration.py` creates original terrain, creek ribbon, walking trails, bridges, and some domestic details. The current generator composes locally installed Medieval Village mesh modules into cottage shells and uses local environment assemblies for selected foliage, rock, and creek-bank clusters; clean checkouts without those installations use fallback house geometry and skip missing assemblies. The terrain is a collision-enabled static heightfield mesh, not voxel terrain or an editable Unreal Landscape. The current source changes have not yet been regenerated into a runtime-reviewed package.

## Greenveil style anchor

Use the [Greenveil Basin concept sheet](concept-atlas/biomes-atlas.webp) and [biome notes](../world/biomes.md) as the current art-direction source: pastoral, fertile and settled; rolling meadow, birch and orchard groves, a clear stream, flower banks, mossy stone, practical timber/stone buildings, warm honey sunlight and restrained ecology-linked magic. Aim for realistic game-environment craft with a quiet fantasy layer. This is a flexible direction, not a locked specification: evolve it as more details, assets, playtests and ideas are added. Electric Dreams supplies production-quality foliage, terrain and material craft; its darker sample grade is a reference for asset fidelity, not a required Greenveil palette. The board is concept art, not a literal asset checklist.

The local sample also contains unselected forest sets that may support this pass: `Megascans/3D_Assets/ForestGround`, `ForestTerrain`, `MossyForestRoots`, `OldFallenTree`, `LargeFallenTree`, `ForestRockFormation`, and `MossyForestRock`; plant sets include `3D_Plants/GroundCover`, `DeadLeaves`, and additional fern variants. They remain local sample references until deliberately added to a verified Greenveil map. The authored Electric Dreams PCG forest breakdown is a candidate bounded base, not a direction to ship its entire sample world.

The original Greenveil exploration map and its first generated asset set remain preserved. The newer `GreenveilExplorationPolish` map and 11 original generated assets are also staged as Unreal binaries through Git LFS, alongside four reviewed CC0 material fixes. The maps reference local source-restricted content; another checkout still needs the licensed local installations. The local `GreenveilField.umap` user edit is intentionally excluded.

## License evidence and distribution

[Electric Dreams listing](https://www.fab.com/listings/d79688f5-29be-4fb2-a650-2d4a813f5306) and [Free Shrubs listing](https://www.fab.com/listings/7ca465ab-fb9c-4d6b-bddb-82c20f604657) identify the installed products. Their public pages did not expose account-specific acquisition terms during this check. Earlier project records describe acquisition through the owner's Epic/Fab account; receipts are not present in this repository. Do not treat the older generic “Fab Standard License” table entry as independent proof of the exact historical entitlement.

The [Fab license summary](https://www.fab.com/eula) allows incorporation into projects and prohibits standalone redistribution. Keep the stricter local-source boundary for this workshop. The Windows demo is a local cooked project package, not a public source-content release. Review the owner's actual acquisition terms before distributing that package outside the workshop.

[Asset credits](ASSET-CREDITS.md) · [Current state](../project/CURRENT-STATE.md)
