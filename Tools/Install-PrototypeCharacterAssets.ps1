# Copies Unreal's bundled high-detail third-person mannequin content locally.
# Epic's engine files remain the source of truth; this keeps content out of Git.
[CmdletBinding()]
param(
    [string]$EngineRoot = "<local-project-root>\Engine\UE_5.8"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Source = Join-Path $EngineRoot "Templates\TemplateResources\High\Characters\Content\Mannequins"
$Destination = Join-Path $RepoRoot "Content\Characters\Mannequins"

if (-not (Test-Path (Join-Path $Source "Meshes\SKM_Quinn_Simple.uasset") -PathType Leaf)) {
    throw "Unreal's high-detail mannequin assets were not found at $Source"
}

New-Item -ItemType Directory -Path $Destination -Force | Out-Null
Copy-Item -Path (Join-Path $Source "*") -Destination $Destination -Recurse -Force

$Mesh = Join-Path $Destination "Meshes\SKM_Quinn_Simple.uasset"
$AnimBlueprint = Join-Path $Destination "Anims\Unarmed\ABP_Unarmed.uasset"
if (-not (Test-Path $Mesh -PathType Leaf) -or -not (Test-Path $AnimBlueprint -PathType Leaf)) {
    throw "Character asset copy is incomplete. Expected the Quinn mesh and Unarmed animation blueprint."
}

Write-Host "Installed Unreal's bundled Quinn mannequin and locomotion assets to $Destination"
Write-Host "The copied engine content is local and remains excluded from Git."
