<h1 align="center">Wildbound</h1>
<p align="center"><strong>Build a home. Earn the wild's trust. Grow a life together.</strong><br>An original cooperative survival, construction and homesteading game for Unreal Engine 5.</p>
<p align="center"><a href="docs/vision.md">Vision</a> · <a href="docs/world/biomes.md">World</a> · <a href="docs/systems/animals.md">Animals</a> · <a href="ROADMAP.md">Roadmap</a> · <a href="docs/project/CURRENT-STATE.md">Status</a> · <a href="docs/developers/PROTOTYPE-PLAYTEST.md">Prototype guide</a></p>

> **Early engineering prototype — no playable build.** The repository now contains a C++ test character, placeholder animal, replicated condition component, server-side interaction/placement handlers and temporary build blocks. Portable animal logic, versioned snapshot validation, block-placement rules, and source checks are verified by GitHub Actions (see the latest run linked in the project status). **Unreal Engine compilation, the test map, multiplayer behavior, and persistence have not been validated.**

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

## What's in the code today

| Authored source | Purpose | Verification |
| :-- | :-- | :-- |
| `WildboundAnimalSimulation.h` | Portable needs, stress, trust and care rules | Native C++ tests passed |
| `WildboundPrototypePlacement.h` | Portable bounded grid-placement policy | Native C++ tests added |
| `WildboundPrototypePersistence.h` | Portable versioned snapshot and validation (not engine save/load) | Native C++ tests passed |
| `UWildboundAnimalNeedsComponent` | Server-only updates and replicated animal condition | Unreal compilation pending |
| `AWildboundPrototypeAnimal` | Replicated engine-sphere placeholder animal | Unreal compilation pending |
| `AWildboundPrototypeCharacter` | Basic third-person movement and camera | Unreal compilation pending |
| `AWildboundPrototypePlayerController` | Proximity-checked care and block placement RPCs | Unreal compilation pending |
| `AWildboundPrototypeBuildBlock` | Simple 100 cm snapped shared blocks | Unreal compilation pending |
| `AWildboundPrototypeGameMode` / HUD / ground | Temporary spawnable playground, visual debug | Unreal compilation pending |

The block demo **is not voxel construction**. There are no downloadable maps, authored creature assets, movement AI, taming gameplay, genetics, breeding, saved worlds or tested dedicated servers. The test harness is intended to prove mechanics in Unreal before expanding.

## Planned first playable

A small Greenveil meadow; one animal whose needs and trust are understandable; feeding and watering that cost resources; a simple enclosure; editable construction around animal movement; and two-player server validation with recoverable saved state.

Build toward this incrementally, rather than creating a huge world before testing the fundamentals.

## Working with this repository

The C++17 simulation logic can be tested independently:

```sh
g++ -std=c++17 -O2 -Wall -Wextra -Werror -pedantic \
  -I Source/Wildbound/Public \
  Tests/Native/AnimalSimulationTests.cpp -o /tmp/wildbound-animal-tests
/tmp/wildbound-animal-tests
# GitHub Actions also compiles and runs the snapshot/placement tests.
python3 Tests/Static/verify_scaffold.py
```

These checks **do not replace** compiling `WildboundEditor` and checking dedicated-server replication in Unreal. See the [prototype playtest instructions](docs/developers/PROTOTYPE-PLAYTEST.md).

PC is the proposed first development target. Xbox is a later feasibility assessment, not an approved or announced platform release.

Wildbound is an independent original project. No Unreal binaries or unlicensed content are stored here. **No public redistribution/open-source license has been selected**; repository visibility is not reuse permission.
