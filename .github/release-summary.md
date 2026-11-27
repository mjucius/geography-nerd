## Releases

- Releases are now cut by merging a pull request that raises the version in `package.json`. The `Release` workflow checks `main`, creates the tag and GitHub release, then deploys, with no local checkout. `Deploy` can also be run by hand with an older tag to roll back (#54). This is the first release made that way.

## Dependencies

- Dev toolchain updates: @testing-library/jest-dom 8.0.0, eslint 10.15.0, typescript-eslint 8.73.0, vitest 5.1.1, postcss 8.5.33, @testing-library/user-event 14.6.13, eslint-plugin-react-refresh 0.5.8 (#52, #53).

The production bundle is unchanged. No gameplay or UI changes.
