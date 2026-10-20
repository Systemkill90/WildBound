#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WildboundPrototypeBuildBlock.generated.h"

class UStaticMeshComponent;

/** Temporary 100 cm snapped building block. NOT a voxel engine or terrain editing. */
UCLASS()
class WILDBOUND_API AWildboundPrototypeBuildBlock : public AActor
{
    GENERATED_BODY()

public:
    AWildboundPrototypeBuildBlock();

private:
    UPROPERTY(VisibleAnywhere, Category="Wildbound|Prototype")
    TObjectPtr<UStaticMeshComponent> Visual;
};
