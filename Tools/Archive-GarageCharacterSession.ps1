[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$SourceRoot,

    [Parameter(Mandatory)]
    [string]$DestinationRoot,

    [Parameter(Mandatory)]
    [ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$')]
    [string]$SessionName
)

$ErrorActionPreference = 'Stop'

$source = (Resolve-Path -LiteralPath $SourceRoot).Path
$destinationBase = (Resolve-Path -LiteralPath $DestinationRoot).Path
$destination = Join-Path $destinationBase $SessionName

if (-not (Test-Path -LiteralPath $source -PathType Container)) {
    throw "Character-session source does not exist: $SourceRoot"
}

$systemRoot = [IO.Path]::GetPathRoot([Environment]::GetFolderPath('System'))
if ([IO.Path]::GetPathRoot($destinationBase) -eq $systemRoot) {
    throw 'Character-session archives must not be written to the system volume.'
}

New-Item -ItemType Directory -Path $destination -Force | Out-Null
$entries = [Collections.Generic.List[object]]::new()

foreach ($file in Get-ChildItem -LiteralPath $source -File -Recurse | Sort-Object FullName) {
    $relative = [IO.Path]::GetRelativePath($source, $file.FullName)
    $target = Join-Path $destination $relative
    $targetDirectory = Split-Path -Parent $target
    New-Item -ItemType Directory -Path $targetDirectory -Force | Out-Null

    $sourceHash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    $copyRequired = $true
    if (Test-Path -LiteralPath $target -PathType Leaf) {
        $targetHash = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant()
        if ($targetHash -ne $sourceHash) {
            throw "Archive target already exists with different content: $relative"
        }
        $copyRequired = $false
    }

    if ($copyRequired) {
        $temporary = "$target.$([Guid]::NewGuid().ToString('N')).tmp"
        try {
            Copy-Item -LiteralPath $file.FullName -Destination $temporary
            if ((Get-FileHash -LiteralPath $temporary -Algorithm SHA256).Hash.ToLowerInvariant() -ne $sourceHash) {
                throw "Checksum verification failed while copying $relative"
            }
            Move-Item -LiteralPath $temporary -Destination $target -Force
        }
        finally {
            if (Test-Path -LiteralPath $temporary) {
                Remove-Item -LiteralPath $temporary -Force
            }
        }
    }

    $verifiedHash = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($verifiedHash -ne $sourceHash) {
        throw "Archived file failed final verification: $relative"
    }

    $entries.Add([ordered]@{
        path = $relative.Replace('\', '/')
        bytes = $file.Length
        sha256 = $sourceHash
    })
}

$manifest = [ordered]@{
    schemaVersion = 1
    session = $SessionName
    classification = 'rejected-development-evidence-not-approved-game-assets'
    sourceFileCount = $entries.Count
    files = $entries
    archivedAt = (Get-Date).ToUniversalTime().ToString('o')
}
$manifestPath = Join-Path $destination 'SHA256-MANIFEST.json'
$manifest.manifestPolicy = 'files-are-immutable; reruns verify matching bytes'
$manifestTemporary = "$manifestPath.$([Guid]::NewGuid().ToString('N')).tmp"
$manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $manifestTemporary -Encoding utf8
Move-Item -LiteralPath $manifestTemporary -Destination $manifestPath -Force

[pscustomobject]@{
    Session = $SessionName
    Destination = $destination
    Files = $entries.Count
    Manifest = $manifestPath
    Verified = $true
}
