param([string]$EngineRoot,[string]$ProjectRoot)
$ErrorActionPreference='Stop'
if (@(Get-CimInstance Win32_Process | Where-Object { $_.Name -match '^UnrealEditor(?:-Cmd|-Win64-Development)?\.exe$' }).Count) { throw 'Unreal is already open or importing. Close it before the Garage commandlet import, then retry this approved asset.' }
$os=Get-CimInstance Win32_OperatingSystem
if ($os.FreeVirtualMemory/1MB -lt 6.5) { throw 'Unreal import needs at least 6.5 GiB free system commit.' }
if (-not (Test-Path -LiteralPath (Join-Path $EngineRoot 'Engine\Binaries\Win64\UnrealEditor-Cmd.exe'))) { throw 'Configured Unreal commandlet is missing.' }
if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot 'Wildbound.uproject'))) { throw 'Configured Unreal project is missing.' }
Write-Output 'Engine import preflight passed.'
