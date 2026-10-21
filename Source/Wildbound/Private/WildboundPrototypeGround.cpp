#include "WildboundPrototypeGround.h"

#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"
#include "Materials/MaterialInterface.h"
#include "UObject/ConstructorHelpers.h"

AWildboundPrototypeGround::AWildboundPrototypeGround()
{
    bReplicates = true;
    PrimaryActorTick.bCanEverTick = false;

    Visual = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("TemporaryGround"));
    SetRootComponent(Visual);
    Visual->SetMobility(EComponentMobility::Movable);
    Visual->SetCollisionProfileName(TEXT("BlockAll"));
    Visual->SetRelativeScale3D(FVector(60.0f, 60.0f, 0.5f));

    static ConstructorHelpers::FObjectFinder<UStaticMesh> Mesh(
        TEXT("/Engine/BasicShapes/Cube.Cube"));
    if (Mesh.Succeeded())
    {
        Visual->SetStaticMesh(Mesh.Object);
    }

    static ConstructorHelpers::FObjectFinder<UMaterialInterface> ForestFloor(
        TEXT("/Game/Wildbound/Art/Environment/PolyHaven/ForestGround01/M_GreenveilForestFloor.M_GreenveilForestFloor"));
    if (ForestFloor.Succeeded())
    {
        Visual->SetMaterial(0, ForestFloor.Object);
    }
}
