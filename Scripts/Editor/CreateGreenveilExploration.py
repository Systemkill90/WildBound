"""Regenerate the canonical Greenveil starting world and in-world QA route.
Keep village and biome expansion in this map; it is not a disposable test scene.
Never edits sample content.
Run UnrealEditor-Cmd Wildbound.uproject -ExecutePythonScript=<this file>.
Original terrain/building geometry; existing locally installed art only.
"""
import unreal, math, random, os, json

SEED = 221026
STREAM_CHUNK_CM = 10000  # 100 m authoring chunks; World Partition runtime cells are 128 m by default.
rng = random.Random(SEED)
ROOT = '/Game/Wildbound/ExplorationPolish'
LEVEL = '/Game/Maps/GreenveilExplorationPolish'
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
# Keep the previously authored creek material: the V5 normal-map experiment
# compiled but produced near-black water in the actual packaged captures.
water=material('M_Creek',(.025,.12,.13,1),.17,.25)
iron=material('M_Iron',(.08,.09,.085,1),.48,.7)
glass=material('M_WindowGlass',(.11,.20,.19,1),.22,.05)
trim=material('M_WeatheredTrim',(.075,.045,.024,1),.88)
# Reuse the installed Electric Dreams forest surface material on our own
# bounded terrain mesh; keep the CC0 soil path for foot traffic and gardens.
floor=unreal.load_asset('/Game/Megascans/3D_Assets/ForestGround/MI_ForestGround_01')
trail=unreal.load_asset('/Game/Wildbound/Art/Environment/PolyHaven/ForestGround01/M_GreenveilForestPath')
village_roof=unreal.load_asset('/Game/Meshes/Houses/Roofs/House08_Roof/SM_House08_Roof')
village_well=unreal.load_asset('/Game/Meshes/Well/SM_MainWell')
village_facade=unreal.load_asset('/Game/Meshes/Houses/MODULAR_ASSETS/SM_FacadeLarge')
village_gable=unreal.load_asset('/Game/Meshes/Houses/MODULAR_ASSETS/SM_GableFront_03')
village_porch=unreal.load_asset('/Game/Meshes/Houses/MODULAR_ASSETS/SM_PorchBase')
village_boardwall=unreal.load_asset('/Game/Meshes/Houses/MODULAR_ASSETS/Forge/WoodBoards/SM_BoardWall')
village_window=unreal.load_asset('/Game/Meshes/Houses/MODULAR_ASSETS/WindowShutter/SM_Window')
village_windflowers=[unreal.load_asset('/Game/Megascans/3D_Plants/WhiteWindflower/SM_WhiteWindflower_'+v) for v in ('01','03')]
if not floor: raise RuntimeError('Install the local Electric Dreams forest-ground material first')
if not trail: raise RuntimeError('Install the existing Poly Haven forest path material first')
REPORT['source_ground_material']=floor.get_path_name()

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
def surface(name,vertices,faces,mat,collision,origin=(0,0,0)):
    dest=os.path.join(unreal.Paths.project_saved_dir(),'GreenveilGenerated')
    os.makedirs(dest,exist_ok=True)
    filename=os.path.abspath(os.path.join(dest,name+'.obj'))
    with open(filename,'w') as f:
        f.write('o '+name+'\n')
        for x,y,z in vertices: f.write('v %f %f %f\n'%(x-origin[0],-(y-origin[1]),z-origin[2]))
        # Keep UVs in world coordinates so adjacent streamed meshes share a continuous surface.
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
    mesh(asset,name,origin,mat=mat,collision=collision)
    unreal.log('EXPLORATION mesh '+name+' bounds '+str(asset.get_bounds()))

