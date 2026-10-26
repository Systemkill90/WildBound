# AI Garage next session

## Starting point

The Female Homesteader concept sheet is the approved first-player visual anchor. Creative Library package `female-homesteader-player-anchor@v1` resolves its appearance, anatomy, culture, clothing, and character-reference needs without missing or conflicting references. Garage task `46102b78-2a77-44e5-92b1-cf4d33a7d328` is waiting for a lawful editable source model.

Garage `2.7.3-model-planning` prepared the Character Designer and 3D Artist handoff before that source exists. The existing task now contains the saved plan grounded in `female-homesteader-player-anchor@v1`; inspect and reuse it when the MetaHuman source is attached. Do not regenerate the plan merely because the source arrives.

The native Garage can now show that task's approved reference package and media checksum without exposing NAS paths. A bounded generic static-prop test exposed and fixed a negated-character classifier false positive; do not retry that recorded seed-box attempt merely to obtain a green result.

The local MPFB worker proves the mechanical path: it can create an editable Blender scene, humanoid rig, FBX, four review renders, and `WB_IdleBreath`. Two bounded wardrobe attempts failed visual review. They are rejected development evidence, not approval candidates or game assets. Do not spend another pass rearranging the same stock garments.

The first Local Production Manager pilot is implemented as the smallest executable slice of the broader Project Manager and worker-orchestration plan in PR #22. Local Qwen accepts one short natural-language request and may select only a fixed repository-status, Garage-test, or character-evidence archive action. It cannot supply commands, paths, or approval. Programmatic execution defaults to dry-run, the NAS write requires separate owner confirmation, and every plan, success, or failure gets an audit JSON. This is not yet an autonomous coding agent, Git publisher, Blender author, or Unreal operator.

## Next authorized work

1. Continue with the owner-approved Unreal 5.8 MetaHuman Creator foundation. The plugin is enabled, the local preflight passes, and the Wildbound editor module compiles. In Epic Games Launcher, open Download Manager and restart the failed Unreal Engine 5.8 update, then approve the Windows UAC prompt at the workstation. The correct `metahuman_content` component was already selected and queued, but the elevated helper returned Windows error 1223 / Launcher error `IS-0002-DP-01`; the engine directory ownership and Modify access are valid. After the install finishes, rerun `Tools/Test-MetaHumanFoundation.ps1` and one no-save Unreal probe before reopening Creator. MetaHuman supplies the body, face and rig foundation; custom clothing, hair and materials must reproduce the approved sheet. Epic cloud auto-rigging and texture-synthesis reachability is not yet verified.
2. Reproduce the approved silhouette with custom layered blouse, fitted vest, split skirt/trousers, weathered boots, gloves, utility belt and pouches, olive/rust/cream materials, botanical embroidery, braided brown hair, and warm freckled face. Do not add Fae or other race-specific anatomy.
3. Keep the Garage task live while work runs. Show source, worker, current stage, reference package, failures, and review readiness in the desktop UI.
4. Produce front, side, back, and three-quarter renders plus a short idle preview. Show the review media in the primary chat because the owner may be away from the workstation.
5. Run only bounded validation: one Blender/source inspection, one FBX/rig/animation inspection, and one Unreal import/scale/material check. Record a failure and move on rather than repeatedly regenerating.
6. Do not import the character into the canonical map or call it production-ready until the owner approves the visual review. After approval, archive the exact source, export, renders, checks, reference versions, and handoff manifest to the private NAS.

## Preservation

Use `Tools/Archive-GarageCharacterSession.ps1` for character-session evidence. It copies without deleting source data, verifies every SHA-256 after the write, and labels the current MPFB attempts as rejected development evidence. The runtime remains configured to keep Creative Library originals under the private `W:` NAS; never publish that share or licensed/private binary assets to GitHub.

## Definition of done

- The owner can review a recognizable Female Homesteader model in chat and in the Garage desktop UI.
- The character has an editable lawful source, production mesh, materials, hair, rig, idle animation, correct scale, and verified Unreal import.
- The Garage records the exact approved reference versions and the owner decision.
- Approved outputs and manifests are checksum-verified on the private NAS; only metadata, instructions, and reviewable code changes enter Git.
