@echo off
set "Quality=1"
set "ShadowQuality=0"
if /I "%~1"=="high" set "Quality=2"
if /I "%~1"=="high" set "ShadowQuality=2"
start "Wildbound - Greenveil Exploration" "%~dp0Windows\Wildbound.exe" /Game/Maps/GreenveilExplorationPolish -windowed -ResX=1920 -ResY=1080 -ExecCmds="sg.ViewDistanceQuality %Quality%,sg.ShadowQuality %ShadowQuality%,sg.GlobalIlluminationQuality %Quality%,sg.ReflectionQuality %Quality%,sg.PostProcessQuality %Quality%,sg.TextureQuality %Quality%,sg.EffectsQuality %Quality%,sg.FoliageQuality %Quality%,r.ScreenPercentage 100,r.DynamicRes.OperationMode 0,t.MaxFPS 60,r.VSync 0"
