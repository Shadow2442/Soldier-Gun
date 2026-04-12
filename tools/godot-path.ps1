$packageRoot = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages\GodotEngine.GodotEngine_Microsoft.Winget.Source_8wekyb3d8bbwe"
$consoleExe = Join-Path $packageRoot "Godot_v4.6.2-stable_win64_console.exe"
$editorExe = Join-Path $packageRoot "Godot_v4.6.2-stable_win64.exe"

if (-not (Test-Path $editorExe)) {
    throw "Godot editor executable not found. Reinstall the winget package 'GodotEngine.GodotEngine'."
}

[PSCustomObject]@{
    Editor = $editorExe
    Console = $consoleExe
}
