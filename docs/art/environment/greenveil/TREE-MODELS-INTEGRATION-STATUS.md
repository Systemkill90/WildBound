# Greenveil tree integration — reproducible handoff

**Updated 2026-10-25. Status: authored 3D prototypes, not Unreal imported.** This record accompanies [draft PR #14](https://github.com/Systemkill90/WildBound/pull/14).

## Verified source archive

The currently available conversation archive is `Wildbound_Greenveil_First_3D_Trees.zip` (1.3 MB), containing the directory `Wildbound_Greenveil_Tree_Models/` with `generate_trees.py`, `manifest.json`, `README.md`, `build-log.txt` and `models/*.glb`. **Exactly 15 distinct GLB files** are present. The originally authored mesh exports can be opened; counts below are from their source manifest.

| Family | Young triangles / height | Mature triangles / height | Ancient triangles / height |
|---|---|---|---|
| Sylweave Willow | 33,072 / 9.76 m | 33,072 / 16.0 m | 33,230 / 21.44 m |
| Ancient Oak | 3,372 / 8.54 m | 3,372 / 14.0 m | 3,530 / 18.76 m |
| Silver Birch | 3,348 / 10.37 m | 3,348 / 17.0 m | 3,506 / 22.78 m |
| Cathedral Beech | 3,792 / 12.2 m | 3,792 / 20.0 m | 3,950 / 26.8 m |
| Stonewood Hornbeam | 3,496 / 9.15 m | 3,496 / 15.0 m | 3,654 / 20.1 m |

Generator SHA-256: `b0b5de9df31bb44e8702974ed7fe649b5715e2eba681d4354eb10b9a474bc381`.

### Current blocker and honest status
- The **GLB binaries and generator source are still conversation attachments**, not committed to GitHub. This page alone does not deliver them to another checkout.
- The tree models are procedural **proxy-quality geometry**. They do not include approved-realism bark/leaf materials, fully authored foliage, wind, collision or UE5 build evidence.
- The available GitHub connector can update text; this session has **not run the editor** or modified a local UE project.

## Precise desktop import procedure

1. Save/extract the ZIP on the development PC and use **the inner folder** `Wildbound_Greenveil_Tree_Models` (the folder containing `manifest.json` and `models/`) as the importer root. Do not pass the ZIP itself or its parent extraction directory.
2. Checkout `feature/greenveil-stonewood-hornbeam`. Read `Scripts/Editor/ImportGreenveilTreePrototypes.py` and run `import_prototypes(<inner folder>, dry_run=True)` in UE5.8.4's Python-enabled editor.
3. Review material/mesh units and the local glTF/Interchange importer support; run with `dry_run=False` **only in the dedicated prototype asset destination**, aborting on conflict. This is a reversible asset-import operation and should never overwrite the functioning Electric Dreams map.
4. Verify the Unreal Asset Registry contains all 15 meshes. Record actual paths, scale, screenshots, import warnings and distinct variants.
5. Build a small isolated test level before authoring higher-fidelity bark/leaf materials, wind, collision and LOD settings. Measure actual packaged Windows performance and test player traversal before any game-ready claim.
6. Update [issue #13](https://github.com/Systemkill90/WildBound/issues/13), PR #14 and the verified main project state. Preserve restricted Epic/Fab binaries outside public GitHub.

**No automatic PR merge, map replacement, broad tree scattering, animal gameplay changes or purchases.**
