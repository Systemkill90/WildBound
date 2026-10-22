"""Rebuild a bounded local-only exploration level. Never edits sample content.
Run UnrealEditor-Cmd Wildbound.uproject -ExecutePythonScript=<this file>.
Original terrain/building geometry; existing locally installed art only.
"""
import unreal, math, random, os, json

SEED = 221026
rng = random.Random(SEED)
ROOT = '/Game/Wildbound/Exploration'
LEVEL = '/Game/Maps/GreenveilExploration'
E = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
L = unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
S = unreal.get_editor_subsystem(unreal.StaticMeshEditorSubsystem)
REPORT = {'seed': SEED, 'map': LEVEL, 'instances': {}, 'missing': []}
unreal.EditorAssetLibrary.make_directory(ROOT)
WORLD = unreal.EditorLoadingAndSavingUtils.new_blank_map(False)
if not WORLD: raise RuntimeError('Cannot create exploration level')

def actor(cls, name, p, rot=(0,0,0)):
    rotation=unreal.Rotator(pitch=rot[0],yaw=rot[1],roll=rot[2])
    a = E.spawn_actor_from_class(cls, unreal.Vector(*p), rotation)
    a.set_actor_location(unreal.Vector(*p), False, False)
    a.set_actor_rotation(rotation, False)
    a.set_actor_label('Greenveil '+name)
    return a

def material(name, color, rough=.85, metal=0):
    path = ROOT+'/'+name
    m = unreal.load_asset(path)
    if m: return m
    m = unreal.AssetToolsHelpers.get_asset_tools().create_asset(name,ROOT,unreal.Material,unreal.MaterialFactoryNew())
    c = unreal.MaterialEditingLibrary.create_material_expression(m,unreal.MaterialExpressionConstant3Vector)
    c.set_editor_property('constant',unreal.LinearColor(*color))
    unreal.MaterialEditingLibrary.connect_material_property(c,'',unreal.MaterialProperty.MP_BASE_COLOR)
    for value, prop in [(rough,unreal.MaterialProperty.MP_ROUGHNESS),(metal,unreal.MaterialProperty.MP_METALLIC)]:
        n = unreal.MaterialEditingLibrary.create_material_expression(m,unreal.MaterialExpressionConstant)
        n.set_editor_property('r',value)
        unreal.MaterialEditingLibrary.connect_material_property(n,'',prop)
    unreal.MaterialEditingLibrary.recompile_material(m)
    return m

wood=material('M_Timber',(.16,.075,.028,1))
plaster=material('M_Limewash',(.57,.47,.29,1))
roof=material('M_Slate',(.055,.075,.068,1))
stone=material('M_Stone',(.21,.235,.18,1))
water=material('M_Creek',(.025,.12,.13,1),.17,.25)
iron=material('M_Iron',(.08,.09,.085,1),.48,.7)
floor=unreal.load_asset('/Game/Wildbound/Art/Environment/PolyHaven/ForestGround01/M_GreenveilForestFloor')
trail=unreal.load_asset('/Game/Wildbound/Art/Environment/PolyHaven/ForestGround01/M_GreenveilForestPath')
if not floor or not trail: raise RuntimeError('Install existing Poly Haven floor materials first')

def mesh(path,name,p,scale=(1,1,1),rot=(0,0,0),mat=None,collision=False):
    asset=unreal.load_asset(path) if isinstance(path,str) else path
    if not asset: raise RuntimeError('Missing mesh '+str(path))
    a=actor(unreal.StaticMeshActor,name,p,rot)
    c=a.static_mesh_component
    c.set_static_mesh(asset)
    c.set_mobility(unreal.ComponentMobility.STATIC)
    c.set_collision_profile_name('BlockAll' if collision else 'NoCollision')
    if mat: c.set_material(0,mat)
    a.set_actor_scale3d(unreal.Vector(*scale))
    return a

def box(name,p,size,mat=wood,rot=(0,0,0),collision=True):
    return mesh('/Engine/BasicShapes/Cube',name,p,tuple(v/100 for v in size),rot,mat,collision)

