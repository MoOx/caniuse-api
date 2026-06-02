import memoize from "lodash.memoize"
import browserslist from "browserslist"
import {features, feature as featureUnpack} from "caniuse-lite"

import {contains, parseCaniuseData, cleanBrowsersList} from "./utils"

const featuresList = Object.keys(features)

let browsers
function setBrowserScope(browserList) {
  browsers = cleanBrowsersList(browserList)
}

function getBrowserScope() {
  return browsers
}

const parse = memoize(parseCaniuseData, function(feat, browsers) {
  return feat.title + browsers
})

function getSupport(query) {
  let feature
  try {
    feature = featureUnpack(features[query])
  } catch(e) {
    let res = find(query)
    if (res.length === 1) return getSupport(res[0])
    throw new ReferenceError(`Please provide a proper feature name. Cannot find ${query}`)
  }
  return parse(feature, browsers)
}

function isSupported(feature, browsers) {
  let data
  try {
    data = featureUnpack(features[feature])
  } catch(e) {
    let res = find(feature)
    if (res.length === 1) {
      data = features[res[0]]
    } else {
      throw new ReferenceError(`Please provide a proper feature name. Cannot find ${feature}`)
    }
  }

  const browserList = browserslist(browsers, {ignoreUnknownVersions: true})

  // No resolvable browser (e.g. an unknown version like `safari 12.0.2`) means
  // we cannot confirm support, so we report it as unsupported rather than
  // returning a vacuously-true `[].every(…)`. We deliberately do not throw here,
  // matching the "do not throw on non existing data" behaviour expected elsewhere.
  if (browserList.length === 0) {
    return false
  }

  return browserList
    .map((browser) => browser.split(" "))
    .every((browser) => {
      const stat = data.stats[browser[0]] && data.stats[browser[0]][browser[1]]
      // caniuse marks full support as `y`, possibly followed by a note (`y #2`)
      // or a flag (`y x`), so we only check the leading support indicator.
      return Boolean(stat) && stat[0] === "y"
    })
}

function find(query) {
  if (typeof query !== "string") {
    throw new TypeError("The `query` parameter should be a string.")
  }

  if (~featuresList.indexOf(query)) { // exact match
    return query
  }

  return featuresList.filter((file) => contains(file, query))
}

function getLatestStableBrowsers() {
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
  getBrowserScope
}
