#include "WildboundPrototypeGameMode.h"

#include "WildboundPrototypeAnimal.h"
#include "WildboundPrototypeCharacter.h"
#include "WildboundPrototypeGround.h"
#include "WildboundPrototypeHUD.h"
#include "WildboundPrototypePlayerController.h"
#include "Engine/World.h"
#include "EngineUtils.h"

AWildboundPrototypeGameMode::AWildboundPrototypeGameMode()
{
    DefaultPawnClass = AWildboundPrototypeCharacter::StaticClass();
    PlayerControllerClass = AWildboundPrototypePlayerController::StaticClass();
    HUDClass = AWildboundPrototypeHUD::StaticClass();
}

void AWildboundPrototypeGameMode::BeginPlay()
{
    Super::BeginPlay();

    UWorld* World = GetWorld();
    if (!World || !HasAuthority()) return;

    FActorSpawnParameters Params;
    Params.SpawnCollisionHandlingOverride =
        ESpawnActorCollisionHandlingMethod::AlwaysSpawn;

    bool bHasGround = false;
    for (TActorIterator<AWildboundPrototypeGround> It(World); It; ++It)
    {
        bHasGround = true;
        break;
    }
    if (!bHasGround)
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
        World->SpawnActor<AWildboundPrototypeAnimal>(
            FVector(450, 0, 82), FRotator::ZeroRotator, Params);
    }
}
