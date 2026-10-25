"""Import one generated WAV as a SoundWave in the WildBound Unreal project."""
import os
import unreal

source = os.environ.get("WILDBOUND_AUDIO_SOURCE", "")
asset_name = os.environ.get("WILDBOUND_AUDIO_ASSET_NAME", "")
if not source or not os.path.isfile(source) or not source.lower().endswith(".wav"):
    raise RuntimeError("The generated WAV source is missing or invalid.")
if not asset_name or not asset_name.replace("_", "").isalnum():
    raise RuntimeError("The generated audio asset name is invalid.")

task = unreal.AssetImportTask()
task.filename = source
task.destination_path = "/Game/GeneratedAIAssets/AudioStudio"
task.destination_name = asset_name
task.automated = True
task.replace_existing = False
task.save = True
unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])
paths = list(task.imported_object_paths)
if not paths:
    raise RuntimeError("Unreal did not create the expected SoundWave asset.")
unreal.log("WILDBOUND_AUDIO_IMPORTED=" + paths[0])
