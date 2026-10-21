"""Build the small, saved Greenveil first-playable test map.

Run with UnrealEditor-Cmd.exe and -ExecutePythonScript. Every landscape prop
comes from the checked-in Poly Haven CC0 asset set.
"""

import math
import unreal


LEVEL_PATH = "/Game/Maps/GreenveilField"
LEVEL_EDITOR = unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
ACTORS = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
ASSET_ROOT = "/Game/Wildbound/Art/Environment/PolyHaven"


def spawn_actor(actor_class, label, location, rotation=(0.0, 0.0, 0.0)):
    actor = ACTORS.spawn_actor_from_class(
        actor_class, unreal.Vector(*location), unreal.Rotator(*rotation)
    )
    if not actor:
        raise RuntimeError("Could not spawn actor: " + label)
    # SpawnActor can honor the editor viewport's fallback transform for some
    # native classes, so set the requested transform explicitly as well.
    actor.set_actor_location(unreal.Vector(*location), False, False)
    actor.set_actor_rotation(unreal.Rotator(*rotation), False)
    actor.set_actor_label(label)
    return actor


def spawn_mesh(mesh_path, label, location, scale=1.0, yaw=0.0, collision=False):
    mesh = unreal.load_asset(mesh_path)
    if not mesh:
        raise RuntimeError("Missing Greenveil mesh: " + mesh_path)
    actor = spawn_actor(
        unreal.StaticMeshActor, label, location, (0.0, yaw, 0.0)
    )
    component = actor.get_editor_property("static_mesh_component")
    component.set_static_mesh(mesh)
    component.set_collision_enabled(
        unreal.CollisionEnabled.QUERY_AND_PHYSICS
        if collision
        else unreal.CollisionEnabled.NO_COLLISION
    )
    actor.set_actor_scale3d(unreal.Vector(scale, scale, scale))
    return actor


def mesh(folder, name):
    return "%s/%s/%s.%s" % (ASSET_ROOT, folder, name, name)


if not unreal.EditorAssetLibrary.does_directory_exist("/Game/Maps"):
    unreal.EditorAssetLibrary.make_directory("/Game/Maps")

if unreal.EditorAssetLibrary.does_asset_exist(LEVEL_PATH):
    if not LEVEL_EDITOR.load_level(LEVEL_PATH):
        raise RuntimeError("Could not open existing Greenveil map")
    for actor in ACTORS.get_all_level_actors():
        if actor.get_actor_label().startswith("Greenveil"):
            ACTORS.destroy_actor(actor)
else:
    if not LEVEL_EDITOR.new_level(LEVEL_PATH, False):
        raise RuntimeError("Could not create the Greenveil map")

# A 60 m collision slab uses the detailed forest-floor PBR material.
ground_class = unreal.load_class(None, "/Script/Wildbound.WildboundPrototypeGround")
if not ground_class:
    raise RuntimeError("WildboundPrototypeGround is not compiled")
spawn_actor(ground_class, "Greenveil Ground and Collision", (0.0, 0.0, -25.0))

floor_material = unreal.load_asset(
    ASSET_ROOT + "/ForestGround01/M_GreenveilForestFloor"
)
trail_material = unreal.load_asset(
    ASSET_ROOT + "/ForestGround01/M_GreenveilForestPath"
)
if not floor_material or not trail_material:
    raise RuntimeError("Greenveil forest-floor materials were not found")

# A clear, readable approach from the starting meadow into the tree line.
trail_points = [(-1800.0, -150.0), (-900.0, -60.0), (0.0, 0.0),
                (900.0, 100.0), (1750.0, 260.0)]
for index, (first, second) in enumerate(zip(trail_points, trail_points[1:])):
    dx = second[0] - first[0]
    dy = second[1] - first[1]
    yaw = math.degrees(math.atan2(dy, dx))
    center = ((first[0] + second[0]) * 0.5,
              (first[1] + second[1]) * 0.5, 1.5)
    trail = spawn_mesh(
        "/Engine/BasicShapes/Plane.Plane",
        "Greenveil Trail %02d" % (index + 1), center,
        max(0.8, math.sqrt(dx * dx + dy * dy) / 100.0), yaw
    )
    component = trail.get_editor_property("static_mesh_component")
    component.set_material(0, trail_material)
    trail.set_actor_scale3d(unreal.Vector(
        max(0.8, math.sqrt(dx * dx + dy * dy) / 100.0), 2.0, 1.0
    ))

# Mature edge trees frame the clearing and leave a 25 m playable interior.
tree_mesh = mesh("TreeSmall02", "tree_small_02_4k")
tree_positions = [
    (-2500, -2200), (-1200, -2650), (300, -2700), (1750, -2400),
    (2650, -1350), (2750, 250), (2550, 1750), (1600, 2650),
    (150, 2750), (-1400, 2500), (-2650, 1700), (-2800, 250),
    (-2500, -900), (900, -2300), (2250, 1100), (-1950, 1950),
]
for index, (x, y) in enumerate(tree_positions):
    spawn_mesh(tree_mesh, "Greenveil Tree %02d" % (index + 1),
               (x, y, 0.0), 0.78 + (index % 3) * 0.07,
               (index * 47) % 360, True)

