/* Unit tests for the vagueness detector — the behavior the whole product rests on.
   Run: node tools/tests/test_vague.mjs */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { checkAudience, checkExclusion, checkCost, checkBelief, checkChange, isFiller } =
  require("../vague.js");

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

/* --- regressions found by running the tool on this project itself --- */

test("catches two audiences even when neither noun is in the vague list", () => {
  const r = checkAudience("freelance copywriters and positioning consultants");
  assert.ok(r.issues.some(i => i.kind === "conjunction"),
    "'copywriters' is not in VAGUE_NOUNS, but -ers makes it a role noun");
  assert.equal(r.pass, false);
});

test("accepts specificity that comes from behavior, not only from timing", () => {
  for (const s of [
    "consultants who run positioning workshops on a Miro board",
    "bookkeepers who file quarterly VAT returns by hand",
  ]) {
    const r = checkAudience(s);
    assert.equal(r.pass, true,
      `${JSON.stringify(s)} is specific via activity — got: ${r.issues.map(i => i.message).join(" | ")}`);
  }
});

test("an empty relative clause is still not specificity", () => {
  for (const s of ["people who need help", "founders who want more customers", "teams that use software"]) {
    assert.equal(checkAudience(s).pass, false, `${JSON.stringify(s)} says nothing`);
  }
});

test("a hedge still fails even with a strong behavior clause", () => {
  const r = checkAudience("anyone who has to write a landing page for a client");
  assert.equal(r.pass, false, "hedges outrank everything else");
  assert.ok(r.issues.some(i => i.kind === "hedge"));
});

test("the too-short message states the real threshold", () => {
  const r = checkAudience("positioning consultants");
  const msg = r.issues.find(i => i.kind === "short").message;
  assert.ok(msg.startsWith("Three words or fewer"), "the check fires at 3 or fewer, so say three");
});

/* --- substance gates: the tool was rigorous at step 4 and lenient everywhere else --- */


test("a stated cost has to name something real", () => {
  for (const bad of ["xxx", "asd", "nothing", "none", "n/a", "tbd", "?", "a bit"]) {
    assert.equal(checkCost(bad).pass, false, `should reject ${JSON.stringify(bad)}`);
  }
  assert.equal(checkCost("the referral pipeline that came with them").pass, true);
  assert.equal(checkCost("about 4k a month in retainer").pass, true);
});

test("'nothing' gets called out rather than silently rejected", () => {
  assert.match(checkCost("nothing").message, /pointless/);
});

test("a belief has to be a claim, not a word", () => {
  for (const bad of ["asd", "quality", "growth", "they want more"]) {
    assert.equal(checkBelief(bad).pass, false, `should reject ${JSON.stringify(bad)}`);
  }
  assert.equal(checkBelief("that pricing is a skill, not a personality trait").pass, true);
});

test("before and after must differ — no change, no product", () => {
  const same = checkChange("undercharging and quietly resentful", "undercharging and quietly resentful");
  assert.equal(same.pass, false);
  assert.match(same.message, /identical/);
  assert.equal(checkChange("undercharging and resentful about it", "quoting a number without flinching").pass, true);
});

test("filler is detected by shape, not by a blocklist", () => {
  for (const f of ["xxx", "qq ww", "zzzz", "hjkl"]) {
    assert.equal(isFiller(f), true, `${JSON.stringify(f)} should read as filler`);
  }
  assert.equal(isFiller("the referral pipeline"), false);
});

test("empty fields stay silent rather than shouting at someone mid-type", () => {
  assert.equal(checkCost("").message, "", "an untouched field should not show an error");
  assert.equal(checkBelief("").message, "");
});
