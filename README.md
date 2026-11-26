# best-national-statistics-site-20261126-0539

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/lwyWei/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/lwyWei/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Aldermere Statistics — the official statistics site of the fictional country of Aldermere: population, economy, prices, trade, health, education and regions, with charts, sortable tables, a release calendar and working controls, all in plain static files with no network request.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — or open `app/index.html` directly in a desktop or phone browser. No build step, no install.

## What is inside

- `app/index.html` — page shell: header, search, navigation, footer.
- `app/style.css` — the whole design system, including the phone layout.
- `app/data.js` — every dataset: population, GDP, CPI, trade, health, education, regions, releases.
- `app/charts.js` — canvas line and bar chart renderers (no library).
- `app/views.js` — hash router and the ten page renderers.
- `app/main.js` — boot, indicator search and CSV download.
- `main.ts` — the entry program: copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json`.
- `screenshots/` — four renders of the site running in Chromium.

---

<sub>Entered on [make.fun](https://make.fun/?ref=08qhw512&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
