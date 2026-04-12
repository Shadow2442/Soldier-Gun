# Reverse Engineering to Implementation

This note translates the ROM analysis into practical build decisions for `Soldier Gun`.

## Proven or strongly supported patterns

- Menu and score screens use compact resource formats.
- The original game has a reusable UI rendering pipeline.
- Some screen/page resources are stored as page-like tile blocks.
- The game uses marker-based interpreted streams.
- Those streams feed runtime state fields.
- Runtime update logic consumes timer-like and delta-like decoded values.

## Implementation consequences

### Menus and pages

Do not hardcode screens in scene logic.

Instead use:

- declarative screen records
- reusable render helpers
- small page resources

### Enemy and event behavior

Do not author all behavior directly in code.

Instead use:

- compact scripted event streams
- sub-pattern dispatch
- per-entity state structs

### Motion and timing

Keep motion deterministic.

Use:

- fixed timestep updates
- timer countdowns
- explicit velocity/delta fields
- predictable scripted transitions

### Tools

Build editor-side formats that can export:

- menu resource data
- caravan wave scripts
- enemy phase scripts
- stage sequence definitions

## Practical design rule

When in doubt, prefer:

- small typed data records
- interpreters for content playback
- explicit runtime state

over:

- large bespoke one-off scripts
- duplicated menu logic
- handwritten per-stage special cases
