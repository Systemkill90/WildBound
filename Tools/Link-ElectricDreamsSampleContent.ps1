[CmdletBinding()]
param(
    [string]$SampleRoot = $env:WILDBOUND_SAMPLE_ASSET_ROOT
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$ProjectContent = Join-Path $ProjectRoot "Content"
if (-not $SampleRoot) { throw 'Set WILDBOUND_SAMPLE_ASSET_ROOT or pass -SampleRoot with the locally installed sample directory.' }
$SampleContent = Join-Path $SampleRoot "Content"
$CacheRoot = Join-Path (Split-Path $ProjectRoot -Parent) "Cache"
$BackupRoot = Join-Path $CacheRoot ("SampleContentLinkBackup-" + (Get-Date -Format "yyyyMMdd-HHmmss"))

if (-not (Test-Path $SampleContent -PathType Container)) {
    throw "Electric Dreams sample content was not found at $SampleContent. Install or copy the free UE 5.8 Electric Dreams sample first."
}

New-Item -ItemType Directory -Path $ProjectContent -Force | Out-Null
$Linked = 0
$Skipped = 0
foreach ($SourceDirectory in Get-ChildItem -LiteralPath $SampleContent -Directory) {
    # Keep Wildbound's own curated assets in place; sample-specific dependencies
    # live in the other linked folders, and this avoids replacing tracked assets.
    if ($SourceDirectory.Name -eq "Wildbound") {
        $Skipped++
        continue
    }

    $Target = Join-Path $ProjectContent $SourceDirectory.Name
    if (Test-Path -LiteralPath $Target) {
        $Existing = Get-Item -LiteralPath $Target -Force
        if (($Existing.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) {
            $ResolvedTarget = (Resolve-Path -LiteralPath $Target).Path
            if ($ResolvedTarget -eq $SourceDirectory.FullName) {
                $Skipped++
                continue
            }
            throw "Existing directory link points somewhere else; refusing to replace it: $Target"
        }

        $BackupDirectory = Join-Path $BackupRoot $SourceDirectory.Name
        if (Test-Path -LiteralPath $BackupDirectory) {
            throw "Backup already exists; refusing to overwrite it: $BackupDirectory"
        }
        New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null
        Move-Item -LiteralPath $Target -Destination $BackupDirectory
    }

    New-Item -ItemType Junction -Path $Target -Target $SourceDirectory.FullName | Out-Null
    $Linked++
}

Write-Host "Linked $Linked Electric Dreams content folders into $ProjectContent."
Write-Host "Skipped $Skipped existing links/Wildbound folder."
if (Test-Path -LiteralPath $BackupRoot) {
    Write-Host "Preserved previous local content folders at $BackupRoot."
}
Write-Host "Sample assets remain local and are excluded from Git; check their asset licenses before redistribution."
