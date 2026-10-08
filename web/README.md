# Geography Nerd Web App

React/Vite frontend for Geography Nerd.

```bash
npm run dev -w web
npm run build -w web
npm run lint -w web
npm run test -w web
```

The app loads cities from `web/src/data/cities.json` through `web/src/data/localCities.ts`. The JSON is generated from the files under `../data/` by `npm run generate:local-cities`, and it is committed, so builds do not regenerate it. See the root `README.md` for the full setup.
