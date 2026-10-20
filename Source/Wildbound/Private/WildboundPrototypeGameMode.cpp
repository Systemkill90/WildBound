#include "WildboundPrototypeGameMode.h"

#include "WildboundPrototypeAnimal.h"
#include "WildboundPrototypeCharacter.h"
#include "WildboundPrototypeGround.h"
#include "WildboundPrototypePlayerController.h"
#include "Engine/World.h"

AWildboundPrototypeGameMode::AWildboundPrototypeGameMode()
{
    DefaultPawnClass = AWildboundPrototypeCharacter::StaticClass();
    PlayerControllerClass = AWildboundPrototypePlayerController::StaticClass();
}

void AWildboundPrototypeGameMode::BeginPlay()
{
    Super::BeginPlay();

    UWorld* World = GetWorld();
    if (!World || !HasAuthority()) return;

    // Ground surface at Z=-50. The starter sphere is 300 cm east of center.
    FActorSpawnParameters Params;
    Params.SpawnCollisionHandlingOverride =
        ESpawnActorCollisionHandlingMethod::AlwaysSpawn;

    World->SpawnActor<AWildboundPrototypeGround>(
        FVector(0, 0, -100), FRotator::ZeroRotator, Params);

    World->SpawnActor<AWildboundPrototypeAnimal>(
        FVector(300, 0, 0), FRotator::ZeroRotator, Params);
}
