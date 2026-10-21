# Idea Board expansion — environmental magic, creatures and villages

**Status:** development-ready **design exploration**, not a promise, final lore, implementation or a decision about milestone timing. Complements [the existing draft Idea Board PR](https://github.com/Systemkill90/WildBound/pull/1).

[Creature candidates](creature-candidates.md) · [Village draft on the original PR](https://github.com/Systemkill90/WildBound/blob/staging/idea-board/docs/world/fantasy-peoples-and-villages.md) · [Concept art](../art/concepts/README.md) · [Checkpoint](../project/TRUCK-STOP-2026-10-21.md)

## Captured creative requests

1. **All animals, including dinosaurs, should sometimes look more mythical:** variation in horns, eyes, body form and, for some species, additional legs.
2. **Cottagecore witchy woodland and swamp pockets**, with unusual plants, charm-like objects and rooted architecture.
3. **Occasional huge mushrooms** and a strong fungus ecology, from village shelters to humid animal grazing grounds.
4. **Original ancient walking or speaking trees.** The touchstone is a sense of venerable, thinking woodland; no borrowed tree-person names, storylines, or designs.
5. **Distinctive peoples and villages:** elven woodland communities, werewolf/wolfkin villages, dwarven mountainside settlements, mixed-population villages, and wholly invented mythical peoples.
6. **Invent original wildlife/creatures and folk**, not only reinterpret familiar fantasy archetypes.

These directions are desired creative territory. Specific coined names, visual implementations, rules and villages below are assistant suggestions staged for review.

## Witchwood pockets: Greenveil's secret places

An ordinary meadow or orchard gives way to a short stretch of mossy cobbles, low fence charms, medicinal herbs drying from a timber porch, and pale light beneath old oak roots. Firefly/moth bioluminescence is periodic rather than a universal visual effect. Play has to feel comfortable by day and curious by night.

**Potential interactions:** identify fungi by habitat, gather limited spores with a basket, mend a greenhouse, observe moth migrations, ask a caretaker about animal illness. Keep claims about healing properties provisional.

**First asset study:** one cottage facade, three mushroom sizes, a lantern, and a wet soil material variant. No witchcraft spellcasting subsystem in the prototype.

## Drowned March: witchy without becoming a theme park

Blackwater and drowned stone feel melancholy, not nonstop jump-scare horror. Reed roofs, raised walkways, fog muffling sounds, lanterns in distant windows and an unfamiliar amphibious voice from beyond the player path establish unease.

**Potential interactions:** help repair a boardwalk, carry safe water to a wetland animal, read tracks on silt, follow a lantern that appears on a clear night. Lanterns may be biological, cultural, or old magic; deliberately avoid explaining everything.

**First art study:** Lanthfen stilt house and reed causeway plus a Veshari silhouette. Not a complete marsh map or copied fantasy-bog scene.

## Giant fungi: ecology before scale

The giant mushrooms should have consequences: persistent moisture, weakened timber, spore dispersal, symbiosis with roots and creatures, shade-loving farms, and safe/unsafe harvest choices. Some could be houses, others protected habitats. "Mushroom village" means architecture and social use, not automatically glowing everywhere.

**Possible original people:** Nimrui are small fungal-symbiotic caretakers (tentative name and anatomy). First proof is a small cluster of giant caps with collision, navigation and lighting; NPCs follow much later.

## Walking or speaking trees: rarity creates wonder

**Whisperbough** is a proposed ancient individual, not a copied character or a ubiquitous playable race. Its speech might be a slow creak-language translated through story, nearby birds, or deliberate dialogue. It may move so rarely players argue whether it actually moved. Growth rings, bark scars and rooted relationships matter more than combat abilities.

**Complexity:** bespoke rig or procedural deformation, reliable collisions with buildings, navigation/performance, sound and voice implementation. Park until forests and persistence can support its consequences.

## Communities and original peoples

| Working village | Cultural/ecological contrast | Candidate daily activity | Production caution |
| :-- | :-- | :-- | :-- |
| **Thistledown** | Elven orchard/canopy homes | Herbal care, orchards, wildlife rehabilitation | Canopy pathing and vertical NPC locomotion |
| **Hollowmoon** | Wolfkin timber halls | Livestock management, moon-based social customs | Fur rigs, social AI, optional transformation animation |
| **Stonewake** | Dwarven mountainside terraces | Masonry, forging, pack-stock grazing | Cliff navigation, slope collisions, level streaming |
| **Morrowcross** | Mixed peoples and house styles | Trading, shared laws and work | More rigs, voices, culture/permission models |
| **Lanthfen** | Veshari amphibious marsh homes | Floating gardens, reed care and wetland travel | Amphibious locomotion and water interactions |
| **Sporeveil** | Nimrui and giant-cap shelters | Fungal agriculture and animal care | Creature/NPC symbiosis, spores, new materials |
| **Starhush** | Kethri arboreal lantern-village | Night crafts, pollinator or insect care | Four-arm rig; suspended navigation and animation |

These communities must contain individuals, differences in personality and relationships, and the possibility of mixed households. Neither wolfkin nor any other people are inherently violent or evil. Distinct animal knowledge, shelter choices, festivals and trade systems can make towns meaningful without combat-heavy fantasy tropes.

**First NPC/village proof only after the animal-building-server loop:** one compact homestead neighbor with a single helpful daily routine, or two original residents sharing an animal-care station. No seven-village launch target.

## Original folk: provisional silhouettes

- **Veshari:** amphibious marsh-dwellers with patterned skin, subtle sensory frills and long-distance water calls; names and visual shapes subject to review.
- **Nimrui:** mycelium-associated woodland folk with seasonal mantles, not a hive mind.
- **Kethri:** nocturnal canopy residents, long featherlike ears, some with four arms and luminous throats. Custom rigs increase cost significantly.
- **Rare tree entities:** individual sentient ancients, much less common than ordinary villages, each with its own history.

## Preserve the Wildbound tone

The player can return from a misty marsh into a warm working barn. Magic is woven through ecology, animals, household rituals and the age of the land. No generic spell spam, neon colors across every zone, borrowed iconic IP, or repetitive settlement caricatures.

## Dependencies and testable slices

| When | Small proof | Must already work |
| :-- | :-- | :-- |
| Next art exploration | Mood palette and sketches for one creature, cottage and marsh causeway | None; concept only |
| After deer gameplay check | Antler/eye variation on a standard rig | Character and animal rigs / movement verified |
| After construction and pathing | Buildable shelter and a small fungi grove with collision | Voxel/volume placement and navigation |
| After persistent two-player world | One scheduled NPC helper and one small neighbor settlement | Server authority, save/load, ownership |
| Far later | Six-legged stock, shapeshifting villages, massive tree beings | Specialized rigs, NPC AI, streaming and budgets |

Treat this document as an **idea staging queue**, not the development roadmap. No concepts are marked approved until a separate decision is made.
