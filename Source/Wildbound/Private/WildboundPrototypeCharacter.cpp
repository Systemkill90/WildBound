#include "WildboundPrototypeCharacter.h"

#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/InputComponent.h"
#include "Components/SkeletalMeshComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Engine/SkeletalMesh.h"
#include "Animation/AnimInstance.h"
#include "GameFramework/SpringArmComponent.h"
#include "UObject/ConstructorHelpers.h"

AWildboundPrototypeCharacter::AWildboundPrototypeCharacter()
{
    bReplicates = true;
    bUseControllerRotationYaw = false;

    // The capsule is the authoritative player collision shape; keep it narrow
    // enough for the authored trail while retaining a predictable step height.
    GetCapsuleComponent()->InitCapsuleSize(36.0f, 90.0f);
    GetCapsuleComponent()->SetCollisionProfileName(TEXT("Pawn"));

    GetCharacterMovement()->bOrientRotationToMovement = true;
    GetCharacterMovement()->RotationRate = FRotator(0.0f, 500.0f, 0.0f);
    GetCharacterMovement()->MaxStepHeight = 48.0f;
    GetCharacterMovement()->SetWalkableFloorAngle(48.0f);
    GetCharacterMovement()->MaxAcceleration = 1500.0f;
    GetCharacterMovement()->BrakingDecelerationWalking = 1400.0f;
    GetCharacterMovement()->GroundFriction = 7.0f;

    CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));
    CameraBoom->SetupAttachment(RootComponent);
    CameraBoom->TargetArmLength = 400.0f;
    CameraBoom->SetRelativeLocation(FVector(0.0f, 0.0f, 75.0f));
    CameraBoom->bUsePawnControlRotation = true;

    Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("Camera"));
    Camera->SetupAttachment(CameraBoom, USpringArmComponent::SocketName);
    Camera->bUsePawnControlRotation = false;

    CharacterVisual = GetMesh();
    CharacterVisual->SetCollisionEnabled(ECollisionEnabled::NoCollision);
    CharacterVisual->SetRelativeLocation(FVector(0.0f, 0.0f, -90.0f));
    CharacterVisual->SetRelativeRotation(FRotator(0.0f, -90.0f, 0.0f));

    static ConstructorHelpers::FObjectFinder<USkeletalMesh> CharacterMeshAsset(
        TEXT("/Game/Characters/Mannequins/Meshes/SKM_Quinn_Simple.SKM_Quinn_Simple"));
    if (CharacterMeshAsset.Succeeded())
    {
        CharacterVisual->SetSkeletalMesh(CharacterMeshAsset.Object);
        CharacterVisual->SetVisibility(true);
    }

    static ConstructorHelpers::FClassFinder<UAnimInstance> CharacterAnimBP(
        TEXT("/Game/Characters/Mannequins/Anims/Unarmed/ABP_Unarmed"));
    if (CharacterAnimBP.Succeeded())
    {
        CharacterVisual->SetAnimationMode(EAnimationMode::AnimationBlueprint);
        CharacterVisual->SetAnimInstanceClass(CharacterAnimBP.Class);
    }
}

void AWildboundPrototypeCharacter::SetupPlayerInputComponent(UInputComponent* Input)
{
    Super::SetupPlayerInputComponent(Input);
    Input->BindAxis(TEXT("MoveForward"), this, &AWildboundPrototypeCharacter::MoveForward);
    Input->BindAxis(TEXT("MoveRight"), this, &AWildboundPrototypeCharacter::MoveRight);
    Input->BindAxis(TEXT("Turn"), this, &AWildboundPrototypeCharacter::Turn);
    Input->BindAxis(TEXT("LookUp"), this, &AWildboundPrototypeCharacter::LookUp);
    Input->BindAction(TEXT("Jump"), IE_Pressed, this, &AWildboundPrototypeCharacter::StartJump);
    Input->BindAction(TEXT("Jump"), IE_Released, this, &AWildboundPrototypeCharacter::EndJump);
}

void AWildboundPrototypeCharacter::MoveForward(float Value)
{
    if (Controller && !FMath::IsNearlyZero(Value))
    {
        const FRotator Yaw(0.0f, Controller->GetControlRotation().Yaw, 0.0f);
        AddMovementInput(FRotationMatrix(Yaw).GetUnitAxis(EAxis::X), Value);
    }
}

void AWildboundPrototypeCharacter::MoveRight(float Value)
{
    if (Controller && !FMath::IsNearlyZero(Value))
    {
        const FRotator Yaw(0.0f, Controller->GetControlRotation().Yaw, 0.0f);
        AddMovementInput(FRotationMatrix(Yaw).GetUnitAxis(EAxis::Y), Value);
    }
}

void AWildboundPrototypeCharacter::Turn(float Value)
{
    AddControllerYawInput(Value);
}

void AWildboundPrototypeCharacter::LookUp(float Value)
{
    AddControllerPitchInput(Value);
}

void AWildboundPrototypeCharacter::StartJump()
{
    Jump();
}

void AWildboundPrototypeCharacter::EndJump()
{
    StopJumping();
}
