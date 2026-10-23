# Wildbound development log

Short field notes from the active build. Each entry links to its test evidence and names unfinished work plainly; a passing build or automated probe is not a claim that a feature is finished.

## October 23, 2026 · Free village sample acquired

Fab downloaded the Medieval Village Megascans Sample as a separate local project. Its main World Partition map loaded in UE 5.8 editor mode, but Unreal began rebuilding its 16K minimap texture (estimated 11.7 GiB of texture-build memory); the editor was stopped before visual inspection. A standalone game-mode launch bypassed the minimap and Zen 507, but rebuilt Nanite/static-mesh data; a warm-cache retry reached 192 of 258 static meshes before system commit pressure forced a stop, before gameplay. A reversible local-only shader-worker cap reduced the editor to two workers, and its DDC is retained for future retries. No sample assets were brought into Wildbound; the playable Greenveil project and map remain untouched. Next, resolve local paging/commit capacity or identify a smaller sample slice that avoids the large rebuilds, then verify the actual visuals before adapting anything. [Current state](CURRENT-STATE.md) · [Starter-village brief](../world/greenveil-starter-village.md) · [Roadmap](../../ROADMAP.md).

## October 22, 2026 · Greenveil starter-village direction

The owner set a small starter village as Greenveil's test grounds. The next slice is centered on a compact arrival green, home/workshop lane, garden/farm edge, creek crossing, and short returning forest route. That gives movement, collision, building-block placement, camera clearance, and route readability a useful scale without expanding into a large map. Animal gameplay remains paused.

The local Electric Dreams sample has strong woodland content but no suitable buildings, and its full PCG scene cannot be copied safely. Quixel's free [Medieval Village Megascans Sample](https://www.fab.com/listings/2e11a225-a6ea-4781-a3e1-fe975b461894) is a candidate authored village base. Fab describes it as a walkable photogrammetry sample and warns that some showcase images include visualization-only content. Its installed contents and UE 5.8 behavior still need verification. At the October 22 checkpoint, the launcher had not yet downloaded the sample; acquisition and the later launch result are recorded above. No map was modified, and no compile, package, or gameplay result is claimed. The current playable map/package remains the rollback. [Starter-village slice brief](../world/greenveil-starter-village.md).

## October 23, 2026 · Render review and bounded-map checkpoint

Launched the last verified native-1080p Windows build and inspected a fresh live frame plus saved traversal views at the arrival clearing, cottage approach, creek crossing and return route. The canopy and understory are real forest assets and form a useful visual foundation, but every current sightline still exposes development-stage ground treatment, clipped-bright clearings, the mannequin or blockout cottage. No current generated-map location is a suitable art baseline yet.

A read-only inventory of the Electric Dreams forest identified candidate regions, but copying the full 512 m PCG scene into a new level triggered expensive Nanite rebuilds and exceeded Unreal's available system commit. The candidate copy was not saved and the source map remains untouched. Do not repeat a whole-world save. Next, inspect the original sample visually and select one bounded region before creating a smaller derivative map. This attempt produced no new compile, package or performance result; the existing verified build remains available for rollback.

## October 23, 2026 · Greenveil art-base correction

The owner called out that the current scene is not close enough to the intended realistic biome. That assessment is accurate: the packaged map proves traversal, but its generated terrain, broad uniform scatter, mannequin and box-built houses still read as graybox. The project had already recorded Electric Dreams' authored forest as the intended visual base; the generated map did not follow through on that decision. The next milestone is now a separate, bounded Greenveil slice from the installed authored forest/PCG environment, retaining Wildbound controls and preserving the current map/package for rollback. No animal gameplay. Local Electric Dreams content remains machine-local; no assets are redistributed through GitHub. Unreal rendering and benchmarks are deferred when they would compete with active local AI inference. No visual/build success is claimed for this planned transition.

The concept-art direction remains a flexible guide and can change as the world gains detail and is playtested. Six optional Poly Haven CC0 2K source bundles (meadow grass, two flowering groundcovers, boulder, roots and a modular pier; about 172 MB) were downloaded, hash-verified, and imported into a local candidate-only Unreal folder. The UE 5.8.4 commandlet completed successfully and verified that the existing GreenveilField map hash did not change. The candidates have not been placed in a map; the flower material instances still need texture parameters wired. A read-only audit of Electric Dreams' forest found 391 mesh components, around 572,150 instances and 164 mesh types spread across roughly 512 × 512 m. It is a source for selected authored assemblies, not a ready-to-play Greenveil map. No visual, packaging or performance success is claimed for this pass. See the [asset inventory](../art/GREENVEIL-ASSET-INVENTORY.md) and [source/license record](../art/ASSET-CREDITS.md).

## October 22, 2026 · GPU profile and shadow-quality comparison

