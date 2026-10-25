# Stonewood Hornbeam — production build card

**Work item:** [#13](https://github.com/Systemkill90/WildBound/issues/13)  
**Branch:** `feature/greenveil-stonewood-hornbeam`  
**Status:** **STAGED PLAN ONLY** — no new geometry, material or UE5 scene has been built or tested by this GitHub-only update.  
**Target engine:** UE 5.8.4, Windows first.

## Look and feel
Production input: owner-approved **GREENVEIL BASIN — TREE SPECIES · FANTASY VARIANTS** board and [spec](../../../world/greenveil-tree-production-spec.md) on `staging/idea-board`; import actual approved board locally before art comparison.

Faithful hornbeam leaves, muted rich green all year; mature silhouette with fluted twisting trunk, roots conforming to rocky soil, high-density crown broken into believable leaf clusters, grooves carrying subtle moss. Make an ancient woodland fantasy species, not a face-bearing sentient tree or glowing sculpture. Ellowyn remains unique.

## Variants to author

| Variant asset identifier | Intended use | Distinguishing shape |
| --- | --- | --- |
| `SM_WB_StonewoodHornbeam_Young_A` | Margin / regrowth | Slimer trunk, open lower crown, limited root flare |
| `SM_WB_StonewoodHornbeam_Mature_A` | Core forest | Dense asymmetrical crown, broad branching, strongly fluted trunk |
| `SM_WB_StonewoodHornbeam_Ridge_A` | Rocky slopes | Windswept asymmetric crown, exposed crooked roots, short thick trunk |

These are **asset names reserved for production**, not existing assets.

## Desktop asset pipeline
1. Read current local build/tree records and safeguard functioning map/build; inspect local Electric Dreams hornbeam models solely for comparative silhouette/material strategy and source rights.
2. Construct three **original** source meshes with individual branch structures; author leaf clusters, moss bark and root geometry. Keep source-model files on local workstation with provenance. Do not clone restricted sample mesh geometry or release Epic content as standalone.
3. Export meshes in a format tested by current UE import pipeline. Save reversible source art, exported meshes and textures in versioned paths; stage only redistributable originals or metadata.
4. Import into isolated new **test map**. Review normal orientation, transparency, shading, material instancing, visual scale, wind, simple collision and distant silhouette.
5. Replace a small cluster of *test trees*, not the authored Electric Dreams sample or an existing approved map wholesale.
6. Record viewport captures, imported asset paths and packaged Windows evidence; fix clipping/collision and overdraw before scaling counts.
7. After acceptance, draft foliage-placement rules by slope, light, rockiness and forest density. Avoid any new animal gameplay.

## Validation gates
- **Asset authored:** all three mesh source assets exist, differ visibly, provenance checked.
- **Imported:** UE Asset Registry finds all three asset paths; render and material setup verified.
- **Gameplay:** third-person player can walk around every trunk/major root without inappropriate floating, clipping or invisible leaf collision.
- **Performance:** captured traversal frame time and GPU/VRAM evidence at documented resolution/scalability; LOD or Nanite settings justified by those measurements.
- **Build:** Win64 packaged build launches the test scene. Save original working package/map separately. Do not label playable until this and traversal tests pass.

## Rollback
Do not change the original sample-backed map by default. If integration fails, disable/remove only the staged test placement and restore the previous selected launch map; keep input meshes and logs for diagnosis. No destructive deletion, force-push, or save overwrite.

## Blocker
Requires actual desktop Blender or other 3D modeling software and Unreal access. GitHub alone cannot synthesize/compile/inspect game-ready UE mesh binaries or benchmark performance.
