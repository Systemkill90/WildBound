# Greenveil — first authored terrain-data slice

**Status (2026-10-25): GENERATED TERRAIN DATA, NOT AN IMPLEMENTED OR PLAYABLE UNREAL LEVEL.**

The first standalone landscape asset package has been generated outside GitHub as `Greenveil_First_Terrain_Slice.zip`, available in the associated ChatGPT conversation. No external licensed Unreal sample binaries are redistributed.

## Terrain output
- **512 × 512 m** prototype, **513 × 513** vertices at 1 m horizontal spacing.
- Raw R16 grayscale heightfield `Greenveil_512m_Height_R16.png`; elevation encoding: `elevation_m ≈ pixel_uint16 * 64 / 65535 - 32`, requires UE Landscape Z scale/offset calibration.
- Six 8-bit masks: `Mask_Meadow.png`, `Mask_Forest.png`, `Mask_Lakeshore.png`, `Mask_HiddenGlade.png`, `Mask_SylweaveAccent.png`, `Mask_Footpath.png`.
- Organic rolling southern/western grassland, deeper northern woodland, freshwater lake to east, muddy shoreline transition, secluded glade and a connecting walking track.
- Design markers in manifest (meters in heightmap XY): meadow spawn **(58,364)**; woodland gate **(218,224)**; hidden glade **(159,173)**; lake lookout **(366,228)**.
- Deterministic Python generator `generate_slice.py` (numpy, scipy, Pillow) and `manifest.json` in the downloadable archive. Package is **not imported into GitHub binary storage**.

## Unreal integration sequence
1. Checkout an isolated implementation branch. Duplicate/create a **new test map**; never overwrite existing Electric Dreams launch map, GreenveilField, packaged working builds or saved game.
2. Import R16 heightmap in Unreal Editor Landscape mode. Calibrate XY and Z height/offset from manifest; inspect for inverted/coastline artifacts.
3. Apply simple terrain blending using six weightmaps, with placeholder grass, rich forest soil, muddy/sandy shore, moss and rock. No claim of ready-to-ship PBR materials.
4. Add a simple freshwater plane or locally configured water body at elevation 0; visually and physically test water-edge collision.
5. Using documented locally licensed art, place foliage *only after* terrain and walking route can be validated. Original five-family Greenveil trees are separate 3D geometry prototypes and not UE-validated.
6. Place spawn and test traverse meadow → forest → hidden glade → lake lookout, including slope, step, stream, water boundary and collision checks.
7. Run measured standalone packaged Win64 traversal, log CPU/GPU frame-time, frame pacing, memory, and settings, compare visual fidelity to approved Greenveil ground art.
8. Update current-state/handoff/roadmap with **verified evidence**, or list blockers when tests cannot run. Keep animal gameplay work paused.

## Quality and scope safeguards
This prototype is a **landscape import artifact**, *not* a built Greenveil village, finished original forest, co-op playable world, water simulation or accepted terrain material. Keep species settlement landmarks as eventual map planning markers, not generated buildings. Do not merge before local UE tests and owner review.

Approved art direction: [ground layer](https://github.com/Systemkill90/WildBound/blob/staging/idea-board/docs/world/greenveil-ground-layer-approved.md), [Greenveil master](https://github.com/Systemkill90/WildBound/blob/staging/idea-board/docs/world/greenveil-approved-visual-direction.md).
