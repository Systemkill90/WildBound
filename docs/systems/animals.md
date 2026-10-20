# Animals, taming, and husbandry

[Vision](../vision.md) · [Biomes](../world/biomes.md) · [Roadmap](../../ROADMAP.md)

**Status: design only.** No animal AI, assets, taming, breeding, or genetics are implemented.

## Wildlife first

Animals should forage, drink, rest, seek shelter, react to threats, and occupy suitable habitats. Predators, prey, and scavengers create readable relationships. Begin with one species and a few observable needs; validate behavior and performance before attempting a full ecology simulation.

## Taming and wild-caught animals

Observation and trust are the proposed foundation: learn diet, approach cautiously, establish repeated positive contact, and provide suitable space. Species have different temperaments and domestication potential. Capturing or relocating wildlife introduces stress and care requirements; capture alone must not produce instant obedience. Humane handling, recovery, and safe release are design goals. Exact capture mechanics remain undecided.

## Farm animals and daily care

Candidate livestock includes chickens, ducks, sheep, goats, cattle, pigs, and working equines. This is a concept list, not a production commitment. Distinct roles could include eggs, milk, wool, manure, grazing, transport, and companionship.

Care may include feed quality, clean water, bedding, shelter, enclosure space, social grouping, health checks, grooming, and enrichment. Neglect and overcrowding should have readable consequences. Balance welfare with a manageable play schedule. Offline care rules must be settled before persistent worlds are ready.

## Breeding and genetics

Separate inherited traits from environmental condition and learned trust. Candidate inherited traits include coat color and pattern, body size, temperament tendencies, and climate tolerance. Nutrition, stress, and care influence health and development rather than rewriting ancestry.

Track parentage, show understandable trait ranges, and investigate genetic diversity and inbreeding consequences. Do not promise a biologically complete genetics simulation. Pregnancy or incubation, offspring development, inheritance probabilities, limits, and welfare safeguards require prototyping. Favor healthy, distinctive lineages over unbounded stat inflation.

## Shared stewardship

Naming, lineage records, care history, and shared caretakers would make animals part of a community. Server authority must govern ownership, breeding outcomes, transfers, and inventories. Population caps, simulation distance, and offline progression require performance testing.

## First proof

One placeholder herbivore should eat, drink, rest, display stress, respond to patient contact, and persist across a server restart. A farm animal care loop and small inheritance prototype follow only after this is understandable and enjoyable.
