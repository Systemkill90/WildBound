function Get-WildboundBuildResourcePlan {
    [CmdletBinding()]
    param(
        [ValidateRange(1, 32)]
        [int]$RequestedMaxParallelActions = 2,
        [ValidateRange(1, 128)]
        [double]$MinimumFreeCommitGiB = 10.5
    )

    $OperatingSystem = Get-CimInstance -ClassName Win32_OperatingSystem -ErrorAction Stop
    $FreeCommitGiB = [double]$OperatingSystem.FreeVirtualMemory / 1MB

    # Keep a 6 GiB Windows safety margin, then budget 4.5 GiB for each UBT
    # action. The prior run reached 34.74/39.55 GiB committed before it was
    # stopped, so 4 GiB left too little operating room on this workstation.
    $OperatingReserveGiB = 6.0
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
