# Contributing

## Development

```bash
npm install
npm run dev:web
```

Run checks before opening a pull request:

```bash
npm run lint -w web
npm run build:web
```

## Data Changes

City data is derived from GeoNames and must keep attribution intact. If you update `supabase/cities-import.sql`, regenerate the local dataset:

```bash
npm run generate:local-cities
```

Keep gameplay changes free of account, analytics, advertising, and answer-tracking behavior unless the project explicitly reconsiders that policy.
