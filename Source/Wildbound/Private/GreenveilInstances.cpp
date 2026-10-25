#include "GreenveilInstances.h"
#include "Components/HierarchicalInstancedStaticMeshComponent.h"
#include "Engine/World.h"
#include "NavigationSystem.h"
#include "NavMesh/NavMeshBoundsVolume.h"
#include "NavigationData.h"
#include "EngineUtils.h"
#if WITH_EDITOR
#include "Builders/CubeBuilder.h"
#include "AssetCompilingManager.h"
#include "ActorFactories/ActorFactory.h"
#endif
AGreenveilInstances::AGreenveilInstances()
{
    Instances=CreateDefaultSubobject<UHierarchicalInstancedStaticMeshComponent>(TEXT("Instances"));
    SetRootComponent(Instances);
    Instances->SetMobility(EComponentMobility::Static);
}
void UGreenveilAuthoring::CreateNavigationBounds(UObject* WorldContext)
{
#if WITH_EDITOR
    UWorld* World=WorldContext?WorldContext->GetWorld():nullptr;
    if (!World) return;
    FAssetCompilingManager::Get().FinishAllCompilation();
    auto* Bounds=World->SpawnActor<ANavMeshBoundsVolume>(FVector(0,0,500),FRotator::ZeroRotator);
    auto* Builder=NewObject<UCubeBuilder>();
    Builder->X=18000; Builder->Y=16000; Builder->Z=4000;
    UActorFactory::CreateBrushForVolumeActor(Bounds,Builder);
    Bounds->SetActorLabel(TEXT("Greenveil Navigation Bounds"));
    Bounds->SetActorLocation(FVector(0,0,500));
    UE_LOG(LogTemp,Display,TEXT("GREENVEIL_NAV_BOUNDS %s"),*Bounds->GetComponentsBoundingBox(true).ToString());
    if(auto* Nav=FNavigationSystem::GetCurrent<UNavigationSystemV1>(World))
    {
        Nav->OnNavigationBoundsUpdated(Bounds);
        Nav->RemoveNavigationBuildLock(0xff);
        Nav->ReleaseInitialBuildingLock();
        ANavigationData* Data=Nav->GetDefaultNavDataInstance(FNavigationSystem::Create);
        for (TActorIterator<AActor> It(World); It; ++It) UNavigationSystemV1::UpdateActorInNavOctree(**It);
        Nav->Build();
        if (Data) Data->EnsureBuildCompletion();
        FNavLocation Projected;
        UE_LOG(LogTemp,Display,TEXT("GREENVEIL_AUTHORING_NAV projected=%d"),Nav->ProjectPointToNavigation(FVector(-4500,-3500,150),Projected,FVector(200,200,500)));
    }
#endif
}
