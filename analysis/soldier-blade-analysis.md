# Soldier Blade ROM Analysis

ROM: C:\Users\shado\Downloads\Soldier Gun\analysis\Soldier Blade (Japan).pce
Size: 524288 bytes (512 KiB)

## Interesting ASCII strings
- SOLDIBLADECHA: 0x002357
- NORMAL GAME: 0x003019, 0x00EF86
- 2 MINUTES: 0x00308A
- 5 MINUTES: 0x00309A
- CARAVAN STAGE: 0x0030C8
- CONGRATULATION: 0x00EFE1, 0x00EFF4
- HUDSON SOFT: 0x0030EE, 0x00F023

## Bank summary (first 16)
- bank 00 @ 0x00000: entropy 7.130, printable 2941, 00 285, FF 235
- bank 01 @ 0x02000: entropy 7.018, printable 2968, 00 261, FF 553
- bank 02 @ 0x04000: entropy 7.072, printable 2744, 00 296, FF 221
- bank 03 @ 0x06000: entropy 5.909, printable 2613, 00 1198, FF 74
- bank 04 @ 0x08000: entropy 6.229, printable 2984, 00 889, FF 54
- bank 05 @ 0x0A000: entropy 6.186, printable 2907, 00 932, FF 228
- bank 06 @ 0x0C000: entropy 6.808, printable 2497, 00 642, FF 146
- bank 07 @ 0x0E000: entropy 6.392, printable 2898, 00 1455, FF 63
- bank 08 @ 0x10000: entropy 6.394, printable 2431, 00 1386, FF 462
- bank 09 @ 0x12000: entropy 6.293, printable 2632, 00 1314, FF 308
- bank 0A @ 0x14000: entropy 6.059, printable 2577, 00 1425, FF 396
- bank 0B @ 0x16000: entropy 5.029, printable 1821, 00 1719, FF 387
- bank 0C @ 0x18000: entropy 6.541, printable 3203, 00 951, FF 202
- bank 0D @ 0x1A000: entropy 6.624, printable 2771, 00 812, FF 189
- bank 0E @ 0x1C000: entropy 6.333, printable 2364, 00 727, FF 681
- bank 0F @ 0x1E000: entropy 6.339, printable 2131, 00 6, FF 184

## Bank summary (last 16)
- bank 30 @ 0x60000: entropy 7.202, printable 2156, 00 636, FF 404
- bank 31 @ 0x62000: entropy 7.179, printable 2037, 00 728, FF 395
- bank 32 @ 0x64000: entropy 7.243, printable 2080, 00 563, FF 495
- bank 33 @ 0x66000: entropy 7.316, printable 2203, 00 518, FF 397
- bank 34 @ 0x68000: entropy 7.434, printable 2223, 00 433, FF 457
- bank 35 @ 0x6A000: entropy 7.399, printable 2186, 00 390, FF 464
- bank 36 @ 0x6C000: entropy 7.168, printable 1905, 00 327, FF 497
- bank 37 @ 0x6E000: entropy 7.325, printable 2046, 00 363, FF 336
- bank 38 @ 0x70000: entropy 7.162, printable 1974, 00 662, FF 484
- bank 39 @ 0x72000: entropy 7.161, printable 2008, 00 650, FF 502
- bank 3A @ 0x74000: entropy 7.205, printable 2168, 00 612, FF 455
- bank 3B @ 0x76000: entropy 7.095, printable 2055, 00 640, FF 536
- bank 3C @ 0x78000: entropy 7.235, printable 2061, 00 526, FF 579
- bank 3D @ 0x7A000: entropy 7.196, printable 2118, 00 634, FF 504
- bank 3E @ 0x7C000: entropy 7.280, printable 2350, 00 578, FF 386
- bank 3F @ 0x7E000: entropy 7.015, printable 2164, 00 595, FF 826

## Longest filler runs
- byte 0x00: len 98 at 0x0210C3
- byte 0xFF: len 580 at 0x07FDBC

