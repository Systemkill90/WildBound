#include "WildboundPrototypeGameMode.h"
#include "GreenveilTraversalProbe.h"

#include "WildboundPrototypeAnimal.h"
#include "WildboundPrototypeCharacter.h"
#include "WildboundPrototypeGround.h"
#include "WildboundPrototypeHUD.h"
#include "WildboundPrototypePlayerController.h"
#include "Engine/PostProcessVolume.h"
#include "Engine/World.h"
#include "EngineUtils.h"
#include "GameFramework/PlayerStart.h"
#include "GameFramework/Character.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/PlayerController.h"
#include "Misc/CommandLine.h"
#include "Misc/Parse.h"
#include "TimerManager.h"

AWildboundPrototypeGameMode::AWildboundPrototypeGameMode()
{
    DefaultPawnClass = AWildboundPrototypeCharacter::StaticClass();
    PlayerControllerClass = AWildboundPrototypePlayerController::StaticClass();
    HUDClass = AWildboundPrototypeHUD::StaticClass();
}

AActor* AWildboundPrototypeGameMode::ChoosePlayerStart_Implementation(
    AController* Player)
{
    AActor* Start = Super::ChoosePlayerStart_Implementation(Player);
    const UWorld* World = GetWorld();
    if (Start && World
        && World->GetMapName().Contains(TEXT("ElectricDreams_PCGCloseRange")))
    {
        // The sample's drone-facing start points straight into a massive root
        // cluster. Turn the Wildbound third-person preview toward the trail.
        FRotator SpawnRotation = Start->GetActorRotation();
        SpawnRotation.Yaw = FRotator::NormalizeAxis(SpawnRotation.Yaw + 180.0f);
        Start->SetActorRotation(SpawnRotation);
        UE_LOG(LogTemp, Log, TEXT("Wildbound Electric Dreams start: %s, yaw %.1f"),
            *Start->GetActorLocation().ToCompactString(), SpawnRotation.Yaw);
    }
    return Start;
}

