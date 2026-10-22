#include "WildboundPrototypeGameMode.h"

#include "WildboundPrototypeAnimal.h"
#include "WildboundPrototypeCharacter.h"
#include "WildboundPrototypeGround.h"
#include "WildboundPrototypeHUD.h"
#include "WildboundPrototypePlayerController.h"
#include "Engine/World.h"
#include "EngineUtils.h"
#include "GameFramework/PlayerStart.h"

AWildboundPrototypeGameMode::AWildboundPrototypeGameMode()
{
    DefaultPawnClass = AWildboundPrototypeCharacter::StaticClass();
    PlayerControllerClass = AWildboundPrototypePlayerController::StaticClass();
    HUDClass = AWildboundPrototypeHUD::StaticClass();
}

AActor* AWildboundPrototypeGameMode::ChoosePlayerStart_Implementation(
    AController* Player)
{
    AActor* Start = Super::ChoosePlayerStart_Implementation(Player);
    const UWorld* World = GetWorld();
    if (Start && World
        && World->GetMapName().Contains(TEXT("ElectricDreams_PCGCloseRange")))
    {
        // The sample's drone-facing start points straight into a massive root
        // cluster. Turn the Wildbound third-person preview toward the trail.
        FRotator SpawnRotation = Start->GetActorRotation();
        SpawnRotation.Yaw = FRotator::NormalizeAxis(SpawnRotation.Yaw + 180.0f);
        Start->SetActorRotation(SpawnRotation);
        UE_LOG(LogTemp, Log, TEXT("Wildbound Electric Dreams start: %s, yaw %.1f"),
            *Start->GetActorLocation().ToCompactString(), SpawnRotation.Yaw);
    }
    return Start;
}

void AWildboundPrototypeGameMode::BeginPlay()
{
    Super::BeginPlay();

    UWorld* World = GetWorld();
    if (!World || !HasAuthority()) return;

    // The Electric Dreams sample carries a drone-only control card. Hide that
    // sample instruction actor when the Wildbound game mode is active.
    for (TActorIterator<AActor> It(World); It; ++It)
    {
        if (It->GetClass()->GetName().Contains(TEXT("DroneInstructions")))
        {
            It->SetActorHiddenInGame(true);
            It->SetActorEnableCollision(false);
        }
    }

    FActorSpawnParameters Params;
    Params.SpawnCollisionHandlingOverride =
        ESpawnActorCollisionHandlingMethod::AlwaysSpawn;

    APlayerStart* AuthoredPlayerStart = nullptr;
    for (TActorIterator<APlayerStart> It(World); It; ++It)
    {
        AuthoredPlayerStart = *It;
        break;
    }

    bool bHasGround = false;
    for (TActorIterator<AWildboundPrototypeGround> It(World); It; ++It)
    {
        bHasGround = true;
        break;
    }
    // Authored test maps provide their own terrain. Only create the bootstrap
    // platform for a bare fallback map that also lacks a PlayerStart.
    if (!bHasGround && !AuthoredPlayerStart)
    {
        World->SpawnActor<AWildboundPrototypeGround>(
            FVector(0, 0, -25), FRotator::ZeroRotator, Params);
    }

    bool bHasAnimal = false;
    for (TActorIterator<AWildboundPrototypeAnimal> It(World); It; ++It)
    {
        bHasAnimal = true;
        break;
    }
    if (!bHasAnimal)
    {
        const FVector AnimalLocation = AuthoredPlayerStart
            ? AuthoredPlayerStart->GetActorLocation()
                + AuthoredPlayerStart->GetActorForwardVector() * 250.0f
            : FVector(450, 0, 82);
        World->SpawnActor<AWildboundPrototypeAnimal>(
            AnimalLocation, FRotator::ZeroRotator, Params);
    }
}
