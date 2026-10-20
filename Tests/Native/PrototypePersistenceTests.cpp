#include "WildboundPrototypePersistence.h"
#include <cmath>
#include <cstdlib>
#include <iostream>
#include <limits>
#include <sstream>
#include <string>

using namespace WildboundSim;

int main()
{
    int Checks = 0;
    const auto Check = [&Checks](bool Condition, const char* Description)
    {
        if (!Condition)
        {
            std::cerr << "FAILED: " << Description << '\n';
            std::exit(1);
        }
        ++Checks;
    };

    FPrototypeSnapshot World;
    World.AnimalId = 384;
    World.Animal.Hunger = 67.25f;
    World.Animal.Trust = 44.5f;
    World.Blocks = {{-3, 4}, {-2, 4}, {-1, 4}, {0, 4}};

    std::stringstream Data;
    Check(WritePrototypeSnapshot(Data, World), "write initial snapshot");

    FPrototypeSnapshot Loaded;
    Check(ReadPrototypeSnapshot(Data, Loaded), "read valid versioned snapshot");
    Check(Loaded.AnimalId == 384, "stable animal ID roundtrips");
    Check(Loaded.Blocks.size() == 4, "block count roundtrips");
    Check(Loaded.Blocks[0].X == -3 && Loaded.Blocks[0].Y == 4,
          "negative cell coordinate roundtrips");
    Check(std::fabs(Loaded.Animal.Hunger - 67.25f) < 0.0001f,
          "needs roundtrip");
    Check(std::fabs(Loaded.Animal.Trust - 44.5f) < 0.0001f,
          "trust roundtrip");

    const std::string Original = Data.str();
    const auto Parse = [](const std::string& Contents)
    {
        std::istringstream In(Contents);
        FPrototypeSnapshot Result;
        return ReadPrototypeSnapshot(In, Result);
    };

    Check(!Parse("WB_GREENVEIL 2\n1\n80 80 100 25 5\n0\n"),
          "reject unsupported snapshot version");
    Check(!Parse("WRONG 1\n1\n80 80 100 25 5\n0\n"),
          "reject invalid signature");
    Check(!Parse("WB_GREENVEIL 1\n0\n80 80 100 25 5\n0\n"),
          "reject null animal ID");
    Check(!Parse("WB_GREENVEIL 1\n-1\n80 80 100 25 5\n0\n"),
          "reject negative animal ID");
    Check(!Parse("WB_GREENVEIL 1\n1\n80 80 100 25 5\n129\n"),
          "reject too many blocks");
    Check(!Parse("WB_GREENVEIL 1\n1\n80 80 100 25 5\n2\n0 0\n0 0\n"),
          "reject duplicate block locations");
    Check(!Parse("WB_GREENVEIL 1\n1\n80 80 100 25 5\n1\n99 0\n"),
          "reject out-of-bounds grid location");
    Check(!Parse("WB_GREENVEIL 1\n1\n200 80 100 25 5\n0\n"),
          "reject impossible condition value");
    Check(!Parse(Original + "UNEXPECTED"), "reject trailing garbage");
    Check(!Parse(Original.substr(0, Original.size() - 3)),
          "reject truncated block records");

    FPrototypeSnapshot Invalid = World;
    Invalid.Animal.Trust = std::numeric_limits<float>::infinity();
    std::ostringstream Reject;
    Check(!WritePrototypeSnapshot(Reject, Invalid), "reject infinite trust on write");
    Check(Reject.str().empty(), "failed write does not emit partial data");

    Invalid = World;
    Invalid.Blocks.push_back({0, 4});
    Check(!IsValidPrototypeSnapshot(Invalid), "duplicate grid cell blocked on write");

    FPrototypeSnapshot Untouched;
    Untouched.AnimalId = 55;
    std::istringstream Bad("WB_GREENVEIL 99\n");
    Check(!ReadPrototypeSnapshot(Bad, Untouched), "bad read fails");
    Check(Untouched.AnimalId == 55, "bad read doesn't corrupt existing state");

    std::cout << "Passed " << Checks
              << " native prototype snapshot checks.\n";
    return 0;
}
