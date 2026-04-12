# Soldier Blade ROM Analysis, Part 8

## The decoder source pointer is table-driven
This is the clearest decoder linkage yet.

Near the decoder entry:

```text
02CFA8  BC CE 3D B9 92 5B 85 E3 B9 93 5B 85 E4 BC DA 3D
02CFB8  B1 E3 C9 FB 90 1C F0 32 C9 FC F0 33 C9 FD F0 48
```

This means:
- load `Y` from `$3DCE`
- read low-byte pointer from ROM table `$5B92,Y`
- store it into `$E3`
- read high-byte pointer from ROM table `$5B93,Y`
- store it into `$E4`
- then load `Y` from `$3DDA`
- then begin decoding a stream from `($E3),Y`

This is a major result.

## What is now proven
We now have direct evidence of:

1. a ROM pointer table at `0x5B92/0x5B93`
2. a decoder that selects a stream pointer from that table
3. a RAM index (`$3DDA`) used as the current offset into the chosen stream
4. a marker-based interpreted stream format using at least:
   - `FB`
   - `FC`
   - `FD`
   - `FE`

This is no longer just “there may be structured content in the ROM.”
It is clearly a table-driven interpreted content system.

## Why this is important
This is the missing connective tissue between:
- opaque ROM data
- runtime state
- and the decoder logic

The engine is not scanning arbitrary bytes. It is:
- selecting a stream from a ROM pointer table
- resuming from an offset
- decoding markerized commands/data
- writing results into RAM work structures in the `3Dxx/3Exx` range

That is a real content pipeline.

## What the RAM fields likely mean
Conservative interpretation of nearby fields:
- `$3DCE`: index into the pointer table at `5B92/5B93`
- `$3DDA`: current stream offset within that selected content stream
- `3Dxx/3Exx` destinations:
  - decoded parameters
  - current object/state/config fields
  - intermediate state for the consuming gameplay/rendering subsystem

I would not assign exact semantics yet, but the structural roles are now much clearer.

## What the decoder does at a high level
Best current model:
- choose stream base from ROM pointer table
- add current offset
- fetch opcode/data byte
- if `< FB`: ordinary data path
- if `FB/FC/FD/FE`: control path
- consume extra argument bytes as needed
- populate object/state fields in RAM
- continue from the updated stream offset

This looks very much like:
- scripted object/event decoding
- compact stage command streams
- or similarly tokenized content playback

## Remaining gap
What is still not fully established:
- whether the actual stream bodies selected from `5B92/5B93` live near the symbolic `0x026300` region or elsewhere
- what each control token (`FB/FC/FD/FE`) means semantically
- what specific subsystem consumes the decoded `3Dxx/3Exx` data

But the architectural picture is now much stronger than before.

## Practical takeaway for Soldier Gun
If we want to preserve the spirit of this engine while modernizing the game, a very strong model would be:
- ROM/asset pointer tables
- per-mode or per-stage content streams
- markerized command streams for object/state/event playback
- a small decoder that feeds runtime state tables

That would feel spiritually faithful without copying exact data or code.
