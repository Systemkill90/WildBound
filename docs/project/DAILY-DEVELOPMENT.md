# Wildbound development log

Short field notes from the active build. Each entry links to its test evidence and names unfinished work plainly; a passing build or automated probe is not a claim that a feature is finished.

## October 22, 2026 · Greenveil creek and crossing pass

The interrupted Greenveil creek/bridge pass is now regenerated, compiled and packaged as a local-only V5 Windows archive. The original V4 checkpoint remains untouched. The creek uses a new physically based material wired to the locally installed Megascans swamp-water normal; the footbridge decks were shortened from 28 m to 14 m.

The packaged movement probe passed **15/15 grounded waypoints over 325.9–326.0 m**, all **14/14 navigation legs**, with zero navigation failures and zero animal actors. At native 1920×1080 Medium, the first cold run averaged **39.38 FPS** (p95 44.751 ms, p99 66.686 ms, peak 1,592.1 MiB); a second cache-warmed run averaged **49.89 FPS** (p95 22.764 ms, p99 24.609 ms, peak 1,545.8 MiB). This remains short of the 60 FPS target.

The new material compiles and cooks, but the actual packaged capture still shows a nearly black creek and strongly over-bright clearing. Quinn remains the installed mannequin. Those are visible art/lighting issues, not fixed items. No animal gameplay was added.

**Next:** diagnose creek visibility and exposure against the actual packaged captures, then manually check side trails, jump/camera clearance and off-trail collisions when the owner is available. Preserve V4 and V5 as separate checkpoints. [Current state](CURRENT-STATE.md) · [Test report](GREENVEIL-EXPLORATION-2026-10-22.md) · [Roadmap](../../ROADMAP.md)