def tiled_surface(name,vertices,faces,mat,collision):
    """Create bounded mesh assets per 100 m tile for World Partition streaming."""
    chunks={}
    for face in faces:
        points=[vertices[index-1] for index in face]
        cx=sum(p[0] for p in points)/len(points)
        cy=sum(p[1] for p in points)/len(points)
        key=(math.floor(cx/STREAM_CHUNK_CM),math.floor(cy/STREAM_CHUNK_CM))
        chunk=chunks.setdefault(key,{'vertices':[],'indices':{},'faces':[]})
        mapped=[]
        for source_index in face:
            source_index-=1
            if source_index not in chunk['indices']:
                chunk['indices'][source_index]=len(chunk['vertices'])+1
                chunk['vertices'].append(vertices[source_index])
            mapped.append(chunk['indices'][source_index])
        chunk['faces'].append(tuple(mapped))
    for (ix,iy),chunk in sorted(chunks.items()):
        origin=((ix+.5)*STREAM_CHUNK_CM,(iy+.5)*STREAM_CHUNK_CM,0)
        ix_label=('P%02d'%ix) if ix>=0 else ('N%02d'%abs(ix))
        iy_label=('P%02d'%iy) if iy>=0 else ('N%02d'%abs(iy))
        tile_name='%s_Cell_%s_%s'%(name,ix_label,iy_label)
        surface(tile_name,chunk['vertices'],chunk['faces'],mat,collision,origin)
    REPORT.setdefault('mesh_cells',{})[name]=len(chunks)

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
tiled_surface('SM_GreenveilTerrain',verts,faces,floor,True)
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
tiled_surface('SM_CreekRibbon',verts,faces,water,False)

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
tiled_surface('SM_WalkingTrails',verts,faces,trail,False)

# Two small timber crossings with rails and bank ramps.
for by in [0,4500]:
    cx=river(by)
    # A 14 m deck is ample for the 7.8 m stream and reads as a footbridge.
    for j in range(15): box('Bridge plank',(cx-700+j*100,by,130),(98,280,22))
    for sy in [-1,1]:
        box('Bridge rail',(cx,by+sy*132,240),(1480,14,16))
        for xx in range(-650,700,325): box('Bridge post',(cx+xx,by+sy*132,180),(20,20,160))
    for side in [-1,1]:
        x=cx+side*850
        z=height(x,by)
        box('Bridge approach',(x,by,(z+130)/2-12),(300,280,25),wood,(side*math.degrees(math.atan2(z-130,150)),0,0))

