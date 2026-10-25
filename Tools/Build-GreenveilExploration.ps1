[CmdletBinding()]
param(
    [string]$EngineRoot = $env:WILDBOUND_UNREAL_ENGINE_ROOT,
    [string]$Map = '/Game/Maps/GreenveilExplorationPolish_WP',
    [string]$ArchiveDirectory = '',
    [ValidateRange(1, 32)][int]$MaxParallelActions = 2,
    [switch]$GenerateMap,
    [switch]$Package,
    [switch]$PreflightOnly
)
$ErrorActionPreference = 'Stop'
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$SystemDriveRoot = [IO.Path]::GetPathRoot(($env:SystemDrive + '\'))
if ([IO.Path]::GetPathRoot($RepoRoot) -ieq $SystemDriveRoot) { throw 'Wildbound must be checked out on a non-system volume before building.' }
$WildboundDataRoot = Split-Path $RepoRoot -Parent
$BuildScratch = Join-Path $RepoRoot 'Saved\BuildScratch'
New-Item -ItemType Directory -Path $BuildScratch -Force | Out-Null
# Keep this Wildbound build's transient data beside its generated outputs.
$env:TEMP = $BuildScratch
$env:TMP = $BuildScratch
$DdcPath = Join-Path $WildboundDataRoot 'EngineDDC\Local'
New-Item -ItemType Directory -Path $DdcPath -Force | Out-Null
Set-Item -Path 'Env:UE-LocalDataCachePath' -Value $DdcPath
if (-not $EngineRoot) { $EngineRoot = $env:UE_ENGINE_ROOT }
if (-not $EngineRoot) {
    $EngineCandidates = @()
    $WorkshopEngineFolder = Join-Path (Split-Path $RepoRoot -Parent) 'Engine'
    if (Test-Path -LiteralPath $WorkshopEngineFolder -PathType Container) {
        $EngineCandidates += Get-ChildItem -LiteralPath $WorkshopEngineFolder -Directory -Filter 'UE_5.*' |
            Sort-Object Name -Descending | ForEach-Object { $_.FullName }
    }
    $EpicEngineFolder = Join-Path $env:ProgramFiles 'Epic Games'
    if (Test-Path -LiteralPath $EpicEngineFolder -PathType Container) {
        $EngineCandidates += Get-ChildItem -LiteralPath $EpicEngineFolder -Directory -Filter 'UE_5.*' |
            Sort-Object Name -Descending | ForEach-Object { $_.FullName }
    }
    foreach ($Candidate in $EngineCandidates) {
        if (Test-Path -LiteralPath (Join-Path $Candidate 'Engine\Build\BatchFiles\Build.bat') -PathType Leaf) {
            $EngineRoot = $Candidate
            break
        }
    }
}
if (-not $EngineRoot) { throw 'Unable to locate Unreal Engine 5. Set WILDBOUND_UNREAL_ENGINE_ROOT or UE_ENGINE_ROOT, or install UE under the workshop Engine or Epic Games folder.' }
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
$InitialMinimumFreeCommitGiB = 6.5
$BuildPlan = Get-WildboundBuildResourcePlan -RequestedMaxParallelActions $MaxParallelActions -MinimumFreeCommitGiB $InitialMinimumFreeCommitGiB
Write-Host ("Windows free commit: {0:N1} GiB; pipeline preflight: {1:N1} GiB; UnrealBuildTool parallel actions: {2}" -f $BuildPlan.FreeCommitGiB, $InitialMinimumFreeCommitGiB, $BuildPlan.MaxParallelActions)
if ($PreflightOnly) {
    Write-Host 'Preflight-only requested; UnrealBuildTool, map generation, and packaging were not started.'
    exit 0
}
& $BuildBatch WildboundEditor Win64 Development "-Project=$Project" "-MaxParallelActions=$($BuildPlan.MaxParallelActions)" -WaitMutex -NoHotReload *> "$Evidence\Editor-$Stamp.log"
if ($LASTEXITCODE -ne 0) { throw 'Editor compilation failed; see Saved/GreenveilBuild.' }
if ($GenerateMap) {
    # Greenveil generation is bounded and authored by our script. Reserve the
    # same one-action floor as an editor build; large sample-world rebuilds need
    # their own workload-specific preflight rather than blocking this small map.
    $GenerationPlan = Get-WildboundBuildResourcePlan -RequestedMaxParallelActions $MaxParallelActions -MinimumFreeCommitGiB 6.5
    Write-Host ("Map generation preflight: {0:N1} GiB free commit" -f $GenerationPlan.FreeCommitGiB)
    & $EditorCommandlet $Project -run=pythonscript "-script=$RepoRoot\Scripts\Editor\CreateGreenveilExploration.py" -unattended -nosplash -NoSound -nullrhi "-abslog=$Evidence\Generate-$Stamp.log" *> "$Evidence\Generate-console-$Stamp.log"
    if ($LASTEXITCODE -ne 0) { throw 'Map generation failed; previous packages remain intact.' }
    # Keep the authored source map as a recoverable, reproducible input, then
    # generate a separate World Partition map for launch and packaging.
    $WorldPartitionLog = Join-Path $Evidence "WorldPartition-$Stamp.log"
    $WorldPartitionConsoleLog = Join-Path $Evidence "WorldPartition-console-$Stamp.log"
    & $EditorCommandlet $Project -run=WorldPartitionConvertCommandlet '/Game/Maps/GreenveilExplorationPolish' -ConversionSuffix -AllowCommandletRendering -SCCProvider=None -unattended -nop4 -nosplash -NullRHI "-abslog=$WorldPartitionLog" *> $WorldPartitionConsoleLog
    if ($LASTEXITCODE -ne 0) { throw "World Partition conversion failed; the authored source map remains intact. See $WorldPartitionLog." }
    $WorldPartitionMap = Join-Path $RepoRoot 'Content\Maps\GreenveilExplorationPolish_WP.umap'
    if (-not (Test-Path -LiteralPath $WorldPartitionMap -PathType Leaf)) { throw "World Partition conversion exited successfully but did not produce $WorldPartitionMap." }
}
if ($Package) {
    $PackagePlan = Get-WildboundBuildResourcePlan -RequestedMaxParallelActions $MaxParallelActions -MinimumFreeCommitGiB 6.5
    Write-Host ("Package build preflight: {0:N1} GiB free commit; UBT parallel actions: {1}" -f $PackagePlan.FreeCommitGiB, $PackagePlan.MaxParallelActions)
    & $RunUAT BuildCookRun "-project=$Project" -noP4 -platform=Win64 -clientconfig=Development -build -cook "-map=$Map" -stage -pak -iostore -compressed -archive "-archivedirectory=$ArchiveDirectory" -ubtargs="-MaxParallelActions=$($PackagePlan.MaxParallelActions)" -nodebuginfo -utf8output *> "$Evidence\Package-$Stamp.log"
    if ($LASTEXITCODE -ne 0) { throw 'Packaging failed; see Saved/GreenveilBuild.' }
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'Launch-PackagedGreenveil.cmd') -Destination (Join-Path $ArchiveDirectory 'Launch-Greenveil.cmd')
    Write-Output "Package: $ArchiveDirectory\Windows\Wildbound.exe"
}
