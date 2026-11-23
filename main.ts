// Make the Judge Smile — u-gentle-badger-68-make-the-judge-smile-9228676d
//
// The program writes exactly one line about a small good thing that
// happened today to /output/entry.txt, with no trailing newline.
//
// --- The three candidate lines, judged against the brief ---
// Criteria, in order: (1) about a small good thing TODAY; (2) warmth — a
// glow that lands as genuinely felt; (3) surprise — an unexpected turn;
// (4) concreteness — one real small detail; (5) fresh wording, no
// greeting-card phrasing.
//
// Candidate A: "Today the bus driver waited, doors sighing open, while an
//   old man with a cane shuffled aboard — and the whole bus, for once, was
//   in no hurry at all."
//   Warm and concrete (the cane, the sighing doors), but the turn is mild
//   and the ending drifts into a general sentiment. Loses on surprise.
//
// Candidate B: "Today my neighbour left a mango on my doorstep with a note
//   that just said 'too many' — and it was, somehow, the sweetest thing
//   anyone has given me all year."
//   The "too many" note is a lovely unexpected detail and the warmth is
//   real, but "the sweetest thing anyone has given me" leans a little
//   toward greeting-card phrasing. Loses on fresh wording.
//
// Candidate C (CHOSEN): "Today at 7 a.m. the stray cat I feed finally let
//   me touch her ear, then purred like a rusty kettle — and I stood there
//   grinning at a cat like an idiot."
//   Wins on surprise: a purr like a rusty kettle is an image nobody sees
//   coming, and "grinning at a cat like an idiot" is a self-deprecating
//   turn that makes a reader smile. Warmth is genuinely felt, not
//   reported — the grin is the feeling, shown, not named. Concrete:
//   7 a.m., her ear, the kettle. Wording is entirely its own; nothing
//   in it could come off a card.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The chosen line. One sentence, one small good thing, today.
const LINE =
  "Today at 7 a.m. the stray cat I feed finally let me touch her ear, then purred like a rusty kettle — and I stood there grinning at a cat like an idiot.";

const OUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

// --- Validate the line before writing anything ---
// Count Unicode code points, not UTF-16 code units, so the 200-char gate
// is measured the way the scorer measures it.
const chars = [...LINE];
if (chars.length < 1 || chars.length > MAX_CHARS) {
  throw new Error(
    `entry must be 1-${MAX_CHARS} characters, got ${chars.length}`,
  );
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
// No invisible control characters: the gate reads plain UTF-8 text, and a
// stray control byte would make the file look different to the judge than
// it looks to us.
for (const ch of LINE) {
  if (ch.codePointAt(0)! < 0x20) {
    throw new Error(`entry contains a control character U+${ch
      .codePointAt(0)!
      .toString(16)
      .padStart(4, "0")}`);
  }
}

// --- Write exactly the line, no trailing newline ---
mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, LINE, "utf8");

// --- Read it back and refuse to finish unless it matches byte-for-byte ---
const back = readFileSync(OUT_PATH, "utf8");
if (back !== LINE) {
  throw new Error("entry.txt does not match the chosen line byte-for-byte");
}

console.log(`wrote ${chars.length} chars to ${OUT_PATH}`);
console.log(LINE);