## Main menu text block around 0x003000
```text
003000  60 D1 6E D1 75 D1 0B 19 20 20 43 4F 4E 54 49 4E  `.n.u...  CONTIN
003010  55 45 20 20 20 00 0B 19 20 4E 4F 52 4D 41 4C 20  UE   ... NORMAL 
003020  47 41 4D 45 20 00 0B 19 20 20 20 53 54 41 47 45  GAME ...   STAGE
003030  20 32 20 20 20 00 0B 19 20 20 20 53 54 41 47 45   2   ...   STAGE
003040  20 33 20 20 20 00 0B 19 20 20 20 53 54 41 47 45   3   ...   STAGE
003050  20 34 20 20 20 00 0B 19 20 20 20 53 54 41 47 45   4   ...   STAGE
003060  20 35 20 20 20 00 0B 19 20 20 20 53 54 41 47 45   5   ...   STAGE
003070  20 36 20 20 20 00 0B 19 20 20 20 53 54 41 47 45   6   ...   STAGE
003080  20 37 20 20 20 00 0B 19 20 20 32 20 4D 49 4E 55   7   ...  2 MINU
003090  54 45 53 20 20 00 0B 19 20 20 35 20 4D 49 4E 55  TES  ...  5 MINU
0030A0  54 45 53 20 20 00 0B 19 20 20 20 53 45 54 20 55  TES  ...   SET U
0030B0  50 20 20 20 20 00 0B 19 20 20 20 20 53 43 4F 52  P    ...    SCOR
0030C0  45 20 20 20 20 00 0B 19 43 41 52 41 56 41 4E 20  E    ...CARAVAN 
0030D0  53 54 41 47 45 00 0B 19 20 20 20 20 45 58 49 54  STAGE...    EXIT
0030E0  20 20 20 20 20 00 08 1B 5C 31 39 39 32 20 48 55       ...\1992 HU
0030F0  44 53 4F 4E 20 53 4F 46 54 00 06 0A 47 41 4D 45  DSON SOFT...GAME
003100  20 4C 45 56 45 4C 00 06 0C 53 4F 55 4E 44 20 4D   LEVEL...SOUND M
003110  4F 44 45 00 06 0E 53 4F 55 4E 44 20 45 46 46 45  ODE...SOUND EFFE
```

## High score / congratulation block around 0x00EFF0
```text
00EFF0  00 04 14 0E 43 4F 4E 47 52 41 54 55 4C 41 54 49  ....CONGRATULATI
00F000  4F 4E 00 08 16 13 4F 4E 20 59 4F 55 52 20 48 49  ON....ON YOUR HI
00F010  47 48 20 53 43 4F 52 45 5D 00 2C 1A 11 5B 31 39  GH SCORE].,..[19
00F020  39 32 20 48 55 44 53 4F 4E 20 53 4F 46 54 00 5A  92 HUDSON SOFT.Z
00F030  64 33 A0 05 B1 37 D0 07 8F 33 0A A9 20 80 09 48  d3...7...3.. ..H
00F040  A9 01 85 33 68 18 69 30 20 82 CE E6 7D 88 10 E4  ...3h.i0 ...}...
```

## Score / high-score text record format
- The score page strings beginning slightly before this dump around `0x00EF45` use a different format from the main menu.
- These entries appear to be `3 metadata bytes + NUL-terminated text`.
- Examples:
  - `09 0C 0A "YOUR SCORE" 00`
  - `09 0F 0A "HIGH SCORE" 00`
  - `03 08 0D "2 MINUTE GAME" 00`
  - `03 04 0B "NORMAL GAME" 00`
  - `04 14 0F "CONGRATULATIONS" 00`
  - `08 16 13 "ON YOUR HIGH SCORE]" 00`
- Strong inference: these three bytes encode position/layout for score-result and congratulations screens.
- This confirms the game uses multiple related text resource formats rather than a single universal string table.

## Structured block around 0x002348
```text
002348  34 60 21 42 4D 20 46 4F 52 4D 41 54 21 00 00 53  4`!BM FORMAT!..S
002358  4F 4C 44 49 42 4C 41 44 45 43 48 41 00 03 00 55  OLDIBLADECHA...U
002368  52 49 00 02 00 41 4F 48 00 01 00 44 4F 45 00 50  RI...AOH...DOE.P
002378  00 4D 4F 47 00 20 00 4B 41 4B 00 05 00 4B 55 42  .MOG. .KAK...KUB
002388  00 04 00 48 49 44 00 03 00 48 4F 53 00 02 00 4B  ...HID...HOS...K
002398  41 57 00 01 00 00 01 00 A9 01 85 2A A5 07 D0 68  AW.........*...h
0023A8  20 9D C4 A9 39 8D 5D 24 A9 35 8D 5E 24 20 E0 FB   ...9.]$.5.^$ ..
```

