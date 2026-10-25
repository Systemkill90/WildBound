"""Import staged Poly Haven CC0 candidates without editing any map.

Run with UE 5.8's PythonScriptPlugin after local inference has yielded:
  WILDBOUND_ASSET_LIBRARY=<local shared Poly Haven library>
  UnrealEditor-Cmd.exe Wildbound.uproject -run=pythonscript
    -script=Scripts/Editor/ImportPolyHavenGreenveilAssets.py -unattended -nullrhi

The imports are kept in a candidate-only folder for later visual review. This
script never places assets in a level or changes the existing playable map.
"""

import json
import hashlib
import os

import unreal


ASSETS = (
    "grass_medium_01",
    "flower_gazania",
    "flower_ursinia",
    "boulder_01",
    "root_cluster_01",
    "modular_wooden_pier",
)
REQUIRED_TEXTURE_MARKERS = {
    "grass_medium_01": ("_diff_2k", "_nor_gl_2k", "_rough_2k", "_alpha_2k"),
    "flower_gazania": ("_diff_2k", "_nor_gl_2k", "_rough_2k", "_alpha_2k"),
    "flower_ursinia": ("_diff_2k", "_nor_gl_2k", "_rough_2k", "_alpha_2k"),
    "boulder_01": ("_diff_2k", "_nor_gl_2k", "_rough_2k"),
    "root_cluster_01": ("_diff_2k", "_nor_gl_2k", "_rough_2k"),
    "modular_wooden_pier": (
        "_planks_diff_2k", "_planks_nor_gl_2k", "_planks_rough_2k",
        "_poles_diff_2k", "_poles_nor_gl_2k", "_poles_rough_2k",
    ),
}
DEST_ROOT = "/Game/Wildbound/Art/Environment/PolyHavenCandidates"
REPORT_PATH = os.path.join(
    unreal.Paths.project_saved_dir(), "PolyHavenGreenveilImport.json"
)
SOURCE_ROOT = os.environ.get("WILDBOUND_ASSET_LIBRARY")
MAP_GUARD_PATH = os.path.join(
    unreal.Paths.project_dir(), "Content", "Maps", "GreenveilField.umap"
)

if not SOURCE_ROOT or not os.path.isdir(SOURCE_ROOT):
    raise RuntimeError(
        "Set WILDBOUND_ASSET_LIBRARY to the local Poly Haven asset library."
    )

unreal.EditorAssetLibrary.make_directory(DEST_ROOT)
asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
map_hash_before = None
if os.path.isfile(MAP_GUARD_PATH):
    with open(MAP_GUARD_PATH, "rb") as map_file:
        map_hash_before = hashlib.sha256(map_file.read()).hexdigest()
report = {
    "destination": DEST_ROOT,
    "assets": {},
    "map_modified": False,
    "guarded_map": MAP_GUARD_PATH,
    "guarded_map_sha256_before": map_hash_before,
}


def set_if_supported(obj, property_name, value):
    """Set version-tolerant FBX options without relying on deprecated aliases."""
    try:
        obj.set_editor_property(property_name, value)
    except Exception as exc:
        unreal.log_warning(
            "Optional FBX setting unavailable: %s (%s)"
            % (property_name, exc)
        )


