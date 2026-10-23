function Get-WildboundBuildResourcePlan {
    [CmdletBinding()]
    param(
        [ValidateRange(1, 32)]
        [int]$RequestedMaxParallelActions = 2,
        [ValidateRange(1, 128)]
        [double]$MinimumFreeCommitGiB = 8.5
    )

    $OperatingSystem = Get-CimInstance -ClassName Win32_OperatingSystem -ErrorAction Stop
    $FreeCommitGiB = [double]$OperatingSystem.FreeVirtualMemory / 1MB

    # The last measured one-worker editor build consumed about 4 GiB of commit.
    # Keep 4 GiB for Windows and budget a further 4.5 GiB per UBT action.
    $OperatingReserveGiB = 4.0
    $CommitPerActionGiB = 4.5

    if ($FreeCommitGiB -lt $MinimumFreeCommitGiB) {
        throw ('Build not started: Windows has {0:N1} GiB free commit; Wildbound requires at least {1:N1} GiB. Close unrelated workloads or increase available paging capacity, then retry.' -f $FreeCommitGiB, $MinimumFreeCommitGiB)
    }

    $ResourceLimit = [int][math]::Floor(($FreeCommitGiB - $OperatingReserveGiB) / $CommitPerActionGiB)
    $ParallelActions = [math]::Max(1, [math]::Min($RequestedMaxParallelActions, $ResourceLimit))

    [pscustomobject]@{
        FreeCommitGiB = [math]::Round($FreeCommitGiB, 1)
        MaxParallelActions = $ParallelActions
        OperatingReserveGiB = $OperatingReserveGiB
        CommitPerActionGiB = $CommitPerActionGiB
    }
}
