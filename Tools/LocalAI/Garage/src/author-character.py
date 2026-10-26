"""Create a reviewable rigged humanoid foundation with the installed MPFB extension.

This worker intentionally supports named, versioned presets rather than open-ended
prompt-to-character generation. It is invoked by Blender and writes only to the
requested output directory.
"""

import argparse
import importlib
import json
import math
import os
import sys

import bpy
from mathutils import Vector


def mpfb_symbol(package_suffix, name):
    for module_name in tuple(sys.modules):
        if module_name.endswith(package_suffix):
            module = importlib.import_module(module_name)
            if hasattr(module, name):
                return getattr(module, name)
    raise RuntimeError(f"MPFB service unavailable: {package_suffix}.{name}")


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument("--preset", choices=["female-homesteader"], required=True)
    return parser.parse_args(sys.argv[sys.argv.index("--") + 1 :])


def find_asset(asset_service, filename, category):
    result = asset_service.find_asset_absolute_path(filename, asset_subdir=category)
    if not result or not os.path.isfile(result):
        raise RuntimeError(f"Required MPFB asset is unavailable: {category}/{filename}")
    return result


def add_asset(human_service, asset_service, basemesh, category, filename, asset_type):
    return human_service.add_mhclo_asset(
        find_asset(asset_service, filename, category),
        basemesh,
        asset_type=asset_type,
        subdiv_levels=1,
        material_type="GAMEENGINE",
    )


def add_idle_clip(rig):
    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    action = bpy.data.actions.new("WB_IdleBreath")
    rig.animation_data_create()
    rig.animation_data.action = action
    bone = rig.pose.bones.get("spine_03") or rig.pose.bones.get("spine_02")
    if bone is None:
        raise RuntimeError("The game-engine rig does not contain a usable spine bone.")
    bone.rotation_mode = "XYZ"
    for frame, angle in ((1, 0.0), (30, math.radians(1.4)), (60, 0.0)):
        bone.rotation_euler.x = angle
        bone.keyframe_insert("rotation_euler", frame=frame)
    action.use_fake_user = True
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = 60
    return action


def simple_material(name, color, roughness=0.7):
    material = bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1.0)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1.0)
    shader.inputs["Roughness"].default_value = roughness
    return material


def add_homesteader_accessories(rig):
    rust = simple_material("WB_WornRustWool", (0.26, 0.055, 0.025), 0.88)
    leather = simple_material("WB_WornBrownLeather", (0.095, 0.035, 0.014), 0.72)

    vertices = [
        (-0.38, 0.10, 1.38), (0.38, 0.10, 1.38),
        (-0.54, 0.18, 0.48), (0.54, 0.18, 0.48),
        (-0.44, 0.23, 0.22), (0.44, 0.23, 0.22),
    ]
    faces = [(0, 1, 3, 2), (2, 3, 5, 4)]
    mesh = bpy.data.meshes.new("WB_HomesteaderCloakMesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    cloak = bpy.data.objects.new("WB_HomesteaderCloak", mesh)
    bpy.context.collection.objects.link(cloak)
    cloak.data.materials.append(rust)
    solidify = cloak.modifiers.new("Cloak thickness", "SOLIDIFY")
    solidify.thickness = 0.012
    bevel = cloak.modifiers.new("Soft worn edges", "BEVEL")
    bevel.width = 0.018
    bevel.segments = 3
    cloak.parent = rig

    bpy.ops.mesh.primitive_torus_add(major_radius=0.285, minor_radius=0.018, major_segments=64, minor_segments=12, location=(0, 0, 0.87))
    belt = bpy.context.object
    belt.name = "WB_HomesteaderBelt"
    belt.scale.y = 0.72
    belt.data.materials.append(leather)
    belt.parent = rig

    pouches = []
    for x in (-0.24, 0.24):
        bpy.ops.mesh.primitive_cube_add(location=(x, -0.18, 0.78), scale=(0.085, 0.045, 0.10))
        pouch = bpy.context.object
        pouch.name = "WB_HomesteaderPouch"
        pouch.data.materials.append(leather)
        bevel = pouch.modifiers.new("Worn pouch edges", "BEVEL")
        bevel.width = 0.025
        bevel.segments = 3
        pouch.parent = rig
        pouches.append(pouch)
    return [cloak, belt, *pouches]


def world_bounds(objects):
    points = []
    for obj in objects:
        if obj.type != "MESH" or obj.hide_render:
            continue
        points.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)
    if not points:
        raise RuntimeError("No renderable character geometry was created.")
    low = Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points)))
    high = Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points)))
    return low, high


def aim(camera, target):
    camera.rotation_euler = (Vector(target) - camera.location).to_track_quat("-Z", "Y").to_euler()


