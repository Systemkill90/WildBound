"""Preflight and safely create an isolated Unreal level for Greenveil landscape R16 import.

Execute from Unreal Editor's Python console:
  exec(open(r"<repo>\\Scripts\\Editor\\PrepareGreenveilLandscapeSlice.py", encoding="utf-8").read())
  prepare_greenveil(r"<extracted>\\Greenveil_First_Terrain_Slice", create_level=False)
  prepare_greenveil(r"<extracted>\\Greenveil_First_Terrain_Slice", create_level=True)

IMPORTANT: Terrain import is a separate Landscape Mode editor action. Do not say
the heightmap is imported until that action and validation have succeeded.
"""
import json
from pathlib import Path

TEST_LEVEL = "/Game/Wildbound/Environment/Greenveil/Test/GreenveilLandscapeSlice_01"
MASKS = ("Mask_Meadow.png", "Mask_Forest.png", "Mask_Lakeshore.png",
         "Mask_HiddenGlade.png", "Mask_SylweaveAccent.png", "Mask_Footpath.png")


def prepare_greenveil(source_folder, create_level=False):
    from PIL import Image
    root = Path(source_folder).expanduser().resolve()
    manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    if manifest.get("grid_vertices") != [513, 513] or manifest.get("side_length_m") != 512:
        raise ValueError("Unexpected terrain size; do not import")
    heightmap = root / "Greenveil_512m_Height.r16"
    if heightmap.stat().st_size != 513 * 513 * 2:
        raise ValueError("Bad R16 length or dimensions")
    for mask in MASKS:
        with Image.open(root / mask) as image:
            if image.size != (513, 513) or image.mode != "L":
                raise ValueError("Expected 513x513 8-bit grayscale mask: " + mask)
    print("PREFLIGHT OK: R16 + six grayscale masks at 513x513")
    print("Landscape XY scale 100 cm; approximate Z scale 12.50019; water level 0m.")
    print("CAUTION: verify terrain elevation calibration and waterline in editor.")
    print("Heightmap: " + str(heightmap))
    if not create_level:
        print("DRY RUN ONLY. create_level=True creates a new empty test level.")
        return
    import unreal
    if unreal.EditorAssetLibrary.does_asset_exist(TEST_LEVEL):
        raise RuntimeError("Test level already exists, refusing overwrite: " + TEST_LEVEL)
    if not unreal.EditorLevelLibrary.new_level(TEST_LEVEL):
        raise RuntimeError("Unreal failed to create the isolated test level")
    print("CREATED EMPTY LEVEL: " + TEST_LEVEL)
    print("NEXT MANUAL ACTION: Landscape Mode > Manage > Import from File > select R16.")
    print("Import non-weight and weight layers deliberately, then test terrain collision.")
    print("Do not replace Electric Dreams, GreenveilField or existing launch maps.")
