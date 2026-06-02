import test from "node:test"
import assert from "node:assert/strict"
import {features, feature} from "caniuse-lite"
import {contains, parseCaniuseData, cleanBrowsersList} from "../src/utils.ts"

test("contains should work", () => {
  assert.equal(contains("abc", "a"), true, "abc contains a")
  assert.equal(contains("abc", "d"), false, "abc does not contain d")
  assert.equal(contains("abc", ""), true, "contains empty string is true")
})

test("parseCaniuseData should work", () => {
  const browsers = cleanBrowsersList()
  const borderRadius = feature(features["border-radius"])
  const parsed = parseCaniuseData(borderRadius, browsers)

  assert.ok(parsed.safari.y, "border-radius support is ok on some safari")
  assert.ok(parsed.firefox.y, "border-radius support is ok on some firefox")
  assert.ok(parsed.chrome.y, "border-radius support is ok on some chrome")
  assert.deepEqual(parseCaniuseData(borderRadius, []), {}, "passing an empty browser list returns an empty object")
})

test("cleanBrowsersList should work", () => {
  const dirtyList = ["firefox 4", "firefox 3.6", "opera 12.1", "ie 8", "ie 9", "chrome 37"]
  const cleanList = ["firefox", "opera", "ie", "chrome"]

  assert.deepEqual(cleanBrowsersList(dirtyList).sort(), cleanList.sort(), "remove version numbers and deduplicate the list")
  assert.deepEqual(cleanBrowsersList([]), [], "giving empty array returns empty array")
})
