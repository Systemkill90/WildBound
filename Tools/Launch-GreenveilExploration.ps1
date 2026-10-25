[CmdletBinding()]
param(
    [string]$EngineRoot = $env:WILDBOUND_UNREAL_ENGINE_ROOT,
    [string]$Map = '/Game/Maps/GreenveilExplorationPolish_WP',
    [string]$Executable = '',
    [ValidateRange(0,3)][int]$Quality = 1,
[ValidateRange(-1,3)][int]$ShadowQualityOverride = 0,
    [ValidateRange(-1,3)][int]$FoliageQualityOverride = -1,
    [string]$TraceFile = '',
    [string]$OllamaApiUri = 'http://127.0.0.1:11434/api/ps',
    [switch]$SkipScreenshots,
    [switch]$TraversalTest,
    [switch]$ExitAfterTest
)
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$SystemDriveRoot = [IO.Path]::GetPathRoot(($env:SystemDrive + '\'))
if ([IO.Path]::GetPathRoot($RepoRoot) -ieq $SystemDriveRoot) { throw 'Wildbound must be checked out on a non-system volume before launching.' }
$WildboundDataRoot = Split-Path $RepoRoot -Parent
$BuildScratch = Join-Path $RepoRoot 'Saved\BuildScratch'
New-Item -ItemType Directory -Path $BuildScratch -Force | Out-Null
# Keep the game's Unreal runtime logs and temporary files beside the project.
$env:TEMP = $BuildScratch
$env:TMP = $BuildScratch
$DdcPath = Join-Path $WildboundDataRoot 'EngineDDC\Local'
New-Item -ItemType Directory -Path $DdcPath -Force | Out-Null
Set-Item -Path 'Env:UE-LocalDataCachePath' -Value $DdcPath
if (-not $Executable -and -not $EngineRoot) { throw 'Set WILDBOUND_UNREAL_ENGINE_ROOT or pass -EngineRoot / -Executable.' }
function Get-LoadedOllamaModelCount {
    $OllamaProcess = Get-Process -Name 'ollama' -ErrorAction SilentlyContinue
    if (-not $OllamaProcess) { return 0 }
    try {
        $Status = Invoke-RestMethod -Uri $OllamaApiUri -TimeoutSec 2
        return @($Status.models).Count
    }
    catch {
        throw "Traversal deferred to protect local AI: Ollama is running, but its active-model status could not be checked at $OllamaApiUri."
    }
}
if ($TraversalTest -and (Get-LoadedOllamaModelCount) -gt 0) {
    throw 'Traversal deferred to protect local AI: Ollama has a model loaded. Retry after the local assignment finishes.'
}
$Evidence = Join-Path $RepoRoot 'Saved\GreenveilBuild'
New-Item -ItemType Directory $Evidence -Force | Out-Null
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$ArgsList = @()
if (-not $Executable) {
    $Executable = "$EngineRoot\Engine\Binaries\Win64\UnrealEditor.exe"
    $ArgsList += ('"' + (Join-Path $RepoRoot 'Wildbound.uproject') + '"')
    $ArgsList += '-game'
}
$ArgsList += $Map
$ArgsList += '-windowed','-ResX=1920','-ResY=1080','-NoSound'
$RuntimeLog = Join-Path $Evidence "Runtime-$Stamp.log"
$ArgsList += ('-abslog="' + $RuntimeLog + '"')
$Cap = if ($TraversalTest) { '0' } else { '60' }
$QualityCommands = @('ViewDistance','Shadow','GlobalIllumination','Reflection','PostProcess','Texture','Effects','Foliage') | ForEach-Object { "sg.$($_)Quality $Quality" }
if ($ShadowQualityOverride -ge 0) { $QualityCommands += "sg.ShadowQuality $ShadowQualityOverride" }
if ($FoliageQualityOverride -ge 0) { $QualityCommands += "sg.FoliageQuality $FoliageQualityOverride" }
$ArgsList += ('-ExecCmds="' + ($QualityCommands -join ',') + ',r.EyeAdaptationQuality 0,r.ScreenPercentage 100,r.DynamicRes.OperationMode 0,t.MaxFPS ' + $Cap + ',r.VSync 0"')
if ($TraversalTest) { $ArgsList += '-GreenveilTraversalTest' }
if ($ExitAfterTest) { $ArgsList += '-GreenveilProbeExit' }
if ($SkipScreenshots) { $ArgsList += '-GreenveilNoScreenshots' }
if ($TraceFile) {
    $TraceDirectory = Split-Path -Parent $TraceFile
    if (-not (Test-Path -LiteralPath $TraceDirectory)) { New-Item -ItemType Directory -Path $TraceDirectory -Force | Out-Null }
    $ArgsList += '-trace=cpu,gpu,frame,bookmark,task','-statnamedevents'
    $ArgsList += ('-tracefile="' + $TraceFile + '"')
}
$GameProcess = Start-Process -FilePath $Executable -ArgumentList $ArgsList -WindowStyle Hidden -PassThru
if ($TraversalTest) {
    while (-not $GameProcess.HasExited) {
        Start-Sleep -Seconds 5
        if ($GameProcess.HasExited) { break }
        try {
            if ((Get-LoadedOllamaModelCount) -gt 0) {
                Stop-Process -Id $GameProcess.Id -Force -ErrorAction SilentlyContinue
                throw 'Traversal stopped to yield the GPU to a local Ollama model. No gameplay result should be recorded from this run.'
            }
        }
        catch {
            Stop-Process -Id $GameProcess.Id -Force -ErrorAction SilentlyContinue
            throw
        }
    }
    $GameProcess.WaitForExit()
    $GameProcess.Refresh()
    if ($GameProcess.ExitCode -ne 0) { throw "Traversal game exited with code $($GameProcess.ExitCode); see $RuntimeLog." }
    if (-not (Test-Path -LiteralPath $RuntimeLog -PathType Leaf)) { throw "Traversal finished without its runtime log: $RuntimeLog" }
    $ProbeResult = Select-String -LiteralPath $RuntimeLog -Pattern 'GREENVEIL_PROBE (PASS|FAIL) '
    if (-not $ProbeResult) { throw "Traversal finished without a GREENVEIL_PROBE summary; see $RuntimeLog." }
    if ($ProbeResult[-1].Line -notmatch 'GREENVEIL_PROBE PASS ') { throw "Traversal probe failed: $($ProbeResult[-1].Line)" }
    Write-Output $ProbeResult[-1].Line
}
