import * as cheerio from "cheerio"
import { getElementsByConfig } from "../htmlattrgetter"
import { ElementConfig } from "../htmlattrgetter.types"

describe("getElementsByConfig", () => {
    let $: cheerio.Root

    beforeEach(() => {
        const html = `
      <section data-id="92test">
        <article data-class="test45">
          <div data-tag="test78test">
            <b class="ref" value="value1"></b>
            <b class="ref" value="value2"></b>
          </div>
        </article>
      </section>
      <section data-id="other">
        <article data-class="test45">
          <div data-tag="test78test">
            <b class="ref" value="value3"></b>
          </div>
        </article>
      </section>
    `
        $ = cheerio.load(html)
    })

    test("should build correct selector for class attribute", () => {
        const config: ElementConfig[] = [
            {
                tag: "b",
                attribute: "class",
                matchStr: "ref",
            },
        ]

        const { elements, selector } = getElementsByConfig($, config)
        expect(elements.length).toBe(3)
        expect(elements.eq(0).attr("value")).toBe("value1")
        expect(elements.eq(1).attr("value")).toBe("value2")
        expect(elements.eq(2).attr("value")).toBe("value3")
        expect(selector).toBe("b.ref")
    })

    test("should build correct selector for attribute with startsWith", () => {
        const config: ElementConfig[] = [
            {
                tag: "section",
                attribute: "data-id",
                containEq: "startsWith",
                matchStr: "92",
            },
        ]

        const { elements, selector } = getElementsByConfig($, config)
        expect(elements.length).toBe(1)
        expect(selector).toBe('section[data-id^="92"]')
    })

    test("should build correct selector for attribute with endsWith", () => {
        const config: ElementConfig[] = [
            {
                tag: "article",
                attribute: "data-class",
                containEq: "endsWith",
                matchStr: "45",
            },
        ]

        const { elements, selector } = getElementsByConfig($, config)
        expect(elements.length).toBe(2)
        expect(selector).toBe('article[data-class$="45"]')
    })

    test("should build correct selector for attribute with contains", () => {
        const config: ElementConfig[] = [
            {
                tag: "div",
                attribute: "data-tag",
                containEq: "contains",
                matchStr: "78",
            },
        ]

        const { elements, selector } = getElementsByConfig($, config)
        expect(elements.length).toBe(2)
        expect(selector).toBe('div[data-tag*="78"]')
    })

    test("should build correct nested selector", () => {
        const config: ElementConfig[] = [
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

        const { elements, selector } = getElementsByConfig($, config)
        expect(elements.length).toBe(2)
        expect(elements.eq(0).attr("value")).toBe("value1")
        expect(elements.eq(1).attr("value")).toBe("value2")
        expect(selector).toBe(
            'section[data-id^="92"] > article[data-class$="45"] > div[data-tag*="78"] > b.ref'
        )
    })

    test("should handle empty config array", () => {
        const config: ElementConfig[] = []
        const { elements, selector } = getElementsByConfig($, config)
        expect(elements.length).toBe(0)
        expect(selector).toBe("")
    })

    test("should handle config without attribute selectors", () => {
        const config: ElementConfig[] = [
            {
                tag: "section",
            },
            {
                tag: "article",
            },
        ]

        const { elements, selector } = getElementsByConfig($, config)
        expect(elements.length).toBe(2)
        expect(selector).toBe("section > article")
    })
})
