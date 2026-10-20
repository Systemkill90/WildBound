#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WildboundPrototypeAnimal.generated.h"

class UStaticMeshComponent;
class UWildboundAnimalNeedsComponent;

/**
 * Placeholder replicated herbivore for the Greenveil engineering playground.
 * Visual is an engine sphere; no creature mesh, movement AI or animation exists.
 */
UCLASS()
class WILDBOUND_API AWildboundPrototypeAnimal : public AActor
{
    GENERATED_BODY()

public:
    AWildboundPrototypeAnimal();

    UFUNCTION(BlueprintPure, Category="Wildbound|Prototype")
    UWildboundAnimalNeedsComponent* GetNeeds() const { return Needs; }

protected:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Wildbound|Prototype")
    TObjectPtr<UStaticMeshComponent> Visual;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Wildbound|Prototype")
    TObjectPtr<UWildboundAnimalNeedsComponent> Needs;
};
