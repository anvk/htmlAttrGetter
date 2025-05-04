export type ContainEq = "startsWith" | "endsWith" | "contains" | "equals"

export type ElementConfig = {
    tag: string
    attribute?: string
    containEq?: ContainEq
    matchStr?: string
}

export type FetchAndParseOptions = {
    url: string
    config: ElementConfig[]
    valueAttr: string
    joinStr?: string
}
