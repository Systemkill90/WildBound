"""One-shot offline WildBound voice render; called only by audio-server.js."""

import argparse
import json
import os
import sys
import wave
from math import gcd

import numpy as np
from scipy.signal import resample_poly

VOICE_ROOT = os.environ.get("WILDBOUND_VOICE_ROOT", os.path.join(os.path.dirname(__file__), "runtime", "voice"))
sys.path.insert(0, os.path.join(VOICE_ROOT, "python"))

from kokoro_onnx import Kokoro  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser()
    with open(os.path.join(os.path.dirname(__file__), "voice-catalog.json"), encoding="utf-8") as catalog_file:
        voices = {voice["id"] for voice in json.load(catalog_file)["voices"]}
    parser.add_argument("--voice", choices=sorted(voices), required=True)
    parser.add_argument("--speed", type=float, choices=None, default=0.96)
    parser.add_argument("--output", required=True)
    parser.add_argument("--native-output", required=True)
    args = parser.parse_args()
    request = json.load(sys.stdin)
    text = str(request.get("text", "")).strip()
    if not text or len(text) > 1_500:
        raise ValueError("Voice text must contain 1 to 1,500 characters.")

    engine = Kokoro(
        os.path.join(VOICE_ROOT, "models", "kokoro-v1.0.int8.onnx"),
        os.path.join(VOICE_ROOT, "models", "voices-v1.0.bin"),
    )
    audio, sample_rate = engine.create(text, voice=args.voice, speed=args.speed, lang="en-gb" if args.voice.startswith("b") else "en-us")
    native = np.nan_to_num(np.asarray(audio, dtype=np.float32).squeeze())
    if native.ndim != 1 or native.size == 0:
        raise ValueError("Kokoro returned an empty or unsupported audio shape.")

    native_pcm = np.round(np.clip(native, -1.0, 1.0) * 32767).astype("<i2").tobytes()
    os.makedirs(os.path.dirname(args.native_output), exist_ok=True)
    with wave.open(args.native_output, "wb") as source:
        source.setnchannels(1)
        source.setsampwidth(2)
        source.setframerate(sample_rate)
        source.writeframes(native_pcm)

    target_rate = 48_000
    divisor = gcd(target_rate, sample_rate)
    rendered = resample_poly(native, target_rate // divisor, sample_rate // divisor, window=("kaiser", 8.6))
    rendered = rendered.astype(np.float32, copy=False)
    rendered -= float(np.mean(rendered))
    rms = float(np.sqrt(np.mean(np.square(rendered))))
    peak = float(np.max(np.abs(rendered)))
    if not np.isfinite(rms) or not np.isfinite(peak) or peak < 1e-7:
        raise ValueError("Kokoro returned silent or invalid audio.")

    target_rms = 10 ** (-20 / 20)
    peak_ceiling = 10 ** (-1 / 20)
    gain = min(target_rms / max(rms, 1e-9), peak_ceiling / peak, 10 ** (12 / 20))
    rendered = np.clip(rendered * gain, -peak_ceiling, peak_ceiling)

    # Keep the voice centered while writing a conventional stereo master.
    pcm24 = np.round(rendered * 8_388_607).astype(np.int32)
    stereo = np.repeat(pcm24[:, None], 2, axis=1).reshape(-1)
    packed = np.empty((stereo.size, 3), dtype=np.uint8)
    packed[:, 0] = stereo & 0xFF
    packed[:, 1] = (stereo >> 8) & 0xFF
    packed[:, 2] = (stereo >> 16) & 0xFF
    with wave.open(args.output, "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(3)
        output.setframerate(target_rate)
        output.writeframes(packed.tobytes())

    print(json.dumps({
        "sourceSampleRate": sample_rate,
        "sampleRate": target_rate,
        "channels": 2,
        "bitDepth": 24,
        "normalizationTargetDbfs": -20,
        "peakCeilingDbfs": -1,
        "gainDb": round(20 * np.log10(max(gain, 1e-9)), 2),
    }))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
