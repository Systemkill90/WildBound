#include "WildboundPrototypePlacement.h"
#include <cstdlib>
#include <iostream>
#include <limits>
#include <vector>

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

    const std::vector<FGridCell> Empty;
    auto Good = EvaluatePrototypePlacement(0, 0, 249, 0, Empty);
    Check(Good.Allowed(), "valid in-range cell accepted");
    Check(Good.Cell.X == 2 && Good.Cell.Y == 0, "snaps to 1m cell");

    Good = EvaluatePrototypePlacement(-500, 0, -749, 0, Empty);
    Check(Good.Allowed(), "negative coordinate accepted");
    Check(Good.Cell.X == -7, "negative coordinate rounds correctly");

    Check(EvaluatePrototypePlacement(0, 0, 20, 0, Empty).Rejection ==
        EPlacementReject::TooClose, "can't place inside own character");
    Check(EvaluatePrototypePlacement(0, 0, 451, 0, Empty).Rejection ==
        EPlacementReject::OutOfRange, "can't place too far");
    Check(EvaluatePrototypePlacement(1400, 0, 1650, 0, Empty).Rejection ==
        EPlacementReject::OutsideArena, "bounded test arena");
    Check(EvaluatePrototypePlacement(0, 0, 250, 0, {{3, 0}}).Rejection ==
        EPlacementReject::Occupied, "occupied cell rejected");
    Check(EvaluatePrototypePlacement(0, 0, std::numeric_limits<double>::infinity(),
        0, Empty).Rejection == EPlacementReject::InvalidCoordinates,
        "reject infinite coordinate");
    Check(EvaluatePrototypePlacement(0, 0, std::numeric_limits<double>::quiet_NaN(),
        0, Empty).Rejection == EPlacementReject::InvalidCoordinates,
        "reject NaN coordinate");
    Check(EvaluatePrototypePlacement(0, 0, 200001, 0, Empty).Rejection ==
        EPlacementReject::InvalidCoordinates, "reject absurd requested value");
    Check(EvaluatePrototypePlacement(0, 0, 250, 0,
        std::vector<FGridCell>(MaxPrototypeBlocks, FGridCell{-14, -14})).Rejection ==
        EPlacementReject::TooManyBlocks, "reject full shared block allowance");

    Check(EvaluatePrototypePlacement(0, 0, 249, 0, {{2, 0}}).Rejection ==
        EPlacementReject::Occupied, "snapped duplicate rejected");

    std::cout << "Passed " << Checks << " native placement checks.\n";
    return 0;
}
