# Greenveil Basin — Regional Master Map & Atlas (approved visual direction)

**Owner approval:** October 25, 2026. **Status:** MASTER MAP COMPOSITION APPROVED; all newly illustrated proper nouns are **working names pending separate canon approval**. This document is a geography/production plan, **not a built UE landscape**.

## Original approved illustrations

- `regional-master-map.png` — approved top-down illustrated regional map; SHA-256 `d6f8e0051c8f6fdb612a5f2f530e8c4a74823696008ec901fcb2a4a3e142ce52`.
- `regional-atlas-sheet.png` — approved overview/legend and implementation priorities; SHA-256 `a525c6349fd818dfd7fab62c2d31745e799fbfbeab2503a66be4d7ad2eeb8ba9`.
- Both full-resolution 1448×1086 PNGs are archived together as `Greenveil_Master_Map_Approved.zip` in the conversation. **Image binaries are not verified in GitHub**. Proposed permanent destinations: `docs/art/environment/greenveil/maps/`. Avoid claiming GitHub contains them until imported and verified.

**Visual map limitation:** illustrated scale bars, shoreline geometry and symbols are artistic, *not surveyed coordinates or authoritative gameplay distances*. Generative labels may have minor spelling inconsistency. The approved regional relationships take precedence over literal pixels.

## Canon constraints

Greenveil stays lush and eternally green, with rolling countryside, old forests, connected freshwater lakes, smaller valleys, subtle Sylweave effects, normal day/night and weather, **no autumn foliage cycle**. A distinct future autumn biome is separate. Ellowyn is an immense cloud-high **willow tree**, never humanoid. The seven approved settlement peoples are Kethri, Nimrui, Wolfkin, freshwater Brinefolk, independent humans who reject or fled Veyrath, Elves, and Wildlings. Fae refuge history and Ellowyn lore must not be relocated/rewritten by an illustrative map. Keep new animal gameplay paused.

## Zone layout (directions are conceptual, north is map-up)

| Zone | Approximate placement | Ecological identity | Settlements and features |
| --- | --- | --- | --- |
| Rolling Heartlands | South / southwest | Meadows, orchard/farm clearings, grassy low hills | Independent human refuge and lake hamlet, South Road |
| Great Lake District | Center / east-center | Large freshwater main lake, smaller northern/eastern linked lakes, reeds, coves, small islands | Wolfkin shore hall, freshwater Brinefolk cove, lake trade and docks |
| Ancient Woodlands | Northwest / north-center | Ancient oak/beech/hornbeam, moss, roots, shaded streams | Elven woodland clearing, Wildling hidden sanctuary, Kethri canopy belt near margins |
| Hidden Hollows | Eastern / northeast forest folds | Damp gullies, sheltered mushroom clearings, springs | Nimrui forest-hollow settlement and secluded shrines |
| Green Ridges | West / north perimeter | Rocky green uplands and modest headwater slopes, viewpoints | Few settlements; waterfalls and stone traces |
| Sylweave Sanctuaries | Rare scattered sites, greater concentration northeast | Old roots, clear pools, natural standing stones, selective luminous flora | Sacred springs, approach to Ellowyn's wider sanctuary |

Do not turn rolling Greenveil into a snow-capped alpine biome simply because distant peaks appear on the illustration.

## Working geographic names (NOT canon)

- **Willowmere:** central freshwater lake; **Silvermere:** linked northern lake; **Reedmere:** eastern sheltered reed lake/inlet.
- **Threadwater River:** north/central linking watercourse; **Mossbrook:** ancient forest feeder streams; **Brightrun River:** southward lake outflow below the bridge.
- **Green Ridges**, **Ancient Woodlands**, **Rolling Heartlands**, **Hidden Hollows**, **Sylweave Sanctuaries**, **Great Lake District:** descriptive planning zones, pending final names.
- **Veilfall Basin:** waterfall-fed northern headwater site.
- Place these labels only as working map markers until explicitly approved.

## Settlement positions (all village names working names)

| People | Working marker | Approximate location and rationale |
| --- | --- | --- |
| Wildlings | Antlershade | Deep northwestern forest, low-visibility canopy/root sanctuary |
| Elves | Silverbough | North-central Ancient Woodlands, graceful open clearing and stream |
| Kethri | Highbough Nook | West-central forest margin, treetop bridges and vertical settlement |
| Nimrui | Lanternhollow | Eastern Hidden Hollows, damp moss and giant fungi by stream |
| Wolfkin | Timberfang Hall | Northwest shore of main lake, broad timber-and-stone halls, docks |
| Freshwater Brinefolk | Reedwhisper Cove | Eastern sheltered reed/inlet waters, surface and shallow-water village access |
| Independent humans | Hearthrest and Oarshade | Southwest meadow refuge plus small south-shore trading/fishing hamlet |

Neither settlement population nor actual structures, faction quests, coordinates or accessibility are finalized. Wildlings and Elves both have homes **especially in the ancient forests**, with distinct architectural identities and established alliance.

## Route hierarchy

1. **South Road** travels east-west through the southern Heartlands and crosses the downstream Brightrun by **Greatstone Bridge** (working name).
2. **Lake Road** connects human south-shore hamlet, Wolfkin approach, ferry/dock points, and contact with Brinefolk shore zones.
3. **Old Forest Ways** connect Elven clearings, Wildling nearby territory and sanctuaries without requiring a highway cut through old-growth forest.
4. **Canopy Paths** give Kethri elevated woodland circulation; non-Kethri access requires intentional gameplay design.
5. **Hollow Paths** are narrow routes into Nimrui country.
6. **Water routes** connect docks, islands and Brinefolk shallow-water access; do not invent active boats or swimming gameplay as currently implemented.

## Landmark candidates (working names)

**Ellowyn's Sanctuary:** sacred northern/northeastern approach, preserve distant cloud-high visibility and respectful space; her exact coordinate remains unapproved. **Circle of First Roots:** ancient stone ring. **Whisperroot Ruins:** old woodland remains (history not final). **Rootwake Ravine:** exposed root and rock cut. **Moonroot Shrine:** secluded eastern glade. **Veilfall Basin:** northern waterfall. **Greatstone Bridge:** main southern river crossing. Sylweave springs: a few rare localized sites. Abandoned fae sites may be explored as optional lore environments, but no new locations are imposed by this art sheet.

## First playable Greenveil corridor (golden dashed map highlight)

**Conceptual area:** southern Willowmere corridor, joining Rolling Heartlands → woodland / Kethri-adjacent trail → southern lake lookout and human lakeshore hamlet approach. It shows terrain, water, a path, forest edge, and prospective settlement footprints without promising populated NPCs.

**Implementation gate:** The previously generated **512×512 m** standalone terrain slice is a test artifact, *not a literal crop of the new regional atlas*. Terrain hydrology/geometry must be reconciled before treating them as the same map. Keep existing Electric Dreams demo protected; desktop issue #16 and demo-acceptance draft PR #17 remain the blocker. The deferred landscape work is [PR #15](https://github.com/Systemkill90/WildBound/pull/15).

### Definition of done (future implementation)
- Continuous watershed terrain and water flow, connected path network, collision-safe player route, readable settlement/landmark markers.
- Distinct trees and ground cover follow the approved art references; licensed runtime assets, not concept art textures masquerading as meshes.
- Packaged Win64 repeatable playtest with real frame time/graphics settings and evidence. No claims of finished, compiled or playable merely because this atlas is approved.

See [approved Greenveil visuals](greenveil-approved-visual-direction.md), [ground layer](greenveil-ground-layer-approved.md) and [settlements](greenveil-settlement-concepts.md).