void AWildboundPrototypeGameMode::BeginPlay()
{
    Super::BeginPlay();

    UWorld* World = GetWorld();
    if (!World || !HasAuthority()) return;

    // Give the Greenveil slice a restrained, readable finish without changing
    // its authored lighting or foliage: lower the exposure to protect sunlit
    // ground and cottage highlights, balance local contrast, and tame glare.
    bool bHasWildboundGrade = false;
    for (TActorIterator<APostProcessVolume> It(World); It; ++It)
    {
        if (It->ActorHasTag(TEXT("Wildbound_FieldGrade")))
        {
            bHasWildboundGrade = true;
            break;
        }
    }
    if (!bHasWildboundGrade)
    {
        APostProcessVolume* Grade = World->SpawnActor<APostProcessVolume>(
            FVector::ZeroVector, FRotator::ZeroRotator);
        if (Grade)
        {
            Grade->Tags.Add(TEXT("Wildbound_FieldGrade"));
            Grade->bUnbound = true;
            Grade->Priority = 100.0f;
            Grade->BlendWeight = 1.0f;
            Grade->Settings.bOverride_AutoExposureBias = true;
            Grade->Settings.AutoExposureBias = -1.5f;
            Grade->Settings.bOverride_LocalExposureMethod = true;
            Grade->Settings.LocalExposureMethod = ELocalExposureMethod::Bilateral;
            Grade->Settings.bOverride_LocalExposureHighlightContrastScale = true;
            Grade->Settings.LocalExposureHighlightContrastScale = 0.68f;
            Grade->Settings.bOverride_LocalExposureShadowContrastScale = true;
            Grade->Settings.LocalExposureShadowContrastScale = 0.78f;
            Grade->Settings.bOverride_ColorSaturation = true;
            Grade->Settings.ColorSaturation = FVector4(0.94f, 0.96f, 0.92f, 1.0f);
            Grade->Settings.bOverride_BloomIntensity = true;
            Grade->Settings.BloomIntensity = 0.28f;
            UE_LOG(LogTemp, Log, TEXT("Wildbound field color grade enabled"));
        }
    }

    // The Electric Dreams sample carries a drone-only control card. Hide that
    // sample instruction actor when the Wildbound game mode is active.
    for (TActorIterator<AActor> It(World); It; ++It)
    {
        if (It->GetClass()->GetName().Contains(TEXT("DroneInstructions")))
        {
            It->SetActorHiddenInGame(true);
            It->SetActorEnableCollision(false);
        }
    }

    FActorSpawnParameters Params;
    Params.SpawnCollisionHandlingOverride =
        ESpawnActorCollisionHandlingMethod::AlwaysSpawn;

    APlayerStart* AuthoredPlayerStart = nullptr;
    for (TActorIterator<APlayerStart> It(World); It; ++It)
    {
        AuthoredPlayerStart = *It;
        break;
    }

    bool bHasGround = false;
    for (TActorIterator<AWildboundPrototypeGround> It(World); It; ++It)
    {
        bHasGround = true;
        break;
    }
    // Authored test maps provide their own terrain. Only create the bootstrap
    // platform for a bare fallback map that also lacks a PlayerStart.
    if (!bHasGround && !AuthoredPlayerStart)
    {
        World->SpawnActor<AWildboundPrototypeGround>(
            FVector(0, 0, -25), FRotator::ZeroRotator, Params);
    }

    bool bHasAnimal = false;
    for (TActorIterator<AWildboundPrototypeAnimal> It(World); It; ++It)
    {
        bHasAnimal = true;
        break;
    }
    if (!bHasAnimal && !World->GetMapName().Contains(TEXT("GreenveilExploration")))
    {
        const FVector AnimalLocation = AuthoredPlayerStart
            ? AuthoredPlayerStart->GetActorLocation()
                + AuthoredPlayerStart->GetActorForwardVector() * 250.0f
            : FVector(450, 0, 82);
        World->SpawnActor<AWildboundPrototypeAnimal>(
            AnimalLocation, FRotator::ZeroRotator, Params);
    }

#if !UE_BUILD_SHIPPING
    if (World->GetMapName().Contains(TEXT("GreenveilExploration"))
        && FParse::Param(FCommandLine::Get(), TEXT("GreenveilTraversalTest")))
    {
        World->SpawnActor<AGreenveilTraversalProbe>();
    }
    if (FParse::Param(FCommandLine::Get(), TEXT("WildboundAutoMovementTest")))
    {
        TWeakObjectPtr<AWildboundPrototypeGameMode> WeakThis(this);
        FTimerHandle StartHandle;
        World->GetTimerManager().SetTimer(StartHandle,
            FTimerDelegate::CreateLambda([WeakThis]()
            {
                AWildboundPrototypeGameMode* GameMode = WeakThis.Get();
                if (!GameMode || !GameMode->GetWorld()) return;
                UWorld* TestWorld = GameMode->GetWorld();
                APlayerController* PC = TestWorld->GetFirstPlayerController();
                ACharacter* Character = PC ? Cast<ACharacter>(PC->GetPawn()) : nullptr;
                if (!PC || !Character)
                {
                    UE_LOG(LogTemp, Error, TEXT("AUTO_MOVE_TEST FAIL: player controller or character not ready"));
                    return;
                }

                struct FAutoMoveState
                {
                    FVector StartLocation;
                    FRotator StartRotation;
                    double StartTime = 0.0;
                    FTimerHandle TestHandle;
                };
                TSharedRef<FAutoMoveState> State = MakeShared<FAutoMoveState>();
                State->StartLocation = Character->GetActorLocation();
                State->StartRotation = PC->GetControlRotation();
                State->StartTime = TestWorld->GetTimeSeconds();
                UE_LOG(LogTemp, Display,
                    TEXT("AUTO_MOVE_TEST START: loc=%s control=%s"),
                    *State->StartLocation.ToCompactString(),
                    *State->StartRotation.ToCompactString());

                TWeakObjectPtr<ACharacter> WeakCharacter(Character);
                TWeakObjectPtr<APlayerController> WeakPC(PC);
                TWeakObjectPtr<UWorld> WeakWorld(TestWorld);
                FTimerDelegate Step = FTimerDelegate::CreateLambda(
                    [State, WeakCharacter, WeakPC, WeakWorld]()
                    {
                        ACharacter* Pawn = WeakCharacter.Get();
                        APlayerController* Controller = WeakPC.Get();
                        UWorld* WorldNow = WeakWorld.Get();
                        if (!Pawn || !Controller || !WorldNow) return;
                        const double Elapsed = WorldNow->GetTimeSeconds() - State->StartTime;
                        FRotator Control = Controller->GetControlRotation();
                        if (Elapsed < 1.25)
                        {
                            Pawn->AddMovementInput(FRotationMatrix(Control).GetUnitAxis(EAxis::X), 1.0f);
                        }
                        else if (Elapsed < 2.5)
                        {
                            Control.Yaw = State->StartRotation.Yaw + 55.0f;
                            Controller->SetControlRotation(Control);
                            Pawn->AddMovementInput(FRotationMatrix(Control).GetUnitAxis(EAxis::X), 1.0f);
                        }
                        else if (Elapsed < 3.5)
                        {
                            Pawn->AddMovementInput(FRotationMatrix(Control).GetUnitAxis(EAxis::Y), 1.0f);
                        }
                        else
                        {
                            WorldNow->GetTimerManager().ClearTimer(State->TestHandle);
                            const FVector EndLocation = Pawn->GetActorLocation();
                            const FRotator EndRotation = Controller->GetControlRotation();
                            const float Distance = FVector::Dist2D(State->StartLocation, EndLocation);
                            const float YawDelta = FMath::Abs(FRotator::NormalizeAxis(EndRotation.Yaw - State->StartRotation.Yaw));
                            const UCharacterMovementComponent* Movement = Pawn->GetCharacterMovement();
                            const bool bPassed = Distance > 100.0f && YawDelta > 30.0f;
                            const TCHAR* Result = bPassed ? TEXT("PASS") : TEXT("FAIL");
                            const FString Summary = FString::Printf(
                                TEXT("AUTO_MOVE_TEST %s: start=%s end=%s distance2d=%.1fcm yawStart=%.1f yawEnd=%.1f yawDelta=%.1f grounded=%s mode=%d"),
                                Result,
                                *State->StartLocation.ToCompactString(), *EndLocation.ToCompactString(),
                                Distance, State->StartRotation.Yaw, EndRotation.Yaw, YawDelta,
                                Movement && Movement->IsMovingOnGround() ? TEXT("yes") : TEXT("no"),
                                Movement ? static_cast<int32>(Movement->MovementMode) : -1);
                            if (bPassed)
                            {
                                UE_LOG(LogTemp, Display, TEXT("%s"), *Summary);
                            }
                            else
                            {
                                UE_LOG(LogTemp, Error, TEXT("%s"), *Summary);
                            }
                        }
                    });
                TestWorld->GetTimerManager().SetTimer(State->TestHandle, Step, 0.025f, true);
            }), 1.5f, false);
    }
#endif
}
