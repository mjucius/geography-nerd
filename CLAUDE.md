# Geography Nerd

Test command: `npm test`

Team state lives in `.juicebots/` and `docs/product/`.

Releasing: open a PR that bumps `version` in the root `package.json` (`npm version X.Y.Z --no-git-tag-version`) and rewrites `.github/release-summary.md`; merging it runs `.github/workflows/release.yml`, which tags, releases and deploys. Sessions cannot push tags or start workflows, so do not tag locally or dispatch. Roll back by having the user run `Deploy` by hand with an older tag as `ref`.