# Build each cottage from the installed photogrammetry-era house modules. Keep
# the tested floor/route layout, but let authored wall, gable, porch and roof
# meshes replace the visible box-built shell. A small center doorway stays open.
def cottage(x,y,w=880,d=660):
    z=max(height(x+sx*w/2,y+sy*d/2) for sx in [-1,1] for sy in [-1,1])+20
    if village_facade and village_gable and village_roof and village_boardwall:
        panel_width=220
        box('Cottage stone footing',(x,y,z-30),(w+50,d+50,60),stone)
        box('Cottage timber floor',(x,y,z+8),(w-20,d-20,16),wood)
        # Plank wall infill behind the authored façade frames prevents the
        # open-frame look. Four narrow courses preserve the original texture
        # scale and leave only a centered, traversable front doorway.
        for row in range(4):
            wz=z+(row+.5)*114
            for i in range(4):
                px=x+(i-1.5)*panel_width
                mesh(village_boardwall,'Plank cottage rear wall course',(px,y+d/2-25,wz),collision=True)
            for side in [-1,1]:
                for i in range(3):
                    py=y+(i-1)*panel_width
                    mesh(village_boardwall,'Plank cottage side wall course',(x+side*(w/2-25),py,wz),rot=(0,90,0),collision=True)
            for side in [-1,1]:
                mesh(village_boardwall,'Plank cottage front wall course',(x+side*330,y-d/2+25,wz),scale=(1,1,1),collision=True)
                mesh(village_boardwall,'Plank cottage doorway return',(x+side*150,y-d/2+25,wz),scale=(.65,1,1),collision=True)
        # Four authored façade modules on the back and short sides.
        for i in range(4):
            px=x+(i-1.5)*panel_width
            mesh(village_facade,'Textured cottage back facade',(px,y+d/2,z),rot=(0,90,0),collision=True)
        for side in [-1,1]:
            for i in range(3):
                py=y+(i-1)*panel_width
                mesh(village_facade,'Textured cottage side facade',(x+side*w/2,py,z),collision=True)
        # Narrowed inner panels frame a roughly 1.6 m walk-in opening.
        for side in [-1,1]:
            mesh(village_facade,'Textured cottage front facade',(x+side*330,y-d/2,z),rot=(0,90,0),collision=True)
            mesh(village_facade,'Cottage doorway return',(x+side*150,y-d/2,z),scale=(1,.65,1),rot=(0,90,0),collision=True)
        for side in [-1,1]:
            mesh(village_gable,'Timber framed cottage gable',(x,y+side*d/2,z+580),scale=(1,2,1),rot=(0,90,0),collision=False)
        # A final short course closes the gable interior beneath the roof.
        for side in [-1,1]:
            for i in range(4):
                px=x+(i-1.5)*panel_width
                mesh(village_boardwall,'Cottage gable infill',(px,y+side*(d/2-55),z+513),collision=False)
        mesh(village_roof,'Textured shingle cottage roof',(x,y,z+640),scale=(1.18,1,1),collision=False)
        # Use the pack's authored shuttered window instead of flat box shutters.
        # The module bounds are about 80 x 95 cm, matching the cottage wall scale.
        if village_window:
            for side in [-1,1]:
                mesh(village_window,'Shuttered cottage front window',
                     (x+side*270,y-d/2-31,z+250),collision=False)
        # Ground-level entry deck. The source porch scaffold is intentionally
        # excluded here because it lifts the doorway onto stilts and blocks it.
        box('Grounded timber cottage porch',(x,y-d/2-65,z+12),(285,130,24),wood)
        box('Stone chimney',(x+w*.31,y+d*.22,z+500),(95,110,360),stone)
        box('Chimney crown',(x+w*.31,y+d*.22,z+700),(135,145,35),trim)
        for j in range(3):
            box('Stone cottage step',(x,y-d/2-180-j*55,z-10-j*18),(185,95,30),stone)
        # One useful work surface and household props remain inside the shell.
        box('Interior worktable',(x+w*.20,y+30,z+120),(190,260,24),wood)
        for yy in [-85,85]: box('Interior table trestle',(x+w*.20,y+yy,z+62),(140,22,116),trim)
        return z

    # Conservative visible fallback for checkouts where the local licensed
    # modular house package is not installed.
    box('Cottage stone foundation',(x,y,z-30),(w+50,d+50,60),stone)
    box('Cottage floor',(x,y,z+8),(w,d,16))
    for sy in [-1,1]:
        if sy==1: box('Cottage back',(x,y+d/2,z+175),(w,25,350),plaster)
        else:
            for sx in [-1,1]: box('Door side',(x+sx*(w/4+35),y-d/2,z+175),((w-140)/2,25,350),plaster)
            box('Door lintel',(x,y-d/2,z+310),(150,30,80),plaster)
    for sx in [-1,1]:
        box('Cottage side',(x+sx*w/2,y,z+175),(25,d,350),plaster)
        for sy in [-1,1]: box('Oak corner',(x+sx*w/2,y+sy*d/2,z+180),(42,42,360),trim)
        # Strong half-timber framing breaks up the blank limewashed walls.
        for sy in [-1,1]:
            box('Gable end frame',(x+sx*(w/2+18),y+sy*d*.28,z+160),(22,22,330),wood)
            box('Cottage eave beam',(x+sx*w/4,y+sy*(d/2+12),z+335),(w*.52,24,38),trim)
    # Use the complete sourced shingle roof when it is installed locally. Its
    # 8.26 x 6.68 m footprint matches this cottage; the procedural roof remains
    # a safe fallback for clean checkouts without the Fab sample.
    if village_roof:
        mesh(village_roof,'Sourced cottage shingle roof',(x,y,z+510),collision=False)
    else:
        for sx in [-1,1]:
            box('Sloped slate roof',(x+sx*w/4,y,z+400),(w*.58,d+130,28),roof,(-sx*27,0,0))
        box('Roof ridge',(x,y,z+510),(30,d+140,30))
    box('Chimney',(x+w*.3,y+d*.25,z+450),(100,110,340),stone)
    box('Chimney cap',(x+w*.3,y+d*.25,z+625),(135,145,28),trim)
    # A low front porch, aligned with the walk-in opening.
    box('Cottage porch deck',(x,y-d/2-135,z+8),(330,270,22),wood)
    for sx in [-1,1]:
        box('Porch support',(x+sx*145,y-d/2-230,z+135),(28,28,250),trim)
    box('Porch lintel',(x,y-d/2-230,z+265),(340,30,34),trim)
    # Dark glazed windows with solid timber casing, so openings read at game distance.
    for sx in [-1,1]:
        wx=x+sx*(w*.31)
        box('Front window glass',(wx,y-d/2-15,z+220),(145,12,145),glass,collision=False)
        for dx in [-82,82]: box('Window jamb',(wx+dx,y-d/2-25,z+220),(20,24,170),trim,collision=False)
        for dz in [-82,82]: box('Window casing',(wx,y-d/2-25,z+220+dz),(184,24,20),trim,collision=False)
        box('Window crossbar',(wx,y-d/2-30,z+220),(12,25,145),wood,collision=False)
        box('Window sill',(wx,y-d/2-40,z+135),(205,50,22),wood)
    # The open doorway remains clear; a simple hinged plank door is left ajar.
    door=box('Open cottage door',(x+82,y-d/2-22,z+180),(12,150,320),wood,(0,0,-24))
    box('Door iron latch',(x+22,y-d/2-32,z+180),(10,12,20),iron,collision=False)
    for j in range(3): box('Doorstep',(x,y-d/2-70-j*45,z-10-j*16),(170,75,25),stone)
    for sx in [-1,1]:
        box('Shutter',(x+sx*w*.30,y-d/2-18,z+220),(100,12,105),wood,collision=False)
    # bench, worktable, bucket, bowl and readable tool silhouettes.
    box('Workbench',(x+w*.20,y+10,z+100),(160,260,20))
    for yy in [-90,90]: box('Table trestle',(x+w*.20,y+yy,z+50),(120,20,100))
    for j in range(3):
        box('Tool handle',(x+w*.20-40+j*40,y-40,z+125),(10,140,10),wood,collision=False)
        box('Tool iron head',(x+w*.20-40+j*40,y+22,z+130),(45,18,18),iron,collision=False)
    return z
