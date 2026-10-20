#include "WildboundPrototypeCharacter.h"

#include "Camera/CameraComponent.h"
#include "Components/InputComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/SpringArmComponent.h"
#include "UObject/ConstructorHelpers.h"

AWildboundPrototypeCharacter::AWildboundPrototypeCharacter()
{
    bReplicates = true;
    bUseControllerRotationYaw = false;

    GetCharacterMovement()->bOrientRotationToMovement = true;
    GetCharacterMovement()->RotationRate = FRotator(0.0f, 500.0f, 0.0f);

    CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));
    CameraBoom->SetupAttachment(RootComponent);
    CameraBoom->TargetArmLength = 400.0f;
    CameraBoom->SetRelativeLocation(FVector(0.0f, 0.0f, 75.0f));
    CameraBoom->bUsePawnControlRotation = true;

    Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("Camera"));
    Camera->SetupAttachment(CameraBoom, USpringArmComponent::SocketName);
    Camera->bUsePawnControlRotation = false;

    PlaceholderBody = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("PlaceholderBody"));
    PlaceholderBody->SetupAttachment(RootComponent);
    PlaceholderBody->SetCollisionEnabled(ECollisionEnabled::NoCollision);
    PlaceholderBody->SetRelativeScale3D(FVector(0.42f, 0.42f, 0.85f));

    static ConstructorHelpers::FObjectFinder<UStaticMesh> Mesh(
        TEXT("/Engine/BasicShapes/Sphere.Sphere"));
    if (Mesh.Succeeded())
    {
        PlaceholderBody->SetStaticMesh(Mesh.Object);
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
