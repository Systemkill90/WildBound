#pragma once
// Portable prototype behavior selection only. Unreal pathfinding, perception,
// replicated movement and animation remain engine-side future work.
#include "WildboundAnimalSimulation.h"
#include <cmath>
#include <cstdint>

namespace WildboundSim
{
enum class EAnimalIntent : std::uint8_t
{
    Idle, Graze, SeekWater, SeekShelter, Flee, Rest
};
struct FIntentContext
{
    bool WaterAccessible = true;
    bool FoodAccessible = true;
    bool ShelterAccessible = true;
    bool ThreatObserved = false;
    bool Night = false;
};
inline EAnimalIntent ChooseIntent(const FAnimalVitals& V, const FIntentContext& C)
{
    if (C.ThreatObserved || (std::isfinite(V.Stress) && V.Stress >= 85.0f))
    {
        return EAnimalIntent::Flee;
    }
    if (std::isfinite(V.Thirst) && V.Thirst < 40.0f && C.WaterAccessible)
    {
        return EAnimalIntent::SeekWater;
    }
    if (std::isfinite(V.Hunger) && V.Hunger < 45.0f && C.FoodAccessible)
    {
        return EAnimalIntent::Graze;
    }
    if ((C.Night || (std::isfinite(V.Condition) && V.Condition < 45.0f))
        && C.ShelterAccessible)
    {
        return EAnimalIntent::SeekShelter;
    }
    if (C.Night)
    {
        return EAnimalIntent::Rest;
    }
    return EAnimalIntent::Idle;
}
} // namespace WildboundSim