## Menu record format inference
- The main menu text block beginning at `0x003008` is not just a flat list of strings.
- Each entry appears as `prefix_lo prefix_hi text 00`.
- For the main menu, every entry uses the same prefix bytes: `0B 19`.
- Example records:
  - `0B 19 "  CONTINUE   " 00`
  - `0B 19 " NORMAL GAME " 00`
  - `0B 19 "CARAVAN STAGE" 00`
- The setup/options text nearby uses different prefixes:
  - `06 0A "GAME LEVEL" 00`
  - `06 0C "SOUND MODE" 00`
  - `14 0A "NORMAL" 00`
  - `14 10 "ARCADE" 00`
- Strong inference: these prefix bytes are screen-layout metadata, likely tile coordinates or layout/style parameters for a text renderer.

## Credits and staff text block
Around `0x00E670` the ROM stores a large plain-text credits block:

```text
00E670  07 53 4F 4C 44 49 45 52 20 42 4C 41 44 45 00 00  .SOLDIER BLADE..
00E680  00 00 00 0B 53 54 41 46 46 00 00 00 00 00 00 44  ......STAFF.....D
00E690  49 52 45 43 54 49 4F 4E 00 0A 43 48 41 52 4C 45  IRECTION..CHARLE
00E6A0  59 20 4E 41 4B 41 54 41 00 00 00 00 00 00 00 00  Y NAKATA........
00E6B0  00 00 00 00 00 00 47 41 4D 45 20 44 45 53 49 47  ......GAME DESIG
00E6C0  4E 00 0A 55 4B 49 55 4B 49 20 55 52 49 42 4F 00  N..UKIUKI URIBO.
```

Visible roles and names include:
- `DIRECTION` / `CHARLEY NAKATA`
- `GAME DESIGN` / `UKIUKI URIBO`
- `SYSTEM PROGRAMING` / `HIKARU AOYAMA`
- `ENEMY PROGRAMING` / `CHARLEY NAKATA`
- `PRODUCTION PROGRAMING` / `HIKARU AOYAMA`
- `ART DIRECTION` / `UKIUKI URIBO`
- `MECHANICAL ART` / `TATSUYA DOE`
- `GRAPHIC DESIGN` / `UKIUKI URIBO`, `TATSUYA DOE`, `YUKINORI KOUZEN`, `RURURIRA HIDEBO`, `ATSUSHI KAKUTANI`
- `MUSIC COMPOSING` / `KEITA HOSHI`, `MAKIKO TANIFUJI`
- `SOUND EFFECT` / `KEITA HOSHI`
- `SOUND SYSTEM PROGRAMING` / `LU. IWABUCHI`
- `SUPER VOICE` / `NIMAI C. MALLE`
- `SPECIAL THANKS`
- `PLANNING` / `SHIGEKI FUJIWARA`
- `SUPERVISION` / `TATSUJIN KAWADA`
- `OPERATION COMPLETE`

This confirms the ROM includes a full in-game credits resource in raw text, not only title/menu strings.

## Credits/staff record format inference
- The credits block around `0x00E670` appears more loosely structured than the menu and score pages.
- Many entries begin with a single non-text byte before the visible label:
  - `07 "SOLDIER BLADE" 00`
  - `0B "STAFF" 00`
  - `0A "CHARLEY NAKATA" 00`
