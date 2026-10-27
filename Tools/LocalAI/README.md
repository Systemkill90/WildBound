# WildBound LocalAI source

This directory tracks the source for the workstation-only WildBound AI Garage and its local dashboard integration. It contains application code, UI assets, the offline model viewer and its license, and source-level tests.

The workstation installation remains outside this game repository. Do not copy runtime data, generated jobs, local tokens, model weights, binaries, engine/toolchain locations, or workstation configuration into Git. The installed Garage reads its local `Garage/garage.config.json` and dashboard runtime token from that installation; keep those files local.

## Layout

- `Dashboard/` — local dashboard, Image and Audio Studio integration, Asset Studio, Production Team UI, and Codex Workshop MCP bridge.
- `Garage/src/` — production queue, specialist adapters, local service, validation, and Unreal import helpers.
- `Garage/tests/` and `Dashboard/tests/` — source-level regression checks.

The Production Team review batch covers eight non-3D deliverables: 2D concept art, texture/material, skybox source art, VFX source art, voice, music, musical ambience, and isolated SFX. A fresh batch hides earlier task rows from that view without deleting their records or files; the full history can be shown again. The queue produces one task per type serially. Objective non-3D Quality Supervisor failures get one automatic recook, after which the output remains blocked for owner review. Skybox and VFX jobs produce source artwork only, and the deterministic supervisor does not judge artistic quality.

The tracked defaults resolve the WildBound checkout relative to this source tree or the `WILDBOUND_REPO` environment variable. Local model, image, voice, Blender, and Unreal paths must be supplied by the workstation installation. This source package does not include the models or the local launcher configuration.

Run the JavaScript checks from this directory with Node.js:

```powershell
node --test Garage/tests/*.test.js Dashboard/tests/*.test.js
```
