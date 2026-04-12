# Soldier Gun Specification

`Soldier Gun` is an original Windows shooter inspired by the structural strengths of `Soldier Blade` and its PC Engine peers, without copying their copyrighted content.

## Product goal

Build a modern original shooter that preserves:

- fast, deterministic arcade feel
- compact readable enemy choreography
- strong weapon identity
- clean 4:3 presentation
- Japanese retro sci-fi visual language
- hard-driving chiptune-inspired audio

while modernizing:

- Windows presentation and packaging
- display options and scaling
- audio production quality
- menu flow and shell polish
- internal tooling and data pipeline

## Core pillars

- Readability first: bullets, enemies, pickups, and player state must remain instantly legible.
- Deterministic action: movement, firing, enemy timing, and scripted behavior should feel exact rather than floaty.
- Data-driven content: menus, pages, waves, scripted events, and behavior phases should be authored as compact resources.
- Heroic presentation: the game should feel like a lost late-era HuCard shooter reimagined with tasteful modern polish.

## What to preserve from the analysis

From the reverse-engineering pass, the original game appears to rely on:

- compact text and menu resources
- separate screen/page resources
- interpreted behavior or event streams
- small runtime state tables
- timer and delta driven updates
- hierarchical stream or sub-pattern dispatch

`Soldier Gun` should preserve these principles in spirit:

- screen content is not hardcoded line-by-line
- enemy behavior is not primarily handwritten per encounter
- waves and object patterns are authored as data
- runtime behavior is driven by compact state and deterministic updates

## What not to copy

Do not copy:

- stage layouts
- art
- music
- names from the original game
- exact bosses
- exact weapon visuals
- exact UI compositions
- ROM data or reconstructed scripts

Use the analysis only to preserve:

- architecture patterns
- feel targets
- pacing structure
- presentation discipline

## Target platform

- Windows 11
- distributed as a standalone `.exe`
- double-click launch
- controller support
- keyboard support

## Window and display behavior

### Default launch

- borderless resizable window
- game content rendered in fixed `4:3`
- centered inside the available window area
- no stretch distortion

### Fullscreen

- optional fullscreen toggle
- gameplay remains `4:3`
- centered with pillarboxing/letterboxing as needed
- works cleanly on `4K` and other modern displays

### Internal render target

- fixed low-resolution gameplay buffer
- integer-aware scaling
- presentation layer can upscale cleanly

Recommended starting point:

- internal gameplay resolution: `320x240`

This gives:

- direct PC Engine-era compositional proportions
- clean sprite readability
- good compatibility with scanline and CRT-like filters

## Shell and top bar behavior

The window shell should feel native on Windows while still being stylish.

### Requirements

- hidden top border by default
- top shell appears on hover
- shell includes standard Windows actions:
  - close
  - maximize
  - minimize
- shell also includes:
  - settings access
  - display options access
  - audio options access

## Front-end flow

### Boot flow

1. launch executable
2. show title screen with custom key art inspired by PC Engine box presentation
3. title screen music begins immediately
4. player can proceed to main menu

### Title screen

- original cover-art-inspired composition
- retro sci-fi framing
- strong logo presentation
- subtle animation
- music-led first impression

### Main menu

Main menu should include:

- `Start Game`
- `2 Minute Caravan`
- `5 Minute Caravan`
- `Settings`

Optional later additions:

- `High Scores`
- `Controller Setup`
- `Credits`

### Settings menu

Settings should include:

- display mode
- fullscreen toggle
- resolution/scaling behavior
- scanlines toggle
- scanline intensity
- pixel filter style
- audio volume
- music volume
- sfx volume
- controller mapping

The settings menu should also include:

- creator credit for `Slim Shady`
- a stylized retro animation treatment
- custom menu sound/music behavior

## Gameplay modes

### Main mode

- full stage progression
- score play with survival pressure
- weapon and support management

### Caravan modes

- `2 Minute Caravan`
- `5 Minute Caravan`

These should be designed as:

- score-attack focused
- short, replayable
- timing and routing driven

## Gameplay feel targets

### Player control

- immediate input response
- low latency
- fast but controllable ship speed
- clear recovery from edge movement

### Shooting

- strong shot cadence
- bright readable projectile language
- weapons with distinct spatial roles

### Enemy behavior

- choreographed waves
- deterministic entry timing
- readable threat buildup
- bosses that are dramatic but fair

### Runtime model

The reverse-engineering strongly suggests a good fit for:

- compact scripted behavior streams
- per-entity runtime state
- timer fields
- delta/velocity fields
- sub-pattern dispatch

So `Soldier Gun` should use:

- data-authored enemy wave resources
- tokenized behavior/event sequences
- small runtime structs for active entities

## Visual direction

### Aesthetic

- original Japanese retro sci-fi
- sharp mecha-inspired silhouettes
- heroic red player craft
- cyan support accents
- teal/steel/olive enemy machinery
- painterly box-art influence for menus and key art

### In-game priorities

- large readable shape masses
- bright bullets
- strong separation of foreground and background
- detailed sprites that remain readable in motion

### Stage direction

Target stage families:

- military-industrial fortress zone
- desert assault front
- atmospheric cloud stage
- black-space boss presentation

## Audio direction

### Music

- chiptune-inspired
- PSG/FM flavored
- more aggressive and modern in production
- strong melodic hooks
- hard-driving rhythm

### SFX

- crisp shot transients
- explosive but not muddy impacts
- distinct pickup tones
- bold bomb activation cue

## Content pipeline

### Recommended asset layers

1. UI/text resources
2. screen/page resources
3. scripted behavior streams
4. enemy/wave definitions
5. sprite sheets and animations
6. music and sound assets

### Recommended logic layers

1. screen/menu renderer
2. gameplay scene runner
3. event/behavior decoder
4. entity runtime state update
5. renderer and effects pass

## Technical implementation guidance

Use `Godot 4` as the main engine.

Reasons:

- strong Windows export pipeline
- good controller support
- straightforward fullscreen/window handling
- efficient 2D workflows
- easy shader-based scanline and presentation options
- fast iteration for a content-heavy shmup

## First implementation milestones

1. stable Windows shell with `4:3` gameplay viewport
2. title screen and main menu flow
3. player movement, firing, and controller support
4. first scripted enemy-wave prototype
5. first caravan prototype
6. first visual filter/settings pass
7. first original soundtrack and SFX pass

## Definition of success

`Soldier Gun` should feel like:

- a real original successor to the PC Engine soldier-shooter lineage
- instantly readable and fast
- modern enough to feel polished on Windows 11
- retro enough to feel authentic in motion, sound, and presentation
