#include "WildboundPrototypeAnimal.h"

#include "WildboundAnimalNeedsComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"
#include "UObject/ConstructorHelpers.h"

AWildboundPrototypeAnimal::AWildboundPrototypeAnimal()
{
    bReplicates = true;
    SetReplicateMovement(true);
    PrimaryActorTick.bCanEverTick = false;

    Visual = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("AnimalPlaceholder"));
    SetRootComponent(Visual);
    Visual->SetCollisionProfileName(TEXT("BlockAll"));
    Visual->SetRelativeScale3D(FVector(1.2f, 0.8f, 0.9f));

    static ConstructorHelpers::FObjectFinder<UStaticMesh> Mesh(
        TEXT("/Engine/BasicShapes/Sphere.Sphere"));
    if (Mesh.Succeeded())
    {
        Visual->SetStaticMesh(Mesh.Object);
    }

    Needs = CreateDefaultSubobject<UWildboundAnimalNeedsComponent>(TEXT("Needs"));
}
