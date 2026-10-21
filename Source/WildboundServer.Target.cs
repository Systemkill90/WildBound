using UnrealBuildTool;

public class WildboundServerTarget : TargetRules
{
    public WildboundServerTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Server;
        DefaultBuildSettings = BuildSettingsVersion.V7;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_8;
        ExtraModuleNames.Add("Wildbound");
    }
}
