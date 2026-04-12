$godot = & "$PSScriptRoot\godot-path.ps1"
$projectPath = Split-Path $PSScriptRoot -Parent

Start-Process -FilePath $godot.Editor -ArgumentList "--path", $projectPath