fern_folder = "fern_02"
shrub_folder = "shrub_02"
rock_folder = "rock_moss_set_02"
fern_meshes = [mesh(fern_folder, "fern_02_%s" % v) for v in "abcd"]
shrub_meshes = [mesh(shrub_folder, "shrub_02_%s_LOD0" % v) for v in "abcd"]
rock_meshes = [mesh(rock_folder, "rock_moss_set_02_rock%s" % v)
               for v in ("07", "08", "09", "10", "11", "12", "13")]
for path in fern_meshes + shrub_meshes + rock_meshes:
    if not unreal.load_asset(path):
        raise RuntimeError("A required Greenveil foliage mesh is missing: " + path)

# Fern groups, varied shrubs and mossy rocks soften the forest edge.
plant_groups = [(-1900, -1400), (-1500, 1300), (-950, 1950), (950, 1850),
                (1800, 900), (2000, -800), (800, -1750), (-900, -1850),
                (-2650, 100), (2700, -650), (2600, 1250), (-2400, 1600)]
for index, (x, y) in enumerate(plant_groups):
    spawn_mesh(fern_meshes[index % len(fern_meshes)],
               "Greenveil Fern %02d" % (index + 1), (x, y, 0.0),
               0.95 + (index % 3) * 0.12, (index * 51) % 360)
    spawn_mesh(shrub_meshes[(index + 2) % len(shrub_meshes)],
               "Greenveil Shrub %02d" % (index + 1),
               (x + 110.0, y + 120.0, 0.0),
               0.56 + (index % 2) * 0.08, (index * 37) % 360)

rock_positions = [(-2300, -1750), (-2050, -1700), (2300, -1700),
                  (2550, -1550), (-2550, 1850), (2450, 1900),
                  (600, 2150), (-650, -2150)]
for index, (x, y) in enumerate(rock_positions):
    spawn_mesh(rock_meshes[index % len(rock_meshes)],
               "Greenveil Moss Rock %02d" % (index + 1),
               (x, y, 0.0), 0.36 + (index % 3) * 0.05,
               (index * 31) % 360, True)

stump_mesh = mesh("tree_stump_01", "tree_stump_01_1k")
for index, (x, y) in enumerate([(-2100, -650), (-1800, 1550),
                                (2100, 1250), (1600, -1650)]):
    spawn_mesh(stump_mesh, "Greenveil Stump %02d" % (index + 1),
               (x, y, 0.0), 0.66 + (index % 2) * 0.08, index * 41, True)

# Small care props give the first interaction target a believable context.
spawn_mesh(mesh("wooden_bowl_01", "wooden_bowl_01_1k"),
           "Greenveil Feed Bowl", (720.0, -100.0, 6.0), 0.8)
spawn_mesh(mesh("wooden_bucket_01", "wooden_bucket_01"),
           "Greenveil Water Pail", (-100.0, 650.0, 0.0), 0.8)

animal_class = unreal.load_class(None, "/Script/Wildbound.WildboundPrototypeAnimal")
if not animal_class:
    raise RuntimeError("WildboundPrototypeAnimal is not compiled")
deer = spawn_actor(animal_class, "Greenveil White-tailed Deer", (420.0, 0.0, 82.0))
deer.set_actor_label("Greenveil White-tailed Deer")

spawn_actor(unreal.PlayerStart, "Greenveil Player Start", (-700.0, 0.0, 100.0))

sun = spawn_actor(unreal.DirectionalLight, "Greenveil Sun", (0.0, 0.0, 0.0),
                  (-42.0, -32.0, 0.0))
sun.get_component_by_class(unreal.DirectionalLightComponent).set_editor_property(
    "intensity", 32000.0)

sky = spawn_actor(unreal.SkyLight, "Greenveil Sky Light", (0.0, 0.0, 0.0))
sky_component = sky.get_component_by_class(unreal.SkyLightComponent)
sky_component.set_mobility(unreal.ComponentMobility.MOVABLE)
sky_component.set_editor_property("intensity", 1.0)
sky_component.set_editor_property("real_time_capture", True)

spawn_actor(unreal.SkyAtmosphere, "Greenveil Sky Atmosphere", (0.0, 0.0, 0.0))
fog = spawn_actor(unreal.ExponentialHeightFog, "Greenveil Distance Fog",
                  (0.0, 0.0, 0.0))
fog_component = fog.get_component_by_class(unreal.ExponentialHeightFogComponent)
fog_component.set_editor_property("fog_density", 0.0007)
fog_component.set_editor_property("fog_height_falloff", 0.25)

if not LEVEL_EDITOR.save_current_level():
    raise RuntimeError("Could not save the Greenveil test map")

unreal.log("Saved Greenveil map with CC0 trees, shrubs, ferns, rocks, care props, deer, and PlayerStart")
