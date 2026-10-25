#pragma once

#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "WildboundPrototypeHUD.generated.h"

class AWildboundPrototypeAnimal;

/** Read-only temporary HUD for observing test controls and replicated needs. */
UCLASS()
class WILDBOUND_API AWildboundPrototypeHUD : public AHUD
{
    GENERATED_BODY()

public:
    virtual void DrawHUD() override;

private:
    TWeakObjectPtr<AWildboundPrototypeAnimal> LookedAtAnimal;
    float NextAnimalTraceTime = 0.0f;
};
