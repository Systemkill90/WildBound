"""Inspect local artifacts or convert an audio source into an Unreal WAV."""
import sys, json, wave, os
mode, source = sys.argv[1:3]
if mode == 'convert':
    import av
    target = sys.argv[3]
    with av.open(source) as container, wave.open(target,'wb') as output:
        output.setnchannels(2); output.setsampwidth(2); output.setframerate(48000)
        resampler = av.AudioResampler(format='s16',layout='stereo',rate=48000)
        for frame in container.decode(audio=0):
            for converted in resampler.resample(frame): output.writeframesraw(converted.to_ndarray().tobytes())
        for converted in resampler.resample(None): output.writeframesraw(converted.to_ndarray().tobytes())
    print(json.dumps({'file':target}))
elif mode == 'image':
    from PIL import Image
    with Image.open(source) as image:
        image.load()
        if image.width < 64 or image.height < 64: raise ValueError('Image is too small.')
        print(json.dumps({'width':image.width,'height':image.height,'mode':image.mode,'format':image.format}))
elif mode == 'audio':
    import numpy as np
    with wave.open(source,'rb') as audio:
        frames=audio.getnframes(); rate=audio.getframerate(); width=audio.getsampwidth(); channels=audio.getnchannels()
        if not frames or rate!=48000 or width not in (2,3): raise ValueError('Expected nonempty 48 kHz PCM16/PCM24 audio.')
        data=audio.readframes(frames)
        if width==2: samples=np.frombuffer(data,dtype='<i2').astype(np.float64)/32768
        else:
            b=np.frombuffer(data,dtype=np.uint8).reshape(-1,3).astype(np.int32)
            n=b[:,0]|(b[:,1]<<8)|(b[:,2]<<16); n=np.where(n & 0x800000,n-0x1000000,n); samples=n.astype(np.float64)/8388608
        peak=float(np.max(np.abs(samples))); rms=float(np.sqrt(np.mean(samples*samples)))
        if peak<1e-6 or not np.isfinite(rms): raise ValueError('Audio is silent or invalid.')
        print(json.dumps({'seconds':frames/rate,'sampleRate':rate,'bitDepth':width*8,'channels':channels,'peak':peak,'rms':rms}))
else: raise ValueError('Unknown media action.')
