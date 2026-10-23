// Additional independent regression checks for Wildbound animal care rules.
// These tests compile without UE. They DO NOT test replicated UE gameplay.
#include "WildboundAnimalSimulation.h"
#include <cmath>
#include <cstdlib>
#include <iostream>
#include <limits>

using namespace WildboundSim;
int main()
{
    int count = 0;
    auto require = [&count](bool ok, const char* label)
    {
        if (!ok) { std::cerr << "FAILED: " << label << '\n'; std::exit(1); }
        ++count;
    };
    {
        FAnimalVitals v;
        v.Hunger = 99.0f;
        v.Trust = 25.0f;
        require(!ApplyCare(v, ECareAction::Feed), "full animal declines food");
        require(v.Trust == 25.0f, "failed feeding does not gain trust");
        v.Thirst = 100.0f;
        require(!ApplyCare(v, ECareAction::Water), "fully watered animal declines water");
        require(v.Trust == 25.0f, "failed water action does not gain trust");
    }
    {
        FAnimalVitals v;
        v.Stress = 90.0f;
        require(!ApplyCare(v, ECareAction::Feed), "feeding blocked at panic threshold");
        require(!ApplyCare(v, ECareAction::Water), "watering blocked at panic threshold");
        require(ApplyCare(v, ECareAction::Reassure), "reassurance succeeds when stressed");
        require(v.Stress == 78.0f, "calming changes stress predictably");
        require(ApplyCare(v, ECareAction::Feed), "feeding after reassurance succeeds");
    }
    {
        FAnimalVitals v;
        v.Stress = 9.999f;
        const float original = v.Trust;
        require(!ApplyCare(v, ECareAction::Reassure), "calm animal declines unnecessary reassurance");
        require(v.Trust == original, "trust not farmed through redundant reassurance");
        v.Stress = 100.0f;
        for (int i=0; i<30; ++i) { ApplyCare(v, ECareAction::Reassure); }
        require(v.Stress >= 0.0f && v.Stress <= 100.0f, "stress bounded");
        require(v.Trust >= 0.0f && v.Trust <= 100.0f, "trust bounded");
    }
    {
        FAnimalVitals v;
        v.Hunger = 0.0f;
        v.Thirst = 100.0f;
        v.Condition = 1.0f;
        require(Advance(v, FNeedsRates{}, 120.0, false), "deprivation advances");
        require(v.Condition == 0.0f, "condition never goes negative");
        require(v.Stress > 25.0f, "need loss increases stress");
    }
    {
        FAnimalVitals v;
        v.Hunger = 100.0f;
        v.Thirst = 100.0f;
        v.Condition = 99.9f;
        require(Advance(v, FNeedsRates{}, 300.0, true), "shelter recovery advances");
        require(v.Condition <= 100.0f, "condition clamps to 100");
        require(v.Stress <= 25.0f, "shelter reduces stress");
    }
    {
        FAnimalVitals v;
        v.Trust = std::numeric_limits<float>::quiet_NaN();
        v.Hunger = std::numeric_limits<float>::infinity();
        require(ApplyCare(v, ECareAction::Feed), "care sanitizes invalid values");
        require(std::isfinite(v.Hunger) && std::isfinite(v.Trust), "state finite after care");
    }
    std::cout << "Passed " << count << " additional animal care regression checks.\n";
    return 0;
}
