// Render smoke test for vasteams.com tool pages.
//
// Why this exists: every tool page renders React/Next entirely in the browser
// and depends on external CDNs/services. Those can change underneath us and
// silently blank a page while the server still returns HTTP 200 — exactly what
// @babel/standalone (unpinned "latest") did to /ai-economics.html. A curl check
// can't see that; only a real browser can. This loads each page, waits for the
// client render to settle, and fails if the page is blank, errored, or 4xx/5xx.
//
// Run locally:  cd scripts/smoke && npm install && npm test
// Override host: SMOKE_BASE_URL=https://staging... npm test

import { chromium } from 'playwright';

const BASE = process.env.SMOKE_BASE_URL || 'https://www.vasteams.com';

// EDIT HERE to add/remove guarded pages. `minText` is the floor of visible
// body text; a blank or crashed render falls far below it. Keep thresholds
// comfortably under each page's real content so normal copy edits never trip it.
const PAGES = [
  { path: '/',                  minText: 150 }, // sparse landing page (~223 chars healthy)
  { path: '/ai-economics.html', minText: 800 },
  { path: '/ai-clock',          minText: 150 },
  { path: '/ai-investment',     minText: 300 },
  { path: '/matrix-moment',     minText: 150 },
  { path: '/pulse',             minText: 200 },
  { path: '/retirement',        minText: 300 },
  { path: '/research',          minText: 200 },
  { path: '/about',             minText: 200 },
  { path: '/projects',          minText: 200 },
  { path: '/work',              minText: 200 },
];

// Console/runtime errors that mean the page is genuinely broken. We deliberately
// ignore other console noise (analytics, font warnings) to keep this low-alarm —
// a failure here should always be real.
const FATAL = [
  /resolve module specifier/i,     // the exact /ai-economics.html failure
  /is not defined/i,
  /SyntaxError/i,
  /Unexpected token/i,
  /ChunkLoadError/i,
  /Loading chunk \d+ failed/i,
  /Minified React error/i,
  /Application error: a client-side exception/i,
];

const browser = await chromium.launch();
const results = [];

for (const p of PAGES) {
  const url = BASE + p.path;
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('UNCAUGHT: ' + e.message));

  let status = 0;
  let text = '';
  const reasons = [];
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    status = resp ? resp.status() : 0;
    await page.waitForTimeout(2500); // let client-side render settle
    text = (await page.evaluate(() => document.body.innerText || '')).trim();
  } catch (e) {
    reasons.push('navigation failed: ' + e.message);
  }

  if (status >= 400) reasons.push(`HTTP ${status}`);
  if (text.length < p.minText) {
    reasons.push(`only ${text.length} chars of visible text (expected >= ${p.minText}) — blank/broken render`);
  }
  const fatal = errors.filter((t) => FATAL.some((rx) => rx.test(t)));
  if (fatal.length) reasons.push(`fatal errors: ${fatal.slice(0, 3).join(' | ')}`);

  await page.close();
  const ok = reasons.length === 0;
  results.push({ url, ok, status, textLen: text.length, reasons });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${url}  [HTTP ${status}, ${text.length} chars]`);
  reasons.forEach((r) => console.log(`        - ${r}`));
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} pages healthy.`);
if (failed.length) {
  console.error(`\n${failed.length} page(s) FAILED. The site has a broken/blank page in production.`);
  process.exit(1);
}
