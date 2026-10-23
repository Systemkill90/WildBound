# Greenveil exploration asset inventory

Inspected October 22, 2026 in the local development environment. This is an availability and provenance audit, not a purchase receipt or a grant of redistribution rights.

| Local source | Available content | Exploration use and boundary |
| :-- | :-- | :-- |
| `Assets/PolyHaven/ForestGround01` | Ground PBR textures; existing imported floor/path materials | Terrain and walking trail. [Poly Haven CC0 terms](https://polyhaven.com/license) permit redistribution. |
| `Assets/PolyHaven/fern_02`, `shrub_02` | Fern and shrub FBX/textures | Instanced understory; existing CC0 materials now have instancing usage enabled. |
| `Assets/PolyHaven/rock_moss_set_02`, `tree_stump_01` | Mossy rocks and stump FBX/textures | Rocks and woodland dressing. CC0. |
| `Assets/PolyHaven/wooden_bowl_01`, `wooden_bucket_01` | Household prop FBX/textures | Cottage supply props. CC0; decorative only. |
| `Assets/PolyHaven/TreeSmall02` | Additional tree FBX/textures | Inspected, not required by this slice; keep the selected canopy cohesive. |
| `Assets/Samples/Content/Megascans` | Electric Dreams hornbeam canopy, Kikuyu grass, clover; many additional forest/rock/landscape assets | Two hornbeam meshes, two grass meshes and one clover mesh selected. Sample source stays in its local installation, junctioned into the project. Neither the sample maps nor its source meshes/materials/textures are added to Git. |
| `Assets/Samples/Content/Megascans/Surfaces/SwampWater` | Swamp-water normal texture | Referenced by the original Greenveil creek material for local testing. Keep the source texture and Epic sample installation local; the authored material does not embed or redistribute that texture. Confirm the owner's Fab/Epic entitlement before any external package distribution. |
| `Assets/Samples/Content/GV_FreeShrubsPack` | Wind-authored shrub pack | Three shrub variants selected, with distance culling. Source remains local. |
| Engine-bundled `Characters/Mannequins` | Quinn rig and unarmed locomotion | Controllable temporary player; locally installed using the existing helper. Source remains ignored. |
| `Assets/Grab3D/WeepingWillow` | FBX, manifest and local `LICENSE.txt` declaring CC0 | Inspected and excluded: prior visual review rejected its stylized silhouette. |
| Local Animal Variety Pack and standing-deer source | Existing animal art | Excluded from authored exploration actors. No animal gameplay work is part of this branch. Existing legacy class references can still cause unused prototype assets to cook. |
| `docs/art/concept-atlas` | Biome, equipment, creature and costume illustrations | Reference images only. No illustration is treated as a mesh, rig or implemented item. |

## Original placeholders

`Scripts/Editor/CreateGreenveilExploration.py` creates original terrain, creek ribbon and trail geometry, plain materials, timber cottage/bridge/fence/shelter modules and tool silhouettes. Engine cube references supply simple geometry; no sample building source is copied. The terrain is a collision-enabled static heightfield mesh, not voxel terrain or an editable Unreal Landscape.

## Greenveil style anchor

Use the [Greenveil Basin concept sheet](concept-atlas/biomes-atlas.webp) and [biome notes](../world/biomes.md) as the art-direction source: pastoral, fertile and settled; rolling meadow, birch and orchard groves, a clear stream, flower banks, mossy stone, practical timber/stone buildings, warm honey sunlight and restrained ecology-linked magic. This should be a realistic game environment with a quiet fantasy layer, not a uniformly dark forest or generic Megascans showcase. Electric Dreams supplies production-quality foliage, terrain and material craft; its darker sample grade is a reference for asset fidelity, while Greenveil keeps the brighter pastoral palette and lived-in settlement composition. The board is concept art, not a literal asset checklist.

The local sample also contains unselected forest sets that may support this pass: `Megascans/3D_Assets/ForestGround`, `ForestTerrain`, `MossyForestRoots`, `OldFallenTree`, `LargeFallenTree`, `ForestRockFormation`, and `MossyForestRock`; plant sets include `3D_Plants/GroundCover`, `DeadLeaves`, and additional fern variants. They remain local sample references until deliberately added to a verified Greenveil map. The authored Electric Dreams PCG forest breakdown is a candidate bounded base, not a direction to ship its entire sample world.

The original Greenveil exploration map and its first generated asset set remain preserved. The newer `GreenveilExplorationPolish` map and 11 original generated assets are also staged as Unreal binaries through Git LFS, alongside four reviewed CC0 material fixes. The maps reference local source-restricted content; another checkout still needs the licensed local installations. The local `GreenveilField.umap` user edit is intentionally excluded.

## License evidence and distribution

[Electric Dreams listing](https://www.fab.com/listings/d79688f5-29be-4fb2-a650-2d4a813f5306) and [Free Shrubs listing](https://www.fab.com/listings/7ca465ab-fb9c-4d6b-bddb-82c20f604657) identify the installed products. Their public pages did not expose account-specific acquisition terms during this check. Earlier project records describe acquisition through the owner's Epic/Fab account; receipts are not present in this repository. Do not treat the older generic “Fab Standard License” table entry as independent proof of the exact historical entitlement.

The [Fab license summary](https://www.fab.com/eula) allows incorporation into projects and prohibits standalone redistribution. Keep the stricter local-source boundary for this workshop. The Windows demo is a local cooked project package, not a public source-content release. Review the owner's actual acquisition terms before distributing that package outside the workshop.

[Asset credits](ASSET-CREDITS.md) · [Current state](../project/CURRENT-STATE.md)