# Keep the authored village readable as one place from the arrival approach.
# These are assembled from the installed Medieval Village mesh kit, not new
# blockout houses. The open south side becomes a small shared green.
homes=[(-5600,-1300),(-4200,-1950),(-2800,-900)]
for x,y in homes: cottage(x,y)

# A real, sourced village well anchors the shared green between the arrival
# approach and the cottage fronts.
if village_well:
    wx,wy=-3900,-2200
    mesh(village_well,'Village commons well',(wx,wy,height(wx,wy)+1),collision=True)

PH='/Game/Wildbound/Art/Environment/PolyHaven/'
def ph(folder,name): return PH+folder+'/'+name
bucket=ph('wooden_bucket_01','wooden_bucket_01')
bowl=ph('wooden_bowl_01','wooden_bowl_01_1k')
for x,y in homes:
    z=height(x,y)
    mesh(bucket,'Household pail',(x+260,y+100,z+20),(.8,.8,.8))
    mesh(bowl,'Supply bowl',(x+220,y+115,z+120),(.8,.8,.8))
    garden_y=y+1300
    for j in range(5):
        xx=x-400+j*200; yy=garden_y
        box('Tilled garden row',(xx,yy,height(xx,yy)+8),(145,380,16),trail,collision=False)
    if village_boardwall:
        # Low planked enclosure with a broad walk-in gap facing the cottage.
        for j in range(5):
            if j==2: continue
            xx=x+(j-2)*238
            zz=height(xx,garden_y-238)
            mesh(village_boardwall,'Authored garden fence front',(xx,garden_y-238,zz+57),rot=(0,0,0),collision=True)
        for j in range(5):
            xx=x+(j-2)*238
            zz=height(xx,garden_y+238)
            mesh(village_boardwall,'Authored garden fence rear',(xx,garden_y+238,zz+57),rot=(0,0,0),collision=True)
        for side in [-1,1]:
            for j in range(2):
                yy=garden_y+(j-.5)*238
                zz=height(x+side*595,yy)
                mesh(village_boardwall,'Authored garden fence side',(x+side*595,yy,zz+57),rot=(0,90,0),collision=True)

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
    for slot in range(asset.get_num_sections(0)):
        m=asset.get_material(slot)
        if m and m.get_path_name().startswith(PH):
            unreal.MaterialEditingLibrary.set_material_usage(m,unreal.MaterialUsage.MATUSAGE_INSTANCED_STATIC_MESHES)
            unreal.EditorAssetLibrary.save_loaded_asset(m)
    grouped={}
    for point in points:
        x,y=point[0],point[1]
        key=(math.floor(x/STREAM_CHUNK_CM),math.floor(y/STREAM_CHUNK_CM))
        grouped.setdefault(key,[]).append(point)
    for (ix,iy),cell_points in sorted(grouped.items()):
        origin=((ix+.5)*STREAM_CHUNK_CM,(iy+.5)*STREAM_CHUNK_CM,0)
        cell_name='%s Cell %+03d %+03d'%(name,ix,iy)
        a=actor(unreal.load_class(None,'/Script/Wildbound.GreenveilInstances'),cell_name,origin)
        c=a.get_component_by_class(unreal.HierarchicalInstancedStaticMeshComponent)
        c.set_static_mesh(asset)
        c.set_mobility(unreal.ComponentMobility.STATIC)
        c.set_collision_profile_name('BlockAll' if collide else 'NoCollision')
        c.set_cull_distances(cull-2000,cull)
        for x,y,z,s,yaw in cell_points:
            c.add_instance(unreal.Transform(location=unreal.Vector(x-origin[0],y-origin[1],z),rotation=unreal.Rotator(yaw=yaw),scale=unreal.Vector(s,s,s)),False)
    REPORT['instances'][name]=len(points)
    REPORT.setdefault('instance_cells',{})[name]=len(grouped)

