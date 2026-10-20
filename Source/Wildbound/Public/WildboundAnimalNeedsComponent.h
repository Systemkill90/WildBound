#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "WildboundAnimalNeedsComponent.generated.h"

/**
 * First animal-care foundation: authoritative, replicated condition values.
 * This is not a complete animal AI, taming, husbandry, or persistence system.
 */
UCLASS(ClassGroup=(Wildbound), meta=(BlueprintSpawnableComponent))
class WILDBOUND_API UWildboundAnimalNeedsComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UWildboundAnimalNeedsComponent();

    virtual void BeginPlay() override;
    virtual void TickComponent(float DeltaTime, ELevelTick TickType,
        FActorComponentTickFunction* ThisTickFunction) override;
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

    UFUNCTION(BlueprintPure, Category="Wildbound|Animal Care")
    float GetHunger() const { return Hunger; }

    UFUNCTION(BlueprintPure, Category="Wildbound|Animal Care")
    float GetThirst() const { return Thirst; }

    UFUNCTION(BlueprintPure, Category="Wildbound|Animal Care")
    float GetCondition() const { return Condition; }

    /** Server-only care entry points. Future interactions must validate access and resource use. */
    bool ApplyFood(float Amount);
    bool ApplyWater(float Amount);

protected:
    UPROPERTY(EditDefaultsOnly, Category="Wildbound|Animal Care", meta=(ClampMin="0.0"))
    float HungerLossPerMinute = 0.5f;

    UPROPERTY(EditDefaultsOnly, Category="Wildbound|Animal Care", meta=(ClampMin="0.0"))
    float ThirstLossPerMinute = 0.75f;

    UPROPERTY(EditDefaultsOnly, Category="Wildbound|Animal Care", meta=(ClampMin="0.0"))
    float ConditionLossPerMinuteWhenDeprived = 1.0f;

    UPROPERTY(ReplicatedUsing=OnRep_Needs, VisibleAnywhere, Category="Wildbound|Animal Care")
    float Hunger = 100.0f;

    UPROPERTY(ReplicatedUsing=OnRep_Needs, VisibleAnywhere, Category="Wildbound|Animal Care")
    float Thirst = 100.0f;

    UPROPERTY(ReplicatedUsing=OnRep_Needs, VisibleAnywhere, Category="Wildbound|Animal Care")
    float Condition = 100.0f;

    UFUNCTION()
    void OnRep_Needs();

    UFUNCTION(BlueprintImplementableEvent, Category="Wildbound|Animal Care")
    void OnNeedsChanged();

private:
    void SimulateNeeds(float DeltaSeconds);
};
