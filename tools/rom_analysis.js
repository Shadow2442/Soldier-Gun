const fs = require("fs");
const path = require("path");

const romPath = path.join(__dirname, "..", "analysis", "Soldier Blade (Japan).pce");
const bytes = fs.readFileSync(romPath);

const bankSize = 0x2000;

function hex(value, width = 2) {
  return value.toString(16).toUpperCase().padStart(width, "0");
}

function read16(offset) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function classifyByte(b) {
  if (b >= 32 && b <= 126) return String.fromCharCode(b);
  return ".";
}

function dumpRange(start, length) {
  const lines = [];
  for (let i = start; i < start + length; i += 16) {
    const slice = bytes.slice(i, Math.min(i + 16, bytes.length));
    const hexPart = Array.from(slice, (b) => hex(b)).join(" ");
    const asciiPart = Array.from(slice, classifyByte).join("");
    lines.push(`${hex(i, 6)}  ${hexPart.padEnd(16 * 3 - 1, " ")}  ${asciiPart}`);
  }
  return lines.join("\n");
}

function extractAscii(minLen = 4) {
  const results = [];
  let start = -1;
  let buffer = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b >= 32 && b <= 126) {
      if (start === -1) start = i;
      buffer += String.fromCharCode(b);
    } else {
      if (buffer.length >= minLen) {
        results.push({ offset: start, text: buffer });
      }
      start = -1;
      buffer = "";
    }
  }
  if (buffer.length >= minLen) {
    results.push({ offset: start, text: buffer });
  }
  return results;
}

function entropy(slice) {
  const freq = new Map();
  for (const b of slice) freq.set(b, (freq.get(b) || 0) + 1);
  let e = 0;
  for (const count of freq.values()) {
    const p = count / slice.length;
    e += -p * Math.log2(p);
  }
  return e;
}

function bankSummary() {
  const rows = [];
  for (let offset = 0; offset < bytes.length; offset += bankSize) {
    const slice = bytes.slice(offset, offset + bankSize);
    let zeros = 0;
    let ff = 0;
    let printable = 0;
    for (const b of slice) {
      if (b === 0x00) zeros++;
      if (b === 0xFF) ff++;
      if (b >= 32 && b <= 126) printable++;
    }
    rows.push({
      bank: offset / bankSize,
      offset,
      entropy: entropy(slice),
      zeros,
      ff,
      printable,
    });
  }
  return rows;
}

function findAscii(needle) {
  const target = Buffer.from(needle, "ascii");
  const found = [];
  for (let i = 0; i <= bytes.length - target.length; i++) {
    let ok = true;
    for (let j = 0; j < target.length; j++) {
      if (bytes[i + j] !== target[j]) {
        ok = false;
        break;
      }
    }
    if (ok) found.push(i);
  }
  return found;
}

