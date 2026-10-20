#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WildboundPrototypeGround.generated.h"

class UStaticMeshComponent;

/** Temporary collision ground, assembled in C++ to avoid a missing map asset. */
UCLASS()
class WILDBOUND_API AWildboundPrototypeGround : public AActor
{
    GENERATED_BODY()

public:
    AWildboundPrototypeGround();

private:
    UPROPERTY(VisibleAnywhere, Category="Wildbound|Prototype")
    TObjectPtr<UStaticMeshComponent> Visual;
};
