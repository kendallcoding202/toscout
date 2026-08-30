/* Pre-flight: run before sending the link to anyone.
   Serves the site the way GitHub Pages does -- over HTTP, at a project subpath -- and
   exercises the paths most likely to ruin a first impression: a phone, a browser with
   storage blocked, and arriving via the landing page rather than directly.

   Start the server first:
     mkdir -p /tmp/pf/toscout && git archive HEAD | tar -x -C /tmp/pf/toscout
     (cd /tmp/pf && python3 -m http.server 8765 &)
     node tools/tests/preflight.mjs

   Requires playwright: npm install playwright */
import { chromium, devices } from 'playwright';
const BASE = 'http://127.0.0.1:8765/toscout';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let failures = [];
const ok = (m) => console.log('  ✓ ' + m);
const bad = (m) => { failures.push(m); console.log('  ✗ ' + m); };

async function fullRun(p, label) {
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  p.on('requestfailed', r => errs.push('requestfailed: ' + r.url()));

  await p.goto(BASE + '/pickone.html', { waitUntil: 'networkidle' });

  // the external script must actually have loaded over HTTP
  const loaded = await p.evaluate(() => typeof window.checkAudience === 'function');
  loaded ? ok(label + ': vague.js loaded over HTTP at subpath') : bad(label + ': vague.js DID NOT LOAD');
  if (!loaded) return errs;

  await p.fill('#dump', 'positioning consultants\nfreelance copywriters\nin-house PMMs');
  await p.click('#to2');
  const cards = p.locator('.cand');
  const c0 = cards.first();
  await c0.locator('.toggle button', { hasText: 'Yes' }).click();
  await c0.locator('.toggle button', { hasText: 'Today' }).click();
  await c0.locator('input[type=text]').fill('Michal');
  await p.click('#to3');
  await p.locator('.cut-row').first().locator('button').click();
  const gi = p.locator('.cut-row .give input');
  for (let i = 0; i < await gi.count(); i++) {
    await gi.nth(i).fill('the wider market and an easier pitch');
  }
  await p.click('#to4');
  await p.fill('#sentence', 'consultants about to run a positioning workshop for a new client');
  await p.click('#to5');
  await p.fill('#excl', 'in-house teams with a PMM already');
  await p.fill('#belief', 'that narrowing wins more work than widening');
  await p.fill('#before', 'saying yes to everyone');
  await p.fill('#after', 'turning the wrong clients away');
  await p.click('#finish');
  const card = await p.locator('#card').textContent();
  const needed = ['I am for', 'I am not for', 'What they believe', 'The change', 'What I gave up', 'Decided'];
  const missing = needed.filter(n => !card.includes(n));
  missing.length ? bad(label + ': card missing ' + missing.join(', ')) : ok(label + ': full run completes, card renders');
  return errs;
}

// ---------- desktop ----------
console.log('\nDESKTOP (1000x900)');
{
  const ctx = await b.newContext({ viewport: { width: 1000, height: 900 },
                                   permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errs = await fullRun(p, 'desktop');

  // clipboard actually contains the card
  await p.click('#copy');
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  clip.includes('# Position card') && clip.includes('I am for')
    ? ok('desktop: Copy as Markdown puts the real card on the clipboard')
    : bad('desktop: clipboard content wrong: ' + clip.slice(0, 80));

  // reload persistence
  await p.reload();
  (await p.locator('#out').isVisible())
    ? ok('desktop: reload resumes on the finished card')
    : bad('desktop: reload lost progress');

  // back navigation through every step
  let navOk = true;
  for (const id of ['back5', 'back4', 'back3', 'back2']) {
    await p.goto(BASE + '/pickone.html');
    if (!(await p.locator('#' + id).count())) { navOk = false; }
  }
  navOk ? ok('desktop: every step has a Back control') : bad('desktop: a Back control is missing');

  errs.length ? bad('desktop JS/network errors: ' + errs.join(' | ')) : ok('desktop: no JS or network errors');
  await ctx.close();
}

// ---------- mobile ----------
console.log('\nMOBILE (iPhone 13)');
{
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  const errs = await fullRun(p, 'mobile');
  const overflow = await p.evaluate(() =>
    document.documentElement.scrollWidth > window.innerWidth + 1);
  overflow ? bad('mobile: page scrolls sideways') : ok('mobile: no horizontal overflow');

  // tap targets on the landing page CTA
  await p.goto(BASE + '/');
  const box = await p.locator('a.btn.solid').first().boundingBox();
  box && box.height >= 40 ? ok('mobile: primary CTA is a usable tap target (' + Math.round(box.height) + 'px)')
                          : bad('mobile: CTA too small: ' + JSON.stringify(box));
  const of2 = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  of2 ? bad('mobile: landing page scrolls sideways') : ok('mobile: landing page fits');
  errs.length ? bad('mobile JS errors: ' + errs.join(' | ')) : ok('mobile: no JS or network errors');
  await ctx.close();
}

// ---------- localStorage blocked (private mode / blocked cookies) ----------
console.log('\nSTORAGE BLOCKED');
{
  const ctx = await b.newContext({ viewport: { width: 1000, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() { throw new Error('storage blocked'); }
    });
  });
  const errs = await fullRun(p, 'no-storage');
  errs.length ? bad('no-storage: crashed — ' + errs.join(' | '))
              : ok('no-storage: works with localStorage unavailable');
  await ctx.close();
}

// ---------- landing → tool link ----------
console.log('\nNAVIGATION');
{
  const ctx = await b.newContext({ viewport: { width: 1000, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/');
  await p.locator('a.btn.solid').first().click();
  await p.waitForLoadState('networkidle');
  p.url().endsWith('/pickone.html')
    ? ok('landing page CTA reaches the tool (' + p.url().replace(BASE, '') + ')')
    : bad('landing CTA went to ' + p.url());
  (await p.evaluate(() => typeof window.checkAudience === 'function'))
    ? ok('tool is functional when reached via the landing page')
    : bad('tool broken when reached via the landing page');
  await ctx.close();
}

await b.close();
console.log('\n' + (failures.length ? 'FAILURES (' + failures.length + '):\n' + failures.map(f => '  - ' + f).join('\n')
                                    : 'ALL PRE-FLIGHT CHECKS PASSED'));
process.exit(failures.length ? 1 : 0);
