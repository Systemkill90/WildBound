#include "WildboundPrototypeAnimal.h"

#include "WildboundAnimalNeedsComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"
#include "UObject/ConstructorHelpers.h"

AWildboundPrototypeAnimal::AWildboundPrototypeAnimal()
{
    bReplicates = true;
    SetReplicateMovement(true);
    PrimaryActorTick.bCanEverTick = true;
    PrimaryActorTick.TickInterval = 0.15f;

    BodyCollision = CreateDefaultSubobject<UCapsuleComponent>(TEXT("BodyCollision"));
    SetRootComponent(BodyCollision);
    BodyCollision->InitCapsuleSize(38.0f, 82.0f);
    BodyCollision->SetCollisionProfileName(TEXT("BlockAll"));

    Visual = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("DeerVisual"));
    Visual->SetupAttachment(BodyCollision);
    Visual->SetCollisionEnabled(ECollisionEnabled::NoCollision);
    Visual->SetRelativeLocation(FVector(0.0f, 0.0f, -87.0f));

    static ConstructorHelpers::FObjectFinder<UStaticMesh> DeerBody(
        TEXT("/Game/Wildbound/Art/Animals/deer-standing/StaticMeshes/Continuous_anatomical_skin.Continuous_anatomical_skin"));
    if (DeerBody.Succeeded())
    {
        Visual->SetStaticMesh(DeerBody.Object);
        Visual->SetRelativeScale3D(FVector(0.92f));
    }

    Needs = CreateDefaultSubobject<UWildboundAnimalNeedsComponent>(TEXT("Needs"));
}

void AWildboundPrototypeAnimal::BeginPlay()
{
    Super::BeginPlay();
    HomeLocation = GetActorLocation();
    WanderTarget = HomeLocation;
    if (HasAuthority())
    {
        NextWanderChoice = GetWorld()->GetTimeSeconds() + 1.5f;
    }
}

void AWildboundPrototypeAnimal::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);
    if (!HasAuthority() || DeltaSeconds <= 0.0f)
    {
        return;
    }

    MovementAccumulator += DeltaSeconds;
    if (MovementAccumulator < 0.25f)
    {
        return;
    }

    const float StepSeconds = MovementAccumulator;
    MovementAccumulator = 0.0f;
    const float Now = GetWorld()->GetTimeSeconds();
    FVector Current = GetActorLocation();

    if (Now >= NextWanderChoice || FVector::DistSquared2D(Current, WanderTarget) < FMath::Square(65.0f))
    {
        const float Angle = FMath::FRandRange(0.0f, 2.0f * PI);
        const float Radius = FMath::FRandRange(250.0f, 650.0f);
        WanderTarget = HomeLocation + FVector(FMath::Cos(Angle) * Radius, FMath::Sin(Angle) * Radius, 0.0f);
        WanderTarget.Z = HomeLocation.Z;
        NextWanderChoice = Now + FMath::FRandRange(4.0f, 8.0f);
    }

    FVector Direction = WanderTarget - Current;
    Direction.Z = 0.0f;
    if (Direction.IsNearlyZero())
    {
        return;
    }

    const float Stress = Needs ? Needs->GetStress() : 25.0f;
    const float Speed = Stress > 65.0f ? 135.0f : 55.0f;
    const FRotator Facing = Direction.Rotation();
    SetActorRotation(FMath::RInterpConstantTo(GetActorRotation(), Facing, StepSeconds, 180.0f));
    const FVector Offset = Direction.GetSafeNormal() * Speed * StepSeconds;
    FHitResult Hit;
    SetActorLocation(Current + Offset, true, &Hit);
}
