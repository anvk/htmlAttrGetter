import * as cheerio from "cheerio"
import type {
    ElementConfig,
    FetchAndParseOptions,
} from "./htmlattrgetter.types"
import { fetchHTML } from "./htmlattrgetter.utils"
import { ATTRIBUTE_SELECTORS } from "./htmlattrgetter.constants"

/**
 * Fetches HTML content from a URL and parses it according to the provided configuration.
 * This advanced function allows for dynamic element selection based on multiple criteria.
 *
 * @param options - Configuration options for fetching and parsing
 * @param options.url - The URL to fetch HTML from
 * @param options.config - Array of element configurations for building the selector
 * @param options.valueAttr - The attribute to extract values from
 * @param options.joinStr - The string to join extracted values with (defaults to empty string if not provided)
 * @returns Promise resolving to the concatenated values from matched elements
 */
export async function fetchAndParseHTML(options: FetchAndParseOptions) {
    try {
        const { url, config, valueAttr, joinStr } = options

        // Fetch the HTML content
        const html = await fetchHTML(url)

        // Load the HTML into cheerio
        const $ = cheerio.load(html)

        // Get elements using the configuration
        const { elements: refElements } = getElementsByConfig($, config)

        // Process the elements to extract and concatenate values
        const concatenatedValues = refElements
            .map((_, el) => $(el).attr(valueAttr) ?? "")
            .get()
            .filter(Boolean)
            .join(joinStr ?? "")

        console.log(concatenatedValues)
        return concatenatedValues
    } catch (error) {
        console.error("Error parsing HTML:", error)
        throw error
    }
}

export function getElementsByConfig(
    $: cheerio.Root,
    config: ElementConfig[]
): { elements: cheerio.Cheerio; selector: string } {
    let selector = ""

    // Build selector from config
    for (const [index, item] of config.entries()) {
        if (index > 0) {
            selector += " > "
        }

        if (item.attribute === "class" && item.matchStr) {
            selector += `${item.tag}.${item.matchStr}`
            continue
        }

        // Build attribute selector if all required properties exist
        let attributeSelector = ""
        if (item.attribute && item.containEq && item.matchStr) {
            attributeSelector = `[${item.attribute}${
                ATTRIBUTE_SELECTORS[item.containEq]
            }"${item.matchStr}"]`
        }

        selector += `${item.tag}${attributeSelector}`
    }

    // Get elements based on the selector
    let elements = $(selector)

    return { elements, selector }
}
