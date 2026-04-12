# Soldier Blade ROM Analysis, Part 4

## Stronger model of the UI text pipeline
The current best-fit model for the text/screen path is now:

1. Caller sets up layout/state in zero page
   - `$37/$38`
   - `$39/$3A`
   - `$7D/$7E`
   - sometimes `$7F`
2. Caller invokes `JSR $902F`
3. Caller sets `$39/$3A` to a resource pointer and invokes `JSR $8F2C`
4. Related helper at `0xEF2C` can decode `3-byte` records from `($39),Y` into `$7D/$7E/$7F`

This is not fully proven as source code semantics, but it is the strongest evidence-backed interpretation so far.

## Evidence for `JSR $902F` as a layout/setup helper
`$902F` has only `7` direct `JSR` callers, and all of them are UI-adjacent:
- `0x00EA2E`
- `0x00EA43`
- `0x00EA5E`
- `0x00EDAC`
- `0x00EDE0`
- `0x00EE14`
- `0x00EEFA`

At those call sites, the code consistently loads small values into zero-page layout variables before calling it.

Example:

```asm
00EDA0  A9 07      LDA #$07
00EDA2  85 7E      STA $7E
00EDA4  A9 08      LDA #$08
00EDA6  85 37      STA $37
00EDA8  A9 20      LDA #$20
00EDAA  85 38      STA $38
00EDAC  20 2F 90   JSR $902F
```

Interpretation:
- `$902F` likely uses those variables as screen/tile position or text-layout state.
- It does not look like a general gameplay routine; it is too tightly clustered around screen/result/menu flows.

## Evidence for `JSR $8F2C` as a resource-emission/output helper
`$8F2C` has `15` direct callers, again concentrated in UI/credit/result areas.

Key pattern:

```asm
00EA46  A9 61      LDA #$61
00EA48  85 39      STA $39
00EA4A  A9 8F      LDA #$8F
00EA4C  85 3A      STA $3A
00EA4E  20 2C 8F   JSR $8F2C
```

This same pattern repeats with different low bytes for `$39` but the same high byte `$8F`.

Interpretation:
- `$39/$3A` is being used as a pointer into a resource block near bank address `$8Fxx`.
- `$8F2C` likely consumes a structured resource pointed to by `$39/$3A`.
- In other words, `902F` appears to prepare a destination/layout context, while `8F2C` appears to read and emit a specific resource blob.

## The `0xEF2C` helper fits the `3-byte record` theory
The routine at `0x00EF2C` begins:

```asm
00EF2C  5A         PHY?
00EF2D  DA         PHX?
00EF2E  C2         CLY
00EF2F  B1 39      LDA ($39),Y
00EF31  85 7D      STA $7D
00EF33  C8         INY
00EF34  B1 39      LDA ($39),Y
00EF36  85 7E      STA $7E
00EF38  C8         INY
00EF39  B1 39      LDA ($39),Y
00EF3B  85 7F      STA $7F
```

This matches the score/high-score resource format discovered earlier:
- `byte 1` -> `$7D`
- `byte 2` -> `$7E`
- `byte 3` -> `$7F`

Interpretation:
- The score/result screen code is very likely reading compact layout records from a table and unpacking them into working variables.
- That is strong evidence that the `3-byte metadata + string` model is real and actually used by code, not just a lucky guess from static bytes.

## Score screen loop behavior
The loop at `0x00EEF0` is especially revealing:

```asm
00EEF6  A9 0A      LDA #$0A
00EEF8  85 7D      STA $7D
00EEFA  20 2F 90   JSR $902F
...
00EF0D  18 69 0A   ; advance $37 by 0x0A
...
00EF1A  18 69 0A   ; advance $39 by 0x0A
...
00EF22  E6 7E
00EF24  E6 7E
00EF26  88
00EF27  10 CD      ; repeat
```

Interpretation:
- The score/result screen is rendered as a multi-line layout pass.
- The code advances both a screen/layout coordinate and a resource pointer each iteration.
- This is consistent with a compact page renderer rather than one-off hardcoded strings.

## What `0x9105` appears to be doing
`$9105` has only `2` direct callers:
- `0x00F08A`
- `0x00F0E2`

Those callers come from score-related code that also uses `$33B3/$33D3/$33F3`.

Interpretation:
- `$9105` is probably a small helper that transforms or resolves an entry index into a usable screen offset or object slot.
- It is likely not a general renderer by itself; it seems subordinate to the score-entry logic.

## Practical architecture lesson
The UI path increasingly looks like:
- compact resource tables in ROM
- zero-page working layout variables
- a small number of specialized rendering/setup helpers
- separate routines for:
  - layout preparation
  - record decoding
  - resource emission

That is a very useful model for `Soldier Gun`.

Instead of hardcoding menu and result screens in gameplay code, we should likely build:
- small declarative screen resources
- a reusable screen renderer
- typed record formats for menu lines, score pages, and credits
