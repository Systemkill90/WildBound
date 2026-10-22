#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "GreenveilTraversalProbe.generated.h"

// Development-only opt-in traversal through the real CharacterMovement path.
UCLASS()
class WILDBOUND_API AGreenveilTraversalProbe : public AActor
{
    GENERATED_BODY()
public:
    AGreenveilTraversalProbe();
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaSeconds) override;
private:
    TArray<FVector> Route;
    TArray<double> Frames;
    int32 Leg = 0;
    int32 NavigationFailures = 0;
    double Started = 0, LegStarted = 0, Previous = 0;
    float Travel = 0;
    FVector LastLocation = FVector::ZeroVector;
    bool Finished = false;
    void Finish(bool Passed, const FString& Reason);
};
