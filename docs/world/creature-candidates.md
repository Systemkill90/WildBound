# Creature and animal candidate roster — idea-board expansion

**Status: exploratory design queue, not approved canon or a production asset commitment.** Initial brainstorm captured October 20, 2026; detailed interpretation staged at the October 21 checkpoint.

[Concept art gallery](../art/concepts/README.md) · [Animal gameplay](../systems/animals.md) · [New ideas](idea-board-expansion.md)

## Design grammar — real, but not real

The user's creative direction is that even ordinary farm and prehistoric animals should feel slightly mythic: unfamiliar horns, eye patterns, occasional extra limbs and distinctive textures. These are *species or rare lineages*, not arbitrary cosmetics pasted onto every animal.

Every proposed alteration answers five questions: **what habitat shaped it, how does it move, what does it eat, how does it communicate, and what does it change for husbandry?** A sixth technical question matters: can a small team rig, animate and replicate it?

Use four morphological tiers, only as planning aids:

- **Tier A — appearance only:** color, eye reflection, fur/feather patterns, mild horn geometry. Works with an otherwise conventional rig.
- **Tier B — proportion/appendage variation:** large antlers, cheek fins, tail plume, neck frill, split horn. Requires material/mesh variants and collision review.
- **Tier C — novel body plan:** extra legs, multiple pairs of horns, unusual feet, amphibious gait. Requires custom rig, animation, IK and navigation testing.
- **Tier D — legendary/sentient:** ambulatory trees and huge fungal symbioses. Require bespoke movement, dialogue and ecosystem rules; long-term, not first-playable.

## Original candidate silhouettes

| Candidate name | Habitat | Signature oddity | Diet/behavior and relationship | Scope |
| :-- | :-- | :-- | :-- | :-- |
| **Mosshorn** | Greenveil meadows and woodland edge | Split antler crowns with living moss, warm eyes; often Tier B | Social grazer; could carry loads, respond to gentle routines and inherit coat/antler traits | Early *concept* candidate |
| **Lanternhare** | Meadow twilight | Softly reflective eye rims, translucent ear tips; A/B | Skittish burrower; indicator of weather and nighttime wildlife, not necessarily a pet | Later wildlife |
| **Brindlefowl** | Farmyards and orchards | Pattern-shifting iridescent hackles, irregular combs; A | Omnivorous flock animal for eggs, pest control, and family care | Later farm livestock |
| **Velvet Grazer** | Greenveil woodland | Paired velvet brow buds, six-point nostril pattern; A/B | Cautious browser whose trust changes with handling, shelter and herd companionship | Later |
| **Reedstrider** | Drowned March shallows | Wide toe spread, lateral eye sheen, optional neck frill; B/C | Wading omnivore; difficult to keep dry and comfortable, specialized marsh transport only if tested | Later biome |
| **Bog Nibbler** | Wetland banks | Whiskered sensory muzzle, bioluminescent teeth staining; A | Excavates roots and aquatic tubers; potential nuisance or forage partner | Later |
| **Fen Warden** | Rare deep marsh | Hornlike reed antlers and a nictitating luminous gaze; B/D | A solitary territorial animal with folklore attached, not an indiscriminate boss | Far future |
| **Rootback** | Giant fungal forest | Fungal mantle and low six-limbed body plan; C | Slow, detritus-associated grazer with host fungi; housing demands humidity, substrate and foot clearance | Later; expensive rig |
| **Thistlemaw** | Scrub/highlands | Ridged jaw frills, thorn camouflage, paired brow prongs; B | Opportunist browser; defensive, wary during offspring season | Later |
| **Whisperbough** | Elder forest pocket | Ancient living arboreal body; D | Rare reasoning being, movement measured in hours, ecological guardian and story character | Long-term |
| **Crownmaw** | Remote rocky forest | Crown-shaped horn array and deep chest; B/C | Large territorial omnivore/predator; not assumed tameable | Late wildlife |
| **Bramble Runner** | Greenveil undergrowth | Tufted tail, narrow asymmetric horn, possibly a four-to-six-limb lineage; B/C | Quick forager; skittish and socially observant, rare trust opportunity | Later |

All names are **working titles** and require originality/trademark checks before promotion to final IP. These studies do not authorize copied animals or lore from existing franchises.

## Dinosaurs with a Wildbound vocabulary

Do not copy the exact recognizable stylization of another survival game. Candidate directions:

1. A small feathered predatory dinosaur with owl-like asymmetric facial plumes and reflective inner eyelids. Its hunting ecology remains grounded.
2. A ceratopsian-like grazer with hollow resonant horn sheaths and seasonal horn color variation. Use sound, not flashy magical attacks.
3. A broad-backed herd dinosaur with fungal-symbiotic skin growth, only in suitable wetlands; test that parasites and symbiosis have costs.
4. Rare six-legged prehistoric-inspired lineages only after biomechanical iteration: hind pairs power the stride, fore pairs brace against banks, pelvis/spine and gait must be believable. **An extra limb pair is a new skeleton**, not a quick mesh edit.

A visually fantastical dinosaur can still need water, social contact, nest safety, food, appropriate enclosure, rest, disease care and generations of breeding.

## Husbandry and genetics guardrails

- Separate species-fixed morphology from *inheritable within-species variants*. Never breed incompatible species just to create unlimited combinations.
- Distinguish genotype, phenotype, learned habits, acquired condition and bond/trust.
- Allow rare trait combinations but avoid stat inflation and forced inbreeding.
- Let wild-caught founders add diversity; animals raised at home may be easier to handle but do not become mindless inventory.
- Support visibility: ancestry, temperamental tendencies, observable physical variants and uncertainty rather than opaque randomized tiers.
- Dedicated server owns lineage IDs, breeding outcomes, housing state and transfers. Offline care must remain humane.
- If an anatomical variant needs a different locomotion rig, budget it as a separate animal body plan, not a cheap genetic toggle.

## Selection gate

**First test:** keep the currently imported static deer as a *technical* proxy. Make it actually move, respond, and receive care in-engine. Only after validation consider a **Mosshorn skin/antler variant** on a conventional quadruped rig; postpone a six-legged species and speaking tree until movement, enclosures and server scaling work.

Do not make all candidates simultaneously. A plausible product may support many eventually; this repository does not yet support that claim.
