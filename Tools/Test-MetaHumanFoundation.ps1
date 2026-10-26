[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$EngineRoot,

    [Parameter(Mandatory)]
    [string]$ProjectFile
)

$ErrorActionPreference = 'Stop'
$engine = (Resolve-Path -LiteralPath $EngineRoot).Path
$project = (Resolve-Path -LiteralPath $ProjectFile).Path
$plugin = Join-Path $engine 'Engine\Plugins\MetaHuman\MetaHumanCharacter\MetaHumanCharacter.uplugin'
$content = Join-Path $engine 'Engine\Plugins\MetaHuman\MetaHumanCharacter\Content'
$editor = Join-Path $engine 'Engine\Binaries\Win64\UnrealEditor-Cmd.exe'

if (-not (Test-Path -LiteralPath $plugin -PathType Leaf)) { throw 'MetaHuman Creator plugin is unavailable in this engine installation.' }
if (-not (Test-Path -LiteralPath $editor -PathType Leaf)) { throw 'Unreal Editor commandlet is unavailable.' }

$descriptor = Get-Content -LiteralPath $project -Raw | ConvertFrom-Json
$enabled = @($descriptor.Plugins | Where-Object { $_.Name -eq 'MetaHumanCharacter' -and $_.Enabled }).Count -eq 1
$contentFiles = if (Test-Path -LiteralPath $content) { @(Get-ChildItem -LiteralPath $content -File -Recurse) } else { @() }
$memory = Get-CimInstance Win32_ComputerSystem
$gpu = @(Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion)

[pscustomobject]@{
    schemaVersion = 1
    readyForEditorValidation = $enabled -and $contentFiles.Count -gt 0
    pluginEnabled = $enabled
    pluginVersion = (Get-Content -LiteralPath $plugin -Raw | ConvertFrom-Json).VersionName
    bundledContentFiles = $contentFiles.Count
    bundledContentBytes = ($contentFiles | Measure-Object Length -Sum).Sum
    unrealCommandletAvailable = $true
    physicalMemoryBytes = [int64]$memory.TotalPhysicalMemory
    logicalProcessors = [int]$memory.NumberOfLogicalProcessors
    videoControllers = $gpu
    limitations = @(
        'This read-only check does not prove that Epic cloud auto-rigging or texture synthesis is reachable.'
        'This read-only check does not create, assemble, render, or visually approve a MetaHuman.'
        'Custom Female Homesteader clothing, hair, materials, and owner review remain required.'
    )
} | ConvertTo-Json -Depth 5
