#include "WildboundPrototypePlayerController.h"

#include "WildboundPrototypeAnimal.h"
#include "WildboundPrototypeBuildBlock.h"
#include "WildboundPrototypePlacement.h"
#include "Components/InputComponent.h"
#include "Engine/World.h"
#include "EngineUtils.h"
#include "GameFramework/Pawn.h"
#include "Net/UnrealNetwork.h"

namespace
{
constexpr float CareRange = 325.0f;
constexpr float BuildRange = WildboundSim::PrototypePlaceRangeCm;
}

AWildboundPrototypePlayerController::AWildboundPrototypePlayerController()
{
    bReplicates = true;
}

void AWildboundPrototypePlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();
    if (!InputComponent) return;
    if (GetWorld() && GetWorld()->GetMapName().Contains(TEXT("GreenveilExploration"))) return;

    InputComponent->BindAction(TEXT("CareFeed"), IE_Pressed, this,
        &AWildboundPrototypePlayerController::FeedViewedAnimal);
    InputComponent->BindAction(TEXT("CareWater"), IE_Pressed, this,
        &AWildboundPrototypePlayerController::WaterViewedAnimal);
    InputComponent->BindAction(TEXT("CareReassure"), IE_Pressed, this,
        &AWildboundPrototypePlayerController::ReassureViewedAnimal);
    InputComponent->BindAction(TEXT("PlaceBlock"), IE_Pressed, this,
        &AWildboundPrototypePlayerController::PlaceBlock);
    InputComponent->BindAction(TEXT("RemoveBlock"), IE_Pressed, this,
        &AWildboundPrototypePlayerController::RemoveBlock);
}

AActor* AWildboundPrototypePlayerController::GetViewedActor(float MaxDistance) const
{
    UWorld* World = GetWorld();
    if (!World) return nullptr;

    FVector Eye;
    FRotator View;
    GetPlayerViewPoint(Eye, View);
    FHitResult Hit;
    FCollisionQueryParams Query(SCENE_QUERY_STAT(WildboundInteract), false);
    if (GetPawn()) Query.AddIgnoredActor(GetPawn());

    return World->LineTraceSingleByChannel(Hit, Eye,
        Eye + View.Vector() * MaxDistance, ECC_Visibility, Query)
        ? Hit.GetActor() : nullptr;
}

bool AWildboundPrototypePlayerController::CanReachActor(
    const AActor* Target, float MaxDistance) const
{
    const APawn* PlayerPawn = GetPawn();
    UWorld* World = GetWorld();
    if (!IsValid(Target) || !IsValid(PlayerPawn) || !World ||
        Target->GetWorld() != World)
    {
        return false;
    }

    const FVector From = PlayerPawn->GetActorLocation() + FVector(0, 0, 50);
    const FVector To = Target->GetActorLocation();
    if (FVector::DistSquared(From, To) > FMath::Square(MaxDistance))
    {
        return false;
    }

    FCollisionQueryParams Query(SCENE_QUERY_STAT(WildboundReach), false);
    Query.AddIgnoredActor(PlayerPawn);
    FHitResult Hit;
    return World->LineTraceSingleByChannel(Hit, From, To, ECC_Visibility, Query)
        && Hit.GetActor() == Target;
}

void AWildboundPrototypePlayerController::RequestCare(EWildboundCareAction Action)
{
    if (AWildboundPrototypeAnimal* Target =
            Cast<AWildboundPrototypeAnimal>(GetViewedActor(CareRange + 200.0f)))
    {
        ServerCareAnimal(Target, Action);
    }
}

void AWildboundPrototypePlayerController::FeedViewedAnimal()
{
    RequestCare(EWildboundCareAction::Feed);
}

void AWildboundPrototypePlayerController::WaterViewedAnimal()
{
    RequestCare(EWildboundCareAction::Water);
}

void AWildboundPrototypePlayerController::ReassureViewedAnimal()
{
    RequestCare(EWildboundCareAction::Reassure);
}

