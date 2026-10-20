#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "WildboundPrototypeCharacter.generated.h"

class UCameraComponent;
class USpringArmComponent;
class UStaticMeshComponent;

/** Simple third-person prototype pawn; no packaged art, abilities or inventory. */
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
    TObjectPtr<UStaticMeshComponent> PlaceholderBody;
};
