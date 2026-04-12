# Soldier Blade ROM Analysis, Part 5

## Stronger evidence for tile/screen resource pages
The probe of the `0x023000` region shows repeated blocks that are highly structured and often aligned on `0x100` boundaries.

Examples of repeated windows:
- `0x0232F0`, `0x0233F0`, `0x0234F0`
- `0x023300`, `0x023400`, `0x023500`
- `0x023310`, `0x023410`, `0x023510`

This is strong evidence that the ROM stores multiple related screen/tile pages in a page-like layout rather than one-off unstructured data.

## Candidate screen page at `0x0232F0`

```text
0232F0  58 59 5A 5B 5C 5D 5E 50 51 52 53 54 55 56 57 48
023300  49 4A 4B 4C 4D 4E 4F 40 41 42 43 44 45 46 47 38
023310  39 3A 3B 3C 3D 3E 3F 30 31 32 33 34 35 36 37 28
023320  29 2A 2B 2C 2D 2E 2F 20 21 22 23 24 25 26 27 5B
023330  5C 5D 5E 50 51 52 53 54 55 56 57 1D 58 59 5A 4C
023340  4D 4E 4F 40 41 42 43 44 45 46 47 48 49 4A 4B 3C
023350  3D 3E 3F 30 31 32 33 34 35 36 37 38 39 3A 3B 2C
023360  2D 2E 2F 20 21 22 23 24 25 26 27 28 29 2A 2B 50
```

Interpretation:
- This looks like a tile index grid, not code or text.
- The values are arranged in smooth descending bands and grouped runs.
- That is exactly what you would expect from a composed tilemap or character layout.

## Variant relationship: `0x0232F0` vs `0x0234F0`
These two blocks are very close:
- same bytes: `104`
- different bytes: `24`

That is a remarkably small delta for an `0x80`-byte block.

Interpretation:
- These are likely two versions of the same base page with a handful of changed tile IDs.
- Possible uses:
  - alternate menu states
  - animated title/menu page variants
  - cursor/selection overlays
  - minor state transitions

## Variant relationship: `0x0232F0` vs `0x02333C`
These differ much more:
- same bytes: `20`
- different bytes: `108`

Interpretation:
- This is probably not just a tiny state variation.
- More likely:
  - a different page using a similar alphabet/tile set
  - a different section of the same larger screen family
  - or a different arrangement built from the same tile vocabulary

## The `0x100` spacing matters
The repeated alignment strongly suggests these resources are stored as page-sized chunks or records with fixed spacing.

Examples:
- `0x0232F0` -> `0x0233F0` -> `0x0234F0`
- `0x023300` -> `0x023400` -> `0x023500`

Interpretation:
- The resource system likely stores related screens/frames/pages in a bank-local fixed-stride table.
- This fits the broader ROM pattern of compact, regular, data-driven resources.

## How this connects to the UI pipeline
From the earlier UI analysis:
- callers set `$39/$3A` to pointers in the `0x8Fxx` area
- `JSR $8F2C` appears to consume those resources
- `JSR $902F` appears to set up layout/state

The `0x023xxx` blocks may therefore be:
- lower-level tile/screen pages referenced indirectly by higher-level UI resource tables
- or prebuilt screen chunks used by menus/result pages/title-like screens

This is still an inference, but it is increasingly consistent with the evidence.

## Candidate block at `0x026300` looks different

```text
026300  80 7D 7E 7E 37 38 05 06 07 02 03 04 0D 01 91 4D
026310  4D 4D 4D 76 39 8B 7D 7E 7F 80 7E 7F A4 01 01 91
026320  4D 4D 4D 7B 32 83 84 85 4D 4D 4D 4D 4D 7A 7A 4C
```

Interpretation:
- This region is also structured, but unlike `0x0232F0`, it contains many control-like values interleaved with tile-like values.
- It may be a richer object/layout record set rather than a plain tile page.
- Possible roles:
  - composite screen object definitions
  - stage event/object placement records
  - mixed tile-and-attribute data

## Practical takeaway for Soldier Gun
The original game likely uses at least two layers of screen resources:
- compact higher-level UI records
- lower-level tile/page resources laid out in regular chunks

That is a strong architectural cue for `Soldier Gun`:
- define screen pages as data
- keep state variants as small deltas or alternate pages
- feed those resources through a dedicated renderer instead of hardcoding screen logic
