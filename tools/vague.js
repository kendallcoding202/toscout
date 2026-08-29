/* Vagueness detection for audience sentences.
   No AI, no network — vagueness is structural and you can just look for it.
   Shared by pickone.html; kept separate so it can be tested headlessly. */

const VAGUE_NOUNS = [
  "business", "businesses", "company", "companies", "team", "teams",
  "professional", "professionals", "people", "person", "user", "users",
  "customer", "customers", "client", "clients", "founder", "founders",
  "creator", "creators", "marketer", "marketers", "developer", "developers",
  "designer", "designers", "agency", "agencies", "brand", "brands",
  "organization", "organizations", "organisation", "organisations",
  "entrepreneur", "entrepreneurs", "freelancer", "freelancers",
  "startup", "startups", "owner", "owners", "manager", "managers",
  "writer", "writers", "consultant", "consultants", "coach", "coaches",
  "smb", "smbs", "sme", "smes",
];

/* Words that quietly re-open the door you just closed. */
const HEDGES = [
  "anyone", "everyone", "everybody", "anybody", "all kinds", "any kind",
  "all sorts", "etc", "and more", "and others", "or similar", "among others",
  "of all sizes", "big and small", "large and small", "various", "whoever",
  "basically anyone", "really anyone",
];

/* Markers that pin the audience to a moment, a transition, or a constraint.
   A specific audience is almost always a specific *situation*, not a job title. */
const SITUATION = [
  "who just", "who recently", "who have just", "just went", "just started",
  "just left", "just launched", "just hired", "first year", "first month",
  "first 90", "first ninety", "in their first", "new to", "about to",
  "after", "before", "during", "when they", "switching", "moving from",
  "transitioning", "outgrown", "outgrowing", "without", "with fewer",
  "with more", "with less", "under ", "over ", "between ", "still ",
  "for the first time", "since", "stuck", "trying to", "struggling",
];

const NUMERIC = /\b\d/;

function words(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter(Boolean);
}

/* Returns { pass, score, issues[], strengths[] }.
   `issues` are what stops you advancing; `strengths` are what earned the pass. */
function checkAudience(raw) {
  const text = (raw || "").trim();
  const lower = text.toLowerCase();
  const ws = words(text);
  const issues = [];
  const strengths = [];

  if (!text) {
    return { pass: false, score: 0, issues: [{ kind: "empty", message: "Write the sentence first." }], strengths: [] };
  }

  if (ws.length < 4) {
    issues.push({
      kind: "short",
      message: "Four words or fewer isn't an audience, it's a category. Who exactly, and when?",
    });
  }

  const hedge = HEDGES.find((h) => lower.includes(h));
  if (hedge) {
    issues.push({
      kind: "hedge",
      message: '"' + hedge + '" puts everyone back in the room. That is the opposite of picking one.',
    });
  }

  /* "X and Y" usually means two audiences wearing one sentence. Ignore "and" inside
     a situation clause like "just went full-time and is terrified". */
  const andSplit = lower.split(/\s+(?:and|plus|as well as|&)\s+/);
  if (andSplit.length > 1) {
    const bothLookLikeAudiences = andSplit.filter((part) =>
      VAGUE_NOUNS.some((n) => words(part).includes(n))
    ).length > 1;
    if (bothLookLikeAudiences) {
      issues.push({
        kind: "conjunction",
        message: "There are two audiences in this sentence. Pick one. The other one is the point of this exercise.",
      });
    }
  }

  /* A bare vague noun with nothing narrowing it. */
  const bareNouns = VAGUE_NOUNS.filter((n) => ws.includes(n));
  const qualifierCount = ws.length - bareNouns.length;
  if (bareNouns.length && qualifierCount < 3) {
    issues.push({
      kind: "vague-noun",
      message: '"' + bareNouns[0] + '" on its own describes millions of people. What kind, at what moment?',
    });
  }

  const hasSituation = SITUATION.some((s) => lower.includes(s));
  const hasNumber = NUMERIC.test(text);
  if (!hasSituation && !hasNumber) {
    issues.push({
      kind: "no-situation",
      message: "Nothing here describes a moment. When are they? (“who just went full-time”, “in their first 90 days”, “after their first hire”)",
    });
  } else if (hasSituation) {
    strengths.push("Names a moment, not just a job title.");
  } else if (hasNumber) {
    strengths.push("Carries a concrete constraint.");
  }

  if (qualifierCount >= 5) strengths.push("Enough qualifiers to exclude people.");
  if (bareNouns.length === 0 && ws.length >= 4) strengths.push("Avoids the usual catch-all nouns.");

  const score = Math.max(0, Math.min(100, 100 - issues.length * 28));
  return { pass: issues.length === 0, score, issues, strengths };
}

/* The exclusion answer has a lower bar — it just has to name somebody real. */
function checkExclusion(raw) {
  const text = (raw || "").trim();
  const ws = words(text);
  if (!text) return { pass: false, message: "Name who this is not for." };
  if (/^(no one|nobody|none|n\/a|na|everyone)$/i.test(text)) {
    return { pass: false, message: "If it excludes nobody, it is not positioning. Somebody has to be turned away." };
  }
  const hedge = HEDGES.find((h) => text.toLowerCase().includes(h));
  if (hedge) return { pass: false, message: '"' + hedge + '" is not an exclusion.' };
  if (ws.length < 2) return { pass: false, message: "Two words minimum. Who, specifically, are you turning away?" };
  return { pass: true, message: "" };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { checkAudience, checkExclusion, VAGUE_NOUNS, HEDGES, SITUATION };
}
