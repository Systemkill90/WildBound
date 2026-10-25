"""Convert a generated local MP3 to stereo 48 kHz PCM WAV for Unreal import."""
from pathlib import Path
import os
import sys
import wave
import av

IMAGE_ROOT = Path(os.environ.get("WILDBOUND_IMAGE_ROOT", str(Path(__file__).parent / "runtime" / "images"))).resolve()
PROJECT_ROOT = Path(os.environ.get("WILDBOUND_REPO", str(Path(__file__).resolve().parents[3]))).resolve()
GENERATED_ROOT = PROJECT_ROOT / "Content" / "GeneratedAIAssets" / "AudioStudio"

source = Path(sys.argv[1]).resolve(strict=True)
destination = Path(sys.argv[2]).resolve()
if not source.is_relative_to(IMAGE_ROOT) or source.suffix.lower() != ".mp3":
    raise SystemExit("Only MP3 output from the local image/audio folder can be converted.")
if destination.parent != GENERATED_ROOT.resolve() or destination.suffix.lower() != ".wav":
    raise SystemExit("The WAV destination must be directly inside the WildBound AudioStudio assets folder.")

container = av.open(str(source), mode="r")
audio_stream = next(iter(container.streams.audio), None)
if audio_stream is None:
    raise SystemExit("The generated MP3 has no audio stream.")
resampler = av.AudioResampler(format="s16", layout="stereo", rate=48_000)
with wave.open(str(destination), "wb") as output:
    output.setnchannels(2)
    output.setsampwidth(2)
    output.setframerate(48_000)
    for frame in container.decode(audio_stream):
        for converted in resampler.resample(frame):
            output.writeframesraw(converted.to_ndarray().tobytes())
    for converted in resampler.resample(None):
        output.writeframesraw(converted.to_ndarray().tobytes())
container.close()
print(destination)