def river(y): return 800+340*math.sin(y/2400)
def height(x,y):
    base=105+65*math.sin(x/2400)*math.cos(y/2800)+35*math.sin(y/1700)
    edge=max(0,(max(abs(x)/9000,abs(y)/8000)-.72)/.28)
    base+=edge*edge*1250
    bank=math.exp(-((x-river(y))/530)**4)
    return base*(1-bank)-115*bank

# Interchange's OBJ default converts right-handed (X,Y,Z) to (X,-Y,Z).
def surface(name,vertices,faces,mat,collision):
    dest=os.path.join(unreal.Paths.project_saved_dir(),'GreenveilGenerated')
    os.makedirs(dest,exist_ok=True)
    filename=os.path.abspath(os.path.join(dest,name+'.obj'))
    with open(filename,'w') as f:
        f.write('o '+name+'\n')
        for x,y,z in vertices: f.write('v %f %f %f\n'%(x,-y,z))
        for x,y,z in vertices: f.write('vt %f %f\n'%(x/500,y/500))
        for a,b,c in faces: f.write('f %d/%d %d/%d %d/%d\n'%(a,a,c,c,b,b))
    task=unreal.AssetImportTask()
    task.set_editor_property('filename',filename)
    task.set_editor_property('destination_path',ROOT)
    task.set_editor_property('automated',True)
    task.set_editor_property('replace_existing',True)
    task.set_editor_property('save',True)
    options=unreal.FbxImportUI()
    options.set_editor_property('import_materials',False)
    options.set_editor_property('import_textures',False)
    options.static_mesh_import_data.set_editor_property('combine_meshes',True)
    options.static_mesh_import_data.set_editor_property('auto_generate_collision',False)
    task.set_editor_property('options',options)
    unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])
    paths=task.get_editor_property('imported_object_paths')
    if not paths: raise RuntimeError('OBJ import failed '+name)
    asset=unreal.load_asset(paths[0])
    if collision:
        asset.get_editor_property('body_setup').set_editor_property('collision_trace_flag',unreal.CollisionTraceFlag.CTF_USE_COMPLEX_AS_SIMPLE)
    mesh(asset,name,(0,0,0),mat=mat,collision=collision)
    unreal.log('EXPLORATION mesh '+name+' bounds '+str(asset.get_bounds()))

verts=[]; faces=[]
nx,ny=91,81
for j in range(ny):
    for i in range(nx):
        x=-9000+i*200; y=-8000+j*200
        verts.append((x,y,height(x,y)))
for j in range(ny-1):
    for i in range(nx-1):
        a=j*nx+i+1; b=a+1; c=a+nx; d=c+1
        faces.extend([(a,b,d),(a,d,c)])
surface('SM_GreenveilTerrain',verts,faces,floor,True)
for x,y,sx,sy in [(9000,0,80,16000),(-9000,0,80,16000),(0,8000,18000,80),(0,-8000,18000,80)]:
    boundary=box('Exploration boundary',(x,y,1600),(sx,sy,5000),stone)
    boundary.set_actor_hidden_in_game(True)

# Continuous shallow ribbon, kept separate from terrain for clear banks.
verts=[]; faces=[]
for j in range(81):
    y=-8000+j*200
    for side in [-1,1]: verts.append((river(y)+side*390,y,-25))
for j in range(80):
    a=2*j+1; faces.extend([(a,a+1,a+3),(a,a+3,a+2)])
surface('SM_CreekRibbon',verts,faces,water,False)

route=[(-4500,-3500),(-2850,-2900),(-2850,-2300),(-2850,-2900),(-2000,-3000),(-1500,-2000),(-1500,0),(-300,0),(2200,0),(4000,2300),(3200,4500),(-1200,4500),(-6200,2000),(-6200,-3500),(-4500,-3500)]
def segment_distance(x,y,a,b):
    dx=b[0]-a[0];dy=b[1]-a[1]
    t=max(0,min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)))
    return math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)
