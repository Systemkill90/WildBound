#pragma once

#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "WildboundPrototypeHUD.generated.h"

/** Read-only temporary HUD for observing test controls and replicated needs. */
UCLASS()
class WILDBOUND_API AWildboundPrototypeHUD : public AHUD
{
    GENERATED_BODY()

public:
    virtual void DrawHUD() override;
};
