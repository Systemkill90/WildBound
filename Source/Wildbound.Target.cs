using UnrealBuildTool;

public class WildboundTarget : TargetRules
{
    public WildboundTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;
        DefaultBuildSettings = BuildSettingsVersion.V2;
        ExtraModuleNames.Add("Wildbound");
    }
}