def reserved(x,y,margin=0):
    if abs(x-river(y))<650+margin:return True
    if min(segment_distance(x,y,a,b) for a,b in zip(route,route[1:]))<220+margin:return True
    if math.dist((x,y),route[0])<650+margin:return True
    # Reserve each cottage's roof, porch and small work yard without leaving
    # the long, empty strip produced by the earlier oversized exclusion.
    if any(abs(x-hx)<650+margin and abs(y-hy)<750+margin for hx,hy in homes):return True
    if math.dist((x,y),(4200,2500))<700+margin:return True
    return False

trees=[[],[]];plants=[[] for _ in range(8)];rocks=[[] for _ in range(4)]
for _ in range(850):
    x=rng.uniform(-8600,8600);y=rng.uniform(-7600,7600)
    if reserved(x,y,180):continue
    trees[rng.randrange(2)].append((x,y,height(x,y),rng.uniform(1.15,1.8),rng.uniform(0,360)))
for _ in range(15000):
    x=rng.uniform(-8500,8500);y=rng.uniform(-7500,7500)
    if reserved(x,y):continue
    # Keep the low understory at a believable scale beside the third-person character.
    plants[rng.randrange(8)].append((x,y,height(x,y),rng.uniform(.8,1.15),rng.uniform(0,360)))
