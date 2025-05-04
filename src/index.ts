import * as cheerio from "cheerio"
import { fetchHTML } from "./htmlattrgetter.utils"
import type { ElementConfig } from "./htmlattrgetter.types"
import { fetchAndParseHTML } from "./htmlattrgetter"

const SOURCE_HTML_URL =
    "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge" // URL with the source code we are going to parse
const VALUE_ATTR = "value" // attribute name that will contain values we need to concat

const ELEMENT_CONFIG: ElementConfig[] = [
    {
        tag: "section",
        attribute: "data-id",
        containEq: "startsWith",
        matchStr: "92",
    },
    {
        tag: "article",
        attribute: "data-class",
        containEq: "endsWith",
        matchStr: "45",
    },
    {
        tag: "div",
        attribute: "data-tag",
        containEq: "contains",
        matchStr: "78",
    },
    {
        tag: "b",
        attribute: "class",
        matchStr: "ref",
    },
]

// My super simple implementation. The smallest, quickest one with hardcoded selectors
async function fetchAndParseHTMLSimple(url: string) {
    try {
        const html = await fetchHTML(url)
        const $ = cheerio.load(html)

        const refElements = $(
            'section[data-id^="92"] > article[data-class$="45"] > div[data-tag*="78"] > b.ref'
        )

        const concatenatedValues = refElements
            .map((_, el) => $(el).attr(VALUE_ATTR) || "")
            .get()
            .filter(Boolean)
            .join("")

        console.log(concatenatedValues)
    } catch (error) {
        console.error("Error parsing HTML:", error)
        throw error
    }
}

// basic call
// fetchAndParseHTMLSimple(SOURCE_HTML_URL)
//     .then(() => console.log("HTML parsing completed"))
//     .catch((error) => console.error("Failed to parse HTML:", error))

// advanced call
fetchAndParseHTML({
    url: SOURCE_HTML_URL,
    config: ELEMENT_CONFIG,
    valueAttr: VALUE_ATTR,
})
    .then(() => console.log("HTML parsing completed"))
    .catch((error) => console.error("Failed to parse HTML:", error))
