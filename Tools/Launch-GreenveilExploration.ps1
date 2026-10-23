[CmdletBinding()]
param(
    [string]$EngineRoot = $env:WILDBOUND_UNREAL_ENGINE_ROOT,
    [string]$Map = '/Game/Maps/GreenveilExplorationPolish',
    [string]$Executable = '',
    [ValidateRange(0,3)][int]$Quality = 1,
    [ValidateRange(-1,3)][int]$ShadowQualityOverride = -1,
    [string]$TraceFile = '',
    [string]$OllamaApiUri = 'http://127.0.0.1:11434/api/ps',
    [switch]$SkipScreenshots,
    [switch]$TraversalTest,
    [switch]$ExitAfterTest
)
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
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
$ArgsList += ('-abslog="' + "$Evidence\Runtime-$Stamp.log" + '"')
$Cap = if ($TraversalTest) { '0' } else { '60' }
$QualityCommands = @('ViewDistance','Shadow','GlobalIllumination','Reflection','PostProcess','Texture','Effects','Foliage') | ForEach-Object { "sg.$($_)Quality $Quality" }
if ($ShadowQualityOverride -ge 0) { $QualityCommands += "sg.ShadowQuality $ShadowQualityOverride" }
$ArgsList += ('-ExecCmds="' + ($QualityCommands -join ',') + ',r.ScreenPercentage 100,r.DynamicRes.OperationMode 0,t.MaxFPS ' + $Cap + ',r.VSync 0"')
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
}
