# Soldier Blade ROM Analysis, Part 7

## Best decoder candidate so far: around `0x02CFB8`
The strongest interpreted-stream decoder candidate found so far is in the `0x02CFB8` area.

Key excerpt:

```text
02CFB8  B1 E3 C9 FB 90 1C F0 32 C9 FC F0 33 C9 FD F0 48
02CFC8  C9 FE F0 4D A9 FF 9D 2E 3E 9E FE 3D 9E 0A 3E 4C
02CFD8  71 4F C9 00 D0 01 3A 9D 2E 3E C8 B1 E3 9D FE 3D
02CFE8  C8 B1 E3 9D 0A 3E C8 4C 6D 4F C8 C8 C8 80 C1 C8
02CFF8  B1 E3 9D E6 3D C8 B1 E3 9D F2 3D C8 B1 E3 C9 FB
```

This is important because:
- it reads from a pointer-driven stream with `B1 E3`
- it compares the fetched byte against special marker values:
  - `FB`
  - `FC`
  - `FD`
  - `FE`
- it branches differently for each marker
- it writes decoded values into structured RAM destinations in the `3Dxx` / `3Exx` range

## Why this matters
This is qualitatively different from simple menu/string handling.

It looks like:
- read byte from stream
- if byte < `FB`, treat as ordinary data
- if byte is `FB/FC/FD/FE`, interpret it as a control token
- consume additional bytes depending on the token
- write decoded results into engine-managed work tables

That is exactly the kind of behavior we would expect from an interpreted content stream or stage/object script decoder.

## What this may be decoding
I cannot prove the content class yet, but the structure strongly suggests one of:
- stage event stream
- object spawn/config stream
- interpreted layout/metatile stream
- animation/state command stream

Given the marker-heavy symbolic data we saw around `0x026300`, this decoder is now a plausible consumer of that general kind of resource.

## Why `0x026300` is still only a candidate source
Important caution:
- I have **not** yet proven that `0x02CFB8` reads directly from the `0x026300` region.
- What I *have* proven is that the ROM contains a real pointer-driven marker decoder elsewhere.

So the current state is:
- `0x026300`: strong candidate for interpreted resource data
- `0x02CFB8`: strong candidate for interpreted resource decoding
- link between them: plausible, but not yet demonstrated

## Other marker-heavy areas
The decoder probe found many `CMP #$FF` sites, but most are weaker candidates because they could simply be sentinel checks.

The `0x02CFB8` region stands out because it:
- tests several adjacent marker values
- uses pointer-based stream reads
- writes decoded fields into RAM structures

That combination is much more meaningful than isolated `CMP #$FF`.

## Relationship to the engine model so far
The ROM now appears to include:

1. compact UI/text resource formats
2. a UI text/screen pipeline (`0x902F`, `0x8F2C`, `0xEF2C`)
3. page-like tile/screen resources around `0x023xxx`
4. at least one real marker-driven stream decoder around `0x02CFB8`

This is a big step forward, because it means we now have evidence for both:
- declarative screen resources
- interpreted nontrivial content streams

## Practical takeaway for Soldier Gun
If we want to capture the spirit of this architecture without copying it, we should think in terms of:
- compact authored data tables
- a few specialized decoders/renderers
- tokenized or interpreted content streams for stage composition or scripted events

That is likely much closer to how the original game was built than a purely hardcoded “everything in code” approach.

## Best next step
The next most useful RE step is:
- trace how the pointer register pair used by the decoder (`E3/E4`) gets loaded
- and see whether its source tables point into the same bank family as the symbolic resource regions

That would finally let us connect a decoder to a concrete resource source instead of only inferring the relationship.
