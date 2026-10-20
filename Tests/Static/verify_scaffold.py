#!/usr/bin/env python3
"""Dependency-free consistency checks. Does not compile or launch Unreal Engine."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "Source" / "Wildbound"
PUBLIC = SOURCE / "Public"
PRIVATE = SOURCE / "Private"
failures = []
checks = 0


def expect(condition, description):
    global checks
    checks += 1
    if not condition:
        failures.append(description)


expect((ROOT / "Wildbound.uproject").is_file(), "missing .uproject")
expect((SOURCE / "Wildbound.Build.cs").is_file(), "missing module rules")

for target in ("Wildbound.Target.cs", "WildboundEditor.Target.cs", "WildboundServer.Target.cs"):
    expect((ROOT / "Source" / target).is_file(), "missing " + target)

for name in ("WildboundPrototypeAnimal", "WildboundPrototypeBuildBlock",
             "WildboundPrototypeGround", "WildboundPrototypeCharacter",
             "WildboundPrototypePlayerController", "WildboundPrototypeGameMode",
             "WildboundPrototypeHUD", "WildboundAnimalNeedsComponent"):
    expect((PUBLIC / (name + ".h")).is_file(), "missing header " + name)
    expect((PRIVATE / (name + ".cpp")).is_file(), "missing source " + name)

# Verify the module-local includes refer to present, correctly named files.
for cpp in PRIVATE.glob("*.cpp"):
    text = cpp.read_text(encoding="utf-8")
    for name in re.findall(r'^#include "(Wildbound[^/"]+\.h)"', text, re.M):
        expect((PUBLIC / name).is_file() or (PRIVATE / name).is_file(),
               f"{cpp.name}: missing module-local include {name}")

# Unreal Header Tool requires *.generated.h to be the last header include.
for header in PUBLIC.glob("*.h"):
    body = header.read_text(encoding="utf-8")
    if "UCLASS(" in body or "USTRUCT(" in body:
        header_includes = re.findall(r'^#include "([^"]+)"', body, re.M)
        expect(bool(header_includes) and
               header_includes[-1] == header.stem + ".generated.h",
               f"{header.name}: generated header must be last")

input_text = (ROOT / "Config" / "DefaultInput.ini").read_text(encoding="utf-8")
for action in ("CareFeed", "CareWater", "CareReassure", "PlaceBlock", "RemoveBlock"):
    expect(f'ActionName="{action}"' in input_text, "missing input " + action)

mode = (ROOT / "Config" / "DefaultEngine.ini").read_text(encoding="utf-8")
expect("GlobalDefaultGameMode=/Script/Wildbound.WildboundPrototypeGameMode" in mode,
       "prototype game mode not selected")

tests = (ROOT / "Tests" / "Native" / "AnimalSimulationTests.cpp")
expect(tests.is_file(), "native tests missing")
expect((PUBLIC / "WildboundAnimalSimulation.h").is_file(),
       "portable simulation header missing")

if failures:
    print(f"FAILED ({len(failures)} of {checks} checks):", file=sys.stderr)
    for problem in failures:
        print(" - " + problem, file=sys.stderr)
    sys.exit(1)
print(f"Passed {checks} static project wiring checks (not UE compilation).")
