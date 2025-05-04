# htmlAttrGetter

Small tool to retreive attributes in deeply nested HTML

## How to use

The following config

```js
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
```

will retreive all elements of type

```html
<section data-id="92*">
    <article data-class="*45">
        <div data-tag="*78*">
            <b class="ref" value="SOME_VALUE"></b>
        </div>
    </article>
</section>
```
