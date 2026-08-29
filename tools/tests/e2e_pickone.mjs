/* End-to-end test for pickone.html, driven in a real browser.
   Requires playwright: npm install playwright
   Run: node tools/tests/e2e_pickone.mjs
   Verifies the gates that make this a tool rather than a form — you cannot advance
   past a vague audience, an unstated cost, or an exclusion that excludes nobody. */
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 900, height: 1000 }, deviceScaleFactor: 1 });
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
const step = async (label, fn) => { await fn(); console.log('✓ ' + label); };

const PAGE = 'file://' + new URL('../../pickone.html', import.meta.url).pathname;
await p.goto(PAGE);

await step('step 1: next disabled with <3 candidates', async () => {
  await p.fill('#dump', 'freelance illustrators');
  if (!await p.isDisabled('#to2')) throw new Error('should be disabled with 1 candidate');
});
await step('step 1: enables at 3', async () => {
  await p.fill('#dump', 'freelance illustrators\ndesign agencies\nmarketing teams at startups');
  if (await p.isDisabled('#to2')) throw new Error('should be enabled');
  await p.click('#to2');
});
await step('step 2: candidates rendered with questions', async () => {
  const n = await p.locator('.cand').count();
  if (n !== 3) throw new Error('expected 3 candidates, got ' + n);
  await p.locator('.cand').first().locator('.toggle button', { hasText: 'Yes' }).click();
  await p.locator('.cand').first().locator('input[type=text]').fill('Marta');
  await p.locator('.cand').first().locator('.toggle button', { hasText: 'Today' }).click();
  const score = await p.locator('.cand').first().locator('.score').textContent();
  if (!score.includes('6/6')) throw new Error('expected 6/6, got: ' + score);
  await p.click('#to3');
});
await step('step 3: next blocked until kept + all costs written', async () => {
  if (!await p.isDisabled('#to4')) throw new Error('should be disabled before keeping');
  await p.locator('.cut-row').first().locator('button').click();
  if (!await p.isDisabled('#to4')) throw new Error('should still be disabled: costs unwritten');
  const inputs = p.locator('.cut-row .give input');
  const n = await inputs.count();
  if (n !== 2) throw new Error('expected 2 give-up inputs, got ' + n);
  for (let i = 0; i < n; i++) await inputs.nth(i).fill('the referral pipeline that came with them');
  if (await p.isDisabled('#to4')) throw new Error('should be enabled now');
  await p.click('#to4');
});
await step('step 4: rejects vague, accepts specific', async () => {
  await p.fill('#sentence', 'small businesses');
  if (!await p.isDisabled('#to5')) throw new Error('vague sentence should block');
  const bad = await p.locator('#verdict .verdict.bad').count();
  if (!bad) throw new Error('expected a rejection verdict');
  await p.fill('#sentence', 'freelance illustrators who just went full-time');
  if (await p.isDisabled('#to5')) throw new Error('specific sentence should pass');
  await p.click('#to5');
});
await step('step 5: rejects "nobody", accepts a real exclusion', async () => {
  await p.fill('#excl', 'nobody');
  await p.fill('#belief', 'that pricing is a skill, not a personality trait');
  await p.fill('#before', 'undercharging and resentful');
  await p.fill('#after', 'quoting without flinching');
  if (!await p.isDisabled('#finish')) throw new Error('"nobody" should block');
  await p.fill('#excl', 'agencies with an in-house design team');
  if (await p.isDisabled('#finish')) throw new Error('should be enabled');
  await p.click('#finish');
});
await step('card renders with all sections and the given-up costs', async () => {
  const txt = await p.locator('#card').textContent();
  for (const need of ['I am for', 'I am not for', 'What they believe', 'The change',
                      'What I gave up', 'referral pipeline', 'Decided']) {
    if (!txt.includes(need)) throw new Error('card missing: ' + need);
  }
});
await step('progress survives a reload', async () => {
  await p.reload();
  const visible = await p.locator('#out').isVisible();
  if (!visible) throw new Error('should resume on the card after reload');
});

// exercise the rejection path once more from a clean slate
await p.evaluate(() => localStorage.clear());
await p.goto(PAGE);
await p.fill('#dump', 'freelance illustrators\ndesign agencies\nmarketing teams');
await p.click('#to2'); await p.click('#to3');
await p.locator('.cut-row').first().locator('button').click();
const gi = p.locator('.cut-row .give input');
for (let i = 0; i < await gi.count(); i++) await gi.nth(i).fill('steady retainer work');
await p.click('#to4');
await p.fill('#sentence', 'creative professionals and agencies');
if (!await p.isDisabled('#to5')) throw new Error('two-audience sentence should block');
console.log('✓ rejection path holds from a clean slate');

await b.close();
if (errs.length) { console.error('\nJS ERRORS:\n' + errs.join('\n')); process.exit(1); }
console.log('\nAll checks passed, no JS errors.');