verts=[];faces=[]
for a,b in zip(route,route[1:]):
    if a==(-300,0): continue # bridge deck
    length=math.dist(a,b); steps=max(2,int(length/120))
    dx=(b[0]-a[0])/length;dy=(b[1]-a[1])/length
    start=len(verts)
    for j in range(steps+1):
        x=a[0]+(b[0]-a[0])*j/steps;y=a[1]+(b[1]-a[1])*j/steps
        for side in [-1,1]:
            xx=x-side*dy*140;yy=y+side*dx*140
            verts.append((xx,yy,height(xx,yy)+5))
    for j in range(steps):
        k=start+j*2+1;faces.extend([(k,k+1,k+3),(k,k+3,k+2)])
surface('SM_WalkingTrails',verts,faces,trail,False)

# Two small timber crossings with rails and bank ramps.
for by in [0,4500]:
    cx=river(by)
    for j in range(29): box('Bridge plank',(cx-1400+j*100,by,130),(98,330,22))
    for sy in [-1,1]:
        box('Bridge rail',(cx,by+sy*155,240),(2800,14,16))
        for xx in range(-1300,1400,400): box('Bridge post',(cx+xx,by+sy*155,180),(20,20,160))
    for side in [-1,1]:
        x=cx+side*1600
        z=height(x,by)
        box('Bridge approach',(x,by,(z+130)/2-12),(430,330,25),wood,(side*math.degrees(math.atan2(z-130,400)),0,0))

# Walk-in cottages: open 140 cm front doors, actual floors, roofs, beams/chimneys.
def cottage(x,y,w=800,d=650):
    z=max(height(x+sx*w/2,y+sy*d/2) for sx in [-1,1] for sy in [-1,1])+20
    box('Cottage stone foundation',(x,y,z-30),(w+50,d+50,60),stone)
    box('Cottage floor',(x,y,z+8),(w,d,16))
    for sy in [-1,1]:
        if sy==1: box('Cottage back',(x,y+d/2,z+175),(w,25,350),plaster)
        else:
            for sx in [-1,1]: box('Door side',(x+sx*(w/4+35),y-d/2,z+175),((w-140)/2,25,350),plaster)
            box('Door lintel',(x,y-d/2,z+310),(150,30,80),plaster)
    for sx in [-1,1]:
        box('Cottage side',(x+sx*w/2,y,z+175),(25,d,350),plaster)
        for sy in [-1,1]: box('Oak corner',(x+sx*w/2,y+sy*d/2,z+180),(35,35,360))
        box('Sloped slate roof',(x+sx*w/4,y,z+400),(w*.58,d+130,28),roof,(-sx*27,0,0))
    box('Roof ridge',(x,y,z+510),(30,d+140,30))
    box('Chimney',(x+w*.3,y+d*.25,z+450),(100,110,340),stone)
    for j in range(3): box('Doorstep',(x,y-d/2-70-j*45,z-10-j*16),(170,75,25),stone)
    for sx in [-1,1]:
        box('Shutter',(x+sx*w*.30,y-d/2-18,z+220),(100,12,105),wood,collision=False)
    # bench, worktable, bucket, bowl and readable tool silhouettes.
    box('Workbench',(x+w/2+170,y,z+100),(160,260,20))
    for yy in [-90,90]: box('Table trestle',(x+w/2+170,y+yy,z+50),(120,20,100))
    for j in range(3):
        box('Tool handle',(x+w/2+130+j*40,y-40,z+125),(10,140,10),wood,collision=False)
        box('Tool iron head',(x+w/2+130+j*40,y+22,z+130),(45,18,18),iron,collision=False)
    return z
homes=[(-2850,-2300),(-4800,-500),(-3000,2400)]
for x,y in homes: cottage(x,y)