void AWildboundPrototypePlayerController::ServerCareAnimal_Implementation(
    AWildboundPrototypeAnimal* Target, EWildboundCareAction Action)
{
    UWorld* World = GetWorld();
    if (!World || !CanReachActor(Target, CareRange) ||
        World->GetTimeSeconds() - LastCareTime < 0.8f)
    {
        return;
    }

    // Never accept invalid enum values as a free action.
    if (Action != EWildboundCareAction::Feed &&
        Action != EWildboundCareAction::Water &&
        Action != EWildboundCareAction::Reassure)
    {
        return;
    }

    if ((Action == EWildboundCareAction::Feed && FeedServings <= 0) ||
        (Action == EWildboundCareAction::Water && WaterServings <= 0))
    {
        return;
    }

    UWildboundAnimalNeedsComponent* Needs = Target->GetNeeds();
    if (!Needs || !Needs->TryCare(Action))
    {
        return;
    }

    if (Action == EWildboundCareAction::Feed) --FeedServings;
    if (Action == EWildboundCareAction::Water) --WaterServings;
    LastCareTime = World->GetTimeSeconds();
    UE_LOG(LogTemp, Log, TEXT("Wildbound care applied on server. Feed=%d Water=%d"),
        FeedServings, WaterServings);
}

void AWildboundPrototypePlayerController::PlaceBlock()
{
    if (const APawn* PlayerPawn = GetPawn())
    {
        FVector Eye;
        FRotator View;
        GetPlayerViewPoint(Eye, View);
        const FVector Proposed = PlayerPawn->GetActorLocation() +
            View.Vector().GetSafeNormal2D() * 250.0f;
        ServerPlaceBlock(Proposed);
    }
}

void AWildboundPrototypePlayerController::ServerPlaceBlock_Implementation(
    FVector_NetQuantize ProposedLocation)
{
    UWorld* World = GetWorld();
    const APawn* PlayerPawn = GetPawn();
    if (!World || !PlayerPawn || !FMath::IsFinite(ProposedLocation.X) ||
        !FMath::IsFinite(ProposedLocation.Y) ||
        World->GetTimeSeconds() - LastBuildTime < 0.3f)
    {
        return;
    }

    const FVector PlayerLocation = PlayerPawn->GetActorLocation();
    std::vector<WildboundSim::FGridCell> Occupied;
    for (TActorIterator<AWildboundPrototypeBuildBlock> It(World); It; ++It)
    {
        const FVector Position = It->GetActorLocation();
        Occupied.push_back({
            static_cast<int32>(FMath::RoundToInt(
                Position.X / WildboundSim::PrototypeGridCentimeters)),
            static_cast<int32>(FMath::RoundToInt(
                Position.Y / WildboundSim::PrototypeGridCentimeters))});
    }

    const WildboundSim::FPlacementResult Placement =
        WildboundSim::EvaluatePrototypePlacement(
            PlayerLocation.X, PlayerLocation.Y,
            ProposedLocation.X, ProposedLocation.Y, Occupied);
    if (!Placement.Allowed())
    {
        return;
    }

    const FVector Snapped(
        Placement.Cell.X * WildboundSim::PrototypeGridCentimeters,
        Placement.Cell.Y * WildboundSim::PrototypeGridCentimeters, 50.0f);

    FActorSpawnParameters Params;
    Params.SpawnCollisionHandlingOverride =
        ESpawnActorCollisionHandlingMethod::DontSpawnIfColliding;
    if (World->SpawnActor<AWildboundPrototypeBuildBlock>(
        Snapped, FRotator::ZeroRotator, Params))
    {
        LastBuildTime = World->GetTimeSeconds();
    }
}

void AWildboundPrototypePlayerController::RemoveBlock()
{
    if (AWildboundPrototypeBuildBlock* Block =
            Cast<AWildboundPrototypeBuildBlock>(GetViewedActor(BuildRange + 200.0f)))
    {
        ServerRemoveBlock(Block);
    }
}

void AWildboundPrototypePlayerController::ServerRemoveBlock_Implementation(
    AWildboundPrototypeBuildBlock* Target)
{
    UWorld* World = GetWorld();
    if (!World || !CanReachActor(Target, BuildRange) ||
        World->GetTimeSeconds() - LastBuildTime < 0.3f)
    {
        return;
    }

    Target->Destroy();
    LastBuildTime = World->GetTimeSeconds();
}

void AWildboundPrototypePlayerController::GetLifetimeReplicatedProps(
    TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME_CONDITION(AWildboundPrototypePlayerController, FeedServings, COND_OwnerOnly);
    DOREPLIFETIME_CONDITION(AWildboundPrototypePlayerController, WaterServings, COND_OwnerOnly);
}
