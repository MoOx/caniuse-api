import test from "node:test"
import assert from "node:assert/strict"
import browserslist from "browserslist"
import * as caniuse from "../src/index.ts"
import {cleanBrowsersList} from "../src/utils.ts"

test("browserscope tests", () => {
  const defaultBrowserslist = cleanBrowsersList()
  assert.deepEqual(caniuse.getBrowserScope().sort(), defaultBrowserslist.sort(), "default browser scope is browserslist's one")
  caniuse.setBrowserScope(browserslist("Firefox 4, Opera 12.1"))
  assert.deepEqual(caniuse.getBrowserScope().sort(), ["firefox", "opera"].sort(), "browser scope update does really update")
})

test("features test", () => {
  assert.ok(Array.isArray(caniuse.features), "a feature list is exported")
  assert.ok(caniuse.features.length > 0, "the feature list is not empty")
})

test("find tests", () => {
  assert.deepEqual(caniuse.find("radius"), ["border-radius"], "`find` should find border-radius")
  assert.deepEqual(caniuse.find("canaillou"), [], "non-existent property should return an empty array")
  assert.ok((caniuse.find("border") as string[]).length, "generic property name should return several results")
  assert.throws(() => caniuse.find(null as unknown as string), "not a string should throw an exception")
})

test("getLatestStableBrowsers tests", () => {
  assert.ok(caniuse.getLatestStableBrowsers().length, "it should return an array of results")
  assert.ok(caniuse.getLatestStableBrowsers().every((browser) => /[A-z_]+ ([0-9.\-]+|all)/.test(browser)), "every entry is correctly formed")
})

test("isSupported tests", () => {
  assert.ok(caniuse.isSupported("intersectionobserver", "chrome 69"), "intersectionobserver is supported on chrome 69 (despite a caniuse note)")
  assert.ok(!caniuse.isSupported("intersectionobserver", "chrome 50"), "intersectionobserver is not supported on chrome 50")
  assert.ok(!caniuse.isSupported("intersectionobserver", "safari 12.0.2"), "unknown browser version is reported as unsupported, not a false positive")
  assert.ok(caniuse.isSupported("border-radius", "ie 9"), "border-radius is supported on ie 9")
  assert.ok(!caniuse.isSupported("border-radius", "ie 8"), "border-radius is not supported on ie 8")
  assert.ok(caniuse.isSupported("border-radius", "chrome 45, ie 11"), "works when you pass multiple browsers")
  assert.throws(() => caniuse.isSupported("canaillou", "chrome 37"), "throws if silly thing are asked")
  assert.throws(() => caniuse.isSupported("border-radius", "not a real browser"), "throws if you do not pass a real browser")
})

// If for some reason the caniuse-db is not the same in browserslist and in caniuse-api,
// browserslist could return browsers that caniuse-api doesn't know about and crash.
test("isSupported test with browsers caniuse doesn't know", () => {
  const bl = browserslist as unknown as {
    data: Record<string, unknown>
    versionAliases: Record<string, unknown>
  }
  bl.data.notabrowser = {name: "notabrowser", versions: ["1"], released: ["1"]}
  bl.versionAliases.notabrowser = {}

  assert.ok(!caniuse.isSupported("border-radius", "notabrowser 1"), "do not throw on non existing data")

  delete bl.data.notabrowser
  delete bl.versionAliases.notabrowser
})

test("getSupport tests", () => {
  caniuse.setBrowserScope()

  const support = caniuse.getSupport("border-radius")
  assert.ok(support.safari.y, "border-radius support is ok on some safari")
  assert.throws(() => caniuse.getSupport("canaillou"), "throws if silly thing are asked")
})
