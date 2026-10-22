"""Read-only level/asset diagnostics; output is kept in the local Unreal log."""
import unreal
w=unreal.EditorLoadingAndSavingUtils.load_map('/Game/Maps/GreenveilExploration')
e=unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
for a in e.get_all_level_actors():
    if isinstance(a,unreal.NavMeshBoundsVolume) or 'Terrain' in a.get_actor_label():
        unreal.log('GREENVEIL_INSPECT '+a.get_actor_label()+' bounds='+str(a.get_actor_bounds(False)))
        if isinstance(a,unreal.StaticMeshActor):
            m=a.static_mesh_component.static_mesh
            unreal.log('GREENVEIL_INSPECT body='+str(m.get_editor_property('body_setup').get_editor_property('collision_trace_flag'))+' nav='+str(m.get_editor_property('has_navigation_data'))+' two_sided='+str(a.static_mesh_component.get_material(0).get_editor_property('two_sided')))
assert unreal.Rotator(yaw=90).yaw == 90
unreal.log('GREENVEIL_INSPECT rotation='+str(unreal.Rotator(yaw=90)))
