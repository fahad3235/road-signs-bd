// Headless-Chrome smoke test for Road Signs BD (Playwright headless_shell).
const { chromium } = require("/home/hatch/workspace/.pw-smoke/node_modules/playwright-core");
const path = require("path");
const assert = require("assert");

(async () => {
  const errors = [];
  const browser = await chromium.launch({
    executablePath: "/home/hatch/.cache/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell",
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
  const file = "file://" + path.resolve(__dirname, "..", "index.html");
  await page.goto(file, { waitUntil: "load" });

  let n = 0;
  const check = async (name, fn) => { await fn(); n++; console.log("ok " + n + " - " + name); };

  await check("title + 28 cards render", async () => {
    assert.ok((await page.title()).includes("Road Signs BD"));
    assert.strictEqual(await page.locator(".card").count(), 28);
  });
  await check("sign of the day renders a sign + name", async () => {
    assert.ok((await page.locator("#sodSign svg").count()) >= 1);
    assert.ok((await page.locator("#sodName").textContent()).length > 2);
  });
  await check("warning chip narrows to 8 cards", async () => {
    await page.click("#chip-warning");
    assert.strictEqual(await page.locator(".card").count(), 8);
    await page.click("#chip-all");
    assert.strictEqual(await page.locator(".card").count(), 28);
  });
  await check("search 'school' narrows, clear restores", async () => {
    await page.fill("#search", "school");
    const c = await page.locator(".card").count();
    assert.ok(c >= 1 && c < 28, "count=" + c);
    await page.fill("#search", "");
    assert.strictEqual(await page.locator(".card").count(), 28);
  });
  await check("BN toggle renders Bengali title text", async () => {
    await page.click("#langBtn");
    const t = await page.locator("#tagline").textContent();
    assert.ok(t.includes("বাংলাদেশ"), t);
    await page.click("#langBtn");
    assert.ok((await page.locator("#tagline").textContent()).includes("Bangladesh"));
  });
  await check("quiz: start, answer Q1, result after 10", async () => {
    await page.click("#tabQuiz");
    await page.click("#startBtn");
    assert.ok((await page.locator(".qsign svg").count()) >= 1);
    assert.strictEqual(await page.locator(".opt").count(), 4);
    for (let i = 0; i < 10; i++) {
      await page.locator(".opt").first().click();
      await page.click("#qnext");
    }
    const score = await page.locator(".score").textContent();
    assert.ok(/^[০-৯0-9]+ \/ 10/.test(score.trim()), score);
    assert.strictEqual(await page.locator(".rev").count(), 10);
  });
  await check("390px mobile: no horizontal overflow, grid still renders", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click("#tabLearn");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(overflow <= 1, "overflow=" + overflow);
    assert.strictEqual(await page.locator(".card").count(), 28);
  });
  await check("zero console/page errors", async () => {
    assert.deepStrictEqual(errors, []);
  });
  await browser.close();
  console.log("ALL " + n + " SMOKE CHECKS PASSED");
})().catch(e => { console.error("SMOKE FAILED:", e); process.exit(1); });