const OPCODES = new Map([
  [0x00, ["BRK", 2]],
  [0x03, ["ST0", 2]],
  [0x08, ["PHP", 1]],
  [0x09, ["ORA", 2, "#$%1"]],
  [0x0A, ["ASL", 1, "A"]],
  [0x0D, ["ORA", 3, "$%2"]],
  [0x10, ["BPL", 2, "rel"]],
  [0x18, ["CLC", 1]],
  [0x20, ["JSR", 3, "$%2"]],
  [0x23, ["ST2", 2]],
  [0x29, ["AND", 2, "#$%1"]],
  [0x2A, ["ROL", 1, "A"]],
  [0x2C, ["BIT", 3, "$%2"]],
  [0x30, ["BMI", 2, "rel"]],
  [0x38, ["SEC", 1]],
  [0x40, ["RTI", 1]],
  [0x43, ["TMA", 2]],
  [0x48, ["PHA", 1]],
  [0x49, ["EOR", 2, "#$%1"]],
  [0x4A, ["LSR", 1, "A"]],
  [0x4C, ["JMP", 3, "$%2"]],
  [0x50, ["BVC", 2, "rel"]],
  [0x53, ["TAM", 2]],
  [0x54, ["CSL", 1]],
  [0x58, ["CLI", 1]],
  [0x60, ["RTS", 1]],
  [0x62, ["CLA", 1]],
  [0x64, ["STZ", 2, "$%1"]],
  [0x65, ["ADC", 2, "$%1"]],
  [0x68, ["PLA", 1]],
  [0x69, ["ADC", 2, "#$%1"]],
  [0x6C, ["JMP", 3, "($%2)"]],
  [0x70, ["BVS", 2, "rel"]],
  [0x73, ["TII", 7]],
  [0x78, ["SEI", 1]],
  [0x7C, ["JMP", 3, "($%2,X)"]],
  [0x80, ["BRA", 2, "rel"]],
  [0x82, ["CLX", 1]],
  [0x84, ["STY", 2, "$%1"]],
  [0x85, ["STA", 2, "$%1"]],
  [0x86, ["STX", 2, "$%1"]],
  [0x88, ["DEY", 1]],
  [0x8A, ["TXA", 1]],
  [0x8C, ["STY", 3, "$%2"]],
  [0x8D, ["STA", 3, "$%2"]],
  [0x8E, ["STX", 3, "$%2"]],
  [0x90, ["BCC", 2, "rel"]],
  [0x98, ["TYA", 1]],
  [0x99, ["STA", 3, "$%2,Y"]],
  [0x9A, ["TXS", 1]],
  [0x9C, ["STZ", 3, "$%2"]],
  [0xA0, ["LDY", 2, "#$%1"]],
  [0xA2, ["LDX", 2, "#$%1"]],
  [0xA4, ["LDY", 2, "$%1"]],
  [0xA5, ["LDA", 2, "$%1"]],
  [0xA8, ["TAY", 1]],
  [0xA9, ["LDA", 2, "#$%1"]],
  [0xAA, ["TAX", 1]],
  [0xAC, ["LDY", 3, "$%2"]],
  [0xAD, ["LDA", 3, "$%2"]],
  [0xB0, ["BCS", 2, "rel"]],
  [0xB1, ["LDA", 2, "($%1),Y"]],
  [0xB5, ["LDA", 2, "$%1,X"]],
  [0xB8, ["CLV", 1]],
  [0xB9, ["LDA", 3, "$%2,Y"]],
  [0xBA, ["TSX", 1]],
  [0xBD, ["LDA", 3, "$%2,X"]],
  [0xC0, ["CPY", 2, "#$%1"]],
  [0xC2, ["CLY", 1]],
  [0xC4, ["CPY", 2, "$%1"]],
  [0xC5, ["CMP", 2, "$%1"]],
  [0xC8, ["INY", 1]],
  [0xC9, ["CMP", 2, "#$%1"]],
  [0xCA, ["DEX", 1]],
  [0xCC, ["CPY", 3, "$%2"]],
  [0xCD, ["CMP", 3, "$%2"]],
  [0xD0, ["BNE", 2, "rel"]],
  [0xD4, ["CSH", 1]],
  [0xD8, ["CLD", 1]],
  [0xE0, ["CPX", 2, "#$%1"]],
  [0xE3, ["TIA", 7]],
  [0xE4, ["CPX", 2, "$%1"]],
  [0xE6, ["INC", 2, "$%1"]],
  [0xE8, ["INX", 1]],
  [0xE9, ["SBC", 2, "#$%1"]],
  [0xEA, ["NOP", 1]],
  [0xEC, ["CPX", 3, "$%2"]],
  [0xF0, ["BEQ", 2, "rel"]],
  [0xF3, ["TAI", 7]],
  [0xF4, ["SET", 1]],
  [0xF8, ["SED", 1]],
]);

function formatOperand(template, offset) {
  if (!template) return "";
  if (template === "rel") {
    const disp = bytes[offset + 1];
    const signed = disp >= 0x80 ? disp - 0x100 : disp;
    const target = (offset + 2 + signed) & 0xFFFF;
    return `$${hex(target, 4)}`;
  }
  const one = hex(bytes[offset + 1], 2);
  const two = hex(read16(offset + 1), 4);
  return template.replace("%1", one).replace("%2", two);
}

function disassembleRange(start, maxInstructions) {
  const lines = [];
  let pc = start;
  for (let i = 0; i < maxInstructions && pc < bytes.length; i++) {
    const op = bytes[pc];
    const def = OPCODES.get(op);
    if (!def) {
      lines.push(`${hex(pc, 6)}  ${hex(op)}         .db $${hex(op)}`);
      pc += 1;
      continue;
    }
    const [mnemonic, size, operandTemplate] = def;
    const raw = Array.from(bytes.slice(pc, Math.min(pc + size, bytes.length)), (b) => hex(b)).join(" ");
    const operand = formatOperand(operandTemplate, pc);
    lines.push(`${hex(pc, 6)}  ${raw.padEnd(20, " ")} ${mnemonic}${operand ? " " + operand : ""}`);
    pc += size;
  }
  return lines.join("\n");
}

