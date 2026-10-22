#include "WildboundPrototypeHUD.h"

#include "WildboundAnimalNeedsComponent.h"
#include "WildboundPrototypeAnimal.h"
#include "WildboundPrototypePlayerController.h"
#include "Engine/Canvas.h"
#include "Engine/World.h"
#include "GameFramework/Pawn.h"

void AWildboundPrototypeHUD::DrawHUD()
{
    Super::DrawHUD();
    if (!Canvas) return;

    DrawRect(FLinearColor(0.015f, 0.025f, 0.024f, 0.78f), 14.0f, 14.0f, 670.0f, 174.0f);

    const FLinearColor Light(0.92f, 0.91f, 0.78f);
    const FLinearColor Accent(0.51f, 0.87f, 0.66f);
    DrawText(TEXT("WILDBOUND  |  PRE-ALPHA FOREST BASE"),
        Accent, 24.0f, 22.0f);
    DrawText(TEXT("WASD move | Mouse look | Space jump"),
        Light, 24.0f, 51.0f);
    DrawText(TEXT("Look at deer: E feed | R water | F reassure"),
        Light, 24.0f, 73.0f);
    DrawText(TEXT("G place snapped block | X remove aimed block"),
        Light, 24.0f, 95.0f);
    AWildboundPrototypePlayerController* PC =
        Cast<AWildboundPrototypePlayerController>(GetOwningPlayerController());
    if (!PC) return;

    DrawText(FString::Printf(TEXT("Feed portions: %d   Water portions: %d"),
        PC->GetFeedServings(), PC->GetWaterServings()), Accent, 24.0f, 146.0f);

    const float CenterX = Canvas->ClipX * 0.5f;
    const float CenterY = Canvas->ClipY * 0.5f;
    DrawLine(CenterX - 6, CenterY, CenterX + 6, CenterY, Light);
    DrawLine(CenterX, CenterY - 6, CenterX, CenterY + 6, Light);

    UWorld* World = GetWorld();
    if (!World) return;
    FVector Eye;
    FRotator View;
    PC->GetPlayerViewPoint(Eye, View);
    FCollisionQueryParams Params(SCENE_QUERY_STAT(WildboundHUD), false);
    if (PC->GetPawn()) Params.AddIgnoredActor(PC->GetPawn());

    FHitResult Hit;
    if (!World->LineTraceSingleByChannel(
            Hit, Eye, Eye + View.Vector() * 525.0f, ECC_Visibility, Params))
    {
        return;
    }

    if (const AWildboundPrototypeAnimal* Animal =
            Cast<AWildboundPrototypeAnimal>(Hit.GetActor()))
    {
        const UWildboundAnimalNeedsComponent* Needs = Animal->GetNeeds();
        if (!Needs) return;
        const FWildboundAnimalVitals V = Needs->GetVitals();
        DrawText(TEXT("GREENVEIL DEER  |  Wild herbivore"),
            Accent, 24.0f, 191.0f);
        DrawText(FString::Printf(
            TEXT("Hunger %.0f | Thirst %.0f | Condition %.0f | Stress %.0f | Trust %.0f"),
            V.Hunger, V.Thirst, V.Condition, V.Stress, V.Trust),
            Light, 24.0f, 213.0f);
    }
}
