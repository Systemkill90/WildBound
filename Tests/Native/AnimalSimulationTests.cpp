// Compile with: c++ -std=c++17 -Wall -Wextra -Werror -pedantic
// -I Source/Wildbound/Public Tests/Native/AnimalSimulationTests.cpp -o /tmp/wildbound-animal-tests
#include "WildboundAnimalSimulation.h"
#include <cassert>
#include <cmath>
#include <iostream>
#include <limits>

using namespace WildboundSim;

static bool Near(float A, float B, float Tolerance = 0.0001f)
{
    return std::fabs(A - B) < Tolerance;
}

int main()
{
    int Checks = 0;
    auto Check = [&](bool Passed, const char* Description)
    {
        if (!Passed)
        {
            std::cerr << "FAILED: " << Description << "\n";
            std::exit(1);
        }
        ++Checks;
    };

    {
        FAnimalVitals V;
        const FNeedsRates Rates;
        Check(Advance(V, Rates, 60.0, false), "one minute advances");
        Check(Near(V.Hunger, 79.5f), "hunger drains deterministically");
        Check(Near(V.Thirst, 79.25f), "thirst drains deterministically");
        Check(Near(V.Condition, 100.0f), "healthy animal does not suffer");
        Check(Near(V.Stress, 24.75f), "calm animal relaxes gradually");
    }
    {
        FAnimalVitals V;
        V.Hunger = 0.1f;
        V.Thirst = 0.1f;
        V.Condition = 50.0f;
        Check(Advance(V, FNeedsRates{}, 60.0, false), "deprivation advances");
        Check(Near(V.Hunger, 0.0f) && Near(V.Thirst, 0.0f), "depletion clamps");
        Check(Near(V.Condition, 48.0f), "deprivation damages condition");
        Check(V.Stress > 25.0f, "hunger or thirst causes stress");
    }
    {
        FAnimalVitals V;
        V.Condition = 50.0f;
        Check(Advance(V, FNeedsRates{}, 60.0, true), "sheltered animal advances");
        Check(Near(V.Condition, 50.5f), "shelter allows healthy recovery");
        Check(Near(V.Stress, 24.0f), "shelter reduces stress");
    }
    {
        FAnimalVitals V;
        Check(!Advance(V, FNeedsRates{}, -1.0, false), "negative elapsed rejected");
        Check(!Advance(V, FNeedsRates{}, 0.0, false), "zero elapsed rejected");
        Check(!Advance(V, FNeedsRates{}, std::numeric_limits<double>::infinity(), false),
              "infinite elapsed rejected");
        Check(!Advance(V, FNeedsRates{}, std::numeric_limits<double>::quiet_NaN(), false),
              "NaN elapsed rejected");
        Check(Near(V.Hunger, 80.0f), "invalid time does not change vitals");
        Check(Advance(V, FNeedsRates{}, 100000.0, false), "long elapsed allowed");
        Check(Near(V.Hunger, 77.5f), "long stall limited to five minutes");
    }
    {
        FAnimalVitals V;
        Check(ApplyCare(V, ECareAction::Feed), "feeding succeeds when hungry");
        Check(Near(V.Hunger, 100.0f), "feeding restores hunger and clamps");
        Check(!ApplyCare(V, ECareAction::Feed), "no consuming food when full");
        Check(ApplyCare(V, ECareAction::Water), "watering succeeds");
        Check(Near(V.Thirst, 100.0f), "water restores thirst");
        Check(ApplyCare(V, ECareAction::Reassure), "reassurance lowers stress");
        Check(Near(V.Stress, 13.0f), "reassurance effect");
        Check(Near(V.Trust, 9.0f), "repeated positive care grows trust");
        Check(!ApplyCare(V, static_cast<ECareAction>(255)), "invalid action rejected");
    }
    {
        FAnimalVitals V;
        V.Stress = 95.0f;
        Check(!ApplyCare(V, ECareAction::Feed), "panicked animal refuses food");
        Check(ApplyCare(V, ECareAction::Reassure), "panic can be soothed");
        Check(ApplyCare(V, ECareAction::Feed), "calmed animal accepts food");
    }
    {
        FAnimalVitals V;
        V.Hunger = std::numeric_limits<float>::quiet_NaN();
        V.Stress = -12.0f;
        const FNeedsRates Rates;
        Check(Advance(V, Rates, 60.0, true), "invalid state sanitized");
        Check(std::isfinite(V.Hunger) && V.Hunger >= 0.0f, "NaN hunger sanitized");
        Check(V.Stress >= 0.0f, "negative stress sanitized");
    }

    std::cout << "Passed " << Checks << " native animal simulation checks.\n";
    return 0;
}
