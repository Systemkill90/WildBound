#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "WildboundPrototypeAnimal.generated.h"

class USkeletalMeshComponent;
class UStaticMeshComponent;
class UAnimSequence;
class UWildboundAnimalNeedsComponent;

/**
 * Replicated Greenveil deer with server-authoritative character movement.
 * CharacterMovement handles swept collision, slopes, steps and floor following.
 */
UCLASS()
class WILDBOUND_API AWildboundPrototypeAnimal : public ACharacter
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
    TObjectPtr<USkeletalMeshComponent> Visual;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Wildbound|Prototype")
    TObjectPtr<UStaticMeshComponent> FallbackVisual;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Wildbound|Prototype")
    TObjectPtr<UWildboundAnimalNeedsComponent> Needs;

private:
    FVector HomeLocation = FVector::ZeroVector;
    FVector WanderTarget = FVector::ZeroVector;
    float NextWanderChoice = 0.0f;
    float LastProgressTime = 0.0f;
    FVector PreviousVisualLocation = FVector::ZeroVector;
    FVector PreviousAIPosition = FVector::ZeroVector;
    UPROPERTY(Transient)
    TObjectPtr<UAnimSequence> IdleAnimation;
    UPROPERTY(Transient)
    TObjectPtr<UAnimSequence> WalkAnimation;
    UPROPERTY(Transient)
    TObjectPtr<UAnimSequence> RunAnimation;
    bool bPlayingMovementAnimation = false;
};
