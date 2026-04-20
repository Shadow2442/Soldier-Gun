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

- `game/`: the actual game source and runtime assets
- `project/`: internal docs, research, captures, and soundtrack work
- `website/`: only public-facing site files and release media
- `tools/`: helper scripts and internal utilities
- `builds/`: exported builds and download packages

## Internal structure

- `game/scenes/`: Godot scenes
- `game/scripts/`: gameplay code
- `game/assets/`: sprites, source art, and runtime visuals
- `game/artwork/`: title art and other game-facing artwork
- `game/audio/music/`: music used by the game
- `game/audio/sfx/`: sound effects and sound-design references
- `project/docs/`: design, feel, and production notes
- `project/analysis/`: reverse-engineering notes and review outputs
- `project/references/`: curated captures and study material
- `project/music/`: soundtrack drafts, previews, and release packages
- `project/music/releases/`: packaged soundtrack drops and GitHub-ready release assets

## First milestones

1. Boot to a playable test arena in a desktop window
2. Add responsive movement, shooting, and controller input
3. Add enemy waves and a basic score loop
4. Replace placeholder assets with original art and sound

## Status

The repository is scaffolded for Godot 4 development. If Godot is not installed yet, install it and open this folder as a project.

The public website also includes a browser-playable ship animation test layer. It currently supports:

- steerable ship movement and strafing
- pulse weapon phase selection
- approved idle / forward / reverse / strafe thruster visuals
- synced muzzle flashes, shot audio, and thruster audio cues

Latest soundtrack release work:

- Stage 1 Boss A and B are now featured on the website as new soundtrack previews
- the packaged release bundle lives in `project/music/releases/SOLDIER GUN - STAGE 1 BOSS THEMES (2026 Preview)/`
- the release archive is `soldier-gun-stage-1-boss-themes-2026-preview.zip`

## Website / Pages

- Public site source lives in `website/`
- GitHub Pages is published from the `gh-pages` branch, generated from the `website/` subtree
- Root `index.html`, `site.css`, and `site.js` are kept as a local mirror/prototype surface during development

If the live site needs a refresh after local changes:

1. Commit the website-facing changes on `main`
2. Push `main`
3. Push the `website/` subtree to `gh-pages`

## Local commands

From PowerShell in this folder:

- `.\tools\open-editor.ps1`
- `.\tools\run-project.ps1`

Or use the script-policy-safe launchers:

- `tools\open-editor.cmd`
- `tools\run-project.cmd`
- `tools\open-website.cmd`
