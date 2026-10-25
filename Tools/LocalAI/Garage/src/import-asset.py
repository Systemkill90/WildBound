"""Unreal commandlet adapter: imports only a reviewed, hashed Garage artifact."""
import os, json, hashlib
import unreal

request_path = os.environ['GARAGE_IMPORT_REQUEST']
request = json.load(open(request_path,encoding='utf-8'))
source = request['source']
if hashlib.sha256(open(source,'rb').read()).hexdigest()!=request['sha256']:
    raise RuntimeError('Reviewed source changed before Unreal import.')
destination = request['destination']
if not destination.startswith('/Game/GeneratedAIAssets/Garage/') or '..' in destination:
    raise RuntimeError('Invalid Garage asset destination.')
result_path=request['resultPath']
if os.path.isfile(result_path):
    old=json.load(open(result_path,encoding='utf-8'))
    if old.get('sha256')==request['sha256'] and all(unreal.EditorAssetLibrary.does_asset_exist(a['path']) for a in old.get('assets',[])) and old.get('assets'):
        unreal.log('GARAGE_IMPORT_REUSED='+result_path)
    else:
        raise RuntimeError('Previous import evidence does not match the reviewed source.')
else:
    if unreal.EditorAssetLibrary.does_directory_exist(destination) and unreal.EditorAssetLibrary.list_assets(destination,recursive=True,include_folder=False):
        raise RuntimeError('Partial import already exists. Inspect that output before attempting recovery; it was not overwritten.')
    task=unreal.AssetImportTask()
    task.filename=source; task.destination_path=destination; task.destination_name=request['assetName']
    task.automated=True;task.replace_existing=False;task.save=True
    if request['kind']=='model':
        options=unreal.FbxImportUI()
        options.set_editor_property('automated_import_should_detect_type',False)
        skeletal=bool(request.get('skeletal'))
        options.set_editor_property('import_as_skeletal',skeletal)
        options.set_editor_property('mesh_type_to_import',unreal.FBXImportType.FBXIT_SKELETAL_MESH if skeletal else unreal.FBXImportType.FBXIT_STATIC_MESH)
        options.set_editor_property('import_mesh',True)
        options.set_editor_property('import_materials',True)
        options.set_editor_property('import_textures',True)
        options.set_editor_property('import_animations',skeletal)
        if not skeletal:
            options.static_mesh_import_data.set_editor_property('combine_meshes',True)
            options.static_mesh_import_data.set_editor_property('auto_generate_collision',True)
        task.options=options
    unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])
    paths=list(task.imported_object_paths)
    if not paths: raise RuntimeError('Unreal returned no imported assets.')
    if request['kind']=='texture':
        texture=next((unreal.load_asset(p) for p in paths if isinstance(unreal.load_asset(p),unreal.Texture2D)),None)
        if not texture: raise RuntimeError('Texture2D import is missing.')
        material=unreal.AssetToolsHelpers.get_asset_tools().create_asset('M_'+request['assetName'],destination,unreal.Material,unreal.MaterialFactoryNew())
        expression=unreal.MaterialEditingLibrary.create_material_expression(material,unreal.MaterialExpressionTextureSample,0,0)
        expression.texture=texture
        unreal.MaterialEditingLibrary.connect_material_property(expression,'RGB',unreal.MaterialProperty.MP_BASE_COLOR)
        unreal.MaterialEditingLibrary.recompile_material(material)
        unreal.EditorAssetLibrary.save_loaded_asset(material)
        paths.append(material.get_path_name())
    assets=[]
    for item in unreal.EditorAssetLibrary.list_assets(destination,recursive=True,include_folder=False):
        obj=unreal.load_asset(item)
        if obj:
            unreal.EditorAssetLibrary.save_loaded_asset(obj)
            assets.append({'path':obj.get_path_name(),'class':obj.get_class().get_name()})
    expected={'texture':'Texture2D','voice':'SoundWave','music':'SoundWave','ambience':'SoundWave','model':'SkeletalMesh' if request.get('skeletal') else 'StaticMesh'}[request['kind']]
    if not any(a['class']==expected for a in assets): raise RuntimeError('Expected Unreal asset class missing: '+expected)
    json.dump({'verified':True,'sha256':request['sha256'],'expectedClass':expected,'assets':assets,'destination':destination,
        'limits':'Loaded and saved in Unreal. In-level appearance, animation behavior, collision quality, and packaged gameplay require scene review.'},open(result_path,'w',encoding='utf-8'),indent=2)
    unreal.log('GARAGE_IMPORT_VERIFIED='+result_path)
