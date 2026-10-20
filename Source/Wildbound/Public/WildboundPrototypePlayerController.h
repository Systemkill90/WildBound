#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "WildboundAnimalNeedsComponent.h"
#include "WildboundPrototypePlayerController.generated.h"

class AWildboundPrototypeAnimal;
class AWildboundPrototypeBuildBlock;

/**
 * Owning-player RPC entry point for care and block placement. Server validates
 * distance, visibility, inventory and cooldown. Still only a development harness.
 */
UCLASS()
class WILDBOUND_API AWildboundPrototypePlayerController : public APlayerController
{
    GENERATED_BODY()

public:
    AWildboundPrototypePlayerController();
    virtual void SetupInputComponent() override;
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

protected:
    UPROPERTY(Replicated, VisibleAnywhere, Category="Wildbound|Prototype")
    int32 FeedServings = 8;

    UPROPERTY(Replicated, VisibleAnywhere, Category="Wildbound|Prototype")
    int32 WaterServings = 8;

private:
    void FeedViewedAnimal();
    void WaterViewedAnimal();
    void ReassureViewedAnimal();
    void PlaceBlock();
    void RemoveBlock();

    AActor* GetViewedActor(float MaxDistance) const;
    void RequestCare(EWildboundCareAction Action);

    UFUNCTION(Server, Reliable)
    void ServerCareAnimal(AWildboundPrototypeAnimal* Target, EWildboundCareAction Action);

    UFUNCTION(Server, Reliable)
    void ServerPlaceBlock(FVector_NetQuantize ProposedLocation);

    UFUNCTION(Server, Reliable)
    void ServerRemoveBlock(AWildboundPrototypeBuildBlock* Target);

    bool CanReachActor(const AActor* Target, float MaxDistance) const;
    float LastCareTime = -100.0f;
    float LastBuildTime = -100.0f;
};
