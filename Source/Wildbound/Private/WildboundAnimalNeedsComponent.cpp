#include "WildboundAnimalNeedsComponent.h"

#include "GameFramework/Actor.h"
#include "Net/UnrealNetwork.h"

UWildboundAnimalNeedsComponent::UWildboundAnimalNeedsComponent()
{
    PrimaryComponentTick.bCanEverTick = true;
    SetIsReplicatedByDefault(true);
}

void UWildboundAnimalNeedsComponent::BeginPlay()
{
    Super::BeginPlay();
}

void UWildboundAnimalNeedsComponent::TickComponent(
    float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

    if (GetOwner() && GetOwner()->HasAuthority())
    {
        SimulateNeeds(DeltaTime);
    }
}

void UWildboundAnimalNeedsComponent::SimulateNeeds(float DeltaSeconds)
{
    if (DeltaSeconds <= 0.0f)
    {
        return;
    }

    const float Minutes = DeltaSeconds / 60.0f;
    Hunger = FMath::Clamp(Hunger - HungerLossPerMinute * Minutes, 0.0f, 100.0f);
    Thirst = FMath::Clamp(Thirst - ThirstLossPerMinute * Minutes, 0.0f, 100.0f);

    if (Hunger <= 0.0f || Thirst <= 0.0f)
    {
        Condition = FMath::Clamp(
            Condition - ConditionLossPerMinuteWhenDeprived * Minutes, 0.0f, 100.0f);
    }
    OnNeedsChanged();
}

bool UWildboundAnimalNeedsComponent::ApplyFood(float Amount)
{
    if (!GetOwner() || !GetOwner()->HasAuthority() || !FMath::IsFinite(Amount) || Amount <= 0.0f)
    {
        return false;
    }

    Hunger = FMath::Clamp(Hunger + Amount, 0.0f, 100.0f);
    OnNeedsChanged();
    return true;
}

bool UWildboundAnimalNeedsComponent::ApplyWater(float Amount)
{
    if (!GetOwner() || !GetOwner()->HasAuthority() || !FMath::IsFinite(Amount) || Amount <= 0.0f)
    {
        return false;
    }

    Thirst = FMath::Clamp(Thirst + Amount, 0.0f, 100.0f);
    OnNeedsChanged();
    return true;
}

void UWildboundAnimalNeedsComponent::OnRep_Needs()
{
    OnNeedsChanged();
}

void UWildboundAnimalNeedsComponent::GetLifetimeReplicatedProps(
    TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(UWildboundAnimalNeedsComponent, Hunger);
    DOREPLIFETIME(UWildboundAnimalNeedsComponent, Thirst);
    DOREPLIFETIME(UWildboundAnimalNeedsComponent, Condition);
}
