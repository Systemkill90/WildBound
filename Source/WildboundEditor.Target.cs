using UnrealBuildTool;

public class WildboundEditorTarget : TargetRules
{
    public WildboundEditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.V2;
        ExtraModuleNames.Add("Wildbound");
    }
}
