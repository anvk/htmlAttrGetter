import type { ContainEq } from "./htmlattrgetter.types"

export const ATTRIBUTE_SELECTORS: Record<ContainEq, string> = {
    startsWith: "^=",
    endsWith: "$=",
    contains: "*=",
    equals: "=",
}
