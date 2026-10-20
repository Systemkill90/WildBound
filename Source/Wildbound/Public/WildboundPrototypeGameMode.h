#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "WildboundPrototypeGameMode.generated.h"

/**
 * Greenveil engineering playground. Spawns temporary cubes/spheres at runtime
 * so there is no required third-party asset or downloadable content pack.
 */
UCLASS()
class WILDBOUND_API AWildboundPrototypeGameMode : public AGameModeBase
{
    GENERATED_BODY()

public:
    AWildboundPrototypeGameMode();

protected:
    virtual void BeginPlay() override;
};
