const fs = require("fs");
const path = require("path");

const romPath = path.join(__dirname, "..", "analysis", "Soldier Blade (Japan).pce");
const bytes = fs.readFileSync(romPath);

function hex(v, w = 2) {
  return v.toString(16).toUpperCase().padStart(w, "0");
}

function dump(start, length) {
  const lines = [];
  for (let i = start; i < start + length; i += 16) {
    const s = bytes.slice(i, Math.min(i + 16, bytes.length));
    const hx = [...s].map((b) => hex(b)).join(" ");
    const asc = [...s].map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : ".")).join("");
    lines.push(`${hex(i, 6)}  ${hx.padEnd(47, " ")}  ${asc}`);
  }
  return lines.join("\n");
}

function jsrCallers(target) {
  const hits = [];
  const lo = target & 0xff;
  const hi = (target >> 8) & 0xff;
  for (let i = 0; i < bytes.length - 2; i++) {
    if (bytes[i] === 0x20 && bytes[i + 1] === lo && bytes[i + 2] === hi) hits.push(i);
  }
  return hits;
}

function literalRefs(target) {
  const hits = [];
  const lo = target & 0xff;
  const hi = (target >> 8) & 0xff;
  for (let i = 0; i < bytes.length - 1; i++) {
    if (bytes[i] === lo && bytes[i + 1] === hi) hits.push(i);
  }
  return hits;
}

const opInfo = new Map([
  [0x20, ["JSR", 3]], [0x4C, ["JMP", 3]], [0x60, ["RTS", 1]], [0xA9, ["LDA #", 2]],
  [0xA5, ["LDA zp", 2]], [0xAD, ["LDA abs", 3]], [0x85, ["STA zp", 2]], [0x8D, ["STA abs", 3]],
  [0x9D, ["STA abs,X", 3]], [0x99, ["STA abs,Y", 3]], [0x91, ["STA (zp),Y", 2]],
  [0xA0, ["LDY #", 2]], [0xA2, ["LDX #", 2]], [0xBC, ["LDY abs,X", 3]], [0xBD, ["LDA abs,X", 3]],
  [0xB1, ["LDA (zp),Y", 2]], [0xC8, ["INY", 1]], [0xE6, ["INC zp", 2]], [0x18, ["CLC", 1]],
  [0x69, ["ADC #", 2]], [0x65, ["ADC zp", 2]], [0x90, ["BCC", 2]], [0x10, ["BPL", 2]],
  [0xD0, ["BNE", 2]], [0xF0, ["BEQ", 2]], [0x82, ["CLX", 1]], [0xC2, ["CLY", 1]],
  [0x5A, ["PHY?", 1]], [0x7A, ["PLY?", 1]], [0xDA, ["PHX?", 1]], [0xFA, ["PLX?", 1]],
]);

function quickDisasm(start, count) {
  const lines = [];
  let pc = start;
  for (let n = 0; n < count && pc < bytes.length; n++) {
    const op = bytes[pc];
    const def = opInfo.get(op);
    if (!def) {
      lines.push(`${hex(pc, 6)}  ${hex(op)}         .db $${hex(op)}`);
      pc += 1;
      continue;
    }
    const [name, size] = def;
    const raw = [...bytes.slice(pc, Math.min(pc + size, bytes.length))].map((b) => hex(b)).join(" ");
    lines.push(`${hex(pc, 6)}  ${raw.padEnd(10, " ")} ${name}`);
    pc += size;
  }
  return lines.join("\n");
}

const targets = [0x8F2C, 0x902F, 0x9105];
let out = [];

out.push("# Soldier Blade UI Probe");
out.push("");
for (const t of targets) {
  out.push(`## Target $${hex(t, 4)}`);
  const callers = jsrCallers(t);
  out.push(`JSR callers: ${callers.length}`);
  out.push(callers.slice(0, 80).map((x) => `0x${hex(x, 6)}`).join(", "));
  out.push("");
  out.push("Hex dump:");
  out.push("```text");
  out.push(dump(t, 0x100));
  out.push("```");
  out.push("");
}

out.push("## Literal references");
for (const addr of [0x33B3, 0x33D3, 0x33F3, 0x37, 0x38, 0x39, 0x3A, 0x7D, 0x7E, 0x7F]) {
  if (addr <= 0xFF) continue;
  const refs = literalRefs(addr);
  out.push(`- $${hex(addr, 4)} refs: ${refs.length} (${refs.slice(0, 40).map((x) => `0x${hex(x, 6)}`).join(", ")})`);
}
out.push("");

out.push("## Quick disasm around score-screen callers");
for (const start of [0x00EA20, 0x00EDA0, 0x00EEF0, 0x00F070]) {
  out.push(`### 0x${hex(start, 6)}`);
  out.push("```asm");
  out.push(quickDisasm(start, 48));
  out.push("```");
}

const outPath = path.join(__dirname, "..", "analysis", "soldier-blade-ui-probe.md");
fs.writeFileSync(outPath, out.join("\n"));
console.log(outPath);