PH='/Game/Wildbound/Art/Environment/PolyHaven/'
def ph(folder,name): return PH+folder+'/'+name
bucket=ph('wooden_bucket_01','wooden_bucket_01')
bowl=ph('wooden_bowl_01','wooden_bowl_01_1k')
for x,y in homes:
    z=height(x+650,y-350)
    mesh(bucket,'Household pail',(x+650,y-350,z),(.8,.8,.8))
    mesh(bowl,'Supply bowl',(x+570,y,z+120),(.8,.8,.8))
    for j in range(5):
        box('Garden bed',(x-250+j*110,y+650,height(x-250+j*110,y+650)+15),(70,450,30),stone,collision=False)
    for j in range(7):
        xx=x-550+j*180;yy=y+1050;zz=height(xx,yy)
        box('Garden fence post',(xx,yy,zz+60),(18,18,120))
        if j<6:
            for hh in [45,95]: box('Garden rail',(xx+90,yy,zz+hh),(185,12,12))

# Small wayside overlook with shelter and seating.
x,y=4200,2500;z=height(x,y)
box('Lookout platform',(x,y,z+30),(600,500,40))
for sx in [-1,1]:
    for sy in [-1,1]: box('Shelter post',(x+sx*260,y+sy*210,z+180),(25,25,310))
box('Shelter roof',(x,y,z+350),(690,610,25),roof,(0,0,8))
box('Overlook bench',(x,y+130,z+90),(380,80,25))

# Dense low-cost vegetation: one HISM actor per mesh, fixed deterministic seed.
def instances(path,name,points,collide=False,cull=11000):
    asset=unreal.load_asset(path)
    if not asset:
        REPORT['missing'].append(path);return
    a=actor(unreal.load_class(None,'/Script/Wildbound.GreenveilInstances'),name,(0,0,0))
    c=a.get_component_by_class(unreal.HierarchicalInstancedStaticMeshComponent)
    c.set_static_mesh(asset)
    c.set_mobility(unreal.ComponentMobility.STATIC)
    c.set_collision_profile_name('BlockAll' if collide else 'NoCollision')
    for slot in range(asset.get_num_sections(0)):
        m=asset.get_material(slot)
        if m and m.get_path_name().startswith(PH):
            unreal.MaterialEditingLibrary.set_material_usage(m,unreal.MaterialUsage.MATUSAGE_INSTANCED_STATIC_MESHES)
            unreal.EditorAssetLibrary.save_loaded_asset(m)
    c.set_cull_distances(cull-2000,cull)
    for x,y,z,s,yaw in points:
        c.add_instance(unreal.Transform(location=unreal.Vector(x,y,z),rotation=unreal.Rotator(yaw=yaw),scale=unreal.Vector(s,s,s)),False)
    REPORT['instances'][name]=len(points)

def reserved(x,y,margin=0):
    if abs(x-river(y))<650+margin:return True
    if min(segment_distance(x,y,a,b) for a,b in zip(route,route[1:]))<220+margin:return True
    if any(abs(x-hx)<950+margin and abs(y-hy)<1250+margin for hx,hy in homes):return True
    if math.dist((x,y),(4200,2500))<700+margin:return True
    return False

trees=[[],[]];plants=[[] for _ in range(8)];rocks=[[] for _ in range(4)]
for _ in range(650):
    x=rng.uniform(-8600,8600);y=rng.uniform(-7600,7600)
    if reserved(x,y,180):continue
    trees[rng.randrange(2)].append((x,y,height(x,y),rng.uniform(1.15,1.8),rng.uniform(0,360)))
for _ in range(6900):
    x=rng.uniform(-8500,8500);y=rng.uniform(-7500,7500)
    if reserved(x,y):continue
    plants[rng.randrange(8)].append((x,y,height(x,y),rng.uniform(1,1.8),rng.uniform(0,360)))
for _ in range(180):
    x=rng.uniform(-8400,8400);y=rng.uniform(-7400,7400)
    if reserved(x,y,60):continue
    rocks[rng.randrange(4)].append((x,y,height(x,y)-10,rng.uniform(.25,.6),rng.uniform(0,360)))
for i,points in enumerate(trees):
    instances('/Game/Megascans/3D_Plants/EuropeanHornbeam/Geometry/SimpleWind/SM_EuropeanHornbeam_Forest_'+['05','07'][i],'Hornbeam '+str(i),points,True,21000)
