#include "WildboundPrototypeGround.h"

#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"
#include "UObject/ConstructorHelpers.h"

AWildboundPrototypeGround::AWildboundPrototypeGround()
{
    bReplicates = true;
    PrimaryActorTick.bCanEverTick = false;

    Visual = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("TemporaryGround"));
    SetRootComponent(Visual);
    Visual->SetCollisionProfileName(TEXT("BlockAll"));
    Visual->SetRelativeScale3D(FVector(30.0f, 30.0f, 1.0f));

    static ConstructorHelpers::FObjectFinder<UStaticMesh> Mesh(
        TEXT("/Engine/BasicShapes/Cube.Cube"));
    if (Mesh.Succeeded())
    {
        Visual->SetStaticMesh(Mesh.Object);
    }
}
