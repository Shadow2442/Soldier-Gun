# Soldier Blade ROM Analysis, Part 6

## Reassessment of the `0x026300` region
After probing the `0x026300` area more carefully, it does **not** behave like a clean fixed-record table.

Why:
- Comparing `0x026300` against nearby `0x80`-byte windows shows almost complete replacement:
  - vs `0x026380`: only `8` bytes the same, `120` different
  - vs `0x026400`: only `6` bytes the same, `122` different
  - vs `0x026480`: only `9` bytes the same, `119` different
- Column-uniqueness analysis on assumed `16-byte` records shows high variation in nearly every byte position.
- That is not what a tidy “object struct table” usually looks like.

## What it looks like instead
The region appears to be a dense symbolic stream drawn from a constrained vocabulary:

Common recurring values include:
- `47`
- `48`
- `4D`
- `56`
- `58`
- `59`
- `5E`
- `5F`
- `60`
- `66`
- `67`
- `6C`
- `6D`
- `72`
- `73`
- `74`
- `79`
- `7A`
- `EF`
- `FE`
- `FF`
- `F0`
- `F7`
- `F8`
- `F9`
- `FA`

Interpretation:
- This looks more like encoded composition data than raw fixed records.
- Possible meanings:
  - metatile or macro-tile maps
  - mixed tile and control stream
  - compact stage/screen composition commands
  - run-length / variant-coded layout data

## Why this still matters
Even though it is probably not a simple struct table, this region is still clearly authored content, not executable code.

It has:
- a limited alphabet of repeated symbols
- recurring motifs and short phrases
- values like `FE`, `FF`, `EF`, `F0`, `F7`, `F8`, `F9`, `FA` that look control-like compared with the surrounding tile-ish vocabulary

That makes it a strong candidate for an interpreted content stream.

## Contrast with the `0x0232F0` screen-page region
The earlier `0x0232F0` region looked like:
- page-like
- regular
- tile-grid oriented
- fixed-stride variants

The `0x026300` region looks different:
- irregular
- stream-like
- richer in control-like markers
- more composition-oriented than page-oriented

That suggests the ROM may contain **multiple layers of visual content representation**:
- lower-level tile/screen pages
- higher-level interpreted composition streams

## Practical model emerging
The game may be organizing visual content roughly like this:

1. text/UI resources
   - small layout records
   - page/resource pointers

2. page-like tile resources
   - fixed-stride tile grids
   - close variants for state changes

3. interpreted composition streams
   - mixed symbolic/control data
   - likely used for richer screen/stage assembly

This is still a model, not a final proof, but it now fits the observed ROM evidence better than the earlier “16-byte object table” hypothesis.

## Good next target
The best next reverse-engineering step is probably:
- identify who references the `0x026300` region or nearby banks
- or search for decode/copy routines that consume `FE/FF/EF/Fx`-heavy streams

That would tell us whether this region is:
- stage composition
- metatile assembly
- animation/state scripting
- or some other interpreted resource format