for _ in range(300):
    x=rng.uniform(-8400,8400);y=rng.uniform(-7400,7400)
    if reserved(x,y,60):continue
    rocks[rng.randrange(4)].append((x,y,height(x,y)-10,rng.uniform(.3,.68),rng.uniform(0,360)))
for i,points in enumerate(trees):
    instances('/Game/Megascans/3D_Plants/EuropeanHornbeam/Geometry/SimpleWind/SM_EuropeanHornbeam_Forest_'+['05','07'][i],'Hornbeam '+str(i),points,True,21000)
for i,points in enumerate(plants):
    if i<4: p=ph('fern_02','fern_02_'+ 'abcd'[i])
    else:p=ph('shrub_02','shrub_02_'+ 'abcd'[i-4]+'_LOD0')
    instances(p,'Understory '+str(i),points,False,6500)
for i,points in enumerate(rocks): instances(ph('rock_moss_set_02','rock_moss_set_02_rock'+['07','08','09','10'][i]),'Moss rocks '+str(i),points,True,14000)
# Creek-edge boulders break the straight water ribbon into a readable stream bank.
bank_rocks=[]
for row,y in enumerate(range(-7200,7600,700)):
    if min(abs(y-bridge_y) for bridge_y in (0,4500)) < 700: continue
    for side in (-1,1):
        x=river(y)+side*rng.uniform(650,820)
        bank_rocks.append((x,y,height(x,y)-25,rng.uniform(.25,.42),rng.uniform(0,360)))
instances(ph('rock_moss_set_02','rock_moss_set_02_rock08'),'Creek-bank stones',bank_rocks,True,14000)
points=[]
for _ in range(35):
    x=rng.uniform(-7000,7000);y=rng.uniform(-6500,6500)
    if not reserved(x,y,50):points.append((x,y,height(x,y),rng.uniform(.6,.9),rng.uniform(0,360)))
instances(ph('tree_stump_01','tree_stump_01_1k'),'Stumps',points,True)

# Add a small, curated subset of the same authored forest kit as the full
# Electric Dreams source map. Sample around canopy anchors so the understory
# forms natural pockets instead of an even carpet.
def canopy_understory(count, name, path, scale_min, scale_max, spread=950, cull=9000):
    points=[]
    for _ in range(count*5):
        if len(points)>=count: break
        tree=canopy_points[rng.randrange(len(canopy_points))]
        x=tree[0]+rng.gauss(0,spread); y=tree[1]+rng.gauss(0,spread)
        if reserved(x,y,100): continue
        points.append((x,y,height(x,y),rng.uniform(scale_min,scale_max),rng.uniform(0,360)))
    instances(path,name,points,False,cull)

canopy_understory(2200,'Electric Dreams elderberry pockets',
    '/Game/Megascans/3D_Plants/Elderberry/SM_Elderberry_03',.7,1.05,1050,8500)
canopy_understory(1500,'Electric Dreams woodland ferns',
    '/Game/Megascans/3D_Plants/Fern/SM_Fern_01',.68,1.05,800,7000)

