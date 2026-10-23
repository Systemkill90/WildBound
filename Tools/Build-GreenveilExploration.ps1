[CmdletBinding()]
param(
    [string]$EngineRoot = $env:WILDBOUND_UNREAL_ENGINE_ROOT,
    [string]$Map = '/Game/Maps/GreenveilExplorationPolish',
    [string]$ArchiveDirectory = '',
    [ValidateRange(1, 32)][int]$MaxParallelActions = 2,
    [switch]$GenerateMap,
    [switch]$Package
)
$ErrorActionPreference = 'Stop'
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if (-not $EngineRoot) { throw 'Set WILDBOUND_UNREAL_ENGINE_ROOT or pass -EngineRoot with the installed UE 5.8 root.' }
$BuildBatch = Join-Path $EngineRoot 'Engine\Build\BatchFiles\Build.bat'
$EditorCommandlet = Join-Path $EngineRoot 'Engine\Binaries\Win64\UnrealEditor-Cmd.exe'
$RunUAT = Join-Path $EngineRoot 'Engine\Build\BatchFiles\RunUAT.bat'
if (-not (Test-Path -LiteralPath $BuildBatch -PathType Leaf)) { throw "Invalid Unreal Engine root: $EngineRoot" }
if ($GenerateMap -and -not (Test-Path -LiteralPath $EditorCommandlet -PathType Leaf)) { throw "UnrealEditor-Cmd is missing under: $EngineRoot" }
if ($Package) {
    if (-not $ArchiveDirectory) { throw 'Pass -ArchiveDirectory to a local output folder outside the repository.' }
    if (Test-Path -LiteralPath $ArchiveDirectory) { throw 'Choose a NEW archive directory to protect existing packages.' }
    if (-not (Test-Path -LiteralPath $RunUAT -PathType Leaf)) { throw "RunUAT is missing under: $EngineRoot" }
}
$Project = Join-Path $RepoRoot 'Wildbound.uproject'
$Evidence = Join-Path $RepoRoot 'Saved\GreenveilBuild'
New-Item -ItemType Directory $Evidence -Force | Out-Null
$ResourceHelper = Join-Path $PSScriptRoot 'WildboundBuildResources.ps1'
. $ResourceHelper
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$BuildPlan = Get-WildboundBuildResourcePlan -RequestedMaxParallelActions $MaxParallelActions
Write-Host ("Windows free commit: {0:N1} GiB; UnrealBuildTool parallel actions: {1}" -f $BuildPlan.FreeCommitGiB, $BuildPlan.MaxParallelActions)
& $BuildBatch WildboundEditor Win64 Development "-Project=$Project" "-MaxParallelActions=$($BuildPlan.MaxParallelActions)" -WaitMutex -NoHotReload *> "$Evidence\Editor-$Stamp.log"
if ($LASTEXITCODE -ne 0) { throw 'Editor compilation failed; see Saved/GreenveilBuild.' }
if ($GenerateMap) {
    $GenerationPlan = Get-WildboundBuildResourcePlan -RequestedMaxParallelActions $MaxParallelActions -MinimumFreeCommitGiB 16.0
    Write-Host ("Map generation preflight: {0:N1} GiB free commit" -f $GenerationPlan.FreeCommitGiB)
    & $EditorCommandlet $Project -run=pythonscript "-script=$RepoRoot\Scripts\Editor\CreateGreenveilExploration.py" -unattended -nosplash -NoSound -nullrhi "-abslog=$Evidence\Generate-$Stamp.log" *> "$Evidence\Generate-console-$Stamp.log"
    if ($LASTEXITCODE -ne 0) { throw 'Map generation failed; previous packages remain intact.' }
}
if ($Package) {
    $PackagePlan = Get-WildboundBuildResourcePlan -RequestedMaxParallelActions $MaxParallelActions -MinimumFreeCommitGiB 16.0
    Write-Host ("Package build preflight: {0:N1} GiB free commit; UBT parallel actions: {1}" -f $PackagePlan.FreeCommitGiB, $PackagePlan.MaxParallelActions)
    & $RunUAT BuildCookRun "-project=$Project" -noP4 -platform=Win64 -clientconfig=Development -build -cook "-map=$Map" -stage -pak -iostore -compressed -archive "-archivedirectory=$ArchiveDirectory" -ubtargs="-MaxParallelActions=$($PackagePlan.MaxParallelActions)" -nodebuginfo -utf8output *> "$Evidence\Package-$Stamp.log"
    if ($LASTEXITCODE -ne 0) { throw 'Packaging failed; see Saved/GreenveilBuild.' }
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'Launch-PackagedGreenveil.cmd') -Destination (Join-Path $ArchiveDirectory 'Launch-Greenveil.cmd')
    Write-Output "Package: $ArchiveDirectory\Windows\Wildbound.exe"
}
