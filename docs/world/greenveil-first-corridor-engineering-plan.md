# Greenveil — first corridor engineering layout v0.1

**Date:** 2026-10-25  
**Status:** TECHNICAL DESIGN / TERRAIN DATA AUDIT, not a playable UE level.  
**Inputs:** owner-approved [regional atlas](greenveil-regional-master-map.md), [ground layer](greenveil-ground-layer-approved.md), earlier [512 m terrain data](https://github.com/Systemkill90/WildBound/blob/feature/greenveil-first-landscape-slice/docs/world/greenveil-first-landscape-slice.md).

## Scale and coordinates

The preexisting prototype is **512×512 meters**, **513×513 samples**, grid spacing 1 m. Coordinates below use **(x eastward, y downward in raster space)**, origin northwest upper-left; these are *local test-slice coordinates*, **not authoritative coordinates on the illustrated regional master map**. Unreal import orientation and landscape origin must be verified.

Height stored as unsigned R16 grayscale: **z(m) ≈ 64 × uint16 / 65535 − 32**. Lake datum proposed at **0 m**. Actual inspected height range **−2.80 to +17.23 m**. This is a restrained test landscape, not the final depth/topography of Willowmere (working name). Unreal landscape Z scaling/offset and water-plane placement need calibration in editor.

## First-playable route and actual height-sample audit

| Ordered waypoint | x (m) | y (m) | Existing sampled terrain elevation | Interpretation |
|---|---:|---:|---:|---|
| Meadow spawn | 58 | 364 | +12.47 m | Open meadow; validate footing/slope |
| Woodland gateway | 218 | 224 | +11.78 m | Forest transition |
| Hidden glade | 159 | 173 | +5.76 m | Optional side-path, not straight-line main route |
| **Revised lake overlook** | **320** | **200** | **+6.9 m** | Candidate dry elevated shore overlook; slope and connectivity require UE checks |
| **Previous lake-lookout marker — REJECT** | **366** | **228** | **−2.80 m** | Below 0 m lake surface; do **not** use for spawn or dry lookout |

Elevation sampling was performed against the existing 16-bit source PNG, not interpolated from the concept painting. **A positive point elevation does not prove the route between points is walkable**; footpath masking, slope, shoreline access, collision and player navigation all need verification. The old manifest still contains the rejected submerged marker; use **this override** pending regeneration of a versioned terrain package.

### Routes
- Main dryland exploration route: southwest meadow entry → eastern woodland edge → north/east forest-to-shore transition → elevated lake lookout.
- Optional spur: woodland gate → secluded glade and back.
- Shoreline access: **new gentle approach to be graded and validated**; no preexisting safe jetty or swimming mechanic.
- Future settlement reservation only: meadow-side human hamlet approach, Kethri woodland-edge marker, distant Wolfkin/Brinefolk lake-facing view. Do not place all seven cultures in the 512 m slice or fabricate village gameplay.

## Watershed plan (master map, no locked world coordinates)

- Proposed highland headwater tributaries from northern green ridges feed the **northern smaller lake**, then descend into the **central main freshwater lake**.
- Western woodland feeders join the main water system by natural low points.
- Eastern coves/reed lake connect to central freshwater through shallow inlets.
- Main outflow travels **south through Heartlands**, crossing a planned principal stone bridge; stream bed must descend toward outlet without uphill discontinuities.
- All water names on the illustrated atlas remain provisional. Preserve water continuity and drainage logic over literal watercolor imagery.
- **The existing generated heightfield has an eastern submerged basin, but no verified carved tributary river network, waterfall drops, or lake outflow.** Those are *subsequent design/build work*, not yet included in the R16 artifact.

## Terrain materials and vegetation placement

1. Meadow: continuous green grass/loam with flowers, clover, walking gaps.
2. Forest: moss/soil/fern floor, visually varied raised roots/rocks, retained traversable corridor.
3. Shore: elevation-dependent dry grass → damp soil/mud → stone/gravel → shallow water; reeds/lilies only in plausible water margins.
4. Glade: clearable floor with rare luminous Sylweave accents, confined to highlights.
5. Use the six existing mask PNGs as **non-normalized prototype placement/paint inputs**; no claim they are clean UE weight-blended material layers.
6. Trees follow [approved five-family variants](greenveil-tree-production-spec.md); current GLBs are geometry prototypes only, not production-ready foliage.

## Build sequence after demo acceptance

**Gate 0 — existing demo:** [Issue #16](https://github.com/Systemkill90/WildBound/issues/16), [draft PR #17](https://github.com/Systemkill90/WildBound/pull/17), real desktop launch and controls evidence. Keep the existing Electric Dreams demo intact.

**Gate 1 — terrain alignment:** [draft PR #15](https://github.com/Systemkill90/WildBound/pull/15) in an isolated level, import R16, calibrate 1 m horizontal spacing and vertical range, orient axes and verify waterline. Reconcile submerged lookout marker.

**Gate 2 — drainage/paths:** Carve and test a small believable feeder and outlet (only if required for this small slice), create collision-safe path gradient and an accessible lake bank. Do not attempt a full-basin World Partition build yet.

**Gate 3 — visual layering:** Add prototype surface layers, shore transitions and licensed local-only scatter, retaining performance headroom.

**Gate 4 — acceptance:** Walk spawn → forest → lookout and glade detour in packaged Win64; record collisions, screenshots, reproducible CPU/GPU frame times/VRAM/settings. Only then mark environment slice *playable*, and do not automatically merge.

## Risks / rollback
Existing markered lake overlook is underwater; generated terrain lacks a genuine connected river; artistic master map contains non-metric scale and unapproved proper names; small 512 m test isn't a regional geography solution. Keep all imports additive, preserve original map/save/packages, and keep animal gameplay work paused. No purchases or content redistribution.

**No Unreal editor run or geometry modifications performed by this plan.**
