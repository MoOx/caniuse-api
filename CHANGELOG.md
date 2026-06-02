# 4.0.0 - 2026-06-02

Two correctness fixes for `isSupported()`. Both change the boolean returned in
some cases, hence the major bump.

**The public API itself is unchanged.**

- Fixed: features flagged with a caniuse note are no longer reported as
  unsupported. caniuse stores full support as `y`, sometimes followed by a note
  (`y #2`) or a flag (`y x`); we now only check the leading support indicator
  instead of matching the whole value.
  ([#82](https://github.com/MoOx/caniuse-api/issues/82)
  via [#90](https://github.com/MoOx/caniuse-api/pull/90)
  by [@underbyte](https://github.com/underbyte))
  - e.g. `isSupported("es6", "chrome 74")` now returns `true` (was `false`).
- Fixed: an unknown browser version is now reported as unsupported instead of
  supported. A query resolving to no known browser (e.g. `safari 12.0.2`)
  previously returned `true` because of a vacuously-true `[].every(…)`; it now
  returns `false`. ([#83](https://github.com/MoOx/caniuse-api/issues/83)
  via [#90](https://github.com/MoOx/caniuse-api/pull/90)
  by [@underbyte](https://github.com/underbyte))
  - e.g. `isSupported("intersectionobserver", "safari 12.0.2")` now returns
    `false` (was `true`).
  - `isSupported` still throws on a malformed query (`"not a real browser"`)
    and on an unknown feature name, as before.
- Added: built-in TypeScript type declarations. The package is now written in
  TypeScript and ships its own `.d.ts`, so `@types/caniuse-api` is no longer
  needed.
  By [@MoOx](https://github.com/MoOx). 
- Changed: internal rewrite, no runtime behaviour change. The previous build
  step was replaced by `tsc` (sources run natively under modern Node and are
  compiled to CommonJS for publishing), and the `lodash.memoize` / `lodash.uniq`
  dependencies were inlined — two fewer runtime dependencies.
  By [@MoOx](https://github.com/MoOx).

> Note for tooling authors (e.g. cssnano / postcss-merge-rules): more features
> are now considered supported than before, which can change generated output.
> The new behaviour matches caniuse.com (dark green = supported).

# 3.0.0 - 2018-07-10

- Upgraded: browserslist

# 2.1.0 - 2018-06-06 (never released to npm)

- Upgraded: browserslist, caniuse-lite

# 2.0.0 - 2017-05-03

- Changed: we now use caniuse-lite instead if caniuse-db
  ([#59](https://github.com/MoOx/caniuse-api/pull/59))

# 1.6.1 - 2017-04-07

- Added: export the feature list
  ([#48](https://github.com/MoOx/caniuse-api/pull/48))

# 1.5.3 - 2017-02-01

- Removed unused dependency
  ([#54](https://github.com/MoOx/caniuse-api/pull/54) - @wtgtybhertgeghgtwtg)

# 1.5.2 - 2016-09-05

- Fixed: no more generation `postinstall` hook ``\o/``.
  ([#47](https://github.com/MoOx/caniuse-api/pull/47) - @alexisvincent)

# 1.5.1 - 2016-08-06

- Fixed: Do not fail when browserslist gives a browser that caniuse-api doesn't
  know about
  ([#45](https://github.com/MoOx/caniuse-api/pull/45) - @onigoetz)

# 1.5.0 - 2016-06-01

- Added: JSPM support with explicit file extensions ([#40](https://github.com/MoOx/caniuse-api/issues/40))
- Upgraded: dependecies (lodash.memoize, lodash.uniq, shelljs, babel-tape-runner, tape, tap-spec)
- Upgraded: ask travis to only test node stable
- Upgraded: some tests fixed, some tests added

# 1.4.1 - 2015-10-18

- Fixed: `generator.js` was missing

# 1.4.0 - 2015-10-18

- Upgraded: browserslist 1.x
- Upgraded: shelljs 0.5.x
- Added: output to notify if generation has been made or not
(related to [#25](https://github.com/MoOx/caniuse-api/issues/25))

# 1.3.2 - 2015-06-23

- Fixed: lodash.uniq dep
([#31](https://github.com/MoOx/caniuse-api/issues/31))

# 1.3.1 - 2015-03-31

- Fixed: Windows support

# 1.3.0 - 2015-03-30

- Added: better exception messages
- Added: full browserify compatibility (by avoiding dynamic require)

# 1.2.2 - 2015-02-06

- Fixed: postinstall hook for Windows

# 1.2.1 - 2015-02-04

- Changed: Allow in browser usage by avoiding `require.resolve` and using a generated json instead or reading a directory ([#20](https://github.com/MoOx/caniuse-api/pull/20)]

# 1.2.0 [YANKED]

# 1.1.0 - 2015-02-03

- Fixed: usage of caniuse-db outside the package itself
- Changed: upgrade to browserslist 0.2.x

# 1.0.0 - 2014-12-16

- Added: package is now automatically tested by [Travis-CI](https://travis-ci.org/MoOx/caniuse-api)

# 0.1.0 - 2014-12-15

- Changed: complete API changes, released as `caniuse-api` package

# 0.0.1 - 2014-12-09

✨Initial release
