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

/* Verbs so general that a clause built from them says nothing.
   "who need help" is not a behavior; "who run positioning workshops" is. */
const GENERIC_VERBS = [
  "need", "needs", "want", "wants", "like", "likes", "use", "uses", "using",
  "have", "has", "are", "is", "do", "does", "get", "gets", "buy", "buys",
  "help", "make", "makes", "work", "works", "run", "runs", "the", "a", "an",
  "to", "of", "for", "and", "their", "them", "it", "with", "on", "in",
  /* filler that reads as content but carries none */
  "more", "less", "better", "best", "good", "great", "new", "other", "others",
  "some", "many", "most", "all", "any", "thing", "things", "stuff", "easier",
  "faster", "cheaper", "quality", "successful", "growth", "money", "time",
];

/* Person-role suffixes. Used only to decide whether a phrase names a group of
   people, which is how we spot two audiences wearing one sentence. */
const ROLE_SUFFIX = /(?:ers|ors|ists|ians|eurs)$/;

function looksLikeAudienceNoun(word) {
  return VAGUE_NOUNS.indexOf(word) !== -1 || (word.length > 5 && ROLE_SUFFIX.test(word));
}

/* A relative clause counts as specificity when it actually describes something:
   at least three words after "who"/"that", and at least one of them carrying meaning. */
function hasBehaviorClause(lower) {
  var m = lower.match(/\b(?:who|that)\s+(.+)$/);
  if (!m) return false;
  var rest = words(m[1]);
  if (rest.length < 3) return false;
  /* A vague noun inside the clause is no better than one outside it —
     "who want more customers" describes nothing. */
  return rest.some(function (w) {
    return w.length > 3 &&
           GENERIC_VERBS.indexOf(w) === -1 &&
           VAGUE_NOUNS.indexOf(w) === -1;
  });
}

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
      message: "Three words or fewer isn't an audience, it's a category. Who exactly, and when?",
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
      words(part).some(looksLikeAudienceNoun)
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
  const hasBehavior = hasBehaviorClause(lower);
  if (!hasSituation && !hasNumber && !hasBehavior) {
    issues.push({
      kind: "no-situation",
      message: "Nothing here says what makes them different from everyone else with that job title. Give them a moment (“who just went full-time”), a constraint (“with fewer than 5 clients”), or something they actually do (“who run their own workshops”).",
    });
  }
  if (hasSituation) strengths.push("Names a moment, not just a job title.");
  if (hasNumber) strengths.push("Carries a concrete constraint.");
  if (hasBehavior) strengths.push("Describes what they actually do, not just what they are.");

  if (qualifierCount >= 5) strengths.push("Enough qualifiers to exclude people.");
  if (bareNouns.length === 0 && ws.length >= 4) strengths.push("Avoids the usual catch-all nouns.");

  const score = Math.max(0, Math.min(100, 100 - issues.length * 28));
  return { pass: issues.length === 0, score, issues, strengths };
}

/* Placeholder text: filler people type to get past a gate. This can't defeat someone
   determined to lie to themselves with real-looking words, and it isn't meant to — it
   exists to stop the lazy answer, which is the common case. */
function isFiller(text) {
  var ws = words(text);
  if (!ws.length) return true;
  return ws.every(function (w) {
    return !/[aeiouy]/.test(w) || /^(.)\1+$/.test(w);
  });
}

var NOTHING = /^(nothing|nothing much|none|no ?one|nobody|n\/a|na|idk|dunno|tbd|\?+)$/i;

/* Generic substance gate, used by every field that isn't the audience sentence.
   Returns { pass, message }. */
function checkSubstance(raw, minWords, message) {
  var text = (raw || "").trim();
  if (!text) return { pass: false, message: "" };          // empty is silent, not an error
  if (NOTHING.test(text)) {
    return { pass: false, message: "\u201c" + text + "\u201d is the answer that makes this exercise pointless." };
  }
  if (isFiller(text)) return { pass: false, message: "That isn't an answer yet." };
  if (words(text).length < minWords) return { pass: false, message: message };
  return { pass: true, message: "" };
}

/* What you lose by dropping an audience. Vague here and the decision won't hold. */
function checkCost(raw) {
  return checkSubstance(raw, 3,
    "Name what you actually lose — a client, a revenue line, a referral source. Three words minimum.");
}

/* The worldview. Has to be a claim, not a word. */
function checkBelief(raw) {
  return checkSubstance(raw, 4,
    "That's not a belief yet. What do they think is true that most people don't?");
}

/* Before and after. If they're the same, there is no product. */
function checkChange(before, after) {
  var b = checkSubstance(before, 3, "Say who they are before, in a few words.");
  if (!b.pass) return { pass: false, message: b.message, field: "before" };
  var a = checkSubstance(after, 3, "Say who they are after, in a few words.");
  if (!a.pass) return { pass: false, message: a.message, field: "after" };
  if ((before || "").trim().toLowerCase() === (after || "").trim().toLowerCase()) {
    return { pass: false, field: "after",
             message: "Before and after are identical. If nothing changes, there is nothing to sell." };
  }
  return { pass: true, message: "" };
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
  if (isFiller(text)) return { pass: false, message: "That isn't a group of people." };
  if (ws.length < 2) return { pass: false, message: "Two words minimum. Who, specifically, are you turning away?" };
  return { pass: true, message: "" };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    checkAudience, checkExclusion, checkCost, checkBelief, checkChange,
    checkSubstance, isFiller, looksLikeAudienceNoun, hasBehaviorClause,
    VAGUE_NOUNS, HEDGES, SITUATION,
  };
}
