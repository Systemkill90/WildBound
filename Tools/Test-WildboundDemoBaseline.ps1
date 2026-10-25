# Wildbound issue #16: non-destructive demo readiness and evidence collection.
# Run from Windows PowerShell: powershell -NoProfile -File .\Tools\Test-WildboundDemoBaseline.ps1
# Optional: -Compile (runs existing BuildOnly helper, requires full local toolchain).
[CmdletBinding()]
param([switch]$Compile)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$Evidence = Join-Path $Root ("Saved\DemoAcceptance\$Stamp")
New-Item -ItemType Directory -Force -Path $Evidence | Out-Null
$Report = [ordered]@{
    Timestamp = (Get-Date).ToString('o')
    Status = 'PREFLIGHT ONLY - not a gameplay or packaged test'
    RepoRoot = $Root
    Branch = ''
    Commit = ''
    Dirty = $null
    ProjectFile = $false
    ElectricDreamsMapPresent = $false
    MannequinRootPresent = $false
    EngineDiscoveryExitCode = $null
    CompileExitCode = $null
    HumanPlaytest = 'NOT RUN'
    PackagedWin64 = 'NOT RUN'
    FrameTime = 'NOT MEASURED'
}
try {
    $Git = Get-Command git -ErrorAction SilentlyContinue
    if ($Git) {
        $Report.Branch = (& git -C $Root branch --show-current 2>$null | Out-String).Trim()
        $Report.Commit = (& git -C $Root rev-parse HEAD 2>$null | Out-String).Trim()
        $Status = @(& git -C $Root status --porcelain --untracked-files=normal 2>$null)
        $Report.Dirty = ($Status.Count -gt 0)
        $Status | Out-File -FilePath (Join-Path $Evidence 'git-status.txt') -Encoding UTF8
    }
    $Report.ProjectFile = Test-Path (Join-Path $Root 'Wildbound.uproject')
    $Report.ElectricDreamsMapPresent = Test-Path (Join-Path $Root 'Content\Levels\PCG\ElectricDreams_PCGCloseRange.umap')
    $Report.MannequinRootPresent = Test-Path (Join-Path $Root 'Content\Characters\Mannequins')
    if ($Report.ProjectFile) {
        & (Join-Path $Root 'Tools\Start-Wildbound.ps1') -ShowEngines *> (Join-Path $Evidence 'engine-discovery.log')
        $Report.EngineDiscoveryExitCode = $LASTEXITCODE
        if ($Compile) {
            if ($Report.Dirty) {
                throw 'Refusing compile while working tree has uncommitted/untracked changes. Preserve or review them first.'
            }
            & (Join-Path $Root 'Tools\Start-Wildbound.ps1') -BuildOnly *> (Join-Path $Evidence 'editor-build-output.log')
            $Report.CompileExitCode = $LASTEXITCODE
        }
    }
    if (-not $Report.ProjectFile -or -not $Report.ElectricDreamsMapPresent) {
        $Report.Status = 'BLOCKED - project or local-only sample map missing'
    } elseif ($Compile -and $Report.CompileExitCode -ne 0) {
        $Report.Status = 'BLOCKED - compile failed'
    } else {
        $Report.Status = 'PREFLIGHT COLLECTED - interactive/packaged acceptance still required'
    }
} catch {
    $Report.Status = 'ERROR - ' + $_.Exception.Message
} finally {
    $Report | ConvertTo-Json -Depth 5 | Out-File -FilePath (Join-Path $Evidence 'report.json') -Encoding UTF8
    Write-Host "Evidence saved: $Evidence"
    Write-Host "Status: $($Report.Status)"
}
