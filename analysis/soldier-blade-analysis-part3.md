# Soldier Blade ROM Analysis, Part 3

## Likely UI/text rendering path
- The routine at `0x902F` is now a strong candidate for a general text/UI rendering helper.
- It is called from several UI-adjacent code regions, including:
  - `0x00EA2E`
  - `0x00EA43`
  - `0x00EA5E`
  - `0x00EDAC`
  - `0x00EDE0`
  - `0x00EE14`
  - `0x00EEFA`
- These call sites consistently prepare small zero-page variables before the call:
  - `$37/$38`
  - `$39/$3A`
  - `$7D/$7E`
  - sometimes `$7F`

Example pattern near `0x00EA20`:

```asm
00EA20  A9 0C 85 7E
00EA24  A9 DC 85 37
00EA28  A9 35 85 38
00EA2C  20 2F 90    JSR $902F
```

Followed by:

```asm
00EA43  20 2F 90    JSR $902F
00EA46  A9 61 85 39
00EA4A  A9 8F 85 3A
00EA4E  20 2C 8F    JSR $8F2C
```

Conservative inference:
- `$902F` likely consumes layout/state variables and prepares a text or screen resource for output.
- `$8F2C` may then emit or finalize that prepared data to a destination.
- This matches the ROM’s multiple text resource formats and data-driven menus/result screens.

## Score-page renderer linkage
- Near `0x00EEF0`, the code loops through a sequence of score-page records and repeatedly calls `JSR $902F`.
- Immediately afterward, it increments `$37/$38`, `$39/$3A`, and `$7E`, which strongly suggests multi-line text placement.

```asm
00EEF0  A9 0C 85 7E
00EEF4  A0 04
00EEF6  A9 0A 85 7D
00EEFA  20 2F 90    JSR $902F
...
00EF0D  18 69 0A    ; add 0x0A to $37
...
00EF18  18 69 0A    ; add 0x0A to $39
...
00EF22  E6 7E
00EF23  E6 7E
00EF25  88
00EF26  10 CD       ; loop
```

Strong inference:
- The score screen is rendered from a compact table of records with a stride-based vertical layout update.
- The metadata bytes in the score-string records are probably not arbitrary flags; they likely interact with this line-placement logic.

## Reused `$33B3/$33D3/$33F3` RAM tables
- These addresses are referenced far beyond the score screen:
  - `$33B3`: 213 raw references found
  - `$33D3`: 84 raw references found
  - `$33F3`: 77 raw references found
- They appear across many code regions, not just one local subsystem.

Conservative inference:
- This is probably a general engine-side object/list/table structure rather than a score-only buffer.
- Because the score code uses these tables alongside indirect writes, they may hold per-entry state used by several gameplay/UI systems.
- The parallel spacing suggests three related arrays rather than one packed struct.

## Mid-ROM tile/screen data is very likely not plain text
Several regions that looked “ASCII-like” are almost certainly screen or tile resources.

Example at `0x0232F0`:

```text
0232F0  58 59 5A 5B 5C 5D 5E 50 51 52 53 54 55 56 57 48
023300  49 4A 4B 4C 4D 4E 4F 40 41 42 43 44 45 46 47 38
023310  39 3A 3B 3C 3D 3E 3F 30 31 32 33 34 35 36 37 28
023320  29 2A 2B 2C 2D 2E 2F 20 21 22 23 24 25 26 27 5B
```

Why this matters:
- The bytes form regular descending and grouped tile-index patterns.
- They resemble arranged character/tile IDs much more than any executable code or language resource.
- Nearby variants differ in ways that look like alternate layout blocks or animated/screen-composed variants.

## Rich structured resource block near `0x009020`
The region around `0x009020` looks like compact structured records rather than code.

Sample:

```text
009020 00 00 00 04 01 43 03 04 04 06 FF 00 36 9F 20 60
009030 21 01 49 06 FF 00 02 00 01 80 01 20 1D 01 46 20
009040 03 10 11 01 48 06 FF 00 02 00 FF 80 01 20 1D 01
```

Conservative inference:
- This may be another object/layout definition table used by UI or stage scripting.
- The repeated short-field pattern suggests authored data records rather than raw graphics.
- The nearby references to `$71B8` and `$71CE` reinforce that this area is likely tied to engine-managed state.

## Practical takeaways for Soldier Gun
- The original game appears strongly data-driven in its UI/screen systems.
- Different screen types use different compact record formats instead of one oversized universal system.
- Reusable engine tables and heavy memory-transfer instructions point to a design optimized around rapid screen/resource updates.
- For `Soldier Gun`, the closest modern equivalent would be:
  - typed resource tables for menus, score pages, and credits
  - a small set of renderer helpers
  - separate tile/screen resource blobs rather than giant hand-coded screen logic
