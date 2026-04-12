$godot = & "$PSScriptRoot\godot-path.ps1"
$projectPath = Split-Path $PSScriptRoot -Parent
$command = '"{0}" --path "{1}"' -f $godot.Console, $projectPath
$shell = New-Object -ComObject WScript.Shell
$shell.Run($command, 0, $false) | Out-Null
