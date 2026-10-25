"""Wildbound: explicit, non-destructive UE Editor import of first-pass Greenveil GLBs.

Run in UE5 Editor Python console:
  import ImportGreenveilTreePrototypes as trees
  trees.import_prototypes(r"D:\\path\\Wildbound_Greenveil_Tree_Models", dry_run=True)
  trees.import_prototypes(r"D:\\path\\Wildbound_Greenveil_Tree_Models", dry_run=False)

Place this script on Unreal Python's path or execute it through the editor's
PythonScriptPlugin. This intentionally DOES NOT run when imported. Avoid
shipping these blockout assets in the public repository.
"""
from pathlib import Path
import json

DESTINATION = "/Game/Wildbound/Environment/Greenveil/PrototypeTrees"
FAMILIES = ("Sylweave_Willow", "Ancient_Oak", "Silver_Birch",
            "Cathedral_Beech", "Stonewood_Hornbeam")
VARIANTS = ("Young", "Mature", "Ancient")


def _validate(root):
    root = Path(root)
    manifest_path = root / "manifest.json"
    if not manifest_path.is_file():
        raise FileNotFoundError("Missing manifest.json: " + str(manifest_path))
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("status") != "first-pass procedural geometry, not game-ready":
        raise ValueError("Unexpected source asset status; review manually")
    names = {str(entry["filename"]) for entry in manifest["models"]}
    expected = {family + "_" + variant + ".glb"
                for family in FAMILIES for variant in VARIANTS}
    if names != expected:
        raise ValueError("Source manifest must contain exactly 15 expected files")
    for name in sorted(expected):
        candidate = root / "models" / name
        if not candidate.is_file() or candidate.stat().st_size == 0:
            raise FileNotFoundError("Missing/empty mesh: " + str(candidate))
    return root, sorted(expected)


def import_prototypes(root, dry_run=True):
    """Validate source; only import with explicit dry_run=False.

    Never overwrite destination assets, alter an existing map or set collision.
    Unreal 5.8 may use Interchange for GLB; import dialogue/plugin setup can
    differ by engine installation. Validate mesh scale/materials manually.
    """
    root, names = _validate(root)
    print("Verified source manifests/files:", len(names), "GLB models")
    if dry_run:
        for name in names:
            print("DRY RUN", root / "models" / name, "=>", DESTINATION)
        return []
    import unreal
    tools = unreal.AssetToolsHelpers.get_asset_tools()
    tasks = []
    registry = unreal.EditorAssetLibrary
    for name in names:
        stem = Path(name).stem
        # Abort rather than silently modify an asset produced in a previous pass.
        existing = DESTINATION + "/" + stem
        if registry.does_asset_exist(existing):
            raise RuntimeError("Refusing overwrite: " + existing)
    for name in names:
        task = unreal.AssetImportTask()
        task.filename = str(root / "models" / name)
        task.destination_path = DESTINATION
        task.automated = True
        task.replace_existing = False
        task.replace_existing_settings = False
        task.save = False  # Review imported content before manually saving.
        tasks.append(task)
    tools.import_asset_tasks(tasks)
    results = []
    for name, task in zip(names, tasks):
        imported = [str(p) for p in task.imported_object_paths]
        print("IMPORT RESULT", name, imported)
        if not imported:
            unreal.log_warning("GLB not imported; ensure Interchange GLTF support: " + name)
        results.extend(imported)
    print("Prototype-only import completed. Inspect scale, materials, wind, "
          "collision and performance; do not claim game-ready.")
    return results
