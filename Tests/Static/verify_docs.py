#!/usr/bin/env python3
"""Check internal links in Wildbound Markdown documentation.

This checks repository paths, not external URLs, GitHub issue states,
rendering quality, Unreal compatibility, licensing, or gameplay claims.
"""
from pathlib import Path
from urllib.parse import unquote
import posixpath
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
SOURCES = [
    ROOT / "README.md",
    ROOT / "ROADMAP.md",
    ROOT / "CONTRIBUTING.md",
    *sorted((ROOT / "docs").rglob("*.md")),
]
# Markdown destinations + HTML hrefs used in the GitHub homepage.
MD_LINK = re.compile(r"!?(?:\[[^\]]*\])\(([^\n)]+)\)")
HTML_LINK = re.compile(r'href=["\']([^"\']+)["\']')
PROTOCOL = re.compile(r"^[A-Za-z][A-Za-z0-9+.-]*:")
failures = []
checked = 0

for source in SOURCES:
    if not source.exists():
        failures.append(f"Missing documentation source: {source.relative_to(ROOT)}")
        continue
    data = source.read_text(encoding="utf-8")
    # Do not interpret fenced code examples as navigational links.
    data = re.sub(r"(?ms)^\s*```.*?^\s*```\s*$", "", data)
    for link in [*MD_LINK.findall(data), *HTML_LINK.findall(data)]:
        # Optional Markdown title, e.g. (path.md "description").
        destination = link.split(' "', 1)[0].strip().strip("<>")
        if not destination or destination.startswith("#") or PROTOCOL.match(destination) or destination.startswith("//"):
            continue
        path = unquote(destination.split("#", 1)[0].split("?", 1)[0])
        if not path:
            continue
        checked += 1
        if path.startswith("/"):
            failures.append(f"{source.relative_to(ROOT)} -> {destination}: root-absolute link")
            continue
        base = source.parent.relative_to(ROOT).as_posix()
        resolved = posixpath.normpath(posixpath.join(base, path))
        candidate = ROOT / resolved
        if resolved.startswith("../") or not candidate.exists():
            failures.append(f"{source.relative_to(ROOT)} -> {destination} (resolved {resolved})")

if failures:
    print("Broken / invalid internal documentation links:")
    for error in failures:
        print(" - " + error)
    sys.exit(1)
print(f"Checked {checked} internal links across {len(SOURCES)} documents (no Unreal tests).")
