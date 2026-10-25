# Greenveil — first five tree families geometry export

**Created October 25, 2026. Status: AUTHORING PROTOTYPE, NOT GAME-READY OR UE-IMPORTED.**

Produced an original procedural 3D mesh collection in the current conversation: `Wildbound_Greenveil_First_3D_Trees.zip`.

- **15 GLB files:** Sylweave Willow, Ancient Oak, Silver Birch, Cathedral Beech, Stonewood Hornbeam, each Young, Mature, Ancient.
- **Reproducible source:** `generate_trees.py` is packaged alongside the exported models and manifest. Requires Python, numpy, trimesh.
- All 15 GLB scenes were exported and re-opened with trimesh. Aggregate reported triangle count: 142,030.
- Meshes have actual tree trunks, branching and root forms, and initial green foliage proxies. Willow has long hanging fronds. The others have faceted proxy leaf clusters, not realistic finished leaves.
- **NOT verified:** art-director visual fidelity, real bark/leaf texture maps and UVs, correct UE5 foliage material/wind, LOD/Nanite setup, collision, import, packaged performance or gameplay.
- No restricted Fab/Epic source meshes included, and **Ellowyn** is intentionally not part of this set.

**Important storage distinction:** The ZIP and GLB binaries are downloadable conversation attachments, *not committed to GitHub*. This Markdown record is not proof of the binaries being in GitHub. For desktop integration, acquire the original archive from the conversation, verify 15 GLBs and `manifest.json`, place editable source/exports in authorized local project storage, and choose repository import permissions before committing binary sources. Keep the existing runnable Unreal map untouched. Use a new test level, pass measurable acceptance gates, then progressively replace placeholders.

**Track:** [Issue #13](https://github.com/Systemkill90/WildBound/issues/13) · [Draft PR #14](https://github.com/Systemkill90/WildBound/pull/14) · [Approved visual standard](https://github.com/Systemkill90/WildBound/blob/staging/idea-board/docs/world/greenveil-tree-production-spec.md).
