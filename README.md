<h1 align="center">Wildbound</h1>
<p align="center"><strong>Build a home. Earn the wild’s trust. Grow a life together.</strong><br>A cooperative survival and homesteading game concept for Unreal Engine 5.</p>
<p align="center"><a href="docs/vision.md">Game vision</a> · <a href="docs/world/biomes.md">Explore the world</a> · <a href="docs/systems/animals.md">Animals & husbandry</a> · <a href="ROADMAP.md">Roadmap</a> · <a href="docs/project/CURRENT-STATE.md">Current status</a></p>

> **Pre-production.** This repository contains design documents and an initial UE5 C++ scaffold. All gameplay is planned. There is no playable build, implemented animal simulation, validated dedicated server, or release date. The scaffold has not been compiled in Unreal Engine.

## A life at the edge of the familiar

Raise a timber cottage beside a meadow. Tend a flock through changing weather. Earn the trust of a wild creature. Explore a marsh where distant lights move against the wind. Wildbound imagines a believable wilderness touched by quiet, ancient magic: a world that feels real until you look a little closer.

Animals shape everyday life through wildlife observation, patient taming, responsible breeding, genetics, and ongoing husbandry. Voxel construction would let cooperative communities build homes, farms, barns, and villages on persistent dedicated worlds.

## Find your way

| Start here | What you’ll find |
| :-- | :-- |
| [Game vision](docs/vision.md) | Identity, pillars, and proposed daily life |
| [World & biomes](docs/world/biomes.md) | Cottagecore Greenveil and the spooky Drowned March |
| [Animal life](docs/systems/animals.md) | Wildlife, taming, breeding, genetics, livestock, and care |
| [Building homesteads](docs/systems/building.md) | Voxel construction and farm layouts |
| [Cooperative worlds](docs/systems/multiplayer.md) | Dedicated servers, shared ownership, and persistence |
| [Roadmap](ROADMAP.md) | Planned milestones and completion evidence |
| [Developer setup](docs/developers/README.md) | Unreal layout and first validation steps |
| [Project record](docs/project/CURRENT-STATE.md) | Current state, decisions, and session handoff |

## Planned experience

- **Make a home:** shape a cottage, plant food, and build shelters suited to your animals.
- **Know the wildlife:** learn habitats, tracks, and behavior before approaching or capturing an animal.
- **Raise generations:** nurture healthy, distinctive lineages with inherited traits and meaningful care.
- **Live together:** share exploration, building, farming, and animal care on cooperative dedicated servers.
- **Follow the strange:** discover drowned ruins, unusual ecological relationships, luminous fungi, and unresolved folklore.

## Project layout

```text
Wildbound.uproject  UE5 project descriptor
Source/            Runtime module and game/editor/server targets
Config/            Initial project settings
Content/Wildbound/ Reserved asset folders; no assets yet
Plugins/           Future project plugins; none selected
Build/             Reserved platform resources
docs/              Vision, world, systems, and project record
.github/           Contribution templates
```

PC is the proposed first development target. Xbox is a future evaluation goal; there is no platform approval, store listing, certification, or release commitment.

Wildbound is independent from ShroudForge, which inspired the documentation navigation only. No engine binaries or third-party paid assets are included. No open-source license has been selected; public visibility alone does not grant reuse rights.
