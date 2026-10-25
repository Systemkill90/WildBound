$ErrorActionPreference='Stop'
$framework=Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319'
$compiler=Join-Path $framework 'csc.exe'
$refs=@('System.dll','System.Core.dll','System.Net.Http.dll','System.Web.Extensions.dll','System.Xaml.dll','WPF\WindowsBase.dll','WPF\PresentationCore.dll','WPF\PresentationFramework.dll')
$garageCompilerArgs=@('/nologo','/target:winexe','/platform:x64','/optimize+',('/out:'+(Join-Path $PSScriptRoot 'WildBoundGarage.exe')),('/win32icon:'+(Join-Path $PSScriptRoot '..\Dashboard\ai-garage.ico')))
foreach($ref in $refs){$garageCompilerArgs+=('/reference:'+(Join-Path $framework $ref))}
$garageCompilerArgs+=(Join-Path $PSScriptRoot 'src\Garage.cs')
& $compiler @garageCompilerArgs
if($LASTEXITCODE -ne 0){throw 'Native Garage compilation failed.'}
Write-Output 'Built native Windows application: WildBoundGarage.exe'
