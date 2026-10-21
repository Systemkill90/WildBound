"""Import the CC0 deer model into Wildbound's asset library."""

import unreal


SOURCE = r"<local-project-root>\Source\ArtSource\Animals\deer-standing.glb"
DESTINATION = "/Game/Wildbound/Art/Animals"

if not unreal.EditorAssetLibrary.does_directory_exist(DESTINATION):
    unreal.EditorAssetLibrary.make_directory(DESTINATION)

task = unreal.AssetImportTask()
task.set_editor_property("filename", SOURCE)
task.set_editor_property("destination_path", DESTINATION)
task.set_editor_property("automated", True)
task.set_editor_property("replace_existing", True)
task.set_editor_property("save", True)
unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])

paths = list(task.get_editor_property("imported_object_paths"))
if not paths:
    raise RuntimeError("Unreal did not import the CC0 deer GLB")

mesh_paths = []
for path in paths:
    asset = unreal.load_asset(path)
    if isinstance(asset, unreal.StaticMesh):
        mesh_paths.append(path)

if not mesh_paths:
    raise RuntimeError("The deer GLB imported without a StaticMesh")

unreal.log("Wildbound deer import complete. Static mesh paths: " + repr(mesh_paths))
