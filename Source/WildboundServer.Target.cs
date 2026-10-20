using UnrealBuildTool;

public class WildboundServerTarget : TargetRules
{
    public WildboundServerTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Server;
        DefaultBuildSettings = BuildSettingsVersion.V2;
        ExtraModuleNames.Add("Wildbound");
    }
}
