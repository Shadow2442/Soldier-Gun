# Soldier Blade ROM Analysis, Part 2

## Score / high-score text record format
- The score page strings around `0x00EF45` use a different record structure from the main menu.
- These entries appear to be `3 metadata bytes + NUL-terminated text`.
- Examples:
  - `09 0C 0A "YOUR SCORE" 00`
  - `09 0F 0A "HIGH SCORE" 00`
  - `03 08 0D "2 MINUTE GAME" 00`
  - `03 04 0B "NORMAL GAME" 00`
  - `04 14 0F "CONGRATULATIONS" 00`
  - `08 16 13 "ON YOUR HIGH SCORE]" 00`
- Strong inference: these three bytes encode screen position and/or text layout parameters for result screens.

## Credits/staff record format inference
- The credits block around `0x00E670` is structured differently again.
- Many entries begin with a single non-text byte before the visible label:
  - `07 "SOLDIER BLADE" 00`
  - `0B "STAFF" 00`
  - `0A "CHARLEY NAKATA" 00`
- Between labels are long stretches of zero padding.
- Strong inference: the credits page uses a simpler per-line format with fixed blank spacing rather than the denser menu record scheme.

## Code-adjacent findings near the score screen
- Immediately after the score/congratulation text block is executable code starting around `0x00F040`.
- This routine heavily manipulates addresses in the `$33B3`, `$33D3`, and `$33F3` ranges and also uses indexed indirect writes through pointer `$39`.
- Example:

```asm
00F07D  A9 09                LDA #$09
00F07F  20 06 E0             JSR $E006
00F082  A5 20                LDA $20
00F084  BC F3 33             LDY $33F3,X
00F087  20 05 91             JSR $9105
00F08A  BD B3 33             LDA $33B3,X
00F08D  91 39                STA ($39),Y
00F08F  C8                   INY
00F090  BD D3 33             LDA $33D3,X
00F093  91 39                STA ($39),Y
```

- Conservative inference:
  - `$33B3/$33D3/$33F3` are parallel RAM tables, probably related to score-entry or score-screen object/text management.
  - The routine writes two bytes through an indirect destination pointer, which suggests buffered screen/map updates rather than pure game-state math.
  - The call to `$E006` appears frequently from startup and UI-adjacent code, so it is likely a common engine routine.

## HuC6280-specific engine behavior
- The ROM uses HuC6280 block-transfer instructions very heavily:
  - `TIA`: 2215 hits
  - `TAI`: 1631 hits
  - `TDD`: 1140 hits
  - `TII`: 1011 hits
  - `TIN`: 809 hits
- Strong inference: the engine relies extensively on hardware-assisted memory moves for graphics, map, and buffer updates, which fits a polished PC Engine shooter.
- This also supports the idea that the later high-entropy ROM regions contain bulk graphic/music/stage resources streamed into working memory or VRAM.

## Useful takeaways for Soldier Gun
- The original game does not appear to treat UI text as ad hoc code; it uses multiple compact data-driven resource formats.
- Credits, score pages, and menus likely each have their own renderer expectations.
- Heavy block-transfer usage suggests that efficient staged resource movement is a core part of the engine’s design philosophy.