- Between labels are long stretches of zero padding.
- Strong inference: the credits page renderer uses a simple per-line record format and fixed blank spacing rather than the more compact repeated prefix scheme seen in the menus.

## Staff abbreviation table
- The odd block near `0x002357` appears to be a compact staff-abbreviation table:
  - `URI`
  - `AOH`
  - `DOE`
  - `MOG`
  - `KAK`
  - `KUB`
  - `HID`
  - `HOS`
  - `KAW`
- Several of these map cleanly onto names in the credits block:
  - `URI` -> `UKIUKI URIBO`
  - `AOH` -> `HIKARU AOYAMA`
  - `DOE` -> `TATSUYA DOE`
  - `KAK` -> `ATSUSHI KAKUTANI`
  - `HID` -> `RURURIRA HIDEBO`
  - `HOS` -> `KEITA HOSHI`
  - `KAW` -> `TATSUJIN KAWADA`
- Strong inference: this data is an internal compact lookup table used by another staff/credit-related subsystem.

## Likely tilemap regions
- Large ROM regions around `0x023000` and `0x026300` look superficially like text because many bytes fall in the ASCII printable range.
- The patterns are not natural language. They look like repeated tile indices and control values.
- Example at `0x023000`:

```text
023000  49 4A 4B 73 7E 7F 80 78 79 7A 7B 7C 7D 4A 4B 38
023010  39 3A 3B 77 74 75 76 6F 70 71 72 73 74 75 76 6A
023020  29 2A 2B 6B 6C 6D 6E 63 64 65 66 67 68 70 69 67
```

- Strong inference: these are screen/tilemap resources or font/tile arrangement tables rather than executable code or prose text.

## Code-adjacent findings near the score screen
- Immediately after the score/congratulation text block is executable code starting around `0x00F040`.
- This routine heavily manipulates addresses in the `$33B3`, `$33D3`, and `$33F3` ranges and also uses indexed indirect writes through pointer `$39`.
- Example snippet:

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
  - `$33B3/$33D3/$33F3` are parallel RAM tables, probably for score-entry or score-screen object/text management.
  - The routine writes two bytes through an indirect destination pointer, suggesting buffered screen/map updates rather than pure game-logic state.
  - The call to `$E006` appears often from startup and UI-related code, so it is likely a common engine routine.

## HuC6280-specific engine behavior
- The ROM uses HuC6280 block-transfer instructions extremely heavily:
  - `TIA`: 2215 hits
  - `TAI`: 1631 hits
  - `TDD`: 1140 hits
  - `TII`: 1011 hits
  - `TIN`: 809 hits
- Strong inference: the game leans heavily on hardware-assisted memory moves for graphics, map, and buffer updates, which is typical of polished PC Engine software.
- This supports the idea that much of the later high-entropy ROM area is bulk graphic/music/stage data streamed or copied into working memory/VRAM.

