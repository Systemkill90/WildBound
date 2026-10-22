#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "WildboundPrototypeGameMode.generated.h"

/**
 * Greenveil test map. Supplies ground and animal actors only when a level does
 * not already contain them, so the saved map and engine Entry map both work.
 */
UCLASS()
class WILDBOUND_API AWildboundPrototypeGameMode : public AGameModeBase
{
    GENERATED_BODY()

public:
    AWildboundPrototypeGameMode();

protected:
    virtual AActor* ChoosePlayerStart_Implementation(AController* Player) override;
    virtual void BeginPlay() override;
};
