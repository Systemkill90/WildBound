$ErrorActionPreference = 'Stop'

$script:MockFreeCommitGiB = 0.0
function Get-CimInstance {
    param([string]$ClassName, [string]$ErrorAction)
    if ($ClassName -ne 'Win32_OperatingSystem') {
        throw "Unexpected CIM class: $ClassName"
    }
    [pscustomobject]@{ FreeVirtualMemory = $script:MockFreeCommitGiB * 1MB }
}

. (Join-Path $PSScriptRoot '..\..\Tools\WildboundBuildResources.ps1')

function Assert-Equal($Actual, $Expected, [string]$Description) {
    if ($Actual -ne $Expected) {
        throw "$Description; expected '$Expected', got '$Actual'."
    }
}

$script:MockFreeCommitGiB = 6.5
$Plan = Get-WildboundBuildResourcePlan -RequestedMaxParallelActions 2
Assert-Equal $Plan.MaxParallelActions 1 'A single action fits at the minimum safe headroom'
Assert-Equal $Plan.OperatingReserveGiB 2.0 'The plan retains a measured 2 GiB Windows reserve'
Assert-Equal $Plan.CommitPerActionGiB 4.5 'The plan budgets measured compile pressure per action'

$script:MockFreeCommitGiB = 15.0
$Plan = Get-WildboundBuildResourcePlan -RequestedMaxParallelActions 2
Assert-Equal $Plan.MaxParallelActions 2 'Two actions fit when enough commit is available'

$script:MockFreeCommitGiB = 6.4
$Blocked = $false
try {
    Get-WildboundBuildResourcePlan | Out-Null
} catch {
    $Blocked = $true
}
Assert-Equal $Blocked $true 'Build is blocked only below the one-action plus Windows reserve floor'

$script:MockFreeCommitGiB = 6.5
$Blocked = $false
try {
    Get-WildboundBuildResourcePlan -MinimumFreeCommitGiB 6.5 | Out-Null
} catch {
    $Blocked = $true
}
Assert-Equal $Blocked $false 'Bounded map generation and packaging use the same threshold as compilation'

foreach ($RelativePath in @(
    '..\..\Tools\Build-GreenveilExploration.ps1',
    '..\..\Tools\Start-Wildbound.ps1'
)) {
    $Path = Join-Path $PSScriptRoot $RelativePath
    $Tokens = $null
    $Errors = $null
    [System.Management.Automation.Language.Parser]::ParseFile(
        $Path, [ref]$Tokens, [ref]$Errors) | Out-Null
    if ($Errors.Count -gt 0) {
        throw "PowerShell syntax error in ${Path}: $($Errors[0].Message)"
    }
    $Text = Get-Content -LiteralPath $Path -Raw
    if ($Text -notmatch 'WildboundBuildResources\.ps1' -or
        $Text -notmatch 'MaxParallelActions') {
        throw "Build entry point does not apply the resource plan: $Path"
    }
}

$BuildEntrypoint = Join-Path $PSScriptRoot '..\..\Tools\Build-GreenveilExploration.ps1'
$BuildText = Get-Content -LiteralPath $BuildEntrypoint -Raw
if ($BuildText -notmatch '\$env:UE_ENGINE_ROOT' -or $BuildText -notmatch "UE_5\.\*") {
    throw 'The build entry point must recognize the launcher engine variable and discover the workshop/Epic UE installation.'
}
if ($BuildText -notmatch '\$InitialMinimumFreeCommitGiB\s*=\s*6\.5' -or
    $BuildText -match 'MinimumFreeCommitGiB\s+16\.0') {
    throw 'The build entry point must use the measured one-action floor for bounded map generation and packaging.'
}
$ResourcePreflightIndex = $BuildText.IndexOf('$BuildPlan = Get-WildboundBuildResourcePlan', [System.StringComparison]::Ordinal)
$CompileIndex = $BuildText.IndexOf('& $BuildBatch', [System.StringComparison]::Ordinal)
if ($ResourcePreflightIndex -lt 0 -or $CompileIndex -lt $ResourcePreflightIndex) {
    throw 'The resource preflight must run before the Unreal compile command.'
}
$PreflightOnlyIndex = $BuildText.IndexOf('if ($PreflightOnly)', [System.StringComparison]::Ordinal)
if ($BuildText -notmatch '\[switch\]\$PreflightOnly' -or
    $PreflightOnlyIndex -lt $ResourcePreflightIndex -or
    $CompileIndex -lt $PreflightOnlyIndex) {
    throw 'The build entry point must expose a preflight-only mode that exits before UnrealBuildTool.'
}

Write-Output 'Passed adaptive build-resource checks and build-helper syntax validation.'