## Partial HuC6280 disassembly from ROM start
```asm
000000  18                   CLC
000001  65 55                ADC $55
000003  53 04                TAM
000005  60                   RTS
000006  44         .db $44
000007  F8                   SED
000008  1A         .db $1A
000009  53 08                TAM
00000B  60                   RTS
00000C  18                   CLC
00000D  65 55                ADC $55
00000F  53 10                TAM
000011  1A         .db $1A
000012  53 20                TAM
000014  60                   RTS
000015  A9 02                LDA #$02
000017  80 F3                BRA $000C
000019  A5 48                LDA $48
00001B  38                   SEC
00001C  E9 40                SBC #$40
00001E  4A                   LSR A
00001F  4A                   LSR A
000020  4A                   LSR A
000021  4A                   LSR A
000022  4A                   LSR A
000023  85 3B                STA $3B
000025  18                   CLC
000026  43 04                TMA
000028  65 3B                ADC $3B
00002A  20 06 E0             JSR $E006
00002D  A5 48                LDA $48
00002F  29 1F                AND #$1F
000031  09 40                ORA #$40
000033  85 48                STA $48
000035  60                   RTS
000036  78                   SEI
000037  D4                   CSH
000038  D8                   CLD
000039  A9 FF                LDA #$FF
00003B  53 01                TAM
00003D  A9 F8                LDA #$F8
00003F  53 02                TAM
000041  A9 04                LDA #$04
000043  8D 00 04             STA $0400
000046  A9 FD                LDA #$FD
000048  8D 02 14             STA $1402
00004B  F3 0D E1 00 20 1D 00 TAI
000052  64 5D                STZ $5D
000054  78                   SEI
000055  A2 FF                LDX #$FF
000057  9A                   TXS
000058  A9 05                LDA #$05
00005A  8D 00 00             STA $0000
00005D  A5 5D                LDA $5D
00005F  09 08                ORA #$08
000061  8D 02 00             STA $0002
000064  AD 00 00             LDA $0000
000067  29 20                AND #$20
000069  D0 F9                BNE $0064
00006B  AD 00 00             LDA $0000
00006E  29 20                AND #$20
000070  F0 F9                BEQ $006B
000072  9C 02 00             STZ $0002
000075  9C 02 04             STZ $0402
000078  A9 01                LDA #$01
00007A  8D 03 04             STA $0403
00007D  9C 04 04             STZ $0404
000080  9C 05 04             STZ $0405
000083  F3 0D E1 1D 20 E3 1F TAI
00008A  43 80                TMA
00008C  85 55                STA $55
00008E  18                   CLC
00008F  69 01                ADC #$01
000091  53 40                TAM
000093  A9 03                LDA #$03
000095  18                   CLC
000096  65 55                ADC $55
000098  53 04                TAM
00009A  1A         .db $1A
00009B  53 08                TAM
00009D  20 8A E4             JSR $E48A
0000A0  20 2B E8             JSR $E82B
0000A3  20 76 E8             JSR $E876
0000A6  20 2C E2             JSR $E22C
0000A9  9C F5 29             STZ $29F5
0000AC  64 4F                STZ $4F
0000AE  64 50                STZ $50
0000B0  64 54                STZ $54
0000B2  64 56                STZ $56
0000B4  64 57                STZ $57
0000B6  A9 11                LDA #$11
0000B8  85 58                STA $58
0000BA  A9 E1                LDA #$E1
0000BC  85 59                STA $59
0000BE  A9 11                LDA #$11
0000C0  85 5A                STA $5A
```

## JSR targets seen in first 16 KiB
- $2020 referenced 26 times
- $E1E7 referenced 16 times
- $F0A0 referenced 15 times
- $E006 referenced 14 times
- $C557 referenced 14 times
- $0020 referenced 14 times
- $5368 referenced 13 times
- $E1D6 referenced 12 times
- $0B00 referenced 12 times
- $E32D referenced 12 times
- $F1F8 referenced 11 times
- $F233 referenced 11 times
- $E6AB referenced 10 times
- $E53C referenced 9 times
- $F191 referenced 8 times
- $C5B5 referenced 8 times
- $C0C8 referenced 8 times
- $5320 referenced 8 times
- $5453 referenced 7 times
- $0443 referenced 6 times
- $7AFA referenced 6 times
- $FEBD referenced 6 times
- $F18C referenced 5 times
- $FE67 referenced 5 times

## Notes
- The ROM starts with live executable code rather than a file signature, consistent with a HuCard image.
- The menu text block stores labels with short leading control bytes, likely text layout metadata such as tile coordinates or style flags.
- The ROM contains a full visible credits/staff resource block with names and roles in plain text.
- The staff abbreviation table near `0x002357` likely links to the credits resource and may be an internal compact lookup structure.
- Several apparently “texty” mid-ROM regions are more plausibly tilemaps because their byte patterns form dense sequential tile-index runs rather than language.
- The later banks show much higher entropy, suggesting compressed or tightly packed graphics/music/stage content.
- This script includes only a partial HuC6280 opcode table; unknown bytes are emitted as data and should not be over-interpreted.
