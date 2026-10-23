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

$script:MockFreeCommitGiB = 10.5
$Plan = Get-WildboundBuildResourcePlan -RequestedMaxParallelActions 2
Assert-Equal $Plan.MaxParallelActions 1 'A single action fits at the minimum safe headroom'
Assert-Equal $Plan.OperatingReserveGiB 6.0 'The plan retains a 6 GiB operating reserve'
Assert-Equal $Plan.CommitPerActionGiB 4.5 'The plan budgets measured compile pressure per action'

$script:MockFreeCommitGiB = 15.0
$Plan = Get-WildboundBuildResourcePlan -RequestedMaxParallelActions 2
Assert-Equal $Plan.MaxParallelActions 2 'Two actions fit when enough commit is available'

$script:MockFreeCommitGiB = 9.4
$Blocked = $false
try {
    Get-WildboundBuildResourcePlan | Out-Null
} catch {
    $Blocked = $true
}
Assert-Equal $Blocked $true 'Editor build is blocked below its commit threshold'

$script:MockFreeCommitGiB = 15.9
$Blocked = $false
try {
    Get-WildboundBuildResourcePlan -MinimumFreeCommitGiB 16.0 | Out-Null
} catch {
    $Blocked = $true
}
Assert-Equal $Blocked $true 'Map generation and packaging use the higher threshold'

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

Write-Output 'Passed adaptive build-resource checks and build-helper syntax validation.'
