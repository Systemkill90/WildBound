<p align="center">
  <img src="docs/art/wildbound-key-art-v1.jpg" alt="Wildbound concept illustration: an explorer overlooking a wooded river valley and mountains" width="100%">
</p>

<h1 align="center">WILDBOUND</h1>
<p align="center"><strong>Build a home. Earn the wild's trust. Grow a life together.</strong></p>
<p align="center">A cooperative wilderness survival and homesteading game, built with Unreal Engine 5.</p>
<p align="center">
  <a href="docs/README.md">Explore the project</a> ·
  <a href="docs/world/biomes.md">Discover the world</a> ·
  <a href="docs/systems/animals.md">Meet the animals</a> ·
  <a href="ROADMAP.md">See the roadmap</a>
</p>

---

## A wilderness worth coming home to

Build a cottage beside a quiet stream. Raise animals that recognize and trust you. Explore old forests and marshes where ancient magic feels woven into the landscape.

Wildbound is about **creating a lasting life together** — finding a balance between the comfort of home and the mystery of a living wilderness.

| What makes Wildbound, Wildbound | |
| :-- | :-- |
| **🌿 Living wilderness** | Believable habitats, weather, wildlife, exploration and environmental magic. |
| **🐾 Animals that matter** | Observation, trust, taming, breeding, husbandry and meaningful relationships. |
| **🏡 A home you can shape** | Expressive voxel cottages, farms, barns, fences, bridges and settlements. |
| **🤝 A shared world** | Cooperative play, community stewardship and planned persistent dedicated servers. |

These are the game's **design pillars**, not a claim that every system is implemented.

## Step inside the world

[![Wildbound biome and creature mood studies: woodlands, prehistoric wildlife, grasslands, wetlands and mountains](docs/art/wildbound-biomes-and-creatures-v1.jpg)](docs/world/visual-concept-art.md)

**[Greenveil Basin](docs/world/biomes.md)** is warm and pastoral: orchards, homesteads, grazing animals and small, mysterious places beyond the treeline.

**[The Drowned March](docs/world/biomes.md)** is ancient and unsettling: blackwater, drowned causeways, pale reeds, fog and lights that invite more questions than answers.

The broader world includes candidate grasslands, mountain habitats, strange creatures and original peoples. Those ideas remain in design review rather than being promised playable content.

[Browse the art studio →](docs/art/README.md)

---

## The Wildbound Concept Atlas

*Twenty imagined creatures, six regional studies, everyday homestead equipment, and our first male and female character directions.* All images are **exploratory artwork**, not 3D models, playable content, or a finalized roster.

### The creatures · 20 original candidates

| **I · Meadow & Woodland** | **II · Marsh & Wetland** |
| :--: | :--: |
| [![Five Wildbound meadow and woodland creature studies including Mosshorn, Lanternhare, Brindlefowl, Velvet Grazer and Bramble Runner](docs/art/concept-atlas/creatures-i-meadows.webp)](docs/art/concept-atlas/README.md) | [![Five Wildbound wetland creature studies including Reedstrider, Bog Nibbler, Fen Warden, Siltfox and Mireback Grazer](docs/art/concept-atlas/creatures-ii-marsh.webp)](docs/art/concept-atlas/README.md) |

| **III · Highlands & Open Range** | **IV · Rare & Mythic** |
| :--: | :--: |
| [![Five Wildbound highland creatures including Thistlemaw, Crownmaw, Flint Ram, Duskmane Elk and Tangletail Grazer](docs/art/concept-atlas/creatures-iii-highlands.webp)](docs/art/concept-atlas/README.md) | [![Five fantasy creatures including Rootback, Whisperbough, Hollowhorn Boar, Gloamwing Roclet and Moonshade Lizard](docs/art/concept-atlas/creatures-iv-mythic.webp)](docs/art/concept-atlas/README.md) |

### The biomes · Six visual directions

[![Six Wildbound biome studies: Greenveil Basin, Drowned March, Emberstep Highlands, Gloamwood, Stonewake Heights and Sunfield Prairie](docs/art/concept-atlas/biomes-atlas.webp)](docs/art/concept-atlas/README.md)

*Greenveil, the Drowned March and Emberstep have existing world notes; Gloamwood, Stonewake Heights and Sunfield Prairie are **additional art-study names**, not approved production regions.*

### Tools for building a life

