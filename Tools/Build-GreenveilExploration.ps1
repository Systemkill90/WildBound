[CmdletBinding()]
param(
    [string]$EngineRoot = $env:WILDBOUND_UNREAL_ENGINE_ROOT,
    [string]$Map = '/Game/Maps/GreenveilExplorationPolish',
    [string]$ArchiveDirectory = '',
    [switch]$GenerateMap,
    [switch]$Package
)
$ErrorActionPreference = 'Stop'
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if (-not $EngineRoot) { throw 'Set WILDBOUND_UNREAL_ENGINE_ROOT or pass -EngineRoot with the installed UE 5.8 root.' }
$Project = Join-Path $RepoRoot 'Wildbound.uproject'
$Evidence = Join-Path $RepoRoot 'Saved\GreenveilBuild'
New-Item -ItemType Directory $Evidence -Force | Out-Null
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
& "$EngineRoot\Engine\Build\BatchFiles\Build.bat" WildboundEditor Win64 Development "-Project=$Project" -WaitMutex -NoHotReload *> "$Evidence\Editor-$Stamp.log"
if ($LASTEXITCODE -ne 0) { throw 'Editor compilation failed; see Saved/GreenveilBuild.' }
if ($GenerateMap) {
    & "$EngineRoot\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" $Project -run=pythonscript "-script=$RepoRoot\Scripts\Editor\CreateGreenveilExploration.py" -unattended -nosplash -NoSound -nullrhi "-abslog=$Evidence\Generate-$Stamp.log" *> "$Evidence\Generate-console-$Stamp.log"
    if ($LASTEXITCODE -ne 0) { throw 'Map generation failed; previous packages remain intact.' }
}
if ($Package) {
    if (-not $ArchiveDirectory) { throw 'Pass -ArchiveDirectory to a local output folder outside the repository.' }
    if (Test-Path -LiteralPath $ArchiveDirectory) { throw 'Choose a NEW archive directory to protect existing packages.' }
    & "$EngineRoot\Engine\Build\BatchFiles\RunUAT.bat" BuildCookRun "-project=$Project" -noP4 -platform=Win64 -clientconfig=Development -build -cook "-map=$Map" -stage -pak -iostore -compressed -archive "-archivedirectory=$ArchiveDirectory" -nodebuginfo -utf8output *> "$Evidence\Package-$Stamp.log"
    if ($LASTEXITCODE -ne 0) { throw 'Packaging failed; see Saved/GreenveilBuild.' }
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'Launch-PackagedGreenveil.cmd') -Destination (Join-Path $ArchiveDirectory 'Launch-Greenveil.cmd')
    Write-Output "Package: $ArchiveDirectory\Windows\Wildbound.exe"
}
