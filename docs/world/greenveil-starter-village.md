# Greenveil starter village test grounds

**Status:** layout direction accepted by the owner on October 22, 2026. This is a compact prototype slice, not a locked production art bible. Preserve the existing playable Greenveil package and map as rollback until the village map passes its own build and traversal checks.

## Purpose

Greenveil should start in a small, lived-in hamlet that doubles as the first systems test grounds. The player should understand where to go from landmarks and paths, and be able to move between home, shared work space, food-growing space, and the nearby stream without crossing a large empty field. Quiet magic appears as a few ecological irregularities; everyday materials, readable lighting, and believable scale carry the scene.

## Compact composition

Keep the tested playable footprint close to the current bounded slice rather than building a whole village district. The initial authored pass should contain:

1. **Arrival green:** a modest common clearing with a readable notice/wayfinding landmark and a path junction. It is the spawn orientation point, not a broad empty plaza.
2. **Home and workshop lane:** a small number of distinct, enterable cottage/work buildings arranged along the terrain, with doors, porches, storage, and collision that make scale and movement testable.
3. **Working edge:** fenced garden rows and a compact farmyard at the village margin. These are environmental props for now; farming, livestock simulation, and animal gameplay are not part of this milestone.
4. **Creek crossing:** a visible stream with one reliable bridge and connected banks, placed on a natural route between the hamlet and the outer loop.
5. **Forest loop:** a short walk returning to the village through authored woodland, varied ground cover, and one restrained magical focal detail. It tests camera clearance, ground collision, route readability, and performance without needing a large map.

Use a prebuilt, licensed environment as the visual shell where it fits, then selectively adapt its buildings, paths, props, and forest assemblies to this composition. Avoid one-click adoption of a whole demo level if its scale, visual style, world settings, or dependencies conflict with Wildbound. Keep asset packs local when their license does not permit redistribution.

## Prototype verification

- The player spawns on the arrival green and can follow the entire home/workshop → garden/farm edge → bridge → forest loop → village route without falling through terrain or catching on invisible collision.
- Cottages/work buildings can be approached and entered; doorways, steps, and interiors have useful clearance for the third-person camera and character.
- Basic building-block placement is exercised in a designated open yard, away from the main path and stream collision.
- Debug UI remains legible and does not cover the main landmarks.
- Run a native-1080p traversal capture and frame-time sample. Record the result and its limitations; a single route is not sustained-60 certification.
- Keep animals absent and do not spend this milestone on needs, feeding, trust, breeding, or husbandry.

## Art direction guardrails

Use grounded, detailed, PBR assets with coherent scale and natural material variation. Keep the village warm and welcoming while letting the forest edge remain less controlled. Realistic craft details and readable silhouettes matter more than adding lots of props. Treat existing Greenveil concept art as an evolving reference. Do not substitute colored primitive huts, uniform scatter, an oversized empty plaza, or a generic low-poly village for the authored environment.

## Asset acquisition note

Quixel's [Medieval Village Megascans Sample on Fab](https://www.fab.com/listings/2e11a225-a6ea-4781-a3e1-fe975b461894) is a promising free prebuilt reference/base to inspect for a bounded adaptation. The Fab listing says the sample is a walkable photogrammetry village but also warns that some showcased images contain visualization-only content not included in the download. Verify the actual content, license, UE 5.8 compatibility, route, and dependency footprint before using it. The free [ElderBoom Hollow](https://www.fab.com/listings/e12de9d5-be28-40df-a387-42ae6f84e05c) listing claims a much larger village but includes incomplete technical-count placeholders and a ~12 GB package size, so it is not the current acquisition target.

**Local acquisition check (October 23, 2026):** Fab successfully downloaded and created a separate local sample project. Its project file is associated with UE 5.8, while the cached source manifest identifies UE 5.3. The project contains five village World Partition maps (`Atmospherics_WP`, `Audio_WP`, `Cinematics_WP`, `Gameplay_WP`, and `MedievalVillage_P_WP`) plus a crow debug map. The enabled plugins are present in the installed engine, but its first UE 5.8 editor-review launch stopped during texture processing (Zen HTTP 507 and a 4 GiB allocation failure attributed to the paging file) before any map appeared. D-drive DDC and Zen overrides are configured; restart Unreal/Zen with those paths active before retrying. Visual quality, upgrade behavior and route suitability remain unverified. No asset from it is claimed as used in Wildbound. Keep the sample and Fab cache outside Git; after resolving the local editor resource blocker, inspect the main village map and choose a small route, then adapt only the needed content into a separate Wildbound map. The existing Electric Dreams installation provides forest, landscape, creek, and foliage assets but contains no village/building meshes.
