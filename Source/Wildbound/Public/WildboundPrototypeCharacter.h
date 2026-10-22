#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "WildboundPrototypeCharacter.generated.h"

class UCameraComponent;
class USpringArmComponent;
class USkeletalMeshComponent;

/** Third-person prototype pawn using Unreal's bundled rigged mannequin art when installed. */
UCLASS()
class WILDBOUND_API AWildboundPrototypeCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    AWildboundPrototypeCharacter();
    virtual void SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) override;

private:
    void MoveForward(float Value);
    void MoveRight(float Value);
    void Turn(float Value);
    void LookUp(float Value);
    void StartJump();
    void EndJump();

    UPROPERTY(VisibleAnywhere, Category="Wildbound|Prototype")
    TObjectPtr<USpringArmComponent> CameraBoom;

    UPROPERTY(VisibleAnywhere, Category="Wildbound|Prototype")
    TObjectPtr<UCameraComponent> Camera;

    UPROPERTY(VisibleAnywhere, Category="Wildbound|Prototype")
    TObjectPtr<USkeletalMeshComponent> CharacterVisual;
};
