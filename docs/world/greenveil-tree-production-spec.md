# Greenveil Basin — approved fantasy tree production specification

**Approved direction:** October 25, 2026. **Scope:** All five approved tree species should ultimately be **game-ready UE5 models**, not just mood-board examples. **Current status:** concept visuals approved; game-ready custom meshes, materials, variants and performance validation **not yet verified**.

## Visual source of truth

The owner approved the concept board **GREENVEIL BASIN — TREE SPECIES · FANTASY VARIANTS** from the conversation, supplied as `a_detailed_poster_infographic_concept_art_layout.png`. The image **is not verified in GitHub yet**. Proposed import: `docs/art/environment/greenveil/greenveil-trees-approved.png`.

**Design rule:** recognizable botanical species, subtly and distinctly transformed by the Sylweave. Aim for roughly 80% credible natural structure, 20% fantasy expression (artistic guidance, not numerical shader values). Never turn the biome into glowing neon forest or generic high-saturation fantasy. Greenveil stays lush and green all year; autumn colors and leaf drop belong elsewhere.

## Five required game-ready tree families

| Approved family | Distinct look | Ecology and scene use | Required model variants |
|---|---|---|---|
| **Sylweave Willow** | Graceful arching willow, long cascading green leaf curtains, small intertwining vines, occasional fine pastel blossoms, moss-darkened bark | Shores, waterways, wet glades | Young, mature, ancient; exposed and sheltered branch poses |
| **Ancient Oak** | Broad majestic asymmetrical crown, gnarled limbs, immense root flares, mossy grooved bark, rich green oak foliage | Meadow sentinels, old forest, trail junctions | Young, mature, landmark ancient |
| **Silver Birch** | Airy pale silvery-white trunks, subtle green/silver iridescence, delicate leaves and slight fantasy curve | Birch groves, upland transitions, village edges | Sapling, mature single stem, multi-stem grove |
| **Cathedral Beech** | Tall graceful column-like trunks, high arching branching, enclosed velvety green canopy, natural moss and buttress roots | Deep enclosed old forest and wooded valleys | Young, mature, towering arching form |
| **Stonewood Hornbeam** | Strong twisted fluted trunk, textured dense greenery, exposed knotted roots, hardy silhouette | Rocky slopes, forest margins, ridges | Young, mature, weathered/ridge form |

The approved names above are **production reference labels**, not newly established biological lore names or a restriction on future tree subspecies.

## Technical delivery requirements — per family

1. **Editable source mesh** with asset provenance and permitted license, plus Unreal-compatible exported meshes (FBX/glTF as appropriate) and imported UE assets.
2. **Visible variation:** at least three structurally distinct silhouettes and controlled scale/rotation/leaf-density variants; avoid repeating the same tree across a forest.
3. **Physically plausible bark and foliage materials:** normal/roughness/albedo, correct two-sided foliage shading, subtle Sylweave accents as masks; no baked text or glow baked across an entire tree.
4. **Animation:** configurable foliage and branch wind response with restrained trunk rigidity; extra tuning for draping willow foliage and vines.
5. **Collision:** cheap trunk and major-root collision sufficient for player walking and construction traversal; leaves and most tiny branches should not block movement. Check shoreline trees and bridges.
6. **Performance:** Nanite evaluation for suitable opaque branches/trunks; optimized foliage opacity/overdraw, LOD/HLOD/impostor strategy according to actual UE5 platform measurements; far canopy silhouettes must remain readable.
7. **Foliage placement:** species-aware vegetation rules (terrain slope, water distance, forest density, sunlight/exposure) and stable randomized scatter; do not place willow groves on dry ridges or birch in marshy water by default.
8. **Quality review:** in-engine close and far views; day/night/rain/wind; no pop-through, light leaks, shimmering or silhouette mismatch; packaged Win64 frame-time, VRAM and traversal observations with test hardware and settings recorded.

**Acceptance:** A tree family counts as *game-ready* only after actual 3D assets exist, import correctly, are staged with appropriate licensing, render in Unreal, behave under wind/collision, and pass a recorded Windows packaged performance/traversal evaluation. Concept art alone is not a model.

## Priority and dependencies

- **First forest slice:** adapt the already licensed/local forest meshes as temporary placeholders for trunk and canopy behavior while producing the first approved **Stonewood Hornbeam and Ancient Oak** assets. Add **Silver Birch** for readable grove contrast; **Sylweave Willow** for the lake/stream focal point; **Cathedral Beech** for forest depth.
- **Later:** introduce final hero variants, authored grove compositions, more silhouettes and subtler magic material variation; tune density using measured performance.
- Do not add new animal gameplay during this environment production pass.
- External licensed/Fab/Epic art that cannot be redistributed must remain local, with source manifests rather than content binaries committed to the public Git repository.
- Protect existing playable builds and saves; use implementation branches and acceptance gates. Codex/desktop Unreal access is required for modeling/import/packaged testing.

**Related approved canon:** [Greenveil master visuals](greenveil-approved-visual-direction.md) · [Ellowyn final visual](ellowyn-final-visual-reference.md) · [Biomes](biomes.md).

**Ellowyn must remain separate:** cloud-high, colossal living willow, exceptional hanging foliage/vines, delicate pastel pink/yellow flowers, deeply shimmery dark-brown bark and moss; no humanoid face.