[![Wildbound starter equipment concept sheet: axes, hammer, hoe, shovel, pickaxe, sickle, knife, spear, rope, bucket, lantern, waterskin and seed satchel](docs/art/concept-atlas/tools-and-supplies.webp)](docs/art/concept-atlas/README.md)

### The homesteaders · Male & Female

| **Male homesteader** | **Female homesteader** |
| :--: | :--: |
| [![Male homesteader character concept and front, side, back views with clothing and equipment details](docs/art/concept-atlas/character-male-homesteader.webp)](docs/art/concept-atlas/README.md) | [![Female homesteader character concept and turnaround with clothing and equipment details](docs/art/concept-atlas/character-female-homesteader.webp)](docs/art/concept-atlas/README.md) |

**[Open the complete concept-art gallery →](docs/art/concept-atlas/README.md)** · [What is currently playable?](docs/project/CURRENT-STATE.md)

---

## Where the project stands

**Early PC prototype · Unreal Engine 5.8.4 · Development in progress**

The October 22 desktop build delivers a **180 × 160 m Greenveil exploration zone**: dense woodland, a creek, two bridges, three cottage placeholders, gardens, trails and an overlook. A guarded native-1080p traversal with all settings Medium except Low shadows passed **15/15 waypoints over 327.7 m at 75.89 FPS** (p95 15.205 ms), with zero navigation failures or animal actors. Low shadows remain a candidate pending visual QA; the normal Medium default is unchanged, and this is not sustained-60 certification. The clearing remains bright; Quinn and cottages are placeholders. [Read the test report](docs/project/GREENVEIL-EXPLORATION-2026-10-22.md).

| Area | Actual status |
| :-- | :-- |
| **Unreal foundation** | UE 5.8.4 editor/game compilation and local Windows packaging passed. |
| **Greenveil exploration** | Original bounded map with locally licensed vegetation, real collision/navigation and Quinn movement; packaged route verified. |
| **Buildings, water and tools** | Original visual placeholders; sparse interiors, no settlement or fluid simulation. |
| **Animal gameplay** | Paused by owner priority; [PR #9](https://github.com/Systemkill90/WildBound/pull/9) remains separate and unmerged. |
| **Construction, multiplayer & persistence** | Deferred; no new gameplay verification in this exploration pass. |

**The next milestone:** build a bounded, representative Greenveil slice from the locally installed authored forest environment, guided by the board's pastoral orchard-and-stream concept. The current generated zone verifies traversal but remains an art blockout. Keep Wildbound controls, protect the working map/package, and do no animal gameplay yet. Source-restricted sample art stays local; concept images remain visual references rather than 3D assets.

[Current development state](docs/project/CURRENT-STATE.md) · [Next handoff](docs/project/SESSION-HANDOFF.md) · [Open milestones](ROADMAP.md)

## Development log

### October 23, 2026 · Greenveil art-base correction

The current package proves traversal, but its generated terrain, scattered foliage, mannequin and box-built cottages are not close enough to the intended world. The existing decision to use Electric Dreams as the environment base was not carried through. The next slice will use a bounded authored forest/PCG area for realistic asset and shader quality, then be composed and graded to match Greenveil's warm pastoral board: meadows, orchards, birch groves, a clear creek, mossy stone and lived-in timber/stone architecture. Keep the current map as rollback; no animal gameplay. [Art direction](docs/art/README.md) · [Current state](docs/project/CURRENT-STATE.md).

### October 22, 2026 · GPU profile and shadow-quality comparison

Added a screenshot-free traversal option and local Unreal Insights tracing. The all-Medium native-1080p route measured 55.26 FPS; the trace pointed to GPU frame time, with shadow depth averaging 5.45 ms. A guarded repeat kept all groups at Medium except Low shadows and measured **75.89 FPS** with 15/15 waypoints, zero navigation failures and zero animal actors. The benchmark now defers to loaded Ollama models and stops only its own test process if one becomes active. Low shadows need a human visual check, so the normal Medium default remains. Raw profiling data stays local. [Full verification record →](docs/project/GREENVEIL-EXPLORATION-2026-10-22.md)

### October 22, 2026 · Greenveil exposure and packaged traversal

Lowered the Greenveil field-grade exposure and highlight contrast, then compiled and packaged a fresh Windows build without regenerating the map. The packaged capture shows more detail in the sunlit clearing, though it remains brighter than intended. The native-1080p Medium traversal passed **15/15 waypoints over 326.1 m**, with zero navigation failures or animal actors; one uncapped run averaged **50.61 FPS** (p95 22.616 ms, p99 24.239 ms). That is below the 60 FPS target and is not sustained-performance proof. Also disabled the unused Android File Server in project config and added a static check against committing its token. [Full verification record →](docs/project/GREENVEIL-EXPLORATION-2026-10-22.md)

### October 22, 2026 · Clean build and traversal after source sync

The synchronized Greenveil branch compiled and packaged cleanly with Unreal Engine 5.8.4. The map was not regenerated, and the earlier package checkpoints were left intact. The fresh native-1080p Medium package passed **15/15 movement waypoints over 326.1 m**, with zero navigation failures and zero animal actors. It averaged **49.19 FPS** over 2,713 frames (p95 22.786 ms; peak process memory 1,538.3 MiB), still short of 60 FPS. The packaged capture confirms the bright clearing, mannequin player and cottage placeholders remain visible work. This automated run does not verify animal, building, or care gameplay. [Read the complete verification record →](docs/project/GREENVEIL-EXPLORATION-2026-10-22.md)

### October 22, 2026 · Greenveil creek visibility check

V5's new PBR creek surface compiled and packaged, but the actual capture showed near-black water. V6 restores the established creek material and short bridge decks: its packaged 1080p Medium traversal passed **15/15 grounded waypoints over 326.1 m** and **14/14 navigation legs**, with zero navigation failures and zero animal actors. The captured creek is readable again; the clearing remains over-bright. The uncapped run averaged **50.03 FPS** (p95 22.649 ms, p99 24.587 ms), below the 60 FPS target. [Read today's field notes and evidence →](docs/project/DAILY-DEVELOPMENT.md)

