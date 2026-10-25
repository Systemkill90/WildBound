# Wildbound roadmap

[Home](README.md) · [Current state](docs/project/CURRENT-STATE.md)

Milestones describe intended order, not dates or release promises. The only delivered foundation is documentation, the uncompiled UE5 scaffold, and an **uncompiled initial animal-needs C++ component**.

| Milestone | Status | Completion evidence |
| :-- | :-- | :-- |
| 0 — Engine foundation | Scaffold authored; unverified | Pin UE5 version, compile editor/game/server, load a saved test map |
| 1 — Small Greenveil prototype | Planned | Walk a small region with placeholder resources, interactions, and day/night presentation |
| 2 — Voxel building proof | Planned | Place/remove volumes; verify collision, save/load, and performance |
| 3 — Animal care and trust | Initial needs code authored; unverified | One herbivore with needs, stress, shelter, trust and one farm-animal care loop |
| 4 — Cooperative persistence | Planned | Two clients; validated actions; replicated animals/building; restart and backup recovery |
| 5 — Breeding and genetics | Planned | Parentage, bounded inheritance, offspring care, diversity rules, persistent identities |
| 6 — Greenveil vertical slice | Planned | Complete gather/build/farm/care/explore loop with cottagecore art, sound, and playtest findings |
| 7 — Drowned March exploration | Planned | Small wetland area with hazards, wildlife, ruins, atmosphere, and environmental magic |
| 8 — Expansion/platform evaluation | Future evaluation | Evidence-based species/biome scope, performance, accessibility, controller and platform feasibility |

## First priorities

Validate the toolchain and compile; prototype editable construction and animal navigation together; prove server authority and persistence before scaling the world.

## Release and Xbox expectations

There is no release date, downloadable game, Xbox approval, store submission, certification result, or announced console support. PC is the proposed initial development environment.


## Approved Greenveil environment look — October 24, 2026

The owner approved the complete [Greenveil master visual direction](docs/world/greenveil-approved-visual-direction.md): eternally green, photorealistic fantasy rolling hills/lakes/forests with three distinct peoples' settlements. **Visual approval only**; build a small measured, navigable lake-and-forest vertical environment slice first. Existing roadmap statuses in this staging branch are historically stale; use recent main-branch verification to assess gameplay and build status before implementation. Animal gameplay expansion remains paused.


## Greenveil landscape planning — October 25, 2026

The approved environmental roster for later settlement placement is Kethri, Nimrui, Wolfkin, freshwater Brinefolk, independent humans who reject Veyrath, Elves and **Wildlings**. Concentrate Elven and Wildling communities in the Ancient Woodlands. [Settlement design](docs/world/greenveil-settlement-concepts.md). Geography and settlement sketches are approved visual targets; actual villages and NPC systems are **not implemented**. First build a modest explorable landscape section with safe markers and a measured packaged traversal test, then expand by validated increments. Existing tree prototype geometry remains separate from landscape assembly and new animal gameplay remains paused.


## Greenveil ground-layer art approval — October 25, 2026

Approved art direction: [ground-layer specification](docs/world/greenveil-ground-layer-approved.md). Build and measure one walkable meadow-to-forest-to-lakeshore test area before expanding. The art is not game-ready assets or a tested map.


## Greenveil regional master atlas — approved October 25, 2026

The owner approved both full visual region/atlas boards. The [written master map](docs/world/greenveil-regional-master-map.md) lays out region-scale watershed geography, all seven settlement cultures (including Wildlings), roads/water routes, ancient and sacred landmarks, and a first landscape-slice corridor. **Place names are provisional**; actual dimensions and UE terrain remain unimplemented. Next: pass demo acceptance, then refine hydrology and the isolated 512m landscape slice. No new animal gameplay or PR merge authorized.


## Greenveil first-corridor engineering audit — October 25, 2026

[Measured technical design](docs/world/greenveil-first-corridor-engineering-plan.md) specifies meadow–forest–glade–lake route and separates regional hydrology from the small 512 m test field. A submerged former lookout marker is rejected; replace in new data release and verify route/waterline in Unreal after demo stabilization. This is a **design-stage** milestone, not a tested terrain actor or playable landscape.


## Great Lake District design study — October 25, 2026

[Detailed lake environment design](docs/world/greenveil-great-lake-district-design.md) is staged for review, including connected water flow, Brinefolk/Wolfkin villages, shoreline biomes, underwater ecological zones and exploratory islands. No terrain sculpt, fish gameplay, swimming/boats or in-engine tests in this pass. First build a bounded shore and shallow-water test after demo acceptance.


## Brinefolk environment reference and settlement draft — October 25, 2026

[Underwater image library record](docs/art/environment/greenveil/REFERENCE-INDEX.md) captures the owner-approved magically realistic freshwater appearance with SHA and librarian retrieval/fail-missing contract. [Detailed Brinefolk architecture](docs/world/greenveil-brinefolk-village-design.md) is proposed, not canon or a UE asset. Binary art still requires verified repository/NAS import; do not proceed with an engine graybox before existing demo verification.
