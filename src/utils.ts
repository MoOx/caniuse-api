import browserslist from "browserslist"

// Structural subset of caniuse-lite's `Feature` we rely on. Kept local (rather
// than imported from caniuse-lite) so the emitted `utils.d.ts` stays free of any
// external type reference. `readonly` mirrors caniuse-lite's own shape.
export interface FeatureData {
  title: string
  stats: Readonly<Record<string, Readonly<Record<string, string>>>>
}

export type BrowserSupport = Record<string, Record<string, number>>

export function contains(str: string, substr: string): boolean {
  return str.indexOf(substr) !== -1
}

export function parseCaniuseData(
  feature: FeatureData,
  browsers: string[],
): BrowserSupport {
  const support: BrowserSupport = {}

  browsers.forEach((browser) => {
    support[browser] = {}
    const stats = feature.stats[browser]
    for (const version in stats) {
      const letters = stats[version].replace(/#\d+/, "").trim().split(" ")
      const info = parseFloat(version.split("-")[0]) // if it's a range, take the left bound
      if (isNaN(info)) continue
      for (const letter of letters) {
        if (letter === "d") continue // skip: we don't support this letter yet
        const current = support[browser][letter]
        // `y` => keep the minimum supported version; anything else => keep the maximum
        const better = letter === "y" ? info < current : info > current
        if (current === undefined || better) {
          support[browser][letter] = info
        }
      }
    }
  })

  return support
}

export function cleanBrowsersList(
  browserList?: string | readonly string[],
): string[] {
  return [
    ...new Set(browserslist(browserList).map((browser) => browser.split(" ")[0])),
  ]
}