# Use authored Epic environment groups for woodland detail. The three old
# free-shrub meshes were 2 m tall at unit scale and produced oversized,
# angular foreground foliage when scattered as full shrubs.
PREFAB_PATHS={
    'fern':'/Game/Asmbly/Assemblies/BPP_FernAssembly_01',
    'rocks':'/Game/Asmbly/Assemblies/BPP_SmallRocks_01',
    'riverbank':'/Game/Asmbly/Assemblies/BPP_MediumRiverbedEmbankment_01',
}
PREFAB_CLASSES={}
def prefab(kind,name,x,y,yaw=0,scale=1,z_offset=0):
    path=PREFAB_PATHS[kind]
    if path not in PREFAB_CLASSES:
        leaf=path.rsplit('/',1)[-1]
        PREFAB_CLASSES[path]=unreal.load_class(None,path+'.'+leaf+'_C')
    cls=PREFAB_CLASSES[path]
    if not cls:
        REPORT['missing'].append(path)
        return None
    z=height(x,y)+z_offset
    a=actor(cls,name,(x,y,z),(0,yaw,0))
    a.set_actor_scale3d(unreal.Vector(scale,scale,scale))
    REPORT.setdefault('prebuilt_groups',[]).append({
        'asset':path,'name':name,'location_cm':[round(x,1),round(y,1),round(z,1)],
        'yaw':round(yaw,1),'scale':round(scale,3)
    })
    return a

# Fern groupings sit under the existing canopy and stay clear of the playable
# route, cottages, garden yards, and open arrival space.
canopy_points=trees[0]+trees[1]
fern_roots=[]
for _ in range(700):
    if len(fern_roots)>=28: break
    x=rng.uniform(-8200,8200);y=rng.uniform(-7200,7200)
    if reserved(x,y,420): continue
    if not any(math.hypot(x-t[0],y-t[1])<2200 for t in canopy_points): continue
    if any(math.hypot(x-p[0],y-p[1])<600 for p in fern_roots): continue
    if prefab('fern','Fern understory grouping %02d'%len(fern_roots),x,y,
              rng.uniform(0,360),rng.uniform(.82,1.08)):
        fern_roots.append((x,y))

# Mossy rock and branch groupings add readable forest-floor detail without a
# blanket of large single meshes.
rock_roots=[]
for _ in range(500):
    if len(rock_roots)>=14: break
    x=rng.uniform(-8200,8200);y=rng.uniform(-7200,7200)
    if reserved(x,y,260): continue
    if any(math.hypot(x-p[0],y-p[1])<1000 for p in rock_roots): continue
    if prefab('rocks','Mossy rock grouping %02d'%len(rock_roots),x,y,
              rng.uniform(0,360),rng.uniform(.85,1.12),-12):
        rock_roots.append((x,y))

# Place a few prebuilt riverbed assemblies along bends, away from the two
# tested crossings, keeping the authored clear-water channel open.
bank_roots=[]
for by in [-6500,-4000,1700,6900]:
    if min(abs(by-bridge_y) for bridge_y in (0,4500))<1000: continue
    for side in (-1,1):
        x=river(by)+side*820
        if min(segment_distance(x,by,a,b) for a,b in zip(route,route[1:]))<650: continue
        if any(math.hypot(x-hx,by-hy)<1550 for hx,hy in homes): continue
        if math.hypot(x-4200,by-2500)<1100: continue
        if prefab('riverbank','Mossy creek-bank assembly %02d'%len(bank_roots),x,by,
                  0 if side>0 else 180,.72,-35):
            bank_roots.append((x,by))

groundcover=[[],[],[]]
for _ in range(24000):
    x=rng.uniform(-8600,8600);y=rng.uniform(-7600,7600)
    if reserved(x,y):continue
    groundcover[rng.randrange(3)].append((x,y,height(x,y)+1,rng.uniform(1,1.65),rng.uniform(0,360)))
for i,p in enumerate(['/Game/Megascans/3D_Plants/KikuyuGrass/SM_KikuyuGrass_01','/Game/Megascans/3D_Plants/KikuyuGrass/SM_KikuyuGrass_02','/Game/Megascans/3D_Plants/CloverVarieties/SM_CloverVarieties_03']):
    instances(p,'Meadow cover '+str(i),groundcover[i],False,4500)

