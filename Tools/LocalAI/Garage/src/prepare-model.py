"""Fixed Blender adapter. Imports an owner-supplied model; executes no generated code."""
import bpy, json, os, sys
from mathutils import Vector

request = json.load(open(sys.argv[sys.argv.index('--') + 1], encoding='utf-8'))
source, folder = request['source'], request['folder']
bpy.ops.wm.read_factory_settings(use_empty=True)
if source.lower().endswith(('.glb', '.gltf')):
    bpy.ops.import_scene.gltf(filepath=source)
elif source.lower().endswith('.obj'):
    bpy.ops.wm.obj_import(filepath=source)
else:
    bpy.ops.import_scene.fbx(filepath=source)
helpers = {bone.custom_shape for armature in bpy.context.scene.objects if armature.type == 'ARMATURE' for bone in armature.pose.bones if bone.custom_shape}
for armature in (obj for obj in bpy.context.scene.objects if obj.type == 'ARMATURE'):
    for bone in armature.pose.bones:
        if bone.custom_shape in helpers:
            bone.custom_shape = None
for helper in helpers:
    bpy.data.objects.remove(helper, do_unlink=True)
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
if not meshes:
    raise RuntimeError('The supplied model has no mesh geometry.')
triangles = 0
vertices = 0
groups = []
for obj in meshes:
    mesh = obj.data
    mesh.calc_loop_triangles()
    triangles += len(mesh.loop_triangles)
    vertices += len(mesh.vertices)
    if triangles > 2_000_000 or vertices > 2_000_000:
        raise RuntimeError('Model exceeds the two-million triangle/vertex staging limit.')
    # Bounded native preview; original full mesh is preserved for export.
    if sum(len(g['indices']) // 3 for g in groups) + len(mesh.loop_triangles) > 150_000:
        continue
    for material_index in set(t.material_index for t in mesh.loop_triangles):
        positions, indices, uv = [], [], []
        for triangle in mesh.loop_triangles:
            if triangle.material_index != material_index:
                continue
            for vi, li in zip(triangle.vertices, triangle.loops):
                p = obj.matrix_world @ mesh.vertices[vi].co
                positions.extend([round(p.x, 6), round(p.z, 6), round(-p.y, 6)])
                indices.append(len(indices))
                tex = mesh.uv_layers.active.data[li].uv if mesh.uv_layers.active else (0, 0)
                uv.extend([float(tex[0]), 1.0-float(tex[1])])
        color = [0.5, 0.5, 0.5, 1]
        texture = None
        mat = obj.material_slots[material_index].material if material_index < len(obj.material_slots) else None
        if mat:
            color = list(mat.diffuse_color)
            if mat.use_nodes:
                bsdf = next((n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
                if bsdf:
                    color = list(bsdf.inputs['Base Color'].default_value)
                    links = list(bsdf.inputs['Base Color'].links)
                    node = links[0].from_node if links else None
                    if node and node.type == 'TEX_IMAGE' and node.image:
                        texture = os.path.join(folder, 'preview_texture_%d.png' % len(groups))
                        node.image.save_render(texture)
        groups.append({'name': obj.name, 'positions': positions, 'indices': indices, 'uv': uv, 'color': color, 'texture': texture})
if not groups:
    raise RuntimeError('Model is too dense for the native preview. Supply a lower-detail review model.')
output = os.path.join(folder, 'prepared.fbx')
bpy.ops.export_scene.fbx(filepath=output, use_selection=False, object_types={'MESH','ARMATURE','EMPTY'},
    apply_unit_scale=True, add_leaf_bones=False, bake_anim=True, path_mode='COPY', embed_textures=True)
preview = os.path.join(folder, 'preview.mesh.json')
json.dump({'groups':groups}, open(preview,'w',encoding='utf-8'))
points = [obj.matrix_world @ vertex.co for obj in meshes for vertex in obj.data.vertices]
dimensions = [float(max(point[i] for point in points) - min(point[i] for point in points)) for i in range(3)]
report = {'vertices':vertices,'triangles':triangles,'meshes':len(meshes),
    'armatures':sum(o.type=='ARMATURE' for o in bpy.context.scene.objects),
    'animations':[a.name for a in bpy.data.actions],
    'dimensionsMeters': dimensions,
    'preview':preview,'prepared':output,
    'note':'Native preview shows the bind/rest pose. Existing skeletons and actions are exported; their gameplay suitability needs review.'}
json.dump(report,open(os.path.join(folder,'model-report.json'),'w',encoding='utf-8'),indent=2)
