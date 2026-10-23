[CmdletBinding()]
param(
    [string]$EngineRoot = $env:WILDBOUND_UNREAL_ENGINE_ROOT,
    [string]$Map = '/Game/Maps/GreenveilExplorationPolish',
    [string]$Executable = '',
    [ValidateRange(0,3)][int]$Quality = 1,
    [switch]$TraversalTest,
    [switch]$ExitAfterTest
)
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if (-not $Executable -and -not $EngineRoot) { throw 'Set WILDBOUND_UNREAL_ENGINE_ROOT or pass -EngineRoot / -Executable.' }
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
$ArgsList += ('-ExecCmds="' + ($QualityCommands -join ',') + ',r.ScreenPercentage 100,r.DynamicRes.OperationMode 0,t.MaxFPS ' + $Cap + ',r.VSync 0"')
if ($TraversalTest) { $ArgsList += '-GreenveilTraversalTest' }
if ($ExitAfterTest) { $ArgsList += '-GreenveilProbeExit' }
Start-Process -FilePath $Executable -ArgumentList $ArgsList -WindowStyle Hidden
