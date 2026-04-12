# Soldier Gun

`Soldier Gun` is an original Windows shmup project inspired by the fast, readable PC Engine soldier shooters.

## Stack

- Engine: Godot 4.x
- Target: Windows 11 desktop
- Render style: low-resolution pixel art with integer scaling
- Audio style: original PSG/FM-inspired soundtrack and arcade-style sound effects
- Input: keyboard plus generic controller support

## Project goals

- Immediate, low-latency player control
- Clean screen readability under heavy sprite load
- Distinct weapon personalities
- Timed score-attack modes and full-stage progression
- Original art and music with a strong early-90s console shooter feel

## Folder layout

- `docs/`: design, feel, and production notes
- `scenes/`: Godot scenes
- `scripts/`: gameplay code
- `assets/sprites/`: ships, enemies, bullets, UI
- `assets/audio/music/`: soundtrack exports
- `assets/audio/sfx/`: sound effects
- `tools/`: helper scripts and asset notes

## First milestones

1. Boot to a playable test arena in a desktop window
2. Add responsive movement, shooting, and controller input
3. Add enemy waves and a basic score loop
4. Replace placeholder assets with original art and sound

## Status

The repository is scaffolded for Godot 4 development. If Godot is not installed yet, install it and open this folder as a project.

## Local commands

From PowerShell in this folder:

- `.\tools\open-editor.ps1`
- `.\tools\run-project.ps1`

Or use the script-policy-safe launchers:

- `tools\open-editor.cmd`
- `tools\run-project.cmd`
