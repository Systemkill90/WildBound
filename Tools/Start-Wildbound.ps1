# Wildbound local Unreal Editor build-and-launch helper.
# This script runs ONLY on the development PC; a GitHub commit does not run it.
# No purchases, installs, credentials, or global configuration changes occur.
[CmdletBinding()]
param(
    [string]$EngineRoot = "",
    [string]$Map = "/Game/Maps/GreenveilExplorationPolish_WP",
    [ValidateRange(1, 32)][int]$MaxParallelActions = 2,
    [switch]$BuildOnly,
    [switch]$ShowEngines,
    [switch]$AutoMovementTest
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$SystemDriveRoot = [IO.Path]::GetPathRoot(($env:SystemDrive + "\"))
if ([IO.Path]::GetPathRoot($RepoRoot) -ieq $SystemDriveRoot) { throw "Wildbound must be checked out on a non-system volume before starting." }
$WildboundDataRoot = Split-Path $RepoRoot -Parent
$BuildScratch = Join-Path $RepoRoot "Saved\BuildScratch"
New-Item -ItemType Directory -Path $BuildScratch -Force | Out-Null
# Keep this project's Unreal editor/build scratch beside the non-system checkout.
$env:TEMP = $BuildScratch
$env:TMP = $BuildScratch
$DdcPath = Join-Path $WildboundDataRoot "EngineDDC\Local"
New-Item -ItemType Directory -Path $DdcPath -Force | Out-Null
Set-Item -Path 'Env:UE-LocalDataCachePath' -Value $DdcPath
$Project = Join-Path $RepoRoot "Wildbound.uproject"
$LogDir = Join-Path $RepoRoot "Saved\WildboundBootstrap"
New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BuildLog = Join-Path $LogDir ("editor-build-" + $Stamp + ".log")
$SummaryFile = Join-Path $LogDir ("bootstrap-" + $Stamp + ".txt")

function Write-Note([string]$Message) {
    Write-Host ("[Wildbound] " + $Message)
    Add-Content -Path $SummaryFile -Value $Message
}

function Test-Engine([string]$Root) {
    if ([string]::IsNullOrWhiteSpace($Root)) { return $false }
    return (Test-Path (Join-Path $Root "Engine\Build\BatchFiles\Build.bat") -PathType Leaf) -and
           (Test-Path (Join-Path $Root "Engine\Binaries\Win64\UnrealEditor.exe") -PathType Leaf)
}

function Get-Engines {
    $Candidates = New-Object 'System.Collections.Generic.List[string]'
    if ($EngineRoot) { $Candidates.Add($EngineRoot) }
    if ($env:UE_ENGINE_ROOT) { $Candidates.Add($env:UE_ENGINE_ROOT) }

    # The WildBound workshop keeps its engine beside the Source checkout on D:.
    $WorkshopEngineFolder = Join-Path (Split-Path $RepoRoot -Parent) "Engine"
    if (Test-Path $WorkshopEngineFolder) {
        Get-ChildItem -Path $WorkshopEngineFolder -Directory -Filter "UE_5.*" -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending |
            ForEach-Object { $Candidates.Add($_.FullName) }
    }

    $EpicFolder = Join-Path $env:ProgramFiles "Epic Games"
    if (Test-Path $EpicFolder) {
        Get-ChildItem -Path $EpicFolder -Directory -Filter "UE_5.*" -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending |
            ForEach-Object { $Candidates.Add($_.FullName) }
    }

    $Seen = @{}
    foreach ($Candidate in $Candidates) {
        $Resolved = [System.IO.Path]::GetFullPath($Candidate.Trim('"'))
        if (-not $Seen.ContainsKey($Resolved)) {
            $Seen[$Resolved] = $true
            if (Test-Engine $Resolved) { Write-Output $Resolved }
        }
    }
}

if (-not (Test-Path $Project -PathType Leaf)) {
    throw "Missing Wildbound.uproject in $RepoRoot. Clone the WildBound repository first."
}
if ($PSVersionTable.PSVersion.Major -ge 6 -and -not $IsWindows) {
    throw "This helper requires Windows. On Linux/macOS use the documented Unreal build process."
}
$Candidates = @(Get-Engines)
if ($ShowEngines) {
    if ($Candidates.Count -eq 0) { Write-Note "No supported Unreal Editor installation found." }
    else { $Candidates | ForEach-Object { Write-Note ("Found UE installation: " + $_) } }
    exit 0
}
if ($EngineRoot -and -not (Test-Engine $EngineRoot)) {
    throw "-EngineRoot is not a valid installed Unreal Engine root: $EngineRoot"
}
if ($Candidates.Count -eq 0) {
    Write-Note "BLOCKED: No Unreal Editor installation found."
    Write-Note "Install UE5 through Epic Games Launcher and a supported Visual Studio C++ toolchain."
    Write-Note "Or rerun with -EngineRoot <installed Unreal Engine root>."
    exit 2
}
$SelectedEngine = $Candidates[0]
$Batch = Join-Path $SelectedEngine "Engine\Build\BatchFiles\Build.bat"
$Editor = Join-Path $SelectedEngine "Engine\Binaries\Win64\UnrealEditor.exe"
if (-not (Test-Path -LiteralPath $Batch -PathType Leaf) -or
    -not (Test-Path -LiteralPath $Editor -PathType Leaf)) {
    throw "The selected Unreal Engine installation is incomplete: $SelectedEngine"
}
if (-not $BuildOnly) {
    if ($Map -notmatch '^/(Game|Engine)/') {
        throw "-Map must be an Unreal package path under /Game or /Engine, such as /Game/Maps/GreenveilExplorationPolish."
    }
    if ($Map.StartsWith("/Game/")) {
        $MapPackage = ($Map -split '\?', 2)[0]
        $MapRelativePath = ($MapPackage.Substring(6).Replace('/', '\') + ".umap")
        $MapAsset = Join-Path (Join-Path $RepoRoot "Content") $MapRelativePath
        if (-not (Test-Path -LiteralPath $MapAsset -PathType Leaf)) {
            throw "The requested /Game map is not present in Content: $MapAsset"
        }
    }
}
. (Join-Path $PSScriptRoot "WildboundBuildResources.ps1")
$BuildPlan = Get-WildboundBuildResourcePlan -RequestedMaxParallelActions $MaxParallelActions
Write-Note ("Project: " + $Project)
Write-Note ("Engine candidate: " + $SelectedEngine)
Write-Note ("Windows free commit: {0:N1} GiB; UnrealBuildTool parallel actions: {1}" -f $BuildPlan.FreeCommitGiB, $BuildPlan.MaxParallelActions)
Write-Note "The project has not yet pinned an approved minor UE version. This is an initial compile attempt."
Write-Note ("Build log: " + $BuildLog)

# Don't swallow UBT's exit code. A successfully spawned process is not a verified game launch.
$PreviousPreference = $ErrorActionPreference
try {
    $ErrorActionPreference = "Continue"
    & $Batch "WildboundEditor" "Win64" "Development" "-Project=$Project" "-MaxParallelActions=$($BuildPlan.MaxParallelActions)" "-WaitMutex" "-NoHotReload" *>&1 |
        Out-File -FilePath $BuildLog -Encoding utf8
    $BuildExitCode = $LASTEXITCODE
}
finally {
    $ErrorActionPreference = $PreviousPreference
}
if ($BuildExitCode -ne 0) {
    Write-Note ("FAILED: UnrealBuildTool exited " + $BuildExitCode)
    Write-Note ("Open full log: " + $BuildLog)
    Write-Host "Last 45 build log lines:" -ForegroundColor Yellow
    Get-Content -Path $BuildLog -Tail 45 | Write-Host
    exit $BuildExitCode
}
Write-Note "Editor target build command returned exit code 0."
if ($BuildOnly) {
    Write-Note "BuildOnly requested; editor not started."
    exit 0
}

# Start the requested map only after its path and local /Game asset have been preflighted.
$MapArgument = $Map
$TestArgument = if ($AutoMovementTest) { " -WildboundAutoMovementTest" } else { "" }
    $Args = ('"' + $Project + '" ' + $MapArgument + ' -game -log -windowed -ResX=1920 -ResY=1080 -fps=60 -ExecCmds="r.EyeAdaptationQuality 0,r.ScreenPercentage 100,r.DynamicRes.OperationMode 0,DisableAllScreenMessages"' + $TestArgument)
try {
    $Process = Start-Process -FilePath $Editor -ArgumentList $Args -WorkingDirectory $RepoRoot -PassThru
    Start-Sleep -Seconds 3
    if ($Process.HasExited) {
        Write-Note ("FAILED: UnrealEditor exited shortly after launch with code " + $Process.ExitCode)
        exit 3
    }
    Write-Note ("LAUNCHED PROCESS: UnrealEditor PID " + $Process.Id)
    Write-Note ("CHECK ON PC: Confirm the Greenveil forest loads and accepts inputs. Map: " + $MapArgument)
    Write-Note "A running process alone does not mean the game passed its playtest."
    exit 0
}
catch {
    Write-Note ("FAILED: Unable to start UnrealEditor: " + $_.Exception.Message)
    exit 4
}
