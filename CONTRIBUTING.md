# Contributing

## Development

This project targets Node.js 24 (see `.nvmrc`).

```bash
npm install
npm run dev:web
```

Run checks before opening a pull request:

```bash
npm run lint -w web
npm run build:web
npm run test -w web
```

## Data Changes

City data is derived from GeoNames and must keep attribution intact.

To refresh the city dataset from GeoNames:

```bash
npm run import-cities
npm run fetch:sitelinks
npm run generate:local-cities
```

`import-cities` downloads `cities1000.zip` from GeoNames and writes `data/cities-import.sql`. `fetch:sitelinks` looks up Wikidata sitelink counts for those cities and writes `data/city-sitelinks.json`; run it after `import-cities` and fix any unmatched city in `data/wikidata-overrides.json`. `flag:subcity` reads each shipped city's Wikidata classes and writes `data/subcity-flags.json`, a report for reviewing sub-city entries (the game does not read it). A place stays only when people call it a city or town by that name and it is not a subdivision of another city; it is left out when it is a subdivision of a larger city (even with its own council, such as London boroughs and Istanbul district municipalities) or a council or administrative area whose name is not a city or town (such as City of Port Phillip). If unclear, English Wikipedia's first sentence decides: "a city" or "a town" stays, borough, district, ward, suburb or local government area goes. Every flagged or review city in that report must be listed either in `data/excluded-cities.json` (left out of the game, with a reason) or in `data/kept-after-review.json` (kept, with a reason); a test checks this. `generate:local-cities` rebuilds the bundled `web/src/data/cities.json` that ships with the app, leaving out the places listed in `data/excluded-cities.json` (`{ "Name|CC": "duplicate of X" }` or `"part of X"`).

Keep gameplay changes free of account, analytics, advertising, and answer-tracking behavior unless the project explicitly reconsiders that policy.
