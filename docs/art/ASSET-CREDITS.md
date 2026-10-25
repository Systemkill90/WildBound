# Prototype asset sources

**October 22 exploration audit:** see the [local asset inventory](GREENVEIL-ASSET-INVENTORY.md) for selected canopy/grass/clover, CC0 understory/props, original structure placeholders, mannequin and source-redistribution boundaries. The public Fab listings do not independently prove account-specific acquisition terms; the older generic license descriptions below should be read with that limitation. Concept images remain illustrations.

## Original pre-production artwork (October 21, 2026)

The eight images in [the illustrated concept atlas](concept-atlas/README.md) were generated for Wildbound during a ChatGPT design session and exported as optimized WebP art plates for this repository. They are not third-party Unreal store assets, engine models, or evidence of finished gameplay. Their creature names, biome titles, tools and costume details are creative proposals pending review. The AI-rendered captions may contain inaccuracies.

The imported runtime assets below have separate sources and licensing rules.

Wildbound keeps art provenance alongside the content. Approved imported Unreal assets are tracked with Git LFS. **LFS is a storage method, not a license**: only source art with valid redistribution rights belongs in the public repository. The presence of a prior credit entry is not a new legal verification.

| Asset set | Source | License | Use in Wildbound |
| :-- | :-- | :-- | :-- |
| Greenveil forest ground, ferns, shrubs, mossy rocks, stump, wooden bowl and bucket | [Poly Haven](https://polyhaven.com/) | [CC0](https://polyhaven.com/license) | Greenveil test-map environment and care-point dressing |
| Meadow grass, flowering groundcovers, boulder, root cluster and modular pier (2K FBX and texture sources; 40 Unreal candidate assets imported locally) | [Poly Haven](https://polyhaven.com/) — [Grass Medium 01](https://polyhaven.com/a/grass_medium_01), [Flower Gazania](https://polyhaven.com/a/flower_gazania), [Flower Ursinia](https://polyhaven.com/a/flower_ursinia), [Boulder 01](https://polyhaven.com/a/boulder_01), [Root Cluster 01](https://polyhaven.com/a/root_cluster_01), [Modular Wooden Pier](https://polyhaven.com/a/modular_wooden_pier) | [CC0](https://polyhaven.com/license) | Candidate-only; not placed in a map or committed. Flower texture parameters still need setup. |
| Standing deer | [Innerscene — Deer standing](https://www.innerscene.com/tools/library/3d-parts/deer-standing-35e2f5f6) | CC0, public domain dedication | First deer visual; the prototype supplies server-controlled wandering and care stats |
| Electric Dreams Environment (local import) | [Epic Games / Fab](https://www.fab.com/listings/d79688f5-29be-4fb2-a650-2d4a813f5306) | Account-specific terms are not independently verified here; keep source content local and do not redistribute it standalone | Two European hornbeam meshes already dress the Greenveil perimeter. The current bounded-map generator also selects its forest-ground material, elderberry, and fern assets for a layered pass; that authored change still needs regeneration and runtime review. Source binaries remain outside GitHub. |
| Medieval Village Megascans Sample (local installation) | Locally installed sample content | Account-specific terms are not present in this repository; keep source content local and do not redistribute it standalone | The current generator assembles cottage walls, gables, roof, shutters, and the shared well from installed sample meshes. Recheck acquisition terms before external distribution; generated-map use is not yet runtime-verified. |
| Local `Asmbly/Assemblies` environment actors | Existing local Unreal project content | Original source and license evidence are not recorded in this repository; do not redistribute the assets | Fern, small-rock, and creek-bank grouping actors are selected by the bounded Greenveil generator. Provenance review remains open. |
| Animal Variety Pack (local import) | [Protofactor Inc. on Fab](https://www.fab.com/listings/2dd7964c-a601-4264-a53d-465dcae1644c) | Fab Standard License; integrated use permitted, standalone source redistribution prohibited | Rigged doe mesh with idle-breath, walk and run sequences for the Greenveil prototype. Acquired through the user's logged-in Fab account; local import remains outside Git. |
| Free Shrubs Pack (Ultra Realistic Wind, local import) | [Greenleaf Vision on Fab](https://www.fab.com/listings/7ca465ab-fb9c-4d6b-bddb-82c20f604657) | Fab Standard License; integrated use permitted, standalone source redistribution prohibited | Wind-animated, high-detail shrub meshes around the Greenveil clearing edge. Acquired through the user's logged-in Fab account; local import remains outside Git. |

Poly Haven says its models, textures and HDRIs are CC0 and may be used in
commercial work. Innerscene identifies the standing deer model as an original
CC0 asset. These assets are prototype art and do not imply Wildbound's final
art direction or animal animation quality.

Electric Dreams was selected after review of the rough first test map. Its Fab
source assets must not be redistributed through the public repository. New Unreal content is Git-ignored until reviewed; local sample imports are kept outside GitHub. The Electric Dreams sample's Fab terms do **not** grant permission to republish its source assets as a standalone content library. Validate the exact license terms and provenance before any new asset is published.