def make_review_scene(objects, output):
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.resolution_x = 720
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.world.color = (0.035, 0.045, 0.035)

    low, high = world_bounds(objects)
    center = (low + high) / 2
    height = high.z - low.z
    radius = max(high.x - low.x, high.y - low.y, height * 0.45)

    bpy.ops.mesh.primitive_plane_add(size=max(8.0, radius * 5), location=(center.x, center.y, low.z))
    ground = bpy.context.object
    ground.name = "ReviewGround"
    material = bpy.data.materials.new("ReviewGroundMaterial")
    material.diffuse_color = (0.055, 0.075, 0.055, 1.0)
    ground.data.materials.append(material)

    bpy.ops.object.light_add(type="AREA", location=(center.x - 2.4, center.y - 3.2, low.z + height * 1.25))
    key = bpy.context.object
    key.data.energy = 1100
    key.data.shape = "DISK"
    key.data.size = 4.0
    aim(key, center)
    bpy.ops.object.light_add(type="AREA", location=(center.x + 2.5, center.y + 1.5, low.z + height))
    fill = bpy.context.object
    fill.data.energy = 700
    fill.data.size = 3.0
    aim(fill, center)
    bpy.ops.object.light_add(type="AREA", location=(center.x, center.y + 1.0, low.z + height * 1.7))
    rim = bpy.context.object
    rim.data.energy = 900
    rim.data.size = 2.0
    aim(rim, center)

    bpy.ops.object.camera_add()
    camera = bpy.context.object
    camera.data.lens = 58
    scene.camera = camera
    distance = max(3.6, height * 2.25)
    views = {
        "review-front.png": (0.0, -distance, height * 0.58),
        "review-three-quarter.png": (distance * 0.62, -distance * 0.72, height * 0.58),
        "review-side.png": (distance, 0.0, height * 0.58),
        "review-back.png": (0.0, distance, height * 0.58),
    }
    for filename, offset in views.items():
        camera.location = center + Vector(offset)
        aim(camera, (center.x, center.y, low.z + height * 0.53))
        scene.render.filepath = os.path.join(output, filename)
        bpy.ops.render.render(write_still=True)
    return low, high, list(views)


def export_character(objects, output):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.hide_render = False
        obj.hide_viewport = False
        obj.select_set(True)
    active = next((obj for obj in objects if obj.type == "ARMATURE"), objects[0])
    bpy.context.view_layer.objects.active = active
    destination = os.path.join(output, "female-homesteader-v1.fbx")
    bpy.ops.export_scene.fbx(
        filepath=destination,
        use_selection=True,
        add_leaf_bones=False,
        bake_anim=True,
        bake_anim_use_all_actions=True,
        path_mode="COPY",
        embed_textures=True,
    )
    return destination


def main():
    args = parse_args()
    output = os.path.abspath(args.output)
    os.makedirs(output, exist_ok=True)

    HumanService = mpfb_symbol("mpfb.services.humanservice", "HumanService")
    TargetService = mpfb_symbol("mpfb.services.targetservice", "TargetService")
    AssetService = mpfb_symbol("mpfb.services.assetservice", "AssetService")
    HumanObjectProperties = mpfb_symbol("mpfb.entities.objectproperties", "HumanObjectProperties")

    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    AssetService.update_all_asset_lists()

    basemesh = HumanService.create_human()
    basemesh.name = "WB_FemaleHomesteader_Body"
    macro = {
        "gender": 0.0,
        "age": 0.46,
        "muscle": 0.48,
        "weight": 0.47,
        "height": 0.49,
        "caucasian": 0.72,
        "asian": 0.18,
        "african": 0.10,
    }
    for name, value in macro.items():
        HumanObjectProperties.set_value(name, value, entity_reference=basemesh)
    TargetService.reapply_macro_details(basemesh)

    skin = find_asset(AssetService, "toigo_light_skin_female_freckles.mhmat", "skins")
    HumanService.set_character_skin(skin, basemesh, skin_type="GAMEENGINE")
    rig = HumanService.add_builtin_rig(basemesh, "game_engine")
    rig.name = "WB_FemaleHomesteader_Rig"

    selections = [
        ("eyes", "high-poly.mhclo", "Eyes"),
        ("eyebrows", "eyebrow001.mhclo", "Eyebrows"),
        ("eyelashes", "eyelashes01.mhclo", "Eyelashes"),
        ("teeth", "teeth_base.mhclo", "Teeth"),
        ("hair", "elvs_double_mh_braid.mhclo", "Hair"),
        ("clothes", "rehmanpolanski_viking_tunic.mhclo", "Clothes"),
        ("clothes", "toigo_wool_pants.mhclo", "Clothes"),
        ("clothes", "grinsegold_female_pirate_boots.mhclo", "Clothes"),
        ("clothes", "toigo_gloves_short.mhclo", "Clothes"),
    ]
    added = [add_asset(HumanService, AssetService, basemesh, *item) for item in selections]
    action = add_idle_clip(rig)
    accessories = add_homesteader_accessories(rig)
    character_objects = [basemesh, rig, *added, *accessories]

    blend = os.path.join(output, "female-homesteader-v1.blend")
    bpy.ops.wm.save_as_mainfile(filepath=blend)
    fbx = export_character(character_objects, output)
    low, high, previews = make_review_scene(character_objects, output)

    report = {
        "schemaVersion": 1,
        "preset": args.preset,
        "reference": "female-homesteader-player-anchor@v1",
        "status": "foundation-review",
        "fbx": fbx,
        "blend": blend,
        "previews": previews,
        "meshObjects": len([obj for obj in character_objects if obj.type == "MESH"]),
        "armatures": 1,
        "animations": [action.name],
        "dimensionsMeters": [round(high.x - low.x, 4), round(high.y - low.y, 4), round(high.z - low.z, 4)],
        "license": "MPFB core and selected asset packs are CC0; MPFB software is GPL-3.0-or-later.",
        "approval": "awaiting-owner-review",
    }
    with open(os.path.join(output, "character-report.json"), "w", encoding="utf-8") as handle:
        json.dump(report, handle, indent=2)
        handle.write("\n")
    print("WILDBOUND_CHARACTER_REPORT=" + json.dumps(report))


if __name__ == "__main__":
    main()
