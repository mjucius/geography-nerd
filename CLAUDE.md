# Geography Nerd

Test command: `npm test`

Team state lives in `.juicebots/` and `docs/product/`.

Releasing: start the `Release` workflow (`.github/workflows/release.yml`) on `main` with inputs `version` (e.g. `v1.2.3`) and an optional `summary`. Sessions cannot push tags, so do not tag locally. Roll back by starting `Deploy` with an older tag as `ref`.
