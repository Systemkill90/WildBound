# Greenveil Basin — approved fantasy ground-layer visual specification

**Approved by owner:** October 25, 2026. **Status:** FINALIZED VISUAL DIRECTION, not implemented Unreal terrain or vegetation.

## Approved concept image

The complete **WILDBOUND — GREENVEIL BASIN — GROUND LAYER / FOREST FLOOR** board generated during this conversation has been expressly approved. Source filename: `wildbound_greenveil_basin_forest_floor.png` (1448 × 1086 PNG).

**Source-art transfer status:** the PNG exists as a ChatGPT conversation artifact but is **not yet verified in the GitHub repository**. Reserve `docs/art/environment/greenveil/greenveil-ground-layer-approved.png` for the exact source image once safely uploaded. Do not substitute an unrelated reference image. This document alone is not proof that the PNG was committed.

## Approved general art direction

Everything is **eternally green, richly alive, springlike, realistic and subtly Sylweave-touched**. The floor should read as a physically plausible ecosystem with a little heightened fantasy in plant shapes, roots, rare fungus and light effects. Natural variation, microtopography, density and deliberate negative space are essential. Permanent autumn leaves and fall-color palettes are excluded from Greenveil. Daily rain, mist, dusk and other weather variations are allowed. Leaves may exist in existing organic litter, but Greenveil does **not** have seasonal leaf-fall transitions.

## Approved ground environments

| Environment | Ground cover and geology | Intended feel |
|---|---|---|
| **Meadow floor** | Layered fresh grasses, clover, daisies, buttercups, bluebells, foxglove-like blooms, scattered mossy stones and patches of earth | Open, bright, pastoral, densely colorful without covering all walking space |
| **Ancient forest floor** | Deep green moss, varied fern beds, tree roots, natural earth and leaf litter, decaying timber, forest mushrooms | Shaded, rich, ancient, irregular and walkable |
| **Lakeshore ground** | Wet mud, mossy stones, reeds, grasses, shoreline plants, exposed root tips, shallows and water lilies | Reflective, lush, saturated and riparian; transition smoothly between dry and wet soil |
| **Hidden glade** | Small secluded grass/moss clearings, uncommon wild herbs and flowers, soft roots and stone formations, occasional restrained light-emitting foliage | Quiet, mysterious, inviting discovery |
| **Sylweave-touched ground** | Intricate root patterns, velvety moss, softly luminous fungi and rare blue-white Sylweave plants | Magical accents in limited hotspots; no blanket neon lighting |

## Ground-cover / prop kit approved as reference

1. Moss carpets and moss-covered stones, varied patch shapes and roughness.
2. Fern beds in several growth stages and densities.
3. Clover, layered meadow grasses and natural herb patches.
4. Bluebells.
5. Daisies and buttercups.
6. Foxglove-like tall flowers.
7. Soil-compatible green leaf litter (not an autumn-colored seasonal cycle).
8. Winding / braided roots.
9. Forest mushrooms and **Lanterncaps** (fantasy fungi with restrained warm under-cap light).
10. Muddy/rocky wet terrain, shallow water edges, reeds and shore plants.
11. Floating water lilies with white/pink bloom accents.
12. Wild herbs and rare pale-blue / white Sylweave flora.

**Color guidance:** rich dark/mid emerald and olive green, muted moss/stone gray, natural bark browns, clear water blue-green, plus localized violet/blue, pink, warm cream/yellow flower accents. Avoid over-saturation, uniform lawns, globally emissive vegetation and harsh repeating texture tiles.

## UE5 translation / production plan (targets, not evidence)

- Multi-layer landscape material with grass, fertile meadow soil, forest duff, exposed roots/stone, gravel, wet mud and water-edge blends; tune masks for slope, water distance, trails and biome neighborhoods.
- Biome-aware procedural foliage with deterministic randomization, manually authored clearings/travel routes and species-dependent environmental placement. Keep plant density deliberate: roots, rocks and clumps must not impair player traversal.
- Photogrammetric or original CC0-licensed rocks/moss/soil where appropriate, custom original fantasy plant meshes/decals/particles only where distinctiveness justifies cost. Keep restricted Epic/Fab binaries local.
- Microvariation: debris, moss, flattened walkable grass and soil disturbance along paths; believable erosion and moisture progression into freshwater.
- Underwater/shallow-water plant integration requires independent terrain and water-system tests.
- For every test area, review day, dusk, night, rain and mist, plus actual 1080p packaged frame time, foliage overdraw, collision and traversal. Do not report success without measured results.

## Acceptance and constraints

First build a **bounded landscape test slice** containing meadow-to-forest-to-lakeshore transitions and one hidden glade. Check terrain, plant distributions and walkable routes in Unreal before expanding. Avoid major world edits, new animal gameplay or unapproved purchases; preserve existing playable maps and saves. This concept art is not a 3D mesh, vegetation pack or tested game build.

Related: [Greenveil master visual](greenveil-approved-visual-direction.md) · [Fantasy tree specification](greenveil-tree-production-spec.md) · [Settlement concepts](greenveil-settlement-concepts.md) · [Ellowyn](ellowyn-final-visual-reference.md).
