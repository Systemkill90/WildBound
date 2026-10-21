# Prototype asset sources

## Original pre-production artwork (October 21, 2026)

The eight images in [the illustrated concept atlas](concept-atlas/README.md) were generated for Wildbound during a ChatGPT design session and exported as optimized WebP art plates for this repository. They are not third-party Unreal store assets, engine models, or evidence of finished gameplay. Their creature names, biome titles, tools and costume details are creative proposals pending review. The AI-rendered captions may contain inaccuracies.

The imported runtime assets below have separate sources and licensing rules.

Wildbound keeps art provenance alongside the content. Approved imported Unreal assets are tracked with Git LFS. **LFS is a storage method, not a license**: only source art with valid redistribution rights belongs in the public repository. The presence of a prior credit entry is not a new legal verification.

| Asset set | Source | License | Use in Wildbound |
| :-- | :-- | :-- | :-- |
| Greenveil forest ground, ferns, shrubs, mossy rocks, stump, wooden bowl and bucket | [Poly Haven](https://polyhaven.com/) | [CC0](https://polyhaven.com/license) | Greenveil test-map environment and care-point dressing |
| Standing deer | [Innerscene — Deer standing](https://www.innerscene.com/tools/library/3d-parts/deer-standing-35e2f5f6) | CC0, public domain dedication | First deer visual; the prototype supplies server-controlled wandering and care stats |
| Electric Dreams Environment (local import) | [Epic Games / Fab](https://www.fab.com/listings/d79688f5-29be-4fb2-a650-2d4a813f5306) | Fab Standard License; use in a UE product is permitted, but source assets must not be redistributed as standalone files | Two European hornbeam forest meshes, foliage/trunk materials and required dependencies dress the Greenveil perimeter. Imported binaries remain local and are not committed to GitHub. |
| Animal Variety Pack (local import) | [Protofactor Inc. on Fab](https://www.fab.com/listings/2dd7964c-a601-4264-a53d-465dcae1644c) | Fab Standard License; integrated use permitted, standalone source redistribution prohibited | Rigged doe mesh with idle-breath, walk and run sequences for the Greenveil prototype. Acquired through the user's logged-in Fab account; local import remains outside Git. |
| Free Shrubs Pack (Ultra Realistic Wind, local import) | [Greenleaf Vision on Fab](https://www.fab.com/listings/7ca465ab-fb9c-4d6b-bddb-82c20f604657) | Fab Standard License; integrated use permitted, standalone source redistribution prohibited | Wind-animated, high-detail shrub meshes around the Greenveil clearing edge. Acquired through the user's logged-in Fab account; local import remains outside Git. |

Poly Haven says its models, textures and HDRIs are CC0 and may be used in
commercial work. Innerscene identifies the standing deer model as an original
CC0 asset. These assets are prototype art and do not imply Wildbound's final
art direction or animal animation quality.

Electric Dreams was selected after review of the rough first test map. Its Fab
source assets must not be redistributed through the public repository. New Unreal content is Git-ignored until reviewed; local sample imports are kept outside GitHub. The Electric Dreams sample's Fab terms do **not** grant permission to republish its source assets as a standalone content library. Validate the exact license terms and provenance before any new asset is published.
