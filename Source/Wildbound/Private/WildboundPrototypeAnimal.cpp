#include "WildboundPrototypeAnimal.h"

#include "WildboundAnimalNeedsComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"
#include "Engine/World.h"
#include "UObject/ConstructorHelpers.h"

namespace
{
constexpr float AnimalGroundProbeAbove = 350.0f;
constexpr float AnimalGroundProbeBelow = 500.0f;
constexpr float AnimalMaxGroundStep = 130.0f;
constexpr float AnimalMinGroundNormalZ = 0.65f;

bool FindGroundedLocation(UWorld* World, const AActor* IgnoreActor,
    const FVector& DesiredLocation, float CapsuleHalfHeight,
    float MaxGroundDelta, FVector& OutLocation)
{
    if (!World)
    {
        return false;
    }

    const FVector Start = DesiredLocation + FVector(0.0f, 0.0f, AnimalGroundProbeAbove);
    const FVector End = DesiredLocation - FVector(0.0f, 0.0f, AnimalGroundProbeBelow);
    FCollisionQueryParams QueryParams(SCENE_QUERY_STAT(WildboundAnimalGroundProbe), false);
    QueryParams.AddIgnoredActor(IgnoreActor);

    TArray<FHitResult> Hits;
    const FCollisionObjectQueryParams ObjectTypes(ECC_WorldStatic);
    if (!World->LineTraceMultiByObjectType(Hits, Start, End, ObjectTypes, QueryParams))
    {
        return false;
    }

    const float ExpectedGroundZ = DesiredLocation.Z - CapsuleHalfHeight;
    float BestDelta = MaxGroundDelta;
    const FHitResult* BestHit = nullptr;
    for (const FHitResult& Hit : Hits)
    {
        if (Hit.bStartPenetrating || Hit.ImpactNormal.Z < AnimalMinGroundNormalZ)
        {
            continue;
        }

        const float GroundDelta = FMath::Abs(Hit.ImpactPoint.Z - ExpectedGroundZ);
        if (GroundDelta < BestDelta)
        {
            BestDelta = GroundDelta;
            BestHit = &Hit;
        }
    }

    if (!BestHit)
    {
        return false;
    }

    OutLocation = FVector(DesiredLocation.X, DesiredLocation.Y,
        BestHit->ImpactPoint.Z + CapsuleHalfHeight);
    return true;
}
}

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
    if (HasAuthority() && BodyCollision)
    {
        FVector GroundedLocation;
        if (FindGroundedLocation(GetWorld(), this, GetActorLocation(),
                BodyCollision->GetScaledCapsuleHalfHeight(), 1000.0f, GroundedLocation))
        {
            SetActorLocation(GroundedLocation, false, nullptr, ETeleportType::TeleportPhysics);
        }
    }

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
    const FVector DesiredLocation = Current + Offset;
    FVector GroundedLocation;
    if (!BodyCollision || !FindGroundedLocation(GetWorld(), this, DesiredLocation,
            BodyCollision->GetScaledCapsuleHalfHeight(), AnimalMaxGroundStep,
            GroundedLocation))
    {
        WanderTarget = Current;
        NextWanderChoice = Now + FMath::FRandRange(1.0f, 2.0f);
        return;
    }

    FHitResult Hit;
    if (!SetActorLocation(GroundedLocation, true, &Hit))
    {
        WanderTarget = Current;
        NextWanderChoice = Now + FMath::FRandRange(1.0f, 2.0f);
    }
}
