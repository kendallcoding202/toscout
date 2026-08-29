/* Unit tests for the vagueness detector — the behavior the whole product rests on.
   Run: node tools/tests/test_vague.mjs */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { checkAudience, checkExclusion } = require("../vague.js");

const REJECTED = [
  ["small businesses", "bare vague noun, no moment"],
  ["founders", "one word"],
  ["marketing teams", "no situation"],
  ["anyone who writes online", "hedge word"],
  ["freelance designers and agencies", "two audiences"],
  ["creative professionals and agencies", "two audiences plus vague noun"],
  ["businesses of all sizes", "hedge"],
  ["startups, agencies, etc", "hedge"],
  ["", "empty"],
];

const ACCEPTED = [
  "freelance illustrators who just went full-time",
  "B2B SaaS founders in their first 90 days after a seed round",
  "solo consultants with fewer than 5 clients",
  "bookkeepers who just lost their biggest client",
  "restaurant owners about to open a second location",
];

test("rejects sentences that fail to exclude anyone", () => {
  for (const [input, why] of REJECTED) {
    const r = checkAudience(input);
    assert.equal(r.pass, false, `should reject ${JSON.stringify(input)} (${why})`);
    assert.ok(r.issues.length > 0, `should explain why: ${JSON.stringify(input)}`);
    for (const issue of r.issues) {
      assert.ok(issue.message.length > 10, "issues must be specific, not a score");
    }
  }
});

test("accepts sentences pinned to a person at a moment", () => {
  for (const input of ACCEPTED) {
    const r = checkAudience(input);
    assert.equal(r.pass, true,
      `should accept ${JSON.stringify(input)} — got: ${r.issues.map(i => i.message).join(" | ")}`);
    assert.ok(r.strengths.length > 0, "a pass should say what earned it");
  }
});

test("a bare vague noun is flagged by name, not generically", () => {
  const r = checkAudience("agencies");
  assert.ok(r.issues.some(i => i.message.includes("agencies")),
    "the complaint should quote the offending word back");
});

test("'and' inside a situation clause is not read as two audiences", () => {
  const r = checkAudience("freelance illustrators who just went full-time and are terrified of pricing");
  assert.ok(!r.issues.some(i => i.kind === "conjunction"),
    "should not flag a conjunction joining a clause rather than two audiences");
});

test("exclusion must name somebody real", () => {
  for (const bad of ["nobody", "no one", "everyone", "n/a", ""]) {
    assert.equal(checkExclusion(bad).pass, false, `should reject ${JSON.stringify(bad)}`);
    assert.ok(checkExclusion(bad).message.length > 5, "should explain why");
  }
  assert.equal(checkExclusion("agencies with an in-house design team").pass, true);
});

test("scores degrade with each issue rather than being binary", () => {
  const clean = checkAudience("bookkeepers who just lost their biggest client");
  const messy = checkAudience("businesses");
  assert.ok(clean.score > messy.score, "a cleaner sentence should score higher");
  assert.ok(messy.score >= 0 && clean.score <= 100, "score stays in range");
});
