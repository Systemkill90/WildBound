"""Read-only inventory of Epic's installed Electric Dreams PCG forest map.

Loads the sample level for inspection and writes a local actor/component
inventory. It never saves or modifies the source sample level.
"""

import json
import os

import unreal


SAMPLE_MAP = "/Game/Levels/PCG/Breakdown_Levels/ElectricDreams_PCGForest"
REPORT_PATH = os.path.join(
    unreal.Paths.project_saved_dir(), "ElectricDreamsPCGForest-inventory.json"
)

if not unreal.EditorAssetLibrary.does_asset_exist(SAMPLE_MAP):
    raise RuntimeError("The installed Electric Dreams PCG forest map is unavailable.")

world = unreal.EditorLoadingAndSavingUtils.load_map(SAMPLE_MAP)
if not world:
    raise RuntimeError("Could not load the Electric Dreams PCG forest map.")

subsystem = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
actors = subsystem.get_all_level_actors()
inventory = {
    "sample_map": SAMPLE_MAP,
    "saved_or_modified": False,
    "actor_count": len(actors),
    "actor_inventory": [],
    "actors": [],
}

for actor in actors:
    class_name = actor.get_class().get_name()
    components = actor.get_components_by_class(unreal.ActorComponent)
    inventory["actor_inventory"].append({
        "label": actor.get_actor_label(),
        "class": class_name,
        "component_count": len(components),
        "location": [round(actor.get_actor_location().x, 1),
                     round(actor.get_actor_location().y, 1),
                     round(actor.get_actor_location().z, 1)],
        "static_mesh_components": [
            {
                "class": component.get_class().get_name(),
                "mesh": (component.get_editor_property("static_mesh").get_path_name()
                         if component.get_editor_property("static_mesh") else None),
                "instances": (component.get_instance_count()
                              if hasattr(component, "get_instance_count") else 1),
            }
            for component in actor.get_components_by_class(unreal.StaticMeshComponent)
        ],
        "pcg_graphs": [
            {"component": component.get_name(),
             "class": component.get_class().get_name()}
            for component in actor.get_components_by_class(unreal.PCGComponent)
        ] if hasattr(unreal, "PCGComponent") else [],
    })
    if any(token in class_name for token in ("PCG", "Landscape", "Light", "Water")):
        origin, extent = actor.get_actor_bounds(False)
        inventory["actors"].append({
            "label": actor.get_actor_label(),
            "class": class_name,
            "location": [round(actor.get_actor_location().x, 1),
                         round(actor.get_actor_location().y, 1),
                         round(actor.get_actor_location().z, 1)],
            "bounds_origin": [round(origin.x, 1), round(origin.y, 1), round(origin.z, 1)],
            "bounds_extent": [round(extent.x, 1), round(extent.y, 1), round(extent.z, 1)],
            "components": [component.get_class().get_name()
                           for component in components],
        })

candidate_assets = []
candidate_root = "/Game/Wildbound/Art/Environment/PolyHavenCandidates"
for asset_id in (
    "grass_medium_01", "flower_gazania", "flower_ursinia", "boulder_01",
    "root_cluster_01", "modular_wooden_pier",
):
    mesh_path = "%s/%s/%s_2k.%s_2k" % (
        candidate_root, asset_id, asset_id, asset_id
    )
    mesh = unreal.load_asset(mesh_path)
    if not mesh:
        candidate_assets.append({"asset": asset_id, "status": "mesh missing"})
        continue
    materials = []
    for slot in mesh.get_editor_property("static_materials"):
        material = slot.get_editor_property("material_interface")
        material_info = {
            "name": material.get_path_name() if material else None,
            "class": material.get_class().get_name() if material else None,
            "texture_parameters": [],
        }
        if material and material.get_class().get_name() == "MaterialInstanceConstant":
            try:
                for parameter in material.get_editor_property("texture_parameter_values"):
                    texture = parameter.get_editor_property("parameter_value")
                    material_info["texture_parameters"].append({
                        "parameter": str(parameter.get_editor_property("parameter_info")),
                        "texture": texture.get_path_name() if texture else None,
                    })
            except Exception as exc:
                material_info["texture_inspection_error"] = str(exc)
        materials.append(material_info)
    candidate_assets.append({
        "asset": asset_id,
        "mesh": mesh_path,
        "material_slots": materials,
    })
inventory["candidate_asset_materials"] = candidate_assets

with open(REPORT_PATH, "w", encoding="utf-8") as report_file:
    json.dump(inventory, report_file, indent=2)
unreal.log("ELECTRIC_DREAMS_READONLY_INVENTORY " + REPORT_PATH)
unreal.log("ELECTRIC_DREAMS_ACTOR_COUNT %d" % len(actors))
