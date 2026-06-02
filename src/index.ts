import browserslist from "browserslist"
import {features, feature as featureUnpack} from "caniuse-lite"

import {contains, parseCaniuseData, cleanBrowsersList} from "./utils.ts"
import type {BrowserSupport, FeatureData} from "./utils.ts"

const featuresList: string[] = Object.keys(features)

let browsers: string[]
function setBrowserScope(browserList?: string | readonly string[]): void {
  browsers = cleanBrowsersList(browserList)
}

function getBrowserScope(): string[] {
  return browsers
}

function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  resolver: (...args: Args) => string,
): (...args: Args) => Result {
  const cache = new Map<string, Result>()
  return (...args: Args): Result => {
    const key = resolver(...args)
    if (!cache.has(key)) {
      cache.set(key, fn(...args))
    }
    return cache.get(key) as Result
  }
}

const parse = memoize(
  parseCaniuseData,
  (feature: FeatureData, scope: string[]) => feature.title + scope.join(),
)

function getSupport(query: string): BrowserSupport {
  let feature: FeatureData
  try {
    feature = featureUnpack(features[query])
  } catch {
    const res = find(query)
    if (Array.isArray(res) && res.length === 1) return getSupport(res[0])
    throw new ReferenceError(`Please provide a proper feature name. Cannot find ${query}`)
  }
  return parse(feature, browsers)
}

function isSupported(
  feature: string,
  browsers?: string | readonly string[],
): boolean {
  let data: FeatureData
  try {
    data = featureUnpack(features[feature])
  } catch {
    const res = find(feature)
    if (Array.isArray(res) && res.length === 1) {
      data = featureUnpack(features[res[0]])
    } else {
      throw new ReferenceError(`Please provide a proper feature name. Cannot find ${feature}`)
    }
  }

  const browserList = browserslist(browsers, {ignoreUnknownVersions: true})

  // No resolvable browser (e.g. an unknown version like `safari 12.0.2`) means we
  // cannot confirm support, so we report it as unsupported rather than returning a
  // vacuously-true `[].every(…)`. We deliberately do not throw here, matching the
  // "do not throw on non existing data" behaviour expected elsewhere.
  if (browserList.length === 0) {
    return false
  }

  return browserList
    .map((browser) => browser.split(" "))
    .every((browser) => {
      const stat = data.stats[browser[0]] && data.stats[browser[0]][browser[1]]
      // caniuse marks full support as `y`, optionally followed by a note (`y #2`)
      // or a flag (`y x`), so we only check the leading support indicator.
      return Boolean(stat) && stat[0] === "y"
    })
}

function find(query: string): string | string[] {
  if (typeof query !== "string") {
    throw new TypeError("The `query` parameter should be a string.")
  }

  if (featuresList.indexOf(query) !== -1) { // exact match
    return query
  }

  return featuresList.filter((file) => contains(file, query))
}

function getLatestStableBrowsers(): string[] {
  return browserslist("last 1 version")
}

setBrowserScope()

export {
  featuresList as features,
  getSupport,
  isSupported,
  find,
  getLatestStableBrowsers,
  setBrowserScope,
  getBrowserScope,
}
