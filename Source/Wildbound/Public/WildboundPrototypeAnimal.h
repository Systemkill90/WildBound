#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WildboundPrototypeAnimal.generated.h"

class UStaticMeshComponent;
class UCapsuleComponent;
class UWildboundAnimalNeedsComponent;

/**
 * Replicated Greenveil deer with server-authoritative, short-range wandering.
 * Movement is procedural; a skeletal walk cycle and enclosure navigation remain
 * future work.
 */
UCLASS()
class WILDBOUND_API AWildboundPrototypeAnimal : public AActor
{
    GENERATED_BODY()

public:
    AWildboundPrototypeAnimal();

    virtual void Tick(float DeltaSeconds) override;

    UFUNCTION(BlueprintPure, Category="Wildbound|Prototype")
    UWildboundAnimalNeedsComponent* GetNeeds() const { return Needs; }

protected:
    virtual void BeginPlay() override;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Wildbound|Prototype")
    TObjectPtr<UCapsuleComponent> BodyCollision;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Wildbound|Prototype")
    TObjectPtr<UStaticMeshComponent> Visual;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Wildbound|Prototype")
    TObjectPtr<UWildboundAnimalNeedsComponent> Needs;

private:
    FVector HomeLocation = FVector::ZeroVector;
    FVector WanderTarget = FVector::ZeroVector;
    float NextWanderChoice = 0.0f;
    float MovementAccumulator = 0.0f;
};
