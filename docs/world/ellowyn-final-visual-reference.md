# Ellowyn — final approved visual reference

**Approval date:** October 25, 2026. **Status:** owner-approved visual canon, not a completed Unreal asset or gameplay implementation.

## Source artwork
- **Final approved reference:** `ellowyn-approved-final-concept-sheet.png`, the most recent “ELLOWYN — THE WORLD WILLOW” concept board, approved by the owner after requesting much longer willow foliage/vines and darker bark. Source conversation image: `a_wide_high_detail_fantasy_concept_art_infographi.png`.
- Earlier study: `ancient_willow_sanctuary_valley.png`; the newer concept board **supersedes it for foliage length and bark value**.
- **Binary GitHub status:** image is saved in the conversation's downloadable reference package; the GitHub connection used for this text document cannot directly attach the binary PNG. Import and verify the image separately at `docs/art/environment/ellowyn/ellowyn-approved-final-concept-sheet.png`; until verified there, do not assert GitHub hosts the image.

## Locked visual canon

**Identity:** Ellowyn is the oldest, colossal **living, sentient willow tree** connected to the Sylweave, the life current running through all living beings. She is a tree and **must never have a human face, human body, eyes or other anthropomorphic trunk anatomy**.

**Scale and silhouette:** Her trunk rises from vast earth-shaping roots; the upper crown rises **into the clouds**. Branches arch and spread outward, supporting extraordinary lengths of hanging leaf curtains and trailing flower vines. From a distance the entire shape must immediately read as a **weeping willow**, not oak, baobab, conifer or generic branching fantasy tree. Scale should be demonstrated beside ordinary trees, terrain and small people; the illustration's unspecified exact height/width should not be converted into a numerical canon measurement.

**Bark:** Deep **shimmering brown**, darker overall than the first Ellowyn image. Naturally varied dark-brown and near-black weathered crevices, rich medium-brown raised ridges, occasional muted warm highlights; slight iridescent shimmer as light grazes the surface, **not chrome/metal, not neon green bark**. Ancient sculptural bark and pronounced root flares, with moss in damp grooves and shade.

**Leaves:** Long, slender and recognizably willow-shaped; **rich living green**, indefinitely green in Greenveil's perennial spring. Very long, thickly distributed, flowing drapes, with partially translucent tips in backlight. Do not shorten into ordinary tufted crowns or make leaves autumn-colored.

**Vines and blossoms:** **Small trailing vines** interwoven throughout much of the drooping canopy and along older boughs. Delicate **pastel pink and pastel yellow flowers**, numerous enough to distinguish her, but with green foliage remaining the principal visual mass. Flowers are small, tender accents, **not large saturated neon blossoms**. The distinction between leaves and vines must stay legible in close view.

**Moss and roots:** Old-green moss on shaded bark, branch joints and enormous structural roots. Her roots have immense organic reach and can visually shape valleys, river courses, rocky terraces and old forest pathways. Engineering route placement and ecological mechanics remain proposals, not proven systems.

**Presence:** Sacred, serene, majestic, alive, ancient and beneficent despite poisoning; magical wonder communicated by exceptional shape, scale, vegetation and atmospheric lighting instead of universal glowing particles.

## Game-art construction guidance (proposed, not approved mechanics)

- Develop distinct playable-distance LOD tiers: distant cloud-piercing landmark silhouette, intermediate trunk/crown, and nearby walkable root/ground environment.
- Treat hanging willow foliage and vines as instanced or clustered cards/meshes with tuned wind motion; keep flowers as controllable small-scale attachments.
- Create layered bark textures/materials with dark patch masks, subtle directional shimmer and moss masks. Preserve readable silhouette from distant vistas.
- Prioritize performance, collision and traversal around root surfaces; prevent dense foliage overdraw from destabilizing frame time. Verify in a packaged Windows build using actual measurements.
- Do not infer a final location, exact dimensions, special abilities, season cycle, boss mechanics or a playable tree interior from the illustration.

## Acceptance checks
1. Front and three-quarter views instantly read **willow**, with cloud-high landmark scale.
2. Hanging foliage and vines are noticeably **longer** than the initial study.
3. Bark reads **dark brown** and shimmery, with darker patches and believable moss.
4. Green leaves + fine pastel pink and yellow flowers all remain visible; no leaf-fall or autumn recoloring.
5. No humanoid face or figure is embedded in trunk or roots.
6. Any UE5 asset must be separately recorded as imported, compiled, packaged, traversal-tested and benchmarked before being called implemented or playable.

Linked world direction: [Greenveil Basin](biomes.md).
