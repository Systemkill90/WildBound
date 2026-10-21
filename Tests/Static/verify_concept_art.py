#!/usr/bin/env python3
"""Validate staged SVG concept studies. This is NOT a visual/art-direction review."""
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
GALLERY = ROOT / "docs" / "art" / "concepts"
REQUIRED = [
    "greenveil-witchwood.svg",
    "drowned-march-lanthfen.svg",
    "fantasy-creature-silhouettes.svg",
    "fantasy-village-silhouettes.svg",
]
problems = []
for name in REQUIRED:
    path = GALLERY / name
    if not path.is_file():
        problems.append(f"Missing art study: {name}")
        continue
    try:
        doc = ET.parse(path)
    except ET.ParseError as exc:
        problems.append(f"{name}: malformed XML: {exc}")
        continue
    root = doc.getroot()
    if root.tag != "{http://www.w3.org/2000/svg}svg":
        problems.append(f"{name}: root element is not SVG")
    if root.attrib.get("viewBox") != "0 0 1600 900":
        problems.append(f"{name}: invalid expected artboard")
    if not root.attrib.get("aria-label", "").strip():
        problems.append(f"{name}: missing descriptive label")
    for node in root.iter():
        if node.tag.rsplit("}", 1)[-1] in {"script", "foreignObject", "image"}:
            problems.append(f"{name}: embedded script / external image not permitted")
        for key, value in node.attrib.items():
            if key.endswith("href") and not value.startswith("#"):
                problems.append(f"{name}: external href blocked: {value[:40]}")

index = (GALLERY / "README.md").read_text(encoding="utf-8")
for name in REQUIRED:
    if name not in index:
        problems.append(f"Concept gallery does not link {name}")

if problems:
    print("\n".join(problems), file=sys.stderr)
    sys.exit(1)
print(f"Validated {len(REQUIRED)} original SVG studies and gallery links; no Unreal or gameplay tests.")
