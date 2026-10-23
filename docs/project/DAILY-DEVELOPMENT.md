# Wildbound development log

Short field notes from the active build. Each entry links to its test evidence and names unfinished work plainly; a passing build or automated probe is not a claim that a feature is finished.

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
