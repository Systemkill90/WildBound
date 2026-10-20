#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "WildboundAnimalNeedsComponent.generated.h"

UENUM(BlueprintType)
enum class EWildboundCareAction : uint8
{
    Feed UMETA(DisplayName="Feed"),
    Water UMETA(DisplayName="Give Water"),
    Reassure UMETA(DisplayName="Reassure")
};

USTRUCT(BlueprintType)
struct FWildboundAnimalVitals
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category="Wildbound|Animal")
    float Hunger = 80.0f;

    UPROPERTY(BlueprintReadOnly, Category="Wildbound|Animal")
    float Thirst = 80.0f;

    UPROPERTY(BlueprintReadOnly, Category="Wildbound|Animal")
    float Condition = 100.0f;

    UPROPERTY(BlueprintReadOnly, Category="Wildbound|Animal")
    float Stress = 25.0f;

    UPROPERTY(BlueprintReadOnly, Category="Wildbound|Animal")
    float Trust = 5.0f;
};

/** Initial animal condition model: server-controlled and replicated, not saved. */
UCLASS(ClassGroup=(Wildbound), meta=(BlueprintSpawnableComponent))
class WILDBOUND_API UWildboundAnimalNeedsComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UWildboundAnimalNeedsComponent();

    virtual void TickComponent(float DeltaTime, ELevelTick TickType,
        FActorComponentTickFunction* ThisTickFunction) override;
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

    UFUNCTION(BlueprintPure, Category="Wildbound|Animal Care")
    FWildboundAnimalVitals GetVitals() const { return Vitals; }

    UFUNCTION(BlueprintPure, Category="Wildbound|Animal Care")
    float GetHunger() const { return Vitals.Hunger; }

    UFUNCTION(BlueprintPure, Category="Wildbound|Animal Care")
    float GetThirst() const { return Vitals.Thirst; }

    UFUNCTION(BlueprintPure, Category="Wildbound|Animal Care")
    float GetCondition() const { return Vitals.Condition; }

    UFUNCTION(BlueprintPure, Category="Wildbound|Animal Care")
    float GetStress() const { return Vitals.Stress; }

    UFUNCTION(BlueprintPure, Category="Wildbound|Animal Care")
    float GetTrust() const { return Vitals.Trust; }

    /**
     * Must only be called by trusted server code after verifying player distance,
     * resource ownership/consumption, action validity and cooldown.
     * This method is intentionally not a client-callable RPC.
     */
    bool TryCare(EWildboundCareAction Action);

    /** Server-only environmental input; not a proof of actual shelter detection. */
    void SetSheltered(bool bNewSheltered);

protected:
    UPROPERTY(EditDefaultsOnly, Category="Wildbound|Animal Care", meta=(ClampMin="0"))
    float HungerLossPerMinute = 0.5f;

    UPROPERTY(EditDefaultsOnly, Category="Wildbound|Animal Care", meta=(ClampMin="0"))
    float ThirstLossPerMinute = 0.75f;

    UPROPERTY(EditDefaultsOnly, Category="Wildbound|Animal Care", meta=(ClampMin="0"))
    float ConditionLossPerMinute = 2.0f;

    UPROPERTY(EditDefaultsOnly, Category="Wildbound|Animal Care", meta=(ClampMin="0"))
    float RecoveryPerMinute = 0.5f;

    UPROPERTY(ReplicatedUsing=OnRep_Vitals, VisibleAnywhere, Category="Wildbound|Animal Care")
    FWildboundAnimalVitals Vitals;

    UFUNCTION()
    void OnRep_Vitals();

    UFUNCTION(BlueprintImplementableEvent, Category="Wildbound|Animal Care")
    void OnVitalsChanged();

private:
    float AccumulatedSeconds = 0.0f;
    bool bSheltered = false;
};