## Find what you're looking for

| Explore | Build & follow development |
| :-- | :-- |
| [World and biome concepts](docs/world/biomes.md) | [Development roadmap](ROADMAP.md) |
| [Animals, trust and husbandry](docs/systems/animals.md) | [Current verified state](docs/project/CURRENT-STATE.md) |
| [Construction and homesteading](docs/systems/building.md) | [Developer setup](docs/developers/README.md) |
| [Cooperative world design](docs/systems/multiplayer.md) | [First playable tests](docs/developers/PROTOTYPE-PLAYTEST.md) |
| [Concept art gallery](docs/art/README.md) | [Project decisions](docs/project/DECISIONS.md) |

**[Open the full documentation library →](docs/README.md)** · [Systems guide](docs/systems/README.md) · [Development desk](docs/project/README.md)

### Creative workshop

New mythical creatures, fantastical villages, walking trees and giant mushroom forests are being explored in **draft** design proposals. They are not yet approved canon or implemented gameplay.

[Idea Board — draft PR #1](https://github.com/Systemkill90/WildBound/pull/1) · [Art studies and development checkpoint — draft PR #6](https://github.com/Systemkill90/WildBound/pull/6)

<details>
<summary><strong>For developers: build notes and checks</strong></summary>

The project currently targets Unreal Engine **5.8.4** and a compatible Visual Studio 2022 C++ workload. The packaged Windows executable is kept outside GitHub.

- [Get set up](docs/developers/README.md) and [follow the hands-on playtest](docs/developers/PROTOTYPE-PLAYTEST.md).
- From a compatible Windows checkout, `Tools/Start-Wildbound.cmd` attempts an editor build and Greenveil launch. Passing this script is not proof of playable features.
- Native simulation tests cover animal rules, prototype placement and snapshot serialization; those are **not** Unreal gameplay, dedicated-server or persistence tests.
- [Asset credits](docs/art/ASSET-CREDITS.md) identify third-party art and redistribution boundaries.
- [Documentation audit](docs/project/DOCUMENTATION-AUDIT-2026-10-21.md) records remaining evidence and configuration follow-ups.

</details>

---

<p align="center"><em>A lasting life together in a wilderness touched by quiet, ancient magic.</em></p>
<p align="center"><small>PC-first development · Xbox remains a future feasibility study · No release date announced</small></p>

**Rights and distribution:** Wildbound is an independent original project. The public repository has no project-wide open-source license selected. External Unreal/Epic assets carry their own license restrictions; public visibility does not grant reuse permission.
