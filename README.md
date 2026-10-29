# 🚦 Road Signs BD

Learn Bangladesh road signs — then test yourself. An offline, bilingual (English / বাংলা)
web app with a 28-sign library and a 10-question quiz.

## Features

1. **Sign library** — 28 signs across 4 categories: Warning (8), Prohibitory (8),
   Mandatory (6), Informative (6), each drawn as a proper road-sign SVG
   (red-bordered triangle / circle, blue mandatory circle, green information plate).
2. **Search + category filters** — search across English and Bangla names and meanings.
3. **Sign of the day** — a date-seeded sign, the same for every visitor on a given day.
4. **10-question quiz** — one sign, four meaning options, instant feedback, full
   answer review, and a persisted best score (localStorage only).
5. **Bilingual UI** — English / বাংলা toggle, persisted, with Bengali digits.
6. **Fully offline** — zero network requests; no accounts, no tracking.

## Stack

Vanilla HTML + CSS + JavaScript. No build step, no dependencies at runtime.
Node.js is used only to run the tests.

## Run locally

```bash
# just open it
open index.html
# or serve it
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Testing

```bash
node tests/test.js    # 8 unit-test groups: bank integrity, filters, quiz logic, digits
node tests/smoke.js   # 8 headless-Chrome checks: render, filters, search, i18n, quiz flow, mobile
```

Test results (2026-10-29): 8/8 unit groups + 8/8 smoke checks pass, 0 console/page errors.

## Project structure

```
index.html        entry page (Learn + Quiz tabs)
css/style.css     responsive styles (desktop + 390px mobile)
js/signs.js       the 28-sign bank + SVG renderer
js/logic.js       pure logic: filters, sign-of-day, quiz builder, scoring, Bengali digits
js/i18n.js        English / বাংলা UI strings
js/app.js         DOM wiring
tests/            node unit tests + Playwright headless-Chrome smoke test
```

## Limitations

- This is a **learning aid**, not an official source. Sign artwork is simplified
  (symbols, not the exact BRTA artwork) and meanings are plain-language summaries.
- Always follow the official Road Transport Act rules and the real signs on the street.
- Quiz questions are drawn from the same 28-sign bank; scores measure familiarity
  with this app, not driving-test readiness.

## Status

MVP complete. Published via GitHub Pages.
