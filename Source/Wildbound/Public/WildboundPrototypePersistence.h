#pragma once

// Portable, versioned text snapshot experiment for the Greenveil playground.
// This does not write disk files or attach to Unreal's SaveGame system yet.
#include "WildboundAnimalSimulation.h"
#include <algorithm>
#include <charconv>
#include <cstdint>
#include <iomanip>
#include <ios>
#include <istream>
#include <locale>
#include <ostream>
#include <set>
#include <sstream>
#include <string>
#include <system_error>
#include <utility>
#include <vector>

namespace WildboundSim
{
constexpr std::uint32_t PrototypeSnapshotVersion = 1;
constexpr std::size_t MaxPrototypeBlocks = 128;

struct FGridCell
{
    int X = 0;
    int Y = 0;
};

struct FPrototypeSnapshot
{
    std::uint64_t AnimalId = 1;
    FAnimalVitals Animal;
    std::vector<FGridCell> Blocks;
};

inline bool IsValidPrototypeSnapshot(const FPrototypeSnapshot& State)
{
    if (State.AnimalId == 0 || State.Blocks.size() > MaxPrototypeBlocks)
    {
        return false;
    }

    const float Numbers[] = {State.Animal.Hunger, State.Animal.Thirst,
        State.Animal.Condition, State.Animal.Stress, State.Animal.Trust};

    for (const float Value : Numbers)
    {
        if (!std::isfinite(Value) || Value < 0.0f || Value > 100.0f)
        {
            return false;
        }
    }

    std::set<std::pair<int, int>> Occupied;
    for (const FGridCell& Cell : State.Blocks)
    {
        // Temporary test arena is approximately +/- 15m, 1m grid spacing.
        if (Cell.X < -14 || Cell.X > 14 || Cell.Y < -14 || Cell.Y > 14 ||
            !Occupied.insert({Cell.X, Cell.Y}).second)
        {
            return false;
        }
    }
    return true;
}

inline bool WritePrototypeSnapshot(std::ostream& Output,
                                   const FPrototypeSnapshot& State)
{
    if (!IsValidPrototypeSnapshot(State))
    {
        return false;
    }

    std::ostringstream Buffer;
    Buffer.imbue(std::locale::classic());
    Buffer << std::setprecision(9)
           << "WB_GREENVEIL " << PrototypeSnapshotVersion << '\n'
           << State.AnimalId << '\n'
           << State.Animal.Hunger << ' '
           << State.Animal.Thirst << ' '
           << State.Animal.Condition << ' '
           << State.Animal.Stress << ' '
           << State.Animal.Trust << '\n'
           << State.Blocks.size() << '\n';

    for (const FGridCell& Cell : State.Blocks)
    {
        Buffer << Cell.X << ' ' << Cell.Y << '\n';
    }

    Output << Buffer.str();
    return static_cast<bool>(Output);
}

// Rejects malformed versions, duplicate positions, unrealistic values, and
// trailing content without modifying Out on failure.
inline bool ReadPrototypeSnapshot(std::istream& Input, FPrototypeSnapshot& Out)
{
    std::string Signature;
    std::uint32_t Version = 0;
    std::string IdString;
    FPrototypeSnapshot Parsed;
    std::size_t BlockCount = 0;

    // Use the classic C locale for decimal points and stable values.
    Input.imbue(std::locale::classic());

    if (!(Input >> Signature >> Version) ||
        Signature != "WB_GREENVEIL" || Version != PrototypeSnapshotVersion ||
        !(Input >> IdString) || IdString.empty() ||
        !std::all_of(IdString.begin(), IdString.end(),
            [](unsigned char C) { return C >= '0' && C <= '9'; }))
    {
        return false;
    }

    // Unreal targets often disable C++ exceptions. from_chars rejects malformed
    // or overflowing identifiers without throwing, including on dedicated servers.
    const auto ParsedId = std::from_chars(IdString.data(),
        IdString.data() + IdString.size(), Parsed.AnimalId, 10);
    if (ParsedId.ec != std::errc() ||
        ParsedId.ptr != IdString.data() + IdString.size())
    {
        return false;
    }

    if (!(Input >> Parsed.Animal.Hunger
                >> Parsed.Animal.Thirst
                >> Parsed.Animal.Condition
                >> Parsed.Animal.Stress
                >> Parsed.Animal.Trust
                >> BlockCount) ||
        BlockCount > MaxPrototypeBlocks)
    {
        return false;
    }

    Parsed.Blocks.reserve(BlockCount);
    for (std::size_t Index = 0; Index < BlockCount; ++Index)
    {
        FGridCell Cell;
        if (!(Input >> Cell.X >> Cell.Y)) return false;
        Parsed.Blocks.push_back(Cell);
    }

    Input >> std::ws;
    if (Input.peek() != std::char_traits<char>::eof() ||
        !IsValidPrototypeSnapshot(Parsed))
    {
        return false;
    }

    Out = std::move(Parsed);
    return true;
}
} // namespace WildboundSim
