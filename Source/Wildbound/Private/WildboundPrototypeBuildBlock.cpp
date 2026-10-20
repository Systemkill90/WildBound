#include "WildboundPrototypeBuildBlock.h"

#include "Components/StaticMeshComponent.h"
#include "UObject/ConstructorHelpers.h"

AWildboundPrototypeBuildBlock::AWildboundPrototypeBuildBlock()
{
    bReplicates = true;
    SetReplicateMovement(true);
    PrimaryActorTick.bCanEverTick = false;

    Visual = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Block"));
    SetRootComponent(Visual);
    Visual->SetCollisionProfileName(TEXT("BlockAll"));

    static ConstructorHelpers::FObjectFinder<UStaticMesh> Mesh(
        TEXT("/Engine/BasicShapes/Cube.Cube"));
    if (Mesh.Succeeded())
    {
        Visual->SetStaticMesh(Mesh.Object);
    }
}