for i,points in enumerate(plants):
    if i<4: p=ph('fern_02','fern_02_'+ 'abcd'[i])
    else:p=ph('shrub_02','shrub_02_'+ 'abcd'[i-4]+'_LOD0')
    instances(p,'Understory '+str(i),points,False,6500)
for i,points in enumerate(rocks): instances(ph('rock_moss_set_02','rock_moss_set_02_rock'+['07','08','09','10'][i]),'Moss rocks '+str(i),points,True,14000)
points=[]
for _ in range(35):
    x=rng.uniform(-7000,7000);y=rng.uniform(-6500,6500)
    if not reserved(x,y,50):points.append((x,y,height(x,y),rng.uniform(.6,.9),rng.uniform(0,360)))
instances(ph('tree_stump_01','tree_stump_01_1k'),'Stumps',points,True)
for i,kind in enumerate(['A','B','C']):
    p='/Game/GV_FreeShrubsPack/Meshes/Shrubs/Wind/Shrub_'+kind+'/GV_Vol7_Shrub_'+kind+'_full_type1'
    instances(p,'Wind shrubs '+kind,plants[i][::8],False,6500)

groundcover=[[],[],[]]
for _ in range(11000):
    x=rng.uniform(-8600,8600);y=rng.uniform(-7600,7600)
    if reserved(x,y):continue
    groundcover[rng.randrange(3)].append((x,y,height(x,y)+1,rng.uniform(1,1.65),rng.uniform(0,360)))
for i,p in enumerate(['/Game/Megascans/3D_Plants/KikuyuGrass/SM_KikuyuGrass_01','/Game/Megascans/3D_Plants/KikuyuGrass/SM_KikuyuGrass_02','/Game/Megascans/3D_Plants/CloverVarieties/SM_CloverVarieties_03']):
    instances(p,'Meadow cover '+str(i),groundcover[i],False,4500)

for i,(x,y) in enumerate(route[:-1]):
    a=actor(unreal.TargetPoint,'Route %02d'%i,(x,y,height(x,y)+100))
    a.set_editor_property('tags',['GreenveilRoute','Route%02d'%i])
start=route[0]
actor(unreal.PlayerStart,'Arrival',(start[0],start[1],height(*start)+110),(0,27,0))
sun=actor(unreal.DirectionalLight,'Late afternoon sun',(0,0,1000),(-35,-40,0))
sun.light_component.set_mobility(unreal.ComponentMobility.MOVABLE)
sun.light_component.set_editor_property('intensity',5.0)
sky=actor(unreal.SkyLight,'Sky',(0,0,0))
sky.light_component.set_mobility(unreal.ComponentMobility.MOVABLE)
sky.light_component.set_editor_property('real_time_capture',True)
actor(unreal.SkyAtmosphere,'Atmosphere',(0,0,0))
fog=actor(unreal.ExponentialHeightFog,'Valley mist',(0,0,-200))
fog.component.set_editor_property('fog_density',.004)
fog.component.set_editor_property('fog_height_falloff',.35)
# Runtime nav bounds cover the traversable zone; static mesh terrain has real collision.
world=unreal.EditorLevelLibrary.get_editor_world()
unreal.GreenveilAuthoring.create_navigation_bounds(world)
world.get_world_settings().set_editor_property('default_game_mode',unreal.load_class(None,'/Script/Wildbound.WildboundPrototypeGameMode'))
if not unreal.EditorLoadingAndSavingUtils.save_map(WORLD,LEVEL):raise RuntimeError('Map save failed')
unreal.EditorAssetLibrary.save_directory(ROOT)
REPORT['actors']=len(E.get_all_level_actors())
REPORT['route_cm']=route
REPORT['extent_m']=[180,160]
with open(os.path.join(unreal.Paths.project_saved_dir(),'GreenveilExploration-generation.json'),'w') as f:json.dump(REPORT,f,indent=2)
unreal.log('EXPLORATION_GENERATION_COMPLETE '+json.dumps(REPORT))
