#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "GreenveilInstances.generated.h"
class UHierarchicalInstancedStaticMeshComponent;
UCLASS()
class WILDBOUND_API AGreenveilInstances : public AActor
{
    GENERATED_BODY()
public:
    AGreenveilInstances();
    UPROPERTY(VisibleAnywhere,BlueprintReadOnly)
    TObjectPtr<UHierarchicalInstancedStaticMeshComponent> Instances;
};
UCLASS()
class WILDBOUND_API UGreenveilAuthoring : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable,Category="Greenveil")
    static void CreateNavigationBounds(UObject* WorldContext);
};