for asset_id in ASSETS:
    source_dir = os.path.join(SOURCE_ROOT, asset_id)
    fbx_path = os.path.join(source_dir, asset_id + "_2k.fbx")
    if not os.path.isfile(fbx_path):
        raise RuntimeError("Missing staged FBX: " + fbx_path)
    if os.path.getsize(fbx_path) == 0:
        raise RuntimeError("Staged FBX is empty: " + fbx_path)

    source_files = [
        name for name in os.listdir(source_dir)
        if os.path.isfile(os.path.join(source_dir, name))
    ]
    missing_markers = [
        marker for marker in REQUIRED_TEXTURE_MARKERS[asset_id]
        if not any(marker in name for name in source_files)
    ]
    if missing_markers:
        raise RuntimeError(
            "Incomplete staged textures for %s: missing %r"
            % (asset_id, missing_markers)
        )

    destination = DEST_ROOT + "/" + asset_id
    unreal.EditorAssetLibrary.make_directory(destination)
    existing_meshes = [
        path for path in unreal.EditorAssetLibrary.list_assets(destination, False, False)
        if isinstance(unreal.load_asset(path), unreal.StaticMesh)
    ]
    if existing_meshes:
        if len(existing_meshes) != 1:
            raise RuntimeError("Expected one existing mesh in %s: %r" % (destination, existing_meshes))
        mesh_path = existing_meshes[0]
        mesh_status = "existing candidate mesh reused"
    else:
        options = unreal.FbxImportUI()
        set_if_supported(options, "import_as_skeletal", False)
        set_if_supported(options, "import_materials", True)
        set_if_supported(options, "import_textures", True)
        static_data = options.static_mesh_import_data
        set_if_supported(static_data, "combine_meshes", True)
        set_if_supported(static_data, "auto_generate_collision", False)
        set_if_supported(static_data, "generate_lightmap_u_vs", True)
        set_if_supported(static_data, "import_mesh_lods", True)
        set_if_supported(static_data, "build_nanite", False)

        task = unreal.AssetImportTask()
        task.set_editor_property("filename", fbx_path)
        task.set_editor_property("destination_path", destination)
        task.set_editor_property("automated", True)
        task.set_editor_property("replace_existing", False)
        task.set_editor_property("save", True)
        task.set_editor_property("options", options)
        asset_tools.import_asset_tasks([task])

        imported_paths = list(task.get_editor_property("imported_object_paths"))
        meshes = [
            path for path in imported_paths
            if isinstance(unreal.load_asset(path), unreal.StaticMesh)
        ]
        if len(meshes) != 1:
            raise RuntimeError(
                "Expected one imported StaticMesh for %s, got %r"
                % (asset_id, imported_paths)
            )
        mesh_path = meshes[0]
        mesh_status = "imported; not placed in a map"

    mesh = unreal.load_asset(mesh_path)
    material_paths = []
    for material_slot in mesh.get_editor_property("static_materials"):
        material = material_slot.get_editor_property("material_interface")
        if not material:
            continue
        material_paths.append(material.get_path_name())
        unreal.EditorAssetLibrary.save_loaded_asset(material)
    unreal.EditorAssetLibrary.save_loaded_asset(mesh)

    texture_paths = []
    texture_sources = [
        os.path.join(folder, name)
        for folder, _, names in os.walk(source_dir)
        for name in names
        if os.path.splitext(name)[1].lower() in (".png", ".jpg", ".jpeg", ".exr")
    ]
    for texture_source in texture_sources:
        stem = os.path.splitext(os.path.basename(texture_source))[0]
        object_path = destination + "/" + stem + "." + stem
        texture = unreal.load_asset(object_path)
        if not texture:
            texture_task = unreal.AssetImportTask()
            texture_task.set_editor_property("filename", texture_source)
            texture_task.set_editor_property("destination_path", destination)
            texture_task.set_editor_property("automated", True)
            texture_task.set_editor_property("replace_existing", False)
            texture_task.set_editor_property("save", True)
            asset_tools.import_asset_tasks([texture_task])
            imported_texture_paths = list(
                texture_task.get_editor_property("imported_object_paths")
            )
            textures = [
                path for path in imported_texture_paths
                if isinstance(unreal.load_asset(path), unreal.Texture2D)
            ]
            if len(textures) != 1:
                raise RuntimeError(
                    "Expected one imported Texture2D for %s, got %r"
                    % (texture_source, imported_texture_paths)
                )
            object_path = textures[0]
            texture = unreal.load_asset(object_path)

        texture_name = os.path.basename(texture_source).lower()
        if "_nor_" in texture_name:
            set_if_supported(texture, "srgb", False)
            set_if_supported(
                texture,
                "compression_settings",
                unreal.TextureCompressionSettings.TC_NORMALMAP,
            )
        elif any(marker in texture_name for marker in (
            "_rough_", "_metal_", "_mask_", "_alpha_", "_disp_"
        )):
            set_if_supported(texture, "srgb", False)
        elif "_diff_" in texture_name:
            set_if_supported(texture, "srgb", True)
        unreal.EditorAssetLibrary.save_loaded_asset(texture)
        texture_paths.append(object_path)

    report["assets"][asset_id] = {
        "mesh": mesh_path,
        "materials": material_paths,
        "textures": texture_paths,
        "source_file_count": len(source_files) + 1,
        "status": mesh_status,
    }
    unreal.log("POLYHAVEN_CANDIDATE_IMPORTED " + asset_id + " " + mesh_path)

if map_hash_before is not None:
    with open(MAP_GUARD_PATH, "rb") as map_file:
        map_hash_after = hashlib.sha256(map_file.read()).hexdigest()
    report["guarded_map_sha256_after"] = map_hash_after
    report["map_modified"] = map_hash_after != map_hash_before
    if report["map_modified"]:
        raise RuntimeError("GreenveilField.umap changed during candidate import.")

with open(REPORT_PATH, "w", encoding="utf-8") as report_file:
    json.dump(report, report_file, indent=2)
unreal.log("POLYHAVEN_CANDIDATES_COMPLETE " + REPORT_PATH)
