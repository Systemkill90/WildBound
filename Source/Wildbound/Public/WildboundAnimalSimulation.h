#pragma once

// Platform-independent animal condition rules.
// Deliberately uses only C++17 standard headers so these rules can be
// validated without an installed Unreal Engine. Unreal wrappers own authority,
// replication, player permissions, and persistence.
#include <algorithm>
#include <cmath>
#include <cstdint>

namespace WildboundSim
{
enum class ECareAction : std::uint8_t
{
    Feed = 0,
    Water = 1,
    Reassure = 2
};

struct FAnimalVitals
{
    float Hunger = 80.0f;
    float Thirst = 80.0f;
    float Condition = 100.0f;
    float Stress = 25.0f;
    float Trust = 5.0f;
};

struct FNeedsRates
{
    float HungerLossPerMinute = 0.5f;
    float ThirstLossPerMinute = 0.75f;
    float ConditionLossPerMinute = 2.0f;
    float RecoveryPerMinute = 0.5f;
};

inline float ClampPercent(float Value)
{
    return std::isfinite(Value) ? std::clamp(Value, 0.0f, 100.0f) : 0.0f;
}

inline float NonNegativeRate(float Rate)
{
    return std::isfinite(Rate) ? std::max(0.0f, Rate) : 0.0f;
}

// Returns false on invalid elapsed time. An individual update is capped at
// five minutes to prevent an accidental long stall from destroying an animal;
// offline progression must be a separate, explicit design decision.
inline bool Advance(FAnimalVitals& State, const FNeedsRates& Rates,
                    double ElapsedSeconds, bool bSheltered)
{
    if (!std::isfinite(ElapsedSeconds) || ElapsedSeconds <= 0.0)
    {
        return false;
    }

    const float Minutes = static_cast<float>(
        std::min(ElapsedSeconds, 300.0) / 60.0);

    State.Hunger = ClampPercent(
        ClampPercent(State.Hunger) - NonNegativeRate(Rates.HungerLossPerMinute) * Minutes);
    State.Thirst = ClampPercent(
        ClampPercent(State.Thirst) - NonNegativeRate(Rates.ThirstLossPerMinute) * Minutes);
    State.Condition = ClampPercent(State.Condition);
    State.Stress = ClampPercent(State.Stress);
    State.Trust = ClampPercent(State.Trust);

    const bool bDeprived = State.Hunger <= 0.0f || State.Thirst <= 0.0f;
    const bool bNeedsAttention = State.Hunger < 25.0f || State.Thirst < 25.0f;

    if (bDeprived)
    {
        State.Condition = ClampPercent(State.Condition -
            NonNegativeRate(Rates.ConditionLossPerMinute) * Minutes);
    }
    else if (bSheltered && State.Hunger > 50.0f && State.Thirst > 50.0f)
    {
        State.Condition = ClampPercent(State.Condition +
            NonNegativeRate(Rates.RecoveryPerMinute) * Minutes);
    }

    // Environmental context is intentionally simple for the first prototype.
    const float StressPerMinute = bNeedsAttention ? 1.5f : (bSheltered ? -1.0f : -0.25f);
    State.Stress = ClampPercent(State.Stress + StressPerMinute * Minutes);
    return true;
}

// Input action has already been server-validated for range, inventory, and
// cooldown. Returns false if the action has no legitimate effect.
inline bool ApplyCare(FAnimalVitals& State, ECareAction Action)
{
    State.Hunger = ClampPercent(State.Hunger);
    State.Thirst = ClampPercent(State.Thirst);
    State.Condition = ClampPercent(State.Condition);
    State.Stress = ClampPercent(State.Stress);
    State.Trust = ClampPercent(State.Trust);

    switch (Action)
    {
    case ECareAction::Feed:
        if (State.Hunger >= 99.0f || State.Stress >= 90.0f) return false;
        State.Hunger = ClampPercent(State.Hunger + 25.0f);
        State.Trust = ClampPercent(State.Trust + 1.0f);
        return true;

    case ECareAction::Water:
        if (State.Thirst >= 99.0f || State.Stress >= 90.0f) return false;
        State.Thirst = ClampPercent(State.Thirst + 30.0f);
        State.Trust = ClampPercent(State.Trust + 1.0f);
        return true;

    case ECareAction::Reassure:
        if (State.Stress < 10.0f) return false;
        State.Stress = ClampPercent(State.Stress - 12.0f);
        State.Trust = ClampPercent(State.Trust + 2.0f);
        return true;

    default:
        return false;
    }
}
} // namespace WildboundSim
