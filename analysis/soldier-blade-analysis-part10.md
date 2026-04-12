# Soldier Blade ROM Analysis, Part 10

## The decoded `3Dxx/3Exx` state is actively consumed by a runtime update loop
The probe of the decoded state fields shows that the values written by the marker decoder are not passive data caches. They are read almost immediately by a tightly connected runtime logic cluster around `0x02CEEC` to `0x02D030`.

This is the clearest link yet between:
- interpreted content streams
- decoded runtime state
- actual gameplay/system behavior

## Best current role guesses for key fields

### `$3E2E`
This field is checked, decremented, and reset in the core loop:

```text
02CF14  BD 2E 3E C9 FF F0 57 DE 2E 3E 80 52
```

Interpretation:
- this behaves like a countdown / delay / phase timer
- `FF` appears to mean a sentinel state
- otherwise it is decremented every update tick or every pass through this logic

This is strong evidence that the decoder is feeding time-based scripted behavior, not just static properties.

### `$3DFE` and `$3E0A`
These are added into `$3DE6` and `$3DF2`:

```text
02CEF4  BD E6 3D 18 7D FE 3D 9D E6 3D
02CEFC  BD F2 3D 7D 0A 3E 10 0B 62 9D E6 3D
```

Interpretation:
- `$3DE6` and `$3DF2` look like live accumulators/positions
- `$3DFE` and `$3E0A` look like per-step deltas, velocities, or increments
- there is sign/overflow handling and clamping behavior nearby, which reinforces this reading

This strongly suggests a motion/update subsystem:
- base state
- per-frame delta
- clamped result

### `$3DDA`
This is repeatedly updated/reset around decode transitions and is used as the stream offset:
- it acts like the current command pointer within the selected content stream

Interpretation:
- stream program counter / command offset

### `$3DCE`
This indexes the substream dispatch table:
- it is derived from earlier stream content
- it appears to select a command family, behavior family, or script branch

Interpretation:
- stream/substream selector

### `$3CF5`
This is written in the decoder tail after another `B1 E3` fetch:

```text
02D00B  ... C8 B1 E3 9D F5 3C ...
```

Interpretation:
- likely another decoded parameter field
- possibly mode/type/state value used later in the same runtime object

## What subsystem this most likely is
The current evidence points most strongly to:
- object behavior scripting
- enemy/event motion scripting
- or stage-driven entity update data

Why:
- timer-like field
- delta/velocity-like fields
- hierarchical stream dispatch
- compact markerized command streams
- RAM state tables rather than direct rendering-only structures

This does **not** look like a pure UI system anymore.

## Strong updated architectural model
The game likely has a subsystem that works roughly like this:

1. choose active script stream from a ROM table
2. use stream offset to decode commands
3. commands populate/update per-entity runtime fields
4. runtime loop consumes those fields as:
   - timers
   - deltas/velocities
   - state/type parameters
5. behavior evolves until the script advances or switches substream

That is a very plausible pattern for enemy waves, moving hazards, scripted parts, or other tightly choreographed shooter behavior.

## Why this matters for Soldier Gun
This is probably one of the most valuable reverse-engineering outcomes so far.

It suggests that the original game’s “feel” may come partly from:
- compact scripted movement/behavior streams
- deterministic timer-driven updates
- small runtime state tables
- repeated reuse of the same decoder/update machinery across many behaviors

For `Soldier Gun`, that means a good spiritual successor architecture would likely use:
- data-driven behavior scripts
- tokenized event/motion streams
- lightweight runtime entity state
- deterministic per-frame update logic

That would help us preserve the same fast, choreographed, readable action style without copying any original content.
