# Creative Library pilot

The Garage's **Update Idea Board** button imports bundles placed in its private NAS inbox. The **Supply a design and original files** form accepts design text, images, and audio directly from the desktop UI. The service does not read arbitrary ChatGPT conversations or recover media that the owner cannot access.

## Supply a design

Open Production Team → Creative Library → **Supply a design and original files**. Enter the original design notes and `subject:facet` reference tags, and select any accessible original image or audio files. The local Garage writes the files to its private NAS inbox, verifies them during archival, and creates an exploratory Git record. Each UI upload accepts up to ten files, 15 MiB per file and 25 MiB total. Larger originals can be placed in the NAS inbox manually. Search the design list and use **Review originals** to inspect text, provenance, images, audio, and checksums before approval. No SMB port or public share is exposed. If an original is unavailable, leave it missing rather than substituting a summary.

Place one folder per design under the configured `CreativeLibrary/inbox`. Include `manifest.json`, a UTF-8 text file, and original media. Example:

```json
{
  "id": "dwarf-character-study",
  "title": "Dwarf character study",
  "origin": {
    "method": "manual-private-nas-transfer",
    "source": "Owner-supplied original notes and attachments",
    "createdAt": "2026-10-25"
  },
  "textFile": "idea.md",
  "media": [
    {"kind": "image", "file": "character.png", "source": "Owner-supplied original"},
    {"kind": "audio", "file": "voice.wav", "source": "Owner-supplied original"}
  ],
  "coverage": ["dwarf:appearance", "dwarf:anatomy", "dwarf:culture", "dwarf:clothing", "dwarf:character-reference"],
  "relations": ["dwarf", "character"],
  "approvalAllowed": true
}
```

The folder name must equal the `id`. Keep the original files in the inbox: sync copies them to content-addressed NAS archive objects, verifies SHA-256 after writing, and records their checksums and provenance in `docs/creative-library/records`. Repeating sync deduplicates identical content. Changing text, media, or manifest creates an exploratory new version. A crash or unavailable NAS leaves the inbox intact and the local sync ledger records queued, archiving, verified, unchanged, or error state; press Update Idea Board after restoring access to retry.

The Git record contains searchable text, relationship tags, approval state, origin, and media hashes/relative object names. It does not contain the private share address or full media bytes. Review and merge the record through a PR. The Garage's controlled Library service is the worker-facing path, including through the Workshop MCP reference-package tool: it returns approved, version-pinned packages with original media paths and hashes. Workers receive the design text as reference data, not instructions. Exploratory versions never enter worker packages automatically. Owner approval in the UI is explicit and requires accessible originals. Approval can be withdrawn for future tasks; work already produced keeps its recorded reference versions.

The local Production Director proposes structured `subject:facet` needs for named creative subjects. The Librarian validates those tags, adds relevant needs for named subjects already indexed, follows relationship tags, and retrieves only approved, accessible versions. This works for any culture, character, biome, architecture, prop, sound, or material; the Dwarf and Merfolk cases are examples, not special rules. Missing or inaccessible coverage persists as a Missing Reference Request in Garage and pauses only that task. A manifest can declare `conflictsWith` design IDs; if two conflicting approved versions enter one package, the Librarian pauses the task until the owner clarifies or withdraws an approval. Supplying and approving relevant material, then rechecking references, resumes it. “Explore design” prepares a new exploratory production prompt; its output still needs owner review.

## Pilot evidence and limits

On October 25 the pilot copied one accessible Idea Board text original, one tracked concept JPG, and one unrelated local Garage voice QA WAV through the private NAS inbox. All three were archived as originals with verified hashes, and the Git record is `garage-pilot-2026-10-25.json`. This is a **transport test**, not a cohesive approved design. Its version is exploratory and approval is disabled. The Merfolk stove probe produced five persistent missing-reference categories in the live Garage UI.

This pilot detects explicit declared conflicts, but it does not infer every semantic contradiction between design texts or open PRs automatically from the Update button. The current review branch is the PR staging path. Do not infer canon from the test fixture or from AI classification. New rigs, animation authoring, and prompt-to-3D remain separate Garage capability limits until their local workers produce acceptable reviewed output.
