@echo off
setlocal
for %%I in ("%~dp0Scratch") do set "TEMP=%%~fI"
set "TMP=%TEMP%"
for %%I in ("%~dp0..\..\EngineDDC\Local") do set "UE-LocalDataCachePath=%%~fI"
if not exist "%TEMP%" mkdir "%TEMP%"
if not exist "%UE-LocalDataCachePath%" mkdir "%UE-LocalDataCachePath%"
set "Quality=1"
set "ShadowQuality=0"
if /I "%~1"=="high" set "Quality=2"
if /I "%~1"=="high" set "ShadowQuality=2"
start "Wildbound - Greenveil Exploration" "%~dp0Windows\Wildbound.exe" /Game/Maps/GreenveilExplorationPolish_WP -windowed -ResX=1920 -ResY=1080 -ExecCmds="sg.ViewDistanceQuality %Quality%,sg.ShadowQuality %ShadowQuality%,sg.GlobalIlluminationQuality %Quality%,sg.ReflectionQuality %Quality%,sg.PostProcessQuality %Quality%,sg.TextureQuality %Quality%,sg.EffectsQuality %Quality%,sg.FoliageQuality %Quality%,r.EyeAdaptationQuality 0,r.ScreenPercentage 100,r.DynamicRes.OperationMode 0,t.MaxFPS 60,r.VSync 0"
endlocal
