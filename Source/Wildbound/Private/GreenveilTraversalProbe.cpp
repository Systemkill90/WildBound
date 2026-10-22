#include "GreenveilTraversalProbe.h"
#include "WildboundPrototypeAnimal.h"
#include "EngineUtils.h"
#include "Engine/TargetPoint.h"
#include "Engine/GameViewportClient.h"
#include "Engine/Engine.h"
#include "GameFramework/Character.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/PlayerController.h"
#include "HAL/PlatformMemory.h"
#include "Misc/FileHelper.h"
#include "Misc/Paths.h"
#include "Misc/CommandLine.h"
#include "Misc/Parse.h"
#include "UnrealClient.h"
#include "NavigationSystem.h"
#include "NavigationPath.h"

AGreenveilTraversalProbe::AGreenveilTraversalProbe()
{
    PrimaryActorTick.bCanEverTick = true;
}

void AGreenveilTraversalProbe::BeginPlay()
{
    Super::BeginPlay();
    TArray<ATargetPoint*> Points;
    for (TActorIterator<ATargetPoint> It(GetWorld()); It; ++It)
        if (It->ActorHasTag(TEXT("GreenveilRoute"))) Points.Add(*It);
    Points.Sort([](const ATargetPoint& A, const ATargetPoint& B) {
        return A.Tags.Last().ToString() < B.Tags.Last().ToString();
    });
    for (const auto* P : Points) Route.Add(P->GetActorLocation());
    if (Route.Num()) { const FVector Arrival=Route[0]; Route.Add(Arrival); }
    Started = LegStarted = Previous = FPlatformTime::Seconds();
    UE_LOG(LogTemp, Display, TEXT("GREENVEIL_PROBE start route=%d"), Route.Num());
}

void AGreenveilTraversalProbe::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);
    if (Finished) return;
    const double Now = FPlatformTime::Seconds();
    if (Now-Started < 12) { Previous=Now; LegStarted=Now; return; }
    Frames.Add((Now-Previous)*1000); Previous=Now;
    APlayerController* PC=GetWorld()->GetFirstPlayerController();
    ACharacter* Pawn=PC ? Cast<ACharacter>(PC->GetPawn()) : nullptr;
    if (!Pawn || Route.Num()<2) { Finish(false,TEXT("Missing player or route")); return; }
    if (LastLocation.IsNearlyZero()) LastLocation=Pawn->GetActorLocation();
    Travel+=FVector::Dist2D(LastLocation,Pawn->GetActorLocation());
    LastLocation=Pawn->GetActorLocation();
    FVector Offset=Route[Leg]-Pawn->GetActorLocation(); Offset.Z=0;
    if (Offset.Size()<70)
    {
        UE_LOG(LogTemp, Display, TEXT("GREENVEIL_PROBE waypoint=%d loc=%s grounded=%d elapsed=%.2f"),
            Leg,*Pawn->GetActorLocation().ToCompactString(),Pawn->GetCharacterMovement()->IsMovingOnGround(),Now-Started);
        FScreenshotRequest::RequestScreenshot(FPaths::ProjectSavedDir()/FString::Printf(TEXT("GreenveilEvidence/Waypoint%02d.png"),Leg),true,false);
        ++Leg; LegStarted=Now;
        if (Leg==Route.Num()) { Finish(true,TEXT("Full loop traversed using movement input")); return; }
        UNavigationPath* Path=UNavigationSystemV1::FindPathToLocationSynchronously(GetWorld(),Pawn->GetActorLocation(),Route[Leg],Pawn);
        const bool NavOK=Path && Path->IsValid() && !Path->IsPartial();
        if (!NavOK) ++NavigationFailures;
        UE_LOG(LogTemp,Display,TEXT("GREENVEIL_NAV leg=%d valid=%d"),Leg,NavOK);
        Offset=Route[Leg]-Pawn->GetActorLocation(); Offset.Z=0;
    }
    if (Now-LegStarted>45) { Finish(false,FString::Printf(TEXT("Blocked or slow leg %d"),Leg)); return; }
    if (Pawn->GetActorLocation().Z < -500) { Finish(false,TEXT("Fell below terrain")); return; }
    FRotator View=Offset.Rotation(); View.Pitch=-12;
    PC->SetControlRotation(View);
    Pawn->AddMovementInput(Offset.GetSafeNormal(),1);
}

void AGreenveilTraversalProbe::Finish(bool Passed,const FString& Reason)
{
    Finished=true;
    Frames.Sort();
    double Sum=0; FString CSV=TEXT("sorted_frame_ms\n");
    for (double F:Frames) { Sum+=F; CSV+=FString::Printf(TEXT("%.4f\n"),F); }
    const double Mean=Frames.Num()?Sum/Frames.Num():0;
    const double P95=Frames.Num()?Frames[FMath::Min(Frames.Num()-1,FMath::FloorToInt(Frames.Num()*.95))]:0;
    const double P99=Frames.Num()?Frames[FMath::Min(Frames.Num()-1,FMath::FloorToInt(Frames.Num()*.99))]:0;
    int32 Animals=0;
    for (TActorIterator<AWildboundPrototypeAnimal> It(GetWorld());It;++It) ++Animals;
    FVector2D Size=FVector2D::ZeroVector;
    if (GEngine && GEngine->GameViewport) GEngine->GameViewport->GetViewportSize(Size);
    const auto Memory=FPlatformMemory::GetStats();
    const FString Summary=FString::Printf(TEXT("GREENVEIL_PROBE %s reason=%s waypoints=%d/%d travel_m=%.1f frames=%d mean_ms=%.3f p95_ms=%.3f p99_ms=%.3f mean_fps=%.2f process_physical_mib=%.1f process_peak_mib=%.1f resolution=%.0fx%.0f animals=%d navigation_failures=%d"),
        Passed&&Animals==0&&NavigationFailures==0?TEXT("PASS"):TEXT("FAIL"),*Reason,Leg,Route.Num(),Travel/100,Frames.Num(),Mean,P95,P99,Mean>0?1000/Mean:0,
        Memory.UsedPhysical/1048576.0,Memory.PeakUsedPhysical/1048576.0,Size.X,Size.Y,Animals,NavigationFailures);
    UE_LOG(LogTemp,Display,TEXT("%s"),*Summary);
    FFileHelper::SaveStringToFile(Summary+TEXT("\n"),*(FPaths::ProjectSavedDir()/TEXT("GreenveilTraversal-summary.txt")));
    FFileHelper::SaveStringToFile(CSV,*(FPaths::ProjectSavedDir()/TEXT("GreenveilTraversal-frames.csv")));
    if (FParse::Param(FCommandLine::Get(),TEXT("GreenveilProbeExit")))
        GetWorld()->GetFirstPlayerController()->ConsoleCommand(TEXT("quit"));
}
