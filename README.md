# Geography Nerd

<p align="center">
  <img src="assets/GeographyNerd-Logo_200.png" alt="Geography Nerd logo" width="160" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  <a href="https://github.com/mjucius/geography-nerd/actions/workflows/ci.yml"><img src="https://github.com/mjucius/geography-nerd/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg" alt="Node 20+" />
  <a href="https://github.com/mjucius/geography-nerd/issues"><img src="https://img.shields.io/github/issues/mjucius/geography-nerd.svg" alt="Issues" /></a>
</p>

**Geography Nerd** is a browser game that tests directional geography: given two cities, decide whether one is north, south, east, or west of the other.

**[Play the live demo →](https://geographynerd.jucius.com)**

The app is intentionally simple:

- No accounts
- No app-level analytics
- No quiz/session/answer tracking
- No ads
- City data is bundled locally and ships with the build

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Leaflet + CARTO raster tiles
- Vitest for unit tests

## Quick Start

Requirements:

- Node.js 20+
- npm

```bash
npm install
npm run dev:web
```

The app runs at `http://localhost:5173` and requires no environment variables.

## Scripts

```bash
npm run dev:web                # start the Vite dev server
npm run build:web              # type-check + production build
npm run lint                   # lint the frontend
npm run test                   # run Vitest unit tests
npm run generate:local-cities  # rebuild web/src/data/localCities.ts
npm run import-cities          # refresh data/cities-import.sql from GeoNames
```

## City Data

The bundled city list lives in `web/src/data/localCities.ts`. It is generated from `data/cities-import.sql` (top ~1000 cities from GeoNames with regional weighting) and the country lookup in `data/countries.sql`. See `CONTRIBUTING.md` for how to refresh it.

## Privacy

The application does not create user accounts, persist quiz state, store answers, or include app-level tracking/ads. See `PRIVACY.md` for external service notes.

## Attribution

City data is derived from GeoNames. Maps use OpenStreetMap-derived tiles through CARTO. The logo was generated with Google's Nano Banana AI. See `ATTRIBUTION.md` for the full list of sources.

## License

Code is licensed under [MIT](LICENSE). Data and map sources retain their own licenses and attribution requirements.

## Contributing

See `CONTRIBUTING.md` for development setup and `CODE_OF_CONDUCT.md` for community expectations. Security issues should be reported via the process in `SECURITY.md`.
