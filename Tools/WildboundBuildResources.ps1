function Get-WildboundBuildResourcePlan {
    [CmdletBinding()]
    param(
        [ValidateRange(1, 32)]
        [int]$RequestedMaxParallelActions = 2,
        [ValidateRange(1, 128)]
        [double]$MinimumFreeCommitGiB = 6.5
    )

    $OperatingSystem = Get-CimInstance -ClassName Win32_OperatingSystem -ErrorAction Stop
    $FreeCommitGiB = [double]$OperatingSystem.FreeVirtualMemory / 1MB

    # Budget 2 GiB for Windows plus 4.5 GiB for the first build action. The
    # measured incremental compile used about 5.6 GiB at peak; each additional
    # UBT action gets another 4.5 GiB. This lets small bounded work proceed at
    # one worker instead of enforcing a blanket 10.5/16 GiB threshold.
    $OperatingReserveGiB = 2.0
    $CommitPerActionGiB = 4.5

    if ($FreeCommitGiB -lt $MinimumFreeCommitGiB) {
        throw ('Build not started: Windows has {0:N1} GiB free commit; Wildbound requires at least {1:N1} GiB. Close a large workload such as the Unreal Editor only when safe, or increase available paging capacity, then retry.' -f $FreeCommitGiB, $MinimumFreeCommitGiB)
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