Built and packaged the current map with optional screenshot suppression and Unreal Insights tracing. The all-Medium, native-1080p route passed 15/15 grounded waypoints over 327.6 m at **55.26 FPS** (18.096 ms mean, 21.612 ms p95). The trace showed GPU frame time near 17.94 ms and shadow depth averaging 5.45 ms. Keeping all settings Medium except shadows at Low produced a guarded repeat of **75.89 FPS** (13.178 ms mean, 15.205 ms p95), 15/15 waypoints over 327.7 m, zero navigation failures and zero animals. The traversal helper checks Ollama and yields if a local model loads; no model was loaded in its preflight or polling samples. Low shadows are still a candidate pending a human visual check, so the normal Medium default did not change. The raw trace stays local. [Test details](GREENVEIL-EXPLORATION-2026-10-22.md).

## October 22, 2026 · Greenveil exposure pass

The game-mode field grade now reduces exposure and highlight contrast to retain more ground detail in the sunlit clearing. A fresh UE 5.8.4 editor build and Windows package succeeded without regenerating the map. The native-1080p Medium automated route passed **15/15 waypoints over 326.1 m**, with zero navigation failures and zero animal actors. Across 2,790 frames, one uncapped run averaged **50.61 FPS** (p95 22.616 ms, p99 24.239 ms; peak process memory 1,595.5 MiB), still below the 60 FPS goal. The clearing remains too bright; Quinn and cottages are placeholders. The same change disables unused Android File Server access for the current Windows build and adds a regression check against non-empty tokens. [Full verification record](GREENVEIL-EXPLORATION-2026-10-22.md).

## October 22, 2026 · Clean build and traversal after source sync

The synchronized Greenveil branch compiled and packaged cleanly with Unreal Engine 5.8.4. The map was not regenerated, and prior package checkpoints were left intact. The fresh native-1080p Medium package passed **15/15 movement waypoints over 326.1 m**, with zero navigation failures and zero animal actors. It averaged **49.19 FPS** over 2,713 frames (p95 22.786 ms; peak process memory 1,538.3 MiB), below the 60 FPS goal. The packaged capture confirms the bright clearing, mannequin player and cottage placeholders remain visible work. This automated run does not verify animal, building or care gameplay. [Full build and traversal record](GREENVEIL-EXPLORATION-2026-10-22.md).

## October 22, 2026 · Greenveil creek and crossing pass

The interrupted Greenveil creek/bridge pass is now regenerated, compiled and packaged as a local-only V5 Windows archive. The original V4 checkpoint remains untouched. The creek uses a new physically based material wired to the locally installed Megascans swamp-water normal; the footbridge decks were shortened from 28 m to 14 m.

The packaged movement probe passed **15/15 grounded waypoints over 325.9–326.0 m**, all **14/14 navigation legs**, with zero navigation failures and zero animal actors. At native 1920×1080 Medium, the first cold run averaged **39.38 FPS** (p95 44.751 ms, p99 66.686 ms, peak 1,592.1 MiB); a second cache-warmed run averaged **49.89 FPS** (p95 22.764 ms, p99 24.609 ms, peak 1,545.8 MiB). This remains short of the 60 FPS target.

The new material compiles and cooks, but the actual packaged capture still shows a nearly black creek and strongly over-bright clearing. Quinn remains the installed mannequin. Those are visible art/lighting issues, not fixed items. No animal gameplay was added.

**Next at the time:** diagnose creek visibility and exposure against the actual packaged captures, then manually check side trails, jump/camera clearance and off-trail collisions when the owner is available. Preserve each package as a separate checkpoint. [Current state](CURRENT-STATE.md) · [Test report](GREENVEIL-EXPLORATION-2026-10-22.md) · [Roadmap](../../ROADMAP.md)

## October 22, 2026 · Creek visibility check

V5's new PBR surface made the creek nearly black in the packaged capture despite compiling and cooking successfully. V6 restores the established creek material while retaining the shortened bridge decks. The fresh editor compile, map regeneration and Windows package all succeeded; one packaged native-1080p Medium traversal passed **15/15 grounded waypoints over 326.1 m**, all **14/14 navigation legs**, zero navigation failures and zero animal actors.

The uncapped run averaged **50.03 FPS** (19.987 ms mean, 22.649 ms p95, 24.587 ms p99) and peaked at **1,614.6 MiB** process memory. The actual bridge capture shows readable teal water again. Some clearing patches remain over-bright, and performance remains below the 60 FPS goal. This was an automated traversal with rendered waypoint captures, not manual owner playtesting. The V6 package and raw captures remain local; no machine-specific paths or hardware identifiers are included in this public log.

**Next:** address clearing exposure using the captured route, then perform manual side-path, jump/camera and off-trail collision checks when the owner is available. Keep animal gameplay paused. [Current state](CURRENT-STATE.md) · [Test report](GREENVEIL-EXPLORATION-2026-10-22.md) · [Roadmap](../../ROADMAP.md)
