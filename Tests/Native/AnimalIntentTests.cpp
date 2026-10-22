#include "WildboundAnimalIntent.h"
#include <cstdlib>
#include <iostream>
#include <limits>
using namespace WildboundSim;
int main()
{
    int checks = 0;
    auto ck = [&](bool v, const char* name)
    {
        if (!v) { std::cerr << "FAILED " << name << '\n'; std::exit(1); }
        ++checks;
    };
    FAnimalVitals v;
    FIntentContext c;
    ck(ChooseIntent(v,c) == EAnimalIntent::Idle, "healthy safe daylight idle");
    v.Hunger=20;
    ck(ChooseIntent(v,c) == EAnimalIntent::Graze, "hungry animal seeks food");
    v.Thirst=15;
    ck(ChooseIntent(v,c) == EAnimalIntent::SeekWater, "water outranks grazing");
    c.WaterAccessible=false;
    ck(ChooseIntent(v,c) == EAnimalIntent::Graze, "no unreachable water seeking");
    c.FoodAccessible=false;
    c.Night=true;
    ck(ChooseIntent(v,c) == EAnimalIntent::SeekShelter, "night shelter fallback");
    c.ShelterAccessible=false;
    ck(ChooseIntent(v,c) == EAnimalIntent::Rest, "night rest when no shelter");
    v.Stress=85;
    ck(ChooseIntent(v,c) == EAnimalIntent::Flee, "panic outranks resting");
    v.Stress=0;
    c.ThreatObserved=true;
    ck(ChooseIntent(v,c) == EAnimalIntent::Flee, "perceived threat outranks hunger");
    c.ThreatObserved=false;
    c.Night=false;
    v.Hunger=80;
    v.Thirst=80;
    v.Condition=40;
    c.ShelterAccessible=true;
    ck(ChooseIntent(v,c) == EAnimalIntent::SeekShelter, "weak animal seeks shelter");
    c.ShelterAccessible=false;
    ck(ChooseIntent(v,c) == EAnimalIntent::Idle, "no invented valid destinations");
    v.Stress=std::numeric_limits<float>::quiet_NaN();
    ck(ChooseIntent(v,c) == EAnimalIntent::Idle, "invalid stress cannot trigger panic");
    std::cout << "Passed " << checks << " portable animal intent checks.\n";
    return 0;
}
