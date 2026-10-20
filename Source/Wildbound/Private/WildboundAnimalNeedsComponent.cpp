#include "WildboundAnimalNeedsComponent.h"

#include "WildboundAnimalSimulation.h"
#include "GameFramework/Actor.h"
#include "Net/UnrealNetwork.h"

namespace
{
WildboundSim::FAnimalVitals ToModel(const FWildboundAnimalVitals& V)
{
    WildboundSim::FAnimalVitals Out;
    Out.Hunger = V.Hunger;
    Out.Thirst = V.Thirst;
    Out.Condition = V.Condition;
    Out.Stress = V.Stress;
    Out.Trust = V.Trust;
    return Out;
}

void FromModel(const WildboundSim::FAnimalVitals& Source, FWildboundAnimalVitals& Target)
{
    Target.Hunger = Source.Hunger;
    Target.Thirst = Source.Thirst;
    Target.Condition = Source.Condition;
    Target.Stress = Source.Stress;
    Target.Trust = Source.Trust;
}
}

UWildboundAnimalNeedsComponent::UWildboundAnimalNeedsComponent()
{
    PrimaryComponentTick.bCanEverTick = true;
    SetIsReplicatedByDefault(true);
}

void UWildboundAnimalNeedsComponent::TickComponent(
    float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

    if (!GetOwner() || !GetOwner()->HasAuthority() || DeltaTime <= 0.0f)
    {
        return;
    }

    // Update at most once a second, avoiding a Blueprint event every render frame.
    // Excessive frame hitches are bounded; there is no unattended/offline progress.
    AccumulatedSeconds += FMath::Min(DeltaTime, 5.0f);
    if (AccumulatedSeconds < 1.0f)
    {
        return;
    }

    WildboundSim::FAnimalVitals Model = ToModel(Vitals);
    WildboundSim::FNeedsRates Rates;
    Rates.HungerLossPerMinute = HungerLossPerMinute;
    Rates.ThirstLossPerMinute = ThirstLossPerMinute;
    Rates.ConditionLossPerMinute = ConditionLossPerMinute;
    Rates.RecoveryPerMinute = RecoveryPerMinute;

    WildboundSim::Advance(Model, Rates, AccumulatedSeconds, bSheltered);
    AccumulatedSeconds = 0.0f;
    FromModel(Model, Vitals);
    OnVitalsChanged();
}

bool UWildboundAnimalNeedsComponent::TryCare(EWildboundCareAction Action)
{
    if (!GetOwner() || !GetOwner()->HasAuthority())
    {
        return false;
    }

    WildboundSim::ECareAction ModelAction;
    switch (Action)
    {
    case EWildboundCareAction::Feed: ModelAction = WildboundSim::ECareAction::Feed; break;
    case EWildboundCareAction::Water: ModelAction = WildboundSim::ECareAction::Water; break;
    case EWildboundCareAction::Reassure: ModelAction = WildboundSim::ECareAction::Reassure; break;
    default: return false;
    }

    WildboundSim::FAnimalVitals Model = ToModel(Vitals);
    if (!WildboundSim::ApplyCare(Model, ModelAction))
    {
        return false;
    }
    FromModel(Model, Vitals);
    OnVitalsChanged();
    return true;
}

void UWildboundAnimalNeedsComponent::SetSheltered(bool bNewSheltered)
{
    if (GetOwner() && GetOwner()->HasAuthority())
    {
        bSheltered = bNewSheltered;
    }
}

void UWildboundAnimalNeedsComponent::OnRep_Vitals()
{
    OnVitalsChanged();
}

void UWildboundAnimalNeedsComponent::GetLifetimeReplicatedProps(
    TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(UWildboundAnimalNeedsComponent, Vitals);
}
