#include "WildboundPrototypeAnimal.h"

#include "WildboundAnimalNeedsComponent.h"
#include "Components/CapsuleComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Components/SkeletalMeshComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Animation/AnimSequence.h"
#include "Engine/SkeletalMesh.h"
#include "Engine/StaticMesh.h"
#include "Engine/World.h"
#include "UObject/ConstructorHelpers.h"

AWildboundPrototypeAnimal::AWildboundPrototypeAnimal()
{
    bReplicates = true;
    SetReplicateMovement(true);
    AutoPossessAI = EAutoPossessAI::PlacedInWorldOrSpawned;
    PrimaryActorTick.bCanEverTick = true;
    GetCapsuleComponent()->InitCapsuleSize(38.0f, 82.0f);
    GetCapsuleComponent()->SetCollisionProfileName(TEXT("Pawn"));
    GetCharacterMovement()->bOrientRotationToMovement = true;
    GetCharacterMovement()->RotationRate = FRotator(0.0f, 240.0f, 0.0f);
    GetCharacterMovement()->MaxWalkSpeed = 105.0f;
    GetCharacterMovement()->MaxAcceleration = 500.0f;
    GetCharacterMovement()->BrakingDecelerationWalking = 350.0f;
    GetCharacterMovement()->GroundFriction = 5.0f;
    GetCharacterMovement()->MaxStepHeight = 38.0f;
    GetCharacterMovement()->SetWalkableFloorAngle(42.0f);

    Visual = GetMesh();
    Visual->SetCollisionEnabled(ECollisionEnabled::NoCollision);
    Visual->SetRelativeLocation(FVector(0.0f, 0.0f, -82.0f));

    FallbackVisual = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("FallbackDeerVisual"));
    FallbackVisual->SetupAttachment(GetCapsuleComponent());
    FallbackVisual->SetCollisionEnabled(ECollisionEnabled::NoCollision);
    FallbackVisual->SetRelativeLocation(FVector(0.0f, 0.0f, -87.0f));
    FallbackVisual->SetVisibility(false);

    static ConstructorHelpers::FObjectFinder<UStaticMesh> FallbackDeer(
        TEXT("/Game/Wildbound/Art/Animals/deer-standing/StaticMeshes/Continuous_anatomical_skin.Continuous_anatomical_skin"));
    if (FallbackDeer.Succeeded())
    {
        FallbackVisual->SetStaticMesh(FallbackDeer.Object);
        FallbackVisual->SetRelativeScale3D(FVector(0.92f));
    }

    static ConstructorHelpers::FObjectFinder<USkeletalMesh> DeerBody(
        TEXT("/Game/AnimalVarietyPack/DeerStagAndDoe/Meshes/SK_DeerDoe.SK_DeerDoe"));
    if (DeerBody.Succeeded())
    {
        Visual->SetSkeletalMesh(DeerBody.Object);
        Visual->SetRelativeScale3D(FVector(1.0f));
    }
    else
    {
        Visual->SetVisibility(false);
        FallbackVisual->SetVisibility(true);
    }

    static ConstructorHelpers::FObjectFinder<UAnimSequence> Idle(
        TEXT("/Game/AnimalVarietyPack/DeerStagAndDoe/Animations/ANIM_DeerDoe_IdleBreathe.ANIM_DeerDoe_IdleBreathe"));
    static ConstructorHelpers::FObjectFinder<UAnimSequence> Walk(
        TEXT("/Game/AnimalVarietyPack/DeerStagAndDoe/Animations/ANIM_DeerDoe_Walk.ANIM_DeerDoe_Walk"));
    static ConstructorHelpers::FObjectFinder<UAnimSequence> Run(
        TEXT("/Game/AnimalVarietyPack/DeerStagAndDoe/Animations/ANIM_DeerDoe_Run.ANIM_DeerDoe_Run"));
    if (Idle.Succeeded()) IdleAnimation = Idle.Object;
    if (Walk.Succeeded()) WalkAnimation = Walk.Object;
    if (Run.Succeeded()) RunAnimation = Run.Object;

    Needs = CreateDefaultSubobject<UWildboundAnimalNeedsComponent>(TEXT("Needs"));
}

void AWildboundPrototypeAnimal::BeginPlay()
{
    Super::BeginPlay();
    if (HasAuthority())
    {
        GetCharacterMovement()->SetMovementMode(MOVE_Walking);
        UE_LOG(LogTemp, Log, TEXT("Wildbound deer ready at %s; AI controller %s"),
            *GetActorLocation().ToCompactString(),
            GetController() ? *GetController()->GetName() : TEXT("none"));
    }

    HomeLocation = GetActorLocation();
    WanderTarget = HomeLocation;
    LastProgressTime = GetWorld()->GetTimeSeconds();
    PreviousAIPosition = GetActorLocation();
    if (Visual && IdleAnimation)
    {
        Visual->PlayAnimation(IdleAnimation, true);
    }
    if (HasAuthority())
    {
        NextWanderChoice = GetWorld()->GetTimeSeconds() + 1.5f;
    }
}

void AWildboundPrototypeAnimal::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);
    if (DeltaSeconds <= 0.0f)
    {
        return;
    }

    if (Visual)
    {
        const FVector CurrentLocation = GetActorLocation();
        const bool bMoving = !PreviousVisualLocation.IsNearlyZero()
            && FVector::DistSquared2D(CurrentLocation, PreviousVisualLocation) > FMath::Square(1.0f);
        PreviousVisualLocation = CurrentLocation;
        if (bMoving != bPlayingMovementAnimation)
        {
            bPlayingMovementAnimation = bMoving;
            UAnimSequence* Animation = bMoving
                ? (Needs && Needs->GetStress() > 65.0f && RunAnimation ? RunAnimation : WalkAnimation)
                : IdleAnimation;
            if (Animation)
            {
                Visual->PlayAnimation(Animation, true);
            }
        }
    }

    if (!HasAuthority()) return;

    const float Now = GetWorld()->GetTimeSeconds();
    FVector Current = GetActorLocation();

    const float DistanceToGoal = FVector::DistSquared2D(Current, WanderTarget);
    if (Now >= NextWanderChoice || DistanceToGoal < FMath::Square(120.0f))
    {
        const float Angle = FMath::FRandRange(0.0f, 2.0f * PI);
        const float Radius = FMath::FRandRange(280.0f, 520.0f);
        WanderTarget = HomeLocation + FVector(FMath::Cos(Angle) * Radius, FMath::Sin(Angle) * Radius, 0.0f);
        NextWanderChoice = Now + FMath::FRandRange(4.0f, 7.0f);
    }

    FVector Direction = WanderTarget - Current;
    Direction.Z = 0.0f;
    if (Direction.IsNearlyZero() || !GetCharacterMovement())
    {
        return;
    }

    const float Stress = Needs ? Needs->GetStress() : 25.0f;
    GetCharacterMovement()->MaxWalkSpeed = Stress > 65.0f ? 220.0f : 105.0f;

    AddMovementInput(Direction.GetSafeNormal(), 1.0f);

    const bool bMadeProgress = FVector::DistSquared2D(Current, PreviousAIPosition)
        > FMath::Square(3.0f);
    PreviousAIPosition = Current;
    if (bMadeProgress)
    {
        LastProgressTime = Now;
    }
    else if (Now - LastProgressTime > 2.0f)
    {
        // A blocked wander route must not freeze the animal on one bad target.
        WanderTarget = Current;
        NextWanderChoice = Now;
    }
}