function jsrTargets(start, end) {
  const targets = new Map();
  for (let i = start; i < end - 2; i++) {
    if (bytes[i] === 0x20) {
      const target = read16(i + 1);
      targets.set(target, (targets.get(target) || 0) + 1);
    }
  }
  return [...targets.entries()].sort((a, b) => b[1] - a[1]);
}

function longestRuns() {
  const values = [0x00, 0xFF];
  const rows = [];
  for (const value of values) {
    let bestStart = 0;
    let bestLen = 0;
    let curStart = 0;
    let curLen = 0;
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] === value) {
        if (curLen === 0) curStart = i;
        curLen++;
        if (curLen > bestLen) {
          bestLen = curLen;
          bestStart = curStart;
        }
      } else {
        curLen = 0;
      }
    }
    rows.push({ value, start: bestStart, length: bestLen });
  }
  return rows;
}

function main() {
  const lines = [];
  lines.push("# Soldier Blade ROM Analysis");
  lines.push("");
  lines.push(`ROM: ${romPath}`);
  lines.push(`Size: ${bytes.length} bytes (${(bytes.length / 1024).toFixed(0)} KiB)`);
  lines.push("");
  lines.push("## Interesting ASCII strings");
  for (const needle of ["SOLDIBLADECHA", "NORMAL GAME", "2 MINUTES", "5 MINUTES", "CARAVAN STAGE", "CONGRATULATION", "HUDSON SOFT"]) {
    const hits = findAscii(needle);
    lines.push(`- ${needle}: ${hits.map((x) => `0x${hex(x, 6)}`).join(", ") || "not found"}`);
  }
  lines.push("");
  lines.push("## Bank summary (first 16)");
  for (const row of bankSummary().slice(0, 16)) {
    lines.push(`- bank ${hex(row.bank)} @ 0x${hex(row.offset, 5)}: entropy ${row.entropy.toFixed(3)}, printable ${row.printable}, 00 ${row.zeros}, FF ${row.ff}`);
  }
  lines.push("");
  lines.push("## Bank summary (last 16)");
  for (const row of bankSummary().slice(-16)) {
    lines.push(`- bank ${hex(row.bank)} @ 0x${hex(row.offset, 5)}: entropy ${row.entropy.toFixed(3)}, printable ${row.printable}, 00 ${row.zeros}, FF ${row.ff}`);
  }
  lines.push("");
  lines.push("## Longest filler runs");
  for (const row of longestRuns()) {
    lines.push(`- byte 0x${hex(row.value)}: len ${row.length} at 0x${hex(row.start, 6)}`);
  }
  lines.push("");
  lines.push("## Main menu text block around 0x003000");
  lines.push("```text");
  lines.push(dumpRange(0x003000, 0x120));
  lines.push("```");
  lines.push("");
  lines.push("## High score / congratulation block around 0x00EFF0");
  lines.push("```text");
  lines.push(dumpRange(0x00EFF0, 0x60));
  lines.push("```");
  lines.push("");
  lines.push("## Structured block around 0x002348");
  lines.push("```text");
  lines.push(dumpRange(0x002348, 0x70));
  lines.push("```");
  lines.push("");
  lines.push("## Partial HuC6280 disassembly from ROM start");
  lines.push("```asm");
  lines.push(disassembleRange(0x000000, 96));
  lines.push("```");
  lines.push("");
  lines.push("## JSR targets seen in first 16 KiB");
  for (const [target, count] of jsrTargets(0, 0x4000).slice(0, 24)) {
    lines.push(`- $${hex(target, 4)} referenced ${count} times`);
  }
  lines.push("");
  lines.push("## Notes");
  lines.push("- The ROM starts with live executable code rather than a file signature, consistent with a HuCard image.");
  lines.push("- The menu text block stores labels with short leading control bytes, likely text layout metadata such as tile coordinates or style flags.");
  lines.push("- The later banks show much higher entropy, suggesting compressed or tightly packed graphics/music/stage content.");
  lines.push("- This script includes only a partial HuC6280 opcode table; unknown bytes are emitted as data and should not be over-interpreted.");

  const outPath = path.join(__dirname, "..", "analysis", "soldier-blade-analysis.md");
  fs.writeFileSync(outPath, lines.join("\n"));
  console.log(outPath);
}

main();
