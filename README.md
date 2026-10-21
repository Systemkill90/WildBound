<h1 align="center">Wildbound</h1>
<p align="center"><strong>Build a home. Earn the wild's trust. Grow a life together.</strong><br>An original cooperative survival, construction and homesteading game for Unreal Engine 5.</p>
<p align="center"><a href="docs/vision.md">Vision</a> · <a href="docs/world/biomes.md">World</a> · <a href="docs/systems/animals.md">Animals</a> · <a href="ROADMAP.md">Roadmap</a> · <a href="docs/project/CURRENT-STATE.md">Status</a> · <a href="docs/developers/PROTOTYPE-PLAYTEST.md">Prototype guide</a></p>

> **First Windows prototype compiled and packaged in Unreal Engine 5.8.4.** Greenveil is a small, saved forest-clearing test map with a third-person pawn, debug HUD, imported forest assets, and a deer model. The packaged build has launched locally; a listen server accepted two simulated clients. This establishes a runnable foundation, not a finished or visually polished demo. Actual keyboard movement, care interactions, building placement, and state replication still need hands-on playtest validation.

![Wildbound biome and creature concept art](docs/art/wildbound-biomes-and-creatures-v1.jpg)

## A life at the edge of the familiar

Raise a timber cottage beside a meadow. Tend animals through changing weather. Earn the trust of a wild creature. Explore a marsh where distant lights move against the wind. Wildbound is a believable wilderness touched by quiet ancient magic: a world that feels real until you look closer.

Its defining pillars are **expressive voxel building**, **wildlife, taming, breeding and everyday husbandry**, **shared persistent co-op worlds**, and **exploration through atmospheric biomes**. Every system should reinforce the feeling of building a lasting life together.

## Find your way

| Area | Read |
| :-- | :-- |
| Identity and experience | [Game vision](docs/vision.md) |
| Cottagecore Greenveil and eerie Drowned March | [Biomes](docs/world/biomes.md) |
| Wildlife, trust, genetics, livestock and care | [Animal systems](docs/systems/animals.md) |
| Construction and farm design | [Building systems](docs/systems/building.md) |
| Server authority and persistence | [Cooperative worlds](docs/systems/multiplayer.md) |
| Unreal toolchain and source layout | [Developer setup](docs/developers/README.md) |
| Prototype controls and validation | [Engineering playtest guide](docs/developers/PROTOTYPE-PLAYTEST.md) |
| Planned milestones and evidence | [Roadmap](ROADMAP.md) |
| Actual development record | [Current state](docs/project/CURRENT-STATE.md) and [session handoff](docs/project/SESSION-HANDOFF.md) |
| Third-party art sources and licenses | [Asset credits](docs/art/ASSET-CREDITS.md) |

## What's in the prototype

| Authored source or content | Purpose | Verification |
| :-- | :-- | :-- |
| `WildboundAnimalSimulation.h` | Portable needs, stress, trust and care rules | 34 native checks passed |
| `WildboundPrototypePlacement.h` | Portable bounded grid-placement policy | 13 native checks passed |
| `WildboundPrototypePersistence.h` | Portable versioned snapshot validation (not engine save/load) | 22 native checks passed |
| `UWildboundAnimalNeedsComponent` | Server-updated replicated condition snapshot | Compiled; runtime effects not manually checked |
| `AWildboundPrototypeAnimal` | Replicated deer mesh, capsule collision and local wandering | Compiled and map-launched; static-pose movement, not an animation |
| `AWildboundPrototypeCharacter` | Third-person controls and camera | Compiled; visible in package, keyboard playtest pending |
| `AWildboundPrototypePlayerController` | Server-validated care and temporary block requests | Compiled; interaction playtest pending |
| Greenveil map | Saved 60 m forest clearing with real foliage, ground materials, trail, rocks, props and deer | Editor generated, cooked and packaged |

Building is still a snapped temporary block proof, **not voxel terrain**. The character is still a primitive placeholder, and the deer currently slides in a static pose without a walk cycle. There is no real inventory, breeding, persistence, AI pathfinding, or validated care/build gameplay yet.

## Build and launch on Windows

The repository includes [`Tools/Start-Wildbound.cmd`](Tools/Start-Wildbound.cmd) and a PowerShell helper that discovers a local UE 5 installation, compiles `WildboundEditor`, then launches Greenveil in a window. Run the command file in a Windows checkout. Add `-BuildOnly` to compile without opening the game. Logs are written to ignored `Saved/WildboundBootstrap`.

This session used Unreal Engine **5.8.4**, Visual Studio Community 2022 **[compiler version redacted]**, MSVC **[toolchain version redacted]**, and Windows SDK **[SDK version redacted]**. The locally packaged test build is outside Git at `<local-project-root>\Builds\WildBoundGreenveil\Windows\Wildbound.exe`; it is not included in the repository because it contains engine binaries.

Native C++ rules tests and source wiring checks can be run independently. These do not test gameplay in Unreal:

```sh
g++ -std=c++17 -O2 -Wall -Wextra -Werror -pedantic \
  -I Source/Wildbound/Public \
  Tests/Native/AnimalSimulationTests.cpp -o /tmp/wildbound-animal-tests
/tmp/wildbound-animal-tests
python3 Tests/Static/verify_scaffold.py
```

PC is the current development target. Xbox remains a future feasibility assessment, not an announced or certified platform. No paid services or assets were used for the prototype. Unreal Engine is subject to Epic's license; see [asset credits](docs/art/ASSET-CREDITS.md) for third-party art attributions.

Wildbound is an independent original project. No public redistribution/open-source license has been selected; repository visibility is not reuse permission.
