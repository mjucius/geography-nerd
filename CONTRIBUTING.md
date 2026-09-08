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
npm run generate:local-cities
```

`import-cities` downloads `cities1000.zip` from GeoNames and writes `data/cities-import.sql`. `generate:local-cities` rebuilds the bundled `web/src/data/localCities.ts` that ships with the app.

Keep gameplay changes free of account, analytics, advertising, and answer-tracking behavior unless the project explicitly reconsiders that policy.
