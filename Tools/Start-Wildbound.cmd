@echo off
setlocal
echo Wildbound - Unreal C++ build and Greenveil prototype launcher
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-Wildbound.ps1" %*
set "WILDBOUND_EXIT=%ERRORLEVEL%"
echo.
echo Wildbound startup exit code: %WILDBOUND_EXIT%
if not "%WILDBOUND_EXIT%"=="0" echo Check Saved\WildboundBootstrap for build logs.
pause
exit /b %WILDBOUND_EXIT%
