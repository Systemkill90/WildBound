# Greenveil Landscape — deferred demo integration checkpoint

**Recorded:** 2026-10-25  
**Owner instruction:** Preserve the landscape work for later import/playtest **after the Unreal demo is working**, rather than disrupting the existing prototype now.

## Artifact to retain
- Conversation download: `Greenveil_UE_Import_Ready.zip`
- SHA-256: `7edce1fe4d93bac6020a18f003356b456b3b0e783b925487224f745dfeedf1a7`
- Archive includes the original `Greenveil_First_Terrain_Slice/` contents: a 513x513 R16 file, 16-bit height PNG, six grayscale material/foliage masks, manifest, generator script, README and UE import notes.
- **Important:** the ZIP is preserved as a conversation attachment, **not uploaded as a GitHub binary**. Download and back it up in project-controlled storage before relying on it for long-term rebuilds; verify SHA-256. Do not infer that the public repo can reproduce the terrain without the external archive.

## Code already staged
- [Terrain integration description](greenveil-first-landscape-slice.md)
- [Safe editor preparation helper](../../Scripts/Editor/PrepareGreenveilLandscapeSlice.py)
- [Draft PR #15](https://github.com/Systemkill90/WildBound/pull/15)

## Resume trigger
Begin only when the current standalone Wildbound Unreal demo is restored and confirmed to launch reliably, and the owner is ready to try the experimental landscape. No automatic changes before then.

## Resume steps
1. Confirm current checkout/build/map and preserve working package, saves and sample-backed map.
2. Acquire ZIP from the conversation, check hash, extract and inspect manifest (512 m square, 513 x 513 samples, six masks).
3. Run safe preflight script in Unreal; create a **new isolated test level**, never replace existing GreenveilField/Electric Dreams.
4. Import R16 in Landscape Mode, calibrate XY/Z to elevation and lake datum, then apply temporary materials and weightmaps.
5. Add lake actor and temporary walkable ground-cover placeholders. Test footpath, woodland gate, glade and lake lookout before decorative density.
6. Record screenshot, collision, packaged traversal, 1080p measured frame time, memory and warnings. Mark accepted only after evidence.
7. Keep new animal gameplay frozen and do not merge PR without review.

## Verified versus pending
**Verified here:** archive exists with expected files and known hash; GitHub scripts/docs staged.  
**Pending:** copy source ZIP to durable project storage, import into UE, actual scene rendering, collision/playtests, packaged measurements. 

Rollback: leave the existing demo map and launch configuration untouched. Test level and imports are additive and separately removable.
