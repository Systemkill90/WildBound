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

    if (GetWorld() && GetWorld()->GetMapName().Contains(TEXT("GreenveilExploration")))
    {
        DrawRect(FLinearColor(0.012f, 0.020f, 0.018f, 0.72f), 20, 20, 460, 78);
        DrawText(TEXT("WILDBOUND  /  GREENVEIL BASIN"), FLinearColor(0.65f, 0.85f, 0.63f), 34, 30);
        DrawText(TEXT("WASD Move   Mouse Look   Space Jump"), FLinearColor::White, 34, 54);
        DrawText(TEXT("Creekside hamlet - bridge - woodland overlook"), FLinearColor::White, 34, 76);
        return;
    }

    DrawRect(FLinearColor(0.012f, 0.020f, 0.018f, 0.76f), 16.0f, 16.0f, 520.0f, 136.0f);
    DrawRect(FLinearColor(0.51f, 0.87f, 0.66f, 0.9f), 16.0f, 16.0f, 2.0f, 136.0f);

    const FLinearColor Light(0.92f, 0.91f, 0.78f);
    const FLinearColor Accent(0.51f, 0.87f, 0.66f);
    DrawText(TEXT("WILDBOUND   /   GREENVEIL FIELD TEST"),
        Accent, 30.0f, 26.0f);
    DrawText(TEXT("MOVE  WASD     LOOK  MOUSE     JUMP  SPACE"),
        Light, 30.0f, 53.0f);
    DrawText(TEXT("CARE  E Feed   R Water   F Reassure"),
        Light, 30.0f, 77.0f);
    DrawText(TEXT("BUILD  G Place   X Remove"),
        Light, 30.0f, 101.0f);
    AWildboundPrototypePlayerController* PC =
        Cast<AWildboundPrototypePlayerController>(GetOwningPlayerController());
    if (!PC) return;

    DrawText(FString::Printf(TEXT("Feed portions: %d   Water portions: %d"),
        PC->GetFeedServings(), PC->GetWaterServings()), Accent, 30.0f, 125.0f);

    const float CenterX = Canvas->ClipX * 0.5f;
    const float CenterY = Canvas->ClipY * 0.5f;
    DrawLine(CenterX - 6, CenterY, CenterX + 6, CenterY, Light);
    DrawLine(CenterX, CenterY - 6, CenterX, CenterY + 6, Light);

    UWorld* World = GetWorld();
    if (!World) return;
    const float Now = World->GetTimeSeconds();
    if (Now >= NextAnimalTraceTime)
    {
        NextAnimalTraceTime = Now + 0.1f;
        FVector Eye;
        FRotator View;
        PC->GetPlayerViewPoint(Eye, View);
        FCollisionQueryParams Params(SCENE_QUERY_STAT(WildboundHUD), false);
        if (PC->GetPawn()) Params.AddIgnoredActor(PC->GetPawn());

        FHitResult Hit;
        LookedAtAnimal = World->LineTraceSingleByChannel(
                Hit, Eye, Eye + View.Vector() * 525.0f, ECC_Visibility, Params)
            ? Cast<AWildboundPrototypeAnimal>(Hit.GetActor())
            : nullptr;
    }

    if (const AWildboundPrototypeAnimal* Animal = LookedAtAnimal.Get())
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
