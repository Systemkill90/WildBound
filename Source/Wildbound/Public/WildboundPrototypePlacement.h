#pragma once

// Portable policy for the temporary Greenveil 1m snapped-block playground.
// It is not a voxel engine or a terrain/collision solver.
#include "WildboundPrototypePersistence.h"
#include <cmath>
#include <vector>

namespace WildboundSim
{
constexpr float PrototypeGridCentimeters = 100.0f;
constexpr float PrototypePlaceRangeCm = 450.0f;
constexpr float PrototypePlaceMinRangeCm = 120.0f;

enum class EPlacementReject
{
    None,
    InvalidCoordinates,
    OutOfRange,
    TooClose,
    OutsideArena,
    TooManyBlocks,
    Occupied
};

struct FPlacementResult
{
    EPlacementReject Rejection = EPlacementReject::InvalidCoordinates;
    FGridCell Cell;

    bool Allowed() const { return Rejection == EPlacementReject::None; }
};

inline FPlacementResult EvaluatePrototypePlacement(
    double PlayerX, double PlayerY,
    double RequestedX, double RequestedY,
    const std::vector<FGridCell>& ExistingCells)
{
    FPlacementResult Result;

    if (!std::isfinite(PlayerX) || !std::isfinite(PlayerY) ||
        !std::isfinite(RequestedX) || !std::isfinite(RequestedY) ||
        std::abs(RequestedX) > 200000.0 || std::abs(RequestedY) > 200000.0)
    {
        Result.Rejection = EPlacementReject::InvalidCoordinates;
        return Result;
    }

    const double RawDistanceSquared =
        (RequestedX - PlayerX) * (RequestedX - PlayerX) +
        (RequestedY - PlayerY) * (RequestedY - PlayerY);

    if (RawDistanceSquared > PrototypePlaceRangeCm * PrototypePlaceRangeCm)
    {
        Result.Rejection = EPlacementReject::OutOfRange;
        return Result;
    }

    Result.Cell = {static_cast<int>(std::round(RequestedX / PrototypeGridCentimeters)),
                   static_cast<int>(std::round(RequestedY / PrototypeGridCentimeters))};

    if (Result.Cell.X < -14 || Result.Cell.X > 14 ||
        Result.Cell.Y < -14 || Result.Cell.Y > 14)
    {
        Result.Rejection = EPlacementReject::OutsideArena;
        return Result;
    }

    const double SnapX = Result.Cell.X * PrototypeGridCentimeters;
    const double SnapY = Result.Cell.Y * PrototypeGridCentimeters;
    const double SnapDistanceSquared =
        (SnapX - PlayerX) * (SnapX - PlayerX) +
        (SnapY - PlayerY) * (SnapY - PlayerY);

    if (SnapDistanceSquared < PrototypePlaceMinRangeCm * PrototypePlaceMinRangeCm)
    {
        Result.Rejection = EPlacementReject::TooClose;
        return Result;
    }
    if (SnapDistanceSquared > PrototypePlaceRangeCm * PrototypePlaceRangeCm)
    {
        Result.Rejection = EPlacementReject::OutOfRange;
        return Result;
    }

    if (ExistingCells.size() >= MaxPrototypeBlocks)
    {
        Result.Rejection = EPlacementReject::TooManyBlocks;
        return Result;
    }

    for (const FGridCell& Cell : ExistingCells)
    {
        if (Cell.X == Result.Cell.X && Cell.Y == Result.Cell.Y)
        {
            Result.Rejection = EPlacementReject::Occupied;
            return Result;
        }
    }

    Result.Rejection = EPlacementReject::None;
    return Result;
}
} // namespace WildboundSim
