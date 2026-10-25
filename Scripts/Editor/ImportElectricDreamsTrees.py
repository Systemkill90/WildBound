import unreal

assets = [
    "/Game/Megascans/3D_Plants/EuropeanHornbeam/Geometry/SimpleWind/SM_EuropeanHornbeam_Forest_05",
    "/Game/Megascans/3D_Plants/EuropeanHornbeam/Geometry/SimpleWind/SM_EuropeanHornbeam_Forest_07",
]
destination = unreal.Paths.project_content_dir()
tools = unreal.AssetToolsHelpers.get_asset_tools()
for asset_path in assets:
    asset = unreal.load_asset(asset_path)
    if not asset:
        raise RuntimeError("Could not load sample foliage asset: " + asset_path)
    package_name = asset.get_outermost().get_name()
    unreal.log("MIGRATING_FOREST_ASSET " + package_name)
    tools.migrate_packages([package_name], destination)
