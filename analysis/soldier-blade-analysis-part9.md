# Soldier Blade ROM Analysis, Part 9

## Strong evidence that `0x02DF00`-style data is the right stream family
The region around `0x02DF00` looks exactly like the kind of markerized stream the decoder would consume:

```text
02DF00  08 01 80 FE FE 09 01 00 FC FE 0C 00 80 FF FF FB
02DF10  60 FF FC 00 78 FE 09 01 00 04 FE 04 01 00 04 FE
02DF20  0E 01 00 04 FE 05 01 00 04 FE 0D 01 00 04 FE 08
02DF30  01 00 04 FE 09 18 00 FF FF FC 00 7C 02 00 F4 00
```

This matters because:
- it uses the same high-value control vocabulary we’ve been chasing
- it is clearly stream-like rather than page-like
- it fits the decoder’s `FB/FC/FD/FE` control-token model much better than ordinary tile grids or text blocks

This is not absolute proof that the decoder directly reads this exact block, but it is the strongest content-family match found so far.

## How `$3DCE` is set
The setup path around `0x02C850` is especially revealing:

```text
02C850  B2 E3 0A 9D CE 3D A8 B9 92 5B 85 E5 B9 93 5B 85 E6
02C860  9E 16 3E 9E 22 3E B2 E5 C9 FB D0 0D A0 01 B1 E5 9D
```

Interpretation:
- a byte is read from the stream referenced by `E3`
- it is shifted left (`0A`)
- then stored into `$3DCE`
- that value is copied into `Y`
- then `Y` is used to index the `5B92/5B93` table pair

This is a very strong clue that:
- the table index is intentionally even-aligned or field-encoded
- the “pointer table” is likely stored as interleaved/paired bytes in a larger structured table
- the decoder chain is hierarchical:
  - one stream produces an index
  - that index selects another stream or substream

## Why the naive pointer-table decode looked wrong
When I first treated `5B92/5B93` as a simple array of consecutive 16-bit pointers, many entries resolved to obvious code or unrelated data.

The new evidence explains why:
- `$3DCE` is not an arbitrary byte index; it is derived by shifting a prior stream byte
- that means only certain `Y` values are likely valid
- the table may be part of a larger record structure, not a standalone “pointer array” in the clean modern sense

So the earlier “bad pointer” results were not useless; they showed the format was being interpreted too naively.

## Hierarchical stream decoding model
The engine now appears to support something like:

1. read token from one active stream
2. derive a substream/index selector
3. load a new stream pointer from a ROM table
4. decode that selected substream with marker-aware logic
5. write results into runtime state tables

That is more sophisticated than a single flat event list.

## Additional state linkage
Other nearby code shows:
- `$3DDA` being reset or advanced during decoder/state transitions
- `$2E3E`, `$FE3D`, `$0A3E`, `$E63D`, `$F23D`, and `$F53C` receiving decoded values

Interpretation:
- the decoder is populating a richer per-entity or per-script state block
- not just drawing text or blitting tiles

## What this means for the overall reverse-engineering picture
At this point, we have evidence for:
- compact screen/text records
- a UI rendering pipeline
- page-like tile resources
- markerized interpreted streams
- hierarchical selection of substreams through a ROM table

That is enough to say the game is decisively data-driven in more than one layer.

## Practical takeaway for Soldier Gun
This suggests a very strong modern design pattern for us:
- stage controllers that read compact event streams
- tokenized object/script streams instead of hardcoding every wave
- hierarchical resource dispatch when one event triggers a sub-pattern or spawned behavior

That would preserve the spirit of the original architecture while still letting us modernize the implementation.
