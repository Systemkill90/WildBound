#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WildboundPrototypeAnimal.generated.h"

class USkeletalMeshComponent;
class UStaticMeshComponent;
class UAnimSequence;
class UCapsuleComponent;
class UWildboundAnimalNeedsComponent;

/**
 * Replicated Greenveil deer with server-authoritative, short-range wandering.
 * Movement is procedural; locomotion visuals follow replicated actor movement.
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
    TObjectPtr<USkeletalMeshComponent> Visual;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Wildbound|Prototype")
    TObjectPtr<UStaticMeshComponent> FallbackVisual;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Wildbound|Prototype")
    TObjectPtr<UWildboundAnimalNeedsComponent> Needs;

private:
    FVector HomeLocation = FVector::ZeroVector;
    FVector WanderTarget = FVector::ZeroVector;
    float NextWanderChoice = 0.0f;
    float MovementAccumulator = 0.0f;
    FVector PreviousVisualLocation = FVector::ZeroVector;
    UPROPERTY(Transient)
    TObjectPtr<UAnimSequence> IdleAnimation;
    UPROPERTY(Transient)
    TObjectPtr<UAnimSequence> WalkAnimation;
    UPROPERTY(Transient)
    TObjectPtr<UAnimSequence> RunAnimation;
    bool bPlayingMovementAnimation = false;
};