# White windflower banks and garden-edge clusters echo the Greenveil concept
# palette. Keep these hand-spaced patches sparse instead of blanket-scattering.
flowers=[[],[]]
for y in range(-6500,7000,1400):
    for side in (-1,1):
        cx=river(y)+side*980
        for _ in range(8):
            xx=cx+rng.gauss(0,210); yy=y+rng.gauss(0,270)
            if not reserved(xx,yy,30):
                flowers[rng.randrange(2)].append((xx,yy,height(xx,yy)+2,rng.uniform(.65,1.15),rng.uniform(0,360)))
for x,y in homes:
    for _ in range(14):
        xx=x+rng.uniform(-520,520); yy=y+1300+rng.uniform(-150,150)
        flowers[rng.randrange(2)].append((xx,yy,height(xx,yy)+2,rng.uniform(.65,1.0),rng.uniform(0,360)))
start_x,start_y=route[0]
for i in range(12):
    angle=2*math.pi*i/12
    cx=start_x+math.cos(angle)*1450; cy=start_y+math.sin(angle)*1450
    for _ in range(7):
        xx=cx+rng.gauss(0,110); yy=cy+rng.gauss(0,130)
        if min(segment_distance(xx,yy,a,b) for a,b in zip(route,route[1:]))>330:
            flowers[rng.randrange(2)].append((xx,yy,height(xx,yy)+2,rng.uniform(.65,1.0),rng.uniform(0,360)))
for i,mesh_path in enumerate(['/Game/Megascans/3D_Plants/WhiteWindflower/SM_WhiteWindflower_01','/Game/Megascans/3D_Plants/WhiteWindflower/SM_WhiteWindflower_03']):
    instances(mesh_path,'Greenveil white windflower patches '+str(i),flowers[i],False,7000)

REPORT['prefab_counts']={
    'fern_group_actors':len(fern_roots),
    'mossy_rock_group_actors':len(rock_roots),
    'riverbank_group_actors':len(bank_roots),
}

for i,(x,y) in enumerate(route[:-1]):
    a=actor(unreal.TargetPoint,'Route %02d'%i,(x,y,height(x,y)+100))
    a.set_editor_property('tags',['GreenveilRoute','Route%02d'%i])
start=route[0]
actor(unreal.PlayerStart,'Arrival',(start[0],start[1],height(*start)+110),(0,48,0))
sun=actor(unreal.DirectionalLight,'Late afternoon sun',(0,0,1000),(-35,-40,0))
sun.light_component.set_mobility(unreal.ComponentMobility.MOVABLE)
sun.light_component.set_editor_property('intensity',3.6)
sky=actor(unreal.SkyLight,'Sky',(0,0,0))
sky.light_component.set_mobility(unreal.ComponentMobility.MOVABLE)
sky.light_component.set_editor_property('real_time_capture',True)
actor(unreal.SkyAtmosphere,'Atmosphere',(0,0,0))
fog=actor(unreal.ExponentialHeightFog,'Valley mist',(0,0,-200))
fog.component.set_editor_property('fog_density',.004)
fog.component.set_editor_property('fog_height_falloff',.35)
# Fix exposure for the village's sunlit clearing and pale cottage materials.
# This higher-priority manual volume overrides exposure only; the GameMode's
# lower-priority local contrast and restrained bloom remain active.
exposure=actor(unreal.PostProcessVolume,'Stable Greenveil daylight exposure',(0,0,0))
exposure.set_editor_property('unbound',True)
exposure.set_editor_property('priority',200.0)
exposure.set_editor_property('blend_weight',1.0)
settings=exposure.get_editor_property('settings')
settings.set_editor_property('override_auto_exposure_method',True)
settings.set_editor_property('auto_exposure_method',unreal.AutoExposureMethod.AEM_MANUAL)
settings.set_editor_property('override_auto_exposure_bias',True)
settings.set_editor_property('auto_exposure_bias',-1.5)
exposure.set_editor_property('settings',settings)
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
