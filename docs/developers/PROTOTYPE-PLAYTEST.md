# Greenveil engineering prototype — operator playtest guide

**Status: Source authored, engine compilation and gameplay unverified.**

This is a deliberately bare testing harness built from C++ and Unreal Engine's standard cube/sphere meshes. It is **not** a released demo, finished biome, real voxel engine, animal AI, breeding system, or persistent dedicated server.

## Source features available for validation

- A temporary 30 m x 30 m floor and a single stationary animal sphere spawned by `AWildboundPrototypeGameMode` on authority.
- A third-person character with camera and legacy keyboard/mouse bindings.
- Replicated hunger, thirst, condition, stress and trust values.
- Care requests routed through the *owning player's controller*; the server verifies actor reach, obstruction, action type, short cooldown and finite starter feed/water portions.
- Shared 1 m snapped cube placement/removal, with server-side range, duplicate-cell and 128-block limits.
- A debug HUD showing controls, starter supplies and the aimed animal's values.

The starter supplies, blocks and animal state are currently **in memory only**. Restarting the server discards them.

## Before attempting an Unreal build

1. Select an Unreal Engine 5 minor version and compatible Windows Visual Studio C++ toolchain. Record exact versions before resolving compatibility errors. The `.uproject` intentionally has no `EngineAssociation` pin yet.
2. Clone the repository onto the PC. Never download Unreal engine binaries, platform SDKs or proprietary plugins into the public repository.
3. Generate Unreal project files by right-clicking `Wildbound.uproject` and choosing **Generate Visual Studio project files** (with shell integration installed).
4. Open the generated project and compile `WildboundEditor` for `Development Editor | Win64`.
5. Record the full first compiler error if it fails. Don't mask build failures or claim the project launches until it actually does.

Alternative Unreal build tools are fine as long as the exact command and result are recorded. Dedicated server target compilation usually requires an appropriate engine source build.

## First editor session — proposed procedure

1. Open `Wildbound.uproject` after a successful compile.
2. Create a new **Empty Level**, save it under `Content/Wildbound/Maps/` (the map asset does not exist in this repository yet).
3. Check that the World Settings game mode inherits the project default `WildboundPrototypeGameMode`. If not, set it explicitly.
4. Start Play In Editor. The C++ game mode should spawn a collision floor and one placeholder animal near its center. Check camera, pawn spawn and fall/ground collision.
5. Walk to the sphere, look directly at it and inspect the condition HUD. Test feed, water and reassurance.
6. Place temporary cube blocks and remove them by aiming at them. The block test is *not* voxel terraforming.

| Input | Prototype action |
| :-- | :-- |
| WASD / mouse | Move / look |
| Space | Jump |
| E while aiming at animal | Feed (consumes one starter feed portion when successful) |
| R while aiming at animal | Water (consumes one starter water portion when successful) |
| F while aiming at animal | Reassure |
| G | Place a temporary snapped block ahead |
| X while aiming at block | Remove a temporary block |

## Acceptance and rejection cases

| Case | Expected behavior | Verified? |
| :-- | :-- | :-- |
| Editor build | Clean C++/UHT compile | **Not run** |
| Empty level PIE | Floor, character, animal and HUD appear | **Not run** |
| Authoritative animal simulation | Needs decrease on server ~once per second | **Not run** |
| Care in range, with supplies | Applicable value improves; one portion consumed | **Not run** |
| Care too far / obstructed | Server refuses | **Not run** |
| Feeding fully fed animal | No effect; no portion consumed | **Not run** |
| Feed/water under extreme stress | Refused until calmed | **Not run** |
| Block placement | Exactly one snapped block, replicated to other client | **Not run** |
| Duplicate/too-distant block | Server refuses | **Not run** |
| Block limit | Maximum 128 total world blocks | **Not run** |
| Two-client PIE | Both clients see the same animal and blocks | **Not run** |
| True headless server | Clients can join authoritative dedicated build | **Not run** |
| Restart | Existing state resets (persistence not implemented) | **Not run** |
| Save recovery | **Not implemented; must not be considered passing** | **Not run** |

## Automated checks already executed

GitHub Actions [CI run 39516040708](https://github.com/Systemkill90/WildBound/actions/runs/39516040708) compiled and ran the standalone C++ animal simulation tests and passed a static Unreal source wiring check. Neither job has Unreal Engine installed. These checks cannot detect UHT problems, UE API incompatibility, replication failures or in-game rendering bugs.

## Known limitations and security follow-ups

- The animal does **not** move, graze, drink automatically, breed or respond to enclosure changes.
- No actual feeds/water items, resource harvesting, multiplayer inventory replication or persistence system exists; starter portions are temporary test counters.
- Animal care cooldown and reach/visibility checks are preliminary. Use adversarial two-client tests for RPC spoofing, invalid enum values, concurrent requests and rejoining.
- No building ownership permissions, area zoning, terrain editing, structural support or collision/navmesh updates for animals.
- Spawned prototype blocks and creature state do not survive a restart.
- Offline animal welfare policy is undecided. There must be no unbounded real-time starvation while server/players are absent.
- Placeholder map, controls, rendering, and Unreal minor version remain unvalidated.

Once compiled and checked, record results in [current state](../project/CURRENT-STATE.md), update [session handoff](../project/SESSION-HANDOFF.md) and [roadmap](../../ROADMAP.md). Use test evidence, not planned functionality, to change milestone status.
